---
id: huggingface-transformers
slug: huggingface-transformers
title: HuggingFace Transformers
description: Run Moondream locally through the HuggingFace Transformers stack for full control and customization.
---

# HuggingFace Transformers

Moondream runs seamlessly through the HuggingFace Transformers ecosystem when you need direct model access, custom integrations, or advanced optimization beyond Moondream Station.

## When to use Transformers directly?

<div className="row">
  <div className="col col--3">
    <div className="card">
      <div className="card__body">
        <h4>🎯 Custom Integration</h4>
        <p>Build ML pipelines or embed Moondream in existing apps.</p>
      </div>
    </div>
  </div>
  
  <div className="col col--3">
    <div className="card">
      <div className="card__body">
        <h4>🔬 Fine-tuning</h4>
        <p>Adapt the model with your own datasets and tasks.</p>
      </div>
    </div>
  </div>
  
  <div className="col col--3">
    <div className="card">
      <div className="card__body">
        <h4>⚙️ Advanced Config</h4>
        <p>Tweak model parameters or experiment with new features.</p>
      </div>
    </div>
  </div>
  
  <div className="col col--3">
    <div className="card">
      <div className="card__body">
        <h4>📦 Custom Deployment</h4>
        <p>Integrate with on-prem or cloud infrastructure.</p>
      </div>
    </div>
  </div>
</div>

---

## Step 1: Install Dependencies

Install the required packages:

```bash
pip install transformers torch pillow
```

:::warning Hardware Requirements
Moondream 2B requires ~8GB RAM minimum. For GPU acceleration, ensure you have CUDA drivers installed. The model runs on CPU if no GPU is available, though it will be slower.
:::

## Step 2: Load the Model

Initialize Moondream with Transformers:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from PIL import Image

# Load the model (automatically downloads on first run)
model_id = "vikhyatk/moondream2"
revision = "2025-06-21"  # Pin to specific version

model = AutoModelForCausalLM.from_pretrained(
    model_id,
    revision=revision,
    trust_remote_code=True,
    device_map={"": "cuda"}  # Use "cpu" if no GPU
)

tokenizer = AutoTokenizer.from_pretrained(model_id, revision=revision)
```

:::info Version Pinning
Always specify a revision for production use. Moondream is updated frequently. Check the [HuggingFace model page](https://huggingface.co/vikhyatk/moondream2) for the latest release.
:::

## Step 3: Run Inference

Use the model for various vision tasks:

### Visual Question Answering

```python
# Load an image
image = Image.open("path/to/image.jpg")

# Ask a question
answer = model.query(image, "What's in this image?")["answer"]
print(answer)
```

### Image Captioning

```python
# Generate short caption
caption = model.caption(image, length="short")["caption"]
print(caption)

# Generate detailed caption (with streaming)
for token in model.caption(image, length="normal", stream=True)["caption"]:
    print(token, end="", flush=True)
```

### Object Detection

```python
# Detect specific objects
objects = model.detect(image, "face")["objects"]
print(f"Found {len(objects)} face(s)")

# Each object has bounding box coordinates
for obj in objects:
    print(f"Box: {obj['bbox']}, Confidence: {obj['confidence']}")
```

### Point Detection

```python
# Find x,y points of objects
points = model.point(image, "person")["points"]
print(f"Found {len(points)} person(s)")
```

## Step 4: Optimization Tips

```python
# For faster inference on GPU
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    revision=revision,
    trust_remote_code=True,
    torch_dtype=torch.float16,  # Use half precision
    device_map={"": "cuda"}
)

# For CPU-only systems, use quantization
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    revision=revision,
    trust_remote_code=True,
    load_in_8bit=True  # Requires bitsandbytes library
)
```

:::tip Advanced Usage
For fine-tuning, batch processing, and integration guides, visit the [Moondream documentation](https://docs.moondream.ai) and the [model page on HuggingFace](https://huggingface.co/vikhyatk/moondream2).
:::

---

## Need Help?

- 📚 [Documentation](https://docs.moondream.ai)
- 💬 [Discord Community](https://discord.gg/moondream)
- 🐛 [GitHub Issues](https://github.com/vikhyat/moondream)
- 🤗 [HuggingFace Model](https://huggingface.co/vikhyatk/moondream2)

