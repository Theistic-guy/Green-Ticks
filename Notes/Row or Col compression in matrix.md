
See links:
+ [largest-rectangle-in-histogram](../Problems/largest-rectangle-in-histogram.md)

# Row/Column Compression (Matrix → 1D)

## Core Idea

Whenever a matrix problem asks for something across a _range of rows_ combined with _all columns_ (or vice versa), you don't need to re-scan the 2D grid for every candidate range. Instead:

1. Fix a pair of boundaries (e.g. `top row` to `bottom row`).
2. **Compress** every column's values within that row-range into a single number — usually a sum — producing a 1D array of length = number of columns.
3. Now the problem has been reduced to a classic 1D array problem (max subarray, sliding window, prefix sum, etc.) that you already know how to solve.
4. Repeat for all `O(rows²)` row-boundary pairs.

This turns an `O(rows² × cols²)` brute force into `O(rows² × cols)`, because step 3 solves the 1D problem in `O(cols)` instead of `O(cols²)`.

**Why this works:** matrices are just stacked 1D arrays. Any property that's _additive across rows_ (sum, count, parity) can be folded into a single row via prefix-sum-style accumulation — so the row dimension collapses and you're left applying a technique you already know on a line.

## The Template

```
for top in range(rows):
    col_acc = [0] * cols          # compressed row
    for bottom in range(top, rows):
        for c in range(cols):
            col_acc[c] += matrix[bottom][c]
        # col_acc is now "sum of rows top..bottom" per column
        result = best(solve_1D(col_acc), result)
```

`solve_1D` is whatever 1D pattern the problem actually reduces to — that's the part worth recognizing per-problem, not memorizing.

## Recognizing Which 1D Technique to Plug In

|Matrix ask|Compress by|1D technique to apply|
|---|---|---|
|Max sum rectangle|row sum → col array|Kadane's algorithm|
|Max size square/rectangle of 1s|—|(different pattern: DP, not compression)|
|Count submatrices summing to target|row sum → col array|prefix sum + hashmap (subarray sum = k)|
|Largest rectangle in binary matrix|column-wise running height|Largest Rectangle in Histogram (monotonic stack)|
|Max sum of rectangle no larger than K|row sum → col array|prefix sum + sorted set (find just-under-K)|

The pattern is always: **reduce a dimension by accumulation, then recognize the 1D subproblem** — same mental move as your Intervals-from-Sorting discovery: a 2D constraint quietly hides a 1D one.

## LeetCode Problems (by variation)

**Direct row-compression + Kadane:**

- 363. Max Sum of Rectangle No Larger Than K _(row-compress, then prefix-sum + TreeSet/sorted-list search, not plain Kadane since there's a constraint K)_
- Maximum Sum Rectangle in a 2D Matrix (GfG / classic interview version of Kadane-on-compressed-rows — not on LC directly but frequently asked)

**Histogram-via-column-compression (the other axis):**

- 85. Maximal Rectangle — compress _columns_ into running "height since last 0", then run Largest Rectangle in Histogram per row
- 84. Largest Rectangle in Histogram _(prerequisite 1D subroutine for 85 — study this first)_
	 <mark>Find here</mark> - [largest-rectangle-in-histogram](../Problems/largest-rectangle-in-histogram.md)
	
- 221. Maximal Square — related family, but solved via DP directly, not compression; good contrast case for "when compression does NOT apply"

**Prefix-sum-on-compressed-row family:**

- 304. Range Sum Query 2D - Immutable — the setup step (2D prefix sum) that row-compression specializes
- 1074. Number of Submatrices That Sum to Target — canonical row-compression + subarray-sum-equals-k on the collapsed row

**Adjacent/foundational 1D pieces worth having sharp before attempting the above:**

- 53. Maximum Subarray (Kadane's)
- 560. Subarray Sum Equals K (prefix sum + hashmap)

## Suggested Study Order

1. 53 → 560 (make sure the two 1D primitives are automatic)
2. 304 (build the 2D prefix-sum machinery)
3. 1074 (apply row-compression + 560 on top of it)
4. 363 (row-compression + a harder 1D search)
5. 84 → 85 (the column-compression / histogram variant — structurally different collapse direction)

## Pitfalls

- Off-by-one in `col_acc` reset: it must be freshly zeroed per `top`, then accumulated as `bottom` grows — don't rebuild from scratch each time (that's what makes it O(rows²·cols) not O(rows³·cols)).
- Rows vs columns: if `cols > rows`, compress along rows (loop `O(rows²)`) so the O(rows²) factor is on the smaller dimension. If `rows > cols`, transpose the problem instead.
- 221/1277 (maximal square, count square submatrices) _look_ like this family but are actually DP-on-cell problems — don't force-fit compression onto them.