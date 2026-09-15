'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { SHELTER_TYPES, MATERIALS } from '@/lib/constants';

interface Props { params: Promise<{ projectId: string }> }

const ROOF_TYPES = [
  { id: 'flat',     label: 'Flat Roof',       icon: '▬' },
  { id: 'pitched',  label: 'Pitched Roof',    icon: '▲' },
  { id: 'vaulted',  label: 'Vaulted / Arch',  icon: '⌒' },
  { id: 'mono',     label: 'Mono-pitch',      icon: '◤' },
];

export default function DesignPage({ params }: Props) {
  const { projectId } = use(params);
  const router = useRouter();

  const [design, setDesign] = useState({
    shelterType: 'residential',
    material: 'concrete',
    roofType: 'pitched',
    width: 8,
    length: 12,
    height: 3,
    orientation: 15,
    windowRatio: 15,
    insulationMm: 50,
  });

  const set = (key: keyof typeof design, value: string | number) =>
    setDesign(d => ({ ...d, [key]: value }));

  const selectedMaterial = MATERIALS.find(m => m.id === design.material)!;
  const floorArea = design.width * design.length;
  const volume = floorArea * design.height;
  const wallArea = 2 * (design.width + design.length) * design.height;
  const windowArea = (wallArea * design.windowRatio / 100).toFixed(1);

  function RangeRow({ label, id, min, max, step, value, unit, onChange }: {
    label: string; id: string; min: number; max: number; step: number;
    value: number; unit: string; onChange: (v: number) => void;
  }) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.375rem' }}>
          <label className="form-label" htmlFor={id} style={{ margin: 0 }}>{label}</label>
          <span className="mono" style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
            {value} {unit}
          </span>
        </div>
        <input
          id={id}
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-secondary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.7rem', color: 'var(--color-text-muted)', marginTop: '.15rem' }}>
          <span>{min} {unit}</span><span>{max} {unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">🏗️ Design Parameters</h1>
        <p className="page-subtitle">Configure shelter geometry, materials, and construction details</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Shelter Type */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Shelter Type</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              {SHELTER_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => set('shelterType', t.id)}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${design.shelterType === t.id ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                    borderRadius: '10px',
                    background: design.shelterType === t.id ? '#EFF6FF' : 'white',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all .15s',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '.9rem', color: design.shelterType === t.id ? 'var(--color-secondary)' : 'var(--color-text-primary)' }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginTop: '.25rem' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Primary Wall Material</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {MATERIALS.map(m => (
                <label key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '.75rem 1rem',
                  border: `1.5px solid ${design.material === m.id ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: design.material === m.id ? '#EFF6FF' : 'white',
                  transition: 'all .15s',
                }}>
                  <input
                    type="radio" name="material" value={m.id}
                    checked={design.material === m.id}
                    onChange={() => set('material', m.id)}
                    style={{ accentColor: 'var(--color-secondary)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500, fontSize: '.9rem' }}>{m.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                    <span className="badge badge-slate" style={{ fontSize: '.7rem' }}>R {m.r_value}</span>
                    <span className={`badge ${m.cost === 'high' ? 'badge-red' : m.cost === 'medium' ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '.7rem' }}>
                      {m.cost}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Roof Type */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Roof Type</h2>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {ROOF_TYPES.map(r => (
                <button
                  key={r.id}
                  onClick={() => set('roofType', r.id)}
                  style={{
                    padding: '.625rem 1rem',
                    border: `2px solid ${design.roofType === r.id ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                    borderRadius: '8px',
                    background: design.roofType === r.id ? '#EFF6FF' : 'white',
                    cursor: 'pointer',
                    fontWeight: design.roofType === r.id ? 600 : 400,
                    color: design.roofType === r.id ? 'var(--color-secondary)' : 'var(--color-text-primary)',
                    fontSize: '.875rem',
                    transition: 'all .15s',
                  }}
                >
                  <span style={{ marginRight: '.375rem' }}>{r.icon}</span> {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Dimensions & Configuration</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <RangeRow label="Width" id="width" min={3} max={30} step={0.5} value={design.width} unit="m" onChange={v => set('width', v)} />
              <RangeRow label="Length" id="length" min={3} max={50} step={0.5} value={design.length} unit="m" onChange={v => set('length', v)} />
              <RangeRow label="Wall Height" id="height" min={2} max={10} step={0.1} value={design.height} unit="m" onChange={v => set('height', v)} />
              <RangeRow label="Orientation (from South)" id="orient" min={-90} max={90} step={5} value={design.orientation} unit="°" onChange={v => set('orientation', v)} />
              <RangeRow label="Window-to-Wall Ratio" id="wwr" min={5} max={60} step={1} value={design.windowRatio} unit="%" onChange={v => set('windowRatio', v)} />
              <RangeRow label="Insulation Thickness" id="insul" min={0} max={200} step={10} value={design.insulationMm} unit="mm" onChange={v => set('insulationMm', v)} />
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-flat" style={{ background: 'var(--color-primary)', color: 'white', border: 'none' }}>
            <h3 style={{ fontSize: '.875rem', fontWeight: 600, color: '#94A3B8', marginBottom: '1rem', letterSpacing: '.04em', textTransform: 'uppercase', fontSize: '.75rem' }}>
              Design Summary
            </h3>
            {[
              { label: 'Floor Area',   value: `${floorArea.toFixed(0)} m²` },
              { label: 'Volume',       value: `${volume.toFixed(0)} m³` },
              { label: 'Wall Area',    value: `${wallArea.toFixed(0)} m²` },
              { label: 'Window Area',  value: `${windowArea} m²` },
              { label: 'Material',     value: selectedMaterial.label },
              { label: 'R-Value',      value: `${selectedMaterial.r_value} m²·K/W` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '.4rem 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <span style={{ fontSize: '.8rem', color: '#64748B' }}>{row.label}</span>
                <span className="mono" style={{ fontSize: '.8375rem', fontWeight: 500, color: 'white' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => router.push(`/projects/${projectId}/simulation`)} style={{ width: '100%', justifyContent: 'center' }}>
            Save & Run Simulation →
          </button>
          <button className="btn btn-ghost" onClick={() => router.push(`/projects/${projectId}/climate`)} style={{ width: '100%', justifyContent: 'center' }}>
            ← Back to Climate
          </button>
        </div>
      </div>
    </div>
  );
}
