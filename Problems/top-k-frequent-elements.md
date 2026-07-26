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
Platform:
  - Leetcode
Difficulty: Not Specified
Other Tags:
Link: "[Leetcode](https://leetcode.com/problems/top-k-frequent-elements/)"
---

# 🥇Top K Frequent Elements

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

If you give the Min-Heap approach, an Amazon interviewer will often ask: *"Can you optimize this to linear $O(N)$ time?"*

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
