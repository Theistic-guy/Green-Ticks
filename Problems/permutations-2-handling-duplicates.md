---
Title: Permutations 2 (handling duplicates)
Companies:
  - Not Specified
Topics:
  - Maths
  - Backtracking
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - P & C
  - Duplicates
Link: ""
---

# Permutations II (Handling Duplicates)

**Pattern:** 

**Idea:** 

---

## 💻 Code

```Python
def permuteUnique(nums):

    nums.sort()

    ans = []
    path = []
    used = [False] * len(nums)

    def backtrack():

        if len(path) == len(nums):
            ans.append(path[:])
            return

        for i in range(len(nums)):

            if used[i]:
                continue

            # Skip duplicate branches
            if (
                i > 0
                and nums[i] == nums[i - 1]
                and not used[i - 1]
            ):
                continue

            used[i] = True
            path.append(nums[i])

            backtrack()

            path.pop()
            used[i] = False

    backtrack()
    return ans

```
**Time complexity** - O(n * n!) 
**Aux. Space complexity** -  O(n)
Basic printing all permutations - [7. Printing All Permutations](Basic%20Problems%20Using%20Simple%20Recursion.md#7.%20Printing%20All%20Permutations)
The approach is familiar with ['generating subsets without duplicates'](power-set-with-duplicates.md) problem.

---
# Permutations II (Handling Duplicates)

> **Interview Pattern:** Generate **unique permutations** when the input array contains duplicate values.

---

# Problem

Generate all **unique** permutations of an array that may contain duplicate elements.

Example:

```text
Input:
[1,1,2]

Output:
[1,1,2]
[1,2,1]
[2,1,1]
```

Notice that duplicate permutations should **not** be generated.

---

# Why Does the Basic Algorithm Fail?

The standard backtracking solution treats every **index** as unique.

Example:

```text
nums = [1,1,2]
```

Choosing

```text
first 1
```

or

```text
second 1
```

at the same recursion level produces identical permutations.

---

# Interview Approach

## Step 1

Sort the array.

```text
[1,2,1]

↓

[1,1,2]
```

Sorting places equal values together.

---

## Step 2

Maintain a `used[]` array.

```python
used = [False] * len(nums)
```

---

## Step 3

Skip duplicate branches.

```python
if (
    i > 0
    and nums[i] == nums[i-1]
    and not used[i-1]
):
    continue
```

---

# Why Does This Condition Work?

Suppose

```text
nums = [1,1,2]
```

At one recursion level,

```text
        []
      /    \
   first1  second1 ❌
```

If the **first** `1` hasn't been used yet,

starting a branch with the **second** `1` would generate exactly the same permutations.

So we skip it.

---

## Important

We skip duplicates **only when the previous identical element has not been used**.

If the first `1` is already part of the current permutation,

then choosing the second `1` is perfectly valid.

This allows permutations like

```text
[1,1,2]
```

to be generated.

---

# Complete Python Code

```python
def permuteUnique(nums):

    nums.sort()

    ans = []
    path = []
    used = [False] * len(nums)

    def backtrack():

        if len(path) == len(nums):
            ans.append(path[:])
            return

        for i in range(len(nums)):

            if used[i]:
                continue

            # Skip duplicate branches
            if (
                i > 0
                and nums[i] == nums[i - 1]
                and not used[i - 1]
            ):
                continue

            used[i] = True
            path.append(nums[i])

            backtrack()

            path.pop()
            used[i] = False

    backtrack()
    return ans
```

---

# Complexity

Let

- `n` = number of elements
    

### Time

Worst case (all distinct):

```text
O(n × n!)
```

- There are `n!` permutations.
    
- Copying each permutation costs `O(n)`.
    

If duplicates exist, the actual number of generated permutations is smaller.

---

### Auxiliary Space

```text
O(n)
```

For:

- Recursion stack
    
- `path`
    
- `used[]`
    

(Output storage excluded.)

---

# Comparison with Subsets II

|Subsets II|Permutations II|
|---|---|
|Sort|Sort|
|Skip duplicates at the **same recursion level**|Skip duplicates using `used[]`|
|`if i > start and nums[i] == nums[i-1]`|`if i>0 and nums[i]==nums[i-1] and not used[i-1]`|

---

# Interview Takeaways

✅ Sort first.

✅ Use a `used[]` array to track which indices are already in the current permutation.

✅ Skip duplicates using:

```python
if (
    i > 0
    and nums[i] == nums[i-1]
    and not used[i-1]
):
    continue
```

✅ The key idea is:

> **At the same recursion level, always choose the first occurrence of a duplicate value first.**

---

# FAANG Follow-up Priority

⭐⭐⭐⭐⭐ Must Know

- Basic permutation generation
    
- Duplicate handling (Permutations II)
    

⭐⭐⭐⭐ Good to Know

- Next Permutation (LeetCode 31)
    

    
