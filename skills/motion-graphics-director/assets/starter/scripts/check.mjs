import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'public');
const errors = [];

function assetPath(relative) {
  if (typeof relative !== 'string' || !relative) throw new Error('Missing asset path.');
  const full = path.resolve(publicRoot, relative);
  if (!full.startsWith(publicRoot + path.sep)) throw new Error(`Asset path escapes public/: ${relative}`);
  return full;
}

async function main() {
  const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  const packages = Object.entries({...pkg.dependencies, ...pkg.devDependencies}).filter(([name]) => name === 'remotion' || name.startsWith('@remotion/'));
  const versions = new Set(packages.map(([, version]) => version));
  if (versions.size !== 1 || packages.some(([, version]) => !/^\d+\.\d+\.\d+$/.test(version))) errors.push('Pin all Remotion packages to the same exact version.');
  for (const filename of ['src/index.ts', 'package-lock.json']) {
    await fs.access(path.join(root, filename)).catch(() => errors.push(`Missing ${filename}`));
  }
  const manifest = JSON.parse(await fs.readFile(path.join(publicRoot, 'audio/manifest.json'), 'utf8'));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.assets) || !manifest.assets.length) throw new Error('Audio manifest must have schemaVersion: 1 and a nonempty assets array.');
  const seen = new Set();
  for (const asset of manifest.assets) {
    try {
      if (typeof asset.id !== 'string' || !asset.id || seen.has(asset.id)) throw new Error(`Invalid or duplicate ID: ${asset.id}`);
      seen.add(asset.id);
      if (asset.license !== 'CC0-1.0') throw new Error(`${asset.id}: bundled audio must have verified CC0-1.0 licensing.`);
      if (!asset.author || !asset.sourceUrl || !/^https?:\/\//.test(asset.sourceUrl)) throw new Error(`${asset.id}: missing attribution or source URL.`);
      if (!Number.isFinite(asset.duration) || asset.duration <= 0) throw new Error(`${asset.id}: invalid duration.`);
      const full = assetPath(asset.path);
      const bytes = await fs.readFile(full);
      if (asset.sha256 && crypto.createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error(`${asset.id}: checksum mismatch; update the documented modification and manifest after replacing audio.`);
      const license = await fs.readFile(assetPath(asset.licenseFile), 'utf8');
      if (license.trim().length < 20) throw new Error(`${asset.id}: empty license evidence.`);
      const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,sample_rate,channels', '-of', 'json', full], {encoding: 'utf8'});
      if (probe.error) throw new Error('Install ffmpeg/ffprobe to validate audio assets.');
      if (probe.status !== 0) throw new Error(`${asset.id}: audio cannot be decoded.`);
      const metadata = JSON.parse(probe.stdout);
      const audio = metadata.streams?.find(stream => stream.codec_type === 'audio');
      if (!audio || Math.abs(Number(metadata.format.duration) - asset.duration) > 0.05) throw new Error(`${asset.id}: manifest duration does not match the audio.`);
      if (asset.sampleRate && Number(audio.sample_rate) !== asset.sampleRate) throw new Error(`${asset.id}: sample rate does not match manifest.`);
      if (asset.channels && audio.channels !== asset.channels) throw new Error(`${asset.id}: channel count does not match manifest.`);
    } catch (error) {
      errors.push(error.message);
    }
  }
  const report = {passed: errors.length === 0, remotionVersion: [...versions][0], audioAssetsChecked: manifest.assets.length, errors};
  console.log(JSON.stringify(report, null, 2));
  if (errors.length) process.exitCode = 1;
}

main().catch(error => {console.error(error.message); process.exitCode = 1;});
