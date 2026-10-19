# CyberShield Academy API

Backend de la Entrega 3 de CyberShield Academy. La API en TypeScript servirá los cursos del catálogo original y permitirá gestionar inscripciones con cuentas y roles.

## Requisitos

- Node.js 20 o posterior
- PostgreSQL

## Configuración local

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env` y configura PostgreSQL y un secreto JWT propio.
3. Ejecuta `npm run dev` para iniciar el servidor de desarrollo.

4. Ejecuta `npm run prisma:generate` para generar el cliente de Prisma.
5. Ejecuta `npm run prisma:migrate -- --name init` para crear las tablas.
6. Ejecuta `npm run prisma:seed` para cargar cursos y cuentas de demostración.

El seed crea estas cuentas únicamente para el ambiente de demostración de la entrega:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| admin | `admin@cybershield.local` | `Admin123!` |
| user | `user@cybershield.local` | `User123!` |

Las contraseñas se guardan como hashes bcrypt.

## Arquitectura

El código se organizará en cuatro capas: `domain`, `application`, `infrastructure` e `interface` bajo `src/`. El esquema y el seed de Prisma viven en `prisma/`; el cliente generado se usará desde infraestructura.

## Modelo de datos

- `users`: cuentas con correo único, hash de contraseña y rol.
- `courses`: catálogo original de ocho cursos de CyberShield Academy.
- `enrollments`: solicitudes de inscripción relacionadas con la cuenta autenticada y el curso elegido.

## API disponible

- `GET /api/health`: estado del servicio.
- `GET /api/cursos?page=1&limit=6&category=Red%20Team`: catálogo paginado. La respuesta incluye `pagination` y `data`; `category` es opcional y acepta `Red Team`, `Blue Team` o `DFIR`.
- `GET /api/cursos/:id`: detalle público de un curso.

Los parámetros inválidos responden `400`, los cursos inexistentes `404` y los errores inesperados `500` sin exponer trazas internas.
