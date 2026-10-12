---
Title: Sort a K-Sorted Array (Nearly Sorted Array)
Companies:
  - Not Specified
Topics:
  - Heap
  - Arrays
  - Sorting
  - Greedy
Platform:
  - GFG
Difficulty: Medium
Other Tags:
  - kth
  - Sorted
Link: ""
Rating:
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Sort a K-Sorted Array (Nearly Sorted Array)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
import heapq

def sortKSorted(arr, k):
    n = len(arr)
    heap = arr[:min(n, k + 1)]

    heapq.heapify(heap)

    index = 0

    for i in range(k + 1, n):
        arr[index] = heapq.heappop(heap)
        index += 1
        heapq.heappush(heap, arr[i])

    while heap:
        arr[index] = heapq.heappop(heap)
        index += 1

    return arr

```


| Metric             | Complexity         |
| ------------------ | ------------------ |
| Build initial heap | `O(min(n, k + 1))` |
| Heap operations    | `O(n log(k + 1))`  |
| **Total Time**     | `O(n log(k + 1))`  |
| Auxiliary Space    | `O(min(n, k + 1))` |

---


# Sort a K-Sorted Array (Nearly Sorted Array)

**Tags:** #Heap #PriorityQueue #MinHeap #Arrays #Sorting #Greedy #K-Sorted-Array #Interview-Pattern #FAANG

## Problem Statement

Given an array in which every element is at most `k` positions away from its correct position in the fully sorted array, sort the array efficiently.

Such an array is called a **k-sorted** or **nearly sorted** array.

**Example**

```
Input:  arr = [6, 5, 3, 2, 8, 10, 9], k = 3
Output: [2, 3, 5, 6, 8, 9, 10]
```

The key constraint is that every element is at most `k` positions away from its final sorted position.

---

## Core Insight

In a completely unsorted array, the smallest element could be anywhere.

But in a k-sorted array, the element that belongs at index `i` must occur within the next `k + 1` elements of the current unsorted region.

Therefore:

> **Maintain a min heap of size at most** `**k + 1**`**. Its minimum is the next element in sorted order.**

Instead of sorting the entire array, repeatedly extract the minimum from a small heap.

---

## Why a Heap of Size `k + 1`?

Suppose `k = 3`.

Every element is at most 3 positions away from its correct position.

The element that belongs at index `0` must therefore be among:

```
[6, 5, 3, 2]
```

The smallest element is `2`, so it belongs at index `0`.

After removing it, insert the next element, `8`, to maintain a heap window of size `k + 1`.

Repeat the process to produce the sorted array.

### General Rule

At output index `i`, consider the next `k + 1` unprocessed elements.

The smallest of these belongs at index `i`.

Why? An element whose final position is `i` cannot be more than `k` positions away from its current position, so it must already be within this window.

---

## Approach 1 — Brute Force

Sort the entire array using a comparison-based sorting algorithm.

```
def sortKSorted(arr, k):
    return sorted(arr)
```

**Complexity**

- Time: `O(n log n)`
    
- Auxiliary Space: `O(n)` for Python's `sorted()` result (excluding implementation-dependent sorting workspace).
    

This ignores the useful constraint that the array is nearly sorted.

---

## Approach 2 — Min Heap (Optimal)

### Algorithm

1. Insert the first `min(n, k + 1)` elements into a min heap.
    
2. Repeatedly extract the minimum and write it to the next output position.
    
3. After each extraction, insert the next unprocessed element if one remains.
    
4. Once all input elements have been inserted, drain the heap.
    

### Python Solution

```Python
import heapq

def sortKSorted(arr, k):
    n = len(arr)
    heap = arr[:min(n, k + 1)]

    heapq.heapify(heap)

    index = 0

    for i in range(k + 1, n):
        arr[index] = heapq.heappop(heap)
        index += 1
        heapq.heappush(heap, arr[i])

    while heap:
        arr[index] = heapq.heappop(heap)
        index += 1

    return arr
```

This implementation sorts the array **in place** and returns the same array object.

---

## Dry Run

Input:

```
arr = [6, 5, 3, 2, 8, 10, 9]
k = 3
```

Initialize the heap with the first `k + 1 = 4` elements.

```
Heap elements: [6, 5, 3, 2]
Heap minimum: 2
```

The internal heap representation is not necessarily fully sorted.

|Step|Extracted Minimum|Newly Inserted|Output|
|---|---|---|---|
|1|2|8|`[2]`|
|2|3|10|`[2, 3]`|
|3|5|9|`[2, 3, 5]`|
|4|6|—|`[2, 3, 5, 6]`|
|5|8|—|`[2, 3, 5, 6, 8]`|
|6|9|—|`[2, 3, 5, 6, 8, 9]`|
|7|10|—|`[2, 3, 5, 6, 8, 9, 10]`|

Final answer:

```
[2, 3, 5, 6, 8, 9, 10]
```

---

## Correctness Argument

Maintain the invariant:

**Before writing output position** `**i**`**, the heap contains the next at most** `**k + 1**` **unprocessed elements.**

The element that belongs at position `i` must lie within this window because its displacement from its original position is at most `k`.

Since the heap returns the minimum of the window, extracting its minimum produces the correct next element.

After extraction, adding the next unprocessed element restores the window for the next position.

By induction, every output position is filled correctly, so the final array is sorted.

---

## Complexity

Let `n` be the array length.

| Metric             | Complexity         |
| ------------------ | ------------------ |
| Build initial heap | `O(min(n, k + 1))` |
| Heap operations    | `O(n log(k + 1))`  |
| **Total Time**     | `O(n log(k + 1))`  |
| Auxiliary Space    | `O(min(n, k + 1))` |
|                    |                    |

For `k = 0`, the array is already sorted and the algorithm runs in `O(n)` time because each element is inserted into and extracted from a heap of size one. The general heap-operation bound is conventionally interpreted with a constant lower bound on the logarithm.

The auxiliary-space complexity excludes the input array itself. The heap holds at most `k + 1` elements.

---

## Common Mistakes

### 1. Using a Heap of Size `k`

The correct size is `k + 1`, not `k`.

An element may be displaced by exactly `k` positions, so the candidate window must include `k + 1` positions.

### 2. Draining the Heap Too Early

Do not empty the heap before processing all remaining input elements. Insert the next element after each extraction until the input is exhausted, then drain the heap.

### 3. Assuming the Heap Is Sorted

A heap only guarantees that its minimum is at the root. Its internal array representation is not a sorted sequence.

### 4. Confusing `k` With Array Length

If `k >= n - 1`, the constraint provides no meaningful advantage over ordinary sorting. The heap approach remains correct, but its complexity becomes `O(n log n)`.

---

## Important Variations

### 1. Kth Smallest Element in a Stream

A min heap can retrieve elements in ascending order, while a fixed-size max heap is commonly used to maintain the `k` smallest elements seen so far.

The heap's purpose changes from maintaining a moving candidate window to maintaining a bounded set of candidates.

### 2. Merge K Sorted Lists

This uses the same principle of repeatedly extracting the minimum from a min heap.

However, instead of maintaining `k + 1` nearby elements from one array, the heap contains the current smallest unprocessed element from each sorted list.

---

## Relationship to Other Heap Problems

|Problem|Heap Strategy|
|---|---|
|Sort K-Sorted Array|Min heap of size `k + 1`|
|Kth Largest Element|Bounded min heap|
|Kth Smallest Element|Bounded max heap|
|Merge K Sorted Lists|Min heap with one candidate per list|
|Top K Frequent Elements|Heap ordered by frequency|

The reusable pattern is to maintain **only the candidates necessary to determine the next answer**, rather than sorting or storing everything in a more expensive structure.

---

## Key Takeaways / Pattern Recognition

- A k-sorted array limits how far an element can move from its final position.
    
- Therefore, the next smallest element must be among the next `k + 1` candidates.
    
- A min heap efficiently selects that element.
    
- The resulting time complexity is `O(n log(k + 1))`, with `O(min(n, k + 1))` auxiliary space.
    
- The central interview insight is **bounded uncertainty → bounded heap**.
    

> **Interview heuristic:** Whenever elements are nearly sorted or each next answer must come from a limited candidate window, consider a heap whose size matches that window.