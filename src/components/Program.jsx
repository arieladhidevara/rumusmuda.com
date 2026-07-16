import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION, SCRAMBLE_CHARS } from '../lib/gsap.js';

const WEEKS = [
  {
    num: 'W.01',
    title: 'Foundations',
    desc:
      'Kenalan dengan LLM, tools, dan cara berpikir agentic. Apa bedanya ' +
      'chatbot, assistant, dan agent — dan kenapa perbedaan itu penting.',
    tags: ['LLM basics', 'Prompting', 'Tool use'],
  },
  {
    num: 'W.02',
    title: 'The Agentic Web',
    desc:
      'Teori agentic web: protokol seperti MCP, agent-to-agent ' +
      'communication, dan bagaimana internet berubah ketika agents ikut ' +
      'bekerja di dalamnya.',
    tags: ['MCP', 'Agent-to-agent', 'Orchestration'],
  },
  {
    num: 'W.03',
    title: 'Build Your Agent',
    desc:
      'Hands-on membangun AI agent dari nol: tool calling, memory, dan ' +
      'orchestration — sampai agent kamu bisa menyelesaikan tugas nyata.',
    tags: ['Tool calling', 'Memory', 'Evals'],
  },
  {
    num: 'W.04',
    title: 'Ship & Showcase',
    desc:
      'Capstone week. Deploy agent kamu, presentasikan ke komunitas, dan ' +
      'dapatkan feedback langsung dari praktisi.',
    tags: ['Capstone', 'Deploy', 'Demo day'],
  },
];

export default function Program() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const weekNumRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (REDUCED_MOTION) {
      rootRef.current.classList.add('is-static');
      return;
    }

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const distance = () =>
        Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

      let currentWeek = 1;

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(barRef.current, { scaleX: self.progress });
            const week = Math.min(4, 1 + Math.floor(self.progress * 4));
            if (week !== currentWeek) {
              currentWeek = week;
              gsap.to(weekNumRef.current, {
                duration: 0.5,
                overwrite: true,
                scrambleText: {
                  text: `0${week}`,
                  chars: SCRAMBLE_CHARS,
                  speed: 0.6,
                },
              });
            }
          },
        },
      });

      gsap.from('.program-head > *', {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="program" id="program" ref={rootRef}>
      <div className="program-head">
        <span className="eyebrow">Program 001 — Batch pertama</span>
        <h2 className="program-title">Human + AI Agent</h2>
        <p className="program-sub">
          Program 4 minggu untuk memahami agentic web secara menyeluruh — dari
          teori sampai hands-on membangun dan men-deploy AI agent kamu sendiri.
        </p>
      </div>

      <div className="program-track" ref={trackRef}>
        {WEEKS.map(({ num, title, desc, tags }) => (
          <article className="week-card" key={num}>
            <span className="week-num">{num}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
            <ul className="week-tags">
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="program-progress">
        <span className="program-week-label">
          Week <strong ref={weekNumRef}>01</strong> / 04
        </span>
        <div className="program-bar">
          <div className="program-bar-fill" ref={barRef} />
        </div>
      </div>
    </section>
  );
}
