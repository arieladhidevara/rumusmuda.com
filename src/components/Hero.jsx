import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION, SCRAMBLE_CHARS } from '../lib/gsap.js';

const HEADLINE = 'Master the formula';
const ACCENT_WORDS = new Set(['formula']);

const META = [
  { className: 'hero-meta--tl', strong: 'Program 001', label: 'Human + AI Agent' },
  { className: 'hero-meta--tr', strong: 'Pre-course + 5', label: 'Theory to prototype' },
  { className: 'hero-meta--bl', strong: '400K+ reach', label: '@rumusmuda' },
  { className: 'hero-meta--br', strong: 'Est. 2026', label: 'Indonesia' },
];

function SplitWords({ text }) {
  return text.split(' ').map((word, w) => (
    <span key={w}>
      <span
        className={`word${ACCENT_WORDS.has(word) ? ' word--accent' : ''}`}
        aria-hidden="true"
      >
        {word.split('').map((char, c) => (
          <span className="char" key={c}>
            {char}
          </span>
        ))}
      </span>
      {w < text.split(' ').length - 1 ? ' ' : null}
    </span>
  ));
}

export default function Hero({ ready }) {
  const rootRef = useRef(null);

  // Hide everything before the intro so nothing flashes while the
  // preloader slides away.
  useEffect(() => {
    if (REDUCED_MOTION) return;
    const ctx = gsap.context(() => {
      gsap.set('.hero-title .char', {
        yPercent: 120,
        rotate: 8,
        transformOrigin: '0% 100%',
      });
      gsap.set('.hero-inner .eyebrow, .hero-sub, .hero-scroll', { autoAlpha: 0 });
      gsap.set('.hero-meta', { autoAlpha: 0 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Intro plays once the preloader reports done.
  useEffect(() => {
    if (!ready || REDUCED_MOTION) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.to('.hero-title .char', { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.028 }, 0)
        .to('.hero-inner .eyebrow', { autoAlpha: 1, duration: 0.8 }, 0.35)
        .to('.hero-sub', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.55)
        .to('.hero-scroll', { autoAlpha: 1, duration: 0.8 }, 0.9)
        .to('.hero-meta', { autoAlpha: 1, duration: 0.5, stagger: 0.1 }, 0.6);

      gsap.utils.toArray('.hero-meta strong').forEach((el, i) => {
        tl.to(
          el,
          {
            duration: 1,
            scrambleText: { text: el.dataset.text, chars: SCRAMBLE_CHARS, speed: 0.5 },
          },
          0.6 + i * 0.1
        );
      });

      // Parallax the hero copy away as the user scrolls past it.
      gsap.to('.hero-inner', {
        yPercent: -20,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero-inner">
        <span className="eyebrow">Digital education products</span>
        <h1 className="hero-title" aria-label={HEADLINE}>
          <SplitWords text={HEADLINE} />
        </h1>
        <p className="hero-sub">
          Rumusmuda bikin produk edukasi digital yang mengubah curiosity jadi
          real skills - dimulai dari AI dan agentic web.
        </p>
      </div>

      {META.map(({ className, strong, label }) => (
        <div className={`hero-meta ${className}`} key={className}>
          <strong data-text={strong}>{strong}</strong>
          {label}
        </div>
      ))}

      <div className="hero-scroll">Scroll to explore</div>
    </section>
  );
}
