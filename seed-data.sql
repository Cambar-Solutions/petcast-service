-- ============================================
-- PETCAST - Datos de Prueba (Seed Data)
-- ============================================
-- Ejecutar en orden secuencial para evitar errores de FK
-- Contrasena para todos los usuarios: 123456
-- ============================================

-- Limpiar datos existentes (en orden inverso de dependencias)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE estadisticas;
TRUNCATE TABLE recordatorios;
TRUNCATE TABLE citas;
TRUNCATE TABLE fichas_medicas;
TRUNCATE TABLE mascotas;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. USUARIOS (sin dependencias)
-- ============================================
-- Contrasena hasheada: 123456 -> $2b$10$...
-- Usamos un hash valido de bcrypt para "123456"

-- Administradores (2)
INSERT INTO users (nombre, apellido, correoElectronico, contrasena, estado, rol, fechaCreacion, permisos) VALUES
('Admin', 'Principal', 'admin@petcast.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'ADMINISTRADOR', NOW(), 'ALL'),
('Laura', 'Jimenez', 'laura.admin@petcast.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'ADMINISTRADOR', NOW(), 'ALL');

-- Veterinarios (4)
INSERT INTO users (nombre, apellido, correoElectronico, contrasena, estado, rol, fechaCreacion, cedula, especialidad) VALUES
('Carlos', 'Martinez', 'carlos.vet@petcast.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'VETERINARIO', NOW(), 'VET-001', 'General'),
('Ana', 'Lopez', 'ana.vet@petcast.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'VETERINARIO', NOW(), 'VET-002', 'Cirugia'),
('Pedro', 'Sanchez', 'pedro.vet@petcast.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'INACTIVO', 'VETERINARIO', NOW(), 'VET-003', 'Dermatologia'),
('Sofia', 'Hernandez', 'sofia.vet@petcast.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'VETERINARIO', NOW(), 'VET-004', 'Cardiologia');

-- Duenos (5)
INSERT INTO users (nombre, apellido, correoElectronico, contrasena, estado, rol, fechaCreacion, telefono, direccion) VALUES
('Maria', 'Garcia', 'maria@email.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'DUENO', NOW(), '+52 555 123 4567', 'Av. Reforma 123, CDMX'),
('Juan', 'Rodriguez', 'juan@email.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'DUENO', NOW(), '+52 555 234 5678', 'Calle Juarez 456, Guadalajara'),
('Patricia', 'Flores', 'patricia@email.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'DUENO', NOW(), '+52 555 345 6789', 'Blvd. Insurgentes 789, Monterrey'),
('Roberto', 'Mendez', 'roberto@email.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'ACTIVO', 'DUENO', NOW(), '+52 555 456 7890', 'Calle 5 de Mayo 321, Puebla'),
('Carmen', 'Ortiz', 'carmen@email.com', '$2b$10$44G0dHuNTRWzEc/1.hSj7.2qSOKr/yE6aqrFvtI1Kt8AFb823FGu2', 'INACTIVO', 'DUENO', NOW(), '+52 555 567 8901', 'Av. Universidad 654, Queretaro');

-- ============================================
-- 2. MASCOTAS (depende de users/duenos)
-- ============================================
-- Los duenos tienen IDs del 7 al 11 (despues de 2 admins y 4 vets)

INSERT INTO mascotas (nombre, edad, especie, raza, color, peso, talla, sexo, codigoQR, fechaRegistro, dueno_id, imagen) VALUES
-- Mascotas de Maria (ID 7)
('Max', 3, 'Perro', 'Labrador', '#D4A574', 25.5, 60.0, 'MACHO', 'PET-001-MAX', NOW(), 7, NULL),
('Luna', 2, 'Gato', 'Siames', '#F5DEB3', 4.2, 25.0, 'HEMBRA', 'PET-002-LUNA', NOW(), 7, NULL),

-- Mascotas de Juan (ID 8)
('Rocky', 5, 'Perro', 'Bulldog', '#8B4513', 18.0, 40.0, 'MACHO', 'PET-003-ROCKY', NOW(), 8, NULL),
('Michi', 1, 'Gato', 'Persa', '#FFFFFF', 3.5, 20.0, 'HEMBRA', 'PET-004-MICHI', NOW(), 8, NULL),

-- Mascotas de Patricia (ID 9)
('Thor', 4, 'Perro', 'Pastor Aleman', '#000000', 35.0, 65.0, 'MACHO', 'PET-005-THOR', NOW(), 9, NULL),
('Coco', 2, 'Ave', 'Cockatiel', '#FFD700', 0.1, 15.0, 'MACHO', 'PET-006-COCO', NOW(), 9, NULL),

-- Mascotas de Roberto (ID 10)
('Bella', 3, 'Perro', 'Golden Retriever', '#DAA520', 28.0, 58.0, 'HEMBRA', 'PET-007-BELLA', NOW(), 10, NULL),

-- Mascotas de Carmen (ID 11)
('Simba', 6, 'Gato', 'Maine Coon', '#CD853F', 8.5, 35.0, 'MACHO', 'PET-008-SIMBA', NOW(), 11, NULL),
('Nemo', 1, 'Otro', 'Pez Payaso', '#FF6347', 0.01, 5.0, 'MACHO', 'PET-009-NEMO', NOW(), 11, NULL);

-- ============================================
-- 3. FICHAS MEDICAS (depende de mascotas y veterinarios)
-- ============================================
-- Mascotas tienen IDs del 1 al 9
-- Veterinarios tienen IDs del 3 al 6

INSERT INTO fichas_medicas (diagnostico, tratamiento, observaciones, fechaConsulta, fechaActualizacion, mascota_id, veterinario_id) VALUES
-- Fichas de Max (ID 1)
('Vacunacion anual completa', 'Vacuna polivalente aplicada', 'Mascota en buen estado general', DATE_SUB(NOW(), INTERVAL 30 DAY), NOW(), 1, 3),
('Revision general', 'Sin tratamiento requerido', 'Peso ideal, dientes limpios', DATE_SUB(NOW(), INTERVAL 7 DAY), NOW(), 1, 3),

-- Fichas de Luna (ID 2)
('Desparasitacion interna', 'Antiparasitario oral administrado', 'Repetir en 3 meses', DATE_SUB(NOW(), INTERVAL 15 DAY), NOW(), 2, 4),

-- Fichas de Rocky (ID 3)
('Dermatitis alergica', 'Shampoo medicado y antihistaminicos', 'Evitar alimentos con pollo', DATE_SUB(NOW(), INTERVAL 20 DAY), NOW(), 3, 5),
('Seguimiento dermatitis', 'Continuar tratamiento', 'Mejoria notable en piel', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW(), 3, 5),

-- Fichas de Thor (ID 5)
('Displasia de cadera leve', 'Suplementos articulares', 'Control en 2 meses', DATE_SUB(NOW(), INTERVAL 45 DAY), NOW(), 5, 6),

-- Fichas de Bella (ID 7)
('Limpieza dental', 'Profilaxis dental completa', 'Recomendar croquetas dentales', DATE_SUB(NOW(), INTERVAL 60 DAY), NOW(), 7, 3);

-- ============================================
-- 4. CITAS (depende de mascotas, duenos y veterinarios)
-- ============================================

INSERT INTO citas (fechaHora, motivo, estado, fechaCreacion, mascota_id, veterinario_id, dueno_id, notas) VALUES
-- Citas pasadas
(DATE_SUB(NOW(), INTERVAL 7 DAY), 'Consulta general', 'COMPLETADA', DATE_SUB(NOW(), INTERVAL 14 DAY), 1, 3, 7, 'Cita completada sin problemas'),
(DATE_SUB(NOW(), INTERVAL 5 DAY), 'Vacunacion', 'COMPLETADA', DATE_SUB(NOW(), INTERVAL 10 DAY), 2, 4, 7, 'Vacuna antirabica aplicada'),
(DATE_SUB(NOW(), INTERVAL 3 DAY), 'Revision dermatologica', 'COMPLETADA', DATE_SUB(NOW(), INTERVAL 8 DAY), 3, 5, 8, 'Seguimiento de tratamiento'),

-- Citas de hoy
(NOW(), 'Consulta de emergencia', 'CONFIRMADA', DATE_SUB(NOW(), INTERVAL 1 DAY), 5, 6, 9, 'Mascota con cojera'),
(DATE_ADD(NOW(), INTERVAL 2 HOUR), 'Desparasitacion', 'PROGRAMADA', NOW(), 4, 3, 8, NULL),

-- Citas futuras
(DATE_ADD(NOW(), INTERVAL 1 DAY), 'Vacunacion anual', 'CONFIRMADA', NOW(), 7, 3, 10, 'Traer cartilla de vacunacion'),
(DATE_ADD(NOW(), INTERVAL 2 DAY), 'Revision general', 'PROGRAMADA', NOW(), 8, 4, 11, NULL),
(DATE_ADD(NOW(), INTERVAL 3 DAY), 'Cirugia menor', 'CONFIRMADA', NOW(), 1, 4, 7, 'Retiro de quiste benigno'),
(DATE_ADD(NOW(), INTERVAL 5 DAY), 'Control post-operatorio', 'PROGRAMADA', NOW(), 1, 4, 7, NULL),

-- Cita cancelada
(DATE_ADD(NOW(), INTERVAL 4 DAY), 'Bano medicado', 'CANCELADA', NOW(), 3, 5, 8, 'Cliente cancelo por viaje');

-- ============================================
-- 5. RECORDATORIOS (depende de citas, mascotas y duenos)
-- ============================================

INSERT INTO recordatorios (fechaEnvio, tipo, enviado, cita_id, mascota_id, dueno_id, mensaje, fechaCreacion) VALUES
-- Recordatorios de vacunacion
(DATE_ADD(NOW(), INTERVAL 30 DAY), 'VACUNACION', 0, NULL, 1, 7, 'Recordatorio: Max necesita refuerzo de vacuna en 30 dias', NOW()),
(DATE_ADD(NOW(), INTERVAL 90 DAY), 'VACUNACION', 0, NULL, 2, 7, 'Recordatorio: Luna necesita vacuna antirabica', NOW()),

-- Recordatorios de citas proximas
(DATE_ADD(NOW(), INTERVAL 1 DAY), 'CITA_PROXIMA', 0, 6, 7, 10, 'Recordatorio: Bella tiene cita manana para vacunacion', NOW()),
(NOW(), 'CITA_PROXIMA', 1, 4, 5, 9, 'Recordatorio: Thor tiene cita hoy', NOW()),

-- Recordatorios de revision
(DATE_ADD(NOW(), INTERVAL 60 DAY), 'REVISION', 0, NULL, 3, 8, 'Recordatorio: Rocky necesita revision dermatologica de seguimiento', NOW()),
(DATE_ADD(NOW(), INTERVAL 45 DAY), 'REVISION', 0, NULL, 5, 9, 'Recordatorio: Thor necesita control de displasia', NOW());

-- ============================================
-- 6. ESTADISTICAS (sin dependencias directas)
-- ============================================

INSERT INTO estadisticas (periodo, numeroCitas, numeroClientes, numeroMascotas, fechaInicio, fechaFin, fechaGeneracion) VALUES
('DIA', 5, 3, 4, CURDATE(), CURDATE(), NOW()),
('SEMANA', 15, 8, 12, DATE_SUB(CURDATE(), INTERVAL 7 DAY), CURDATE(), NOW()),
('MES', 45, 15, 25, DATE_SUB(CURDATE(), INTERVAL 30 DAY), CURDATE(), NOW()),
('ANIO', 520, 120, 180, DATE_SUB(CURDATE(), INTERVAL 365 DAY), CURDATE(), NOW());

-- ============================================
-- RESUMEN DE CREDENCIALES
-- ============================================
-- | Email                      | Contrasena | Rol           |
-- |----------------------------|------------|---------------|
-- | admin@petcast.com          | 123456     | ADMINISTRADOR |
-- | laura.admin@petcast.com    | 123456     | ADMINISTRADOR |
-- | carlos.vet@petcast.com     | 123456     | VETERINARIO   |
-- | ana.vet@petcast.com        | 123456     | VETERINARIO   |
-- | pedro.vet@petcast.com      | 123456     | VETERINARIO   |
-- | sofia.vet@petcast.com      | 123456     | VETERINARIO   |
-- | maria@email.com            | 123456     | DUENO         |
-- | juan@email.com             | 123456     | DUENO         |
-- | patricia@email.com         | 123456     | DUENO         |
-- | roberto@email.com          | 123456     | DUENO         |
-- | carmen@email.com           | 123456     | DUENO         |
-- ============================================

SELECT 'Datos de prueba insertados correctamente!' AS mensaje;
SELECT COUNT(*) AS total_usuarios FROM users;
SELECT COUNT(*) AS total_mascotas FROM mascotas;
SELECT COUNT(*) AS total_fichas FROM fichas_medicas;
SELECT COUNT(*) AS total_citas FROM citas;
SELECT COUNT(*) AS total_recordatorios FROM recordatorios;
SELECT COUNT(*) AS total_estadisticas FROM estadisticas;
