# Datapoint Tareas - Monorepo

Este proyecto es un monorepo que contiene la solución completa para el sistema de gestión de tareas de Datapoint, compuesto tanto por una API (backend) como por una aplicación cliente (frontend).

## Estructura del Proyecto

- `backend/`: API RESTful construida con NestJS.
- `frontend/`: Aplicación cliente de la plataforma.

---

## Backend (API de Tareas)

Esta es una API RESTful construida con [NestJS](https://nestjs.com/) para la gestión de usuarios y tareas. Incluye autenticación basada en JWT y está integrada con una base de datos MySQL usando TypeORM.

### Características

- **Autenticación de Usuarios**: Registro e inicio de sesión con correo electrónico y contraseña.
- **Protección JWT**: Rutas de la API protegidas mediante JSON Web Tokens.
- **Gestión de Tareas**: Crear, leer, actualizar y eliminar tareas (CRUD).
- **Filtrado**: Obtener tareas filtradas por su estado (Pendiente, En Progreso, Completada).

### Tecnologías Utilizadas

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL
- **ORM**: TypeORM
- **Autenticación**: Passport.js + JWT

### Descripción General de la Solución (Arquitectura y Enfoque)

El backend está desarrollado siguiendo una arquitectura modular en capas basada en NestJS. Este enfoque garantiza una separación limpia de responsabilidades:
- **Controladores**: Manejan el enrutamiento y las peticiones HTTP.
- **Servicios**: Contienen toda la lógica de negocio.
- **Módulos**: Organizan funcionalmente la app en dominios (User, Auth, Tasks).
- **Capa de Datos**: Configurada mediante TypeORM, lo que permite abstracción sobre la base de datos, facilitando protección contra inyecciones SQL y un manejo relacional estable.

Se ha implementado un sistema de autenticación seguro mediante JWT, lo que asegura que las rutas privadas estén fuertemente protegidas.

### Explicación Breve (Punto de Vista del Usuario Final)

El modelo de interacción para un usuario opera de la siguiente manera:
1. **Registro/Ingreso**: Todo inicia creando una cuenta o logueándose, lo cual provee un token de acceso.
2. **Tablero Personal (CRUD)**: Una vez autenticado, el usuario acciona sobre su "tablero personal", pudiendo crear, editar y eliminar tareas. El sistema **restringe y protege** para que el usuario solo opere y acceda a las tareas que le pertenecen, garantizando privacidad y seguridad.
3. **Organización**: El usuario puede clasificar tareas por prioridades y estados, así como emplear filtros para organizarse eficientemente.
4. **Extensibilidad de Roles**: El sistema está preparado para recibir filtros por `ownerId`, dando soporte en un futuro a la creación de perfiles de supervisor para visualizar las métricas y progreso del equipo.

### Configuración del Proyecto (Backend)

1. **Ingresar a la carpeta e instalar dependencias**:
   ```bash
   cd backend
   npm install
   ```

2. **Variables de Entorno**:
   Crea un archivo `.env` en el directorio `backend` basándote en las variables utilizadas en `app.module.ts`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=datapoint_tasks
   JWT_SECRET=tu_clave_secreta_jwt
   ```

3. **Base de Datos**:
   Asegúrate de tener un servidor MySQL en ejecución y de que la base de datos `datapoint_tasks` (o el nombre que hayas configurado en `DB_NAME`) esté creada. El ORM sincronizará automáticamente y creará las tablas al iniciar (`synchronize: true`).

### Ejecutar la aplicación (Backend)

Dentro del directorio `backend`:
```bash
# desarrollo
$ npm run start

# modo observador (watch mode)
$ npm run start:dev

# modo producción
$ npm run start:prod
```

### Documentación de la API

#### Autenticación (`/auth`)

##### 1. Registrar un nuevo usuario
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña",
    "name": "Nombre del Usuario"
  }
  ```

##### 2. Iniciar sesión (Login)
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
  }
  ```
- **Respuesta**: Retorna un `access_token` que debe usarse como token Bearer para las rutas protegidas.

#### Tareas (`/tasks`)
*Todas las rutas de tareas están protegidas y requieren la cabecera `Authorization` con un token JWT Bearer (`Authorization: Bearer <access_token>`).*

##### 1. Obtener todas las tareas
- **Endpoint**: `GET /tasks`
- **Parámetros de consulta (Opcional)**: 
  - `status`: ej. `?status=pending|in_progress|completed`
  - `ownerId`: ej. `?ownerId=2` (Para filtrar las tareas de un usuario específico - útil para futuros roles de supervisor)
- **Descripción**: Retorna todas las tareas pertenecientes al usuario autenticado (o de un `ownerId` específico si se provee el filtro).

##### 2. Crear una tarea
- **Endpoint**: `POST /tasks`
- **Body**:
  ```json
  {
    "title": "Mi nueva tarea",
    "description": "Detalles sobre la tarea",
    "priority": "high",
    "due_date": "2026-12-31"
  }
  ```

##### 3. Actualizar una tarea
- **Endpoint**: `PUT /tasks/:id`
- **Body**: Campos que deseas actualizar (ej. `status`).
  ```json
  {
    "status": "in_progress"
  }
  ```

##### 4. Eliminar una tarea
- **Endpoint**: `DELETE /tasks/:id`
- **Descripción**: Elimina la tarea con el ID especificado.

---

## Frontend

*Actualmente la aplicación cliente (frontend) está configurada en su directorio `/frontend` respectivo y en desarrollo.*

---
*Creado como proyecto de evaluación backend.*
