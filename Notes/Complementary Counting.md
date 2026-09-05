#Array #SlidingWindow #PrefixSum #LeetCode 

# Complementary Counting

**The move:** when "what I want" is awkward to count/track directly, reduce it to something easier — either by subtracting an unwanted count from a total, or by subtracting two easier counts from each other.

This covers **three genuinely different mechanics**. Mixing them up is the main way this pattern goes wrong — keep them separate.

## Pattern A — Exactly K (subtract two "at most" windows)

`atMost(m)` = count of subarrays with the property ≤ m. Since `atMost` is monotonic (easy sliding window), and every subarray has exactly one property-value:

```
exactly(k) = atMost(k) − atMost(k−1)
```

Use when the problem asks for an **exact** count and direct exact-tracking breaks the window (adding an element can jump you past k in one step, with no clean way to detect it).

- **992. Subarrays with K Different Integers** — asks for _exactly_ k distinct integers. Canonical example.
- **1248. Count Number of Nice Subarrays** — exactly k odd numbers. Same skeleton as 992, applied to parity count instead of distinct count.

## Pattern B — At Least K (direct accumulation, no subtraction)

"At least k" is _itself_ monotonic — once a window satisfies it, every wider window (same left, moving right) still does. So you don't need a complement at all: slide right, shrink left until just-barely-valid, then every position ≤ left also works, so accumulate `ans += left` per step.

```
count(at least k)  →  solved directly in one pass, ans += left
```

- **2962. Count Subarrays Where Max Element Appears at Least K Times** — for each right, shrink left while count of max ≥ k, then `ans += left`.
- **1358. Number of Substrings Containing All Three Characters** — "at least one of each of a/b/c" is the same shape (k=1, three conditions AND'd); track last-seen index of each, `ans += min(lastA, lastB, lastC) + 1`.

_(You technically could compute at-least-k as `total − atMost(k−1)` — but for these two, direct accumulation is simpler. Don't force Pattern A's formula onto Pattern B problems: `atMost(k) − atMost(k−1)` gives you exactly-k, which is the wrong number here.)_

## Pattern C — Total minus "none bad" (the true complement)

When "contains at least one bad element" is annoying to track, but "contains zero bad elements" is a trivial run-length count:

```
answer = total_subarrays − count(zero bad elements)
```

- Template example: count subarrays containing at least one `0`, where `nums` may have zeros scattered in it — complement is "count subarrays entirely inside a run of nonzero elements," summed as `L(L+1)/2` per maximal run of length L, subtracted from `n(n+1)/2`.

## Pattern D — Value complement, take from ends

Same reduction instinct, but the thing being reduced is a **sum**, not a count, and the "complement" is a **fixed-size window**, not a failing condition:

```
max picked from ends(k) = total_sum − min_subarray_sum(size n−k)
```

- **1423. Maximize Points You Can Get from Cards**
- **1658. Minimum Operations to Reduce X to Zero** — removing prefix+suffix summing to `x` ⟺ leaving a middle subarray summing to `total − x`; find the _longest_ such subarray, answer = `n − length`.

## Recognizing which pattern applies

1. Is the count exact ("== k")? → **A**, `atMost(k) − atMost(k-1)`.
2. Is it a lower bound ("≥ k") and does the window naturally stay valid as it grows? → **B**, direct accumulation.
3. Is it "contains ≥ 1 of some single bad thing," where "contains none" is trivial to count? → **C**, `total − none`.
4. Is the answer a sum/max, not a count? → **D**.

## Contrast case (no complement needed at all)

- **713. Subarray Product Less Than K** — already monotonic and directly what's being asked; solve straight, no total/complement subtraction.

## Study Order

713 → 992 → 1248 → 2962 → 1358 → 1423 → 1658

## Pitfalls

- Don't apply Pattern A's `atMost(k) − atMost(k−1)` to a Pattern B problem (992 vs 2962 look similar but aren't) — it silently computes the wrong quantity (exactly-k instead of at-least-k) rather than erroring.
- Pattern A: keep the two `atMost` passes as separate function calls, don't try to merge them into one loop.
- Pattern C: only fits when there's one "bad" condition to avoid — for AND'd conditions (all of a, b, c present), use Pattern B instead.