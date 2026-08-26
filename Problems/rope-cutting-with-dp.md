---
Title: Rope Cutting With DP
Companies:
  - Not Specified
Topics:
  - Recursion
  - DP
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Rope Cutting → Dynamic Programming
**Pattern:** DP on recursion 1-D
**Idea:**  Store already computed results in a dp array

---

## 💻 Code (Memoization)

```python
def maxCuts(n, a, b, c, dp):
    if n == 0:
        return 0

    if n < 0:
        return -1

    if dp[n] != -1:
        return dp[n]

    ans = max(
        maxCuts(n-a, a, b, c, dp),
        maxCuts(n-b, a, b, c, dp),
        maxCuts(n-c, a, b, c, dp)
    )

    dp[n] = -1 if ans == -1 else ans + 1
    return dp[n]
```

Initialize:

```python
dp = [-1] * (n + 1)
```

**Time complexity** - O(n) 
**Aux. Space complexity** -  O(n)

---


## Problem

Given a rope of length `n` and allowed cut lengths `a`, `b`, and `c`, find the **maximum number of pieces** that can be obtained.

If it is impossible, return `-1`.

Example:

```text
n = 5
a = 2
b = 5
c = 1

Answer = 5

Cuts:
1 + 1 + 1 + 1 + 1
```

---

# Recursive Solution

Recurrence:

```python
f(n) = 1 + max(
    f(n-a),
    f(n-b),
    f(n-c)
)
```

Base Cases:

```python
n == 0  -> 0
n < 0   -> -1
```

---

# Why DP?

The recursive solution repeatedly solves the same subproblems.

Example:

```text
f(7)

├── f(5)
│    ├── f(3)
│    └── f(2)
│
└── f(4)
     └── f(2)   ← Recomputed
```

This is a classic case of **overlapping subproblems**, making it a good candidate for Dynamic Programming.

---

# Memoization (Top-Down)

Store the answer for each rope length.

```python
def maxCuts(n, a, b, c, dp):
    if n == 0:
        return 0

    if n < 0:
        return -1

    if dp[n] != -1:
        return dp[n]

    ans = max(
        maxCuts(n-a, a, b, c, dp),
        maxCuts(n-b, a, b, c, dp),
        maxCuts(n-c, a, b, c, dp)
    )

    dp[n] = -1 if ans == -1 else ans + 1
    return dp[n]
```

Initialize:

```python
dp = [-1] * (n + 1)
```

---

# Complexity

|Approach|Time|Auxiliary Space|
|---|---|---|
|Pure Recursion|`O(3^n)`|`O(n)`|
|Memoization|`O(n)`|`O(n)`|

**Why `O(n)`?**

Each rope length from `0` to `n` is solved **only once**, and each state performs only **3 constant-time transitions**.

---

# Bottom-Up (Tabulation)

```python
def maxCuts(n, a, b, c):
    dp = [-1] * (n + 1)
    dp[0] = 0

    for i in range(1, n + 1):

        for cut in (a, b, c):
            if i >= cut and dp[i - cut] != -1:
                dp[i] = max(dp[i], dp[i - cut] + 1)

    return dp[n]
```

---

# Complexity

- **Time:** `O(n)`
    
- **Auxiliary Space:** `O(n)`
    

---

# Interview Takeaways

- This problem is one of the earliest examples of converting **exponential recursion → Dynamic Programming**.
    
- The recursive solution has **overlapping subproblems**, making memoization effective.
    
- State definition:
    

```text
dp[i] = Maximum cuts possible for a rope of length i
```

- Transition:
    

```text
dp[i] = 1 + max(
    dp[i-a],
    dp[i-b],
    dp[i-c]
)
```

(ignore invalid states)

- This problem is a good stepping stone to understanding **Unbounded Knapsack** and other 1-D Dynamic Programming problems.