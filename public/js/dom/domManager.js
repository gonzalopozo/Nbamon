/**
 * Manejo del DOM: referencias, actualización de UI, creación de elementos.
 */

const SELECTORES = {
    sectionBienvenida: "bienvenida",
    botonJugar: "boton-jugar",
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

export function getRefs() {
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
		<input type="radio" name="jugador" id="${nbamon.nombre}">
		<label class="tarjeta-de-jugador" for="${nbamon.nombre}">
			<p id="${nbamon.equipo}">${nbamon.nombre}</p>
			<img src="${nbamon.foto}" alt="${nbamon.nombre}">
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
                `<button id="${t.id}" class="boton-de-tiro BTiro">${t.nombre}</button>`,
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
    if (refs.spanJugadorJugador) refs.spanJugadorJugador.textContent = nombreJugador;
    if (refs.spanJugadorEnemigo) refs.spanJugadorEnemigo.textContent = nombreEnemigo;
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
 * Obtiene el canvas del mapa.
 */
export function getCanvas() {
    return refs.mapa;
}
