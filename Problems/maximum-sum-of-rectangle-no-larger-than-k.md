---
Title: Max Sum of Rectangle No Larger Than K (Leetcode 363)
Companies:
  - Not Specified
Topics:
  - Matrix
  - Prefix Sum
  - Ordered Containers
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - kth
  - Maximum
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Max Sum of Rectangle No Larger Than K (Leetcode 363)

**Pattern:**   reduce to 1D version

**Idea:** 

**Variations** : 
+ 1D version - [maximum-contiguous-subarray-sum-less_than_or_equal-to-k](maximum-contiguous-subarray-sum-less_than_or_equal-to-k.md)

---

## 💻 Code

Row compression + sorted containers. (Sections below this one only use bisect and column compression)
```Python
from sortedcontainers import SortedList

def maxSumSubarrayNoLargerThanK(arr, k):
    prefix = 0
    best = float("-inf")
    
    # 0 handles subarrays starting from the first element
    prefixes = SortedList([0])

    for num in arr:
        prefix += num
        
        # Look for the smallest prefix_j such that prefix_j >= prefix - k
        idx = prefixes.bisect_left(prefix - k)

        if idx < len(prefixes):
            best = max(best, prefix - prefixes[idx])

        prefixes.add(prefix)

    return best


def maxSumSubmatrix(matrix, k):
    if not matrix or not matrix[0]:
        return 0
        
    rows, cols = len(matrix), len(matrix[0])
    ans = float("-inf")

    # Row-wise compression: fix top and bottom row boundaries
    for top in range(rows):
        temp = [0] * cols

        for bottom in range(top, rows):
            # Compress the current row into the running 1D column array
            for c in range(cols):
                temp[c] += matrix[bottom][c]

            # Solve the 1D problem on the compressed row
            ans = max(ans, maxSumSubarrayNoLargerThanK(temp, k))

    return ans


```
**Time complexity** - O(R<sup>2</sup> . C $\log{C}$) 

**Aux. Space complexity** -  O(C)

---

# Max Sum of Rectangle No Larger Than K (Leetcode 363)

**Tags:** #Matrix #PrefixSum #Kadane #BinarySearch #SortedList #BalancedBST #2D #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given an `R × C` integer matrix and an integer `k`, return the **maximum possible sum of any rectangular submatrix** such that:

Unlike the ordinary maximum sum rectangle, the rectangle **cannot exceed `K`**.

**Example**

|1|0|1|
|---|---|---|
|0|-2|3|

`K = 2`

**Answer:** `2`

The best rectangle is:

|0|1|
|---|---|
|-2|3|

Sum = **2**

---

## Why Kadane Alone Doesn't Work

Kadane finds the **largest** subarray sum, but it ignores the upper bound `K`.

Example:

```text
Array = [2, 2, -1]
K = 3
```

- Kadane → `4`
    
- Correct answer → `3`
    

We need the **largest sum that is still ≤ K**.

---

## Key Idea

Just like **Maximum Sum Rectangle**, fix two column boundaries and compress the matrix into a 1D array of row sums.

The difference is the 1D problem changes from:

> Maximum Subarray Sum

to

> Maximum Subarray Sum ≤ K

So the overall reduction is:

```text
2D Matrix
     │
Fix Left & Right Columns
     │
Compressed Row Sum Array
     │
Maximum Subarray ≤ K
```

---

## The 1D Problem: Maximum Subarray ≤ K

Let the prefix sums be:

For a subarray ending at `i`:

We require:

Rearrange:

So for every current prefix `P[i]`, we need the **smallest previous prefix** that is **greater than or equal to** `P[i]-K`.

This is exactly a **lower_bound / ceiling** query on previous prefix sums.

---

## Intuition (The WHY)

Suppose previous prefix sums are:

```text
[0, 2, 5, 9]
```

Current prefix:

```text
12
```

`K = 8`

Need:

The smallest prefix ≥ 4 is **5**.

Candidate sum:

Any larger prefix gives a smaller sum, and any smaller prefix violates the constraint.

So every step becomes:

1. Compute current prefix
    
2. Find **ceiling(prefix − K)**
    
3. Update answer
    
4. Insert current prefix
    

---

## Optimal Approach — Column Compression + Prefix Sum + Ordered Set

### Algorithm

1. Fix `left` column.
    
2. Compress row sums while expanding `right`.
    
3. Solve the 1D constrained subarray using ordered prefix sums.
    
4. Track the global maximum.
    

### Python Solution

> Python doesn't have a built-in balanced BST. We use `bisect` + `insort` on a sorted list for clarity. In Java, this is `TreeSet.ceiling()`.

```python
from bisect import bisect_left, insort

def maxSumSubarrayNoLargerThanK(arr, k):
    prefix = 0
    best = float("-inf")

    prefixes = [0]

    for num in arr:
        prefix += num

        idx = bisect_left(prefixes, prefix - k)

        if idx < len(prefixes):
            best = max(best, prefix - prefixes[idx])

        insort(prefixes, prefix)

    return best


def maxSumSubmatrix(matrix, k):
    rows, cols = len(matrix), len(matrix[0])
    ans = float("-inf")

    for left in range(cols):
        temp = [0] * rows

        for right in range(left, cols):

            for r in range(rows):
                temp[r] += matrix[r][right]

            ans = max(ans, maxSumSubarrayNoLargerThanK(temp, k))

    return ans
```

---

## Dry Run

Compressed array:

```text
[2, -1, 3]
K = 3
```

Prefix progression:

|Current Prefix|Need ≥|Ceiling|Best Sum|
|--:|--:|--:|--:|
|2|-1|0|2|
|1|-2|0|2|
|4|1|1|**3**|

Answer = **3**

The selected subarray is:

```text
[-1, 3]
```

---

## Why the Ceiling Query Works

We want the **largest valid sum**:

subject to:

Choosing the **smallest prefix that still satisfies**:

maximizes the subtraction while remaining valid.

This is why we search for a **ceiling**, not a floor.

---

## Complexity

Let:

- `R` = rows
    
- `C` = columns
    

|Implementation|Time|Auxiliary Space|
|---|--:|--:|
|Balanced BST / TreeSet|**O(C² × R log R)**|**O(R)**|
|Python `bisect` + list|**O(C² × R²)**|**O(R)**|

> In interviews, state the optimal complexity assuming an ordered set (`TreeSet`, `SortedSet`, or balanced BST).

If `R > C`, transpose the matrix first to obtain:

---

## Relationship with Kadane

|Problem|1D Solver|
|---|---|
|Maximum Sum Rectangle|Kadane|
|Max Rectangle ≤ K|Prefix Sum + Ordered Set|

The 2D reduction is **identical**; only the 1D optimization changes.

---

## Common Mistakes

### 1. Using Kadane directly

Kadane ignores the `≤ K` constraint and may return an invalid rectangle.

### 2. Using Floor Instead of Ceiling

Wrong idea:

Correct:

This is the most common interview mistake.

### 3. Forgetting Initial Prefix `0`

Always begin with:

```python
prefixes = [0]
```

Otherwise, rectangles starting from the first row are missed.

### 4. Claiming the Python Version Is `O(log n)`

`bisect_left()` is `O(log n)`, but `insort()` shifts elements, making insertion `O(n)`.

True `O(log n)` insertion requires a **balanced BST**.

---

## Key Takeaways / Pattern Recognition

- **Maximum Rectangle** → Column Compression + Kadane
    
- **Maximum Rectangle ≤ K** → Column Compression + Prefix Sum + Ordered Set
    
- The reusable interview pattern is:
    

> **Fix 2D boundaries → Reduce to 1D → Replace Kadane with the appropriate prefix-sum algorithm.**

Whenever a problem introduces a **constraint on the subarray sum** (`≤ K`, `≥ K`, closest to K, etc.), Kadane is usually replaced by **Prefix Sum + Binary Search / Ordered Set**.