-- Agregar tabla tipos_de_pago y relación con ventas - PostgreSQL
-- Ejecutar en base de datos existente

-- Tabla tipos de pago
CREATE TABLE IF NOT EXISTS tipos_de_pago (
    id    SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Insertar tipos de pago por defecto (solo si no existen)
INSERT INTO tipos_de_pago (nombre)
SELECT 'Efectivo' WHERE NOT EXISTS (SELECT 1 FROM tipos_de_pago WHERE nombre = 'Efectivo');
INSERT INTO tipos_de_pago (nombre)
SELECT 'Transferencia' WHERE NOT EXISTS (SELECT 1 FROM tipos_de_pago WHERE nombre = 'Transferencia');

-- Agregar columna tipo_de_pago_id a ventas (permite NULL para ventas existentes)
ALTER TABLE ventas ADD COLUMN IF NOT EXISTS tipo_de_pago_id INT NULL REFERENCES tipos_de_pago (id);

-- Si ya existen datos, establecer un valor por defecto (Efectivo = id 1)
UPDATE ventas SET tipo_de_pago_id = 1 WHERE tipo_de_pago_id IS NULL;

-- Hacer la columna NOT NULL después de actualizar
ALTER TABLE ventas ALTER COLUMN tipo_de_pago_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ventas_tipo_pago ON ventas (tipo_de_pago_id);
