---
title: "Caption"
description: "Generate detailed, natural language descriptions of image content, scenes, and visual elements."
sidebar_label: "Caption"
sidebar_position: 4
---

# Caption

The `/caption` endpoint generates natural language descriptions of images, from brief summaries to detailed explanations of visual content.

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

# Generate a caption
result = model.caption(image)
caption = result["caption"]
request_id = result["request_id"]
print(f"Caption: {caption}")
print(f"Request ID: {request_id}")

# Generate a short caption
short_result = model.caption(image, length="short")
short_caption = short_result["caption"]
print(f"Short Caption: {short_caption}")

# Stream the response
stream_result = model.caption(image, stream=True)
for chunk in stream_result["chunk"]:
    print(chunk, end="", flush=True)
```

  </TabItem>
  <TabItem value="js" label="JavaScript">
  
```javascript
const moondream = require('moondream');
const fs = require('fs');

// Initialize with API key
const model = moondream.vl({ apiKey: "your-api-key" });

// Load an image
const imageBuffer = fs.readFileSync("path/to/image.jpg");

// Generate a caption
const result = await model.caption(imageBuffer);
console.log(`Caption: ${result.caption}`);
console.log(`Request ID: ${result.request_id}`);

// Generate a short caption
const shortResult = await model.caption(imageBuffer, { length: "short" });
console.log(`Short Caption: ${shortResult.caption}`);

// Stream the response
const streamResult = await model.caption(imageBuffer, { stream: true });
for await (const chunk of streamResult.chunk) {
    process.stdout.write(chunk);
}
```

  </TabItem>
  <TabItem value="sh" label="cURL">
  
```bash
# Normal caption
curl -X POST https://api.moondream.ai/v1/caption \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,...",
    "length": "normal",
    "stream": false
  }'

# Short caption
curl -X POST https://api.moondream.ai/v1/caption \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,...",
    "length": "short",
    "stream": false
  }'

# Streaming caption
curl -X POST https://api.moondream.ai/v1/caption \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,...",
    "length": "normal",
    "stream": true
  }'
```

  </TabItem>
</Tabs>

## Example Response

For non-streaming responses:

```json
{
  "request_id": "2025-03-25_caption_2025-03-25-21:00:39-715d03",
  "caption": "A detailed caption describing the image..."
}
```

For streaming responses, you'll receive a series of data events:

```json
{data: {"chunk": "A scene ", "completed": false, "request_id": "2025-03-25_caption_123456"}}
{data: {"chunk": "showing a mountain", "completed": false, "request_id": "2025-03-25_caption_123456"}}
{data: {"chunk": " landscape.", "completed": false, "request_id": "2025-03-25_caption_123456"}}
{data: {"completed": true, "chunk": "", "org_id": "a349504c-8006-54f3-8862-ba0c41d2b4d7", "request_id": "2025-03-25_caption_123456"}}
```

## Caption Length Options

- **"short"**: Brief 1-2 sentence summary (e.g., "A red car parked on a street.")
- **"normal"** (default): Detailed description covering elements, context, colors, positioning, etc.

## Use Cases

- Generating alt text for accessibility
- Content indexing and organization
- Image search functionality
- Social media content creation
- Automated reporting and documentation

## Error Handling

Common error responses:

| Status Code | Description                                      |
|-------------|--------------------------------------------------|
| 400         | Bad Request - Invalid parameters or image format |
| 401         | Unauthorized - Invalid or missing API key        |
| 413         | Payload Too Large - Image size exceeds limits    |
| 429         | Too Many Requests - Rate limit exceeded          |
| 500         | Internal Server Error - Server-side issue        |

### Error Response Format

Error responses are returned in the following format:

```json
{
  "error": {
    "message": "Detailed error description",
    "type": "error_type",
    "param": "parameter_name",
    "code": "error_code"
  }
}
```

## Limitations

- Maximum image size: 10MB
- Supported image formats: JPEG, PNG, GIF (first frame only)
- Rate limits apply based on your plan

---

**Learn More:**

- Try the [interactive playground](https://moondream.ai/c/playground) to test captioning
- Explore [code examples](https://github.com/m87-labs/moondream-examples) in multiple languages
