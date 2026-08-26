---
id: transcription
slug: transcription
title: Speech Transcription
description: Transcribe and translate files or live PCM with Photon and Whisper
---

# Speech Transcription

Photon serves `openai/whisper-large-v3-turbo` through the Moondream Python
package on supported NVIDIA GPUs. It handles long-form files, progressive
transcripts, live mono PCM, English translation, and segment or word
timestamps.

## Installation

Install Moondream 2.1 or newer:

```bash
pip install --upgrade "moondream>=2.1"
```

Photon downloads the Whisper checkpoint from Hugging Face on first use and
caches it locally. Local Photon models do not require a Moondream API key.

## Transcribe a file

```python
from pathlib import Path

import moondream as md


with md.photon("openai/whisper-large-v3-turbo") as speech:
    result = speech.transcribe(
        audio=Path("meeting.m4a"),
        timestamps="word",
    )

print(result["text"])
print("Detected language:", result["language"])

for segment in result["segments"]:
    for word in segment.get("words", []):
        print(word["start"], word["end"], word["word"])
```

Encoded input can be a path, bytes, or a bounded binary stream. Supported
containers include WAV/WAVEX, FLAC, MP3, Ogg Vorbis, Opus, M4A, MP4, MOV, and
WebM. Multichannel files are downmixed to mono from their container metadata.

Raw audio can be a one-dimensional NumPy array or CPU Torch tensor containing
mono PCM. Pass its sample rate explicitly:

```python
import moondream as md


with md.photon("openai/whisper-large-v3-turbo") as speech:
    result = speech.transcribe(
        audio=pcm,
        sample_rate=48_000,
        timestamps="segment",
    )
```

## Translate to English

Set `task="translate"` to translate non-English speech into English. Use
`language` when the source language is known, or omit it for automatic language
detection.

```python
from pathlib import Path

import moondream as md


with md.photon("openai/whisper-large-v3-turbo") as speech:
    result = speech.transcribe(
        audio=Path("interview-es.mp3"),
        task="translate",
        language="es",
    )
print(result["text"])
```

## Progressive transcription

Set `stream=True` for progress while Photon processes a long file. Each update
is the newest complete transcript snapshot, not a token delta, so replace the
displayed text instead of appending it.

```python
from pathlib import Path

import moondream as md


with md.photon("openai/whisper-large-v3-turbo") as speech:
    updates = speech.transcribe(
        audio=Path("meeting.m4a"),
        timestamps="segment",
        stream=True,
    )

    for update in updates:
        print(update["text"])

    result = updates.result()
```

Progress snapshots are bounded and may be coalesced when the producer is
faster than the consumer. `result()` always returns the final transcript.

## Live PCM

Live input is an asynchronous iterator of nonempty, one-dimensional NumPy
arrays or CPU Torch tensors containing mono PCM. Every chunk uses the same
sample rate and contains at most 1,048,576 samples.

```python
import asyncio

import moondream as md


async def microphone_chunks():
    while (chunk := await microphone.read()) is not None:
        yield chunk


async def main():
    with md.photon("openai/whisper-large-v3-turbo") as speech:
        updates = await speech.atranscribe(
            audio=microphone_chunks(),
            sample_rate=48_000,
            timestamps="segment",
            stream=True,
        )

        async for update in updates:
            print(update["text"])

        result = await updates.aresult()
        print("Final:", result["text"])


asyncio.run(main())
```

For a final result without progress snapshots, pass `stream=False` to
`atranscribe` and await the returned transcript:

```python
import moondream as md


async def final_transcript(audio_chunks):
    with md.photon("openai/whisper-large-v3-turbo") as speech:
        return await speech.atranscribe(
            audio=audio_chunks,
            sample_rate=48_000,
            stream=False,
        )
```

## Options

Arguments are passed directly to the selected Photon model:

| Argument | Default | Description |
|----------|---------|-------------|
| `audio` | Required | Encoded audio, raw PCM, or an asynchronous live PCM iterator |
| `sample_rate` | None | Required for raw or live PCM; do not set for encoded audio |
| `language` | Automatic | Source language code such as `"en"` or `"es"` |
| `task` | `"transcribe"` | Use `"translate"` for English translation |
| `timestamps` | `"segment"` | `"none"`, `"segment"`, or `"word"` |
| `initial_prompt` | None | Text context for names or domain-specific vocabulary |
| `condition_on_previous_text` | `True` | Carry bounded text context between long-form windows |
| `clip_start_seconds` | `0.0` | Start offset for an encoded source |
| `clip_end_seconds` | Source end | Exclusive end offset for an encoded source |
| `stream` | `False` | Return progressive transcript snapshots |
| `settings` | None | Sampling settings such as `temperature` and `max_tokens` |

Live PCM does not accept clip ranges. For encoded bytes and binary streams,
Photon snapshots at most 64 MiB before incremental decoding. Use an asynchronous
PCM iterator for raw audio longer than 30 seconds. Encoded files and live
sessions are limited to 24 hours.

## Output

The final dictionary includes:

- `text`: the complete transcript or English translation;
- `language`: the detected or requested source language;
- `task`: `"transcribe"` or `"translate"`;
- `segments`: timestamped segments, with `words` when requested;
- source, clip, and decode diagnostic fields.

Word entries include `word`, `start`, `end`, and `probability`. All timestamps
are in seconds relative to the source audio.

For vision-language models and supported hardware, see
[Run Moondream Locally](/running-locally).
