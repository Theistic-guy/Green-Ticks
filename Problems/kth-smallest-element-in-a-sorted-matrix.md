---
Title: Kth Smallest Element in a Sorted Matrix
Companies:
  - Amazon
  - Google
Topics:
  - Heap
  - Matrix
  - Searching
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - kth
  - Binary Search
  - Sorted
  - Smallest
  - Predicate Search - Counting
Link: ""
---

# Kth Smallest Element in a Sorted Matrix

**Pattern:**  Heap (k-way) or binary search on answer

**Idea:** 

**Variations** : 
+ [K-way Merge](../Notes/K-way%20Merge.md)
+ Also part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
  
---

## 💻 Code

📌**Note to self** : I have included the k-way heap solution but the binary search approach (approach -2 below) is generally more famous (staircase traversal from bottom left).

```Python
import heapq

def kthSmallest(matrix, k):
    n = len(matrix)

    heap = []

    # First element of every row
    for r in range(min(n, k)):
        heapq.heappush(heap, (matrix[r][0], r, 0))

    for _ in range(k):
        value, r, c = heapq.heappop(heap)

        if c + 1 < n:
            heapq.heappush(
                heap,
                (matrix[r][c + 1], r, c + 1)
            )

    return value

```
**Time complexity** - O($k\space log(n)$) 
**Aux. Space complexity** -  O(n), at most each element from one row is in the heap

---


> **Important Binary Search Pattern:** **Binary Search on the Answer**
> 
> This problem is valuable because binary search is no longer searching for an **index**. We search the **range of possible answers (values)**.

---

# Problem

Given an `n × n` matrix where:

- Every row is sorted in ascending order.
    
- Every column is sorted in ascending order.
    

Find the **k-th smallest element**.

Example:

```text
matrix = [
    [1,  5,  9],
    [10, 11, 13],
    [12, 13, 15]
]

k = 8
```

Conceptually sorted:

```text
[1, 5, 9, 10, 11, 12, 13, 13, 15]
                      ↑
                    8th = 13
```

---

# Approach 1 — Min Heap ⭐⭐⭐⭐

## Idea

Treat every row as a sorted stream.

Initially put the first element of every row into a min heap:

```text
Heap:

1
10
12
```

Pop the smallest element.

Whenever we pop an element from row `r`, insert the **next element from that same row**.

This is essentially a **k-way merge**.

### Example

```text
Rows:

[1,  5,  9]
[10, 11, 13]
[12, 13, 15]
```

Initially:

```text
Heap = [1, 10, 12]
```

Pop `1`:

```text
answer #1 = 1
push 5

Heap = [5, 10, 12]
```

Pop `5`:

```text
answer #2 = 5
push 9
```

Continue until the `k`-th element is popped.

---

## Code

```python
import heapq

def kthSmallest(matrix, k):
    n = len(matrix)

    heap = []

    # First element of every row
    for r in range(min(n, k)):
        heapq.heappush(heap, (matrix[r][0], r, 0))

    for _ in range(k):
        value, r, c = heapq.heappop(heap)

        if c + 1 < n:
            heapq.heappush(
                heap,
                (matrix[r][c + 1], r, c + 1)
            )

    return value
```

### Complexity

For an `n × n` matrix:

```text
Time  = O(k log n)
Space = O(n)
```

because the heap contains at most one active element from each row.

---

# Approach 2 — Binary Search on the Answer ⭐⭐⭐⭐⭐

This is the more interesting approach.

Instead of asking:

> "Which index contains the k-th element?"

we ask:

> **"What value could be the k-th element?"**

The answer must lie between:

```text
low  = matrix[0][0]
high = matrix[n-1][n-1]
```

So we binary-search this **value range**.

---

# The Feasibility Question

Pick a candidate value:

```text
mid
```

Ask:

> **How many elements in the matrix are `<= mid`?**

If:

```text
count < k
```

then there aren't enough elements ≤ `mid`.

Therefore:

```text
answer > mid
```

Move right:

```python
low = mid + 1
```

If:

```text
count >= k
```

then `mid` could be the answer.

Move left:

```python
high = mid
```

---

# How Do We Count `<= mid` Efficiently?

This is where the matrix's **row + column sorted property** matters.

Start at the **bottom-left**:

```text
[1,  5,  9]
[10, 11, 13]
[12, 13, 15]
 ↑
start
```

Suppose:

```text
mid = 13
```

At `12`:

```text
12 <= 13
```

Because the row is sorted, everything to its **left** is also `<= 13`.

So we can count the entire row portion at once.

Move:

```text
right
```

If the current element is too large:

```text
15 > 13
```

everything above it in that column is also `> 13`.

So move:

```text
up
```

This gives an `O(n)` counting operation.

---

# Visual

For:

```text
[
 [1,  5,  9],
 [10, 11, 13],
 [12, 13, 15]
]
```

and:

```text
mid = 13
```

Start:

```text
[1,  5,  9]
[10, 11, 13]
[12, 13, 15]
 ↑
```

`12 <= 13`

Count:

```text
12, 13
```

Move right.

Now:

```text
15 > 13
```

Move up.

Eventually count all values:

```text
<= 13
```

which is:

```text
8
```

Since:

```text
8 >= k
```

the answer can be `13` or smaller.

---

# Complete Code

```python
def kthSmallest(matrix, k):
    n = len(matrix)

    low = matrix[0][0]
    high = matrix[-1][-1]

    while low < high:
        mid = (low + high) // 2

        count = 0
        row = n - 1
        col = 0

        # Count elements <= mid
        while row >= 0 and col < n:

            if matrix[row][col] <= mid:
                # Everything above this position
                # in this column is also <= mid.
                count += row + 1
                col += 1
            else:
                row -= 1

        if count < k:
            low = mid + 1
        else:
            high = mid

    return low
```

---

# Complexity

The value range is searched using binary search.

For each `mid`, counting takes:

```text
O(n)
```

The number of binary-search iterations is:

```text
O(log(max_value - min_value))
```

Therefore:

```text
Time = O(n log(max_value - min_value))
```

Auxiliary space:

```text
O(1)
```

---

# Heap vs Binary Search

||Min Heap|Binary Search on Answer|
|---|--:|--:|
|Main idea|K-way merge|Search value range|
|Time|`O(k log n)`|`O(n log(value range))`|
|Space|`O(n)`|`O(1)`|
|Uses sorted rows|✅|✅|
|Uses sorted columns|Not necessary|✅|
|Main interview pattern|Heap / merge|**Binary Search on Answer**|

---

# The Important Learning

This problem is much more valuable than just "k-th smallest in a matrix."

There are **two completely different ways to think about it**:

### Heap perspective

> "The matrix consists of sorted streams. Merge them until I reach `k`."

```text
Sorted rows
    ↓
K-way merge
    ↓
Min Heap
```

### Binary Search perspective

> "I don't need to find the element directly. I can ask whether a candidate value has at least `k` elements ≤ it."

```text
Possible answer range
        ↓
Choose value mid
        ↓
Count elements <= mid
        ↓
Enough?
 ↙             ↘
YES             NO
 ↓               ↓
go left        go right
```

This is the **Binary Search on Answer** pattern:

> **Don't necessarily binary-search the location of the answer. Binary-search the space of possible answers, provided you can efficiently test whether a candidate is feasible.**

This perspective will reappear in problems such as **Kth Smallest Pair Distance, Capacity to Ship Packages, Split Array Largest Sum, and many allocation/optimization problems.**