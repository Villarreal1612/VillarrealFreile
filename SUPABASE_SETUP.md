# 🚀 Guía Completa de Configuración de Supabase

## 📋 Paso 1: Crear Cuenta en Supabase

1. **Ve a [supabase.com](https://supabase.com)**
2. **Haz clic en "Start your project"**
3. **Inicia sesión con GitHub** (recomendado) o crea una cuenta nueva
4. **Autoriza Supabase** si usas GitHub

## 🏗️ Paso 2: Crear Nuevo Proyecto

1. **Haz clic en "New Project"**
2. **Completa la información:**
   - **Name:** `VillarrealFreile-Recuerdos`
   - **Database Password:** Crea una contraseña segura (¡GUÁRDALA!)
   - **Region:** Selecciona la más cercana (ej: `South America (São Paulo)`)
   - **Pricing Plan:** Mantén "Free" seleccionado
3. **Haz clic en "Create new project"**
4. **Espera 2-3 minutos** mientras se crea el proyecto

## 🗄️ Paso 3: Configurar Base de Datos

### 3.1 Crear Tabla de Sueños
1. **Ve a "SQL Editor"** en el panel izquierdo
2. **Haz clic en "+ New query"**
3. **Copia y pega este código SQL:**

```sql
-- Crear tabla de sueños
CREATE TABLE suenos (
  id SERIAL PRIMARY KEY,
  texto TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  cumplido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE suenos ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones (para desarrollo)
CREATE POLICY "Permitir todas las operaciones en suenos" ON suenos
FOR ALL USING (true) WITH CHECK (true);
```

4. **Haz clic en "Run"** para ejecutar
5. **Verifica que aparezca "Success"**

### 3.2 Crear Tabla de Fotos
1. **Crea una nueva query**
2. **Copia y pega este código:**

```sql
-- Crear tabla de fotos
CREATE TABLE fotos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  url TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  tipo TEXT DEFAULT 'image',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones
CREATE POLICY "Permitir todas las operaciones en fotos" ON fotos
FOR ALL USING (true) WITH CHECK (true);
```

3. **Ejecuta la query**

## 📁 Paso 4: Configurar Storage

1. **Ve a "Storage"** en el panel izquierdo
2. **Haz clic en "Create a new bucket"**
3. **Configura el bucket:**
   - **Name:** `recuerdos-media`
   - **Public bucket:** ✅ **Activado** (para acceso directo a imágenes)
   - **File size limit:** `50 MB`
   - **Allowed MIME types:** `image/*,video/*`
4. **Haz clic en "Create bucket"**

### 4.1 Configurar Políticas de Storage
1. **Haz clic en el bucket "recuerdos-media"**
2. **Ve a la pestaña "Policies"**
3. **Haz clic en "New policy"**
4. **Selecciona "For full customization"**
5. **Usa esta política:**

```sql
CREATE POLICY "Permitir subida y lectura pública" ON storage.objects
FOR ALL USING (bucket_id = 'recuerdos-media');
```

6. **Haz clic en "Review"** y luego **"Save policy"**

## 🔑 Paso 5: Obtener Credenciales

1. **Ve a "Settings" > "API"** en el panel izquierdo
2. **Copia y guarda estos valores:**
   - **Project URL:** `https://tu-proyecto.supabase.co`
   - **anon public key:** `eyJ0eXAiOiJKV1Q...` (clave larga)

## 📝 Paso 6: Actualizar Código

### 6.1 Instalar Supabase Client
```bash
npm install @supabase/supabase-js
```

### 6.2 Crear archivo de configuración
Crea `supabase-config.js` con:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'TU_PROJECT_URL_AQUI'
const supabaseKey = 'TU_ANON_KEY_AQUI'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 🔄 Paso 7: Migrar Datos Existentes

1. **Exportar datos de localStorage**
2. **Importar a Supabase usando SQL**
3. **Verificar sincronización**

## ✅ Paso 8: Probar Funcionalidad

1. **Agregar un sueño nuevo**
2. **Subir una foto**
3. **Verificar en otro dispositivo**

---

## 🆘 Solución de Problemas

### Error de CORS
- Verifica que las políticas RLS estén configuradas
- Asegúrate de usar las credenciales correctas

### Error de Storage
- Verifica que el bucket sea público
- Confirma las políticas de storage

### Error de Conexión
- Verifica la URL del proyecto
- Confirma que la API key sea correcta

---

**¡Listo! Con esta configuración tendrás sincronización completa entre dispositivos.** 🎉