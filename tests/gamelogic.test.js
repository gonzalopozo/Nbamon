import { describe, expect, it } from "vitest";
import {
    evaluarRonda,
    procesarCombate,
    emojiATiro,
} from "../public/js/game/gameLogic";

describe("evaluarRonda", () => {
    it('returns a win when player 1 does "MATE" and player 2 does "PASE"', () => {
        expect(evaluarRonda("MATE", "PASE")).toBe("GANASTE");
    });

    it('returns a win when player 1 does "TAPÓN" and player 2 does "MATE"', () => {
        expect(evaluarRonda("TAPÓN", "MATE")).toBe("GANASTE");
    });

    it('returns a win when player 1 does "PASE" and player 2 does "TAPÓN"', () => {
        expect(evaluarRonda("PASE", "TAPÓN")).toBe("GANASTE");
    });

    it('returns a loss when player 1 does "PASE" and player 2 does "MATE"', () => {
        expect(evaluarRonda("PASE", "MATE")).toBe("PERDISTE");
    });

    it('returns a loss when player 1 does "MATE" and player 2 does "TAPÓN"', () => {
        expect(evaluarRonda("MATE", "TAPÓN")).toBe("PERDISTE");
    });

    it('returns a loss when player 1 does "TAPÓN" and player 2 does "PASE"', () => {
        expect(evaluarRonda("TAPÓN", "PASE")).toBe("PERDISTE");
    });

    it('returns a tie when player 1 does "MATE" and player 2 does "MATE"', () => {
        expect(evaluarRonda("MATE", "MATE")).toBe("EMPATE");
    });

    it('returns a tie when player 1 does "TAPÓN" and player 2 does "TAPÓN"', () => {
        expect(evaluarRonda("TAPÓN", "TAPÓN")).toBe("EMPATE");
    });

    it('returns a tie when player 1 does "PASE" and player 2 does "PASE"', () => {
        expect(evaluarRonda("PASE", "PASE")).toBe("EMPATE");
    });
});

describe("procesarCombate", () => {
    it("returns a win when player 1 gets 3 wins and player 2 gets 2 wins", () => {
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

    it("returns a loss when player 1 gets 2 wins and player 2 gets 3 wins", () => {
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

    it("returns a tie when both players get 5 ties", () => {
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

describe("emojiATiro", () => {
    it("returns 'MATE' with a ⛹️", () => {
        expect(emojiATiro("⛹️")).toBe("MATE");
    });

    it("returns 'TAPÓN' with a 🛡️", () => {
        expect(emojiATiro("🛡️")).toBe("TAPÓN");
    });

    it("returns 'PASE' with a 👐", () => {
        expect(emojiATiro("👐")).toBe("PASE");
    });

    it("returns 'PASE' with a random emoji", () => {
        expect(emojiATiro("😵")).toBe("PASE");
    });
});
