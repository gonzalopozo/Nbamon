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
    spanVictoriasJugador: "victorias-jugador-count",
    spanVictoriasEnemigo: "victorias-enemigo-count",
    sectionMensajes: "resultado",
    tiroDelJugador: "tiro-del-jugador",
    tiroDelEnemigo: "tiro-del-enemigo",
    contenedorTarjetas: "contenedorTarjetas",
    contenedorTiros: "contenedorTiros",
    sectionVerMapa: "ver-mapa",
    mapa: "mapa",
    srAnnouncer: "sr-announcer",
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
 * TODO: comentarios en un solo idioma
 * Muestra/oculta secciones. Moves focus to the section heading for a11y.
 */
export function mostrarSeccion(id) {
    const el = refs[id];
    if (!el) return;
    el.style.setProperty("display", "flex");

    const heading = el.querySelector(".titulo");
    if (heading) {
        if (!heading.hasAttribute("tabindex")) {
            heading.setAttribute("tabindex", "-1");
        }
        heading.focus();
    }
}

export function ocultarSeccion(id) {
    refs[id]?.style?.setProperty("display", "none");
}

function mostrarBloque(id) {
    refs[id]?.style?.setProperty("display", "block");
}

/**
 * Renderiza las tarjetas de selección de jugadores.
 * @param {Object[]} nbamones
 */
export function renderizarTarjetasJugadores(nbamones) {
    const contenedor = refs.contenedorTarjetas;
    if (!contenedor) return;

    contenedor.innerHTML =
        `<div role="radiogroup" aria-label="" data-i18n-aria-label="selectPlayer.subtitle">` +
        nbamones
            .map(
                (nbamon) => `
		<div class="tarjeta-de-jugador" role="radio" aria-checked="false" tabindex="0" data-jugador="${escapeHtml(nbamon.nombre)}" data-equipo="${escapeHtml(nbamon.equipo)}">
			<p>${escapeHtml(nbamon.nombre)}</p>
			<img src="${escapeHtml(nbamon.foto)}" alt="${escapeHtml(nbamon.nombre)}">
		</div>
	`,
            )
            .join("") +
        `</div>`;
}

/**
 * Obtiene el jugador seleccionado por el usuario.
 * @param {Object[]} nbamones
 * @returns {Object|null} Nbamon seleccionado o null
 */
export function obtenerJugadorSeleccionado(nbamones) {
    const card = document.querySelector(
        '.tarjeta-de-jugador[aria-checked="true"]',
    );
    if (!card) return null;
    return nbamones.find((n) => n.nombre === card.dataset.jugador) ?? null;
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
    if (refs.spanJugadorJugador) {
        nombreJugador === "Giannis Antetokoumpo"
            ? (refs.spanJugadorJugador.textContent = "Giannis")
            : (refs.spanJugadorJugador.textContent = nombreJugador);
    }
    if (refs.spanJugadorEnemigo) {
        nombreEnemigo === "Giannis Antetokoumpo"
            ? (refs.spanJugadorEnemigo.textContent = "Giannis")
            : (refs.spanJugadorEnemigo.textContent = nombreEnemigo);
    }
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
 * @param {string} chooseShotText - Texto para "Elige tu tiro" (traducido)
 */
export function resetearPantallaCombate(chooseShotText) {
    if (refs.sectionMensajes) refs.sectionMensajes.textContent = chooseShotText;
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
 * Announces a message to screen readers via the sr-announcer live region.
 * @param {string} message - Already-translated text to announce
 * @param {"polite"|"assertive"} [priority="polite"]
 */
export function announce(message, priority = "polite") {
    const el = refs.srAnnouncer || document.getElementById("sr-announcer");
    if (!el) return;
    el.setAttribute("aria-live", priority);
    el.textContent = "";
    requestAnimationFrame(() => {
        el.textContent = message;
    });
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
