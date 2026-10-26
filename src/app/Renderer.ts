import { hudText } from "../core/HudFont";
import { text } from "../core/Font";
import { BubbleSmileGame } from "../games/BubbleSmileGame";
import { bubblePosition, triangle } from "../games/BubbleBoard";
import { Fun2LinkGame, PORTS } from "../games/Fun2LinkGame";
export const COLORS = [
  "#817581",
  "#185849",
  "#d4cb6a",
  "#55c5e3",
  "#d6c5e9",
  "#e94c36",
  "#22b49e",
];
export class Renderer {
  private ground = document.createElement("canvas");
  constructor(public ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
    this.ground.width = 128;
    this.ground.height = 160;
    const ground = this.ground.getContext("2d")!;
    const pixels = ground.createImageData(128, 160);
    const shades = [
      [142, 146, 143],
      [158, 161, 156],
      [178, 181, 174],
      [164, 168, 161],
    ];
    for (let y = 0; y < 160; y++)
      for (let x = 0; x < 128; x++) {
        let v =
          (Math.imul(x + 31, 374761393) ^ Math.imul(y + 17, 668265263)) >>> 0;
        v = Math.imul(v ^ (v >>> 16), 2246822507);
        v = Math.imul(v ^ (v >>> 13), 3266489909);
        const c = shades[(v ^ (v >>> 16)) & 3],
          i = (y * 128 + x) * 4;
        pixels.data.set([...c, 255], i);
      }
    ground.putImageData(pixels, 0, 0);
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
    // Uploaded BubbleSmile clip: aqua field, logo/score header and ROT. strip.
    this.rect(0, 0, 128, 160, "#45bcd1");
    for (let y = 0; y < 160; y += 4)
      for (let x = 0; x < 128; x += 8) {
        const shift = Math.round(Math.sin(y * 0.18) * 5);
        this.rect(
          (x + shift + 128) % 128,
          y,
          6,
          2,
          y % 12 === 0 ? "#79d5dd" : "#3db1c9",
        );
      }
    this.rect(0, 0, 128, 24, "#b4e3e8");
    this.rect(1, 1, 76, 22, "#86cbd6");
    text(this.ctx, "BUBBLE", 4, 3, "#246c88");
    text(this.ctx, "SMILE", 32, 13, "#6d6253");
    text(this.ctx, "SCORE", 96, 2, "#255879", true);
    text(
      this.ctx,
      String(g.score),
      124 - String(g.score).length * 6,
      13,
      "#16314a",
    );
    this.rect(0, 24, 128, 5, "#5bacc8");
    this.rect(
      2,
      25,
      Math.round(
        89 * Math.min(1, g.remaining / Math.max(35, 90 - (g.level - 1) * 5)),
      ),
      2,
      "#d6dc8e",
    );
    text(this.ctx, "ROT.", 100, 24, "#e1faff");
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
        this.bubbleSprite(ax, ay, color, g.board.cells[y][x]);
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
    // Footage has no blue softkey strip in the BubbleSmile playfield. Browser controls remain outside.
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
  bubbleSprite(x: number, y: number, color: string, kind = 0) {
    // Independent pixel drawings guided by uploaded frames, not extracted assets.
    const ink = "#17313c",
      white = "#f0f4e8";
    for (let dy = -7; dy <= 7; dy++)
      for (let dx = -7; dx <= 7; dx++) {
        const d = dx * dx + dy * dy;
        if (d > 53) continue;
        this.rect(
          x + dx,
          y + dy,
          1,
          1,
          d > 40 ? ink : dy > 4 ? "#327883" : color,
        );
      }
    this.rect(x - 3, y - 6, 5, 1, "#d6f0e3");
    if (kind === 0) {
      // Grey: oversized, side-looking eyes.
      this.rect(x - 5, y - 3, 5, 6, white);
      this.rect(x + 1, y - 3, 5, 6, white);
      this.rect(x - 2, y - 1, 2, 3, ink);
      this.rect(x + 4, y - 1, 2, 3, ink);
      this.rect(x - 2, y + 4, 5, 1, ink);
    } else if (kind === 1) {
      // Dark green: expressive white angular eyes.
      this.line(x - 5, y - 3, x - 2, y - 1, white);
      this.line(x - 2, y - 1, x - 4, y + 1, white);
      this.line(x + 5, y - 3, x + 2, y - 1, white);
      this.line(x + 2, y - 1, x + 4, y + 1, white);
      this.rect(x - 1, y + 4, 3, 1, ink);
    } else if (kind === 2 || kind === 4) {
      // Sleepy yellow and lavender faces.
      this.rect(x - 5, y - 1, 4, 2, white);
      this.rect(x + 1, y - 1, 4, 2, white);
      this.line(x - 5, y - 3, x - 1, y - 1, ink);
      this.line(x + 1, y - 1, x + 5, y - 3, ink);
      this.rect(x - 2, y + 4, 4, 1, ink);
      if (kind === 4) {
        this.rect(x - 5, y + 2, 2, 1, "#df8da4");
        this.rect(x + 4, y + 2, 2, 1, "#df8da4");
      }
    } else if (kind === 3) {
      // Blue sunglasses.
      this.rect(x - 6, y - 2, 12, 1, ink);
      this.rect(x - 5, y - 1, 4, 3, ink);
      this.rect(x + 1, y - 1, 4, 3, ink);
      this.rect(x - 4, y - 1, 2, 1, white);
      this.rect(x + 2, y - 1, 2, 1, white);
      this.rect(x - 2, y + 4, 5, 1, ink);
    } else if (kind === 5) {
      // Red: angry eyebrows and visible teeth.
      this.rect(x - 5, y - 3, 4, 4, white);
      this.rect(x + 1, y - 3, 4, 4, white);
      this.line(x - 5, y - 4, x - 1, y - 2, ink);
      this.line(x + 1, y - 2, x + 5, y - 4, ink);
      this.rect(x - 2, y - 1, 1, 2, ink);
      this.rect(x + 2, y - 1, 1, 2, ink);
      this.rect(x - 4, y + 3, 8, 3, ink);
      for (let i = -3; i < 4; i += 2) this.rect(x + i, y + 4, 1, 1, white);
    } else {
      // Turquoise: squared eyes, small round mouth.
      this.rect(x - 5, y - 2, 3, 4, white);
      this.rect(x + 2, y - 2, 3, 4, white);
      this.rect(x - 4, y - 1, 1, 2, ink);
      this.rect(x + 3, y - 1, 1, 2, ink);
      this.rect(x - 1, y + 4, 2, 2, ink);
    }
  }
  texture(x: number, y: number, w: number, h: number) {
    this.ctx.drawImage(this.ground, x, y, w, h, x, y, w, h);
  }

  pipe(type: number, x: number, y: number, wet = 0) {
    this.texture(x, y, 16, 16);
    if (!type) return;
    this.rect(x + 5, y + 5, 6, 6, "#29373d");
    for (const d of PORTS[type]) {
      const horizontal = d % 2 === 1;
      this.rect(
        x + (horizontal ? (d === 1 ? 8 : 0) : 5),
        y + (horizontal ? 5 : d === 2 ? 8 : 0),
        horizontal ? 8 : 6,
        horizontal ? 6 : 8,
        "#29373d",
      );
      this.rect(
        x + (horizontal ? (d === 1 ? 8 : 0) : 6),
        y + (horizontal ? 6 : d === 2 ? 8 : 0),
        horizontal ? 8 : 2,
        horizontal ? 2 : 8,
        "#d0dce0",
      );
      if (wet & (1 << d))
        this.rect(
          x + (horizontal ? (d === 1 ? 8 : 0) : 7),
          y + (horizontal ? 7 : d === 2 ? 8 : 0),
          horizontal ? 8 : 2,
          horizontal ? 2 : 8,
          "#27cfe5",
        );
    }
    if (type >= 8) {
      this.rect(x + 3, y + 3, 10, 10, type === 8 ? "#5986a6" : "#e8d9a6");
      text(this.ctx, type === 8 ? "S" : "E", x + 5, y + 5, "#182b32");
    }
  }
  link(g: Fun2LinkGame) {
    this.rect(0, 0, 128, 160, "#131e30");
    this.texture(0, 24, 128, 124);
    g.queue.forEach((p, i) => this.pipe(p, 2 + i * 18, 4));
    this.ctx.strokeStyle = "#dce5e5";
    this.ctx.strokeRect(0.5, 2.5, 74, 20);
    hudText(this.ctx, `DEST ${g.links}/${g.minimum}`, 79, 5);
    hudText(this.ctx, `SCORE ${g.score}`, 79, 14);
    for (let y = 0; y < 6; y++)
      for (let x = 0; x < 8; x++)
        this.pipe(g.board[y][x], x * 16, 38 + y * 16, g.wet[y][x]);
    this.ctx.strokeStyle = "#fff5ae";
    this.ctx.strokeRect(g.x * 16 + 0.5, 38 + g.y * 16 + 0.5, 15, 15);
    this.rect(0, 148, 128, 12, "#131e30");
    text(this.ctx, g.fast ? "FAST*" : "*SLOW", 0, 151, "#d8f5fb");
    text(this.ctx, "BACK#", 99, 151, "#e5eceb");
    this.rect(32, 150, 64, 8, "#eef4ef");
    this.rect(33, 151, 62, 6, "#1f3843");
    this.rect(
      34,
      152,
      Math.round(
        60 * (g.started ? 1 : 1 - g.remaining / Math.max(8, 21 - g.level)),
      ),
      4,
      "#2ed7df",
    );
  }

  dialog(title: string, sub: string) {
    this.rect(7, 53, 114, 56, "#163e88");
    this.rect(9, 55, 110, 52, "#e4edf3");
    text(this.ctx, title, 64, 64, "#173d79", true);
    text(this.ctx, sub, 64, 83, "#173d79", true);
    text(this.ctx, "ENTER / TAP", 64, 96, "#173d79", true);
  }
}
