---
Title: Chocolate Distribution Problem
Companies:
  - Not Specified
Topics:
  - Arrays
  - Sorting
  - Sliding Window
  - Greedy
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Chocolate Distribution Problem

**Pattern:**  Sort + sliding window

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def chocolate_distribution(arr, m):
    n = len(arr)

    # If there are fewer packets than students,
    # distributing one packet to each student is impossible.
    if m == 0 or n < m:
        return 0

    # Sorting lets us consider m consecutive packets
    # as every possible optimal candidate.
    arr.sort()

    min_diff = float("inf")

    # Check every window of size m.
    for i in range(n - m + 1):
        # Since the array is sorted:
        # arr[i]     = minimum in the window
        # arr[i+m-1] = maximum in the window
        diff = arr[i + m - 1] - arr[i]

        min_diff = min(min_diff, diff)

    return min_diff

```
**Time complexity** - O(n log n) 

**Aux. Space complexity** -  O(n)

[Why it is not a binary search on answer problem](#why-binary-search-on-answer-fails-on-chocolate-distribution)


---
# Chocolate Distribution Problem

Tags: #Array #Sorting #Sliding-Window #Two-Pointers #Greedy #Min-Max #Optimization #Subarray #FAANG

## Problem Statement

Given `n` packets of chocolates, where `arr[i]` represents the number of chocolates in the $i$-th packet, and `m` students, distribute **exactly one packet to each student** such that the difference between the student receiving the maximum number of chocolates and the student receiving the minimum number of chocolates is minimized.

### Example

```text
arr = [7, 3, 2, 4, 9, 12, 56]
m = 3
```

One optimal selection is:

```text
[2, 3, 4]
```

Difference:

4−2=24 - 2 = 2

Therefore, the minimum possible difference is:

```text
2
```

> **Important:** A packet cannot be split, and each student receives exactly one complete packet.

---

## Key Idea

The crucial observation is:

> After sorting the packets, the `m` packets chosen for an optimal distribution can be represented by a **contiguous window of size `m`**.

So instead of considering every possible subset of `m` packets, we:

1. Sort the array.
    
2. Consider every window of size `m`.
    
3. For each window, calculate:
    

arr[i+m−1]−arr[i]arr[i+m-1] - arr[i]

4. Return the minimum difference.
    

This gives:

O(nlog⁡n)O(n\log n)

time because of sorting, followed by a linear scan.

---

## Intuition (The WHY)

Suppose the sorted packets are:

```text
[2, 3, 4, 7, 9, 12, 56]
```

and:

```text
m = 3
```

Consider a possible selection:

```text
[2, 7, 12]
```

Its range is:

12−2=1012 - 2 = 10

But the elements between `2` and `12` are also available:

```text
[2, 3, 4, 7, 9, 12]
```

Choosing:

```text
[2, 3, 4]
```

gives:

4−2=24 - 2 = 2

The key reason contiguous windows are sufficient is that after sorting, if a chosen set has a gap, replacing an extreme selected element with an element lying inside that gap cannot make the range worse.

So an optimal solution can always be represented by `m` consecutive sorted elements.

### Why only the minimum and maximum matter

For a chosen set:

```text
[x1, x2, ..., xm]
```

the fairness measure is:

max⁡(x)−min⁡(x)\max(x) - \min(x)

The values in between do not directly affect the objective.

Therefore, once sorted, a candidate window is completely characterized by:

```text
first element     → minimum
last element      → maximum
```

---

## Approach

### Step 1 — Sort

```python
arr.sort()
```

Example:

```text
[7, 3, 2, 4, 9, 12, 56]
        ↓
[2, 3, 4, 7, 9, 12, 56]
```

### Step 2 — Examine every window of size `m`

For every starting position `i`:

```text
arr[i : i + m]
```

the range is:

```python
arr[i + m - 1] - arr[i]
```

### Step 3 — Keep the minimum range

Initialize the answer to infinity:

```python
min_diff = float("inf")
```

and update it for every valid window.

---

## Python Solution

```python
def chocolate_distribution(arr, m):
    n = len(arr)

    # If there are fewer packets than students,
    # distributing one packet to each student is impossible.
    if m == 0 or n < m:
        return 0

    # Sorting lets us consider m consecutive packets
    # as every possible optimal candidate.
    arr.sort()

    min_diff = float("inf")

    # Check every window of size m.
    for i in range(n - m + 1):
        # Since the array is sorted:
        # arr[i]     = minimum in the window
        # arr[i+m-1] = maximum in the window
        diff = arr[i + m - 1] - arr[i]

        min_diff = min(min_diff, diff)

    return min_diff
```

---

## Dry Run

Consider:

```text
arr = [7, 3, 2, 4, 9, 12, 56]
m = 3
```

### Sort

```text
[2, 3, 4, 7, 9, 12, 56]
```

Now examine every window of size `3`.

|Window|Difference|
|---|--:|
|`[2, 3, 4]`|$4-2=2$|
|`[3, 4, 7]`|$7-3=4$|
|`[4, 7, 9]`|$9-4=5$|
|`[7, 9, 12]`|$12-7=5$|
|`[9, 12, 56]`|$56-9=47$|

Therefore:

2\boxed{2}

---

## Complexity

Let $n$ be the number of packets.

### Time

Sorting:
$$
O(n\log n)
$$


Sliding/window scan:
$$
O(n)
$$
Total:

$$
\boxed{O(n\log n)}
$$

### Auxiliary Space

If using Python's:

```python
arr.sort()
```

the implementation sorts **in place**, but Python's sorting algorithm may use additional temporary memory.

For interview-level algorithmic analysis, distinguish:

- **Algorithmic extra space excluding the input:** $O(1)$ conceptually for the window scan.
    
- **Python implementation's sorting workspace:** implementation-dependent auxiliary memory.
    

The returned answer is a scalar, so there is **no output array space**.

---

## Important Variations

### 1. Can the array be modified?

If modification is not allowed, work on a copy:

```python
packets = sorted(arr)
```

This makes the additional space:

O(n)O(n)

for the copied/sorted array.

---

### 2. Exactly `m` packets vs at least `m` packets

The classic problem requires:

> **Exactly `m` students, exactly one packet per student.**

Therefore, every candidate must contain exactly `m` packets.

If the problem changes to selecting **at least `m` packets**, the formulation becomes different and the simple fixed-window argument may no longer directly apply.

---

### 3. Maximizing instead of minimizing the difference

If the objective were to **maximize**:

max⁡(x)−min⁡(x)\max(x)-\min(x)

the problem would be different because selecting extreme packets becomes beneficial.

The "minimum range → contiguous sorted window" observation specifically comes from minimizing the spread.

---

## Common Mistakes / Quirks

### Mistake 1 — Not sorting

Trying:

```python
for i in range(n - m + 1):
    diff = arr[i + m - 1] - arr[i]
```

without sorting is incorrect.

The first and last elements of an arbitrary window are not necessarily its minimum and maximum.

Sorting is what makes:

```text
arr[i]       = minimum
arr[i+m-1]   = maximum
```

true.

---

### Mistake 2 — Checking combinations

The brute-force mindset is:

```text
Choose every possible subset of m packets
```

There are:

(nm)\binom{n}{m}

such subsets, which becomes infeasible quickly.

Sorting removes the need to enumerate combinations.

---

### Mistake 3 — Wrong window boundary

For a window of size `m` starting at `i`:

```python
arr[i : i + m]
```

the last index is:

```python
i + m - 1
```

Therefore:

```python
arr[i + m - 1] - arr[i]
```

not:

```python
arr[i + m] - arr[i]  # ❌
```

---

### Mistake 4 — Forgetting impossible cases

If:

```python
m > n
```

there aren't enough packets to give one to each student.

A robust implementation should handle that explicitly.

---

## Pythonic Way

Because the problem is fundamentally a **fixed-size window over a sorted array**, Python's `zip` can make the scan compact:

```python
def chocolate_distribution(arr, m):
    if m == 0 or len(arr) < m:
        return 0

    arr = sorted(arr)

    return min(
        right - left
        for left, right in zip(arr, arr[m - 1:])
    )
```

This is elegant, but for an interview I would generally prefer the explicit `for` loop because:

- the window size is obvious,
    
- the indexing is explicit,
    
- and the connection to the underlying algorithm is clearer.
    

---

## Key Takeaways / Pattern Recognition

The main pattern is:

> **Optimization over exactly `m` elements + minimizing `max - min` → sort + fixed-size sliding window.**

The reusable chain of thought is:

```text
Need m elements
      ↓
Objective depends only on min & max
      ↓
Sort the values
      ↓
Optimal group can be represented by m consecutive values
      ↓
Check every window of size m
      ↓
Minimize arr[i+m-1] - arr[i]
```

### Connection to previous topics

This is another example of **sorting exposing structure**.

Unlike the **Union/Intersection of Sorted Arrays**, where sorting enables a **two-pointer merge**, here sorting enables a **fixed-size sliding window**.

The broader interview pattern is:

> When the objective depends on the **range/spread** of a selected group, sorting often turns a combinatorial selection problem into a **contiguous-window problem**.

### One-line memory hook

> **Chocolate Distribution = Sort → window of `m` → minimize last − first.**

---


##  Why Binary Search on Answer Fails on Chocolate Distribution

## Core Problem

Distribute $m$ chocolate packets to $m$ students to minimize the difference between the maximum and minimum allocated packets.

## The Pitfall: Why BS on Answer Looks Right

The problem asks to minimize a maximum difference within a bounded search space $[0, \text{Max} - \text{Min}]$. This mimics standard BS-on-Answer triggers (e.g., Aggressive Cows).

## Why It Fails

## 1. Unsorted Input Lacks Monotonicity

Without sorting, a `check(mid)` function cannot deterministically validate if a subset exists with a difference $\le \text{mid}$ without checking combinations ($O(n^2)$ or worse).

## 2. Sorted Input Makes BS Redundant

Sorting forces the optimal $m$ elements to be contiguous, enabling a Sliding Window approach.

The `check(mid)` function would require a sliding window scan ($O(n)$) to calculate subset differences. However, the very first sliding window scan _already_ finds the exact minimum difference.

Wrapping it in Binary Search recalculates known values needlessly.

## Efficiency Comparison

- BS on Answer: $\text{Sort } O(n \log n) + \text{BS Loop } O(n \log(\text{Range})) \rightarrow$ Suboptimal
- Sliding Window: $\text{Sort } O(n \log n) + \text{Single Scan } O(n) \rightarrow$ Optimal ($O(n \log n)$ total)

## Anti-Pattern Rule

> Do not use Binary Search on Answer if the verification function (`check`) requires a scan that inherently reveals the absolute optimal answer on its first pass.