---
Title: Minimized Maximum of Products Distributed to Any Store
Companies:
  - Amazon
  - Microsoft
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

# Minimized Maximum of Products Distributed to Any Store

**Pattern:** binary search on answer (minimize maximum)

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)

---

## 💻 Code

```Python
def minimizedMaximum(n, quantities):
    low = 1
    high = max(quantities)

    def feasible(limit):
        stores = 0

        for q in quantities:
            stores += (q + limit - 1) // limit

            if stores > n:
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
**Time complexity** - O( n log Q) , q = max (quantities )
**Aux. Space complexity** -  O(1)

---


> **LeetCode 2064 — Binary Search on Answer + Greedy Counting**

You have `n` stores and `quantities[i]` products of type `i`.

Each product type must be distributed among the stores, and a store can receive products of **only one type**.

Find the **minimum possible maximum number of products assigned to any store**.

---

## Key Idea

The answer is:

> **The smallest possible maximum load per store.**

Instead of directly distributing products optimally, guess a maximum allowed load `x`:

> If each store can hold at most `x` products of one type, can we distribute all products using at most `n` stores?

For each product type with `q` products, the number of stores required is:

$$  
\left\lceil\frac{q}{x}\right\rceil  
$$

Therefore:

$$  
storesRequired(x)

\sum_i \left\lceil\frac{quantities[i]}{x}\right\rceil  
$$

`x` is feasible if:

$$  
storesRequired(x) \le n  
$$

---

## Why Binary Search Works

As `x` increases, each type requires **the same or fewer stores**.

Therefore:

```text
maximum per store:
1  2  3  4  5  6  ...
required stores:
↑
many ---------------- → fewer
feasible:
F  F  F  T  T  T  ...
         ↑
    first feasible
```

So this is a **first-True predicate search**.

### Core pattern

```text
Candidate X = maximum allowed load
              ↓
      calculate stores required
              ↓
       stores <= n ?
              ↓
          F F F T T T
              ↓
         first feasible
```

---

## Search Space

### Lower bound

At minimum, one store must contain at least one product:

```python
low = 1
```

You could derive tighter bounds in some formulations, but `1` is simple and sufficient.

### Upper bound

A single store can hold all products of the largest type:

```python
high = max(quantities)
```

Therefore:

```text
[1, max(quantities)]
```

contains the answer.

---

# Approach

For each candidate `x`:

1. For every quantity `q`, calculate how many stores are needed.
    
2. Add:
    
    $$  
    \left\lceil\frac{q}{x}\right\rceil  
    $$
    
3. If the total number of stores exceeds `n`, `x` is too small.
    
4. Otherwise `x` is feasible.
    
5. Binary-search for the smallest feasible `x`.
    

---

## Python Solution — Implicit Answer Style

```python
def minimizedMaximum(n, quantities):
    low = 1
    high = max(quantities)

    def feasible(limit):
        stores = 0

        for q in quantities:
            stores += (q + limit - 1) // limit

            if stores > n:
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

### Update logic

If `mid` is feasible:

```python
high = mid
```

`mid` might be the answer, so keep it.

If `mid` is not feasible:

```python
low = mid + 1
```

No value `≤ mid` can work.

---

## Explicit Answer Style

```python
def minimizedMaximum(n, quantities):
    low = 1
    high = max(quantities)
    ans = high

    def feasible(limit):
        stores = 0

        for q in quantities:
            stores += (q + limit - 1) // limit

            if stores > n:
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

Both implementations maintain the same fundamental invariant:

> Find the **smallest `x` for which `storesRequired(x) <= n`**.

The implicit version is especially clean because this is directly a **first-True** search.

---

## Dry Run

```text
n = 6
quantities = [11, 6]
```

Try:

```text
limit = 3
```

Required stores:

$$  
\lceil11/3\rceil + \lceil6/3\rceil  
= 4 + 2  
= 6  
$$

Exactly 6 stores → feasible.

Try:

```text
limit = 2
```

$$  
\lceil11/2\rceil + \lceil6/2\rceil  
= 6 + 3  
= 9  
$$

9 > 6 → not feasible.

Therefore the answer is:

```text
3
```

---

## Complexity

Let:

- $m$ = number of product types = `len(quantities)`
    
- $Q$ = `max(quantities)`
    

Each feasibility check:

$$  
O(m)  
$$

Binary search:

$$  
O(\log Q)  
$$

Total:

$$  
\boxed{O(m\log Q)}  
$$

### Auxiliary Space

$$  
\boxed{O(1)}  
$$

---

## Important Quirks

### 1. A store gets only one product type

For:

```text
quantities = [11, 6]
```

you cannot put:

```text
5 of type A + 1 of type B
```

in one store.

Each store is dedicated to one product type.

This is why the required stores for each type can be calculated independently.

---

### 2. Don't confuse `n` with number of product types

```text
n = number of stores
len(quantities) = number of product types
```

They are different.

---

### 3. Ceiling division

Use:

```python
(q + limit - 1) // limit
```

instead of floating-point `ceil()`.

---

### 4. `stores <= n`, not `stores == n`

If a limit requires fewer than `n` stores, it is still feasible.

Unused stores are allowed.

---

## Connection to Previous Problems

This problem is closely related to:

### Smallest Divisor Given a Threshold

```text
Smallest Divisor:
candidate d
    ↓
sum ceil(nums[i] / d)
    ↓
<= threshold?
```

### Minimized Maximum Products

```text
candidate maximum load x
    ↓
sum ceil(quantities[i] / x)
    ↓
<= number of stores?
```

They have essentially the **same mathematical validator**:

$$  
\sum_i \left\lceil\frac{x_i}{X}\right\rceil \le K  
$$

Only the interpretation changes.

|Problem|Candidate|What the sum represents|
|---|---|---|
|Smallest Divisor|Divisor|Rounded quotient sum|
|Minimized Maximum|Max products/store|Stores required|

This is a useful pattern to recognize in interviews.

---

## Common Mistakes

- ❌ Thinking stores can contain multiple product types.
    
- ❌ Using `stores == n` instead of `stores <= n`.
    
- ❌ Searching over product quantities rather than the **maximum load**.
    
- ❌ Using floating-point ceiling unnecessarily.
    
- ❌ Forgetting that the answer is the **first feasible** load.
    
- ❌ Setting `high = sum(quantities)` — valid but unnecessarily loose; `max(quantities)` is enough.
    

---

## Pattern Recognition

When you see:

> **"Distribute quantities/resources among a limited number of containers/workers/stores while minimizing the maximum amount assigned to one."**

Think:

```text
MINIMIZE THE MAXIMUM
        ↓
Guess maximum allowed load X
        ↓
How many units/groups/containers are required?
        ↓
required <= available?
        ↓
FFFFTTTT
        ↓
FIRST TRUE
```

### Mental hook

> **"Guess the maximum load. Calculate how many containers it requires. If we can fit everything within the available containers, try a smaller load."**