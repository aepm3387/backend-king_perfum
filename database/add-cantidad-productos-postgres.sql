-- Migración: agregar columna cantidad a productos (PostgreSQL)
ALTER TABLE productos ADD COLUMN IF NOT EXISTS cantidad INT NOT NULL DEFAULT 0;
