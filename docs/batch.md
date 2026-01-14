---
id: batch
slug: /batch
title: Batch API
sidebar_position: 3
---

The Batch API lets you process large volumes of images asynchronously. Upload a JSONL file with thousands of requests, and download results when processing completes. Batch processing is ideal for offline workloads like dataset annotation, bulk captioning, or large-scale image analysis.

**Pricing:** Batch API requests are billed at **50% off** standard API pricing.

## When to use Batch API

- Processing thousands to 100,000 images
- Offline workloads where latency isn't critical
- Dataset annotation and labeling
- Cost-sensitive bulk processing

For real-time applications, use the [standard API](/api) instead.

## Data privacy

Your data is never used for training. Input files are deleted immediately after processing completes, and results are automatically purged after 7 days.

## Workflow overview

1. **Prepare** a JSONL file with one request per line
2. **Upload** the file using multipart upload
3. **Poll** for completion status
4. **Download** result files

## Quickstart

### 1. Prepare your input file

Create a JSONL file with one JSON object per line. Each line specifies a skill and its parameters:

```json title="batch_input.jsonl"
{"id": "img_001", "skill": "caption", "image": "<base64>", "length": "normal"}
{"id": "img_002", "skill": "query", "image": "<base64>", "question": "What color is the car?"}
{"id": "img_003", "skill": "detect", "image": "<base64>", "object": "person"}
```

The `id` field is optional but recommended for correlating results with inputs.

### 2. Upload and submit the batch

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
# Step 1: Initialize multipart upload
INIT=$(curl -s -X POST "https://api.moondream.ai/v1/batch?action=mpu-create" \
  -H "X-Moondream-Auth: YOUR_API_KEY")

FILE_ID=$(echo $INIT | jq -r '.fileId')
UPLOAD_ID=$(echo $INIT | jq -r '.uploadId')

# Step 2: Upload the file (single part for files < 100MB)
PART=$(curl -s -X PUT "https://api.moondream.ai/v1/batch/$FILE_ID?action=mpu-uploadpart&uploadId=$UPLOAD_ID&partNumber=1" \
  -H "X-Moondream-Auth: YOUR_API_KEY" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @batch_input.jsonl)

ETAG=$(echo $PART | jq -r '.etag')

# Step 3: Complete upload and start processing
BATCH=$(curl -s -X POST "https://api.moondream.ai/v1/batch/$FILE_ID?action=mpu-complete&uploadId=$UPLOAD_ID" \
  -H "X-Moondream-Auth: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"parts\": [{\"partNumber\": 1, \"etag\": \"$ETAG\"}]}")

BATCH_ID=$(echo $BATCH | jq -r '.id')
echo "Batch submitted: $BATCH_ID"
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import json

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.moondream.ai/v1/batch"
headers = {"X-Moondream-Auth": API_KEY}

# Step 1: Initialize multipart upload
init = requests.post(f"{BASE_URL}?action=mpu-create", headers=headers).json()
file_id = init["fileId"]
upload_id = init["uploadId"]

# Step 2: Upload the file
with open("batch_input.jsonl", "rb") as f:
    part = requests.put(
        f"{BASE_URL}/{file_id}?action=mpu-uploadpart&uploadId={upload_id}&partNumber=1",
        headers={**headers, "Content-Type": "application/octet-stream"},
        data=f.read()
    ).json()

# Step 3: Complete upload and start processing
batch = requests.post(
    f"{BASE_URL}/{file_id}?action=mpu-complete&uploadId={upload_id}",
    headers=headers,
    json={"parts": [{"partNumber": 1, "etag": part["etag"]}]}
).json()

print(f"Batch submitted: {batch['id']}")
```

</TabItem>
<TabItem value="javascript" label="Node.js">

```javascript
import fs from 'fs';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.moondream.ai/v1/batch';
const headers = { 'X-Moondream-Auth': API_KEY };

// Step 1: Initialize multipart upload
const init = await fetch(`${BASE_URL}?action=mpu-create`, {
  method: 'POST', headers
}).then(r => r.json());

const { fileId, uploadId } = init;

// Step 2: Upload the file
const fileData = fs.readFileSync('batch_input.jsonl');
const part = await fetch(
  `${BASE_URL}/${fileId}?action=mpu-uploadpart&uploadId=${uploadId}&partNumber=1`,
  {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/octet-stream' },
    body: fileData
  }
).then(r => r.json());

// Step 3: Complete upload and start processing
const batch = await fetch(
  `${BASE_URL}/${fileId}?action=mpu-complete&uploadId=${uploadId}`,
  {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ parts: [{ partNumber: 1, etag: part.etag }] })
  }
).then(r => r.json());

console.log(`Batch submitted: ${batch.id}`);
```

</TabItem>
</Tabs>

### 3. Poll for completion

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl -s "https://api.moondream.ai/v1/batch/$BATCH_ID" \
  -H "X-Moondream-Auth: YOUR_API_KEY"
```

</TabItem>
<TabItem value="python" label="Python">

```python
import time

while True:
    status = requests.get(f"{BASE_URL}/{batch['id']}", headers=headers).json()
    print(f"Status: {status['status']}, Progress: {status['progress']}")

    if status["status"] in ["completed", "failed"]:
        break
    time.sleep(30)
```

</TabItem>
<TabItem value="javascript" label="Node.js">

```javascript
while (true) {
  const status = await fetch(`${BASE_URL}/${batch.id}`, { headers })
    .then(r => r.json());

  console.log(`Status: ${status.status}, Progress:`, status.progress);

  if (status.status === 'completed' || status.status === 'failed') {
    break;
  }
  await new Promise(r => setTimeout(r, 30000));
}
```

</TabItem>
</Tabs>

**Response (processing):**
```json
{
  "id": "01JQXYZ9ABCDEF123456",
  "status": "processing",
  "model": "moondream-3-preview",
  "progress": { "total": 1000, "completed": 450 },
  "created_at": "2025-01-10T12:00:00Z"
}
```

**Response (completed):**
```json
{
  "id": "01JQXYZ9ABCDEF123456",
  "status": "completed",
  "model": "moondream-3-preview",
  "progress": { "total": 1000, "completed": 998, "failed": 2 },
  "usage": { "input_tokens": 1500000, "output_tokens": 50000 },
  "outputs": [
    { "index": 0, "url": "https://..." },
    { "index": 1, "url": "https://..." }
  ],
  "created_at": "2025-01-10T12:00:00Z",
  "completed_at": "2025-01-10T12:45:00Z",
  "expires_at": "2025-01-17T12:45:00Z"
}
```

### 4. Download results

The `outputs` array contains presigned URLs to download result files. Each URL points to a JSONL file:

```bash
curl -o results_0.jsonl "https://..."
```

## Input format

Input files must be valid JSONL (JSON Lines):
- One JSON object per line
- No blank lines
- UTF-8 encoding

### Common fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | any | No | User-provided identifier, returned in results |
| `skill` | string | Yes | One of: `caption`, `query`, `detect`, `point` |
| `image` | string | Yes* | Base64-encoded image |
| `settings` | object | No | Generation settings (caption/query only) |

*For `query` skill, you can use `images` (array) instead of `image` for multi-image queries.

### Skill-specific fields

**Caption:**
```json
{"skill": "caption", "image": "<base64>", "length": "short"}
```
- `length`: `"short"`, `"normal"` (default), or `"long"`

**Query:**
```json
{"skill": "query", "image": "<base64>", "question": "What is this?", "reasoning": true}
```
- `question`: Required
- `image` or `images`: Required (text-only queries are not supported)
- `images`: Array of base64 strings for multi-image queries
- `reasoning`: Include chain-of-thought (default: `true`)

**Detect:**
```json
{"skill": "detect", "image": "<base64>", "object": "car"}
```
- `object`: Required, what to detect

**Point:**
```json
{"skill": "point", "image": "<base64>", "object": "door handle"}
```
- `object`: Required, what to locate

### Settings object

For `caption` and `query` skills:
```json
{
  "settings": {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 256
  }
}
```

## Output format

Results are returned as JSONL files with one result per line:

**Successful result:**
```json
{
  "line_index": 0,
  "id": "img_001",
  "status": "ok",
  "result": { "caption": "A golden retriever playing in a park..." },
  "usage": { "input_tokens": 150, "output_tokens": 25 }
}
```

**Failed result:**
```json
{
  "line_index": 1,
  "id": "img_002",
  "status": "error",
  "error": { "code": "image_decode_failed", "message": "Invalid image data" }
}
```

### Result fields by skill

| Skill | Result field |
|-------|--------------|
| `caption` | `result.caption` |
| `query` | `result.answer`, `result.reasoning` (if enabled) |
| `detect` | `result.objects` (array of bounding boxes) |
| `point` | `result.points` (array of coordinates) |

## API reference

### Initialize upload

```
POST /v1/batch?action=mpu-create
```

**Response:**
```json
{
  "fileId": "01JQ...",
  "uploadId": "abc123...",
  "key": "requests/org_id/batch_id.jsonl"
}
```

### Upload part

```
PUT /v1/batch/:fileId?action=mpu-uploadpart&uploadId={uploadId}&partNumber={n}
Content-Type: application/octet-stream
```

**Response:**
```json
{
  "etag": "\"abc123...\"",
  "partNumber": 1
}
```

For files larger than 100MB, consider uploading in multiple parts.

### Complete upload

```
POST /v1/batch/:fileId?action=mpu-complete&uploadId={uploadId}
Content-Type: application/json

{
  "parts": [
    { "partNumber": 1, "etag": "\"abc123...\"" }
  ]
}
```

**Response:**
```json
{
  "id": "01JQXYZ9ABCDEF123456",
  "status": "chunking",
  "size": 52428800
}
```

### Abort upload

```
DELETE /v1/batch/:fileId?action=mpu-abort&uploadId={uploadId}
```

### List batches

```
GET /v1/batch?limit={n}&cursor={cursor}
```

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `limit` | 50 | 100 | Results per page |
| `cursor` | - | - | Pagination cursor |

**Response:**
```json
{
  "batches": [...],
  "next_cursor": "abc...",
  "has_more": true
}
```

### Get batch status

```
GET /v1/batch/:batchId
```

**Status values:**
- `chunking` - File is being validated and split
- `processing` - Requests are being processed
- `completed` - All requests finished
- `failed` - Batch failed (see `error` field)

## Limits

| Limit | Value |
|-------|-------|
| Max file size | 2 GB |
| Max lines per batch | 100,000 |
| Max line size | 10 MB (~7.5 MB base64 image) |
| Result retention | 7 days |

## Error codes

### Batch-level errors

| Code | Description |
|------|-------------|
| `validation_error` | Invalid JSONL, blank lines, or bad UTF-8 |
| `limit_exceeded` | File or line limits exceeded |
| `empty_batch` | No valid lines in file |
| `processing_failed` | Internal processing error |
| `timeout` | Batch took too long to process |

### Per-line errors

| Code | Description |
|------|-------------|
| `invalid_request` | Missing required fields or invalid values |
| `image_decode_failed` | Corrupt or invalid image data |
| `unknown_skill` | Unrecognized skill name |
| `processing_error` | Failed during inference |

## Best practices

- **Validate locally first**: Check your JSONL is valid before uploading
- **Include IDs**: Add an `id` field to each line for easy result correlation
- **Handle partial failures**: Some lines may fail while others succeed
- **Download promptly**: Results expire after 7 days
- **Split large jobs**: For datasets over 100k images, submit multiple batches
