'use client';
import Link from 'next/link';
import { useProjects } from '@/store/projectStore';
import { PROJECT_STATUSES, PROJECT_STEPS } from '@/lib/constants';
import { formatDate, timeAgo } from '@/lib/utils';

export default function DashboardPage() {
  const { projects } = useProjects();

  const total = projects.length;
  const complete = projects.filter(p => p.status === 'complete' || p.status === 'optimized').length;
  const inProgress = projects.filter(p => p.status === 'in_progress').length;
  const drafts = projects.filter(p => p.status === 'draft').length;

  const recent = [...projects].sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  ).slice(0, 5);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your ThermoShelter AI projects</p>
      </div>

      {/* Stats */}
      <div className="stagger-children" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem', marginBottom: '2.5rem',
      }}>
        {[
          { label: 'Total Projects', value: total,      icon: '📁', color: '#2563EB' },
          { label: 'Optimized',      value: complete,   icon: '✅', color: '#059669' },
          { label: 'In Progress',    value: inProgress, icon: '⚡', color: '#D97706' },
          { label: 'Drafts',         value: drafts,     icon: '📝', color: '#64748B' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', right: '1rem', top: '1rem',
              fontSize: '1.5rem', opacity: .15,
            }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Recent Projects */}
        <div className="card-flat">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="section-title">Recent Projects</h2>
            <Link href="/projects" className="btn btn-ghost btn-sm">View all →</Link>
          </div>

          {recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>📭</div>
              No projects yet. <Link href="/projects" style={{ color: 'var(--color-secondary)' }}>Create one</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.625rem' }}>
              {recent.map(project => {
                const statusInfo = PROJECT_STATUSES[project.status];
                return (
                  <Link key={project.id} href={`/projects/${project.id}/location`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '.875rem 1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      background: 'white',
                      transition: 'all .15s',
                    }} onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#3B82F6';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 3px rgba(59,130,246,.08)';
                    }} onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    }}>
                      <div style={{
                        width: '36px', height: '36px', flexShrink: 0,
                        background: 'var(--color-surface-muted)',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                      }}>🏗️</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {project.name}
                        </div>
                        <div style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginTop: '.1rem' }}>
                          Updated {timeAgo(project.updated_at)}
                        </div>
                      </div>
                      <span className={`badge ${statusInfo.badge}`}>{statusInfo.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions + Workflow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Quick Actions */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <Link href="/projects" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                + New Project
              </Link>
              <Link href="/projects" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                📁 Browse Projects
              </Link>
            </div>
          </div>

          {/* Workflow Reference */}
          <div className="card-flat">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Design Workflow</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {PROJECT_STEPS.map((step, i) => (
                <div key={step.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '.75rem',
                  padding: '.5rem .625rem',
                  borderRadius: '6px',
                }}>
                  <div style={{
                    width: '24px', height: '24px', flexShrink: 0,
                    background: 'var(--color-secondary-muted)',
                    color: 'var(--color-secondary)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '.7rem', fontWeight: 700,
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: '.8375rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {step.icon} {step.label}
                    </div>
                    <div style={{ fontSize: '.75rem', color: 'var(--color-text-muted)' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
