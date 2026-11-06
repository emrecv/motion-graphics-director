import fs from 'node:fs/promises';
import path from 'node:path';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {args, fail, frameRange, inputProps, jsonFile, root, session} from './common.mjs';

async function main() {
  const [mode = 'preview', ...rest] = process.argv.slice(2);
  const options = args(rest, ['--composition', '--props', '--frames', '--out', '--concurrency']);
  if (mode === '--help' || options.help) {
    console.log('node scripts/render.mjs preview|final|motion [--composition FORM-Editorial] [--props brief.json] [--frames 120-239] [--out file.mp4] [--concurrency 4]');
    return;
  }
  if (!['preview', 'final', 'motion'].includes(mode)) throw new Error(`Unknown render mode: ${mode}`);
  const id = options.composition || 'FORM-Expressive';
  const props = await inputProps(options.props);
  const range = options.frames ? frameRange(options.frames) : mode === 'motion' ? [0, 119] : undefined;
  const concurrency = Number(options.concurrency || 4);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 32) throw new Error('Concurrency must be an integer from 1 to 32.');
  const slug = id.replace(/[^a-zA-Z0-9_-]/g, '-');
  const rangeName = range ? `-${range[0]}-${range[1]}` : '';
  const output = options.out ? path.resolve(options.out) : path.join(root, 'renders', `${slug}-${mode}${rangeName}.mp4`);
  await fs.mkdir(path.dirname(output), {recursive: true});
  const started = performance.now();
  const {serveUrl, browser, setupSeconds} = await session();
  try {
    const composition = await selectComposition({serveUrl, id, inputProps: props, puppeteerInstance: browser});
    if (range && range[1] >= composition.durationInFrames) throw new Error(`Last frame is ${composition.durationInFrames - 1}; requested ${range[1]}.`);
    const scale = mode === 'final' ? 1 : 0.5;
    const renderStarted = performance.now();
    let lastProgress = -1;
    const result = await renderMedia({
      serveUrl, composition, inputProps: props, puppeteerInstance: browser,
      outputLocation: output, codec: 'h264', pixelFormat: 'yuv420p',
      audioCodec: 'aac', audioBitrate: '320k', sampleRate: 48000,
      crf: mode === 'final' ? 18 : 23, x264Preset: mode === 'final' ? 'medium' : 'veryfast',
      imageFormat: 'png', scale, concurrency, frameRange: range,
      overwrite: true, logLevel: 'error',
      onProgress: ({progress}) => {
        const milestone = Math.floor(progress * 10);
        if (milestone > lastProgress) {
          lastProgress = milestone;
          console.log(`Rendering ${id}: ${Math.min(100, milestone * 10)}%`);
        }
      },
    });
    const report = {
      composition: id, mode, output, frameRange: range || [0, composition.durationInFrames - 1],
      width: Math.round(composition.width * scale), height: Math.round(composition.height * scale),
      fps: composition.fps, frames: range ? range[1] - range[0] + 1 : composition.durationInFrames,
      setupSeconds: Number(setupSeconds.toFixed(3)),
      renderSeconds: Number(((performance.now() - renderStarted) / 1000).toFixed(3)),
      totalSeconds: Number(((performance.now() - started) / 1000).toFixed(3)),
      slowestFrames: result.slowestFrames,
      renderSettings: {codec: 'h264', crf: mode === 'final' ? 18 : 23, pixelFormat: 'yuv420p', audioCodec: 'aac', audioBitrate: '320k', sampleRate: 48000, scale, concurrency},
      inputProps: props,
      createdAt: new Date().toISOString(),
    };
    await jsonFile(output.replace(/\.mp4$/i, '') + '.render.json', report);
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close({silent: true});
  }
}

main().catch(fail);
