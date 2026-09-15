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
    <div className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center overflow-x-auto">
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
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-slate-700 hover:text-blue-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs mr-2 transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-700 font-bold border-2 border-blue-600' : 
                    isCompleted ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}>
                    {stepIdx + 1}
                  </span>
                  {step.label}
                </Link>
                {stepIdx !== steps.length - 1 ? (
                  <div className="ml-2 md:ml-4 w-4 md:w-8 h-px bg-slate-200" />
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  );
}
