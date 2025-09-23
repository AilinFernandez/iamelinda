# 🎯 iamelinda - Sistema de Recomendación de Fanfics

Un sistema inteligente para recomendar fanfics usando IA, construido con **React**, **Node.js** y **Firebase**.

## ✨ Características

- 🤖 **Búsqueda inteligente** con procesamiento de lenguaje natural usando OpenAI
- 📚 **Base de datos curada** de fanfics de Archive of Our Own
- 🔍 **Búsqueda semántica** que entiende contexto y matices
- 👑 **Panel de administración** para gestionar contenido
- 📊 **Análisis y estadísticas** detalladas
- 🚀 **Preparado para AWS Amplify**

## 🏗️ Arquitectura

- **Frontend**: React 18 + Bootstrap 5
- **Backend**: Node.js + Express
- **Base de datos**: Firebase Firestore
- **IA**: OpenAI GPT-3.5-turbo
- **Hosting**: AWS Amplify (preparado)

## 🚀 Instalación

### 1. Clonar repositorio
```bash
git clone <tu-repositorio>
cd iamelinda
```

### 2. Instalar dependencias
```bash
npm run install-all
```

### 3. Configurar variables de entorno
```bash
cp env.example .env
```

Edita `.env` con tus credenciales:
- `OPENAI_API_KEY`: Tu clave de API de OpenAI
- `FIREBASE_*`: Credenciales de Firebase
- `ADMIN_PASSWORD`: Contraseña para el panel de admin

### 4. Ejecutar en desarrollo
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run frontend
```

## 📡 API Endpoints

### Públicos
- `POST /api/search` - Búsqueda de fanfics
- `GET /api/stats` - Estadísticas públicas
- `GET /health` - Estado del servidor

### Administración (requiere password)
- `GET /api/admin/fanfics` - Listar todos los fanfics
- `POST /api/admin/fanfics` - Crear fanfic manualmente
- `POST /api/admin/upload-csv` - Subir fanfics desde CSV
- `PUT /api/admin/fanfics/:id` - Actualizar fanfic
- `DELETE /api/admin/fanfics/:id` - Eliminar fanfic
- `GET /api/admin/stats` - Estadísticas detalladas

## 🔍 Uso del Sistema

### Para Usuarios
1. Ve a la página principal
2. Describe el tipo de fanfic que buscas en lenguaje natural
3. Obtén recomendaciones personalizadas con explicaciones de IA
4. Explora sugerencias relacionadas

### Para Administradores
1. Ve a `/admin`
2. Ingresa la contraseña de administrador
3. Sube fanfics manualmente o desde CSV
4. Gestiona el contenido existente
5. Revisa estadísticas y métricas

## 📁 Estructura del Proyecto

```
iamelinda/
├── backend/
│   ├── config/
│   │   └── firebase.js          # Configuración Firebase
│   ├── services/
│   │   ├── fanficService.js     # Lógica de fanfics
│   │   └── openai.js            # Integración OpenAI
│   └── server.js                # Servidor Express
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js        # Navegación
│   │   │   └── FanficCard.js    # Tarjeta de fanfic
│   │   ├── pages/
│   │   │   ├── Home.js          # Página principal
│   │   │   ├── Search.js        # Búsqueda
│   │   │   └── Admin.js         # Panel admin
│   │   ├── App.js               # Componente principal
│   │   └── App.css              # Estilos
│   └── public/
├── package.json                 # Dependencias backend
└── amplify.yml                  # Configuración AWS Amplify
```

## 🚀 Despliegue en AWS Amplify

### 1. Configuración automática
El proyecto incluye `amplify.yml` para despliegue automático.

### 2. Variables de entorno en Amplify
Configura en la consola de Amplify:
- `OPENAI_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `ADMIN_PASSWORD`

### 3. Build automático
El sistema detecta automáticamente:
- **Frontend**: React app en `/frontend`
- **Backend**: API en `/backend`

## 🎨 Ejemplos de Búsqueda

### Búsquedas básicas:
- "fanfics de Harry Potter donde los padres estén vivos"
- "historias románticas de Marvel con Iron Man"
- "fanfics completos de Percy Jackson"

### Búsquedas avanzadas:
- "crossovers entre Harry Potter y Percy Jackson"
- "fanfics de Twilight desde la perspectiva de otros personajes"
- "historias de Avatar con elementos de romance y aventura"

## 📊 Formato CSV para Subir Fanfics

```csv
Titulo,Autor,Resumen,Etiquetas,Advertencias,Enlace
"Título del fanfic","Nombre del autor","Resumen de la historia","tag1,tag2,tag3","advertencias","https://ao3.org/works/123"
```

## 🔧 Scripts Disponibles

```bash
npm start              # Iniciar backend
npm run dev            # Backend con nodemon
npm run frontend       # Iniciar React
npm run build          # Build para producción
npm run install-all    # Instalar todo
npm run deploy         # Deploy a Firebase (futuro)
```

## 🐛 Solución de Problemas

### Backend no inicia
- Verifica que las variables de entorno estén configuradas
- Asegúrate de que Firebase esté correctamente configurado

### Búsquedas no funcionan
- Verifica `OPENAI_API_KEY` en `.env`
- Revisa los logs del servidor para errores

### Panel admin inaccesible
- Verifica `ADMIN_PASSWORD` en `.env`
- Limpia localStorage del navegador

## 🔐 Seguridad

- Las rutas de admin requieren autenticación por password
- Firebase usa credenciales del service account
- OpenAI API key se mantiene en el servidor
- No hay exposición de credenciales en el frontend

## 🚧 Roadmap

- [ ] Más fuentes de fanfics (FanFiction.net)
- [ ] Sistema de usuarios con autenticación
- [ ] Favoritos y listas de lectura
- [ ] Notificaciones de nuevos fanfics
- [ ] API pública para desarrolladores
- [ ] Análisis de sentimientos en reseñas

## 📞 Soporte

Para problemas o preguntas:
1. Revisa los logs del servidor
2. Verifica la configuración de variables de entorno
3. Consulta la documentación de la API

---

**Hecho con ❤️ para la comunidad de fanfics**
