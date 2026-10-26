# Samsung SGH-P510 — Games & More

Browser-playable **BubbleSmile** and **Fun2Link** preservation study. TypeScript, Canvas, Vite, Web Audio, Pointer Events, localStorage and an offline service worker. No backend or remote gameplay dependencies.

**These are evidence-informed approximations, not verified SGH-P510 replicas.** The manual and Rutube page were blocked by the research proxy; two smaller user-uploaded video clips have since been decoded and inspected. See the [frame analysis](docs/research/uploaded-video-analysis.md). Related-source evidence supports triangular bubble rotation and pipe routing, not bubble shooting or Mahjong connect. Display dimensions, graphics, scores and timing remain provisional. See [research](docs/research/sources.md), [hardware uncertainties](docs/research/SGH-P510-hardware.md) and [authenticity report](docs/authenticity-report.md).

## Run

Node 24 and npm are recommended; exact dependency versions are locked.

```sh
npm ci --cache /tmp/samsung-npm-cache
npm run dev
```

Vite prints the development server address. On a phone, use your host's reachable LAN address. Offline installation requires HTTPS or a localhost secure context; HTTP over LAN does not enable service workers.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

Development mode does not install the service worker. Test the production preview for offline behavior. First load online and let the service worker finish installing; subsequent reloads and both games work offline. On iPhone use Safari's Share → Add to Home Screen; on Android use the browser's install action. Actual home-screen installation on physical phones has not been tested.

## Controls

- Launcher: arrows select; Enter launches. Tap either game to launch it.
- BubbleSmile: arrows or 2/4/6/8 select a triangle. Enter/5 rotates clockwise; Space/1 counterclockwise. Tap a triangle to select it and tap it again to rotate. The optional Rotate left preference changes touch/Enter direction. Match horizontal or diagonal triples. Reach 300 × level points before time expires.
- Fun2Link: tap a cell or move with arrows/2/4/6/8 and press Enter/5 to place the **first** queued pipe. Join S to E through the indicated minimum number of pipe cells. Space/\* or the in-screen Fast/Slow softkey speeds up the water. Pipe pieces cannot rotate. Dry pipes can be replaced; wet pipes cannot. Queue prefixes guarantee a feasible route for each independently designed stage.
- Escape pauses/resumes; Fun2Link Back or # returns to the launcher. BubbleSmile also has a Pause softkey. Enter/tap resumes, restarts after a loss, or advances after a clear. Restart starts a new game. Games returns to launcher. The launcher selection and each game's best score persist separately.
- Sound is off initially; enabling it unlocks optional approximate synthesized event tones. No original sound files or background music are included.

The canvas uses a provisional 128 × 160 internal resolution. Scaling preserves aspect ratio and uses integer nearest-neighbor pixels where space permits. Controls/help outside the viewport are browser adaptations. Hidden tabs and focus loss pause automatically; resume deliberately.

## Browser tests

```sh
npx playwright install chromium
CHROMIUM_PATH="$(node -e "console.log(require('playwright').chromium.executablePath())")" npm run test:browser
```

Cloud setup uses `/usr/bin/chromium` by default; override `CHROMIUM_PATH` on other machines. Tests run against `dist` via the production preview, so build first. Desktop and touch-capable mobile-sized Chromium projects cover navigation, gameplay input, interrupted pointers, pause, restart, settings, score separation, resize and offline reload. Test screenshots go to ignored `test-results/`. These are not physical iOS/WebKit tests.

## GitHub Pages

The workflow validates types, unit tests, production build and Chromium browser tests before deploying from `main`. Set repository Settings → Pages → Source to **GitHub Actions**. Pull requests validate without deployment permissions. The first published build passed GitHub validation and deployed successfully. The playable site is https://itnika13p.github.io/Samsung_SGH-P510_Games/.

```sh
BASE_PATH=/Samsung_SGH-P510_Games/ npm run build
```

The base path is supplied dynamically by the workflow. Local browser tests use the root preview and must also pass against the repository base path. The service worker precaches emitted assets and uses a content-derived cache name; no CDN is needed. Deploy only the generated `dist/` output. In the browser, clear this app's site data to reset preferences and cached versions.

## Layout and evidence

`src/games/` contains separate deterministic engines; `src/core/` handles font, random generation, loop, storage, audio and input; `src/app/` renders and coordinates navigation. Tests use independently controllable engine states. Artwork and bitmap font were drawn directly in source. No third-party sprites, binaries, audio or source code were copied.

The supplied clips show BubbleSmile by title and pipe gameplay strongly identified as Fun2Link. Artwork/layout have been updated from those frames. Exact mode rules and score formulas remain unresolved; the currently playable rules are still approximate. Research has not established original P510 packaging (native versus Java), full original game modes, animation timing, palette or sprite dimensions. Additional findings should update confidence labels before any historical accuracy claim.
