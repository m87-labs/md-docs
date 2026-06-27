---
id: openai
slug: /openai
title: OpenAI Compatibility
---

Moondream Cloud exposes an **OpenAI-compatible** chat endpoint at `/v1/chat/completions`. Point any OpenAI client or SDK at Moondream and you get multi-turn conversations, image inputs, streaming, and reasoning — no Moondream-specific client required.

## Setup

Use the OpenAI base URL `https://api.moondream.ai/v1`, your Moondream API key as the bearer token, and `moondream-3` as the model. Grab a key from the [Moondream Cloud Console](https://moondream.ai/c/cloud/api-keys).

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="python" label="Python" default>

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.moondream.ai/v1",
)

response = client.chat.completions.create(
    model="moondream-3",
    messages=[{"role": "user", "content": "What is 2 + 2?"}],
)
print(response.choices[0].message.content)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "YOUR_API_KEY",
  baseURL: "https://api.moondream.ai/v1",
});

const response = await client.chat.completions.create({
  model: "moondream-3",
  messages: [{ role: "user", content: "What is 2 + 2?" }],
});
console.log(response.choices[0].message.content);
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl https://api.moondream.ai/v1/chat/completions \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "moondream-3",
    "messages": [{"role": "user", "content": "What is 2 + 2?"}]
  }'
```

  </TabItem>
</Tabs>

## Image input

Pass images as `image_url` content parts. Images must be **base64-encoded data URLs** — remote `http(s)` URLs are rejected with a `400`. You can include more than one image in a turn.

<Tabs>
  <TabItem value="python" label="Python" default>

```python
import base64

with open("image.jpg", "rb") as f:
    data_url = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="moondream-3",
    messages=[{
        "role": "user",
        "content": [
            {"type": "image_url", "image_url": {"url": data_url}},
            {"type": "text", "text": "What is in this image?"},
        ],
    }],
)
print(response.choices[0].message.content)
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl https://api.moondream.ai/v1/chat/completions \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "moondream-3",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,..."}},
        {"type": "text", "text": "What is in this image?"}
      ]
    }]
  }'
```

  </TabItem>
</Tabs>

## Multi-turn conversations

Send the full message history — earlier turns are kept as context.

```python
response = client.chat.completions.create(
    model="moondream-3",
    messages=[
        {"role": "user", "content": "My name is Alice."},
        {"role": "assistant", "content": "Nice to meet you, Alice!"},
        {"role": "user", "content": "What is my name?"},
    ],
)
print(response.choices[0].message.content)  # -> "Alice"
```

## Streaming

Set `stream=True` to receive the response as Server-Sent Events.

```python
stream = client.chat.completions.create(
    model="moondream-3",
    messages=[{"role": "user", "content": "Write a short poem about the moon."}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

By default a stream does not include token usage. To receive it, set `stream_options` — a final chunk with empty `choices` then carries the `usage` totals (standard OpenAI behavior).

```python
stream = client.chat.completions.create(
    model="moondream-3",
    messages=[{"role": "user", "content": "Hello!"}],
    stream=True,
    stream_options={"include_usage": True},
)
for chunk in stream:
    if chunk.usage:
        print(chunk.usage)  # prompt_tokens / completion_tokens / total_tokens
```

## Reasoning

Moondream 3 can produce an explicit reasoning trace before its answer. Enable it with the `reasoning` parameter; the trace is returned on `message.reasoning`, separate from `message.content`.

```python
response = client.chat.completions.create(
    model="moondream-3",
    messages=[{"role": "user", "content": "If I have 5 apples and give away 2, how many are left?"}],
    extra_body={"reasoning": True},
)
message = response.choices[0].message
print(message.reasoning)  # the step-by-step trace
print(message.content)    # -> "3"
```

See [Reasoning](/reasoning) for more on how Moondream 3 reasons.

## Parameters

| Parameter | Type | Notes |
|---|---|---|
| `model` | string | `moondream-3`. See [Models](#models) for the available list. |
| `messages` | array | OpenAI chat messages. `content` may be a string or an array of `text` / `image_url` parts. |
| `temperature` | number | Sampling temperature. |
| `top_p` | number | Nucleus sampling. |
| `max_tokens` | integer | Maximum completion tokens (up to 4096). |
| `reasoning` | boolean | Enable the reasoning trace (returned on `message.reasoning`). |
| `stream` | boolean | Stream the response as SSE. |
| `stream_options.include_usage` | boolean | Emit a final usage chunk in a stream. |

Image URLs must be base64 data URLs (no remote URLs). `stop` sequences and tool/function calling are not currently supported.

## Models {#models}

List the available models with the standard OpenAI models endpoint:

```bash
curl https://api.moondream.ai/v1/models \
  -H 'Authorization: Bearer YOUR_API_KEY'
```
