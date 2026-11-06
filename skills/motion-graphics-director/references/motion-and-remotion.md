# Motion design and Remotion implementation

Read when implementing or diagnosing motion, scene timing, rendering consistency, or media loading. Check the installed package's API before adopting examples from newer documentation.

## Pace and easing defaults

Aim for a meaningful opening action before three seconds. Begin with visual beats around 1–3 seconds and main moves around 8–18 frames at 30 fps, adjusted for actual speech and causal understanding. Avoid the legacy six-second slide rhythm. These are starting points, not universal cut or duration limits.

For clean arrivals, try a cubic ease-out such as (0.22, 1, 0.36, 1); for transfers, a balanced ease-in-out such as (0.65, 0, 0.35, 1). Use frame-derived interpolation and clamp endpoints. Keep overshoot restrained and intentional. A constant-speed packet can remain linear when that conveys the mechanism; surrounding reveals and settling still need designed timing. Overlap related changes without making their causal order ambiguous.

## Motion has a temporal composition

For each action, define its start, main movement, settle, reading hold, and departure. Those phases need not all be visible. Important content should stop moving long enough to be understood. Judge holds at normal playback speed with the actual words.

Choose a motion model for the intended meaning:

- A controlled reveal or camera move often benefits from a designed easing curve.
- A physical interaction may benefit from a spring, with mass, damping, and overshoot chosen deliberately.
- A direct cut can give clarity or punctuation where a transition would add delay.
- Linear motion can suit constant-speed travel, rotation, scanning, and mechanical processes.

Anticipation and overshoot are options, not requirements. If a spring is used, let it settle before cutting unless interruption is intentional. Do not apply a universal sub-300 ms duration or prohibit ease-in solely because a UI-animation guide does so.

Layer movement in time. Delay related elements enough to expose their relationship, but do not stagger every letter by default. Start the next action once the viewer has understood the current one, not simply once a helper returns 1.

## Frame-based contract

Use `useCurrentFrame()` and `useVideoConfig()`; derive positions, masks, colors, opacity, and audio envelopes from the frame. Frames are zero-based. Understand whether a value is composition time or local time inside a sequence. Centralize seconds-to-frames conversion and round deliberately.

The same frame with the same props and assets must produce the same state, regardless of the order in which frames are requested. Avoid wall-clock time, mutable frame history, `Math.random()`, autonomous CSS animations, and JS timers as animation drivers. Seed randomness when an effect needs variation.

Use Remotion sequences for scene timing and the project's current media primitives for synchronization. Respect integer frame durations and scene boundaries; check the final frame and overlapping transitions. Read the current API for offsets, trimming, and audio because package versions differ.

## Asset and layout reliability

- Keep media local for final rendering where feasible; retain source records. Do not hotlink a transient preview URL as a permanent dependency.
- Load the actual fonts and wait for readiness. Use Remotion's documented loading mechanisms for async resources.
- Measure text using the loaded font, weight, and letter spacing; character counts are not a width measurement. Mount measured text only after font loading has triggered a fresh render, then release capture. Wrap normal phrases deliberately and reject unbreakable content that cannot fit above the readable size floor. Reserve enough height for all supported lines.
- Clamp interpolation where off-range values would produce unintended geometry or opacity. Check that division and interpolation cannot produce NaN or infinite values.
- For previews, reduce dimensions rather than frame rate when evaluating movement. Selectively disable expensive effects only if the preview is clearly labeled and motion remains representative.
- Profile the slow scene before reducing quality globally. Blur, layered filters, large media, and per-frame calculations may increase cost. A final render can use effects that are inappropriate for real-time web interaction.

## Official references

- [Core idea](https://www.remotion.dev/docs/idea): composition as a function of a frame.
- [Animating properties](https://www.remotion.dev/docs/animating-properties): interpolation and frame-driven movement.
- [Sequence](https://www.remotion.dev/docs/sequence): relative timing and scene organization.
- [Spring](https://www.remotion.dev/docs/spring): physics-based curves and their parameters.
- [Fonts](https://www.remotion.dev/docs/fonts): loading and using fonts.
- [Render](https://www.remotion.dev/docs/render): Studio and command-line export.

Prefer official installed-version documentation to duplicated API manuals in the skill.

## Bundled starter contract

The initial starter contains `FORM-Editorial` and `FORM-Expressive`, each 600 frames at 30 fps (20 seconds), 1080 × 1920. Five 120-frame shots provide an editable example, not a mandatory structure for new videos.

`src/content.ts` defines the shared input schema: `brand`, `label`, five `headlines`, five `supporting` texts, `footer`, `accent`, `musicVolume`, `sfxVolume`, and `audioEnabled`. `src/Root.tsx` contains literal default-prop objects so Remotion Studio can save edited text, numbers, colors, and arrays back to the source. Do not replace those objects with imported variables: [Remotion requires inline defaults for saving](https://www.remotion.dev/docs/troubleshooting/cannot-save-default-props). Read the schema and defaults before supplying props; JSON overrides merge with the composition defaults. Extend the content model deliberately when a brief needs a different story.

Typical commands from the project directory:

```sh
npm run check
npm run studio
npm run preview -- --composition FORM-Editorial
npm run preview -- --composition FORM-Editorial --frames 120-239 --out renders/scene-preview.mp4
node scripts/render.mjs motion --composition FORM-Editorial
npm run frames -- --composition FORM-Editorial --frames 75,315
npm run render -- --composition FORM-Editorial
npm run verify -- renders/FORM-Editorial-final.mp4
```

Preview/final/frame helpers also accept `--props path.json`; output flags are `--out file.mp4` for video and `--out directory` for frames. The preview retains 30 fps at half resolution. Final video uses full resolution. Render timing and technical export checks produce sidecar JSON reports. These reports are evidence of measured facts, not proof of visual or acoustic quality. Read script help/source if a later project changes these interfaces.
