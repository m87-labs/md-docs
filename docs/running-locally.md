---
id: running-locally
slug: running-locally
title: Run Moondream Locally
description: High-performance local inference with Photon on NVIDIA GPUs
---

# Run Moondream Locally

Photon is Moondream's high-performance inference engine for running Moondream locally on NVIDIA GPUs. It features custom CUDA kernels, automatic batching, paged KV caching, and prefix caching — the same engine that powers [Moondream Cloud](https://moondream.ai), now available for local and on-prem deployment.

## Requirements

- **GPU**: NVIDIA GPU (Ampere or newer) — see [Supported GPUs](#supported-gpus) for the full list
- **Python**: 3.10+
- **API Key**: Get one from [moondream.ai](https://moondream.ai/c/cloud/api-keys)
- **Model Access**: Moondream 3 requires [access approval](https://huggingface.co/moondream/moondream3-preview) (automatically granted), then authenticate with `huggingface-cli login` or set `HF_TOKEN`. Moondream 2 is public and requires no approval.

## Installation

```bash
pip install moondream
```

This installs the Moondream Python client with built-in Photon support.

## Quick Start

```python
import moondream as md
from PIL import Image

# Initialize with local GPU inference
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
| Moondream 3 Preview | [moondream/moondream3-preview](https://huggingface.co/moondream/moondream3-preview) | Default. Requires access approval + `HF_TOKEN` |
| Moondream 2 | [vikhyatk/moondream2](https://huggingface.co/vikhyatk/moondream2) | Public, no approval needed |

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

If you've created a finetuned model through the [Moondream finetuning API](/finetuning/), you can use it locally with Photon:

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

## Supported GPUs

### Server / Datacenter

| GPU | VRAM | Architecture |
|-----|------|--------------|
| H200 | 141 GB | Hopper (SM90) |
| H100 | 80 GB | Hopper (SM90) |
| GH200 | 96 GB | Hopper (SM90) |
| A100 | 80 GB | Ampere (SM80) |
| L40S | 48 GB | Ada Lovelace (SM89) |
| A40 | 48 GB | Ampere (SM86) |
| A10 | 24 GB | Ampere (SM86) |
| L4 | 24 GB | Ada Lovelace (SM89) |

### Desktop

Any Ampere (SM80+) or newer NVIDIA GPU should work — the server/datacenter GPUs listed above have been explicitly tested and optimized.

### Edge

| Device | VRAM | Notes |
|--------|------|-------|
| Jetson AGX Orin | 32/64 GB | JetPack 6.0+ required |
| Jetson Orin NX | 16 GB | JetPack 6.0+ required |
| Jetson Orin Nano | 8 GB | JetPack 6.0+ required |

See [Jetson Setup](#jetson-setup) for installation instructions.

## Jetson Setup

Photon supports NVIDIA Jetson Orin (AGX Orin, Orin NX, Orin Nano) with JetPack 6.0, 6.1, or 6.2.

### Prerequisites

- Jetson Orin with JetPack 6.x flashed
- Python 3.10
- CUDA runtime (included with JetPack)

### Install PyTorch

Jetson requires NVIDIA's custom PyTorch wheels. Install the version matching your JetPack release.

**JetPack 6.1 / 6.2:**
```bash
pip install https://developer.download.nvidia.com/compute/redist/jp/v61/pytorch/torch-2.5.0a0+872d972e41.nv24.08.17622132-cp310-cp310-linux_aarch64.whl
```

**JetPack 6.0:**
```bash
pip install https://developer.download.nvidia.com/compute/redist/jp/v60/pytorch/torch-2.4.0a0+07cecf4168.nv24.05.14710581-cp310-cp310-linux_aarch64.whl
```

### Install Moondream

```bash
pip install "numpy<2" moondream
```

The Jetson PyTorch wheels are built against NumPy 1.x, so pinning `numpy<2` avoids compatibility warnings.

### Set `LD_LIBRARY_PATH`

NVIDIA's Jetson PyTorch wheel needs JetPack CUDA libraries on the library path. If `import torch` fails with errors about missing `libnvToolsExt.so.1`, `libcublas.so`, or `libcupti.so`:

```bash
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/local/cuda/targets/aarch64-linux/lib:$LD_LIBRARY_PATH
```

If you still see errors about `libcupti.so` or `libnvToolsExt.so`:

```bash
sudo apt install cuda-cupti-12-6 libnvtoolsext1
```

Add the export to your shell profile (`~/.bashrc` or similar) so it persists across sessions.

### Verify

```bash
python3 -c "import torch; print(torch.__version__); import moondream; print('moondream OK')"
```

## Triton Inference Server

Photon can be deployed as a [Triton Inference Server](https://github.com/triton-inference-server/server) backend for production serving.

```bash
docker run --gpus all --rm -it \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 \
  -v ./triton/model_repository:/models \
  -e MOONDREAM_API_KEY=your-api-key \
  -e KESTREL_MODEL=moondream3-preview \
  nvcr.io/nvidia/tritonserver:24.08-py3 \
  bash -c "pip install kestrel && tritonserver --model-repository=/models"
```

To use a local model checkpoint instead of downloading:

```bash
docker run --gpus all --rm -it \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 \
  -v ./triton/model_repository:/models \
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

The model repository is available in the [kestrel repo](https://github.com/m87-labs/kestrel/tree/main/triton/model_repository).

## Performance

Photon uses custom CUDA kernels and optimized scheduling to deliver high throughput. On an H100, Photon achieves over 60 requests/second for visual Q&A with Moondream 2 and over 58 requests/second with Moondream 3.

For detailed benchmarks across all supported GPUs, see [PERFORMANCE.md](https://github.com/m87-labs/kestrel/blob/main/PERFORMANCE.md).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MOONDREAM_API_KEY` | Required. Get from [moondream.ai](https://moondream.ai/c/cloud/api-keys). Can also be passed as `api_key` parameter. |
| `HF_HOME` | Override Hugging Face cache directory for model weights (default: `~/.cache/huggingface`). |
| `HF_TOKEN` | Hugging Face token for gated models like Moondream 3. Alternatively, run `huggingface-cli login`. |

---

### Hugging Face Transformers

If you're running on non-NVIDIA hardware, Moondream can also be loaded via [Hugging Face Transformers](/transformers). On NVIDIA GPUs, Photon is strongly recommended — it delivers ~5x higher throughput and ~2.4x lower latency.
