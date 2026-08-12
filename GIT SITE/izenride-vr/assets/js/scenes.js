/* ============================================================
   IzenRide — Scènes canvas 2D
   Trois visualisations pilotées par un seul RAF (app.js) :
     · cross  — deux trajectoires qui se croisent
     · radar  — réseau de signalements communautaires
     · safety — dôme de protection + contacts enregistrés
   Chaque scène ne tourne que lorsqu'elle est visible.
   ============================================================ */
(function (global) {
  'use strict';

  var C = {
    road:    '#232c3d',
    roadDim: '#1a2130',
    neon:    '#4d8fff',
    neonHi:  '#7eb0ff',
    izen:    '#b8c5dd',
    ok:      '#5DCAA5',
    warn:    '#FAC775',
    err:     '#E24B4A',
    mute:    '#8E96A8'
  };

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  /* ─────────────────────────────────────────────────────────
     Scène 1 — LE CROISEMENT
     ───────────────────────────────────────────────────────── */
  function CrossScene(ctx, host) {
    var out = host.querySelector('#crossCount');
    // shown = -1 : la première frame écrit le total de départ, sinon le
    // compteur reste à « 0 » tant qu'aucun croisement n'a eu lieu.
    var count = 0, shown = -1;
    var A, B, prevGap, ripples;

    function reset() {
      A = { t: 0, v: rand(0.16, 0.24), trail: [] };
      B = { t: 1, v: -rand(0.16, 0.24), trail: [] };
      prevGap = 1;
    }
    reset();
    ripples = [];

    function at(t, w, h) {
      t = Math.max(0, Math.min(1, t));
      return {
        x: (0.13 + 0.74 * t) * w,
        y: (0.86 - 0.72 * t + 0.15 * Math.sin(t * Math.PI * 2)) * h
      };
    }

    function drawRoad(w, h) {
      var i, p;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // corps de route
      ctx.beginPath();
      for (i = 0; i <= 60; i++) { p = at(i / 60, w, h); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }
      ctx.strokeStyle = C.road;
      ctx.lineWidth = Math.max(14, w * 0.055);
      ctx.stroke();

      // axe pointillé
      ctx.setLineDash([w * 0.026, w * 0.030]);
      ctx.strokeStyle = 'rgba(184,197,221,.22)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function drawRider(r, color, w, h) {
      var i, p, a;
      // sillage
      for (i = 0; i < r.trail.length; i++) {
        a = (i / r.trail.length);
        ctx.beginPath();
        ctx.arc(r.trail[i].x, r.trail[i].y, Math.max(1, w * 0.011 * a), 0, 6.2832);
        ctx.fillStyle = color;
        ctx.globalAlpha = a * 0.32;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      p = at(r.t, w, h);
      // halo
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, w * 0.09);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, w * 0.09, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;

      // phare
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(3.5, w * 0.017), 0, 6.2832);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.stroke();
    }

    return function frame(dt, w, h) {
      drawRoad(w, h);

      [A, B].forEach(function (r) {
        r.t += r.v * dt;
        var p = at(r.t, w, h);
        r.trail.push(p);
        if (r.trail.length > 26) r.trail.shift();
      });

      var gap = A.t - B.t;
      if (prevGap < 0 && gap >= 0) {
        // ils viennent de se croiser
        var p = at((A.t + B.t) / 2, w, h);
        ripples.push({ x: p.x, y: p.y, r: 0, life: 1 });
        count++;
      }
      prevGap = gap;

      if (A.t > 1.25 && B.t < -0.25) reset();

      drawRider(B, C.izen, w, h);
      drawRider(A, C.neonHi, w, h);

      // ondes de salut
      for (var i = ripples.length - 1; i >= 0; i--) {
        var rp = ripples[i];
        rp.r += dt * w * 0.55;
        rp.life -= dt * 0.85;
        if (rp.life <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, 6.2832);
        ctx.strokeStyle = C.ok;
        ctx.globalAlpha = Math.max(0, rp.life) * 0.75;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // compteur (lissé pour éviter le clignotement)
      if (out && shown !== count) {
        shown = count;
        out.textContent = (9130 + count).toLocaleString('fr-FR');
      }
    };
  }

  /* ─────────────────────────────────────────────────────────
     Scène 2 — RADARS COMMUNAUTAIRES
     ───────────────────────────────────────────────────────── */
  function RadarScene(ctx, host) {
    var outCount = host.querySelector('#radarCount');
    var toast = host.querySelector('#radarToast');

    var ROADS = [
      [[0.02, 0.78], [0.26, 0.70], [0.44, 0.50], [0.68, 0.42], [0.98, 0.26]],
      [[0.14, 0.02], [0.22, 0.30], [0.40, 0.52], [0.52, 0.82], [0.60, 0.99]],
      [[0.98, 0.62], [0.72, 0.60], [0.52, 0.74], [0.28, 0.80], [0.04, 0.94]],
      [[0.06, 0.42], [0.30, 0.34], [0.56, 0.30], [0.80, 0.14], [0.99, 0.06]]
    ];
    var LABELS = ['D 952', 'N 7', 'D 518', 'Col du Rousset', 'A 480', 'D 93'];
    var KINDS = [
      { t: 'Contrôle',            c: C.warn },
      { t: 'Gravier',             c: C.izen },
      { t: 'Accident',            c: C.err  },
      { t: 'Chaussée glissante',  c: C.neonHi },
      { t: 'Travaux',             c: C.warn }
    ];

    var riders = [];
    for (var i = 0; i < 9; i++) {
      riders.push({
        r: (Math.random() * ROADS.length) | 0,
        t: Math.random(),
        v: rand(0.045, 0.11) * (Math.random() < 0.5 ? 1 : -1)
      });
    }

    var hazards = [];
    var spawnIn = 0.6;
    var shownCount = -1;

    function onRoad(ri, t, w, h) {
      var pts = ROADS[ri];
      t = ((t % 1) + 1) % 1;
      var f = t * (pts.length - 1);
      var i0 = Math.min(pts.length - 2, Math.floor(f));
      var k = f - i0;
      var a = pts[i0], b = pts[i0 + 1];
      return { x: (a[0] + (b[0] - a[0]) * k) * w, y: (a[1] + (b[1] - a[1]) * k) * h };
    }

    function drawRoads(w, h) {
      ROADS.forEach(function (pts, idx) {
        ctx.beginPath();
        pts.forEach(function (p, i) {
          i ? ctx.lineTo(p[0] * w, p[1] * h) : ctx.moveTo(p[0] * w, p[1] * h);
        });
        ctx.strokeStyle = idx % 2 ? C.roadDim : C.road;
        ctx.lineWidth = idx % 2 ? Math.max(4, w * 0.016) : Math.max(6, w * 0.026);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });
    }

    function spawn(w, h) {
      var kind = pick(KINDS);
      var ri = (Math.random() * ROADS.length) | 0;
      var t = rand(0.12, 0.88);
      hazards.push({ ri: ri, t: t, kind: kind, life: rand(7, 11), age: 0, confirms: 1 });
      if (toast) {
        toast.textContent = kind.t + ' signalé — ' + pick(LABELS);
        toast.classList.add('is-on');
        clearTimeout(toast._to);
        toast._to = setTimeout(function () { toast.classList.remove('is-on'); }, 2600);
      }
    }

    return function frame(dt, w, h) {
      drawRoads(w, h);

      spawnIn -= dt;
      if (spawnIn <= 0 && hazards.length < 5) { spawn(w, h); spawnIn = rand(2.2, 4.2); }

      // signalements
      for (var i = hazards.length - 1; i >= 0; i--) {
        var hz = hazards[i];
        hz.age += dt;
        if (hz.age > hz.life) { hazards.splice(i, 1); continue; }

        var p = onRoad(hz.ri, hz.t, w, h);
        var appear = Math.min(1, hz.age * 3);
        var fadeOut = Math.min(1, (hz.life - hz.age) * 1.4);
        var alpha = Math.min(appear, fadeOut);

        // ondes
        for (var k = 0; k < 2; k++) {
          var ph = ((hz.age * 0.75 + k * 0.5) % 1);
          ctx.beginPath();
          ctx.arc(p.x, p.y, ph * w * 0.13, 0, 6.2832);
          ctx.strokeStyle = hz.kind.c;
          ctx.globalAlpha = (1 - ph) * 0.55 * alpha;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
        ctx.globalAlpha = alpha;

        // pastille
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(5, w * 0.021), 0, 6.2832);
        ctx.fillStyle = hz.kind.c;
        ctx.fill();
        ctx.strokeStyle = 'rgba(8,9,14,.9)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // libellé
        ctx.globalAlpha = alpha * 0.9;
        ctx.font = '600 ' + Math.max(9, w * 0.031) + 'px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = hz.kind.c;
        ctx.textAlign = 'left';
        ctx.fillText(hz.kind.t, p.x + w * 0.035, p.y + w * 0.012);
        ctx.globalAlpha = 1;
        hz._p = p;
      }

      // motards + relais d'info
      riders.forEach(function (rd) {
        rd.t += rd.v * dt;
        var p = onRoad(rd.r, rd.t, w, h);

        hazards.forEach(function (hz) {
          if (!hz._p) return;
          var dx = hz._p.x - p.x, dy = hz._p.y - p.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < w * 0.24) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(hz._p.x, hz._p.y);
            ctx.strokeStyle = hz.kind.c;
            ctx.globalAlpha = (1 - d / (w * 0.24)) * 0.30;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(2.4, w * 0.0105), 0, 6.2832);
        ctx.fillStyle = C.neonHi;
        ctx.fill();
      });

      if (outCount && shownCount !== hazards.length) {
        shownCount = hazards.length;
        outCount.textContent = String(hazards.length);
      }
    };
  }

  /* ─────────────────────────────────────────────────────────
     Scène 3 — SAFETY ZONE
     ───────────────────────────────────────────────────────── */
  function SafetyScene(ctx, host) {
    var tag = host.querySelector('#safetyTag');
    var contacts = [
      { a: -1.1, name: 'Camille' },
      { a: 1.05, name: 'Papa' },
      { a: 2.85, name: 'Le club' }
    ];
    var t = 0;
    var sweep = 0;
    // Cadence de rejeu de la mise en scène. Ce n'est PAS une détection : l'app
    // n'a aucun capteur de chute, le SOS est un appui volontaire suivi d'un
    // décompte de 10 s. Ne pas réintroduire « chute » dans cette scène.
    var alertAt = 14;
    var alerting = -1;

    return function frame(dt, w, h) {
      t += dt;
      sweep += dt * 0.9;

      var cx = w * 0.5, cy = h * 0.47;
      var R = Math.min(w, h) * 0.34;

      if (t > alertAt && alerting < 0) { alerting = 0; }
      if (alerting >= 0) {
        alerting += dt;
        if (alerting > 4.5) { alerting = -1; t = 0; }
      }
      var isAlert = alerting >= 0;
      var accent = isAlert ? C.err : C.ok;

      if (tag) {
        var want = isAlert ? 'Alerte envoyée' : 'Protégé';
        if (tag.textContent !== want) {
          tag.textContent = want;
          tag.classList.toggle('stage__tag--ok', !isAlert);
        }
      }

      // dôme : anneaux respirants
      for (var i = 0; i < 4; i++) {
        var ph = ((t * 0.32 + i * 0.25) % 1);
        ctx.beginPath();
        ctx.arc(cx, cy, R * (0.35 + ph * 0.85), 0, 6.2832);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = (1 - ph) * (isAlert ? 0.42 : 0.24);
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // balayage radar
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.18, sweep, sweep + 0.55);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.09;
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;

      // cercle de zone
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.18, 0, 6.2832);
      ctx.strokeStyle = 'rgba(184,197,221,.16)';
      ctx.setLineDash([4, 7]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // liens vers les proches
      contacts.forEach(function (c, i) {
        var a = c.a + t * 0.12;
        var x = cx + Math.cos(a) * R * 1.18;
        var y = cy + Math.sin(a) * R * 1.18;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = accent;
        ctx.setLineDash([3, 6]);
        ctx.lineDashOffset = -t * (isAlert ? 60 : 18);
        ctx.globalAlpha = isAlert ? 0.75 : 0.34;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // pastille contact
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4.5, w * 0.019), 0, 6.2832);
        ctx.fillStyle = isAlert ? C.err : 'rgba(19,22,34,.95)';
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.font = '600 ' + Math.max(9, w * 0.028) + 'px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = C.mute;
        ctx.textAlign = 'center';
        ctx.fillText(c.name, x, y + w * 0.062);
      });

      // le motard au centre
      var pulse = isAlert ? (1 + Math.sin(t * 18) * 0.12) : 1;
      var rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.5);
      rg.addColorStop(0, isAlert ? 'rgba(226,75,74,.55)' : 'rgba(77,143,255,.42)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.5, 0, 6.2832); ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(7, w * 0.032) * pulse, 0, 6.2832);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = isAlert ? C.err : C.neonHi;
      ctx.lineWidth = 3;
      ctx.stroke();

      if (isAlert) {
        ctx.font = '700 ' + Math.max(10, w * 0.036) + 'px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = C.err;
        ctx.textAlign = 'center';
        ctx.fillText('SOS DÉCLENCHÉ', cx, cy - R * 0.72);
        ctx.font = '500 ' + Math.max(9, w * 0.028) + 'px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = C.mute;
        ctx.fillText('Position transmise avec l’alerte', cx, cy - R * 0.72 + w * 0.05);
      }
    };
  }

  var BUILDERS = { cross: CrossScene, radar: RadarScene, safety: SafetyScene };

  /* ─────────────────────────────────────────────────────────
     Gestionnaire
     ───────────────────────────────────────────────────────── */
  function createManager() {
    var items = [];

    function mountAll() {
      var nodes = document.querySelectorAll('canvas[data-scene]');
      Array.prototype.forEach.call(nodes, function (cv) {
        var name = cv.getAttribute('data-scene');
        var build = BUILDERS[name];
        if (!build) return;
        var ctx = cv.getContext('2d');
        if (!ctx) return;
        var host = cv.closest('section') || document;
        // visible par défaut : l'IntersectionObserver corrige au premier
        // callback, ce qui évite un canvas vide le temps qu'il arrive.
        var item = { cv: cv, ctx: ctx, frame: build(ctx, host), visible: true, w: 1, h: 1, dpr: 1 };
        items.push(item);
      });

      if ('IntersectionObserver' in global) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            var it = items.filter(function (x) { return x.cv === e.target; })[0];
            if (it) it.visible = e.isIntersecting;
          });
        }, { rootMargin: '120px' });
        items.forEach(function (it) { io.observe(it.cv); });
      } else {
        items.forEach(function (it) { it.visible = true; });
      }

      resize();
    }

    function resize() {
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      items.forEach(function (it) {
        var r = it.cv.getBoundingClientRect();
        if (!r.width) return;
        it.w = r.width; it.h = r.height; it.dpr = dpr;
        it.cv.width = Math.round(r.width * dpr);
        it.cv.height = Math.round(r.height * dpr);
      });
    }

    function update(dt) {
      items.forEach(function (it) {
        if (!it.visible || !it.w) return;
        var ctx = it.ctx;
        ctx.setTransform(it.dpr, 0, 0, it.dpr, 0, 0);
        ctx.clearRect(0, 0, it.w, it.h);
        it.frame(dt, it.w, it.h);
      });
    }

    /** Rend une frame unique — utilisé en mode animations réduites. */
    function still() { update(0.016); }

    return { mountAll: mountAll, resize: resize, update: update, still: still };
  }

  global.IzenScenes = createManager();
})(window);
