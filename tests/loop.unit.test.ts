import { it, expect, vi } from "vitest";
import { GameLoop } from "../src/core/GameLoop";
it("simulates a fixed step at 60/90/120 Hz and drops long stalls", () => {
  vi.stubGlobal("requestAnimationFrame", () => 0);
  for (const hz of [60, 90, 120]) {
    let elapsed = 0;
    const loop = new GameLoop(
      (dt) => (elapsed += dt),
      () => {},
    );
    loop.frame(0);
    for (let i = 1; i <= hz * 5; i++) loop.frame((i * 1000) / hz);
    expect(elapsed).toBeCloseTo(5, 1);
    const before = elapsed;
    loop.paused = true;
    loop.frame(100000);
    expect(elapsed).toBe(before);
    loop.reset();
    loop.paused = false;
    loop.frame(200000);
    expect(elapsed).toBe(before);
    loop.frame(201000);
    expect(elapsed - before).toBeLessThanOrEqual(0.101);
  }
  vi.unstubAllGlobals();
});
