/* ============================================================
   IZENRIDE — moteur du site (base technique mysticsaba)
   Vanilla JS + GSAP/ScrollTrigger (CDN) · canvas 2D génératif
   · i18n FR/EN par data-i18n · dock "Ride Live"
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof gsap !== 'undefined';

  /* ----------------------------------------------------------
     i18n — FR par défaut, EN au clic (persisté en localStorage)
     ---------------------------------------------------------- */
  var I18N = {
    fr: {
      'nav.app': "L'app", 'nav.premium': 'Premium', 'nav.tech': 'Tech',
      'nav.about': 'À propos', 'nav.download': 'Télécharger',
      'menu.meta': 'FR — iOS & Android · gratuit',
      'hero.kicker': "dispo sur iOS & Android — l'app des motards, made in France",
      'hero.role': 'La route vous croise. <em>IZENRIDE</em> vous connecte.',
      'hero.tagline': "Rencontres entre motards, croisements GPS, sorties de groupe et guidage moto — tout dans votre poche, à 21h47, quelque part sur une départementale.",
      'hero.cta.dl': "Télécharger l'app", 'hero.cta.features': 'Voir les features', 'hero.cta.live': 'Ride Live en direct',
      'hero.meta.est': 'EN ROUTE DEPUIS 2024 →',
      'app.index': "01 / L'APP",
      'app.title': 'Croisez, roulez <em>&</em> connectez',
      'app.note': "Cinq features, un seul réflexe — les écrans ci-dessous illustrent l'interface.",
      'row.match.name': 'Rencontre',
      'row.match.desc': "Vos trajets se croisent déjà — IZENRIDE transforme ces croisements en rencontres. Un match basé sur vos affinités de conduite, une messagerie temps réel pensée pour la route, un prochain ride.",
      'row.match.meta': 'GRATUIT — iOS & ANDROID · « Croisez des motards, pas des profils »',
      'row.map.name': 'Carte & GPS',
      'row.map.desc': "Notre système de localisation détecte les motards que vous croisez sur votre trajet. Navigation pensée moto, guidage vocal, et itinéraires taillés pour les virages.",
      'row.map.meta': "TEMPS RÉEL — la carte s'illumine là où la communauté roule",
      'row.events.name': 'Événements',
      'row.events.desc': "Créez un ride, fixez le départ, partagez l'itinéraire. Le suivi live garde le groupe soudé du premier au dernier virage — night rides, balades du dimanche, track days.",
      'row.events.meta': 'SORTIES DE GROUPE — seul on roule vite, ensemble on roule loin',
      'row.safety.name': 'Sécurité',
      'row.safety.desc': "Un SOS à portée de pouce : appui long, décompte, et vos contacts d'urgence reçoivent votre position. Partagez un trajet par lien, le temps d'une route. Et votre Safety Zone vous rend invisible sur la carte à moins de 2 km de chez vous.",
      'row.safety.meta': 'SÉRIEUX — la route veille sur vous',
      'premium.index': '02 / PREMIUM', 'premium.title': 'Passez en pleins phares',
      'premium.coming': '— ABONNEMENT —',
      'premium.pitch': "Voyez qui vous a liké, qui vous avez croisé, et les motards autour de vous sur la carte. Créez vos propres sorties.<br>L'expérience complète, <em>sans limites</em>.",
      'premium.hint': '9,99 € / MOIS · 49,99 € / 6 MOIS · 79,99 € / AN · SANS ENGAGEMENT',
      'premium.cta': 'Essayer Premium',
      'tech.index': '03 / TECH', 'tech.title': 'Sous le réservoir, <em>du lourd</em>',
      'tech.loc': 'Système GPS propriétaire · détection des croisements · Safety Zone autour du domicile · géo-temps réel',
      'tech.rt': 'Messagerie instantanée · suivi live des rides · positions du groupe · WebSockets',
      'tech.map': "Navigation pensée moto · itinéraires ZEN (virages d'abord) · cartes nuit natives",
      "tech.sec": "Chiffrement en transit · SOS appui long · contacts d'urgence · données jamais revendues",
      'tech.com': 'Matching par affinités · événements & groupes · modération humaine · profils vérifiés',
      'tech.plat': "iOS & Android natifs · mode hors-ligne · batterie maîtrisée · FR aujourd'hui, EN demain",
      'process.index': '04 / EN ROUTE', 'process.title': 'De la poche <em>au</em> bitume',
      'process.1.name': 'Téléchargez', 'process.1.desc': 'Gratuit sur iOS et Android. Deux minutes, casque encore sur la tête.',
      'process.2.name': 'Votre bécane', 'process.2.desc': 'Profil, machine, style de conduite. Roadtrips, twisties ou night rides — dites qui vous êtes.',
      'process.3.name': 'Roulez', 'process.3.desc': 'Rien à faire de plus. Chaque trajet détecte les motards que vous croisez.',
      'process.4.name': 'Matchez', 'process.4.desc': '« Croisée 3× cette semaine. » Un match, un message, un point de rendez-vous.',
      'process.5.name': 'Ensemble', 'process.5.desc': 'Night ride vendredi 21h30. Le suivi live garde le groupe soudé. La boucle est bouclée.',
      'about.index': '05 / À PROPOS', 'about.title': 'Nés sur la route',
      'about.p1': "IZENRIDE est né d'un constat simple : les motards se <em>croisent</em> tous les jours — un signe de la main à 90 km/h — sans jamais se rencontrer. On a construit l'app qui transforme ce signe en communauté.",
      'about.p2': "Tout ce qu'on développe vit au croisement de <strong>la route et du réseau</strong> : la rencontre avec le matching, le territoire avec le GPS propriétaire, le groupe avec les rides, la confiance avec la Safety Zone. Une app qui se sent vivante dès qu'on l'ouvre — comme un moteur qui démarre.",
      'about.sig': "— l'équipe IZEN RIDE SAS, quelque part sur la D2204",
      'contact.index': '06 / TÉLÉCHARGER',
      'contact.l1': 'Prêt à croiser', 'contact.l2': 'la <em>route ?</em>',
      'contact.appstore': 'App Store', 'contact.play': 'Google Play',
      'footer.built': '© 2026 IZEN RIDE SAS', 'footer.top': 'RETOUR EN HAUT ↑',
      'dock.online': "APERÇU DE L'APP — CROISEMENTS & SORTIES",
      'panel.head': "UN APERÇU DE L'APPLICATION", 'panel.online': "Ce que l'app affiche quand vous roulez",
      'panel.next': 'PROCHAIN RIDE — NIGHT RIDE CORNICHE'
    },
    en: {
      'nav.app': 'The app', 'nav.premium': 'Premium', 'nav.tech': 'Tech',
      'nav.about': 'About', 'nav.download': 'Download',
      'menu.meta': 'FR — iOS & Android · free',
      'hero.kicker': 'available on iOS & Android — the riders app, made in France',
      'hero.role': 'The road crosses you. <em>IZENRIDE</em> connects you.',
      'hero.tagline': 'Rider matching, GPS path-crossings, group rides and motorcycle navigation — all in your pocket, at 9:47pm, somewhere on a back road.',
      'hero.cta.dl': 'Download the app', 'hero.cta.features': 'See the features', 'hero.cta.live': 'Ride Live feed',
      'hero.meta.est': 'ON THE ROAD SINCE 2024 →',
      'app.index': '01 / THE APP',
      'app.title': 'Cross, ride <em>&</em> connect',
      'app.note': 'Five features, one reflex — the screens below illustrate the interface.',
      'row.match.name': 'Matching',
      'row.match.desc': 'Your routes already cross — IZENRIDE turns those crossings into encounters. A match based on how you ride, realtime messaging built for the road, a next ride.',
      'row.match.meta': 'FREE — iOS & ANDROID · "Cross riders, not profiles"',
      'row.map.name': 'Map & GPS',
      'row.map.desc': 'Our location engine detects the riders you cross along your route. Motorcycle-first navigation, voice guidance, and routes carved for corners.',
      'row.map.meta': 'REALTIME — the map lights up where the community rides',
      'row.events.name': 'Events',
      'row.events.desc': 'Create a ride, set the start, share the route. Live tracking keeps the group tight from first to last corner — night rides, Sunday cruises, track days.',
      'row.events.meta': 'GROUP RIDES — alone you ride fast, together you ride far',
      'row.safety.name': 'Safety',
      "row.safety.desc": "SOS within thumb's reach: long-press, countdown, and your emergency contacts receive your position. Share a trip by link, for the length of a ride. And your Safety Zone makes you invisible on the map within 2 km of home.",
      'row.safety.meta': 'SERIOUS — the road watches over you',
      'premium.index': '02 / PREMIUM', 'premium.title': 'Switch to high beams',
      'premium.coming': '— SUBSCRIPTION —',
      'premium.pitch': 'See who liked you, who you crossed, and the riders around you on the map. Create your own rides.<br>The full experience, <em>no limits</em>.',
      'premium.hint': '€9.99 / MONTH · €49.99 / 6 MONTHS · €79.99 / YEAR · NO COMMITMENT',
      'premium.cta': 'Try Premium',
      'tech.index': '03 / TECH', 'tech.title': 'Under the tank, <em>heavy duty</em>',
      'tech.loc': 'Proprietary GPS engine · path-crossing detection · Safety Zone around home · realtime geo',
      'tech.rt': 'Instant messaging · live ride tracking · group positions · WebSockets',
      'tech.map': 'Motorcycle-first navigation · ZEN routes (corners first) · native night maps',
      'tech.sec': 'Encryption in transit · long-press SOS · emergency contacts · data never sold',
      'tech.com': 'Affinity matching · events & groups · human moderation · verified profiles',
      'tech.plat': 'Native iOS & Android · offline mode · battery friendly · FR today, EN next',
      'process.index': '04 / ON THE ROAD', 'process.title': 'From pocket <em>to</em> tarmac',
      'process.1.name': 'Download', 'process.1.desc': 'Free on iOS and Android. Two minutes, helmet still on.',
      'process.2.name': 'Your bike', 'process.2.desc': 'Profile, machine, riding style. Roadtrips, twisties or night rides — say who you are.',
      'process.3.name': 'Ride', 'process.3.desc': 'Nothing else to do. Every trip detects the riders you cross.',
      'process.4.name': 'Match', 'process.4.desc': '"Crossed 3× this week." A match, a message, a meeting point.',
      'process.5.name': 'Together', 'process.5.desc': 'Night ride, Friday 9:30pm. Live tracking keeps the group tight. Full circle.',
      'about.index': '05 / ABOUT', 'about.title': 'Born on the road',
      'about.p1': 'IZENRIDE was born from a simple fact: riders <em>cross</em> each other every day — a wave at 90 km/h — without ever meeting. We built the app that turns that wave into a community.',
      'about.p2': 'Everything we build lives at the crossing of <strong>the road and the network</strong>: encounters with matching, territory with proprietary GPS, the group with rides, trust with the Safety Zone. An app that feels alive the second you open it — like an engine starting.',
      'about.sig': '— the IZEN RIDE SAS team, somewhere on the D2204',
      'contact.index': '06 / DOWNLOAD',
      'contact.l1': 'Ready to cross', 'contact.l2': 'the <em>road?</em>',
      'contact.appstore': 'App Store', 'contact.play': 'Google Play',
      'footer.built': '© 2026 IZEN RIDE SAS', 'footer.top': 'BACK TO TOP ↑',
      'dock.online': 'APP PREVIEW — CROSSINGS & GROUP RIDES',
      'panel.head': 'A GLIMPSE OF THE APP', 'panel.online': 'What the app shows while you ride',
      'panel.next': 'NEXT RIDE — CORNICHE NIGHT RIDE'
    }
  };

  function applyLang(lang, persister) {
    var dict = I18N[lang] || I18N.fr;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k]) el.textContent = dict[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      if (dict[k]) el.innerHTML = dict[k];
    });
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });
    /* ⚠️ NE PERSISTE QUE SUR CHOIX EXPLICITE. Cette ligne écrivait à CHAQUE
       appel — y compris celui du démarrage, qui passait 'fr' par défaut. Le
       site s'inventait donc une préférence dès la première visite, et toute
       détection de la langue de l'appareil devenait inerte : elle relisait ce
       que le site venait d'écrire. Voir le script en ligne d'index.html. */
    if (persister) {
      try { localStorage.setItem('izen-langue-choisie', lang); } catch (e) {}
    }
  }
  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
  });
  /* La décision a déjà été prise dans <head>, avant le premier paint : choix
     explicite s'il existe, sinon la langue de l'appareil. On l'applique. */
  applyLang(window.__izenLangue === 'en' ? 'en' : 'fr', false);

  /* ----------------------------------------------------------
     Écrans de l'app : lazy-load + mise à l'échelle (390 × 844)
     ---------------------------------------------------------- */
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.style.setProperty('--s', (e.contentRect.width / 390).toFixed(4));
      });
    });
    document.querySelectorAll('.phone-screen').forEach(function (el) { ro.observe(el); });
  }
  var lazy = document.querySelectorAll('iframe[data-src]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.src = en.target.dataset.src;
          en.target.removeAttribute('data-src');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '900px 0px' });
    lazy.forEach(function (f) { io.observe(f); });
  } else {
    lazy.forEach(function (f) { f.src = f.dataset.src; });
  }

  /* ----------------------------------------------------------
     Nav : fond plein au scroll · burger mobile
     ---------------------------------------------------------- */
  var nav = document.querySelector('.nav');
  function onScrollNav() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  var burger = document.querySelector('.nav__burger');
  var menu = document.getElementById('mobile-menu');
  function closeMenu() { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ----------------------------------------------------------
     Copie du mail (contact)
     ---------------------------------------------------------- */
  var mailBtn = document.getElementById('mail-copy');
  var mailLabel = document.getElementById('mail-label');
  if (mailBtn) {
    mailBtn.addEventListener('click', function () {
      var write = navigator.clipboard && navigator.clipboard.writeText('hello@izenride.com');
      var prev = mailLabel.textContent;
      mailLabel.textContent = 'COPIÉ ✓';
      setTimeout(function () { mailLabel.textContent = prev; }, 1600);
      if (write) write.catch(function () {});
    });
  }

  /* ----------------------------------------------------------
     Dock RIDE LIVE : compteur, barres canvas, countdown, panneau
     ---------------------------------------------------------- */
  // ⚠️ RETIRÉ LE 2026-08-04 — un compteur qui partait de 1 248 et marchait
  // AU HASARD toutes les 2,4 secondes, présenté sous le titre « EN DIRECT DE
  // LA COMMUNAUTÉ ». Aucune de ces valeurs n'a jamais existé.
  //
  // C'est la même faute que l'application a corrigée de son côté en supprimant
  // un bloc de navigation qui affichait « A7 sud · 110 km/h » en dur.
  //
  // Le brancher sur du vrai n'est PAS une option : il n'existe aucun point
  // d'accès public, et publier les croisements réels de motards sur un site
  // ouvert poserait un problème de vie privée bien plus grave que le mensonge.

  // Countdown vers le prochain vendredi 21:30
  var panelCount = document.getElementById('panel-count');
  function nextFriday() {
    var d = new Date();
    var day = d.getDay(); // 5 = vendredi
    var add = (5 - day + 7) % 7;
    var target = new Date(d.getFullYear(), d.getMonth(), d.getDate() + add, 21, 30, 0);
    if (target <= d) target.setDate(target.getDate() + 7);
    return target;
  }
  function tickCountdown() {
    if (!panelCount) return;
    var ms = nextFriday() - new Date();
    var dJ = Math.floor(ms / 86400000);
    var hH = Math.floor(ms % 86400000 / 3600000);
    var mM = Math.floor(ms % 3600000 / 60000);
    panelCount.textContent = 'VEN 21:30 — J-' + dJ + ' · ' + hH + ' H · ' + ('0' + mM).slice(-2) + ' MIN';
  }
  tickCountdown();
  setInterval(tickCountdown, 30000);

  // Barres animées du dock (canvas)
  var barsCv = document.getElementById('dock-bars');
  if (barsCv && !reduced) {
    var bctx = barsCv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    barsCv.width = 120 * dpr; barsCv.height = 14 * dpr;
    bctx.scale(dpr, dpr);
    var N = 18, heights = [], targets = [];
    for (var i = 0; i < N; i++) { heights.push(3); targets.push(3 + Math.random() * 11); }
    (function drawBars() {
      bctx.clearRect(0, 0, 120, 14);
      for (var i = 0; i < N; i++) {
        heights[i] += (targets[i] - heights[i]) * 0.08;
        if (Math.abs(targets[i] - heights[i]) < 0.4) targets[i] = 3 + Math.random() * 11;
        bctx.fillStyle = 'rgba(74,156,232,' + (0.35 + heights[i] / 22) + ')';
        bctx.fillRect(i * 6.6, 14 - heights[i], 3.5, heights[i]);
      }
      requestAnimationFrame(drawBars);
    })();
  }

  // Ouverture / fermeture du panneau
  var panel = document.getElementById('panel');
  var dockExpand = document.getElementById('dock-expand');
  function setPanel(open) {
    panel.hidden = !open;
    dockExpand.setAttribute('aria-expanded', String(open));
  }
  dockExpand.addEventListener('click', function () { setPanel(panel.hidden); });
  document.getElementById('panel-close').addEventListener('click', function () { setPanel(false); });
  document.getElementById('dock-toggle').addEventListener('click', function () { setPanel(panel.hidden); });
  var heroLive = document.getElementById('hero-live');
  if (heroLive) heroLive.addEventListener('click', function () { setPanel(true); });

  /* ----------------------------------------------------------
     Canvas hero : route de nuit générative (2D, GPU-friendly)
     Lignes d'asphalte convergeant vers le point de fuite +
     particules « phares » en bokeh bleu. Parallaxe souris.
     ---------------------------------------------------------- */
  var gl = document.getElementById('gl');
  if (gl && !reduced) {
    var ctx = gl.getContext('2d');
    var W, H, vx, vy, mx = 0;
    var dpr2 = Math.min(window.devicePixelRatio || 1, 2);
    function sizeGL() {
      var r = gl.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      gl.width = W * dpr2; gl.height = H * dpr2;
      ctx.setTransform(dpr2, 0, 0, dpr2, 0, 0);
      vx = W * 0.5; vy = H * 0.40;
    }
    sizeGL();
    window.addEventListener('resize', sizeGL);
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / W - 0.5) * 50;
    }, { passive: true });

    // bandes centrales de la route (z = profondeur 0..1, 1 = proche)
    var dashes = [];
    for (var d = 0; d < 14; d++) dashes.push(Math.pow(Math.random(), 2));
    // particules bokeh (phares lointains)
    var parts = [];
    for (var p = 0; p < 60; p++) {
      parts.push({ x: Math.random(), y: Math.random(), z: Math.random(), s: 0.5 + Math.random() });
    }
    var smx = 0;
    (function frame() {
      ctx.clearRect(0, 0, W, H);
      smx += (mx - smx) * 0.04;
      var VX = vx + smx, VY = vy;

      // halo du point de fuite
      var grad = ctx.createRadialGradient(VX, VY, 0, VX, VY, H * 0.55);
      grad.addColorStop(0, 'rgba(74,156,232,0.10)');
      grad.addColorStop(1, 'rgba(74,156,232,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // bords de route
      ctx.strokeStyle = 'rgba(26,30,40,0.9)';
      ctx.lineWidth = 1.5;
      [[-0.34, 1.0], [0.34, 1.0]].forEach(function (e) {
        ctx.beginPath();
        ctx.moveTo(VX, VY);
        ctx.lineTo(VX + e[0] * W * 1.4, H * 1.05);
        ctx.stroke();
      });

      // bandes blanches centrales qui défilent vers la caméra
      for (var i = 0; i < dashes.length; i++) {
        dashes[i] += 0.004 + dashes[i] * 0.016;
        if (dashes[i] > 1) dashes[i] = 0.02;
        var z = dashes[i];
        var y1 = VY + (H * 1.06 - VY) * (z * z);
        var y2 = VY + (H * 1.06 - VY) * Math.min(1, (z + 0.05 * z) * (z + 0.05 * z));
        ctx.strokeStyle = 'rgba(242,244,248,' + (0.04 + z * 0.22) + ')';
        ctx.lineWidth = 1 + z * 5;
        ctx.beginPath();
        ctx.moveTo(VX, y1);
        ctx.lineTo(VX, y2 + 4 + z * 26);
        ctx.stroke();
      }

      // bokeh phares
      for (var j = 0; j < parts.length; j++) {
        var q = parts[j];
        q.z += 0.0008 * q.s;
        if (q.z > 1) { q.z = 0; q.x = Math.random(); q.y = Math.random() * 0.6; }
        var px = VX + (q.x - 0.5) * W * (0.25 + q.z * 1.3);
        var py = VY + (q.y - 0.3) * H * (0.15 + q.z * 1.1);
        var rad = 0.6 + q.z * 3.2;
        ctx.fillStyle = 'rgba(74,156,232,' + (0.05 + q.z * 0.30) + ')';
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, 6.2832);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    })();
  }

  /* ----------------------------------------------------------
     Canvas premium : onde violette (signature "pleins phares")
     ---------------------------------------------------------- */
  var wave = document.getElementById('premium-wave');
  if (wave && !reduced) {
    var wctx = wave.getContext('2d');
    var dpr3 = Math.min(window.devicePixelRatio || 1, 2);
    function sizeWave() {
      var r = wave.getBoundingClientRect();
      wave.width = r.width * dpr3; wave.height = r.height * dpr3;
      wctx.setTransform(dpr3, 0, 0, dpr3, 0, 0);
    }
    sizeWave();
    window.addEventListener('resize', sizeWave);
    var t0w = 0;
    (function waveFrame(t) {
      var r = wave.getBoundingClientRect();
      var ww = r.width, wh = r.height;
      t0w = t * 0.001;
      wctx.clearRect(0, 0, ww, wh);
      for (var l = 0; l < 3; l++) {
        wctx.beginPath();
        for (var x = 0; x <= ww; x += 4) {
          var k = x / ww;
          var env = Math.sin(k * Math.PI); // amplitude max au centre
          var y = wh / 2 +
            Math.sin(k * 9 + t0w * (1.2 + l * 0.4) + l * 2) * env * (8 + l * 7);
          if (x === 0) wctx.moveTo(x, y); else wctx.lineTo(x, y);
        }
        wctx.strokeStyle = l === 0 ? 'rgba(127,119,221,.55)' :
                           l === 1 ? 'rgba(74,156,232,.35)' : 'rgba(127,119,221,.18)';
        wctx.lineWidth = 1.5;
        wctx.stroke();
      }
      requestAnimationFrame(waveFrame);
    })(0);
  }

  /* ----------------------------------------------------------
     Curseur custom + boutons magnétiques (pointeur fin)
     ---------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches && hasGsap && !reduced) {
    document.body.classList.add('cursor-on');
    var dot = document.querySelector('.cursor__dot');
    var ring = document.querySelector('.cursor__ring');
    var dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    var dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    var rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
    var ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });
    window.addEventListener('mousemove', function (e) {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });
    document.querySelectorAll('a, button, [data-magnetic]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
    });
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var qx = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
      var qy = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * 0.25);
        qy((e.clientY - r.top - r.height / 2) * 0.25);
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.45)' });
      });
    });
  }

  /* ----------------------------------------------------------
     Typo éclatée (data-split="chars") + reveals GSAP
     ---------------------------------------------------------- */
  document.querySelectorAll('[data-split="chars"]').forEach(function (el) {
    var text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-hidden', 'true');
    text.split('').forEach(function (ch) {
      var s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(s);
    });
  });

  if (hasGsap && !reduced) {
    gsap.registerPlugin(ScrollTrigger);

    // entrée du hero — déclenchée par l'intro (ou immédiatement si intro déjà vue)
    document.addEventListener('izen:hero', function () {
      gsap.from('.hero__title .char', {
        yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.045
      });
      gsap.from('[data-hero]', {
        opacity: 0, y: 26, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.4
      });
    });

    // wordmark premium au scroll
    gsap.from('.premium__wordmark .char', {
      yPercent: 110, duration: 0.9, ease: 'power4.out', stagger: 0.05,
      scrollTrigger: { trigger: '.premium__stage', start: 'top 75%' }
    });

    // révélations génériques
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 54, opacity: 0, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ----------------------------------------------------------
     INTRO — animation d'ouverture, jouée 1 seule fois par session.
     Compteur 0→100 km/h (écho du splash de l'app) → le rideau se
     lève sur le hero. sessionStorage retient qu'elle a déjà tourné.
     ---------------------------------------------------------- */
  (function () {
    var intro = document.getElementById('intro');
    var skip = document.documentElement.classList.contains('intro-skip');

    function fireHero() { document.dispatchEvent(new CustomEvent('izen:hero')); }
    function unlock() { document.documentElement.classList.remove('intro-playing'); }
    function remember() { try { sessionStorage.setItem('izen-intro', '1'); } catch (e) {} }

    // Déjà vue cette session, mouvement réduit, ou markup absent → on saute.
    if (!intro || skip) {
      if (intro) intro.style.display = 'none';
      unlock();
      requestAnimationFrame(fireHero);
      return;
    }

    var num = document.getElementById('intro-num');
    var arc = document.getElementById('intro-arc');
    var tag = document.getElementById('intro-tag');
    var CIRC = 540.35; // 2·π·86
    function render(p) {
      var n = Math.round(p * 100);
      num.textContent = n;
      if (arc) arc.style.strokeDashoffset = (CIRC * (1 - p)).toFixed(1);
      if (tag && n >= 60 && tag.textContent.indexOf('EN ROUTE') === -1) tag.textContent = 'EN ROUTE…';
    }
    function done() { intro.style.display = 'none'; unlock(); remember(); fireHero(); }

    if (hasGsap && !reduced) {
      var o = { v: 0 };
      gsap.timeline()
        .to(o, { v: 1, duration: 1.9, ease: 'power2.inOut', onUpdate: function () { render(o.v); } }, 0)
        .to('.intro__inner', { opacity: 0, y: -24, duration: 0.45, ease: 'power2.in' }, '+=0.2')
        .to(intro, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, '-=0.05')
        .add(done);
    } else {
      // Fallback sans GSAP : compteur en requestAnimationFrame, puis fondu.
      var t0 = null;
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 1700);
        render(p);
        if (p < 1) requestAnimationFrame(step);
        else { intro.style.transition = 'opacity .4s'; intro.style.opacity = '0'; setTimeout(done, 420); }
      };
      requestAnimationFrame(step);
    }
  })();
})();
