---
id: streaming
slug: /streaming
title: Streaming
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StreamingDemo from '@site/src/components/StreamingDemo';

```bash {7}
curl -N -X POST https://api.moondream.ai/v1/query \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAg+Pkk+SVVVVVVVVWRdZGhoaGRkZGRoaGhwcHCDg4NwcHBoaHBwfHyDg4+Tj4eHg4eTk5ubm7q6srLZ2eD/////xABZAAADAQEBAQAAAAAAAAAAAAAABgcFCAECAQEAAAAAAAAAAAAAAAAAAAAAEAADAAMBAQEBAAAAAAAAAAAAAQIDIREEURKBEQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgAGQAZAwESAAISAAMSAP/aAAwDAQACEQMRAD8A5/PQAAABirHyVS2mUip/Pm4/vQAih9ABuRUrVLqMEALVNead7/pFgAfc+d5NLSEEAAAA/9k=",
    "question": "What is in this image?",
    "stream": true
  }'
```
<StreamingDemo />
Streaming lets you receive AI responses as they're being generated, word-by-word, instead of waiting for the complete answer. This creates a more responsive experience for your users. Streaming is available for the [query](./skills/query), [caption](./skills/caption), and [segment](./skills/segment) skills.

## Using with the SDK

<Tabs>
  <TabItem value="python" label="Python" default>

[View Python SDK Documentation →](https://pypi.org/project/moondream/)

### Query

```python {11}
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Stream a query response
for chunk in model.query(image, question="What is in this image?", stream=True)["answer"]:
    print(chunk, end="", flush=True)
```

### Caption

```python {11}
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Stream a caption
for chunk in model.caption(image, stream=True)["caption"]:
    print(chunk, end="", flush=True)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

[View Node.js SDK Documentation →](https://www.npmjs.com/package/moondream)

### Query

```javascript {14}
import { vl } from 'moondream';
import fs from 'fs';

// Initialize with your API key
const model = new vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const image = fs.readFileSync('path/to/image.jpg');

// Stream a query response
const stream = await model.query({
  image: image,
  question: 'What is in this image?',
  stream: true
});
for await (const chunk of stream.answer) {
  process.stdout.write(chunk);
}
```

### Caption

```javascript {14}
import { vl } from 'moondream';
import fs from 'fs';

// Initialize with your API key
const model = new vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const image = fs.readFileSync('path/to/image.jpg');

// Stream a caption
const stream = await model.caption({
  image: image,
  length: 'normal',
  stream: true
});
for await (const chunk of stream.caption) {
  process.stdout.write(chunk);
}
```

  </TabItem>
</Tabs>

### Segment

Segment streaming returns the bounding box immediately, followed by coarse path chunks, and finally the refined path:

<Tabs>
  <TabItem value="python" label="Python" default>

```python
import moondream as md
from PIL import Image

model = md.vl(api_key="YOUR_API_KEY")
image = Image.open("path/to/image.jpg")

# Stream segmentation updates
for update in model.segment(image, "cat", stream=True):
    if "bbox" in update and not update.get("completed"):
        print(f"Bbox: {update['bbox']}")  # Available immediately
    if "chunk" in update:
        print(update["chunk"], end="")  # Coarse path chunks
    if update.get("completed"):
        print(f"\nFinal path: {update['path']}")
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
import { vl } from 'moondream';
import fs from 'fs';

const model = new vl({ apiKey: 'YOUR_API_KEY' });
const image = fs.readFileSync('path/to/image.jpg');

const stream = await model.segment({
  image: image,
  object: 'cat',
  stream: true
});

for await (const update of stream) {
  if (update.bbox && !update.completed) {
    console.log('Bbox:', update.bbox);
  }
  if (update.chunk) {
    process.stdout.write(update.chunk);
  }
  if (update.completed) {
    console.log('\nFinal path:', update.path);
  }
}
```

  </TabItem>
</Tabs>

