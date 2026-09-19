---
title: Cal Poly FSAE
summary: Software and firmware work for Cal Poly's Formula SAE team — the internal part-tracking app and a CAN bus driver project.
---

Cal Poly Formula SAE designs and builds a formula-style race car. These are the
software-side projects: one on the team's internal tooling, one on the firmware
that talks to the car.

## What's in here

- **part-tracker** — the team's internal part-tracking web app, a SvelteKit site
  on Cloudflare Pages and D1. The application is the team's; my work on it is
  the CI pipeline, secret scanning, and dependency hardening.
- **spi-can-pi4-drivers** — a firmware new-member project: C++ SPI drivers for a
  Raspberry Pi talking to a Microchip MCP25625 CAN controller. Early — the
  design and the datasheet work are done, the driver itself is not written yet.

Open either file to read the full writeup.
