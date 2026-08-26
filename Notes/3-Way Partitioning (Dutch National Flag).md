<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

## 3-Way Partitioning (Dutch National Flag)

##### Refs
<u><b>Leetcode - 75 : Sort Colors</b></u>
[2-Way Partitioning](../Templates/2-Way%20Partitioning.md)

---
**Core idea:** Partition an array into three zones relative to a pivot value — `< pivot`, `== pivot`, `> pivot` — in one linear pass, O(n) time, O(1) space. Invented by Dijkstra for the problem of sorting an array of three colors (hence "Dutch flag").

### Invariant setup

Three pointers: `low`, `mid`, `high`.

- `[0, low)` → elements `< pivot`
- `[low, mid)` → elements `== pivot`
- `[mid, high]` → **unprocessed**
- `(high, n-1]` → elements `> pivot`

Loop runs while `mid <= high`, comparing `arr[mid]` to pivot:

- `arr[mid] < pivot` → swap `arr[low], arr[mid]`; `low++`, `mid++`
- `arr[mid] == pivot` → `mid++`
- `arr[mid] > pivot` → swap `arr[mid], arr[high]`; `high--` (mid stays — you must re-examine the swapped-in element)

The asymmetry (mid advances on `<` and `==`, but not on `>`) is the detail people forget and the one interviewers probe.

### Pivot's landing position w.r.t. equal elements

This is the subtlety you flagged. After the pass, **all elements equal to pivot occupy the contiguous block `[low, mid)`** — not a single index. There is no single "pivot landing index" the way there is in vanilla Lomuto/Hoare quicksort partitioning, because 3-way partitioning is designed precisely to _not_ single out one occurrence — it groups every duplicate together.

Contrast with the two schemes it generalizes:

- **Lomuto partition**: pivot lands at exactly one final index; all equal elements end up scattered on one side (typically the "not less than" side), not grouped. Degenerates to O(n²) on arrays with many duplicates (e.g., all-equal array → every partition is maximally unbalanced).
- **Hoare partition**: pivot's final resting index isn't even guaranteed to be where the pivot value was picked from; only guarantees a split point. Handles duplicates better than Lomuto but still doesn't group them.
- **3-way (DNF)**: explicitly carves out the equal-block `[low, mid)`. This is what makes it the correct choice for quicksort variants when duplicates are heavy — you never recurse into the equal zone at all, since it's already fully sorted relative to everything else. That's the whole efficiency win: it converts O(n²) worst case (all-duplicates array) into O(n).

So the "pivot landing position" question really has two valid answers depending on what's being asked:

- If asked "where does _a_ pivot end up" → anywhere in `[low, mid)`.
- If asked "what's guaranteed about the equal region" → it's exactly `[low, mid)`, contiguous, and both boundaries are tight (no `<` element right of `low` boundary inside that zone, no `>` element left of `high` boundary).

### Why `mid` doesn't increment on the `>` swap

When you swap `arr[mid]` with `arr[high]`, the element now at `arr[mid]` is unexamined (it came from the unprocessed zone via `high`). If you incremented `mid` anyway, you could skip evaluating it — this is the single most common bug in interview implementations, and worth stating explicitly in your notes since it's the "why" behind the asymmetric loop.

### Variations / applications

1. **Sort Colors (LC 75)** — direct application, pivot fixed at value `1`.
2. **Quicksort with 3-way partitioning** — replaces the single partition call; recursion only touches `[start, low)` and `(mid_end, end]`, skipping the equal block. This is the standard fix for "quicksort degrades on many duplicates."
3. **Kth largest / order statistics (Quickselect variant)** — when duplicates are dense, 3-way partitioning tells you immediately if `k` falls inside the equal-block, letting you terminate without recursing further — turns worst-case O(n²) quickselect into expected O(n) even on adversarial duplicate-heavy input.
4. **Partition around a predicate rather than a value** — generalizes to "3-way partition on a comparator/predicate," relevant to your Binary-Search-on-Answer work: any predicate-based partitioning problem (e.g., partition into `false/boundary/true` regions) borrows the same three-pointer invariant structure.
5. **Move Zeroes / segregate even-odd / partition around median-of-medians** — simpler two-way special cases of the same pointer discipline.
6. **Sort an array with only a few distinct values** — 3-way partitioning generalizes to k-way (bucket-style) partitioning when there are a handful of known distinct values, each getting its own pointer pass or extended to multiple pivots.

### Common interview trap questions

- "Can you do this with 2 passes and a count instead?" — yes (counting sort style) but loses in-place/single-pass property; interviewers use this to test if you understand _why_ one-pass matters (streaming input, unknown value range).
- "What if pivot value doesn't exist in the array?" — algorithm degrades gracefully to a 2-way partition; the `[low, mid)` block is just empty. Good edge case to state out loud.
- "Is it stable?" — no; swaps break relative order within `<` and `>` zones.

---
## Python Implementation

```python
def three_way_partition(arr, pivot):
    low, mid, high = 0, 0, len(arr) - 1

    while mid <= high:
        if arr[mid] < pivot:
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1
            mid += 1
        elif arr[mid] == pivot:
            mid += 1
        else:  # arr[mid] > pivot
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1
            # mid NOT incremented — swapped-in element is unexamined

    return low, mid  # equal-block = arr[low:mid]
```

Sort Colors (LC 75) is just this with `pivot = 1`:

```python
def sortColors(nums):
    three_way_partition(nums, 1)
```

Quickselect using the equal-block to skip recursion:

```python
import random

def quickselect(arr, k):
    lo, hi = 0, len(arr) - 1
    while True:
        pivot = arr[random.randint(lo, hi)]
        low, mid, high = lo, lo, hi
        while mid <= high:
            if arr[mid] < pivot:
                arr[low], arr[mid] = arr[mid], arr[low]
                low += 1; mid += 1
            elif arr[mid] == pivot:
                mid += 1
            else:
                arr[mid], arr[high] = arr[high], arr[mid]
                high -= 1

        if low <= k <= mid - 1:
            return pivot          # k lands inside the equal-block — done
        elif k < low:
            hi = low - 1
        else:
            lo = mid
```