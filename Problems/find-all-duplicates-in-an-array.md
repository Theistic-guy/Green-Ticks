---
Title: Find All Duplicates in an Array (LC 442)
Companies:
  - Amazon
  - Meta
  - Microsoft
Topics:
  - Arrays
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - In-place Array Modification
  - Cyclic Sort / Placement
  - Duplicates
Link: ""
---

# Find All Duplicates in an Array

**Pattern:**  In place array modification

**Idea:** 

**Variations** : 
+ [Arrays as Functional Graphs](../Notes/Arrays%20as%20Functional%20Graphs.md)
---

## 💻 Code

```Python
def findDuplicates(nums):
    result = []

    for x in nums:
        idx = abs(x) - 1

        if nums[idx] < 0:
            result.append(abs(x))
        else:
            nums[idx] = -nums[idx]

    return result

```
**Time complexity** - O(n)
**Aux. Space complexity** -  O(1)

---
# Find All Duplicates in an Array



> **LeetCode 442**
> 
> Core pattern: **Use the value `x` as an index `x - 1` and encode whether that value has been seen.**

---

## Problem

Given an integer array `nums` of length `n` where:

$$  
1 \le nums[i] \le n  
$$

and every integer appears **once or twice**, return all values that appear exactly twice.

Example:

```text
[4,3,2,7,8,2,3,1]
        ↓
duplicates = [2,3]
```

Required:

- $O(n)$ time
    
- $O(1)$ auxiliary space, excluding the output
    
- Input modification is allowed.
    

---

## Key Idea

The values themselves give us a natural index:

```text
value 1 → index 0
value 2 → index 1
value 3 → index 2
...
value x → index x - 1
```

So instead of maintaining:

```text
seen = set()
```

we can use the **sign of `nums[x - 1]` as the visited marker**.

### Encoding

When we encounter value `x`:

```python
idx = x - 1
```

- If `nums[idx] > 0` → first time seeing `x`
    
- If `nums[idx] < 0` → `x` has already appeared → duplicate
    

This turns the array into its own **visited-state table**.

---

# Approach — Negative Marking

For every value `x`:

1. Convert it to a positive value using `abs()`.
    
2. Find its corresponding index:
    
    ```python
    idx = x - 1
    ```
    
3. If `nums[idx]` is already negative:
    
    - `x` is a duplicate.
        
4. Otherwise:
    
    - negate `nums[idx]` to mark `x` as seen.
        

---

## Python Solution

```python
def findDuplicates(nums):
    result = []

    for x in nums:
        idx = abs(x) - 1

        if nums[idx] < 0:
            result.append(abs(x))
        else:
            nums[idx] = -nums[idx]

    return result
```

---

## Why `abs()` Is Essential

Suppose:

```text
nums = [4,3,2,7,8,2,3,1]
```

After processing some elements, the array might look like:

```text
[-4, -3, -2, 7, -8, 2, 3, 1]
```

The sign has now been modified, so the value itself cannot always be trusted directly.

For example:

```python
x = -3
```

still represents the original value:

```text
3
```

Therefore:

```python
idx = abs(x) - 1
```

is required.

---

# Dry Run

Consider:

```text
nums = [4,3,2,7,8,2,3,1]
```

### Process `4`

```text
index = 4 - 1 = 3
```

`nums[3]` is positive → first occurrence.

Mark it:

```text
[4,3,2,-7,8,2,3,1]
```

### Process `3`

Mark index `2`:

```text
[4,3,-2,-7,8,2,3,1]
```

### Process `2`

Mark index `1`:

```text
[4,-3,-2,-7,8,2,3,1]
```

Continue similarly.

When we encounter the second `2`:

```text
x = 2
idx = 1

nums[1] < 0
```

Therefore:

```text
2 is a duplicate
```

Later, the second `3` is detected in exactly the same way.

Result:

```text
[2, 3]
```

---

# Why This Works

Every value `x` has exactly one dedicated location:

$$  
index = x-1  
$$

The first occurrence of `x` changes that location from positive to negative.

Therefore, when `x` appears again:

$$  
nums[x-1] < 0  
$$

means:

> **"I have already encountered `x`."**

This is effectively a boolean `seen[x]` array implemented **inside the input array**.

---

## Complexity

Let $n = len(nums)$ and let $d$ be the number of duplicates.

- **Time Complexity:** $\boxed{O(n)}$
    
- **Auxiliary Space Complexity:** $\boxed{O(1)}$
    
- **Output Space:** $O(d)$
    

The output list is normally excluded from auxiliary-space complexity.

---

# Alternative — Hash Set

The straightforward solution is:

```python
def findDuplicates(nums):
    seen = set()
    result = []

    for x in nums:
        if x in seen:
            result.append(x)
        else:
            seen.add(x)

    return result
```

### Complexity

- Time: $O(n)$ average
    
- Auxiliary Space: $O(n)$
    

This is perfectly reasonable if extra space is allowed.

But LC 442's interesting constraint is the $O(1)$ auxiliary-space requirement, which motivates the in-place solution.

---

# Connection to First Missing Positive

This problem is directly related to **LC 41 — First Missing Positive**.

Both exploit:

$$  
\boxed{value\ x \rightarrow index\ x-1}  
$$

### First Missing Positive

Uses **placement**:

```text
value x
   ↓
put x at index x-1
```

Then:

```text
nums[i] != i+1
```

reveals the missing value.

### Find All Duplicates

Uses **sign marking**:

```text
value x
   ↓
look at index x-1
   ↓
positive → first occurrence
negative → duplicate
```

So:

> **Same value-to-index mapping, different information encoded at that index.**

---

# The Bigger Pattern: Array as a Hash Table

This is the important interview takeaway.

Normally:

```text
seen[x] = True
```

would require an external array/set.

But if:

$$  
1 \le x \le n  
$$

then `x` already gives us a valid array index.

So:

```text
value
  ↓
x - 1
  ↓
input array
  ↓
store state there
```

This lets us trade **input modification** for **auxiliary memory**.

---

## Three Ways to Exploit Value → Index

|Technique|What is encoded?|Example|
|---|---|---|
|Cyclic placement|Correct position|LC 41|
|Sign marking|Seen/not seen|LC 442|
|In-place swapping|Position/frequency structure|Cyclic Sort family|

This is a pattern worth recognizing independently of these particular problems.

---

# Important Variations

### ⭐ Find All Numbers Disappeared in an Array — LC 448

Same constraints:

$$  
1 \le nums[i] \le n  
$$

Use the exact same sign-marking idea.

Difference:

- LC 442 → find values whose positions become negative **when encountered again**
    
- LC 448 → after marking, values whose positions remain **positive** are missing.
    

So these two problems are almost mirror images.

---

### ⭐ Find the Duplicate Number — LC 287

Also involves values in `[1,n]`, but the constraints are different:

- exactly one duplicated value
    
- array cannot be modified
    
- $O(1)$ auxiliary space
    

This is where **Floyd's Cycle Detection** becomes important.

Don't automatically use sign marking when the input must remain unchanged.

---

### ⭐ First Missing Positive — LC 41

Uses the same value-to-index relationship but performs **cyclic placement** instead of sign marking.

---

# Common Mistakes / Quirks

### 1. Forgetting `abs()`

Incorrect:

```python
idx = x - 1
```

after the array has been modified.

Correct:

```python
idx = abs(x) - 1
```

---

### 2. Returning the negative value

If:

```python
x = -3
```

the original value is `3`.

Always use:

```python
abs(x)
```

when adding to the result.

---

### 3. Counting the same duplicate more than once

Because every value appears at most twice, the negative-marker method adds each duplicate exactly once.

If arbitrary values could appear **three or more times**, this implementation would append the value on every occurrence after the first.

That would be a different problem.

---

### 4. Ignoring the constraint that values are in `[1,n]`

The trick works because:

```text
value x → index x-1
```

is guaranteed to be a valid index.

Without that constraint, you need another technique.

---

# A Useful Generalization

When you see:

> "Every value lies in `[1,n]` and we need to determine whether values appeared."

Ask:

```text
Can I use x - 1 as an index?
        ↓
       YES
        ↓
Can I modify the input?
        ↓
       YES
        ↓
Use the array itself as
a visited/frequency structure.
```

This can lead to:

- sign marking
    
- cyclic placement
    
- swapping
    
- index encoding
    

instead of using a Hash Set or frequency array.

---

# Pattern Recognition

The most important thing to carry forward is **not the exact code**.

Recognize this structural signal:

```text
Values constrained to [1,n]
             +
Need to track occurrence / position
             +
Input modification allowed
             ↓
    VALUE → INDEX MAPPING
             ↓
Use the array itself as storage
```

For LC 442 specifically:

```text
value x
   ↓
index x - 1
   ↓
is nums[x-1] negative?
   ↓
YES → duplicate
NO  → mark negative
```

### Mental hook

> **"If values are `1...n`, the array already contains a free hash table: use `x - 1` as the bucket and encode `seen` using the sign."**