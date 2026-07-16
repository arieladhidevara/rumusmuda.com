import { useEffect, useRef } from 'react';
import { gsap, REDUCED_MOTION, SCRAMBLE_CHARS } from '../lib/gsap.js';

const WEEKS = [
  {
    num: 'W.00',
    title: 'Pre-Course',
    desc:
      'Pengantar vibe coding, AI-assisted development, fundamental agentic AI, ' +
      'dan perbedaan chatbot dengan AI agent sebelum masuk program utama.',
    tags: ['Vibe coding', 'Agent basics', 'Readiness'],
  },
  {
    num: 'W.01',
    title: 'Technical Foundations',
    desc:
      'Memahami cara kerja web app: frontend, backend, API, database, terminal, ' +
      'Git, API keys, deployment, debugging, dan setup OpenClaw dengan aman.',
    tags: ['Web basics', 'API', 'OpenClaw setup'],
  },
  {
    num: 'W.02',
    title: 'AI Agent Fundamentals',
    desc:
      'Membedah agent loop, AI models, instructions, tools, skills, memory, ' +
      'frameworks, integrations, multi-agent systems, dan human approval.',
    tags: ['Agent loop', 'Tools', 'Security'],
  },
  {
    num: 'W.03',
    title: 'Agentic Web + Project',
    desc:
      'Merancang agentic user experience, workflow, arsitektur project, use case, ' +
      'scope, core workflow, testing, dan iterasi bersama tim.',
    tags: ['UX', 'Workflow', 'Prototype'],
  },
  {
    num: 'W.04',
    title: 'Critique + Final Build',
    desc:
      'Presentasi progress, feedback interaktif, troubleshooting teknis, ' +
      'debugging, integrasi, deployment support, security review, dan persiapan demo.',
    tags: ['Critique', 'Debugging', 'Deploy'],
  },
  {
    num: 'W.05',
    title: 'Demo Day',
    desc:
      'Final presentation untuk menunjukkan working prototype AI agent yang ' +
      'berjalan end-to-end, punya input, tool atau integration, output, dan batasan jelas.',
    tags: ['Final project', 'Demo', 'Feedback'],
  },
];

const TOTAL_WEEKS = WEEKS.length;
const LAST_WEEK_LABEL = WEEKS.at(-1).num.replace('W.', '');

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

      let currentWeek = 0;

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
            const weekIndex = Math.min(
              TOTAL_WEEKS - 1,
              Math.floor(self.progress * TOTAL_WEEKS)
            );
            if (weekIndex !== currentWeek) {
              currentWeek = weekIndex;
              gsap.to(weekNumRef.current, {
                duration: 0.5,
                overwrite: true,
                scrambleText: {
                  text: String(weekIndex).padStart(2, '0'),
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
        <span className="eyebrow">Program 001 - Batch pertama</span>
        <h2 className="program-title">Human + AI Agent</h2>
        <p className="program-sub">
          Program project-based untuk memahami fundamental AI agents dan
          membangun working prototype yang relevan dengan minat, bidang, atau
          masalah yang ingin kamu eksplorasi.
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
          Week <strong ref={weekNumRef}>00</strong> / {LAST_WEEK_LABEL}
        </span>
        <div className="program-bar">
          <div className="program-bar-fill" ref={barRef} />
        </div>
      </div>
    </section>
  );
}
