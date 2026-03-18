/**
 * Gestión de temas light/dark/system.
 * Usa variables CSS y data-theme en <html>.
 */

const THEMES = ["light", "dark", "system"];
const STORAGE_KEY = "theme";

const THEME_ICONS = {
    light: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z",
    dark: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
    system: "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
};

function getStoredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : null;
}

function applyTheme(theme) {
    if (!THEMES.includes(theme)) return;
    document.documentElement.setAttribute("data-theme", theme);
    const isLight =
        theme === "light" ||
        (theme === "system" &&
            !window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("effective-theme-light", isLight);
    localStorage.setItem(STORAGE_KEY, theme);
}

function updateTriggerIcon(theme) {
    const iconSvg = document.getElementById("theme-trigger-icon");
    if (!iconSvg) return;
    const path = iconSvg.querySelector("path");
    if (path) path.setAttribute("d", THEME_ICONS[theme] ?? THEME_ICONS.system);
}

function updateActiveOption() {
    const panel = document.getElementById("theme-panel");
    if (!panel) return;
    const theme = getStoredTheme() ?? "system";
    panel.querySelectorAll(".theme-dropdown-option").forEach((opt) => {
        const isActive = opt.getAttribute("data-theme") === theme;
        opt.setAttribute("aria-current", isActive ? "true" : "false");
    });
}

function openDropdown(trigger, panel) {
    closeLangDropdownIfOpen();
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    const items = [...panel.querySelectorAll(".theme-dropdown-option")];
    if (items.length) items[0].focus();
}

function closeLangDropdownIfOpen() {
    const langPanel = document.getElementById("lang-panel");
    const langTrigger = document.getElementById("lang-trigger");
    if (langPanel && !langPanel.hidden) {
        langPanel.hidden = true;
        langTrigger?.setAttribute("aria-expanded", "false");
    }
}

function closeDropdown(trigger, panel) {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
}

function selectTheme(theme, trigger, panel) {
    applyTheme(theme);
    updateTriggerIcon(theme);
    updateActiveOption();
    closeDropdown(trigger, panel);
}

export function initTheme() {
    const stored = getStoredTheme();
    const theme = stored ?? "system";
    applyTheme(theme);
    updateTriggerIcon(theme);

    const trigger = document.getElementById("theme-trigger");
    const panel = document.getElementById("theme-panel");
    if (!trigger || !panel) return;

    updateActiveOption();

    const items = [...panel.querySelectorAll(".theme-dropdown-option")];

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        if (panel.hidden === false) {
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
                e.stopPropagation();
                const next =
                    currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                items[next].focus();
                break;
            }
            case "ArrowUp": {
                e.preventDefault();
                e.stopPropagation();
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
            const themeName = opt.getAttribute("data-theme");
            if (THEMES.includes(themeName)) {
                selectTheme(themeName, trigger, panel);
            }
        });

        opt.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const themeName = opt.getAttribute("data-theme");
                if (THEMES.includes(themeName)) {
                    selectTheme(themeName, trigger, panel);
                }
            }
        });
    });

    document.addEventListener("click", (e) => {
        const dropdown = document.getElementById("theme-dropdown");
        if (dropdown && !dropdown.contains(e.target) && !panel.hidden) {
            panel.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
        }
    });

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
            applyTheme(getStoredTheme() ?? "system");
        });
}
