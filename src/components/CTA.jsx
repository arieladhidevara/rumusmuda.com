import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const HEADLINE = 'Learn with us';
const JOIN_URL = 'https://forms.gle/fJsd7CLZT1XNFcwj6';

export default function CTA() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const ctx = gsap.context(() => {
      gsap.set('.cta-title .char', { yPercent: 120 });

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });

      tl.from('.eyebrow', { autoAlpha: 0, duration: 0.7 }, 0)
        .to('.cta-title .char', { yPercent: 0, duration: 1.2, stagger: 0.03 }, 0.1)
        .from('.cta-copy', { autoAlpha: 0, y: 30, duration: 0.9 }, 0.5)
        .from('.cta-actions', { autoAlpha: 0, y: 20, duration: 0.8 }, 0.7);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section cta" id="contact" ref={rootRef}>
      <span className="eyebrow">Batch pertama - Human + AI Agent</span>
      <h2 className="cta-title" aria-label={HEADLINE}>
        {HEADLINE.split(' ').map((word, w) => (
          <span key={w}>
            <span className="word" aria-hidden="true">
              {word.split('').map((char, c) => (
                <span className="char" key={c}>
                  {char}
                </span>
              ))}
            </span>{' '}
          </span>
        ))}
      </h2>
      <p className="cta-copy">
        Kami bukan sekadar brand ed-tech. Kami teachers, engineers, designers,
        dan storytellers - yang percaya generasi muda Indonesia bisa jadi
        pemain utama di era AI. Daftar Batch 01 lewat form, atau hubungi kami
        kalau ada pertanyaan.
      </p>
      <div className="cta-actions">
        <a
          className="btn btn--solid"
          href={JOIN_URL}
          target="_blank"
          rel="noreferrer"
        >
          Join Batch 01
        </a>
        <a className="btn" href="mailto:hello@rumusmuda.com">
          Email us
        </a>
      </div>
    </section>
  );
}
