# BubbleSmile

## Current evidence update — 2026-10-27

Actual uploaded video frames have now been inspected. See [timestamped findings and reference frames](uploaded-video-analysis.md). The original access failures below describe the first implementation baseline, not the current availability of footage.

The title and Timed/Skilled Mode labels, aqua field, character faces, SCORE/ROT. layout and score/combo popups are VERIFIED in the supplied footage. Exact P510 model attribution is STRONGLY INFERRED from user provenance. Exact mode rules, scoring formula, palette RGB values and native sprite dimensions remain UNKNOWN. Artwork/layout have been revised accordingly. The browser still uses its provisional timer/level model and does not implement the mode selector: it is not a recreation of the filmed Skilled Mode rules.

## Original implementation baseline (historical record)

## Scope

Playable evidence-informed approximation, NOT a verified P510 replica. Source: [sources](sources.md), independent catsmile remake. No P510 frames were inspected.

| Finding                                    | P510 confidence | Evidence / implemented choice                                                                                                                                 |
| ------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rotate a triangular group of three bubbles | APPROXIMATED    | VERIFIED in independent remake source, not original handset                                                                                                   |
| Seven columns, nine staggered rows         | APPROXIMATED    | VERIFIED in remake arrays and initialization                                                                                                                  |
| Horizontal/diagonal triples disappear      | APPROXIMATED    | VERIFIED in remake vanishCheck                                                                                                                                |
| Falling replacements                       | APPROXIMATED    | VERIFIED in remake update                                                                                                                                     |
| Seven bubble colors                        | APPROXIMATED    | VERIFIED in remake; original palette UNKNOWN                                                                                                                  |
| Sprite dimensions                          | UNKNOWN         | Independently drawn 14 × 14 smile bubbles on 16-pixel spacing                                                                                                 |
| Screen/menu layout                         | UNKNOWN         | Independent blue Samsung-inspired menu and score/timer areas                                                                                                  |
| Scoring                                    | APPROXIMATED    | 10 per removed bubble × cascade depth                                                                                                                         |
| Progression                                | APPROXIMATED    | 300 points per level; shorter next-level time                                                                                                                 |
| Objective / win                            | APPROXIMATED    | Reach level target before countdown; continue with next level                                                                                                 |
| Failure                                    | APPROXIMATED    | Countdown expires                                                                                                                                             |
| Timing                                     | APPROXIMATED    | 90 s initial level; 180 ms rotation and 220 ms clear phases                                                                                                   |
| Sounds                                     | APPROXIMATED    | Opt-in short synthesized rotation/match/end tones                                                                                                             |
| Controls                                   | APPROXIMATED    | Arrows/keypad navigate triangles, Enter/5 clockwise, Space/1 counterclockwise; tap a triangle then tap again to rotate, direction preference outside viewport |

No projectile exists; collision tests concern board bounds/selection, not fictitious shooting physics. Menu, high scores, pause and restart are supported. No claim original music, facial artwork, score formula or difficulty has been recovered.
