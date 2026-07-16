import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const TEXT =
  'RumusMuda percaya: hal-hal sulit itu bisa dipelajari. Setiap program ' +
  'kami dirancang supaya belajar terasa seperti discovery, bukan kewajiban ' +
  '— karena mengubah curiosity jadi mastery butuh craft yang serius.';

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
        <span className="eyebrow">About RumusMuda</span>
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
