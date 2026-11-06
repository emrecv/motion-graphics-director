# Explaining a technical mechanism visually

Use for educational videos about networks, web performance, rendering, queues, APIs or other processes. Start from the causal model, then choose a visual system for it.

## Model before movement

- Define the learner and one question they should be able to answer after watching.
- Check factual claims against current primary documentation. Save sources and simplifying assumptions in the project brief.
- Name the actors, the thing moving, initial state, trigger, sequence of events, and final state. A moving dot should represent something identifiable.
- Distinguish a mechanism from a benefit. A CDN example should show the fresh cache hit that avoids an origin fetch, not just assert that everything becomes faster.
- Keep illustrative timing and distances free of fabricated numerical claims; explain assumptions in the narration or delivery notes, not a permanent disclaimer overlay. Do not invent benchmarks or turn conditional behavior into a universal guarantee.

## Visual continuity

Keep important nodes in the same positions as the story develops. Introduce additional actors when needed, then dim inactive ones. Use color, shape and labels together to distinguish requests, responses and states. Keep path and node labels readable while packets move; check mid-route frames as well as settled states.

Animate events in causal order. For a cacheable object on a miss: lookup, origin fetch, return, cache/store, delivery. For a fresh hit: lookup and local delivery. State changes should coincide with the actual arrival of a packet. The audience needs time to see both the transition and the stable result.

Use arrival pulses for meaningful events, not continuous decorative activity. Avoid adding a ping to every node or drawing all network connections at the same emphasis. A static grid can establish spatial context without competing with data paths.

## Review

- Can the viewer identify the actors and explain why the result differs?
- Does the picture preserve the same meaning as the text, including qualifiers?
- Are start, intermediate, arrival and scene-boundary frames coherent?
- Is the main action legible at the intended playback size, with adequate reading time?
- Could a viewer mistake an illustrative bar or route for measured data?

The starter's `CDN-Explained` is a legacy technical example, rejected as a style benchmark: 36 seconds, English text, a dark square grid and frame-derived packets on curved routes. Copy and adapt its diagram primitives when useful. Its six scenes, palette, duration and layout are not a universal template. Text is in `src/cdn/story.ts`; the choreography is in `src/cdn/CDNExplainer.tsx`; assumptions and primary sources are in `CDN-BRIEF.md`.

For new explainers, rebuild the visual structure around narration and the opening hook. Do not reuse its headings, step labels, persistent legend, outlined node cards, generic icons, music or equal six-second scenes.
