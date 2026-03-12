/**
 * Gestión de temas light/dark/system.
 * Usa variables CSS y data-theme en <html>.
 */

const THEMES = ["light", "dark", "system"];
const STORAGE_KEY = "theme";

/**
 * Obtiene el tema guardado en localStorage.
 * @returns {string|null} "light" | "dark" | "system" | null
 */
export function getStoredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : null;
}

/**
 * Obtiene el tema efectivo (light o dark) según preferencia del sistema cuando es "system".
 * @returns {"light" | "dark"}
 */
export function getEffectiveTheme() {
    const stored = getStoredTheme();
    if (stored === "light") return "light";
    if (stored === "dark") return "dark";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

/**
 * Aplica el tema: setea data-theme en html y guarda en localStorage.
 * @param {string} theme - "light" | "dark" | "system"
 */
export function applyTheme(theme) {
    if (!THEMES.includes(theme)) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Actualiza el estado activo del nav de temas (aria-current).
 */
export function updateThemeNav() {
    const nav = document.getElementById("theme-nav");
    if (!nav) return;

    const theme = getStoredTheme() ?? "system";
    nav.querySelectorAll(".theme-nav-btn").forEach((btn) => {
        const isActive = btn.getAttribute("data-theme") === theme;
        btn.setAttribute("aria-current", isActive ? "true" : "false");
    });
}

/**
 * Inicializa el tema y el nav de temas.
 * Aplica tema guardado o "system" por defecto.
 * El CSS usa @media (prefers-color-scheme) para reaccionar a cambios del sistema.
 */
export function initTheme() {
    const stored = getStoredTheme();
    const theme = stored ?? "system";
    applyTheme(theme);
    updateThemeNav();

    const nav = document.getElementById("theme-nav");
    nav?.addEventListener("click", (e) => {
        const btn = e.target.closest(".theme-nav-btn");
        if (!btn) return;
        const themeName = btn.getAttribute("data-theme");
        if (THEMES.includes(themeName)) {
            applyTheme(themeName);
            updateThemeNav();
        }
    });
}
