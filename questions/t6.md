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

Write a function:

> `def solution(A)  content_copy  `

that, given a flattened array of points in the unit square, estimates pi using the quarter-circle method and returns the estimate plus standard error.

Use integer scaling so the task works in the standard Codility editor.

A contains flattened coordinate pairs:

\[x0Scaled, y0Scaled, x1Scaled, y1Scaled,...\]

Each coordinate is scaled by 1,000,000. For example, coordinate 0.5 is represented as 500000.

A will contain an even number of elements. Coordinates are between 0 and 1 inclusive.

A point is inside the quarter circle if:

x^2 + y^2 <= 1

Using the scaled representation, this is equivalent to:

xScaled^2 + yScaled^2 <= 1,000,000^2

Let:

n = number of points

insideCount = number of points inside the quarter circle

p = insideCount / n

piEstimate = 4 \* p

standardError = 4 \* sqrt(p \* (1 - p) / n)

Return:

\[piEstimateScaled, standardErrorScaled\]

where each value is scaled by 1,000,000 and rounded to the nearest integer.

If n = 0, return \[0, 0\].

Example:

A = \[0, 0, 1000000, 0, 1000000, 1000000, 500000, 500000\]

This represents points:

(0, 0), (1, 0), (1, 1), (0.5, 0.5)

Three of the four points are inside or on the quarter circle, so p = 0.75.

piEstimate = 3.0

standardError = 0.866025...

Output:

\[3000000, 866025\]

Copyright 2009–2026 by Codility Limited. All Rights Reserved. Unauthorized copying, publication or disclosure prohibited.