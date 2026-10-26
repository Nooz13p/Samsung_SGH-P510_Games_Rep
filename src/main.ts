import "./styles/main.css";
import { App } from "./app/App";
new App(document.querySelector<HTMLCanvasElement>("#screen")!);
if (import.meta.env.PROD && "serviceWorker" in navigator)
  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch((e) => console.error("Offline installation failed", e));
  });
