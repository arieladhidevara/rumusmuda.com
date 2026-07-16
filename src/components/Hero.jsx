import { useEffect, useRef, useState } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const HEADLINE = 'Build your edge';
const ACCENT_WORDS = new Set(['edge']);
const AMBIENT_SRC = '/ambient.mp3';

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
  const audioRef = useRef(null);
  const [soundOn, setSoundOn] = useState(true);
  const [soundBlocked, setSoundBlocked] = useState(false);

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
      gsap.set('.hero-sub, .hero-scroll', { autoAlpha: 0 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Intro plays once the preloader reports done.
  useEffect(() => {
    if (!ready || REDUCED_MOTION) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.to('.hero-title .char', { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.028 }, 0)
        .to('.hero-sub', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.55)
        .to('.hero-scroll', { autoAlpha: 1, duration: 0.8 }, 0.9);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!ready || !audio) return;

    audio.volume = 0.32;
    audio.loop = true;

    if (!soundOn) {
      audio.pause();
      return;
    }

    audio
      .play()
      .then(() => setSoundBlocked(false))
      .catch(() => {
        setSoundBlocked(true);
        setSoundOn(false);
      });
  }, [ready, soundOn]);

  const toggleSound = () => {
    const audio = audioRef.current;
    const next = !soundOn;

    setSoundOn(next);
    setSoundBlocked(false);

    if (!audio) return;
    if (!next) {
      audio.pause();
      return;
    }

    audio
      .play()
      .then(() => setSoundBlocked(false))
      .catch(() => {
        setSoundBlocked(true);
        setSoundOn(false);
      });
  };

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero-inner">
        <h1 className="hero-title" aria-label={HEADLINE}>
          <SplitWords text={HEADLINE} />
        </h1>
        <p className="hero-sub">
          Rumusmuda equips people with the tech literacy to amplify their own
          expertise - from creative work to law, research, business, and beyond.
        </p>
      </div>

      <audio ref={audioRef} src={AMBIENT_SRC} preload="auto" loop />
      <button
        className={`sound-toggle${soundOn ? ' is-on' : ''}`}
        type="button"
        aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
        aria-pressed={soundOn}
        onClick={toggleSound}
        title={soundOn ? 'Sound on' : soundBlocked ? 'Click to enable sound' : 'Sound off'}
      >
        <span className="sound-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="sound-state">{soundOn ? 'On' : 'Off'}</span>
      </button>

      <div className="hero-scroll">Scroll to explore</div>
    </section>
  );
}
