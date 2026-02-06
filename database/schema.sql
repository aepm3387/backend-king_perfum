-- Base de datos King Perfum
CREATE DATABASE IF NOT EXISTS king_perfum;
USE king_perfum;

-- Tabla categoría
CREATE TABLE categoria (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion VARCHAR(250) NULL
);

-- Tabla clientes
CREATE TABLE clientes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(50) NOT NULL,
    deuda           INT         NOT NULL
);

-- Tabla abonos
CREATE TABLE abonos (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id       INT NOT NULL,
    valor_pre_abono  INT NOT NULL,
    valor_de_abono   INT NOT NULL,
    valor_post_abono INT NOT NULL,
    CONSTRAINT abonos_ibfk_1 FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);
CREATE INDEX idx_abonos_cliente ON abonos (cliente_id);

-- Tabla productos
CREATE TABLE productos (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(50) NOT NULL,
    precio_de_venta INT         NOT NULL,
    categoria_id    INT         NULL,
    precio_compra   INT         NOT NULL,
    genero          VARCHAR(10) NOT NULL,
    cantidad        INT         NOT NULL DEFAULT 0,
    CONSTRAINT productos_ibfk_1 FOREIGN KEY (categoria_id) REFERENCES categoria (id)
);
CREATE INDEX idx_productos_categoria ON productos (categoria_id);

-- Tabla roles
CREATE TABLE roles (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    descipcion VARCHAR(20) NOT NULL
);

-- Tabla tipo_de_venta
CREATE TABLE tipo_de_venta (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(200) NULL
);

-- Tabla usuarios
CREATE TABLE usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(50)  NOT NULL,
    usuario         VARCHAR(50)  NOT NULL,
    contraseña      VARCHAR(200) NOT NULL,
    rol_id          INT          NOT NULL,
    CONSTRAINT usuarios_ibfk_1 FOREIGN KEY (rol_id) REFERENCES roles (id)
);
CREATE INDEX idx_usuarios_rol ON usuarios (rol_id);

-- Tabla ventas
CREATE TABLE ventas (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    fecha            DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total      INT NOT NULL,
    tipo_de_venta_id INT NOT NULL,
    cliente_id       INT NOT NULL,
    CONSTRAINT ventas_ibfk_1 FOREIGN KEY (tipo_de_venta_id) REFERENCES tipo_de_venta (id),
    CONSTRAINT ventas_ibfk_2 FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);
CREATE INDEX idx_ventas_tipo ON ventas (tipo_de_venta_id);
CREATE INDEX idx_ventas_cliente ON ventas (cliente_id);

-- Tabla producto_de_la_venta
CREATE TABLE producto_de_la_venta (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    venta_id    INT NOT NULL,
    producto_id INT NOT NULL,
    CONSTRAINT producto_de_la_venta_ibfk_1 FOREIGN KEY (venta_id) REFERENCES ventas (id),
    CONSTRAINT producto_de_la_venta_ibfk_2 FOREIGN KEY (producto_id) REFERENCES productos (id)
);
CREATE INDEX idx_producto_venta_venta ON producto_de_la_venta (venta_id);
CREATE INDEX idx_producto_venta_producto ON producto_de_la_venta (producto_id);
