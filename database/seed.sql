-- Datos iniciales para King Perfum
-- Ejecutar después de schema.sql
USE king_perfum;

-- Roles
INSERT INTO roles (descipcion) VALUES ('Admin'), ('Vendedor');

-- Usuario por defecto: usuario=admin, contraseña=admin123
INSERT INTO usuarios (nombre_completo, usuario, contraseña, rol_id)
VALUES ('Administrador', 'admin', 'admin123', 1);

-- Tipos de venta
INSERT INTO tipo_de_venta (descripcion) VALUES ('Contado'), ('Crédito');

-- Tipos de pago
INSERT INTO tipos_de_pago (nombre) VALUES ('Efectivo'), ('Transferencia');

-- Cliente genérico para ventas
INSERT INTO clientes (nombre_completo, deuda) VALUES ('Cliente General', 0);
