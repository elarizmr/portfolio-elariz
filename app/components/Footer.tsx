'use client';

import { useEffect, useRef, useState } from 'react';

const LOGO_TEXT = 'ElarizR';

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#F4EEE2] pt-14 md:pt-20 pb-10 md:pb-12 px-4 md:px-6 overflow-hidden">
      <div ref={ref} className="flex justify-center select-none" aria-label={LOGO_TEXT}>
        {LOGO_TEXT.split('').map((letter, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="text-[#E8501A] font-black tracking-tighter leading-none"
            style={{
              fontSize: 'clamp(3rem, 17vw, 14rem)',
              display: 'inline-block',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(-120px)',
              transition: `transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.08}s, opacity 0.5s ease ${i * 0.08}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      <p className="max-w-xs sm:max-w-lg md:max-w-3xl mx-auto text-center text-[#4a4a4a] text-sm md:text-lg mt-8 md:mt-10 leading-relaxed">
        Elariz Recebov — a front-end developer building responsive, high-performance
        web applications with React, Next.js and TypeScript. This website brings
        together my projects, experience, and contact details in one place.
      </p>

      <div className="text-center mt-8 md:mt-12 text-xs md:text-sm text-[#8a8a8a]">
        © 2026 Elariz Recebov — All rights reserved.
      </div>

      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-5 right-5 md:bottom-8 md:right-8 w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#E8501A] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition z-40"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:w-[22px] md:h-[22px]">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </footer>
  );
}