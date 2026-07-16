import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION } from '../lib/gsap.js';

const FOUNDERS = [
  {
    index: 'F.01',
    name: 'Ariel Adhidevara',
    role: 'Co-founder - Design & Product',
    photo: '/ariel.png',
    creds: [
      { degree: 'MDes, Mediums', school: 'Harvard University' },
      { degree: 'B.Arch', school: 'California Polytechnic State University' },
      { degree: 'A.S.', school: 'Diablo Valley College' },
    ],
  },
  {
    index: 'F.02',
    name: 'Reza Erfit',
    role: 'Co-founder - Community & Data',
    photo: '/reza.png',
    creds: [
      { degree: 'Tech creator', school: '400K+ followers on Instagram' },
      { degree: 'B.Sc Data Science', school: 'Universitas Airlangga' },
    ],
  },
];

function SplitName({ text }) {
  const words = text.split(' ');
  return words.map((word, w) => (
    <span key={w}>
      <span className="word" aria-hidden="true">
        {word.split('').map((char, c) => (
          <span className="char" key={c}>
            {char}
          </span>
        ))}
      </span>
      {w < words.length - 1 ? ' ' : null}
    </span>
  ));
}

export default function Founders() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (REDUCED_MOTION) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.founder').forEach((row) => {
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: row, start: 'top 78%' },
        });

        tl.fromTo(
          row.querySelectorAll('.founder-name .char'),
          { yPercent: 115 },
          { yPercent: 0, duration: 1.1, stagger: 0.02 },
          0
        )
          .from(
            row.querySelectorAll('.founder-index, .founder-photo, .founder-role'),
            { autoAlpha: 0, duration: 0.8 },
            0.25
          )
          .from(
            row.querySelectorAll('.founder-creds li'),
            { autoAlpha: 0, x: -24, duration: 0.8, stagger: 0.1 },
            0.3
          );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="founders" ref={rootRef}>
      <div className="founders-list">
        <div className="section-head">
          <span className="eyebrow">Orang di balik Rumusmuda</span>
        </div>
        {FOUNDERS.map(({ index, name, role, photo, creds }) => (
          <article className="founder" key={index}>
            <span className="founder-index">{index}</span>
            <div className="founder-photo">
              <img src={photo} alt={name} loading="lazy" />
            </div>
            <div>
              <h3 className="founder-name" aria-label={name}>
                <SplitName text={name} />
              </h3>
              <p className="founder-role">{role}</p>
            </div>
            <ul className="founder-creds">
              {creds.map(({ degree, school }) => (
                <li key={degree}>
                  <strong>{degree}</strong>
                  <span>{school}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
