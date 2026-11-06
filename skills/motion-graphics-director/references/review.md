# Review the artifact, not the intention

Read before presenting a motion study, calling a video final, or diagnosing quality issues.

## Cheap checks before a full render

1. Run the project's type/lint/asset checks. Confirm composition ID, dimensions, frame rate, frame count, and expected assets.
2. Render representative stills: opening, established scene states, densest text, transition midpoints, and final frame. Include frames directly around scene boundaries when a problem is suspected.
3. Inspect these images visually. A contact sheet helps compare composition, hierarchy, and continuity, but individual full-resolution frames are needed for text and edges.

Do not rerender everything for a small local correction. Render the relevant frame range or a short segment, then confirm that the complete sequence still works.

## Playback review

Render a preview at the target frame rate and reduced resolution. Watch the complete clip once at normal speed without pausing, then revisit questionable segments slowly or frame by frame.

Check:

- The first three seconds deliver a concrete hook: a visual problem, contrast, transformation or payoff. Review this opening independently.
- No completed scene lingers without a narrative reason. Changes follow the real voice recording, with clean acceleration and settling.
- Negative space and a central visual dominate. No neon, decorative borders, step counts, progress UI, unnecessary captions, warnings or headings.
- Real sourced icons/logos form a coherent family. No generic placeholder icon drawings.
- Narration is intelligible, effects are selective and there is no background music.
- Text remains readable for its actual length and viewing size.
- There is a clear primary action, with deliberate motion and resting periods.
- Objects and directional movement remain coherent through cuts.
- Springs, masks, and cropped elements do not end accidentally mid-action.
- The last shot resolves and the audio has a deliberate ending.

For a sound-on version, listen to the full mix and check cue timing. Also watch muted: the central message should survive unless the brief intentionally depends on speech or sound.

If video playback is unavailable, inspect the timeline and dense frame samples as partial evidence, label their limits, and present the playable preview to the user for motion feedback. Never replace a temporal review claim with an inference from a few screenshots. The same distinction applies to listening versus audio statistics.

## Final export checks

Render at the agreed dimensions and frame rate with project assets present. Inspect media metadata for video and audio streams, codec, resolution, frame rate, and duration. Duration should match the intended frame count within container rounding.

Check for decoding errors and audio clipping. Automated blank/black-frame detection is a diagnostic only: an intentional black opening or transition is not automatically a defect. Inspect flagged ranges in context. Compare relevant final-export frames with preview frames if export settings or media differ.

Save a compact review record: artifact, settings, checks performed, issues found/fixed, and known limitations. Distinguish:

- **Verified:** directly observed or measured.
- **Assessed:** a reasoned aesthetic judgment with examples.
- **Unverified:** unavailable capability or unresolved user choice.

## Completion criteria

The intended message is clear; the look follows the chosen direction; text is legible; movement is intentional; the agreed sound is present; export settings match; there are no known blocking media/layout/render faults. Deliver editable source and the playable export with documented asset sources.

Professional quality is judged against the brief and reference, not by accumulating effects or meeting an arbitrary self-assigned score. Keep the remaining uncertainty visible rather than claiming perfection.
