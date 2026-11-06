#!/usr/bin/env python3
"""Check an exported film; black/silence diagnostics inform, not replace, playback review."""
import argparse
import json
import math
from pathlib import Path
import re
import subprocess
import sys
import time


def run(command):
    try:
        return subprocess.run(command, capture_output=True, text=True, check=False)
    except FileNotFoundError as error:
        raise RuntimeError(f"Required tool is missing: {command[0]}") from error


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('video', nargs='?', default='renders/FORM-Expressive-final.mp4')
    parser.add_argument('--width', type=int)
    parser.add_argument('--height', type=int)
    parser.add_argument('--fps', type=float)
    parser.add_argument('--duration', type=float)
    parser.add_argument('--allow-silent', action='store_true')
    parser.add_argument('--out', help='JSON report path; defaults next to video')
    options = parser.parse_args()
    source = Path(options.video).resolve()
    if not source.is_file():
        raise RuntimeError(f"Video does not exist: {source}")
    started = time.monotonic()
    sidecar = source.with_suffix('.render.json')
    expected = json.loads(sidecar.read_text()) if sidecar.is_file() else {}
    width = options.width or expected.get('width', 1080)
    height = options.height or expected.get('height', 1920)
    fps = options.fps or expected.get('fps', 30)
    duration = options.duration or expected.get('frames', 600) / expected.get('fps', 30)
    probe = run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(source)])
    if probe.returncode:
        raise RuntimeError(f"ffprobe failed: {probe.stderr.strip()}")
    metadata = json.loads(probe.stdout)
    video = next((stream for stream in metadata['streams'] if stream['codec_type'] == 'video'), None)
    audio = next((stream for stream in metadata['streams'] if stream['codec_type'] == 'audio'), None)
    errors, warnings = [], []
    if not video:
        raise RuntimeError('No video stream in export.')
    rate = video.get('avg_frame_rate', '0/1').split('/')
    actual_fps = float(rate[0]) / float(rate[1]) if float(rate[1]) else 0
    if (video['width'], video['height']) != (width, height):
        errors.append(f"Resolution is {video['width']}×{video['height']}; expected {width}×{height}.")
    if abs(actual_fps - fps) > 0.001:
        errors.append(f"Frame rate is {actual_fps}; expected {fps}.")
    actual_duration = float(video.get('duration', metadata['format']['duration']))
    if abs(actual_duration - duration) > 1 / fps + 0.01:
        errors.append(f"Video duration is {actual_duration}; expected {duration} seconds.")
    expected_frames = round(duration * fps)
    actual_frames = int(video['nb_frames']) if video.get('nb_frames', '').isdigit() else None
    if actual_frames is not None and actual_frames != expected_frames:
        errors.append(f"Video has {actual_frames} frames; expected {expected_frames}.")
    if video.get('codec_name') != 'h264' or video.get('pix_fmt') != 'yuv420p':
        errors.append('Expected H.264 video with yuv420p pixel format.')
    if not audio and not options.allow_silent:
        errors.append('Missing audio track.')
    if audio and audio.get('codec_name') != 'aac':
        errors.append('Expected AAC audio.')
    if audio and int(audio.get('sample_rate', 0)) != 48000:
        warnings.append('Audio sample rate is not the 48 kHz project default.')
    filters = '[0:v]blackdetect=d=0.1:pix_th=0.02:pic_th=0.98[v]'
    maps = ['-map', '[v]']
    if audio:
        filters += ';[0:a]ebur128=peak=true,silencedetect=noise=-50dB:d=0.5[a]'
        maps += ['-map', '[a]']
    decoded = run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(source), '-filter_complex', filters, *maps, '-f', 'null', '-'])
    if decoded.returncode:
        errors.append('Full-stream decode failed: ' + decoded.stderr[-1500:])
    diagnostics = [line.strip() for line in decoded.stderr.splitlines() if any(marker in line for marker in ('black_start:', 'silence_start:', 'silence_end:'))]
    loudness_match = re.findall(r'Integrated loudness:\s*I:\s*(-?[\d.]+|[-+]?inf) LUFS', decoded.stderr)
    peak_match = re.findall(r'True peak:\s*Peak:\s*(-?[\d.]+|[-+]?inf) dBFS', decoded.stderr)
    loudness = float(loudness_match[-1]) if loudness_match else None
    peak = float(peak_match[-1]) if peak_match else None
    if peak is not None and peak >= 0:
        errors.append(f'True peak is {peak} dBFS: reduce mix gain to prevent clipping.')
    elif peak is not None and peak > -1:
        warnings.append(f'True peak is {peak} dBFS: less than 1 dB headroom for platform transcoding.')
    if audio and peak == -math.inf and not options.allow_silent:
        errors.append('The audio track is silent.')
    if diagnostics:
        warnings.append('Black-frame/silence detections need a contextual review; intentional pauses are valid.')
    report = {
        'passed': not errors,
        'file': str(source),
        'expected': {'width': width, 'height': height, 'fps': fps, 'duration': duration, 'frames': expected_frames},
        'actual': {'width': video['width'], 'height': video['height'], 'fps': actual_fps, 'duration': actual_duration, 'frames': actual_frames, 'videoCodec': video.get('codec_name'), 'pixelFormat': video.get('pix_fmt'), 'audioCodec': audio.get('codec_name') if audio else None},
        'audio': {'integratedLufs': loudness if loudness is not None and math.isfinite(loudness) else None, 'truePeakDbfs': peak if peak is not None and math.isfinite(peak) else None},
        'diagnostics': diagnostics,
        'errors': errors,
        'warnings': warnings,
        'reviewLimit': 'Technical checks and sampled stills cannot establish visual taste, motion rhythm, or audible quality. Review the whole video with sound.',
        'elapsedSeconds': round(time.monotonic() - started, 3),
    }
    output = Path(options.out).resolve() if options.out else source.with_suffix('.verify.json')
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if not errors else 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (RuntimeError, ValueError, KeyError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
