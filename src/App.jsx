import Threads from './components/Threads.jsx';

export default function App() {
  return (
    <main className="coming-soon">
      <div className="threads-stage" aria-hidden="true">
        <Threads
          color={[0.14901960784313725, 0.5490196078431373, 1]}
          amplitude={1.45}
          distance={0.48}
          enableMouseInteraction
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
