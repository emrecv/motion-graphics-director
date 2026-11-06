import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser} from '@remotion/renderer';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function args(argv, allowed) {
  const parsed = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === '--help') return {help: true};
    if (!allowed.includes(key)) throw new Error(`Unknown option: ${key}`);
    const value = argv[++i];
    if (value === undefined || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
    parsed[key.slice(2)] = value;
  }
  return parsed;
}

export async function inputProps(filename) {
  if (!filename) return {};
  const value = JSON.parse(await fs.readFile(path.resolve(filename), 'utf8'));
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Props must be a JSON object.');
  return value;
}

export function frameRange(value) {
  if (!/^\d+-\d+$/.test(value)) throw new Error('Frame range must be inclusive START-END, for example 120-239.');
  const range = value.split('-').map(Number);
  if (range[1] < range[0]) throw new Error('Frame range ends before it starts.');
  return range;
}

export async function session() {
  process.chdir(root);
  const started = performance.now();
  const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), rootDir: root, enableCaching: true});
  const browser = await openBrowser('chrome', {
    browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE || undefined,
    logLevel: 'error',
  });
  return {serveUrl, browser, setupSeconds: (performance.now() - started) / 1000};
}

export async function jsonFile(filename, data) {
  await fs.mkdir(path.dirname(filename), {recursive: true});
  await fs.writeFile(filename, JSON.stringify(data, null, 2) + '\n');
}

export function fail(error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
