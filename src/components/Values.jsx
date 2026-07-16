import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const VALUES = [
  {
    num: '001',
    title: 'Curiosity',
    body:
      'Setiap rumus berawal dari pertanyaan. Kami bikin produk yang ' +
      'menghargai rasa penasaran — karena yang berani bertanya "kenapa" ' +
      'akan membangun jawaban yang lebih baik.',
  },
  {
    num: '002',
    title: 'Clarity',
    body:
      'Ide kompleks berhak dijelaskan dengan sederhana. Kami obsesif soal ' +
      'tiap diagram, kalimat, dan interaksi — sampai bagian tersulit terasa ' +
      'obvious.',
  },
  {
    num: '003',
    title: 'Practice',
    body:
      'Mastery itu dibangun, bukan dihafal. Tools kami mengubah repetisi ' +
      'jadi progres yang bisa kamu lihat — one solved problem at a time.',
  },
  {
    num: '004',
    title: 'Community',
    body:
      'Belajar itu lebih seru bareng-bareng. Dari study group sampai mentor ' +
      'session, RumusMuda menghubungkan learners yang saling dorong lebih ' +
      'jauh.',
  },
];

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
        {VALUES.map(({ num, title, body }, i) => (
          <article
            className="value-card"
            key={num}
            style={{ top: `calc(13vh + ${i * 0.75}rem)` }}
          >
            <span className="value-num">{num}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
