---
Title: Count Subarrays with Given Sum
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
  - Hashing
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Subarray
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Count Subarrays with Given Sum

**Pattern:**  prefix - k in hash map

**Idea:** 

**Variations** : 
+ count nice subarrays [8. Count Nice Subarrays (LeetCode 1248)](../Notes/Subarray%20with%20Given%20Sum%20—%20Important%20Interview%20Variations%20(Solutions).md#8.%20Count%20Nice%20Subarrays%20(LeetCode%201248))

---

## 💻 Code

```Python
from collections import defaultdict

def countSubarrays(arr, k):
    freq = defaultdict(int)
    freq[0] = 1

    prefix = 0
    count = 0

    for num in arr:
        prefix += num
        count += freq[prefix - k]
        freq[prefix] += 1

    return count
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---

# Count Subarrays with Given Sum

**Tags:** #Arrays #PrefixSum #Hashing #HashMap #CumulativeSum #LeetCode #FAANG

## Problem Statement

Given an integer array `arr` and an integer `K`, return the **number of contiguous subarrays** whose sum equals `K`.

> Unlike the previous problem (longest subarray), here we must count **all possible** valid subarrays.

---

## Key Idea

Use **Prefix Sum + Frequency HashMap**.

Let the running prefix sum be:

- `prefix = arr[0] + arr[1] + ... + arr[i]`
    

A subarray ending at index `i` has sum `K` if:

**prefix − previous_prefix = K**

Rearrange:

**previous_prefix = prefix − K**

So at every index, we simply ask:

> **How many times has `(prefix - K)` appeared before?**

That count is exactly the number of valid subarrays ending at the current index.

---

## Intuition (Why It Works)

Suppose the prefix sums encountered so far are:

|Index|Prefix|
|---|--:|
|-1|0|
|0|2|
|1|5|
|2|7|
|3|5|

Current prefix = **10**, and `K = 5`.

Needed previous prefix:

**10 − 5 = 5**

Prefix sum `5` appeared **twice**, so there are **2 different subarrays** ending here whose sum is `5`.

This is why we store **frequencies**, not indices.

---

## Optimal Approach — Prefix Sum + HashMap

### Algorithm

1. Initialize a hashmap with `{0: 1}`.
    
2. Maintain a running prefix sum.
    
3. For every element:
    
    - Update the prefix sum.
        
    - Add `freq[prefix - K]` to the answer.
        
    - Increment the frequency of the current prefix.
        

The `{0:1}` represents the empty prefix before the array begins, allowing subarrays that start from index `0`.

### Python Solution

```python
from collections import defaultdict

def countSubarrays(arr, k):
    freq = defaultdict(int)
    freq[0] = 1

    prefix = 0
    count = 0

    for num in arr:
        prefix += num
        count += freq[prefix - k]
        freq[prefix] += 1

    return count
```

---

## Dry Run

**Array:** `[1, 2, 3, -2, 2]`

**K = 3**

|Element|Prefix|Needed|Previous Count|Answer|
|---|--:|--:|--:|--:|
|1|1|-2|0|0|
|2|3|0|1|1|
|3|6|3|1|2|
|-2|4|1|1|3|
|2|6|3|1|4|

Valid subarrays:

- `[1, 2]`
    
- `[3]`
    
- `[2, 3, -2]`
    
- `[3, -2, 2]`
    

**Answer = 4**

---

## Why `freq[0] = 1`?

Consider:

- Array = `[3]`
    
- `K = 3`
    

At the first element:

- Prefix = `3`
    
- Needed = `0`
    

Without storing one occurrence of prefix `0`, we'd miss the subarray starting from index `0`.

```python
freq = {0: 1}
```

This represents the **empty prefix** before the array starts.

---

## Longest vs Count — The Core Difference

|Problem|HashMap Stores|
|---|---|
|Longest Subarray = K|**First index** of prefix|
|Count Subarrays = K|**Frequency** of prefix|

Same prefix-sum identity, different information stored.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

> Space excludes the input array.

---

## Important Variations

1. **560. Subarray Sum Equals K** _(this problem)_
    
2. **Longest Subarray with Sum K** → Store first occurrence instead of frequency.
    
3. **Count Subarrays with Sum 0** → Simply set `K = 0`.
    
4. **Binary Array Sum = Goal** → Same algorithm works unchanged.
    

---

## Common Mistakes

- Forgetting to initialize `freq[0] = 1`.
    
- Updating the hashmap **before** counting, which incorrectly counts the current prefix as a previous one.
    
- Confusing frequency with first occurrence (mixing it with the longest-subarray problem).
    

Correct order:

```python
prefix += num
count += freq[prefix - k]
freq[prefix] += 1
```

---

## Pythonic Way

`defaultdict(int)` eliminates explicit existence checks:

```python
from collections import defaultdict

freq = defaultdict(int)
freq[0] = 1
```

This keeps the solution both concise and **O(1)** average for hashmap operations.

---

## Key Takeaways / Pattern Recognition

- Whenever you need to **count all subarrays** with a target sum, think **Prefix Sum + Frequency HashMap**.
    
- The expression **`prefix - K`** is the reusable interview pattern.
    
- Store **frequencies** for counting, **first indices** for longest-length problems.
    
- This pattern works even with **negative numbers**, where Sliding Window fails.