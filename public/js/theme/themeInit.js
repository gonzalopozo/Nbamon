/**
 * Aplica el tema guardado antes del primer paint (evita flash).
 * Se carga en el head sin bloqueo.
 */
(function () {
    const t = localStorage.getItem("theme");
    const valid = ["light", "dark", "system"].includes(t);
    document.documentElement.setAttribute("data-theme", valid ? t : "system");
})();
