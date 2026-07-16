import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const STATS = [
  {
    label: 'Durasi program',
    number: '05',
    unit: 'weeks',
    desc: 'Pre-course, technical foundations, agent fundamentals, project development, final build, dan demo day.',
  },
  {
    label: 'Limited cohort',
    number: '30',
    unit: 'people',
    desc: 'Hanya untuk peserta yang passionate dan ambitious - supaya feedback, support, dan progress tetap fokus.',
  },
  {
    label: 'Capstone',
    number: '01',
    unit: 'final project',
    desc: 'Setiap student ship working prototype AI agent di akhir program - bukan cuma sertifikat.',
  },
];

/* Two full 0-9 loops so every digit rolls through a whole revolution
   before settling - 20 cells, 5% of track height each. */
const TRACK = [...Array(20).keys()].map((n) => n % 10);

function Odometer({ value }) {
  return (
    <span className="odometer" aria-label={value}>
      {value.split('').map((char, i) => (
        <span className="odo-digit" key={i} aria-hidden="true">
          <span className="odo-track" data-digit={char}>
            {TRACK.map((n, j) => (
              <span key={j}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Stats() {
  const rootRef = useRef(null);

  useEffect(() => {
    const tracks = gsap.utils.toArray(rootRef.current.querySelectorAll('.odo-track'));
    const target = (el) => -(10 + Number(el.dataset.digit)) * 5;

    if (REDUCED_MOTION) {
      tracks.forEach((el) => gsap.set(el, { yPercent: target(el) }));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.stat-row').forEach((row) => {
        const rowTracks = row.querySelectorAll('.odo-track');
        gsap.from(row, {
          autoAlpha: 0,
          y: 50,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 82%' },
        });
        gsap.to(rowTracks, {
          yPercent: (i, el) => target(el),
          duration: 1.9,
          ease: 'expo.inOut',
          stagger: 0.12,
          scrollTrigger: { trigger: row, start: 'top 78%' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="numbers" ref={rootRef}>
      <div className="stats">
        <div className="section-head">
          <span className="eyebrow">Rumusmuda in numbers</span>
        </div>
        {STATS.map(({ label, number, unit, desc }) => (
          <div className="stat-row" key={label}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">
              <Odometer value={number} />
              <small>{unit}</small>
            </div>
            <p className="stat-desc">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
