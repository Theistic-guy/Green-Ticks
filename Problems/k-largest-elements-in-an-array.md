---
Title: K Largest Elements in an Array
Companies:
  - Not Specified
Topics:
  - Heap
  - Arrays
Platform:
  - GFG
Difficulty: Medium
Other Tags:
  - kth
  - Largest
Link: ""
Rating:
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# K Largest Elements in an Array

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
import heapq

def k_largest(arr, k):
    if k < 0 or k > len(arr):
        raise ValueError("k must be between 0 and len(arr)")

    if k == 0:
        return []

    heap = arr[:k]
    heapq.heapify(heap)

    for x in arr[k:]:
        if x > heap[0]:
            heapq.heapreplace(heap, x)

    return heap

```

**Time complexity** - O(n log k) 

**Aux. Space complexity** -  O(k)

---


# K Largest Elements in an Array

Tags: #dsa #arrays #heap #priority-queue #min-heap #max-heap #quickselect #sorting #top-k #selection-algorithms #kth-largest-element #interview-patterns

## 1. Problem Statement

Given an array of $n$ elements and an integer $k$, find the $k$ largest elements.

**Example**

```
Input:  arr = [3, 10, 4, 7, 15, 20], k = 3
Output: [10, 15, 20]
```

The output order may be unspecified unless the problem explicitly requires sorted output.

**Important distinction:** Finding the _k largest elements_ is not the same as finding the _k-th largest element_.

- **K largest elements:** Return all $k$ elements.
    
- **K-th largest element:** Return only the element at rank $k$ when sorted in descending order.
    

The same selection patterns are useful for both problems.

---

## 2. Approach 1: Sorting

### Idea

Sort the array in ascending order and select the last $k$ elements.

```
def k_largest(arr, k):
    if k == 0:
        return []

    arr.sort()
    return arr[-k:]
```

### Why it works

Sorting places every element in its correct relative order. Therefore, the final $k$ elements are the $k$ largest.

### Complexity

- **Time:** $O(n \log n)$
    
- **Auxiliary space:** Depends on the sorting implementation; Python's Timsort uses up to $O(n)$ auxiliary space.
    
- **Output space:** $O(k)$ for the returned slice.
    

### When to use

Use sorting when:

- The entire sorted order is also required.
    
- Simplicity is more important than optimal selection.
    
- $k$ is close to $n$, making a heap-based selection less attractive.
    

---

## 3. Approach 2: Min-Heap of Size K — Best General Approach

### Core intuition

Maintain a **min-heap containing only the $k$ largest elements encountered so far**.

The heap's root is the smallest among these candidates. This element represents the current threshold for admission into the top $k$.

For every incoming element $x$:

1. If the heap contains fewer than $k$ elements, insert $x$.
    
2. Otherwise, compare $x$ with the heap's minimum.
    
3. If $x$ is larger, remove the minimum and insert $x$.
    
4. If $x$ is not larger, discard it.
    

At the end, the heap contains the $k$ largest elements.

### Python implementation

```Python
import heapq

def k_largest(arr, k):
    if k < 0 or k > len(arr):
        raise ValueError("k must be between 0 and len(arr)")

    if k == 0:
        return []

    heap = arr[:k]
    heapq.heapify(heap)

    for x in arr[k:]:
        if x > heap[0]:
            heapq.heapreplace(heap, x)

    return heap
```

The returned elements are **not necessarily sorted**.

To return them in ascending order:

```
return sorted(heap)
```

To return them in descending order:

```
return sorted(heap, reverse=True)
```

### Dry run

```
arr = [3, 10, 4, 7, 15, 20]
k = 3
```

|Incoming element|Heap after processing|Explanation|
|---|---|---|
|Initial `[3, 10, 4]`|`[3, 10, 4]`|Heap contains the first 3 candidates|
|`7`|`[4, 10, 7]`|Replace minimum 3|
|`15`|`[7, 10, 15]`|Replace minimum 4|
|`20`|`[10, 15, 20]`|Replace minimum 7|

The heap contains the three largest values: `10`, `15`, and `20`.

_Heap arrays are shown in a valid min-heap arrangement; their internal order is not necessarily sorted._

### Why it works

After processing any prefix of the array, maintain this invariant:

> The heap contains the largest $\min(k,m)$ elements of the first $m$ processed elements, where $m$ is the prefix length.

- Initially, the heap contains the first $k$ elements.
    
- If fewer than $k$ elements have been processed, every element belongs in the candidate set.
    
- Once the heap is full, its root is the smallest current top-$k$ candidate.
    
- Any incoming element no larger than the root cannot belong to a strictly better top-$k$ set, so it can be discarded.
    
- Any incoming element larger than the root deserves admission and replaces the smallest candidate.
    

Thus, the invariant holds after every step. After all elements are processed, the heap contains the $k$ largest elements.

**Duplicates:** The algorithm returns $k$ elements by position, so duplicate values may appear. For example, `[5, 5, 4]` with `k = 2` should return two elements equal to `5`.

### Complexity

- **Time:** $O(n \log k)$ for $1 \le k \le n$, conventionally treating heap operations as constant-time when $k=1$.
    
- **Auxiliary space:** $O(k)$ for the heap.
    
- **Output space:** $O(k)$ for the returned result.
    

More precisely, heap construction costs $O(k)$, and processing the remaining elements costs $O((n-k)\log k)$ when $k \ge 2$.

### Why a min-heap, not a max-heap?

A min-heap of size $k$ exposes the **smallest retained candidate** in $O(1)$ time. This lets us quickly decide whether a new element deserves a place in the top $k$.

A max-heap would expose the largest retained element, which is not the threshold we need.

**Pattern recognition:** When asked for the _largest $k$ elements_ and $k$ is relatively small, think **min-heap of size $k$**.

---

## 4. Approach 3: Max-Heap of All Elements

### Idea

Insert every array element into a max-heap. Extract the maximum $k$ times.

```
import heapq

def k_largest(arr, k):
    if k < 0 or k > len(arr):
        raise ValueError("k must be between 0 and len(arr)")

    max_heap = [-x for x in arr]
    heapq.heapify(max_heap)

    return [-heapq.heappop(max_heap) for _ in range(k)]
```

Negation simulates a max-heap because Python's `heapq` is a min-heap.

### Complexity

- **Time:** $O(n + k\log n)$
    
- **Auxiliary space:** $O(n)$ for the heap.
    
- **Output space:** $O(k)$.
    

### When to use

Useful when:

- You need to repeatedly extract the largest elements.
    
- You already have a max-heap.
    
- You want the top $k$ elements in descending order without sorting the entire array.
    

For a single query where $k \ll n$, a size-$k$ min-heap is generally more space-efficient.

---

## 5. Approach 4: Quickselect

### Idea

Quickselect partially partitions the array to locate the boundary between the largest $k$ elements and the rest.

Using zero-based indexing, the $k$-th largest element occupies the target index:

$$  
t = n-k  
$$

After partitioning around a pivot:

- If the pivot index is $t$, the boundary has been found.
    
- If the pivot index is greater than $t$, search the left partition.
    
- If the pivot index is less than $t$, search the right partition.
    

Once the element at index $n-k$ is correctly positioned, the elements in `arr[n-k:]` are the $k$ largest elements, although their internal order is unspecified.

```
import random

def k_largest(arr, k):
    if k < 0 or k > len(arr):
        raise ValueError("k must be between 0 and len(arr)")

    if k == 0:
        return []

    target = len(arr) - k
    left, right = 0, len(arr) - 1

    while left <= right:
        pivot = arr[random.randint(left, right)]

        # Three-way partition: < pivot | == pivot | > pivot
        lt, i, gt = left, left, right

        while i <= gt:
            if arr[i] < pivot:
                arr[lt], arr[i] = arr[i], arr[lt]
                lt += 1
                i += 1
            elif arr[i] > pivot:
                arr[i], arr[gt] = arr[gt], arr[i]
                gt -= 1
            else:
                i += 1

        if target < lt:
            right = lt - 1
        elif target > gt:
            left = gt + 1
        else:
            return arr[target:]
```

The three-way partition handles duplicate values efficiently.

### Complexity

- **Expected time:** $O(n)$
    
- **Worst-case time:** $O(n^2)$
    
- **Auxiliary space:** $O(1)$ for the iterative partitioning, excluding implementation-level overhead.
    
- **Output space:** $O(k)$ for the returned slice.
    

The algorithm modifies the input array. Returning a slice creates a new list of $k$ elements.

### When to use

Quickselect is attractive when:

- You want expected linear-time selection.
    
- You do not need the selected elements sorted.
    
- In-place mutation is acceptable.
    

If the selected elements must be sorted, sort only the selected partition, adding up to $O(k\log k)$ time.

---

## 6. Comparison of Approaches

|Approach|Time complexity|Auxiliary space|Best use case|
|---|---|---|---|
|Full sorting|$O(n\log n)$|Up to $O(n)$ for Python sorting|Need sorted order|
|Min-heap of size $k$|$O(n\log k)$|$O(k)$|Small $k$, streaming data|
|Max-heap of size $n$|$O(n+k\log n)$|$O(n)$|Repeated maximum extraction|
|Quickselect|Expected $O(n)$; worst $O(n^2)$|$O(1)$ iterative partition|Fast selection without sorting|

These complexities exclude the space required to return the result, which can be $O(k)$.

---

## 7. K Largest vs. K-th Largest

|Requirement|Recommended approach|
|---|---|
|Return the $k$ largest elements|Min-heap of size $k$|
|Return only the $k$-th largest element|Min-heap of size $k$, then read the root|
|Find top $k$ from a stream|Min-heap of size $k$|
|Select top $k$ in expected linear time|Quickselect|
|Return the top $k$ in sorted order|Min-heap or Quickselect followed by sorting|
|Need the complete sorted array|Full sorting|

For the $k$-th largest element using the min-heap approach, the root is the answer after processing the entire array.

---

## 8. Common Mistakes

1. **Using a max-heap of size $k$ without a reason.** A min-heap makes it easy to evict the smallest retained candidate.
    
2. **Assuming heap output is sorted.** A heap guarantees only the parent-child ordering property, not a fully sorted array.
    
3. **Confusing the $k$-th largest with the $k$ largest.** The former is one value; the latter is a collection.
    
4. **Ignoring duplicates.** Unless the problem explicitly asks for distinct values, count array positions, not unique values.
    
5. **Getting Quickselect's target index wrong.** For zero-based ascending order, the target is `n - k`, not `k - 1`.
    
6. **Claiming Quickselect is always $O(n)$.** Its expected time is linear, but its worst case is quadratic.
    
7. **Ignoring edge cases.** Handle `k = 0`, `k = n`, and invalid values of `k` according to the problem's contract.
    

---

## 9. Interview Takeaway

The key question is not merely whether the array contains large values. It is **how much information must be maintained while searching for them**.

- Sorting maintains the complete order.
    
- A max-heap maintains all elements in heap order.
    
- A size-$k$ min-heap maintains only the current top-$k$ candidates.
    
- Quickselect partitions the array around the desired rank without fully sorting it.
    

For a one-time top-$k$ query, the size-$k$ min-heap is a strong general-purpose solution. When expected linear selection time matters and the elements need not be sorted, consider Quickselect.