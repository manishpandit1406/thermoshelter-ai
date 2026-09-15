'use client';
/**
 * Project store — uses localStorage for persistence without external deps.
 * Exported as React context + hook.
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Project } from '@/lib/api';
import { randomId } from '@/lib/utils';

const STORAGE_KEY = 'thermoshelter_projects';

// ─── Seed data (shown until real backend data loads) ──────────────
const SEED_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    name: 'Desert Shelter — Rajasthan',
    description: 'Passive cooling shelter for extreme arid climate',
    status: 'optimized',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Himalayan Base Camp',
    description: 'Insulated emergency shelter for high altitude',
    status: 'simulated',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Coastal Kerala Residence',
    description: 'Humid tropical dwelling with natural ventilation',
    status: 'in_progress',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// ─── Context ──────────────────────────────────────────────────────

interface ProjectStore {
  projects: Project[];
  activeProjectId: string | null;
  setActiveProject: (id: string) => void;
  addProject: (name: string, description?: string) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectStore | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Load from localStorage or use seed data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProjects(JSON.parse(stored));
      } else {
        setProjects(SEED_PROJECTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
      }
    } catch {
      setProjects(SEED_PROJECTS);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  const setActiveProject = (id: string) => setActiveProjectId(id);

  const addProject = (name: string, description?: string): Project => {
    const project: Project = {
      id: randomId(),
      name,
      description,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects(prev => [project, ...prev]);
    return project;
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p)
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  return (
    <ProjectContext.Provider value={{
      projects, activeProjectId,
      setActiveProject, addProject, updateProject, deleteProject, getProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects(): ProjectStore {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within <ProjectProvider>');
  return ctx;
}
