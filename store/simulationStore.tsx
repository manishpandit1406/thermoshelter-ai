'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { SimulationResult } from '@/lib/api';

interface SimulationStore {
  result: SimulationResult | null;
  isRunning: boolean;
  setResult: (r: SimulationResult | null) => void;
  setRunning: (v: boolean) => void;
}

const SimulationContext = createContext<SimulationStore | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setRunning] = useState(false);

  return (
    <SimulationContext.Provider value={{ result, isRunning, setResult, setRunning }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationStore {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within <SimulationProvider>');
  return ctx;
}
