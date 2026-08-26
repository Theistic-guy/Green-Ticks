---
Title: Find K Pairs With Smallest Sums
Companies:
  - Not Specified
Topics:
  - Heap
  - Two Pointers
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Smallest
  - kth
  - Pairs
  - Sorted
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Find K Pairs With Smallest Sums

**Pattern:**  Heap (K-way technique)

**Idea:** 

**Variations** : 
+ [K-way Merge](../Notes/K-way%20Merge.md)
---

## 💻 Code

```Python
import heapq


def k_smallest_pairs(nums1, nums2, k):

    if not nums1 or not nums2 or k <= 0:
        return []

    heap = []

    # Start with the first element of nums2
    for i in range(min(k, len(nums1))):
        heapq.heappush(heap, (nums1[i] + nums2[0], i, 0))

    result = []

    while heap and len(result) < k:

        total, i, j = heapq.heappop(heap)

        result.append((nums1[i], nums2[j]))

        # Move right in the same row
        if j + 1 < len(nums2):
            heapq.heappush(
                heap,
                (nums1[i] + nums2[j + 1], i, j + 1)
            )

    return result

```
**Time complexity** - O(klog(min(k,m)))
**Aux. Space complexity** -  O(min(k,m))

---


A classic **Heap / Priority Queue** problem, commonly represented by **LeetCode 373 — Find K Pairs with Smallest Sums**.

Given two sorted arrays, find the `k` pairs `(u, v)` with the smallest values of:

$$  
u+v  
$$

---

## Problem

Given:

```text
nums1 = [1, 7, 11]
nums2 = [2, 4, 6]

k = 3
```

Possible pairs:

```text
(1,2) → 3
(1,4) → 5
(1,6) → 7
(7,2) → 9
(7,4) → 11
...
```

The 3 smallest pairs are:

```text
(1,2)
(1,4)
(1,6)
```

---

# Key Observation

Because both arrays are sorted, imagine their pair sums as a matrix:

```text
          nums2
        2    4    6
     +----+----+----+
  1  |  3 |  5 |  7 |
     +----+----+----+
  7  |  9 | 11 | 13 |
     +----+----+----+
 11  | 13 | 15 | 17 |
     +----+----+----+
```

Notice that every row is sorted.

Also, every column is sorted.

We don't need to generate all pairs.

Instead, we can use a **min-heap** to repeatedly extract the smallest currently available pair.

---

# Heap Intuition

Initially, consider the first element of `nums2` paired with each element of `nums1`:

```text
(1,2) → 3
(7,2) → 9
(11,2) → 13
```

Put these into a min-heap.

The smallest is:

```text
(1,2)
```

After taking `(1,2)`, the next candidate from the same row is:

```text
(1,4)
```

So we push it into the heap.

Now the heap contains candidates such as:

```text
(1,4) → 5
(7,2) → 9
(11,2) → 13
```

Again, extract the smallest.

This continues until we have `k` pairs.

---

# Python Solution

```python
import heapq


def k_smallest_pairs(nums1, nums2, k):

    if not nums1 or not nums2 or k <= 0:
        return []

    heap = []

    # Start with the first element of nums2
    for i in range(min(k, len(nums1))):
        heapq.heappush(heap, (nums1[i] + nums2[0], i, 0))

    result = []

    while heap and len(result) < k:

        total, i, j = heapq.heappop(heap)

        result.append((nums1[i], nums2[j]))

        # Move right in the same row
        if j + 1 < len(nums2):
            heapq.heappush(
                heap,
                (nums1[i] + nums2[j + 1], i, j + 1)
            )

    return result
```

---

# Why Do We Start With Only `nums2[0]`?

For every `nums1[i]`, its row looks like:

```text
nums1[i] + nums2[0]
nums1[i] + nums2[1]
nums1[i] + nums2[2]
...
```

Since `nums2` is sorted:

$$  
nums2[0] \le nums2[1] \le nums2[2] \le \cdots  
$$

therefore:

$$  
nums1[i]+nums2[0]  
\le  
nums1[i]+nums2[1]  
\le  
nums1[i]+nums2[2]  
$$

So the first pair in each row is the **smallest possible pair in that row**.

We only need to initially expose those row-minimum candidates.

Once one is removed, we expose the next element from that row.

This is exactly what the heap is managing.

---

# Dry Run

```text
nums1 = [1, 7, 11]
nums2 = [2, 4, 6]
k = 3
```

Initial heap:

```text
(1,2) → 3
(7,2) → 9
(11,2) → 13
```

### Pop 1

```text
(1,2)
```

Add next pair from the same row:

```text
(1,4) → 5
```

Heap:

```text
(1,4) → 5
(7,2) → 9
(11,2) → 13
```

### Pop 2

```text
(1,4)
```

Add:

```text
(1,6) → 7
```

### Pop 3

```text
(1,6)
```

Result:

```text
[(1,2), (1,4), (1,6)]
```

---

# Why Not Generate All Pairs?

There are:

$$  
m\times n  
$$

possible pairs.

For:

```text
m = 10,000
n = 10,000
```

there are:

$$  
100,000,000  
$$

pairs.

Generating all of them is unnecessary when we only need the smallest `k`.

---

# Brute Force Approach

Generate every pair:

```python
def k_smallest_pairs(nums1, nums2, k):

    pairs = []

    for x in nums1:
        for y in nums2:
            pairs.append((x + y, x, y))

    pairs.sort()

    return [(x, y) for _, x, y in pairs[:k]]
```

Complexity:

- Number of pairs: **$O(mn)$**
    
- Sorting: **$O(mn\log(mn))$**
    
- Auxiliary Space: **$O(mn)$**
    

Clearly undesirable.

---

# Heap Approach Complexity

Let:

$$  
m=|nums1|,\qquad n=|nums2|  
$$

We initially put at most:

$$  
\min(k,m)  
$$

elements into the heap.

Then we perform at most `k` pops and pushes.

Each heap operation costs:

$$  
O(\log(\min(k,m)))  
$$

Therefore:

$$  
\boxed{  
O(\min(k,m)+k\log(\min(k,m)))  
}  
$$

Usually simplified to:

$$  
\boxed{  
O(k\log(\min(k,m)))  
}  
$$

when discussing the dominant term.

Auxiliary space:

$$  
\boxed{  
O(\min(k,m))  
}  
$$

excluding the output.

---

# Important Optimization

Notice:

```python
for i in range(min(k, len(nums1))):
```

rather than:

```python
for i in range(len(nums1)):
```

Why?

If:

```text
k = 3
```

we can never need more than 3 initial candidates.

So initializing the entire `nums1` is unnecessary.

This keeps the heap size bounded by:

$$  
\min(k,m)  
$$

---

# Why Does the Heap Always Give the Correct Next Pair?

Think of every `nums1[i]` as a sorted row:

```text
Row 0:  3   5   7   ...
Row 1:  9  11  13   ...
Row 2: 13  15  17   ...
```

The heap contains the **smallest unprocessed element from each active row**.

Therefore, the smallest element in the heap must be the globally smallest unprocessed pair.

After removing it, we advance only that row by one position.

This is the same fundamental pattern as:

> **Merge K Sorted Lists**

---

# Alternative Perspective: K-Way Merge

This problem can be understood as merging sorted sequences.

Each row is sorted:

```text
nums1[0] + nums2 → sorted row
nums1[1] + nums2 → sorted row
nums1[2] + nums2 → sorted row
...
```

We want the first `k` elements of the conceptual merge.

Therefore:

```text
K-Way Merge
      ↓
Min Heap
```

This connection is extremely useful in interviews.

---

# Important Practical Variations

These are the variations actually worth knowing rather than inventing arbitrary modifications.

## 1. K Smallest Pairs

The standard problem.

**Technique:**

$$  
\boxed{\text{Min Heap}}  
$$

---

## 2. Kth Smallest Pair Sum

Instead of returning the first `k` pairs, return only the **kth smallest sum**.

This can be approached with:

- Min-heap enumeration when `k` is relatively small.
    
- **Binary Search on the answer** when the arrays are large and only the kth sum is needed.
    

The second approach is particularly important conceptually.

---

## 3. K Pairs With Largest Sums

Reverse the ordering.

Instead of a min-heap, use a **max-heap**.

Because Python's `heapq` is a min-heap, you can negate the sum:

```python
heapq.heappush(heap, (-(nums1[i] + nums2[j]), i, j))
```

The same sorted-row idea applies.

---

## 4. Kth Smallest Pair Distance

This is a different but very important FAANG-style problem.

Given an array, find the kth smallest:

$$  
|a-b|  
$$

It looks superficially similar, but the optimal solution is generally based on:

```text
Binary Search on the answer
+
Counting pairs with distance <= mid
```

rather than directly using the heap technique.

This is a good example of why **recognizing the structure of the problem** matters more than memorizing "k smallest → heap."

---

# Common Interview Mistakes

### Mistake 1: Generating all pairs

This defeats the purpose of the problem.

Think:

```text
Sorted arrays
+
Need only k smallest
        ↓
Min Heap
```

---

### Mistake 2: Putting every pair into the heap

That still creates:

$$  
O(mn)  
$$

heap entries.

Only expose the **next candidate from each row**.

---

### Mistake 3: Forgetting that the arrays are sorted

The entire optimization depends on:

$$  
nums2[j] \le nums2[j+1]  
$$

If the arrays aren't sorted, this approach doesn't directly work.

---

### Mistake 4: Forgetting duplicate pairs

If duplicate values exist, different index pairs may produce identical value pairs.

The standard problem treats these as separate pairs because they come from different indices.

---

# Pythonic / Practical Note

There isn't a built-in Python function that directly solves this problem.

`heapq` is the appropriate standard-library tool:

```python
import heapq
```

The important thing to know for interviews is the **heap state**:

```text
(sum, i, j)
```

where:

- `sum` → pair sum used for ordering
    
- `i` → index in `nums1`
    
- `j` → index in `nums2`
    

---

# Pattern Recognition

When you see:

```text
Two sorted arrays
+
Need K smallest combinations/pairs
```

immediately consider:

$$  
\boxed{\text{Min Heap + K-way merge}}  
$$

When you see:

```text
Need kth smallest value
+
Can efficiently count how many values <= X
```

consider:

$$  
\boxed{\text{Binary Search on Answer}}  
$$

This distinction is more important than memorizing individual problems.

---

# Key Takeaways

### Core Idea

Treat the pair sums as a sorted matrix:

```text
        B
      b0 b1 b2 b3
A a0   3  5  7  9
  a1   9 11 13 15
  a2  13 15 17 19
```

Each row is sorted.

Maintain the smallest unprocessed element from each row in a **min-heap**.

```text
Pop smallest
     ↓
Add pair to result
     ↓
Move one step right in that row
     ↓
Push new candidate
```

### Complexity

$$  
\boxed{  
O(k\log(\min(k,m)))  
}  
$$

time, approximately, with

$$  
\boxed{  
O(\min(k,m))  
}  
$$

auxiliary space excluding the output.

> **Interview Tip:** The key mental connection is **"sorted rows + need only the first k elements" → K-way merge → min-heap**. You are not searching all `m × n` pairs; you're lazily generating only the candidates that could possibly become one of the next smallest pairs.