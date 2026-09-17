'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

const SUGGESTIONS = [
  {
    category: 'Insulation',
    title: 'Increase roof insulation to 150 mm',
    desc: 'Current 50 mm insulation is insufficient for BWh climate. Upgrading to 150 mm mineral wool reduces peak solar gain by ~38%.',
    impact: 'high' as const,
    saving: 18.4,
    cost: '₹ 45,000',
    payback: '2.1 years',
    icon: '🔲',
  },
  {
    category: 'Orientation',
    title: 'Rotate building 15° East of South',
    desc: 'Optimal solar orientation for the Jaisalmer latitude. Reduces direct afternoon heat gain while maximising winter passive solar.',
    impact: 'high' as const,
    saving: 12.1,
    cost: 'No cost',
    payback: 'Immediate',
    icon: '🧭',
  },
  {
    category: 'Windows',
    title: 'Reduce window-to-wall ratio to 10%',
    desc: 'Current 15% WWR results in excessive solar gain. South-facing clerestory design achieves daylight with lower heat gain.',
    impact: 'medium' as const,
    saving: 7.8,
    cost: '₹ 15,000',
    payback: '1.4 years',
    icon: '🪟',
  },
  {
    category: 'Shading',
    title: 'Add 600 mm horizontal overhangs',
    desc: 'Horizontal shading devices on south façade block summer high-angle sun while admitting low winter sun.',
    impact: 'medium' as const,
    saving: 6.3,
    cost: '₹ 22,000',
    payback: '2.8 years',
    icon: '⬛',
  },
  {
    category: 'Ventilation',
    title: 'Install wind-catcher towers',
    desc: 'Traditional Badgir (wind tower) design promotes natural night cooling, reducing mechanical cooling demand by ~15% in arid climates.',
    impact: 'medium' as const,
    saving: 9.5,
    cost: '₹ 60,000',
    payback: '3.5 years',
    icon: '🌬️',
  },
  {
    category: 'Thermal Mass',
    title: 'Switch to rammed earth walls',
    desc: 'Rammed earth has 5× the thermal mass of concrete, delaying heat penetration by 10–12 hours and dramatically smoothing internal temperature swings.',
    impact: 'high' as const,
    saving: 14.2,
    cost: '₹ 95,000',
    payback: '4.2 years',
    icon: '🪨',
  },
];

const IMPACT_COLOR = {
  high:   { badge: 'badge-red',   label: 'High Impact' },
  medium: { badge: 'badge-amber', label: 'Medium Impact' },
  low:    { badge: 'badge-slate', label: 'Low Impact' },
};

export default function OptimizationPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [optimizing, setOptimizing] = useState(false);
  const [done, setDone] = useState(false);

  const totalSaving = SUGGESTIONS.filter(s => applied.has(s.category))
    .reduce((sum, s) => sum + s.saving, 0);

  function toggle(cat: string) {
    setApplied(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  async function applyAll() {
    setOptimizing(true);
    await new Promise(r => setTimeout(r, 1400));
    setApplied(new Set(SUGGESTIONS.map(s => s.category)));
    setOptimizing(false);
    setDone(true);
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">🔧 AI Optimization</h1>
        <p className="page-subtitle">AI-generated design improvements ranked by thermal impact</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {done && (
            <div className="card-flat animate-fade-in" style={{ background: '#F0FDF4', borderColor: '#86EFAC', borderLeft: '4px solid #059669' }}>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#065F46' }}>Optimization Applied!</div>
                  <div style={{ fontSize: '.875rem', color: '#047857' }}>
                    All {applied.size} improvements applied. Estimated savings: {totalSaving.toFixed(1)}% energy reduction.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="stagger-children">
            {SUGGESTIONS.map(s => {
              const isApplied = applied.has(s.category);
              return (
                <div key={s.category} className="card-flat" style={{
                  marginBottom: '1rem',
                  borderLeft: `4px solid ${isApplied ? '#059669' : 'var(--color-border)'}`,
                  background: isApplied ? '#F0FDF4' : 'white',
                  transition: 'all .2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                        <h3 style={{ fontWeight: 700, fontSize: '.9375rem', color: 'var(--color-text-primary)', margin: 0 }}>
                          {s.title}
                        </h3>
                        <span className={`badge ${IMPACT_COLOR[s.impact].badge}`}>{IMPACT_COLOR[s.impact].label}</span>
                      </div>
                      <p style={{ fontSize: '.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: '.875rem' }}>
                        {s.desc}
                      </p>
                      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '.7rem', color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase' }}>Energy Saving</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>−{s.saving}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '.7rem', color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase' }}>Cost</div>
                          <div style={{ fontSize: '1.0rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.cost}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '.7rem', color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase' }}>Payback</div>
                          <div style={{ fontSize: '1.0rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.payback}</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(s.category)}
                      className={`btn btn-sm ${isApplied ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ flexShrink: 0 }}
                    >
                      {isApplied ? '✓ Applied' : 'Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Savings summary */}
        <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-flat" style={{ background: '#0F172A', border: 'none', color: 'white' }}>
            <div style={{ fontSize: '.7rem', letterSpacing: '.1em', color: '#64748B', marginBottom: '.75rem', textTransform: 'uppercase' }}>
              Optimization Summary
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34D399', letterSpacing: '-0.04em', lineHeight: 1 }}>
                −{totalSaving.toFixed(1)}%
              </div>
              <div style={{ fontSize: '.8rem', color: '#64748B', marginTop: '.25rem' }}>Estimated energy reduction</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {[
                { label: 'Improvements applied', value: `${applied.size} / ${SUGGESTIONS.length}` },
                { label: 'Cooling load reduction', value: applied.size > 0 ? `−${(totalSaving * 0.7).toFixed(0)}%` : '—' },
                { label: 'Heating load reduction', value: applied.size > 0 ? `−${(totalSaving * 0.3).toFixed(0)}%` : '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: '.4rem' }}>
                  <span style={{ fontSize: '.78rem', color: '#64748B' }}>{row.label}</span>
                  <span className="mono" style={{ fontSize: '.82rem', fontWeight: 600, color: 'white' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={applyAll} disabled={optimizing} style={{ width: '100%', justifyContent: 'center' }}>
            {optimizing ? (
              <><span className="loading-spin" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%' }} /> Applying…</>
            ) : '🤖 Apply All Suggestions'}
          </button>

          <button className="btn btn-primary" onClick={() => router.push(`/projects/${projectId}/report`)} style={{ width: '100%', justifyContent: 'center' }}>
            Generate Report →
          </button>
          <button className="btn btn-ghost" onClick={() => router.push(`/projects/${projectId}/simulation`)} style={{ width: '100%', justifyContent: 'center', fontSize: '.8375rem' }}>
            ← Back to Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
