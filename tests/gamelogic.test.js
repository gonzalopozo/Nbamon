import { describe, expect, it } from 'vitest'
import { evaluarRonda } from '../public/js/game/gameLogic'

describe("evaluarRonda", () => {
    it('returns a win when player 1 do "MATE" and player 2 do "PASE")', () => {
        expect(evaluarRonda("MATE", "PASE")).toBe("GANASTE");
    })

    it('returns a win when player 1 do "TAPÓN" and player 2 do "MATE")', () => {
        expect(evaluarRonda("TAPÓN", "MATE")).toBe("GANASTE");
    })

    it('returns a win when player 1 do "PASE" and player 2 do "TAPÓN")', () => {
        expect(evaluarRonda("PASE", "TAPÓN")).toBe("GANASTE");
    })

    it('returns a lose when player 1 do "PASE" and player 2 do "MATE")', () => {
        expect(evaluarRonda("PASE", "MATE")).toBe("PERDISTE");
    })

    it('returns a lose when player 1 do "MATE" and player 2 do "TAPÓN")', () => {
        expect(evaluarRonda("MATE", "TAPÓN")).toBe("PERDISTE");
    })

    it('returns a lose when player 1 do "TAPÓN" and player 2 do "PASE")', () => {
        expect(evaluarRonda("TAPÓN", "PASE")).toBe("PERDISTE");
    })

    it('returns a tie when player 1 do "MATE" and player 2 do "MATE")', () => {
        expect(evaluarRonda("MATE", "MATE")).toBe("EMPATE");
    })

    it('returns a tie when player 1 do "TAPÓN" and player 2 do "TAPÓN")', () => {
        expect(evaluarRonda("TAPÓN", "TAPÓN")).toBe("EMPATE");
    })

    it('returns a tie when player 1 do "PASE" and player 2 do "PASE")', () => {
        expect(evaluarRonda("PASE", "PASE")).toBe("EMPATE");
    })
})