// Configuración y funciones de Firebase para almacenamiento compartido

// Variables globales para datos
let suenos = [];
let fotos = [];
let datosInicializados = false;

// Función para inicializar los datos desde Firebase
async function inicializarDatos() {
    if (datosInicializados) return;
    
    try {
        // Cargar sueños desde Firebase
        const suenosSnapshot = await db.collection('suenos').orderBy('fecha', 'desc').get();
        suenos = [];
        suenosSnapshot.forEach(doc => {
            suenos.push({ id: doc.id, ...doc.data() });
        });
        
        // Cargar fotos desde Firebase
        const fotosSnapshot = await db.collection('fotos').orderBy('fecha', 'desc').get();
        fotos = [];
        fotosSnapshot.forEach(doc => {
            fotos.push({ id: doc.id, ...doc.data() });
        });
        
        datosInicializados = true;
        console.log('Datos cargados desde Firebase:', { suenos: suenos.length, fotos: fotos.length });
        
        // Actualizar la interfaz si ya está cargada
        if (document.readyState === 'complete') {
            actualizarInterfaz();
        }
        
    } catch (error) {
        console.error('Error al cargar datos desde Firebase:', error);
        // Fallback a localStorage si Firebase falla
        cargarDesdeLocalStorage();
    }
}

// Función de fallback para cargar desde localStorage
function cargarDesdeLocalStorage() {
    suenos = JSON.parse(localStorage.getItem('suenos')) || [];
    fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    datosInicializados = true;
    console.log('Datos cargados desde localStorage como fallback');
}

// Función para agregar un sueño a Firebase
async function agregarSuenoFirebase(nuevoSueno) {
    try {
        const docRef = await db.collection('suenos').add({
            texto: nuevoSueno.texto,
            fecha: nuevoSueno.fecha,
            cumplido: nuevoSueno.cumplido,
            fechaCumplido: nuevoSueno.fechaCumplido,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Agregar el ID al objeto local
        nuevoSueno.id = docRef.id;
        suenos.unshift(nuevoSueno);
        
        console.log('Sueño agregado a Firebase con ID:', docRef.id);
        return true;
    } catch (error) {
        console.error('Error al agregar sueño a Firebase:', error);
        // Fallback a localStorage
        suenos.push(nuevoSueno);
        localStorage.setItem('suenos', JSON.stringify(suenos));
        return false;
    }
}

// Función para actualizar un sueño en Firebase
async function actualizarSuenoFirebase(index, datosActualizados) {
    try {
        const sueno = suenos[index];
        if (sueno.id) {
            await db.collection('suenos').doc(sueno.id).update(datosActualizados);
            
            // Actualizar localmente
            Object.assign(suenos[index], datosActualizados);
            
            console.log('Sueño actualizado en Firebase');
            return true;
        }
    } catch (error) {
        console.error('Error al actualizar sueño en Firebase:', error);
        // Fallback a localStorage
        Object.assign(suenos[index], datosActualizados);
        localStorage.setItem('suenos', JSON.stringify(suenos));
        return false;
    }
}

// Función para subir archivo a Firebase Storage
async function subirArchivoFirebase(archivo) {
    try {
        const timestamp = Date.now();
        const nombreArchivo = `${timestamp}_${archivo.name}`;
        const storageRef = storage.ref().child(`multimedia/${nombreArchivo}`);
        
        // Subir archivo
        const snapshot = await storageRef.put(archivo);
        
        // Obtener URL de descarga
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return {
            url: downloadURL,
            nombre: nombreArchivo,
            nombreOriginal: archivo.name
        };
    } catch (error) {
        console.error('Error al subir archivo a Firebase Storage:', error);
        throw error;
    }
}

// Función para agregar foto a Firebase
async function agregarFotoFirebase(nuevaFoto) {
    try {
        const docRef = await db.collection('fotos').add({
            src: nuevaFoto.src,
            tipo: nuevaFoto.tipo,
            fecha: nuevaFoto.fecha,
            nombre: nuevaFoto.nombre,
            nombreOriginal: nuevaFoto.nombreOriginal || nuevaFoto.nombre,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Agregar el ID al objeto local
        nuevaFoto.id = docRef.id;
        fotos.unshift(nuevaFoto);
        
        console.log('Foto agregada a Firebase con ID:', docRef.id);
        return true;
    } catch (error) {
        console.error('Error al agregar foto a Firebase:', error);
        // Fallback a localStorage
        fotos.push(nuevaFoto);
        localStorage.setItem('fotos', JSON.stringify(fotos));
        return false;
    }
}

// Función para eliminar foto de Firebase
async function eliminarFotoFirebase(index) {
    try {
        const foto = fotos[index];
        if (foto.id) {
            // Eliminar de Firestore
            await db.collection('fotos').doc(foto.id).delete();
            
            // Eliminar archivo de Storage si es una URL de Firebase
            if (foto.src && foto.src.includes('firebase')) {
                try {
                    const storageRef = storage.refFromURL(foto.src);
                    await storageRef.delete();
                } catch (storageError) {
                    console.warn('No se pudo eliminar el archivo de Storage:', storageError);
                }
            }
            
            // Eliminar localmente
            fotos.splice(index, 1);
            
            console.log('Foto eliminada de Firebase');
            return true;
        }
    } catch (error) {
        console.error('Error al eliminar foto de Firebase:', error);
        // Fallback a localStorage
        fotos.splice(index, 1);
        localStorage.setItem('fotos', JSON.stringify(fotos));
        return false;
    }
}

// Función para actualizar la interfaz después de cargar datos
function actualizarInterfaz() {
    // Actualizar galería si existe
    if (typeof actualizarGaleria === 'function') {
        actualizarGaleria();
    }
    
    // Actualizar sueños si existe
    if (typeof cargarSuenos === 'function') {
        cargarSuenos();
    }
}

// Función para sincronizar datos en tiempo real
function configurarSincronizacionTiempoReal() {
    // Escuchar cambios en sueños
    db.collection('suenos').orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const nuevoSueno = { id: change.doc.id, ...change.doc.data() };
                    // Solo agregar si no existe localmente
                    if (!suenos.find(s => s.id === nuevoSueno.id)) {
                        suenos.unshift(nuevoSueno);
                        if (typeof cargarSuenos === 'function') {
                            cargarSuenos();
                        }
                    }
                } else if (change.type === 'modified') {
                    const suenoActualizado = { id: change.doc.id, ...change.doc.data() };
                    const index = suenos.findIndex(s => s.id === suenoActualizado.id);
                    if (index !== -1) {
                        suenos[index] = suenoActualizado;
                        if (typeof cargarSuenos === 'function') {
                            cargarSuenos();
                        }
                    }
                }
            });
        });
    
    // Escuchar cambios en fotos
    db.collection('fotos').orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const nuevaFoto = { id: change.doc.id, ...change.doc.data() };
                    // Solo agregar si no existe localmente
                    if (!fotos.find(f => f.id === nuevaFoto.id)) {
                        fotos.unshift(nuevaFoto);
                        if (typeof actualizarGaleria === 'function') {
                            actualizarGaleria();
                        }
                    }
                }
            });
        });
}

// Inicializar cuando se carga la página
window.addEventListener('load', async () => {
    await inicializarDatos();
    configurarSincronizacionTiempoReal();
});