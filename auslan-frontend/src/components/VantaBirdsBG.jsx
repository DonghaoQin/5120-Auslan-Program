// src/components/VantaBirdsBG.jsx
import { useEffect, useRef } from "react";

// 动态加载脚本（若已加载则直接 resolve）
const loadScript = (src) =>
  new Promise((res, rej) => {
    const exists = Array.from(document.scripts).some((s) => s.src.includes(src));
    if (exists) return res();
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => res();
    el.onerror = () => rej(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });

export default function VantaBirdsBG({
  // 颜色必须是 Number（0xRRGGBB），不要写成字符串
  color1 = 0xff6600,
  color2 = 0xff00ff,
  backgroundColor = 0x0a1f2f,
  backgroundAlpha = 0.85,

  // 密度：越小的 birdSize + 越高的 quantity → 视觉更密集
  quantity = 5,
  birdSize = 0.8,
  wingSpan = 25,
  speedLimit = 4.0,
  separation = 18,
  alignment = 28,
  cohesion = 28,

  minHeight = 280,
}) {
  const ref = useRef(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const ensureInit = async () => {
      const el = ref.current;
      if (!el) return;

      // 容器兜底：撑满父级
      el.style.position = "absolute";
      el.style.inset = "0";
      el.style.minHeight = `${minHeight}px`;
      el.style.pointerEvents = "none";
      el.style.zIndex = "0";

      // 如果外部没在 index.html 里预载，就自行懒加载
      if (!window.THREE) {
        await loadScript("https://cdn.jsdelivr.net/npm/three@0.137.5/build/three.min.js");
      }
      if (!window.VANTA?.BIRDS) {
        await loadScript("https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.birds.min.js");
      }

      if (cancelled) return;

      const prefersReduced =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 先销毁旧实例，避免残留
      if (vantaRef.current?.destroy) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }

      if (!prefersReduced && window.VANTA?.BIRDS && window.THREE) {
        // 若父容器尺寸为 0，延迟到下一帧再初始化
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          requestAnimationFrame(ensureInit);
          return;
        }

        vantaRef.current = window.VANTA.BIRDS({
          el,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight,
          minWidth: 200,
          scale: 1.0,
          scaleMobile: 1.0,

          backgroundColor,
          backgroundAlpha,
          color1,
          color2,
          quantity: Math.max(1, Math.min(5, quantity)),
          birdSize: Math.max(0.4, birdSize),
          wingSpan,
          speedLimit,
          separation,
          alignment,
          cohesion,
        });
      }
    };
    

    ensureInit();

    // 尺寸变化时重建（有些环境下 Vanta 不会自动适配）
    const ro = new ResizeObserver(() => {
      if (vantaRef.current?.destroy) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
      ensureInit();
    });
    if (ref.current?.parentElement) ro.observe(ref.current.parentElement);

    return () => {
      cancelled = true;
      ro.disconnect();
      if (vantaRef.current?.destroy) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [
    color1,
    color2,
    backgroundColor,
    backgroundAlpha,
    quantity,
    birdSize,
    wingSpan,
    speedLimit,
    separation,
    alignment,
    cohesion,
    minHeight,
  ]);

  return <div ref={ref} aria-hidden />;
}
