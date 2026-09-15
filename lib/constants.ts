// App-wide constants

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  projects: '/projects',
  project: (id: string) => `/projects/${id}`,
  projectStep: (id: string, step: string) => `/projects/${id}/${step}`,
};

export const PROJECT_STEPS = [
  { id: 'location',     label: 'Location',    icon: '📍', desc: 'Define project site' },
  { id: 'climate',      label: 'Climate',     icon: '🌡️', desc: 'Analyse climate data' },
  { id: 'design',       label: 'Design',      icon: '🏗️', desc: 'Configure shelter design' },
  { id: 'simulation',   label: 'Simulation',  icon: '⚡', desc: 'Run thermal simulation' },
  { id: 'optimization', label: 'Optimize',    icon: '🔧', desc: 'AI-powered optimization' },
  { id: 'report',       label: 'Report',      icon: '📊', desc: 'Export final report' },
] as const;

export type ProjectStep = typeof PROJECT_STEPS[number]['id'];

export const SHELTER_TYPES = [
  { id: 'residential', label: 'Residential', desc: 'Single-family dwelling' },
  { id: 'commercial',  label: 'Commercial',  desc: 'Office / retail building' },
  { id: 'industrial',  label: 'Industrial',  desc: 'Warehouse / factory' },
  { id: 'emergency',   label: 'Emergency',   desc: 'Rapid-deploy shelter' },
] as const;

export const MATERIALS = [
  { id: 'concrete',  label: 'Reinforced Concrete', r_value: 0.08,  cost: 'high' },
  { id: 'brick',     label: 'Clay Brick',           r_value: 0.2,   cost: 'medium' },
  { id: 'timber',    label: 'Timber Frame',         r_value: 1.41,  cost: 'medium' },
  { id: 'steel',     label: 'Steel Frame',          r_value: 0.003, cost: 'high' },
  { id: 'adobe',     label: 'Adobe / Rammed Earth', r_value: 0.44,  cost: 'low' },
  { id: 'sip',       label: 'SIP Panels',           r_value: 5.6,   cost: 'high' },
] as const;

export const CLIMATE_ZONES = [
  'Tropical Humid', 'Tropical Dry', 'Subtropical', 'Mediterranean',
  'Semi-Arid', 'Arid / Desert', 'Temperate Oceanic', 'Humid Continental',
  'Subarctic / Boreal', 'Tundra', 'Highland / Alpine',
] as const;

export const PROJECT_STATUSES = {
  draft:      { label: 'Draft',       badge: 'badge-slate' },
  in_progress:{ label: 'In Progress', badge: 'badge-blue' },
  simulated:  { label: 'Simulated',   badge: 'badge-amber' },
  optimized:  { label: 'Optimized',   badge: 'badge-green' },
  complete:   { label: 'Complete',    badge: 'badge-green' },
} as const;
