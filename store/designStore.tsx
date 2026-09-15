'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface DesignState {
  shelterType: string;
  material: string;
  width: number;
  length: number;
  height: number;
  orientation: number;
  roofType: string;
  windowRatio: number;
  insulationLayer: number;
}

const DEFAULTS: DesignState = {
  shelterType: 'residential',
  material: 'concrete',
  width: 8,
  length: 12,
  height: 3,
  orientation: 0,
  roofType: 'flat',
  windowRatio: 0.15,
  insulationLayer: 50,
};

interface DesignStore {
  design: DesignState;
  setDesign: (partial: Partial<DesignState>) => void;
  resetDesign: () => void;
}

const DesignContext = createContext<DesignStore | null>(null);

export function DesignProvider({ children }: { children: ReactNode }) {
  const [design, setDesignState] = useState<DesignState>(DEFAULTS);

  const setDesign = (partial: Partial<DesignState>) =>
    setDesignState(prev => ({ ...prev, ...partial }));

  const resetDesign = () => setDesignState(DEFAULTS);

  return (
    <DesignContext.Provider value={{ design, setDesign, resetDesign }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign(): DesignStore {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error('useDesign must be used within <DesignProvider>');
  return ctx;
}
