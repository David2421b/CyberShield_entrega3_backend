# CyberShield Academy API

Backend de la Entrega 3 de CyberShield Academy. La API en TypeScript servirá los cursos del catálogo original y permitirá gestionar inscripciones con cuentas y roles.

## Requisitos

- Node.js 20 o posterior
- PostgreSQL

## Configuración local

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env` y configura PostgreSQL y un secreto JWT propio.
3. Ejecuta `npm run dev` para iniciar el servidor de desarrollo.

Los comandos de Prisma para generar el cliente, aplicar migraciones y cargar el seed están declarados en `package.json`; se habilitarán al definir el modelo de datos en el siguiente paso.

## Arquitectura

El código se organizará en cuatro capas: `domain`, `application`, `infrastructure` e `interface` bajo `src/`. Prisma quedará en infraestructura.
