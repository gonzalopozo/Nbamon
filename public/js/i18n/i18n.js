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
function applyTranslations() {
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

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
        const key = el.getAttribute("data-i18n-alt");
        if (key) el.setAttribute("alt", i18next.t(key));
    });

    document.documentElement.lang = i18next.language;
    document.title = i18next.t("common.pageTitle");
}

/**
 * Cambia el idioma y actualiza la UI.
 * @param {string} lng - Código de idioma (es, en, it)
 * @returns {Promise<void>}
 */
async function changeLanguage(lng) {
    await i18next.changeLanguage(lng);
    localStorage.setItem(STORAGE_KEY, lng);
    applyTranslations();
    updateLangDropdown();
    window.dispatchEvent(
        new CustomEvent(EVENT_LANGUAGE_CHANGED, { detail: { lng } }),
    );
}

const FLAG_PATHS = {
    es: "./assets/es.svg",
    en: "./assets/gb.svg",
    it: "./assets/it.svg",
};

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
    const altKey =
        current === "es"
            ? "langSelector.spanish"
            : current === "en"
              ? "langSelector.english"
              : "langSelector.italian";
    flagImg.alt = i18next.t(altKey);
}

function openDropdown(trigger, panel) {
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    const items = [...panel.querySelectorAll(".lang-dropdown-option")];
    if (items.length) items[0].focus();
}

function closeDropdown(trigger, panel) {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
}

/**
 * Configura el dropdown de idiomas.
 */
function setupLangDropdown() {
    const trigger = document.getElementById("lang-trigger");
    const panel = document.getElementById("lang-panel");
    if (!trigger || !panel) return;

    updateLangDropdown();

    const items = [...panel.querySelectorAll(".lang-dropdown-option")];

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = panel.hidden === false;
        if (isOpen) {
            closeDropdown(trigger, panel);
        } else {
            openDropdown(trigger, panel);
        }
    });

    trigger.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            if (panel.hidden) {
                e.preventDefault();
                openDropdown(trigger, panel);
            }
        }
    });

    panel.addEventListener("keydown", (e) => {
        const currentIndex = items.indexOf(document.activeElement);

        switch (e.key) {
            case "ArrowDown": {
                e.preventDefault();
                const next =
                    currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                items[next].focus();
                break;
            }
            case "ArrowUp": {
                e.preventDefault();
                const prev =
                    currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                items[prev].focus();
                break;
            }
            case "Escape":
                e.preventDefault();
                closeDropdown(trigger, panel);
                break;
            case "Tab":
                closeDropdown(trigger, panel);
                break;
            case "Home": {
                e.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                e.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    });

    items.forEach((opt) => {
        opt.addEventListener("click", (e) => {
            e.stopPropagation();
            const lang = opt.getAttribute("data-lang");
            if (lang) {
                changeLanguage(lang);
                closeDropdown(trigger, panel);
            }
        });

        opt.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const lang = opt.getAttribute("data-lang");
                if (lang) {
                    changeLanguage(lang);
                    closeDropdown(trigger, panel);
                }
            }
        });
    });

    document.addEventListener("click", () => {
        if (!panel.hidden) {
            panel.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
        }
    });
}

export { EVENT_LANGUAGE_CHANGED };
