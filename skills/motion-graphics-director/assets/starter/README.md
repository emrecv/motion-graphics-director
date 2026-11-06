> Legacy technical examples. These compositions predate the v2 creative profile and are not style recommendations. Build new films from the current SKILL.md: hook within 3 seconds, fast eased motion, narration, sourced icons, minimal text, no music. Music tracks have been removed; legacy musicVolume inputs remain inert for compatibility. No new v2 voiced sample has been validated yet.

# Motion Graphics Studio

An editable local Remotion project for designed motion graphics and visual explainers. Includes packaged fonts, twelve CC0 sound effects,  reproducible rendering helpers.

## Start

Use a current Node.js LTS release and npm. The delivered project was tested with Node 25.2.1 on macOS arm64. Python 3 and FFmpeg/ffprobe are needed for contact sheets and export verification.

```sh
npm ci
npm run studio
```

Remotion downloads its matching Chrome Headless Shell when first needed. Dependencies must be installed in this project rather than symlinked from a different project.

| Composition | Duration | Purpose |
|---|---:|---|
| CDN-Explained | 36 s | English explainer: origin trip, CDN edge, cache miss and fresh cache hit |
| FORM-Expressive | 20 s | Selected vivid brand-film direction |
| FORM-Editorial | 20 s | Alternative restrained brand-film direction |
| Example-Typography | 6 s | Short German type study |
| Example-LongCopy | 7 s | German long-copy graphic sequence |

All are 1080 × 1920 at 30 fps. Read `CDN-BRIEF.md` for the explainer's story, sources and limitations; read `BRIEF.md` for FORM.

## Edit and export

For CDN, edit text in `src/cdn/story.ts`, colors and choreography in `src/cdn/CDNExplainer.tsx`. Toggle `audioEnabled` in Studio or provide JSON props. For FORM, edit the defaults in `src/Root.tsx` or supply a file following `brief.example.json`. The schema is in `src/content.ts`; animation is in `src/Film.tsx` and `src/components/Motion.tsx`.

```sh
npm run check
npm run preview -- --composition CDN-Explained
npm run frames -- --composition CDN-Explained --frames 90,450,665,840,1010
npm run render -- --composition CDN-Explained
npm run verify -- renders/CDN-Explained-final.mp4
```

Preview is 540 × 960 at the full frame rate. Final is H.264, 1080 × 1920, CRF 18, yuv420p, AAC stereo 48 kHz. Without `--composition`, rendering defaults to FORM-Expressive. `--frames 540-719` renders an inclusive frame range; `--out path.mp4` chooses an output file. Both rendering and still helpers accept `--props path.json`. Each render writes a `.render.json` sidecar; the verifier uses it to check the expected dimensions, frame count and duration.

For a different duration or aspect ratio, redesign the scene timings and layout as well as the composition metadata. Automatic text fitting preserves a minimum readable headline size and fails on impossible content instead of silently clipping it.

## Versions and assets

Remotion and its CLI/bundler/renderer: **4.0.541**. React/React DOM: **19.2.0**. TypeScript: **5.9.3**. Exact dependencies and transitive dependencies are recorded in `package.json` and `package-lock.json`.

Audio records: `public/audio/manifest.json`. Audio audition: `public/audio/audition.html`. Provenance and font licenses: `public/licenses/`. CC0 applies to the documented audio assets; fonts and software retain their own licenses.

## Verification boundaries

`check` validates types and the audio manifest, including file hashes. `verify` checks the actual export and decodes the full file, reports audio loudness/true peak, and flags black/silent segments for review. It does not judge composition, clarity, pacing, listening quality or absence of every visual defect. Review the full clip with sound as well as representative frames.
