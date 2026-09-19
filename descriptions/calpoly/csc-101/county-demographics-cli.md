---
title: County Demographics CLI
summary: Python batch interpreter that runs .ops scripts of population, percent, and threshold-filter queries over 3,143 US county records.
period: "Mar 2026"
status: archived
tags: [Python, unittest, Git]
repo: https://github.com/Damilss/csc-101
---

Programming Assignment 4 for CSC 101, Cal Poly's introductory computer science course. Instead of prompting
for queries, `hw4.py` reads a script of operations (an `.ops` file) and runs each line against the CORGIS
county demographics dataset, recognizing seven keywords: `filter-state`, `filter-gt`, `filter-lt`,
`population`, `population-total`, `percent`, and `display`. Everything is standard-library Python.

## How it works

The script name arrives as `sys.argv[1]` and is opened from `inputs/`. `cleanops()` turns each line into a
token list: split on `:`, split the second token on `.` so `Education.Bachelor's Degree or Higher` becomes a
category and a field, then convert any numeric token to a float. Because the field is appended with `extend`,
`filter-gt:Education.Bachelor's Degree or Higher:60` becomes
`['filter-gt', 'Education', 60.0, "Bachelor's Degree or Higher"]`, and the dispatcher indexes into that order.

`build_data.get_data()` unpickles the 7 MB `county_demographics.data` file through the CORGIS loader, converts
each record into a `CountyDemographics` object, and memoizes the list in a module-level `_converted`; every
aggregation in `hw4.py` defaults to that full dataset. `process_ops()` branches on the leading keyword, checks
the category against the `filter_paramters()` list I added to `CountyDemographics`, and appends each result to
a `result` list that is printed on `display` or at exit. Anything unrecognized prints `Invalid paramter, please check .ops file` and stops.

```python
def cleanops(_data : list[str] = fetchedops)-> list[list[str]]:
        newdata =[i.strip('\n') for i in _data]
        newdata = [i.split(':') for i in newdata]
        for i in range(len(newdata)):
            if len(newdata[i]) > 1:
                if "." in newdata[i][1]:
                     temp = newdata[i][1].split('.')
                     newdata[i][1] = temp[0]
                     newdata[i].extend(temp[1:])
            for j in range(len(newdata[i])):
                converted = str_to_float(newdata[i][j])
                if converted is not None:
                    newdata[i][j] = converted
        return newdata
```
*The line parser: colon split, dot split on the field, then float conversion in place.*

## Where it stands

As submitted, the interpreter runs end to end for `population-total`, `population` on Education and Ethnicities
fields, `filter-gt`, `filter-lt`, and `display`: `pop.ops` prints the 2014 population total, 318,857,056
(though `population_totals()` prints rather than returns, so the stored entry is `None`), `bachelors_gt_60.ops`
returns four counties, and `high_school_lt_60.ops` returns nine. `filter-state` and `percent` raise exceptions
(an unfinished state filter, and PA3 helpers called with their arguments swapped), `Income` fields fall through
to the invalid-parameter branch, and the non-numeric threshold in `some_errors.ops` raises a `TypeError`.

## Highlights

- Weighted totals multiply each county's `2014 Population` by the field's percentage and sum across the list; filters compare the field directly against the threshold.
- Eight sample scripts in `inputs/` plus three under `Task 2/`; `ca.ops` chains a state filter, a population total, and eleven percent queries.
- The aggregation and filter functions come from my Programming Assignment 3, where a 24-case `unittest` suite checks them against the full dataset and a hand-built reduced one; all 24 pass.
