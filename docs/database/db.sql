-- Habilitar claves foráneas
PRAGMA foreign_keys = ON;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre_completo TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    telefono TEXT NOT NULL,
    contrasena_hash TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('cliente', 'conductor', 'admin')),
    verificado INTEGER NOT NULL DEFAULT 0,
    url_foto_perfil TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Camiones
CREATE TABLE IF NOT EXISTS camiones (
    id TEXT PRIMARY KEY,
    id_conductor TEXT UNIQUE NOT NULL,
    placa TEXT UNIQUE NOT NULL,
    precio_por_pipa REAL NOT NULL,
    capacidad_pipas INTEGER NOT NULL,
    url_foto_camion TEXT,
    activo INTEGER NOT NULL DEFAULT 1,
    calificacion_promedio REAL DEFAULT 0.0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conductor) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. Tabla de Ubicaciones en Tiempo Real de los Camiones
CREATE TABLE IF NOT EXISTS ubicaciones_camiones (
    id TEXT PRIMARY KEY,
    id_camion TEXT UNIQUE NOT NULL,
    latitud REAL NOT NULL,
    longitud REAL NOT NULL,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_camion) REFERENCES camiones(id) ON DELETE CASCADE
);

-- 4. Tabla de Solicitudes de Servicio
CREATE TABLE IF NOT EXISTS solicitudes_servicio (
    id TEXT PRIMARY KEY,
    id_cliente TEXT NOT NULL,
    id_camion TEXT NOT NULL,
    estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'aceptado', 'en_camino', 'completado', 'cancelado')) DEFAULT 'pendiente',
    latitud_cliente REAL NOT NULL,
    longitud_cliente REAL NOT NULL,
    direccion_cliente TEXT NOT NULL,
    pipas_solicitadas INTEGER NOT NULL,
    precio_total REAL NOT NULL,
    calificado INTEGER NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_camion) REFERENCES camiones(id) ON DELETE CASCADE
);

-- 5. Tabla de Calificaciones y Reseñas
CREATE TABLE IF NOT EXISTS calificaciones (
    id TEXT PRIMARY KEY,
    id_solicitud TEXT UNIQUE NOT NULL,
    puntuacion INTEGER NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_servicio(id) ON DELETE CASCADE
);

-- Índices para optimizar el rendimiento de búsqueda
CREATE INDEX IF NOT EXISTS idx_camiones_activo ON camiones(activo);
CREATE INDEX IF NOT EXISTS idx_solicitudes_cliente ON solicitudes_servicio(id_cliente);
CREATE INDEX IF NOT EXISTS idx_solicitudes_camion ON solicitudes_servicio(id_camion);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_servicio(estado);

-- Trigger robusto: Actualiza automáticamente el promedio de estrellas del camión
CREATE TRIGGER IF NOT EXISTS actualizar_calificacion_camion
AFTER INSERT ON calificaciones
BEGIN
    UPDATE camiones
    SET calificacion_promedio = (
        SELECT AVG(c.puntuacion)
        FROM calificaciones c
        JOIN solicitudes_servicio s ON c.id_solicitud = s.id
        WHERE s.id_camion = camiones.id
    )
    WHERE id = (
        SELECT s.id_camion
        FROM solicitudes_servicio s
        WHERE s.id = NEW.id_solicitud
    );
END;

-- Vista analítica para el panel del Administrador
CREATE VIEW IF NOT EXISTS vista_resumen_operativo AS
    SELECT 
        s.id AS id_solicitud,
        s.fecha_creacion AS fecha,
        u.nombre_completo AS cliente,
        s.pipas_solicitadas AS pipas,
        s.precio_total AS total,
        s.estado AS estado_pedido,
        c.placa AS camion_asignado
    FROM solicitudes_servicio s
    JOIN usuarios u ON s.id_cliente = u.id
    JOIN camiones c ON s.id_camion = c.id;