import { Sidebar } from "@/components/layout/Sidebar";
import { Stepper } from "@/components/layout/Stepper";
import { ReactNode } from "react";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface-alt)] print:h-auto print:bg-white print:block">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden print:overflow-visible print:block">
        <div className="print:hidden">
          <Stepper projectId={projectId} />
        </div>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0 print:overflow-visible print:block">
          {children}
        </main>
      </div>
    </div>
  );
}
