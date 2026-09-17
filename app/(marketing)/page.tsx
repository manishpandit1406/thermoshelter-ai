import Link from 'next/link';

const features = [
  {
    icon: '🌍',
    title: 'Location-Aware Analysis',
    desc: 'Fetch real-world climate data for any coordinate on Earth. Koppen classification, solar radiation, wind patterns — all auto-computed.',
  },
  {
    icon: '⚡',
    title: 'Physics-Based Simulation',
    desc: 'Run high-fidelity thermal mass and heat-transfer simulations. Understand how your shelter performs across all 12 months.',
  },
  {
    icon: '🤖',
    title: 'AI-Driven Optimization',
    desc: 'Our AI engine suggests material swaps, orientation tweaks, and insulation targets that cut energy loads by up to 40%.',
  },
  {
    icon: '📐',
    title: 'Parametric Design',
    desc: 'Adjust shelter geometry, materials, window ratios, and roof type in real-time. See the thermal impact instantly.',
  },
  {
    icon: '📊',
    title: 'Comprehensive Reports',
    desc: 'Export professional PDF reports with thermal analysis, compliance data, and cost-benefit breakdowns.',
  },
  {
    icon: '🔧',
    title: 'Engineering Precision',
    desc: 'Built for architects and engineers. ASHRAE-aligned calculations, R-value databases, and solar angle geometry.',
  },
];

const stats = [
  { value: '50+', label: 'Climate Zones' },
  { value: '40%', label: 'Avg. Energy Savings' },
  { value: '12', label: 'Months Simulated' },
  { value: '100+', label: 'Material Library' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(255,255,255,.92)',
        backdropFilter: 'blur(12px)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
          <img src="/images/image.png" alt="ThermoShelter AI Logo" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)' }}>
            ThermoShelter <span style={{ color: 'var(--color-secondary)' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" style={{ fontSize: '.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
            Dashboard
          </Link>
          <Link href="/projects" className="btn btn-secondary btn-sm">Projects</Link>
          <Link href="/projects" className="btn btn-primary btn-sm">Get Started →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        padding: '6rem 2rem 5rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        {/* Background Image with 68% Transparency */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/desert_shelter.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.30,
          zIndex: 0,
        }} />
        
        <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <span className="badge badge-olive" style={{ marginBottom: '1.25rem' }}>
            Physics-Based Thermal Design Platform
          </span>
          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginTop: '.75rem',
            marginBottom: '1.5rem',
          }}>
            Design Shelters That <br />
            <span style={{ color: 'var(--color-secondary)' }}>Survive Any Climate</span>
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
            textShadow: '0px 1px 2px rgba(255,255,255,0.7)',
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            ThermoShelter AI combines real climate data, thermal physics simulation, and
            AI-powered optimization to help engineers design energy-efficient shelters — anywhere on Earth.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/projects" className="btn btn-primary btn-lg">
              🚀 Start a New Project
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-lg">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stagger-children" style={{
          display: 'flex', gap: '2rem', justifyContent: 'center',
          marginTop: '4rem', flexWrap: 'wrap',
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '-0.04em' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: '.25rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>
            Everything You Need to Engineer Thermal Comfort
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '.75rem', fontSize: '.95rem' }}>
            A complete workflow from site selection to final report — all in one platform.
          </p>
        </div>

        <div className="stagger-children" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {features.map(f => (
            <div key={f.title} className="card" style={{ cursor: 'default' }}>
              <div className="animate-float-3d" style={{ fontSize: '2.5rem', marginBottom: '1rem', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3)) drop-shadow(0px 1px 1px rgba(255,255,255,0.6))' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '.5rem' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Workflow Steps ── */}
      <section style={{ background: 'var(--color-surface-alt)', borderTop: '1px solid var(--color-border)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '-0.03em',
            textShadow: '1px 1px 0 #5E3219, 2px 2px 0 #5E3219, 3px 3px 0 #5E3219, 4px 4px 6px rgba(0,0,0,0.4), 0 2px 2px rgba(255,255,255,0.5)',
            marginBottom: '0.5rem'
          }}>
            6-Step Design Workflow
          </h2>
          <p style={{
            color: 'var(--color-text-primary)',
            fontSize: '1.125rem',
            fontWeight: 500,
            marginTop: '.75rem',
            marginBottom: '3rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.7)'
          }}>
            Guided from location input to fully optimized design output.
          </p>
          <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['📍 Location', '🌡️ Climate', '🏗️ Design', '⚡ Simulate', '🔧 Optimize', '📊 Report'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="animate-float-3d" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem',
                  padding: '.75rem 1rem',
                  animationDelay: `${i * 0.15}s`,
                }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'var(--color-secondary)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 700,
                    boxShadow: 'inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -3px 0 rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)',
                    textShadow: '0 1px 1px rgba(0, 0, 0, 0.4)',
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>
                    {step.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                {i < 5 && (
                  <div style={{ width: '24px', height: '3px', background: 'var(--color-border-strong)', flexShrink: 0, borderRadius: '2px', boxShadow: '0 1px 1px rgba(255,255,255,0.5), inset 0 1px 1px rgba(0,0,0,0.1)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%)',
        color: 'white',
        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1rem', textShadow: '1px 1px 0px rgba(255, 255, 255, 0.2), -1px -1px 0px rgba(0, 0, 0, 0.3)' }}>
          Ready to Design Smarter Shelters?
        </h2>
        <p style={{ opacity: .9, marginBottom: '2rem', fontSize: '.95rem', textShadow: '0 1px 1px rgba(0,0,0,0.4)' }}>
          Start your first project in seconds. No account required.
        </p>
        <Link href="/projects" className="btn btn-primary btn-lg">
          Create Your First Project →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '1.5rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)' }}>
          © 2026 ThermoShelter AI — Physics-Based Shelter Design Platform
        </span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Dashboard', 'Projects', 'About'].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`} style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              {l}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
