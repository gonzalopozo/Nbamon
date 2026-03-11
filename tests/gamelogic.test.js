import { describe, expect, it } from 'vitest'
import { evaluarRonda } from '../public/js/game/gameLogic'

describe("evaluarRonda", () => {
    it('returns a win when player 1 do "MATE" and player 2 do "PASE")', () => {
        const resultado = evaluarRonda("MATE", "PASE");

        expect(resultado).toBe("GANASTE");
    })

    it('returns a win when player 1 do "TAPÓN" and player 2 do "MATE")', () => {
        const resultado = evaluarRonda("TAPÓN", "MATE");

        expect(resultado).toBe("GANASTE");
    })

    it('returns a win when player 1 do "PASE" and player 2 do "TAPÓN")', () => {
        const resultado = evaluarRonda("PASE", "TAPÓN");

        expect(resultado).toBe("GANASTE");
    })

    it('returns a lose when player 1 do "PASE" and player 2 do "MATE")', () => {
        const resultado = evaluarRonda("PASE", "MATE");

        expect(resultado).toBe("PERDISTE");
    })

    it('returns a lose when player 1 do "MATE" and player 2 do "TAPÓN")', () => {
        const resultado = evaluarRonda("MATE", "TAPÓN");

        expect(resultado).toBe("PERDISTE");
    })

    it('returns a lose when player 1 do "TAPÓN" and player 2 do "PASE")', () => {
        const resultado = evaluarRonda("TAPÓN", "PASE");

        expect(resultado).toBe("PERDISTE");
    })

    it('returns a tie when player 1 do "MATE" and player 2 do "MATE")', () => {
        const resultado = evaluarRonda("MATE", "MATE");

        expect(resultado).toBe("EMPATE");
    })

    it('returns a tie when player 1 do "TAPÓN" and player 2 do "TAPÓN")', () => {
        const resultado = evaluarRonda("TAPÓN", "TAPÓN");

        expect(resultado).toBe("EMPATE");
    })

    it('returns a tie when player 1 do "PASE" and player 2 do "PASE")', () => {
        const resultado = evaluarRonda("PASE", "PASE");

        expect(resultado).toBe("EMPATE");
    })
})