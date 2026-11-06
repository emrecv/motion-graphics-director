# Voice and selective sound design

## Narration first; no music

English ElevenLabs narration is the default. Write the hook sentence with the opening visual; remove introductions such as “In this video”. Start with roughly 140–170 words per minute, then use the real recording and its pauses to set the edit. Never compress a voice just to fit a predetermined scene grid.

Use an existing authorized ElevenLabs integration or the user's configured account. Choose an available voice suited to the brief; ask for a voice choice only when needed. Do not clone someone's voice or start an unapproved purchase. Keep API keys in environment configuration, never source, logs or the repository.

The official [speech-with-timestamps endpoint](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps) returns audio and character alignment. Save the audio locally, map spoken phrases to timeline cues and convert seconds to integer frames with deliberate rounding. Use actual audio duration and leave a clean final tail. Check the current API/model before implementation. When given an existing recording, align it instead of regenerating it unnecessarily.

If credentials, credits or the chosen voice are unavailable, finish the script, cue sheet and visual animatic. Do not label that as a completed voiced film. Never add background music as a substitute.

## Effects

Use a small number of short effects on consequential arrivals, transformations or changes of state. Avoid a sound for every movement. Keep gain separate from narration, trim clicks and tails, and leave headroom. Duck effects under words when needed; judge the result by listening.

Twelve documented Kenney CC0 effects remain as an optional fallback. Bencho was considered and explicitly dropped by the creator; do not download it, require Pro, or add its sounds to the distributed skill. The old template's music controls remain inert for compatibility; its music tracks have been removed.

## Provenance and review

Record source URL, creator, license, date, local path, modifications and checksum for external assets. Permission to use a sound in a finished film is not automatically permission to redistribute its raw file in a skill. Keep project-only assets out of public packages.

Listen to the full voice-and-effects mix at normal speed. Check intelligibility, pronunciations, cue synchronization, beginning, end and scene changes. Check export clipping and loudness separately. Report honestly when only technical analysis was possible. Do not call an asset auditioned based on its filename or waveform.
