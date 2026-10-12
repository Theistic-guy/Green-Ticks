---
Title: K Closest Elements (leetcode 658)
Companies: [Yandex, Coupang, Bloomberg, Cashfree, DoorDash, Capgemini, Meta, Apple, Amazon, LinkedIn, Flipkart, DE Shaw, Google, Nvidia, Microsoft, Atlassian, Salesforce, TikTok, Uber]
Topics:
  - Heap
  - Arrays
  - Sorting
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - kth
Link: ""
Rating:
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# K Closest Elements

**Pattern:** 

**Idea:** 

**Variations** : 
- [k-largest-elements-in-an-array](k-largest-elements-in-an-array.md)

---

## 💻 Code

```Python
import heapq

def find_closest_elements(arr, k, x):
    heap = []

    for a in arr:
        item = (-abs(a - x), -a)
        heapq.heappush(heap, item)

        if len(heap) > k:
            heapq.heappop(heap)

    return sorted(-a for _, a in heap)

```

Time: $O(n\log k + k\log k)$
    
- **Auxiliary space:** $O(k)$ for the heap.
    
- **Output space:** $O(k)$.

---


# K Closest Elements

Tags: #dsa #arrays #binary-search #two-pointers #heap #priority-queue #sorting #top-k #selection-algorithms #sliding-window #leetcode #interview-patterns

## 1. Problem Statement

Given a sorted integer array `arr`, an integer `k`, and a target value `x`, find the `k` elements closest to `x`.

For LeetCode 658, closeness is determined by:

1. Smaller absolute difference from `x` is better.
    
2. If two elements have equal distance, the smaller element is preferred.
    
3. Return the result in ascending order.
    

**Example**

```
Input:  arr = [1, 2, 3, 4, 5]
        k = 4, x = 3

Output: [1, 2, 3, 4]
```

The elements `2`, `3`, and `4` are closest to `3`. The fourth element is selected by the tie-breaking rule: `2` and `4` are equally distant from `3`, but `2` is preferred over `4`.

**Important:** This problem assumes a sorted array for the binary-search approaches below.

---

## 2. Approach 1: Sorting by Distance

### Idea

Sort elements by the pair:

$$  
\bigl(|a-x|,\ a\bigr)  
$$

The first component prioritizes distance; the second resolves ties in favor of smaller elements. Take the first `k` elements, then sort those elements in ascending order.

```
def find_closest_elements(arr, k, x):
    closest = sorted(arr, key=lambda a: (abs(a - x), a))[:k]
    return sorted(closest)
```

### Complexity

- **Time:** $O(n\log n + k\log k)$
    
- **Auxiliary space:** Up to $O(n)$ for sorting and the intermediate list, depending on implementation.
    
- **Output space:** $O(k)$.
    

### When to use

Useful as a simple baseline or when the array is not sorted. However, it does not exploit the sorted structure and is not optimal for a large array.

---

## 3. Approach 2: Max-Heap of Size K

### Idea

Maintain a heap of the `k` best candidates, where the root represents the **worst retained candidate**.

A candidate is worse if:

- It has a larger distance from `x`.
    
- At equal distance, it has a larger value.
    

Python's `heapq` is a min-heap, so negate both the distance and the element to simulate the required max-heap ordering.

```Python
import heapq

def find_closest_elements(arr, k, x):
    heap = []

    for a in arr:
        item = (-abs(a - x), -a)
        heapq.heappush(heap, item)

        if len(heap) > k:
            heapq.heappop(heap)

    return sorted(-a for _, a in heap)
```

### Why it works

The heap retains at most `k` candidates. Whenever a new candidate makes the heap exceed size `k`, the worst candidate is removed. After processing every element, the heap contains the `k` closest elements under the distance and tie-breaking rules.

### Complexity

- **Time:** $O(n\log k + k\log k)$
    
- **Auxiliary space:** $O(k)$ for the heap.
    
- **Output space:** $O(k)$.
    

### When to use

Useful when selecting the best `k` items from a collection and the candidates do not have a useful sorted structure. For a sorted array, binary-search approaches are generally preferable.

---

## 4. Approach 3: Binary Search for the Left Boundary — Optimal for a Sorted Array

### Core intuition

The `k` closest elements in a sorted array always form a **contiguous window**.

Suppose the window starts at index `left`. Its elements are:

```
arr[left : left + k]
```

The only possible starting indices are from `0` through `n - k`.

Instead of checking every possible window, binary-search its starting index.

### Key observation

Consider the two elements competing for the window boundary:

- `arr[mid]`: the element that would be excluded on the left.
    
- `arr[mid + k]`: the element that would enter on the right.
    

If

$$  
x-arr[mid] > arr[mid+k]-x  
$$

then the right candidate is strictly closer than the left candidate. Therefore, shift the window right.

Otherwise, keep the left side, including the equality case because ties favor smaller elements.

This gives the comparison:

```
if x - arr[mid] > arr[mid + k] - x:
    left = mid + 1
else:
    right = mid
```

### Python implementation

```
def find_closest_elements(arr, k, x):
    n = len(arr)
    left, right = 0, n - k

    while left < right:
        mid = (left + right) // 2

        if x - arr[mid] > arr[mid + k] - x:
            left = mid + 1
        else:
            right = mid

    return arr[left:left + k]
```

### Why it works

Every valid answer is a contiguous window of length `k`. At each binary-search step, compare the element that would leave the window with the element that would enter it.

- If the entering right element is closer, no optimal window needs to start at or before `mid`; move right.
    
- Otherwise, a window starting at `mid` or earlier remains optimal; retain the left half.
    

The comparison is monotonic across possible starting indices because the array is sorted. Binary search therefore converges to the optimal left boundary. Choosing the left side on equality enforces the smaller-element tie-break.

### Complexity

- **Time:** $O(\log(n-k+1)+k)$, conventionally stated as $O(\log n+k)$.
    
- **Auxiliary space:** $O(1)$, excluding the returned slice.
    
- **Output space:** $O(k)$.
    

### Pattern recognition

When the input is sorted and the answer is a fixed-size contiguous window, ask:

> Can I binary-search the window's starting index by comparing the element leaving the window with the element entering it?

This pattern is more powerful than binary-searching for `x` itself.

---

## 5. Approach 4: Two Pointers — Shrink the Window

### Idea

Start with the entire array as the candidate window. While more than `k` elements remain, remove whichever endpoint is farther from `x`.

If the endpoints are equally distant, remove the right endpoint to preserve the smaller element.

```
def find_closest_elements(arr, k, x):
    left, right = 0, len(arr) - 1

    while right - left + 1 > k:
        if x - arr[left] <= arr[right] - x:
            right -= 1
        else:
            left += 1

    return arr[left:right + 1]
```

### Why it works

Because the array is sorted, any final set of `k` closest elements is a contiguous window. The algorithm repeatedly removes the worse endpoint until exactly `k` elements remain.

For a general target `x`, the endpoint comparisons work even when `x` lies outside the array's range.

### Complexity

- **Time:** $O(n-k)$, since each iteration removes exactly one element.
    
- **Auxiliary space:** $O(1)$, excluding the returned slice.
    
- **Output space:** $O(k)$.
    

### When to use

This is a simple, intuitive solution when linear time is acceptable. Binary search is usually better when `n` is large and `k` is relatively small.

---

## 6. Comparison of Approaches

|Approach|Time|Auxiliary space|Best use case|
|---|---|---|---|
|Sort by distance|$O(n\log n+k\log k)$|Up to $O(n)$|Simple baseline; unsorted input|
|Max-heap of size $k$|$O(n\log k+k\log k)$|$O(k)$|General top-$k$ selection|
|Binary search for window|$O(\log n+k)$|$O(1)$|Sorted array; efficient selection|
|Two-pointer shrinking|$O(n-k)$|$O(1)$|Simple linear-time solution|

Output space is $O(k)$ for each implementation returning a new list.

---

## 7. Common Mistakes

1. **Ignoring the tie-break rule.** For LeetCode 658, equal distances favor the smaller element.
    
2. **Binary-searching the target instead of the window.** Finding where `x` belongs is not enough; the answer may span either side.
    
3. **Using the wrong inequality.** In the window binary search, use `>` to move right. Equality must retain the left window.
    
4. **Forgetting the valid search range.** The starting index must lie between `0` and `n-k`, inclusive.
    
5. **Returning an unsorted heap result.** Heap order does not imply sorted output.
    
6. **Assuming the answer is always centered on** `**x**`**.** Near either endpoint, the closest window may lie entirely on one side.
    
7. **Forgetting edge cases.** Handle `k = 0`, `k = n`, and any invalid inputs according to the problem contract.
    

---

## 8. Interview Takeaway

The central insight is that **sortedness converts a top-**`**k**` **selection problem into a window-selection problem**.

- Use sorting when simplicity matters.
    
- Use a max-heap when you need general top-`k` selection.
    
- Use two pointers when linear time is acceptable.
    
- Use binary search on the window's left boundary for the most efficient solution on a sorted array.
    

For LeetCode 658, the binary-search solution is usually the strongest choice: it finds the correct window in logarithmic time and spends only $O(k)$ time returning the result.