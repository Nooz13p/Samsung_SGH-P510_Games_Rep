export class Random {
  constructor(public seed = 510) {}
  next(max: number) {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return Math.floor((this.seed / 4294967296) * max);
  }
}
