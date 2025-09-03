# 💕 Caja Fuerte de Amor - VillarrealFreile

Una aplicación web romántica que funciona como una caja fuerte digital para parejas, donde pueden almacenar fotos, videos, sueños y momentos especiales de su relación.

## ✨ Características

- 🔐 **Acceso protegido por contraseña** con teclado virtual
- ⏰ **Contador de tiempo** desde el inicio de la relación
- 📸 **Galería de fotos y videos** con vista modal
- 💭 **Sección de sueños** para planificar el futuro juntos
- 📝 **Formulario para llenar la relación** con multimedia
- ☁️ **Almacenamiento en la Nube**: Todos los datos se guardan directamente en Supabase
- 🎨 **Diseño romántico** con colores y tipografías especiales
- 📱 **Totalmente responsive** para móviles y tablets

## 🚀 Tecnologías Utilizadas

- HTML5
- CSS3 (con Google Fonts)
- JavaScript (Vanilla)
- Supabase - Base de datos y almacenamiento en la nube (fuente única de datos)
- Responsive Design

## 🛠️ Instalación y Uso

1. Clona este repositorio:
```bash
git clone https://github.com/Villarreal1612/VillarrealFreile.git
```

2. Navega al directorio del proyecto:
```bash
cd VillarrealFreile
```

3. Instala las dependencias:
```bash
npm install
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en `http://localhost:3000`

## 🌐 Despliegue

Este proyecto está configurado para desplegarse fácilmente en Netlify:

1. Conecta tu repositorio de GitHub con Netlify
2. Netlify detectará automáticamente la configuración
3. El sitio se desplegará automáticamente en cada push

## 🚀 Cómo ejecutar el proyecto

### Opción 1: Servidor con recarga automática (Recomendado)

1. **Instalar dependencias** (solo la primera vez):
   ```bash
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   
   Esto iniciará un servidor local en `http://localhost:3000` y abrirá automáticamente el proyecto en tu navegador.

### Opción 2: Servidor simple

```bash
npm start
```

### Opción 3: Abrir directamente

Simplemente abre el archivo `index.html` en tu navegador web.

## ✨ Características de desarrollo

### Recarga automática
Cuando uses `npm run dev`, el proyecto se recargará automáticamente en el navegador cada vez que hagas cambios en cualquier archivo (HTML, CSS, JS). Esto significa que:

- ✅ Modificas cualquier archivo
- ✅ Guardas los cambios
- ✅ El navegador se actualiza automáticamente
- ✅ Ves los cambios inmediatamente

### Archivos que se monitorean
- `index.html` - Estructura principal
- `styles.css` - Estilos y diseño
- `script.js` - Funcionalidad JavaScript
- Cualquier archivo en la carpeta `assets/`

## 🔧 Personalización

### Cambiar la contraseña
En el archivo `script.js`, línea 2:
```javascript
const CONTRASENA = "161223"; // Cambia por tu contraseña deseada
```

### Cambiar la fecha de inicio
En el archivo `script.js`, línea 53:
```javascript
const fechaInicio = new Date('2023-12-16'); // Cambia por tu fecha
```

### Personalizar la carta
En el archivo `index.html`, busca la sección con clase `contenido-carta` y modifica el texto.

### Cambiar las fotos
Reemplaza las imágenes en la carpeta `assets/img/` y actualiza las rutas en el HTML.

## 📁 Estructura del proyecto

```
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── package.json        # Configuración de npm
├── assets/
│   ├── img/           # Imágenes del proyecto
│   └── icon/          # Iconos de cursor
└── README.md          # Este archivo
```

## 🎯 Funcionalidades

1. **Caja Fuerte**: Interfaz de teclado numérico con contraseña
2. **Contador de Tiempo**: Muestra años, meses, días, horas, minutos y segundos desde una fecha específica
3. **Galería de Fotos**: Visualización de imágenes personalizadas
4. **Carta Personal**: Mensaje personalizable
5. **Navegación**: Botones para moverse entre secciones

## 💡 Consejos de desarrollo

- Usa `npm run dev` para desarrollo activo
- Los cambios se reflejan inmediatamente en el navegador
- Revisa la consola del navegador para errores de JavaScript
- El servidor se ejecuta en el puerto 3000 por defecto

¡Disfruta personalizando tu caja fuerte de amor! 💖