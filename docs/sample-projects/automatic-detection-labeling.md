# Automatic Detection Labeling

By combining the `/query` and `/detect` endpoints, we're able to create an auto-labeler detecting all objects in an image.

- The `/query` endpoint can give us a list of either all objects or objects related to a prompt.
- Then we call the `/detect` endpoint for each object.
- Finally, we take those results and use them to render our bounding boxes over the image(s).

## API Key Setup

```bash
export MOONDREAM_API_KEY="your_key_here"
npm start
```

## Two-Step Process

1. **Query** (`/v1/query`) - Find objects
2. **Detect** (`/v1/detect`) - Get coordinates

## Step 1: Query Objects

```javascript
// Configure the prompt based on user input
const objectPrompt = prompt.trim() 
  ? `List all ${prompt.trim()} you can see in this image. Return your answer as a simple comma-separated list of object names.`
  : `List all the objects you can see in this image. Return your answer as a simple comma-separated list of object names.`;

// Call Moondream Query API
const queryResponse = await fetch("https://api.moondream.ai/v1/query", {
  method: "POST",
  headers: {
    "X-Moondream-Auth": process.env.MOONDREAM_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    image_url: image,  // Base64 encoded image
    question: objectPrompt,
    reasoning: true    // Enable grounded reasoning for better accuracy
  }),
});

const queryResult = await queryResponse.json();
const objectList = queryResult.answer || '';

// Parse the comma-separated response
const objects = objectList
  .split(',')
  .map(obj => obj.trim())
  .filter(obj => obj.length > 0);
```

## Step 2: Get Bounding Boxes

```javascript
const detectionResults = [];
let globalIndex = 0; // Track for consistent coloring

for (const objectName of objects) {
  const detectResponse = await fetch("https://api.moondream.ai/v1/detect", {
    method: "POST",
    headers: {
      "X-Moondream-Auth": process.env.MOONDREAM_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: image,
      object: objectName,
      reasoning: true  // Enable grounded reasoning
    }),
  });

  if (detectResponse.ok) {
    const detectResult = await detectResponse.json();
    if (detectResult.objects && detectResult.objects.length > 0) {
      detectResult.objects.forEach(obj => {
        detectionResults.push({
          label: objectName,
          x_min: obj.x_min,        // Normalized coordinates (0-1)
          y_min: obj.y_min,
          x_max: obj.x_max,
          y_max: obj.y_max,
          originalIndex: globalIndex // For consistent colors
        });
        globalIndex++;
      });
    }
  }
}
```

## Step 3: Overlay Bounding Boxes

Convert normalized coordinates (0-1) to pixel coordinates and render:

```javascript
// Convert to pixel coordinates
const x = obj.x_min * imageWidth;
const y = obj.y_min * imageHeight;
const width = (obj.x_max - obj.x_min) * imageWidth;
const height = (obj.y_max - obj.y_min) * imageHeight;
```

**Rendering Options**:
- **SVG overlays**: Scalable, precise positioning
- **Canvas drawing**: High performance for many boxes
- **HTML divs**: Simple absolute positioning
- **CSS transforms**: Hardware-accelerated rendering

## To take this further you could add
- Editing bounding boxes and object labels
- Manually adding new objects and bounding boxes
- Downloading your outputs as a dataset

## Sample App

Here's a JS sample app to get started with / test:
**[Moondream Auto-Labeler Repository](https://github.com/conwayanderson/moondream-auto-labeler)**
