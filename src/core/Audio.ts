export class Audio {
  context?: AudioContext;
  enabled = false;
  unlock() {
    if (!this.enabled) return;
    try {
      this.context ??= new AudioContext();
      void this.context.resume().catch(() => {});
    } catch {
      /* Audio is optional. */
    }
  }
  play(event: string) {
    if (!this.enabled) return;
    this.unlock();
    const ctx = this.context;
    if (!ctx || ctx.state !== "running") return;
    const oscillator = ctx.createOscillator(),
      gain = ctx.createGain();
    oscillator.type = "square";
    oscillator.frequency.value =
      (
        {
          match: 660,
          clear: 880,
          over: 140,
          rotate: 330,
          place: 440,
          flow: 220,
          menu: 520,
        } as Record<string, number>
      )[event] ?? 440;
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  }
}
