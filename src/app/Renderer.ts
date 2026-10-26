import { text } from "../core/Font";
import { BubbleSmileGame } from "../games/BubbleSmileGame";
import { bubblePosition, triangle } from "../games/BubbleBoard";
import { Fun2LinkGame, PORTS } from "../games/Fun2LinkGame";
export const COLORS = [
  "#bc7837",
  "#338953",
  "#f6d74a",
  "#4b84db",
  "#cc69ae",
  "#e75c4b",
  "#98cc55",
];
export class Renderer {
  constructor(public ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
  }
  rect(x: number, y: number, w: number, h: number, c: string) {
    this.ctx.fillStyle = c;
    this.ctx.fillRect(x, y, w, h);
  }
  header(title: string) {
    this.rect(0, 0, 128, 160, "#dce9f6");
    this.rect(0, 0, 128, 16, "#163e88");
    text(this.ctx, title, 64, 5, "#fff", true);
  }
  soft(left: string, right: string) {
    this.rect(0, 148, 128, 12, "#163e88");
    text(this.ctx, left, 3, 151);
    text(this.ctx, right, 125 - right.length * 6, 151);
  }
  menu(selected: number, highs: number[]) {
    this.header("Games & More");
    for (let y = 18; y < 145; y++)
      this.rect(0, y, 128, 1, y % 4 === 0 ? "#cbdcee" : "#dce9f6");
    ["BubbleSmile", "Fun2Link"].forEach((s, i) => {
      const y = 43 + i * 25;
      this.rect(4, y, 120, 21, selected === i ? "#386cbb" : "#edf4fa");
      if (selected === i) {
        this.rect(4, y, 120, 1, "#8fb2f4");
        this.rect(4, y + 20, 120, 1, "#123e84");
      }
      text(
        this.ctx,
        `${i + 1}. ${s}`,
        10,
        y + 7,
        selected === i ? "#fff" : "#172d53",
      );
    });
    text(this.ctx, "SAMSUNG", 64, 23, "#254e83", true);
    text(this.ctx, "BEST " + highs[selected], 64, 112, "#35577e", true);
    this.soft("Select", "Help");
  }
  bubble(g: BubbleSmileGame) {
    this.header("BubbleSmile");
    text(this.ctx, `${g.score}`, 3, 20, "#18375b");
    text(this.ctx, `L${g.level}`, 55, 20, "#18375b");
    text(this.ctx, `${Math.ceil(g.remaining)}`, 103, 20, "#18375b");
    this.rect(0, 29, 128, 119, "#18314b");
    for (let y = 0; y < 9; y++)
      for (let x = 0; x < 7; x++) {
        const [px, py] = bubblePosition(x, y);
        let color = COLORS[g.board.cells[y][x]];
        if (
          g.phase === "clear" &&
          g.removed.some((c) => c[0] === x && c[1] === y) &&
          Math.floor(g.phaseTime * 30) % 2 === 0
        )
          color = "#fff";
        let ax = px,
          ay = py;
        if (g.phase === "rotate") {
          const group = triangle(g.x, g.y);
          const i = group.findIndex((c) => c[0] === x && c[1] === y);
          if (i >= 0) {
            const from = group[(i + (g.reverse ? 1 : 2)) % 3];
            const [fx, fy] = bubblePosition(...from);
            const t = Math.max(0, Math.min(1, 1 - g.phaseTime / 0.18));
            ax = Math.round(fx + (px - fx) * t);
            ay = Math.round(fy + (py - fy) * t);
          }
        }
        this.bubbleSprite(ax, ay, color);
      }
    const cells = triangle(g.x, g.y).map(([x, y]) => bubblePosition(x, y));
    cells.forEach((c, i) =>
      this.line(
        c[0],
        c[1],
        cells[(i + 1) % 3][0],
        cells[(i + 1) % 3][1],
        "#fff",
      ),
    );
    this.soft("Rotate", "Pause");
  }
  line(x: number, y: number, tx: number, ty: number, color: string) {
    const dx = Math.abs(tx - x),
      dy = -Math.abs(ty - y),
      sx = x < tx ? 1 : -1,
      sy = y < ty ? 1 : -1;
    let error = dx + dy;
    for (;;) {
      this.rect(x, y, 1, 1, color);
      if (x === tx && y === ty) break;
      const twice = 2 * error;
      if (twice >= dy) {
        error += dy;
        x += sx;
      }
      if (twice <= dx) {
        error += dx;
        y += sy;
      }
    }
  }
  bubbleSprite(x: number, y: number, c: string) {
    this.rect(x - 4, y - 7, 8, 1, "#10243a");
    this.rect(x - 6, y - 6, 12, 2, "#10243a");
    this.rect(x - 7, y - 4, 14, 8, "#10243a");
    this.rect(x - 6, y + 4, 12, 2, "#10243a");
    this.rect(x - 4, y + 6, 8, 1, "#10243a");
    this.rect(x - 4, y - 6, 8, 12, c);
    this.rect(x - 6, y - 4, 12, 8, c);
    this.rect(x - 4, y - 5, 4, 1, "#fff1c3");
    this.rect(x - 3, y - 2, 1, 2, "#17202c");
    this.rect(x + 2, y - 2, 1, 2, "#17202c");
    this.rect(x - 2, y + 3, 4, 1, "#17202c");
    this.rect(x - 3, y + 2, 1, 1, "#17202c");
    this.rect(x + 2, y + 2, 1, 1, "#17202c");
  }
  pipe(type: number, x: number, y: number, wet = 0) {
    this.rect(x, y, 16, 16, "#c2974d");
    this.rect(x, y, 16, 1, "#e2bc75");
    this.rect(x, y, 1, 16, "#e2bc75");
    this.rect(x + 15, y, 1, 16, "#94713c");
    this.rect(x, y + 15, 16, 1, "#94713c");
    for (let k = 0; k < 4; k++)
      this.rect(
        x + ((k * 7 + 3) % 14),
        y + ((k * 3 + 5) % 14),
        1,
        1,
        "#b08740",
      );
    if (!type) return;
    this.rect(x + 5, y + 5, 6, 6, "#4d3526");
    for (const d of PORTS[type]) {
      const horizontal = d % 2 === 1;
      this.rect(
        x + (horizontal ? (d === 1 ? 8 : 0) : 5),
        y + (horizontal ? 5 : d === 2 ? 8 : 0),
        horizontal ? 8 : 6,
        horizontal ? 6 : 8,
        "#4d3526",
      );
      this.rect(
        x + (horizontal ? (d === 1 ? 8 : 0) : 6),
        y + (horizontal ? 6 : d === 2 ? 8 : 0),
        horizontal ? 8 : 2,
        horizontal ? 2 : 8,
        "#d6bc8b",
      );
      if (wet & (1 << d))
        this.rect(
          x + (horizontal ? (d === 1 ? 8 : 0) : 7),
          y + (horizontal ? 7 : d === 2 ? 8 : 0),
          horizontal ? 8 : 2,
          horizontal ? 2 : 8,
          "#309afa",
        );
    }
    if (type >= 8) {
      this.rect(x + 3, y + 3, 10, 10, type === 8 ? "#5986a6" : "#e8d9a6");
      text(this.ctx, type === 8 ? "S" : "E", x + 5, y + 5, "#182b32");
    }
  }
  link(g: Fun2LinkGame) {
    this.rect(0, 0, 128, 160, "#111718");
    text(this.ctx, `ST${g.level}`, 2, 3, "#f4d37b");
    text(this.ctx, `${g.score}`, 81, 3, "#fff");
    this.rect(27, 15, 18, 18, "#fff2a3");
    g.queue.forEach((p, i) => this.pipe(p, 28 + i * 18, 16));
    text(this.ctx, "NEXT", 2, 20, "#f4d37b");
    for (let y = 0; y < 6; y++)
      for (let x = 0; x < 8; x++)
        this.pipe(g.board[y][x], x * 16, 38 + y * 16, g.wet[y][x]);
    this.ctx.strokeStyle = "#fff5ae";
    this.ctx.strokeRect(g.x * 16 + 0.5, 38 + g.y * 16 + 0.5, 15, 15);
    text(this.ctx, `${g.links}/${g.minimum}`, 2, 138, "#f4d37b");
    text(
      this.ctx,
      g.started ? "FLOW" : `${Math.ceil(g.remaining)}S`,
      70,
      138,
      "#8fc9ec",
    );
    this.soft(g.fast ? "Slow" : "Fast", "Pause");
  }
  dialog(title: string, sub: string) {
    this.rect(7, 53, 114, 56, "#163e88");
    this.rect(9, 55, 110, 52, "#e4edf3");
    text(this.ctx, title, 64, 64, "#173d79", true);
    text(this.ctx, sub, 64, 83, "#173d79", true);
    text(this.ctx, "ENTER / TAP", 64, 96, "#173d79", true);
  }
}
