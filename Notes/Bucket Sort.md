## Bucket Sort — PKM Note

See Also:
+ special case when range is [0,1) . See below
+ [Radix Sort](Radix%20Sort.md)

**Core idea:** Distribute elements into `n` buckets by value range (not by digit, unlike radix sort), sort each bucket individually with a simple sort, then concatenate buckets in order. It's a **distribution sort**, same family as radix/counting sort — all three beat O(n log n) by exploiting known structure in the _values_ rather than comparing pairs.

```python
def bucket_sort(arr):
    n = len(arr)
    if n <= 1:
        return arr
    min_val, max_val = min(arr), max(arr)
    if min_val == max_val:
        return arr

    buckets = [[] for _ in range(n)]
    data_range = max_val - min_val
    for num in arr:
        idx = int((num - min_val) / data_range * n)
        idx = min(idx, n - 1)          # clamp: num == max_val maps to idx == n, out of bounds
        buckets[idx].append(num)

    result = []
    for bucket in buckets:
        bucket.sort()                   # insertion sort in practice — buckets are small/near-sorted
        result.extend(bucket)
    return result
```

**Why it works — the assumption that makes it O(n):** uniform distribution. If values are spread evenly across `[min, max]`, each of the `n` buckets gets ~1 element, so per-bucket sorting is O(1) amortized and total work is O(n). This is the load-bearing assumption — everything else in this note is about what breaks when it's violated.

**Complexity:** O(n + k) average (k = number of buckets, usually n). **O(n²) worst case** — if all elements land in one bucket, you're just running insertion sort on the whole array with bucket overhead on top. This worst-case collapse is the thing to say out loud in an interview, same way you'd flag radix sort's stability dependency.

---

### The index formula — and why the `n` vs `n-1` choice matters

$$\text{idx} = \left\lfloor \frac{x - \min}{\max - \min} \times n \right\rfloor$$

At `x = max`, the fraction hits exactly `1.0`, so `idx = n` — one past the last valid bucket. Two ways to handle it, and they're not equivalent:

- **Clamp** (`min(idx, n-1)`): keeps `n` buckets, simple, but the last bucket now silently absorbs both its "fair share" plus the max value — slightly uneven.
- **Scale by `n-1` instead of `n`**: `idx = floor((x-min)/(max-min) * (n-1))` — no clamping needed, but bucket _widths_ become uneven (first and last buckets are effectively half-width), which matters if you're reasoning about density guarantees.

Clamping is simpler and what you'll write under interview time pressure; scaling by `n-1` is what you'd justify if asked "why not just clamp."

### The 0-baseline trap (worth naming since it's a real failure mode, not a hypothetical)

Skipping the `min_val` shift — indexing by `x / max * n` directly — only works if you can _guarantee_ no negatives. A negative value produces a negative index, and Python's negative indexing silently wraps to the end of the list instead of crashing, so bad data corrupts the sort without raising an error. This is worse than a crash: it's a silent correctness bug. If you can't guarantee the domain, always shift by `min_val`.

---

### Why FAANG cares

- "Sort n floating point numbers in [0,1) in linear time" — canonical bucket sort prompt (CLRS's own example). Naming the uniform-distribution assumption unprompted is the signal.
- **Clustered/adversarial input as a follow-up** — interviewers often ask "what if the data isn't uniform?" specifically to see if you volunteer the O(n²) degradation, not wait to be caught by it.
- **Same conversation as radix/counting sort** — expect "when would you pick bucket sort over radix sort?" Answer: radix sort needs discrete digit structure (integers, fixed-width keys); bucket sort works on continuous/real-valued data where you only know the range, not a digit decomposition.

---

**Link back:** sibling of [Radix Sort](Radix%20Sort.md) — both are distribution sorts trading the O(n log n) comparison bound for O(n) by assuming structure in the values. 

---

Fair — for the classic [0,1) case, yes: number of buckets = length of array (`n`), so each bucket holds ~1 element on average. No min-max scaling needed since the range is already fixed at [0,1).

```python
def bucket_sort_01(arr):
    n = len(arr)
    if n <= 1:
        return arr

    buckets = [[] for _ in range(n)]

    # Distribute
    for num in arr:
        idx = int(num * n)
        idx = min(idx, n - 1)      # num == value approaching 1.0 could push idx to n
        buckets[idx].append(num)

    # Sort each bucket, concatenate
    result = []
    for bucket in buckets:
        bucket.sort()               # insertion sort in practice — buckets are ~size 1
        result.extend(bucket)
    return result
```

**Why `n` buckets specifically:** with values uniformly distributed over `[0,1)` and `n` buckets each covering width `1/n`, expected occupancy per bucket is `n * (1/n) = 1` element. That's what makes per-bucket sort O(1) amortized and the whole thing O(n). Fewer buckets → more collisions per bucket → sort cost creeps toward O(n log n)/O(n²). More buckets than `n` doesn't help once you're already at ~1 element/bucket — you're just paying allocation overhead for empty buckets.

`idx = num * n` works directly here (no `- min_val` shift) because the domain is guaranteed `[0,1)` — this is the one legitimate use of the 0-baseline shortcut I flagged as risky in the general case, since here the non-negative-and-bounded guarantee is the problem's premise, not an assumption you're making.