/**
 * Aplica el tema guardado antes del primer paint (evita flash).
 * Se carga en el head sin bloqueo.
 */
(function () {
    const t = localStorage.getItem("theme");
    const valid = ["light", "dark", "system"].includes(t);
    const theme = valid ? t : "system";
    document.documentElement.setAttribute("data-theme", theme);

    const isLight =
        theme === "light" ||
        (theme === "system" &&
            !window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("effective-theme-light", isLight);
})();
