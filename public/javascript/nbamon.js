// Constantes

const sectionSeleccionarTiro = document.getElementById('seleccionar-tiro')
const sectionReiniciar = document.getElementById('reiniciar')
const botonJugadorJugador = document.getElementById('boton-jugador')
const botonReiniciar = document.getElementById('boton-reiniciar')

const sectionSeleccionarJugador = document.getElementById('seleccionar-jugador')
const spanJugadorJugador = document.getElementById('jugador-jugador')

const spanJugadorEnemigo = document.getElementById('jugador-enemigo')

const spanVictoriasJugador = document.getElementById('victorias-jugador')
const spanVictoriasEnemigo = document.getElementById('victorias-enemigo')

const sectionMensajes = document.getElementById('resultado')
const tiroDelJugador = document.getElementById('tiro-del-jugador')
const tiroDelEnemigo = document.getElementById('tiro-del-enemigo')

const contenedorTarjetas = document.getElementById('contenedorTarjetas')

const contenedorTiros = document.getElementById('contenedorTiros')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

// Variables globales

let jugadorId = null
let enemigoId = null
let nbamones = []
let nbamonesEnemigos = []
let tiroJugador = []
let tiroEnemigo = []
let opcionDeNbamones
let inputLebronJames
let inputDamianLillard
let inputGiannisAntetokoumpo
let inputAnthonyDavis
let inputJimmyButler
let inputKawhiLeonard
let personajeDelJugador
let personajeDelJugadorObjeto
let tirosDeLosNbamones
let tirosJugadorEnemigo
let botonMate
let botonTapon
let botonPase
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let tirosJugador = 3
let tirosEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './assets/nbamap.png'
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

// Clases y objetos

class Nbamon {
    constructor(nombre, foto, numTiros, equipo, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.numTiros = numTiros
        this.equipo = equipo
        this.tiros = []
        this.ancho = 35
        this.alto = 59
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }
    pintarNbamon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let lebronJames =  new Nbamon('Lebron-James', './assets/nbamons_nbamon_lebronJames_attack.jpg', 5, 'lakers', './assets/lebronJames.png')

let damianLillard = new Nbamon('Damian-Lillard', './assets/nbamons_nbamon_damianLillard_attack.jpg', 5, 'blazers', './assets/damianLillard.png')

let giannisAntetokoumpo = new Nbamon('Giannis-Antetokoumpo', './assets/nbamons_nbamon_giannisAntetokoumpo_attack.jpg', 5, 'bucks', './assets/giannisAntetokoumpo.png')

let anthonyDavis = new Nbamon('Anthony-Davis', './assets/nbamons_nbamon_anthonyDavis_attack.jpg', 5, 'lakers', './assets/anthonyDavis.png')

let jimmyButler = new Nbamon('Jimmy-Butler', './assets/nbamons_nbamon_jimmyButler_attack.jpg', 5, 'heat', './assets/jimmyButler.png')

let kawhiLeonard = new Nbamon('Kawhi-Leonard', './assets/nbamons_nbamon_kawhiLeonard_attack.jpg', 5, 'clippers', './assets/kawhiLeonard.png')

const LEBRON_JAMES_TIROS = [
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '🛡️', id: 'boton-tapon' },
    { nombre: '👐', id: 'boton-pase' }
]

lebronJames.tiros.push(...LEBRON_JAMES_TIROS)

const DAMIAN_LILLARD_TIROS = [
    { nombre: '⛹️', id: 'boton-mate' },    
    { nombre: '👐', id: 'boton-pase' },
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '👐', id: 'boton-pase' },    
    { nombre: '🛡️', id: 'boton-tapon' }
]

damianLillard.tiros.push(...DAMIAN_LILLARD_TIROS)

const GIANNIS_ANTETOKOUMPO_TIROS = [
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '⛹️', id: 'boton-mate' },    
    { nombre: '🛡️', id: 'boton-tapon' },
    { nombre: '👐', id: 'boton-pase' } 
]

giannisAntetokoumpo.tiros.push(...GIANNIS_ANTETOKOUMPO_TIROS)

const ANTHONY_DAVIS_TIROS = [
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '⛹️', id: 'boton-mate' },    
    { nombre: '🛡️', id: 'boton-tapon' },
    { nombre: '👐', id: 'boton-pase' } 
]

anthonyDavis.tiros.push(...ANTHONY_DAVIS_TIROS)

const JIMMY_BUTLER_TIROS = [    
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '🛡️', id: 'boton-tapon' },
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '🛡️', id: 'boton-tapon' },
    { nombre: '👐', id: 'boton-pase' }
]

jimmyButler.tiros.push(...JIMMY_BUTLER_TIROS)

const KAWHI_LEONARD_TIROS = [    
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '🛡️', id: 'boton-tapon' },
    { nombre: '⛹️', id: 'boton-mate' },
    { nombre: '🛡️', id: 'boton-tapon' },
    { nombre: '👐', id: 'boton-pase' }
]

kawhiLeonard.tiros.push(...KAWHI_LEONARD_TIROS)

nbamones.push(lebronJames,damianLillard,giannisAntetokoumpo,anthonyDavis,jimmyButler,kawhiLeonard)

// Iniciar juego

function iniciarJuego() {

    sectionSeleccionarTiro.style.display = 'none'
    sectionVerMapa.style.display = 'none'
    
    nbamones.forEach((nbamon) => {
        opcionDeNbamones = `
        <input type="radio" name="jugador" id=${nbamon.nombre}>
        <label class="tarjeta-de-jugador" for=${nbamon.nombre}>
            <p id=${nbamon.equipo}>${nbamon.nombre}</p>
            <img src="${nbamon.foto}" alt=${nbamon.nombre}>
        </label>
        `
    
    contenedorTarjetas.innerHTML += opcionDeNbamones

    inputLebronJames = document.getElementById('Lebron-James')
    inputDamianLillard = document.getElementById('Damian-Lillard')
    inputGiannisAntetokoumpo = document.getElementById('Giannis-Antetokoumpo')
    inputAnthonyDavis = document.getElementById('Anthony-Davis')
    inputJimmyButler = document.getElementById('Jimmy-Butler')
    inputKawhiLeonard = document.getElementById('Kawhi-Leonard')

    })
    
    botonJugadorJugador.addEventListener('click', seleccionarJugadorJugador)        
        
    botonReiniciar.addEventListener('click', reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

// Funciones para seleccionar el personaje(Nbamon) del jugador

function seleccionarJugadorJugador() {
    if (inputLebronJames.checked) {
        spanJugadorJugador.innerHTML = inputLebronJames.id
        personajeDelJugador = inputLebronJames.id
    } else if (inputDamianLillard.checked) {
        spanJugadorJugador.innerHTML = inputDamianLillard.id
        personajeDelJugador = inputDamianLillard.id
    } else if (inputGiannisAntetokoumpo.checked) {
        spanJugadorJugador.innerHTML = inputGiannisAntetokoumpo.id
        personajeDelJugador = inputGiannisAntetokoumpo.id
    } else if (inputAnthonyDavis.checked) {
        spanJugadorJugador.innerHTML = inputAnthonyDavis.id
        personajeDelJugador = inputAnthonyDavis.id
    } else if (inputJimmyButler.checked) {
        spanJugadorJugador.innerHTML = inputJimmyButler.id
        personajeDelJugador = inputJimmyButler.id
    } else if (inputKawhiLeonard.checked) {
        spanJugadorJugador.innerHTML = inputKawhiLeonard.id
        personajeDelJugador = inputKawhiLeonard.id
    } else {
        alert('Debes seleccionar un jugador')
        return
    }

    sectionSeleccionarJugador.style.display = 'none'

    seleccionarPersonajeNBA(personajeDelJugador)

    extraerTiros(personajeDelJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
}

function seleccionarPersonajeNBA(personajeDelJugador) {
    fetch(`http://localhost:8080/nbamon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nbamon: personajeDelJugador
        })
    })
}

// Función para extraer los tiros del personaje(Nbamon) del jugador

function extraerTiros(personajeDelJugador) {
    let tiros
    for (let i = 0; i < nbamones.length; i++) {
        if (personajeDelJugador === nbamones[i].nombre) {
            tiros = nbamones[i].tiros
        }
    }
    mostrarTiros(tiros)
}

// Función para mostrar los tiros del personaje(Nbamon) del jugador

function mostrarTiros(tiros){
    tiros.forEach((tiro) => {
        tirosDeLosNbamones = `
        <button id=${tiro.id} class="boton-de-tiro BTiro">${tiro.nombre}</button>
        `
        contenedorTiros.innerHTML += tirosDeLosNbamones
    })

    botonMate = document.getElementById('boton-mate')
    botonTapon = document.getElementById('boton-tapon')
    botonPase = document.getElementById('boton-pase')
    botones = document.querySelectorAll('.BTiro')
}

// Función para la secuencia de los tiros del jugador

function secuenciaTiros() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.textContent === '⛹️') {
                tiroJugador.push('MATE')
                console.log(tiroJugador)
                boton.style.background = '#222222'
                boton.disabled = true
                // boton.style.cursor = 'not-allowed'
            } else if (e.target.textContent === '🛡️') {
                tiroJugador.push('TAPÓN')
                console.log(tiroJugador)
                boton.style.background = '#222222'
                boton.disabled = true
                // boton.style.cursor = 'not-allowed'
            } else {
                tiroJugador.push('PASE')
                console.log(tiroJugador)
                boton.style.background = '#222222'
                boton.disabled = true
                // boton.style.cursor = 'not-allowed'
            }
            if (tiroJugador.length === 5) {
                enviarTiros()
            }
        })
    })
}
function enviarTiros() {
    fetch(`http://localhost:8080/nbamon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: tiroJugador
        })
    })

    intervalo = setInterval(obtenerTiros, 50)
}

function obtenerTiros() {
    fetch(`http://localhost:8080/nbamon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5) {
                            tiroEnemigo = ataques
                            combate()
                        }
                    })
            }
        })
}

// Función para seleccionar el personaje(Nbamon) del enemigo

function seleccionarJugadorEnemigo(enemigo) {
    spanJugadorEnemigo.innerHTML = enemigo.nombre
    tirosJugadorEnemigo = enemigo.tiros
    secuenciaTiros()
}

// Funciones para los tiros del personaje(Nbamon) del enemigo

function seleccionarTiroEnemigo() {
    console.log('Tiro enemigo', tirosJugadorEnemigo);
    let tiroAleatorio = aleatorio(0,tirosJugadorEnemigo.length -1)

    if (tiroAleatorio == 0 || tiroAleatorio == 1) {
        tiroEnemigo.push('MATE')
    } else if (tiroAleatorio == 3 || tiroAleatorio == 4) {
        tiroEnemigo.push('TAPÓN')
    } else {
        tiroEnemigo.push('PASE')
    }
    console.log(tiroEnemigo)
    iniciarEnfrentamiento()
}

// Función para iniciar el combate/enfrentamiento(1vs1)

function iniciarEnfrentamiento() {
    if (tiroJugador.length === 5) {
        combate()
    }
}

// Funciones para mensajes

function indexAmboxOponente(jugador, enemigo) {
    indexAtaqueJugador = tiroJugador[jugador]
    indexAtaqueEnemigo = tiroEnemigo[enemigo]
}

// Función para el combate

function combate() {
    clearInterval(intervalo)

    for (let index = 0; index < tiroJugador.length; index++) {
        if (tiroJugador[index] === tiroEnemigo[index]) {
            indexAmboxOponente(index, index)
            crearMensaje('EMPATE')
        } else if ((tiroJugador[index] == 'MATE' && tiroEnemigo[index] == 'PASE') || (tiroJugador[index] == 'TAPÓN' && tiroEnemigo[index] == 'MATE') || (tiroJugador[index] == 'PASE' && tiroEnemigo[index] == 'TAPÓN')) {
            indexAmboxOponente(index, index)
            crearMensaje('GANASTE')
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else {
            indexAmboxOponente(index, index)
            crearMensaje('PERDISTE')
            victoriasEnemigo++
            spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
        
    }

    revisarVictorias()
}

// Funcion para revisar las victorias del jugador y del enemigo

function revisarVictorias() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Esto fue  un empate!!!")
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("¡Bien hecho! Ganaste!! 🤑")
    } else {
        crearMensajeFinal("¡Mal hecho! Perdiste!! ☠️")
    }
}

// Funcion para crear un mensaje informativo(que esta ocurriendo en el 1vs1)

function crearMensaje(resultadoCombate) {
    

    let nuevoTiroDelJugador = document.createElement('p')
    let nuevoTiroDelEnemigo = document.createElement('p')
    
    sectionMensajes.innerHTML = resultadoCombate
    nuevoTiroDelJugador.innerHTML = indexAtaqueJugador
    nuevoTiroDelEnemigo.innerHTML = indexAtaqueEnemigo

    tiroDelJugador.appendChild(nuevoTiroDelJugador)
    tiroDelEnemigo.appendChild(nuevoTiroDelEnemigo)
}

// Funcion para crear un mensaje final diciendo si hemos ganado, empatado o perdido

function crearMensajeFinal(resultadoFinal) {


    sectionMensajes.innerHTML = resultadoFinal

    

    sectionReiniciar.style.display = 'block'
}

// Reinicar el juego

function reiniciarJuego() {
    location.reload()
}

// Funcion para conseguir numeros enteros aleatorios

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Funciones para el canvas

function pintarCanvas() {
    personajeDelJugadorObjeto.x = personajeDelJugadorObjeto.x + personajeDelJugadorObjeto.velocidadX
    personajeDelJugadorObjeto.y = personajeDelJugadorObjeto.y + personajeDelJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        // mapa.width = 800,
        // mapa.height = 600
    )
    personajeDelJugadorObjeto.pintarNbamon()

    enviarPosicion(personajeDelJugadorObjeto.x, personajeDelJugadorObjeto.y)

    nbamonesEnemigos.forEach(function (nbamon) {
        nbamon.pintarNbamon()
        revisarColision(nbamon)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://localhost:8080/nbamon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function ({ enemigos }) {
                    console.log(enemigos)
                    nbamonesEnemigos = enemigos.map(function (enemigo) {
                        let nbamonEnemigo = null
                        const nbamonNombre = enemigo.nbamon.nombre || ""
                        if (nbamonNombre === "Lebron-James") {
                            nbamonEnemigo =  new Nbamon('Lebron-James', './assets/nbamons_nbamon_lebronJames_attack.jpg', 5, 'lakers', './assets/lebronJames.png', enemigo.id)                            
                        } else if (nbamonNombre === "Damian-Lillard") {
                            nbamonEnemigo = new Nbamon('Damian-Lillard', './assets/nbamons_nbamon_damianLillard_attack.jpg', 5, 'blazers', './assets/damianLillard.png', enemigo.id)
                        } else if (nbamonNombre === "Giannis-Antetokoumpo") {
                            nbamonEnemigo = new Nbamon('Giannis-Antetokoumpo', './assets/nbamons_nbamon_giannisAntetokoumpo_attack.jpg', 5, 'bucks', './assets/giannisAntetokoumpo.png', enemigo.id)
                        } else if (nbamonNombre === "Anthony-Davis") {
                            nbamonEnemigo = new Nbamon('Anthony-Davis', './assets/nbamons_nbamon_anthonyDavis_attack.jpg', 5, 'lakers', './assets/anthonyDavis.png', enemigo.id)
                        } else if (nbamonNombre === "Jimmy-Butler") {
                            nbamonEnemigo = new Nbamon('Jimmy-Butler', './assets/nbamons_nbamon_jimmyButler_attack.jpg', 5, 'heat', './assets/jimmyButler.png', enemigo.id)
                        } else if (nbamonNombre === "Kawhi-Leonard") {
                            nbamonEnemigo = new Nbamon('Kawhi-Leonard', './assets/nbamons_nbamon_kawhiLeonard_attack.jpg', 5, 'clippers', './assets/kawhiLeonard.png', enemigo.id)
                        }

                        nbamonEnemigo.x = enemigo.x
                        nbamonEnemigo.y = enemigo.y
                            
                        return nbamonEnemigo
                    })
                })
        }
    })
}

function moverDerecha() {
    personajeDelJugadorObjeto.velocidadX = 5
}

function moverIzquierda() {
    personajeDelJugadorObjeto.velocidadX = -5
}

function moverArriba() {
    personajeDelJugadorObjeto.velocidadY = -5
}

function moverAbajo() {
    personajeDelJugadorObjeto.velocidadY = 5
}

function detenerMovimiento() {
    personajeDelJugadorObjeto.velocidadX = 0    
    personajeDelJugadorObjeto.velocidadY = 0
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break;

        case 'w':
            moverArriba()
            break;

        case 'ArrowDown':
            moverAbajo()
            break;

        case 's':
            moverAbajo()
            break;

        case 'ArrowLeft':
            moverIzquierda()
            break;

        case 'a':
            moverIzquierda()
            break;

        case 'ArrowRight':
            moverDerecha()
            break;

        case 'd':
            moverDerecha()
            break;

        default:
            break;
    }
}

function iniciarMapa() {

    personajeDelJugadorObjeto = obtenerObjetoNbamon(personajeDelJugador)
    console.log(personajeDelJugadorObjeto, personajeDelJugador)
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', sePresionoUnaTecla)

    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoNbamon() {
    for (let i = 0; i < nbamones.length; i++) {
        if (personajeDelJugador === nbamones[i].nombre) {
            return nbamones[i]
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaNbamon = personajeDelJugadorObjeto.y + 25
    const abajoNbamon = personajeDelJugadorObjeto.y + personajeDelJugadorObjeto.alto - 25
    const derechaNbamon = personajeDelJugadorObjeto.x + personajeDelJugadorObjeto.ancho -25
    const izquierdaNbamon = personajeDelJugadorObjeto.x + 25


    if (
        abajoNbamon < arribaEnemigo || 
        arribaNbamon > abajoEnemigo ||
        derechaNbamon < izquierdaEnemigo ||
        izquierdaNbamon > derechaEnemigo
    ) {
        return;
    } 
    
    detenerMovimiento()
    clearInterval(intervalo)
    console.log('Se detecto una colision');

    enemigoId = enemigo.id
    sectionSeleccionarTiro.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarJugadorEnemigo(enemigo)
}

// NOTA: esto de debajo se cargara una vez el DOM (document object model del HTML) se haya cargado e inicializar la función "iniciarJuego".

window.addEventListener('load', iniciarJuego)
