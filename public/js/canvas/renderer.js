/**
 * Renderizado del canvas y lógica de movimiento.
 */

import { crearNbamonDesdeEnemigo } from "../data/players.js";
import { MAPA, TIEMPOS } from "../config/constants.js";

const mapaBackground = new Image();
mapaBackground.src = "./assets/nbamap.png";

/**
 * Calcula dimensiones del mapa según el viewport.
 * Respeta la altura disponible para evitar scroll.
 * @param {number} [maxAlto] - Altura máxima disponible (opcional)
 */
export function calcularDimensionesMapa(maxAlto) {
    let ancho = window.innerWidth - 20;
    if (ancho > MAPA.ANCHO_MAXIMO) ancho = MAPA.ANCHO_MAXIMO - 20;
    let alto = (ancho * MAPA.PROPORCION_ALTO) | 0;

    const altoDisponible = maxAlto ?? window.innerHeight - 220;
    if (alto > altoDisponible) {
        const escala = altoDisponible / alto;
        ancho = (ancho * escala) | 0;
        alto = (alto * escala) | 0;
    }
    return { ancho, alto };
}

/**
 * Configura el canvas con las dimensiones dadas.
 * @param {HTMLCanvasElement} canvas
 * @param {number} ancho
 * @param {number} alto
 */
export function configurarCanvas(canvas, ancho, alto) {
    canvas.width = ancho;
    canvas.height = alto;
}

/**
 * Obtiene el contexto 2D del canvas.
 */
export function obtenerContexto(canvas) {
    return canvas.getContext("2d");
}

/**
 * Pinta un frame del mapa: fondo, jugador y enemigos.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {Object} personajeJugador - Nbamon del jugador
 * @param {Object[]} enemigos - Nbamons enemigos
 * @param {Function} onPosicionEnviada - callback para enviar posición (x, y)
 */
export function pintarFrame(
    ctx,
    canvas,
    personajeJugador,
    enemigos,
    onPosicionEnviada,
) {
    if (!personajeJugador) return;

    const wrapper = document.querySelector("#ver-mapa .canvas-wrapper");
    const altoDisponible = wrapper?.clientHeight ?? window.innerHeight - 340;
    const { ancho, alto } = calcularDimensionesMapa(altoDisponible);

    if (personajeJugador.x + personajeJugador.velocidadX >= ancho - 35) return;
    if (personajeJugador.x + personajeJugador.velocidadX <= 0) return;
    if (personajeJugador.y + personajeJugador.velocidadY >= alto - 60) return;
    if (personajeJugador.y + personajeJugador.velocidadY <= 0) return;

    personajeJugador.x += personajeJugador.velocidadX;
    personajeJugador.y += personajeJugador.velocidadY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapaBackground, 0, 0, canvas.width, canvas.height);

    personajeJugador.pintarNbamon(ctx);

    onPosicionEnviada(personajeJugador.x, personajeJugador.y);

    enemigos.forEach((nbamon) => {
        nbamon.pintarNbamon(ctx);
    });
}

/**
 * Convierte la respuesta del servidor (enemigos) en Nbamons para renderizar.
 * @param {Array} enemigos - respuesta de /posicion
 * @returns {Object[]} Nbamons con posiciones actualizadas
 */
export function parsearEnemigos(enemigos) {
    if (!Array.isArray(enemigos)) return [];

    return enemigos
        .filter((e) => e?.nbamon)
        .map((e) => crearNbamonDesdeEnemigo(e))
        .filter(Boolean);
}

/**
 * Detecta colisión entre el jugador y un enemigo (con margen para el sprite).
 */
export function hayColision(jugador, enemigo) {
    const margen = 25;
    const arribaJ = jugador.y + margen;
    const abajoJ = jugador.y + jugador.alto - margen;
    const derechaJ = jugador.x + jugador.ancho - margen;
    const izquierdaJ = jugador.x + margen;

    const arribaE = enemigo.y;
    const abajoE = enemigo.y + enemigo.alto;
    const derechaE = enemigo.x + enemigo.ancho;
    const izquierdaE = enemigo.x;

    return !(
        abajoJ < arribaE ||
        arribaJ > abajoE ||
        derechaJ < izquierdaE ||
        izquierdaJ > derechaE
    );
}

export { TIEMPOS };
