---
title: "Query"
description: "Ask natural language questions about image content and receive detailed, accurate answers."
sidebar_label: "Query"
sidebar_position: 1
---

# Query

The `/query` endpoint enables you to ask natural language questions about images and receive detailed answers. This is also known as Visual Question Answering (VQA).

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

# Ask a question
result = model.query(image, "What's in this image?")
answer = result["answer"]
request_id = result["request_id"]
print(f"Answer: {answer}")
print(f"Request ID: {request_id}")

# Stream the response
stream_result = model.query(image, "What's in this image?", stream=True)
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

// Ask a question
const result = await model.query(imageBuffer, "What's in this image?");
console.log(`Answer: ${result.answer}`);
console.log(`Request ID: ${result.request_id}`);

// Stream the response
const streamResult = await model.query(imageBuffer, "What's in this image?", { stream: true });
for await (const chunk of streamResult.chunk) {
    process.stdout.write(chunk);
}
```

  </TabItem>
  <TabItem value="sh" label="cURL">
  
```bash
curl -X POST https://api.moondream.ai/v1/query \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,...",
    "question": "What is in this image?"
  }'
```

  </TabItem>
</Tabs>

## Example Response

```json
{
  "request_id": "2025-03-25_query_2025-03-25-21:00:39-715d03",
  "answer": "Detailed text answer to your question..."
}
```

## Best Practices

- Ask specific questions rather than general ones
- One question at a time yields better results than multiple questions
- If you want detailed answers, explicitly ask for details in your question
- Moondream can produce structured outputs. For example: "describe people in the image using JSON with keys 'hair_color', 'shirt_color', 'person_type'"

---

**Learn More:**

- Try the [interactive playground](https://moondream.ai/c/playground) to test queries
- Explore [code examples](https://github.com/m87-labs/moondream-examples) in multiple languages
