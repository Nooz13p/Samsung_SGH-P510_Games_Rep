// Compact independent 3x5 bitmap alphabet for the pipe game's two-line HUD.
const glyphs: Record<string, string> = {
  D: "110 101 101 101 110",
  E: "111 100 110 100 111",
  S: "111 100 111 001 111",
  T: "111 010 010 010 010",
  C: "111 100 100 100 111",
  O: "111 101 101 101 111",
  R: "110 101 110 101 101",
  "0": "111 101 101 101 111",
  "1": "010 110 010 010 111",
  "2": "111 001 111 100 111",
  "3": "111 001 111 001 111",
  "4": "101 101 111 001 001",
  "5": "111 100 111 001 111",
  "6": "111 100 111 101 111",
  "7": "111 001 010 010 010",
  "8": "111 101 111 101 111",
  "9": "111 101 111 001 111",
  "/": "001 001 010 100 100",
  " ": "000 000 000 000 000",
};
export function hudText(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
) {
  ctx.fillStyle = "#dceaf0";
  for (const c of value) {
    const rows = (glyphs[c] ?? glyphs[" "]).split(" ");
    rows.forEach((r, dy) =>
      [...r].forEach((v, dx) => {
        if (v === "1") ctx.fillRect(x + dx, y + dy, 1, 1);
      }),
    );
    x += 4;
  }
}
