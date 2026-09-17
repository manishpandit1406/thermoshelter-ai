'use client';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { formatNumber } from '@/lib/utils';
import ShelterViewer3D from '@/components/simulation/ShelterViewer3DWrapper';

// Removed MOCK_RESULT

// Design config (in real app this would come from designStore)
const DESIGN_CONFIG = {
  width: 8,
  length: 12,
  height: 3,
  roofType: 'flat' as const,
};

export default function SimulationPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'3d' | 'chart' | 'table'>('3d');
  const [r, setR] = useState<any>(null);

  async function runSim() {
    setRunning(true);
    setProgress(0);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/simulation`);
      if (res.ok) {
        const data = await res.json();
        setR(data);
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(res => setTimeout(res, 40));
          setProgress(i);
        }
        setRan(true);
      }
    } catch (err) {
      console.error("Failed to run simulation:", err);
    }
    setRunning(false);
  }

  // No longer computing maxLoad here since monthly array is replaced

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">⚡ Thermal Simulation</h1>
        <p className="page-subtitle">Physics-based annual thermal performance analysis with 3D heat-map</p>
      </div>

      {!ran ? (
        /* ── Pre-run state ── */
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '.5rem' }}>Ready to Simulate</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 2rem' }}>
            Computes monthly heat loads, cooling demand, internal temperature profiles, and a 3D thermal heat-map across your shelter geometry.
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
                  background: 'linear-gradient(90deg, #2563EB, #0EA5E9)',
                  borderRadius: '4px',
                  transition: 'width .1s ease',
                }} />
              </div>
              <div className="animate-pulse-soft" style={{ marginTop: '1rem', fontSize: '.8rem', color: 'var(--color-text-muted)' }}>
                {progress < 30 ? 'Solving heat transfer equations…' :
                 progress < 60 ? 'Computing solar gains across 8760 hours…' :
                 progress < 85 ? 'Aggregating monthly thermal loads…' :
                 'Building 3D heat-map…'}
              </div>
            </div>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={runSim}>
              ⚡ Run Simulation
            </button>
          )}
        </div>
      ) : (
        /* ── Results state ── */
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Score Banner */}
          <div className="card-flat" style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '.75rem', letterSpacing: '.1em', opacity: .7, marginBottom: '.5rem' }}>SIMULATION COMPLETE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Thermal Performance</div>
                <div style={{ opacity: .85, marginTop: '.25rem', fontSize: '.9rem' }}>Physics Engine RC Network Simulation</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>{r?.metrics?.avg_temp_in}°C</div>
                <div style={{ fontSize: '.8rem', opacity: .7, marginTop: '.25rem' }}>Average Internal Temp</div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Total Solar Gain', value: formatNumber(r?.metrics?.total_solar_gain_kwh || 0), unit: 'kWh', color: '#F59E0B', icon: '☀️' },
              { label: 'Total Heat Loss',  value: formatNumber(r?.metrics?.total_heat_loss_kwh || 0), unit: 'kWh', color: '#EF4444', icon: '📉' },
              { label: 'Peak Indoor Temp', value: `${r?.metrics?.max_temp_in}°C`, unit: '', color: '#F59E0B', icon: '🔥' },
              { label: 'Min Indoor Temp',  value: `${r?.metrics?.min_temp_in}°C`, unit: '', color: '#0EA5E9', icon: '❄️' },
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

          {/* ── Tabbed Visualisation ── */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>

            {/* Tab bar */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface-alt)',
            }}>
              {[
                { id: '3d' as const,    label: '🏗️ 3D Thermal Model' },
                { id: 'chart' as const, label: '📈 24h Temperature Curve' },
                { id: 'table' as const, label: '📋 Heat Flow Breakdown' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '.875rem 1.25rem',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid var(--color-secondary)' : '2px solid transparent',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '.875rem',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    color: activeTab === tab.id ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
                    transition: 'all .15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: '1.5rem' }}>

              {/* 3D View Tab */}
              {activeTab === '3d' && (
                <div className="animate-fade-in">
                  <p style={{ fontSize: '.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    Interactive 3D thermal model over a 24-hour cycle. Wall colours show surface temperature — blue=cool, red=hot.
                  </p>
                  <ShelterViewer3D
                    monthly={r?.hourly_data?.filter((_: any, i: number) => i % 2 === 0).map((h: any) => ({
                      m: `${h.hour}:00`, out: h.t_out, in: h.t_in, heat: 0, cool: 0
                    }))}
                    config={r?.design || DESIGN_CONFIG}
                  />
                </div>
              )}

              {/* Chart Tab */}
              {activeTab === 'chart' && (
                <div className="animate-fade-in">
                  <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>24-Hour Internal vs Ambient Temperature</h2>
                  <div style={{ display: 'flex', gap: '.25rem', alignItems: 'flex-end', height: '200px', padding: '0 .5rem', position: 'relative' }}>
                    {r?.hourly_data?.map((h: any) => (
                      <div key={h.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '100%' }}>
                        {/* Ambient Point */}
                        <div style={{ position: 'absolute', bottom: `${(h.t_out + 20) / 40 * 100}%`, width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%' }} title={`Ambient: ${h.t_out}°C`} />
                        {/* Internal Point */}
                        <div style={{ position: 'absolute', bottom: `${(h.t_in + 20) / 40 * 100}%`, width: '8px', height: '8px', background: '#3B82F6', borderRadius: '50%', zIndex: 2 }} title={`Internal: ${h.t_in}°C`} />
                        
                        <div style={{ position: 'absolute', bottom: '-20px', fontSize: '.6rem', color: 'var(--color-text-muted)' }}>{h.hour}h</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem', fontSize: '.75rem', color: 'var(--color-text-secondary)' }}>
                      <div style={{ width: '10px', height: '10px', background: '#94A3B8', borderRadius: '50%' }} /> Ambient Outdoor (°C)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem', fontSize: '.75rem', color: 'var(--color-text-secondary)' }}>
                      <div style={{ width: '10px', height: '10px', background: '#3B82F6', borderRadius: '50%' }} /> Predicted Indoor (°C)
                    </div>
                  </div>
                </div>
              )}

              {/* Table Tab */}
              {activeTab === 'table' && (
                <div className="animate-fade-in">
                  <h2 className="section-title" style={{ marginBottom: '1rem' }}>Overall Physics Metrics</h2>
                  <div className="card-flat" style={{ background: '#F8FAFC', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '.75rem', color: '#64748B' }}>Total Envelope UA (Heat Transfer Coefficient)</div>
                        <div className="mono" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{r?.metrics?.ua_total} W/K</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '.75rem', color: '#64748B' }}>Total Thermal Mass (Heat Capacity)</div>
                        <div className="mono" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{formatNumber(r?.metrics?.thermal_mass)} J/K</div>
                      </div>
                    </div>
                  </div>

                  <h2 className="section-title" style={{ marginBottom: '1rem' }}>Heat Flow Breakdown</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    {Object.entries(r?.metrics?.loss_breakdown || {}).map(([key, percent]: [string, any]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '80px', textTransform: 'capitalize', fontSize: '.875rem' }}>{key}</div>
                        <div style={{ flex: 1, height: '12px', background: '#E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percent}%`, background: key === 'windows' ? '#3B82F6' : '#EF4444' }} />
                        </div>
                        <div className="mono" style={{ width: '40px', textAlign: 'right', fontSize: '.875rem' }}>{percent}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
