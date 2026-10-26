# Authenticity and validation report

## Current footage revision — 2026-10-27

Two smaller uploaded clips were downloaded, decoded and their frames actually inspected. [Timestamped evidence](research/uploaded-video-analysis.md) includes provenance hashes and four full reference frames. BubbleSmile is verified by its logo; the pipe game's Fun2Link identity is strongly inferred from its distinctive behavior and related source, without an observed title. Exact P510 model identity is inferred from user provenance, not a readable model label.

Both decoded audio tracks contain only zero PCM samples, so original sounds remain unknown. The native LCD resolution cannot be measured from the encoded camera-recording resolution. The 128 × 160 framebuffer is still provisional.

| Area             | Before                                              | Corrected from footage                                                                                                                          | Remaining gap                                                                                                                    |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| BubbleSmile      | Identical smile faces, dark board                   | Seven independently drawn facial styles; aqua patterned field; logo/SCORE header and ROT. strip; unverified blue bottom strip removed           | Original pixels, palette, font, mode rules and score formula unknown                                                             |
| Fun2Link         | Ochre grid, brown pipes, score separated from queue | Grey textured field without empty-cell borders; metallic pipes; upper-left queue, upper-right Dest/Score; cyan meter/water; Fast/Slow and Back# | Exact grid geometry, queue direction and animation speeds unknown                                                                |
| Fun2Link Back    | Pause adaptation                                    | Back button, footer and # return to launcher; Escape still pauses                                                                               | Original navigation confirmation/dialog sequence unknown                                                                         |
| Scores and modes | Provisional independent model                       | Preserved as explicitly approximate                                                                                                             | Footage shows Timed/Skilled options and pipe results 8 links / 1 cross / 300 bonus / 2000 total, not enough for general formulas |

The prototype is still not a verified original-phone replica. In particular, BubbleSmile does not yet implement the two original mode rules. No historical accuracy is claimed for its countdown/level target or Fun2Link's existing score/stage definitions.

Reference camera frames are in `docs/research/frames/`; current browser screenshots are below. They permit a qualitative comparison, not a pixel-error metric: framing, perspective, optical color shift and moire differ. Original assets were not extracted into the game. Artwork remains independently redrawn and approximate.

![Updated browser BubbleSmile](screenshots/bubblesmile.png)

![Updated browser Fun2Link](screenshots/fun2link.png)

## Validation history

The first published baseline passed 19 unit tests and 11 Chromium browser checks, with one intentional desktop skip for a mobile-only test. Type checks, production build, root and repository-subdirectory offline reload passed. The first offline failure was corrected by ignoring Origin variation for cached static asset lookup. The GitHub validation and Pages deployment for commit 12ad292 also succeeded.

The footage revision passed TypeScript, 19 unit tests, production build and 13 Chromium browser checks with one intentional desktop skip for a touch-only scenario. Root and repository-subdirectory browser runs both passed, including offline reload. This includes a new regression test for Back button, # key and footer navigation. Physical iPhone/Android, Safari/WebKit, original audio matching and exact pixel fidelity remain unverified.

## Remaining preservation work

1. Establish exact handset/version and native display/viewport from a readable manual or original artifact.
2. Analyze full mode behavior, inputs, score changes and loss conditions using uncut recordings. Recover Timed Mode as well as the apparently selected Skilled Mode.
3. Obtain audible original recordings; these uploads are silent.
4. Recover stage geometry, queue direction, scoring and crossing semantics event by event rather than fitting one result screen.
5. Validate physical iOS/Android installation and offline cold launch.
