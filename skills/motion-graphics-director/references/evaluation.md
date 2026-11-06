# Improving the skill with observable results

Read when authoring or revising this skill, not for every video request.

## Small evaluation set

Use the full sample film for integration coverage and the two short tasks below for targeted checks. To independently test the skill, give another agent a raw brief and this skill's location, without the expected answer or a diagnosis. Isolate its outputs. A "holdout" is meaningful only if that task was not used to tune the skill; record when it becomes part of development.

### Development task — typography

Create a 6-second, 1080 × 1920, 30 fps typographic social clip with the German text "Weniger Lärm. Mehr Fokus." End with the fictional wordmark "FORM". Use two colors plus a neutral, no photos, no external asset search, and no audio. Deliver editable source and MP4. Make the sentence understandable on a phone without pausing.

Review actual text visibility and hold time, line breaks, hierarchy, controlled motion, scene boundaries, and final resolution. Do not require any particular reveal technique.

### Independent task — long-copy graphic explanation

Create a 7-second, 1080 × 1920, 30 fps graphic sequence for a fictional planning tool. Text: "Aus vielen einzelnen Aufgaben wird ein übersichtlicher nächster Schritt." Illustrate the relationship between scattered tasks and an ordered next action, using abstract shapes rather than a real app screenshot. Keep the full sentence visible long enough to read. Use the existing project and fonts. Deliver editable source and MP4; audio is optional.

Review text overflow, useful grouping, message-to-motion relationship, small-screen readability, and the presence of a stable readable state. An animation that only makes shapes look busy does not communicate the required relationship.

## With/without comparison

Run the same development brief with the same model, base project, available tools, and render settings. One run receives this additional skill; the other does not. Both may access the same official Remotion documentation. Record start/end time, output artifacts, renders attempted, and revision rounds. If token counts are not available, state that rather than inventing them.

Review the resulting clips without rewarding explanations of intent. Compare composition, type, motion, pacing, brief adherence, technical defects, and effort. Human review is preferred for subjective craft. If the agent cannot play the clips, limit its comparison to verified static/technical aspects and request temporal review from a viewer.

One pair of runs is exploratory evidence, not proof that the skill generally improves quality or speed. Improve a specific instruction only when a concrete result motivates it, then retest that behavior. Preserve creative freedom when different solutions satisfy the same brief.

See [OpenAI's evaluation guide](https://developers.openai.com/blog/eval-skills) for the general approach; do not import a large evaluation framework until repeated usage justifies it.

## Creator feedback regression (v2)

The first CDN clip was technically valid but rejected for a weak opening, slow scenes and clutter. Prior test passes do not validate the revised direction. For the next visual evaluation, use an English CDN brief with ElevenLabs voice-over: show the problem or payoff in the first three seconds, move through short causal beats, use sourced modern icons, generous negative space, restrained colors, no decorative borders, no music and only brief useful labels. Review the opening in isolation, then the full narrated film. A new voiced render is still required before claiming this profile is visually validated.
