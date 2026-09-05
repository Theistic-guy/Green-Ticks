---
Title: Sliding Window Maximum (Leetcode 239)
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
  - Sliding Window
  - Queue
  - Greedy
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Deque
  - Monotonic Queue
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Shortest Subarray with Sum at Least K (Leetcode 862)

**Pattern:**  prefix sum + monotonic deque

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
from collections import deque

def shortestSubarray(nums, k):
    n = len(nums)

    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    dq = deque()
    ans = n + 1

    for i in range(n + 1):

        while dq and prefix[i] - prefix[dq[0]] >= k:
            ans = min(ans, i - dq.popleft())

        while dq and prefix[dq[-1]] >= prefix[i]:
            dq.pop()

        dq.append(i)

    return ans if ans <= n else -1

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---


# Shortest Subarray with Sum at Least K (Leetcode 862)

**Tags:** #Arrays #PrefixSum #MonotonicQueue #Deque #SlidingWindow #Greedy #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given an integer array `nums` (can contain **negative numbers**) and an integer `K`, return the **length of the shortest non-empty subarray** whose sum is **at least K**. If no such subarray exists, return `-1`.

> The presence of **negative numbers** is what makes this problem significantly harder than ordinary sliding window problems.

---

## Why Sliding Window Fails

Sliding window relies on a monotonic property:

- Expanding → sum increases
    
- Shrinking → sum decreases
    

With negative numbers, this breaks.

**Example:**

```text
nums = [2, -1, 2], K = 3
```

Removing `-1` actually **increases** the sum, so there's no deterministic rule for moving pointers.

**Conclusion:** We need **Prefix Sum + Monotonic Deque**.

---

## Key Idea

Let the prefix sum array be:

- `P[0] = 0`
    
- `P[i] = sum of first i elements`
    

For a subarray `(j ... i-1)`:

**Subarray Sum = P[i] − P[j]**

We need:

**P[i] − P[j] ≥ K**

For every `i`, we want the **largest possible `j`** (closest to `i`) that still satisfies the inequality, because that minimizes:

**Length = i − j**

The deque efficiently maintains the best candidate prefix indices.

---

## Intuition (The WHY)

The deque stores **indices of prefix sums** in **increasing order of prefix values**.

Two observations make the algorithm work:

### 1. Front gives the shortest valid answer

If:

**P[i] − P[dq[0]] ≥ K**

then we've found a valid subarray.

Since `dq[0]` is the **earliest feasible prefix**, removing it may reveal an even later prefix that gives an even **shorter** subarray.

So we repeatedly pop from the front.

### 2. Larger prefix sums dominate smaller ones

Suppose:

|Index|Prefix|
|---|--:|
|2|8|
|5|6|

Index `5` is always better because:

- Smaller prefix sum (`6 < 8`)
    
- Later index (shorter distance)
    

The prefix `8` is permanently useless.

Therefore we remove it from the back.

This creates a **monotonically increasing deque of prefix sums**.

---

## Approach — Prefix Sum + Monotonic Deque

### Algorithm

1. Build prefix sums.
    
2. Iterate through each prefix index.
    
3. While the front forms a valid subarray, update the answer and pop it.
    
4. While the current prefix is smaller than the back's prefix, pop from the back.
    
5. Push the current index.
    

### Python Solution

```python
from collections import deque

def shortestSubarray(nums, k):
    n = len(nums)

    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    dq = deque()
    ans = n + 1

    for i in range(n + 1):

        while dq and prefix[i] - prefix[dq[0]] >= k:
            ans = min(ans, i - dq.popleft())

        while dq and prefix[dq[-1]] >= prefix[i]:
            dq.pop()

        dq.append(i)

    return ans if ans <= n else -1
```

---

## Dry Run

**nums = [2, -1, 2]**, `K = 3`

Prefix sums:

|Index|Prefix|
|---|--:|
|0|0|
|1|2|
|2|1|
|3|3|

Deque stores **indices**.

|i|Prefix|Action|Deque|
|---|--:|---|---|
|0|0|Push|[0]|
|1|2|Push|[0,1]|
|2|1|Remove 1, Push|[0,2]|
|3|3|Valid → Answer=3|[2,3]|

Result = **3**

Subarray:

```text
[2, -1, 2]
```

---

## Visualizing the Two While Loops

### First While → Find Valid Answers

```text
Current Prefix = 15

Deque Prefixes:

Index : 0   2   5
Prefix: 1   4   8
```

If `15 − 1 ≥ K`, then length is valid.

Pop it and try the next one:

```text
15 − 4 ≥ K ?
```

A later prefix may produce an even shorter answer.

### Second While → Remove Dominated Prefixes

```text
Current Prefix = 6

Deque Back Prefix = 9
```

Since `6 < 9`:

- Smaller prefix is always better.
    
- Current index is also later.
    

So prefix `9` is useless forever.

Pop it.

---

## Why the Deque Is Monotonic

The deque maintains:

```text
Prefix values:

2
5
8
11
```

When a new prefix `6` arrives:

```text
2
5
6
```

The `8` and `11` disappear because they are dominated.

This guarantees every prefix enters and leaves the deque **once**, giving linear complexity.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

- Prefix array: `O(n)`
    
- Deque: up to `O(n)`
    

---

## Important Variations

- **Leetcode 239** — Sliding Window Maximum → Monotonic deque over values.
    
- **Longest Subarray with Sum K** → Prefix sum + first occurrence hashmap.
    
- **Count Subarrays with Sum K** → Prefix sum + frequency hashmap.
    
- **Constrained Subsequence Sum** → Monotonic deque over DP values.
    

The reusable pattern is:

> **Prefix Sum + Monotonic Queue** whenever negatives destroy ordinary sliding window.

---

## Common Mistakes / Quirks

### 1. Forgetting the initial prefix `0`

Prefix array must start with:

```python
prefix[0] = 0
```

Otherwise subarrays beginning at index `0` are missed.

### 2. Using `>` instead of `>=`

The condition is:

```python
prefix[i] - prefix[dq[0]] >= k
```

Equal is also valid.

### 3. Removing from the back before checking the front

The correct order is:

1. Check valid answers (front)
    
2. Remove dominated prefixes (back)
    

Changing the order can discard candidates prematurely.

### 4. Storing prefix values instead of indices

Always store indices so the length can be computed as:

```python
i - dq[0]
```

---

## Key Takeaways / Pattern Recognition

- **Negative numbers + shortest/optimal subarray** → Think **Prefix Sum + Monotonic Deque**.
    
- The deque is monotonic **by prefix sum**, not by original array values.
    
- Front pops compute answers; back pops remove dominated candidates.
    
- This is the natural progression after mastering:
    
    - Prefix Sum + HashMap (count/longest)
        
    - Monotonic Deque (sliding maximum)
        
- Leetcode **862** is one of the highest-value FAANG problems because it combines both patterns into a single linear-time solution.