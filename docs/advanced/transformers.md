---
title: 'Using Moondream with Transformers'
description: 'Run Moondream locally with Hugging Face Transformers for maximum control and flexibility'
sidebar_position: 1
---

import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using Moondream with Transformers

This guide shows you how to run Moondream directly with Hugging Face Transformers, giving you maximum control over model execution and parameters.

## Prerequisites

First, you'll need to install the core dependencies:

```bash
pip install transformers torch pillow einops
```

:::info System Requirements

- **RAM**: 8GB+ (16GB recommended)
- **Storage**: 5GB for model weights
- **GPU**: Recommended but not required (4GB+ VRAM)
- **Python**: 3.8 or higher
:::

### Platform-Specific Setup

<Tabs>
<TabItem value="linux-mac" label="Linux/Mac" default>

```bash
# Install pyvips for faster image processing
pip install pyvips-binary pyvips
```

</TabItem>
<TabItem value="windows" label="Windows">

```bash
# For GPU acceleration on Windows, install CUDA-enabled PyTorch:
pip install torch==2.5.1+cu121 torchvision==0.20.1+cu121 --index-url https://download.pytorch.org/whl/cu121

# Install pyvips for image processing
pip install pyvips-binary pyvips

# If you encounter errors with pyvips:
# 1. Download vips-dev-w64-all-8.16.0.zip from github.com/libvips/build-win64-mxe/releases
# 2. Extract and copy DLLs from 'vips-dev-8.16\bin' to your project root directory
# 3. Alternatively, add bin directory to your system PATH
```

</TabItem>
</Tabs>

## Basic Usage

Here's a simple example demonstrating the core Moondream capabilities:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from PIL import Image

# Load the model
model = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    revision="2025-01-09",
    trust_remote_code=True,
    # Uncomment for GPU acceleration & pip install accelerate
    # device_map={"": "cuda"}
)

# Load your image
image = Image.open("path/to/your/image.jpg")

# 1. Image Captioning
print("Short caption:")
print(model.caption(image, length="short")["caption"])

print("Detailed caption:")
for t in model.caption(image, length="normal", stream=True)["caption"]:
    print(t, end="", flush=True)

# 2. Visual Question Answering
print("Asking questions about the image:")
print(model.query(image, "How many people are in the image?")["answer"])

# 3. Object Detection
print("Detecting objects:")
objects = model.detect(image, "face")["objects"]
print(f"Found {len(objects)} face(s)")

# 4. Visual Pointing
print("Locating objects:")
points = model.point(image, "person")["points"]
print(f"Found {len(points)} person(s)")
```

## Advanced Features

### GPU Acceleration

To enable GPU acceleration:

```python
model = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    revision="2025-01-09",
    trust_remote_code=True,
    device_map={"": "cuda"},  # Use "cuda" for NVIDIA GPUs
)
```

### Multiple Model Instances

If you have enough VRAM (4-5GB per instance), you can run multiple instances of the model for parallel processing:

```python
model = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    revision="2025-01-09",
    trust_remote_code=True,
    device_map={"": "cuda"},
)

model2 = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    revision="2025-01-09",
    trust_remote_code=True,
    device_map={"": "cuda"},
)
```

### Efficient Image Encoding

For multiple operations on the same image, encode it once to save processing time:

```python
image = Image.open("path/to/your/image.jpg")
encoded_image = model.encode_image(image)

# Reuse the encoded image for each inference
print(model.caption(encoded_image, length="short")["caption"])
print(model.query(encoded_image, "How many people are in the image?")["answer"])
```

## API Reference

### Captioning

```python
model.caption(image, length="normal", stream=False)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `image`   | PIL.Image or encoded image | The image to process |
| `length`  | str | Caption detail level: "short" or "normal" |
| `stream`  | bool | Whether to stream the response token by token |

### Visual Question Answering

```python
model.query(image, question, stream=False)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `image`   | PIL.Image or encoded image | The image to process |
| `question` | str | The question to ask about the image |
| `stream`  | bool | Whether to stream the response token by token |

### Object Detection

```python
model.detect(image, object_name)
```

| Parameter    | Type                    | Description              |
|--------------|--------------------------|---------------------------|
| `image`      | PIL.Image or encoded image | The image to process      |
| `object_name` | str                      | The type of object to detect |

### Visual Pointing

```python
model.point(image, object_name)
```

| Parameter     | Type                    | Description               |
|---------------|--------------------------|----------------------------|
| `image`       | PIL.Image or encoded image | The image to process       |
| `object_name` | str                      | The type of object to locate |

## Performance Optimization

:::tip Best Practices

- Use GPU acceleration when possible
- Reuse encoded images for multiple operations
- For batch processing, pre-load the model once
- Process images in batches rather than loading/unloading the model repeatedly
- Resize very large images to reasonable dimensions before processing
- Use quantization for deployment on memory-constrained devices
:::

## Troubleshooting

:::warning Common Issues

- **Out of Memory**: Reduce image size or use lighter model variant
- **Slow Performance**: Enable GPU acceleration and reuse encoded images
- **Library Errors**: Ensure all dependencies are installed correctly
- **Unexpected Results**: Check image formatting and question clarity
:::

