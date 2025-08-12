require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
// console.log('authRoutes:', typeof authRoutes); // Debería ser 'function' (router es una función)

const { protect, authorize } = require('./middleware/authMiddleware');
// console.log('protect:', typeof protect);   // Debería ser 'function'
// console.log('authorize:', typeof authorize); // Debería ser 'function'

const apiAuth = require('./middleware/apiAuthMiddleware'); // Para la autenticación de API Key
// console.log('apiAuth:', typeof apiAuth);   // Debería ser 'function'

const cors = require('cors'); // Importa cors

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API REST NextFeed',
    version: '1.0.0',
    description: 'API RESTful completa para una aplicación de redes sociales tipo NextFeed. Incluye autenticación JWT, gestión de usuarios, publicaciones, comentarios y perfiles.',
    contact: {
      name: 'API Support',
      email: 'support@nextfeed.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo local',
    },
    {
      url: 'https://api.nextfeed.com',
      description: 'Servidor de producción',
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT obtenido del endpoint de login. Formato: Bearer <token>'
      },
  // Eliminado apiKeyAuth
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID único del usuario'
          },
          username: {
            type: 'string',
            description: 'Nombre de usuario único',
            minLength: 3,
            maxLength: 30
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico único'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'Rol del usuario',
            default: 'user'
          },
          bio: {
            type: 'string',
            description: 'Biografía del usuario',
            maxLength: 500
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            description: 'URL del avatar del usuario'
          },
          followers: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array de IDs de usuarios que siguen a este usuario'
          },
          following: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array de IDs de usuarios que este usuario sigue'
          },
          isActive: {
            type: 'boolean',
            description: 'Estado activo del usuario',
            default: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación del usuario'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización'
          }
        }
      },
      Post: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID único de la publicación'
          },
          title: {
            type: 'string',
            description: 'Título de la publicación',
            maxLength: 100
          },
          content: {
            type: 'string',
            description: 'Contenido de la publicación'
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
            description: 'URL de la imagen de la publicación'
          },
          user: {
            type: 'string',
            description: 'ID del usuario que creó la publicación'
          },
          username: {
            type: 'string',
            description: 'Nombre del usuario que creó la publicación'
          },
          likes: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array de IDs de usuarios que dieron like'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación de la publicación'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización'
          }
        }
      },
      Comment: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID único del comentario'
          },
          content: {
            type: 'string',
            description: 'Contenido del comentario',
            maxLength: 500
          },
          user: {
            type: 'string',
            description: 'ID del usuario que hizo el comentario'
          },
          username: {
            type: 'string',
            description: 'Nombre del usuario que hizo el comentario'
          },
          post: {
            type: 'string',
            description: 'ID de la publicación a la que pertenece el comentario'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación del comentario'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica si la operación fue exitosa',
            example: false
          },
          message: {
            type: 'string',
            description: 'Mensaje de error descriptivo'
          },
          error: {
            type: 'object',
            description: 'Detalles adicionales del error (solo en desarrollo)'
          }
        }
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica si la operación fue exitosa',
            example: true
          },
          message: {
            type: 'string',
            description: 'Mensaje de éxito'
          },
          data: {
            type: 'object',
            description: 'Datos de la respuesta'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Incluye todas las rutas
};

const swaggerSpec = swaggerJSDoc(options);

const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const profileRoutes = require('./routes/profileRoutes');


const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Ruta de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API REST NextFeed - Documentación",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true
  }
}));




// Middleware para CORS
// En desarrollo, puedes permitir todo. En producción, especifica tus dominios.
app.use(cors({
  origin: '*', // Permite cualquier origen (para desarrollo) CAMBIAR CUANDO ESTE EN PRODUCCION AL CODIGO DE ABAJO
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// Si quieres ser más específico en producción:
/*
app.use(cors({
  origin: 'http://localhost:8000', // Ejemplo para Cordova con `cordova serve`
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
*/

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Conexión a la base de datos
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas de autenticación (públicas)
app.use('/api/auth', authRoutes);

// Ejemplo de una ruta protegida con JWT (Bearer Token)
app.get('/api/protected', protect, (req, res) => {
  res.status(200).json({
    message: `¡Bienvenido ${req.user.username}! Has accedido a una ruta protegida con JWT. Tu rol es: ${req.userRole}`,
    user: req.user
  });
});

// Ejemplo de una ruta protegida con JWT y roles (solo para admins)
app.get('/api/admin-only', protect, authorize(['admin']), (req, res) => {
  res.status(200).json({
    message: `¡Hola admin ${req.user.username}! Tienes acceso a esta ruta de administrador.`,
    user: req.user
  });
});



// Manejo global de errores (500)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     message: err.message || 'Algo salió mal en el servidor.',
//     error: process.env.NODE_ENV === 'development' ? err : {} // No mostrar errores detallados en producción
//   });
// });



// AÑADIR NUEVAS RUTAS DE PUBLICACIONES Y COMENTARIOS AQUÍ
// app.use('/api/posts', postRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/profile', profileRoutes);




// Rutas de autenticación

// Rutas de publicaciones (protegidas donde sea necesario)
app.use('/api/posts', postRoutes);

// Rutas de comentarios (protegidas donde sea necesario)
app.use('/api/comments', commentRoutes);

// Rutas de perfil (protegidas)
app.use('/api/profile', protect, profileRoutes); // Toda la ruta de perfil está protegida por JWT





// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: `No se encontró la ruta: ${req.originalUrl}` });
});


// Manejo global de errores (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Algo salió mal en el servidor.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});


// // Iniciar el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor ejecutándose en http://localhost:${PORT}`;

// });

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('API corriendo...');
});

// Para ver la documentación Swagger, visita: http://localhost:3000/api-docs




// una forma de subir a la nube el servicio de la api