# Fun2Link

## Scope

Playable pipe-routing approximation based on inspected Samsung X120 port behavior. P510 equivalence UNKNOWN. This is not Mahjong connect.

| Finding                                | P510 confidence | Evidence / implemented choice                                                                                         |
| -------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Lay pipes ahead of flowing water       | APPROXIMATED    | VERIFIED in X120 port Board/Pipe/Water source and viewed screenshot                                                   |
| Queue of four pieces                   | APPROXIMATED    | VERIFIED in X120 Board.next[4] and screenshot                                                                         |
| Seven pipe types including crossing    | APPROXIMATED    | VERIFIED in X120 source                                                                                               |
| Source, sink, minimum traversed length | APPROXIMATED    | VERIFIED in X120 stage.0 and Water.run                                                                                |
| Board dimensions                       | UNKNOWN         | X120 uses 9 × 9 backing with clipped border and six visible rows; browser uses eight fully visible columns × six rows |
| Tile sprites                           | UNKNOWN         | Original independent 14 × 14 brown pipe drawings, not copied assets                                                   |
| Palette/layout                         | APPROXIMATED    | Ochre ground, dark pipes, black queue from X120 screenshot; P510 unknown                                              |
| Stage definitions                      | APPROXIMATED    | Independent generated layouts, not copied X120 maps                                                                   |
| Controls                               | APPROXIMATED    | Tap to place queued pipe, arrows/2/4/6/8 cursor, Enter/5 place, Space/\* fast flow                                    |
| Scoring                                | APPROXIMATED    | 100 per traversed pipe, 500 stage bonus; X120 score displays hundreds but exact formula not established               |
| Flow timing                            | APPROXIMATED    | Initial 20 s preparation, then 2 s/tile; 0.2 s fast; harder stages shorten delay                                      |
| Progression                            | APPROXIMATED    | Increasing minimum route length on independent layouts                                                                |
| Failure                                | APPROXIMATED    | Water hits absent/incompatible pipe, border or used route                                                             |
| Win                                    | APPROXIMATED    | Reach sink after minimum route length                                                                                 |
| Audio                                  | APPROXIMATED    | Opt-in placement, flow, clear and loss tones; original MMF files not used                                             |

No tile matching, two-turn pathfinder, shuffle or hint was added. Crossing pipes permit each perpendicular channel once. Wet pipes/source/sink cannot be replaced. Generator provides a known feasible route and a deterministic queue prefix for that route; later pieces use a seeded generator. This guarantees an available solution rather than automatically solving it.
