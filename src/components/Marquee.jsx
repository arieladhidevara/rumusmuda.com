import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const ITEMS = ['Human + AI Agent', 'Agentic Web', 'Pre-course + 5 Weeks', 'Theory to Prototype'];

export default function Marquee() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (REDUCED_MOTION) return;

    const track = rootRef.current.querySelector('.marquee-track');
    const wrap = gsap.utils.wrap(-50, 0);
    const clampSkew = gsap.utils.clamp(-6, 6);

    let x = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let direction = 1;

    // Scroll velocity drives marquee speed, direction, and skew.
    const tick = (time, deltaTime) => {
      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.12;
      lastY = y;

      if (Math.abs(velocity) > 0.8) direction = velocity > 0 ? 1 : -1;

      const speed = 0.035 + Math.min(Math.abs(velocity) * 0.004, 0.28);
      x = wrap(x - speed * (deltaTime / 16.7) * direction);

      gsap.set(track, { xPercent: x, skewX: clampSkew(-velocity * 0.05) });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const row = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee" ref={rootRef} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <span key={half}>
            {row.map((item, i) => (
              <span
                className={`marquee-item${i % 2 ? ' is-outline' : ''}`}
                key={i}
              >
                {item} <i>*</i>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
