import React, { createContext, useContext, useState, useEffect } from 'react';
import { Truck, ServiceRequest, Message } from '@/types';
import { mockTrucks } from '@/mocks/trucks';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppContextType = {
  trucks: Truck[];
  requests: ServiceRequest[];
  messages: Message[];
  createRequest: (request: ServiceRequest) => void;
  updateRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  rateRequest: (requestId: string, truckId: string, stars: number) => void;
  clearRequests: () => void;
  toggleTruckAvailability: (truckId: string, isActive: boolean) => void;
  sendMessage: (requestId: string, senderId: 'client' | 'driver', text: string) => void;
  markMessagesAsRead: (requestId: string, currentRole: 'client' | 'driver') => void;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>(mockTrucks);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const reqData = await AsyncStorage.getItem('@hidrolink_requests');
      if (reqData) setRequests(JSON.parse(reqData));
      
      const msgData = await AsyncStorage.getItem('@hidrolink_messages');
      if (msgData) setMessages(JSON.parse(msgData));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@hidrolink_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    AsyncStorage.setItem('@hidrolink_messages', JSON.stringify(messages));
  }, [messages]);

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

  const toggleTruckAvailability = (truckId: string, isActive: boolean) => {
    setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, isActive } : t));
  };

  const sendMessage = (requestId: string, senderId: 'client' | 'driver', text: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: Math.random().toString(),
      requestId,
      senderId,
      text,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const markMessagesAsRead = (requestId: string, currentRole: 'client' | 'driver') => {
    setMessages(prev => prev.map(msg => {
      if (msg.requestId === requestId && msg.senderId !== currentRole && !msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      trucks,
      requests, 
      messages,
      createRequest,
      updateRequestStatus, 
      rateRequest, 
      clearRequests, 
      toggleTruckAvailability,
      sendMessage,
      markMessagesAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);