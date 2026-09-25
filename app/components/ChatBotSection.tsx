'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  '• Who is Elariz?',
  '• Skills & tools',
  '• Featured projects',
  '• Experience',
  '• Hire / Contact',
];

const TOPICS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['contact', 'hire', 'email', 'phone', 'reach', 'linkedin', 'github'],
    answer:
      'Email: elarizreceb@gmail.com\nPhone: +994 50 508 32 81\nLinkedIn: linkedin.com/in/elariz-recebov\nGitHub: github.com/elarizmr',
  },
  {
    keywords: ['skill', 'tool', 'stack', 'tech', 'react', 'next', 'typescript', 'tailwind'],
    answer:
      'Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3\nFront-end: React.js, Next.js (App Router, SSR), Redux Toolkit, TanStack Query\nBack-end: Node.js, Express.js, MongoDB, Mongoose, REST APIs, Firebase, Strapi\nStyling: Tailwind CSS, Bootstrap, Shadcn/ui\nTools: Git, GitHub, Postman, Figma, Vercel, Netlify',
  },
  {
    keywords: ['experience', 'freelance', 'job', 'career', 'client'],
    answer:
      "Since 2024 I've worked as a freelance front-end developer. I build web apps, e-commerce platforms and news portals for clients, turn Figma designs into pixel-perfect responsive pages, integrate APIs and headless CMSs (Strapi, Sanity), and speed up sites with image optimization and code splitting.",
  },
  {
    keywords: ['project', 'portfolio', 'demo', 'built', 'build'],
    answer:
      "I've built and deployed full-stack apps, including a Spotify-style music platform, an e-commerce store and a React/Strapi app. Live demos and source code are in the Portfolio section of this site.",
  },
  {
    keywords: ['education', 'study', 'university', 'college', 'school', 'academy', 'degree'],
    answer:
      'I studied Software Engineering for Automated Systems and Computing at the College of Western Caspian University, and completed a Frontend Development course at Code Academy.',
  },
  {
    keywords: ['language', 'english', 'russian', 'azerbaijani', 'speak'],
    answer: 'Azerbaijani (native), English (elementary), Russian (beginner).',
  },
  {
    keywords: ['who', 'yourself', 'introduce', 'elariz', 'recebov'],
    answer:
      "I'm Elariz Recebov, a front-end developer from Baku, Azerbaijan. I build responsive, high-performance web apps with React.js, Next.js and TypeScript, and I also work across the MERN stack with Node.js, Express.js and MongoDB.",
  },
];

const FALLBACK =
  "I can tell you about my skills, projects, experience, education, languages, or how to contact me. What would you like to know?";

function getAnswer(text: string) {
  const q = text.toLowerCase();
  const topic = TOPICS.find((t) => t.keywords.some((k) => q.includes(k)));
  return topic ? topic.answer : FALLBACK;
}

const RAMP = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const COLS = 110;
const ROWS = 64;
const CHAR_W = 0.6;
const UNIT = 2.6 / ROWS;
const Y_CENTER = -0.3;

const LIGHT = (() => {
  const x = -0.45, y = 0.55, z = 0.7;
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
})();

function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

function smax(a: number, b: number, k: number) {
  return -smin(-a, -b, k);
}

function sdEllipsoid(x: number, y: number, z: number, rx: number, ry: number, rz: number) {
  const k0 = Math.hypot(x / rx, y / ry, z / rz);
  const k1 = Math.hypot(x / (rx * rx), y / (ry * ry), z / (rz * rz));
  if (k1 === 0) return -Math.min(rx, ry, rz);
  return (k0 * (k0 - 1)) / k1;
}

function sdHead(px: number, py: number, pz: number, ca: number, sa: number) {
  const x = px * ca + pz * sa;
  const z = -px * sa + pz * ca;
  const y = py;
  const ax = Math.abs(x);

  let d = sdEllipsoid(x, y - 0.25, z, 0.62, 0.78, 0.7);
  d = smin(d, sdEllipsoid(x, y + 0.4, z - 0.1, 0.5, 0.55, 0.55), 0.25);
  d = smin(d, sdEllipsoid(x, y + 0.02, z - 0.66, 0.09, 0.22, 0.14), 0.12);
  d = smin(d, sdEllipsoid(x, y - 0.2, z - 0.55, 0.42, 0.07, 0.16), 0.1);
  d = smin(d, sdEllipsoid(x, y + 0.6, z - 0.55, 0.2, 0.06, 0.1), 0.08);
  d = smin(d, sdEllipsoid(ax - 0.63, y, z + 0.05, 0.07, 0.22, 0.15), 0.08);
  d = smin(d, sdEllipsoid(x, y + 1.05, z - 0.02, 0.3, 0.55, 0.3), 0.2);
  d = smin(d, sdEllipsoid(x, y + 1.75, z, 1.0, 0.42, 0.5), 0.25);

  const eye = Math.hypot(ax - 0.24, y - 0.08, z - 0.62) - 0.13;
  return smax(d, -eye, 0.05);
}

function hash(a: number, b: number, c: number) {
  const s = Math.sin(a * 12.9898 + b * 78.233 + c * 4.1) * 43758.5453;
  return s - Math.floor(s);
}

function renderHead(t: number) {
  const angle = t * 0.00055;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const twinkle = Math.floor(t / 900);
  const e = 0.012;

  const lines: string[] = [];

  for (let r = 0; r < ROWS; r++) {
    let line = '';
    const y = -(r + 0.5 - ROWS / 2) * UNIT + Y_CENTER;

    for (let c = 0; c < COLS; c++) {
      const x = (c + 0.5 - COLS / 2) * CHAR_W * UNIT;
      let ch = ' ';

      let hit = false;
      let z = 1.5;

      if (Math.abs(x) < 1.1) {
        for (let i = 0; i < 28; i++) {
          const d = sdHead(x, y, z, ca, sa);
          if (d < 0.004) {
            hit = true;
            break;
          }
          z -= d * 0.85;
          if (z < -1.5) break;
        }
      }

      if (hit) {
        const nx = sdHead(x + e, y, z, ca, sa) - sdHead(x - e, y, z, ca, sa);
        const ny = sdHead(x, y + e, z, ca, sa) - sdHead(x, y - e, z, ca, sa);
        const nz = sdHead(x, y, z + e, ca, sa) - sdHead(x, y, z - e, ca, sa);
        const len = Math.hypot(nx, ny, nz) || 1;
        const diffuse = Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / len);

        const b = 0.32 + 0.68 * diffuse;
        const bayer = (BAYER4[r % 4][c % 4] + 0.5) / 16 - 0.5;
        let idx = Math.round(b * (RAMP.length - 1) + bayer * 0.9);
        idx = Math.max(1, Math.min(RAMP.length - 1, idx));
        ch = RAMP[idx];
      } else {
        const h = hash(c, r, twinkle);
        if (h < 0.018) ch = '.';
        else if (h < 0.026) ch = ':';
        else if (h < 0.03) ch = '+';
        else if (h < 0.033) ch = '-';
      }

      line += ch;
    }
    lines.push(line);
  }

  return lines.join('\n');
}

function AsciiHead() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 60) return;
      last = t;
      pre.textContent = renderHead(t);
    };

    if (reduceMotion) {
      pre.textContent = renderHead(900);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <pre
        ref={preRef}
        className="m-0 font-mono text-white opacity-45 whitespace-pre text-[8px] leading-[8px] sm:text-[11px] sm:leading-[11px] md:text-[13px] md:leading-[13px] lg:text-[15px] lg:leading-[15px]"
      />
    </div>
  );
}

export default function AboutSection() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = (query?: string) => {
    const textToSend = query || input;
    if (!textToSend.trim()) return;

    const updatedMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(updatedMessages);
    if (!query) setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages([...updatedMessages, { role: 'bot' as const, text: getAnswer(textToSend) }]);
      setLoading(false);
    }, 600);
  };

  return (
    <section id="about" className="bg-[#F4EEE2] p-3 md:p-5 scroll-mt-6">
      <div className="relative min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)] rounded-[36px] md:rounded-[48px] bg-[#E8501A] text-white flex flex-col justify-center items-center px-4 py-12 select-none overflow-hidden">
        <AsciiHead />

        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-center tracking-tight leading-[1.1] mb-10">
            What would you like <br className="hidden sm:block" /> to know about Elariz?
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item)}
                className="px-5 py-2.5 rounded-full border-2 border-white/60 text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:brightness-110 active:scale-95"
                style={{ background: 'linear-gradient(180deg, #FF7A45 0%, #FF5A22 100%)' }}
              >
                {item}
              </button>
            ))}
          </div>

          {messages.length > 0 && (
            <div className="w-full max-w-2xl bg-black/15 backdrop-blur-md rounded-2xl p-4 mb-6 max-h-60 overflow-y-auto space-y-3 border border-white/20">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-xs sm:text-sm whitespace-pre-line select-text ${
                      m.role === 'user'
                        ? 'bg-white text-black font-medium'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl text-xs bg-white/20 text-white/70 animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative w-full max-w-3xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Elariz and the projects..."
              className="w-full h-14 sm:h-16 pl-6 pr-16 rounded-full bg-white text-neutral-800 placeholder-neutral-500 text-sm sm:text-base font-medium shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
            />
            <button
              type="submit"
              aria-label="Send"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E8501A] hover:bg-[#d24515] text-white flex items-center justify-center transition-transform active:scale-90 shadow-md"
            >
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}