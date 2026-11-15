import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Truck, ServiceRequest, Message } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

type AppContextType = {
  trucks: Truck[];
  requests: ServiceRequest[];
  messages: Message[];
  isRefreshing: boolean;
  refreshTrucks: (showSpinner?: boolean) => Promise<void>;
  refreshRequests: () => Promise<void>;
  refreshMessages: (requestId: string) => Promise<void>;
  createRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt'>) => Promise<void>;
  updateRequestStatus: (id: string, status: ServiceRequest['status']) => Promise<void>;
  rateRequest: (requestId: string, truckId: string, stars: number) => Promise<void>;
  toggleTruckAvailability: (truckId: string, isActive: boolean) => Promise<void>;
  sendMessage: (requestId: string, senderId: 'client' | 'driver', text: string) => Promise<void>;
  clearRequests: () => Promise<void>;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [hiddenRequests, setHiddenRequests] = useState<string[]>([]);
  const hiddenRequestsRef = useRef<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('@hidrolink_hidden_requests').then(data => {
      if (data) {
        const parsed = JSON.parse(data);
        setHiddenRequests(parsed);
        hiddenRequestsRef.current = parsed;
      }
    });
  }, []);

  const refreshTrucks = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    const { data: trucksData, error } = await supabase.from('trucks').select('*');
    
    if (trucksData && !error) {
      const formattedTrucks: Truck[] = trucksData.map(t => ({
        id: t.id,
        driverId: t.driver_id,
        driverName: t.plate === 'A12BC3D' ? 'Jose Perez' : t.plate === 'X98YZ7W' ? 'Luis Gonzalez' : 'Carlos Rangel',
        plate: t.plate,
        pricePerPipa: t.price_per_pipa,
        capacityPipas: t.capacity_pipas,
        rating: t.rating,
        isActive: t.is_active,
      }));
      setTrucks(formattedTrucks);
    }
    if (showSpinner) setIsRefreshing(false);
  };

  const refreshRequests = async () => {
    const { data: reqData, error } = await supabase
      .from('service_requests')
      .select('*, trucks(plate)')
      .order('created_at', { ascending: false });

    if (reqData && !error) {
      const visibleReqData = reqData.filter(r => !hiddenRequestsRef.current.includes(r.id));
      
      const formattedRequests: ServiceRequest[] = visibleReqData.map(r => ({
        id: r.id,
        clientName: 'Cliente Demo',
        clientAddress: r.client_address,
        truckPlate: r.trucks?.plate || 'Desconocido',
        truckId: r.truck_id,
        pipasRequested: r.pipas_requested,
        totalPrice: r.total_price,
        status: r.status,
        createdAt: r.created_at,
        isRated: r.is_rated,
        clientLat: r.client_lat,
        clientLng: r.client_lng,
      }));
      setRequests(formattedRequests);
    }
  };

  const refreshMessages = async (requestId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (data && !error) {
      const formattedMessages: Message[] = data.map(m => ({
        id: m.id,
        requestId: m.request_id,
        senderId: m.sender_id as 'client' | 'driver',
        text: m.text,
        createdAt: m.created_at,
        isRead: m.is_read,
      }));
      
      setMessages(prev => {
        const otherMessages = prev.filter(msg => msg.requestId !== requestId);
        return [...otherMessages, ...formattedMessages];
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await refreshTrucks();
      await refreshRequests();
    };
    loadData();

    const trucksChannel = supabase
      .channel('realtime-trucks')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trucks' }, () => {
        refreshTrucks(); 
      })
      .subscribe();

    const requestsChannel = supabase
      .channel('realtime-requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests' }, () => {
        refreshRequests();
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('realtime-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        // Escucha INSERT (nuevo mensaje) y UPDATE (leido)
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, {
              id: newMsg.id,
              requestId: newMsg.request_id,
              senderId: newMsg.sender_id,
              text: newMsg.text,
              isRead: newMsg.is_read,
              createdAt: newMsg.created_at
            }];
          });
        } else if (payload.eventType === 'UPDATE') {
          const updatedMsg = payload.new;
          setMessages(prev => prev.map(m => m.id === updatedMsg.id ? { ...m, isRead: updatedMsg.is_read } : m));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(trucksChannel);
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const createRequest = async (requestData: Omit<ServiceRequest, 'id' | 'createdAt'>) => {
    await supabase.from('service_requests').insert({
      client_id: '11111111-1111-1111-1111-111111111111',
      truck_id: requestData.truckId,
      status: 'pending',
      client_lat: requestData.clientLat,
      client_lng: requestData.clientLng,
      client_address: requestData.clientAddress,
      pipas_requested: requestData.pipasRequested,
      total_price: requestData.totalPrice,
      is_rated: false
    });
  };

  const updateRequestStatus = async (id: string, status: ServiceRequest['status']) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    await supabase.from('service_requests').update({ status }).eq('id', id);
  };

  const rateRequest = async (requestId: string, truckId: string, stars: number) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, isRated: true } : req));
    await supabase.from('ratings').insert({ request_id: requestId, rating: stars });
    await supabase.from('service_requests').update({ is_rated: true }).eq('id', requestId);
    await refreshTrucks();
  };

  const toggleTruckAvailability = async (truckId: string, isActive: boolean) => {
    setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, isActive } : t));
    await supabase.from('trucks').update({ is_active: isActive }).eq('id', truckId);
  };

  const sendMessage = async (requestId: string, senderId: 'client' | 'driver', text: string) => {
    if (!text.trim()) return;
    
    
    const { data, error } = await supabase.from('messages').insert({
      request_id: requestId,
      sender_id: senderId,
      text: text,
      is_read: false
    }).select().single();

    
    if (data && !error) {
      setMessages(prev => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, {
          id: data.id,
          requestId: data.request_id,
          senderId: data.sender_id,
          text: data.text,
          isRead: data.is_read,
          createdAt: data.created_at
        }];
      });
    }
  };

  const clearRequests = async () => {
    const completedIds = requests
      .filter(req => req.status === 'completed' || req.status === 'cancelled')
      .map(req => req.id);

    if (completedIds.length > 0) {
      const newHidden = [...hiddenRequestsRef.current, ...completedIds];
      setHiddenRequests(newHidden);
      hiddenRequestsRef.current = newHidden;
      
      await AsyncStorage.setItem('@hidrolink_hidden_requests', JSON.stringify(newHidden));
      setRequests(prev => prev.filter(req => !completedIds.includes(req.id)));
    }
  };

  return (
    <AppContext.Provider value={{ 
      trucks, requests, messages, isRefreshing, 
      refreshTrucks, refreshRequests, refreshMessages,
      createRequest, updateRequestStatus, rateRequest, toggleTruckAvailability, sendMessage, clearRequests
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);