// Contraseña predefinida
const CONTRASENA = "161223";

// Variable para almacenar la contraseña ingresada
let contrasenaIngresada = "";

// Función para agregar números al display
function agregarNumero(numero) {
    const textoCodigo = document.getElementById('texto-codigo');
    const display = document.querySelector('.display');

    // Si el texto actual es "Contraseña", lo limpiamos
    if (textoCodigo.textContent === 'Contraseña') {
        textoCodigo.textContent = '';
    }

    // Agregamos el número al texto (en modo contraseña)
    textoCodigo.textContent += '*'; // Usamos un punto como carácter de contraseña

    // Almacenamos el número real en la variable
    contrasenaIngresada += numero;

    // Añadimos la clase para modo de contraseña
    display.classList.add('modo-password');

    // Validar la clave cuando se ingrese la longitud correcta
    if (contrasenaIngresada.length === CONTRASENA.length) {
        if (contrasenaIngresada === CONTRASENA) {
            mostrarContador(); // Mostrar el contador si la contraseña es correcta
        } else {
            mostrarNotificacion("Contraseña incorrecta. Inténtalo de nuevo.", "error"); // Mostrar un mensaje de error
            textoCodigo.textContent = 'Contraseña'; // Restablecer el texto
            display.classList.remove('modo-password'); // Quitar el modo de contraseña
            contrasenaIngresada = ""; // Reiniciar la contraseña ingresada
        }
    }
}

// Función para borrar el último dígito
function borrarUltimoDigito() {
    const textoCodigo = document.getElementById('texto-codigo');
    const display = document.querySelector('.display');
    
    if (contrasenaIngresada.length > 0) {
        // Eliminar el último carácter de la contraseña
        contrasenaIngresada = contrasenaIngresada.slice(0, -1);
        
        // Actualizar el display
        if (contrasenaIngresada.length === 0) {
            textoCodigo.textContent = 'Contraseña';
            display.classList.remove('modo-password');
        } else {
            textoCodigo.textContent = '*'.repeat(contrasenaIngresada.length);
        }
    }
}

// Función para mostrar el contador y ocultar la caja fuerte
function mostrarContador() {
    const container = document.querySelector('.container');
    const seccionContador = document.getElementById('seccion-contador');

    // Ocultar la caja fuerte
    container.style.display = 'none';

    // Mostrar el contador
    seccionContador.style.display = 'block';
}

// Función para actualizar el contador
function actualizarContador() {
    const fechaInicio = new Date('2023-12-16 22:00:00');
    const ahora = new Date();
    
    // Calcular la diferencia total en milisegundos
    const diferenciaMilisegundos = ahora.getTime() - fechaInicio.getTime();
    
    // Si la fecha actual es anterior a la fecha de inicio, mostrar ceros
    if (diferenciaMilisegundos < 0) {
        document.getElementById('anos').textContent = 0;
        document.getElementById('meses').textContent = 0;
        document.getElementById('dias').textContent = 0;
        document.getElementById('horas').textContent = 0;
        document.getElementById('minutos').textContent = 0;
        document.getElementById('segundos').textContent = 0;
        return;
    }
    
    // Calcular años y meses usando fechas
    let anos = ahora.getFullYear() - fechaInicio.getFullYear();
    let meses = ahora.getMonth() - fechaInicio.getMonth();
    
    // Ajustar si el día actual es menor que el día de inicio
    if (ahora.getDate() < fechaInicio.getDate()) {
        meses--;
    }
    
    // Ajustar años si los meses son negativos
    if (meses < 0) {
        anos--;
        meses += 12;
    }
    
    // Calcular la fecha después de restar años y meses completos
    const fechaAjustada = new Date(fechaInicio);
    fechaAjustada.setFullYear(fechaAjustada.getFullYear() + anos);
    fechaAjustada.setMonth(fechaAjustada.getMonth() + meses);
    
    // Calcular el resto en milisegundos
    const restoMilisegundos = ahora.getTime() - fechaAjustada.getTime();
    
    // Convertir el resto a días, horas, minutos y segundos
    const dias = Math.floor(restoMilisegundos / (1000 * 60 * 60 * 24));
    const horas = Math.floor((restoMilisegundos % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((restoMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((restoMilisegundos % (1000 * 60)) / 1000);
    
    // Actualizar los elementos del DOM
    document.getElementById('anos').textContent = anos;
    document.getElementById('meses').textContent = meses;
    document.getElementById('dias').textContent = dias;
    document.getElementById('horas').textContent = horas;
    document.getElementById('minutos').textContent = minutos;
    document.getElementById('segundos').textContent = segundos;
}

// Actualizar el contador cada segundo
setInterval(actualizarContador, 1000);

// Variables para la paginación de la galería
let paginaActual = 1;
let totalPaginas = 0;

// Función para cambiar de página en la galería
function cambiarPagina(direccion) {
    // Ocultar la página actual
    document.getElementById(`pagina-${paginaActual}`).style.display = 'none';
    
    // Calcular la nueva página
    paginaActual += direccion;
    
    // Verificar límites
    if (paginaActual < 1) {
        paginaActual = 1;
    } else if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }
    
    // Mostrar la nueva página
    document.getElementById(`pagina-${paginaActual}`).style.display = 'grid';
    
    // Actualizar el indicador de página
    document.getElementById('pagina-actual').textContent = paginaActual;
    
    // Actualizar el estado de los botones
    actualizarBotonesPaginacion();
}

// Función para actualizar el estado de los botones de paginación
function actualizarBotonesPaginacion() {
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    
    // Deshabilitar botón anterior si estamos en la primera página
    if (paginaActual === 1) {
        btnAnterior.disabled = true;
        btnAnterior.style.opacity = '0.5';
    } else {
        btnAnterior.disabled = false;
        btnAnterior.style.opacity = '1';
    }
    
    // Deshabilitar botón siguiente si estamos en la última página
    if (paginaActual === totalPaginas) {
        btnSiguiente.disabled = true;
        btnSiguiente.style.opacity = '0.5';
    } else {
        btnSiguiente.disabled = false;
        btnSiguiente.style.opacity = '1';
    }
}

// Función para mostrar el contador
function mostrarContador() {
    const container = document.querySelector('.container');
    const seccionContador = document.getElementById('seccion-contador');
    const seccionGaleria = document.getElementById('seccion-galeria');
    const seccionSuenos = document.getElementById('seccion-suenos');
    const seccionLlenarRelacion = document.getElementById('seccion-llenar-relacion');

    // Ocultar otras secciones
    container.style.display = 'none';
    seccionGaleria.style.display = 'none';
    seccionSuenos.style.display = 'none';
    seccionLlenarRelacion.style.display = 'none';

    // Mostrar el contador
    seccionContador.style.display = 'block';
}

// Función para mostrar la galería de fotos
function mostrarGaleria() {
    const container = document.querySelector('.container');
    const seccionContador = document.getElementById('seccion-contador');
    const seccionGaleria = document.getElementById('seccion-galeria');
    const seccionSuenos = document.getElementById('seccion-suenos');
    const seccionLlenarRelacion = document.getElementById('seccion-llenar-relacion');

    // Ocultar otras secciones
    container.style.display = 'none';
    seccionContador.style.display = 'none';
    seccionSuenos.style.display = 'none';
    seccionLlenarRelacion.style.display = 'none';

    // Mostrar la galería
    seccionGaleria.style.display = 'block';
    
    // Actualizar la galería con las fotos actuales
    actualizarGaleria();
}

// Función para mostrar los sueños
function mostrarSuenos() {
    const container = document.querySelector('.container');
    const seccionContador = document.getElementById('seccion-contador');
    const seccionGaleria = document.getElementById('seccion-galeria');
    const seccionSuenos = document.getElementById('seccion-suenos');
    const seccionLlenarRelacion = document.getElementById('seccion-llenar-relacion');

    // Ocultar otras secciones
    container.style.display = 'none';
    seccionContador.style.display = 'none';
    seccionGaleria.style.display = 'none';
    seccionLlenarRelacion.style.display = 'none';

    // Mostrar los sueños
    seccionSuenos.style.display = 'block';
    
    // Cargar sueños guardados
    cargarSuenos();
}

// Función para mostrar la sección de llenar relación
function mostrarLlenarRelacion() {
    const container = document.querySelector('.container');
    const seccionContador = document.getElementById('seccion-contador');
    const seccionGaleria = document.getElementById('seccion-galeria');
    const seccionSuenos = document.getElementById('seccion-suenos');
    const seccionLlenarRelacion = document.getElementById('seccion-llenar-relacion');

    // Ocultar otras secciones
    container.style.display = 'none';
    seccionContador.style.display = 'none';
    seccionGaleria.style.display = 'none';
    seccionSuenos.style.display = 'none';

    // Mostrar la sección de llenar relación
    seccionLlenarRelacion.style.display = 'block';
}

// Variables para almacenamiento
let suenos = [];
let fotos = [];
let supabaseActivo = false;

// Función para verificar conexión con Supabase
async function verificarSupabase() {
    try {
        console.log('🔍 Verificando conexión con Supabase...');
        
        // Inicializar Supabase usando la función del config
        if (typeof initSupabase === 'function') {
            const inicializado = initSupabase();
            if (!inicializado) {
                console.warn('⚠️ Supabase no pudo inicializarse');
                supabaseActivo = false;
                mostrarNotificacion('Supabase no configurado. Funcionando en modo offline.', 'warning');
                return false;
            }
        } else {
            console.error('❌ Función initSupabase no encontrada');
            supabaseActivo = false;
            mostrarNotificacion('Error de configuración de Supabase', 'error');
            return false;
        }
        
        // Verificar que supabase esté disponible globalmente
        const clienteSupabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (!clienteSupabase) {
            console.error('❌ Cliente de Supabase no disponible');
            supabaseActivo = false;
            mostrarNotificacion('Error: Cliente de Supabase no disponible', 'error');
            return false;
        }
        
        // Intentar una consulta simple para verificar la conexión
        const { data, error } = await clienteSupabase
            .from('suenos')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ Error al conectar con Supabase:', error);
            supabaseActivo = false;
            mostrarNotificacion('Error de conexión con Supabase', 'error');
            return false;
        }
        
        console.log('✅ Conexión con Supabase exitosa');
        supabaseActivo = true;
        mostrarNotificacion('Conectado a la nube', 'success');
        
        // Cargar todos los datos desde Supabase
        await cargarDatosDesdeSupabase();
        
        // Iniciar sincronización automática
        iniciarSincronizacionAutomatica();
        
        return true;
        
    } catch (error) {
        console.error('❌ Error al verificar Supabase:', error);
        supabaseActivo = false;
        mostrarNotificacion('Error de conexión', 'error');
        return false;
    }
}

// Variables para sincronización automática
let intervalSincronizacion = null;
let ultimaActualizacion = new Date();
let contadorSuenos = 0;
let contadorFotos = 0;
let sincronizacionActiva = false;

// Función para recargar datos desde Supabase
async function recargarDatos() {
    if (!supabaseActivo) {
        mostrarNotificacion('❌ Supabase no está disponible', 'error');
        return;
    }
    
    try {
        mostrarNotificacion('🔄 Recargando datos...', 'info');
        await cargarDatosDesdeSupabase();
        mostrarNotificacion('✅ Datos recargados exitosamente', 'success');
    } catch (error) {
        console.error('Error al recargar datos:', error);
        mostrarNotificacion('❌ Error al recargar datos', 'error');
    }
}

// Función para sincronización manual forzada
async function sincronizarManualmente() {
    if (!supabaseActivo) {
        mostrarNotificacion('❌ Supabase no está disponible', 'error');
        return;
    }
    
    try {
        mostrarNotificacion('🔄 Sincronizando manualmente...', 'info');
        
        // Detener sincronización automática temporalmente
        const estabaActiva = sincronizacionActiva;
        sincronizacionActiva = false;
        
        // Forzar verificación de cambios
        await verificarCambios();
        
        // Reactivar sincronización automática si estaba activa
        sincronizacionActiva = estabaActiva;
        
        mostrarNotificacion('✅ Sincronización manual completada', 'success');
    } catch (error) {
        console.error('Error en sincronización manual:', error);
        mostrarNotificacion('❌ Error en sincronización manual', 'error');
    }
}

// Función para verificar cambios en tiempo real
async function verificarCambios() {
    if (!supabaseActivo || !sincronizacionActiva) return;
    
    try {
        // Verificar nuevos sueños
        const { data: suenosData, error: suenosError } = await supabase
            .from('suenos')
            .select('*')
            .order('created_at', { ascending: false });
        
        // Verificar nuevas fotos
        const { data: fotosData, error: fotosError } = await supabase
            .from('fotos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (suenosError || fotosError) {
            console.error('Error al verificar cambios:', suenosError || fotosError);
            return;
        }
        
        const nuevoContadorSuenos = suenosData ? suenosData.length : 0;
        const nuevoContadorFotos = fotosData ? fotosData.length : 0;
        
        // Detectar cambios más eficientemente
        let cambiosDetectados = false;
        
        // Verificar cambios en cantidad
        if (nuevoContadorSuenos !== contadorSuenos || nuevoContadorFotos !== contadorFotos) {
            cambiosDetectados = true;
        }
        
        // Verificar si hay datos más recientes
        if (suenosData && suenosData.length > 0) {
            const ultimoSueno = new Date(suenosData[0].created_at);
            if (ultimoSueno > ultimaActualizacion) {
                cambiosDetectados = true;
            }
        }
        
        if (fotosData && fotosData.length > 0) {
            const ultimaFoto = new Date(fotosData[0].created_at);
            if (ultimaFoto > ultimaActualizacion) {
                cambiosDetectados = true;
            }
        }
        
        if (cambiosDetectados) {
            console.log('🔄 Cambios detectados, recargando datos...');
            mostrarNotificacion('📱 Nuevos datos sincronizados desde otro dispositivo', 'success');
            
            // Actualizar datos locales
            suenos = suenosData ? suenosData.map(s => ({
                texto: s.texto,
                fecha: formatearFecha(new Date(s.created_at)),
                cumplido: s.cumplido,
                fechaCumplido: s.cumplido ? formatearFecha(new Date(s.created_at)) : null,
                id: s.id
            })) : [];
            
            fotos = fotosData ? fotosData.map(f => ({
                nombre: f.nombre,
                url: f.url,
                src: f.url,
                fecha: formatearFecha(new Date(f.created_at)),
                tipo: f.tipo === 'video' ? 'video' : 'imagen',
                id: f.id
            })) : [];
            
            // Actualizar contadores y timestamp
            contadorSuenos = nuevoContadorSuenos;
            contadorFotos = nuevoContadorFotos;
            ultimaActualizacion = new Date();
            
            // Actualizar interfaz
            cargarSuenos();
            actualizarGaleria();
            
            console.log('🔄 Datos sincronizados automáticamente');
        }
        
    } catch (error) {
        console.error('Error en verificación automática:', error);
    }
}

// Función para iniciar sincronización automática
function iniciarSincronizacionAutomatica() {
    if (!supabaseActivo) {
        console.log('⚠️ No se puede iniciar sincronización: Supabase no activo');
        return;
    }
    
    // Limpiar intervalo anterior si existe
    if (intervalSincronizacion) {
        clearInterval(intervalSincronizacion);
    }
    
    sincronizacionActiva = true;
    // Verificar cambios cada 3 segundos para mejor sincronización
    intervalSincronizacion = setInterval(verificarCambios, 3000);
    
    console.log('✅ Sincronización automática iniciada (cada 3 segundos)');
    mostrarNotificacion('🔄 Sincronización automática activada', 'info');
}

// Función para detener sincronización automática
function detenerSincronizacionAutomatica() {
    sincronizacionActiva = false;
    if (intervalSincronizacion) {
        clearInterval(intervalSincronizacion);
        intervalSincronizacion = null;
        console.log('⏹️ Sincronización automática detenida');
        mostrarNotificacion('⏹️ Sincronización automática desactivada', 'warning');
    }
}

window.verificarSupabase = verificarSupabase;
window.recargarDatos = recargarDatos;
window.sincronizarManualmente = sincronizarManualmente;
window.iniciarSincronizacionAutomatica = iniciarSincronizacionAutomatica;
window.detenerSincronizacionAutomatica = detenerSincronizacionAutomatica;

// Cargar datos directamente desde Supabase
async function cargarDatosDesdeSupabase() {
    if (!supabaseActivo) {
        console.log('❌ Supabase no activo');
        return;
    }

    try {
        console.log('🔄 Cargando datos desde Supabase...');
        
        // Obtener datos de Supabase
        const suenosSupabase = await obtenerSuenosSupabase() || [];
        const fotosSupabase = await obtenerFotosSupabase() || [];
        
        console.log(`📊 Datos cargados desde Supabase: ${suenosSupabase.length} sueños, ${fotosSupabase.length} fotos`);
        
        // Asignar datos directamente desde Supabase
        suenos = suenosSupabase.map(s => ({
            texto: s.texto,
            fecha: formatearFecha(new Date(s.created_at)),
            cumplido: s.cumplido,
            fechaCumplido: s.cumplido ? formatearFecha(new Date(s.created_at)) : null,
            id: s.id
        }));
        
        fotos = fotosSupabase.map(f => ({
            nombre: f.nombre,
            url: f.url,
            src: f.url, // Agregar src para compatibilidad con la galería
            fecha: formatearFecha(new Date(f.created_at)),
            tipo: f.tipo === 'video' ? 'video' : 'imagen', // Mapear tipo correctamente
            id: f.id
        }));
        
        // Inicializar contadores y timestamp para sincronización automática
        contadorSuenos = suenos.length;
        contadorFotos = fotos.length;
        ultimaActualizacion = new Date();
        
        console.log(`✅ Datos cargados exitosamente: ${suenos.length} sueños, ${fotos.length} fotos`);
        
        // Actualizar interfaz
        cargarSuenos();
        actualizarGaleria();
        
        mostrarNotificacion('Datos cargados desde la nube', 'success');
        
    } catch (error) {
        console.error('❌ Error al cargar datos desde Supabase:', error);
        mostrarNotificacion('Error al cargar datos desde Supabase', 'error');
    }
}

// Función para cargar sueños
function cargarSuenos() {
    const contenedorSuenos = document.getElementById('contenedor-suenos');
    if (!contenedorSuenos) return;
    
    contenedorSuenos.innerHTML = '';
    
    if (suenos.length === 0) {
        contenedorSuenos.innerHTML = '<p class="mensaje-vacio">Aún no hay sueños compartidos. ¡Agrega el primero!</p>';
        return;
    }
    
    suenos.forEach((sueno, index) => {
        const contenedorSueno = document.createElement('div');
        contenedorSueno.className = `contenedor-sueno ${sueno.cumplido ? 'sueno-cumplido' : ''}`;
        
        const fechaMostrar = sueno.cumplido && sueno.fechaCumplido ? 
            `Cumplido el: ${sueno.fechaCumplido}` : 
            `Creado el: ${sueno.fecha}`;
        
        contenedorSueno.innerHTML = `
            <div class="sueno-header">
                <h3>Sueño ${index + 1} ${sueno.cumplido ? '✓' : ''}</h3>
                <span class="fecha-sueno">${fechaMostrar}</span>
            </div>
            <p class="texto-sueno">${sueno.texto}</p>
            <button class="boton-cumplir ${sueno.cumplido ? 'cumplido' : ''}" 
                    onclick="marcarSuenoCumplido(${index})">
                ${sueno.cumplido ? 'Desmarcar' : 'Cumplir'}
            </button>
        `;
        contenedorSuenos.appendChild(contenedorSueno);
    });
}

// Función para agregar un nuevo sueño
async function agregarSueno() {
    const textoSueno = document.getElementById('input-sueno').value.trim();
    
    if (textoSueno === '') {
        mostrarNotificacion('Por favor, escribe un sueño antes de agregarlo.', 'error');
        return;
    }
    
    if (!supabaseActivo) {
        mostrarNotificacion('Error: Supabase no está conectado', 'error');
        return;
    }
    
    try {
        mostrarNotificacion('Guardando sueño...', 'info');
        
        // Guardar directamente en Supabase
        const resultado = await agregarSuenoSupabase(textoSueno);
        
        if (resultado) {
            // Agregar al array local para actualización inmediata de UI
            const nuevoSueno = {
                texto: textoSueno,
                fecha: new Date().toLocaleDateString('es-ES'),
                cumplido: false,
                fechaCumplido: null,
                id: resultado.id
            };
            
            suenos.push(nuevoSueno);
            document.getElementById('input-sueno').value = '';
            cargarSuenos();
            
            // Actualizar contadores para sincronización
            contadorSuenos = suenos.length;
            ultimaActualizacion = new Date();
            
            mostrarNotificacion('✅ Sueño guardado y sincronizado', 'success');
        } else {
            mostrarNotificacion('Error al guardar el sueño', 'error');
        }
        
    } catch (error) {
        console.error('Error al agregar sueño:', error);
        mostrarNotificacion('Error al guardar el sueño', 'error');
    }
}

// Función para manejar la subida de archivos
async function manejarSubidaArchivo(event) {
    const archivos = event.target.files;
    
    if (archivos.length === 0) {
        return;
    }
    
    if (!supabaseActivo) {
        mostrarNotificacion('Error: Supabase no está conectado', 'error');
        return;
    }
    
    const previewContainer = document.getElementById('preview-multimedia');
    previewContainer.innerHTML = '';
    
    mostrarNotificacion('Subiendo archivos a la nube...', 'info');
    
    for (const archivo of archivos) {
        // Verificar que sea imagen o video
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
        if (!tiposPermitidos.includes(archivo.type)) {
            mostrarNotificacion(`El archivo ${archivo.name} no es un tipo válido. Solo se permiten imágenes y videos.`, 'error');
            continue;
        }
        
        try {
            // Generar nombre único para el archivo
            const timestamp = Date.now();
            const fileName = `${timestamp}_${archivo.name}`;
            
            // Subir directamente a Supabase Storage
            const resultado = await subirFotoSupabase(archivo, fileName);
            
            if (resultado && resultado.url) {
                const nuevaFoto = {
                    tipo: archivo.type.startsWith('image/') ? 'imagen' : 'video',
                    fecha: new Date().toLocaleDateString('es-ES'),
                    nombre: fileName,
                    src: resultado.url,
                    url: resultado.url,
                    id: resultado.id
                };
                
                // Agregar al array local para actualización inmediata de UI
                fotos.push(nuevaFoto);
                
                // Actualizar contadores para sincronización
                contadorFotos = fotos.length;
                ultimaActualizacion = new Date();
                
                // Mostrar preview
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                if (nuevaFoto.tipo === 'imagen') {
                    previewItem.innerHTML = `
                        <img src="${nuevaFoto.src}" alt="Preview">
                        <span class="preview-name">${archivo.name}</span>
                    `;
                } else {
                    previewItem.innerHTML = `
                        <video src="${nuevaFoto.src}" controls preload="metadata"></video>
                        <span class="preview-name">${archivo.name}</span>
                    `;
                }
                
                previewContainer.appendChild(previewItem);
                mostrarNotificacion(`✅ ${archivo.name} subido y sincronizado`, 'success');
                
            } else {
                mostrarNotificacion(`Error al subir ${archivo.name}`, 'error');
            }
            
        } catch (error) {
            console.error('Error al procesar archivo:', error);
            mostrarNotificacion(`Error al subir ${archivo.name}`, 'error');
        }
    }
    
    actualizarGaleria();
    mostrarNotificacion('¡Archivos subidos exitosamente!');
}

// Función auxiliar para convertir archivo a base64
// Función convertirArchivoABase64 eliminada - ya no se usa localStorage

// Función para actualizar la galería con nuevas fotos
function actualizarGaleria() {
    const galeriaContainer = document.querySelector('.galeria-container');
    
    // Limpiar todas las páginas existentes
    galeriaContainer.innerHTML = '';
    
    if (fotos.length === 0) {
        // Si no hay fotos, mostrar mensaje
        galeriaContainer.innerHTML = '<p class="mensaje-vacio">Aún no hay fotos. ¡Agrega la primera desde "Llenar Relación"!</p>';
        totalPaginas = 0;
        document.getElementById('total-paginas').textContent = totalPaginas;
        return;
    }
    
    // Calcular cuántas páginas necesitamos (4 fotos por página)
    const fotosPorPagina = 4;
    const paginasNecesarias = Math.ceil(fotos.length / fotosPorPagina);
    
    // Actualizar el total de páginas
    totalPaginas = paginasNecesarias;
    document.getElementById('total-paginas').textContent = totalPaginas;
    
    // Crear todas las páginas dinámicamente
    let fotoIndex = 0;
    
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        // Crear la página
        const paginaDiv = document.createElement('div');
        paginaDiv.className = 'pagina-fotos';
        paginaDiv.id = `pagina-${pagina}`;
        paginaDiv.style.display = pagina === 1 ? 'grid' : 'none';
        
        // Agregar hasta 4 fotos por página
        for (let i = 0; i < fotosPorPagina && fotoIndex < fotos.length; i++) {
            const foto = fotos[fotoIndex];
            const currentIndex = fotoIndex;
            
            // Crear contenedor para cada elemento
            const contenedorElemento = document.createElement('div');
            contenedorElemento.className = 'elemento-galeria';
            contenedorElemento.style.position = 'relative';
            contenedorElemento.style.cursor = 'pointer';
            
            if (foto.tipo === 'imagen') {
                const img = document.createElement('img');
                img.src = foto.src;
                img.alt = `Foto ${fotoIndex + 1}`;
                img.onclick = () => abrirModal(foto.src, 'imagen', foto.fecha, currentIndex);
                contenedorElemento.appendChild(img);
            } else if (foto.tipo === 'video') {
                const video = document.createElement('video');
                video.src = foto.src;
                video.preload = 'metadata';
                video.style.width = '100%';
                video.style.height = 'auto';
                video.style.maxHeight = '200px';
                video.onclick = () => abrirModal(foto.src, 'video', foto.fecha, currentIndex);
                contenedorElemento.appendChild(video);
            }
            
            // Agregar fecha
            const fechaElemento = document.createElement('span');
            fechaElemento.className = 'fecha-elemento';
            fechaElemento.textContent = formatearFecha(foto.fecha);
            contenedorElemento.appendChild(fechaElemento);
            
            paginaDiv.appendChild(contenedorElemento);
            fotoIndex++;
        }
        
        galeriaContainer.appendChild(paginaDiv);
    }
    
    // Resetear a la primera página
    paginaActual = 1;
    document.getElementById('pagina-actual').textContent = paginaActual;
    
    // Actualizar los botones de paginación
    actualizarBotonesPaginacion();
}

// Habilitar entrada por teclado para la contraseña
document.addEventListener('keydown', function(event) {
    // Solo procesar si estamos en la pantalla de contraseña
    const container = document.querySelector('.container');
    if (container.style.display !== 'none') {
        const tecla = event.key;
        
        // Si es un número del 0-9
        if (tecla >= '0' && tecla <= '9') {
            agregarNumero(tecla);
        }
        // Si es Enter, verificar contraseña
        else if (tecla === 'Enter') {
            verificarContrasena();
        }
        // Si es Backspace, borrar último número
        else if (tecla === 'Backspace') {
            borrarUltimoDigito();
        }
    }
});

// Sistema de notificaciones elegantes
// Variable para controlar timeouts de notificaciones
let timeoutNotificacion = null;

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.getElementById('notificacion');
    const textoNotificacion = document.getElementById('notificacion-texto');
    const icono = notificacion.querySelector('.notificacion-icono svg');
    
    // Limpiar timeout anterior si existe
    if (timeoutNotificacion) {
        clearTimeout(timeoutNotificacion);
        timeoutNotificacion = null;
    }
    
    // Ocultar notificación anterior inmediatamente
    notificacion.classList.remove('mostrar');
    
    // Pequeño delay para permitir que la animación se complete
    setTimeout(() => {
        textoNotificacion.textContent = mensaje;
        
        // Cambiar icono según el tipo
        if (tipo === 'error') {
            icono.innerHTML = '<path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            notificacion.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
        } else if (tipo === 'warning') {
            icono.innerHTML = '<path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            notificacion.style.background = 'linear-gradient(135deg, #ffa726, #ff9800)';
        } else if (tipo === 'info') {
            icono.innerHTML = '<path d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            notificacion.style.background = 'linear-gradient(135deg, #42a5f5, #1e88e5)';
        } else {
            icono.innerHTML = '<path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>';
            notificacion.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        
        notificacion.classList.add('mostrar');
        
        // Configurar nuevo timeout
        timeoutNotificacion = setTimeout(() => {
            notificacion.classList.remove('mostrar');
            timeoutNotificacion = null;
        }, 3000);
    }, 100);
}

// Modal para ampliar imágenes y videos
let mediaActualIndex = -1;

function abrirModal(src, tipo, fecha, index) {
    const modal = document.getElementById('modal-media');
    const modalImagen = document.getElementById('modal-imagen');
    const modalVideo = document.getElementById('modal-video');
    const modalFecha = document.getElementById('modal-fecha');
    const modalEliminar = document.getElementById('modal-eliminar');
    
    mediaActualIndex = index;
    
    if (tipo === 'video') {
        modalImagen.style.display = 'none';
        modalVideo.style.display = 'block';
        
        // Limpiar eventos anteriores
        modalVideo.removeEventListener('loadedmetadata', videoLoadedHandler);
        modalVideo.removeEventListener('error', videoErrorHandler);
        
        modalVideo.src = src;
        modalVideo.controls = true;
        modalVideo.preload = 'metadata';
        modalVideo.muted = false;
        modalVideo.autoplay = false;
        
        // Definir handlers para reutilizar
        function videoLoadedHandler() {
            console.log('Video cargado correctamente:', src);
            mostrarNotificacion('Video cargado correctamente', 'success');
        }
        
        function videoErrorHandler(e) {
            console.error('Error al cargar el video:', e);
            console.error('Código de error:', modalVideo.error ? modalVideo.error.code : 'Desconocido');
            mostrarNotificacion('Error al reproducir el video. Formato no compatible.', 'error');
        }
        
        // Agregar event listeners
        modalVideo.addEventListener('loadedmetadata', videoLoadedHandler);
        modalVideo.addEventListener('error', videoErrorHandler);
        
        modalVideo.load();
    } else {
        modalVideo.style.display = 'none';
        modalImagen.style.display = 'block';
        modalImagen.src = src;
    }
    
    modalFecha.textContent = `Subido el: ${fecha}`;
    modal.style.display = 'block';
    
    // Event listener para eliminar
    modalEliminar.onclick = function() {
        eliminarFoto(index);
    };
}

function cerrarModal() {
    const modal = document.getElementById('modal-media');
    const modalVideo = document.getElementById('modal-video');
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = '';
    mediaActualIndex = -1;
}

// Función para eliminar fotos
function eliminarFoto(index) {
    // Crear modal de confirmación personalizado
    const modalConfirmacion = document.createElement('div');
    modalConfirmacion.className = 'modal-confirmacion';
    modalConfirmacion.innerHTML = `
        <div class="confirmacion-contenido">
            <h3>¿Estás seguro de que quieres eliminar esta foto/video?</h3>
            <div class="confirmacion-botones">
                <button class="boton-cancelar" onclick="cerrarConfirmacion()">Cancelar</button>
                <button class="boton-aceptar" onclick="confirmarEliminacion(${index})">Aceptar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalConfirmacion);
    
    // Funciones para manejar la confirmación
    window.cerrarConfirmacion = function() {
        document.body.removeChild(modalConfirmacion);
    };
    
    window.confirmarEliminacion = async function(idx) {
        try {
            // Intentar eliminar de Supabase primero
            if (supabaseActivo && fotos[idx].id && fotos[idx].nombre) {
                const resultado = await eliminarFotoSupabase(fotos[idx].id, fotos[idx].nombre);
                if (resultado) {
                    mostrarNotificacion('Foto/video eliminado y sincronizado.');
                } else {
                    mostrarNotificacion('Foto/video eliminado localmente (sin sincronizar)', 'warning');
                }
            }
            
            // Eliminar del array local
            fotos.splice(idx, 1);
            
            if (!supabaseActivo) {
                mostrarNotificacion('Foto/video eliminado exitosamente.');
            }
            
            actualizarGaleria();
            cerrarModal();
            
            // Sincronizar inmediatamente después de eliminar
            if (supabaseActivo) {
                setTimeout(() => cargarDatosDesdeSupabase(), 1000);
            }
            
        } catch (error) {
            console.error('Error al eliminar foto:', error);
            // Eliminar solo localmente si falla Supabase
            fotos.splice(idx, 1);
            mostrarNotificacion('Foto/video eliminado localmente (error de sincronización)', 'warning');
            actualizarGaleria();
            cerrarModal();
            
            // Sincronizar para verificar estado actual
            if (supabaseActivo) {
                setTimeout(() => cargarDatosDesdeSupabase(), 1000);
            }
        }
        
        document.body.removeChild(modalConfirmacion);
    };
}

// Función para marcar sueños como cumplidos
async function marcarSuenoCumplido(index) {
    const nuevoEstado = !suenos[index].cumplido;
    const fechaCumplido = nuevoEstado ? new Date().toLocaleDateString() : null;
    
    try {
        // Intentar actualizar en Supabase primero
        if (supabaseActivo && suenos[index].id) {
            const resultado = await actualizarSuenoSupabase(suenos[index].id, nuevoEstado);
            if (resultado) {
                const mensaje = nuevoEstado ? '¡Sueño marcado como cumplido y sincronizado!' : 'Sueño desmarcado y sincronizado';
                mostrarNotificacion(mensaje);
            } else {
                mostrarNotificacion('Estado actualizado localmente (sin sincronizar)', 'warning');
            }
        }
        
        // Actualizar localmente
        suenos[index].cumplido = nuevoEstado;
        suenos[index].fechaCumplido = fechaCumplido;
        
        cargarSuenos();
        
        if (!supabaseActivo) {
            const mensaje = nuevoEstado ? '¡Sueño marcado como cumplido!' : 'Sueño desmarcado';
            mostrarNotificacion(mensaje);
        }
        
    } catch (error) {
        console.error('Error al actualizar sueño:', error);
        // Actualizar solo localmente si falla Supabase
        suenos[index].cumplido = nuevoEstado;
        suenos[index].fechaCumplido = fechaCumplido;
        cargarSuenos();
        mostrarNotificacion('Estado actualizado localmente (error de sincronización)', 'warning');
    }
}

// Función para formatear fecha
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Inicializar la paginación cuando se carga la página
window.addEventListener('load', function() {
    // Verificar y configurar Supabase
    verificarSupabase();
    
    actualizarBotonesPaginacion();
    // No cargar datos locales aquí - verificarSupabase ya maneja la sincronización
    // cargarSuenos() y actualizarGaleria() se llaman desde cargarDatosDesdeSupabase()
    
    // Agregar event listener para el input de archivos
    const inputMultimedia = document.getElementById('input-multimedia');
    if (inputMultimedia) {
        inputMultimedia.addEventListener('change', manejarSubidaArchivo);
    }
    
    // Event listeners para el modal
    const modalCerrar = document.querySelector('.modal-cerrar');
    const modal = document.getElementById('modal-media');
    
    modalCerrar.onclick = cerrarModal;
    
    window.onclick = function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    };
});

