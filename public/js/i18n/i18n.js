/**
 * Módulo de internacionalización con i18next.
 */

import i18next from "i18next";
import Backend from "i18next-http-backend";

const STORAGE_KEY = "nbamon-lang";
const EVENT_LANGUAGE_CHANGED = "languageChanged";

/**
 * Inicializa i18next y carga las traducciones.
 * @param {string} [lng] - Código de idioma (es, en, it). Si no se pasa, usa localStorage o 'es'.
 * @returns {Promise<void>}
 */
export async function initI18n(lng) {
    const savedLang = lng ?? localStorage.getItem(STORAGE_KEY) ?? "es";

    await i18next.use(Backend).init({
        lng: savedLang,
        fallbackLng: "es",
        backend: {
            loadPath: "/locales/{{lng}}.json",
        },
    });

    document.documentElement.lang = i18next.language;
    document.title = i18next.t("common.pageTitle");
    applyTranslations();
    setupLangDropdown();
}

/**
 * Traduce una clave.
 * @param {string} key - Clave de traducción (ej: 'common.gameTitle')
 * @param {Object} [options] - Opciones de interpolación (ej: { seconds: 5 })
 * @returns {string}
 */
export function t(key, options = {}) {
    return i18next.t(key, options);
}

/**
 * Aplica las traducciones a los elementos con data-i18n.
 * También actualiza data-i18n-aria-label y data-i18n-title.
 */
export function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (key) el.textContent = i18next.t(key);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        const key = el.getAttribute("data-i18n-aria-label");
        if (key) el.setAttribute("aria-label", i18next.t(key));
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
        const key = el.getAttribute("data-i18n-title");
        if (key) el.setAttribute("title", i18next.t(key));
    });

    document.documentElement.lang = i18next.language;
    document.title = i18next.t("common.pageTitle");
}

/**
 * Cambia el idioma y actualiza la UI.
 * @param {string} lng - Código de idioma (es, en, it)
 * @returns {Promise<void>}
 */
export async function changeLanguage(lng) {
    await i18next.changeLanguage(lng);
    localStorage.setItem(STORAGE_KEY, lng);
    applyTranslations();
    updateLangDropdown();
    window.dispatchEvent(new CustomEvent(EVENT_LANGUAGE_CHANGED, { detail: { lng } }));
}

const FLAG_PATHS = { es: "./assets/es.svg", en: "./assets/gb.svg", it: "./assets/it.svg" };

/**
 * Actualiza el trigger del dropdown con la bandera actual.
 */
function updateLangDropdown() {
    const trigger = document.getElementById("lang-trigger");
    const flagImg = document.getElementById("lang-trigger-flag");
    if (!trigger || !flagImg) return;

    const current = i18next.language;
    const path = FLAG_PATHS[current] ?? FLAG_PATHS.es;
    flagImg.src = path;
    const altKey = current === "es" ? "langSelector.spanish" : current === "en" ? "langSelector.english" : "langSelector.italian";
    flagImg.alt = i18next.t(altKey);
}

/**
 * Configura el dropdown de idiomas.
 */
function setupLangDropdown() {
    const trigger = document.getElementById("lang-trigger");
    const panel = document.getElementById("lang-panel");
    if (!trigger || !panel) return;

    updateLangDropdown();

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = panel.hidden === false;
        panel.hidden = isOpen;
        trigger.setAttribute("aria-expanded", !isOpen);
    });

    panel.querySelectorAll(".lang-dropdown-option").forEach((opt) => {
        opt.addEventListener("click", (e) => {
            e.stopPropagation();
            const lang = opt.getAttribute("data-lang");
            if (lang) {
                changeLanguage(lang);
                panel.hidden = true;
                trigger.setAttribute("aria-expanded", "false");
            }
        });
    });

    document.addEventListener("click", () => {
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
    });
}

/**
 * Obtiene el código de idioma actual.
 * @returns {string}
 */
export function getCurrentLanguage() {
    return i18next.language;
}

export { EVENT_LANGUAGE_CHANGED };
