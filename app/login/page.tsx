'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    // Demo mode — no real auth
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    router.push('/dashboard');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #F0F7FF 0%, #F8FAFC 50%, #EFF6FF 100%)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 44%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem',
        background: '#0F172A',
        color: 'white',
      }} className="animate-slide-in">
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <img 
              src="/images/image.png" 
              alt="Logo" 
              style={{
                width: '40px', height: '40px',
                objectFit: 'contain'
              }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'white' }}>ThermoShelter AI</div>
              <div style={{ fontSize: '.75rem', color: '#64748B' }}>Physics-Based Design Platform</div>
            </div>
          </div>
        </Link>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
          Design Shelters That<br />
          <span style={{ color: '#3B82F6' }}>Survive Any Climate</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '.95rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Climate-aware thermal simulation. AI-powered optimization. Professional engineering reports. All in one platform.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
          {[
            '📍 Auto climate analysis for any GPS coordinate',
            '⚡ Full 8,760-hour thermal simulation',
            '🤖 AI-suggested design optimizations',
            '📊 Export-ready professional reports',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '.625rem', color: '#CBD5E1', fontSize: '.875rem' }}>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '.375rem' }}>
              Sign in to your ThermoShelter account
            </p>
          </div>

          {/* Demo hint */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '.75rem 1rem', marginBottom: '1.5rem', fontSize: '.8125rem', color: '#1D4ED8' }}>
            💡 <strong>Demo Mode</strong> — enter any email & password to continue.
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.375rem' }}>
                <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
                <span style={{ fontSize: '.8rem', color: 'var(--color-secondary)', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <input
                id="password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '.625rem .875rem', color: '#991B1B', fontSize: '.875rem' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '.25rem' }} disabled={loading}>
              {loading ? (
                <><span className="loading-spin" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%' }} /> Signing in…</>
              ) : 'Sign in →'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '.875rem', color: 'var(--color-text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/projects" style={{ color: 'var(--color-secondary)', fontWeight: 500, textDecoration: 'none' }}>
              Start for free →
            </Link>
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
            <Link href="/dashboard" style={{ color: 'var(--color-text-muted)', fontSize: '.8125rem', textDecoration: 'none' }}>
              Or continue without signing in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
