export type UserRole = 'client' | 'driver' | 'admin';

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
};

export type Truck = {
  id: string;
  driverId: string;
  driverName: string;
  plate: string;
  pricePerPipa: number;
  capacityPipas: number;
  rating: number;
  photoUrl?: string;
  isActive: boolean;
};

export type RequestStatus = 'pending' | 'accepted' | 'on_the_way' | 'completed' | 'cancelled';

export type ServiceRequest = {
  id: string;
  clientName: string;
  clientAddress: string;
  truckPlate: string;
  truckId: string;
  pipasRequested: number;
  totalPrice: number;
  status: RequestStatus;
  createdAt: string;
  isRated?: boolean;
  clientLat: number;
  clientLng: number;
};