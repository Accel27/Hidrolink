import { ServiceRequest } from '@/types';

export const mockRequests: ServiceRequest[] = [
  { id: 'r1', clientName: 'María Fernández', clientAddress: 'Bella Vista, Av. 10', truckPlate: 'A12BC3D', pipasRequested: 5, totalPrice: 7.5, status: 'pending', createdAt: new Date().toISOString() },
  { id: 'r2', clientName: 'Carlos Mendoza', clientAddress: 'Chiquinquirá, Calle 77', truckPlate: 'A12BC3D', pipasRequested: 10, totalPrice: 15.0, status: 'pending', createdAt: new Date().toISOString() },
];