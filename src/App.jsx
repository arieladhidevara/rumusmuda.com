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
              hue={-18}
              hoverIntensity={0.35}
              rotateOnHover={false}
              forceHoverState
              backgroundColor="#05060c"
            />
          </Suspense>
        </OrbErrorBoundary>
      </div>

      <section className="copy" aria-label="Rumus Muda coming soon">
        <p className="eyebrow">Rumus Muda</p>
        <h1>Coming Soon</h1>
        <p className="promise">
          Building a new kind of tech education for people who are already
          great at what they do
        </p>
      </section>
    </main>
  );
}
