import { API_BASE_URL } from './constants';

// ─── Types ────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'in_progress' | 'simulated' | 'optimized' | 'complete';
  created_at: string;
  updated_at: string;
  location?: Location;
}

export interface Location {
  id: string;
  project_id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
}

export interface ClimateProfile {
  id: string;
  location_id: string;
  classification: string;
  source: string;
  environmental_data: Record<string, unknown>;
}

export interface DesignParameters {
  id: string;
  project_id: string;
  shelter_type: string;
  material: string;
  width: number;
  length: number;
  height: number;
  orientation: number;
  insulation_r_value?: number;
}

export interface SimulationResult {
  id: string;
  project_id: string;
  annual_heat_load: number;
  annual_cooling_load: number;
  peak_temp_inside: number;
  min_temp_inside: number;
  energy_efficiency_rating: string;
  comfort_score: number;
  monthly_data: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  avg_temp_outside: number;
  avg_temp_inside: number;
  heat_load: number;
  cooling_load: number;
}

export interface OptimizationResult {
  id: string;
  project_id: string;
  suggestions: Suggestion[];
  energy_savings_pct: number;
  cost_savings_annual: number;
}

export interface Suggestion {
  category: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  energy_saving_pct: number;
}

// ─── Fetch helper ─────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Projects ─────────────────────────────────────────────────────

export const projectsApi = {
  list:   ()            => apiFetch<Project[]>('/api/v1/projects'),
  get:    (id: string)  => apiFetch<Project>(`/api/v1/projects/${id}`),
  create: (data: Partial<Project>) =>
    apiFetch<Project>('/api/v1/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Project>) =>
    apiFetch<Project>(`/api/v1/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<void>(`/api/v1/projects/${id}`, { method: 'DELETE' }),
};

// ─── Locations ────────────────────────────────────────────────────

export const locationsApi = {
  get:    (projectId: string) => apiFetch<Location>(`/api/v1/projects/${projectId}/location`),
  save:   (projectId: string, data: Omit<Location, 'id' | 'project_id'>) =>
    apiFetch<Location>(`/api/v1/projects/${projectId}/location`, {
      method: 'POST', body: JSON.stringify({ ...data, project_id: projectId }),
    }),
};

// ─── Climate ─────────────────────────────────────────────────────

export const climateApi = {
  get:     (projectId: string) => apiFetch<ClimateProfile>(`/api/v1/projects/${projectId}/climate`),
  analyze: (projectId: string) =>
    apiFetch<ClimateProfile>(`/api/v1/projects/${projectId}/climate/analyze`, { method: 'POST' }),
};

// ─── Design ──────────────────────────────────────────────────────

export const designApi = {
  get:  (projectId: string) => apiFetch<DesignParameters>(`/api/v1/projects/${projectId}/design`),
  save: (projectId: string, data: Omit<DesignParameters, 'id' | 'project_id'>) =>
    apiFetch<DesignParameters>(`/api/v1/projects/${projectId}/design`, {
      method: 'POST', body: JSON.stringify({ ...data, project_id: projectId }),
    }),
};

// ─── Simulation ───────────────────────────────────────────────────

export const simulationApi = {
  get: (projectId: string) => apiFetch<SimulationResult>(`/api/v1/projects/${projectId}/simulation`),
  run: (projectId: string) =>
    apiFetch<SimulationResult>(`/api/v1/projects/${projectId}/simulation/run`, { method: 'POST' }),
};

// ─── Optimization ─────────────────────────────────────────────────

export const optimizationApi = {
  get: (projectId: string) => apiFetch<OptimizationResult>(`/api/v1/projects/${projectId}/optimization`),
  run: (projectId: string) =>
    apiFetch<OptimizationResult>(`/api/v1/projects/${projectId}/optimization/run`, { method: 'POST' }),
};
