'use client';

import { useEffect, useRef, useState } from 'react';

const SCROLL_RANGE = 500;
const SMOOTHING = 0.16;

export default function MorphingLogo() {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduceMotion ? 1 : SMOOTHING;

    const geo = { startX: 0, startY: 0, endX: 0, endY: 0, endScale: 1 };
    const readProgress = () => Math.min(Math.max(window.scrollY / SCROLL_RANGE, 0), 1);

    let target = readProgress();
    let current = target;
    let raf = 0;

    const apply = () => {
      const x = geo.startX + (geo.endX - geo.startX) * current;
      const y = geo.startY + (geo.endY - geo.startY) * current;
      const s = 1 + (geo.endScale - 1) * current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    };

    const measure = () => {
      const slot = document.getElementById('logo-slot');
      if (!slot) return;

      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;

      const startFont = vw * (vw < 768 ? 0.11 : 0.085);
      el.style.fontSize = `${startFont}px`;
      const w = el.offsetWidth;
      const h = el.offsetHeight;

      const rect = slot.getBoundingClientRect();
      const endFont = parseFloat(window.getComputedStyle(slot).fontSize);
      const endScale = endFont / startFont;

      geo.endScale = endScale;
      geo.startX = (vw - w) / 2;
      geo.startY = vh * 0.5 - h / 2;
      geo.endX = rect.left;
      geo.endY = rect.top + rect.height / 2 - (h * endScale) / 2;

      apply();
      setReady(true);
    };

    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0005) {
        current = target;
        apply();
        raf = 0;
        return;
      }
      current += diff * ease;
      apply();
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    document.fonts?.ready.then(measure);

    const slot = document.getElementById('logo-slot');
    const observer = slot ? new ResizeObserver(measure) : null;
    if (slot && observer) observer.observe(slot);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      observer?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <a
      ref={logoRef}
      href="#home"
      className="fixed top-0 left-0 z-[60] w-max origin-top-left leading-none select-none whitespace-nowrap tracking-tighter font-black text-white"
      style={{ opacity: ready ? 1 : 0 }}
    >
      ElarizR
    </a>
  );
}