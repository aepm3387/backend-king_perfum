-- Migración: agregar columna cantidad a productos (MySQL)
-- Ejecutar si la tabla productos ya existe sin la columna cantidad
ALTER TABLE productos ADD COLUMN cantidad INT NOT NULL DEFAULT 0;
