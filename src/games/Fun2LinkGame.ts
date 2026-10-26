import { Random } from "../core/Random";
export const WIDTH = 8,
  HEIGHT = 6;
// Directions: up, right, down, left. Crossings keep the incoming direction.
export const PORTS: number[][] = [
  [],
  [1, 2],
  [2, 3],
  [0, 1],
  [0, 3],
  [1, 3],
  [0, 2],
  [0, 1, 2, 3],
  [1],
  [3],
];
export function pipeExit(type: number, incoming: number): number | undefined {
  const p = PORTS[type] || [];
  if (!p.includes(incoming)) return;
  return type === 7 ? (incoming + 2) % 4 : p.find((d) => d !== incoming);
}
const DX = [0, 1, 0, -1],
  DY = [-1, 0, 1, 0];
export class Fun2LinkGame {
  board: number[][] = [];
  wet: number[][] = [];
  queue: number[] = [];
  route: [number, number][] = [];
  random: Random;
  x = 1;
  y = 1;
  waterX = 0;
  waterY = 1;
  direction = 1;
  score = 0;
  level = 1;
  links = 0;
  minimum = 6;
  remaining = 20;
  flow = 0;
  fast = false;
  started = false;
  status: "playing" | "over" | "clear" = "playing";
  events: string[] = [];
  private prefix: number[] = [];
  constructor(public seed = 510) {
    this.random = new Random(seed);
    this.setup();
  }
  setup() {
    this.board = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    this.wet = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    const row = ((this.level - 1) % 3) + 1;
    this.waterX = 0;
    this.waterY = row;
    this.direction = 1;
    this.x = 1;
    this.y = row;
    this.links = 0;
    this.minimum = 6;
    this.remaining = Math.max(8, 20 - this.level + 1);
    this.flow = 0;
    this.fast = false;
    this.started = false;
    this.status = "playing";
    // Increasing independent routes add a two-row detour at later levels.
    this.route = [[0, row]];
    if (this.level === 1) {
      for (let x = 1; x < 8; x++) this.route.push([x, row]);
    } else {
      this.route.push(
        [1, row],
        [2, row],
        [2, row + 1],
        [2, row + 2],
        [3, row + 2],
        [4, row + 2],
        [5, row + 2],
        [5, row + 1],
        [5, row],
        [6, row],
        [7, row],
      );
    }
    this.board[row][0] = 8;
    this.board[row][7] = 9;
    const dirs = (a: [number, number], b: [number, number]) =>
      DX.findIndex((d, i) => a[0] + d === b[0] && a[1] + DY[i] === b[1]);
    this.prefix = this.route.slice(1, -1).map((p, i) => {
      const a = dirs(p, this.route[i]),
        b = dirs(p, this.route[i + 2]);
      return PORTS.findIndex(
        (ports, id) =>
          id > 0 && id < 7 && ports.includes(a) && ports.includes(b),
      );
    });
    this.minimum = this.route.length - 2;
    this.queue = Array.from({ length: 4 }, () => this.nextPiece());
  }
  private nextPiece() {
    return this.prefix.shift() ?? 1 + this.random.next(7);
  }
  move(dx: number, dy: number) {
    this.x = Math.max(0, Math.min(7, this.x + dx));
    this.y = Math.max(0, Math.min(5, this.y + dy));
  }
  place(x = this.x, y = this.y) {
    if (
      this.status !== "playing" ||
      x < 0 ||
      x >= WIDTH ||
      y < 0 ||
      y >= HEIGHT ||
      this.wet[y][x] ||
      this.board[y][x] >= 8 ||
      (x === this.waterX && y === this.waterY)
    )
      return false;
    this.x = x;
    this.y = y;
    this.board[y][x] = this.queue.shift()!;
    this.queue.push(this.nextPiece());
    this.events.push("place");
    return true;
  }
  update(dt: number) {
    if (this.status !== "playing") return;
    if (!this.started) {
      this.remaining = Math.max(0, this.remaining - dt * (this.fast ? 10 : 1));
      if (this.remaining > 0) return;
      this.started = true;
      this.wet[this.waterY][this.waterX] = 1 << this.direction;
    }
    this.flow += dt;
    const interval = this.fast
      ? 0.2
      : Math.max(0.6, 2 - (this.level - 1) * 0.1);
    while (this.flow >= interval && this.status === "playing") {
      this.flow -= interval;
      this.step();
    }
  }
  step() {
    const x = this.waterX + DX[this.direction],
      y = this.waterY + DY[this.direction];
    if (x < 0 || x >= 8 || y < 0 || y >= 6) return this.lose();
    const incoming = (this.direction + 2) % 4,
      type = this.board[y][x];
    if (type === 9) {
      if (incoming === 3 && this.links >= this.minimum) {
        this.status = "clear";
        this.score += 500;
        this.events.push("clear");
      } else this.lose();
      return;
    }
    const out = pipeExit(type, incoming);
    const channel = type === 7 ? (incoming % 2 === 0 ? 5 : 10) : 15;
    if (out === undefined || (this.wet[y][x] & channel) !== 0)
      return this.lose();
    this.wet[y][x] |= channel;
    this.waterX = x;
    this.waterY = y;
    this.direction = out;
    this.links++;
    this.score += 100;
    this.events.push("flow");
  }
  private lose() {
    this.status = "over";
    this.events.push("over");
  }
  next() {
    if (this.status === "clear") {
      this.level++;
      this.setup();
    }
  }
  restart() {
    Object.assign(this, new Fun2LinkGame(this.seed));
  }
}
