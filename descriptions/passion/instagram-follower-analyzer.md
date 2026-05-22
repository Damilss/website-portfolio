[repo link](https://github.com/Damilss/instagram-unfollow-list)

# Instagram Follower Analyzer

A small Python script that processes the structured JSON data from an Instagram
account export to compute follower/following set differences — in other words,
who you follow that doesn't follow you back.

## Overview

Instagram lets you export your account data as JSON. This script parses the
`followers` and `following` files from that export, treats each as a set, and
computes the difference to surface non-reciprocal connections. No API, no
scraping, no login — it works entirely from the official data export.

## Tech Stack

- Python
- JSON (Instagram data export)

## Status

Archived — a small, finished utility.
