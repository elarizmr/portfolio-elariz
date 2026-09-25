'use client';

import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '#home', label: 'Home' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.querySelector(href);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#E8501A] z-50">
      <nav className="flex items-center justify-between px-4 md:px-8 py-2.5 md:py-3">
        <span id="logo-slot" className="invisible text-base md:text-lg font-black tracking-tighter">
          ElarizR
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => goTo(e, l.href)}
              className="text-white text-xs tracking-widest uppercase hover:opacity-70 transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-7 h-7"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col px-4 pb-4 gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => goTo(e, l.href)}
              className="text-white text-sm tracking-widest uppercase hover:opacity-70 transition"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}