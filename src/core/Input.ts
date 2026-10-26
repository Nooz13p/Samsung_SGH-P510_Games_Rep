export function keyAction(key: string) {
  return (
    {
      ArrowUp: "up",
      "2": "up",
      ArrowDown: "down",
      "8": "down",
      ArrowLeft: "left",
      "4": "left",
      ArrowRight: "right",
      "6": "right",
      Enter: "action",
      "5": "action",
      " ": "secondary",
      "1": "reverse",
      Escape: "back",
      "*": "secondary",
    } as Record<string, string>
  )[key];
}
export function point(canvas: HTMLCanvasElement, event: PointerEvent) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - r.left) * canvas.width) / r.width,
    y: ((event.clientY - r.top) * canvas.height) / r.height,
  };
}
export function pixelScale(width: number, height: number) {
  const available = Math.min(width / 128, height / 160);
  return available >= 1 ? Math.max(1, Math.floor(available)) : available;
}
