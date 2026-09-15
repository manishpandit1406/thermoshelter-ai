'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { formatNumber } from '@/lib/utils';

interface Props { params: Promise<{ projectId: string }> }

const MOCK_RESULT = {
  annualHeatLoad: 8420,
  annualCoolLoad: 22180,
  peakTempIn: 36.4,
  minTempIn: 14.8,
  comfortScore: 72,
  rating: 'C+',
  monthly: [
    { m: 'Jan', out: 16, in: 17.2, heat: 320, cool: 0   },
    { m: 'Feb', out: 20, in: 20.8, heat: 180, cool: 80  },
    { m: 'Mar', out: 27, in: 27.5, heat: 60,  cool: 620 },
    { m: 'Apr', out: 35, in: 33.2, heat: 0,   cool: 2100},
    { m: 'May', out: 41, in: 36.4, heat: 0,   cool: 3800},
    { m: 'Jun', out: 43, in: 36.1, heat: 0,   cool: 3700},
    { m: 'Jul', out: 38, in: 32.0, heat: 0,   cool: 2600},
    { m: 'Aug', out: 36, in: 30.8, heat: 0,   cool: 2400},
    { m: 'Sep', out: 34, in: 29.6, heat: 0,   cool: 2100},
    { m: 'Oct', out: 29, in: 26.2, heat: 80,  cool: 900 },
    { m: 'Nov', out: 22, in: 21.5, heat: 240, cool: 280 },
    { m: 'Dec', out: 16, in: 17.0, heat: 380, cool: 0   },
  ],
};

export default function SimulationPage({ params }: Props) {
  const { projectId } = use(params);
  const router = useRouter();
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const r = MOCK_RESULT;

  async function runSim() {
    setRunning(true);
    setProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(res => setTimeout(res, 80));
      setProgress(i);
    }
    setRunning(false);
    setRan(true);
  }

  const maxLoad = Math.max(...r.monthly.map(m => Math.max(m.heat, m.cool)));

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">⚡ Thermal Simulation</h1>
        <p className="page-subtitle">Physics-based annual thermal performance analysis</p>
      </div>

      {!ran ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '.5rem' }}>Ready to Simulate</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '440px', margin: '0 auto 2rem' }}>
            This will compute monthly heat loads, cooling demand, internal temperature profiles, and an overall comfort score using your design parameters and climate data.
          </p>
          {running ? (
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                <span style={{ fontSize: '.875rem', color: 'var(--color-text-secondary)' }}>Computing…</span>
                <span className="mono" style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--color-secondary)' }}>{progress}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--color-surface-muted)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, var(--color-secondary), #0EA5E9)',
                  borderRadius: '4px',
                  transition: 'width .1s ease',
                }} />
              </div>
              <div className="animate-pulse-soft" style={{ marginTop: '1rem', fontSize: '.8rem', color: 'var(--color-text-muted)' }}>
                {progress < 30 ? 'Solving heat transfer equations…' :
                 progress < 60 ? 'Computing solar gains across 8760 hours…' :
                 progress < 85 ? 'Aggregating monthly thermal loads…' :
                 'Finalising comfort score…'}
              </div>
            </div>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={runSim}>⚡ Run Simulation</button>
          )}
        </div>
      ) : (
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Score Banner */}
          <div className="card-flat" style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '.75rem', letterSpacing: '.1em', opacity: .7, marginBottom: '.5rem' }}>SIMULATION COMPLETE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Thermal Performance Rating</div>
                <div style={{ opacity: .85, marginTop: '.25rem', fontSize: '.9rem' }}>Based on ASHRAE 55-2020 comfort criteria</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>{r.rating}</div>
                <div style={{ fontSize: '.8rem', opacity: .7, marginTop: '.25rem' }}>Performance Rating</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{r.comfortScore}%</div>
                <div style={{ fontSize: '.8rem', opacity: .7, marginTop: '.25rem' }}>Comfort Score</div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Annual Heat Load',    value: formatNumber(r.annualHeatLoad),  unit: 'kWh', color: '#2563EB', icon: '🔵' },
              { label: 'Annual Cooling Load', value: formatNumber(r.annualCoolLoad),  unit: 'kWh', color: '#EF4444', icon: '🔴' },
              { label: 'Peak Indoor Temp',    value: `${r.peakTempIn}°C`,            unit: '',    color: '#F59E0B', icon: '🔥' },
              { label: 'Min Indoor Temp',     value: `${r.minTempIn}°C`,             unit: '',    color: '#0EA5E9', icon: '❄️' },
            ].map(m => (
              <div key={m.label} className="stat-card">
                <div style={{ fontSize: '1.25rem', marginBottom: '.375rem' }}>{m.icon}</div>
                <div className="stat-value" style={{ color: m.color, fontSize: '1.3rem' }}>
                  {m.value} <span style={{ fontSize: '.75rem', fontWeight: 400 }}>{m.unit}</span>
                </div>
                <div className="stat-label">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Monthly Chart */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Monthly Thermal Loads</h2>
            <div style={{ display: 'flex', gap: '.25rem', alignItems: 'flex-end', height: '140px', padding: '0 .5rem' }}>
              {r.monthly.map(m => (
                <div key={m.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  {/* Cooling bar */}
                  <div style={{
                    width: '100%', maxWidth: '24px',
                    height: `${(m.cool / maxLoad) * 100}px`,
                    background: 'linear-gradient(180deg,#EF4444,#FCA5A5)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height .3s ease',
                    minHeight: m.cool > 0 ? '2px' : '0',
                  }} title={`Cooling: ${m.cool} kWh`} />
                  {/* Heating bar */}
                  <div style={{
                    width: '100%', maxWidth: '24px',
                    height: `${(m.heat / maxLoad) * 100}px`,
                    background: 'linear-gradient(180deg,#3B82F6,#93C5FD)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height .3s ease',
                    minHeight: m.heat > 0 ? '2px' : '0',
                  }} title={`Heating: ${m.heat} kWh`} />
                  <div style={{ fontSize: '.6rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{m.m}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '.75rem', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem', fontSize: '.75rem', color: 'var(--color-text-secondary)' }}>
                <div style={{ width: '10px', height: '10px', background: '#EF4444', borderRadius: '2px' }} /> Cooling Load
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem', fontSize: '.75rem', color: 'var(--color-text-secondary)' }}>
                <div style={{ width: '10px', height: '10px', background: '#3B82F6', borderRadius: '2px' }} /> Heating Load
              </div>
            </div>
          </div>

          {/* Temperature comparison table */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Indoor vs. Outdoor Temperature</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    {['Month', 'Outdoor °C', 'Indoor °C', 'Δ Temp', 'Heating kWh', 'Cooling kWh'].map(h => (
                      <th key={h} style={{ padding: '.5rem .75rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '.8125rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.monthly.map((m, i) => (
                    <tr key={m.m} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'white' : 'var(--color-surface-alt)' }}>
                      <td style={{ padding: '.5rem .75rem', fontWeight: 500 }}>{m.m}</td>
                      <td className="mono" style={{ padding: '.5rem .75rem' }}>{m.out}</td>
                      <td className="mono" style={{ padding: '.5rem .75rem', color: m.in > 30 ? '#EF4444' : m.in < 18 ? '#3B82F6' : '#059669' }}>{m.in}</td>
                      <td className="mono" style={{ padding: '.5rem .75rem', color: 'var(--color-text-muted)' }}>{(m.in - m.out).toFixed(1)}</td>
                      <td className="mono" style={{ padding: '.5rem .75rem', color: '#3B82F6' }}>{formatNumber(m.heat)}</td>
                      <td className="mono" style={{ padding: '.5rem .75rem', color: '#EF4444' }}>{formatNumber(m.cool)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => { setRan(false); setProgress(0); }}>
              Re-run Simulation
            </button>
            <button className="btn btn-primary" onClick={() => router.push(`/projects/${projectId}/optimization`)}>
              Continue → Optimization
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
