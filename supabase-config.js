// Configuración de Supabase
// Función para obtener variables de entorno en diferentes contextos
function getEnvVar(varName, defaultValue) {
    // Intentar obtener de variables de entorno del proceso (Node.js)
    if (typeof process !== 'undefined' && process.env && process.env[varName]) {
        return process.env[varName];
    }
    
    // Intentar obtener de variables globales del navegador (Netlify/Vercel)
    if (typeof window !== 'undefined' && window[varName]) {
        return window[varName];
    }
    
    // Intentar obtener de meta tags (otra forma común de inyectar variables)
    if (typeof document !== 'undefined') {
        const metaTag = document.querySelector(`meta[name="${varName}"]`);
        if (metaTag && metaTag.content) {
            return metaTag.content;
        }
    }
    
    return defaultValue;
}

// Configuración con fallbacks robustos
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL', 'https://ggzyqssptaonmwxoaedw.supabase.co');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnenlxc3NwdGFvbm13eG9hZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDc4MjYsImV4cCI6MjA3MjQyMzgyNn0.u_EpXzGNFqD_M_DQ2mnofkqCoSdzDjXv09-norDHpKo');

console.log('🌍 Entorno detectado:', window.location.hostname);
console.log('🔧 URL Supabase:', SUPABASE_URL);
console.log('🔧 Key configurada:', !!SUPABASE_ANON_KEY);
console.log('🔧 Fuente URL:', getEnvVar('VITE_SUPABASE_URL') ? 'Variable de entorno' : 'Valor por defecto');
console.log('🔧 Fuente Key:', getEnvVar('VITE_SUPABASE_ANON_KEY') ? 'Variable de entorno' : 'Valor por defecto');

let supabase = null;

// Función para inicializar Supabase
function initSupabase() {
    try {
        console.log('🔧 Iniciando configuración de Supabase...');
        console.log('🔍 URL:', SUPABASE_URL);
        console.log('🔍 Key disponible:', !!SUPABASE_ANON_KEY);
        console.log('🔍 Window.supabase disponible:', !!window.supabase);
        
        // Verificar si las credenciales están configuradas
        if (!SUPABASE_URL || 
            !SUPABASE_ANON_KEY || 
            SUPABASE_URL === 'TU_SUPABASE_URL' || 
            SUPABASE_ANON_KEY === 'TU_SUPABASE_ANON_KEY' ||
            SUPABASE_URL.trim() === '' ||
            SUPABASE_ANON_KEY.trim() === '') {
            console.warn('⚠️ Credenciales de Supabase no configuradas. Funcionando en modo offline.');
            mostrarNotificacion('Funcionando en modo offline - Solo almacenamiento local', 'warning');
            return false;
        }
        
        // Verificar si el SDK de Supabase está disponible
        if (typeof window.supabase === 'undefined' || !window.supabase || !window.supabase.createClient) {
            console.error('❌ SDK de Supabase no disponible.');
            console.error('❌ Esto indica que el script de Supabase no se cargó correctamente.');
            console.error('❌ Posibles causas:');
            console.error('   - Problemas de conectividad');
            console.error('   - Bloqueo de scripts externos');
            console.error('   - CDN no disponible');
            console.error('   - Políticas de CORS');
            mostrarNotificacion('Error: SDK de Supabase no disponible. Revisa la conexión.', 'error');
            return false;
        }
        
        console.log('🔄 Creando cliente de Supabase...');
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        if (!supabase) {
            throw new Error('No se pudo crear el cliente de Supabase');
        }
        
        console.log('✅ Supabase inicializado correctamente');
        console.log('✅ Cliente creado:', !!supabase);
        mostrarNotificacion('Conectado a Supabase - Sincronización habilitada', 'success');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Supabase:', error);
        console.error('❌ Stack trace:', error.stack);
        console.info('📝 Funcionando en modo offline. Los datos se guardan localmente.');
        mostrarNotificacion('Error de conexión - Modo offline activado', 'warning');
        return false;
    }
}

// Funciones para manejar sueños
async function agregarSuenoSupabase(texto) {
    try {
        console.log('🔄 Intentando agregar sueño a Supabase:', texto);
        console.log('🔍 Cliente Supabase disponible:', !!supabase);
        
        if (!supabase) {
            throw new Error('Cliente de Supabase no inicializado');
        }
        
        const { data, error } = await supabase
            .from('suenos')
            .insert([
                { texto: texto, cumplido: false }
            ])
            .select();
        
        if (error) {
            console.error('❌ Error de Supabase al agregar sueño:', error);
            throw error;
        }
        
        console.log('✅ Sueño agregado exitosamente:', data[0]);
        return data[0];
    } catch (error) {
        console.error('❌ Error al agregar sueño:', error);
        console.error('❌ Detalles del error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        throw error;
    }
}

async function obtenerSuenosSupabase() {
    try {
        const { data, error } = await supabase
            .from('suenos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al obtener sueños:', error);
        return [];
    }
}

async function marcarSuenoCumplidoSupabase(id, cumplido) {
    try {
        const { data, error } = await supabase
            .from('suenos')
            .update({ cumplido: cumplido })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al actualizar sueño:', error);
        throw error;
    }
}

// Función para actualizar estado de sueño (alias para compatibilidad)
async function actualizarSuenoSupabase(id, cumplido) {
    return await marcarSuenoCumplidoSupabase(id, cumplido);
}

// Función para eliminar sueño
async function eliminarSuenoSupabase(id) {
    try {
        console.log('🗑️ Eliminando sueño con ID:', id);
        const { data, error } = await supabase
            .from('suenos')
            .delete()
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('❌ Error al eliminar sueño:', error);
            throw error;
        }
        
        console.log('✅ Sueño eliminado exitosamente:', data[0]);
        return data[0];
    } catch (error) {
        console.error('❌ Error al eliminar sueño:', error);
        throw error;
    }
}

// Funciones para manejar fotos
async function verificarYCrearBucket() {
    try {
        // Verificar si el bucket existe
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.warn('Error al listar buckets:', listError);
            return false;
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === 'recuerdos-media');
        
        if (!bucketExists) {
            // Crear el bucket si no existe
            const { data: newBucket, error: createError } = await supabase.storage
                .createBucket('recuerdos-media', {
                    public: true,
                    allowedMimeTypes: ['image/*', 'video/*'],
                    fileSizeLimit: 52428800 // 50MB
                });
            
            if (createError) {
                console.error('Error al crear bucket:', createError);
                return false;
            }
            
            console.log('Bucket recuerdos-media creado exitosamente');
        }
        
        return true;
    } catch (error) {
        console.error('Error en verificarYCrearBucket:', error);
        return false;
    }
}

async function subirFotoSupabase(file, fileName) {
    try {
        console.log('🔄 Intentando subir archivo a Supabase:', {
            nombre: fileName,
            tamaño: file.size,
            tipo: file.type
        });
        console.log('🔍 Cliente Supabase disponible:', !!supabase);
        
        if (!supabase) {
            throw new Error('Cliente de Supabase no inicializado');
        }
        
        // Verificar y crear bucket si es necesario
        console.log('🔄 Verificando bucket...');
        const bucketReady = await verificarYCrearBucket();
        if (!bucketReady) {
            throw new Error('No se pudo verificar o crear el bucket de almacenamiento');
        }
        console.log('✅ Bucket verificado/creado');
        
        // Subir archivo a Storage
        console.log('⬆️ Subiendo archivo al storage...');
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('recuerdos-media')
            .upload(fileName, file);
        
        if (uploadError) {
            console.error('❌ Error al subir archivo al storage:', uploadError);
            console.error('❌ Detalles del error:', {
                message: uploadError.message,
                code: uploadError.code,
                details: uploadError.details,
                hint: uploadError.hint
            });
            throw uploadError;
        }
        console.log('✅ Archivo subido al storage:', uploadData);
        
        // Obtener URL pública
        console.log('🔗 Obteniendo URL pública...');
        const { data: urlData } = supabase.storage
            .from('recuerdos-media')
            .getPublicUrl(fileName);
        console.log('🔗 URL pública obtenida:', urlData.publicUrl);
        
        // Guardar referencia en la base de datos
        console.log('💾 Insertando referencia en tabla fotos...');
        const { data: dbData, error: dbError } = await supabase
            .from('fotos')
            .insert([
                { 
                    text: fileName, 
                    url: urlData.publicUrl
                }
            ])
            .select();
        
        if (dbError) {
            console.error('❌ Error al insertar en tabla fotos:', dbError);
            console.error('❌ Detalles del error:', {
                message: dbError.message,
                code: dbError.code,
                details: dbError.details,
                hint: dbError.hint
            });
            throw dbError;
        }
        console.log('✅ Referencia insertada en BD:', dbData[0]);
        
        const resultado = {
            id: dbData[0].id,
            nombre: fileName,
            url: urlData.publicUrl,
            tipo: dbData[0].tipo,
            fecha: dbData[0].created_at
        };
        
        console.log('✅ Proceso completo exitoso:', resultado);
        return resultado;
    } catch (error) {
        console.error('❌ Error al subir foto:', error);
        console.error('❌ Detalles del error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        throw error;
    }
}

async function obtenerFotosSupabase() {
    try {
        const { data, error } = await supabase
            .from('fotos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al obtener fotos:', error);
        return [];
    }
}

async function eliminarFotoSupabase(id, fileName) {
    try {
        // Eliminar archivo de Storage
        const { error: storageError } = await supabase.storage
            .from('recuerdos-media')
            .remove([fileName]);
        
        if (storageError) console.warn('Error al eliminar archivo:', storageError);
        
        // Eliminar referencia de la base de datos
        const { error: dbError } = await supabase
            .from('fotos')
            .delete()
            .eq('id', id);
        
        if (dbError) throw dbError;
        
        return true;
    } catch (error) {
        console.error('Error al eliminar foto:', error);
        throw error;
    }
}

// Función para migrar datos de localStorage a Supabase
async function migrarDatosASupabase() {
    try {
        // Migrar sueños
        const suenosLocal = JSON.parse(localStorage.getItem('suenos')) || [];
        for (const sueno of suenosLocal) {
            await agregarSuenoSupabase(sueno.texto);
            if (sueno.cumplido) {
                // Aquí necesitarías el ID del sueño recién creado
                // Esta es una implementación simplificada
            }
        }
        
        console.log('Migración de sueños completada');
        
        // Las fotos en localStorage son base64, necesitarían conversión especial
        // Por simplicidad, se recomienda subir las fotos manualmente
        
    } catch (error) {
        console.error('Error en migración:', error);
    }
}

// Función para verificar Supabase con logging detallado
async function verificarSupabase() {
    try {
        console.log('🔄 Iniciando verificación de Supabase...');
        
        // Inicializar Supabase
        initSupabase();
        
        if (!supabase) {
            console.error('❌ Cliente de Supabase no disponible');
            return false;
        }
        
        console.log('✅ Cliente de Supabase inicializado');
        console.log('🔍 URL de Supabase:', SUPABASE_URL);
        console.log('🔍 Clave anónima configurada:', !!SUPABASE_ANON_KEY);
        
        // Verificar conexión con una consulta simple
        console.log('🔄 Verificando conexión con consulta de prueba...');
        const { data, error } = await supabase
            .from('suenos')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Error al conectar con Supabase:', error);
            console.error('❌ Detalles del error:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return false;
        }
        
        console.log('✅ Conexión con Supabase verificada');
        console.log('📊 Datos de prueba:', data);
        
        // Cargar datos existentes
        console.log('🔄 Cargando datos existentes...');
        await cargarDatosDesdeSupabase();
        
        // Iniciar sincronización automática si está disponible
        console.log('🔄 Iniciando sincronización automática...');
        if (typeof window.iniciarSincronizacionAutomatica === 'function') {
            window.iniciarSincronizacionAutomatica();
        } else {
            console.log('⚠️ Función de sincronización automática no disponible aún');
        }
        
        console.log('✅ Verificación de Supabase completada exitosamente');
        return true;
    } catch (error) {
        console.error('❌ Error en verificación de Supabase:', error);
        console.error('❌ Detalles del error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            stack: error.stack
        });
        return false;
    }
}

// Exportar funciones y variables para uso global
window.initSupabase = initSupabase;
window.agregarSuenoSupabase = agregarSuenoSupabase;
window.obtenerSuenosSupabase = obtenerSuenosSupabase;
window.marcarSuenoCumplidoSupabase = marcarSuenoCumplidoSupabase;
window.actualizarSuenoSupabase = actualizarSuenoSupabase;
window.eliminarSuenoSupabase = eliminarSuenoSupabase;
window.verificarYCrearBucket = verificarYCrearBucket;
window.subirFotoSupabase = subirFotoSupabase;
window.obtenerFotosSupabase = obtenerFotosSupabase;
window.eliminarFotoSupabase = eliminarFotoSupabase;
window.migrarDatosASupabase = migrarDatosASupabase;
window.verificarSupabaseConfig = verificarSupabase;

// Hacer supabase disponible globalmente
Object.defineProperty(window, 'supabaseClient', {
    get: function() {
        return supabase;
    }
});

// También exportar una función para obtener el cliente
window.getSupabaseClient = function() {
    return supabase;
};