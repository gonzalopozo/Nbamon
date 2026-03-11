import { describe, expect, it } from "vitest";
import { evaluarRonda, procesarCombate } from "../public/js/game/gameLogic";

describe("evaluarRonda", () => {
    it('returns a win when player 1 do "MATE" and player 2 do "PASE")', () => {
        expect(evaluarRonda("MATE", "PASE")).toBe("GANASTE");
    });

    it('returns a win when player 1 do "TAPÓN" and player 2 do "MATE")', () => {
        expect(evaluarRonda("TAPÓN", "MATE")).toBe("GANASTE");
    });

    it('returns a win when player 1 do "PASE" and player 2 do "TAPÓN")', () => {
        expect(evaluarRonda("PASE", "TAPÓN")).toBe("GANASTE");
    });

    it('returns a lose when player 1 do "PASE" and player 2 do "MATE")', () => {
        expect(evaluarRonda("PASE", "MATE")).toBe("PERDISTE");
    });

    it('returns a lose when player 1 do "MATE" and player 2 do "TAPÓN")', () => {
        expect(evaluarRonda("MATE", "TAPÓN")).toBe("PERDISTE");
    });

    it('returns a lose when player 1 do "TAPÓN" and player 2 do "PASE")', () => {
        expect(evaluarRonda("TAPÓN", "PASE")).toBe("PERDISTE");
    });

    it('returns a tie when player 1 do "MATE" and player 2 do "MATE")', () => {
        expect(evaluarRonda("MATE", "MATE")).toBe("EMPATE");
    });

    it('returns a tie when player 1 do "TAPÓN" and player 2 do "TAPÓN")', () => {
        expect(evaluarRonda("TAPÓN", "TAPÓN")).toBe("EMPATE");
    });

    it('returns a tie when player 1 do "PASE" and player 2 do "PASE")', () => {
        expect(evaluarRonda("PASE", "PASE")).toBe("EMPATE");
    });
});

describe("procesarCombate", () => {
    it("returns a win when player 1 does 3 wins and player 2 does 3 wins", () => {
        const tirosJugador1 = ["MATE", "MATE", "MATE", "TAPÓN", "PASE"];
        const tirosJugador2 = ["PASE", "PASE", "PASE", "PASE", "MATE"];

        expect(procesarCombate(tirosJugador1, tirosJugador2)).toMatchObject({
            mensajeFinal: "¡Victoria! Has ganado el combate.",
        });

        expect(procesarCombate(tirosJugador1, tirosJugador2)).toMatchObject({
            victoriasJugador: 3,
            victoriasEnemigo: 2,
        });
    });

    it("returns a lose when player 1 does 2 wins and player 2 does 3 wins", () => {
        const tirosJugador1 = ["MATE", "MATE", "TAPÓN", "TAPÓN", "MATE"];
        const tirosJugador2 = ["TAPÓN", "TAPÓN", "PASE", "MATE", "PASE"];

        expect(procesarCombate(tirosJugador1, tirosJugador2)).toMatchObject({
            mensajeFinal: "Derrota. Inténtalo de nuevo.",
        });

        expect(procesarCombate(tirosJugador1, tirosJugador2)).toMatchObject({
            victoriasJugador: 2,
            victoriasEnemigo: 3,
        });
    });

    it("returns a tie when player 1 does and player 2 do 5 ties", () => {
        const tirosJugador1 = ["MATE", "TAPÓN", "PASE", "MATE", "TAPÓN"];
        const tirosJugador2 = ["MATE", "TAPÓN", "PASE", "MATE", "TAPÓN"];

        expect(procesarCombate(tirosJugador1, tirosJugador2)).toMatchObject({
            mensajeFinal: "¡Empate!",
        });

        expect(procesarCombate(tirosJugador1, tirosJugador2)).toMatchObject({
            victoriasJugador: 0,
            victoriasEnemigo: 0,
        });
    });
});
