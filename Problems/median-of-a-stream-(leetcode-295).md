---
Title: Median of a Stream (leetcode 295)
Companies:
  - Cohesity
  - IXL
  - TikTok
  - Tinder
  - StackAdapt
  - Spotify
  - Okta
  - Citadel
  - Splunk
  - WorldQuant
  - Intuit
  - Hive
  - SIG
  - DE Shaw
  - Docusign
  - Anduril
  - KLA
  - Twitch
  - Coupang
  - PayPal
  - Walmart Labs
  - Pinterest
  - Sprinklr
  - Amazon
  - Tekion
  - Arcesium
  - Apple
  - Flipkart
  - Oracle
  - Meesho
  - Microsoft
  - Adobe
  - eBay
  - Google
  - Meta
  - Visa
  - Uber
  - Rippling
  - Bloomberg
  - Snowflake
  - Goldman Sachs
  - Salesforce
  - Yandex
Topics:
  - Heap
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Median
  - Stream
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Median of a Stream

**Pattern:** 

**Idea:**  Two heaps approach

**Variations** : 


---

## 💻 Code

```Python
import heapq

class MedianFinder:
    def __init__(self):
        self.lower = []  # Max-heap: store negated values
        self.upper = []  # Min-heap

    def add_num(self, num):
        # Insert into lower half.
        heapq.heappush(self.lower, -num)

        # Move the largest element of lower into upper.
        largest_lower = -heapq.heappop(self.lower)
        heapq.heappush(self.upper, largest_lower)

        # Keep lower equal in size to upper, or one larger.
        if len(self.upper) > len(self.lower):
            smallest_upper = heapq.heappop(self.upper)
            heapq.heappush(self.lower, -smallest_upper)

    def find_median(self):
        if not self.lower:
            raise ValueError("No elements available")

        if len(self.lower) > len(self.upper):
            return -self.lower[0]

        return (-self.lower[0] + self.upper[0]) / 2

```
**Time complexity** - O(log n) per element if no of elements in the stream is n.

**Aux. Space complexity** -  O(n)

---


# Median of a Stream

Tags: #dsa #heap #priority-queue #two-heaps #min-heap #max-heap #streaming-algorithms #running-median #order-statistics #data-stream #design-problems #interview-patterns #LeetCode 

## 1. Problem Statement

Given a stream of integers arriving one at a time, design a data structure that supports inserting each new integer and finding the median of all elements seen so far.

Unlike a static array problem, the complete input is not necessarily available in advance.

**Median definition**

After sorting the elements:

- If the number of elements is odd, the median is the middle element.
    
- If the number of elements is even, the median is the average of the two middle elements.
    

Example:

```
Stream: 5, 15, 1, 3

After 5:          Median = 5
After 15:         Median = 10
After 1:          Median = 5
After 3:          Median = 4
```

After receiving all four elements, the sorted array is `[1, 3, 5, 15]`, so the median is $(3+5)/2=4$.

---

## 2. Approach 1: Maintain a Sorted List

### Idea

Insert each incoming element into its correct sorted position. The median can then be retrieved directly from the middle index or middle pair of indices.

```Python
from bisect import insort

class MedianFinder:
    def __init__(self):
        self.data = []

    def add_num(self, num):
        insort(self.data, num)

    def find_median(self):
        n = len(self.data)

        if n == 0:
            raise ValueError("No elements available")

        if n % 2 == 1:
            return self.data[n // 2]

        return (self.data[n // 2 - 1] + self.data[n // 2]) / 2
```

### Complexity

- **Insertion time:** $O(n)$ because inserting into the middle of a Python list shifts elements, even though binary search finds the position in $O(\log n)$.
    
- **Median query time:** $O(1)$.
    
- **Auxiliary space:** $O(1)$ per operation, excluding storage of the stream.
    
- **Total storage:** $O(n)$.
    

### Limitation

As the stream grows, insertion becomes expensive. We need a structure that maintains the middle without sorting or shifting all elements.

---

## 3. Approach 2: Two Heaps — Optimal General-Purpose Solution

### Core intuition

Split all observed elements into two halves:

- **Lower half:** A max-heap containing the smaller elements.
    
- **Upper half:** A min-heap containing the larger elements.
    

Python's `heapq` implements a min-heap. Negating values lets us simulate a max-heap.

The median is determined by the roots of these heaps, so it can be retrieved in constant time.

### Required invariants

Let `lower` be the max-heap and `upper` be the min-heap.

**Ordering invariant**

Every element in the lower half must be less than or equal to every element in the upper half.

$$  
\max(\text{lower}) \leq \min(\text{upper})  
$$

**Size invariant**

The heaps must differ in size by at most one:

$$  
\left|,|\text{lower}|-|\text{upper}|,\right|\leq 1  
$$

We additionally maintain a consistent convention: the lower heap has either the same number of elements as the upper heap or exactly one extra element.



### Python implementation

```Python
import heapq

class MedianFinder:
    def __init__(self):
        self.lower = []  # Max-heap: store negated values
        self.upper = []  # Min-heap

    def add_num(self, num):
        # Insert into lower half.
        heapq.heappush(self.lower, -num)

        # Move the largest element of lower into upper.
        largest_lower = -heapq.heappop(self.lower)
        heapq.heappush(self.upper, largest_lower)

        # Keep lower equal in size to upper, or one larger.
        if len(self.upper) > len(self.lower):
            smallest_upper = heapq.heappop(self.upper)
            heapq.heappush(self.lower, -smallest_upper)

    def find_median(self):
        if not self.lower:
            raise ValueError("No elements available")

        if len(self.lower) > len(self.upper):
            return -self.lower[0]

        return (-self.lower[0] + self.upper[0]) / 2
```

### Why the insertion procedure works

For each new value:

1. Insert it into the lower max-heap.
    
2. Move the maximum of the lower heap into the upper min-heap. This restores the ordering between the two halves.
    
3. If the upper heap becomes larger, move its minimum back into the lower heap. This restores the size invariant.
    

After these operations, both invariants hold.

The lower heap contains the smaller half, and the upper heap contains the larger half. Therefore:

- If the lower heap has one extra element, its root is the median.
    
- If both heaps have equal size, the median is the average of their roots.
    

### Dry run

Stream: `5, 15, 1, 3`

|Incoming value|Lower half (max-heap)|Upper half (min-heap)|Median|
|---|---|---|---|
|5|`[5]`|`[]`|5|
|15|`[5]`|`[15]`|10|
|1|`[5, 1]`|`[15]`|5|
|3|`[3, 1]`|`[5, 15]`|4|

Heap arrays are not necessarily sorted; the table shows their logical contents for clarity.

### Complexity

For a stream of $n$ elements:

- **Insertion time:** $O(\log n)$ per element.
    
- **Median query time:** $O(1)$.
    
- **Auxiliary space:** $O(n)$ across both heaps.
    
- **Total storage:** $O(n)$.
    

This is the standard solution for the running median problem.

---

## 4. Approach 3: Balanced Order-Statistic Tree

### Idea

Maintain a balanced search tree augmented with subtree sizes. The size information allows the data structure to locate the middle element or middle pair by rank.

For example, a node's subtree size is:

$$  
1+\text{size(left)}+\text{size(right)}  
$$

By comparing the desired rank with the size of the left subtree, the tree can navigate toward the median without traversing all elements.

### Complexity

With a suitable balanced order-statistic tree:

- **Insertion time:** $O(\log n)$.
    
- **Median query time:** $O(\log n)$ in a basic rank-selection implementation; it can be $O(1)$ if the middle node or nodes are also maintained.
    
- **Auxiliary space:** $O(n)$.
    

### When to use

Useful when you need more than the median, such as arbitrary percentile queries or finding the element of a specified rank.

A plain balanced binary search tree is not automatically an order-statistic tree: subtree sizes or equivalent rank metadata are needed.

Python's standard library does not provide a built-in balanced order-statistic tree, making two heaps more convenient for the usual interview problem.

---

## 5. Approach 4: Sorting All Elements for Every Query

### Idea

Append each incoming value to a list. Whenever the median is requested, sort the list and inspect its middle element or elements.

```Python
class MedianFinder:
    def __init__(self):
        self.data = []

    def add_num(self, num):
        self.data.append(num)

    def find_median(self):
        if not self.data:
            raise ValueError("No elements available")

        values = sorted(self.data)
        n = len(values)

        if n % 2 == 1:
            return values[n // 2]

        return (values[n // 2 - 1] + values[n // 2]) / 2
```

### Complexity

- **Insertion time:** $O(1)$ amortized for appending.
    
- **Median query time:** $O(n\log n)$ for sorting.
    
- **Auxiliary space:** $O(n)$ for the sorted copy.
    
- **Total storage:** $O(n)$.
    

This is easy to implement but inefficient when median queries occur frequently.

---

## 6. Approach Comparison

|Approach|Insert|Median query|Extra storage|
|---|---|---|---|
|Sorted list|$O(n)$|$O(1)$|$O(n)$ total|
|Two heaps|$O(\log n)$|$O(1)$|$O(n)$ total|
|Order-statistic tree|$O(\log n)$|$O(\log n)$, or $O(1)$ with maintained middle nodes|$O(n)$ total|
|Sort on every query|$O(1)$ amortized|$O(n\log n)$|$O(n)$ total|

**Best default:** Two heaps provide logarithmic insertion and constant-time median retrieval without requiring a specialized tree.

---

## 7. Common Mistakes

1. **Using two min-heaps.** The lower half needs efficient access to its maximum, so use a max-heap there.
    
2. **Maintaining heap sizes but ignoring ordering.** Balanced sizes alone do not guarantee the correct median.
    
3. **Forgetting to rebalance.** If the lower heap is one element larger, use its root as the median; otherwise, average the roots.
    
4. **Using integer division for an even-sized stream.** In Python, `/ 2` returns a floating-point result, while `// 2` truncates.
    
5. **Treating a heap array as sorted.** Only the root is guaranteed to be the minimum of a min-heap or the maximum of a max-heap.
    
6. **Ignoring the empty stream.** Define the behavior of a median query before any insertion.
    
7. **Overlooking duplicates and negative values.** Both are valid; negation correctly simulates a max-heap for ordinary integers.
    

---

## 8. Variations and Extensions

### A. K-th largest element in a stream

Maintain a min-heap of size $k$. The root is the $k$-th largest element once at least $k$ elements have arrived.

This differs from the median problem: the median requires maintaining both sides of the distribution, whereas top-$k$ selection needs only the largest $k$ candidates.

### B. Sliding-window median

If the median must be computed over only the most recent $k$ elements, two ordinary heaps are insufficient on their own because expired elements must be removed efficiently.

Common approaches include:

- Two heaps with lazy deletion and logical heap sizes.
    
- Balanced multisets or ordered data structures.
    
- Indexed heaps supporting deletion by element identity.
    

### C. Median of a static array

If all elements are available in advance, sorting is a straightforward solution. Selection algorithms such as Quickselect can find the middle rank in expected $O(n)$ time without fully sorting the array.

### D. Large-scale data streams

If the stream is too large to store exactly, approximate quantile algorithms can estimate the median using bounded memory. These provide approximate rather than exact answers.

---

## 9. Interview Takeaway

The key insight is to maintain the stream's **two halves**, rather than repeatedly sorting all observed values.

- The lower max-heap exposes the largest element of the lower half.
    
- The upper min-heap exposes the smallest element of the upper half.
    
- Size balancing identifies whether the median is one root or the average of two roots.
    

Remember the two invariants:

1. Every lower-half element is no greater than every upper-half element.
    
2. The heap sizes differ by at most one.
    

Together, they guarantee $O(\log n)$ insertion and $O(1)$ median retrieval.

