export type GameId = "bubblesmile" | "fun2link";
export class Storage {
  read<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem("p510:" + key);
      return v === null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  }
  write(key: string, value: unknown) {
    try {
      localStorage.setItem("p510:" + key, JSON.stringify(value));
    } catch {
      /* Private mode/storage quota: keep the game playable. */
    }
  }
  high(id: GameId, score: number) {
    const best = Math.max(this.read(id + ":high", 0), score);
    this.write(id + ":high", best);
    return best;
  }
}
