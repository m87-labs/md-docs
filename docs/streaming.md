---
id: streaming
slug: /streaming
title: Streaming
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StreamingDemo from '@site/src/components/StreamingDemo';

```bash {}
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
Streaming lets you receive AI responses as they're being generated, word-by-word, instead of waiting for the complete answer. This creates a more responsive experience for your users.  Streaming is available for the `query` and `caption` endpoints.

## Using with the SDK

<Tabs>
  <TabItem value="python" label="Python" default>

The Python SDK handles streaming automatically:

```python
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Stream a query response
stream_result = model.query(image, "What is in this image?", stream=True)
for chunk in stream_result["chunk"]:
    print(chunk, end="", flush=True)
```

For captions:

```python
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Stream a caption
stream_result = model.caption(image, stream=True)
for chunk in stream_result["chunk"]:
    print(chunk, end="", flush=True)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

The Node.js SDK handles streaming automatically:

```javascript
const moondream = require('moondream');
const fs = require('fs');

// Initialize with your API key
const model = moondream.vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const imageBuffer = fs.readFileSync('path/to/image.jpg');

// Stream a query response
const streamResult = await model.query(imageBuffer, 'What is in this image?', { stream: true });
for await (const chunk of streamResult.chunk) {
    process.stdout.write(chunk);
}
```

For captions:

```javascript
const moondream = require('moondream');
const fs = require('fs');

// Initialize with your API key
const model = moondream.vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const imageBuffer = fs.readFileSync('path/to/image.jpg');

// Stream a caption
const streamResult = await model.caption(imageBuffer, { stream: true });
for await (const chunk of streamResult.chunk) {
    process.stdout.write(chunk);
}
```

  </TabItem>
</Tabs>

