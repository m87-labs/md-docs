---
id: transcription
slug: transcription
title: Speech Transcription
description: Transcribe files or live PCM with Photon's Whisper, Qwen3-ASR, and Parakeet models
---

# Speech Transcription

Photon serves four speech-to-text checkpoints through the same model-bound
`transcribe` interface on supported NVIDIA GPUs:

- `openai/whisper-large-v3-turbo`
- `Qwen/Qwen3-ASR-0.6B`
- `Qwen/Qwen3-ASR-1.7B`
- `nvidia/parakeet-tdt-0.6b-v3`

All four handle long-form files, progressive transcripts, live mono PCM, and
segment timestamps. Each also offers word timestamps within model-specific
limits. Language, prompting, translation, and timestamp behavior varies by
model.

## Installation

Install Moondream 2.1.1 or newer:

```bash
pip install --upgrade "moondream>=2.1.1"
```

Photon downloads the selected checkpoint from Hugging Face on first use and
caches it locally. Qwen3-ASR also downloads its forced aligner when word
timestamps are requested. Local Photon models do not require a Moondream API
key.

## Choose a model

| Capability | Whisper large-v3-turbo | Qwen3-ASR | Parakeet TDT |
|------------|------------------------|-----------|--------------|
| Language | Automatic or forced | Automatic or forced | Automatic; code not reported |
| English translation | Yes | No | No |
| Initial prompt | Yes | Yes | No |
| Segment timestamps | Yes | Yes | Yes |
| Word timestamps | Alignment | Forced alignment | Native token durations |
| Sampling controls | Temperature fallback | Temperature and top-p | Deterministic |

## Transcribe a file

```python
from pathlib import Path

import moondream as md


with md.photon("Qwen/Qwen3-ASR-0.6B") as speech:
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

Whisper alone supports English translation. Set `task="translate"` to translate
non-English speech into English. Use `language` when the source language is
known, or omit it for automatic language detection. Qwen3-ASR and Parakeet
reject translation requests.

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

Arguments are passed directly to the selected Photon model. Unsupported
model-specific options fail with a clear error instead of being ignored:

| Argument | Default | Description |
|----------|---------|-------------|
| `audio` | Required | Encoded audio, raw PCM, or an asynchronous live PCM iterator |
| `sample_rate` | None | Required for raw or live PCM; do not set for encoded audio |
| `language` | Automatic | Source language code such as `"en"` or `"es"`; Whisper and Qwen3-ASR only |
| `task` | `"transcribe"` | Use `"translate"` for English translation with Whisper only |
| `timestamps` | `"segment"` | `"none"`, `"segment"`, or `"word"`; implementation varies by model |
| `initial_prompt` | None | Text context for names or vocabulary; Whisper and Qwen3-ASR only |
| `condition_on_previous_text` | `True` | Carry bounded context; Whisper and Qwen3-ASR only |
| `clip_start_seconds` | `0.0` | Start offset for an encoded source |
| `clip_end_seconds` | Source end | Exclusive end offset for an encoded source |
| `stream` | `False` | Return progressive transcript snapshots |
| `settings` | None | Model-specific decode bounds and sampling settings |

Qwen3-ASR word timestamps use forced alignment for Chinese, Cantonese,
English, German, Spanish, French, Italian, Portuguese, Russian, Korean, and
Japanese. Use segment or no timestamps for its other transcription languages.
Parakeet detects language implicitly and returns `language: null`; it does not
accept language forcing, prompts, translation, temperature, or top-p.

Live PCM does not accept clip ranges. For encoded bytes and binary streams,
Photon snapshots at most 64 MiB before incremental decoding. Use an asynchronous
PCM iterator for raw audio longer than 30 seconds. Encoded files and live
sessions are limited to 24 hours.

## Output

The final dictionary includes:

- `text`: the complete transcript or English translation;
- `language`: the detected or requested source language, or `None` for Parakeet;
- `task`: `"transcribe"` or `"translate"`;
- `segments`: timestamped segments, with `words` when requested;
- source, clip, and decode diagnostic fields.

Word entries include `word`, `start`, and `end`, plus `probability` when the
selected model reports it. All timestamps are in seconds relative to the source
audio.

For vision-language models and supported hardware, see
[Run Moondream Locally](/running-locally).
