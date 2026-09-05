---
Title: Longest Subarray with Equal Number of 0s and 1s
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
  - Hashing
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Subarray
  - Longest
  - Binary - 0 & 1
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Longest Subarray with Equal Number of 0s and 1s (LC 525)

**Pattern:** 

**Idea:** 

**Variations** : 
+ [longest-subarray-with-given-sum](longest-subarray-with-given-sum.md)


---

## 💻 Code

```Python
def findMaxLength(nums):
    first = {0: -1}      # prefix 0 before array starts
    prefix = 0
    ans = 0

    for i, x in enumerate(nums):
        prefix += 1 if x == 1 else -1

        if prefix in first:
            ans = max(ans, i - first[prefix])
        else:
            first[prefix] = i

    return ans
  
```
**Time complexity** - O(n) 

**Aux. Space complexity** -  O(n)

---


# Longest Subarray with Equal Number of 0s and 1s

**Tags:** #Arrays #PrefixSum #Hashing #HashMap #BinaryArray #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a binary array `nums` containing only `0`s and `1`s, return the **length of the longest contiguous subarray** having an equal number of `0`s and `1`s.

**Example**

- Input: `[0,1,0,1,1,0,0]`
    
- Output: `6`
    

---

## Key Idea

Convert the problem into **Longest Subarray with Sum = 0**.

Replace every:

- `0 → -1`
    
- `1 → +1`
    

Now an equal number of `0`s and `1`s means the transformed subarray sums to **0**.

This becomes the exact same problem as **Longest Subarray with Given Sum (K = 0)**.

---

## Intuition (The WHY)

Original array:

```text
0  1  0  1
```

Transform it:

```text
-1 +1 -1 +1
```

Sum of the entire array:

−1+1−1+1=0-1 + 1 -1 + 1 = 0

Every `0` contributes `-1` and every `1` contributes `+1`. Therefore:

- Equal `0`s and `1`s ⇒ total sum is `0`
    
- Unequal counts ⇒ non-zero sum
    

This elegant transformation is the entire trick.

---

## Optimal Approach — Prefix Sum + First Occurrence HashMap

### Algorithm

1. Treat `0` as `-1`.
    
2. Maintain a running prefix sum.
    
3. If the same prefix sum appears again, the subarray between them has sum `0`.
    
4. Store only the **first occurrence** of each prefix to maximize length.
    

### Python Solution

```python
def findMaxLength(nums):
    first = {0: -1}      # prefix 0 before array starts
    prefix = 0
    ans = 0

    for i, x in enumerate(nums):
        prefix += 1 if x == 1 else -1

        if prefix in first:
            ans = max(ans, i - first[prefix])
        else:
            first[prefix] = i

    return ans
```

---

## Dry Run

**Input:** `[0,1,0,1,1,0,0]`

After transformation:

```text
[-1, +1, -1, +1, +1, -1, -1]
```

|Index|Value|Prefix|First Seen|Max Length|
|--:|--:|--:|--:|--:|
|-1|—|0|-1|0|
|0|-1|-1|Store|0|
|1|+1|0|-1|2|
|2|-1|-1|0|2|
|3|+1|0|-1|4|
|4|+1|1|Store|4|
|5|-1|0|-1|6|
|6|-1|-1|0|6|

**Answer = 6**

The longest valid subarray is:

```text
[1,0,1,1,0,0]
```

---

## Why `first = {0: -1}`?

Consider:

```text
nums = [0,1]
```

Transformed:

```text
[-1,+1]
```

At index `1`:

- Prefix = `0`
    
- Length = `1 - (-1) = 2`
    

Without initializing `{0: -1}`, we'd miss subarrays starting from index `0`.

---

## Why Store Only the First Occurrence?

Suppose prefix `-1` appears at:

|Prefix|Index|
|---|--:|
|-1|0|
|-1|4|

Current index = `8`

Using index `0` gives length `8`, while using index `4` gives only `4`.

The earliest occurrence always maximizes the answer.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

Space excludes the input array.

---

## Important Variations

- **Longest Subarray with Sum = 0** → Identical algorithm.
    
- **Longest Subarray with Sum = K** → Store first prefix occurrence.
    
- **Count Subarrays with Equal 0s and 1s** → Same transformation, but store **frequencies** instead of first indices.
    

---

## Common Mistakes

- Forgetting to convert `0` into `-1`.
    
- Initializing the hashmap as `{}` instead of `{0: -1}`.
    
- Overwriting an existing prefix index, which loses the longest answer.
    
- Confusing this with the counting version (frequency hashmap).
    

---

## Key Takeaways / Pattern Recognition

- **Equal number of two categories** often suggests assigning opposite weights (`+1` and `-1`).
    
- Binary arrays with equal `0`s and `1`s reduce directly to **Longest Zero-Sum Subarray**.
    
- The reusable interview pattern is:
    

> **Transform → Prefix Sum → First Occurrence HashMap**