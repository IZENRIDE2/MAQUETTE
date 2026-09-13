/* ============================================================
   IzenRide — Hero : carte GPS en perspective
   Vue de navigation inclinée, comme dans l'app : réseau de rues,
   itinéraire tracé, motards qui circulent, signalements.
   Canvas 2D, aucune dépendance.

   ── Projection ──
   Plan au sol vu par une caméra à hauteur H, regardant vers +Y.
   Un point du sol (wx, wy) — wx latéral, wy distance devant — se
   projette en :

       s  = F / wy                  (facteur d'échelle)
       sx = cx + wx * s
       sy = horizon + H * s

   Quand wy tend vers l'infini, s tend vers 0 et le point rejoint le
   point de fuite (cx, horizon). C'est la projection au sol classique,
   celle qui donne la sensation d'une carte inclinée.
   ============================================================ */
(function (global) {
  'use strict';

  var C = {
    skyTop:   '#05060b',
    skyLow:   '#101a2e',
    ground:   '#0d111a',
    block:    '#182031',
    blockLit: '#202a3c',
    casing:   '#090c14',
    roadMaj:  '#4c5a74',
    roadMin:  '#39445c',
    route:    '#4d8fff',
    routeHi:  '#7eb0ff',
    rider:    '#7a92b8',
    riderHi:  '#4d8fff',
    me:       '#7eb0ff',
    warn:     '#FAC775',
    err:      '#E24B4A',
    label:    '#8E97AA',
    labelHi:  '#b8c5dd',

    // Points d'intérêt — repris de MAP_COLORS dans
    // apps/mobile/lib/gps/map-style.ts.
    poiFuel:  '#10B981',
    // L'app donne la même teinte aux deux (poiFuel pour `fuel` comme pour
    // `charging`). À la taille des marqueurs de cette carte, ⛽ et ⚡ ne se
    // distinguent plus si la couleur est identique : la recharge passe donc
    // en cyan ici. À aligner dans l'app si l'écart gêne.
    poiCharge: '#22D3EE'
  };

  var POI = {
    fuel:     { icon: '⛽', label: 'Essence',  color: 'poiFuel' },
    charging: { icon: '⚡', label: 'Recharge', color: 'poiCharge' }
  };

  // ── Géométrie du monde ──
  var GX = 300;    // écartement des avenues (parallèles au déplacement)
  var GY = 340;    // écartement des rues transversales
  var NEAR = 62;   // sous cette distance, le point passe hors champ
  var FAR = 3200;
  var W_MAJ = 26;  // largeur monde d'une avenue
  var W_MIN = 14;  // …d'une rue
  var W_ROUTE = 20;
  var LANES = 11;  // avenues dessinées de part et d'autre

  // Plafonds d'épaisseur à l'écran, en pixels CSS.
  var MAX_MAJ = 30;
  var MAX_MIN = 17;
  var MAX_ROUTE = 30;

  var STREETS = ['D 952', 'Rue de Hausquette', 'Av. de Montbrun', 'N 7', 'Chemin des Crêtes'];
  var RIDERS = ['Marc', 'Julie', 'Sofiane', 'Alex', 'Léa', 'Yanis'];

  /** Hachage déterministe : la ville doit être identique à chaque frame. */
  function hash(n) {
    var x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
  }

  function createMap(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var W = 1, H = 1, dpr = 1;
    var cx = 0, horizon = 0, F = 1, CAM_H = 1;

    var camY = 0;        // avancée dans le monde
    var camX = 0;        // dérive latérale
    var speed = 0, targetSpeed = 0;
    var lookX = 0, lookY = 0, tgtLookX = 0, tgtLookY = 0;
    var fade = 1;

    // ── Motards ──
    var riders = [];
    for (var i = 0; i < 14; i++) {
      var lane = (i % (LANES - 2)) - Math.floor((LANES - 2) / 2);
      riders.push({
        lane: lane,
        side: hash(i * 3.7) > 0.5 ? 1 : -1,   // sens de circulation
        // Répartition biaisée vers l'avant : au-delà de ~1200 unités les
        // motards ne font plus qu'un ou deux pixels et n'apportent rien.
        y: NEAR + Math.pow(hash(i * 11.3), 1.9) * (FAR - NEAR),
        v: 90 + hash(i * 5.1) * 140,
        name: RIDERS[i % RIDERS.length],
        named: i < 3
      });
    }

    // ── Signalements ──
    var hazards = [];
    for (var j = 0; j < 4; j++) {
      hazards.push({
        lane: Math.round((hash(j * 17.7) - 0.5) * 6),
        y: 400 + j * 700 + hash(j * 23.1) * 300,
        kind: hash(j * 31.3) > 0.5 ? 'warn' : 'err'
      });
    }

    function resize() {
      dpr = Math.min(global.devicePixelRatio || 1, 1.5);
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      // Caméra : le sol doit remplir les deux tiers bas de l'écran.
      horizon = H * 0.32;
      CAM_H = 120;
      F = ((H - horizon) * NEAR) / CAM_H;
      // Point de fuite décalé à droite : le texte du hero occupe la moitié
      // gauche, la carte se déploie donc là où elle a de la place.
      cx = W > 900 ? W * 0.64 : W * 0.5;
    }

    /** Projette un point du sol. Renvoie null s'il est hors champ. */
    function proj(wx, wy) {
      if (wy < NEAR) return null;
      var s = F / wy;
      return { x: cx + (wx - camX) * s + lookX * 90, y: horizon + CAM_H * s, s: s };
    }

    // ── Ciel et sol ──
    function drawBackdrop() {
      var sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, C.skyTop);
      sky.addColorStop(1, C.skyLow);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, horizon + 1);

      var gr = ctx.createLinearGradient(0, horizon, 0, H);
      gr.addColorStop(0, '#121a2b');
      gr.addColorStop(1, C.ground);
      ctx.fillStyle = gr;
      ctx.fillRect(0, horizon, W, H - horizon);

      // Halo de ville sur la ligne d'horizon
      var glow = ctx.createRadialGradient(cx, horizon, 0, cx, horizon, W * 0.5);
      glow.addColorStop(0, 'rgba(77,143,255,0.20)');
      glow.addColorStop(1, 'rgba(77,143,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, horizon - H * 0.2, W, H * 0.4);
    }

    /** Bornes des rues transversales visibles. */
    function crossRange() {
      return {
        from: Math.floor((camY + NEAR) / GY),
        to: Math.ceil((camY + FAR) / GY)
      };
    }

    // ── Îlots ──
    // Ce sont eux qui font lire « carte » plutôt que « route ».
    function drawBlocks() {
      var r = crossRange();
      var inset = 26;
      for (var k = r.from; k <= r.to; k++) {
        var y0 = k * GY - camY + inset;
        var y1 = (k + 1) * GY - camY - inset;
        if (y1 < NEAR) continue;
        for (var l = -LANES; l < LANES; l++) {
          var x0 = l * GX + inset;
          var x1 = (l + 1) * GX - inset;
          var a = proj(x0, y0), b = proj(x1, y0);
          var c = proj(x1, y1), d = proj(x0, y1);
          if (!a || !b || !c || !d) continue;
          if (a.y < horizon || d.y < horizon) continue;
          if (Math.max(a.x, b.x) < -80 || Math.min(a.x, b.x) > W + 80) continue;

          var lit = hash(k * 7.3 + l * 3.1);
          ctx.fillStyle = lit > 0.72 ? C.blockLit : C.block;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.lineTo(d.x, d.y);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    /**
     * Trace une polyligne projetée, largeur variable avec la distance.
     *
     * `maxPx` borne l'épaisseur au premier plan : sans lui, le facteur
     * d'échelle explose quand `wy` approche NEAR et l'itinéraire devient un
     * coin bleu qui mange le bas de l'écran. Les fonds de carte réels
     * plafonnent de la même façon.
     */
    function strokeWorldPath(pts, worldWidth, color, maxPx) {
      var cap = maxPx || 9999;
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1];
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = Math.max(0.6, Math.min(cap, worldWidth * ((a.s + b.s) / 2)));
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    /** Avenue : échantillonnée en profondeur pour que l'épaisseur suive. */
    function avenuePts(laneX) {
      var pts = [];
      var wy = NEAR;
      var step = 40;
      while (wy < FAR) {
        pts.push(proj(laneX, wy));
        step = Math.max(40, wy * 0.14); // pas plus lâche au loin
        wy += step;
      }
      pts.push(proj(laneX, FAR));
      return pts;
    }

    /**
     * Avenue empruntée par l'itinéraire sur le segment `seg`.
     * Deux blocs tout droit, deux blocs décalés d'une avenue, en
     * alternant le côté. Le pas est toujours de ±1 : l'itinéraire ne peut
     * pas sauter deux avenues d'un coup, ce qui produirait une diagonale
     * traversant les îlots.
     */
    function routeLane(seg) {
      // Période de 6 blocs — trois tout droit, trois décalés. À 4 blocs,
      // un virage revenait toutes les 2,7 s : le trajet n'avait jamais le
      // temps de respirer.
      if (seg % 6 < 3) return 0;
      return Math.floor(seg / 6) % 2 === 0 ? 1 : -1;
    }

    /**
     * Position latérale de l'itinéraire à une ordonnée du monde donnée.
     *
     * L'itinéraire est décrit comme une **fonction continue** de la
     * profondeur plutôt que comme une polyligne à angles droits. Deux
     * raisons : le virage s'arrondit tout seul, et surtout le curseur de
     * position peut se poser exactement dessus — sur une polyligne en
     * angle droit, il n'existe pas de point unique à une ordonnée donnée
     * pendant le virage, et le curseur sautait latéralement.
     */
    function routeXAt(worldY) {
      var k = Math.floor(worldY / GY);
      var laneA = routeLane(k);
      var laneB = routeLane(k + 1);
      if (laneA === laneB) return laneA * GX;
      var band = 240;                       // longueur du virage
      var d = (k + 1) * GY - worldY;        // distance à l'intersection
      if (d > band) return laneA * GX;
      var u = 1 - d / band;
      u = u * u * (3 - 2 * u);              // lissage
      return (laneA + (laneB - laneA) * u) * GX;
    }

    /**
     * Itinéraire tracé. Un trait droit vers le point de fuite ne lit pas
     * comme une route — il lit comme un faisceau.
     *
     * Subdivision adaptative : un pas constant est trop grossier près de
     * la caméra, où 45 unités de monde couvrent plus de 250 px à l'écran,
     * et le tracé s'arrêterait avant le bas du cadre.
     */
    function routePts() {
      var pts = [];
      var wy = NEAR;
      while (wy < FAR) {
        pts.push(proj(routeXAt(camY + wy), wy));
        wy += Math.max(9, wy * 0.1);
      }
      pts.push(proj(routeXAt(camY + FAR), FAR));
      return pts;
    }

    function crossPts(wy) {
      var pts = [];
      for (var wx = -LANES * GX; wx <= LANES * GX; wx += GX / 2) {
        pts.push(proj(wx, wy));
      }
      return pts;
    }

    // ── Réseau : liseré sombre puis remplissage, comme un vrai fond de carte ──
    function drawRoads() {
      var r = crossRange();
      var l, k, pts;

      // liserés
      for (l = -LANES; l <= LANES; l++) {
        if (l === 0) continue;
        pts = avenuePts(l * GX);
        strokeWorldPath(pts, (Math.abs(l) % 3 === 0 ? W_MAJ : W_MIN) + 8, C.casing, MAX_MAJ + 9);
      }
      for (k = r.from; k <= r.to; k++) {
        pts = crossPts(k * GY - camY);
        strokeWorldPath(pts, W_MIN + 7, C.casing, MAX_MIN + 8);
      }

      // chaussées
      for (l = -LANES; l <= LANES; l++) {
        if (l === 0) continue;
        var maj = Math.abs(l) % 3 === 0;
        pts = avenuePts(l * GX);
        strokeWorldPath(pts, maj ? W_MAJ : W_MIN, maj ? C.roadMaj : C.roadMin,
                        maj ? MAX_MAJ : MAX_MIN);
      }
      for (k = r.from; k <= r.to; k++) {
        pts = crossPts(k * GY - camY);
        strokeWorldPath(pts, W_MIN, C.roadMin, MAX_MIN);
      }
    }

    // ── Itinéraire ──
    function drawRoute(t) {
      var pts = routePts();
      strokeWorldPath(pts, W_ROUTE + 10, C.casing, MAX_ROUTE + 10);

      // halo
      ctx.save();
      ctx.globalAlpha = 0.22;
      strokeWorldPath(pts, W_ROUTE + 16, 'rgba(77,143,255,0.30)', MAX_ROUTE + 16);
      ctx.restore();

      strokeWorldPath(pts, W_ROUTE, C.route, MAX_ROUTE);

      // Impulsions qui remontent l'itinéraire : une fenêtre glissante de
      // points, prise le long de la polyligne — elle épouse donc les virages.
      var n = pts.length;
      if (n < 4) return;
      var head = Math.floor(((t * 0.32) % 1) * n);
      ctx.save();
      ctx.globalAlpha = 0.5;
      for (var p = 0; p < 3; p++) {
        var i0 = (head + p * Math.floor(n / 3)) % n;
        var seg = [];
        for (var q = 0; q < 5 && i0 + q < n; q++) seg.push(pts[i0 + q]);
        strokeWorldPath(seg, W_ROUTE - 8, C.routeHi, MAX_ROUTE - 10);
      }
      ctx.restore();
    }

    // ── Noms de rue, posés le long des axes ──
    function drawLabels() {
      for (var l = -3; l <= 3; l++) {
        if (l === 0) continue;
        if (Math.abs(l) % 3 !== 0) continue;
        var wy = 520 + (l + 3) * 130;
        var a = proj(l * GX, wy), b = proj(l * GX, wy + 200);
        if (!a || !b) continue;
        if (a.x < 40 || a.x > W - 40) continue;
        var ang = Math.atan2(b.y - a.y, b.x - a.x);
        var size = Math.max(9, Math.min(15, 26 * a.s));
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(ang + Math.PI / 2);
        ctx.font = '600 ' + size.toFixed(1) + 'px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = C.label;
        ctx.textAlign = 'center';
        ctx.fillText(STREETS[(Math.abs(l) + 1) % STREETS.length], 0, -size * 0.9);
        ctx.restore();
      }
    }

    /**
     * Stations le long du parcours, posées en bord d'avenue.
     * Générées depuis le hachage : la ville reste identique d'une frame à
     * l'autre, et pas de tableau à faire défiler.
     */
    function stationsNear() {
      var out = [];
      var kFrom = Math.floor((camY + NEAR) / GY) - 1;
      var kTo = Math.ceil((camY + FAR * 0.55) / GY);
      for (var k = kFrom; k <= kTo; k++) {
        // Positionnées **par rapport à l'itinéraire**, pas sur une avenue
        // tirée au hasard : la caméra suit la route, donc une voie éloignée
        // sort du cadre dès qu'on s'en approche — les stations
        // n'apparaissaient qu'au loin, hautes de trois pixels.
        var base = routeLane(k);
        var off = Math.round((hash(k * 9.1) - 0.5) * 2);   // −1, 0 ou 1
        var side = hash(k * 3.3) > 0.5 ? 1 : -1;

        if (hash(k * 5.9) > 0.30) {
          out.push({
            x: (base + off) * GX + side * GX * 0.31,
            y: k * GY + 60 + hash(k * 7.7) * 140,
            kind: hash(k * 13.3) > 0.5 ? 'fuel' : 'charging'
          });
        }
        // seconde station dans le même bloc, de l'autre côté
        if (hash(k * 19.7) > 0.55) {
          out.push({
            x: (base - off) * GX - side * GX * 0.31,
            y: k * GY + 205 + hash(k * 11.1) * 95,
            kind: hash(k * 23.9) > 0.5 ? 'charging' : 'fuel'
          });
        }
      }
      return out;
    }

    /** Marqueur de station — même dessin que dans l'app : pastille ronde,
     *  liseré clair, pictogramme au centre. */
    function drawStations() {
      var list = stationsNear();
      for (var i = 0; i < list.length; i++) {
        var st = list[i];
        var wy = st.y - camY;
        if (wy < NEAR || wy > FAR * 0.6) continue;
        var p = proj(st.x, wy);
        if (!p || p.y < horizon + 6) continue;
        if (p.x < -50 || p.x > W + 50) continue;

        var r = Math.max(5, Math.min(19, 22 * p.s));
        if (r < 7) continue;                          // illisible plus loin
        var def = POI[st.kind];
        var col = C[def.color];

        // tige jusqu'au sol, pour ancrer le marqueur
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - r * 1.1);
        ctx.strokeStyle = 'rgba(8,9,14,.6)';
        ctx.lineWidth = Math.max(1, r * 0.18);
        ctx.stroke();

        var cyM = p.y - r * 1.9;
        ctx.beginPath();
        ctx.arc(p.x, cyM, r, 0, 6.2832);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = 'rgba(232,235,242,.92)';
        ctx.lineWidth = Math.max(1, r * 0.13);
        ctx.stroke();

        ctx.font = (r * 1.05).toFixed(1) + 'px ui-sans-serif, "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(def.icon, p.x, cyM + r * 0.04);
        ctx.textBaseline = 'alphabetic';

        if (r > 12) {
          ctx.font = '600 ' + (r * 0.62).toFixed(1) + 'px ui-sans-serif, system-ui, sans-serif';
          ctx.fillStyle = C.labelHi;
          ctx.textAlign = 'center';
          ctx.fillText(def.label, p.x, cyM + r * 2.05);
        }
      }
    }

    // ── Signalements ──
    function drawHazards(t) {
      for (var i = 0; i < hazards.length; i++) {
        var hz = hazards[i];
        var wy = hz.y - (camY % (FAR + 900));
        if (wy < NEAR || wy > FAR * 0.75) continue;
        var p = proj(hz.lane * GX + GX * 0.5, wy);
        if (!p) continue;
        var r = Math.max(5, Math.min(18, 26 * p.s));
        var col = hz.kind === 'warn' ? C.warn : C.err;

        var ph = (t * 0.9 + i * 0.4) % 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + ph * r * 2.4, 0, 6.2832);
        ctx.strokeStyle = col;
        ctx.globalAlpha = (1 - ph) * 0.5;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // épingle
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - r * 0.62, p.y - r * 1.5);
        ctx.arc(p.x, p.y - r * 1.9, r * 0.78, Math.PI * 0.82, Math.PI * 0.18, true);
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = 'rgba(8,9,14,.85)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#08090E';
        ctx.font = '700 ' + Math.max(7, r * 0.95).toFixed(1) + 'px ui-sans-serif, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', p.x, p.y - r * 1.55);
      }
    }

    /** Casque stylisé, lisible dès ~14 px. */
    function helmet(x, y, r, col) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.2832);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.strokeStyle = 'rgba(8,9,14,.9)';
      ctx.lineWidth = Math.max(1, r * 0.16);
      ctx.stroke();
      // visière
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.06, r * 0.62, r * 0.34, 0, Math.PI, 0, true);
      ctx.fillStyle = 'rgba(8,9,14,.82)';
      ctx.fill();
    }

    // ── Motards ──
    function drawRiders(dt, t) {
      for (var i = 0; i < riders.length; i++) {
        var rd = riders[i];
        rd.y += (rd.side > 0 ? rd.v : -rd.v) * dt - speed * dt;
        if (rd.y < NEAR - 40) rd.y = FAR;
        if (rd.y > FAR) rd.y = NEAR;

        var laneX = rd.lane * GX + rd.side * 7;
        var p = proj(laneX, rd.y);
        if (!p || p.y < horizon + 4) continue;
        if (p.x < -60 || p.x > W + 60) continue;

        var r = Math.max(4.5, Math.min(15, 22 * p.s));

        // halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.1, 0, 6.2832);
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.1);
        g.addColorStop(0, 'rgba(77,143,255,0.30)');
        g.addColorStop(1, 'rgba(77,143,255,0)');
        ctx.fillStyle = g;
        ctx.fill();

        helmet(p.x, p.y, r, rd.side > 0 ? C.riderHi : C.rider);

        // cap
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - rd.side * r * 2.0);
        ctx.lineTo(p.x - r * 0.5, p.y - rd.side * r * 1.15);
        ctx.lineTo(p.x + r * 0.5, p.y - rd.side * r * 1.15);
        ctx.closePath();
        ctx.fillStyle = rd.side > 0 ? C.riderHi : C.rider;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (rd.named && r > 8) {
          ctx.font = '600 ' + (r * 0.92).toFixed(1) + 'px ui-sans-serif, system-ui, sans-serif';
          ctx.fillStyle = C.labelHi;
          ctx.textAlign = 'left';
          ctx.fillText(rd.name, p.x + r * 1.5, p.y + r * 0.4);
        }
      }
    }

    /**
     * Curseur de position : posé sur l'itinéraire, orienté selon lui.
     *
     * Il était figé sur l'avenue centrale, donc à côté du tracé dès que
     * celui-ci changeait de voie. Il lit maintenant `routeXAt` à sa propre
     * profondeur, et prend son cap sur un point situé un peu devant — il
     * s'incline donc dans les virages.
     */
    function drawMe(t) {
      var wy = NEAR + 46;
      var worldY = camY + wy;
      var p = proj(routeXAt(worldY), wy);
      var ahead = proj(routeXAt(worldY + 90), wy + 90);
      if (!p || !ahead) return;

      var ang = Math.atan2(ahead.x - p.x, p.y - ahead.y);
      var r = 16;

      // cercle de précision — non orienté
      var ph = (t * 0.7) % 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + ph * 58, 0, 6.2832);
      ctx.strokeStyle = C.me;
      ctx.globalAlpha = (1 - ph) * 0.45;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(ang);

      // cône de direction — discret : l'itinéraire passe dessous
      ctx.beginPath();
      ctx.moveTo(0, -74);
      ctx.lineTo(-32, 10);
      ctx.lineTo(32, 10);
      ctx.closePath();
      var cone = ctx.createLinearGradient(0, -74, 0, 10);
      cone.addColorStop(0, 'rgba(126,176,255,0)');
      cone.addColorStop(1, 'rgba(126,176,255,0.13)');
      ctx.fillStyle = cone;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -r * 1.35);
      ctx.lineTo(-r * 0.86, r);
      ctx.lineTo(0, r * 0.45);
      ctx.lineTo(r * 0.86, r);
      ctx.closePath();
      ctx.fillStyle = C.me;
      ctx.fill();
      ctx.strokeStyle = '#08090E';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }

    /** Brume à l'horizon + vignettage. */
    function drawAtmosphere() {
      var fog = ctx.createLinearGradient(0, horizon - 4, 0, horizon + H * 0.22);
      fog.addColorStop(0, 'rgba(16,26,46,0.95)');
      fog.addColorStop(1, 'rgba(16,26,46,0)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, horizon - 4, W, H * 0.24);

      var vig = ctx.createRadialGradient(cx, H * 0.58, H * 0.32, cx, H * 0.58, H * 1.05);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.42)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }

    function render(t, dt) {
      // inerties
      speed += (targetSpeed - speed) * Math.min(1, dt * 1.6);
      camY += speed * dt;
      lookX += (tgtLookX - lookX) * Math.min(1, dt * 3.2);
      lookY += (tgtLookY - lookY) * Math.min(1, dt * 3.2);
      // La caméra suit l'itinéraire latéralement : c'est la ville qui
      // glisse pendant les virages, pas le curseur qui part hors cadre.
      // Sans ça, un changement d'avenue déporte le curseur de 300 unités
      // monde — plus de 1500 px à l'écran au premier plan.
      //
      // Le recalage est amorti, pas instantané. Le curseur prend donc un
      // peu d'avance sur le centre pendant le virage puis se recentre —
      // exactement l'inclinaison d'un véhicule qui prend une courbe. Le
      // curseur reste sur le tracé quoi qu'il arrive : `camX` déplace la
      // scène entière, itinéraire compris.
      var camXTarget = routeXAt(camY + NEAR + 46) + lookX * 26;
      camX += (camXTarget - camX) * Math.min(1, dt * 5);

      // Le retard est borné en proportion de la largeur : l'amplitude à
      // l'écran croît avec la hauteur du canvas, et sur une fenêtre étroite
      // et haute le curseur passerait sous le bord gauche.
      var sNear = F / (NEAR + 46);
      var maxLag = (W * 0.16) / sNear;
      var lag = camXTarget - camX;
      if (lag > maxLag) camX = camXTarget - maxLag;
      else if (lag < -maxLag) camX = camXTarget + maxLag;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);

      drawBackdrop();
      drawBlocks();
      drawRoads();
      drawRoute(t);
      drawLabels();
      drawStations();
      drawHazards(t);
      drawRiders(dt, t);
      drawMe(t);
      drawAtmosphere();

      if (fade < 1) {
        ctx.globalAlpha = 1 - fade;
        ctx.fillStyle = '#08090E';
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    }

    resize();

    return {
      ok: true,
      resize: resize,
      render: render,
      setSpeed: function (v) { targetSpeed = v * 7.5; },   // unités monde/s
      getSpeed: function () { return speed / 7.5; },
      getDist: function () { return camY / 7.5; },
      setLook: function (x, y) { tgtLookX = x; tgtLookY = y; },
      setFade: function (v) { fade = v; }
    };
  }

  global.IzenMap = { create: createMap };
})(window);
