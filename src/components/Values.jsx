import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const VALUES = [
  {
    num: '001',
    title: 'Curiosity',
    icon: 'curiosity',
    body:
      'Setiap rumus berawal dari pertanyaan. Kami bikin produk yang ' +
      'menghargai rasa penasaran - karena yang berani bertanya "kenapa" ' +
      'akan membangun jawaban yang lebih baik.',
  },
  {
    num: '002',
    title: 'Clarity',
    icon: 'clarity',
    body:
      'Ide kompleks berhak dijelaskan dengan sederhana. Kami obsesif soal ' +
      'tiap diagram, kalimat, dan interaksi - sampai bagian tersulit terasa ' +
      'obvious.',
  },
  {
    num: '003',
    title: 'Practice',
    icon: 'practice',
    body:
      'Mastery itu dibangun, bukan dihafal. Tools kami mengubah repetisi ' +
      'jadi progres yang bisa kamu lihat - one solved problem at a time.',
  },
  {
    num: '004',
    title: 'Community',
    icon: 'community',
    body:
      'Belajar itu lebih seru bareng-bareng. Dari study group sampai mentor ' +
      'session, Rumusmuda menghubungkan learners yang saling dorong lebih ' +
      'jauh.',
  },
];

function ValueIcon({ name }) {
  return (
    <svg className="value-icon" viewBox="0 0 48 48" aria-hidden="true">
      {name === 'curiosity' ? (
        <>
          <path d="M6 24s6.5-11 18-11 18 11 18 11-6.5 11-18 11S6 24 6 24Z" />
          <circle cx="24" cy="24" r="5.5" />
        </>
      ) : null}
      {name === 'clarity' ? (
        <>
          <path d="M24 6v7" />
          <path d="M24 35v7" />
          <path d="M6 24h7" />
          <path d="M35 24h7" />
          <circle cx="24" cy="24" r="8" />
        </>
      ) : null}
      {name === 'practice' ? (
        <>
          <path d="M15 27l6 6 13-16" />
          <path d="M38 25a14 14 0 1 1-4.1-9.9" />
        </>
      ) : null}
      {name === 'community' ? (
        <>
          <circle cx="24" cy="13" r="5" />
          <circle cx="12" cy="32" r="5" />
          <circle cx="36" cy="32" r="5" />
          <path d="M21 17l-6 10" />
          <path d="M27 17l6 10" />
          <path d="M17 32h14" />
        </>
      ) : null}
    </svg>
  );
}

export default function Values() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.value-card');

      // As each next card slides over, the pinned one settles back and dims.
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.95,
          autoAlpha: 0.25,
          transformOrigin: 'center top',
          ease: 'none',
          scrollTrigger: {
            trigger: next,
            start: 'top bottom',
            end: 'top 25%',
            scrub: true,
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="values" ref={rootRef}>
      <div className="values-head">
        <span className="eyebrow">Yang kami pegang</span>
        <h2>Our Values</h2>
      </div>

      <div className="value-stack">
        {VALUES.map(({ num, title, icon, body }, i) => (
          <article
            className="value-card"
            key={num}
            style={{ top: `calc(13vh + ${i * 0.75}rem)` }}
          >
            <div className="value-mark">
              <span className="value-num">{num}</span>
              <ValueIcon name={icon} />
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
