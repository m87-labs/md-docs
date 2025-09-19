---
slug: "/"
sidebar_position: 1
title: "Overview"
---

# Overview

Moondream is a family of open source Vision Language Models (VLMs) that provide advanced visual reasoning in a tiny, efficient footprint. Our latest model, **Moondream 3 Preview** has a mixture-of-experts architecture (9B total parameters, 2B active). This model makes no compromises, delivering state-of-the-art visual reasoning while still retaining our efficient and deployment-friendly ethos.

Moondream 3 Preview is now the default model for our cloud API and local processing with Moondream Station – [get started here](./quickstart).

### Key stats
- 9B total params, 2B active params (maintains similar inference speeds to our previous models)
- 32k context window (up from 2k)

### Model Skills
Moondream has built-in vision-specific skills that make it easy to generate specific types of vision outputs (e.g., bounding boxes, or 2D points). These are:
- Object Detection
- Pointing and Counting
- Visual Question Answering
- Captioning

### Performance Benchmarks

Here are some early benchmark results. We show it alongside some top frontier models for comparison. Moondream also produces answers in fraction of the time of these bigger models. We'll publish more complete results later and include inference times to make this clearer.

| Task | Moondream 3 Preview | GPT 5 | Gemini 2.5-Flash | Claude 4 Sonnet |
|------|---------------------|-------|------------------|-----------------|
| **Object Detection** | | | | |
| refcocog | **88.6** | 49.8 | 75.1 | 26.2 |
| refcoco+ | **81.8** | 46.3 | 70.2 | 23.4 |
| refcoco | **91.1** | 57.2 | 75.8 | 30.1 |
| **Counting** | | | | |
| CountbenchQA | **93.2** | 89.3 | 81.2 | 90.1 |
| **Document Understanding** | | | | |
| ChartQA | **86.6** | 85* | 79.5 | 74.3* |
| DocVQA | **88.3** | 89* | **94.2** | 89.5* |
| **Hallucination** (higher is better) | | | | |
| pope | **89.0** | 88.4 | 88.1 | 84.6 |

### License
Copyright (c) 2025 M87 Labs, Inc.
This distribution includes Model Weights licensed under the [Business Source License 1.1](https://mariadb.com/bsl11/) with an [Additional Use Grant](https://huggingface.co/moondream/moondream3-preview/blob/main/LICENSE) (No Third-Party Service). Commercial hosting or rehosting requires an agreement with [contact@m87.ai](mailto:contact@m87.ai).

---

### Learn more
- Try the [interactive demo](https://moondream.ai/c/playground)
- [Full technical specifications](https://huggingface.co/moondream/moondream3-preview) for Moondream 3
- Browse [legacy versions](https://huggingface.co/moondream/models) of Moondream
- Get started with our [Getting Started](./quickstart) guide





