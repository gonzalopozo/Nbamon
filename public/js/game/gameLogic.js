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
        ([jugador, enemigo]) =>
            tiroJugador === jugador && tiroEnemigo === enemigo,
    );
}

/**
 * Evalúa una ronda de combate.
 * @public
 * @param {string} tiroJugador
 * @param {string} tiroEnemigo
 * @returns {string} Clave de traducción: "combat.roundDraw" | "combat.roundWin" | "combat.roundLose"
 */
export function evaluarRonda(tiroJugador, tiroEnemigo) {
    if (tiroJugador === tiroEnemigo) return "combat.roundDraw";
    return ganaJugador(tiroJugador, tiroEnemigo)
        ? "combat.roundWin"
        : "combat.roundLose";
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

        if (resultado === "combat.roundWin") victoriasJugador++;
        else if (resultado === "combat.roundLose") victoriasEnemigo++;
    }

    let mensajeFinal;
    if (victoriasJugador === victoriasEnemigo) {
        mensajeFinal = "combat.tie";
    } else if (victoriasJugador > victoriasEnemigo) {
        mensajeFinal = "combat.victory";
    } else {
        mensajeFinal = "combat.defeat";
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
