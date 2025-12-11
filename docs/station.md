---
id: station
slug: station
title: Moondream Station
description: The easiest way to run Moondream locally — zero configuration, automatic setup, CLI and HTTP access
---

# Moondream Station

## Installation

Install from PyPI:

```bash
pip install moondream-station
```

Install from source:

```bash
git clone https://github.com/m87-labs/moondream-station.git
cd moondream-station
pip install -e .
```

That's it! Moondream Station will automatically set itself up.

## Usage

### Launch Moondream Station

To fire up Moondream Station, execute this command in your terminal:

```bash
moondream-station
```

### Model Management

By default, Moondream Station uses the latest model your machine supports. If you want to view or activate other Moondream models, use the following commands:

- `models` - List available models
- `models switch <model>` - Switch to a model

### Service Control

By default, Moondream Station runs on port 2020. If that port is taken, Moondream Station will try a nearby free port. Additionally, you can control the port and status of the inference service with the following commands:

- `start [port]` - Start REST server (default: port 2020)
- `stop` - Stop server
- `restart` - Restart server

### Inference

![Video showing Moondream Station running in a terminal](https://raw.githubusercontent.com/m87-labs/moondream-station/55878b16dd3a675a9ccf9a292975aee97d055beb/assets/md_station_demo.gif)

**Access via HTTP**: Point any of our inference clients at your Moondream Station; for example, with our python client you can do:

```python
import moondream as md
from PIL import Image

# connect to Moondream Station
model = md.vl(endpoint="http://localhost:2020/v1")

# Load an image
image = Image.open("path/to/image.jpg")

# Ask a question
answer = model.query(image, "What's in this image?")["answer"]
print("Answer:", answer)
```

For more information on our clients visit: [Python](https://pypi.org/project/moondream/), [Node](https://www.npmjs.com/package/moondream), [Quick Start](/quickstart)

**Connect via CLI**: Use all the capabilities of Moondream directly through your terminal. No need to touch any code!

- `infer <function> [args]` - Run single inference
- `inference` - Enter interactive inference mode

### Settings

Control the number of workers, queue size, privacy settings, and more through Settings:

- `settings` - Show configuration
- `settings set <key> <value>` - Set setting value

Moondream Station collects anonymous usage metrics to help us improve the app. The following data is collected:

- **Event data**: when you use features like caption, query, detect, or point.
- **Version information**: active bootstrap, hypervisor, inference client, and model version.
- **System information**: OS version, IP address, and Python version/runtime.

No personal information, images, or prompts/responses are ever collected. To opt out of logging, run: `settings set logging false`.

### Utility

The utility functions provide insight into what Moondream Station is currently doing. To view statistics for your current session, use the `session` mode. To view a log of requests processed by Moondream Station, use the `history` command.

- `session` - Show session stats
- `help` - Show available commands
- `history` - Show command history
- `reset` - Reset app data & settings
- `clear` - Clear screen
- `exit` - Quit application
