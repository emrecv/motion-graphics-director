# How a CDN speeds up your site

English visual explainer, 36 seconds, 1080 × 1920, 30 fps. Dark navy square grid; cyan for edge delivery, violet for the origin and amber for requests / a cache miss. All nodes retain their positions so viewers can follow the route across scenes.

| Time | Message | Main action |
|---|---|---|
| 0–6 s | An image travels from the origin to a visitor. | Request dot goes out; image packet returns along a long curved route. |
| 6–12 s | Longer round trips can mean more waiting. | A waiting indicator accompanies the full return journey. |
| 12–18 s | CDN means Content Delivery Network. | Edge nodes appear; the nearby edge becomes the focus. No automatic prewarming is implied. |
| 18–24 s | Cache miss: fetch, store if cacheable, deliver. | Browser → edge → origin → edge → browser, in that order. |
| 24–30 s | A fresh cache hit can avoid an origin trip. | Short request and response; origin dims. |
| 30–36 s | Less travel and fewer origin requests. | The nearby route remains; freshness policy is acknowledged. |

This is a simplified CDN-level example for a cacheable image. It omits browser caching, DNS, connection setup, cache keys, eviction, tiered caching and revalidation mechanics. Routes and timing illustrate the concept and are not geographical paths or measured performance. It does not imply that every request is cacheable or that a CDN fixes all website-performance problems.

Sources checked 2026-11-06:
- [Google Cloud CDN overview](https://docs.cloud.google.com/cdn/docs/overview): edge delivery, cache miss/fill, cache hits and reduced origin work.
- [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/): HIT, MISS and freshness-related statuses.

No spoken narration. English on-screen explanations carry the story; documented CC0 music and sparse sound cues support the motion. Audio provenance is in `public/audio/manifest.json`.

Edit the scene text in `src/cdn/story.ts`; diagram choreography is in `src/cdn/CDNExplainer.tsx`. Composition: `CDN-Explained`. Render with `npm run render -- --composition CDN-Explained`.
