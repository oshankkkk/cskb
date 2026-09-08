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
Task 4

## Corporate VWAP (Bugfix)

## What you have to do

You're given a stub file in each of 9 languages — Python, Java, JavaScript, TypeScript, C++, C#, Rust, Go, and PHP — each in its own folder. Every stub is a working implementation of `solution  content_copy  ` with one bug — the same bug in every language. **Fix it in just one language and that's enough** — pick whichever you're most comfortable with. Don't change the function's name or signature.

If you fix more than one, that's fine too: all 9 are graded independently and your final score is simply the best of the nine.

## Task details

`solution  content_copy  ` computes the volume-weighted average price (VWAP) per instrument, using only trades with **positive** quantity:

```
VWAP = sum(price_i * quantity_i) / sum(quantity_i)
```
- Input: a list of trades `(instrument, price, quantity)  content_copy  ` — `instrument  content_copy  ` is a whitespace-free token, `price  content_copy  ` is never negative, `quantity  content_copy  ` may be positive, negative, zero, or fractional.
- Output: a map from instrument to VWAP.
- An instrument with no qualifying trades must be omitted entirely — no zero, `null  content_copy  `, or placeholder entry.

## Constraints

- `0 ≤ length(trades) ≤ 5,000  content_copy  `
- `price  content_copy  ` and `quantity  content_copy  ` fit comfortably in a standard double-precision float in every language provided.