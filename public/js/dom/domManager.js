/**
 * Manejo del DOM: referencias, actualización de UI, creación de elementos.
 */

function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const SELECTORES = {
    sectionBienvenida: "bienvenida",
    botonJugar: "boton-jugar",
    mensajeValidacion: "mensaje-validacion",
    estadoConexion: "estado-conexion",
    estadoBienvenida: "estado-bienvenida",
    sectionSeleccionarTiro: "seleccionar-tiro",
    sectionReiniciar: "reiniciar",
    botonJugador: "boton-jugador",
    botonReiniciar: "boton-reiniciar",
    sectionSeleccionarJugador: "seleccionar-jugador",
    spanJugadorJugador: "jugador-jugador",
    spanJugadorEnemigo: "jugador-enemigo",
    spanVictoriasJugador: "victorias-jugador",
    spanVictoriasEnemigo: "victorias-enemigo",
    sectionMensajes: "resultado",
    tiroDelJugador: "tiro-del-jugador",
    tiroDelEnemigo: "tiro-del-enemigo",
    contenedorTarjetas: "contenedorTarjetas",
    contenedorTiros: "contenedorTiros",
    sectionVerMapa: "ver-mapa",
    mapa: "mapa",
};

/** Cache de referencias DOM (se inicializa en init) */
let refs = {};

/**
 * Inicializa las referencias DOM. Debe llamarse cuando el DOM está listo.
 */
export function initRefs() {
    refs = {};
    for (const [key, id] of Object.entries(SELECTORES)) {
        refs[key] = document.getElementById(id);
    }
    return refs;
}

/**
 * Muestra/oculta secciones.
 */
export function mostrarSeccion(id) {
    refs[id]?.style?.setProperty("display", "flex");
}

export function ocultarSeccion(id) {
    refs[id]?.style?.setProperty("display", "none");
}

export function mostrarBloque(id) {
    refs[id]?.style?.setProperty("display", "block");
}

/**
 * Renderiza las tarjetas de selección de jugadores.
 * @param {Object[]} nbamones
 */
export function renderizarTarjetasJugadores(nbamones) {
    const contenedor = refs.contenedorTarjetas;
    if (!contenedor) return;

    contenedor.innerHTML = nbamones
        .map(
            (nbamon) => `
		<input type="radio" name="jugador" id="${escapeHtml(nbamon.nombre)}">
		<label class="tarjeta-de-jugador" for="${escapeHtml(nbamon.nombre)}">
			<p id="${escapeHtml(nbamon.equipo)}">${escapeHtml(nbamon.nombre)}</p>
			<img src="${escapeHtml(nbamon.foto)}" alt="${escapeHtml(nbamon.nombre)}">
		</label>
	`,
        )
        .join("");
}

/**
 * Obtiene el jugador seleccionado por el usuario.
 * @param {Object[]} nbamones
 * @returns {Object|null} Nbamon seleccionado o null
 */
export function obtenerJugadorSeleccionado(nbamones) {
    const radio = document.querySelector('input[name="jugador"]:checked');
    if (!radio) return null;
    return nbamones.find((n) => n.nombre === radio.id) ?? null;
}

/**
 * Renderiza los botones de tiro del personaje.
 * @param {Object[]} tiros - Array de {nombre, id}
 */
export function renderizarBotonesTiro(tiros) {
    const contenedor = refs.contenedorTiros;
    if (!contenedor) return;

    contenedor.innerHTML = tiros
        .map(
            (t) =>
                `<button id="${escapeHtml(t.id)}" class="boton-de-tiro BTiro">${escapeHtml(t.nombre)}</button>`,
        )
        .join("");
}

/**
 * Obtiene los botones de tiro tras renderizarlos.
 */
export function obtenerBotonesTiro() {
    return document.querySelectorAll(".BTiro");
}

/**
 * Actualiza el texto del jugador local y enemigo.
 */
export function actualizarNombresJugadores(nombreJugador, nombreEnemigo) {
    if (refs.spanJugadorJugador)
        refs.spanJugadorJugador.textContent = nombreJugador;
    if (refs.spanJugadorEnemigo)
        refs.spanJugadorEnemigo.textContent = nombreEnemigo;
}

/**
 * Actualiza el contador de victorias.
 */
export function actualizarVictorias(victoriasJugador, victoriasEnemigo) {
    if (refs.spanVictoriasJugador)
        refs.spanVictoriasJugador.textContent = victoriasJugador;
    if (refs.spanVictoriasEnemigo)
        refs.spanVictoriasEnemigo.textContent = victoriasEnemigo;
}

/**
 * Muestra el resultado de una ronda y añade los tiros a la lista.
 */
export function mostrarRonda(resultado, tiroJugador, tiroEnemigo) {
    if (refs.sectionMensajes) refs.sectionMensajes.textContent = resultado;

    const pJ = document.createElement("p");
    pJ.textContent = tiroJugador;
    refs.tiroDelJugador?.appendChild(pJ);

    const pE = document.createElement("p");
    pE.textContent = tiroEnemigo;
    refs.tiroDelEnemigo?.appendChild(pE);
}

/**
 * Muestra el mensaje final y el botón de reiniciar.
 */
export function mostrarMensajeFinal(mensaje) {
    if (refs.sectionMensajes) refs.sectionMensajes.textContent = mensaje;
    mostrarBloque("sectionReiniciar");
}

/**
 * Resetea la pantalla de combate para volver a jugar (sin recargar).
 */
export function resetearPantallaCombate() {
    if (refs.sectionMensajes)
        refs.sectionMensajes.textContent = "¡Elige tu tiro!";
    refs.sectionReiniciar?.style?.setProperty("display", "none");
    if (refs.tiroDelJugador) refs.tiroDelJugador.textContent = "";
    if (refs.tiroDelEnemigo) refs.tiroDelEnemigo.textContent = "";
    if (refs.spanVictoriasJugador) refs.spanVictoriasJugador.textContent = "0";
    if (refs.spanVictoriasEnemigo) refs.spanVictoriasEnemigo.textContent = "0";
}

/**
 * Obtiene el canvas del mapa.
 */
export function getCanvas() {
    return refs.mapa;
}

/**
 * Muestra u oculta mensaje de validación (reemplazo de alert).
 * @param {string} mensaje - Texto a mostrar, o "" para ocultar
 */
export function mostrarMensajeValidacion(mensaje) {
    const el =
        refs.mensajeValidacion || document.getElementById("mensaje-validacion");
    if (el) el.textContent = mensaje;
}

/**
 * Actualiza el estado de conexión en el mapa (ej. "Buscando oponente...").
 * @param {string} texto - Texto a mostrar, o "" para ocultar
 * @param {boolean} [loading] - Si true, añade clase loading (spinner)
 */
export function actualizarEstadoConexion(texto, loading = false) {
    const el =
        refs.estadoConexion || document.getElementById("estado-conexion");
    if (!el) return;
    el.textContent = texto;
    el.classList.toggle("loading", loading);
}

/**
 * Actualiza el estado en la pantalla de bienvenida (ej. "Conectando...", error).
 * @param {string} texto - Texto a mostrar, o "" para ocultar
 * @param {boolean} [loading] - Si true, añade clase loading (spinner)
 * @param {boolean} [error] - Si true, aplica estilo de error
 */
export function actualizarEstadoBienvenida(
    texto,
    loading = false,
    error = false,
) {
    const el =
        refs.estadoBienvenida || document.getElementById("estado-bienvenida");
    if (!el) return;
    el.textContent = texto;
    el.classList.toggle("loading", loading);
    el.classList.toggle("mensaje-error", error);
}
