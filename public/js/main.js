/**
 * Punto de entrada. Orquesta módulos y flujo del juego.
 */

import { crearNbamones } from "./data/players.js";
import {
    unirseAlJuego,
    seleccionarPersonaje,
    enviarPosicion,
    enviarAtaques,
    obtenerAtaquesEnemigo,
} from "./api/gameApi.js";
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
    mostrarMensajeValidacion,
    actualizarEstadoConexion,
    actualizarEstadoBienvenida,
    resetearPantallaCombate,
    getCanvas,
} from "./dom/domManager.js";
import { initTheme } from "./theme/themeManager.js";
import { initI18n, t, EVENT_LANGUAGE_CHANGED } from "./i18n/i18n.js";

let estado = crearEstadoInicial();
let refs = {};

async function iniciarJuego() {
    await initI18n();
    initTheme();
    refs = initRefs();

    ocultarSeccion("sectionSeleccionarJugador");
    ocultarSeccion("sectionSeleccionarTiro");
    ocultarSeccion("sectionVerMapa");

    refs.botonJugar?.addEventListener("click", onComenzarJuego);

    const { ancho, alto } = calcularDimensionesMapa();
    estado.nbamones = crearNbamones(ancho, alto);

    renderizarTarjetasJugadores(estado.nbamones);

    refs.contenedorTarjetas?.addEventListener("change", () => {
        mostrarMensajeValidacion("");
    });
    refs.botonJugador?.addEventListener("click", onSeleccionarJugador);
    refs.botonReiniciar?.addEventListener("click", reiniciarJuego);

    bindLangChangeListener();

    actualizarEstadoBienvenida(t("status.connecting"), true);
    unirseAlJuego()
        .then((id) => {
            estado.jugadorId = id;
            actualizarEstadoBienvenida("");
        })
        .catch(() => {
            estado.errorServidor = "errors.serverConnection";
            actualizarEstadoBienvenida(t(estado.errorServidor), false, true);
        });
}

function onComenzarJuego() {
    ocultarSeccion("sectionBienvenida");
    mostrarSeccion("sectionSeleccionarJugador");
}

function onSeleccionarJugador() {
    mostrarMensajeValidacion("");

    if (!estado.jugadorId) {
        mostrarMensajeValidacion(
            estado.errorServidor ? t(estado.errorServidor) : t("errors.serverConnection"),
        );
        return;
    }

    const jugador = obtenerJugadorSeleccionado(estado.nbamones);
    if (!jugador) {
        mostrarMensajeValidacion(t("errors.selectPlayer"));
        return;
    }

    estado.personajeSeleccionado = jugador.nombre;
    estado.personajeSeleccionadoObjeto = jugador;

    ocultarSeccion("sectionSeleccionarJugador");

    mostrarSeccion("sectionVerMapa");
    actualizarEstadoConexion(t("status.searchingOpponent"), true);
    redimensionarCanvas();

    seleccionarPersonaje(estado.jugadorId, jugador.nombre).catch(() => {
        actualizarEstadoConexion(t("errors.registerCharacter"), false);
    });

    renderizarBotonesTiro(jugador.tiros);
    estado.botonesTiro = obtenerBotonesTiro();

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
        estado.nbamones.find(
            (n) => n.nombre === estado.personajeSeleccionado,
        ) ?? null;
}

function iniciarMapa() {
    const ctx = obtenerContexto(getCanvas());
    if (!ctx) return;

    let contador = 0;
    let segundosRestantes = 5;
    const MAX_TICKS = 200 // 20 tick for each second (50 ms * 20 = 1 second). 300 for 15 seconds
    // const MAX_TICKS = 100; // 20 tick for each second (50 ms * 20 = 1 second). 300 for 15 seconds

    const onPosicionEnviada = (x, y) => {
        enviarPosicion(estado.jugadorId, x, y).then(({ enemigos }) => {
            estado.nbamonesEnemigos = parsearEnemigos(enemigos);

            if (estado.nbamonesEnemigos.length >= 1 && contador < MAX_TICKS) {
                actualizarEstadoConexion("");
                contador = 100000;
            }

            contador++;

            if (contador == 100) {
                const key = segundosRestantes === 1 ? "status.botCountdownSingular" : "status.botCountdown";
                actualizarEstadoConexion(t(key, { seconds: segundosRestantes }));
                segundosRestantes--;
            }

            if (contador < MAX_TICKS && contador > 100 && contador % 20 == 0) {
                const key = segundosRestantes === 1 ? "status.botCountdownSingular" : "status.botCountdown";
                actualizarEstadoConexion(t(key, { seconds: segundosRestantes }));
                segundosRestantes--;
            }

            if (contador === MAX_TICKS && segundosRestantes === 0 && !estado.botId) {
                actualizarEstadoConexion(t("status.botGenerated"));

                const randomPlayer =
                    estado.nbamones[Math.floor(Math.random() * 6)];
                const canvas = getCanvas();
                const botX = Math.floor(
                    Math.random() * Math.max(0, (canvas?.width ?? 800) - 35),
                );
                const botY = Math.floor(
                    Math.random() * Math.max(0, (canvas?.height ?? 600) - 59),
                );

                unirseAlJuego()
                    .then((id) => {
                        estado.botId = id;
                        actualizarEstadoBienvenida("");

                        estado.personajeSeleccionadoBotObjeto = randomPlayer;

                        return seleccionarPersonaje(id, randomPlayer.nombre);
                    })
                    .then(() => enviarPosicion(estado.botId, botX, botY))
                    .then(() => {
                        // No actualizar nbamonesEnemigos aquí: la respuesta
                        // del bot devuelve al jugador humano como "enemigos".
                        // El siguiente tick del jugador traerá al bot.
                    })
                    .catch(() => {
                        if (estado.botId) {
                            actualizarEstadoConexion(t("errors.registerCharacter"), false);
                        } else {
                            estado.errorServidor = "errors.serverConnection";
                            actualizarEstadoBienvenida(t(estado.errorServidor), false, true);
                        }
                    });
            }


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
    let handled = false;
    switch (e.code) {
        case "ArrowUp":
        case "KeyW":
            estado.personajeSeleccionadoObjeto.velocidadY = -v;
            handled = true;
            break;
        case "ArrowDown":
        case "KeyS":
            estado.personajeSeleccionadoObjeto.velocidadY = v;
            handled = true;
            break;
        case "ArrowLeft":
        case "KeyA":
            estado.personajeSeleccionadoObjeto.velocidadX = -v;
            handled = true;
            break;
        case "ArrowRight":
        case "KeyD":
            estado.personajeSeleccionadoObjeto.velocidadX = v;
            handled = true;
            break;
        default:
            break;
    }
    if (handled) e.preventDefault();
}

function onKeyUp() {
    estado.personajeSeleccionadoObjeto.velocidadX = 0;
    estado.personajeSeleccionadoObjeto.velocidadY = 0;
}

function onColision(enemigo) {
    clearInterval(estado.intervaloCanvas);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    desbindearBotonesMovimiento();

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
    estado.combateEjecutado = false;

    estado.botonesTiro.forEach((boton) => {
        boton.classList.remove("boton-deshabilitado");
        boton.disabled = false;
        boton.onclick = (e) => {
            const tiro = emojiATiro(e.target.textContent);
            estado.tirosJugador.push(tiro);
            boton.classList.add("boton-deshabilitado");
            boton.disabled = true;

            if (estado.tirosJugador.length === 5) {
                enviarAtaques(estado.jugadorId, estado.tirosJugador);

                if (estado.botId) {
                    const tirosBot = [
                        ...estado.personajeSeleccionadoBotObjeto.tiros,
                    ];
                    const tirosDesordenados = [];

                    while (tirosBot.length > 0) {
                        const tiroRandom = Math.floor(
                            Math.random() * tirosBot.length,
                        );
                        const tiro = tirosBot.splice(tiroRandom, 1)[0];
                        tirosDesordenados.push(
                            emojiATiro(tiro.nombre ?? tiro.emoji),
                        );
                    }

                    enviarAtaques(estado.botId, tirosDesordenados);
                }
                estado.intervaloPolling = setInterval(
                    pollingAtaquesEnemigo,
                    TIEMPOS.INTERVALO_POLLING_ATAQUES_MS,
                );
            }
        };
    });
}

function pollingAtaquesEnemigo() {
    obtenerAtaquesEnemigo(estado.botId ?? estado.enemigoId).then((ataques) => {
        if (ataques?.length === 5 && !estado.combateEjecutado) {
            clearInterval(estado.intervaloPolling);
            estado.intervaloPolling = null;
            estado.combateEjecutado = true;
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
        mostrarRonda(t(r.resultado), r.tiroJugador, r.tiroEnemigo);
    });

    actualizarVictorias(victoriasJugador, victoriasEnemigo);
    mostrarMensajeFinal(t(mensajeFinal));
}

function reiniciarJuego() {
    if (estado.intervaloPolling) {
        clearInterval(estado.intervaloPolling);
        estado.intervaloPolling = null;
    }

    const canvas = getCanvas();
    const botX = Math.floor(
        Math.random() * Math.max(0, (canvas?.width ?? 800) - 35),
    );
    const botY = Math.floor(
        Math.random() * Math.max(0, (canvas?.height ?? 600) - 59),
    );
    enviarPosicion(estado.botId, botX, botY);
    estado.nbamonesEnemigos = [];
    estado.tirosJugador = [];
    estado.tirosEnemigo = [];
    estado.victoriasJugador = 0;
    estado.victoriasEnemigo = 0;

    resetearPantallaCombate(t("combat.chooseShot"));
    configurarBotonesTiro();

    ocultarSeccion("sectionSeleccionarTiro");
    mostrarSeccion("sectionVerMapa");
    actualizarEstadoConexion(t("status.searchingOpponent"), true);
    redimensionarCanvas();
    iniciarMapa();
}

function bindLangChangeListener() {
    window.addEventListener(EVENT_LANGUAGE_CHANGED, () => {
        if (estado.errorServidor) {
            actualizarEstadoBienvenida(t(estado.errorServidor), false, true);
        }
    });
}

function bindearBotonesMovimiento() {
    const detener = () => {
        if (estado.personajeSeleccionadoObjeto) {
            estado.personajeSeleccionadoObjeto.velocidadX = 0;
            estado.personajeSeleccionadoObjeto.velocidadY = 0;
        }
    };
    estado.detenerMovimiento = detener;

    const moverArriba = () => {
        if (estado.personajeSeleccionadoObjeto)
            estado.personajeSeleccionadoObjeto.velocidadY = -5;
    };
    const moverAbajo = () => {
        if (estado.personajeSeleccionadoObjeto)
            estado.personajeSeleccionadoObjeto.velocidadY = 5;
    };
    const moverIzq = () => {
        if (estado.personajeSeleccionadoObjeto)
            estado.personajeSeleccionadoObjeto.velocidadX = -5;
    };
    const moverDer = () => {
        if (estado.personajeSeleccionadoObjeto)
            estado.personajeSeleccionadoObjeto.velocidadX = 5;
    };

    const bind = (id, mover) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("mousedown", mover);
        el.addEventListener("touchstart", mover, { passive: true });
        el.addEventListener("mouseup", detener);
        el.addEventListener("mouseleave", detener);
        el.addEventListener("touchend", detener);
        el.addEventListener("touchcancel", detener);
    };

    bind("arriba", moverArriba);
    bind("abajo", moverAbajo);
    bind("izquierda", moverIzq);
    bind("derecha", moverDer);

    document.addEventListener("mouseup", detener);
    document.addEventListener("touchend", detener);
}

function desbindearBotonesMovimiento() {
    const detener = estado.detenerMovimiento;
    if (detener) {
        document.removeEventListener("mouseup", detener);
        document.removeEventListener("touchend", detener);
    }
}

window.addEventListener("load", iniciarJuego);
