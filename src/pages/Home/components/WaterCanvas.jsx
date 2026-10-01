import { useEffect, useRef } from "react";

const DURATION = 1300; // ms, keep LOCK_MS in useClipNavigation slightly higher

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform float uDir;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uSizeFrom;
uniform vec2 uSizeTo;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

// object-fit: cover for a texture of size "tex"
vec2 cover(vec2 uv, vec2 tex) {
  float rs = uRes.x / uRes.y;
  float ts = tex.x / tex.y;
  vec2 s = rs > ts ? vec2(1.0, ts / rs) : vec2(rs / ts, 1.0);
  return (uv - 0.5) * s + 0.5;
}

// Decides WHERE the new video shows up first.
// Streaks stretched vertically = water running down glass,
// beads = small droplets, sweep = wet front moving top to bottom.
float field(vec2 uv) {
  float aspect = uRes.x / uRes.y;
  float sweep = uDir > 0.0 ? 1.0 - uv.y : uv.y;
  float streaks = fbm(vec2(uv.x * aspect * 9.0, uv.y * 2.2));
  float beads = noise(vec2(uv.x * aspect, uv.y) * 38.0);
  return sweep * 0.45 + streaks * 0.45 + beads * 0.10;
}

void main() {
  float p = uProgress;
  float w = 0.08; // softness of the wet edge
  float thresh = mix(-w, 1.0 + w, p);

  float m = field(vUv);
  float e = 0.004;
  vec2 grad = vec2(field(vUv + vec2(e, 0.0)) - m,
                   field(vUv + vec2(0.0, e)) - m) / e;

  float r = smoothstep(-w, w, thresh - m); // 0 = old video, 1 = new video
  float band = 4.0 * r * (1.0 - r);        // peaks on the wet edge

  // refraction: the glass bends the picture along the edge
  vec2 shift = grad * band * 0.003;

  // gentle ripple over the whole pane while it runs
  float run = sin(3.14159 * p);
  shift += run * 0.004 * vec2(sin(vUv.y * 40.0 + uTime * 3.0),
                              cos(vUv.x * 30.0 + uTime * 2.0));

  vec3 a = texture2D(uFrom, cover(vUv + shift, uSizeFrom)).rgb;
  vec3 b = texture2D(uTo, cover(vUv + shift, uSizeTo)).rgb;

  vec3 col = mix(a, b, r);
  col += band * band * 0.06; // faint light glint on the water

  gl_FragColor = vec4(col, 1.0);
}`;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
  }
  return s;
}

function makeTexture(gl) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
    gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255])
  );
  return t;
}

function getVideo(map, clips, i) {
  if (!map.has(i)) {
    const v = document.createElement("video");
    v.crossOrigin = "anonymous"; // needed if videos come from a CDN
    v.muted = true;
    v.setAttribute("muted", "");
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = clips[i].desktop;
    map.set(i, v);
  }
  return map.get(i);
}

export default function WaterCanvas({ clips, activeIndex }) {
  const canvasRef = useRef(null);
  const videos = useRef(new Map());
  const state = useRef({
    from: activeIndex,
    to: activeIndex,
    dir: 1,
    start: 0,
    running: false,
  });

  // React to clip changes: start a transition and manage the video pool
  useEffect(() => {
    const s = state.current;
    const n = clips.length;

    if (activeIndex !== s.to) {
      s.from = s.to;
      s.dir = (activeIndex - s.to + n) % n === 1 ? 1 : -1;
      s.to = activeIndex;
      s.start = performance.now();
      s.running = true;
    }

    const v = getVideo(videos.current, clips, activeIndex);
    v.currentTime = 0;
    v.play().catch(() => {});

    const next = (activeIndex + 1) % n;
    const prev = (activeIndex - 1 + n) % n;
    getVideo(videos.current, clips, next); // preload neighbours
    getVideo(videos.current, clips, prev);

    const keep = new Set([activeIndex, s.from, next, prev]);
    videos.current.forEach((vid, i) => {
      if (!keep.has(i)) {
        vid.pause();
        vid.removeAttribute("src");
        vid.load();
        videos.current.delete(i);
      }
    });
  }, [activeIndex, clips]);

  // Free every video on unmount
  useEffect(() => {
    const pool = videos.current;
    return () => {
      pool.forEach((vid) => {
        vid.pause();
        vid.removeAttribute("src");
        vid.load();
      });
      pool.clear();
    };
  }, []);

  // WebGL setup and render loop (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) return; // poster background stays visible as a fallback

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (name) => gl.getUniformLocation(program, name);
    const uni = {
      from: U("uFrom"), to: U("uTo"), progress: U("uProgress"),
      dir: U("uDir"), time: U("uTime"), res: U("uRes"),
      sizeFrom: U("uSizeFrom"), sizeTo: U("uSizeTo"),
    };
    gl.uniform1i(uni.from, 0);
    gl.uniform1i(uni.to, 1);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const texFrom = makeTexture(gl);
    const texTo = makeTexture(gl);

    let sizeFrom = [16, 9];
    let sizeTo = [16, 9];
    let hasFrame = false;
    let raf = 0;

    const upload = (tex, unit, v) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (v.readyState >= 2 && v.videoWidth) {
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v
        );
        return [v.videoWidth, v.videoHeight];
      }
      return null;
    };

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      const s = state.current;

      // keep the canvas sharp but cheap (DPR capped at 1.5)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      const vTo = getVideo(videos.current, clips, s.to);

      // hold at 0 until the incoming clip has a frame, so it never pops
      if (s.running && vTo.readyState < 2) s.start = now;

      let p = 1;
      if (s.running) {
        const t = Math.min(1, (now - s.start) / DURATION);
        p = ease(t);
        if (t >= 1) {
          s.running = false;
          s.from = s.to;
          p = 1;
          const old = videos.current.get(s.from === s.to ? -1 : s.from);
          if (old) old.pause();
        }
      }

      const toSize = upload(texTo, 1, vTo);
      if (toSize) {
        sizeTo = toSize;
        hasFrame = true;
      }
      if (s.running) {
        const vFrom = getVideo(videos.current, clips, s.from);
        const fromSize = upload(texFrom, 0, vFrom);
        if (fromSize) sizeFrom = fromSize;
      }
      if (!hasFrame) return;

      gl.uniform1f(uni.progress, p);
      gl.uniform1f(uni.dir, s.dir);
      gl.uniform1f(uni.time, now / 1000);
      gl.uniform2f(uni.res, canvas.width, canvas.height);
      gl.uniform2f(uni.sizeFrom, sizeFrom[0], sizeFrom[1]);
      gl.uniform2f(uni.sizeTo, sizeTo[0], sizeTo[1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteTexture(texFrom);
      gl.deleteTexture(texTo);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [clips]);

  return (
    <div
      className="absolute inset-0 z-0 bg-black bg-cover bg-center"
      style={{ backgroundImage: `url(${clips[activeIndex].poster})` }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}