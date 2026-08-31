---
Title: Median in a Row-wise Sorted Matrix
Companies:
  - Not Specified
Topics:
  - Matrix
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - GFG
  - Sorted
  - Median
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Median in a Row-wise Sorted Matrix

**Pattern:**  binary search on answer + counting in individual row

**Idea:** 

**Variations** : 
+ part of [Matrices Everywhere !!!](../Notes/Matrices%20Everywhere%20!!!.md)


---

## 💻 Code

```Python
from bisect import bisect_right

def matrixMedian(matrix):
    rows = len(matrix)
    cols = len(matrix[0])

    # Smallest and largest values in the matrix.
    low = min(row[0] for row in matrix)
    high = max(row[-1] for row in matrix)

    required = (rows * cols) // 2

    while low < high:
        mid = (low + high) // 2

        # Count elements <= mid.
        count = 0
        for row in matrix:
            count += bisect_right(row, mid)

        # First value whose count exceeds required.
        if count > required:
            high = mid
        else:
            low = mid + 1

    return low
```
**Time complexity** - O($O(R \log C \cdot \log (max-min)$)

**Aux. Space complexity** -  O(1)

---
# Median in a Row-wise Sorted Matrix

**Tags:** #Matrix #Binary-Search #Binary-Search-on-Answer #Upper-Bound #Row-wise-Sorted #Median #Counting #LC-like #FAANG

## Problem Statement

Given an `R × C` matrix where **each row is individually sorted** (but columns are not necessarily sorted), find the **median** of the matrix.

**Assumptions (FAANG / GFG version):**

- `R` and `C` are odd, so the total number of elements is odd.
    
- Rows are sorted in non-decreasing order.
    
- Extra space should ideally be `O(1)`.
    

### Example

```text
matrix =
[
    [1, 3, 5],
    [2, 6, 9],
    [3, 6, 9]
]
```

Flattened (conceptually):

```text
[1, 2, 3, 3, 5, 6, 6, 9, 9]
```

Median = **5**

> **Important:** The matrix is **not globally sorted**. Only each row is sorted.

---

# Key Idea

The obvious solution is to flatten and sort everything.

The optimal solution exploits two facts:

1. Each row is already sorted.
    
2. The median is the **middle value**, not the middle position in memory.
    

Instead of searching indices, we **binary search the value itself**.

This is a classic **Binary Search on Answer** problem.

---

# Approach 1 — Flatten and Sort (Baseline)

## Intuition

Convert the matrix into a single array, sort it, and return the middle element.

Although not optimal, this establishes what "median" means.

### Python Solution

```python
def median(matrix):
    arr = []

    for row in matrix:
        arr.extend(row)

    arr.sort()

    return arr[len(arr) // 2]
```

### Complexity

**Time Complexity**

- Flatten: $O(RC)$
    
- Sort: $O(RC \log(RC))$
    

Overall:

O(RClog⁡(RC))O(RC \log(RC))

**Auxiliary Space**

O(RC)O(RC)

**Output Space**

None (returns one integer).

---

# Approach 2 — Binary Search on Answer (Optimal)

## The Big Insight

We are **not** binary searching an index.

We are binary searching the **value** that could be the median.

Suppose the smallest value in the matrix is `1` and the largest is `9`.

The answer must lie in:

[1, 9][1,\ 9]

Instead of asking:

> "Where is the median?"

we ask:

> "Could `mid = 5` be the median?"

This is exactly the **Binary Search on Answer** pattern.

---

## Step 1 — Define the Answer Space

Since every row is sorted:

- Minimum possible value = first element of every row
    
- Maximum possible value = last element of every row
    

Example:

```text
[
 [1, 3, 5],
 [2, 6, 9],
 [3, 6, 9]
]
```

Search space:

```text
low  = 1
high = 9
```

Notice that this is **value space**, not index space.

---

## Step 2 — Build the Feasibility Function

For any candidate value `mid`, count:

> **How many elements are `≤ mid`?**

Example:

```text
mid = 5
```

Count row by row:

|Row|Elements ≤ 5|Count|
|---|---|--:|
|`[1,3,5]`|1,3,5|3|
|`[2,6,9]`|2|1|
|`[3,6,9]`|3|1|

Total:

3+1+1=53 + 1 + 1 = 5

There are 9 elements.

The median should have exactly **4 elements before it**.

So if 5 elements are already `≤ 5`, then `5` is large enough to be the median.

---

## Step 3 — Why Is This Monotonic?

Define:

f(x)=count of elements ≤xf(x)=\text{count of elements } \le x

As `x` increases:

```text
1 → 2 → 3 → 4 → 5 → 6
```

the count never decreases.

Example:

|Candidate|Count ≤ Candidate|
|---|--:|
|3|4|
|4|4|
|5|5|
|6|7|

This is a **monotonic non-decreasing function**.

Therefore, binary search applies.

We are searching for the **first value** satisfying:

count>RC2\text{count} > \frac{RC}{2}

This is the **implicit-answer (first True)** binary search pattern.

---

## Why Use Upper Bound?

Within each sorted row we need:

> Number of elements `≤ mid`

That is exactly what **upper bound** returns.

Example:

```text
row = [1,3,5,7]
mid = 5
```

Upper bound points to:

```text
7
^
index = 3
```

So:

```text
count = 3
```

because indices `0,1,2` are `≤ 5`.

Python provides this through `bisect_right()`.

---

## Python Solution

```python
from bisect import bisect_right

def matrixMedian(matrix):
    rows = len(matrix)
    cols = len(matrix[0])

    # Smallest and largest values in the matrix.
    low = min(row[0] for row in matrix)
    high = max(row[-1] for row in matrix)

    required = (rows * cols) // 2

    while low < high:
        mid = (low + high) // 2

        # Count elements <= mid.
        count = 0
        for row in matrix:
            count += bisect_right(row, mid)

        # First value whose count exceeds required.
        if count > required:
            high = mid
        else:
            low = mid + 1

    return low
```

---

## Dry Run

```text
matrix =
[
 [1,3,5],
 [2,6,9],
 [3,6,9]
]
```

Total elements:

99

Required elements before median:

9//2=49//2=4

### Iteration 1

```text
low = 1
high = 9
mid = 5
```

Count:

```text
Row1 → 3
Row2 → 1
Row3 → 1

Total = 5
```

Since:

5>45 > 4

the median is **≤ 5**.

```text
high = 5
```

---

### Iteration 2

```text
low = 1
high = 5
mid = 3
```

Count:

```text
3 + 1 + 1 = 5?
```

Actually:

```text
[1,3,5] → 2
[2,6,9] → 1
[3,6,9] → 1

Total = 4
```

Now:

4≤44 \le 4

Too few elements.

Move right.

```text
low = 4
```

---

### Iteration 3

```text
low = 4
high = 5
mid = 4
```

Count:

```text
2 + 1 + 1 = 4
```

Again:

4≤44 \le 4

Move right.

```text
low = 5
```

Now:

```text
low == high == 5
```

Answer:

```text
5
```

---

# Why `count > required`?

This is the most important interview detail.

Suppose there are:

99

elements.

Median position:

```text
0 1 2 3 [4] 5 6 7 8
```

The median is the **5th smallest**.

We need the **first value** such that more than 4 elements are `≤` it.

Hence:

count>RC2\boxed{\text{count} > \frac{RC}{2}}

Not `>=`.

### Example

Flattened:

```text
[1,2,3,4,5,6,7,8,9]
```

For candidate `4`:

```text
count = 4
```

Not enough.

For candidate `5`:

```text
count = 5
```

This is the first valid value.

---

# Complexity Comparison

| Approach                | Time                       | Auxiliary Space | Output Space |
| ----------------------- | -------------------------- | --------------- | ------------ |
| Flatten + Sort          | $O(RC \log(RC))$           | $O(RC)$         | $O(1)$       |
| Binary Search on Answer | $O(R \log C \cdot \log V)$ | $O(1)$          | $O(1)$       |
|                         |                            |                 |              |

Where:

- $R$ = rows
    
- $C$ = columns
    
- $V$ = value range (`maxValue - minValue`)
    

### Why $O(R \log C \cdot \log V)$?

Each binary search iteration:

- Visit every row → $R$
    
- Upper bound in one row → $\log C$
    

So counting costs:

O(Rlog⁡C)O(R \log C)

The value binary search performs about:

O(log⁡V)O(\log V)

iterations.

Therefore:

O(Rlog⁡C⋅log⁡V)O(R \log C \cdot \log V)

---

# Important Variations

## 1. Matrix Is Completely Sorted

If the matrix itself is globally sorted:

```text
1 2 3
4 5 6
7 8 9
```

Then no binary search is needed.

Median is simply:

```text
matrix[(R*C)//C][...]
```

or by direct index arithmetic.

The row-wise sorted problem is harder precisely because rows are sorted **independently**.

---

## 2. Even Number of Elements

Some interview variants use an even-sized matrix.

Then clarify whether they want:

- Lower median
    
- Upper median
    
- Average of the two
    

The GFG version avoids this ambiguity by guaranteeing an odd total number of elements.

---

# Common Mistakes

## Mistake 1 — Binary searching indices

Wrong mindset:

```text
Find middle row
Find middle column
```

Rows are independently sorted, so the median has **no fixed position**.

Binary search must happen on **values**, not coordinates.

---

## Mistake 2 — Using `bisect_left`

We need:

> Number of elements `≤ mid`

Use:

```python
bisect_right(row, mid)
```

`bisect_left` gives the count of elements `< mid`, which changes the feasibility condition.

---

## Mistake 3 — Using `count >= required`

For 9 elements:

```text
required = 4
```

If:

```text
count = 4
```

the candidate is still too small.

Correct condition:

```python
if count > required:
    high = mid
else:
    low = mid + 1
```

This finds the **first True** value.

---

## Mistake 4 — Searching Between 0 and 10⁹

The answer space should be tightened.

Instead of:

```python
low = 0
high = 10**9
```

use:

```python
low = min(row[0] for row in matrix)
high = max(row[-1] for row in matrix)
```

This reduces unnecessary iterations.

---

# Pythonic Notes

Python's `bisect_right` is exactly the upper-bound operation:

```python
from bisect import bisect_right

count = bisect_right(row, mid)
```

Think of it as:

> **Insertion position after the last occurrence of `mid`**

which is equivalent to:

> **Number of elements `≤ mid`**

This is much cleaner than implementing upper bound manually.

---

# Key Takeaways / Pattern Recognition

## Recognizing the Pattern

When you see:

- Matrix rows are sorted
    
- Need median / kth smallest
    
- Can't flatten efficiently
    

Think:

```text
Answer = VALUE
        ↓
Binary Search on Answer
        ↓
Count elements ≤ mid
        ↓
Upper Bound in each row
```

## Reusable Template

```text
Search Space:
[minValue ... maxValue]

Predicate:
count(≤ mid)

Monotonic?
Yes

Binary Search Type:
First True (implicit answer)
```

This exact pattern also appears in:

- Kth Smallest in a Sorted Matrix (variation)
    
- Aggressive Cows (different predicate)
    
- Allocate Books
    
- Painter's Partition
    

The only thing that changes is **how the feasibility function is computed**.

> **Memory Hook:** _Median in Row-wise Sorted Matrix = Binary Search on Value + Upper Bound per Row._