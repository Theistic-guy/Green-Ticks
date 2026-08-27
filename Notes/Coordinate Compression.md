<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Coordinate Compression

## What it is

A technique to map a large/sparse set of values to a small, dense range `[0, k-1]` while preserving **relative order**. Used when you care about _ranks/order_ of values, not their actual magnitude.

> If values can be huge (10^9), negative, floats, or sparse, but you only ever compare/index by them — compress first.

## Core Template (Python)

```python
def compress(arr):
    sorted_unique = sorted(set(arr))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    compressed = [rank[v] for v in arr]
    return compressed, sorted_unique   # sorted_unique[i] = original value of rank i

# Example
arr = [100, -5, 100, 42, 7]
comp, orig = compress(arr)
# comp = [3, 0, 3, 2, 1]
# orig = [-5, 7, 42, 100]  → orig[comp[i]] gives back original value
```

- `sorted(set(arr))` → dedupes + sorts → `O(n log n)`
- `rank` dict → `O(1)` lookup per element → build compressed array in `O(n)`
- **Total: O(n log n) time, O(n) space**

## Variants

**1. Keep duplicates distinguishable (stable rank by index)**

```python
indexed = sorted(range(len(arr)), key=lambda i: arr[i])
rank_of = [0] * len(arr)
for r, i in enumerate(indexed):
    rank_of[i] = r
```

Every element gets a **unique** rank `0..n-1`, ties broken by original position. Useful when you need a bijection (e.g. permutation/cycle problems), not just order buckets.

**2. Dense de-duped rank (ties → same rank)** — the `compress()` template above. Useful for coordinate-based DS (BIT/segment tree indices), since equal values should map to the same bucket.

**3. Using `bisect` for repeated lookups**

```python
import bisect
sorted_unique = sorted(set(arr))
def get_rank(x):
    return bisect.bisect_left(sorted_unique, x)
```

Handy when compressing a _stream_ or querying values not in the original array (e.g., range-query endpoints).

## When to reach for it

|Signal in the problem|Why compression helps|
|---|---|
|Values up to 1e9 but n ≤ 1e5|Can't index array/BIT/segment tree by raw value — compress to `0..n-1` first|
|"Count elements smaller than X" / inversions|Need ordered indices for a Fenwick/BIT tree|
|Building a permutation from arbitrary distinct values (e.g. min-swaps-to-sort)|Need `pos(i)` in `0..n-1` to do cycle decomposition|
|Sweep-line over coordinates (segment tree on ranges)|Endpoints define O(n) meaningful positions, not O(1e9)|
|Only relative order matters, not actual magnitude|Compression is a lossless-for-your-purpose simplification|

## Common Pairing Patterns

- **Compression + BIT/Fenwick tree** → count inversions, count-smaller-to-the-right, order statistics
- **Compression + segment tree** → range updates/queries over coordinates instead of values
- **Compression + cycle decomposition** → min swaps to sort (see linked note), permutation problems on arbitrary distinct values
- **Compression + sweep line** → 2D geometry, interval scheduling, skyline-type problems

## Gotchas

- `sorted(set(arr))` **destroys duplicate identity** — if you need to know _which_ occurrence, use the stable-index variant instead.
- Compression is **not reversible losslessly** for magnitude — only order is preserved. Keep the `sorted_unique` / `orig` array around if you need to map back.
- Off-by-one: decide up front whether ranks start at `0` or `1` (BITs are usually 1-indexed) — mismatches here are the #1 bug source.
- If compressing _query points that aren't in the array_ (e.g., range boundaries in a sweep), make sure to include those points in the set before compressing, or use `bisect` against the compressed array of just the data points.

## One-liner to remember

**Coordinate compression turns "what value" into "what rank" — use it any time your algorithm's complexity depends on the value range rather than the number of elements.**