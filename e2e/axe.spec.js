// @ts-check
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const THEME_MENU_ITEM = {
    light: "claro",
    dark: "oscuro",
};

const PLAYERS = [
    { label: "Lebron James", radioName: "Lebron James Lebron James" },
    { label: "Anthony Davis", radioName: "Anthony Davis Anthony Davis" },
    { label: "Damian Lillard", radioName: "Damian Lillard Damian Lillard" },
    { label: "Jimmy Butler", radioName: "Jimmy Butler Jimmy Butler" },
    {
        label: "Giannis Antetokoumpo",
        radioName: "Giannis Antetokoumpo Giannis",
    },
    { label: "Kawhi Leonard", radioName: "Kawhi Leonard Kawhi Leonard" },
];

async function setTheme(page, theme) {
    await page.goto("/");

    await page.getByRole("button", { name: "Seleccionar tema" }).click();

    await page.getByRole("menuitem", { name: `Tema ${theme}` }).click();
}

async function expectNoA11yViolations(page) {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
}

async function selectPlayer(page, player) {
    await page.getByRole("button", { name: "Jugar" }).click();

    await page.getByRole("radio", { name: player }).click();
}

async function navigateToCombat(page) {
    await page.route("**/nbamon/*/posicion", async (route) => {
        const body = route.request().postDataJSON();
        await route.fulfill({
            contentType: "application/json",
            body: JSON.stringify({
                enemigos: [
                    {
                        id: "fake-enemy",
                        nbamon: { nombre: "Lebron James" },
                        x: body.x,
                        y: body.y,
                    },
                ],
            }),
        });
    });

    await selectPlayer(page, "Lebron James Lebron James");

    await page
        .getByRole("button", { name: "Seleccionar", exact: true })
        .click();

    await page.locator("#seleccionar-tiro").waitFor({ state: "visible" });
}

test.describe("spa accessibility by theme", () => {
    for (const themeProperty in THEME_MENU_ITEM) {
        const theme = THEME_MENU_ITEM[themeProperty];

        test(`should not have any automatically detectable accessibility issues in welcome page ${theme === "oscuro" ? "(dark)" : ""}`, async ({
            page,
        }) => {
            await setTheme(page, theme);

            await expectNoA11yViolations(page);
        });

        test(`should not have any automatically detectable accessibility issues in player selection ${theme === "oscuro" ? "(dark)" : ""}`, async ({
            page,
        }) => {
            await setTheme(page, theme);

            await page.getByRole("button", { name: "Jugar" }).click();

            await expectNoA11yViolations(page);
        });

        test(`should not have any automatically detectable accessibility issues in canvas ${theme === "oscuro" ? "(dark)" : ""}`, async ({
            page,
        }) => {
            await setTheme(page, theme);

            await selectPlayer(page, "Lebron James Lebron James");

            await page
                .getByRole("button", { name: "Seleccionar", exact: true })
                .click();

            await expectNoA11yViolations(page);
        });

        test(`should not have any automatically detectable accessibility issues in combat shot selection ${theme === "oscuro" ? "(dark)" : ""}`, async ({
            page,
        }) => {
            await setTheme(page, theme);

            await navigateToCombat(page);

            await expectNoA11yViolations(page);
        });

        test(`should not have any automatically detectable accessibility issues in combat results ${theme === "oscuro" ? "(dark)" : ""}`, async ({
            page,
        }) => {
            await setTheme(page, theme);

            await navigateToCombat(page);

            await page.route("**/nbamon/*/ataques", async (route) => {
                if (route.request().method() === "GET") {
                    await route.fulfill({
                        contentType: "application/json",
                        body: JSON.stringify({
                            ataques: ["MATE", "PASE", "TAPÓN", "MATE", "PASE"],
                        }),
                    });
                } else {
                    await route.continue();
                }
            });

            const shotButtons = page.locator(".boton-de-tiro");
            for (let i = 0; i < 5; i++) {
                await shotButtons.nth(i).click();
            }

            await page
                .getByRole("button", { name: "Reiniciar" })
                .waitFor({ state: "visible" });

            await expectNoA11yViolations(page);
        });
    }
});

test.describe("player selection accessibility by theme and by player", () => {
    for (const themeProperty in THEME_MENU_ITEM) {
        const theme = THEME_MENU_ITEM[themeProperty];

        for (const player of PLAYERS) {
            test(`should not have any automatically detectable accessibility issues selecting ${player.label} ${theme === "oscuro" ? "(dark)" : ""}`, async ({
                page,
            }) => {
                await setTheme(page, theme);

                await selectPlayer(page, player.radioName);

                await expectNoA11yViolations(page);
            });
        }
    }
});
