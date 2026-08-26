---
Title: Find the Smallest Divisor Given a Threshold
Companies:
  - Amazon
  - Apple
Topics:
  - Searching
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Binary Search
  - Predicate Search - Basic
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Find the Smallest Divisor Given a Threshold

**Pattern:** Binary search on answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code

```Python
def smallestDivisor(nums, threshold):
    low = 1
    high = max(nums)

    def feasible(divisor):
        total = 0

        for x in nums:
            total += (x + divisor - 1) // divisor

        return total <= threshold

    while low < high:
        mid = low + (high - low) // 2

        if feasible(mid):
            high = mid
        else:
            low = mid + 1

    return low

```
**Time complexity** - O(nlogM) , M is max(nums)
**Aux. Space complexity** -  O(1)

---


> **LeetCode 1283 — Binary Search on Answer + Monotonic Predicate**

Given an integer array `nums` and an integer `threshold`, find the **smallest positive integer divisor `d`** such that:

$$  
\sum_i \left\lceil \frac{nums[i]}{d} \right\rceil \le threshold  
$$

---

## Key Idea

The answer is the **divisor**, not an element of the array.

So search:

```text
d ∈ [1, max(nums)]
```

For a candidate divisor `d`, define:

```python
feasible(d)
```

as:

> Is the sum of the rounded-up quotients `<= threshold`?

Example:

```text
nums = [1, 2, 5, 9]
d = 5

ceil(1/5) + ceil(2/5) + ceil(5/5) + ceil(9/5)
= 1 + 1 + 1 + 2
= 5
```

If `5 <= threshold`, divisor `5` is feasible.

---

## Why Binary Search Works

As the divisor increases, every quotient:

$$  
\left\lceil \frac{x}{d} \right\rceil  
$$

can only **decrease or stay the same**.

Therefore the total sum is monotonic:

```text
divisor:    1  2  3  4  5  6  7 ...
sum:       26 15 11  9  7  6  6 ...
feasible:   F  F  F  T  T  T  T ...
                      ↑
                 first feasible
```

So this is a **first-True binary search**.

---

## Approach

1. Search divisor from `1` to `max(nums)`.
    
2. For each candidate `d`, calculate:
    
    $$\sum \lceil nums[i]/d\rceil$$
    
3. If the sum is `<= threshold`, `d` works → try a **smaller divisor**.
    
4. Otherwise, `d` is too small → try a **larger divisor**.
    

---

## Python Solution — Implicit Answer Style

```python
def smallestDivisor(nums, threshold):
    low = 1
    high = max(nums)

    def feasible(divisor):
        total = 0

        for x in nums:
            total += (x + divisor - 1) // divisor

        return total <= threshold

    while low < high:
        mid = low + (high - low) // 2

        if feasible(mid):
            high = mid
        else:
            low = mid + 1

    return low
```

### Why `high = mid`?

`mid` is feasible, but we want the **smallest** feasible divisor.

Therefore `mid` must remain in the search space.

### Why `low = mid + 1`?

`mid` is not feasible, and every smaller divisor is also not feasible because smaller divisors produce an equal or larger sum.

---

## Explicit Answer Style

The same search can be written using a separate `ans`:

```python
def smallestDivisor(nums, threshold):
    low = 1
    high = max(nums)
    ans = high

    def feasible(divisor):
        total = 0

        for x in nums:
            total += (x + divisor - 1) // divisor

        return total <= threshold

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1

    return ans
```

Here:

```text
ans = smallest feasible divisor found so far
```

Both formulations are equivalent. The **implicit boundary version** is particularly clean for first-True problems.

---

## Dry Run

```text
nums = [1, 2, 5, 9]
threshold = 6
```

Search space:

```text
[1, 9]
```

Try `d = 5`:

$$  
1+1+1+2=5  
$$

`5 <= 6` → feasible.

Search smaller:

```text
[1, 5]
```

Try `d = 3`:

$$  
1+1+2+3=7  
$$

Not feasible.

Search larger:

```text
[4, 5]
```

Try `d = 4`:

$$  
1+1+2+3=7  
$$

Not feasible.

Therefore:

```text
d = 5
```

is the smallest feasible divisor.

---

## Complexity

Let:

- $n$ = `len(nums)`
    
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
\boxed{\text{Time} = O(n\log M)}  
$$

Auxiliary space:

$$  
\boxed{O(1)}  
$$

---

## Important Quirks

### 1. Ceiling division

Avoid floating point:

```python
ceil(x / d)
```

Use:

```python
(x + d - 1) // d
```

This is an important reusable integer-division trick.

---

### 2. Why `high = max(nums)`?

If:

```python
d = max(nums)
```

then every element produces:

```text
ceil(nums[i] / d) = 1
```

So the minimum possible sum is `len(nums)`.

Thus `max(nums)` is guaranteed to be sufficient **when the problem guarantees a valid answer**.

---

### 3. Feasibility condition

Use:

```python
total <= threshold
```

not:

```python
total == threshold
```

A divisor producing a smaller sum is still valid.

---

### 4. Early termination

You can optimize the validator:

```python
def feasible(divisor):
    total = 0

    for x in nums:
        total += (x + divisor - 1) // divisor

        if total > threshold:
            return False

    return True
```

Once the sum exceeds the threshold, the candidate is already impossible.

Worst-case complexity remains $O(n\log M)$.

---

## Pattern Connection

This is closely related to **Koko Eating Bananas**.

### Koko

```text
Candidate = eating speed
speed ↑ → hours required ↓
```

Find:

```text
minimum feasible speed
```

### Smallest Divisor

```text
Candidate = divisor
divisor ↑ → quotient sum ↓
```

Find:

```text
minimum feasible divisor
```

So both are:

```text
        Candidate X
             ↓
      calculate cost
             ↓
       cost <= limit?
             ↓
        F F F T T T
             ↓
        first True
```

The difference is only the **feasibility calculation**.

---

## Important Variations

### Rate / Speed

Instead of divisor:

```text
X = speed
```

Calculate how long the work takes.

**Example:** Koko Eating Bananas.

---

### Capacity

```text
X = maximum capacity
```

Greedily determine how many days/groups are needed.

**Example:** Capacity to Ship Packages.

---

### Time

```text
X = available time
```

Calculate how much work can be completed.

**Example:** Minimum Time to Complete Trips.

All follow the same abstraction:

> **Guess a numeric constraint → calculate whether it is sufficient → binary-search the first sufficient value.**

---

## Common Mistakes

- ❌ Thinking the divisor itself must appear in `nums`.
    
- ❌ Searching `nums` instead of `[1, max(nums)]`.
    
- ❌ Using normal division and accidentally getting floating-point values.
    
- ❌ Searching for `total == threshold` instead of `total <= threshold`.
    
- ❌ Forgetting that this is a **first-True** problem.
    
- ❌ Using `high = mid - 1` in the implicit boundary formulation.
    

---

## Pattern Recognition

When you see:

> **"Find the smallest integer X such that applying X to every element keeps some total below/within a threshold."**

Think:

```text
X = candidate divisor/rate/capacity
        ↓
calculate total cost
        ↓
cost <= threshold?
        ↓
monotonic?
        ↓
FFFFTTTT
        ↓
FIRST TRUE
```

### Mental hook

> **Smaller divisor → larger quotient sum. Larger divisor → smaller quotient sum. Therefore search for the smallest divisor that makes the sum fit the threshold.**