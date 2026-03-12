// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { hayColision } from "../public/js/canvas/renderer";

describe("hayColision", () => {
    it("it returns true when players collide", () => {
        // Diferencia 10 px en eje X
        const jugador1 = { x: 125, y: 50, alto: 59, ancho: 35 }
        const jugador2 = { x: 115, y: 50, alto: 59, ancho: 35 }

        expect(hayColision(jugador1, jugador2)).toBeTruthy();

        // Diferencia 34 px en eje Y
        const jugador3 = { x: 125, y: 60, alto: 59, ancho: 35 }
        const jugador4 = { x: 125, y: 26, alto: 59, ancho: 35 }

        expect(hayColision(jugador3, jugador4)).toBeTruthy();
    })

    it("it returns false when players don't collide", () => {
        const jugador1 = { x: 225, y: 50, alto: 59, ancho: 35 }
        const jugador2 = { x: 115, y: 50, alto: 59, ancho: 35 }

        expect(hayColision(jugador1, jugador2)).toBeFalsy();

        const jugador3 = { x: 125, y: 60, alto: 59, ancho: 35 }
        const jugador4 = { x: 125, y: 260, alto: 59, ancho: 35 }

        expect(hayColision(jugador3, jugador4)).toBeFalsy();
    })
})