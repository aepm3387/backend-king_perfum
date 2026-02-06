-- Base de datos King Perfum - PostgreSQL
-- La base de datos ya debe existir en Render

-- Tabla categoría
CREATE TABLE IF NOT EXISTS categoria (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion VARCHAR(250) NULL
);

-- Tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
    id              SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(50) NOT NULL,
    deuda           INT         NOT NULL DEFAULT 0
);

-- Tabla abonos
CREATE TABLE IF NOT EXISTS abonos (
    id               SERIAL PRIMARY KEY,
    cliente_id       INT NOT NULL REFERENCES clientes (id),
    valor_pre_abono  INT NOT NULL,
    valor_de_abono   INT NOT NULL,
    valor_post_abono INT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_abonos_cliente ON abonos (cliente_id);

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(50) NOT NULL,
    precio_de_venta INT         NOT NULL,
    categoria_id    INT         NULL REFERENCES categoria (id),
    precio_compra   INT         NOT NULL,
    genero          VARCHAR(10) NOT NULL,
    cantidad        INT         NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos (categoria_id);

-- Tabla roles
CREATE TABLE IF NOT EXISTS roles (
    id         SERIAL PRIMARY KEY,
    descipcion VARCHAR(20) NOT NULL
);

-- Tabla tipo_de_venta
CREATE TABLE IF NOT EXISTS tipo_de_venta (
    id          SERIAL PRIMARY KEY,
    descripcion VARCHAR(200) NULL
);

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id              SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(50)  NOT NULL,
    usuario         VARCHAR(50)  NOT NULL,
    contraseña      VARCHAR(200) NOT NULL,
    rol_id          INT          NOT NULL REFERENCES roles (id)
);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios (rol_id);

-- Tabla ventas
CREATE TABLE IF NOT EXISTS ventas (
    id               SERIAL PRIMARY KEY,
    fecha            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_total      INT NOT NULL,
    tipo_de_venta_id INT NOT NULL REFERENCES tipo_de_venta (id),
    cliente_id       INT NOT NULL REFERENCES clientes (id)
);
CREATE INDEX IF NOT EXISTS idx_ventas_tipo ON ventas (tipo_de_venta_id);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas (cliente_id);

-- Tabla producto_de_la_venta
CREATE TABLE IF NOT EXISTS producto_de_la_venta (
    id          SERIAL PRIMARY KEY,
    venta_id    INT NOT NULL REFERENCES ventas (id),
    producto_id INT NOT NULL REFERENCES productos (id)
);
CREATE INDEX IF NOT EXISTS idx_producto_venta_venta ON producto_de_la_venta (venta_id);
CREATE INDEX IF NOT EXISTS idx_producto_venta_producto ON producto_de_la_venta (producto_id);
