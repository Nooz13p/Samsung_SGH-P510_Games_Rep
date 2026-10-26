# Research sources and access log

Research date: 2026-10-26. Confidence labels refer to the stated scope, never implicitly to the P510.

1. User-supplied video: https://rutube.ru/video/5a1453a7ceb055ddd8edcc1463976314/ — proxy CONNECT 403. No frames, title, audio or gameplay accessed. Game identity UNKNOWN. Direct upload needed for analysis.
2. P510 manual candidate https://www.manualslib.com/manual/144770/Samsung-Sgh-P510.html — proxy CONNECT 403. Not read; URL/content identity unverified.
3. Hardware candidate https://www.gsmarena.com/samsung_p510-624.php — proxy CONNECT 403. Not read; identity unverified.
4. Samsung manual URL candidate https://downloadcenter.samsung.com/content/UM/200403/20040323141419765_P510_English.pdf — proxy CONNECT 403; guessed discovery URL, NOT evidence of an existing document.
5. https://github.com/steelswing/fun2link-java — accessed through Git HTTPS proxy; README, Board.java, Pipe.java, Water.java, Fun2LinkCanvas.java, Score.java, GameKeyMapping.java and stage.0 inspected. Explicitly describes an X120 port, not P510. Screenshot_2.png actually viewed: brown pipe tiles on textured ochre ground, four-piece queue above, black margins and bottom fast/back labels. No P510 screenshot obtained.
6. https://github.com/bvs23bkv33/catsmile — accessed through Git HTTPS proxy; HelloWorldScene.cpp/.h inspected. Independent remake described in GitHub search as Samsung BubbleSmile remake, handset unspecified. Shows staggered seven-column/nine-row circles, triangular three-piece rotation, horizontal and diagonal triples, falling replacements. No original BubbleSmile screenshot obtained.
7. GitHub repository searches for BubbleSmile, Fun2Link, Samsung SGH P510 succeeded. GitHub API, Google searches were blocked with CONNECT 403. No original firmware or P510 MIDlet established.

No third-party code, game binaries, sprites or audio are redistributed. These repositories have no root license file found; they are behavioral research references only. Reference files live outside the checkout in /tmp and are not dependencies.

Priority audit: firmware/game file search could not establish a legally sourced P510 artifact; original footage inaccessible; original manual inaccessible; exact-phone screenshots unavailable; secondary sources inaccessible; related handset and independent remake are the only inspected behavioral evidence. This does not verify the P510 implementation. Russian/Korean searches remain unperformed because general search access is blocked.

## Inspected reference revisions

- fun2link-java: `dee2d185957b3d9fd974475aee202fb0e5dee177`.
- catsmile: `fdc8c6868e013f629a408e56fe1f031a4f7cdc5e`.

No inference from repository naming alone is treated as original-phone evidence.
