/* ============================================================
   IzenRide — Orchestration
   Un seul RAF pilote la carte du hero et les scènes canvas.
   Le scroll fait office d'accélérateur : la page se parcourt
   comme un trajet (odomètre, étapes, télémétrie).
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp  = function (a, b, k) { return a + (b - a) * k; };

  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reduceMQ.matches;
  var fxOff = reduced;

  /* ══════════════════════════ ÉTAT ══════════════════════════ */
  var state = {
    scroll: 0,          // px
    progress: 0,        // 0..1 sur toute la page
    heroRatio: 1,       // 1 = hero plein écran, 0 = hero sorti
    scrollVel: 0,       // px/s lissé
    look: { x: 0, y: 0 },
    gyro: false,
    live: false         // immersion démarrée
  };

  /* ══════════════════════════ BOOT ══════════════════════════ */
  var boot = $('#boot');
  var bootFill = $('#bootFill');
  var bootStatus = $('#bootStatus');
  var starter = $('#starter');
  var bootSkip = $('#bootSkip');

  var STEPS = [
    'Initialisation du cockpit…',
    'Liaison GPS acquise',
    'Réseau communautaire : 1 284 motards',
    'Safety Zone armée',
    'Prêt à rouler'
  ];

  function runBoot() {
    document.body.classList.add('is-booting');
    var i = 0, p = 0;
    var tick = setInterval(function () {
      p = Math.min(100, p + 100 / STEPS.length);
      if (bootFill) bootFill.style.width = p + '%';
      if (bootStatus) bootStatus.textContent = STEPS[Math.min(i, STEPS.length - 1)];
      i++;
      if (i >= STEPS.length) {
        clearInterval(tick);
        boot.classList.add('is-ready');
      }
    }, reduced ? 90 : 420);
  }

  function launch() {
    if (state.live) return;
    state.live = true;
    boot.classList.add('is-gone');
    document.body.classList.remove('is-booting');
    document.body.classList.add('is-live');
    $('#rail') && $('#rail').classList.add('is-on');
    setTimeout(function () { boot.remove(); }, 1000);
  }

  if (starter) {
    starter.addEventListener('click', function () {
      requestGyro();
      launch();
    });
  }
  if (bootSkip) {
    bootSkip.addEventListener('click', function () {
      setFx(false);
      launch();
    });
  }

  /* ══════════════════════════ CARTE DU HERO ══════════════════════════ */
  var heroEl = $('#hero');
  var glCanvas = $('#gl');
  var road = null;

  if (glCanvas && window.IzenMap) {
    try { road = window.IzenMap.create(glCanvas); } catch (e) { road = null; }
  }
  if (!road && heroEl) heroEl.classList.add('no-gl');

  /* ══════════════════════════ SCÈNES ══════════════════════════ */
  if (window.IzenScenes) window.IzenScenes.mountAll();

  /* ══════════════════════════ PARALLAXE ══════════════════════════ */
  var tiltTarget = { x: 0, y: 0 };

  window.addEventListener('pointermove', function (e) {
    if (state.gyro) return;
    tiltTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    tiltTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function onOrient(e) {
    if (e.gamma == null && e.beta == null) return;
    state.gyro = true;
    tiltTarget.x = clamp((e.gamma || 0) / 32, -1, 1);
    tiltTarget.y = clamp(((e.beta || 45) - 45) / 32, -1, 1);
  }

  function requestGyro() {
    var D = window.DeviceOrientationEvent;
    if (!D) return;
    if (typeof D.requestPermission === 'function') {
      D.requestPermission().then(function (r) {
        if (r === 'granted') window.addEventListener('deviceorientation', onOrient, { passive: true });
      }).catch(function () {});
    } else {
      window.addEventListener('deviceorientation', onOrient, { passive: true });
    }
  }

  /* ══════════════════════════ SCROLL ══════════════════════════ */
  var lastY = window.scrollY || 0;
  var rawVel = 0;

  function readScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    rawVel = Math.abs(y - lastY);
    lastY = y;
    state.scroll = y;

    var docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    state.progress = clamp(y / docH, 0, 1);

    if (heroEl) {
      var hh = heroEl.offsetHeight || window.innerHeight;
      state.heroRatio = clamp(1 - y / hh, 0, 1);
    }
  }
  window.addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  /* ══════════════════════════ NAV / RAIL ══════════════════════════ */
  var nav = $('#nav');
  var railFill = $('#railFill');
  var odoVal = $('#odoVal');
  var railLeg = $('#railLeg');
  var TOTAL_KM = 42;

  var legs = $$('[data-leg]');
  if ('IntersectionObserver' in window && railLeg) {
    var legIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) railLeg.textContent = e.target.getAttribute('data-leg');
      });
    }, { threshold: 0.35 });
    legs.forEach(function (s) { legIO.observe(s); });
  }

  /* ══════════════════════════ REVEAL ══════════════════════════ */
  if ('IntersectionObserver' in window) {
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { revIO.observe(el); });

    // Filet de sécurité : tout ce qui est déjà dans la fenêtre au chargement
    // est révélé sans attendre l'observateur (arrivée sur une ancre, moteurs
    // de rendu qui n'exécutent pas les callbacks). Rien ne doit rester invisible.
    setTimeout(function () {
      $$('.reveal').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('in');
          revIO.unobserve(el);
        }
      });
    }, 300);
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ══════════════════════════ COMPTEURS ══════════════════════════ */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1500, t0 = performance.now();
    function step(now) {
      var k = clamp((now - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - k, 3);
      var v = Math.round(target * e);
      el.textContent = v.toLocaleString('fr-FR') + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var cntIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cntIO.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(function (el) { cntIO.observe(el); });
  } else {
    $$('[data-count]').forEach(animateCount);
  }

  /* ══════════════════════════ COCKPIT ══════════════════════════ */
  var phone = $('#phone');
  var phoneWrap = $('#phoneWrap');

  var shots = $$('.shot');
  var shotCap = $('#shotCap');

  function selectScreen(btn) {
    var name = btn.getAttribute('data-screen');
    shots.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    $$('.scr').forEach(function (s) {
      s.classList.toggle('is-on', s.getAttribute('data-screen') === name);
    });
    if (shotCap) {
      shotCap.innerHTML = '';
      var b = document.createElement('b');
      b.textContent = btn.getAttribute('data-title') || '';
      var sp = document.createElement('span');
      sp.textContent = btn.getAttribute('data-desc') || '';
      shotCap.appendChild(b);
      shotCap.appendChild(sp);
    }
  }

  shots.forEach(function (btn, i) {
    btn.addEventListener('click', function () { selectScreen(btn); });
    // navigation clavier entre les vignettes
    btn.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var next = shots[(i + d + shots.length) % shots.length];
      next.focus();
      selectScreen(next);
    });
  });

  // Mur d'écrans : on double la piste pour que le défilement -50% boucle
  // sans saut visible.
  var wallTrack = $('#wallTrack');
  if (wallTrack) {
    Array.prototype.slice.call(wallTrack.children).forEach(function (img) {
      wallTrack.appendChild(img.cloneNode(true));
    });
  }

  var phoneTilt = { x: 0, y: 0 };
  if (phoneWrap) {
    phoneWrap.addEventListener('pointermove', function (e) {
      var r = phoneWrap.getBoundingClientRect();
      phoneTilt.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      phoneTilt.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    }, { passive: true });
    phoneWrap.addEventListener('pointerleave', function () {
      phoneTilt.x = 0; phoneTilt.y = 0;
    });
  }

  /* ══════════════════ PRE-INSCRIPTION — RETIREE 2026-08-27 ══════════════
     L'application est publiee : il n'y a plus de liste d'attente a rejoindre.
     Le formulaire n'avait par ailleurs JAMAIS enregistre quoi que ce soit —
     `ENDPOINT` est reste vide, il ouvrait le client mail. La section #beta
     de l'accueil est devenue une section de telechargement. */

  /* ══════════════════════════ TOGGLE IMMERSION ══════════════════════════ */
  var motionToggle = $('#motionToggle');
  var motionLabel = $('#motionLabel');

  function setFx(on) {
    fxOff = !on;
    document.body.classList.toggle('no-fx', fxOff);
    if (motionLabel) motionLabel.textContent = fxOff ? 'Sobre' : 'Immersion';
    if (fxOff && window.IzenScenes) window.IzenScenes.still();
  }
  if (motionToggle) motionToggle.addEventListener('click', function () { setFx(fxOff); });
  if (reduced) setFx(false);

  /* ══════════════════════════ BOUCLE ══════════════════════════ */
  var telSpeed = $('#teleSpeed');
  var telCap = $('#teleCap');
  var telLean = $('#teleLean');

  var last = performance.now();
  var smoothVel = 0;
  var shownKmh = -1, shownCap = '', shownLean = -999;
  var capBase = 2;

  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // vitesse de scroll lissée -> sensation d'accélération
    smoothVel = lerp(smoothVel, rawVel / Math.max(dt, 0.001), 0.12);
    rawVel *= 0.72;
    state.scrollVel = smoothVel;

    // parallaxe
    state.look.x = lerp(state.look.x, tiltTarget.x, 0.08);
    state.look.y = lerp(state.look.y, tiltTarget.y, 0.08);

    /* ── Carte du hero ── */
    if (road && state.heroRatio > 0.01) {
      var cruise = fxOff ? 0 : 34;
      var push = fxOff ? 0 : clamp(smoothVel * 0.045, 0, 34);
      road.setSpeed(state.live ? cruise + push : 0);
      road.setLook(state.look.x * 0.9, -state.look.y * 0.7);
      road.setFade(clamp(state.heroRatio * 1.25, 0, 1));
      road.render(now / 1000, dt);
    }

    /* ── Scènes canvas ── */
    if (!fxOff && window.IzenScenes) window.IzenScenes.update(dt);

    /* ── Télémétrie ── */
    if (road && telSpeed) {
      var kmh = Math.round(road.getSpeed() * 2.62);
      if (kmh !== shownKmh) {
        shownKmh = kmh;
        telSpeed.textContent = String(kmh);
      }
      var cap = 'N ' + String(Math.round(((capBase + road.getDist() * 0.35) % 360))).padStart(3, '0') + '°';
      if (cap !== shownCap) { shownCap = cap; if (telCap) telCap.textContent = cap; }

      var lean = Math.round(state.look.x * 22 + Math.sin(road.getDist() * 0.02) * 12);
      if (lean !== shownLean) {
        shownLean = lean;
        if (telLean) telLean.textContent = (lean > 0 ? '+' : '') + lean + '°';
      }
    }

    /* ── Rail / odomètre ── */
    if (railFill) railFill.style.height = (state.progress * 100).toFixed(1) + '%';
    if (odoVal) odoVal.textContent = (state.progress * TOTAL_KM).toFixed(1);

    /* ── Nav ── */
    if (nav) nav.classList.toggle('is-stuck', state.scroll > 40);

    /* ── Téléphone 3D ── */
    if (phone) {
      var rx = -phoneTilt.y * 9 + (state.gyro ? -state.look.y * 6 : 0);
      var ry = phoneTilt.x * 13 + (state.gyro ? state.look.x * 8 : 0);
      phone.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      phone.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    }

    requestAnimationFrame(loop);
  }

  /* ══════════════════════════ RESIZE ══════════════════════════ */
  var rzT;
  window.addEventListener('resize', function () {
    clearTimeout(rzT);
    rzT = setTimeout(function () {
      if (road) road.resize();
      if (window.IzenScenes) window.IzenScenes.resize();
      readScroll();
    }, 140);
  });

  reduceMQ.addEventListener && reduceMQ.addEventListener('change', function (e) {
    reduced = e.matches;
    setFx(!reduced);
  });

  /** Rejoue la navigation par fragment, sans animation. */
  function gotoFragment() {
    if (location.hash.length < 2) return;
    var frag = document.querySelector(location.hash);
    if (!frag) return;
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    frag.scrollIntoView();
    root.style.scrollBehavior = prev;
    readScroll();
  }

  /* ══════════════════════════ GO ══════════════════════════ */
  runBoot();
  requestAnimationFrame(loop);

  // Entrée directe : `?go=1`, ou un lien profond vers une section, saute
  // l'écran de contact. Sert aux liens partagés et aux captures de la page.
  var direct = /(?:^|[?&])go=1(?:&|$)/.test(location.search) ||
               (location.hash.length > 1 && location.hash !== '#hero');
  if (direct) {
    boot.classList.add('is-ready');
    launch();

    // Le verrou de scroll de l'écran de contact (`body.is-booting`) absorbe
    // la navigation par fragment du navigateur : on arrive sur le hero au
    // lieu de la section demandée. On la rejoue une fois le verrou levé —
    // en synchrone (pas de rAF : il ne tourne pas dans un onglet masqué),
    // puis à nouveau après `load`, car les images chargées décalent la mise
    // en page au-dessus de la cible.
    gotoFragment();
    window.addEventListener('load', gotoFragment);
  }

  // Les visiteurs qui arrivent déjà scrollés (ancre, rechargement)
  // n'ont pas à repasser par l'écran de contact.
  if (window.scrollY > 200) { boot.classList.add('is-ready'); }
  if (reduced) { boot.classList.add('is-ready'); }
})();
