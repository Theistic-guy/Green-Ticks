---
Title: Maximum Candies Allocated to K Children
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
  - Predicate Search - Counting
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Maximum Candies Allocated to K Children

**Pattern:**  Binary search on answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code

This [Boundary style Binary Search](../Notes/Extras/Boundary%20style%20vs%20%20Explicit%20answer%20style%20Binary%20Search.md) soln. is missing an edge-case (see below). But the explicity style with `ans = 0` initialization prevents that ( check below)
```Python
def maximumCandies(candies, k):
    low = 1
    high = max(candies)

    def feasible(x):
        children = 0

        for pile in candies:
            children += pile // x

            if children >= k:
                return True

        return False

    while low < high:
        # Upper midpoint because we're finding last True.
        mid = low + (high - low + 1) // 2

        if feasible(mid):
            low = mid
        else:
            high = mid - 1

    return low
```
**Time complexity** - O(n log M) , M = max(candies)
**Aux. Space complexity** -  O(1)

---
# Maximum Candies Allocated to K Children


Given `candies[i]` piles of candies and `k` children, split the piles so that every child receives **the same number of candies**. Each child can receive candies from **only one pile**.

Find the **maximum number of candies each child can receive**.

---

## Key Idea

The answer is the number of candies **per child**.

Guess a candidate `x`:

> Can we give **at least `x` candies to each of the `k` children**?

A pile containing `c` candies can provide:

$$  
\left\lfloor\frac{c}{x}\right\rfloor  
$$

children with `x` candies.

Therefore:

$$  
children(x)=\sum_i\left\lfloor\frac{candies[i]}{x}\right\rfloor  
$$

`x` is feasible if:

$$  
children(x) \ge k  
$$
coz if $x$ can server equal or more than K no of children then it can server atleast K no of children.

---

## Why Binary Search Works

As `x` increases, each pile can serve the same number or **fewer** children.

```text
candies per child:
1  2  3  4  5  6 ...
feasible:
T  T  T  T  F  F ...
         ↑
    maximum feasible
```

So:

```text
TTTTFFFF
```

We need the **last `True`**.

This is the same `maximize the minimum` boundary pattern seen in **Magnetic Force** and **Divide Chocolate**, although the validator here is simple mathematical counting rather than greedy placement/partitioning.

---

## Search Space

### Lower bound

```python
low = 1
```

If every child must receive candies, a positive answer starts at `1`.

### Upper bound

No child can receive more than the largest pile:

```python
high = max(candies)
```

So:

```text
[1, max(candies)]
```

is the answer space.

---

## Approach

For candidate `x`:

1. For every pile, calculate `pile // x`.
    
2. Add these values to get the number of children who can receive `x` candies.
    
3. If this is at least `k`, `x` is feasible → try a **larger** `x`.
    
4. Otherwise, `x` is too large → try a smaller `x`.
    

---

# Python Solution — Implicit Answer Style

```python
def maximumCandies(candies, k):
    low = 1
    high = max(candies)

    def feasible(x):
        children = 0

        for pile in candies:
            children += pile // x

            if children >= k:
                return True

        return False

    while low < high:
        # Upper midpoint because we're finding last True.
        mid = low + (high - low + 1) // 2

        if feasible(mid):
            low = mid
        else:
            high = mid - 1

    return low
```

### Why `low = mid`?

If `mid` is feasible, it **could be the answer**, but we're trying to maximize it.

Therefore:

```python
low = mid
```

keeps `mid` in the search space while eliminating smaller values.

### Why `high = mid - 1`?

If `mid` is not feasible, neither `mid` nor anything larger can work.

---

# Explicit Answer Style

```python
def maximumCandies(candies, k):
    low = 1
    high = max(candies)
    ans = 0

    def feasible(x):
        children = 0

        for pile in candies:
            children += pile // x

            if children >= k:
                return True

        return False

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            low = mid + 1
        else:
            high = mid - 1

    return ans
```

Here:

```text
ans = largest feasible value found so far
```

Both formulations are equivalent. The **implicit last-True version** is particularly natural here.

---

## Important Edge Case: Not Enough Candies

Suppose:

```text
candies = [1, 2]
k = 10
```

There aren't enough candies to give even `1` candy to every child.

The answer is:

```text
0
```

Therefore, unlike many previous problems, the true answer **can be zero**.

A robust implementation can use:

```python
low = 1
high = max(candies)
ans = 0
```

with the explicit style, or the implicit version above will naturally converge to `1` only if `1` is feasible. For the LeetCode constraints, the intended solution must account for the possibility of returning `0`.

A cleaner implicit formulation is therefore:

```python
def maximumCandies(candies, k):
    low = 0
    high = max(candies)

    def feasible(x):
        if x == 0:
            return True

        return sum(c // x for c in candies) >= k

    while low < high:
        mid = low + (high - low + 1) // 2

        if feasible(mid):
            low = mid
        else:
            high = mid - 1

    return low
```

However, in an interview, the **explicit `ans = 0` version** avoids having to define `feasible(0)`.

---

## Dry Run

```text
candies = [5, 8, 6]
k = 3
```

Try:

```text
x = 4
```

Children served:

$$  
5//4 + 8//4 + 6//4  
= 1 + 2 + 1  
= 4  
$$

`4 >= 3` → feasible.

Try:

```text
x = 5
```

$$  
5//5 + 8//5 + 6//5  
= 1 + 1 + 1  
= 3  
$$

Still feasible.

Try:

```text
x = 6
```

$$  
5//6 + 8//6 + 6//6  
= 0 + 1 + 1  
= 2  
$$

Not feasible.

Therefore:

```text
answer = 5
```

Each child can receive 5 candies.

---

## Why We Don't Actually Split the Piles

For a fixed `x`, we don't need to construct the allocation.

A pile of `c` candies simply contributes:

$$  
\left\lfloor\frac{c}{x}\right\rfloor  
$$

possible children.

For example:

```text
pile = 13
x = 4
```

It can produce:

```text
4 + 4 + 4
```

so it serves:

```text
13 // 4 = 3 children
```

with one candy left unused.

This turns the feasibility check into a simple **counting problem**.

---

## Complexity

Let:

- $n$ = number of candy piles
    
- $M$ = `max(candies)`
    

Each feasibility check:

$$  
O(n)  
$$

Binary search:

$$  
O(\log M)  
$$

Total:

$$  
\boxed{O(n\log M)}  
$$

### Auxiliary Space

$$  
\boxed{O(1)}  
$$

---

## Connection to Previous Problems

This is another **Maximize the Minimum** problem:

### Magnetic Force

```text
candidate = minimum distance
        ↓
greedy placement
        ↓
can place K?
        ↓
LAST TRUE
```

### Divide Chocolate

```text
candidate = minimum sweetness
        ↓
greedy partition
        ↓
can create K+1 pieces?
        ↓
LAST TRUE
```

### Maximum Candies

```text
candidate = minimum candies/child
        ↓
count children served
        ↓
can serve K?
        ↓
LAST TRUE
```

The **boundary pattern is the same**, but the validator changes.

---

## Important Variations

### ⭐ Directly related

**Maximum candies / workload / resources per person**

General form:

$$  
\sum_i \left\lfloor\frac{quantity_i}{X}\right\rfloor \ge K  
$$

Find the **maximum feasible `X`**.

### Contrast with Minimized Maximum

**Minimized Maximum of Products** asks:

$$  
\sum_i \left\lceil\frac{quantity_i}{X}\right\rceil \le K  
$$

There:

```text
X ↑ → required stores ↓
```

and we find the **first True**.

Here:

```text
X ↑ → children served ↓
```

and we find the **last True**.

This distinction is highly useful for recognizing the direction of predicate search.

---

## Common Mistakes

- ❌ Using `ceil(candies[i] / x)` instead of floor division.
    
- ❌ Checking whether total candies `>= k * x` without respecting the **one pile per child** constraint.
    
- ❌ Forgetting that unused candies are allowed.
    
- ❌ Searching for the first feasible value instead of the **last**.
    
- ❌ Forgetting the answer can be `0`.
    
- ❌ Trying to explicitly construct the allocation when simple counting is sufficient.
    

---

## Pattern Recognition

When you see:

> **"Distribute/split resources among at least K entities so that each gets as much as possible."**

Think:

```text
MAXIMIZE THE MINIMUM
        ↓
Guess X = amount per entity
        ↓
count how many entities can receive X
        ↓
count >= K ?
        ↓
TTTTFFFF
        ↓
LAST TRUE
```

### Mental hook

> **"Guess the amount each person gets. Count how many people the piles can support at that amount. If we can support K, demand more."**