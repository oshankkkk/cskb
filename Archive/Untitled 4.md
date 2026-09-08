---
title: "Codility"
source: "https://app.codility.com/c/run/YD7AEU-V35/"
author:
published:
created: 2026-09-08
description:
tags:
  - "clippings"
---
## Task description

A monitoring system records one metrics sample per minute:

```
[requests, errors, p95_latency]
```

## What you have to do

You're given a stub file in each of **5 languages — Python, Java, JavaScript, C++, and C#**, each in its own folder. **It's enough to complete just one of them** — implement `solution  content_copy  ` in whichever language you're most comfortable with.

If you do complete more than one, that's fine too: all 5 are graded independently and your final score is simply the best of the five.

Each stub already has this signature written out, with an empty body for you to fill in — see the comments in each file for the exact per-language shape of a "metric sample" and of the return value.

## Task details

Write a function:

```
solution(metrics, k, error_threshold, latency_threshold)
```

that considers every window of `k  content_copy  ` consecutive minutes (there are `length(metrics) - k + 1  content_copy  ` such windows, one starting at each index `0  content_copy  ` to `length(metrics) - k  content_copy  `) and returns the list of **starting indices** of every window that breaches SLA, in ascending order.

A window **breaches SLA** if either of these is true:

- **total error rate** across the window is **greater than** `error_threshold  content_copy  ` — computed as
	```
	sum(errors in window) / sum(requests
	  in window)
	```
	. If the window's total requests is `0  content_copy  `, the error rate is defined as `0  content_copy  ` (never breaches on error rate alone).
- **maximum `p95_latency  content_copy  `** across the window is **greater than** `latency_threshold  content_copy  `.

Both comparisons are **strict**: a window whose error rate or maximum latency is *exactly equal* to its threshold does **not** breach.

If `length(metrics) < k  content_copy  `, there are no valid windows at all — return an empty list.

## Example 1

Input:

```
metrics = [
  [100, 40, 100],
  [100,  0, 100],
  [100,  0, 100],
  [100,  0, 100],
  [100,  0, 400],
  [100,  0, 100],
]
k = 3
error_threshold = 0.05
latency_threshold = 300
```

Output: `[0, 2, 3]  content_copy  `

- Window 0 (minutes 0-2): requests = 300, errors = 40, error rate = 0.1333 > 0.05 → **breach** (error rate). Max latency = 100, not > 300.
- Window 1 (minutes 1-3): errors = 0, error rate = 0. Max latency = 100, not > 300 → **no breach**.
- Window 2 (minutes 2-4): errors = 0, error rate = 0. Max latency = max(100, 100, 400) = 400 > 300 → **breach** (latency).
- Window 3 (minutes 3-5): errors = 0, error rate = 0. Max latency = max(100, 400, 100) = 400 > 300 → **breach** (latency).

## Example 2 (boundary and zero-requests cases)

Input:

```
metrics = [
  [0, 0, 100],
  [0, 0, 100],
  [4, 1, 500],
  [4, 1, 500],
]
k = 2
error_threshold = 0.25
latency_threshold = 500
```

Output: `[]  content_copy  ` (no window breaches)

- Window 0 (minutes 0-1): total requests = 0 → error rate defined as `0  content_copy  ` (not > 0.25). Max latency = 100, not > 500 → **no breach**.
- Window 1 (minutes 1-2): requests = 4, errors = 1, error rate = 1/4 = **0.25**, exactly equal to `error_threshold  content_copy  ` → not a breach (strict `>  content_copy  `). Max latency = **500**, exactly equal to `latency_threshold  content_copy  ` → also not a breach.
- Window 2 (minutes 2-3): requests = 8, errors = 2, error rate = 2/8 = 0.25 (boundary again) and max latency = 500 (boundary again) → **no breach**.

This example shows that hitting a threshold exactly never counts as a breach, and that an all-zero-requests window can never breach on error rate alone.

## Constraints

- `0 ≤ length(metrics) ≤ 200,000  content_copy  `
- `1 ≤ k ≤ 200,000  content_copy  `
- `requests  content_copy  `, `errors  content_copy  `, and `p95_latency  content_copy  ` are integers, with `0 ≤ requests ≤ 1,000,000  content_copy  `, `0 ≤ errors ≤ requests  content_copy  `, and `0 ≤ p95_latency ≤ 1,000,000  content_copy  `.
- `error_threshold  content_copy  ` and `latency_threshold  content_copy  ` are non-negative decimal numbers given with at most 4 decimal digits (e.g. `0.05  content_copy  `, `0.35  content_copy  `, `312.5  content_copy  `).
- A window's error rate can tie `error_threshold  content_copy  ` exactly (Example 2 shows one). Compare the *divided* rate `sum(errors) / sum(requests) > error_threshold  content_copy  ` in ordinary double-precision arithmetic — that judges exact ties correctly. Beware that the rearranged comparison `sum(errors) > error_threshold * sum(requests)  content_copy  ` is **not** equivalent in floating point: the multiplication can round just below an exact tie and turn it into a false breach.
- A solution should run in approximately `O(length(metrics))  content_copy  ` time — `length(metrics)  content_copy  ` can be as large as 200,000, and the hidden tests include a case sized so that recomputing each window from scratch (`O(length(metrics) × k)  content_copy  ` overall) does not finish in time in any language.

## How to run

Each language's folder has a self-test (`test_example.*  content_copy  `) wired up against Example 1 above, plus a `run  content_copy  ` script that builds and runs it. The easiest way to use it is the top-level `run  content_copy  ` script, one level above all the language folders:

```
./run python       # build/run just the Python self-test
./run java          # ...just the Java self-test
```

`./run <language>  content_copy  ` accepts: `python  content_copy  `, `javascript  content_copy  `, `java  content_copy  `, `cpp  content_copy  `, `csharp  content_copy  `.

If you'd rather run a language's self-test directly, `cd  content_copy  ` into its folder and run its own `run  content_copy  ` script (e.g. `cd python && ./run  content_copy  `) — that's all the top-level script does under the hood.