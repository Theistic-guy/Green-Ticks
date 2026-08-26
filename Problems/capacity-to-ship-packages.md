---
Title: Capacity to Ship Packages Within D Days
Companies:
  - Amazon
  - Meta
Topics:
  - Searching
  - Greedy
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Binary Search
  - Predicate Search - Basic
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Capacity to Ship Packages Within D Days

**Pattern:**  Binary Search on Answer (predicate search) - Core

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)

---

## 💻 Code

[Explicit answer style Binary Search](../Notes/Extras/Boundary%20style%20vs%20%20Explicit%20answer%20style%20Binary%20Search.md) :-
```Python
def shipWithinDays(weights, days):
    low = max(weights)
    high = sum(weights)
    ans = high

    def feasible(capacity):
        days_used = 1
        current_load = 0

        for weight in weights:
            if current_load + weight > capacity:
                days_used += 1
                current_load = 0

            current_load += weight

        return days_used <= days

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            high = mid - 1       # search for a smaller feasible capacity
        else:
            low = mid + 1        # need larger capacity

    return ans

```
**Time complexity** - O(n log S )  , S is sum(packages)
**Aux. Space complexity** -  O(1)

---


> **LeetCode 1011 — Binary Search on Answer + Greedy Feasibility**

Given an array `weights`, where packages must be shipped **in the given order**, find the **minimum ship capacity** needed to ship all packages within `days` days.

Each day's load cannot exceed the ship's capacity.

---

## Key Idea

The answer is **not an index in the array**. It is a number:

```text
ship capacity ∈ [max(weights), sum(weights)]
```

Instead of trying every possible capacity, **binary-search the answer**.

For a candidate capacity `C`, ask:

> **Can all packages be shipped within `days` days if the ship's capacity is `C`?**

This is our feasibility predicate:

```python
feasible(C)
```

---

## Intuition

For a fixed capacity `C`, greedily load as many consecutive packages as possible into the current day.

When adding the next package would exceed `C`, start a new day.

Example:

```text
weights = [1, 2, 3, 4, 5]
C = 6

Day 1: [1, 2, 3] = 6
Day 2: [4]       = 4
Day 3: [5]       = 5
```

So `C = 6` requires 3 days.

### Why greedy works

Packages **must remain in their original order**.

For a fixed capacity, taking as many consecutive packages as possible for the current day can never increase the number of days needed. <mark>Leaving usable capacity unused cannot help later because the next package must be processed in order.</mark>

---

## Why Binary Search Works

If capacity `C` is feasible, then every larger capacity is also feasible:

```text
Capacity:
1  2  3  4  5  6  7  8  9  ...
F  F  F  F  F  T  T  T  T
               ↑
          minimum feasible
```

So the predicate is monotonic:

$$  
C_1 \le C_2 \land feasible(C_1)  
\Rightarrow feasible(C_2)  
$$

Therefore we need to find the **first `True`**.

---

## Search Space

### Lower bound

```python
low = max(weights)
```

A package cannot be split, so the ship must at least carry the heaviest package.

### Upper bound

```python
high = sum(weights)
```

With this capacity, all packages can be shipped in a single day.

Therefore:

```text
[max(weights), sum(weights)]
```

is guaranteed to contain the answer.

---

# Approach

### 1. Define the validator

```python
def feasible(capacity):
    days_used = 1
    current_load = 0

    for weight in weights:
        if current_load + weight > capacity:
            days_used += 1
            current_load = 0

        current_load += weight

    return days_used <= days
```

### 2. Binary-search the first feasible capacity

There are two standard ways to implement this.

---

## 1. Implicit Answer / Boundary Style

The search interval itself represents where the answer can still be.

```python
def shipWithinDays(weights, days):
    low = max(weights)
    high = sum(weights)

    def feasible(capacity):
        days_used = 1
        current_load = 0

        for weight in weights:
            if current_load + weight > capacity:
                days_used += 1
                current_load = 0

            current_load += weight

        return days_used <= days

    while low < high:
        mid = low + (high - low) // 2

        if feasible(mid):
            high = mid          # mid may be the answer
        else:
            low = mid + 1       # mid definitely cannot be answer

    return low
```

### Invariant

The answer always remains inside:

```text
[low, high]
```

When `low == high`, only one candidate remains, so that value is the minimum feasible capacity.

---

## 2. Explicit Answer / `ans` Style

This uses the more traditional `low <= high` binary search and stores the best feasible answer separately.

```python
def shipWithinDays(weights, days):
    low = max(weights)
    high = sum(weights)
    ans = high

    def feasible(capacity):
        days_used = 1
        current_load = 0

        for weight in weights:
            if current_load + weight > capacity:
                days_used += 1
                current_load = 0

            current_load += weight

        return days_used <= days

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            high = mid - 1       # search for a smaller feasible capacity
        else:
            low = mid + 1        # need larger capacity

    return ans
```

### Invariant

`ans` stores the **best feasible capacity found so far**.

When `mid` is feasible:

```python
ans = mid
high = mid - 1
```

because we want to know whether an even smaller capacity also works.

---

## Which Style Should You Prefer?

For this problem, I prefer the **implicit boundary style**:

```python
while low < high:
```

because the problem naturally asks for:

> **first feasible capacity**

and the final boundary directly gives the answer.

The explicit `ans` style is equally valid and useful to know, especially when adapting the standard `low <= high` binary-search template.

**Don't memorize the syntax independently. Remember the invariant:**

> `feasible(mid)` → can we move toward smaller capacities?  
> `not feasible(mid)` → capacity must increase.

---

## Dry Run

```text
weights = [1, 2, 3, 4, 5]
days = 3

low  = 5
high = 15
```

Try:

```text
mid = 10
```

Greedy:

```text
Day 1: 1 + 2 + 3 + 4 = 10
Day 2: 5
```

2 days ≤ 3 → **feasible**

So:

```text
high = 10
```

Try:

```text
mid = 7
```

```text
Day 1: 1 + 2 + 3 = 6
Day 2: 4
Day 3: 5
```

3 days → feasible.

Try:

```text
mid = 6
```

```text
Day 1: 1 + 2 + 3 = 6
Day 2: 4
Day 3: 5
```

Still feasible.

Try:

```text
mid = 5
```

```text
Day 1: 1 + 2
Day 2: 3
Day 3: 4
Day 4: 5
```

4 days → not feasible.

Therefore:

```text
5 → F
6 → T
```

Answer:

```text
6
```

---

## Complexity

Let:

- $n$ = number of packages
    
- $S$ = `sum(weights)`
    
- $M$ = `max(weights)`
    

Each `feasible()` call scans all packages:

$$  
O(n)  
$$

Binary search performs:

$$  
O(\log(S-M+1))  
$$

checks.

### Total

$$  
\boxed{O(n\log(S-M+1))}  
$$

Usually written as:

$$  
\boxed{O(n\log S)}  
$$

### Auxiliary Space

$$  
\boxed{O(1)}  
$$

Only a few variables are used apart from the input.

---

## Important Edge Cases / Quirks

### 1. One day

```text
days = 1
```

Answer:

```python
sum(weights)
```

---

### 2. Number of days equals number of packages

If every package can be shipped individually, answer is:

```python
max(weights)
```

---

### 3. Package cannot be split

This is why:

```python
low = max(weights)
```

is essential.

---

### 4. Order cannot be changed

You **cannot rearrange packages** to improve packing.

The greedy validator relies on processing them in the given order.

---

### 5. Don't use `days_used == days` blindly

The correct feasibility condition is:

```python
days_used <= days
```

If a capacity allows shipping in fewer days, it is still feasible.

---

## Important Variations

### Book Allocation

> Allocate contiguous books to `K` students while minimizing the maximum pages assigned to one student.

Same structure:

```text
candidate maximum pages
        ↓
greedily allocate books
        ↓
students required <= K ?
        ↓
first feasible
```

---

### Painter's Partition

> Divide contiguous boards among `K` painters while minimizing the maximum workload.

Again:

```text
candidate maximum workload
        ↓
greedy partition
        ↓
painters required <= K ?
        ↓
first feasible
```

These three problems should be recognized as the **same Binary Search on Answer family**:

```text
Ship Packages
Book Allocation
Painter's Partition
        ↓
MINIMIZE THE MAXIMUM
```

---

## Common Mistakes

- ❌ Binary-searching the `weights` array.
    
- ❌ Setting `low = 0` instead of `max(weights)`.
    
- ❌ Using `days_used == days` instead of `<= days`.
    
- ❌ Reordering packages.
    
- ❌ Using `high = mid - 1` in the implicit first-True formulation.
    
- ❌ Forgetting that `mid` itself may be the answer.
    

---

## Pattern Recognition

When you see:

> **"Find the minimum possible capacity / maximum load / maximum sum such that everything can be completed within K groups/days."**

Think immediately:

```text
MINIMIZE THE MAXIMUM
        ↓
Guess maximum allowed value X
        ↓
Can I complete the task with X?
        ↓
Greedy validator
        ↓
FFFFTTTT
        ↓
Binary search FIRST TRUE
```

### Reusable template

```python
low = maximum_required_single_item
high = total_work

while low < high:
    mid = low + (high - low) // 2

    if feasible(mid):
        high = mid
    else:
        low = mid + 1

return low
```

> **Mental hook:**  
> **"Capacity is the answer. Capacity ↑ ⇒ problem gets easier. Find the smallest capacity that works."**