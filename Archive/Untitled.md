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

A numerical dataset is represented as a rectangular matrix (a list of rows, each row a list of numbers, all rows the same length).

## What you have to do

You're given a stub file in each of **9 languages — Python, Java, JavaScript, TypeScript, C++, C#, Rust, Go, and PHP**, each in its own folder. **It's enough to complete just one of them** — implement `solution  content_copy  ` in whichever language you're most comfortable with.

If you do complete more than one, that's fine too: all 9 are graded independently and your final score is simply the best of the nine.

## Task details

Write:

```
solution(matrix)
```

Return:

```
[
  rotated_matrix,
  row_sums_after_rotation,
  column_means_after_rotation
]
```

Where:

- **`rotated_matrix  content_copy  `** is `matrix  content_copy  ` rotated **90 degrees clockwise**. If `matrix  content_copy  ` has `R  content_copy  ` rows and `C  content_copy  ` columns, `rotated_matrix  content_copy  ` has `C  content_copy  ` rows and `R  content_copy  ` columns.
- **`row_sums_after_rotation  content_copy  `** is the sum of each row of `rotated_matrix  content_copy  `, in row order (so it has `C  content_copy  ` entries).
- **`column_means_after_rotation  content_copy  `** is the arithmetic mean of each column of `rotated_matrix  content_copy  `, in column order (so it has `R  content_copy  ` entries).

### The empty/degenerate-matrix rule

If `matrix  content_copy  ` has zero rows, **or** every row has zero columns (there is no data to rotate either way), the result is defined as `[[], [], []]  content_copy  ` — an empty rotated matrix, with no row sums and no column means to compute. This applies regardless of which of the two dimensions is zero. See Example 3.

## Example 1

Input:

```lua
[[1, 2, 3], [4, 5, 6]]
```

Rotated:

```lua
[[4, 1], [5, 2], [6, 3]]
```

Output:

```
[
  [[4, 1], [5, 2], [6, 3]],
  [5, 7, 9],
  [5.0, 2.0]
]
```

## Example 2 (negative values, decimals, non-square)

Input:

```lua
[[-1.5, 2, -3], [4, -5.25, 6]]
```

Output:

```
[
  [[4, -1.5], [-5.25, 2], [6, -3]],
  [2.5, -3.25, 3],
  [1.5833333333333333, -0.8333333333333334]
]
```

Walkthrough: rotating 90 degrees clockwise is equivalent to reversing the row order and then transposing — `rotated[i][j] = matrix[R-1-j][i]  content_copy  `. Row sums of the rotated matrix: `4 + -1.5 = 2.5  content_copy  `, `-5.25 + 2 = -3.25  content_copy  `, `6 + -3 = 3  content_copy  `. Column means of the rotated matrix: column 0 is `[4, -5.25, 6]  content_copy  ` → mean `1.5833...  content_copy  `; column 1 is `[-1.5, 2, -3]  content_copy  ` → mean `-0.8333...  content_copy  `.

## Example 3 (the empty/degenerate rule)

Input:

```lua
[[], [], []]
```

Output:

```lua
[[], [], []]
```

Three rows, but each row has zero columns — there is no data, so the result is the fully-empty triple, not a `3x0  content_copy  ` or `0x3  content_copy  ` rotated shape with undefined sums/means. The same rule applies to `matrix = []  content_copy  ` (zero rows).

## Constraints

- `0 ≤ rows(matrix), columns(matrix) ≤ 100  content_copy  `
- Every row has the same number of columns (the matrix is rectangular).
- Values fit comfortably in a double-precision float in every language provided (magnitude up to `10,000  content_copy  `, up to 2 decimal places).

## How to run

Each language's folder has a self-test (`test_example.*  content_copy  `, or `solution_test.go  content_copy  ` for Go) wired up against the three examples above, plus a `run  content_copy  ` script that builds and runs it. The easiest way to use it is the top-level `run  content_copy  ` script, one level above all the language folders:

```
./run python       # build/run just the Python self-test
./run java          # ...just the Java self-test
```

`./run <language>  content_copy  ` accepts: `python  content_copy  `, `javascript  content_copy  `, `java  content_copy  `, `cpp  content_copy  `, `csharp  content_copy  `, `typescript  content_copy  `, `rust  content_copy  `, `go  content_copy  `, `php  content_copy  `.

If you'd rather run a language's self-test directly, `cd  content_copy  ` into its folder and run its own `run  content_copy  ` script (e.g. `cd python && ./run  content_copy  `) — that's all the top-level script does under the hood.



---

