import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION, SCRAMBLE_CHARS } from '../lib/gsap.js';

const IG_URL = 'https://www.instagram.com/rumusmuda/';

const ROWS = [
  { label: 'Established', value: '2026' },
  { label: 'Origin', value: 'Indonesia' },
  { label: 'Focus', value: 'AI & digital skills' },
  { label: 'Active program', value: 'Human + AI Agent' },
  { label: 'Format', value: '4 weeks · online · hands-on' },
  { label: 'Instagram', value: '@rumusmuda', href: IG_URL },
];

export default function InfoData({ onNavigate }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const ctx = gsap.context(() => {
      gsap.from('.info-copy > *', {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });

      gsap.from('.info-card', {
        autoAlpha: 0,
        y: 60,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.info-card', start: 'top 78%' },
      });

      gsap.utils.toArray('.info-scramble').forEach((el, i) => {
        gsap.to(el, {
          duration: 1.1,
          delay: 0.25 + i * 0.12,
          scrambleText: { text: el.dataset.text, chars: SCRAMBLE_CHARS, speed: 0.4 },
          scrollTrigger: { trigger: '.info-card', start: 'top 78%' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" ref={rootRef}>
      <div className="info-grid">
        <div className="info-copy">
          <span className="eyebrow">Informations / Data</span>
          <h3>
            Studio edukasi digital untuk generasi muda Indonesia.
          </h3>
          <p>
            Produk kami mencakup seluruh spektrum belajar — interactive
            courses, practice tools, dan learning community. Program pertama
            kami, Human + AI Agent, adalah pintu masuknya: empat minggu
            memahami cara kerja — dan cara membangun — AI agents. Visi kami
            sederhana: pengalaman belajar yang clear, rigorous, dan genuinely
            fun.
          </p>
          <a
            className="btn"
            href="#program"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#program');
            }}
          >
            Lihat program
          </a>
        </div>

        <dl className="info-card">
          <div className="info-card-title">About RumusMuda — Data</div>
          {ROWS.map(({ label, value, href }) => (
            <div className="info-row" key={label}>
              <dt>{label}</dt>
              <dd>
                {href ? (
                  <a
                    className="info-scramble"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    data-text={value}
                  >
                    {value}
                  </a>
                ) : (
                  <span className="info-scramble" data-text={value}>
                    {value}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
