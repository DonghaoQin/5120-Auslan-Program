// auslan-frontend/src/components/RibbonWave.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  /** 2~10 个颜色，自动补齐并首尾无缝过渡 */
  colors?: string[];
  /** 运动速度 */
  speed?: number;
  /** 起伏强度 */
  amplitude?: number;
  /** 噪声强度 */
  noise?: number;
  /** 整体透明度（与带宽 alpha 相乘） */
  opacity?: number;
  /** 彩带条数（最多 10 条） */
  count?: number;
};

const MAX_COLS = 10;
const DEFAULT_COLORS = ["#FF6FD8", "#FFB86C", "#7AF6FF", "#9B6CFF"];

export default function RibbonWave({
  colors = DEFAULT_COLORS,
  speed = 0.6,
  amplitude = 0.25,
  noise = 0.5,
  opacity = 1.0,
  count = 3,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 颜色补齐到固定长度，避免 shader 读取越界
    const src = colors.length > 0 ? colors : DEFAULT_COLORS;
    const paddedColors: THREE.Color[] = [];
    for (let i = 0; i < MAX_COLS; i++) {
      const pick = src[Math.min(i, src.length - 1)];
      paddedColors.push(new THREE.Color(pick));
    }

    const uniforms = {
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(1, 1) },
      u_amp: { value: amplitude },
      u_speed: { value: speed },
      u_noise: { value: noise },
      u_opacity: { value: opacity },
      u_colors: { value: paddedColors },
      u_count: { value: Math.min(src.length, MAX_COLS) },
      u_bands: { value: Math.min(Math.max(1, count), 10) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float u_time;
        uniform vec2  u_res;
        uniform float u_amp;
        uniform float u_speed;
        uniform float u_noise;
        uniform float u_opacity;
        uniform vec3  u_colors[${MAX_COLS}];
        uniform int   u_count;
        uniform int   u_bands;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
        }
        float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0,0.0));
          float c = hash(i + vec2(0.0,1.0));
          float d = hash(i + vec2(1.0,1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
        }
        float fbm(vec2 p){
          float v=0.0;
          float a=0.5;
          for(int i=0;i<5;i++){
            v+=a*noise(p);
            p*=2.0;
            a*=0.5;
          }
          return v;
        }

        // 无缝调色板：最后一个到第一个也平滑过渡
        vec3 paletteWrap(float t){
          int cnt = max(u_count, 1);
          float seg = float(cnt);
          float x = fract(t) * seg;         // [0, cnt)
          int i0 = int(floor(x));           // 0..cnt-1
          int i1 = (i0 + 1) % cnt;          // wrap 到 0
          float f = fract(x);
          return mix(u_colors[i0], u_colors[i1], f);
        }

        void main(){
          vec2 uv = vUv;
          float t = u_time * u_speed;

          // 累计颜色与透明度（非带区完全透明，不遮住底色）
          vec3 accCol = vec3(0.0);
          float accA  = 0.0;

          // 最多 10 条带（由 u_bands 控制实际数量）
          for (int i=0; i<10; i++) {
            if (i >= u_bands) break;

            // 每条带的竖直偏移与相位微差
            float offset = (float(i) - float(u_bands-1)*0.5) * 0.14;
            float wave = sin(uv.x*6.0 + t + float(i)*1.2)*0.5 +
                         sin(uv.x*3.0 - t*1.1 + float(i))*0.3 +
                         fbm(uv*3.0 + t*0.2 + float(i))*u_noise;
            wave *= u_amp;

            // 带宽与边缘（0.20~0.24 越大越宽）
            float dist = abs(uv.y - 0.5 - offset - wave*0.8);
            float band = smoothstep(0.15, 0.0, dist);

            // 无缝取色；不同带做相位偏移
            vec3 bandCol = paletteWrap(uv.x + float(i)*0.18);

            // 以 band 作为该带的 alpha，把颜色与透明度叠加
            accCol = mix(accCol, bandCol, band);
            accA   = max(accA, band);
          }

          gl_FragColor = vec4(accCol, accA * u_opacity);
        }
      `,
      uniforms,
      transparent: true,
    });

    const geo = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      (uniforms.u_res.value as THREE.Vector2).set(w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    window.addEventListener("resize", resize);

    // 系统偏好“减少动效”时只渲染一帧
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = performance.now();
    const loop = () => {
      if (!prefersReduced) {
        (uniforms.u_time as any).value = (performance.now() - start) / 1000;
        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(loop);
      } else {
        (uniforms.u_time as any).value = 0.0;
        renderer.render(scene, camera);
      }
    };
    loop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      renderer.dispose();
      geo.dispose();
      material.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [colors, speed, amplitude, noise, opacity, count]);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden
    />
  );
}
