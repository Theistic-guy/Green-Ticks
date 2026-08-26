---
Title: Equal Partition
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
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Equal Partition

**Pattern:** subset sum with dp tricks

**Idea:**  divide the total sum by 2 and use 'subset sum with given sum' problem . 

---

## 💻 Code

```Python
def canPartition(nums):

    total = sum(nums)

    if total % 2:
        return False

    target = total // 2

    dp = [False]*(target+1)

    dp[0] = True

    for x in nums:

        for s in range(target,x-1,-1):

            dp[s] |= dp[s-x]

    return dp[target]

```
**Time complexity** - O(n * totalsum)
**Aux. Space complexity** -  O(totalsum)
**Note** -  [count-subsets-with-given-sum](count-subsets-with-given-sum.md)

---
## Problem

Can the array be divided into **two subsets having equal sum?**

Example

```text
nums = [1,5,11,5]

Answer

True

11

11
```

---

## Key Observation

Let

```text
total = sum(nums)
```

If

```text
total
```

is odd,

equal partition is impossible.

Otherwise,

we only need to know whether

```text
target = total // 2
```

can be formed.

Therefore

```text
Equal Partition

↓

Subset Sum(total//2)
```

This is called a **problem reduction**.

---

## Code

```python
def canPartition(nums):

    total = sum(nums)

    if total % 2:
        return False

    target = total // 2

    dp = [False]*(target+1)

    dp[0] = True

    for x in nums:

        for s in range(target,
                       x-1,
                       -1):

            dp[s] |= dp[s-x]

    return dp[target]
```

---

## Complexity

Time

```text
O(n × totalSum)
```

Auxiliary Space

```text
O(totalSum)
```

(More precisely, `O(target)` where `target = totalSum / 2`.)