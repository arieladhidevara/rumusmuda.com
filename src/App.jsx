import Orb from './components/Orb.jsx';

export default function App() {
  return (
    <main className="coming-soon">
      <div className="orb-stage" aria-hidden="true">
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#ffffff"
        />
      </div>

      <section className="copy" aria-label="Rumus Muda coming soon">
        <p className="status">Coming Soon</p>
        <h1>Rumus Muda</h1>
        <p className="promise">
          Building a new kind of tech education for people who are already
          great at what they do
        </p>
      </section>
    </main>
  );
}
