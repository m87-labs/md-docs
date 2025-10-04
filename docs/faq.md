---
id: faq
slug: /faq
title: FAQ
---

# FAQ

This page collects quick answers to the most common Moondream questions.

### What resolution does Moondream down-sample images to?

**Short answer:** There's no single fixed resolution. Moondream automatically resizes your image so a grid of small, overlapping square tiles covers it.

- **Tile size:** ~378 x 378 px per tile.
- **How many tiles:** Up to 12 local tiles plus one global (zoomed-out) view.
- **Pixel budget:** About 1.7M pixels from the local tiles (approximately 1.86M including the global view).
- **What you'll see:** The exact resized width and height depends on your photo's aspect ratio; Moondream may downscale or upscale to make the tiles fit cleanly.

Want details? See the code: [moondream/torch/image_crops.py](https://github.com/vikhyat/moondream/blob/main/moondream/torch/image_crops.py)
