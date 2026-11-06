# Motion Graphics Director

A Remotion skill for fast, minimal, voice-led motion graphics and visual explainers.

## Install

```sh
npx skills add emrecv/motion-graphics-director --skill motion-graphics-director
```

Works with agents supported by the [skills CLI](https://skills.sh/docs). The install command fetches this public GitHub repository. Directory rankings are managed by skills.sh; publication does not guarantee immediate listing.

## Creative profile

- Catch attention in the first **three seconds** with a visual problem, contrast or payoff.
- Short, purposeful visual beats; quick, precise movement with designed easing.
- Generous negative space, a clear focal point, restrained colors and subtle corner radii.
- Modern sourced icons and real relevant logos, with documented licenses.
- English ElevenLabs narration carries the explanation; only brief useful on-screen labels.
- No background music, neon, decorative borders, oversized headings, step counters or unnecessary subtitles and overlays.
- Sparse sound effects that support the action and leave speech clear.

These defaults can be overridden by an explicit project brief.

## Example prompt

> Use motion-graphics-director to explain CDN caching in a 20-second vertical video. Start with a browser waiting while a nearby cached response wins within three seconds. Use a dark neutral background, generous negative space, clean sourced icons and quick eased packet motion. English ElevenLabs voice-over, no music, no title cards or step counters. Show the opening motion study first.

## Included

The skill includes focused references for art direction, easing, technical explanation, icons/logos, voice and effects, and review; a Remotion 4.0.541 starter; preview, frame-sheet and export-check helpers; twelve optional CC0 effects with provenance; and a helper that creates a new project without overwriting an existing directory.

The starter's FORM and CDN films are **legacy technical demonstrations**, not examples of the revised visual standard. Their music tracks have been removed. The v2 profile addresses feedback on a slow, text-heavy first sample. A new voiced sample has not yet been validated; the skill does not guarantee professional quality from a single prompt.

## Start a project

After installation, ask your agent to use the skill. It can run `scripts/new_project.py` from the installed skill directory, then `npm ci` and `npm run studio` in the new project. Node.js and npm are required; Python 3 and FFmpeg/ffprobe support project creation, frame sheets and media checks. See the bundled starter README for render commands.

ElevenLabs requires your own authorized access and a voice selection; no API key or service subscription is included. Voice generation is documented as a workflow, not bundled as an automatic paid service. If access is missing, the agent prepares a script and animatic instead of claiming completed narration.

Bencho assets are not included or required. Downloaded project-specific logos and restricted media must stay out of redistributed skill packages.

## License

Original skill instructions and helper code are MIT licensed. Bundled Kenney audio is CC0; font notices and other third-party terms remain in the starter's `public/licenses` directory. Dependencies retain their respective licenses. No brand endorsement is implied.
