---
Title: Subset sum using DP
Companies:
  - Not Specified
Topics:
  - DP
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Subset
Link: ""
---

# 1. Subset Sum (Decision Problem)

**Pattern:**  DP

**Idea:** 

---

## 💻 Code

```python
def subsetSum(nums, i, target, dp):

    if target == 0:
        return True

    if i == len(nums):
        return False

    if dp[i][target] != -1:
        return dp[i][target]

    ans = subsetSum(nums, i + 1, target, dp)

    if not ans and target >= nums[i]:
        ans = subsetSum(nums, i + 1,
                        target - nums[i], dp)

    dp[i][target] = ans
    return ans
```

Initialization

```python
dp = [[-1]*(target+1) for _ in range(len(nums))]
```


**Time complexity** - O(n * S) 
**Aux. Space complexity** -  O(n * S)
Basic Recursion - [6. Subset Sum Problem](Basic%20Problems%20Using%20Simple%20Recursion.md#6.%20Subset%20Sum%20Problem), Also below.
Variations:-
+ [count-subsets-with-given-sum](count-subsets-with-given-sum.md)
+ [equal-partition](equal-partition.md)



---

## Problem

Given an array and a target sum `S`, determine whether **at least one subset** has sum equal to `S`.

Example

```text
nums = [2,3,7,8,10]
target = 11

Output:
True

Subset:
3 + 8 = 11
```

---

## Recursive State

Define

```text
f(i, sum)
```

Meaning:

> Can we form `sum` using elements from index `i` onward?

---

## Choices

For every element,

either

```text
Take it
```

or

```text
Skip it
```

Recurrence

```python
f(i,sum) =
    f(i+1,sum)
    OR
    f(i+1,sum-nums[i])
```

---

## Base Cases

```python
if sum == 0:
    return True

if i == len(nums):
    return False
```

---

## Recursive Code

```python
def subsetSum(nums, i, target):

    if target == 0:
        return True

    if i == len(nums):
        return False

    return (
        subsetSum(nums, i + 1, target)
        or
        (target >= nums[i] and
         subsetSum(nums, i + 1, target - nums[i]))
    )
```

---

## Memoization

State:

```text
dp[i][sum]
```

```python
def subsetSum(nums, i, target, dp):

    if target == 0:
        return True

    if i == len(nums):
        return False

    if dp[i][target] != -1:
        return dp[i][target]

    ans = subsetSum(nums, i + 1, target, dp)

    if not ans and target >= nums[i]:
        ans = subsetSum(nums, i + 1,
                        target - nums[i], dp)

    dp[i][target] = ans
    return ans
```

Initialization

```python
dp = [[-1]*(target+1) for _ in range(len(nums))]
```

---

## Tabulation

### State

```text
dp[i][s]

Can first i elements make sum s?
```

Transition

```python
dp[i][s] =
dp[i-1][s]
or
dp[i-1][s-nums[i-1]]
```

Code

```python
def subsetSum(nums, target):

    n = len(nums)

    dp = [[False]*(target+1)
          for _ in range(n+1)]

    for i in range(n+1):
        dp[i][0] = True

    for i in range(1, n+1):
        for s in range(1, target+1):

            dp[i][s] = dp[i-1][s]

            if s >= nums[i-1]:
                dp[i][s] |= dp[i-1][s-nums[i-1]]

    return dp[n][target]
```

---

## Space Optimized

Observation:

Each row depends only on the previous row.

Code

```python
def subsetSum(nums, target):

    dp = [False]*(target+1)
    dp[0] = True

    for x in nums:

        for s in range(target,
                       x-1,
                       -1):

            dp[s] |= dp[s-x]

    return dp[target]
```

### Why iterate backwards?

To ensure every element is used **only once**.

Forward iteration would reuse the same element multiple times.

---

## Complexity

|Approach|Time|Aux Space|
|---|---|---|
|Recursion|O(2ⁿ)|O(n)|
|Memoization|O(n × S)|O(n × S)|
|Tabulation|O(n × S)|O(n × S)|
|Space Optimized|O(n × S)|O(S)|

---

---

# Pattern Recognition

Whenever you see

```text
Generate all subsets
```

↓

Think

```text
Backtracking
Bitmasking
```

---

Whenever you see

```text
Subset exists?

Count subsets?

Equal partition?

Target sum?

Minimum difference?
```

↓

Think

```text
Subset Sum DP
```

---

# Interview Connections

```text
Subset Sum
        │
        ├── Count Subsets
        │
        ├── Equal Partition
        │
        ├── Target Sum
        │
        ├── Perfect Sum
        │
        └── 0/1 Knapsack
```

---

# FAANG Takeaways

✅ Learn the **state** before memorizing the code.

```text
dp[i][sum]
```

or

```text
dp[sum]
```

is the heart of every variation.

---

✅ Remember the transition:

Decision Problem

```python
OR
```

↓

Count Problem

```python
+
```

---

✅ Equal Partition is **just Subset Sum** after reducing the target to

```text
totalSum // 2
```

---

✅ For **1-D DP**, always iterate the sums **backwards**.

This guarantees that each array element is used **at most once**, which is exactly the requirement of the 0/1 Subset Sum family.