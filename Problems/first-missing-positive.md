---
Title: First Missing Positive (LC 41)
Companies:
  - Amazon
  - Google
  - Meta
  - Microsoft
  - Uber
Topics:
  - Arrays
  - Sorting
  - Hashing
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Cyclic Sort / Placement
  - In-place Array Modification
Link: ""
---

# First Missing Positive

**Pattern:**  Cyclic sort related pattern

**Idea:** 

**Variations** : 
+ part of [Arrays as Functional Graphs](../Notes/Arrays%20as%20Functional%20Graphs.md)
+ [Cyclic-sort-and-placement](../Templates/Cyclic-sort-and-placement.md)

---

## 💻 Code

Watch : https://www.youtube.com/watch?v=8g78yfzMlao

```Python
def firstMissingPositive(nums):
    n = len(nums)

    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            correct = nums[i] - 1
            nums[i], nums[correct] = nums[correct], nums[i]

    for i in range(n):
        if nums[i] != i + 1:
            return i + 1

    return n + 1

```
**Time complexity** - O(n)
**Aux. Space complexity** -  O(1)

---
                              # First Missing Positive

**Tags:** #arrays #array-indexing #in-place #cyclic-sort #index-mapping #missing-number #positive-integers #constant-space #linear-time #hashing #sorting #sign-marking #constraints #leetcode-41 #boundary-conditions

> **LeetCode 41 — Hard**
> 
> Core pattern: **Use the array itself as a hash table by mapping value `x` to index `x - 1`.**

---

## Problem

Given an unsorted integer array, find the **smallest positive integer that does not appear** in the array.

Example:

```text
[3, 4, -1, 1] → 2
[1, 2, 0]     → 3
[7, 8, 9]     → 1
```

Required:

- $O(n)$ time
    
- $O(1)$ auxiliary space
    

---

## Key Idea

The answer must be somewhere in:

$$  
[1, n+1]  
$$

where `n = len(nums)`.

Why?

For an array of length `n`:

- If `1` is missing → answer is `1`.
    
- If all `1...n` are present → answer is `n+1`.
    
- Therefore, nothing outside `[1, n+1]` can be the first missing positive.
    

This gives us a crucial observation:

> **Value `x` belongs at index `x - 1`.**

So conceptually:

```text
value:   1  2  3  4  5
index:   0  1  2  3  4
```

We want to rearrange the array so that:

```text
nums[i] == i + 1
```

whenever that value exists.

---

# Approach — Cyclic Placement

For every number `x` satisfying:

$$  
1 \le x \le n  
$$

place it at:

```python
index = x - 1
```

Keep swapping until the current value is either:

- already in its correct position, or
    
- outside the useful range, or
    
- blocked by a duplicate.
    

Then scan the array.

The first index where:

```python
nums[i] != i + 1
```

means:

$$  
\boxed{i+1}  
$$

is missing.

---

## Why Ignore Values Outside `[1, n]`?

Suppose:

```text
n = 4
```

The answer can only be:

```text
1, 2, 3, 4, or 5
```

But a value such as:

```text
-7, 0, 100
```

cannot help establish the presence of any number from `1` to `4`.

So during rearrangement we only care about:

```text
1 <= nums[i] <= n
```

---

# Python Solution

```python
def firstMissingPositive(nums):
    n = len(nums)

    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            correct = nums[i] - 1
            nums[i], nums[correct] = nums[correct], nums[i]

    for i in range(n):
        if nums[i] != i + 1:
            return i + 1

    return n + 1
```

---

## The Most Important Condition

This line is doing a lot:

```python
while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
```

Break it into two ideas.

### 1. Is the value useful?

```python
1 <= nums[i] <= n
```

Only values that have a corresponding index matter.

### 2. Is the destination already occupied by the same value?

```python
nums[nums[i] - 1] != nums[i]
```

This prevents an infinite loop when duplicates exist.

For example:

```text
[1, 1]
```

Trying to place the second `1` at index `0` would otherwise repeatedly swap identical values.

---

# Dry Run

Consider:

```text
nums = [3, 4, -1, 1]
```

### Start

```text
index:  0   1   2   3
value:  3   4  -1   1
```

At index `0`:

```text
3 → should go to index 2
```

Swap:

```text
[-1, 4, 3, 1]
```

`-1` is irrelevant.

At index `1`:

```text
4 → should go to index 3
```

Swap:

```text
[-1, 1, 3, 4]
```

At index `1`:

```text
1 → should go to index 0
```

Swap:

```text
[1, -1, 3, 4]
```

Now scan:

```text
index:  0   1   2   3
value:  1  -1   3   4
        ✓   ✗
```

At index `1`:

```text
expected = 2
actual   = -1
```

Therefore:

$$  
\boxed{2}  
$$

---

# Why Is It $O(n)$ Despite the Nested `while`?

This is a classic interview concern.

At first glance:

```python
for i in range(n):
    while ...:
```

looks like $O(n^2)$.

But it is actually:

$$  
\boxed{O(n)}  
$$

because every successful swap places a useful value into its correct position.

There can be only $O(n)$ such successful placements.

So across the **entire algorithm**, the total number of swaps is linear.

This is the same amortized-analysis intuition behind many cyclic-placement algorithms.

---

## Complexity

Let $n$ be the array length.

- **Time Complexity:** $\boxed{O(n)}$
    
- **Auxiliary Space Complexity:** $\boxed{O(1)}$
    

The input array is modified **in-place**.

---

# Alternative Understanding — Treat the Array as a Hash Table

Another way to think about the algorithm:

Normally, to answer:

> "Does value `x` exist?"

we might use:

```text
Hash Set
```

requiring $O(n)$ extra space.

Instead, exploit the fact that values `1...n` have natural indices:

```text
value 1 → index 0
value 2 → index 1
value 3 → index 2
...
```

So the array itself becomes our hash table.

```text
Value x
   ↓
Index x - 1
```

This is the deeper pattern:

$$  
\boxed{\text{Value range maps naturally to indices}}  
$$

→ **use the input array as storage.**

---

# Another Common Solution — Sign Marking

There is another $O(n)$ / $O(1)$ technique.

First replace irrelevant values with something harmless:

```python
for i in range(n):
    if nums[i] <= 0 or nums[i] > n:
        nums[i] = n + 1
```

Then use the sign of an index as a "seen" marker:

```python
for x in nums:
    x = abs(x)

    if x <= n:
        nums[x - 1] = -abs(nums[x - 1])
```

Finally:

```python
for i in range(n):
    if nums[i] > 0:
        return i + 1

return n + 1
```

Complete version:

```python
def firstMissingPositive(nums):
    n = len(nums)

    for i in range(n):
        if nums[i] <= 0 or nums[i] > n:
            nums[i] = n + 1

    for x in nums:
        x = abs(x)

        if x <= n:
            nums[x - 1] = -abs(nums[x - 1])

    for i in range(n):
        if nums[i] > 0:
            return i + 1

    return n + 1
```

### Complexity

- Time: $O(n)$
    
- Auxiliary Space: $O(1)$
    
- Modifies input.
    

---

# Which Solution Should You Prefer?

### ⭐ Cyclic Placement

Prefer this when you recognize:

> **"Values `1...n` naturally correspond to indices."**

It is conceptually similar to **Cyclic Sort** and is often easier to reason about once learned.

### Sign Marking

Useful when the problem naturally asks:

> **"Which values appeared?"**

and you want to encode a boolean `seen` state directly into the array.

Both are interview-valid.

---

# Important Connection: Cyclic Sort Pattern

This problem is an excellent example of the broader **Cyclic Sort / Index Placement** family.

Whenever you have:

```text
n elements
values constrained to a range related to [1,n]
```

ask:

> **Can each value tell me exactly where it belongs?**

For example:

```text
value x
   ↓
index x - 1
```

Then you may be able to solve problems involving:

- missing numbers
    
- duplicate numbers
    
- all duplicates
    
- first missing positive
    
- finding disappeared values
    

using in-place index mapping.

---

# Important Variations

### ⭐ Must Know

#### Find All Numbers Disappeared in an Array — LC 448

Values are in `[1,n]`.

Can use:

```text
index ↔ value mapping
```

with either:

- cyclic placement
    
- sign marking
    

---

#### Find the Duplicate Number — LC 287

Special constraints:

```text
n + 1 elements
values in [1,n]
```

Possible solutions include:

- Floyd Cycle Detection
    
- Binary Search on Value + Counting
    

**Important distinction:** don't automatically use cyclic placement because LC 287 explicitly requires the array to remain unmodified and $O(1)$ space.

---

#### Find All Duplicates in an Array — LC 442

Again:

```text
values ∈ [1,n]
```

This is a natural **in-place marking/index-mapping** problem.

---

### Useful General Pattern

Whenever:

```text
value range ≈ index range
```

consider:

```text
value → index
```

before reaching for a Hash Map.

---

# Common Mistakes / Quirks

### 1. Returning `n`

Wrong.

If:

```text
[1, 2, 3]
```

then all `1...n` exist.

The first missing positive is:

$$  
n+1=4  
$$

---

### 2. Trying to sort

Sorting gives:

$$  
O(n\log n)  
$$

but the problem requires $O(n)$.

The special value/index relationship is there specifically to enable an in-place linear solution.

---

### 3. Forgetting duplicates

Consider:

```text
[1, 1]
```

The second `1` cannot be placed into index `0` because that position already contains `1`.

Hence:

```python
nums[nums[i] - 1] != nums[i]
```

is crucial.

---

### 4. Using `abs()` carelessly in sign marking

Once you start modifying signs, always use:

```python
x = abs(nums[i])
```

before interpreting the value as an index.

---

### 5. Negative numbers and zero are irrelevant

They cannot be the answer and don't correspond to useful positive indices.

---

# Pattern Recognition

When you see:

> **Find missing/duplicate values where the values are constrained to `[1,n]` or a closely related range.**

Don't immediately reach for a Hash Set.

First ask:

```text
Can value X map naturally to index X - 1?
            ↓
       YES
            ↓
Can I use the array itself
as storage / visited state?
            ↓
       YES
            ↓
In-place index mapping
Cyclic placement / Sign marking
```

### Mental hook

> **"If the values already tell me which index they belong to, use the array as its own hash table."**

And remember the broader family:

```text
Value → Index
   ↓
In-place representation
   ↓
Missing / Duplicate / Seen-state problems
```

This is one of the most reusable array tricks for interviews.