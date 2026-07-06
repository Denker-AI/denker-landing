"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";

const MAX_COLORS = 8;

const FRAGMENT_SHADER = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uOffset;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uOffset;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  } else {
    vec2 s = q;
    for (int k = 0; k < 3; ++k) {
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float m = mix(m0, m1, kMix);
      col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
    }
    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
  }

  col *= uIntensity;

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = (uTransparent > 0) ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}
`;

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

type ColorBendsProps = {
  className?: string;
  style?: CSSProperties;
  rotation?: number;
  autoRotate?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  offset?: [number, number];
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  iterations?: number;
  intensity?: number;
  bandWidth?: number;
};

const FALLBACK_COLOR = new THREE.Vector3(0.106, 0.596, 0.278);

function hexToVector3(hex: string) {
  const value = hex.replace("#", "").trim();
  const channels =
    value.length === 3
      ? [
          parseInt(value[0] + value[0], 16),
          parseInt(value[1] + value[1], 16),
          parseInt(value[2] + value[2], 16),
        ]
      : [
          parseInt(value.slice(0, 2), 16),
          parseInt(value.slice(2, 4), 16),
          parseInt(value.slice(4, 6), 16),
        ];

  if (channels.some((channel) => Number.isNaN(channel))) {
    return FALLBACK_COLOR.clone();
  }

  return new THREE.Vector3(
    channels[0] / 255,
    channels[1] / 255,
    channels[2] / 255,
  );
}

export function ColorBends({
  className = "",
  style,
  rotation = 90,
  speed = 0.2,
  colors = [],
  transparent = true,
  autoRotate = 0,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  offset = [0, 0],
  mouseInfluence = 1,
  parallax = 0.5,
  noise = 0.15,
  iterations = 1,
  intensity = 1.5,
  bandWidth = 6,
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rotationRef = useRef(rotation);
  const autoRotateRef = useRef(autoRotate);
  const pointerTargetRef = useRef(new THREE.Vector2(0, 0));
  const pointerCurrentRef = useRef(new THREE.Vector2(0, 0));
  const pointerSmoothRef = useRef(8);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const colorUniforms = Array.from(
      { length: MAX_COLORS },
      () => new THREE.Vector3(0, 0, 0),
    );
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: 0.2 },
        uRot: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: colorUniforms },
        uTransparent: { value: 1 },
        uScale: { value: 1 },
        uFrequency: { value: 1 },
        uWarpStrength: { value: 1 },
        uOffset: { value: new THREE.Vector2(0, 0) },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: 1 },
        uParallax: { value: 0.5 },
        uNoise: { value: 0.15 },
        uIterations: { value: 1 },
        uIntensity: { value: 1.5 },
        uBandWidth: { value: 6 },
      },
      premultipliedAlpha: true,
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      });
    } catch {
      container.dataset.webgl = "unavailable";
      geometry.dispose();
      material.dispose();
      materialRef.current = null;
      return;
    }

    container.dataset.webgl = "available";
    rendererRef.current = renderer;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const handleResize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      material.uniforms.uCanvas.value.set(width, height);
    };

    handleResize();

    const ResizeObserverCtor = globalThis.ResizeObserver;
    if (ResizeObserverCtor) {
      const resizeObserver = new ResizeObserverCtor(handleResize);
      resizeObserver.observe(container);
      resizeObserverRef.current = resizeObserver;
    } else {
      globalThis.addEventListener("resize", handleResize);
    }

    const clock = new THREE.Clock();
    const loop = () => {
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;
      material.uniforms.uTime.value = elapsed;

      const degrees = (rotationRef.current % 360) + autoRotateRef.current * elapsed;
      const radians = (degrees * Math.PI) / 180;
      material.uniforms.uRot.value.set(Math.cos(radians), Math.sin(radians));

      const current = pointerCurrentRef.current;
      const target = pointerTargetRef.current;
      current.lerp(target, Math.min(1, delta * pointerSmoothRef.current));
      material.uniforms.uPointer.value.copy(current);

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      } else {
        globalThis.removeEventListener("resize", handleResize);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      materialRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const material = materialRef.current;
    const renderer = rendererRef.current;
    if (!material) return;

    rotationRef.current = rotation;
    autoRotateRef.current = autoRotate;
    material.uniforms.uSpeed.value = speed;
    material.uniforms.uScale.value = scale;
    material.uniforms.uFrequency.value = frequency;
    material.uniforms.uWarpStrength.value = warpStrength;
    material.uniforms.uOffset.value.set(offset[0], offset[1]);
    material.uniforms.uMouseInfluence.value = mouseInfluence;
    material.uniforms.uParallax.value = parallax;
    material.uniforms.uNoise.value = noise;
    material.uniforms.uIterations.value = Math.max(1, Math.min(5, iterations));
    material.uniforms.uIntensity.value = intensity;
    material.uniforms.uBandWidth.value = bandWidth;

    const nextColors = colors.filter(Boolean).slice(0, MAX_COLORS).map(hexToVector3);
    for (let i = 0; i < MAX_COLORS; i += 1) {
      const vector = material.uniforms.uColors.value[i] as THREE.Vector3;
      if (i < nextColors.length) {
        vector.copy(nextColors[i]);
      } else {
        vector.set(0, 0, 0);
      }
    }
    material.uniforms.uColorCount.value = nextColors.length;
    material.uniforms.uTransparent.value = transparent ? 1 : 0;
    renderer?.setClearColor(0x000000, transparent ? 0 : 1);
  }, [
    autoRotate,
    bandWidth,
    colors,
    frequency,
    intensity,
    iterations,
    mouseInfluence,
    noise,
    offset,
    parallax,
    rotation,
    scale,
    speed,
    transparent,
    warpStrength,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const y = -(((event.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      pointerTargetRef.current.set(x, y);
    };

    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`color-bends-container ${className}`.trim()}
      style={style}
    />
  );
}
