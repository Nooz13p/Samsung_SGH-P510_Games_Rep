import { Renderer } from "./Renderer";
import { BubbleSmileGame } from "../games/BubbleSmileGame";
import { Fun2LinkGame } from "../games/Fun2LinkGame";
import { triangle, bubblePosition } from "../games/BubbleBoard";
import { Storage, type GameId } from "../core/Storage";
import { Audio } from "../core/Audio";
import { GameLoop } from "../core/GameLoop";
import { keyAction, point, pixelScale } from "../core/Input";
export class App {
  storage = new Storage();
  audio = new Audio();
  renderer: Renderer;
  loop: GameLoop;
  game: BubbleSmileGame | Fun2LinkGame | null = null;
  selected = 0;
  paused = false;
  id: GameId = "bubblesmile";
  private lastState = "";
  private savedScore = -1;
  private pointer: number | null = null;
  constructor(public canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas.getContext("2d")!);
    const last = this.storage.read<string>("last", "bubblesmile");
    this.selected = last === "fun2link" ? 1 : 0;
    this.audio.enabled = this.storage.read<boolean>("sound", false) === true;
    const direction = document.querySelector<HTMLInputElement>("#direction")!;
    direction.checked = this.storage.read<boolean>("reverse", false) === true;
    direction.onchange = () => this.storage.write("reverse", direction.checked);
    this.loop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render(),
    );
    document.addEventListener("keydown", (e) => {
      if ((e.target as HTMLElement).closest("button,input,summary,a")) return;
      const action = keyAction(e.key);
      if (!action) return;
      e.preventDefault();
      if (
        e.repeat &&
        ["action", "secondary", "reverse", "back"].includes(action)
      )
        return;
      this.audio.unlock();
      this.input(action);
    });
    canvas.addEventListener("pointerdown", (e) => {
      if (!e.isPrimary || e.button !== 0) return;
      this.pointer = e.pointerId;
      canvas.setPointerCapture(e.pointerId);
      canvas.focus();
      this.audio.unlock();
    });
    canvas.addEventListener("pointerup", (e) => {
      if (this.pointer !== e.pointerId) return;
      this.pointer = null;
      const p = point(canvas, e);
      if (p.x >= 0 && p.y >= 0 && p.x < 128 && p.y < 160) this.tap(p.x, p.y);
    });
    canvas.addEventListener("pointercancel", () => (this.pointer = null));
    canvas.addEventListener("lostpointercapture", () => (this.pointer = null));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.game) this.pause(true);
      this.loop.reset();
    });
    window.addEventListener("blur", () => {
      if (this.game) this.pause(true);
    });
    document.querySelector<HTMLButtonElement>("#left")!.onclick = () => {
      this.audio.unlock();
      this.input(
        this.game instanceof Fun2LinkGame &&
          !this.paused &&
          this.game.status === "playing"
          ? "secondary"
          : "action",
      );
    };
    document.querySelector<HTMLButtonElement>("#right")!.onclick = () =>
      this.game ? this.input("back") : this.help();
    document.querySelector<HTMLButtonElement>("#help")!.onclick = () =>
      this.help();
    document.querySelector<HTMLButtonElement>("#home")!.onclick = () =>
      this.home();
    document.querySelector<HTMLButtonElement>("#restart")!.onclick = () => {
      if (this.game) {
        this.saveScore();
        this.game.restart();
        this.pause(false);
        canvas.focus();
      }
    };
    document.querySelector<HTMLButtonElement>("#sound")!.onclick = () => {
      this.audio.enabled = !this.audio.enabled;
      this.storage.write("sound", this.audio.enabled);
      this.audio.unlock();
      this.audio.play("menu");
      this.soundLabel();
    };
    this.soundLabel();
    window.addEventListener("resize", () => this.resize());
    this.resize();
    this.loop.start();
  }
  private soundLabel() {
    const b = document.querySelector<HTMLButtonElement>("#sound")!;
    b.textContent = this.audio.enabled ? "Sound on" : "Sound off";
    b.setAttribute("aria-pressed", String(this.audio.enabled));
  }
  private help() {
    (document.querySelector("#instructions") as HTMLDetailsElement).open = true;
    if (this.game) this.pause(true);
  }
  private resize() {
    const scale = pixelScale(
      window.innerWidth - 32,
      Math.max(160, window.innerHeight - 220),
    );
    this.canvas.style.width = `${128 * scale}px`;
    this.canvas.style.height = `${160 * scale}px`;
    document.documentElement.style.setProperty(
      "--screen-width",
      `${128 * scale}px`,
    );
  }
  launch() {
    this.savedScore = -1;
    this.id = this.selected === 0 ? "bubblesmile" : "fun2link";
    this.game =
      this.id === "bubblesmile" ? new BubbleSmileGame() : new Fun2LinkGame();
    this.storage.write("last", this.id);
    this.pause(false);
    this.canvas.focus();
  }
  home() {
    this.saveScore();
    this.game = null;
    this.pause(false);
    this.canvas.focus();
  }
  private saveScore() {
    if (this.game && this.savedScore !== this.game.score) {
      this.storage.high(this.id, this.game.score);
      this.savedScore = this.game.score;
    }
  }
  pause(value: boolean) {
    this.paused = value;
    this.loop.paused = value;
    this.loop.reset();
  }
  input(action: string) {
    if (!this.game) {
      if (["down", "up", "left", "right"].includes(action)) {
        this.selected = 1 - this.selected;
        this.audio.play("menu");
      } else if (action === "action") this.launch();
      return;
    }
    if (action === "back") {
      this.pause(!this.paused);
      return;
    }
    if (this.paused) {
      if (action === "action") this.pause(false);
      return;
    }
    if (this.game.status !== "playing") {
      if (action === "action") {
        if (this.game.status === "clear") this.game.next();
        else {
          this.saveScore();
          this.game.restart();
        }
      }
      return;
    }
    const movement: Record<string, [number, number]> = {
      left: [-1, 0],
      right: [1, 0],
      up: [0, -1],
      down: [0, 1],
    };
    if (movement[action]) {
      this.game.move(...movement[action]);
      return;
    }
    if (this.game instanceof BubbleSmileGame) {
      if (["action", "secondary", "reverse"].includes(action))
        this.game.action(
          action !== "action" ||
            document.querySelector<HTMLInputElement>("#direction")!.checked,
        );
    } else if (action === "action") this.game.place();
    else if (action === "secondary") this.game.fast = !this.game.fast;
  }
  private tap(x: number, y: number) {
    if (!this.game) {
      if (y >= 43 && y < 89) {
        this.selected = y < 68 ? 0 : 1;
        this.launch();
      } else if (y >= 148) {
        if (x < 64) this.input("action");
        else this.help();
      }
      return;
    }
    if (this.paused || this.game.status !== "playing") {
      this.input("action");
      return;
    }
    if (y >= 148) {
      if (x >= 64) this.input("back");
      else
        this.input(this.game instanceof Fun2LinkGame ? "secondary" : "action");
      return;
    }
    if (this.game instanceof Fun2LinkGame) {
      if (y >= 38 && y < 134)
        this.game.place(Math.floor(x / 16), Math.floor((y - 38) / 16));
    } else {
      let best = Infinity,
        bx = 0,
        by = 0;
      for (let cy = 0; cy < 8; cy++)
        for (let cx = 0; cx < 12; cx++) {
          const cells = triangle(cx, cy).map(([a, b]) => bubblePosition(a, b));
          const px = cells.reduce((v, c) => v + c[0], 0) / 3,
            py = cells.reduce((v, c) => v + c[1], 0) / 3;
          const dist = (x - px) ** 2 + (y - py) ** 2;
          if (dist < best) {
            best = dist;
            bx = cx;
            by = cy;
          }
        }
      if (y >= 29 && y < 148) {
        if (this.game.x === bx && this.game.y === by) this.input("action");
        else if (this.game.phase === "idle") {
          this.game.x = bx;
          this.game.y = by;
        }
      }
    }
  }
  update(dt: number) {
    if (!this.game || this.paused) return;
    this.game.update(dt);
    for (const event of this.game.events.splice(0)) this.audio.play(event);
    this.saveScore();
  }
  render() {
    if (!this.game)
      this.renderer.menu(this.selected, [
        this.storage.read("bubblesmile:high", 0),
        this.storage.read("fun2link:high", 0),
      ]);
    else {
      if (this.game instanceof BubbleSmileGame) this.renderer.bubble(this.game);
      else this.renderer.link(this.game);
      if (this.paused) this.renderer.dialog("Paused", "Select resumes");
      else if (this.game.status === "over")
        this.renderer.dialog("Game over", "Score " + this.game.score);
      else if (this.game.status === "clear")
        this.renderer.dialog("Stage clear", "Next stage");
    }
    const state = this.game
      ? `${this.id} ${this.paused ? "paused" : this.game.status} score ${this.game.score} level ${this.game.level}`
      : `Games & More selected ${this.selected === 0 ? "BubbleSmile" : "Fun2Link"}`;
    if (state !== this.lastState) {
      document.querySelector("#state")!.textContent = state;
      this.canvas.setAttribute("aria-label", state);
      this.lastState = state;
      document.querySelector("#left")!.textContent = this.game
        ? this.paused || this.game.status !== "playing"
          ? "Select"
          : this.game instanceof Fun2LinkGame
            ? "Fast / Slow"
            : "Rotate"
        : "Select";
      document.querySelector("#right")!.textContent = this.game
        ? "Pause"
        : "Help";
      document.querySelector<HTMLElement>("#direction-label")!.hidden = !(
        this.game instanceof BubbleSmileGame
      );
    }
  }
}
