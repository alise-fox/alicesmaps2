import React, { createContext, useContext, useState } from 'react';
import { MarkerData } from '../types';

interface MarkersContextValue {
  markers: MarkerData[];
  addMarker: (marker: MarkerData) => void;
  updateMarker: (id: string, data: Partial<MarkerData>) => void;
}

const MarkersContext = createContext<MarkersContextValue | undefined>(undefined);

export const useMarkers = () => {
  const context = useContext(MarkersContext);
  if (!context) throw new Error('useMarkers must be used within a MarkersProvider');
  return context;
};

export const MarkersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const addMarker = (marker: MarkerData) => {
    setMarkers(prev => [...prev, marker]);
  };

  const updateMarker = (id: string, data: Partial<MarkerData>) => {
    setMarkers(prev =>
      prev.map(m => (m.id === id ? { ...m, ...data } : m))
    );
  };

  return (
    <MarkersContext.Provider value={{ markers, addMarker, updateMarker }}>
      {children}
    </MarkersContext.Provider>
  );
};