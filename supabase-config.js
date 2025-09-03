// Configuración de Supabase
const SUPABASE_URL = 'https://ggzyqssptaonmwxoaedw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnenlxc3NwdGFvbm13eG9hZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDc4MjYsImV4cCI6MjA3MjQyMzgyNn0.u_EpXzGNFqD_M_DQ2mnofkqCoSdzDjXv09-norDHpKo';

let supabase = null;

// Función para inicializar Supabase
function initSupabase() {
    try {
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
            console.warn('⚠️ SDK de Supabase no disponible. Funcionando en modo offline.');
            console.log('Esto puede deberse a problemas de conectividad o bloqueo de scripts externos.');
            mostrarNotificacion('Modo offline activado - Datos guardados localmente', 'warning');
            return false;
        }
        
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase inicializado correctamente');
        mostrarNotificacion('Conectado a Supabase - Sincronización habilitada', 'success');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Supabase:', error);
        console.info('📝 Funcionando en modo offline. Los datos se guardan localmente.');
        mostrarNotificacion('Error de conexión - Modo offline activado', 'warning');
        return false;
    }
}

// Funciones para manejar sueños
async function agregarSuenoSupabase(texto) {
    try {
        const { data, error } = await supabase
            .from('suenos')
            .insert([
                { texto: texto, cumplido: false }
            ])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al agregar sueño:', error);
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

// Funciones para manejar fotos
async function subirFotoSupabase(file, fileName) {
    try {
        // Subir archivo a Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('recuerdos-media')
            .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from('recuerdos-media')
            .getPublicUrl(fileName);
        
        // Guardar referencia en la base de datos
        const { data: dbData, error: dbError } = await supabase
            .from('fotos')
            .insert([
                { 
                    nombre: fileName, 
                    url: urlData.publicUrl,
                    tipo: file.type.startsWith('video/') ? 'video' : 'image'
                }
            ])
            .select();
        
        if (dbError) throw dbError;
        
        return {
            id: dbData[0].id,
            nombre: fileName,
            url: urlData.publicUrl,
            tipo: dbData[0].tipo,
            fecha: dbData[0].created_at
        };
    } catch (error) {
        console.error('Error al subir foto:', error);
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

// Exportar funciones y variables para uso global
window.initSupabase = initSupabase;
window.agregarSuenoSupabase = agregarSuenoSupabase;
window.obtenerSuenosSupabase = obtenerSuenosSupabase;
window.marcarSuenoCumplidoSupabase = marcarSuenoCumplidoSupabase;
window.actualizarSuenoSupabase = actualizarSuenoSupabase;
window.subirFotoSupabase = subirFotoSupabase;
window.obtenerFotosSupabase = obtenerFotosSupabase;
window.eliminarFotoSupabase = eliminarFotoSupabase;
window.migrarDatosASupabase = migrarDatosASupabase;

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