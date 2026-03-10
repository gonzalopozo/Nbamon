/**
 * Gestión del estado del juego.
 * Centraliza todas las variables que antes eran globales.
 */

export function crearEstadoInicial() {
    return {
        // Identificadores
        jugadorId: null,
        enemigoId: null,
        botId: null,

        // Personajes
        nbamones: [],
        nbamonesEnemigos: [],
        personajeSeleccionado: null,
        personajeSeleccionadoObjeto: null,
        personajeSeleccionadoBotObjeto: null,

        // Combate
        tirosJugador: [],
        tirosEnemigo: [],
        tirosBot: [],
        victoriasJugador: 0,
        victoriasEnemigo: 0,
        victoriasBot: 0,

        // UI
        botonesTiro: [],

        // Canvas
        intervaloCanvas: null,
        intervaloPolling: null,
    };
}
