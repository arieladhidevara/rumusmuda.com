import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const TEXT =
  'Rumusmuda percaya teknologi paling berguna ketika bertemu manusia dengan ' +
  'keunikan, konteks, dan expertise masing-masing. Kami membantu learners ' +
  'memakai AI dan tools digital untuk memperkuat cara mereka berpikir, berkarya, ' +
  'dan menyelesaikan masalah di bidangnya sendiri.';

export default function Statement() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (REDUCED_MOTION) {
      gsap.set(rootRef.current.querySelectorAll('.word'), { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.word',
        { opacity: 0.12, y: '0.35em' },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          stagger: 0.35,
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: true,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="about">
      <div className="statement" ref={rootRef}>
        <span className="eyebrow">About Rumusmuda</span>
        <p>
          {TEXT.split(' ').map((word, i) => (
            <span key={i}>
              <span className="word">{word}</span>{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
