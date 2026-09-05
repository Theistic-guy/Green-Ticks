---
Title: Longest Common Span with Same Sum in Binary Arrays
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
  - Hashing
Platform:
  - GFG
Difficulty: Hard
Other Tags:
  - GFG
  - Binary - 0 & 1
  - Longest
  - Subarray
Link: ""
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Longest Common Span with Same Sum in Binary Arrays

**Pattern:** 

**Idea:** 

**Variations** : 
+ [longest-subarray-with-equal-number-of-0s-and-1s](longest-subarray-with-equal-number-of-0s-and-1s.md)


---

## 💻 Code

```Python

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---

# Longest Common Span with Same Sum in Binary Arrays

**Tags:** #Arrays #PrefixSum #Hashing #HashMap #BinaryArray #DifferenceArray #Interview-Pattern #FAANG

## Problem Statement

Given two binary arrays `A` and `B` of the same length, find the **length of the longest span** (contiguous subarray) such that the sum of elements in both spans is equal.

**Example**

- `A = [0,1,0,0,0,0]`
    
- `B = [1,0,1,0,0,1]`
    

**Output:** `4`

> A **span** means the same index range in both arrays.

---

## Key Idea

Reduce the problem to **Longest Subarray with Sum = 0**.

Instead of comparing sums separately, build a **difference array**:

- `diff[i] = A[i] - B[i]`
    

Possible values:

- `0` → both equal
    
- `1` → `(1,0)`
    
- `-1` → `(0,1)`
    

For any span `(l...r)`:

**Sum(A) = Sum(B)**

is equivalent to:

**Sum(A) − Sum(B) = 0**

which becomes:

**Sum(diff) = 0**

Now the problem is identical to finding the **longest zero-sum subarray**.

---

## Intuition (The WHY)

Consider:

|A|0|1|0|0|
|---|---|---|---|---|
|B|1|0|1|0|
|Diff|-1|1|-1|0|

If a span has equal sums:

**Sum(A) = Sum(B)**

Subtract both sides:

**Sum(A − B) = 0**

Rather than tracking two prefix sums, one transformed array captures everything.

This is the reusable interview trick:

> **When two arrays are compared element-wise, think Difference Array + Prefix Sum.**

---

## Optimal Approach — Difference Array + Prefix HashMap

### Algorithm

1. Traverse both arrays simultaneously.
    
2. Compute the running prefix of `A[i] - B[i]`.
    
3. Store the **first occurrence** of every prefix.
    
4. If the same prefix appears again, the span between them has sum `0`.
    
5. Track the maximum length.
    

### Python Solution

```python
def longestCommonSum(A, B):
    first = {0: -1}
    prefix = 0
    ans = 0

    for i in range(len(A)):
        prefix += A[i] - B[i]

        if prefix in first:
            ans = max(ans, i - first[prefix])
        else:
            first[prefix] = i

    return ans
```

---

## Dry Run

**A = [0,1,0,0,0,0]**

**B = [1,0,1,0,0,1]**

Difference array:

|Index|A|B|Diff|Prefix|
|--:|--:|--:|--:|--:|
|-1|—|—|—|0|
|0|0|1|-1|-1|
|1|1|0|+1|0|
|2|0|1|-1|-1|
|3|0|0|0|-1|
|4|0|0|0|-1|
|5|0|1|-1|-2|

Repeated prefixes:

- Prefix `0` at indices `-1` and `1` → Length = `2`
    
- Prefix `-1` at indices `0` and `4` → Length = `4`
    

**Answer = 4**

The longest common span is:

```text
Indices: 1 → 4

A = [1,0,0,0]
B = [0,1,0,0]

Sum = 1 in both arrays
```

---

## Why Does Repeated Prefix Mean Equal Sums?

Let the prefix of the difference array be `P`.

If:

**P[i] = P[j]**

then:

**P[j] − P[i] = 0**

which means the sum of the difference array between those indices is zero:

**Sum(A) − Sum(B) = 0**

Therefore:

**Sum(A) = Sum(B)**

Exactly the condition we need.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

Space is due to the prefix hashmap.

---

## Relationship to Previous Problems

|Problem|Transformation|
|---|---|
|Equal 0s & 1s|`0 → -1`|
|Longest Sum = K|Prefix Sum|
|Count Sum = K|Prefix + Frequency|
|**Longest Common Span**|`A[i] - B[i]`|

Notice that all four problems reduce to the same underlying pattern:

> **Transform → Prefix Sum → HashMap**

Only the transformation changes.

---

## Common Mistakes

- Computing two separate prefix sums instead of using a difference array.
    
- Forgetting to initialize `{0: -1}`.
    
- Overwriting the first occurrence of a prefix.
    
- Assuming the arrays must contain only `0` and `1`—the same approach actually works for any integers.
    

---

## Key Takeaways / Pattern Recognition

- When comparing **two arrays over the same interval**, build a **difference array**.
    
- Equal sums immediately become a **zero-sum subarray** problem.
    
- Repeated prefix sums imply the intervening span has sum `0`.
    
- This is the natural extension of **Longest Subarray with Equal 0s and 1s**: instead of transforming one array, we transform **two arrays into one**.