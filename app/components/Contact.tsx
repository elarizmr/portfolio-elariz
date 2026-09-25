'use client';

import { useEffect, useRef, useState } from 'react';

const EMAIL = 'elarizreceb@gmail.com';

const RAMP = [' ', '.', ':', '-', '+', '*', '#', '@'];

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const FONT_PX = 14;
const LINE_PX = 18;
const CHAR_W = FONT_PX * 0.6;

function AsciiField() {
  const boxRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const pre = preRef.current;
    if (!box || !pre) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let last = 0;

    const draw = (t: number) => {
      const lines: string[] = [];
      for (let r = 0; r < rows; r++) {
        let line = '';
        for (let c = 0; c < cols; c++) {
          const v =
            (Math.sin(c * 0.07 + t * 0.0004) +
              Math.sin(r * 0.16 - t * 0.0005) +
              Math.sin((c + r * 2) * 0.05 + t * 0.0003) +
              Math.sin(Math.hypot(c - cols * 0.5, (r - rows * 0.5) * 2) * 0.09 - t * 0.0006) +
              4) /
            8;

          const b = Math.pow(v, 2.6) * 1.5;
          const bayer = (BAYER4[r % 4][c % 4] + 0.5) / 16 - 0.5;
          let idx = Math.round(b * (RAMP.length - 1) + bayer);
          idx = Math.max(0, Math.min(RAMP.length - 1, idx));
          line += RAMP[idx];
        }
        lines.push(line);
      }
      pre.textContent = lines.join('\n');
    };

    const resize = () => {
      cols = Math.ceil(box.clientWidth / CHAR_W) + 1;
      rows = Math.ceil(box.clientHeight / LINE_PX) + 1;
      draw(performance.now());
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 120) return;
      last = t;
      draw(t);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduceMotion) raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <pre
        ref={preRef}
        className="font-mono text-[#E8501A] opacity-40 whitespace-pre m-0"
        style={{ fontSize: FONT_PX, lineHeight: `${LINE_PX}px` }}
      />
    </div>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="bg-[#F4EEE2] p-3 md:p-5">
      <div className="relative w-full min-h-[80vh] flex items-center py-24 px-6 bg-[#F7C8C4] overflow-hidden rounded-[36px] md:rounded-[48px]">
      <AsciiField />

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <p className="text-[#E8501A] text-base md:text-lg mb-10">
          Collaborations, freelance projects or inquiries — drop me a line.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <h3 className="text-[#E8501A] font-extrabold tracking-tight text-3xl md:text-6xl break-all">
            {EMAIL}
          </h3>

          <button
            onClick={handleCopy}
            aria-label="Copy email"
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#FBE0DE] border border-white/80 hover:bg-white transition"
          >
            {copied ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 mt-14">
          <a href="https://wa.me/994505083281" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#E8501A">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.42-4.4-1.15l-.32-.19-3.01.79.8-2.93-.2-.3A7.94 7.94 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.98c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4-.14 0-.3-.02-.46-.02s-.42.06-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28z" />
            </svg>
          </a>
          <a href="https://github.com/elarizmr" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#E8501A">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/elariz-recebov" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#E8501A">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 11.02-4.12 2.06 2.06 0 01-.02 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}