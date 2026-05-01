---
id: running-locally
slug: running-locally
title: Run Moondream Locally
description: High-performance local inference with Photon on NVIDIA GPUs and Apple Silicon
---

# Run Moondream Locally

Photon is Moondream's high-performance inference engine for running Moondream locally — on NVIDIA GPUs (Linux x86_64 / aarch64 or Windows AMD64), or on Apple Silicon Macs with native Metal kernels. It features custom CUDA and Metal kernels, automatic batching, paged KV caching, and prefix caching — the same engine that powers [Moondream Cloud](https://moondream.ai), now available for local and on-prem deployment.

## Requirements

- One of:
  - **NVIDIA GPU** (Ampere or newer) on Linux x86_64 / aarch64 or Windows AMD64 — see [Supported Hardware](#supported-hardware) for the full list.
  - **Apple Silicon Mac** (M-series) on macOS 13 (Ventura) or later, Python 3.12.
- **Python**: 3.10+ on Linux / Windows; 3.12 on macOS.
- **API Key**: Get one from [moondream.ai](https://moondream.ai/c/cloud/api-keys).

## Installation

```bash
pip install moondream
```

This installs the Moondream Python client with built-in Photon support.

## Quick Start

```python
import moondream as md
from PIL import Image

# Initialize with local inference (NVIDIA GPU or Apple Silicon)
model = md.vl(api_key="YOUR_API_KEY", local=True)

# Load an image
image = Image.open("path/to/image.jpg")

# Generate a caption
caption = model.caption(image)["caption"]
print("Caption:", caption)

# Ask a question
answer = model.query(image, "What's in this image?")["answer"]
print("Answer:", answer)

# Detect objects
objects = model.detect(image, "person")["objects"]
for obj in objects:
    print(f"Bounds: ({obj['x_min']}, {obj['y_min']}) to ({obj['x_max']}, {obj['y_max']})")

# Locate objects
points = model.point(image, "person")["points"]
for point in points:
    print(f"Center: ({point['x']}, {point['y']})")
```

The API is identical to [Moondream Cloud](/quickstart) — switch between local and cloud by toggling `local=True`.

## Configuration

### Model Selection

```python
# Moondream 3 Preview (default)
model = md.vl(api_key="YOUR_API_KEY", local=True)

# Moondream 2
model = md.vl(api_key="YOUR_API_KEY", local=True, model="moondream2")
```

| Model | Repository | Notes |
|-------|------------|-------|
| Moondream 3 Preview | [moondream/moondream3-preview](https://huggingface.co/moondream/moondream3-preview) | Default |
| Moondream 2 | [vikhyatk/moondream2](https://huggingface.co/vikhyatk/moondream2) | |

Model weights are automatically downloaded from Hugging Face on first run and cached locally.

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
model = md.vl(
    api_key="YOUR_API_KEY",
    local=True,
    model="moondream3-preview/ft_abc123@1000"
)
```

The model string format is `{base_model}/{finetune_id}@{step}` where:
- `finetune_id` is the ID of your finetune job
- `step` is the training checkpoint to use

Adapters are automatically downloaded and cached on first use.

## Supported Hardware

### NVIDIA — Server / Datacenter

| GPU | VRAM | Architecture |
|-----|------|--------------|
| B200 | 192 GB | Blackwell (SM100) |
| H200 | 141 GB | Hopper (SM90) |
| H100 | 80 GB | Hopper (SM90) |
| GH200 | 96 GB | Hopper (SM90) |
| A100 | 80 GB | Ampere (SM80) |
| L40S | 48 GB | Ada Lovelace (SM89) |
| A40 | 48 GB | Ampere (SM86) |
| A10 | 24 GB | Ampere (SM86) |
| L4 | 24 GB | Ada Lovelace (SM89) |

### NVIDIA — Workstation / Desktop

| GPU | VRAM | Architecture |
|-----|------|--------------|
| RTX PRO 6000 | 96 GB | Blackwell (SM120) |

Any Ampere (SM80+) or newer NVIDIA GPU should work — the GPUs listed above have been explicitly tested and optimized.

### Apple Silicon

Photon runs natively on Apple M-series Macs through Metal kernels — no NVIDIA CUDA, no Triton.

| Hardware | Notes |
|----------|-------|
| MacBook Pro (M5 Max, 48 GB) | macOS 13+, Python 3.12 |
| Mac mini / Studio (M2 / M3 / M4 Pro / M4 Max, ≥24 GB) | macOS 13+, Python 3.12 |
| Mac mini (M4 base, 16 GB) | macOS 13+, Python 3.12 — fits Moondream 2; Moondream 3 weights exceed unified memory |

KV cache size auto-tunes to your machine's unified memory.

### NVIDIA — Edge

| Device | VRAM | JetPack |
|--------|------|---------|
| Jetson AGX Thor | 64 GB | JetPack 7 (CUDA 13) |
| Jetson AGX Orin | 32 / 64 GB | JetPack 6.0+ |
| Jetson Orin NX | 16 GB | JetPack 6.0+ |
| Jetson Orin Nano | 8 GB | JetPack 6.0+ |

See [Jetson Setup](#jetson-setup) for installation instructions.

## Apple Silicon Setup

`pip install moondream` is everything you need on a stock Apple Silicon Mac with Python 3.12 — no NVIDIA CUDA, no Triton, no extra environment setup. Photon's Metal kernels cover the full decode path (paged attention, rotary, KV cache, MoE routing, sampling, layer norm).

```bash
pip install moondream
```

Verify:

```bash
python3 -c "
import moondream as md
print('moondream:', md.__version__)
"
```

## Jetson Setup

### Jetson AGX Thor (JetPack 7)

JetPack 7 ships CUDA 13 and is supported by the standard PyPI PyTorch aarch64 wheel — no custom NVIDIA wheel needed:

```bash
pip install moondream
```

This pulls in PyTorch and the `nvidia-*-cu13` runtime packages it depends on.

#### Set `LD_LIBRARY_PATH`

PyTorch on Thor loads CUDA libraries from the pip-installed `nvidia-*-cu13` packages and from `nvpl` (NVIDIA Performance Libraries — BLAS / LAPACK / FFT for aarch64), which live under your venv's site-packages rather than `/usr/local/cuda`:

```bash
SP=$(python -c "import sysconfig; print(sysconfig.get_paths()['purelib'])")
LIBS=$(find "$SP" -maxdepth 4 -type d -name lib 2>/dev/null \
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
python3 -c "
import torch
print('torch', torch.__version__, 'cuda', torch.cuda.is_available())
print('device', torch.cuda.get_device_name(0))
import moondream
print('moondream OK')
"
```

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
  -e MOONDREAM_API_KEY=your-api-key \
  -e KESTREL_MODEL=moondream3-preview \
  nvcr.io/nvidia/tritonserver:24.08-py3 \
  bash -c "pip install kestrel && tritonserver --model-repository=/models"
```

To use a local model checkpoint instead of downloading:

```bash
docker run --gpus all --rm -it \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 \
  -v ./triton_server/model_repository:/models \
  -v /path/to/model/weights:/model_weights \
  -e MOONDREAM_API_KEY=your-api-key \
  -e KESTREL_MODEL_PATH=/model_weights \
  nvcr.io/nvidia/tritonserver:24.08-py3 \
  bash -c "pip install kestrel && tritonserver --model-repository=/models"
```

| Variable | Default | Description |
|----------|---------|-------------|
| `MOONDREAM_API_KEY` | (required) | Moondream API key |
| `KESTREL_MODEL` | `moondream3-preview` | `moondream2` or `moondream3-preview` |
| `KESTREL_MODEL_PATH` | — | Optional local path to model weights |
| `KESTREL_MAX_BATCH_SIZE` | `4` | Maximum concurrent batch size |

**Endpoints:**
- HTTP: `http://localhost:8000`
- gRPC: `localhost:8001`
- Metrics: `http://localhost:8002`

## Performance

Photon uses custom CUDA and Metal kernels with optimized scheduling to deliver high throughput. Highlights:

- **B200** (Blackwell): up to 93 req/s for Moondream 2 and 71 req/s for Moondream 3 visual Q&A.
- **H100** (Hopper): over 60 req/s for Moondream 2 and over 58 req/s for Moondream 3.
- **Apple Silicon**: at batch=4 direct mode, ~7 req/s for Moondream 2 and ~5 req/s for Moondream 3 on M5 Max (48 GB).

For detailed benchmarks across all supported hardware, see [PERFORMANCE.md](https://github.com/m87-labs/kestrel/blob/main/PERFORMANCE.md).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MOONDREAM_API_KEY` | Required. Get from [moondream.ai](https://moondream.ai/c/cloud/api-keys). Can also be passed as `api_key` parameter. |
| `HF_HOME` | Override Hugging Face cache directory for model weights (default: `~/.cache/huggingface`). |

## Hugging Face Transformers

If your hardware isn't on the [Supported Hardware](#supported-hardware) list — for example, an Intel Mac, an AMD GPU, or a non-Ampere NVIDIA GPU — Moondream can also be loaded via [Hugging Face Transformers](/transformers). On supported hardware (NVIDIA Ampere+ or Apple Silicon), Photon is strongly recommended — it delivers ~5× higher throughput and ~2.4× lower latency than the Transformers path on NVIDIA.
