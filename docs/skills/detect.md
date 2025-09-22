---
title: "Detect"
description: "Identify and locate specific objects, people, or features within images with high accuracy."
sidebar_label: "Detect"
sidebar_position: 2
---

# Detect

The `/detect` endpoint identifies and locates specific objects within images. It returns bounding box coordinates for each detected instance.

## Example Request

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="py" label="Python" default>
  
```python
import moondream as md
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Initialize with API key
model = md.vl(api_key="your-api-key")

# Load an image
image = Image.open("path/to/image.jpg")

# Detect objects (e.g., "person", "car", "face", etc.)
result = model.detect(image, "person")
detections = result["objects"]
request_id = result["request_id"]
print(f"Found {len(detections)} people")
print(f"Request ID: {request_id}")

# Visualize the detections
plt.figure(figsize=(10, 10))
plt.imshow(image)
ax = plt.gca()

for obj in detections:
    # Convert normalized coordinates to pixel values
    x_min = obj["x_min"] * image.width
    y_min = obj["y_min"] * image.height
    x_max = obj["x_max"] * image.width
    y_max = obj["y_max"] * image.height
    
    # Calculate width and height for the rectangle
    width = x_max - x_min
    height = y_max - y_min
    
    # Create a rectangle patch
    rect = patches.Rectangle(
        (x_min, y_min), width, height, 
        linewidth=2, edgecolor='r', facecolor='none'
    )
    ax.add_patch(rect)
    plt.text(
        x_min, y_min, "Person", 
        color='white', fontsize=12,
        bbox=dict(facecolor='red', alpha=0.5)
    )

plt.axis('off')
plt.savefig("output_with_detections.jpg")
plt.show()
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

// Detect objects
const result = await model.detect(imageBuffer, "person");
console.log(`Found ${result.objects.length} people`);
console.log(`Request ID: ${result.request_id}`);

// Process the detections
result.objects.forEach((obj, index) => {
    console.log(`Person ${index + 1}: x_min=${obj.x_min}, y_min=${obj.y_min}, x_max=${obj.x_max}, y_max=${obj.y_max}`);
});
```

  </TabItem>
  <TabItem value="sh" label="cURL">
  
```bash
curl -X POST https://api.moondream.ai/v1/detect \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,...",
    "object": "person"
  }'
```

  </TabItem>
</Tabs>

## Example Response

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

## Common Object Types

Moondream can detect a wide range of objects:

- person, face, car, dog, cat
- building, furniture, text, food, plant

**Zero-Shot Detection**: Moondream can detect virtually any object you specify, not just from a predefined list. Try describing the object as specifically as possible for best results.

---

**Learn More:**

- Try the [interactive playground](https://moondream.ai/c/playground) to test detection
- Explore [code examples](https://github.com/m87-labs/moondream-examples) in multiple languages
