/**
 * Punto de entrada. Orquesta módulos y flujo del juego.
 */

import { crearNbamones } from "./data/players.js";
import { unirseAlJuego, seleccionarPersonaje, enviarPosicion, enviarAtaques, obtenerAtaquesEnemigo } from "./api/gameApi.js";
import { crearEstadoInicial } from "./state/gameState.js";
import { procesarCombate, emojiATiro } from "./game/gameLogic.js";
import {
    calcularDimensionesMapa,
    configurarCanvas,
    obtenerContexto,
    pintarFrame,
    parsearEnemigos,
    hayColision,
    TIEMPOS,
} from "./canvas/renderer.js";
import {
    initRefs,
    ocultarSeccion,
    mostrarSeccion,
    renderizarTarjetasJugadores,
    obtenerJugadorSeleccionado,
    renderizarBotonesTiro,
    obtenerBotonesTiro,
    actualizarNombresJugadores,
    actualizarVictorias,
    mostrarRonda,
    mostrarMensajeFinal,
    getCanvas,
} from "./dom/domManager.js";

let estado = crearEstadoInicial();
let refs = {};

function iniciarJuego() {
    refs = initRefs();

    ocultarSeccion("sectionSeleccionarJugador");
    ocultarSeccion("sectionSeleccionarTiro");
    ocultarSeccion("sectionVerMapa");

    refs.botonJugar?.addEventListener("click", onComenzarJuego);

    const { ancho, alto } = calcularDimensionesMapa();
    estado.nbamones = crearNbamones(ancho, alto);

    renderizarTarjetasJugadores(estado.nbamones);

    refs.botonJugador?.addEventListener("click", onSeleccionarJugador);
    refs.botonReiniciar?.addEventListener("click", reiniciarJuego);

    unirseAlJuego().then((id) => {
        estado.jugadorId = id;
    });
}

function onComenzarJuego() {
    ocultarSeccion("sectionBienvenida");
    mostrarSeccion("sectionSeleccionarJugador");
}

function onSeleccionarJugador() {
    const jugador = obtenerJugadorSeleccionado(estado.nbamones);
    if (!jugador) {
        alert("Debes seleccionar un jugador");
        return;
    }

    estado.personajeSeleccionado = jugador.nombre;
    estado.personajeSeleccionadoObjeto = jugador;

    ocultarSeccion("sectionSeleccionarJugador");

    seleccionarPersonaje(estado.jugadorId, jugador.nombre);

    renderizarBotonesTiro(jugador.tiros);
    estado.botonesTiro = obtenerBotonesTiro();

    mostrarSeccion("sectionVerMapa");
    redimensionarCanvas();
    iniciarMapa();
}

function redimensionarCanvas() {
    const wrapper = document.querySelector("#ver-mapa .canvas-wrapper");
    const altoDisponible = wrapper?.clientHeight ?? window.innerHeight - 340;
    const { ancho, alto } = calcularDimensionesMapa(altoDisponible);
    const canvas = getCanvas();
    if (canvas) {
        configurarCanvas(canvas, ancho, alto);
    }
    estado.nbamones = crearNbamones(ancho, alto);
    estado.personajeSeleccionadoObjeto =
        estado.nbamones.find((n) => n.nombre === estado.personajeSeleccionado) ?? null;
}

function iniciarMapa() {
    const ctx = obtenerContexto(getCanvas());
    if (!ctx) return;

    const onPosicionEnviada = (x, y) => {
        enviarPosicion(estado.jugadorId, x, y).then(({ enemigos }) => {
            estado.nbamonesEnemigos = parsearEnemigos(enemigos);

            for (const enemigo of estado.nbamonesEnemigos) {
                if (hayColision(estado.personajeSeleccionadoObjeto, enemigo)) {
                    onColision(enemigo);
                    return;
                }
            }
        });
    };

    const tick = () => {
        pintarFrame(
            ctx,
            getCanvas(),
            estado.personajeSeleccionadoObjeto,
            estado.nbamonesEnemigos,
            onPosicionEnviada,
        );
    };

    estado.intervaloCanvas = setInterval(tick, TIEMPOS.INTERVALO_CANVAS_MS);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    bindearBotonesMovimiento();
}

function onKeyDown(e) {
    const v = 5;
    switch (e.key) {
        case "ArrowUp":
        case "w":
            estado.personajeSeleccionadoObjeto.velocidadY = -v;
            break;
        case "ArrowDown":
        case "s":
            estado.personajeSeleccionadoObjeto.velocidadY = v;
            break;
        case "ArrowLeft":
        case "a":
            estado.personajeSeleccionadoObjeto.velocidadX = -v;
            break;
        case "ArrowRight":
        case "d":
            estado.personajeSeleccionadoObjeto.velocidadX = v;
            break;
        default:
            break;
    }
}

function onKeyUp() {
    estado.personajeSeleccionadoObjeto.velocidadX = 0;
    estado.personajeSeleccionadoObjeto.velocidadY = 0;
}

function onColision(enemigo) {
    clearInterval(estado.intervaloCanvas);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);

    estado.enemigoId = enemigo.id;
    mostrarSeccion("sectionSeleccionarTiro");
    ocultarSeccion("sectionVerMapa");

    actualizarNombresJugadores(estado.personajeSeleccionado, enemigo.nombre);
    configurarBotonesTiro();
}

function configurarBotonesTiro() {
    estado.tirosJugador = [];
    estado.tirosEnemigo = [];
    estado.victoriasJugador = 0;
    estado.victoriasEnemigo = 0;

    estado.botonesTiro.forEach((boton) => {
        boton.style.background = "";
        boton.disabled = false;
        boton.onclick = (e) => {
            const tiro = emojiATiro(e.target.textContent);
            estado.tirosJugador.push(tiro);
            boton.style.background = "#222222";
            boton.disabled = true;

            if (estado.tirosJugador.length === 5) {
                enviarAtaques(estado.jugadorId, estado.tirosJugador);
                estado.intervaloPolling = setInterval(pollingAtaquesEnemigo, TIEMPOS.INTERVALO_POLLING_ATAQUES_MS);
            }
        };
    });
}

function pollingAtaquesEnemigo() {
    obtenerAtaquesEnemigo(estado.enemigoId).then((ataques) => {
        if (ataques?.length === 5) {
            clearInterval(estado.intervaloPolling);
            estado.tirosEnemigo = ataques;
            ejecutarCombate();
        }
    });
}

function ejecutarCombate() {
    const { rondas, victoriasJugador, victoriasEnemigo, mensajeFinal } =
		procesarCombate(estado.tirosJugador, estado.tirosEnemigo);

    estado.victoriasJugador = victoriasJugador;
    estado.victoriasEnemigo = victoriasEnemigo;

    rondas.forEach((r) => {
        mostrarRonda(r.resultado, r.tiroJugador, r.tiroEnemigo);
    });

    actualizarVictorias(victoriasJugador, victoriasEnemigo);
    mostrarMensajeFinal(mensajeFinal);
}

function reiniciarJuego() {
    location.reload();
}

function bindearBotonesMovimiento() {
    const detener = () => {
        if (estado.personajeSeleccionadoObjeto) {
            estado.personajeSeleccionadoObjeto.velocidadX = 0;
            estado.personajeSeleccionadoObjeto.velocidadY = 0;
        }
    };
    const moverArriba = () => {
        if (estado.personajeSeleccionadoObjeto) estado.personajeSeleccionadoObjeto.velocidadY = -5;
    };
    const moverAbajo = () => {
        if (estado.personajeSeleccionadoObjeto) estado.personajeSeleccionadoObjeto.velocidadY = 5;
    };
    const moverIzq = () => {
        if (estado.personajeSeleccionadoObjeto) estado.personajeSeleccionadoObjeto.velocidadX = -5;
    };
    const moverDer = () => {
        if (estado.personajeSeleccionadoObjeto) estado.personajeSeleccionadoObjeto.velocidadX = 5;
    };

    const bind = (id, mover) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("mousedown", mover);
        el.addEventListener("touchstart", mover);
        el.addEventListener("mouseup", detener);
        el.addEventListener("touchend", detener);
    };

    bind("arriba", moverArriba);
    bind("abajo", moverAbajo);
    bind("izquierda", moverIzq);
    bind("derecha", moverDer);
}

window.addEventListener("load", iniciarJuego);
