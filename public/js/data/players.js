/**
 * Definición de datos de jugadores (Nbamons).
 * Contiene la clase Nbamon y el catálogo de personajes disponibles.
 */

const TIRO_TIPOS = {
    MATE: { emoji: "⛹️", id: "boton-mate" },
    TAPON: { emoji: "🛡️", id: "boton-tapon" },
    PASE: { emoji: "👐", id: "boton-pase" },
};

export class Nbamon {
    constructor(nombre, foto, numTiros, equipo, fotoMapa, id = null) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.numTiros = numTiros;
        this.equipo = equipo;
        this.tiros = [];
        this.ancho = 35;
        this.alto = 59;
        this.x = 0;
        this.y = 0;
        this.mapaFoto = new Image();
        this.mapaFoto.src = fotoMapa;
        this.velocidadX = 0;
        this.velocidadY = 0;
    }

    pintarNbamon(ctx) {
        ctx.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto);
    }
}

function crearNbamon(nombre, foto, equipo, fotoMapa, tiros) {
    const nbamon = new Nbamon(nombre, foto, 5, equipo, fotoMapa);
    nbamon.tiros.push(...tiros.map((t) => ({ nombre: t.emoji, id: t.id })));
    return nbamon;
}

const JUGADORES_DEFINICION = [
    {
        nombre: "Lebron James",
        foto: "./assets/nbamons_nbamon_lebronJames_attack.jpg",
        equipo: "lakers",
        fotoMapa: "./assets/lebronJames.png",
        tiros: [
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.TAPON,
            TIRO_TIPOS.PASE,
        ],
    },
    {
        nombre: "Damian Lillard",
        foto: "./assets/nbamons_nbamon_damianLillard_attack.jpg",
        equipo: "blazers",
        fotoMapa: "./assets/damianLillard.png",
        tiros: [
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.PASE,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.PASE,
            TIRO_TIPOS.TAPON,
        ],
    },
    {
        nombre: "Giannis Antetokoumpo",
        foto: "./assets/nbamons_nbamon_giannisAntetokoumpo_attack.jpg",
        equipo: "bucks",
        fotoMapa: "./assets/giannisAntetokoumpo.png",
        tiros: [
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.TAPON,
            TIRO_TIPOS.PASE,
        ],
    },
    {
        nombre: "Anthony Davis",
        foto: "./assets/nbamons_nbamon_anthonyDavis_attack.jpg",
        equipo: "lakers",
        fotoMapa: "./assets/anthonyDavis.png",
        tiros: [
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.TAPON,
            TIRO_TIPOS.PASE,
        ],
    },
    {
        nombre: "Jimmy Butler",
        foto: "./assets/nbamons_nbamon_jimmyButler_attack.jpg",
        equipo: "heat",
        fotoMapa: "./assets/jimmyButler.png",
        tiros: [
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.TAPON,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.TAPON,
            TIRO_TIPOS.PASE,
        ],
    },
    {
        nombre: "Kawhi Leonard",
        foto: "./assets/nbamons_nbamon_kawhiLeonard_attack.jpg",
        equipo: "clippers",
        fotoMapa: "./assets/kawhiLeonard.png",
        tiros: [
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.TAPON,
            TIRO_TIPOS.MATE,
            TIRO_TIPOS.TAPON,
            TIRO_TIPOS.PASE,
        ],
    },
];

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** Crea la lista de Nbamons con posiciones aleatorias (requiere dimensiones del mapa) */
export function crearNbamones(anchoMapa, altoMapa) {
    return JUGADORES_DEFINICION.map((def) => {
        const nbamon = crearNbamon(
            def.nombre,
            def.foto,
            def.equipo,
            def.fotoMapa,
            def.tiros,
        );
        nbamon.x = aleatorio(0, Math.max(0, anchoMapa - nbamon.ancho));
        nbamon.y = aleatorio(0, Math.max(0, altoMapa - nbamon.alto));
        return nbamon;
    });
}

/** Mapa nombre → definición para crear Nbamons desde datos del servidor (evita if/else) */
export const JUGADOR_POR_NOMBRE = Object.fromEntries(
    JUGADORES_DEFINICION.map((def) => [
        def.nombre,
        {
            nombre: def.nombre,
            foto: def.foto,
            equipo: def.equipo,
            fotoMapa: def.fotoMapa,
        },
    ]),
);

export function crearNbamonDesdeEnemigo(enemigo) {
    const def = JUGADOR_POR_NOMBRE[enemigo.nbamon?.nombre || ""];
    if (!def) return null;

    const nbamon = new Nbamon(
        def.nombre,
        def.foto,
        5,
        def.equipo,
        def.fotoMapa,
        enemigo.id,
    );
    nbamon.x = enemigo.x ?? 0;
    nbamon.y = enemigo.y ?? 0;
    return nbamon;
}
