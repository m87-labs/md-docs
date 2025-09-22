---
title: 'Using Moondream with Transformers'
description: 'A guide for getting started with Moondream on Hugging Face Transformers'
sidebar_position: 1
---

import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using Moondream with Transformers

Basic and advanced features of Moondream on Hugging Face Transformers.

## Prerequisites

First, install the dependencies:

```bash
pip install "transformers>=4.51.1" "torch>=2.7.0" "accelerate>=1.10.0" "Pillow>=11.0.0"
```

## Basic Usage

Moondream provides four core skills: image captioning, visual question answering, object detection, and visual pointing.

<Tabs>
<TabItem value="caption" label="Caption" default>

Captioning does not require a prompt; just give Moondream an image and it will produce the caption right away. For fine-grained control, you can set the desired length of the caption, as well as adjust sampling settings. 

<div style={{display: 'flex', gap: '20px', alignItems: 'flex-start', overflow: 'hidden'}}>
<div style={{flex: '0 0 300px'}}>

**Parameters:**
- `image`: PIL.Image or encoded image - The image to process.
- `length`: str - Caption detail level: "short", "normal", or "long" (default: "normal").
- `stream`: bool - Whether to stream the response token by token (default: False).
- `settings`: dict - Optional settings with:
  - `temperature`: float - Controls randomness in generation (default: 0.5).
  - `max_tokens`: int - Max number of tokens that can be generated (default: 768).
  - `top_p`: float - Sample the set of most likely tokens that have a cumulative probability >= top_p (default: 0.3).

</div>
<div style={{flex: '1', minWidth: '0', overflow: 'auto'}}>

```python
from transformers import AutoModelForCausalLM
from PIL import Image
import torch

# Load the model
model = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    trust_remote_code=True,
    dtype=torch.bfloat16,
    device_map="mps", # "cuda" on Nvidia GPUs
)

# Load your image
image = Image.open("path/to/your/image.jpg")

# Optionally set sampling settings
settings = {"temperature": 0.5, "max_tokens": 768, "top_p": 0.3}

# Generate a short caption
short_result = model.caption(
    image, 
    length="short", 
    settings=settings
)
print(short_result)
```

**Example Response:**
```python
{
    "caption": "Four brown horses with red and black harnesses plow a field, guided by two men in western attire, with a majestic mountain range in the background."
}
```

</div>
</div>

</TabItem>
<TabItem value="query" label="Query">

The query skill can be used to ask open-ended questions about images. In reasoning mode, Moondream may decide to ground its thoughts by pointing out parts of the image. These grounded points are visible in the model's chain of thought. 

<div style={{display: 'flex', gap: '20px', alignItems: 'flex-start', overflow: 'hidden'}}>
<div style={{flex: '0 0 300px'}}>

**Parameters:**
- `image`: PIL.Image or encoded image - The image to process.
- `question`: str - The question to ask about the image.
- `reasoning`: bool - Enable to allow the model to "think" about the question before answering (default: False (Moondream2), True (Moondream3)).
- `stream`: bool - Whether to stream the response token by token (default: False).
- `settings`: dict - Optional settings with:
  - `temperature`: float - Controls randomness in generation (default: 0.5).
  - `max_tokens`: int - Max number of tokens that can be generated (default: 768).
  - `top_p`: float - Sample the set of most likely tokens that have a cumulative probability >= top_p (default: 0.3).

</div>
<div style={{flex: '1', minWidth: '0', overflow: 'auto'}}>

```python
from transformers import AutoModelForCausalLM
from PIL import Image
import torch

# Load the model
model = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    trust_remote_code=True,
    dtype=torch.bfloat16,
    device_map="mps", # "cuda" on Nvidia GPUs
)

# Load your image
image = Image.open("path/to/your/image.jpg")

# Optionally set sampling settings
settings = {"temperature": 0.5, "max_tokens": 768, "top_p": 0.3}

# Answer a query
result = model.query(
    image,
    "What colors are prominent in this image?",
    settings=settings
)
print(result)

# Answer a query with reasoning
result = model.query(
    image, "How many horses are there?", settings=settings, reasoning=True
)
print(result)
```

**Example Response:**
```python
{
    "answer": "The prominent colors in this image are brown, black, white, and blue."
}

# Answer with reasoning
{
    "reasoning": {
        "text": "I see 4 horses.",
        "grounding": [
            {
                "start_idx": 6,
                "end_idx": 14,
                "points": [
                    (0.359375, 0.4423828125),
                    (0.5791015625, 0.5),
                    (0.810546875, 0.4423828125),
                    (0.9345703125, 0.5)
                ]
            }
        ]
    },
    "answer": "4"
}
```

</div>
</div>

</TabItem>
<TabItem value="detect" label="Detect">

The detect skill provides bounding boxes for objects in an image based on a prompt. Bounding box coordinates are proportional relative to the image. Values range from 0 to 1, where 1 refers to either the bottom or right edge of the image.

<div style={{display: 'flex', gap: '20px', alignItems: 'flex-start', overflow: 'hidden'}}>
<div style={{flex: '0 0 300px'}}>

**Parameters:**
- `image`: PIL.Image or encoded image - The image to process.
- `object`: str - Prompt that describes the object to detect.
- `settings`: dict - Optional settings with:
    - `max_objects`: int - Max number of objects the model will try to detect (default: 50 (Moondream2), 150 (Moondream3))

</div>
<div style={{flex: '1', minWidth: '0', overflow: 'auto'}}>

```python
from transformers import AutoModelForCausalLM
from PIL import Image
import torch

# Load the model
model = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    trust_remote_code=True,
    dtype=torch.bfloat16,
    device_map="mps", # "cuda" on Nvidia GPUs
)

# Load your image
image = Image.open("path/to/your/image.jpg")

# Optional sampling settings
settings = {"max_objects": 50}

# Run Moondream
result = model.detect(image, "Runner with the purple socks", settings=settings)
print(result)

```

**Example Response:**
```python
{
    "objects": [
        {
            "x_min": 0.2685760408639908,
            "y_min": 0.3463422954082489,
            "x_max": 0.4013458341360092,
            "y_max": 0.8177202045917511
        }
    ]
}
```

</div>
</div>

</TabItem>
<TabItem value="point" label="Point">

Point out objects in images with a prompt. Point coordinates are proportional relative to the image. Values range from 0 to 1, where 1 refers to either the bottom or right edge of the image.

<div style={{display: 'flex', gap: '20px', alignItems: 'flex-start', overflow: 'hidden'}}>
<div style={{flex: '0 0 300px'}}>

**Parameters:**
- `image`: PIL.Image or encoded image - The image to process.
- `object`: str - Prompt that describes the object to locate.
- `settings`: dict - Optional settings with:
  - `max_objects`: int - Max number of objects the model will try to point to (default: 50 (Moondream2), 150 (Moondream3))

</div>
<div style={{flex: '1', minWidth: '0', overflow: 'auto'}}>

```python
from transformers import AutoModelForCausalLM
from PIL import Image
import torch

# Load the model
model = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    trust_remote_code=True,
    dtype=torch.bfloat16,
    device_map="mps", # "cuda" on Nvidia GPUs
)

# Load your image
image = Image.open("path/to/your/image.jpg")

# Optional sampling settings
settings = {"max_objects": 50}

# Run Moondream
result = model.point(image, "Runner with the purple socks", settings=settings)
print(result)
```

**Example Response:**
```python
{
    "points": [
        {
            "x": 0.359375,
            "y": 0.4404296875
        }
    ]
}
```

</div>
</div>

</TabItem>
</Tabs>

## Moondream3

[Sign up for early access](https://huggingface.co/moondream/moondream3-preview) to start using [Moondream3](https://moondream.ai/blog/moondream-3-preview). Currently, only Nvidia GPUs with 24GB+ of memory are supported; quantized and Apple Silicon versions coming soon.

```python
model = AutoModelForCausalLM.from_pretrained(
    "moondream/moondream3-preview",
    trust_remote_code=True,
    dtype=torch.bfloat16,
    device_map="cuda"
)
```

## Advanced Features

### Streaming

Caption and Query both support streaming, displaying tokens immediately as they are generated.

```python
model = AutoModelForCausalLM.from_pretrained(
    "vikhyatk/moondream2",
    revision="2025-01-09",
    trust_remote_code=True,
    device_map="mps",  # "cuda" for NVIDIA GPUs
)

image = Image.open("path/to/your/image.jpg")

for t in model.caption(image, length="normal", stream=True)["caption"]:
    print(t, end="", flush=True)
```

### Compile

If you are using the model to make multiple inference calls, compiling can noticeably improve generation speed. This is especially true for [Moondream3](https://huggingface.co/moondream/moondream3-preview), as it uses [FlexAttention](https://pytorch.org/blog/flexattention-for-inference/). After the model has been created, call `model.compile()`.

```python
model = AutoModelForCausalLM.from_pretrained(
    "moondream/moondream3-preview",
    trust_remote_code=True,
    dtype=torch.bfloat16,
    device_map="cuda"
)

model.compile()
```

### Reuse Image Encoding

If you are using an image for multiple inferences, it can be beneficial to reuse the image encoding. Since encoding makes up a large portion of the time Moondream takes to generate a response, reusing it allows you to quickly generate multiple responses for the same image.
```python
image = Image.open("path/to/your/image.jpg")
encoded_image = model.encode_image(image)

# Reuse the encoded image for each inference
print(model.caption(encoded_image, length="short")["caption"])
print(model.query(encoded_image, "How many people are in the image?")["answer"])
```

