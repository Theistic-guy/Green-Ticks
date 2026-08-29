---
Title: Top K closest Elements
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
  - Two Pointers
  - Heap
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - kth
  - Quick select
  - Sorted
Link: https://leetcode.com/problems/find-k-closest-elements/description/
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Top K closest elements

**Pattern:**  heap based

**Idea:** 

**Variations** : 

---

## 💻 Code

Binary Search  (O(log n) and O(1))
```Python
def findClosestElements(arr, k, x):
    n = len(arr)

    # We are searching for the starting index of the
    # optimal window of size k.
    #
    # Possible starts:
    # 0, 1, 2, ..., n-k
    left = 0
    right = n - k

    while left < right:
        mid = (left + right) // 2

        # Compare the two elements just outside/in relation
        # to the candidate window:
        #
        # left side  -> arr[mid]
        # right side -> arr[mid + k]
        #
        # If the left candidate is at least as good as the
        # right candidate, move the window left.
        if x - arr[mid] <= arr[mid + k] - x:
            right = mid
        else:
            left = mid + 1

    # 'left' is now the start of the optimal k-element window.
    return arr[left:left + k]
```


Sliding window / Two pointers
```Python
def findClosestElements(arr, k, x):
    left = 0
    right = len(arr) - 1

    # Remove elements until exactly k remain.
    while right - left + 1 > k:

        left_distance = abs(arr[left] - x)
        right_distance = abs(arr[right] - x)

        if left_distance <= right_distance:
            # Left is closer, or equally close.
            # Keep the smaller left value.
            right -= 1
        else:
            left += 1

    return arr[left:right + 1]
```

**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---


# Top K Closest Elements

Tags: #Array #Two-Pointers #Binary-Search #Sliding-Window #Heap #Min-Heap #Max-Heap #Priority-Queue #Sorting #Top-K #Quickselect #Distance #Greedy #LC658 #LeetCode #FAANG #leetcode 
## Problem Statement

Given a **sorted** integer array `arr`, an integer `k`, and a target value `x`, find the `k` elements that are closest to `x`.

For **LeetCode 658 — Find K Closest Elements**, when two elements are equally distant from `x`, the **smaller element is preferred**.

The returned result must also be in **ascending order**.

### Example

```text
arr = [1, 2, 3, 4, 5]
k = 4
x = 3

Output = [1, 2, 3, 4]
```

Distances from `3`:

```text
1 → 2
2 → 1
3 → 0
4 → 1
5 → 2
```

`2` and `4` are equally close, so both can be selected before `5`; the required result is `[1,2,3,4]`.

---

## Key Idea

There are several ways to solve Top-K Closest Elements:

1. **Sort by distance** — straightforward baseline.
    
2. **Heap** — general Top-K pattern.
    
3. **Binary Search + Sliding Window** — exploits the fact that the array is sorted and is the preferred solution for LC 658.
    
4. **Two Pointers** — another way to shrink toward the best `k`-element window.
    

The most important insight for LC 658 is:

> Because the array is sorted, the answer itself must be a **contiguous window of size `k`**.

So instead of choosing arbitrary `k` elements, we only need to find the correct starting index of a window:

```text
arr[left : left + k]
```

---

# Why Is the Answer a Contiguous Window?

Suppose:

```text
arr = [1, 2, 3, 4, 5, 6]
x = 4
k = 3
```

The answer is:

```text
[3, 4, 5]
```

Suppose we selected:

```text
[2, 4, 5]
```

but excluded `3`.

Because the array is sorted:

```text
2 < 3 < 4
```

and `3` is closer to `4` than `2`, replacing `2` with `3` can never make the answer worse.

The same reasoning applies to any gap inside the selected elements.

Therefore, there exists an optimal answer consisting of `k` consecutive elements.

This is the key structural property that makes the sorted-array solution much better than a generic Top-K solution.

---

# Approach 1 — Sort by Distance

## Intuition

The simplest approach is:

1. Calculate the distance of every element from `x`.
    
2. Sort elements according to distance.
    
3. Take the first `k`.
    
4. Sort those selected elements because the output must be ascending.
    

The distance is:

∣arr[i]−x∣|arr[i]-x|

For LC 658, when distances tie, the smaller value should come first:

```python
key = (abs(num - x), num)
```

---

## Python Solution

```python
def findClosestElements(arr, k, x):
    # Sort by:
    # 1. Distance from x
    # 2. Value itself, so smaller values win ties
    candidates = sorted(arr, key=lambda num: (abs(num - x), num))

    # Select the k closest elements.
    result = candidates[:k]

    # LC 658 requires the final result in ascending order.
    return sorted(result)
```

---

## Complexity

Let `n = len(arr)`.

Sorting all elements:

O(nlog⁡n)O(n\log n)

Sorting the selected `k` elements:

O(klog⁡k)O(k\log k)

Total:

O(nlog⁡n)O(n\log n)

### Auxiliary Space

The sorted list and result require:

O(n)O(n)

auxiliary/output-related space depending on implementation.

This is easy to write but does **not exploit the sorted input**.

---

# Approach 2 — Heap-Based Approach

## Why Use a Heap?

This problem is fundamentally a **Top-K** problem:

> Find the `k` elements with the smallest distance from `x`.

That immediately suggests a heap.

However, we need the **k smallest** distances.

The standard Top-K pattern is:

> **K smallest → maintain a max-heap of size `k`.**

Why a max-heap?

Because we want to keep the `k` best candidates, and among those candidates we need fast access to the **worst one** so that we can remove it when a better candidate appears.

```text
k best candidates
       ↓
max-heap
       ↓
root = worst candidate among them
```

Here, "worse" means:

1. Larger distance from `x`
    
2. If distances are equal, larger value
    

because LC 658 prefers the smaller value on ties.

---

## Important Python Quirk

Python's `heapq` provides a **min-heap**, not a max-heap.

So we simulate a max-heap by negating the ordering.

A convenient representation is:

```text
(-distance, -value, value)
```

Why?

For Python's min-heap:

```text
smaller negative distance
        ↓
larger actual distance
```

Thus the root corresponds to the candidate we want to remove.

---

## Python Solution

```python
import heapq


def findClosestElements(arr, k, x):
    # Python has a min-heap, so we negate both
    # distance and value to simulate a max-heap.
    #
    # Heap entry:
    # (-distance, -value, value)
    #
    # Larger distance -> smaller negative value -> root
    # Same distance + larger value -> smaller negative value -> root
    heap = []

    for num in arr:
        distance = abs(num - x)

        heapq.heappush(
            heap,
            (-distance, -num, num)
        )

        # Keep only the k closest elements.
        if len(heap) > k:
            heapq.heappop(heap)

    # Heap now contains exactly the k closest elements.
    result = [entry[2] for entry in heap]

    # LC 658 requires ascending order.
    result.sort()

    return result
```

---

## Heap Intuition With an Example

```text
arr = [1, 2, 3, 4, 5]
x = 3
k = 2
```

Distances:

```text
1 → 2
2 → 1
3 → 0
4 → 1
5 → 2
```

Process candidates.

### `1`

```text
heap = [1]
```

### `2`

```text
heap = [1, 2]
```

The heap contains the current two best candidates.

### `3`

Add `3`:

```text
heap size = 3
```

We now remove the worst candidate.

`1` has the largest distance among:

```text
1 → distance 2
2 → distance 1
3 → distance 0
```

so `1` is removed.

```text
heap = [2, 3]
```

### `4`

Distance is `1`, tied with `2`.

Because smaller value is preferred, `2` is better than `4`.

Therefore, `4` should not replace `2`.

The heap ordering handles this tie-breaking.

Final candidates:

```text
[2, 3]
```

---

## Complexity

Let `n = len(arr)`.

Each heap insertion/removal costs:

O(log⁡k)O(\log k)

for up to `n` elements.

Therefore:

O(nlog⁡k)\boxed{O(n\log k)}

The final sorting of `k` elements costs:

O(klog⁡k)O(k\log k)

So overall:

O(nlog⁡k+klog⁡k)O(n\log k + k\log k)

Since $k \le n$, this is commonly written as:

O(nlog⁡k)\boxed{O(n\log k)}

### Auxiliary Space

Heap:

O(k)O(k)

Result:

O(k)O(k)

Excluding output:

O(k)\boxed{O(k)}

Including output:

O(k)\boxed{O(k)}

---

# Approach 3 — Binary Search + Sliding Window

For **LC 658**, this is the most important approach.

## Core Observation

We know the answer consists of `k` consecutive elements.

Therefore, the problem becomes:

> Find the best starting position among all windows of size `k`.

There are:

n−k+1n-k+1

possible windows.

We could examine each one, but that would take $O(n)$ after sorting, and the array is already sorted.

We can do better by using **binary search**.

---

## The Crucial Comparison

Suppose our candidate window is:

```text
arr[mid : mid + k]
```

There are two elements immediately outside this window:

```text
left  = arr[mid]
right = arr[mid + k]
```

Think about deciding whether the optimal window should move **left** or **right**.

Compare:

x−arr[mid]x-arr[mid]

with:

arr[mid+k]−xarr[mid+k]-x

Conceptually:

```text
arr[mid]        ... x ...        arr[mid+k]
    ← left distance → ← right distance →
```

### If the right element is at least as far away

If:

x−arr[mid]≤arr[mid+k]−xx-arr[mid] \le arr[mid+k]-x

then the left endpoint is no worse than the right outside candidate.

So the window should stay at `mid` or move left.

Equivalently:

```text
arr[mid+k] - x >= x - arr[mid]
```

we move toward the left:

```python
right = mid
```

### Otherwise

The outside right candidate is better, so move the window right:

```python
left = mid + 1
```

This gives a monotonic decision, which allows binary search.

---

## Why the Tie Goes Left

This is an especially important LC 658 detail.

Suppose:

```text
arr[mid]     = 2
x            = 3
arr[mid + k] = 4
```

Then:

∣2−3∣=∣4−3∣=1|2-3| = |4-3| = 1

Both are equally close.

LC 658 prefers the **smaller value**, so:

```text
2
```

should remain in the window.

Therefore:

x−arr[mid]≤arr[mid+k]−xx-arr[mid] \le arr[mid+k]-x

must move the boundary toward the **left**.

That `<=` is not arbitrary — it encodes the tie-breaking rule.

---

## Binary Search Style

This is an **implicit-answer / boundary-search style** binary search.

We are not searching for a value in the array.

Instead, we are searching for the correct **window start index**:

```text
0 ... n-k
```

The answer is the first position where the window should stop moving right.

There is no need for a separate `ans` variable.

At termination:

```python
left == right
```

and that index is the optimal window start.

---

## Python Solution

```python
def findClosestElements(arr, k, x):
    n = len(arr)

    # We are searching for the starting index of the
    # optimal window of size k.
    #
    # Possible starts:
    # 0, 1, 2, ..., n-k
    left = 0
    right = n - k

    while left < right:
        mid = (left + right) // 2

        # Compare the two elements just outside/in relation
        # to the candidate window:
        #
        # left side  -> arr[mid]
        # right side -> arr[mid + k]
        #
        # If the left candidate is at least as good as the
        # right candidate, move the window left.
        if x - arr[mid] <= arr[mid + k] - x:
            right = mid
        else:
            left = mid + 1

    # 'left' is now the start of the optimal k-element window.
    return arr[left:left + k]
```

---

## Dry Run

Consider:

```text
arr = [1, 2, 3, 4, 5]
k = 4
x = 3
```

Possible windows:

```text
[1,2,3,4]
[2,3,4,5]
```

Initial search range:

```text
left = 0
right = 1
```

So:

```text
mid = 0
```

Compare:

```text
x - arr[mid]
= 3 - 1
= 2
```

and:

```text
arr[mid+k] - x
= arr[4] - 3
= 5 - 3
= 2
```

Equal.

Because of the tie rule:

```text
2 is preferred over 5
```

we move left:

```text
right = mid = 0
```

Now:

```text
left = right = 0
```

Answer:

```text
arr[0:4]
= [1,2,3,4]
```

---

# Approach 4 — Two Pointers / Shrinking Window

Another way to exploit the fact that the answer is contiguous is to start with the entire array and remove the farther endpoint until only `k` elements remain.

Suppose:

```text
arr = [1, 2, 3, 4, 5]
x = 3
k = 2
```

Start:

```text
[1, 2, 3, 4, 5]
 ↑           ↑
left        right
```

Compare distances:

```text
|1-3| = 2
|5-3| = 2
```

Tie → remove the **right** side because the smaller value should be retained.

Now:

```text
[1,2,3,4]
```

Compare:

```text
|1-3| = 2
|4-3| = 1
```

Remove `1`.

Final:

```text
[2,3]
```

---

## Python Solution

```python
def findClosestElements(arr, k, x):
    left = 0
    right = len(arr) - 1

    # Remove elements until exactly k remain.
    while right - left + 1 > k:

        left_distance = abs(arr[left] - x)
        right_distance = abs(arr[right] - x)

        if left_distance <= right_distance:
            # Left is closer, or equally close.
            # Keep the smaller left value.
            right -= 1
        else:
            left += 1

    return arr[left:right + 1]
```

### Complexity

We remove exactly:

n−kn-k

elements.

So:

O(n−k)\boxed{O(n-k)}

time, which is $O(n)$ in the worst case.

Auxiliary space:

O(1)\boxed{O(1)}

excluding the returned slice.

---

# Comparing the Main Approaches

|Approach|Time|Auxiliary Space|Exploits Sorted Input?|Main Pattern|
|---|--:|--:|---|---|
|Sort by distance|$O(n\log n)$|$O(n)$|❌|Sorting|
|Max-Heap of size `k`|$O(n\log k)$|$O(k)$|❌|Top-K Heap|
|Two-pointer shrinking|$O(n-k)$|$O(1)$|✅|Two Pointers|
|Binary Search + window|**$O(\log(n-k+1)+k)$**|$O(1)$*|✅|Binary Search|

*Excluding the returned output slice.

### What should you use in an interview?

For **LC 658 specifically**:

> **Binary Search + Fixed Window** is the strongest answer because it fully exploits the sorted-array structure.

Know the **heap solution** because it reinforces the general **Top-K** pattern and is useful when the array is not sorted.

Know the **two-pointer solution** because it gives a very simple linear-time alternative.

---

# Important Variations

## 1. Unsorted Array

If `arr` is **not sorted**, the contiguous-window property disappears.

Then the heap approach becomes much more attractive:

```text
Unsorted input
     ↓
calculate distance
     ↓
max-heap of size k
     ↓
top k closest
```

Time:

O(nlog⁡k)O(n\log k)

This is the more general Top-K solution.

---

## 2. Return the K Closest Points

For problems such as **K Closest Points to Origin (LC 973)**:

```text
point = (x, y)
distance = x² + y²
```

You don't need the square root because:

a<b  ⟺  a<b\sqrt{a} < \sqrt{b} \iff a < b

So use:

```python
distance = x*x + y*y
```

This is another classic:

> **Top-K + distance → heap / quickselect**

---

## 3. K Closest Elements Without Sorted Input

The strategy depends on what the interviewer asks for:

- General solution → heap
    
- Expected linear selection → Quickselect
    
- Need sorted final result → sort the selected `k`
    

This is closely related to the **Top-K Frequent Elements** problem.

There, the ranking key is:

```text
frequency
```

Here, the ranking key is:

```text
distance from x
```

The Top-K machinery is the same.

---

# Common Mistakes / Quirks

## Mistake 1 — Using the wrong heap

For **K closest / K smallest**, use a:

```text
MAX-HEAP of size K
```

because you need to remove the **farthest** candidate.

This is the opposite of:

```text
K largest → MIN-HEAP
```

### Memory rule

```text
Want K largest?
→ min-heap keeps weakest of the K

Want K smallest?
→ max-heap keeps weakest of the K
```

---

## Mistake 2 — Forgetting the LC 658 tie rule

For equal distances:

```text
smaller value wins
```

For example:

```text
x = 5
2 and 8
```

Both have distance `3`.

`2` is preferred.

This is why the binary-search condition uses:

```python
x - arr[mid] <= arr[mid + k] - x
```

rather than `<`.

---

## Mistake 3 — Returning the heap directly

The heap does **not** guarantee sorted output.

For example, the heap might contain:

```text
[4, 2, 3]
```

even though the required answer is:

```text
[2, 3, 4]
```

Therefore, the heap solution must sort its selected elements before returning them.

---

## Mistake 4 — Treating the answer as arbitrary K elements

For LC 658, after recognizing that the array is sorted, don't think:

```text
Choose any k elements.
```

Think:

```text
Choose one contiguous window of length k.
```

That structural reduction is the main insight.

---

## Mistake 5 — Binary-searching values instead of window starts

The binary search is **not** looking for `x`.

It is searching over:

```text
possible starting indices of a k-sized window
```

The search space is:

[0, n−k][0,\ n-k]

This is an important distinction.

---

# Pythonic Way

For the heap solution, `heapq` is the natural Python tool.

For the sorted-input solution, Python slicing gives a clean final operation:

```python
return arr[left:left + k]
```

No explicit loop is needed because the algorithm has already established that this exact contiguous range is the answer.

For LC 658, the slicing operation is particularly elegant because it directly expresses the mathematical result:

answer=arr[left:left+k]\text{answer} = arr[left:left+k]

---

# Complexity Summary

For LC 658:

### Binary Search + Window

Binary search over possible starts:

O(log⁡(n−k+1))O(\log(n-k+1))

Returning the `k` elements:

O(k)O(k)

Therefore:

O(log⁡(n−k+1)+k)\boxed{O(\log(n-k+1)+k)}

which is commonly simplified to:

O(log⁡n+k)\boxed{O(\log n + k)}

Auxiliary space excluding output:

O(1)\boxed{O(1)}

Output space:

O(k)O(k)

---

### Two-Pointer Shrinking

O(n−k)\boxed{O(n-k)}

time and:

O(1)\boxed{O(1)}

auxiliary space excluding output.

---

### Heap

O(nlog⁡k)\boxed{O(n\log k)}

time and:

O(k)\boxed{O(k)}

auxiliary space excluding output.

---

# Key Takeaways / Pattern Recognition

## The Three Patterns to Remember

### Pattern 1 — General Top-K

When the input is unsorted:

```text
Top K closest
      ↓
distance as ranking key
      ↓
MAX-HEAP of size K
```

### Pattern 2 — Sorted Input + K Closest

When the array is sorted:

```text
Sorted array
     ↓
answer is contiguous
     ↓
find best window of size K
```

### Pattern 3 — Need Maximum Efficiency

For LC 658:

```text
Sorted array
      ↓
window start ∈ [0, n-k]
      ↓
binary-search the optimal start
      ↓
return arr[start:start+k]
```

## Connection to Previous Top-K Problems

This is closely related to **Top K Frequent Elements**:

```text
Top K Frequent
    ↓
Hash Map
    ↓
rank by frequency
    ↓
Heap / Bucket / Quickselect
```

Whereas:

```text
Top K Closest
    ↓
rank by distance
    ↓
Heap / Quickselect
```

The **Top-K abstraction** is the same; only the ranking function changes.

The important optimization is to ask:

> **Does the input have additional structure that makes a generic Top-K algorithm unnecessary?**

For LC 658, the sorted order gives exactly that structure.

> **Memory hook:**  
> **Unsorted → Max-Heap of K closest.**  
> **Sorted → Answer is a K-sized window.**  
> **LC 658 → Binary-search the window's starting index.**