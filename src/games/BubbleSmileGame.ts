import { BubbleBoard, type Cell } from "./BubbleBoard";
export class BubbleSmileGame {
  board: BubbleBoard;
  x = 0;
  y = 0;
  score = 0;
  level = 1;
  remaining = 90;
  status: "playing" | "over" | "clear" = "playing";
  phase: "idle" | "rotate" | "clear" = "idle";
  phaseTime = 0;
  reverse = false;
  removed: Cell[] = [];
  chain = 0;
  events: string[] = [];
  constructor(public seed = 510) {
    this.board = new BubbleBoard(seed);
  }
  move(dx: number, dy: number) {
    if (this.phase === "idle") {
      this.x = Math.max(0, Math.min(11, this.x + dx));
      this.y = Math.max(0, Math.min(7, this.y + dy));
    }
  }
  action(reverse = false) {
    if (this.status !== "playing" || this.phase !== "idle") return;
    this.reverse = reverse;
    this.board.rotate(this.x, this.y, reverse);
    this.phase = "rotate";
    this.phaseTime = 0.18;
    this.chain = 0;
    this.events.push("rotate");
  }
  update(dt: number) {
    if (this.status !== "playing") return;
    this.remaining = Math.max(0, this.remaining - dt);
    if (this.remaining <= 0) {
      this.status = "over";
      this.events.push("over");
      return;
    }
    if (this.phase === "idle") return;
    this.phaseTime -= dt;
    if (this.phaseTime > 0) return;
    if (this.phase === "clear") this.board.refill(this.removed);
    this.removed = this.board.matches();
    if (this.removed.length) {
      this.chain++;
      this.score += this.removed.length * 10 * this.chain;
      this.phase = "clear";
      this.phaseTime = 0.22;
      this.events.push("match");
    } else {
      this.phase = "idle";
      if (this.score >= this.level * 300) {
        this.status = "clear";
        this.events.push("clear");
      }
    }
  }
  next() {
    if (this.status === "clear") {
      this.level++;
      this.remaining = Math.max(35, 90 - (this.level - 1) * 5);
      this.status = "playing";
    }
  }
  restart() {
    Object.assign(this, new BubbleSmileGame(this.seed));
  }
}
