import { describe, it, expect } from "vitest";
import { BubbleBoard, triangle } from "../src/games/BubbleBoard";
import { BubbleSmileGame } from "../src/games/BubbleSmileGame";
import { Fun2LinkGame, pipeExit } from "../src/games/Fun2LinkGame";
import { keyAction, pixelScale } from "../src/core/Input";
import { Storage } from "../src/core/Storage";

describe("BubbleSmile", () => {
  it("has a stable deterministic 7 by 9 initial board without matches", () => {
    const b = new BubbleBoard();
    expect(b.cells).toHaveLength(9);
    expect(b.cells.every((r) => r.length === 7)).toBe(true);
    expect(b.matches()).toEqual([]);
    expect(new BubbleBoard().cells).toEqual(b.cells);
  });
  it("rotates each triangular selection and reverses it exactly", () => {
    const b = new BubbleBoard();
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 12; x++) {
        const before = structuredClone(b.cells);
        expect(triangle(x, y)).toHaveLength(3);
        b.rotate(x, y);
        b.rotate(x, y, true);
        expect(b.cells).toEqual(before);
      }
  });
  it("rejects boundary interactions without changing board", () => {
    const b = new BubbleBoard();
    const before = structuredClone(b.cells);
    expect(b.rotate(12, 0)).toBe(false);
    expect(b.rotate(-1, 0)).toBe(false);
    expect(b.cells).toEqual(before);
  });
  it("finds horizontal and both staggered diagonal triples", () => {
    const b = new BubbleBoard();
    b.cells[0][0] = b.cells[0][1] = b.cells[0][2] = 9;
    expect(b.matches()).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    );
    b.cells[2][3] = b.cells[3][3] = b.cells[4][4] = 10;
    expect(b.matches()).toEqual(
      expect.arrayContaining([
        [3, 2],
        [3, 3],
        [4, 4],
      ]),
    );
    b.cells[4][3] = b.cells[5][2] = b.cells[6][2] = 11;
    expect(b.matches()).toEqual(
      expect.arrayContaining([
        [3, 4],
        [2, 5],
        [2, 6],
      ]),
    );
  });
  it("drops and replenishes removed cells without changing other columns", () => {
    const b = new BubbleBoard();
    const before = b.cells.map((r) => r[1]);
    const bottom = b.cells[8][0];
    b.refill([
      [0, 4],
      [0, 5],
    ]);
    expect(b.cells.map((r) => r[1])).toEqual(before);
    expect(b.cells[8][0]).toBe(bottom);
    expect(b.cells.flat().every(Number.isInteger)).toBe(true);
  });
  it("scores matches and animates removal with input locked", () => {
    const g = new BubbleSmileGame();
    g.action();
    const x = g.x;
    g.move(1, 0);
    expect(g.x).toBe(x);
    g.board.cells[8][0] = g.board.cells[8][1] = g.board.cells[8][2] = 9;
    g.update(0.19);
    expect(g.score).toBeGreaterThanOrEqual(30);
    expect(g.phase).toBe("clear");
    g.update(0.23);
    expect(g.board.cells.flat()).not.toContain(9);
  });
  it("clears a level, progresses, loses on time, and restarts", () => {
    const g = new BubbleSmileGame();
    g.score = 300;
    g.phase = "rotate";
    g.phaseTime = 0;
    g.update(0.01);
    expect(g.status).toBe("clear");
    g.next();
    expect(g.level).toBe(2);
    expect(g.remaining).toBe(85);
    g.update(86);
    expect(g.status).toBe("over");
    g.restart();
    expect(g.score).toBe(0);
    expect(g.status).toBe("playing");
  });
});
describe("Fun2Link", () => {
  it("initializes deterministic board and queue", () => {
    const g = new Fun2LinkGame();
    expect(g.board).toHaveLength(6);
    expect(g.board[0]).toHaveLength(8);
    expect(g.queue).toHaveLength(4);
    expect(g.queue).toEqual(new Fun2LinkGame().queue);
  });
  it("validates ports, turns, and independent crossing channels", () => {
    expect(pipeExit(5, 3)).toBe(1);
    expect(pipeExit(5, 0)).toBeUndefined();
    expect(pipeExit(1, 1)).toBe(2);
    expect(pipeExit(7, 0)).toBe(2);
    expect(pipeExit(7, 3)).toBe(1);
  });
  it("places one piece, advances queue and forbids source, sink, wet and outside cells", () => {
    const g = new Fun2LinkGame();
    const q = g.queue.slice();
    expect(g.place(1, 1)).toBe(true);
    expect(g.board[1][1]).toBe(q[0]);
    expect(g.queue[0]).toBe(q[1]);
    expect(g.place(0, 1)).toBe(false);
    expect(g.place(7, 1)).toBe(false);
    expect(g.place(-1, 0)).toBe(false);
    g.wet[2][2] = 15;
    expect(g.place(2, 2)).toBe(false);
  });
  it("has a feasible generated route and queue for every stage tested", () => {
    const g = new Fun2LinkGame();
    for (let stage = 1; stage <= 12; stage++) {
      expect(g.level).toBe(stage);
      for (const [x, y] of g.route.slice(1, -1))
        expect(g.place(x, y)).toBe(true);
      g.fast = true;
      for (let i = 0; i < 1000 && g.status === "playing"; i++) g.update(1 / 60);
      expect(g.status).toBe("clear");
      expect(g.links).toBeGreaterThanOrEqual(g.minimum);
      expect(g.score).toBeGreaterThan(0);
      g.next();
    }
  });
  it("fails when water leaks; fast mode advances preparation; restart resets", () => {
    const g = new Fun2LinkGame();
    g.fast = true;
    g.update(2.1);
    expect(g.started).toBe(true);
    g.update(0.2);
    expect(g.status).toBe("over");
    g.restart();
    expect(g.status).toBe("playing");
    expect(g.remaining).toBe(20);
    expect(g.score).toBe(0);
  });
  it("rejects entry to a sink from the wrong direction or too short a route", () => {
    const g = new Fun2LinkGame();
    g.waterX = 6;
    g.waterY = 1;
    g.direction = 1;
    g.step();
    expect(g.status).toBe("over");
  });
  it("prevents reuse of the same crossing channel", () => {
    const g = new Fun2LinkGame();
    g.board[1][1] = 7;
    g.wet[1][1] = 10;
    g.step();
    expect(g.status).toBe("over");
  });
});
describe("shared adaptations", () => {
  it("maps keypad, arrow, confirm, secondary and escape inputs", () => {
    expect(keyAction("2")).toBe("up");
    expect(keyAction("ArrowLeft")).toBe("left");
    expect(keyAction("5")).toBe("action");
    expect(keyAction(" ")).toBe("secondary");
    expect(keyAction("Escape")).toBe("back");
    expect(keyAction("q")).toBeUndefined();
  });
  it("scales by integer pixels where possible, fits small viewports", () => {
    expect(pixelScale(390, 600)).toBe(3);
    expect(pixelScale(100, 100)).toBe(0.625);
  });
  it("separates game scores and tolerates unavailable local storage", () => {
    const s = new Storage();
    expect(s.read("missing", false)).toBe(false);
    expect(() => s.write("sound", true)).not.toThrow();
    expect(s.high("bubblesmile", 80)).toBe(80);
  });
});

describe("refresh-independent engine timing", () => {
  it("gives the same countdown at 60, 90 and 120 Hz", () => {
    const results = [60, 90, 120].map((hz) => {
      const g = new BubbleSmileGame();
      for (let i = 0; i < hz * 10; i++) g.update(1 / hz);
      return g.remaining;
    });
    results.forEach((time) => expect(time).toBeCloseTo(80, 6));
  });
});
