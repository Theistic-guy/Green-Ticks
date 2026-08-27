---
Title: Kth smallest element in an array
Companies:
  - Not Specified
Topics:
  - Sorting
  - Heap
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Quick select
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Kth Smallest Element in an Array (Quickselect)

**Pattern:**  quickselect

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
import random

def kthSmallest(nums, k):
    k -= 1

    left = 0
    right = len(nums) - 1

    while True:
        pivot_idx = random.randint(left, right)
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]

        p = partition(nums, left, right)

        if p == k:
            return nums[p]

        elif p > k:
            right = p - 1

        else:
            left = p + 1

```
**Time complexity** - O(D) , D is no of digits

**Aux. Space complexity** -  O(1)

---
### Kth Smallest Element in an Array

A fundamental interview problem that introduces selection algorithms. The most practical solutions to know are:

- Sorting (easy baseline)
    
- Min/Max Heap (very common)
    
- Quickselect (expected optimal interview solution)
    

> Pattern: This is not Binary Search on Answer. We're selecting an element, not searching a monotonic answer space.

### Problem Statement

Given an unsorted array, return the kth smallest element.

Example

```
arr = [7, 10, 4, 3, 20, 15]
k = 3
```

Sorted order:

```
[3, 4, 7, 10, 15, 20]
```

Answer:

```
7
```

### Approach 1: Sorting (Baseline)

Sort the array and return the `(k-1)`th index.

Python

Run

```
def kth_smallest(arr, k):
    arr.sort()
    return arr[k - 1]
```

### Complexity

- Time Complexity: $O(n \log n)$
    
- Auxiliary Space Complexity: $O(1)$ (ignoring Python's internal sort space)
    

> Good baseline, but not optimal.

### Approach 2: Max Heap of Size K

Maintain only the k smallest elements seen so far.

Use a max heap (implemented in Python by pushing negative values).

### Intuition

For `k = 3`:

```
Heap contains the 3 smallest elements seen so far

[7, 4, 3]
```

When a new element arrives:

- Smaller than heap maximum → replace it
    
- Larger → ignore it
    

The heap root is always the kth smallest.

### Python Code

Python

Run

```
import heapq

def kth_smallest(arr, k):

    heap = []

    for num in arr:

        heapq.heappush(heap, -num)

        if len(heap) > k:
            heapq.heappop(heap)

    return -heap[0]
```

### Complexity

- Time Complexity: $O(n \log k)$
    
- Auxiliary Space Complexity: $O(k)$
    

> Best when `k` is much smaller than `n`.

### Approach 3: Quickselect (Optimal)

### Key Idea

Quickselect is based on the partition step of Quicksort.

Instead of sorting both halves, we only recurse into the half that contains the kth element.

### Intuition

Suppose after partition:

```
[3, 4, 7, |10|, 20, 15]
            pivot
```

If the pivot lands at index `3`:

- Need index `3` → done
    
- Need smaller index → search left
    
- Need larger index → search right
    

Half of the array is discarded every iteration.

### Python Code

Python

Run

```
import random

def partition(arr, low, high):

    pivot_idx = random.randint(low, high)
    arr[pivot_idx], arr[high] = arr[high], arr[pivot_idx]

    pivot = arr[high]
    i = low

    for j in range(low, high):

        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1

    arr[i], arr[high] = arr[high], arr[i]
    return i


def kth_smallest(arr, k):

    target = k - 1
    low, high = 0, len(arr) - 1

    while low <= high:

        p = partition(arr, low, high)

        if p == target:
            return arr[p]

        elif p > target:
            high = p - 1

        else:
            low = p + 1
```

### Dry Run

```
arr = [7, 10, 4, 3, 20, 15]
k = 3
```

Suppose partition places pivot `7`:

```
[3, 4, 7, 10, 20, 15]
       ↑
    index = 2
```

Target index:

```
k - 1 = 2
```

Pivot already sits at the desired position.

Answer:

```
7
```

### Why Is Quickselect Faster Than Quicksort?

Quicksort explores both partitions.

```
        pivot
       /     \
   sort      sort
```

Quickselect explores only one.

```
        pivot
       /     \
  discard   continue
```

This is why its average complexity becomes linear.

### Complexity Comparison

|  
Approach

|

Time

|

Aux. Space

|  
| --- | --- | --- |  
|

Sorting

|

$O(n \log n)$

|

$O(1)$

|  
|

Max Heap

|

$O(n \log k)$

|

$O(k)$

|  
|

Quickselect

|

Average: $O(n)$

|

$O(1)$

|  
|

Quickselect

|

Worst: $O(n^2)$

|

$O(1)$

|

> The worst case occurs when the pivot repeatedly becomes the smallest or largest element. Random pivot selection makes this very unlikely in practice.

### Important Interview Variations

### 1. Kth Largest Element

Convert it into kth smallest:

```
kth largest
        ↓
(n - k + 1)th smallest
```

Or simply reverse the comparison in Quickselect.

### 2. Top K Frequent Elements

Don't confuse this with kth smallest.

Here the ordering is by frequency, so the usual solution is:

- HashMap + Heap
    
- Bucket Sort
    

### 3. K Closest Points to Origin

Another Quickselect application.

Instead of comparing numbers, compare:

$$ x^2 + y^2 $$

The partition logic remains identical.

### Common Mistakes

### Mistake 1: Returning `arr[k]`

Remember arrays are 0-indexed.

Python

Run

```
target = k - 1
```

### Mistake 2: Using Quickselect Without Random Pivot

Always choosing the last element can degrade to:

$$ O(n^2) $$

on already sorted input.

Randomizing the pivot avoids this in practice.

### Mistake 3: Using a Min Heap for K Smallest

For maintaining the k smallest, use a max heap so the largest among them can be removed efficiently.

### Pythonic Way

For quick scripting:

Python

Run

```
import heapq

heapq.nsmallest(k, arr)[-1]
```

or

Python

Run

```
sorted(arr)[k - 1]
```

These are convenient, but in interviews you're generally expected to implement the heap or Quickselect solution.

### Pattern Recognition

|  
Problem asks for...

|

Think...

|  
| --- | --- |  
|

Kth smallest/largest element

|

Quickselect

|  
|

Top K elements

|

Heap

|  
|

Kth after many insertions

|

Heap

|  
|

Need fully sorted output

|

Sorting

|

> Interview Tip: Ask yourself "Do I need the entire sorted array?" If the answer is no, sorting is often unnecessary. For a single kth element, Quickselect is the algorithm interviewers are usually looking for because it finds the answer without sorting everything.