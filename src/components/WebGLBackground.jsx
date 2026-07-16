import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, REDUCED_MOTION } from '../lib/gsap.js';
import { RumusScene } from '../lib/three-scene.js';

export default function WebGLBackground() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new RumusScene(canvasRef.current, { reducedMotion: REDUCED_MOTION });

    // Dive the camera into the grid across the first two screens of scroll.
    const dive = ScrollTrigger.create({
      start: 0,
      end: () => window.innerHeight * 2,
      onUpdate: (self) => scene.setProgress(self.progress),
    });

    // Feed scroll velocity (px/s) into the scene for the churn effect.
    let lastY = window.scrollY;
    const velTick = (time, deltaTime) => {
      const y = window.scrollY;
      scene.setVelocity((y - lastY) / Math.max(deltaTime / 1000, 1e-3));
      lastY = y;
    };
    if (!REDUCED_MOTION) gsap.ticker.add(velTick);

    // Dim the whole scene once the reading sections take over.
    const dim = gsap.fromTo(
      wrapRef.current,
      { opacity: 1 },
      {
        opacity: 0.22,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 70%',
          end: 'top 10%',
          scrub: true,
        },
      }
    );

    return () => {
      gsap.ticker.remove(velTick);
      dive.kill();
      dim.scrollTrigger?.kill();
      dim.kill();
      scene.dispose();
    };
  }, []);

  return (
    <div className="webgl" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
