---
title: "Segment"
description: "Generate precise SVG path segmentation masks for objects in images."
sidebar_label: "Segment"
sidebar_position: 4
---

# Segment

The `/segment` endpoint generates precise SVG path segmentation masks for specific objects in images. It returns an SVG path string that outlines the object, along with a bounding box.

## Example Request

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="py" label="Python" default>

```python
import moondream as md
from PIL import Image

# Initialize with API key
model = md.vl(api_key="your-api-key")

# Load an image
image = Image.open("path/to/image.jpg")

# Segment an object
result = model.segment(image, "cat")
svg_path = result["path"]
bbox = result["bbox"]

print(f"SVG Path: {svg_path[:100]}...")
print(f"Bounding box: {bbox}")

# With spatial hint (point) to guide segmentation
result = model.segment(image, "cat", spatial_refs=[[0.5, 0.3]])

# With spatial hint (bounding box)
result = model.segment(image, "cat", spatial_refs=[[0.2, 0.1, 0.8, 0.9]])
```

  </TabItem>
  <TabItem value="js" label="Node.js">

```javascript
import { vl } from 'moondream';
import fs from 'fs';

// Initialize with API key
const model = new vl({ apiKey: "your-api-key" });

// Load an image
const image = fs.readFileSync("path/to/image.jpg");

// Segment an object
const result = await model.segment({
  image: image,
  object: "cat"
});

console.log(`SVG Path: ${result.path.substring(0, 100)}...`);
console.log(`Bounding box:`, result.bbox);
```

  </TabItem>
  <TabItem value="sh" label="cURL">

```bash
curl -X POST https://api.moondream.ai/v1/segment \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,...",
    "object": "cat"
  }'
```

  </TabItem>
</Tabs>

## Example Response

```json
{
  "path": "M 0 0.76 L 0 0.32 L 0.03 0.31 C 0.04 0.30 0.09 0.28 0.12 0.27...",
  "bbox": {
    "x_min": 0.0002,
    "y_min": 0.0039,
    "x_max": 0.7838,
    "y_max": 0.9971
  }
}
```

## Spatial References

You can guide the segmentation by providing spatial references - either points or bounding boxes with normalized coordinates (0-1):

- **Point**: `[x, y]` - A single point to indicate the object location
- **Bounding box**: `[x1, y1, x2, y2]` - A region containing the object

```python
# Point hint - segment object near center
result = model.segment(image, "person", spatial_refs=[[0.5, 0.5]])

# Bounding box hint - segment object within region
result = model.segment(image, "person", spatial_refs=[[0.1, 0.2, 0.6, 0.8]])

# Multiple hints
result = model.segment(image, "person", spatial_refs=[[0.3, 0.4], [0.7, 0.6]])
```

## Streaming

Segment supports streaming to receive the bounding box immediately and coarse path updates as they're generated:

<Tabs>
  <TabItem value="py" label="Python" default>

```python
import moondream as md
from PIL import Image

model = md.vl(api_key="your-api-key")
image = Image.open("path/to/image.jpg")

# Stream segmentation updates
for update in model.segment(image, "cat", stream=True):
    if "bbox" in update and not update.get("completed"):
        # Bounding box available in first message
        print(f"Bbox: {update['bbox']}")
    if "chunk" in update:
        # Coarse path chunks
        print(update["chunk"], end="")
    if update.get("completed"):
        # Final refined path
        print(f"\nFinal path: {update['path'][:100]}...")
```

  </TabItem>
  <TabItem value="sh" label="cURL">

```bash
curl -N -X POST https://api.moondream.ai/v1/segment \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,...",
    "object": "cat",
    "stream": true
  }'
```

  </TabItem>
</Tabs>

### Streaming Response Format

When streaming, you'll receive Server-Sent Events with different message types:

1. **Bounding box** (first message):
```json
{"type": "bbox", "bbox": {"x_min": 0.0, "y_min": 0.0, "x_max": 0.78, "y_max": 0.99}}
```

2. **Path chunks** (coarse path updates):
```json
{"type": "path_delta", "chunk": "M 0 0.76", "completed": false}
```

3. **Final message** (refined path):
```json
{"type": "final", "path": "M 0 0.76 L 0 0.32...", "bbox": {...}, "completed": true}
```

## Using the SVG Path

The path coordinates are normalized to [0, 1]. Use a viewBox of `0 0 1 1` and set `preserveAspectRatio="none"` to match your image:

```html
<svg viewBox="0 0 1 1" preserveAspectRatio="none" style="width: 800px; height: 600px;">
  <image href="your-image.jpg" width="1" height="1" preserveAspectRatio="none"/>
  <path d="M 0 0.76 L 0 0.32..." fill="rgba(255,0,0,0.3)" stroke="red" stroke-width="0.002"/>
</svg>
```

## Segment vs. Detect

| Feature | Segment | Detect |
|---------|---------|--------|
| Output | SVG path (pixel-level mask) | Bounding box |
| Precision | Exact object boundaries | Rectangular approximation |
| Use case | Cutouts, masks, precise selection | Object counting, localization |
| Streaming | Yes (bbox + path chunks) | No |

---

**Learn More:**

- Try the [interactive playground](https://moondream.ai/c/playground) to test segmentation
- Explore [code examples](https://github.com/m87-labs/moondream-examples) in multiple languages
