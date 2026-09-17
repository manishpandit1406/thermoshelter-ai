'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SHELTER_TYPES, MATERIALS, ROOF_MATERIALS, GLAZING_TYPES } from '@/lib/constants';

const ROOF_TYPES = [
  { id: 'flat',     label: 'Flat Roof',       icon: '▬' },
  { id: 'pitched',  label: 'Pitched Roof',    icon: '▲' },
  { id: 'vaulted',  label: 'Vaulted / Arch',  icon: '⌒' },
  { id: 'mono',     label: 'Mono-pitch',      icon: '◤' },
];

export default function DesignPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();

  const [design, setDesign] = useState({
    shelterType: 'residential',
    wallMaterial: 'rammed_earth',
    roofType: 'flat',
    roofMaterial: 'metal_sheet',
    glazingType: 'double_glass',
    width: 8,
    length: 12,
    height: 3,
    orientation: 15,
    windowRatio: 15,
    thermalMassOverride: 0,
    insulationMm: 50,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDescription, setAiDescription] = useState('');

  async function handleAiPredict(promptOverride?: string) {
    setAiLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/ai-predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptOverride !== undefined ? promptOverride : aiPrompt })
      });
      if (res.ok) {
        const data = await res.json();
        setDesign(prev => ({ ...prev, ...data.design }));
        setAiDescription(data.description);
      }
    } catch (err) {
      console.error(err);
    }
    setAiLoading(false);
  }

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/design`)
      .then(res => res.json())
      .then(data => {
        if (data && data.width) {
          setDesign(data);
          // If a design exists, we might want to still fetch the description if it's empty, 
          // but for now, we just auto-generate if it's a brand new design.
        } else {
          // No design exists in DB (new project). Auto-generate from location!
          handleAiPredict("");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  async function handleSave() {
    setAiLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/ai-predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      if (res.ok) {
        const data = await res.json();
        setDesign(prev => ({ ...prev, ...data.design }));
        setAiDescription(data.description);
      }
    } catch (err) {
      console.error(err);
    }
    setAiLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/design`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(design)
      });
      router.push(`/projects/${projectId}/simulation`);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  }

  const set = (key: keyof typeof design, value: string | number) =>
    setDesign(d => ({ ...d, [key]: value }));

  const selectedWall = MATERIALS.find(m => m.id === design.wallMaterial) || MATERIALS[0];
  const selectedRoof = ROOF_MATERIALS.find(m => m.id === design.roofMaterial) || ROOF_MATERIALS[0];
  const selectedGlazing = GLAZING_TYPES.find(m => m.id === design.glazingType) || GLAZING_TYPES[0];
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
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">🏗️ Design Parameters</h1>
          <p className="page-subtitle">Configure shelter geometry, materials, and construction details</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleAiPredict}
            disabled={aiLoading}
          >
            {aiLoading ? '🤖 Thinking...' : '🤖 Auto-Optimize for Climate'}
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setDesign({
              shelterType: 'residential', wallMaterial: 'rammed_earth', roofType: 'flat', roofMaterial: 'insulated_panel',
              glazingType: 'triple_glass', width: 6, length: 8, height: 3, orientation: 0, windowRatio: 25, thermalMassOverride: 25000000, insulationMm: 100
            })}
          >
            🏔️ Load Ladakh Preset
          </button>
        </div>
      </div>

      <div className="card-flat" style={{ marginBottom: '1.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <h2 className="section-title" style={{ marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <span>🤖</span> AI Design Assistant
        </h2>
        <textarea
          className="form-input"
          placeholder="Describe your ideal shelter (e.g., 'I want a rammed earth structure with a pitched roof and small windows...')"
          value={aiPrompt}
          onChange={e => setAiPrompt(e.target.value)}
          style={{ minHeight: '80px', marginBottom: '1rem', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleAiPredict()}
            disabled={aiLoading}
          >
            {aiLoading ? 'Generating...' : 'Generate Design from Prompt →'}
          </button>
        </div>
        
        {aiDescription && (
          <div className="animate-fade-in" style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '.75rem' }}>AI Design Description</h3>
            <div style={{ fontSize: '.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: aiDescription.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br/><br/>') }} />
          </div>
        )}
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
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Wall Construction</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {MATERIALS.map(m => (
                <label key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '.75rem 1rem',
                  border: `1.5px solid ${design.wallMaterial === m.id ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  borderRadius: '8px', cursor: 'pointer',
                  background: design.wallMaterial === m.id ? '#EFF6FF' : 'white',
                  transition: 'all .15s',
                }}>
                  <input type="radio" name="wallMaterial" value={m.id} checked={design.wallMaterial === m.id} onChange={() => set('wallMaterial', m.id)} style={{ accentColor: 'var(--color-secondary)' }} />
                  <div style={{ flex: 1 }}><span style={{ fontWeight: 500, fontSize: '.9rem' }}>{m.label}</span></div>
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                    <span className="badge badge-slate" style={{ fontSize: '.7rem' }}>R {m.r_value}</span>
                  </div>
                </label>
              ))}
            </div>
            
            <h2 className="section-title" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Roof Construction</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {ROOF_MATERIALS.map(m => (
                <label key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '.75rem 1rem',
                  border: `1.5px solid ${design.roofMaterial === m.id ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  borderRadius: '8px', cursor: 'pointer',
                  background: design.roofMaterial === m.id ? '#EFF6FF' : 'white',
                }}>
                  <input type="radio" name="roofMaterial" value={m.id} checked={design.roofMaterial === m.id} onChange={() => set('roofMaterial', m.id)} style={{ accentColor: 'var(--color-secondary)' }} />
                  <div style={{ flex: 1 }}><span style={{ fontWeight: 500, fontSize: '.9rem' }}>{m.label}</span></div>
                </label>
              ))}
            </div>

            <h2 className="section-title" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Glazing (Windows)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {GLAZING_TYPES.map(m => (
                <label key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '.75rem 1rem',
                  border: `1.5px solid ${design.glazingType === m.id ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  borderRadius: '8px', cursor: 'pointer',
                  background: design.glazingType === m.id ? '#EFF6FF' : 'white',
                }}>
                  <input type="radio" name="glazingType" value={m.id} checked={design.glazingType === m.id} onChange={() => set('glazingType', m.id)} style={{ accentColor: 'var(--color-secondary)' }} />
                  <div style={{ flex: 1 }}><span style={{ fontWeight: 500, fontSize: '.9rem' }}>{m.label}</span></div>
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                    <span className="badge badge-slate" style={{ fontSize: '.7rem' }}>U {m.u_value}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Roof Type */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Roof Shape</h2>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {ROOF_TYPES.map(r => (
                <button key={r.id} onClick={() => set('roofType', r.id)} style={{ padding: '.625rem 1rem', border: `2px solid ${design.roofType === r.id ? 'var(--color-secondary)' : 'var(--color-border)'}`, borderRadius: '8px', background: design.roofType === r.id ? '#EFF6FF' : 'white', cursor: 'pointer', fontWeight: design.roofType === r.id ? 600 : 400, color: design.roofType === r.id ? 'var(--color-secondary)' : 'var(--color-text-primary)', fontSize: '.875rem', transition: 'all .15s' }}>
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
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.375rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Thermal Mass Override (J/K)</label>
                </div>
                <input
                  type="number" className="form-input" placeholder="0 = Auto Calculate"
                  value={design.thermalMassOverride || ''}
                  onChange={e => set('thermalMassOverride', parseFloat(e.target.value) || 0)}
                />
                <div style={{ fontSize: '.7rem', color: 'var(--color-text-muted)', marginTop: '.15rem' }}>
                  Leave 0 to calculate automatically from wall/roof density and heat capacity. (For extreme heat retention, try 50,000,000+)
                </div>
              </div>
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
              { label: 'Wall Mat',     value: selectedWall.label },
              { label: 'Roof Mat',     value: selectedRoof.label },
              { label: 'Glazing',      value: selectedGlazing.label },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '.4rem 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <span style={{ fontSize: '.8rem', color: '#64748B' }}>{row.label}</span>
                <span className="mono" style={{ fontSize: '.8375rem', fontWeight: 500, color: 'white' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
            {saving ? 'Saving...' : 'Save & Run Simulation →'}
          </button>
          <button className="btn btn-ghost" onClick={() => router.push(`/projects/${projectId}/climate`)} style={{ width: '100%', justifyContent: 'center' }}>
            ← Back to Climate
          </button>
        </div>
      </div>
    </div>
  );
}
