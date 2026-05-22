[repo link](https://github.com/Damilss/instagram-unfollow-list)

# Instagram Follower Analyzer

> A tiny script that finds who you follow on Instagram that doesn't follow back.

Instagram lets you export your account data as JSON. This is a small Python
utility that reads the `followers` and `following` files from that export,
treats each as a set, and subtracts one from the other to surface the
non-reciprocal connections. No API, no scraping, no login — it works entirely
from the official data export, so there's zero risk to the account.

## How it works

Each export file nests usernames under a `string_list_data` array. The script
pulls those into two sets and takes the difference:

```python
import json

def usernames(path):
    """Pull the username set out of an Instagram JSON export file."""
    with open(path) as f:
        data = json.load(f)
    entries = data if isinstance(data, list) else data["relationships_following"]
    return {e["string_list_data"][0]["value"] for e in entries}

followers = usernames("followers.json")
following = usernames("following.json")

# who you follow that doesn't follow you back
not_following_back = sorted(following - followers)
```

*The whole tool is one set difference — `following − followers`.*

## Tech stack

- Python — standard library only (`json`)
- Instagram's official JSON data export as the input

## Status

Archived — a small, finished utility.
