---
Title: Power Set with Duplicates
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
Link: ""
---

# Power Set with Duplicates (Subsets II)

**Pattern:** backtracking + sorting
**Idea:** sort and check on backtracking if condition to not include on the same level

---

## 💻 Code

<details>
<summary> Without comments</summary>

```python
def subsetsWithDup(nums):
    nums.sort()

    ans = []
    subset = []

    def backtrack(start):
        ans.append(subset[:])

        for i in range(start, len(nums)):

            # Skip duplicates at the same level
            if i > start and nums[i] == nums[i - 1]:
                continue

            subset.append(nums[i])
            backtrack(i + 1)
            subset.pop()

    backtrack(0)
    return ans
```

</details>

```Python
def subsetsWithDup(nums):
    nums.sort()  # Step 1: Put identical numbers side-by-side

    ans = []     # Stores all valid unique subsets
    subset = []  # Stores the current subset being built

    def backtrack(start):
        # Every state reached in backtracking is a valid subset, so capture it!
        ans.append(subset[:])  # subset[:] creates a COPY (so future modifications don't break it)

        for i in range(start, len(nums)):

            # Skip duplicates at the same tree level
            if i > start and nums[i] == nums[i - 1]:
                continue

            subset.append(nums[i]) # Choose
            backtrack(i + 1)       # Explore
            subset.pop()           # Unchoose (backtrack)

    backtrack(0)
    return ans

```
- **Time:** `O(n × 2^n)` (must generate all unique subsets)
    
- **Auxiliary Space:** `O(n)` (recursion stack + current subset)
    
- **Output Space:** `O(n × 2^n)`

---

## Problem

Generate all **unique** subsets when the input array may contain duplicate values.

Example:

```text
Input:
[1,2,2]

Output:
[]
[1]
[2]
[1,2]
[2,2]
[1,2,2]
```

---

## Why Bitmasking Fails

Bitmasking represents **indices**, not **values**.

Example:

```text
nums = [1,2,2]

Mask 010 -> {2} (index 1)
Mask 001 -> {2} (index 2)
```

Different masks generate the same subset.

---

## Interview Approach (Sort + Backtracking)

### Step 1

Sort the array.

```text
[2,1,2]
↓

[1,2,2]
```

Sorting places equal values together.

---

### Step 2

While iterating at the same recursion level,

if

```python
i > start and nums[i] == nums[i-1]:
    continue
```

skip the current element.

---

## Why does this work?

Suppose

```text
nums = [1,2,2]
```

At the top level,

```
start = 0

        []
      /   \
     1     2(first)
           \
            2(second) ❌ Skip
```

After considering the **first** `2`, starting another branch with the **second** `2` would generate identical subsets.

So we skip it.

**Important:** We skip duplicates **only at the same recursion level.**

If the first `2` has already been chosen, we are allowed to choose the second one.

This is why `[2,2]` is still generated.

---

## Skip Condition

```python
if i > start and nums[i] == nums[i-1]:
    continue
```

Meaning:

- `nums[i] == nums[i-1]` → Duplicate value.
    
- `i > start` → We are still at the same recursion level.
    
- Skip the duplicate branch.
    

---

## Code (Python)

```python
def subsetsWithDup(nums):
    nums.sort()

    ans = []
    subset = []

    def backtrack(start):
        ans.append(subset[:])

        for i in range(start, len(nums)):

            # Skip duplicates at the same level
            if i > start and nums[i] == nums[i - 1]:
                continue

            subset.append(nums[i])
            backtrack(i + 1)
            subset.pop()

    backtrack(0)
    return ans
```

---

## Complexity

- **Time:** `O(n × 2^n)` (must generate all unique subsets)
    
- **Auxiliary Space:** `O(n)` (recursion stack + current subset)
    
- **Output Space:** `O(n × 2^n)`
    

---

## Interview Takeaways

- Classic bitmask solution assumes **distinct elements**.
    
- Sorting alone does **not** remove duplicate subsets.
    
- The standard interview solution is **Sort + Backtracking + Skip Duplicates**.
    
- Remember the skip condition:
    

```python
if i > start and nums[i] == nums[i - 1]:
    continue
```

This is one of the most commonly asked backtracking patterns and also appears in **Combination Sum II**, **Permutations II**, and similar duplicate-handling problems.