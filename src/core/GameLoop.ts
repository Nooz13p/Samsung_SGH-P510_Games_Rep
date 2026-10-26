export class GameLoop {
  private last: number | undefined;
  private accumulator = 0;
  paused = false;
  constructor(
    private update: (dt: number) => void,
    private render: () => void,
  ) {}
  reset() {
    this.last = undefined;
    this.accumulator = 0;
  }
  frame = (now: number) => {
    if (this.last !== undefined && !this.paused) {
      this.accumulator += Math.min(0.1, (now - this.last) / 1000);
      while (this.accumulator >= 1 / 60) {
        this.update(1 / 60);
        this.accumulator -= 1 / 60;
      }
    }
    this.last = now;
    this.render();
    requestAnimationFrame(this.frame);
  };
  start() {
    requestAnimationFrame(this.frame);
  }
}
