'use client';
/**
 * Project store — uses localStorage for persistence without external deps.
 * Exported as React context + hook.
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Project } from '@/lib/api';
import { randomId } from '@/lib/utils';

// Backend API URL
const API_URL = 'http://127.0.0.1:8000/api/v1/projects';

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

  // Fetch from backend
  const fetchProjects = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const setActiveProject = (id: string) => setActiveProjectId(id);

  const addProject = async (name: string, description?: string): Promise<Project> => {
    const tempProject: Project = {
      id: randomId(),
      name,
      description,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Optimistic update
    setProjects(prev => [tempProject, ...prev]);
    
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        const realProject = await res.json();
        setProjects(prev => prev.map(p => p.id === tempProject.id ? realProject : p));
        return realProject;
      }
    } catch (err) {
      console.error("Failed to add project:", err);
    }
    return tempProject;
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    // Optimistic update
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p)
    );
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  const deleteProject = async (id: string) => {
    // Optimistic delete
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
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
