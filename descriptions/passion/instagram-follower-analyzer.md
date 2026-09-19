---
title: Instagram Non-Followers Checker
summary: A standard-library Python script that diffs the followers and following files from an Instagram data export and lists who doesn't follow back.
period: "Feb 2026"
status: shipped
tags: [Python, Bash, Git]
repo: https://github.com/Damilss/instagram-unfollow-list
---

Instagram lets you download your own account data as JSON, including who follows you and who you follow. I wrote a single Python script that reads those two files out of the export and reports every account you follow that does not follow you back, printed to the terminal and saved as a CSV. It never contacts Instagram: no API, no scraping, no login, and it does not unfollow anyone. It runs offline against data you already own, which is the whole reason it exists — the alternative is handing your credentials to a third-party app.

## How it works

The interesting part is not the comparison, it's getting clean usernames out of the file. `load_usernames()` parses each export and hands the result to `_extract_candidates()`, which exists because the export's shape is not fixed: a bare list is used as-is, while a dict is searched for `relationships_following`, `relationships_followers`, `following`, or `followers`, and if none of those is present it falls back to the first list-valued field in the file. For each item it reads `string_list_data[0].value`, or failing that a `title`, `username`, or `value` key. Every name then goes through `strip()`, `lstrip("@")`, and `lower()` before it enters a set, so casing or a stray `@` between the two files cannot invent a false positive.

`main()` is the easy half: it computes `sorted(following - followers)`, prints the following, followers, and not-following-back counts, lists each username, and writes `not_following_back.csv` with a `username` header. Input paths are fixed to the script's own folder, and a missing file raises `SystemExit` with a one-line message rather than dumping a traceback at someone who is not a Python user.

```python
        common_keys = (
            "relationships_following",
            "relationships_followers",
            "following",
            "followers",
        )
        for key in common_keys:
            value = data.get(key)
            if isinstance(value, list):
                return [item for item in value if isinstance(item, dict)]

        # Fallback: first list-valued field in the dict
        for value in data.values():
            if isinstance(value, list):
                return [item for item in value if isinstance(item, dict)]
```
*The dict branch of `_extract_candidates()`: try the four keys the script knows, then fall back to the first list in the file.*

## Where it stands

Finished as scoped, and small on purpose. There are no CLI flags, no tests, and no packaging; the README's own "Optional Next Steps" list a mutuals-only view, a UI, and an ignore list, none of which I built. Two days after the first commit I opened a sibling repo, [social-media-data-scraper](https://github.com/Damilss/social-media-data-scraper), to generalize the idea to any platform's JSON export, but it still holds only a README, a license, and a `.gitignore` — so this script is the part that actually works.

## Highlights

- 121 lines and no third-party dependencies: the only imports are `csv`, `json`, `pathlib`, `typing`, and `from __future__ import annotations`.
- Tolerates several Instagram export shapes, because the schema drifts between export versions and the file you get is not guaranteed to match the one the script was written against.
- `followers.json`, `following.json`, and `not_following_back.csv` are the first entries in `.gitignore`, above the standard Python template, so personal export data cannot be committed.
- Type-hinted throughout; the README pins Python 3.9 or newer and walks through requesting the export and locating the two files inside the ZIP.
- Eight commits between 2 and 11 February 2026.
