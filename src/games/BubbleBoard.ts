import { Random } from "../core/Random";
export type Cell = [number, number];
export const COLS = 7,
  ROWS = 9;
export function triangle(x: number, y: number): Cell[] {
  const i = Math.floor(x / 2);
  if (y % 2 === 0)
    return x % 2 === 0
      ? [
          [i, y],
          [i + 1, y],
          [i, y + 1],
        ]
      : [
          [i + 1, y],
          [i + 1, y + 1],
          [i, y + 1],
        ];
  return x % 2 === 0
    ? [
        [i, y],
        [i + 1, y + 1],
        [i, y + 1],
      ]
    : [
        [i, y],
        [i + 1, y],
        [i + 1, y + 1],
      ];
}
export function bubblePosition(x: number, y: number): Cell {
  return [9 + x * 16 + (y % 2) * 8, 40 + y * 13];
}
export class BubbleBoard {
  cells: number[][];
  random: Random;
  constructor(seed = 510) {
    this.random = new Random(seed);
    this.cells = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => this.random.next(7)),
    );
    for (let i = 0; i < 100; i++) {
      const m = this.matches();
      if (!m.length) break;
      this.refill(m);
    }
  }
  rotate(x: number, y: number, reverse = false) {
    if (x < 0 || x > 11 || y < 0 || y > 7) return false;
    const c = triangle(x, y);
    const values = c.map(([a, b]) => this.cells[b][a]);
    c.forEach(
      ([a, b], i) => (this.cells[b][a] = values[(i + (reverse ? 1 : 2)) % 3]),
    );
    return true;
  }
  matches(): Cell[] {
    const result = new Map<string, Cell>();
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        const lines: Cell[][] = [
          [
            [x, y],
            [x + 1, y],
            [x + 2, y],
          ],
          [
            [x, y],
            [x + (y % 2), y + 1],
            [x + 1, y + 2],
          ],
          [
            [x, y],
            [x - 1 + (y % 2), y + 1],
            [x - 1, y + 2],
          ],
        ];
        for (const line of lines)
          if (
            line.every(
              ([a, b]) =>
                a >= 0 &&
                a < COLS &&
                b < ROWS &&
                this.cells[b][a] === this.cells[y][x],
            )
          )
            line.forEach((c) => result.set(c.join(","), c));
      }
    return [...result.values()];
  }
  refill(removed: Cell[]) {
    for (let x = 0; x < COLS; x++) {
      const drop = new Set(removed.filter((c) => c[0] === x).map((c) => c[1]));
      const keep = this.cells.map((r) => r[x]).filter((_, y) => !drop.has(y));
      while (keep.length < ROWS) keep.unshift(this.random.next(7));
      keep.forEach((v, y) => (this.cells[y][x] = v));
    }
  }
}
