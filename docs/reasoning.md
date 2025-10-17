---
id: reasoning
slug: /reasoning
title: Reasoning
---
```bash {7}
curl -X POST https://api.moondream.ai/v1/query \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,/9j//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAg+Pkk+SVVVVVVVVWRdZGhoaGRkZGRoaGhwcHCDg4NwcHBoaHBwfHyDg4+Tj4eHg4eTk5ubm7q6srLZ2eD/////xABZAAADAQEBAQAAAAAAAAAAAAAABgcFCAECAQEAAAAAAAAAAAAAAAAAAAAAEAADAAMBAQEBAAAAAAAAAAAAAQIDIREEURKBEQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgAGQAZAwESAAISAAMSAP/aAAwDAQACEQMRAD8A5/PQAAABirHyVS2mUip/Pm4/vQAih9ABuRUrVLqMEALVNead7/pFgAfc+d5NLSEEAAAA/9k=",
    "question": "What is in this image?",
    "reasoning": true
  }'
```
Enable Moondream's reasoning capabilities to improve result quality for complex visual questions. When reasoning is enabled, the model takes more time to analyze the image and formulate better answers.

### When to Use Reasoning
- **Complex visual analysis**: Multi-step reasoning about spatial relationships, counting, or detailed observations
- **Nuanced questions**: Questions requiring careful interpretation or inference
- **High accuracy requirements**: When you need the most accurate possible answer

### Trade-offs
- **Speed**: Reasoning adds minor latency to requests (typically 10-20% longer)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



## SDK Examples

<Tabs>
  <TabItem value="python" label="Python" default>

```python
import moondream as md
from PIL import Image

# Initialize with your API key
model = md.vl(api_key="YOUR_API_KEY")

# Load an image
image = Image.open("path/to/image.jpg")

# Query with reasoning enabled
result = model.query(image, "What is in this image?", reasoning=True)
print(result["answer"])
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const moondream = require('moondream');
const fs = require('fs');

// Initialize with your API key
const model = moondream.vl({ apiKey: 'YOUR_API_KEY' });

// Load an image
const imageBuffer = fs.readFileSync('path/to/image.jpg');

// Query with reasoning enabled
const result = await model.query(imageBuffer, 'What is in this image?', { reasoning: true });
console.log(result.answer);
```

  </TabItem>
</Tabs>

