import { useEffect, useRef, useState } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const LINKS = [
  { label: 'About', target: '#about' },
  { label: 'Program', target: '#program' },
  { label: 'Founders', target: '#founders' },
  { label: 'Contact', target: '#contact' },
];

export default function Nav({ ready, onNavigate }) {
  const rootRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!ready || REDUCED_MOTION) return;
    const tween = gsap.fromTo(
      rootRef.current,
      { yPercent: -110, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', delay: 0.2 }
    );
    return () => tween.kill();
  }, [ready]);

  const handleClick = (event, target) => {
    event.preventDefault();
    onNavigate(target);
  };

  return (
    <header
      className={`nav${scrolled ? ' is-scrolled' : ''}`}
      ref={rootRef}
      style={REDUCED_MOTION ? undefined : { visibility: 'hidden' }}
    >
      <a className="nav-brand" href="#top" onClick={(e) => handleClick(e, 0)}>
        <img src="/logo.png" alt="" width="30" height="30" />
        <span>RumusMuda</span>
      </a>

      <nav className="nav-links" aria-label="Primary">
        {LINKS.map(({ label, target }) => (
          <a key={label} href={target} onClick={(e) => handleClick(e, target)}>
            {label}
          </a>
        ))}
      </nav>

      <a className="btn" href="#program" onClick={(e) => handleClick(e, '#program')}>
        Join Batch 01
      </a>
    </header>
  );
}
