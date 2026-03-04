/**
 * Gestión del estado del juego.
 * Centraliza todas las variables que antes eran globales.
 */

export function crearEstadoInicial() {
    return {
        // Identificadores
        jugadorId: null,
        enemigoId: null,

        // Personajes
        nbamones: [],
        nbamonesEnemigos: [],
        personajeSeleccionado: null,
        personajeSeleccionadoObjeto: null,

        // Combate
        tirosJugador: [],
        tirosEnemigo: [],
        victoriasJugador: 0,
        victoriasEnemigo: 0,

        // UI
        botonesTiro: [],

        // Canvas
        intervaloCanvas: null,
        intervaloPolling: null,
    };
}
