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
Task 3

## Dependency Graph Impact (Bugfix)

## What you have to do

You're given a stub file in each of 9 languages — Python, Java, JavaScript, TypeScript, C++, C#, Rust, Go, and PHP — each in its own folder. Every stub is a working implementation of `solution  content_copy  ` with one bug — the same bug in every language. **Fix it in just one language and that's enough** — pick whichever you're most comfortable with. Don't change the function's name or signature.

If you fix more than one, that's fine too: all 9 are graded independently and your final score is simply the best of the nine.

## Task details

You're given a list of service dependencies `(service, depends_on)  content_copy  `, where each pair means " `service  content_copy  ` depends on `depends_on  content_copy  ` ". A service is **blocked** if:

- it is part of a dependency cycle, or
- it depends, directly or indirectly, on a service that is part of a cycle.

`solution  content_copy  ` must return the sorted list of blocked services.

- Input: a list of pairs `(service, depends_on)  content_copy  ` — both whitespace-free tokens. The same pair may appear more than once (duplicate edges); that doesn't change the result. A service may depend on itself directly (a cycle of length one).
- A service that never appears as the first element of any pair (i.e. nothing depends on it that also has it depend on something further) has no outgoing dependency and so can never itself be part of a cycle.
- Output: the blocked services with no duplicates, sorted ascending by byte value (plain ASCII order, so `"10"  content_copy  ` before `"9"  content_copy  ` and uppercase before lowercase).

## Constraints

- `0 ≤ length(dependencies) ≤ 2,000  content_copy  `
- Each service name is 1-50 characters, whitespace-free.