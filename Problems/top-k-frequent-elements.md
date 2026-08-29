---
Title: Top K Frequent Elements
Companies:
  - Amazon
  - Google
  - Microsoft
  - Facebook
  - Apple
  - Adobe
  - Bloomberg
  - Uber
  - Oracle
  - Cisco
Topics:
  - Arrays
  - Hashing
  - Heap
  - Sorting
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
  - kth
  - Quick select
Link: "[Leetcode](https://leetcode.com/problems/top-k-frequent-elements/)"
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# 🥇Top K Frequent Elements
#leetcode 

**Pattern:** Arrays

**Idea:** use `Counter` dictionary implementation

---

## 💻 Code

```Python

from collections import Counter

def topKFrequent(nums: List[int], k: int) -> List[int]:
	cnt = Counter(nums)
	return [i[0] for i in cnt.most_common(k)]
        
```


## ✏️Note

<details>
<summary>O(Nlogk) min heap and O(N) bucket sort soln.</summary>



---

## Approach 1: Min-Heap ($O(N \log k)$ Time)

### The Core Idea

Instead of sorting all unique elements by frequency ($O(N \log N)$), we build a frequency map and maintain a **Min-Heap of size $k$**:

1. Count the frequency of each number using a hash map.
2. Iterate through the hash map and push `(frequency, number)` into a Min-Heap.
3. If the heap size exceeds $k$, pop the top element. Because it's a *min*-heap, popping removes the element with the **lowest** frequency among the current group.
4. By the end of the iteration, the heap contains only the top $k$ most frequent elements.

### Python Code

```python
import heapq
from collections import Counter


def topKFrequent_heap(nums: list[int], k: int) -> list[int]:
    # Step 1: Build frequency map -> O(N)
    freq_map = Counter(nums)

    # Step 2: Maintain a Min-Heap of size k -> O(N log k)
    min_heap = []

    for num, freq in freq_map.items():
        # Push (frequency, num) so heapq orders elements by frequency
        heapq.heappush(min_heap, (freq, num))

        # Keep heap size at most k
        if len(min_heap) > k:
            heapq.heappop(min_heap)  # Drops the lowest frequency item

    # Step 3: Extract numbers from heap -> O(k)
    return [num for freq, num in min_heap]

```

### Complexity Analysis

* **Time Complexity:** $O(N \log k)$
* Counting frequencies takes $O(N)$ time.
* Inserting into a heap of max size $k$ takes $O(\log k)$ time. Doing this for up to $N$ unique elements takes $O(N \log k)$ time.
* *Why it matters:* Since $k \le N$, $O(N \log k)$ is significantly faster than sorting everything ($O(N \log N)$) when $k$ is small.


* **Space Complexity:** $O(N)$
* The hash map takes $O(N)$ space to store frequency counts.
* The heap stores at most $k + 1$ elements, taking $O(k)$ space.
* Total space: $O(N + k) = O(N)$.



---

## Approach 2: Bucket Sort ($O(N)$ Time - Optimal)

If you give the Min-Heap approach, an  interviewer will often ask: *"Can you optimize this to linear $O(N)$ time?"*

This is where **Bucket Sort** comes in.

### The Core Idea

An element can appear at most $N$ times (where $N$ is the length of `nums`). Therefore, frequency values are bounded between $1$ and $N$.

1. Count frequencies using a hash map.
2. Create an array of lists called `buckets`, where **index $i$ represents frequency $i$**.
3. Place each number into `buckets[frequency]`.
4. Iterate through `buckets` **backwards** (from highest possible frequency $N$ down to $1$) and collect numbers until you have $k$ elements.

### Visualizing the Buckets

For `nums = [1, 1, 1, 2, 2, 3]`, $N = 6$:

* Frequency Map: `{1: 3, 2: 2, 3: 1}`
* Buckets array (index = frequency):
* `index 0`: `[]`
* `index 1`: `[3]` (3 appears 1 time)
* `index 2`: `[2]` (2 appears 2 times)
* `index 3`: `[1]` (1 appears 3 times)
* `index 4..6`: `[]`



Reading backwards from index 6 to 0 yields: `[1]`, then `[2]`, then `[3]`.

### Python Code

```python
from collections import Counter


def topKFrequent_bucket(nums: list[int], k: int) -> list[int]:
    # Step 1: Count frequencies -> O(N)
    freq_map = Counter(nums)

    # Step 2: Initialize buckets array of size len(nums) + 1 -> O(N)
    buckets = [[] for _ in range(len(nums) + 1)]

    # Step 3: Fill buckets based on frequency -> O(N)
    for num, freq in freq_map.items():
        buckets[freq].append(num)

    # Step 4: Gather top k elements from right to left -> O(N)
    result = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            result.append(num)
            if len(result) == k:
                return result

    return result

```

### Complexity Analysis

* **Time Complexity:** $O(N)$
* Building frequency map: $O(N)$.
* Filling $N+1$ buckets: $O(N)$.
* Outer loop runs $N$ times, inner loop visits each unique number at most once: $O(N)$.
* Total time is strictly linear $O(N)$.


* **Space Complexity:** $O(N)$
* Hash map uses $O(N)$ space.
* Buckets array uses $O(N)$ space.



---


</details>


## 🔗References
[Leetcode](https://leetcode.com/problems/top-k-frequent-elements/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Bloomberg, Uber, Oracle, Cisco

---

# Top K Frequent Elements

Tags: #Hash-Map #Hashing #Heap #Min-Heap #Max-Heap #Priority-Queue #Bucket-Sort #Top-K #Frequency-Counting #Sorting #Array #LC347 #LeetCode #FAANG

## Problem Statement

**LeetCode 347 — Top K Frequent Elements**

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.

The answer may be returned in **any order**.

### Example

```text
nums = [1, 1, 1, 2, 2, 3]
k = 2

Output = [1, 2]
```

Frequencies:

```text
1 → 3
2 → 2
3 → 1
```

Therefore, the top `2` frequent elements are `1` and `2`.

---

## Key Idea

This is a classic **Top-K** problem.

The problem naturally separates into two tasks:

1. Count the frequency of every distinct element.
    
2. Find the `k` elements with the largest frequencies.
    

The first part is handled with a **hash map**:

```text
value → frequency
```

For the second part, there are several possibilities:

- Sort all `(element, frequency)` pairs.
    
- Maintain a **min-heap of size k**.
    
- Use **bucket sort** based on frequency.
    

For the standard interview solution, the most important pattern is:

> **Hash Map + Min-Heap of size K**

This gives:

O(nlog⁡k)O(n \log k)

time after frequency counting, rather than sorting all distinct elements.

---

# Approach 1 — Hash Map + Min-Heap

## Intuition (The WHY)

Suppose:

```text
nums = [1,1,1,2,2,3,4,4,4,4]
k = 2
```

Frequencies:

```text
1 → 3
2 → 2
3 → 1
4 → 4
```

We want the **2 largest frequencies**:

```text
4 → 4
1 → 3
```

A **min-heap of size `k`** is ideal because it keeps the **smallest frequency among the current top-k candidates at the root**.

Think of the heap as a box that can hold only `k` candidates:

```text
heap = current best k elements
root = weakest member of those k
```

For each `(value, frequency)`:

- Add it to the heap.
    
- If heap size becomes greater than `k`, remove the smallest frequency.
    
- Therefore, anything removed can no longer belong to the top `k`.
    

### Why a MIN-heap?

This is the key interview insight.

We are looking for **largest** values, so we need to efficiently remove the **smallest** candidate.

A min-heap gives:

minimum frequency at root\text{minimum frequency at root}

in $O(1)$ access and $O(\log k)$ removal.

---

## Why the Algorithm Works

After processing some number of distinct elements, maintain this invariant:

> The heap contains the `k` elements with the largest frequencies seen so far.

Suppose the heap already contains `k` elements and a new candidate has frequency `f`.

### Case 1 — `f <= heap[0][0]`

The new candidate is no better than the weakest top-k candidate.

So it can be ignored.

### Case 2 — `f > heap[0][0]`

The new candidate is stronger than the weakest current candidate.

Therefore:

1. Remove the weakest candidate.
    
2. Insert the new candidate.
    

The invariant is restored.

That is the core reason a size-`k` min-heap solves Top-K problems.

---

## Python Solution

```python
from collections import Counter
import heapq


def topKFrequent(nums, k):
    # Step 1: Count frequency of every distinct element.
    freq = Counter(nums)

    # Min-heap storing:
    # (frequency, element)
    #
    # The smallest frequency stays at the root.
    heap = []

    # Step 2: Keep only the k most frequent elements in the heap.
    for num, count in freq.items():
        heapq.heappush(heap, (count, num))

        # More than k candidates -> remove the weakest one.
        if len(heap) > k:
            heapq.heappop(heap)

    # The heap now contains exactly the top-k frequent elements.
    return [num for count, num in heap]
```

---

## Dry Run

Consider:

```text
nums = [1,1,1,2,2,3,4,4,4]
k = 2
```

Frequency map:

```text
1 → 3
2 → 2
3 → 1
4 → 3
```

Process elements.

### Candidate: `1 → 3`

```text
heap = [(3, 1)]
```

### Candidate: `2 → 2`

```text
heap = [(2, 2), (3, 1)]
```

Heap contains current top 2:

```text
{1, 2}
```

### Candidate: `3 → 1`

Insert:

```text
heap = [(1, 3), (3, 1), (2, 2)]
```

Size is now `3 > k`.

Remove smallest:

```text
remove (1, 3)
```

Now:

```text
heap = [(2, 2), (3, 1)]
```

### Candidate: `4 → 3`

Insert:

```text
heap = [(2, 2), (3, 1), (3, 4)]
```

Again size `3 > 2`.

Remove smallest:

```text
remove (2, 2)
```

Final:

```text
heap = [(3, 1), (3, 4)]
```

Answer:

```text
[1, 4]
```

Both have frequency `3`.

---

# Approach 2 — Sort by Frequency

The simplest conceptual approach is:

1. Count frequencies.
    
2. Sort elements by frequency descending.
    
3. Take first `k`.
    

```python
from collections import Counter


def topKFrequent(nums, k):
    freq = Counter(nums)

    items = sorted(
        freq.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return [num for num, count in items[:k]]
```

### Complexity

Let `d` be the number of distinct elements.

Frequency counting:

O(n)O(n)

Sorting:

O(dlog⁡d)O(d \log d)

Total:

O(n+dlog⁡d)O(n + d\log d)

Since:

d≤nd \le n

worst case is:

O(nlog⁡n)O(n\log n)

### When is this useful?

It is perfectly valid when constraints are small or when simplicity matters.

But for FAANG-style interviews, recognizing **Top-K → heap** is more valuable.

---

# Approach 3 — Bucket Sort

There is an even better solution for this specific problem.

The frequency of an element can never exceed:

nn

Therefore, create buckets indexed by frequency:

```text
bucket[f] = all elements occurring f times
```

Example:

```text
freq:
1 → 3
2 → 2
3 → 1
4 → 3
```

Buckets:

```text
bucket[1] = [3]
bucket[2] = [2]
bucket[3] = [1, 4]
bucket[4] = []
...
```

Then iterate from frequency `n` down to `1` and collect elements until we have `k`.

This achieves:

O(n)O(n)

time.

---

## Bucket Sort Solution

```python
from collections import Counter


def topKFrequent(nums, k):
    # Count frequency of each value.
    freq = Counter(nums)

    # bucket[f] stores all elements whose frequency is f.
    buckets = [[] for _ in range(len(nums) + 1)]

    for num, count in freq.items():
        buckets[count].append(num)

    result = []

    # Higher frequency = higher priority.
    for count in range(len(nums), 0, -1):
        for num in buckets[count]:
            result.append(num)

            if len(result) == k:
                return result
```

---

## Why Bucket Sort is O(n)

There are three relevant operations.

### Frequency counting

Each element is processed once:

O(n)O(n)

### Building buckets

There are at most `d <= n` distinct elements:

O(d)O(d)

### Scanning buckets

There are `n + 1` possible frequencies:

O(n)O(n)

Therefore:

O(n+d+n)=O(n)O(n+d+n)=O(n)

So the total is:

O(n)\boxed{O(n)}

This is one of the important interview optimizations for LC 347.

---

# Which Approach Should You Use?

|Approach|Time|Auxiliary Space|Interview Value|
|---|--:|--:|---|
|Hash Map + Sort|$O(n + d\log d)$|$O(d)$|Simple baseline|
|Hash Map + Min-Heap|$O(n + d\log k)$|$O(d+k)$|**Best general Top-K pattern**|
|Bucket Sort|$O(n)$|$O(n)$|**Best asymptotic solution for this problem**|

Here:

- $n$ = number of array elements
    
- $d$ = number of distinct elements
    

### Interview recommendation

For **FAANG preparation**, know both:

> **Min-heap** → reusable Top-K pattern.

> **Bucket sort** → special optimization exploiting the fact that frequency is bounded by `n`.

If asked for the most general approach, lead with **Hash Map + Min-Heap**.

If asked for **O(n)** time, use **Bucket Sort**.

---

# Important Variation — When K Is Small

This is where the min-heap becomes particularly attractive.

Suppose:

```text
n = 1,000,000
d = 500,000
k = 5
```

Sorting all 500,000 frequencies costs approximately:

O(dlog⁡d)O(d\log d)

But a heap only keeps 5 elements:

O(dlog⁡5)O(d\log 5)

which is effectively:

O(d)O(d)

This is the essence of the **Top-K Heap Pattern**.

---

# Important Variations

## 1. Top K Frequent Words

Same basic problem, but tie-breaking matters.

For example, if two words have the same frequency, the lexicographically smaller word may need to come first.

The heap key must therefore incorporate **both frequency and lexical ordering**.

This is a common extension because it tests whether you understand that the heap's ordering must match the complete problem specification.

---

## 2. Kth Largest Element

This is the same heap idea without frequency counting.

For:

> Find the Kth largest element.

Use a **min-heap of size K**.

The root is the Kth largest after processing all elements.

So:

> **Top-K largest → min-heap of size K**

This is one of the most reusable heap patterns.

---

## 3. Top K Frequent Elements in a Stream

If elements arrive continuously and you need to maintain the current top `k`, a frequency map plus an appropriate heap can maintain candidates incrementally.

This introduces a broader **streaming / online Top-K** pattern.

---

# Common Mistakes / Quirks

## Mistake 1 — Using a max-heap of every element

You might build a max-heap containing all elements by frequency:

```text
d elements → heap
```

and then pop `k` times.

That works, but costs:

O(d+klog⁡d)O(d + k\log d)

and stores all heap entries.

A min-heap of size `k` is usually preferable when only the top `k` are needed:

O(dlog⁡k)O(d\log k)

---

## Mistake 2 — Using a min-heap of size `n`

The entire point of the optimization is:

```text
heap size = k
```

not:

```text
heap size = number of distinct elements
```

Keep only the candidates that could still belong to the final answer.

---

## Mistake 3 — Forgetting what the heap root represents

For this problem:

```text
min-heap
    ↓
root = smallest frequency among current top-k
```

This is what allows us to eject the weakest candidate.

A useful mental rule:

> **Want largest K → keep smallest K-candidate boundary → min-heap.**

---

## Mistake 4 — Assuming output must be sorted

LeetCode 347 explicitly allows the answer in any order.

Therefore:

```python
return [num for count, num in heap]
```

is valid even though the heap itself is not sorted.

---

# Complexity

For the **min-heap solution**:

Let:

- $n$ = total number of elements
    
- $d$ = number of distinct elements
    

### Time

Frequency counting:

O(n)O(n)

Heap processing:

O(dlog⁡k)O(d\log k)

Total:

O(n+dlog⁡k)\boxed{O(n+d\log k)}

Since $d \le n$:

O(nlog⁡k)\boxed{O(n\log k)}

is the commonly stated bound.

### Auxiliary Space

Frequency map:

O(d)O(d)

Heap:

O(k)O(k)

Result:

O(k)O(k)

If output space is excluded:

O(d+k)\boxed{O(d+k)}

If output is included:

O(d+k)\boxed{O(d+k)}

since the result itself is only `k` elements.

---

# Pythonic Way

`Counter` is the clean standard-library way to perform the frequency-counting part:

```python
from collections import Counter

freq = Counter(nums)
```

For a simple implementation, Python can also sort the frequency map directly:

```python
top_k = Counter(nums).most_common(k)
```

```python
from collections import Counter


def topKFrequent(nums, k):
    return [num for num, count in Counter(nums).most_common(k)]
```

This is excellent **production Python**, but for an algorithm interview it hides the underlying Top-K selection mechanism.

So remember:

```text
Counter.most_common(k)
        ↓
convenient API
        ↓
but understand:
Hash Map + Heap / selection logic
```

---

# Key Takeaways / Pattern Recognition

### The most important pattern

When you see:

> **"Find the Top K ..."**

immediately ask:

```text
Can I use a heap of size K?
```

Typical mappings:

|Problem|Heap|
|---|---|
|K largest elements|Min-heap|
|K smallest elements|Max-heap|
|K most frequent elements|Min-heap by frequency|
|Kth largest element|Min-heap|
|Kth smallest element|Max-heap|

### The central Top-K invariant

For a **Top-K largest** problem:

```text
Maintain K best candidates
        ↓
The weakest candidate must be easy to remove
        ↓
Use a MIN-heap
```

For LC 347 specifically:

```text
Array
  ↓
Frequency counting with Hash Map
  ↓
Top-K selection
  ↓
Min-Heap of size K
```

### Broader connection

This problem combines two fundamental interview patterns:

1. **Hash Map → frequency aggregation**
    
2. **Heap → maintain only the best K candidates**
    

The deeper lesson is:

> Don't sort everything when you only need the best `K` items.

That distinction between:

O(dlog⁡d)O(d\log d)

and:

O(dlog⁡k)O(d\log k)

is one of the most useful Top-K optimizations to recognize in interviews.

> **Memory hook:**  
> **Top K Frequent = Count → Min-Heap of K**  
> **Need O(n)? = Count → Frequency Buckets**


## Approach 4 — Quickselect on Frequency

Instead of using a heap to identify the top `k` frequencies, we can treat the problem as a **selection problem**.

After building the frequency map:

```text
(value, frequency)
```

we need to find the `k` elements having the largest frequencies.

This is analogous to **Kth Largest Element**:

> Find the boundary frequency such that everything above that boundary belongs to the top `k`.

### Why Quickselect?

Sorting all distinct elements by frequency costs:

O(dlog⁡d)O(d\log d)

where $d$ is the number of distinct elements.

Quickselect can partition the elements around a pivot and recursively work only on the side containing the desired boundary.

Its expected complexity is:

O(d)O(d)

giving expected:

O(n)O(n)

overall after frequency counting.

---

## Key Idea

Suppose:

```text
frequency pairs:

A → 5
B → 1
C → 3
D → 2
E → 4
```

and:

```text
k = 2
```

We want:

```text
A → 5
E → 4
```

If we partition by frequency, Quickselect can arrange the elements so that the `k` largest-frequency elements occupy one side.

Unlike sorting, Quickselect does **not** completely order that side.

It only guarantees that the required boundary has been found.

For Top-K largest, it is often easiest to partition so that:

```text
higher frequencies ← pivot → lower frequencies
```

and determine which side contains the `k` largest elements.

---

## Python Solution

```python
from collections import Counter
import random


def topKFrequent(nums, k):
    # Step 1: Count frequencies.
    freq = Counter(nums)

    # Convert to a list so that we can partition it in-place.
    items = list(freq.items())

    # We want the k largest frequencies.
    target = len(items) - k

    def partition(left, right, pivot_index):
        pivot_frequency = items[pivot_index][1]

        # Move pivot to the end.
        items[pivot_index], items[right] = (
            items[right],
            items[pivot_index]
        )

        store_index = left

        # Put elements with smaller frequency before the pivot.
        for i in range(left, right):
            if items[i][1] < pivot_frequency:
                items[i], items[store_index] = (
                    items[store_index],
                    items[i]
                )
                store_index += 1

        # Put pivot in its final partition position.
        items[store_index], items[right] = (
            items[right],
            items[store_index]
        )

        return store_index

    left, right = 0, len(items) - 1

    while left <= right:
        # Random pivot helps avoid consistently bad partitions.
        pivot_index = random.randint(left, right)

        pivot_position = partition(left, right, pivot_index)

        if pivot_position == target:
            break

        elif pivot_position < target:
            # The target lies in the right partition.
            left = pivot_position + 1

        else:
            # The target lies in the left partition.
            right = pivot_position - 1

    # Everything from target onward belongs to the
    # k largest-frequency elements.
    return [num for num, count in items[target:]]
```

---

## Dry Run

Suppose:

```text
freq = {
    1: 5,
    2: 1,
    3: 3,
    4: 2,
    5: 4
}

k = 2
```

There are:

d=5d = 5

distinct values.

We need the largest `2`, so the zero-based boundary is:

target=d−k=5−2=3target = d-k = 5-2 = 3

Conceptually, after Quickselect:

```text
index:   0   1   2   3   4
         ↓
items = [ ..., ..., ..., 4, 5]
                         ↑   ↑
                      top 2
```

The first three elements do not need to be sorted.

Only this property matters:

```text
indices >= target
        ↓
k largest frequencies
```

So the final two elements give:

```text
[1, 5]    # order can vary
```

---

## Why Quickselect Works

The important distinction from Quicksort is:

### Quicksort

Recursively processes **both** partitions.

```text
        pivot
       /     \
    sort     sort
```

Therefore, all elements become sorted.

### Quickselect

Only processes the partition containing the target index.

```text
        pivot
       /     \
      ?      recurse
```

or:

```text
      recurse       ?
```

Therefore, large portions of the array can be ignored.

This is what gives the expected linear selection time.

---

## Complexity

Let:

- $n$ = total number of elements in `nums`
    
- $d$ = number of distinct elements
    

Frequency counting:

O(n)O(n)

Quickselect:

O(d)expectedO(d) \quad \text{expected}

Therefore:

O(n)\boxed{O(n)}

expected time.

### Worst case

A poor sequence of pivots can repeatedly produce highly unbalanced partitions:

O(d2)O(d^2)

Thus:

O(n+d2)\boxed{O(n+d^2)}

worst case, usually stated as $O(n+d^2)$ overall.

Randomized pivot selection makes consistently bad behavior unlikely.

### Auxiliary Space

The frequency map and list of distinct elements require:

O(d)O(d)

The Quickselect partitioning itself is in-place.

So:

O(d)\boxed{O(d)}

auxiliary space.

The returned answer contains `k` elements, so including output:

O(d+k)\boxed{O(d+k)}

---

## Quickselect vs Min-Heap

|Approach|Expected Time|Worst Time|Extra Space|Main Pattern|
|---|--:|--:|--:|---|
|Sort|$O(n+d\log d)$|Same|$O(d)$|Sorting|
|Min-Heap|$O(n+d\log k)$|Same|$O(d+k)$|Top-K Heap|
|Bucket Sort|$O(n)$|$O(n)$|$O(n)$|Frequency Buckets|
|**Quickselect**|**$O(n)$**|**$O(n+d^2)$**|**$O(d)$**|Selection|

### Which one should I reach for?

**Min-heap:** best general-purpose Top-K pattern.

**Bucket sort:** best specialized solution when the key/rank range is bounded, as it is here because frequency $\le n$.

**Quickselect:** useful when the problem naturally reduces to finding a **Kth boundary** and you want expected linear-time selection.

---

## Important Interview Quirk

There is no need to fully sort the top `k` elements.

For example, if the frequencies are:

```text
10, 8, 9, 7
```

and `k = 3`, Quickselect may produce something like:

```text
7, 8, 9, 10
```

or:

```text
9, 10, 8, 7
```

The top three are not necessarily internally sorted.

That is completely fine because LC 347 accepts the result in **any order**.

---

## Pattern Recognition

This gives LC 347 four important solution patterns:

```text
Top K Frequent Elements
        │
        ├── Hash Map + Sorting
        │
        ├── Hash Map + Min-Heap
        │
        ├── Hash Map + Bucket Sort
        │
        └── Hash Map + Quickselect
```

The deeper connection is:

> **Heap, Bucket Sort, and Quickselect are three different ways of avoiding a full sort when you only need the top K.**

Quickselect is especially worth remembering as:

Top K→find Kth boundary→Quickselect\boxed{\text{Top K} \rightarrow \text{find Kth boundary} \rightarrow \text{Quickselect}}

For your FAANG notes, I would keep **Min-Heap, Bucket Sort, and Quickselect** as the three main approaches, with ordinary sorting presented only as the straightforward baseline.