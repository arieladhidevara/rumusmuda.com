import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, REDUCED_MOTION, SCRAMBLE_CHARS } from './lib/gsap.js';
import Preloader from './components/Preloader.jsx';
import Nav from './components/Nav.jsx';
import WebGLBackground from './components/WebGLBackground.jsx';
import Hero from './components/Hero.jsx';
import Statement from './components/Statement.jsx';
import Marquee from './components/Marquee.jsx';
import Program from './components/Program.jsx';
import InfoData from './components/InfoData.jsx';
import Stats from './components/Stats.jsx';
import Founders from './components/Founders.jsx';
import Values from './components/Values.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';

const CLICK_SRC = '/click.mp3';

export default function App() {
  const [ready, setReady] = useState(REDUCED_MOTION);
  const lenisRef = useRef(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => {
    if (REDUCED_MOTION) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (!readyRef.current) lenis.stop();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready);
    if (ready) {
      lenisRef.current?.start();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [ready]);

  // Magnetic pull on every pill button (fine pointers only).
  useEffect(() => {
    if (!ready || REDUCED_MOTION) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cleanups = [];
    document.querySelectorAll('.btn').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3' });
      const move = (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      btn.addEventListener('pointermove', move);
      btn.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        btn.removeEventListener('pointermove', move);
        btn.removeEventListener('pointerleave', leave);
        gsap.killTweensOf(btn, 'x,y');
        gsap.set(btn, { x: 0, y: 0 });
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [ready]);

  // Subtle UI tick only for button-like controls.
  useEffect(() => {
    if (!ready || REDUCED_MOTION) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const audio = new Audio(CLICK_SRC);
    audio.preload = 'auto';
    audio.volume = 0.22;

    let lastPlayed = 0;
    const playHover = () => {
      const now = performance.now();
      if (now - lastPlayed < 90) return;
      lastPlayed = now;

      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    const targets = document.querySelectorAll('.btn, button:not(:disabled)');
    targets.forEach((target) => target.addEventListener('pointerenter', playHover));

    return () => {
      targets.forEach((target) => target.removeEventListener('pointerenter', playHover));
      audio.pause();
    };
  }, [ready]);

  // Every eyebrow label scrambles in the first time it enters the viewport.
  useEffect(() => {
    if (!ready || REDUCED_MOTION) return;
    const triggers = gsap.utils.toArray('.eyebrow').map((el) => {
      const text = el.textContent;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () =>
          gsap.to(el, {
            duration: 0.9,
            scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.4 },
          }),
      });
    });
    return () => triggers.forEach((t) => t.kill());
  }, [ready]);

  const scrollTo = useCallback((target) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.4 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : null;
      if (el) el.scrollIntoView();
      else window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <WebGLBackground />
      <Nav ready={ready} onNavigate={scrollTo} />
      <main>
        <Hero ready={ready} />
        <Statement />
        <Marquee />
        <Program />
        <InfoData onNavigate={scrollTo} />
        <Stats />
        <Founders />
        <Values />
        <CTA />
      </main>
      <Footer onNavigate={scrollTo} />
    </>
  );
}
