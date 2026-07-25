/* ============================================================
   IzenRide — Hero WebGL : "La Route"
   Route de nuit infinie, générée en shader (pas de dépendance).
   La caméra suit le pointeur / le gyroscope, la vitesse suit
   le scroll. Fallback CSS si WebGL indisponible.
   ============================================================ */
(function (global) {
  'use strict';

  var VERT = [
    'attribute vec2 aPos;',
    'void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    '',
    'uniform vec2  uRes;',
    'uniform float uTime;',
    'uniform float uDist;',   // distance parcourue (unités monde)
    'uniform vec2  uLook;     ', // parallaxe pointeur/gyro (-1..1)
    'uniform float uFade;',   // 0..1 fondu global
    'uniform float uBoost;',  // 0..1 effet de vitesse
    '',
    'float hash21(vec2 p){',
    '  p = fract(p * vec2(123.34, 456.21));',
    '  p += dot(p, p + 45.32);',
    '  return fract(p.x * p.y);',
    '}',
    '',
    'float noise(vec2 p){',
    '  vec2 i = floor(p); vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  float a = hash21(i);',
    '  float b = hash21(i + vec2(1.0, 0.0));',
    '  float c = hash21(i + vec2(0.0, 1.0));',
    '  float d = hash21(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    '',
    // Position latérale du centre de la route à une distance d.
    'float roadCenter(float d){',
    '  return 2.6 * sin(d * 0.0115) + 1.1 * sin(d * 0.0331) + 0.5 * sin(d * 0.0710);',
    '}',
    '',
    'vec3 sky(vec2 uv, float horizon){',
    '  float h = clamp((uv.y - horizon) / 0.80, 0.0, 1.0);',
    '  vec3 top = vec3(0.017, 0.021, 0.042);',
    '  vec3 mid = vec3(0.040, 0.056, 0.104);',
    '  vec3 low = vec3(0.088, 0.116, 0.192);',
    '  vec3 c = mix(low, mid, smoothstep(0.0, 0.34, h));',
    '  c = mix(c, top, smoothstep(0.30, 1.0, h));',
    '',
    // étoiles
    '  vec2 sp = uv * 88.0;',
    '  float s = hash21(floor(sp));',
    '  float star = step(0.9958, s);',
    '  float tw = 0.55 + 0.45 * sin(uTime * 2.2 + s * 71.0);',
    '  float dd = length(fract(sp) - 0.5);',
    '  c += star * tw * (1.0 - smoothstep(0.0, 0.40, dd))',
    '       * vec3(0.72, 0.80, 1.0)',
    '       * smoothstep(horizon + 0.02, horizon + 0.42, uv.y);',
    '',
    // halo d'horizon (lueur des villes au loin)
    '  float g = exp(-abs(uv.y - horizon) * 12.0);',
    '  c += g * vec3(0.10, 0.19, 0.40) * 0.9;',
    '',
    // voile atmosphérique animé
    '  float n = noise(vec2(uv.x * 2.1 + uTime * 0.025, uv.y * 3.4));',
    '  c += n * exp(-abs(uv.y - horizon - 0.20) * 5.0) * vec3(0.05, 0.09, 0.19);',
    '  return c;',
    '}',
    '',
    'vec3 road(vec2 uv, float horizon){',
    '  float z  = 0.9 / max(horizon - uv.y, 0.0006);',
    '  float zz = z + uDist;',
    '  float cx = roadCenter(zz) - roadCenter(uDist);',
    '  float lane = uv.x * z * 1.7 - cx + uLook.x * 0.7;',
    '',
    '  float fog = exp(-z * 0.017);',
    // largeur d'un pixel exprimée en unités "lane" -> anti-aliasing analytique
    '  float w = (1.7 / uRes.y) * z * 1.7 + 0.004;',
    '',
    '  float halfW = 4.2;',
    // NB : tous les smoothstep sont écrits edge0 < edge1 puis inversés —
    // la forme « décroissante » (edge0 > edge1) est indéfinie par la spec GLSL.
    '  float onRoad = 1.0 - smoothstep(halfW - 0.15, halfW + 0.9, abs(lane));',
    '',
    // asphalte + bas-côté
    '  float gr = noise(vec2(lane * 6.5, zz * 2.8)) * 0.5 + noise(vec2(lane * 21.0, zz * 10.0)) * 0.25;',
    '  vec3 asphalt = vec3(0.052, 0.059, 0.077) + gr * 0.042;',
    '  float gn = noise(vec2(lane * 1.1, zz * 0.7));',
    '  vec3 ground = vec3(0.026, 0.032, 0.048) + gn * 0.030;',
    '  vec3 col = mix(ground, asphalt, onRoad);',
    '',
    // marquages : axe pointillé + rives continues
    '  float dash   = step(0.5, fract(zz * 0.16));',
    '  float center = (1.0 - smoothstep(0.13 - w, 0.13 + w, abs(lane))) * dash;',
    '  float edge   = 1.0 - smoothstep(0.12 - w, 0.12 + w, abs(abs(lane) - 3.55));',
    '  col = mix(col, vec3(0.80, 0.84, 0.93), clamp((center + edge) * onRoad, 0.0, 1.0) * 0.88);',
    '',
    // faisceau du phare
    '  float beam = (1.0 - smoothstep(0.0, 5.2, abs(lane))) * exp(-z * 0.050);',
    '  col += beam * vec3(0.52, 0.57, 0.70) * 0.55;',
    '  col += (1.0 - smoothstep(0.0, 2.4, abs(lane))) * exp(-z * 0.145) * vec3(0.28, 0.32, 0.40);',
    '',
    // trace GPS IzenRide : ruban néon pulsé
    '  float trace = 1.0 - smoothstep(0.0, 0.30 + w * 3.0, abs(lane));',
    '  float pulse = 0.42 + 0.58 * pow(max(sin(zz * 0.55 - uTime * 5.0), 0.0), 6.0);',
    '  col += trace * pulse * vec3(0.17, 0.41, 0.95) * 1.45 * fog;',
    '  col += (1.0 - smoothstep(0.0, 1.6, abs(lane))) * 0.10 * vec3(0.09, 0.24, 0.62) * fog;',
    '',
    // balises latérales (réseau communautaire)
    '  float post = step(0.935, fract(zz * 0.045));',
    '  float side = 1.0 - smoothstep(0.0, 0.22, abs(abs(lane) - 4.9));',
    '  col += post * side * vec3(0.33, 0.54, 1.0) * 1.7 * fog;',
    '',
    // brume de distance
    '  col = mix(vec3(0.052, 0.080, 0.152), col, clamp(fog, 0.0, 1.0));',
    '  return col;',
    '}',
    '',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;',
    '  float horizon = 0.10 + uLook.y * 0.05;',
    '',
    '  vec3 col = (uv.y > horizon) ? sky(uv, horizon) : road(uv, horizon);',
    '',
    // poussière happée par la vitesse : de courts éclats qui tombent
    // le long d'un bandeau au-dessus de l'horizon (pas des colonnes pleines)
    '  if (uv.y > horizon) {',
    '    float band = uv.y - horizon;',
    '    float ci   = floor(uv.x * 96.0);',
    '    float sd   = hash21(vec2(ci, 3.7));',
    '    float ph   = fract(sd * 7.13 + uTime * (0.7 + sd * 1.5));',
    '    float yP   = 0.30 - ph * 0.28;',
    '    float streak = exp(-abs(band - yP) * 240.0) * (1.0 - ph) * step(0.55, sd);',
    '    col += uBoost * streak * vec3(0.26, 0.40, 0.72);',
    '  }',
    '',
    // vignettage + grain
    '  float v = 1.0 - dot(uv, uv) * 0.40;',
    '  col *= clamp(v, 0.0, 1.0);',
    '  col += (hash21(gl_FragCoord.xy + uTime) * 2.0 - 1.0) * 0.016;',
    '',
    '  col *= uFade;',
    '  gl_FragColor = vec4(max(col, 0.0), 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('[IzenRide GL]', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @returns {{render:Function, resize:Function, setSpeed:Function,
   *            setLook:Function, setFade:Function, ok:boolean}|null}
   */
  function createRoad(canvas) {
    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
          || canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
    if (!gl) return null;

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[IzenRide GL]', gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    var U = {
      res:   gl.getUniformLocation(prog, 'uRes'),
      time:  gl.getUniformLocation(prog, 'uTime'),
      dist:  gl.getUniformLocation(prog, 'uDist'),
      look:  gl.getUniformLocation(prog, 'uLook'),
      fade:  gl.getUniformLocation(prog, 'uFade'),
      boost: gl.getUniformLocation(prog, 'uBoost')
    };

    var W = 1, H = 1;
    var dist = 0;          // distance monde cumulée
    var speed = 0;         // vitesse courante (unités/s)
    var targetSpeed = 0;
    var lookX = 0, lookY = 0;
    var tgtLookX = 0, tgtLookY = 0;
    var fade = 1;
    var boost = 0;

    function resize() {
      var dpr = Math.min(global.devicePixelRatio || 1, 1.75);
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
        gl.viewport(0, 0, W, H);
      }
    }

    /** @param {number} t temps global (s) @param {number} dt delta (s) */
    function render(t, dt) {
      // inerties : la moto ne change pas d'allure instantanément
      speed += (targetSpeed - speed) * Math.min(1, dt * 1.6);
      dist += speed * dt;
      lookX += (tgtLookX - lookX) * Math.min(1, dt * 3.2);
      lookY += (tgtLookY - lookY) * Math.min(1, dt * 3.2);
      boost += (Math.min(1, targetSpeed / 90) - boost) * Math.min(1, dt * 2);

      gl.uniform2f(U.res, W, H);
      gl.uniform1f(U.time, t);
      gl.uniform1f(U.dist, dist);
      gl.uniform2f(U.look, lookX, lookY);
      gl.uniform1f(U.fade, fade);
      gl.uniform1f(U.boost, boost);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    resize();

    return {
      ok: true,
      resize: resize,
      render: render,
      setSpeed: function (v) { targetSpeed = v; },
      /** vitesse instantanée lissée — sert à alimenter le compteur HUD */
      getSpeed: function () { return speed; },
      getDist: function () { return dist; },
      setLook: function (x, y) { tgtLookX = x; tgtLookY = y; },
      setFade: function (v) { fade = v; }
    };
  }

  global.IzenRoad = { create: createRoad };
})(window);
