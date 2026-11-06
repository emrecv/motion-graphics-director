import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {renderStill, selectComposition} from '@remotion/renderer';
import {args, fail, inputProps, jsonFile, root, session} from './common.mjs';

async function main() {
  const options = args(process.argv.slice(2), ['--composition', '--props', '--frames', '--out', '--scale']);
  if (options.help) {
    console.log('node scripts/frames.mjs [--composition FORM-Editorial] [--frames 75,315] [--props brief.json] [--out directory] [--scale 0.5]');
    return;
  }
  const ids = options.composition ? [options.composition] : ['FORM-Editorial', 'FORM-Expressive'];
  const frames = (options.frames || '75,315').split(',').map(Number);
  if (!frames.length || frames.some(n => !Number.isInteger(n) || n < 0)) throw new Error('Frames must be a comma-separated list of nonnegative integers.');
  const scale = Number(options.scale || 0.5);
  if (!(scale > 0 && scale <= 2)) throw new Error('Scale must be greater than 0 and at most 2.');
  const props = await inputProps(options.props);
  const outputDir = options.out ? path.resolve(options.out) : path.join(root, 'renders/styleframes');
  await fs.mkdir(outputDir, {recursive: true});
  const {serveUrl, browser, setupSeconds} = await session();
  const results = [];
  const started = performance.now();
  try {
    for (const id of ids) {
      const composition = await selectComposition({serveUrl, id, inputProps: props, puppeteerInstance: browser});
      for (const frame of frames) {
        if (frame >= composition.durationInFrames) throw new Error(`${id} ends at frame ${composition.durationInFrames - 1}; requested ${frame}.`);
        const output = path.join(outputDir, `${id.replace(/[^a-zA-Z0-9_-]/g, '-')}-${String(frame).padStart(4, '0')}.png`);
        await renderStill({serveUrl, composition, inputProps: props, puppeteerInstance: browser, output, frame, scale, imageFormat: 'png', overwrite: true, logLevel: 'error'});
        results.push({composition: id, frame, seconds: frame / composition.fps, output});
        console.log(`Saved ${id}, frame ${frame}`);
      }
    }
  } finally {
    await browser.close({silent: true});
  }
  let contactSheet = null;
  if (results.length > 1) {
    const cols = Math.min(results.length, 4);
    const rows = Math.ceil(results.length / cols);
    const filters = results.map((_, i) => `[${i}:v]scale=270:-1,setsar=1[v${i}]`);
    const layout = results.map((_, i) => `${(i % cols) * 286}_${Math.floor(i / cols) * 496}`).join('|');
    filters.push(results.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${results.length}:layout=${layout}:fill=0xdddddd,pad=${cols * 286 + 16}:${rows * 496 + 16}:16:16:color=0xdddddd[out]`);
    contactSheet = path.join(outputDir, 'contact-sheet.png');
    const command = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...results.flatMap(r => ['-i', r.output]), '-filter_complex', filters.join(';'), '-map', '[out]', '-frames:v', '1', '-update', '1', contactSheet], {encoding: 'utf8'});
    if (command.status !== 0) {
      console.warn(`Contact sheet skipped; individual frames are intact. ${command.error?.message || command.stderr}`);
      contactSheet = null;
    }
  }
  const report = {frames: results, contactSheet, setupSeconds, framesSeconds: (performance.now() - started) / 1000, inputProps: props};
  await jsonFile(path.join(outputDir, 'frames.json'), report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch(fail);
