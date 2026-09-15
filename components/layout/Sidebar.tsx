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
      background: '#0F172A',
      color: '#CBD5E1',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,.06)',
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg,#2563EB,#0EA5E9)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>🏗️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'white', lineHeight: 1.2 }}>
                ThermoShelter
              </div>
              <div style={{ fontSize: '.7rem', color: '#64748B', letterSpacing: '.05em' }}>AI PLATFORM</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '.75rem .75rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
        <div style={{ fontSize: '.6875rem', fontWeight: 600, color: '#475569', letterSpacing: '.08em', padding: '.5rem .5rem .25rem', textTransform: 'uppercase' }}>
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
              fontWeight: active ? 600 : 400,
              color: active ? 'white' : '#94A3B8',
              background: active ? 'rgba(37,99,235,.25)' : 'transparent',
              transition: 'all .15s',
            }}>
              <span style={{ fontSize: '1rem', opacity: active ? 1 : .7 }}>{icon}</span>
              {label}
              {active && (
                <div style={{
                  marginLeft: 'auto',
                  width: '6px', height: '6px',
                  background: '#3B82F6',
                  borderRadius: '50%',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ fontSize: '.75rem', color: '#475569' }}>
          <div style={{ color: '#64748B', marginBottom: '.25rem' }}>v1.0.0 · Build Edition</div>
          © 2026 ThermoShelter AI
        </div>
      </div>
    </aside>
  );
}
