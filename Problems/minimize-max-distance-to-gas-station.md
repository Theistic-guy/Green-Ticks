---
Title: Minimize Max Distance to Gas Station
Companies:
  - Google
Topics:
  - Searching
  - Greedy
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Binary Search
  - Predicate Search - Minimize Maximum
Link: ""
---

# Minimize Max Distance to Gas Station

**Pattern:**  Binary Search on answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)

---

## 💻 Code

```Python
import math

def minmaxGasDist(stations, k):
    stations.sort()

    low = 0.0
    high = stations[-1] - stations[0]

    def feasible(max_gap):
        required = 0

        for i in range(1, len(stations)):
            gap = stations[i] - stations[i - 1]
            required += math.ceil(gap / max_gap) - 1

            if required > k:
                return False

        return True

    for _ in range(100):
        mid = (low + high) / 2

        if feasible(mid):
            high = mid
        else:
            low = mid

    return high
```
**Time complexity** - O(nlogn) 
**Aux. Space complexity** -  O(1)

---
# Minimize Max Distance to Gas Station



> **LeetCode 774 — Binary Search on Answer + Greedy Counting**
> 
> Core pattern: **Minimize the Maximum**, but unlike the previous problems, the answer is **continuous**, so we use floating-point binary search.

---

## Problem

Given sorted positions of existing gas stations and `k` additional stations, place the new stations so that the **maximum distance between any two adjacent stations is minimized**.

Example:

```text
stations = [1, 10]
k = 2
```

We can place stations at approximately:

```text
1 --- 4 --- 7 --- 10
```

The maximum gap becomes approximately:

$$  
3  
$$

---

## Key Idea

We want to:

> **Minimize the maximum gap between adjacent gas stations.**

Instead of directly deciding where to put the stations, guess the maximum allowed gap:

```text
X = maximum allowed distance between adjacent stations
```

Then ask:

> **Can I make every gap ≤ X using at most `k` new stations?**

This gives:

```text
X:
small -------------------- large

feasible:
F F F F T T T T
        ↑
  minimum feasible
```

So this is:

> **Minimize Maximum → First True**

---

## The Important Part: How Many Stations Are Needed?

Consider one existing gap:

```text
distance = 10
```

Suppose:

```text
X = 3
```

We need to split the gap into pieces of length at most `3`.

```text
10 → 3 + 3 + 3 + 1
```

This requires **4 segments**, therefore:

$$  
4-1=3  
$$

new stations.

In general:

$$  
\boxed{  
stationsRequired =  
\left\lceil\frac{gap}{X}\right\rceil - 1  
}  
$$

Using integer arithmetic isn't possible here because `X` is floating-point, so we normally use:

```python
math.ceil(gap / X) - 1
```

---

## Why the Predicate Is Monotonic

Suppose a maximum gap of `5` is achievable.

Then a maximum gap of `6`, `7`, etc. is obviously achievable as well because the requirement becomes less strict.

Therefore:

```text
X:          1  2  3  4  5  6  7 ...
feasible:   F  F  F  F  T  T  T ...
                        ↑
                  first feasible
```

So binary search is valid.

---

# Approach

1. Sort the station positions.
    
2. Calculate every existing gap.
    
3. Binary-search the possible maximum gap.
    
4. For candidate `mid`, calculate how many new stations are required.
    
5. If required stations `<= k`, `mid` is feasible → search smaller.
    
6. Otherwise, `mid` is too small → search larger.
    
7. Stop when the answer is sufficiently precise.
    

---

# Python Solution

For continuous binary search, a **fixed number of iterations** is generally cleaner than using `while low < high`.

```python
import math

def minmaxGasDist(stations, k):
    stations.sort()

    low = 0.0
    high = stations[-1] - stations[0]

    def feasible(max_gap):
        required = 0

        for i in range(1, len(stations)):
            gap = stations[i] - stations[i - 1]
            required += math.ceil(gap / max_gap) - 1

            if required > k:
                return False

        return True

    for _ in range(100):
        mid = (low + high) / 2

        if feasible(mid):
            high = mid
        else:
            low = mid

    return high
```

### Why 100 iterations?

Each iteration halves the search interval.

After sufficiently many iterations, the interval becomes far smaller than the required precision.

Using a fixed iteration count avoids floating-point termination issues such as:

```python
while low < high:
```

which is inappropriate for real-valued binary search because exact equality is unreliable.

---

# Explicit Answer Style

The same idea can conceptually use an explicit `ans`, although it is less necessary for continuous search:

```python
import math

def minmaxGasDist(stations, k):
    stations.sort()

    low = 0.0
    high = stations[-1] - stations[0]
    ans = high

    def feasible(max_gap):
        required = 0

        for i in range(1, len(stations)):
            gap = stations[i] - stations[i - 1]
            required += math.ceil(gap / max_gap) - 1

            if required > k:
                return False

        return True

    for _ in range(100):
        mid = (low + high) / 2

        if feasible(mid):
            ans = mid
            high = mid
        else:
            low = mid

    return ans
```

For this problem, the **implicit boundary style** is cleaner: `high` represents a known feasible upper bound, and we continually move it toward the optimal value.

---

## Dry Run

Consider:

```text
stations = [1, 10]
k = 2
```

There is one gap:

$$  
10-1=9  
$$

Suppose:

```text
X = 3
```

Required stations:

$$  
\left\lceil\frac{9}{3}\right\rceil - 1  
= 3-1  
=2  
$$

So `X = 3` is feasible.

Try:

```text
X = 2
```

Required:

$$  
\left\lceil\frac{9}{2}\right\rceil - 1  
=5-1  
=4  
$$

Need 4 stations, but only 2 are available.

Therefore:

```text
2 → False
3 → True
```

The answer is:

$$  
\boxed{3}  
$$

---

## The Subtle Counting Formula

This formula is worth understanding carefully:

$$  
\boxed{  
\left\lceil\frac{gap}{X}\right\rceil - 1  
}  
$$

### Example: `gap = 10`, `X = 3`

$$  
\lceil10/3\rceil-1=4-1=3  
$$

Correct:

```text
10
↓
3 | 3 | 3 | 1
```

3 new stations.

### Example: `gap = 9`, `X = 3`

$$  
\lceil9/3\rceil-1=3-1=2  
$$

Correct:

```text
3 | 3 | 3
```

Only 2 new stations.

### Common mistake

Don't use:

```python
gap // max_gap
```

blindly.

The answer involves **ceiling**, not floor, because we need to know how many segments are necessary to keep every segment within `X`.

---

## Why We Don't Actually Calculate Station Positions

For feasibility, we only care about:

> **How many new stations are required?**

We don't care where exactly they are placed.

For each existing gap, the optimal number of stations needed to make that gap ≤ `X` is determined independently by:

$$  
\left\lceil\frac{gap}{X}\right\rceil - 1  
$$

Therefore:

$$  
totalRequired =  
\sum gaps  
\left(  
\left\lceil\frac{gap}{X}\right\rceil-1  
\right)  
$$

If:

$$  
totalRequired \le k  
$$

then the candidate is feasible.

---

## Complexity

Let:

- $n$ = number of existing stations
    
- $I$ = number of binary-search iterations
    

Sorting:

$$  
O(n\log n)  
$$

Each feasibility check:

$$  
O(n)  
$$

With a fixed `I` (e.g. 100):

$$  
\boxed{O(n\log n + nI)}  
$$

Since `I` is a constant:

$$  
\boxed{O(n\log n)}  
$$

in practical asymptotic terms.

### Auxiliary Space

Ignoring the implementation details of Python's sorting algorithm:

$$  
\boxed{O(1)}  
$$

The algorithm itself uses only a constant number of variables.

---

## Precision / Floating-Point Issues

This is the major new concept compared with the Binary Search on Answer problems you've covered so far.

Here the answer may be:

```text
2.5
3.333333...
4.125
```

rather than an integer.

Therefore:

### Don't do this

```python
while low < high:
```

Floating-point values may never become exactly equal.

### Prefer

```python
for _ in range(100):
```

or a precision-based condition such as:

```python
while high - low > 1e-6:
```

A fixed iteration count is usually simpler and interview-friendly.

---

## Connection to Previous Problems

This is the same **Minimize the Maximum** pattern you've already seen:

### Split Array

```text
candidate = maximum subarray sum
        ↓
greedy partition
        ↓
groups <= K?
        ↓
FIRST TRUE
```

### Balls in a Bag

```text
candidate = maximum balls/bag
        ↓
calculate required splits
        ↓
operations <= K?
        ↓
FIRST TRUE
```

### Gas Station

```text
candidate = maximum gap
        ↓
calculate required stations
        ↓
stations <= K?
        ↓
FIRST TRUE
```

The important new variation is:

> **The answer space is continuous rather than integer-valued.**

---

# Integer vs Continuous Binary Search

||Integer Answer|Continuous Answer|
|---|---|---|
|Example|Ship capacity|Gas station gap|
|Search values|`1, 2, 3...`|Real numbers|
|Termination|`low < high` / `low <= high`|Usually fixed iterations / epsilon|
|`mid`|Integer|Floating point|
|Predicate|Monotonic|Monotonic|
|Boundary|Exact integer|Approximation|

---

## Important Variations

### ⭐ Must understand

**Continuous Binary Search / Binary Search on Real Answer**

Whenever the answer is a real number and:

```text
feasible(X)
```

is monotonic, binary search can still work.

Examples include:

- minimizing maximum distance
    
- minimizing maximum average/value
    
- finding a minimum real-valued threshold
    

### Related but different

Some optimization problems use **ternary search** when the objective is unimodal rather than a monotonic feasibility predicate.

Don't automatically use binary search merely because the answer is numerical—the **monotonic predicate** is what justifies it here.

---

## Common Mistakes

- ❌ Using integer binary search logic for a floating-point answer.
    
- ❌ Using `while low < high` with floats.
    
- ❌ Using `gap // X` instead of the ceiling-based formula.
    
- ❌ Forgetting the `-1` because `k` counts **new stations**, not resulting segments.
    
- ❌ Forgetting to sort the stations.
    
- ❌ Checking whether `required == k` instead of `required <= k`.
    
- ❌ Simulating the actual placement of every new station unnecessarily.
    
- ❌ Running binary search until exact floating-point equality.
    

---

# Pattern Recognition

When you see:

> **"Add at most K points/stations/splits to minimize the maximum distance/size."**

Think:

```text
MINIMIZE THE MAXIMUM
        ↓
Guess maximum allowed value X
        ↓
How many operations/stations are
needed to make every segment <= X?
        ↓
required <= K ?
        ↓
FFFFTTTT
        ↓
FIRST TRUE
```

And if `X` is a **real number**:

```text
        ↓
Continuous Binary Search
        ↓
fixed iterations / precision threshold
```

### Mental hook

> **"Guess the maximum gap. Count how many stations are necessary to enforce that gap. If I can do it with K stations, demand an even smaller gap."**