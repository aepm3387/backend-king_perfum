-- Datos iniciales para King Perfum - PostgreSQL
-- Ejecutar después de schema-postgres.sql (solo en base de datos vacía)

-- Roles
INSERT INTO roles (descipcion) VALUES ('Admin'), ('Vendedor');

-- Usuario por defecto: usuario=admin, contraseña=admin123
INSERT INTO usuarios (nombre_completo, usuario, contraseña, rol_id)
VALUES ('Administrador', 'admin', 'admin123', 1);

-- Tipos de venta
INSERT INTO tipo_de_venta (descripcion) VALUES ('Contado'), ('Crédito');

-- Cliente genérico para ventas
INSERT INTO clientes (nombre_completo, deuda) VALUES ('Cliente General', 0);
