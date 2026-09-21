---
title: MCP25625 CAN Drivers for Raspberry Pi
summary: C++ SPI driver work for a Raspberry Pi talking to a Microchip MCP25625 CAN controller, started as a Cal Poly FSAE firmware new-member project.
period: "Sep 2026 - current"
status: in-progress
tags: [C++, SPI, CAN bus, Embedded]
repo: https://github.com/Damilss/spi-can-pi4-drivers
role: Solo (FSAE firmware new-member project)
featured: 1
links: [{ label: Cal Poly FSAE, href: https://github.com/CalPolyFSAE/ }]
---

This is the Cal Poly FSAE firmware subsystem's new-member project: get a Raspberry Pi
sending and receiving CAN bus traffic through a Microchip MCP25625 CAN controller, with
the Pi talking to the controller over SPI. The stated objective is to write, or find,
C++ functions that initialize the Pi's SPI peripheral and then write and read data
through it. I chose to keep the work in a personal repository rather than in the team's
GitHub organization. Right now the repo holds the design and the reference material;
the driver code itself has not been written yet.

## How it works

The data path documented in the project spec is `CAN <--> MCP25625 <--> CAN data over
SPI <--> Raspberry Pi`. The Pi never speaks CAN directly. The MCP25625 sits on the bus
and does the CAN work, and the Pi exchanges frames with it as bytes over SPI. What makes
the MCP25625 a convenient part is that the transceiver is integrated on the same chip:
its RXCAN and TXCAN lines connect to CANL and CANH internally, so there is no separate
transceiver IC between the controller and the bus. It is a CAN 2.0 only device, so every
frame carries at most 8 bytes of payload.

On the software side, the spec says to use SocketCAN in the Raspberry Pi's kernel to
receive and transmit. That leaves the real design question for this project: how much
of the SPI initialize, write, and read work lives in my own C++ code versus what the
kernel's CAN stack already provides once the controller is exposed as a SocketCAN
interface. Settling that split is the first thing I have to do before `src/` gets its
first file.

The spec and the repo name both say Raspberry Pi 4. I am using a Raspberry Pi 5 instead,
which I do not expect to change anything about the SPI side of the design.

## Where it stands

What exists today:

- A README that records the objective, the documented CAN-to-SPI-to-Pi workflow, the
  SocketCAN requirement, and the MCP25625's characteristics.
- The Microchip MCP25625 datasheet, checked in under `docs/` as the reference for the
  controller.
- An empty `src/` directory. There are six commits, all from September 14, 2026, and
  all of them are documentation.

What comes next:

- Decide where the SocketCAN boundary sits, and from that, what the C++ layer is
  responsible for.
- Write the initialize, write, and read functions against the Pi's SPI peripheral.
- Bring the Pi 5 and MCP25625 up together and confirm frames make it onto and off the
  bus.

## Highlights

- Documented data path: `CAN <--> MCP25625 <--> CAN data over SPI <--> Raspberry Pi`.
- MCP25625: CAN 2.0 only, integrated transceiver (RXCAN and TXCAN to CANL and CANH),
  maximum payload of 8 bytes per frame.
- The spec calls for SocketCAN in the Pi kernel to handle transmit and receive.
- The code is to be C++ against the Pi's SPI peripheral: initialize, write, and read.
- Hardware in use is a Raspberry Pi 5, not the Pi 4 the project is named after.
