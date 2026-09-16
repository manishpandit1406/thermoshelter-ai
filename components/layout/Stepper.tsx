'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';

const steps = [
  { id: 'location', label: 'Input', pathSegment: 'location' },
  { id: 'climate', label: 'Climate', pathSegment: 'climate' },
  { id: 'design', label: 'Design', pathSegment: 'design' },
  { id: 'simulation', label: 'Simulate', pathSegment: 'simulation' },
  { id: 'optimization', label: 'Optimize', pathSegment: 'optimization' },
  { id: 'report', label: 'Output', pathSegment: 'report' },
];

export function Stepper({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  
  return (
    <div className="w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-4 flex items-center overflow-x-auto">
      <nav aria-label="Progress" className="w-full">
        <ol role="list" className="flex items-center space-x-2 md:space-x-4 min-w-max">
          {steps.map((step, stepIdx) => {
            const isActive = pathname.includes(`/projects/${projectId}/${step.pathSegment}`);
            const isCompleted = steps.findIndex(s => pathname.includes(s.pathSegment)) > stepIdx;
            
            return (
              <li key={step.id} className="flex items-center">
                <Link 
                  href={`/projects/${projectId}/${step.pathSegment}`}
                  className={`flex items-center text-sm font-medium transition-colors ${
                    isActive ? 'text-[var(--color-secondary)]' : 
                    isCompleted ? 'text-[var(--color-text-primary)] hover:text-[var(--color-secondary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs mr-2 transition-colors ${
                    isActive ? 'bg-[var(--color-secondary-muted)] text-[var(--color-secondary)] font-bold border-2 border-[var(--color-secondary)]' : 
                    isCompleted ? 'bg-[var(--color-surface-muted)] text-[var(--color-secondary)] border border-[var(--color-border-strong)]' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                  }`}>
                    {stepIdx + 1}
                  </span>
                  {step.label}
                </Link>
                {stepIdx !== steps.length - 1 ? (
                  <div className="ml-2 md:ml-4 w-4 md:w-8 h-px bg-[var(--color-border)]" />
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  );
}
