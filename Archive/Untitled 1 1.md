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

A risk system organizes trading entities (regions, desks, traders,...) into a hierarchy. Each entity is a record:

```
[entity_id, parent_id, own_limit, usage]
```
- `entity_id  content_copy  ` — a unique string identifier for this entity.
- `parent_id  content_copy  ` — the `entity_id  content_copy  ` of this entity's parent, or `null  content_copy  ` if this entity is a root (top of its own tree — a risk hierarchy can have more than one root, and that's normal, not an error).
- `own_limit  content_copy  ` — this entity's own risk limit, or `null  content_copy  ` if it has none and should **inherit its parent's *effective* limit** instead.
- `usage  content_copy  ` — this entity's current usage. Always a real number, never `null  content_copy  `.

## What you have to do

You're given a stub file in each of **9 languages — Python, Java, JavaScript, TypeScript, C++, C#, Rust, Go, and PHP**, each in its own folder. **It's enough to complete just one of them** — implement `solution  content_copy  ` in whichever language you're most comfortable with.

If you do complete more than one, that's fine too: all 9 are graded independently and your final score is simply the best of the nine.

Each stub already has this signature written out, with an empty body for you to fill in — see the comments in each file for the exact per-language shape of an "entity" and of the return value.

## Task details

Write a function that takes the list of entity records and returns a **sorted** list of violations, each `[entity_id, reason]  content_copy  `, where `reason  content_copy  ` is one of:

- **`"USAGE_EXCEEDS_LIMIT"  content_copy  `** — this entity's `usage  content_copy  ` is strictly greater than its *effective limit* (see below).
- **`"CHILD_LIMITS_EXCEED_PARENT"  content_copy  `** — the sum of the *effective limits* of this entity's **direct** children is strictly greater than this entity's own effective limit. (Reported against the parent's `entity_id  content_copy  `, not the children's.)
- **`"MISSING_PARENT"  content_copy  `** — this entity's `parent_id  content_copy  ` is not `null  content_copy  ` but does not match any `entity_id  content_copy  ` present in the input.

### Effective limit

An entity's **effective limit** is:

- its own `own_limit  content_copy  `, if that is not `null  content_copy  `;
- otherwise (own `own_limit  content_copy  ` is `null  content_copy  `), its **parent's effective limit**, inherited recursively up the chain — following `null  content_copy  ` `own_limit  content_copy  ` s through as many ancestors as necessary until one has an explicit `own_limit  content_copy  `.
- If that chain **never bottoms out in an explicit limit** — either because the entity is a root (`parent_id  content_copy  ` is `null  content_copy  `) with `own_limit  content_copy  ` also `null  content_copy  `, or because the chain runs into a missing parent before reaching an explicit limit — the effective limit is **undefined**. An entity with an undefined effective limit:
	- is never checked for `USAGE_EXCEEDS_LIMIT  content_copy  ` (there's nothing to compare its usage against);
		- is never checked for `CHILD_LIMITS_EXCEED_PARENT  content_copy  ` **as a parent** (there's nothing for its children's sum to exceed) — but it can still itself be *counted* as a child elsewhere, per the point below.

A consequence worth spelling out because it resolves an otherwise-tricky case: **a direct child of an entity that *does* have a defined effective limit always itself has a defined effective limit** — either its own explicit `own_limit  content_copy  `, or (if `null  content_copy  `) the parent's own defined effective limit, inherited one level. So when computing a `CHILD_LIMITS_EXCEED_PARENT  content_copy  ` check for a parent with a defined effective limit, every one of its direct children contributes a real number to the sum — there's no case of a "partially valid" child to special-case or exclude.

### Sorting

The returned list is sorted **lexicographically as strings**, first by `entity_id  content_copy  `, then (for entities with more than one violation) by `reason  content_copy  ` — i.e. sort the `[entity_id, reason]  content_copy  ` pairs as string tuples. `entity_id  content_copy  ` s are always compared as plain strings, never as numbers, even if they look numeric.

### Floating-point tolerance

Both "exceeds" comparisons (`usage > effective_limit  content_copy  `, and `child_limit_sum > parent_effective_limit  content_copy  `) use a small absolute tolerance of `1e-9  content_copy  `: a sum that comes out at most `1e-9  content_copy  ` above the limit purely from floating-point summation error does **not** count as exceeding it. In other words, compare with `value > limit + 1e-9  content_copy  `, not a bare `>  content_copy  `.

### Other rules, made explicit

- `MISSING_PARENT  content_copy  ` and `USAGE_EXCEEDS_LIMIT  content_copy  ` **can** both be reported for the same entity: if it has an explicit (non- `null  content_copy  `) `own_limit  content_copy  `, that limit is well-defined and checkable regardless of whether its `parent_id  content_copy  ` resolves to a real entity or not. (If its `own_limit  content_copy  ` is `null  content_copy  ` *and* its parent is missing, its effective limit is undefined, so only `MISSING_PARENT  content_copy  ` is possible for it — see "Effective limit" above.)
- A root (`parent_id == null  content_copy  `) is not itself a `MISSING_PARENT  content_copy  ` violation — an explicit "no parent" is not the same as a *broken reference* to a parent that should exist. `MISSING_PARENT  content_copy  ` only fires when `parent_id  content_copy  ` is non- `null  content_copy  ` but unresolvable.
- A root can still be reported for `CHILD_LIMITS_EXCEED_PARENT  content_copy  ` (against its own `entity_id  content_copy  `) if it has a defined effective limit and its direct children's effective-limit sum exceeds it — a root has no parent to violate, but it can still have children whose sum exceeds *its own* limit.
- **Assumption (input guarantee):** every `entity_id  content_copy  ` in the input is unique, and the parent links that *do* resolve to a real entity always form a valid forest — no entity is its own ancestor (no cycles). Cycles and duplicate `entity_id  content_copy  ` s are not part of the input domain for this task and are not exercised by any test case.

## Example 1 — inheritance, and a child-sum violation one level up

Input:

```
[
  ["ROOT", null, 1000, 200],
  ["CHILD_A", "ROOT", null, 600],
  ["CHILD_B", "ROOT", 300, 350],
  ["GRANDCHILD", "CHILD_A", null, 50]
]
```

Output:

```
[["CHILD_B", "USAGE_EXCEEDS_LIMIT"], ["ROOT", "CHILD_LIMITS_EXCEED_PARENT"]]
```
- `CHILD_A  content_copy  ` has `own_limit = null  content_copy  `, so it inherits `ROOT  content_copy  ` 's effective limit (1000). `GRANDCHILD  content_copy  ` likewise inherits `CHILD_A  content_copy  ` 's effective limit, which is itself the inherited 1000.
- `CHILD_B  content_copy  ` has an explicit `own_limit = 300  content_copy  `; its `usage = 350 > 300  content_copy  ` → `USAGE_EXCEEDS_LIMIT  content_copy  `.
- `ROOT  content_copy  ` 's direct children are `CHILD_A  content_copy  ` (effective limit 1000) and `CHILD_B  content_copy  ` (effective limit 300); their sum is 1300, which exceeds `ROOT  content_copy  ` 's own effective limit of 1000 → `CHILD_LIMITS_EXCEED_PARENT  content_copy  ` for `ROOT  content_copy  `.
- `CHILD_A  content_copy  ` 's only direct child is `GRANDCHILD  content_copy  ` (effective limit 1000, inherited); the sum (1000) does **not** exceed `CHILD_A  content_copy  ` 's own effective limit (1000, also inherited) — equal is not "exceeds", so no violation there.

## Example 2 — missing parent, multiple roots, undefined effective limit, sorting

Input:

```
[
  ["REGION_EU", null, 1000, 500],
  ["REGION_US", null, null, 200],
  ["DESK_EQ", "REGION_EU", null, 300],
  ["DESK_FX", "REGION_EU", 400, 450],
  ["DESK_RATES", "REGION_US", 150, 100],
  ["TRADER_1", "DESK_EQ", null, 1200],
  ["TRADER_2", "DESK_EQ", 200, 50],
  ["GHOST", "NOSUCH", 500, 600],
  ["GHOST_CHILD", "GHOST", null, 10]
]
```

Output:

```
[
  ["DESK_EQ", "CHILD_LIMITS_EXCEED_PARENT"],
  ["DESK_FX", "USAGE_EXCEEDS_LIMIT"],
  ["GHOST", "MISSING_PARENT"],
  ["GHOST", "USAGE_EXCEEDS_LIMIT"],
  ["REGION_EU", "CHILD_LIMITS_EXCEED_PARENT"],
  ["TRADER_1", "USAGE_EXCEEDS_LIMIT"]
]
```
- Two roots: `REGION_EU  content_copy  ` (explicit limit 1000) and `REGION_US  content_copy  ` (`own_limit = null  content_copy  ` — a root with no explicit limit has an **undefined** effective limit, so `REGION_US  content_copy  ` itself is never checked for either `USAGE_EXCEEDS_LIMIT  content_copy  ` or `CHILD_LIMITS_EXCEED_PARENT  content_copy  `, no matter how large its `usage  content_copy  ` is).
- `DESK_RATES  content_copy  ` (child of `REGION_US  content_copy  `) has its own explicit `own_limit = 150  content_copy  `, so it's checked normally regardless of its parent's undefined limit: `usage = 100 <= 150  content_copy  `, no violation.
- `GHOST  content_copy  ` 's `parent_id  content_copy  ` ("NOSUCH") doesn't match any entity → `MISSING_PARENT  content_copy  `. `GHOST  content_copy  ` also has an explicit `own_limit = 500  content_copy  ` and `usage = 600 > 500  content_copy  ` → `USAGE_EXCEEDS_LIMIT  content_copy  ` as well — both fire for the same entity.
- `GHOST_CHILD  content_copy  ` 's parent is `"GHOST"  content_copy  `, which **does** exist in the input (having a missing parent yourself doesn't stop you from being a valid parent to your own children) — so `GHOST_CHILD  content_copy  ` inherits `GHOST  content_copy  ` 's effective limit (500) with no `MISSING_PARENT  content_copy  ` of its own; `usage = 10  content_copy  ` is fine, and `GHOST  content_copy  ` 's only child-sum contribution (500) does not exceed `GHOST  content_copy  ` 's own effective limit (500) — equal, not exceeding.
- `DESK_EQ  content_copy  ` inherits `REGION_EU  content_copy  ` 's limit (1000). Its direct children are `TRADER_1  content_copy  ` (inherits `DESK_EQ  content_copy  ` 's 1000) and `TRADER_2  content_copy  ` (explicit 200); sum 1200 exceeds `DESK_EQ  content_copy  ` 's 1000 → `CHILD_LIMITS_EXCEED_PARENT  content_copy  ` for `DESK_EQ  content_copy  `.
- `REGION_EU  content_copy  ` 's direct children are `DESK_EQ  content_copy  ` (effective 1000) and `DESK_FX  content_copy  ` (effective 400); sum 1400 exceeds `REGION_EU  content_copy  ` 's own 1000 → `CHILD_LIMITS_EXCEED_PARENT  content_copy  ` for `REGION_EU  content_copy  ` too (the check propagates independently at every level of the tree).
- `TRADER_1  content_copy  ` inherits `DESK_EQ  content_copy  ` 's effective limit (1000); `usage = 1200 > 1000  content_copy  ` → `USAGE_EXCEEDS_LIMIT  content_copy  `.
- The result is sorted lexicographically by `[entity_id, reason]  content_copy  ` — note `GHOST  content_copy  ` contributes two entries, ordered `MISSING_PARENT  content_copy  ` before `USAGE_EXCEEDS_LIMIT  content_copy  ` (`"M" < "U"  content_copy  `), and every entity is ordered by plain string comparison of its id, not by input order or tree structure.

## Constraints

- `0 ≤ length(records) ≤ 5,000  content_copy  `.
- `entity_id  content_copy  ` and `parent_id  content_copy  ` (when not `null  content_copy  `) are non-empty, whitespace-free tokens, unique per entity.
- `own_limit  content_copy  ` (when not `null  content_copy  `) and `usage  content_copy  ` fit comfortably in a standard double-precision float in every language provided, and are never negative.

## How to run

Each language's folder has a self-test (`test_example.*  content_copy  `, or `solution_test.go  content_copy  ` for Go) wired up against both examples above, plus a `run  content_copy  ` script that builds and runs it. The easiest way to use it is the top-level `run  content_copy  ` script, one level above all the language folders:

```
./run python       # build/run just the Python self-test
./run java          # ...just the Java self-test
```

`./run <language>  content_copy  ` accepts: `python  content_copy  `, `javascript  content_copy  `, `java  content_copy  `, `cpp  content_copy  `, `csharp  content_copy  `, `typescript  content_copy  `, `rust  content_copy  `, `go  content_copy  `, `php  content_copy  `.

If you'd rather run a language's self-test directly, `cd  content_copy  ` into its folder and run its own `run  content_copy  ` script (e.g. `cd python && ./run  content_copy  `) — that's all the top-level script does under the hood.