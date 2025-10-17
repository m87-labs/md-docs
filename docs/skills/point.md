---
title: "Point"
description: "Precisely locate and point to specific objects or regions within images using coordinate-based positioning."
sidebar_label: "Point"
sidebar_position: 3
---

# Point

The `/point` endpoint provides precise coordinate locations for specific objects in images. Unlike `/detect` which returns bounding boxes, this endpoint returns center points for each instance of the specified object.

## Example Request

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="py" label="Python" default>
  
```python
import moondream as md
from PIL import Image
import matplotlib.pyplot as plt

# Initialize with API key
model = md.vl(api_key="your-api-key")

# Load an image
image = Image.open("path/to/image.jpg")

# Locate objects (e.g., "person", "car", "face", etc.)
result = model.point(image, "face")
points = result["points"]
request_id = result["request_id"]
print(f"Found {len(points)} faces")
print(f"Request ID: {request_id}")

# Visualize the points
plt.figure(figsize=(10, 10))
plt.imshow(image)

for point in points:
    # Convert normalized coordinates to pixel values
    x = point["x"] * image.width
    y = point["y"] * image.height
    
    # Plot the point
    plt.plot(x, y, 'ro', markersize=15, alpha=0.7)
    plt.text(
        x + 10, y, "Face", 
        color='white', fontsize=12,
        bbox=dict(facecolor='red', alpha=0.5)
    )

plt.axis('off')
plt.savefig("output_with_points.jpg")
plt.show()
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

// Locate objects
const result = await model.point({
  image: image,
  object: "face"
});
console.log(`Found ${result.points.length} faces`);
console.log(`Request ID: ${result.request_id}`);

// Process the points
result.points.forEach((point, index) => {
  console.log(`Face ${index + 1}: x=${point.x}, y=${point.y}`);
});
```

  </TabItem>
  <TabItem value="sh" label="cURL">
  
```bash
curl -X POST https://api.moondream.ai/v1/point \
  -H 'Content-Type: application/json' \
  -H 'X-Moondream-Auth: YOUR_API_KEY' \
  -d '{
    "image_url": "data:image/jpeg;base64,...",
    "object": "face"
  }'
```

  </TabItem>
</Tabs>

## Example Response

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

## Point vs. Detect

- `/point` returns center coordinates only (x, y)
- `/detect` returns bounding boxes (x_min, y_min, x_max, y_max)

Use `/point` when you need:

- Precise object center points
- Simpler data for plotting
- Multiple instance counting

Use `/detect` when you need:

- Object size information
- Visual highlighting of complete objects
- Cropping regions of interest

---

**Learn More:**

- Try the [interactive playground](https://moondream.ai/c/playground) to test pointing
- Explore [code examples](https://github.com/m87-labs/moondream-examples) in multiple languages
