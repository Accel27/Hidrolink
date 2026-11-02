import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@/types';

type AuthContextType = {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  truckId: string | null; // <-- NUEVO
  setTruckId: (id: string | null) => void; // <-- NUEVO
};

const AuthContext = createContext<AuthContextType>({ 
  role: null, 
  setRole: () => {},
  truckId: null,
  setTruckId: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [truckId, setTruckId] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ role, setRole, truckId, setTruckId }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);