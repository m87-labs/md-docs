---
id: running-locally
slug: running-locally
title: Run Moondream Locally
description: High-performance local inference with Photon on NVIDIA GPUs and Apple Silicon
---

# Run Moondream Locally

Photon is Moondream's high-performance local inference engine for NVIDIA GPUs
(Linux x86_64 / aarch64 or Windows AMD64) and Apple Silicon Macs. It supports
Moondream, Qwen, and Gemma models with custom CUDA and Metal kernels, automatic
batching, paged KV caching, and prefix caching.

## Requirements

- One of:
  - **NVIDIA GPU** (Ampere or newer) on Linux x86_64 / aarch64 or Windows AMD64 — see [Supported Hardware](#supported-hardware) for the full list.
  - **Apple Silicon Mac** (M-series) on macOS 13 (Ventura) or later.
- **Python**: 3.10–3.14.
- **API key**: Optional for base models. A key from
  [moondream.ai](https://moondream.ai/c/cloud/api-keys) is required for
  finetuned models.

## Installation

```bash
pip install --upgrade moondream
```

This installs the Moondream Python client with built-in Photon support.

## Quick Start

```python
import moondream as md
from PIL import Image

# Initialize Photon local inference (NVIDIA GPU or Apple Silicon)
model = md.photon("moondream3.1-9B-A2B")

# Load an image
image = Image.open("path/to/image.jpg")

# Generate a caption
caption = model.caption(image)["caption"]
print("Caption:", caption)

# Ask a question
answer = model.query(image, "What's in this image?")["answer"]
print("Answer:", answer)

# Start a chat
chat = model.chat([
    {"role": "user", "content": "Write a short poem about the moon."},
])
print("Chat:", chat["message"]["content"])

# Detect objects
objects = model.detect(image, "person")["objects"]
for obj in objects:
    print(f"Bounds: ({obj['x_min']}, {obj['y_min']}) to ({obj['x_max']}, {obj['y_max']})")

# Locate objects
points = model.point(image, "person")["points"]
for point in points:
    print(f"Center: ({point['x']}, {point['y']})")

# Segment an object
segment = model.segment(image, "person")
print("SVG path:", segment["path"])
```

`md.vl(local=True, model="moondream3.1-9B-A2B", ...)` remains supported for
existing applications and delegates to `md.photon(...)`.

## Configuration

### Model Selection

```python
# Moondream 3.1 9B A2B
moondream31 = md.photon("moondream3.1-9B-A2B")

# Moondream 2
moondream2 = md.photon("moondream2")

# Moondream 3 Preview
moondream3 = md.photon("moondream3-preview")

# Qwen 3.5 4B
qwen = md.photon("Qwen/Qwen3.5-4B")

# Gemma 4 E2B
gemma = md.photon("google/gemma-4-E2B-it")
```

| Family | Supported models |
|--------|----------------|
| Moondream | Moondream 2, Moondream 3 Preview, Moondream 3.1 9B A2B |
| Qwen 3.5 | 0.8B, 2B, 4B, 9B, 27B, and 35B-A3B; base variants where published |
| Qwen 3.6 | 27B and 35B-A3B; BF16 and FP8 checkpoints |
| Gemma 4 | E2B, E4B, and 31B base and instruction variants |

Use `md.photon_models()` to list the exact identifiers registered by the
installed release. Models expose `model.tasks` and `model.supports(task)` so
applications can discover their capabilities; not every model implements every
Moondream-specific skill.

Model weights are automatically downloaded from Hugging Face on first run and cached locally.

Photon clients with identical configurations share an engine. Close clients
when they are no longer needed, or use a context manager for deterministic GPU
and worker cleanup:

```python
with md.photon("Qwen/Qwen3.5-4B") as model:
    result = model.query(image, "What is in this image?")
```

## Streaming

Stream tokens as they're generated for query and caption tasks:

```python
# Stream a caption
for chunk in model.caption(image, stream=True)["caption"]:
    print(chunk, end="", flush=True)

# Stream a query response
for chunk in model.query(image, "Describe this scene in detail.", stream=True)["answer"]:
    print(chunk, end="", flush=True)
```

## Using Finetunes

If you've created a finetuned model through the [Moondream finetuning API](/finetuning), you can use it locally with Photon:

```python
model = md.photon(
    "moondream3-preview/01HXYZ...@1000",
    api_key="YOUR_API_KEY",
)
```

The model string format is `{base_model}/{finetune_id}@{step}` where:
- `finetune_id` is the ID of your finetune job
- `step` is the training checkpoint to use

Adapters are automatically downloaded and cached on first use.

## Supported Hardware

### NVIDIA GPU

| GPU | VRAM | Architecture |
|-----|------|--------------|
| B200 | 192 GB | Blackwell (SM100) |
| H200 | 141 GB | Hopper (SM90) |
| H100 | 80 GB | Hopper (SM90) |
| GH200 | 96 GB | Hopper (SM90) |
| RTX PRO 6000 | 96 GB | Blackwell (SM120) |
| A100 | 80 GB | Ampere (SM80) |
| L40S | 48 GB | Ada Lovelace (SM89) |
| A40 | 48 GB | Ampere (SM86) |
| L4 | 24 GB | Ada Lovelace (SM89) |
| A10 | 24 GB | Ampere (SM86) |

Any Ampere (SM80) or newer NVIDIA GPU should work; the cards above are explicitly tested and tuned.

### Apple Silicon

Photon runs natively on Apple M-series Macs through Metal kernels — no NVIDIA CUDA, no Triton, no extra setup beyond `pip install moondream`. KV cache size auto-tunes to your machine's unified memory.

| Hardware | Notes |
|----------|-------|
| MacBook Pro (M5 Max, 48 GB) | macOS 13+ |
| Mac mini / Studio (M2 / M3 / M4 Pro / M4 Max, ≥24 GB) | macOS 13+ |
| Mac mini (M4 base, 16 GB) | macOS 13+ — fits Moondream 2; Moondream 3 weights exceed unified memory |

### NVIDIA Jetson

| Device | VRAM | JetPack |
|--------|------|---------|
| Jetson AGX Thor | 64 GB | JetPack 7 (CUDA 13) |
| Jetson AGX Orin | 32 / 64 GB | JetPack 6.0+ |
| Jetson Orin NX | 16 GB | JetPack 6.0+ |
| Jetson Orin Nano | 8 GB | JetPack 6.0+ |

Jetson needs an extra setup step for `LD_LIBRARY_PATH` — see [Jetson Setup](#jetson-setup) below.

## Jetson Setup

Jetson Thor (JetPack 7) and Jetson Orin (JetPack 6) install differently because the two JetPack versions ship different CUDA major versions and PyTorch wheels. The instructions below cover the common path; for extra troubleshooting (cuSPARSELt errors, missing CUDA packages on minimal images, etc.) see the canonical [kestrel Jetson setup guide](https://github.com/m87-labs/kestrel/blob/main/docs/jetson.md).

### Jetson AGX Thor (JetPack 7)

JetPack 7 uses Python 3.12 and ships CUDA 13. It is supported by the standard
PyPI PyTorch aarch64 wheel, so no custom NVIDIA wheel is needed:

```bash
pip install moondream
```

This pulls in PyTorch along with the `nvidia-*-cu13` runtime packages and `nvpl` (NVIDIA Performance Libraries: BLAS / LAPACK / FFT for aarch64). Those libraries live under your venv's `site-packages` rather than `/usr/local/cuda`, so you need to point `LD_LIBRARY_PATH` at them once before importing torch:

```bash
SITE=$(python -c "import sysconfig; print(sysconfig.get_paths()['purelib'])")
LIBS=$(find "$SITE" -maxdepth 4 -type d -name lib 2>/dev/null \
       | grep -E '/(nvidia|nvpl)/' | tr '\n' ':' | sed 's/:$//')
export LD_LIBRARY_PATH="$LIBS:$LD_LIBRARY_PATH"
```

Add the export to your shell profile (`~/.bashrc` or similar) so it persists across sessions.

### Jetson AGX Orin / Orin NX / Orin Nano (JetPack 6)

JetPack 6 ships an older CUDA 12.x and requires NVIDIA's custom PyTorch wheel.

#### Prerequisites

- Jetson Orin device with JetPack 6.x flashed.
- Python 3.10 (matches NVIDIA's JetPack 6 PyTorch wheel).
- CUDA runtime included with JetPack.

#### Install PyTorch

**JetPack 6.1 / 6.2:**
```bash
pip install https://developer.download.nvidia.com/compute/redist/jp/v61/pytorch/torch-2.5.0a0+872d972e41.nv24.08.17622132-cp310-cp310-linux_aarch64.whl
```

**JetPack 6.0:**
```bash
pip install https://developer.download.nvidia.com/compute/redist/jp/v60/pytorch/torch-2.4.0a0+07cecf4168.nv24.05.14710581-cp310-cp310-linux_aarch64.whl
```

#### Install Moondream

```bash
pip install "numpy<2" moondream
```

JetPack 6's PyTorch wheel is built against NumPy 1.x, so pinning `numpy<2` avoids the import-time compatibility warning.

#### Set `LD_LIBRARY_PATH`

JetPack 6's PyTorch wheel loads CUDA libraries from the system JetPack install. If `import torch` fails with errors about missing `libnvToolsExt.so.1`, `libcublas.so`, or `libcupti.so`:

```bash
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/targets/aarch64-linux/lib:$LD_LIBRARY_PATH
```

If you still see errors about `libcupti.so` or `libnvToolsExt.so`:

```bash
sudo apt install cuda-cupti-12-6 libnvtoolsext1
```

Add the export to your shell profile (`~/.bashrc` or similar) so it persists across sessions.

### Verify (Orin or Thor)

```bash
python3 -c "import torch, moondream; print('torch', torch.__version__, 'cuda', torch.cuda.is_available()); print('device', torch.cuda.get_device_name(0)); print('moondream OK')"
```

You should see `cuda True`, the expected NVIDIA device name, and `moondream OK`.
If you see a `libcudart.so.X` / `libnvToolsExt.so.1` / `libcupti.so`
`cannot open shared object file` error, your `LD_LIBRARY_PATH` doesn't cover the
right directory—re-check the previous step.

## Triton Inference Server

Photon can be deployed as a [Triton Inference Server](https://github.com/triton-inference-server/server) backend for production serving.

First, clone the [kestrel repo](https://github.com/m87-labs/kestrel) to get the Triton model repository:

```bash
git clone https://github.com/m87-labs/kestrel.git
cd kestrel
```

Then launch Triton with the model repository mounted:

```bash
docker run --gpus all --rm -it \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 \
  -v ./triton_server/model_repository:/models \
  -e KESTREL_MODEL=moondream3-preview \
  nvcr.io/nvidia/tritonserver:24.08-py3 \
  bash -c "pip install kestrel && tritonserver --model-repository=/models"
```

To use a local model checkpoint instead of downloading:

```bash
docker run --gpus all --rm -it \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 \
  -v ./triton_server/model_repository:/models \
  -v /path/to/model.safetensors:/model.safetensors \
  -e KESTREL_MODEL=moondream3-preview \
  -e KESTREL_MODEL_PATH=/model.safetensors \
  nvcr.io/nvidia/tritonserver:24.08-py3 \
  bash -c "pip install kestrel && tritonserver --model-repository=/models"
```

| Variable | Default | Description |
|----------|---------|-------------|
| `MOONDREAM_API_KEY` | — | Optional Photon API key |
| `KESTREL_MODEL` | `moondream3-preview` | Any model identifier registered by the installed Kestrel release |
| `KESTREL_MODEL_PATH` | — | Optional local path to model weights |
| `KESTREL_MAX_BATCH_SIZE` | `4` | Maximum concurrent batch size |

Set `KESTREL_MODEL` to the registered architecture that matches a local
checkpoint. The bundled Triton backend exposes query, caption, detect, and
point; the configured model must support the requested task.

**Endpoints:**
- HTTP: `http://localhost:8000`
- gRPC: `localhost:8001`
- Metrics: `http://localhost:8002`

## Performance

Headline ChartQA req/s on Moondream 2 / Moondream 3 visual Q&A:

| Hardware | Batch | Moondream 2 | Moondream 3 |
|----------|------:|------------:|------------:|
| B200 (Blackwell)        | 64 | 94 | 78 |
| H100 (Hopper)           | 64 | 57 | 53 |
| RTX PRO 6000 (Blackwell)| 64 | 42 | 39 |
| MacBook Pro M5 Max      |  4 | 7.3 | 4.6 |

For direct and reasoning throughput and median latency across supported cards
and batch sizes, see
[PERFORMANCE.md](https://github.com/m87-labs/kestrel/blob/main/PERFORMANCE.md).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MOONDREAM_API_KEY` | Optional for base models and required for finetuned models. Can also be passed as `api_key`. |
| `HF_HOME` | Override Hugging Face cache directory for model weights (default: `~/.cache/huggingface`). |

## Hugging Face Transformers

If your hardware isn't on the [Supported Hardware](#supported-hardware) list — for example, an Intel Mac, an AMD GPU, or a non-Ampere NVIDIA GPU — Moondream can also be loaded via [Hugging Face Transformers](/transformers). On supported hardware (NVIDIA Ampere+ or Apple Silicon), Photon is the recommended local inference path.
