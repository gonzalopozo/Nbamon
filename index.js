const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const NOMBRES_NBAMON_VALIDOS = new Set([
    "Lebron James",
    "Damian Lillard",
    "Giannis Antetokoumpo",
    "Anthony Davis",
    "Jimmy Butler",
    "Kawhi Leonard",
]);

const ATAQUES_VALIDOS = new Set(["MATE", "TAPÓN", "PASE"]);

const jugadores = [];

class Jugador {
    constructor(id) {
        this.id = id;
    }

    asignarNbamon(nbamon) {
        this.nbamon = nbamon;
    }

    actualizarPosicion(x, y) {
        this.x = x;
        this.y = y;
    }

    asignarAtaques(ataques) {
        this.ataques = ataques;
    }
}

class Nbamon {
    constructor(nombre) {
        this.nombre = nombre;
    }
}

app.get("/unirse", (req, res) => {
    const id = crypto.randomUUID();

    const jugador = new Jugador(id);

    jugadores.push(jugador);

    res.send(id);
});

app.post("/nbamon/:jugadorId", (req, res) => {
    console.log(req.params);
    console.log(req.body);

    const jugadorId = req.params.jugadorId || "";
    const nombre = String(req.body.nbamon || "").trim();

    if (!NOMBRES_NBAMON_VALIDOS.has(nombre)) {
        res.status(400).end();
        return;
    }

    const nbamon = new Nbamon(nombre);

    const jugadorIndex = jugadores.findIndex(
        (jugador) => jugadorId === jugador.id,
    );

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarNbamon(nbamon);
    }
    res.end();
});

const POSICION_MAX = 1000;

app.post("/nbamon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || "";
    const x = Math.min(POSICION_MAX, Math.max(0, Number(req.body.x) || 0));
    const y = Math.min(POSICION_MAX, Math.max(0, Number(req.body.y) || 0));

    const jugadorIndex = jugadores.findIndex(
        (jugador) => jugadorId === jugador.id,
    );

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y);
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id);

    console.log(enemigos);

    res.send({
        enemigos,
    });
});

app.post("/nbamon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || "";
    const raw = req.body.ataques || [];

    const ataques = Array.isArray(raw)
        ? raw
              .slice(0, 5)
              .map((a) => String(a).trim())
              .filter((a) => ATAQUES_VALIDOS.has(a))
        : [];

    if (ataques.length !== 5) {
        res.status(400).end();
        return;
    }

    const jugadorIndex = jugadores.findIndex(
        (jugador) => jugadorId === jugador.id,
    );

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques);
    }

    res.end();
});

app.get("/nbamon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || "";
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId);
    res.send({
        ataques: jugador.ataques || [],
    });
});

app.listen(port, "0.0.0.0");
