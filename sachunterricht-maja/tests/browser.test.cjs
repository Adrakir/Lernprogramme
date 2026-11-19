"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const { expect } = require("playwright/test");
const root = path.resolve(__dirname, "..");
const fileMode = process.env.APP_FILE_MODE === "1";
let server;

async function main() {
  let base;
  if (fileMode) base = pathToFileURL(path.join(root, "index.html")).href;
  else {
    server = http.createServer(async (req, res) => {
      const relative = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const target = path.resolve(root, "." + (relative === "/" ? "/index.html" : relative));
      if (!target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
      try {
        const types = { ".js": "text/javascript", ".html": "text/html", ".css": "text/css", ".webp": "image/webp" };
        res.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
        res.end(await fs.readFile(target));
      } catch { res.writeHead(404); res.end(); }
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    base = "http://127.0.0.1:" + server.address().port + "/";
  }
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
    args: ["--no-sandbox"],
  });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    async function go(route) { await page.goto(base + "#" + route); await expect(page.locator("h1")).toBeVisible(); }
    await go("bildkarten");
    await expect(page.locator(".food-card")).toHaveCount(9);
    await page.locator('[data-extra="card-group"][data-value="7"]').click();
    await expect(page.locator("#extra-area")).toContainText("✓ Richtig");
    await go("fruehstueck-frei");
    for (const value of [0, 1, 3, 4]) await page.locator('[data-extra="breakfast-food"][data-value="' + value + '"]').click();
    await page.getByRole("button", { name: "Frühstück prüfen" }).click();
    await expect(page.locator("#extra-area")).toContainText("Alle vier Bausteine");
    await go("station/labor/2/zuordnen");
    const matching = ["Kohlenhydrate", "Mineralstoffe", "Fett", "Flüssigkeit", "Eiweiß", "Vitamine", "Ballaststoffe"];
    for (let i = 0; i < matching.length; i++) await page.locator("#body-match-" + i).selectOption(matching[i]);
    await page.getByRole("button", { name: "Zuordnung prüfen" }).click();
    await expect(page.locator(".body-word")).toHaveText("K A L O R I E");
    await go("station/fit/4");
    await page.locator('input[value="0"]').check();
    await page.getByRole("button", { name: "Antwort prüfen" }).click();
    await expect(page.locator("#score-number")).toHaveText("0");
    await page.getByRole("button", { name: "Ähnliche Aufgabe" }).click();
    await page.locator('input[value="1"]').check();
    await page.getByRole("button", { name: "Antwort prüfen" }).click();
    await expect(page.locator("#score-number")).toHaveText("1");
    await go("pruefung/1");
    for (let i = 0; i < 8; i++) {
      await page.locator('input[name="answer"]').first().check();
      await page.getByRole("button", { name: "Weiter →", exact: true }).click();
    }
    await page.getByLabel("Deine Antwort").fill("Mein Beispiel: <Maja> & Bärli");
    await page.reload();
    await expect(page.getByLabel("Deine Antwort")).toHaveValue("Mein Beispiel: <Maja> & Bärli");
    await page.getByRole("button", { name: "Weiter →", exact: true }).click();
    await page.getByLabel("Ich habe im Heft geantwortet.").check();
    await page.getByRole("button", { name: "Arbeit abgeben" }).click();
    await expect(page.locator(".written-review")).toHaveCount(2);
    await page.locator("[data-criterion]").first().check();
    await page.reload();
    await expect(page.locator("[data-criterion]").first()).toBeChecked();
    await go("entdecken/zucker");
    await page.getByLabel("Meine Entdeckung").fill("4 g je 100 ml");
    await page.reload();
    await expect(page.getByLabel("Meine Entdeckung")).toHaveValue("4 g je 100 ml");
    await go("kurzrunde");
    for (let i = 0; i < 3; i++) {
      await page.locator('input[name="answer"]').first().check();
      await page.getByRole("button", { name: "Antwort prüfen" }).click();
      await page.getByRole("button", { name: "Weiter →", exact: true }).click();
    }
    await expect(page.locator(".round-finish")).toContainText("Lernrunde geschafft");
    await go("einstellungen");
    await page.getByLabel("Schriftgröße").selectOption("130");
    await page.reload();
    await expect(page.getByLabel("Schriftgröße")).toHaveValue("130");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Sicherung herunterladen" }).click();
    const downloaded = await downloadPromise;
    const data = await fs.readFile(await downloaded.path(), "utf8");
    await page.locator("#import-state").setInputFiles({ name: "test.json", mimeType: "application/json", buffer: Buffer.from(data) });
    await page.getByRole("button", { name: "Diesen Lernstand übernehmen" }).click();
    await expect(page.locator("#settings-status")).toContainText("übernommen");
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ["start", "eltern", "bildkarten", "fortschritt", "niveau/zucker/3"]) {
        await go(route);
        const layout = await page.evaluate(() => ({
          fits: document.documentElement.scrollWidth <= innerWidth,
          wide: [...document.querySelectorAll("body *")].filter(node => node.scrollWidth > node.clientWidth + 1).map(node => [node.tagName, node.className, node.textContent.slice(0, 50)]).slice(-12),
        }));
        assert.ok(layout.fits, width + " " + route + " " + JSON.stringify(layout.wide));
      }
    }
    // Chromium's accessibility tree reports semantic names and keyboard focus.
    await go("baerli");
    await page.getByRole("button", { name: "Hinweis", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Hinweis", exact: true })).toBeFocused();
    await expect(page.locator(".reveal")).toContainText("Calcium");
    if (!fileMode) {
      await page.waitForFunction(async () => {
        const registration = await navigator.serviceWorker.ready;
        return Boolean(registration.active);
      });
      await page.reload();
      await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
      await context.setOffline(true);
      await page.reload();
      await go("bildkarten");
      await page.reload();
      await page.locator(".food-picture").first().evaluate(image => image.decode());
      await expect(page.locator(".food-card")).toHaveCount(9);
      await go("pruefung/2");
      await expect(page.locator(".question")).toBeVisible();
      const offlinePage = await context.newPage();
      await offlinePage.goto(base + "#pruefung/3");
      await expect(offlinePage.locator(".question")).toBeVisible();
      await offlinePage.close();
      await context.setOffline(false);
    }
    const recoveryContext = await browser.newContext();
    await recoveryContext.addInitScript(() => {
      if (localStorage.getItem("recovery-seeded")) return;
      localStorage.setItem("recovery-seeded", "1");
      localStorage.setItem("majas-sachunterricht-v1", "{kaputt");
      localStorage.setItem("majas-sachunterricht-v1-vorher", JSON.stringify({
        done: { fit: true }, drafts: {}, results: {}, last: "fit", theme: "dark",
      }));
    });
    const recoveryPage = await recoveryContext.newPage();
    await recoveryPage.goto(base + "#fortschritt");
    await expect(recoveryPage.locator("#score-number")).toHaveText("1");
    await expect(recoveryPage.locator("#storage-banner")).toBeVisible();
    await expect(recoveryPage.locator("html")).toHaveAttribute("data-theme", "dark");
    await recoveryContext.close();
    assert.deepEqual(errors, []);
    console.log("Browserabläufe, Speicherung, Druckansichten, Schriftgröße, Import/Export, Tastatur und " + (fileMode ? "lokale Ressourcen" : "Offline-Nutzung") + " geprüft.");
    await context.close();
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server?.close());
