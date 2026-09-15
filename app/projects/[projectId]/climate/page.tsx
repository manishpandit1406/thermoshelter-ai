'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { formatNumber } from '@/lib/utils';

interface Props { params: Promise<{ projectId: string }> }

// Mock climate data returned by "analysis"
const MOCK_CLIMATES: Record<string, {
  zone: string; koppen: string; color: string;
  avgTemp: number; maxTemp: number; minTemp: number;
  humidity: number; rainfall: number; sunHours: number;
  monthly: { m: string; t: number; h: number; r: number }[];
  recommendations: string[];
}> = {
  default: {
    zone: 'Hot Arid Desert', koppen: 'BWh', color: '#F59E0B',
    avgTemp: 33.4, maxTemp: 48.2, minTemp: 8.6,
    humidity: 18, rainfall: 112, sunHours: 3480,
    monthly: [
      { m: 'Jan', t: 16, h: 30, r: 4  }, { m: 'Feb', t: 20, h: 28, r: 3  },
      { m: 'Mar', t: 27, h: 22, r: 2  }, { m: 'Apr', t: 35, h: 15, r: 1  },
      { m: 'May', t: 41, h: 12, r: 5  }, { m: 'Jun', t: 43, h: 14, r: 22 },
      { m: 'Jul', t: 38, h: 40, r: 40 }, { m: 'Aug', t: 36, h: 45, r: 35 },
      { m: 'Sep', t: 34, h: 30, r: 14 }, { m: 'Oct', t: 29, h: 20, r: 3  },
      { m: 'Nov', t: 22, h: 22, r: 2  }, { m: 'Dec', t: 16, h: 28, r: 3  },
    ],
    recommendations: [
      'Use high thermal mass walls (rammed earth, concrete)',
      'Orient building 15° East of South for optimal passive cooling',
      'Install evaporative cooling; low cooling loads at night',
      'Roof insulation critical — solar gain exceeds 900 W/m²',
      'Consider wind towers (Badgir) for natural ventilation',
    ],
  },
};

export default function ClimatePage({ params }: Props) {
  const { projectId } = use(params);
  const router = useRouter();
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const climate = MOCK_CLIMATES.default;

  async function runAnalysis() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setAnalyzed(true);
  }

  const chartH = 100; // SVG chart height
  const temps = climate.monthly.map(m => m.t);
  const maxT = Math.max(...temps);
  const minT = Math.min(...temps);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '860px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">🌡️ Climate Analysis</h1>
        <p className="page-subtitle">Fetch and analyse real-world climate data for your site</p>
      </div>

      {!analyzed ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '.5rem' }}>Ready to Analyse Climate</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            We&apos;ll fetch climate classification, temperature profiles, solar radiation, and seasonal patterns for your location.
          </p>
          <button className="btn btn-primary btn-lg" onClick={runAnalysis} disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                Analysing Climate Data…
              </>
            ) : '⚡ Run Climate Analysis'}
          </button>
          {loading && (
            <div style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '.8125rem' }} className="animate-pulse-soft">
              Fetching Koppen classification · Computing solar angles · Aggregating 30-year normals…
            </div>
          )}
        </div>
      ) : (
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Zone Header */}
          <div className="card-flat" style={{ borderLeft: `4px solid ${climate.color}`, background: '#FFFBEB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '.75rem', fontWeight: 600, color: climate.color, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                  Köppen Classification
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.03em', marginTop: '.25rem' }}>
                  {climate.koppen} — {climate.zone}
                </div>
              </div>
              <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>Analysis Complete</span>
            </div>
          </div>

          {/* Key Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Annual Avg Temp', value: `${climate.avgTemp}°C`, icon: '🌡️' },
              { label: 'Peak Temperature', value: `${climate.maxTemp}°C`, icon: '🔥' },
              { label: 'Min Temperature', value: `${climate.minTemp}°C`, icon: '❄️' },
              { label: 'Rel. Humidity',   value: `${climate.humidity}%`,  icon: '💧' },
              { label: 'Annual Rainfall', value: `${climate.rainfall} mm`, icon: '🌧️' },
              { label: 'Sun Hours/Year',  value: formatNumber(climate.sunHours), icon: '☀️' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: '1.25rem', marginBottom: '.375rem' }}>{s.icon}</div>
                <div className="stat-value" style={{ fontSize: '1.25rem' }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Temperature Chart */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Monthly Temperature Profile</h2>
            <svg viewBox={`0 0 ${climate.monthly.length * 52} ${chartH + 40}`} style={{ width: '100%', overflow: 'visible' }}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(pct => (
                <line key={pct}
                  x1={0} y1={chartH * (1 - pct / 100)}
                  x2={climate.monthly.length * 52} y2={chartH * (1 - pct / 100)}
                  stroke="#F1F5F9" strokeWidth="1"
                />
              ))}
              {/* Temperature area */}
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity=".3" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity=".02" />
                </linearGradient>
              </defs>
              <path
                d={[
                  `M ${climate.monthly.map((m, i) => `${i * 52 + 26},${chartH * (1 - (m.t - minT) / (maxT - minT + 1))}`).join(' L ')}`,
                  `L ${(climate.monthly.length - 1) * 52 + 26},${chartH}`,
                  `L 26,${chartH} Z`,
                ].join(' ')}
                fill="url(#tempGrad)"
              />
              <polyline
                points={climate.monthly.map((m, i) => `${i * 52 + 26},${chartH * (1 - (m.t - minT) / (maxT - minT + 1))}`).join(' ')}
                fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinejoin="round"
              />
              {/* Dots + labels */}
              {climate.monthly.map((m, i) => {
                const y = chartH * (1 - (m.t - minT) / (maxT - minT + 1));
                return (
                  <g key={m.m}>
                    <circle cx={i * 52 + 26} cy={y} r={4} fill="#F59E0B" />
                    <text x={i * 52 + 26} y={chartH + 18} textAnchor="middle" fontSize="10" fill="#94A3B8">{m.m}</text>
                    <text x={i * 52 + 26} y={y - 8} textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="600">{m.t}°</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* AI Recommendations */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              🤖 Climate-Specific Recommendations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {climate.recommendations.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '.875rem', alignItems: 'flex-start',
                  padding: '.75rem', borderRadius: '8px', background: '#F0F9FF',
                  border: '1px solid #BFDBFE',
                }}>
                  <div style={{
                    width: '22px', height: '22px', flexShrink: 0,
                    background: 'var(--color-secondary)', color: 'white',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '.7rem', fontWeight: 700,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: '.875rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => router.push(`/projects/${projectId}/design`)}>
              Continue → Design Parameters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
