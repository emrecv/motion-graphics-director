# Sourcing modern icons and real logos

Choose one coherent icon family for a film, for example [Phosphor](https://phosphoricons.com/) or [Lucide](https://lucide.dev/), after checking its current license. Select the style that fits the reference; consistent regular or filled shapes usually work better than a mix of arbitrary defaults. Do not use emoji, platform fallback glyphs or quickly drawn generic browser/server icons as the visual language.

For a named product, search its official brand/media resources and download the real SVG or high-resolution transparent asset. [Simple Icons](https://simpleicons.org/) can help when an official download is unavailable; verify each brand's terms. Logos must identify relevant actors, not imply endorsement. Do not redraw, stretch or recolor protected marks contrary to their guidelines.

Use downloaded assets locally for deterministic rendering. Inspect SVGs and remove executable content, external dependencies and unrelated metadata while retaining required notices. Match optical size, stroke weight and padding rather than blindly matching SVG viewboxes. Let icons sit in generous negative space; do not automatically wrap each in a bordered card. Connection paths that explain data flow are functional graphics, not decorative panel borders.

Keep an asset manifest with local path, source page, download URL, creator/brand, license/brand-guideline URL, retrieval date and modifications. Include notices when redistribution allows it. Otherwise store the asset only with the specific project and document how to obtain it; do not republish it inside the skill.
