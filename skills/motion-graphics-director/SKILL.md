---
name: motion-graphics-director
description: Create and refine fast, clean Remotion motion graphics and visual explainers with strong opening hooks, restrained visuals, sourced icons and logos, ElevenLabs narration, and precise frame-based animation. Use for code-generated videos, not interactive website animation.
---

# Motion Graphics Director

Make the mechanism or idea interesting immediately. The default creative profile below reflects the creator's preferences; a user's explicit project brief can override it. Technical success alone is not visual success.

## Creative defaults

- **Hook within the first three seconds.** Open on a surprising visual contrast, a recognizable problem, a transformation or a concrete payoff. Begin the action immediately. No introductory title card, logo pre-roll or slow explanation before the hook. Test the first 90 frames at 30 fps on their own.
- **Fast, clean motion with deliberate easing.** Start with 1–3 second visual beats and 8–18 frame main moves at 30 fps; adapt to narration and comprehension. These are starting ranges, not mandatory cuts. Advance the thought rather than holding a completed scene. Keep causal sequences understandable.
- **One focal point and generous negative space.** White space means breathing room, including on dark backgrounds. Use restrained neutral or muted colors, no neon or glow, no decorative borders or outlined cards. Use modest corner radii, approximately 12–24 px on medium panels at 1080 px width; keep them proportional.
- **Narration carries the explanation.** English by default, with ElevenLabs voice-over. Avoid large headings, paragraphs, routine subtitles, step counters, chapter labels, progress bars, decorative brand headers and warning/disclaimer overlays. A brief 1–4 word heading or a short label is allowed when it helps identify the thing moving. Keep sources, caveats and implementation notes in delivery documents; make the narration accurate without cluttering the frame. Supply separate captions only when requested.
- **Use designed assets.** Source clean modern icons from one coherent pack and real relevant product logos from official brand resources. Do not invent generic placeholder SVG icons or fake logos. Match optical size, stroke weight and style. Follow [icons-and-logos.md](references/icons-and-logos.md).
- **No background music.** Use voice plus selective sound effects. Effects mark meaningful events and must stay below speech. Bencho is not a dependency and its assets are not included.

## Work from the project

Inspect existing source, assets, scripts, locked dependencies and prior decisions. For a new Remotion project, run `python3 <skill>/scripts/new_project.py <new-directory>` and then `npm ci` there. The bundled project supplies tested rendering and media helpers. Its FORM and CDN compositions are **legacy technical examples, not current art-direction examples**: do not copy their long shots, headings, labels, colors or icon drawings into new films.

Keep content, visual tokens, narration, assets and timing editable separately. Use local media and loaded fonts for final rendering. Consult [official Remotion skills](https://www.remotion.dev/docs/ai/skills) for unfamiliar APIs and match the installed version rather than upgrading silently.

## Production

1. Extract audience, one takeaway, platform, duration, references, assets, language and voice. Default: 1080 × 1920, 30 fps, around 20 seconds. Ask only for material missing information.
2. Write the opening visual and first spoken sentence together. Plan a short causal shot list with variable-length beats. Read [art-direction.md](references/art-direction.md); for process explanations also read [technical-explainers.md](references/technical-explainers.md). Verify technical claims against primary sources.
3. When style is open, show two genuinely different directions with representative styleframes. If the user already chose the look, proceed. Do not introduce routine approval gates.
4. Write a concise voice script, source assets, and follow [audio.md](references/audio.md). Generate or import the approved ElevenLabs narration before locking the edit. If access or voice selection is missing, prepare the script and animatic; clearly identify placeholder timing and do not invent a finished narration.
5. Build the opening 3 seconds and one representative transition. Use [motion-and-remotion.md](references/motion-and-remotion.md). Extend the film once the hook and movement work. Correct affected scenes rather than repeatedly rendering everything.
6. Review with [review.md](references/review.md): opening hook, pace, causal clarity, restrained composition, speech alignment, selective effects, no music. Render a full-frame-rate preview before the final MP4.

## Implementation invariants

Derive animation from frame numbers, including easing and audio envelopes. No autonomous CSS animation, wall-clock timers or unseeded randomness. Independent frame rendering and scrubbing must agree. Wait for actual fonts and assets. Measure text with loaded fonts; recompose long text instead of shrinking it indiscriminately.

Fast does not mean abrupt, and easing does not mean bounce. Use controlled acceleration and settling, coordinated overlaps and direct cuts where useful. Never claim to have watched or heard an export based on stills or peak measurements alone.

## Deliver and improve

Deliver playable video, editable project, asset provenance and a concise record of actual checks. Keep documentation out of the video itself. For skill changes, use [evaluation.md](references/evaluation.md); improve rules from observed failures rather than claiming guaranteed quality or speed.
