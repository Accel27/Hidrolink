-- 1. Tabla de Usuarios (Perfiles vinculados a Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY, -- Se vinculara con el ID de Supabase Auth
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client', 'driver', 'admin')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Camiones
CREATE TABLE public.trucks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plate TEXT UNIQUE NOT NULL,
    price_per_pipa REAL NOT NULL,
    capacity_pipas INTEGER NOT NULL,
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rating REAL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Ubicaciones
CREATE TABLE public.truck_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    truck_id UUID UNIQUE NOT NULL REFERENCES public.trucks(id) ON DELETE CASCADE,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Solicitudes (Pedidos)
CREATE TABLE public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    truck_id UUID NOT NULL REFERENCES public.trucks(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'on_the_way', 'completed', 'cancelled')) DEFAULT 'pending',
    client_lat REAL NOT NULL,
    client_lng REAL NOT NULL,
    client_address TEXT NOT NULL,
    pipas_requested INTEGER NOT NULL,
    total_price REAL NOT NULL,
    is_rated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Calificaciones
CREATE TABLE public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID UNIQUE NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA NUEVA: Mensajes del Chat
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL CHECK (sender_id IN ('client', 'driver')),
    text TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para velocidad
CREATE INDEX idx_trucks_active ON public.trucks(is_active);
CREATE INDEX idx_requests_client ON public.service_requests(client_id);
CREATE INDEX idx_requests_status ON public.service_requests(status);
CREATE INDEX idx_messages_request ON public.messages(request_id);

-- Trigger para Postgres: Actualiza el promedio de estrellas del camion
CREATE OR REPLACE FUNCTION update_truck_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.trucks
    SET rating = (
        SELECT AVG(r.rating)
        FROM public.ratings r
        JOIN public.service_requests s ON r.request_id = s.id
        WHERE s.truck_id = trucks.id
    )
    WHERE id = (
        SELECT s.truck_id
        FROM public.service_requests s
        WHERE s.id = NEW.request_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rating
AFTER INSERT ON public.ratings
FOR EACH ROW EXECUTE FUNCTION update_truck_rating();