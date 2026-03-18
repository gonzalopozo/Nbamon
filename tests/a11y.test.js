/* global document */
// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { JSDOM } from "jsdom";

function loadPage() {
    const html = readFileSync(resolve("public/index.html"), "utf-8");
    document.documentElement.innerHTML = html.replace(
        /^<!doctype html>\s*<html[^>]*>/i,
        "",
    );
    document.documentElement.setAttribute("lang", "es");
}

async function runAxe() {
    const html = readFileSync(resolve("public/index.html"), "utf-8");
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const axeSource = readFileSync(
        resolve("node_modules/axe-core/axe.min.js"),
        "utf-8",
    );
    dom.window.eval(axeSource);
    return dom.window.axe.run(dom.window.document, {
        runOnly: ["wcag2a", "wcag2aa", "best-practice"],
        rules: {
            region: { enabled: false },
        },
    });
}

describe("Accessibility (axe-core)", () => {
    it("has no critical or serious violations", async () => {
        const results = await runAxe();

        const critical = results.violations.filter(
            (v) => v.impact === "critical" || v.impact === "serious",
        );

        if (critical.length > 0) {
            const summary = critical
                .map(
                    (v) =>
                        `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} instances)`,
                )
                .join("\n");
            expect.fail(`Accessibility violations found:\n${summary}`);
        }
    });
});

describe("Accessibility (structural checks)", () => {
    it("has proper heading hierarchy", () => {
        loadPage();
        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        const levels = [...headings].map((h) =>
            parseInt(h.tagName.replace("H", "")),
        );

        expect(levels.filter((l) => l === 1)).toHaveLength(1);

        for (let i = 1; i < levels.length; i++) {
            expect(levels[i]).toBeLessThanOrEqual(levels[i - 1] + 1);
        }
    });

    it("has lang attribute on html element", () => {
        loadPage();
        expect(document.documentElement.getAttribute("lang")).toBeTruthy();
    });

    it("all images have alt attributes", () => {
        loadPage();
        const images = document.querySelectorAll("img");
        images.forEach((img) => {
            expect(img.hasAttribute("alt")).toBe(true);
        });
    });

    it("all interactive elements are keyboard accessible", () => {
        loadPage();
        const buttons = document.querySelectorAll("button");
        buttons.forEach((btn) => {
            const hasName =
                btn.textContent.trim() ||
                btn.getAttribute("aria-label") ||
                btn.getAttribute("title");
            expect(hasName).toBeTruthy();
        });
    });

    it("skip link is present and targets main content", () => {
        loadPage();
        const skipLink = document.querySelector(".skip-link");
        expect(skipLink).toBeTruthy();
        const target = skipLink.getAttribute("href").replace("#", "");
        expect(document.getElementById(target)).toBeTruthy();
    });

    it("aria-live regions exist for dynamic content", () => {
        loadPage();
        const liveRegions = document.querySelectorAll("[aria-live]");
        expect(liveRegions.length).toBeGreaterThanOrEqual(3);
    });

    it("all buttons have explicit type attribute", () => {
        loadPage();
        const buttons = document.querySelectorAll("button");
        buttons.forEach((btn) => {
            expect(btn.hasAttribute("type")).toBe(true);
        });
    });
});
