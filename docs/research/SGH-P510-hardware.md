# SGH-P510 hardware evidence

See [sources](sources.md). No original hardware specification/manual could be read in this environment.

| Finding                  | Classification   | Implementation decision                                                      |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------- |
| Main LCD resolution      | UNKNOWN          | Provisional 128 × 160 canvas, APPROXIMATED; must be checked against manual   |
| Outer display resolution | UNKNOWN          | Not used                                                                     |
| Main color depth/palette | UNKNOWN          | Small hand-chosen palette, APPROXIMATED                                      |
| Game viewport/status bar | UNKNOWN          | 128 × 160 shell, approximate per-game layout; no claim games filled main LCD |
| Softkeys/font            | UNKNOWN          | Two labels; independently drawn 5 × 7 bitmap font, APPROXIMATED              |
| Refresh/animation timing | UNKNOWN          | Fixed 60 Hz simulation and frame-rate-independent rendering, APPROXIMATED    |
| Sound hardware           | UNKNOWN          | Optional synthesized event tones, APPROXIMATED; no music                     |
| Original keypad mappings | UNKNOWN          | Arrow/2/4/6/8 navigation, 5/Enter action are browser adaptations             |
| Native vs Java games     | UNKNOWN for P510 | X120 reference contains a MIDlet; does not establish P510 packaging          |

Nearest-neighbor integer CSS scaling is used when it fits. Very small viewports use fractional downscaling to preserve the aspect ratio without clipping. No decorative phone shell. Resolution is centralized for future correction.
