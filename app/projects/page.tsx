'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/store/projectStore';
import { PROJECT_STATUSES } from '@/lib/constants';
import { timeAgo } from '@/lib/utils';
import { Sidebar } from '@/components/layout/Sidebar';

export default function ProjectsPage() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ProjectsContent />
      </div>
    </div>
  );
}

function ProjectsContent() {
  const router = useRouter();
  const { projects, addProject, deleteProject } = useProjects();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [search, setSearch] = useState('');

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate() {
    if (!newName.trim()) return;
    const project = addProject(newName.trim(), newDesc.trim() || undefined);
    setShowNew(false);
    setNewName('');
    setNewDesc('');
    router.push(`/projects/${project.id}/location`);
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 2.5rem', maxWidth: '1000px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn btn-primary">
          + New Project
        </button>
      </div>

      {/* New Project Modal */}
      {showNew && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, backdropFilter: 'blur(4px)',
        }} onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>New Project</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Project Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Desert Shelter — Rajasthan"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>
              <div>
                <label className="form-label">Description (optional)</label>
                <textarea
                  className="form-input"
                  placeholder="Brief description of the project..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '.5rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreate} disabled={!newName.trim()}>
                  Create & Start →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          className="form-input"
          placeholder="🔍 Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '360px' }}
        />
      </div>

      {/* Project Cards Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {search ? '🔍' : '📁'}
          </div>
          <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '.5rem' }}>
            {search ? 'No projects found' : 'No projects yet'}
          </div>
          <p style={{ fontSize: '.875rem' }}>
            {search ? 'Try a different search term.' : 'Create your first project to get started.'}
          </p>
          {!search && (
            <button onClick={() => setShowNew(true)} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              + New Project
            </button>
          )}
        </div>
      ) : (
        <div className="stagger-children" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {filtered.map(project => {
            const statusInfo = PROJECT_STATUSES[project.status];
            return (
              <div key={project.id} className="card" style={{ position: 'relative' }}>
                {/* Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span className={`badge ${statusInfo.badge}`}>{statusInfo.label}</span>
                  <button
                    onClick={e => { e.preventDefault(); if (confirm('Delete this project?')) deleteProject(project.id); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--color-text-muted)', fontSize: '1rem', padding: '.25rem',
                      borderRadius: '4px', lineHeight: 1,
                    }}
                    title="Delete project"
                  >✕</button>
                </div>

                {/* Project Info */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '.375rem', lineHeight: 1.3 }}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p style={{ fontSize: '.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      {project.description}
                    </p>
                  )}
                  <div style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginTop: '.625rem' }}>
                    Updated {timeAgo(project.updated_at)} · Created {timeAgo(project.created_at)}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '.625rem' }}>
                  <Link href={`/projects/${project.id}/location`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    Open →
                  </Link>
                  <Link href={`/projects/${project.id}/report`} className="btn btn-secondary btn-sm">
                    📊 Report
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
