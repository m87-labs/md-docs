---
slug: "/"
sidebar_position: 2
title: "Getting Started with Moondream"
---

This guide will help you set up Moondream in minutes using our free Cloud tier or running locally. For more advanced options, see our [advanced documentation](https://moondream.ai/c/docs/advanced).

## Setup

You need to choose **one** of these two options: cloud or local. Both are free options.

### Option A: Cloud

It's quicker since there's no download:

1. Create an API key at the [Moondream Cloud Console](https://moondream.ai/c/cloud/api-keys) (free tier available, no credit card required)
2. Copy and save your API key (you'll need it for the code examples below)
3. See our [API documentation](https://moondream.ai/c/docs/advanced/api) for detailed usage instructions

### Option B: Local 

You have two main options for running Moondream locally:

1. Mac/Linux: Use [Moondream Station](https://moondream.ai/station), the easiest way to run Moondream locally
2. Advanced: Use Hugging Face transformers directly - [Instructions](https://moondream.ai/c/docs/advanced/transformers)

We don't have a Windows version yet. If you're on Windows, we recommend using the cloud option.

## Code

Once you have either a Moondream Cloud API key or Moondream running locally, check out our [**Moondream Examples**](https://github.com/m87-labs/moondream-examples) repo for sample code to get you started. The examples work with our Python and Node clients, as well as Bash using cURL.

Each Moondream capability has its own method or function. In this example we've used `caption`, but Moondream also supports `query`, `point`, and `detect`. Learn more about these capabilities in our [capabilities documentation](https://moondream.ai/c/docs/capabilities).

---

## Next Steps

- Explore [Python SDK Documentation](https://pypi.org/project/moondream/)
- Check out [Node.js SDK Documentation](https://www.npmjs.com/package/moondream)
- Try our [interactive playground](https://moondream.ai/c/playground) to test Moondream without coding
- Learn about advanced features in our [API documentation](https://moondream.ai/c/docs/advanced/api)