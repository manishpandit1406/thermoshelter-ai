/** Merge class names (simple implementation, no dependencies required) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format a number with commas */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format a date string to a human-readable form */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/** Format a date relative to now */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `${days}d ago`;
  return formatDate(iso);
}

/** Clamp a number between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/** Interpolate between two colors (hex) for heat-map style coloring */
export function heatColor(value: number, min = 0, max = 100): string {
  const t = clamp((value - min) / (max - min), 0, 1);
  const r = Math.round(37 + t * (220 - 37));
  const g = Math.round(99 + t * (38 - 99));
  const b = Math.round(235 + t * (38 - 235));
  return `rgb(${r},${g},${b})`;
}

/** Convert degrees Celsius to Fahrenheit */
export function toF(c: number): number {
  return +(c * 9/5 + 32).toFixed(1);
}

/** Get initials from a name string */
export function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/** Generate a random ID (for demo/mock data) */
export function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Degree symbol shortcut */
export const DEG = '°';

/** Sleep for ms milliseconds */
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
