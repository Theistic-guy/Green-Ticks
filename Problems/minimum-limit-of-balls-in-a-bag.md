---
Title: Minimum Limit of Balls in a Bag
Companies:
  - Google
  - Amazon
Topics:
  - Searching
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Binary Search
  - Predicate Search - Minimize Maximum
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Minimum Limit of Balls in a Bag

**Pattern:**  Binary search on answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code

[Boundary style Binary Search](../Notes/Extras/Boundary%20style%20vs%20%20Explicit%20answer%20style%20Binary%20Search.md)
```Python
def minimumSize(nums, maxOperations):
    low = 1
    high = max(nums)

    def feasible(limit):
        operations = 0

        for balls in nums:
            operations += (balls - 1) // limit

            if operations > maxOperations:
                return False

        return True

    while low < high:
        mid = low + (high - low) // 2

        if feasible(mid):
            high = mid
        else:
            low = mid + 1

    return low
```
**Time complexity** - O(n log M ) , M = max(nums)
**Aux. Space complexity** -  O(1)

---


> **LeetCode 1760 — Binary Search on Answer + Counting**

You have bags containing different numbers of balls. In one operation, you can split a bag into **two non-empty bags**.

Find the **minimum possible maximum number of balls in any bag** after performing at most `maxOperations` splits.

---

## Key Idea

We want to:

> **Minimize the maximum number of balls in a bag.**

Guess a candidate maximum size `limit` and ask:

> **How many split operations are required to make every bag contain at most `limit` balls?**

For a bag containing `x` balls:

$$  
operations(x) = \left\lceil\frac{x}{limit}\right\rceil - 1  
$$

Equivalent integer form:

$$  
operations(x) = \left\lfloor\frac{x-1}{limit}\right\rfloor  
$$

So:

$$  
totalOperations =  
\sum_i \left\lfloor\frac{nums[i]-1}{limit}\right\rfloor  
$$

`limit` is feasible when:

$$  
totalOperations \le maxOperations  
$$

---

## Why `ceil(x / limit) - 1`?

Suppose a bag has `9` balls and:

```text
limit = 3
```

We need:

```text
[3] [3] [3]
```

That's **3 bags**, requiring:

```text
3 - 1 = 2 splits
```

Therefore:

$$  
\left\lceil\frac{9}{3}\right\rceil-1 = 2  
$$

For:

```text
x = 10, limit = 3
```

we need:

```text
[3] [3] [4]
```

3 bags → 2 splits:

$$  
\lceil10/3\rceil-1 = 3-1=2  
$$

---

## Why Binary Search Works

As `limit` increases, fewer splits are necessary.

```text
limit:
1  2  3  4  5  6 ...
operations:
↑
many -----------→ fewer

feasible:
F  F  F  T  T  T ...
         ↑
    first feasible
```

Therefore:

> **Smaller limit → harder → more operations**  
> **Larger limit → easier → fewer operations**

So we search for the **first feasible limit**.

---

## Search Space

### Lower bound

```python
low = 1
```

Every bag must contain at least one ball.

### Upper bound

```python
high = max(nums)
```

With no splits, the largest bag already gives a valid upper bound.

Therefore:

```text
[1, max(nums)]
```

---

# Approach

For each candidate `limit`:

1. Calculate how many operations each bag needs.
    
2. Stop early if operations exceed `maxOperations`.
    
3. If total operations are within the limit, the candidate is feasible.
    
4. Binary-search the smallest feasible `limit`.
    

---

## Python Solution — Implicit Answer Style

```python
def minimumSize(nums, maxOperations):
    low = 1
    high = max(nums)

    def feasible(limit):
        operations = 0

        for balls in nums:
            operations += (balls - 1) // limit

            if operations > maxOperations:
                return False

        return True

    while low < high:
        mid = low + (high - low) // 2

        if feasible(mid):
            high = mid
        else:
            low = mid + 1

    return low
```

### Why `(balls - 1) // limit`?

It is an integer-only way of computing:

$$  
\left\lceil\frac{balls}{limit}\right\rceil - 1  
$$

This is a particularly useful formula to remember.

---

## Explicit Answer Style

```python
def minimumSize(nums, maxOperations):
    low = 1
    high = max(nums)
    ans = high

    def feasible(limit):
        operations = 0

        for balls in nums:
            operations += (balls - 1) // limit

            if operations > maxOperations:
                return False

        return True

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1

    return ans
```

Both are equivalent.

For this problem, the **implicit first-True version** is particularly clean.

---

## Dry Run

```text
nums = [9]
maxOperations = 2
```

Try:

```text
limit = 3
```

Required operations:

$$  
(9-1)//3 = 8//3 = 2  
$$

Feasible.

Try:

```text
limit = 2
```

$$  
(9-1)//2 = 8//2 = 4  
$$

4 > 2 → not feasible.

Therefore:

```text
answer = 3
```

The bag can become:

```text
[3] [3] [3]
```

using exactly 2 operations.

---

## Complexity

Let:

- $n$ = number of bags
    
- $M$ = `max(nums)`
    

Each feasibility check:

$$  
O(n)  
$$

Binary search:

$$  
O(\log M)  
$$

Therefore:

$$  
\boxed{O(n\log M)}  
$$

### Auxiliary Space

$$  
\boxed{O(1)}  
$$

---

## Important Quirks

### 1. Number of operations ≠ number of resulting bags

If a bag needs `k` final bags:

$$  
operations = k - 1  
$$

This is why:

$$  
\boxed{\left\lceil x/L\right\rceil - 1}  
$$

is used.

---

### 2. `operations <= maxOperations`

We don't need to use all operations.

```python
operations <= maxOperations
```

is sufficient.

---

### 3. Splitting can be done optimally without simulating it

You might initially think you need to actually perform the splits.

You don't.

For a fixed `limit`, the mathematical formula directly tells us the minimum number of splits required.

This makes the validator $O(n)$.

---

# Connection to Previous Problems

This is closely related to the two problems you've just studied:

### Smallest Divisor

$$  
\sum_i \left\lceil\frac{x_i}{d}\right\rceil \le threshold  
$$

### Minimized Maximum Products

$$  
\sum_i \left\lceil\frac{x_i}{X}\right\rceil \le stores  
$$

### Balls in a Bag

$$  
\sum_i  
\left(  
\left\lceil\frac{x_i}{X}\right\rceil-1  
\right)  
\le operations  
$$

All three follow:

```text
Candidate X
    ↓
Calculate required resource
    ↓
Required <= available?
    ↓
FFFFTTTT
    ↓
First True
```

The key difference is **what the validator counts**.

---

## Important Variations

### ⭐ Same family

- **Smallest Divisor Given a Threshold** → quotient/count calculation
    
- **Minimized Maximum of Products** → containers required
    
- **Capacity to Ship Packages** → greedy grouping
    
- **Split Array Largest Sum** → greedy partition
    

### The reusable pattern

> **Minimize the maximum → guess the maximum → calculate the resources needed → check whether resources fit → first feasible.**

---

## Common Mistakes

- ❌ Using `balls // limit` as the number of operations.
    
- ❌ Forgetting the `-1` in `ceil(balls / limit) - 1`.
    
- ❌ Simulating every split.
    
- ❌ Using `operations == maxOperations`.
    
- ❌ Searching for the exact original bag sizes instead of `[1, max(nums)]`.
    
- ❌ Forgetting that the predicate is **first True**.
    

---

## Pattern Recognition

When you see:

> **"Minimize the maximum size after performing at most K operations, where each operation splits/reduces something."**

Think:

```text
MINIMIZE THE MAXIMUM
        ↓
Guess maximum allowed size X
        ↓
How many operations are minimally required?
        ↓
operations <= K ?
        ↓
FFFFTTTT
        ↓
FIRST TRUE
```

### Mental hook

> **"Don't simulate the splits. For a candidate maximum `X`, calculate how many splits are mathematically necessary."**

This is an important evolution of the **Minimize the Maximum** pattern: the validator doesn't always need greedy simulation—it can sometimes be reduced to a direct mathematical counting formula.