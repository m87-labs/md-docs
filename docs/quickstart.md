---
sidebar_position: 2
title: "Getting Started"
---

Moondream is a powerful, fast, and efficient vision AI model. It can answer questions, detect objects, count and point, caption, perform OCR, and more.  Grab an API key at the [Moondream Cloud Console](https://moondream.ai/c/cloud/api-keys) and try it out!

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="query" label="Query" default>

**Visual Question Answering** - Ask natural language questions about images.

```bash
curl -X POST https://api.moondream.ai/v1/query \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAg+Pkk+SVVVVVVVVWRdZGhoaGRkZGRoaGhwcHCDg4NwcHBoaHBwfHyDg4+Tj4eHg4eTk5ubm7q6srLZ2eD/////xABZAAADAQEBAQAAAAAAAAAAAAAABgcFCAECAQEAAAAAAAAAAAAAAAAAAAAAEAADAAMBAQEBAAAAAAAAAAAAAQIDIREEURKBEQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgAGQAZAwESAAISAAMSAP/aAAwDAQACEQMRAD8A5/PQAAABirHyVS2mUip/Pm4/vQAih9ABuRUrVLqMEALVNead7/pFgAfc+d5NLSEEAAAA/9k=",
    "question": "What is in this image?"
  }'
```

**Response:**
```json
{
  "request_id": "2025-03-25_query_2025-03-25-21:00:39-715d03",
  "answer": "The image is a grayscale depiction of a crescent moon against a black background. The moon is rendered in varying shades of gray, appearing as a smooth, curved shape with no visible craters or details."
}
```

  </TabItem>
  <TabItem value="detect" label="Detect">

**Object Detection** - Identify and locate objects with bounding boxes.

```bash
curl -X POST https://api.moondream.ai/v1/detect \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAg+Pkk+SVVVVVVVVWRdZGhoaGRkZGRoaGhwcHCDg4NwcHBoaHBwfHyDg4+Tj4eHg4eTk5ubm7q6srLZ2eD/////xABZAAADAQEBAQAAAAAAAAAAAAAABgcFCAECAQEAAAAAAAAAAAAAAAAAAAAAEAADAAMBAQEBAAAAAAAAAAAAAQIDIREEURKBEQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgAGQAZAwESAAISAAMSAP/aAAwDAQACEQMRAD8A5/PQAAABirHyVS2mUip/Pm4/vQAih9ABuRUrVLqMEALVNead7/pFgAfc+d5NLSEEAAAA/9k=",
    "object": "moon"
  }'
```

**Response:**
```json
{
  "request_id": "2025-03-25_detect_2025-03-25-21:00:39-715d03",
  "objects": [
    {
      "x_min": 0.2,
      "y_min": 0.3,
      "x_max": 0.6,
      "y_max": 0.8
    }
  ]
}
```

  </TabItem>
  <TabItem value="point" label="Point">

**Object Pointing** - Get precise center coordinates for objects.

```bash
curl -X POST https://api.moondream.ai/v1/point \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAg+Pkk+SVVVVVVVVWRdZGhoaGRkZGRoaGhwcHCDg4NwcHBoaHBwfHyDg4+Tj4eHg4eTk5ubm7q6srLZ2eD/////xABZAAADAQEBAQAAAAAAAAAAAAAABgcFCAECAQEAAAAAAAAAAAAAAAAAAAAAEAADAAMBAQEBAAAAAAAAAAAAAQIDIREEURKBEQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgAGQAZAwESAAISAAMSAP/aAAwDAQACEQMRAD8A5/PQAAABirHyVS2mUip/Pm4/vQAih9ABuRUrVLqMEALVNead7/pFgAfc+d5NLSEEAAAA/9k=",
    "object": "moon"
  }'
```

**Response:**
```json
{
  "request_id": "2025-03-25_point_2025-03-25-21:00:39-715d03",
  "points": [
    {
      "x": 0.65,
      "y": 0.42
    }
  ]
}
```

  </TabItem>
  <TabItem value="caption" label="Caption">

**Image Captioning** - Generate natural language descriptions of images.

```bash
curl -X POST https://api.moondream.ai/v1/caption \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAg+Pkk+SVVVVVVVVWRdZGhoaGRkZGRoaGhwcHCDg4NwcHBoaHBwfHyDg4+Tj4eHg4eTk5ubm7q6srLZ2eD/////xABZAAADAQEBAQAAAAAAAAAAAAAABgcFCAECAQEAAAAAAAAAAAAAAAAAAAAAEAADAAMBAQEBAAAAAAAAAAAAAQIDIREEURKBEQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgAGQAZAwESAAISAAMSAP/aAAwDAQACEQMRAD8A5/PQAAABirHyVS2mUip/Pm4/vQAih9ABuRUrVLqMEALVNead7/pFgAfc+d5NLSEEAAAA/9k=",
    "length": "normal",
    "stream": false
  }'
```

**Response:**
```json
{
  "caption": "A crescent moon shape is centered against a solid black background. The crescent is oriented with its convex side facing right and its concave side facing left. The image is monochromatic, with shades of gray and white. No other objects, patterns, or text are visible.",
  "metrics": {
    "input_tokens": 735,
    "output_tokens": 45,
    "prefill_time_ms": 43.51004003547132,
    "decode_time_ms": 415.3184471651912,
    "ttft_ms": 81.97528193704784
  },
  "finish_reason": "stop"
}
```

  </TabItem>
</Tabs>

## Moondream SDK

<Tabs>
  <TabItem value="python" label="Python" default>

**Installation:**

```bash
pip install moondream
```

[View Python SDK Documentation →](https://pypi.org/project/moondream/)

<Tabs groupId="api-method">
  <TabItem value="query" label="Query" default>

**Visual Question Answering** - Ask natural language questions about images.

```python
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Ask a question
result = model.query(image, "What is in this image?")
print(result["answer"])
```

  </TabItem>
  <TabItem value="detect" label="Detect">

**Object Detection** - Identify and locate objects with bounding boxes.

```python
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Detect objects
result = model.detect(image, "moon")
for obj in result["objects"]:
    print(f"Bounds: ({obj['x_min']}, {obj['y_min']}) to ({obj['x_max']}, {obj['y_max']})")
```

  </TabItem>
  <TabItem value="point" label="Point">

**Object Pointing** - Get precise center coordinates for objects.

```python
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Locate objects
result = model.point(image, "moon")
for point in result["points"]:
    print(f"Center: ({point['x']}, {point['y']})")
```

  </TabItem>
  <TabItem value="caption" label="Caption">

**Image Captioning** - Generate natural language descriptions of images.

```python
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Generate a caption
result = model.caption(image, length="normal")
print(result["caption"])
```

  </TabItem>
</Tabs>

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

**Installation:**

```bash
npm install moondream
```

[View Node.js SDK Documentation →](https://www.npmjs.com/package/moondream)

<Tabs groupId="api-method">
  <TabItem value="query" label="Query" default>

**Visual Question Answering** - Ask natural language questions about images.

```javascript
import { vl } from 'moondream';
import fs from 'fs';

// Initialize with your API key
const model = new vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const image = fs.readFileSync('path/to/image.jpg');

// Ask a question
const result = await model.query({
  image: image,
  question: 'What is in this image?'
});
console.log(result.answer);
```

  </TabItem>
  <TabItem value="detect" label="Detect">

**Object Detection** - Identify and locate objects with bounding boxes.

```javascript
import { vl } from 'moondream';
import fs from 'fs';

// Initialize with your API key
const model = new vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const image = fs.readFileSync('path/to/image.jpg');

// Detect objects
const result = await model.detect({
  image: image,
  object: 'moon'
});
result.objects.forEach(obj => {
  console.log(`Bounds: (${obj.x_min}, ${obj.y_min}) to (${obj.x_max}, ${obj.y_max})`);
});
```

  </TabItem>
  <TabItem value="point" label="Point">

**Object Pointing** - Get precise center coordinates for objects.

```javascript
import { vl } from 'moondream';
import fs from 'fs';

// Initialize with your API key
const model = new vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const image = fs.readFileSync('path/to/image.jpg');

// Locate objects
const result = await model.point({
  image: image,
  object: 'moon'
});
result.points.forEach(point => {
  console.log(`Center: (${point.x}, ${point.y})`);
});
```

  </TabItem>
  <TabItem value="caption" label="Caption">

**Image Captioning** - Generate natural language descriptions of images.

```javascript
import { vl } from 'moondream';
import fs from 'fs';

// Initialize with your API key
const model = new vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const image = fs.readFileSync('path/to/image.jpg');

// Generate a caption
const result = await model.caption({
  image: image,
  length: 'normal'
});
console.log(result.caption);
```

  </TabItem>
</Tabs>

  </TabItem>
</Tabs>

**More Examples**: Check out our [Moondream Examples](https://github.com/m87-labs/moondream-examples) repo for complete projects and use cases.

## Running Locally

Want to run Moondream on your own hardware instead of using the Cloud API?

- **Mac/Linux**: Use [Moondream Station](/station) - the easiest way to run locally
- **Advanced**: Use [Hugging Face Transformers](/advanced/transformers) for custom integration

## Next Steps

- **Try it live**: Use our [interactive playground](https://moondream.ai/c/playground) to test without coding
- **Deep dive**: Explore detailed documentation for each skill - [Query](/skills/query), [Detect](/skills/detect), [Point](/skills/point), [Caption](/skills/caption)
- **More capabilities**: Check out all [Moondream Skills](/skills/)
