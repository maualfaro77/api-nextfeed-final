# API REST NextFeed - Documentación

## 📋 Descripción

API RESTful completa para una aplicación de redes sociales tipo NextFeed. Incluye autenticación JWT, gestión de usuarios, publicaciones, comentarios y perfiles.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación con tokens
- **Gestión de usuarios**: Registro, login y perfiles de usuario
- **Publicaciones**: CRUD completo para publicaciones con sistema de likes
- **Comentarios**: Sistema de comentarios en publicaciones
- **Perfiles**: Gestión de perfiles con sistema de seguimiento
- **Documentación Swagger**: Documentación completa e interactiva
- **MongoDB**: Base de datos NoSQL con Mongoose
- **CORS**: Configurado para desarrollo y producción

## 📚 Documentación Swagger

### Acceso a la documentación

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva en:

```
http://localhost:3000/api-docs
```

### Características de la documentación

- **Interfaz interactiva**: Prueba los endpoints directamente desde el navegador
- **Autenticación persistente**: Los tokens JWT se mantienen entre sesiones
- **Ejemplos de código**: Cada endpoint incluye ejemplos de uso
- **Esquemas de datos**: Definiciones completas de todos los modelos
- **Códigos de respuesta**: Documentación detallada de todos los códigos HTTP

## 🔧 Instalación y configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- MongoDB (local o en la nube)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd API-RESTFUL-PROYECTO-doc
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/nextfeed
   JWT_SECRET=tu_jwt_secret_super_seguro
   NODE_ENV=development
   ```

4. **Ejecutar el servidor**
   ```bash
   # Desarrollo (con nodemon)
   npm run dev
   
   # Producción
   npm start
   ```

## 🔐 Autenticación

### JWT (JSON Web Tokens)

La API utiliza JWT para la autenticación. Para usar endpoints protegidos:

1. **Registrar un usuario** o **iniciar sesión** para obtener un token
2. **Incluir el token** en el header `Authorization`:
   ```
   Authorization: Bearer <tu_token_jwt>
   ```

### API Key

Algunos endpoints también soportan autenticación por API Key:
```
x-api-key: <tu_api_key>
```

## 📖 Uso de la documentación

### 1. Autenticación

1. Ve a la sección **Autenticación** en la documentación
2. Usa el endpoint `/api/auth/register` para crear una cuenta
3. Usa el endpoint `/api/auth/login` para obtener un token JWT
4. Haz clic en el botón **"Authorize"** en la parte superior
5. Ingresa tu token en el formato: `Bearer <tu_token>`

### 2. Probar endpoints

Una vez autenticado, puedes:
- **Probar endpoints protegidos** directamente desde la interfaz
- **Ver ejemplos de respuesta** para cada endpoint
- **Copiar ejemplos de código** para usar en tu aplicación

### 3. Estructura de respuestas

Todas las respuestas siguen un formato consistente:

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    // Datos específicos del endpoint
  }
}
```

## 🗂️ Estructura de la API

### Autenticación (`/api/auth`)
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión

### Publicaciones (`/api/posts`)
- `GET /` - Obtener todas las publicaciones
- `POST /` - Crear publicación
- `GET /{key}/{value}` - Buscar publicación
- `PUT /{key}/{value}` - Modificar publicación
- `DELETE /{key}/{value}` - Eliminar publicación
- `POST /like/{postId}` - Dar/quitar like

### Comentarios (`/api/comments`)
- `GET /` - Obtener todos los comentarios
- `POST /` - Crear comentario
- `GET /{key}/{value}` - Buscar comentario
- `PUT /{key}/{value}` - Modificar comentario
- `DELETE /{key}/{value}` - Eliminar comentario
- `GET /post/{postId}` - Comentarios de una publicación

### Perfiles (`/api/profile`)
- `GET /` - Perfil del usuario autenticado
- `POST /` - Crear/actualizar perfil
- `GET /id/{userId}` - Perfil completo de un usuario
- `GET /{key}/{value}` - Buscar perfil
- `PUT /{key}/{value}` - Modificar perfil
- `DELETE /{key}/{value}` - Eliminar perfil
- `POST /follow/{userId}` - Seguir/dejar de seguir

### Sistema (`/api`)
- `GET /protected` - Ruta protegida de ejemplo
- `GET /admin-only` - Ruta solo para administradores
- `GET /data-by-apikey` - Ruta con API Key

## 📊 Modelos de datos

### Usuario (User)
```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "role": "user|admin",
  "bio": "string",
  "avatarUrl": "string",
  "followers": ["string"],
  "following": ["string"],
  "isActive": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Publicación (Post)
```json
{
  "_id": "string",
  "title": "string",
  "content": "string",
  "imageUrl": "string",
  "user": "string",
  "username": "string",
  "likes": ["string"],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Comentario (Comment)
```json
{
  "_id": "string",
  "content": "string",
  "user": "string",
  "username": "string",
  "post": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## 🛠️ Desarrollo

### Scripts disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo con nodemon
```

### Estructura del proyecto

```
API-RESTFUL-PROYECTO-doc/
├── controllers/          # Controladores de la lógica de negocio
├── middleware/          # Middlewares de autenticación y validación
├── models/             # Modelos de MongoDB/Mongoose
├── routes/             # Definición de rutas y documentación Swagger
├── server.js           # Archivo principal del servidor
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

## 🔍 Troubleshooting

### Problemas comunes

1. **Error de conexión a MongoDB**
   - Verifica que MongoDB esté ejecutándose
   - Revisa la URL de conexión en `.env`

2. **Error de JWT**
   - Asegúrate de incluir el token en el formato correcto
   - Verifica que el token no haya expirado

3. **CORS errors**
   - En desarrollo, CORS está configurado para permitir todos los orígenes
   - En producción, configura los dominios permitidos

## 📝 Notas adicionales

- La documentación Swagger se actualiza automáticamente al modificar los comentarios en los archivos de rutas
- Todos los endpoints incluyen validación de entrada y manejo de errores
- La API está preparada para escalar y agregar nuevas funcionalidades
- Se recomienda usar HTTPS en producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**¡Disfruta explorando la API con la documentación Swagger!** 🚀
