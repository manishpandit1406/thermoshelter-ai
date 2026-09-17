'use client';
import { useRouter, useParams } from 'next/navigation';
import { useState, useRef } from 'react';

const REPORT_DATA = {
  project: 'Desert Shelter — Rajasthan',
  location: 'Jaisalmer, Rajasthan (26.92°N, 70.91°E, 225 m)',
  climate: 'BWh — Hot Arid Desert (Köppen)',
  shelterType: 'Residential',
  material: 'Reinforced Concrete (optimised → Rammed Earth)',
  dimensions: '8 × 12 × 3 m',
  floorArea: '96 m²',
  orientation: '15° East of South',
  rating: 'B+',
  comfortScore: 84,
  energySavings: 68.3,
  annualHeatLoad: '2,812 kWh',
  annualCoolLoad: '7,061 kWh',
  totalLoad: '9,873 kWh',
  sections: [
    {
      title: '1. Executive Summary',
      content: 'This report presents the thermal performance analysis of a residential shelter located in Jaisalmer, Rajasthan — classified under the BWh (Hot Arid Desert) Köppen climate zone. The facility is designed to provide thermal comfort with a minimal mechanical cooling requirement. Following AI-driven optimization, the predicted annual energy load is 9,873 kWh/year, representing a 68.3% reduction from the baseline design.',
    },
    {
      title: '2. Site & Climate',
      content: 'The site is located at latitude 26.92°N, longitude 70.91°E, at an elevation of 225 m above sea level. The climate is characterised by extreme summer temperatures (peak 48°C), very low annual rainfall (112 mm), and high solar irradiance (3,480 sun-hours/year). Average annual temperature is 33.4°C with significant diurnal variation (often 15–20°C range), which is exploited by the high thermal mass design strategy.',
    },
    {
      title: '3. Design Parameters',
      content: 'The shelter utilises rammed earth walls (R-value: 0.44 m²·K/W) with 150 mm mineral wool roof insulation. Orientation is set at 15° East of South to optimise passive solar gain in winter while reducing direct west-facing exposure. Window-to-wall ratio is limited to 10% with horizontal 600 mm overhangs on the south facade. Wind-catcher towers (Badgir design) provide natural night ventilation.',
    },
    {
      title: '4. Thermal Simulation Results',
      content: 'The annual thermal simulation computed heating and cooling loads across all 8,760 hours of the year using climate data from the ERA5 reanalysis dataset. Peak indoor temperature reaches 36.4°C in May-June, while the minimum is 14.8°C in December-January. The comfort score of 84% indicates the dwelling achieves ASHRAE 55-2020 adaptive comfort thresholds for >84% of occupied hours.',
    },
    {
      title: '5. Optimisation Measures',
      content: 'Six AI-driven optimisation measures were applied: (1) Roof insulation upgrade to 150 mm (−18.4%), (2) Optimal building orientation (−12.1%), (3) WWR reduction to 10% (−7.8%), (4) Horizontal overhangs (−6.3%), (5) Wind-catcher towers (−9.5%), (6) Rammed earth walls (−14.2%). Combined effect: 68.3% reduction in energy demand versus baseline concrete design.',
    },
    {
      title: '6. Recommendations',
      content: 'The following additional measures are recommended for detailed engineering design: installation of a solar photovoltaic system (4 kWp), inclusion of a buried water cistern for thermal mass cooling, and integration of desert-adapted landscaping on the east and west elevations. A detailed structural analysis of the rammed earth walls should be commissioned for seismic zone compliance.',
    },
  ],
};

export default function ReportPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '860px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">📊 Project Report</h1>
          <p className="page-subtitle">Final thermal analysis and optimization report</p>
        </div>
        <div className="print:hidden" style={{ display: 'flex', gap: '.75rem' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            🖨️ Print / Export PDF
          </button>
        </div>
      </div>

      {/* Report Cover */}
      <div className="card-flat" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg,#0F172A 0%,#1E3A8A 100%)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '.75rem', letterSpacing: '.1em', opacity: .6, marginBottom: '.625rem' }}>
              THERMOSHELTER AI — THERMAL ANALYSIS REPORT
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '.5rem' }}>
              {REPORT_DATA.project}
            </h2>
            <div style={{ opacity: .7, fontSize: '.875rem', lineHeight: 1.7 }}>
              <div>📍 {REPORT_DATA.location}</div>
              <div>🌡️ {REPORT_DATA.climate}</div>
              <div>🏗️ {REPORT_DATA.shelterType} · {REPORT_DATA.dimensions}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: '#34D399' }}>
              {REPORT_DATA.rating}
            </div>
            <div style={{ fontSize: '.75rem', opacity: .6, marginTop: '.25rem' }}>Performance Rating</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34D399', marginTop: '.5rem' }}>
              {REPORT_DATA.comfortScore}%
            </div>
            <div style={{ fontSize: '.75rem', opacity: .6 }}>Comfort Score</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Energy Savings', value: `−${REPORT_DATA.energySavings}%`, icon: '⚡', color: '#059669' },
          { label: 'Annual Heat Load',    value: REPORT_DATA.annualHeatLoad, icon: '🔵', color: '#2563EB' },
          { label: 'Annual Cool Load',    value: REPORT_DATA.annualCoolLoad, icon: '🔴', color: '#EF4444' },
          { label: 'Total Energy',   value: REPORT_DATA.totalLoad, icon: '📊', color: '#64748B' },
        ].map(m => (
          <div key={m.label} className="stat-card">
            <div style={{ fontSize: '1.25rem', marginBottom: '.375rem' }}>{m.icon}</div>
            <div className="stat-value" style={{ color: m.color, fontSize: '1.25rem' }}>{m.value}</div>
            <div className="stat-label">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Design Summary Table */}
      <div className="card-flat" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>Design Summary</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
          <tbody>
            {[
              ['Shelter Type', REPORT_DATA.shelterType],
              ['Primary Material', REPORT_DATA.material],
              ['Dimensions', REPORT_DATA.dimensions],
              ['Floor Area', REPORT_DATA.floorArea],
              ['Orientation', REPORT_DATA.orientation],
              ['Climate Zone', REPORT_DATA.climate],
            ].map(([k, v], i) => (
              <tr key={k} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'var(--color-surface-alt)' : 'white' }}>
                <td style={{ padding: '.625rem 1rem', fontWeight: 600, color: 'var(--color-text-secondary)', width: '40%', fontSize: '.8125rem' }}>{k}</td>
                <td style={{ padding: '.625rem 1rem', color: 'var(--color-text-primary)' }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {REPORT_DATA.sections.map(section => (
          <div key={section.title} className="card-flat">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '.875rem', paddingBottom: '.625rem', borderBottom: '1px solid var(--color-border)' }}>
              {section.title}
            </h2>
            <p style={{ fontSize: '.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Optimisation Checklist */}
      <div className="card-flat" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>Applied Optimisations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {[
            { item: 'Roof insulation upgraded to 150 mm mineral wool', saving: '−18.4%' },
            { item: 'Building orientation set to 15° East of South', saving: '−12.1%' },
            { item: 'WWR reduced to 10% with south-facing clerestory', saving: '−7.8%' },
            { item: 'Horizontal 600 mm overhangs on south facade', saving: '−6.3%' },
            { item: 'Wind-catcher (Badgir) towers for natural ventilation', saving: '−9.5%' },
            { item: 'Rammed earth walls (high thermal mass)', saving: '−14.2%' },
          ].map(({ item, saving }) => (
            <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem .625rem', borderRadius: '6px', background: '#F0FDF4', border: '1px solid #D1FAE5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
                <span style={{ color: '#059669', fontSize: '1rem' }}>✓</span>
                <span style={{ fontSize: '.875rem', color: 'var(--color-text-primary)' }}>{item}</span>
              </div>
              <span className="mono badge badge-green" style={{ flexShrink: 0 }}>{saving}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', padding: '.875rem', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #86EFAC' }}>
          <div style={{ fontWeight: 700, color: '#059669', fontSize: '1.1rem' }}>Total: −68.3% energy savings vs. baseline</div>
          <div style={{ fontSize: '.8125rem', color: '#047857', marginTop: '.25rem' }}>From 31,061 kWh/year (baseline) → 9,873 kWh/year (optimised)</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)', fontSize: '.8125rem' }}>
        <div>Generated by ThermoShelter AI · Physics-Based Shelter Design Platform</div>
        <div style={{ marginTop: '.25rem' }}>Project ID: {projectId} · {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
      </div>
    </div>
  );
}
