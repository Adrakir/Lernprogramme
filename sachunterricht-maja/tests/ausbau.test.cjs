"use strict";
const { expect } = require("playwright/test");
const assert = require("node:assert/strict");
module.exports = async function checkWorkshop(page, context, base) {
  const visit = async (path) => {
    await page.goto(base + "#" + path);
    await expect(page.locator("h1")).toBeVisible();
  };
  await visit("korn");
  await page.getByRole("button", { name: "2 · Mehlkörper" }).click();
  await expect(page.locator("#grain-note")).toContainText("Stärke");
  await page.getByRole("link", { name: "Jetzt selbst beschriften" }).click();
  for (let n = 0; n < 3; n++)
    await page.locator('[data-grain="' + n + '"]').selectOption(String(n));
  await page.getByRole("button", { name: "Beschriftung prüfen" }).click();
  await expect(page.locator("#grain-note")).toContainText(
    "Richtig beschriftet",
  );
  await visit("familienrunde");
  for (const option of ["Haferflocken", "Apfelstücke"]) {
    await page.getByRole("button", { name: option, exact: true }).click();
    await page.getByRole("button", { name: "Weiter", exact: true }).click();
  }
  await page.getByRole("button", { name: "Runde beenden" }).click();
  await expect(page.locator("#five-step")).toContainText("Für heute geschafft");
  await visit("brotwerkstatt");
  await page.locator("#prediction").selectOption("3");
  await page.locator("[data-top-check]").click();
  await expect(page.locator("#sandwich-result")).toContainText(
    "Vorhersage stimmt",
  );
  await visit("station/labor/2/zuordnen");
  await page.getByRole("button",{name:"Bärlis Hinweis zu Aufgabe 2",exact:true}).click();
  await page.getByRole("button",{name:"Bärlis Hinweis zu Aufgabe 2",exact:true}).click();
  await expect(page.locator(".body-matching li").nth(1).locator(".reveal")).toContainText("Naturjoghurt");
  await page.getByLabel(/Du bewegst dich viel/).selectOption("Fett");
  await page.getByLabel(/Energie als Reserve/).selectOption("Kohlenhydrate");
  await page.getByRole("button", { name: "Zuordnung prüfen" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#body-status")).toBeFocused();
  await expect(page.locator("#body-status")).toContainText("vertauscht");
  await visit("bericht");
  await expect(page.locator("main")).toContainText("5 offene Zuordnung");
  await visit("baumhaus/schrank");
  await page.locator('[data-equip="sonnenhut"]').click();
  await page.reload();
  await expect(page.locator('[data-equip="sonnenhut"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await visit("baumhaus/laden");
  await expect(page.locator(".room-items")).toContainText("Sitzsack");
  await visit("einstellungen");
  const exported = page.waitForEvent("download");
  await page.locator('[data-extra="export"]').click();
  const bytes = await require("node:fs/promises").readFile(
    await (await exported).path(),
  );
  await page
    .locator("#import-state")
    .setInputFiles({
      name: "test.json",
      mimeType: "application/json",
      buffer: bytes,
    });
  await expect(page.locator("#import-preview")).toContainText(
    "Ballaststoffe helfen",
  );
  await page.locator("[data-new-import]").click();
  await expect(page.locator(".notebook")).toContainText("Ballaststoffe helfen");
  await visit("profile");
  await page.locator("#profile-select").selectOption("standard");
  await visit("fehlertraining/1/0");
  await page.locator("input[name=answer]").first().check();
  await page.locator("[data-transfer]").click();
  await expect(page.locator(".mini-status")).not.toBeEmpty();
  const other = await context.newPage();
  await other.goto(base + "#lernweg");
  await visit("forscherheft");
  await page.getByLabel("Mein Merksatz").fill("Gemeinsam gespeichert");
  await Promise.all([
    page
      .locator('[data-lab="note-save"],[data-lab="note-add"]')
      .first()
      .click(),
    other.locator('[data-lab="plan-add"][data-value="labor"]').click(),
  ]);
  await page.reload();
  await expect(page.locator(".notebook")).toContainText(
    "Gemeinsam gespeichert",
  );
  await other.reload();
  await expect(other.locator(".planned-path")).toContainText("Nährstoff");
  await other.close();
  const archiveCheck = await page.evaluate(() => {
    const historical = JSON.parse(JSON.stringify(state.results[0]));
    const before = normalizeState({ results: { 0: historical } }).results[0];
    [historical.taskIds[0],historical.taskIds[1]]=[historical.taskIds[1],historical.taskIds[0]];
    [historical.answers[0],historical.answers[1]]=[historical.answers[1],historical.answers[0]];
    const removed = pruefungen[0].tasks.shift();
    try {
      const after = normalizeState({ results: { 0: historical } }).results[0];
      return (
        before.score === after.score &&
        JSON.stringify(after.answers) === JSON.stringify(before.answers) &&
        after.taskIds.length === 10
      );
    } finally {
      pruefungen[0].tasks.unshift(removed);
    }
  });
  assert.ok(archiveCheck);
};
