/**
 * Comunicación con el servidor.
 * Todas las peticiones HTTP del juego.
 */

/**
 * Une al jugador al juego y devuelve su ID.
 * @returns {Promise<string|null>} ID del jugador o null si falla
 * @throws {Error} Si hay error de red (fetch falla)
 */
export async function unirseAlJuego() {
    const res = await fetch("/unirse");
    if (!res.ok) return null;
    return res.text();
}

/**
 * Envía el personaje seleccionado al servidor.
 * @param {string} jugadorId
 * @param {string} nombreNbamon
 * @throws {Error} Si hay error de red
 */
export async function seleccionarPersonaje(jugadorId, nombreNbamon) {
    const res = await fetch(`/nbamon/${jugadorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nbamon: nombreNbamon }),
    });
    if (!res.ok) throw new Error("Error al registrar personaje");
}

/**
 * Envía la posición actual del jugador.
 * @param {string} jugadorId
 * @param {number} x
 * @param {number} y
 * @returns {Promise<{enemigos: Array}>} Lista de enemigos con sus posiciones
 */
export async function enviarPosicion(jugadorId, x, y) {
    const res = await fetch(`/nbamon/${jugadorId}/posicion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y }),
    });
    if (!res.ok) return { enemigos: [] };
    const data = await res.json();
    return data;
}

/**
 * Envía los ataques del jugador.
 * @param {string} jugadorId
 * @param {string[]} ataques
 */
export async function enviarAtaques(jugadorId, ataques) {
    await fetch(`/nbamon/${jugadorId}/ataques`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ataques }),
    });
}

/**
 * Obtiene los ataques del enemigo.
 * @param {string} enemigoId
 * @returns {Promise<string[]|null>} Ataques o null
 */
export async function obtenerAtaquesEnemigo(enemigoId) {
    const res = await fetch(`/nbamon/${enemigoId}/ataques`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.ataques || null;
}
