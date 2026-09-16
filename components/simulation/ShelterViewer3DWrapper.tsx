// Dynamic wrapper — disables SSR for the Three.js canvas
// (WebGL is browser-only, can't run on the server)
'use client';
import dynamic from 'next/dynamic';

const ShelterViewer3D = dynamic(
  () => import('./ShelterViewer3D'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '420px',
        background: '#0F172A',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        color: '#475569',
      }}>
        <div style={{
          width: '36px', height: '36px',
          border: '3px solid rgba(59,130,246,.2)',
          borderTopColor: '#3B82F6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: '.875rem' }}>Loading 3D engine…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

export default ShelterViewer3D;
