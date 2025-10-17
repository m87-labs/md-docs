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

```python {9}
from moondream import Moondream

client = Moondream(api_key="YOUR_API_KEY")

# Stream a query response
for chunk in client.query(
    image_url="data:image/jpeg;base64,...",
    question="What is in this image?",
    stream=True
):
    print(chunk.text, end="", flush=True)
```

For captions:

```python {5}
# Stream a caption
for chunk in client.caption(
    image_url="data:image/jpeg;base64,...",
    length="normal",
    stream=True
):
    print(chunk.text, end="", flush=True)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

The Node.js SDK handles streaming automatically:

```javascript {9}
import { Moondream } from 'moondream';

const client = new Moondream({ apiKey: 'YOUR_API_KEY' });

// Stream a query response
const stream = await client.query({
  imageUrl: 'data:image/jpeg;base64,...',
  question: 'What is in this image?',
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

For captions:

```javascript {5}
// Stream a caption
const stream = await client.caption({
  imageUrl: 'data:image/jpeg;base64,...',
  length: 'normal',
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

  </TabItem>
</Tabs>

