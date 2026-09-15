// Pass-through layout — sidebar is handled by each sub-route's own layout
// (e.g. /projects/page.tsx has its own sidebar, and /projects/[projectId]/layout.tsx has its own)
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
