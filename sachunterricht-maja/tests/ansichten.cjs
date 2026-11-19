"use strict";
const { expect } = require("playwright/test");
const fs = require("node:fs/promises");
const path = require("node:path");
const baseline = path.join(__dirname, "ansichten.json");
module.exports = async function views(browser, base) {
  if(process.env.VIEW_REFERENCE){
    const expected = await capture(browser, base+"visual-reference/", {}, true);
    await capture(browser,base,expected,false);
    return;
  }
  const update = process.env.UPDATE_VIEW_BASELINES === "1";
  const known = update ? {} : JSON.parse(await fs.readFile(baseline, "utf8"));
  await capture(browser,base,known,update);
  if(update)await fs.writeFile(baseline,JSON.stringify(known)+"\n");
};
async function capture(browser,base,known,update){
  const output = process.env.VIEW_OUTPUT;
  if (output) await fs.mkdir(output, { recursive: true });
  const context = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const sampler = await context.newPage();
  try {
    for (const [name, route, width, height, media] of [
      ["handy-baumhaus", "baumhaus/schrank", 390, 820, "screen"],
      ["tablet-korn", "korn", 820, 1000, "screen"],
      ["pc-lerntafel", "tafel/fruehstueck", 1280, 850, "screen"],
      ["druck-comic", "comic", 794, 1123, "print"],
      ["druck-arbeit", "ergebnis/1", 794, 1123, "print"],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto(base + "#" + route);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      if (route === "comic")
        await page
          .locator("#comic-text-0")
          .fill(
            "Heute entdecken wir, welche Lebensmittel auf unserer Picknickdecke liegen. ".repeat(
              3,
            ),
          );
      if(route==="ergebnis/1"){
        await page.evaluate(()=>{
          const exam=examEdition(0);
          state.results[0]={edition:ausgabe, best:8,score:8,partial:8,bestPoints:8,answers:exam.tasks.map(([,q])=>q.correct),written:exam.written.map(q=>({text:q.beispiel,paper:false}))};
          render(false);
        });
        await expect(page.locator(".review-row")).toHaveCount(10);
      }
      if (name === "handy-baumhaus")
        await page.evaluate(() => {
          state.preferences.size = 130;
          applyPreferences();
        });
      await page.emulateMedia({ media });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images]
            .filter((i) => i.getBoundingClientRect().width)
            .map((i) => i.decode()),
        );
      });
      await expect(page.locator("h1")).toBeVisible();
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )
      )
        throw Error(name + ": Seite zu breit");
      if (route === "comic")
        await expect(page.locator("#comic-print-0")).toContainText(
          "Picknickdecke",
        );
      const png = await page.screenshot({
        animations: "disabled",
        fullPage: media === "print",
      });
      if (output) await fs.writeFile(path.join(output, name + ".png"), png);
      const samples = await sampler.evaluate(async (data) => {
        const img = new Image();
        img.src = "data:image/png;base64," + data;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = 16;
        c.height = 24;
        const ctx = c.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, 16, 24);
        return Array.from(ctx.getImageData(0, 0, 16, 24).data).filter(
          (_, i) => i % 4 !== 3,
        );
      }, png.toString("base64"));
      if (update) known[name] = samples;
      else {
        const diff =
          samples.reduce((sum, n, i) => sum + Math.abs(n - known[name][i]), 0) /
          samples.length;
        if (diff > 12)
          throw Error(
            name +
              ": Bild weicht von der geprüften Ansicht ab (" +
              diff.toFixed(1) +
              ")",
          );
      }
    }
    return known;
  } finally {
    await context.close();
  }
};
