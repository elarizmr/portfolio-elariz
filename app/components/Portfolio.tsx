'use client';

import { useEffect, useRef, useState } from 'react';

const PROJECTS = [
  {
    title: 'OLAF',
    description: 'E-commerce fashion store with a full shopping experience.',
    image: '/olaf.png',
    color: '#E8501A',
    href: 'https://ecommerce-ten-ashen-17.vercel.app/',
  },
  {
    title: 'CodeXDev',
    description: 'Development agency website with services, pricing and an interactive cursor mesh.',
    image: '/codexdev.png',
    color: '#1A1A1A',
    href: 'https://codexdevaz.vercel.app/',
  },
  {
    title: 'Final E-commerce',
    description: 'E-commerce web application for browsing products and shopping online.',
    image: '/final-ecommerce.png',
    color: '#2C2C2C',
    href: 'https://final-front-5a95.vercel.app/',
  },
  {
    title: 'GameWork',
    description: 'Gaming store with categories, pre-orders, cart, login and a blog.',
    image: '/gamework.png',
    color: '#3B3B3B',
    href: 'https://menim-saytim.vercel.app/',
  },
  {
    title: 'Jarvis AI Assistant',
    description: 'AI assistant built with Next.js and Electron.',
    image: '/Jarvis.png',
    color: '#1A1A1A',
    href: 'https://github.com/elarizmr/edith-ai-assistant',
  },
];

export default function Portfolio() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cached, mount/resize-only measurements (never touched during scroll)
  const cardCentersRef = useRef<number[]>([]);
  const maxTranslateRef = useRef(0);
  const translateXRef = useRef(0);
  const activeIndexRef = useRef(-1);

  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  // Recompute all layout-dependent numbers. Runs on mount/resize only,
  // never inside the scroll handler, so scroll never triggers a reflow.
  const measure = () => {
    if (!trackRef.current) return;

    const maxTranslate = Math.max(trackRef.current.scrollWidth - window.innerWidth, 0);
    maxTranslateRef.current = maxTranslate;
    setWrapperHeight(window.innerHeight + maxTranslate);

    cardCentersRef.current = cardRefs.current.map((el) =>
      el ? el.offsetLeft + el.offsetWidth / 2 : 0
    );
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-measure card centers whenever hovered/background changes card layout
  // (image swap doesn't change layout here, but keep it safe & cheap)
  useEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperHeight]);

  // Apply transform/filter/opacity directly to DOM nodes — no setState,
  // no reflow reads. Pure writes, so the browser can batch them in one frame.
  const applyFrame = (translateX: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${translateX}px,0,0)`;
    }

    const half = window.innerWidth / 2;
    let closestIndex = 0;
    let closestDist = Infinity;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const center = cardCentersRef.current[i] + translateX;
      const d = (center - half) / half; // -1 … 0 … 1
      const a = Math.min(Math.abs(d), 1);

      el.style.transform = `perspective(1400px) rotateY(${-d * 16}deg) scale(${1 - a * 0.16})`;
      el.style.filter = `blur(${a * 4}px)`;
      el.style.opacity = `${1 - a * 0.25}`;

      if (Math.abs(center - half) < closestDist) {
        closestDist = Math.abs(center - half);
        closestIndex = i;
      }
    });

    if (closestIndex !== activeIndexRef.current) {
      const prev = dotRefs.current[activeIndexRef.current];
      const next = dotRefs.current[closestIndex];
      if (prev) {
        prev.style.width = '8px';
        prev.style.backgroundColor = '#D8D0C0';
      }
      if (next) {
        next.style.width = '28px';
        next.style.backgroundColor = '#E8501A';
      }
      activeIndexRef.current = closestIndex;
    }
  };

  // Turn vertical scroll into horizontal movement — rAF-throttled,
  // writes only, no React re-render per frame.
  useEffect(() => {
    let raf = 0;

    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!wrapperRef.current) return;

        const rect = wrapperRef.current.getBoundingClientRect();
        const scrollableDistance = wrapperHeight - window.innerHeight;

        let x = 0;
        if (scrollableDistance > 0) {
          const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);
          x = -progress * maxTranslateRef.current;
        }

        translateXRef.current = x;
        applyFrame(x);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperHeight]);

  // Move the "click to view" pill with the mouse — already DOM-direct, kept as is
  const handleMouseMove = (e: React.MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 18}px)`;
    }
  };

  return (
    <section id="portfolio" className="relative bg-[#F4EEE2]">
      <h2 className="text-center pt-16 md:pt-20 pb-8 md:pb-12 text-[#E8501A] font-extrabold text-4xl sm:text-5xl md:text-7xl uppercase tracking-tight">
        Portfolio
      </h2>

      <div
        ref={wrapperRef}
        style={{ height: wrapperHeight ? `${wrapperHeight}px` : '100vh' }}
        className="relative"
      >
        <div
          className="sticky top-0 h-screen overflow-hidden flex items-center"
          onMouseMove={handleMouseMove}
        >
          {/* Background: each project's image fades in when its card is hovered */}
          <div className="absolute inset-0 bg-[#F4EEE2]" />
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                bgRefs.current[i] = el;
              }}
              aria-hidden="true"
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{
                backgroundColor: p.color,
                backgroundImage: p.image ? `url(${p.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: hovered === i ? 1 : 0,
              }}
            />
          ))}

          {/* Cards */}
          <div
            ref={trackRef}
            className="relative flex w-max flex-shrink-0 items-center gap-6 md:gap-10 will-change-transform"
          >
            {/* Leading spacer — first card starts centered */}
            <div className="flex-shrink-0 w-[11vw] sm:w-[27vw] md:w-[calc(50vw-260px)]" />

            {PROJECTS.map((p, i) => (
              <a
                key={p.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                href={p.href}
                target={p.href === '#' ? undefined : '_blank'}
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="group relative flex-shrink-0 w-[78vw] sm:w-[46vw] md:w-[520px] rounded-[44px] overflow-hidden bg-white/80 backdrop-blur-md shadow-2xl will-change-transform"
              >
                {/* Image */}
                <div
                  className="relative w-full aspect-[4/3] overflow-hidden"
                  style={{
                    backgroundColor: p.color,
                    backgroundImage: p.image ? `url(${p.image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                  <span className="absolute bottom-5 left-6 text-white text-sm font-semibold tracking-widest uppercase flex items-center gap-3">
                    See project
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>

                {/* Text */}
                <div className="p-6 md:p-8">
                  <h3 className="text-lg md:text-2xl font-bold text-black mb-1">{p.title}</h3>
                  <p className="text-sm md:text-base text-[#6b6b6b]">{p.description}</p>
                </div>
              </a>
            ))}

            {/* Trailing spacer — last card ends centered */}
            <div className="flex-shrink-0 w-[11vw] sm:w-[27vw] md:w-[calc(50vw-260px)]" />
          </div>

          {/* Cursor pill (desktop only) */}
          <div
            ref={cursorRef}
            className={`pointer-events-none fixed left-0 top-0 z-30 hidden md:block transition-opacity duration-200 ${
              hovered === null ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#E8501A] shadow-lg whitespace-nowrap">
              Click to view
            </span>
          </div>

          {/* Progress dots — updated directly via refs, no re-render */}
          <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex items-center justify-center gap-2">
            {PROJECTS.map((p, i) => (
              <span
                key={p.title}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === 0 ? '28px' : '8px',
                  height: '8px',
                  backgroundColor: i === 0 ? '#E8501A' : '#D8D0C0',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}