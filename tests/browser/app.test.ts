import { test, expect } from "@playwright/test";
test("launcher, both engines, keyboard, pause, restart and persistence", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("aria-label", /Games & More/);
  await canvas.focus();
  await page.keyboard.press("Enter");
  await expect(canvas).toHaveAttribute("aria-label", /bubblesmile playing/);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(550);
  await page.keyboard.press("Escape");
  await expect(canvas).toHaveAttribute("aria-label", /paused/);
  await page.keyboard.press("Enter");
  await expect(canvas).toHaveAttribute("aria-label", /playing/);
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(canvas).toHaveAttribute("aria-label", /score 0 level 1/);
  await page.getByRole("button", { name: "Games", exact: true }).click();
  await canvas.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(canvas).toHaveAttribute("aria-label", /fun2link playing/);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Sound off" }).click();
  await expect(page.getByRole("button", { name: "Sound on" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await expect(canvas).toHaveAttribute("aria-label", /selected Fun2Link/);
  await expect(page.getByRole("button", { name: "Sound on" })).toBeVisible();
  expect(errors).toEqual([]);
});
test("pointer navigation, placement and resizing preserve aspect ratio", async ({
  page,
}) => {
  await page.goto("./");
  const c = page.locator("canvas");
  let b = (await c.boundingBox())!;
  await c.click({ position: { x: b.width * 0.4, y: (b.height * 78) / 160 } });
  await expect(c).toHaveAttribute("aria-label", /fun2link/);
  await c.click({
    position: { x: (b.width * 24) / 128, y: (b.height * 62) / 160 },
  });
  await c.screenshot({
    path: `test-results/link-${test.info().project.name}.png`,
  });
  await page.getByRole("button", { name: "Games", exact: true }).click();
  b = (await c.boundingBox())!;
  await c.click({ position: { x: b.width * 0.4, y: (b.height * 53) / 160 } });
  await expect(c).toHaveAttribute("aria-label", /bubblesmile/);
  await c.click({ position: { x: b.width * 0.4, y: b.height * 0.4 } });
  await c.click({ position: { x: b.width * 0.4, y: b.height * 0.4 } });
  await page.waitForTimeout(500);
  await c.screenshot({
    path: `test-results/bubble-${test.info().project.name}.png`,
  });
  await page.setViewportSize({ width: 320, height: 568 });
  b = (await c.boundingBox())!;
  expect(b.width / b.height).toBeCloseTo(0.8, 3);
  expect(b.width).toBeLessThanOrEqual(320);
});
test("offline production reload, both games and isolated high scores", async ({
  page,
  context,
}) => {
  await page.goto("./");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  await page.evaluate(() => {
    localStorage.setItem("p510:bubblesmile:high", "123");
    localStorage.setItem("p510:fun2link:high", "456");
  });
  await context.setOffline(true);
  await page.reload();
  const c = page.locator("canvas");
  await expect(c).toHaveAttribute("aria-label", /Games & More selected/);
  await c.focus();
  await page.keyboard.press("Enter");
  await expect(c).toHaveAttribute("aria-label", /bubblesmile playing/);
  await page.getByRole("button", { name: "Games", exact: true }).click();
  await c.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(c).toHaveAttribute("aria-label", /fun2link playing/);
  expect(
    await page.evaluate(() => [
      localStorage.getItem("p510:bubblesmile:high"),
      localStorage.getItem("p510:fun2link:high"),
    ]),
  ).toEqual(["123", "456"]);
  await context.setOffline(false);
});
test("interrupted pointer does not activate a game", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  const c = page.locator("canvas");
  const b = (await c.boundingBox())!;
  await page.mouse.move(b.x + b.width * 0.4, b.y + (b.height * 53) / 160);
  await page.mouse.down();
  await c.dispatchEvent("pointercancel", { pointerId: 1, isPrimary: true });
  await page.mouse.up();
  await expect(c).toHaveAttribute("aria-label", /Games & More selected/);
  expect(errors).toEqual([]);
});
test("Fun2Link plays through a stage, advances, loses and restarts", async ({
  page,
}) => {
  await page.goto("./");
  const c = page.locator("canvas");
  await c.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  const b = (await c.boundingBox())!;
  for (let x = 1; x <= 6; x++)
    await c.click({
      position: { x: (b.width * (x * 16 + 8)) / 128, y: (b.height * 62) / 160 },
    });
  await page.getByRole("button", { name: "Fast / Slow" }).click();
  await expect(c).toHaveAttribute("aria-label", /clear score 1100 level 1/, {
    timeout: 8000,
  });
  await c.focus();
  await page.keyboard.press("Enter");
  await expect(c).toHaveAttribute("aria-label", /playing score 1100 level 2/);
  await page.keyboard.press("Space");
  await expect(c).toHaveAttribute("aria-label", /over/, { timeout: 7000 });
  await page.keyboard.press("Enter");
  await expect(c).toHaveAttribute("aria-label", /playing score 0 level 1/);
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("p510:fun2link:high") || "0"),
    ),
  ).toBe(1100);
});
test("mobile touch launches and pauses without scrolling", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile", "Touch-only adaptation");
  await page.goto("./");
  const c = page.locator("canvas"),
    b = (await c.boundingBox())!;
  await page.touchscreen.tap(b.x + b.width * 0.5, b.y + (b.height * 53) / 160);
  await expect(c).toHaveAttribute("aria-label", /bubblesmile playing/);
  await page.touchscreen.tap(b.x + b.width * 0.5, b.y + b.height * 0.5);
  await page.touchscreen.tap(b.x + b.width * 0.5, b.y + b.height * 0.5);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(c).toHaveAttribute("aria-label", /paused/);
  const before = await c.screenshot();
  await page.waitForTimeout(350);
  expect(await c.screenshot()).toEqual(before);
  await page.touchscreen.tap(b.x + b.width * 0.5, b.y + b.height * 0.5);
  await expect(c).toHaveAttribute("aria-label", /playing/);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("recorded pipe-game Back and # controls restore the launcher", async ({
  page,
}) => {
  await page.goto("./");
  const c = page.locator("canvas");
  await c.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(c).toHaveAttribute(
    "aria-label",
    /Games & More selected Fun2Link/,
  );
  await c.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("#");
  await expect(c).toHaveAttribute(
    "aria-label",
    /Games & More selected Fun2Link/,
  );
  await page.keyboard.press("Enter");
  const b = (await c.boundingBox())!;
  await c.click({
    position: { x: (b.width * 115) / 128, y: (b.height * 154) / 160 },
  });
  await expect(c).toHaveAttribute(
    "aria-label",
    /Games & More selected Fun2Link/,
  );
});
