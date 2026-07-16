import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION, SCRAMBLE_CHARS } from '../lib/gsap.js';

export default function Preloader({ onDone }) {
  const rootRef = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const percent = rootRef.current.querySelector('.preloader-percent');
      const counter = { value: 0 };

      if (REDUCED_MOTION) {
        percent.textContent = '100%';
        gsap.delayedCall(0.4, () => onDoneRef.current());
        return;
      }

      gsap
        .timeline({ onComplete: () => onDoneRef.current() })
        .to(counter, {
          value: 100,
          duration: 2.1,
          ease: 'power2.inOut',
          onUpdate: () => {
            percent.textContent = `${Math.round(counter.value)}%`;
          },
        })
        .to('.preloader-bar', { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, 0)
        .to(
          '.preloader-label',
          {
            duration: 0.8,
            scrambleText: { text: 'Ready to explore', chars: SCRAMBLE_CHARS, speed: 0.4 },
          },
          '-=0.5'
        )
        .to(rootRef.current, {
          yPercent: -100,
          duration: 1,
          ease: 'expo.inOut',
          delay: 0.35,
        });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <span className="preloader-percent">0%</span>
      <span className="preloader-label">Loading content</span>
      <span className="preloader-tag">RumusMuda — Digital Education</span>
      <span className="preloader-bar" />
    </div>
  );
}
