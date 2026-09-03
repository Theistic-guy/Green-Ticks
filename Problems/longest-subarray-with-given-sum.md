---
Title: Longest Subarray With Given Sum
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
  - Hashing
  - Sliding Window
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - Subarray
  - Longest
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Longest Subarray With Given Sum

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def isPalindrome(x):
    if x < 0:
        return False

    original = x
    rev = 0

    while x > 0:
        digit = x % 10
        rev = rev * 10 + digit
        x //= 10

    return original == rev

```
**Time complexity** - O(D) , D is no of digits

**Aux. Space complexity** -  O(1)

---

# Longest Subarray with Given Sum

**Tags:** #Arrays #Hashing #PrefixSum #SlidingWindow #TwoPointers #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given an array `arr` and an integer `K`, find the **length of the longest contiguous subarray** whose sum equals `K`.

> The array may contain **positive, negative, and zero** values.

---

## Key Idea

Use **Prefix Sum + HashMap**.

Let:

- `prefix[i]` = sum of elements from index `0` to `i`
    

For any subarray `(l...r)`:

**sum(l,r) = prefix[r] − prefix[l−1]**

Rearranging gives:

**prefix[l−1] = prefix[r] − K**

So while scanning the array, if we've already seen a prefix sum equal to `current_prefix − K`, then a valid subarray exists.

**Store the first occurrence of every prefix sum** to maximize the length.

---

## Intuition (Why It Works)

Suppose the current prefix sum is **12** and we need a subarray summing to **5**.

Then we need a previous prefix sum of:

**12 − 5 = 7**

If prefix `7` first appeared at index `2` and we're currently at index `8`, then:

- Subarray = `(3...8)`
    
- Length = `8 − 2 = 6`
    

The earliest occurrence always gives the longest possible subarray, so we never overwrite an existing prefix sum.

---

## Optimal Approach — Prefix Sum + HashMap

### Algorithm

1. Maintain a running prefix sum.
    
2. Store the **first index** of every prefix sum.
    
3. At each index:
    
    - If `prefix == K`, update answer with `i + 1`.
        
    - Check whether `prefix − K` exists.
        
    - Update the maximum length.
        
4. Insert the prefix only if it hasn't appeared before.
    

### Python Solution

```python
def longestSubarray(arr, k):
    first_index = {}
    prefix = 0
    max_len = 0

    for i, num in enumerate(arr):
        prefix += num

        if prefix == k:
            max_len = i + 1

        if (prefix - k) in first_index:
            max_len = max(max_len, i - first_index[prefix - k])

        if prefix not in first_index:
            first_index[prefix] = i

    return max_len
```

---

## Dry Run

**Array:** `[2, 3, 5, -5, 4, 1, 2]`

**K = 5**

|Index|Value|Prefix|Need (`prefix-K`)|Max Length|
|---|--:|--:|--:|--:|
|0|2|2|-3|0|
|1|3|5|0|2|
|2|5|10|5|2|
|3|-5|5|0|4|
|4|4|9|4|4|
|5|1|10|5|4|
|6|2|12|7|4|

**Longest subarray:** `[3, 5, -5, 4]`

**Answer = 4**

---

## Why We Never Overwrite

Suppose prefix sum `5` appears twice:

|Prefix|Index|
|---|--:|
|5|1|
|5|3|

Later, at index `8`:

- Using index **1** → length = **7**
    
- Using index **3** → length = **5**
    

Hence:

```python
if prefix not in first_index:
    first_index[prefix] = i
```

This preserves the earliest occurrence.

---

## Sliding Window Variant (Positive Numbers Only)

If every element is positive, the window sum changes monotonically.

```python
def longestSubarrayPositive(arr, k):
    left = 0
    total = 0
    ans = 0

    for right in range(len(arr)):
        total += arr[right]

        while total > k:
            total -= arr[left]
            left += 1

        if total == k:
            ans = max(ans, right - left + 1)

    return ans
```

> **Do not use this when negative numbers are present.**

---

## Complexity

|Approach|Time|Auxiliary Space|
|---|--:|--:|
|Prefix Sum + HashMap|**O(n)**|**O(n)**|
|Sliding Window (positive only)|**O(n)**|**O(1)**|

> Auxiliary space excludes the input array.

---

## Important Variations

1. **Count Subarrays with Sum = K** → Store frequencies instead of first index.
    
2. **Longest Subarray with Sum = 0** → Same algorithm with `K = 0`.
    
3. **Largest Subarray with Equal 0s and 1s** → Convert `0 → -1`, then find longest sum `0`.
    
4. **Positive-only arrays** → Replace hashing with Sliding Window.
    

---

## Common Mistakes

- Overwriting an existing prefix index.
    
- Forgetting to handle `prefix == K`.
    
- Using Sliding Window on arrays with negative values.
    
- Storing the latest occurrence instead of the first.
    

---

## Key Takeaways / Pattern Recognition

- **Mixed positive & negative** → Prefix Sum + HashMap.
    
- **Only positive** → Sliding Window.
    
- Longest subarray problems usually require storing the **earliest occurrence** of a prefix sum.
    
- Counting subarrays and longest subarrays use the **same prefix-sum identity**—only the hashmap's stored value changes (frequency vs first index).