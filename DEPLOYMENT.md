# 🚀 Guía de Despliegue - iamelinda

Esta guía explica cómo desplegar tu sistema de recomendación de fanfics en diferentes plataformas.

## 🎯 AWS Amplify (Recomendado)

### Paso 1: Preparar el repositorio
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Paso 2: Configurar Amplify
1. Ve a la [consola de AWS Amplify](https://console.aws.amazon.com/amplify/)
2. Haz clic en "New app" → "Host web app"
3. Conecta tu repositorio de GitHub/GitLab
4. AWS detectará automáticamente la configuración desde `amplify.yml`

### Paso 3: Variables de entorno
En la configuración de Amplify, agrega:

```
OPENAI_API_KEY=tu_clave_openai
FIREBASE_PROJECT_ID=tu_proyecto_firebase
FIREBASE_PRIVATE_KEY_ID=tu_private_key_id
FIREBASE_PRIVATE_KEY=tu_private_key_completa
FIREBASE_CLIENT_EMAIL=tu_client_email
FIREBASE_CLIENT_ID=tu_client_id
ADMIN_PASSWORD=tu_password_admin
NODE_ENV=production
```

### Paso 4: Configurar Firebase
1. Ve a la [consola de Firebase](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Ve a "Project Settings" → "Service accounts"
5. Genera una nueva clave privada
6. Usa esos datos para las variables de entorno

### Paso 5: Deploy automático
- Amplify detectará automáticamente los cambios en `main`
- El build se ejecutará automáticamente usando `amplify.yml`
- Frontend y backend se desplegarán juntos

## 🔥 Firebase Hosting + Functions (Alternativa)

### Paso 1: Instalar Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Paso 2: Inicializar proyecto
```bash
firebase init
# Selecciona: Hosting, Functions
# Usa las configuraciones en firebase.json
```

### Paso 3: Configurar funciones
```bash
firebase functions:config:set openai.key="tu_clave_openai"
firebase functions:config:set admin.password="tu_password"
```

### Paso 4: Deploy
```bash
npm run build
firebase deploy
```

## 🌐 Vercel (Solo Frontend)

Si solo quieres desplegar el frontend:

### Paso 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Paso 2: Configurar
```bash
cd frontend
vercel
```

### Paso 3: Variables de entorno
En el dashboard de Vercel, configura:
- `REACT_APP_API_URL=tu_api_backend_url`

## 🐳 Docker (Para desarrollo)

### Dockerfile para backend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY backend ./backend
EXPOSE 3001
CMD ["node", "backend/server.js"]
```

### Dockerfile para frontend
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      # ... otras variables
  
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

## 🔧 Configuraciones por Entorno

### Desarrollo
```env
NODE_ENV=development
PORT=3001
OPENAI_API_KEY=tu_clave_dev
```

### Staging
```env
NODE_ENV=staging
PORT=3001
OPENAI_API_KEY=tu_clave_staging
```

### Producción
```env
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=tu_clave_prod
```

## 📊 Monitoreo y Logs

### AWS CloudWatch (para Amplify)
- Los logs se envían automáticamente a CloudWatch
- Configura alertas para errores

### Logging personalizado
```javascript
// En backend/server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});
```

## 🔐 Seguridad en Producción

### Variables de entorno
- ✅ Nunca commitees archivos `.env`
- ✅ Usa servicios de gestión de secretos
- ✅ Rota las claves periódicamente

### Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo lectura para fanfics
    match /fanfics/{document} {
      allow read: if true;
      allow write: if false; // Solo desde el backend
    }
  }
}
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

## 🚨 Troubleshooting

### Build falla en Amplify
- Revisa los logs en la consola de Amplify
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `amplify.yml` esté en la raíz

### Firebase Functions timeout
- Aumenta el timeout en `firebase.json`
- Optimiza las consultas a Firestore
- Considera usar Cloud Run para APIs más complejas

### OpenAI API errors
- Verifica los límites de rate limiting
- Implementa retry logic
- Usa fallbacks cuando la API no esté disponible

## 📈 Optimizaciones

### Frontend
```javascript
// Lazy loading de componentes
const AdminPanel = React.lazy(() => import('./pages/Admin'));

// Code splitting por rutas
<Suspense fallback={<Spinner />}>
  <AdminPanel />
</Suspense>
```

### Backend
```javascript
// Caché para consultas frecuentes
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutos

// Compresión de respuestas
const compression = require('compression');
app.use(compression());
```

## 🔄 CI/CD Pipeline

### GitHub Actions (ejemplo)
```yaml
name: Deploy to AWS Amplify
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm run install-all
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

---

¿Necesitas ayuda con algún paso específico? 🤝
