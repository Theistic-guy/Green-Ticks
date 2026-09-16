---
Title: Next Permutation (Leetcode 31)
Companies:
  - Amazon
  - Meta
  - Microsoft
  - Oracle
  - Apple
  - Google
  - Goldman Sachs
  - Uber
  - Bloomberg
  - ByteDance
  - tiktok
  - Adobe
  - DoorDash
  - Qualcomm
  - Salesforce
  - MakeMyTrip
Topics:
  - Arrays
  - Greedy
  - Two Pointers
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - P & C
  - Lexicographical
  - In-place
Link: https://leetcode.com/problems/next-permutation/description/
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Next Permutation (Leetcode 31)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def nextPermutation(nums):
    n = len(nums)

    # Step 1: Find pivot
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1

    # Step 2: Find successor
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]

    # Step 3: Reverse suffix
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---


# Next Permutation (Leetcode 31)

**Tags:** #Arrays #Greedy #TwoPointers #Permutation #InPlace #LexicographicalOrder #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given an array of integers representing a permutation, rearrange it into the **next lexicographically greater permutation**.

If no such permutation exists (the current permutation is the largest), rearrange it into the **smallest permutation** (ascending order).

The modification must be **in-place**.

**Examples**

|Input|Output|
|---|---|
|`[1,2,3]`|`[1,3,2]`|
|`[1,3,2]`|`[2,1,3]`|
|`[3,2,1]`|`[1,2,3]`|
|`[1,1,5]`|`[1,5,1]`|

---

## Lexicographical Order

Think of permutations exactly like dictionary ordering.

```text
123
132
213
231
312
321
```

The goal is to move to the **immediate next** permutation—not just any larger one.

---

## Key Idea

The algorithm is based on one observation:

> **The longest non-increasing suffix is already the largest possible arrangement.**

Therefore:

1. Find the **pivot** (first increasing pair from the right).
    
2. Find the **smallest element greater than the pivot**.
    
3. Swap them.
    
4. Reverse the suffix.
    

This is a greedy algorithm that makes the **smallest possible increase**.

---

## Intuition (The WHY)

Consider:

```text
1 2 7 4 3 1
```

Scan from right.

The suffix:

```text
7 4 3 1
```

is strictly decreasing, meaning it is already the **largest ordering** of those elements.

The first place we can increase is:

```text
1 2 | 7 4 3 1
    ↑ pivot = 2
```

Now replace `2` with the **next larger** element (`3`), not `7`, because we want the immediate next permutation.

Result after swap:

```text
1 3 7 4 2 1
```

The suffix is still decreasing.

Reverse it:

```text
1 3 1 2 4 7
```

This is the smallest arrangement greater than the original.

---

## Step 1 — Find the Pivot

Traverse from right until:

```text
1 2 7 4 3 1
      ↑
```

Pivot index = **1**

If no pivot exists, the array is entirely decreasing.

Example:

```text
3 2 1
```

Answer becomes:

```text
1 2 3
```

---

## Step 2 — Find the Successor

Find the **rightmost element greater than the pivot**.

```text
1 2 7 4 3 1
          ↑
```

Choose `3`, not `4` or `7`.

Why rightmost?

Because the suffix is decreasing, the first greater element from the end is automatically the **smallest valid successor**.

---

## Step 3 — Swap

```text
Before:
1 2 7 4 3 1

Swap:

1 3 7 4 2 1
```

The prefix has now become minimally larger.

---

## Step 4 — Reverse the Suffix

Current suffix:

```text
7 4 2 1
```

It is decreasing.

Reversing gives:

```text
1 2 4 7
```

Final answer:

```text
1 3 1 2 4 7
```

This is the smallest lexicographically valid suffix.

---

## Why Reversal Works

After swapping, the suffix **remains decreasing**.

A decreasing sequence reversed becomes ascending:

```text
9 7 5 3

↓

3 5 7 9
```

Ascending order is the **smallest possible arrangement**, which ensures we obtain the **immediate** next permutation.

---

## Optimal In-Place Algorithm

### Python Solution

```python
def nextPermutation(nums):
    n = len(nums)

    # Step 1: Find pivot
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1

    # Step 2: Find successor
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]

    # Step 3: Reverse suffix
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
```

---

## Dry Run

**Input**

```text
[1,3,2]
```

### Find Pivot

```text
1 3 2
↑
```

Pivot = `1`

### Find Successor

```text
1 3 2
    ↑
```

Successor = `2`

### Swap

```text
2 3 1
```

### Reverse Suffix

```text
2 1 3
```

Answer:

```text
[2,1,3]
```

---

## Correctness (Greedy Proof)

The algorithm makes the **smallest possible increase**.

1. **Pivot** is the rightmost position that can be increased.
    
2. **Successor** is the smallest value larger than the pivot.
    
3. **Reversing** the suffix produces the minimum possible arrangement afterward.
    

Any other choice would either:

- increase an earlier digit (too large), or
    
- arrange the suffix in a larger order.
    

Hence this is the immediate next permutation.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(1)**|

All operations are linear and performed in-place.

---

## Common Mistakes

### 1. Choosing the First Greater Element

Wrong:

```text
1 2 7 4 3 1
      ↑ choose 7
```

Correct successor is the **smallest greater**, which is `3`.

### 2. Sorting Instead of Reversing

After swapping, the suffix is already decreasing.

Sorting works but costs:

Reversal is:

### 3. Forgetting the Entirely Decreasing Case

Input:

```text
3 2 1
```

No pivot exists.

Reverse the whole array:

```text
1 2 3
```

---

## Pattern Recognition

|Observation|Action|
|---|---|
|Longest decreasing suffix|Already maximum|
|Rightmost increasing pair|Pivot|
|Smallest larger element|Successor|
|Decreasing suffix|Reverse to ascending|

The reusable interview insight is:

> **When asked for the next lexicographical arrangement, modify the array as far right as possible and make the remaining suffix as small as possible.**

This greedy structure appears in many permutation and lexicographical-order problems.