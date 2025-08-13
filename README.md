# API NextFeed

Este proyecto es una API desarrollada con Node.js y Express para gestionar una red social tipo "feed". Permite la autenticación de usuarios, la publicación de posts, comentarios y la gestión de perfiles. Está lista para ser desplegada en la nube y utiliza Docker para facilitar la implementación.

## Características principales
- **Autenticación de usuarios** (registro, login, JWT)
- **Gestión de posts** (crear, leer, actualizar, eliminar)
- **Comentarios en posts**
- **Gestión de perfiles de usuario**
- **Middleware de autenticación y autorización**
- **Contenedores Docker y docker-compose** para despliegue sencillo

## Estructura del proyecto
```
docker-compose.yml
Dockerfile
package.json
README.md
server.js
controllers/
  authController.js
  commentController.js
  postController.js
  profileController.js
middleware/
  apiAuthMiddleware.js
  authMiddleware.js
models/
  Comment.js
  Post.js
  User.js
routes/
  authRoutes.js
  commentRoutes.js
  postRoutes.js
  profileRoutes.js
```

## Instalación y ejecución local
1. Clona el repositorio:
   ```bash
   git clone https://github.com/maualfaro77/api-nextfeed-final.git
   cd api-nextfeed-final
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` (ejemplo: conexión a MongoDB, JWT_SECRET, etc).
4. Ejecuta el servidor:
   ```bash
   npm start
   ```

## Uso con Docker
1. Construye y ejecuta los contenedores:
   ```bash
   docker-compose up --build
   ```

## Endpoints principales
- `/api/auth` — Registro y login de usuarios
- `/api/posts` — CRUD de publicaciones
- `/api/comments` — Comentarios en publicaciones
- `/api/profile` — Gestión de perfiles

## Contribuir
Las contribuciones son bienvenidas. Puedes abrir issues o pull requests para sugerir mejoras o reportar errores.

## Recomendacion
Cambiar a la rama prueba-documentacion, es la que contiene todo la funcionalidad final mostrada en la exposicion
