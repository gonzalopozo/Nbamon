/**
 * Lógica del juego: combate, victorias, reglas piedra-papel-tijeras.
 */

const GANA_JUGADOR = [
    ["MATE", "PASE"],
    ["TAPÓN", "MATE"],
    ["PASE", "TAPÓN"],
];

function ganaJugador(tiroJugador, tiroEnemigo) {
    return GANA_JUGADOR.some(
        ([jugador, enemigo]) => tiroJugador === jugador && tiroEnemigo === enemigo,
    );
}

/**
 * Evalúa una ronda de combate.
 * @param {string} tiroJugador
 * @param {string} tiroEnemigo
 * @returns {"EMPATE"|"GANASTE"|"PERDISTE"}
 */
export function evaluarRonda(tiroJugador, tiroEnemigo) {
    if (tiroJugador === tiroEnemigo) return "EMPATE";
    return ganaJugador(tiroJugador, tiroEnemigo) ? "GANASTE" : "PERDISTE";
}

/**
 * Procesa todas las rondas y devuelve el resultado.
 * @param {string[]} tirosJugador
 * @param {string[]} tirosEnemigo
 * @returns {{ rondas: Array<{resultado, tiroJugador, tiroEnemigo}>, victoriasJugador: number, victoriasEnemigo: number, mensajeFinal: string }}
 */
export function procesarCombate(tirosJugador, tirosEnemigo) {
    let victoriasJugador = 0;
    let victoriasEnemigo = 0;
    const rondas = [];

    for (let i = 0; i < tirosJugador.length; i++) {
        const tiroJ = tirosJugador[i];
        const tiroE = tirosEnemigo[i];
        const resultado = evaluarRonda(tiroJ, tiroE);

        rondas.push({ resultado, tiroJugador: tiroJ, tiroEnemigo: tiroE });

        if (resultado === "GANASTE") victoriasJugador++;
        else if (resultado === "PERDISTE") victoriasEnemigo++;
    }

    let mensajeFinal;
    if (victoriasJugador === victoriasEnemigo) {
        mensajeFinal = "¡Empate!";
    } else if (victoriasJugador > victoriasEnemigo) {
        mensajeFinal = "¡Victoria! Has ganado el combate.";
    } else {
        mensajeFinal = "Derrota. Inténtalo de nuevo.";
    }

    return {
        rondas,
        victoriasJugador,
        victoriasEnemigo,
        mensajeFinal,
    };
}

/**
 * Mapea emoji del botón al nombre del tiro.
 * @param {string} emoji
 * @returns {string} "MATE" | "TAPÓN" | "PASE"
 */
export function emojiATiro(emoji) {
    const mapa = { "⛹️": "MATE", "🛡️": "TAPÓN", "👐": "PASE" };
    return mapa[emoji] ?? "PASE";
}
