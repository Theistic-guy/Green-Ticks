<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

![](../../assets/Images/disjoint%20cycle%20theorem.png)

https://www.youtube.com/watch?v=NeHZcwCUPFg
# Disjoint Cycle Theorem, Cycle Sort, and Minimum Swaps to Sort

## 1. The Core Idea: An Array as a Permutation

Whenever you have an array of **distinct** elements, you can think of it as a **permutation** — a function that maps "current position" to "correct (sorted) position."

Example array:

```
index:   0   1   2   3   4
arr:    [4,  3,  2,  1,  0]
```

Sorted version: `[0, 1, 2, 3, 4]`

For each index `i`, define:

```
pos(i) = the index where arr[i] should end up in the sorted array
```

For the array above (values happen to equal `4 - index`), the sorted target index of value `v` is just `v` itself. So:

```
pos(0) = 4   (arr[0]=4 belongs at index 4)
pos(1) = 3   (arr[1]=3 belongs at index 3)
pos(2) = 2   (arr[2]=2 belongs at index 2)
pos(3) = 1
pos(4) = 0
```

This `pos` function **is** a permutation of `{0,1,2,3,4}`. Everything below follows from analyzing this permutation.

---

## 2. The Disjoint Cycle Theorem

> **Theorem:** Every permutation of a finite set can be decomposed into disjoint cycles, and this decomposition is unique (up to the order in which you list the cycles and the starting point within each cycle).

**What is a cycle here?** Start at any index `i`. Follow the chain:

```
i → pos(i) → pos(pos(i)) → pos(pos(pos(i))) → ...
```

Since `pos` is a permutation on a finite set, this chain must eventually return to `i` (it can't go on forever without repeating, and the first repeat _must_ be `i` itself — otherwise `pos` wouldn't be injective). The indices visited before returning form a **cycle**.

**Why disjoint?** If two cycles shared an index, following `pos` forward from that shared index would force the rest of both cycles to be identical (since `pos` is a function — each index has exactly one image). So cycles either are identical or share nothing.

### Worked Example

```
index:   0   1   2   3   4   5
arr:    [3,  5,  4,  0,  1,  2]
sorted: [0,  1,  2,  3,  4,  5]
```

Compute `pos(i)` = index in sorted array where `arr[i]` belongs (since values are `0..n-1`, `pos(i) = arr[i]`):

```
pos(0) = 3
pos(1) = 5
pos(2) = 4
pos(3) = 0
pos(4) = 1
pos(5) = 2
```

Trace cycles:

- Start at 0: `0 → 3 → 0` → cycle `(0 3)`, length 2
- Start at 1 (unvisited): `1 → 5 → 2 → 4 → 1` → cycle `(1 5 2 4)`, length 4

So the permutation decomposes into **two disjoint cycles**: `(0 3)` and `(1 5 2 4)`, covering all 6 indices exactly once. That's the Disjoint Cycle Theorem in action.

**Cycle notation reminder:** `(1 5 2 4)` means: element at position 1 moves to position 5's slot, element at 5 moves to 2's slot, element at 2 moves to 4's slot, element at 4 moves back to 1's slot.

---

## 3. Why a Cycle of Length _k_ Needs Exactly _k − 1_ Swaps

This is the heart of the connection to sorting.

### Intuition

Think of a cycle as a **closed loop of "IOUs"**: the value sitting at position `a1` actually belongs at position `a2`; the value at `a2` belongs at `a3`; ...; the value at `ak` belongs back at `a1`.

A single swap can only exchange two elements. Each swap you perform, if done wisely, **permanently fixes at least one element into its correct final position** and shortens the remaining unsorted cycle by exactly one.

### Formal Argument

Take cycle `(a1 a2 a3 ... ak)`. Swap the elements at positions `a1` and `a2`:

- The element formerly at `a1` (which belonged at `a2`) is now correctly placed at `a2`. ✅ Locked in — never touched again.
- The element formerly at `a2` is now sitting at `a1`.

The **remaining unsolved structure** is now the cycle `(a1 a3 a4 ... ak)` — length `k − 1`.

Repeat: each swap reduces cycle length by exactly 1, and locks exactly one element in place. You keep going until the cycle has length 1 (a single element left, which is now automatically correct — a length-1 "cycle" needs 0 swaps).

```
Length k  --swap-->  Length k-1  --swap-->  ... --swap-->  Length 1 (done)
```

Total swaps = `k − 1`.

### Why can't you do it in fewer?

Each swap moves at most 2 elements. Before any swaps, **zero** elements of this cycle are in their correct spot (by definition of a nontrivial cycle — every element in a cycle of length ≥ 2 is displaced). Each swap can fix **at most one new element permanently** (the other element touched is merely relocated, not necessarily finalized, until the last swap when both land correctly). So to fix `k` elements you need at least `k − 1` swaps — matching the upper bound above. Hence `k − 1` is both necessary and sufficient.

### Example: cycle `(1 5 2 4)`, k = 4

```
Positions:  1    5    2    4
Values:     5    2    4    1     (value at pos1 belongs at pos5, etc.)
```

- Swap pos1 ↔ pos5: value `2` locks at pos5. Remaining cycle: `(1 2 4)`
- Swap pos1 ↔ pos2: value `4` locks at pos2. Remaining cycle: `(1 4)`
- Swap pos1 ↔ pos4: value `1` locks at pos4, and value `1`(the last one) also lands correctly at pos1. Done.

3 swaps for a cycle of length 4 → `k − 1 = 3`. ✔

### General Formula for the Whole Array

If a permutation decomposes into cycles of lengths `k1, k2, ..., km` (a fixed point — an element already in its correct place — counts as a cycle of length 1, contributing 0 swaps), then:

```
Minimum swaps to sort the whole array = Σ (ki − 1) = (Σ ki) − m = n − m
```

where `n` = total elements, `m` = total number of cycles (including trivial length-1 ones).

**In our 6-element example:** cycles `(0 3)` [k=2] and `(1 5 2 4)` [k=4] → total swaps = `(2−1) + (4−1) = 1 + 3 = 4`. Also checks out via formula: `n − m = 6 − 2 = 4`.

---

## 4. Connecting This to Cycle Sort

**Cycle Sort** is a comparison-based, in-place sorting algorithm whose defining feature is: **it performs the theoretical minimum number of writes/swaps needed to sort the array** — because it explicitly walks each disjoint cycle and rotates it in exactly `k − 1` writes, never touching an element more than necessary.

### Algorithm

```python
def cycle_sort(arr):
    n = len(arr)
    writes = 0

    for cycle_start in range(n - 1):
        item = arr[cycle_start]

        # Find where 'item' belongs: count elements smaller than it
        pos = cycle_start
        for i in range(cycle_start + 1, n):
            if arr[i] < item:
                pos += 1

        if pos == cycle_start:
            continue  # already in correct place, 0 writes for this cycle element

        # Skip over duplicates
        while item == arr[pos]:
            pos += 1

        arr[pos], item = item, arr[pos]
        writes += 1

        # Rotate the rest of the cycle
        while pos != cycle_start:
            pos = cycle_start
            for i in range(cycle_start + 1, n):
                if arr[i] < item:
                    pos += 1
            while item == arr[pos]:
                pos += 1
            arr[pos], item = item, arr[pos]
            writes += 1

    return arr, writes
```

### Why this _is_ the disjoint cycle theorem in code

- `cycle_start` iterates over indices, same as tracing `i` in Section 2.
- The inner "find pos" step computes exactly `pos(i)` — where the current item belongs in sorted order (via counting, instead of a precomputed sorted-index map).
- The `while pos != cycle_start` loop is **literally walking the cycle** `(a1 a2 a3 ... ak)` one step at a time.
- Each iteration of that inner loop performs **one write/swap**, and the loop runs exactly `k − 1` times before `pos` returns to `cycle_start` — precisely matching Section 3's proof.
- Elements already forming a length-1 cycle (`pos == cycle_start`) cost 0 writes — the `continue` statement.

This is why Cycle Sort is prized in situations where **writes are expensive** (e.g., writing to flash memory/EEPROM) — it achieves the information-theoretic minimum of `n − m` writes, exactly the quantity derived in Section 3.

**Trade-off:** Cycle Sort's _comparisons_ are still O(n²) in the worst case (the "count smaller elements" step), so it's not faster than O(n log n) sorts in terms of comparisons — its selling point is _minimal writes_, not minimal time.

---

## 5. Connecting This to "Minimum Swaps to Sort an Array" (the classic problem)

This is a very common interview/competitive-programming problem:

> Given an array of `n` distinct integers, find the **minimum number of swaps** required to sort it (arbitrary swaps allowed between any two indices, not just adjacent).

**Key realization:** This is _exactly_ asking for `Σ (ki − 1) = n − m` from Section 3 — you don't even need to simulate the sort; you just need the cycle decomposition.

### Algorithm

1. Pair each value with its original index: `(value, original_index)`.
2. Sort these pairs by value → this tells you, for each position, where the element currently sitting there needs to go.
3. Build a `visited[]` array.
4. For each unvisited index `i`, walk the cycle it belongs to (following "where does the element that should be at position `i` currently sit"), marking visited nodes, and counting cycle length `k`.
5. Add `k − 1` to the answer for that cycle.
6. Sum over all cycles.

### Code
$O(nlogn)$ - due to sorting

values would be distinct is an important assumption here . Without that it becomes a much harder problem. Values don't need to be in range of 0 to n-1. We are coordinate compressing [Coordinate Compression](../Coordinate%20Compression.md)


```python
def min_swaps_to_sort(arr):
    n = len(arr)
    # (value, original_index), sorted by value
    indexed = sorted(range(n), key=lambda i: arr[i])
    visited = [False] * n
    swaps = 0

    for i in range(n):
        if visited[i] or indexed[i] == i:
            continue  # already correctly placed / already counted

        cycle_len = 0
        j = i
        while not visited[j]:
            visited[j] = True
            j = indexed[j]
            cycle_len += 1

        swaps += (cycle_len - 1)

    return swaps
```

### Worked Example

```
arr = [4, 3, 2, 1, 0]   (indices 0..4)
```

`indexed = sorted(range(5), key=lambda i: arr[i])` → sorts indices by their value:

- value 0 is at index 4
- value 1 is at index 3
- value 2 is at index 2
- value 3 is at index 1
- value 4 is at index 0

`indexed = [4, 3, 2, 1, 0]`

Trace cycles over `indexed` (this is just `pos` from Section 1/2):

- `0 → indexed[0]=4 → indexed[4]=0` → cycle `(0 4)`, length 2 → 1 swap
- `1 → indexed[1]=3 → indexed[3]=1` → cycle `(1 3)`, length 2 → 1 swap
- `2 → indexed[2]=2` → cycle `(2)`, length 1 → 0 swaps (already correct — middle element never moves)

**Total minimum swaps = 1 + 1 + 0 = 2.**

Sanity check by hand: `[4,3,2,1,0]` → swap(0,4): `[0,3,2,1,4]` → swap(1,3): `[0,1,2,3,4]`. Sorted in 2 swaps. ✔ Matches exactly.

---

## 6. Putting It All Together — The Unifying Thread

|Concept|What it gives you|
|---|---|
|**Disjoint Cycle Theorem**|Any array (as a permutation) breaks uniquely into disjoint cycles — a structural map of "who belongs where."|
|**k-cycle needs k−1 swaps**|Each swap can permanently fix exactly one element and shrink the cycle by one; this is both the _upper bound_ (achievable) and _lower bound_ (necessary) on swaps for that cycle.|
|**Cycle Sort**|An algorithm that _executes_ this proof directly — literally walking each cycle and performing exactly k−1 writes per cycle, achieving the provably minimal number of writes.|
|**Minimum Swaps to Sort problem**|You don't need to simulate swapping at all — just find the cycle decomposition (via the sorted-index mapping) and compute `n − m` (or equivalently `Σ(ki − 1)`). Cycle Sort's write-count and this problem's answer are literally the same number.|

**One-line summary:** Sorting by swapping is fundamentally about resolving cycles in the "displacement permutation" of the array, and the minimum swap count is a direct structural invariant — `n minus the number of cycles` — not something you need to search or simulate for.
