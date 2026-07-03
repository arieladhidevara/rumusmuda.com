import { Component, lazy, Suspense } from 'react';

const Orb = lazy(() => import('./components/Orb.jsx'));

class OrbErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function App() {
  return (
    <main className="coming-soon">
      <div className="orb-stage" aria-hidden="true">
        <OrbErrorBoundary>
          <Suspense fallback={null}>
            <Orb
              hue={8}
              hoverIntensity={0.7}
              rotateOnHover
              backgroundColor="#ffffff"
            />
          </Suspense>
        </OrbErrorBoundary>
      </div>

      <section className="copy" aria-label="Rumus Muda coming soon">
        <h1>
          <span>Rumus Muda</span>
          <span>Coming Soon</span>
        </h1>
        <p className="promise">
          Building a new kind of tech education for people who are already
          great at what they do
        </p>
      </section>
    </main>
  );
}
