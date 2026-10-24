# CyberShield Academy — Backend

API REST de la Entrega 3 de CyberShield Academy. Está desarrollada con Node.js, TypeScript, Express y Prisma, y guarda usuarios, cursos e inscripciones en PostgreSQL.

## Enlaces de la entrega

- API desplegada: **pendiente de publicar**.
- Frontend desplegado: **pendiente de publicar**.
- Repositorio público del backend: **pendiente de publicar**.
- Repositorio público del frontend: **pendiente de publicar**.

Completa estos enlaces después de publicar los repositorios y desplegar la aplicación. No subas archivos `.env` ni secretos al repositorio.

## Funcionalidades

- Registro e inicio de sesión con contraseñas protegidas con bcrypt y autenticación JWT.
- Catálogo público de cursos con paginación y filtro por categoría.
- Administración de cursos restringida al rol `admin`.
- Creación y consulta de inscripciones; cada usuario consulta las suyas y el administrador puede consultar todas.
- Validación de datos y respuestas de error centralizadas.

## Tecnologías y arquitectura

- Node.js 20 o posterior, TypeScript y Express.
- PostgreSQL y Prisma ORM.
- Zod para validar la configuración y los datos de entrada.
- Cuatro capas bajo `src/`: `domain`, `application`, `infrastructure` e `interface`.

## Requisitos

- Node.js 20 o posterior y npm.
- Una instancia de PostgreSQL accesible desde el backend.

## Ejecución local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env` y configura las variables. Usa un `JWT_SECRET` aleatorio de al menos 32 caracteres. Si PostgreSQL usa otro puerto, actualiza `DATABASE_URL`.

3. Genera el cliente de Prisma y aplica las migraciones locales:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```

4. Carga los cursos y las cuentas de demostración:

   ```bash
   npm run prisma:seed
   ```

5. Inicia la API:

   ```bash
   npm run dev
   ```

La API queda disponible en `http://localhost:4000`. Comprueba el estado en `http://localhost:4000/api/health`.

### Variables de entorno

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL, con el esquema `public`. |
| `JWT_SECRET` | Secreto aleatorio de al menos 32 caracteres para firmar tokens. |
| `JWT_EXPIRES_IN` | Vigencia del token; el valor predeterminado es `1d`. |
| `PORT` | Puerto HTTP de la API; el valor predeterminado es `4000`. |
| `FRONTEND_URL` | Origen permitido por CORS. En producción debe coincidir exactamente con la URL de Vercel. |
| `DEMO_ADMIN_PASSWORD` | Contraseña opcional para la cuenta admin que crea el seed; localmente usa `Admin123!` si no se define. |
| `DEMO_USER_PASSWORD` | Contraseña opcional para la cuenta user que crea el seed; localmente usa `User123!` si no se define. |

En producción configura estas variables en el servicio del backend, junto con una base PostgreSQL administrada. Ejecuta `npx prisma migrate deploy` para aplicar las migraciones existentes. `npm run prisma:migrate` usa `prisma migrate dev` y se reserva para desarrollo local.

## Cuentas de demostración

El seed crea estas cuentas para la revisión local de la entrega. Puedes reemplazar las contraseñas mediante `DEMO_ADMIN_PASSWORD` y `DEMO_USER_PASSWORD` antes de ejecutarlo:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@cybershield.local` | `Admin123!` |
| Usuario | `user@cybershield.local` | `User123!` |

Son credenciales de demostración. No reutilices estas contraseñas fuera de un entorno local o académico controlado. El seed almacena las contraseñas como hashes bcrypt.

## API

Las rutas protegidas requieren `Authorization: Bearer <token>`. El token se obtiene con `POST /api/auth/login`.

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Público | Estado de la API. |
| `POST` | `/api/auth/register` | Público | Registra un usuario; el correo duplicado devuelve `409`. |
| `POST` | `/api/auth/login` | Público | Valida credenciales y devuelve el usuario público y un JWT. |
| `GET` | `/api/cursos` | Público | Lista cursos; admite `page`, `limit` y `category`. |
| `GET` | `/api/cursos/:id` | Público | Consulta un curso por identificador. |
| `POST` | `/api/cursos` | Administrador | Crea un curso. |
| `PUT` | `/api/cursos/:id` | Administrador | Actualiza un curso. |
| `DELETE` | `/api/cursos/:id` | Administrador | Elimina un curso. |
| `POST` | `/api/inscripciones` | Usuario autenticado | Crea una inscripción con `courseId` y `message` opcional. |
| `GET` | `/api/inscripciones/mias` | Usuario autenticado | Lista las inscripciones propias. |
| `GET` | `/api/inscripciones` | Administrador | Lista todas las inscripciones. |

Ejemplo de consulta paginada:

```text
GET /api/cursos?page=1&limit=6&category=Red%20Team
```

La respuesta incluye `data` y `pagination`. Las categorías válidas son `Red Team`, `Blue Team` y `DFIR`. Los parámetros inválidos responden `400`, los recursos inexistentes `404` y los errores inesperados `500` sin exponer trazas internas.

## Modelo de datos

- `users`: nombre, correo único, hash de contraseña y rol.
- `courses`: los ocho cursos del catálogo de CyberShield.
- `enrollments`: curso, usuario, mensaje opcional y estado de la solicitud.

El backend valida el JWT y vuelve a comprobar los permisos en cada ruta protegida; la protección de las pantallas del frontend no reemplaza esta autorización.

## Despliegue

El archivo `render.yaml` define la API y una base PostgreSQL para Render. Al iniciar, aplica las migraciones, carga los datos de demostración que falten y arranca el servidor. El seed conserva los cursos y cuentas existentes para no sobrescribir cambios en reinicios. Configura `FRONTEND_URL` con el origen público exacto de Vercel. CORS no usa el comodín `*`.

La configuración inicial usa los planes gratuitos de Render para una revisión académica. Render indica que sus bases PostgreSQL gratuitas expiran a los 30 días; actualiza a un plan con persistencia antes de depender de esos datos por más tiempo.

## Explicación para la sustentación

Completa esta sección con tus propias palabras antes de entregar:

- ¿Cómo se divide una petición entre las capas `interface`, `application`, `domain` e `infrastructure`?
- ¿Cómo se valida la identidad del usuario y se limita una operación al rol administrador?
- ¿Cómo se relacionan usuarios, cursos e inscripciones en PostgreSQL?
- ¿Qué herramientas de IA utilizaste y qué cambios revisaste o ajustaste por tu cuenta?

## Evidencias

Agrega aquí las capturas solicitadas por la guía, incluida la petición autenticada que muestre el encabezado `Authorization: Bearer ...`. Oculta el valor del token antes de compartir la captura.
