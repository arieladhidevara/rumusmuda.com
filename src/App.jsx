import MagicRings from './components/MagicRings.jsx';

export default function App() {
  return (
    <main className="coming-soon">
      <div className="magic-rings-stage" aria-hidden="true">
        <MagicRings
          color="#55f7ee"
          colorTwo="#42fcff"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.04}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst
        />
      </div>

      <section className="copy" aria-label="Rumus Muda coming soon">
        <p className="brand">Rumus Muda</p>
        <h1>Coming Soon</h1>
        <p className="promise">
          Building a new kind of tech education for people who are already
          great at what they do
        </p>
      </section>
    </main>
  );
}
