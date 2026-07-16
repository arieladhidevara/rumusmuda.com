import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const LINKS = [
  { num: '01', label: 'About', href: '#about' },
  { num: '02', label: 'Program', href: '#program' },
  { num: '03', label: 'Founders', href: '#founders' },
  { num: '04', label: 'Values', href: '#values' },
  { num: '05', label: 'Contact', href: '#contact' },
];

const SOCIALS = [
  {
    num: '01',
    label: 'Instagram — @rumusmuda',
    href: 'https://www.instagram.com/rumusmuda/',
  },
  { num: '02', label: 'Email — hello@rumusmuda.com', href: 'mailto:hello@rumusmuda.com' },
];

export default function Footer({ onNavigate }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-wordmark',
        { yPercent: 45, autoAlpha: 0.3 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.footer-wordmark',
            start: 'top 100%',
            end: 'top 62%',
            scrub: true,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={rootRef}>
      <div className="footer-grid">
        <div className="footer-brand">
          <a
            className="nav-brand"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(0);
            }}
          >
            <img src="/logo.png" alt="" width="30" height="30" />
            <span>RumusMuda</span>
          </a>
          <p>
            Produk edukasi digital untuk generasi muda Indonesia — belajar AI
            dan digital skills dengan cara yang benar: teori yang jelas,
            praktik yang nyata.
          </p>
        </div>

        <div>
          <div className="footer-col-title">Sitemap</div>
          <ul className="footer-links">
            {LINKS.map(({ num, label, href }) => (
              <li key={num}>
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(href);
                  }}
                >
                  {label} <span>{num}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Socials</div>
          <ul className="footer-links">
            {SOCIALS.map(({ num, label, href }) => (
              <li key={num}>
                <a href={href} target="_blank" rel="noreferrer">
                  {label} <span>{num}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-wordmark">RUMUSMUDA</div>

      <div className="footer-bottom">
        <span>© 2026 RumusMuda. All rights reserved.</span>
        <span>Indonesia — Digital Education</span>
        <button type="button" onClick={() => onNavigate(0)}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
