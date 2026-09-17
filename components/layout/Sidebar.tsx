'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard', icon: '▣', label: 'Dashboard' },
  { href: '/projects',  icon: '📁', label: 'Projects' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '220px',
      background: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0,
      borderRight: '1px solid var(--color-border)',
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
            <img 
              src="/images/image.png" 
              alt="Logo" 
              style={{
                width: '48px', height: '48px',
                objectFit: 'contain'
              }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                ThermoShelter
              </div>
              <div style={{ fontSize: '.7rem', color: 'var(--color-text-secondary)', letterSpacing: '.05em' }}>AI PLATFORM</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '.75rem .75rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
        <div style={{ fontSize: '.6875rem', fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '.08em', padding: '.5rem .5rem .25rem', textTransform: 'uppercase' }}>
          Main
        </div>
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '.625rem',
              padding: '.5rem .75rem',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '.875rem',
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
              background: active ? 'var(--color-surface-muted)' : 'transparent',
              transition: 'all .15s',
            }}>
              <span style={{ fontSize: '1rem', opacity: active ? 1 : .7 }}>{icon}</span>
              {label}
              {active && (
                <div style={{
                  marginLeft: 'auto',
                  width: '6px', height: '6px',
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: '.75rem', color: 'var(--color-text-muted)' }}>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: '.25rem' }}>v1.0.0 · Build Edition</div>
          © 2026 ThermoShelter AI
        </div>
      </div>
    </aside>
  );
}
