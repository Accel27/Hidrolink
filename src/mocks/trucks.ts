import { Truck } from '@/types';

export const mockTrucks: Truck[] = [
  { id: 't1', driverId: 'd1', driverName: 'José Pérez', plate: 'A12BC3D', pricePerPipa: 1.5, capacityPipas: 6, rating: 4.8, isActive: false }, // <-- Inicia en false
  { id: 't2', driverId: 'd2', driverName: 'Luis González', plate: 'X98YZ7W', pricePerPipa: 1.4, capacityPipas: 5, rating: 4.5, isActive: true },
  { id: 't3', driverId: 'd3', driverName: 'Carlos Rangel', plate: 'B45MV6P', pricePerPipa: 1.6, capacityPipas: 8, rating: 4.9, isActive: true },
  { id: 't4', driverId: 'd4', driverName: 'Pedro Bracho', plate: 'K23QW1E', pricePerPipa: 1.3, capacityPipas: 4, rating: 4.2, isActive: false },
];