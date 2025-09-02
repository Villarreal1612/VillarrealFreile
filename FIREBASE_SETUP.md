# Configuración de Firebase para VillarrealFreile

## Pasos para configurar Firebase:

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto: `villarrealfreile`
4. Acepta los términos y crea el proyecto

### 2. Configurar Firestore Database
1. En el panel izquierdo, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (por ahora)
4. Elige una ubicación cercana (ej: southamerica-east1)

### 3. Configurar Firebase Storage
1. En el panel izquierdo, ve a "Storage"
2. Haz clic en "Comenzar"
3. Acepta las reglas de seguridad por defecto

### 4. Obtener configuración web
1. En "Configuración del proyecto" (ícono de engranaje)
2. Ve a la pestaña "General"
3. En "Tus apps", haz clic en el ícono web `</>`
4. Registra tu app con el nombre: `VillarrealFreile Web`
5. Copia la configuración que aparece

### 5. Reemplazar configuración en index.html
Reemplaza las credenciales de ejemplo en `index.html` (líneas 375-382) con tu configuración real:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345"
};
```

### 6. Configurar reglas de seguridad

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura a todos por ahora
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 7. Desplegar en Netlify
Una vez configurado Firebase:
1. Haz commit de los cambios
2. Sube a GitHub
3. Netlify detectará automáticamente los cambios
4. La app estará disponible con sincronización en tiempo real

## Características implementadas:

✅ **Almacenamiento en la nube**: Fotos y sueños se guardan en Firebase
✅ **Sincronización en tiempo real**: Los cambios aparecen automáticamente en todos los dispositivos
✅ **Fallback a localStorage**: Si no hay conexión, funciona localmente
✅ **Subida de archivos**: Las fotos/videos se almacenan en Firebase Storage
✅ **Eliminación segura**: Los archivos se eliminan tanto de Firestore como de Storage

## Notas importantes:

- Las reglas de seguridad actuales permiten acceso completo. Para producción, considera implementar autenticación.
- Los archivos se suben a Firebase Storage y las URLs se guardan en Firestore.
- La sincronización funciona en tiempo real entre dispositivos.
- Si Firebase falla, la app funciona con localStorage como respaldo.