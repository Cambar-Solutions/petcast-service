# Petcast Service

Microservicios para la plataforma Petcast (usuarios, mascotas, citas y estadísticas).

## Requisitos

- Node.js (v18+)
- MySQL

## Configuración

### 1. Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=petcast_db

# JWT
JWT_SECRET=tu-secreto-jwt
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Puertos de servicios
SERVICE_USER_PORT=4201
SERVICE_PET_PORT=4202
SERVICE_APPOINTMENT_PORT=4203
SERVICE_STATISTICS_PORT=4204
```

### 2. Crear base de datos

Lo tienes que hacer manualmente en tu gestor de bd sino te dará error cuando arranques el proyecto.

```sql
CREATE DATABASE petcast_db;
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar todos los servicios

```bash
npm run start:all
```

Los servicios estarán disponibles en:
- User Service: `http://localhost:4201`
- Pet Service: `http://localhost:4202`
- Appointment Service: `http://localhost:4203`
- Statistics Service: `http://localhost:4204`
