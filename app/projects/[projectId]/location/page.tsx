'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface Props { params: Promise<{ projectId: string }> }

export default function LocationPage({ params }: Props) {
  const { projectId } = use(params);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    latitude: '',
    longitude: '',
    elevation: '',
  });
  const [saving, setSaving] = useState(false);

  // Quick presets for Indian cities
  const presets = [
    { name: 'Jaisalmer, Rajasthan',   lat: '26.9157',  lng: '70.9083',  elev: '225'  },
    { name: 'Mumbai, Maharashtra',     lat: '19.0760',  lng: '72.8777',  elev: '11'   },
    { name: 'Shimla, Himachal Pradesh',lat: '31.1048',  lng: '77.1734',  elev: '2206' },
    { name: 'Chennai, Tamil Nadu',     lat: '13.0827',  lng: '80.2707',  elev: '6'    },
    { name: 'Leh, Ladakh',            lat: '34.1526',  lng: '77.5771',  elev: '3524' },
    { name: 'Kolkata, West Bengal',    lat: '22.5726',  lng: '88.3639',  elev: '9'    },
  ];

  function applyPreset(p: typeof presets[0]) {
    setForm({ name: p.name, latitude: p.lat, longitude: p.lng, elevation: p.elev });
  }

  async function handleSave() {
    if (!form.name || !form.latitude || !form.longitude) return;
    setSaving(true);
    // Simulate save delay (replace with real API call)
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    router.push(`/projects/${projectId}/climate`);
  }

  const lat = parseFloat(form.latitude);
  const lng = parseFloat(form.longitude);
  const validCoords = !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">📍 Project Location</h1>
        <p className="page-subtitle">Define the geographic coordinates of your shelter site</p>
      </div>

      {/* Quick Presets */}
      <div className="card-flat" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title" style={{ marginBottom: '.875rem' }}>Quick Presets</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
          {presets.map(p => (
            <button
              key={p.name}
              className="btn btn-secondary btn-sm"
              onClick={() => applyPreset(p)}
              style={{ fontSize: '.7875rem' }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Location Form */}
      <div className="card-flat" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Site Details</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Location Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Desert Shelter Site — Jaisalmer"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Latitude *</label>
              <input
                className="form-input mono"
                placeholder="e.g. 26.9157"
                value={form.latitude}
                onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                type="number"
                step="0.0001"
                min="-90"
                max="90"
              />
              <div style={{ fontSize: '.7375rem', color: 'var(--color-text-muted)', marginTop: '.25rem' }}>
                −90° (S) to +90° (N)
              </div>
            </div>
            <div>
              <label className="form-label">Longitude *</label>
              <input
                className="form-input mono"
                placeholder="e.g. 70.9083"
                value={form.longitude}
                onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                type="number"
                step="0.0001"
                min="-180"
                max="180"
              />
              <div style={{ fontSize: '.7375rem', color: 'var(--color-text-muted)', marginTop: '.25rem' }}>
                −180° (W) to +180° (E)
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '200px' }}>
            <label className="form-label">Elevation (m)</label>
            <input
              className="form-input mono"
              placeholder="e.g. 225"
              value={form.elevation}
              onChange={e => setForm(f => ({ ...f, elevation: e.target.value }))}
              type="number"
              step="1"
            />
          </div>
        </div>
      </div>

      {/* Coordinate Preview */}
      {validCoords && (
        <div className="card-flat animate-fade-in" style={{ marginBottom: '1.5rem', borderColor: '#BFDBFE', background: '#F0F7FF' }}>
          <h3 style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '1rem' }}>
            📍 Site Preview
          </h3>

          {/* Simple compass/grid visual */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '120px', height: '120px', flexShrink: 0,
              border: '2px solid #BFDBFE',
              borderRadius: '50%',
              background: 'white',
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Compass lines */}
              <div style={{ position: 'absolute', width: '100%', height: '1px', background: '#DBEAFE', top: '50%' }} />
              <div style={{ position: 'absolute', height: '100%', width: '1px', background: '#DBEAFE', left: '50%' }} />
              {/* Dot at lat/lng mapped position */}
              <div style={{
                position: 'absolute',
                left: `${((lng + 180) / 360) * 100}%`,
                top: `${((90 - lat) / 180) * 100}%`,
                width: '10px', height: '10px',
                background: 'var(--color-secondary)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 3px rgba(37,99,235,.2)',
              }} />
              {['N','S','E','W'].map((d, i) => (
                <span key={d} style={{
                  position: 'absolute',
                  fontSize: '.625rem', fontWeight: 700, color: '#64748B',
                  ...[{ top: '4px', left: '50%', transform: 'translateX(-50%)' },
                     { bottom: '4px', left: '50%', transform: 'translateX(-50%)' },
                     { right: '4px', top: '50%', transform: 'translateY(-50%)' },
                     { left: '4px', top: '50%', transform: 'translateY(-50%)' }][i],
                }}>{d}</span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.625rem' }}>
              {[
                { label: 'Latitude',  value: `${lat >= 0 ? '+' : ''}${lat.toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}` },
                { label: 'Longitude', value: `${lng >= 0 ? '+' : ''}${lng.toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}` },
                form.elevation ? { label: 'Elevation', value: `${parseFloat(form.elevation).toFixed(0)} m ASL` } : null,
              ].filter(Boolean).map(row => (
                <div key={row!.label} style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', width: '70px' }}>{row!.label}</span>
                  <span className="mono" style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {row!.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!form.name || !validCoords || saving}
        >
          {saving ? (
            <><span className="loading-spin" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%' }} /> Saving…</>
          ) : (
            'Save & Continue → Climate'
          )}
        </button>
      </div>
    </div>
  );
}
