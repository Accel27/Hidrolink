import React, { createContext, useContext, useState, useEffect } from 'react';
import { Truck, ServiceRequest } from '@/types';
import { mockTrucks } from '@/mocks/trucks';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppContextType = {
  trucks: Truck[];
  requests: ServiceRequest[];
  createRequest: (request: ServiceRequest) => void;
  updateRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  rateRequest: (requestId: string, truckId: string, stars: number) => void;
  clearRequests: () => void;
  toggleTruckAvailability: (truckId: string, isActive: boolean) => void; // <-- NUEVO
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>(mockTrucks);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('@hidrolink_requests').then(data => {
      if (data) setRequests(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@hidrolink_requests', JSON.stringify(requests));
  }, [requests]);

  const createRequest = (request: ServiceRequest) => {
    setRequests(prev => [request, ...prev]);
  };

  const updateRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const clearRequests = () => {
    const activeRequests = requests.filter(
      req => req.status !== 'completed' && req.status !== 'cancelled'
    );
    setRequests(activeRequests);
  };

  const rateRequest = (requestId: string, truckId: string, stars: number) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, isRated: true } : req));
    setTrucks(prev => prev.map(truck => {
      if (truck.id === truckId) {
        const newRating = ((truck.rating * 4) + stars) / 5;
        return { ...truck, rating: Number(newRating.toFixed(1)) };
      }
      return truck;
    }));
  };

  // NUEVA FUNCIÓN: Cambia el estado del camión globalmente
  const toggleTruckAvailability = (truckId: string, isActive: boolean) => {
    setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, isActive } : t));
  };

  return (
    <AppContext.Provider value={{ trucks, requests, createRequest, updateRequestStatus, rateRequest, clearRequests, toggleTruckAvailability }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);