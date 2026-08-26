---
Title: Koko Eating Bananas - Predicate Search
Companies:
  - Amazon
  - Google
Topics:
  - Searching
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Binary Search
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Koko Eating Bananas

**Pattern:**  Binary Search on Answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code

 [Boundary style Binary Search](../Notes/Extras/Boundary%20style%20vs%20%20Explicit%20answer%20style%20Binary%20Search.md)
```Python

def min_eating_speed(piles, h):

    low = 1
    high = max(piles)

    while low < high:

        mid = (low + high) // 2

        hours = 0

        for pile in piles:
            hours += (pile + mid - 1) // mid

        if hours <= h:
            high = mid
        else:
            low = mid + 1

    return low
```
**Time complexity** - O(nLogM) where m is max(piles)
**Aux. Space complexity** -  O(1)

---
# Koko Eating Bananas — Binary Search on Answer

A classic **Binary Search on Answer** problem and one of the most important problems for recognizing this pattern.

The core idea is:

> We are not searching an array. We are searching for the **minimum eating speed** that allows Koko to finish all bananas within `h` hours.

---

# Problem Statement

Given:

- `piles[i]` = number of bananas in the `i`th pile
    
- `h` = maximum number of hours available
    

Koko eats at a constant speed of `k` bananas/hour.

For each pile, she takes:

$$  
\left\lceil\frac{piles[i]}{k}\right\rceil  
$$

hours.

Find the **minimum `k`** such that all piles can be eaten within `h` hours.

---

# Example

```text
piles = [3, 6, 7, 11]
h = 8
```

Try:

```text
k = 4
```

Hours required:

$$  
\lceil3/4\rceil+  
\lceil6/4\rceil+  
\lceil7/4\rceil+  
\lceil11/4\rceil  
$$

$$  
=1+2+2+3  
$$

$$  
=8  
$$

Therefore `k = 4` works.

Could `k = 3` work?

$$  
1+2+3+4=10  
$$

No.

Therefore:

```text
answer = 4
```

---

# Key Observation

Consider different speeds:

```text
k = 1   → too slow
k = 2   → too slow
k = 3   → too slow
k = 4   → works
k = 5   → works
k = 6   → works
...
```

The feasibility pattern is:

```text
✗ ✗ ✗ ✓ ✓ ✓ ✓ ✓
          ↑
       answer
```

This is **monotonic**.

Once a speed is fast enough, every larger speed is also fast enough.

Therefore:

$$  
\boxed{\text{Binary Search}}  
$$

can be applied.

---

# Search Space

What is the minimum possible speed?

At least:

```text
1 banana/hour
```

What is the maximum useful speed?

The largest pile:

$$  
\max(piles)  
$$

If Koko can eat an entire largest pile in one hour, going faster than that is unnecessary.

Therefore:

```text
low = 1
high = max(piles)
```

---

# Feasibility Check

For a given speed `k`, calculate the total hours required:

$$  
hours =  
\sum_i  
\left\lceil  
\frac{piles[i]}{k}  
\right\rceil  
$$

If:

$$  
hours \le h  
$$

then speed `k` is feasible.

Otherwise, it is too slow.

---

# Calculating <mark>Ceiling Division</mark>

In Python:

```python
(pile + k - 1) // k
```

is equivalent to:

$$  
\left\lceil\frac{pile}{k}\right\rceil  
$$

So:

```python
hours += (pile + k - 1) // k
```

---

# Python Solution

```python
def min_eating_speed(piles, h):

    low = 1
    high = max(piles)

    while low < high:

        mid = (low + high) // 2

        hours = 0

        for pile in piles:
            hours += (pile + mid - 1) // mid

        if hours <= h:
            high = mid
        else:
            low = mid + 1

    return low
```

---

# Why `high = mid`?

If:

```text
hours <= h
```

then `mid` is a valid speed.

But we are looking for the **minimum** valid speed.

So:

```python
high = mid
```

We keep `mid` as a candidate and search to the left.

This is exactly the same **first valid answer / boundary** pattern you've seen in binary search.

---

# Why `low = mid + 1`?

If:

```text
hours > h
```

then `mid` is too slow.

Therefore `mid` cannot be the answer.

So we discard it:

```python
low = mid + 1
```

---

# Dry Run

```text
piles = [3, 6, 7, 11]
h = 8
```

Search space:

```text
1 ... 11
```

### Try `k = 6`

Hours:

```text
3  → 1
6  → 1
7  → 2
11 → 2
```

Total:

```text
6 hours
```

So:

```text
6 works
```

Search left.

---

### Try `k = 3`

Hours:

```text
3  → 1
6  → 2
7  → 3
11 → 4
```

Total:

```text
10 hours
```

Too slow.

Search right.

---

### Try `k = 4`

Hours:

```text
1 + 2 + 2 + 3 = 8
```

Works.

Search left.

Eventually:

```text
low == high == 4
```

Answer:

```text
4
```

---

# Complexity

Let:

$$  
n = \text{number of piles}  
$$

and:

$$  
M = \max(piles)  
$$

The search space contains speeds from:

$$  
1\rightarrow M  
$$

Therefore there are:

$$  
O(\log M)  
$$

binary-search iterations.

Each feasibility check examines every pile:

$$  
O(n)  
$$

Therefore:

$$  
\boxed{  
O(n\log M)  
}  
$$

### Auxiliary Space

Only a few variables are used:

$$  
\boxed{  
O(1)  
}  
$$

---

# Important Optimization: Early Exit

We only care whether:

```text
hours <= h
```

If the accumulated hours already exceed `h`, we know the speed is invalid.

So we can stop early:

```python
def min_eating_speed(piles, h):

    low = 1
    high = max(piles)

    while low < high:

        mid = (low + high) // 2

        hours = 0

        for pile in piles:

            hours += (pile + mid - 1) // mid

            if hours > h:
                break

        if hours <= h:
            high = mid
        else:
            low = mid + 1

    return low
```

This does not change the worst-case complexity, but can improve practical performance.

---

# Why Not Greedily Choose a Speed?

You might think:

> Why not calculate the average bananas/hour?

Because the constraint is **per pile**, and Koko cannot carry bananas from one pile to another.

For example:

```text
piles = [100, 1, 1]
h = 3
```

Average bananas/hour is roughly:

$$  
34  
$$

but the answer is actually:

```text
100
```

because Koko must finish the pile containing 100 bananas in one hour.

This is why we need the feasibility function rather than a simple average.

---

# Important Edge Cases

## `h == len(piles)`

Koko has exactly one hour per pile.

Therefore she must finish each pile in one hour.

Answer:

$$  
\max(piles)  
$$

---

## Very Large `h`

Koko has lots of time, so the minimum speed can be very small.

The lower bound remains:

```text
1
```

---

## One Pile

```text
piles = [10]
h = 3
```

Need:

$$  
\lceil10/k\rceil\le3  
$$

Answer:

```text
4
```

---

# The General Pattern

Koko is not really about bananas.

The reusable structure is:

```text
Choose an answer X
        ↓
Can X satisfy the constraint?
        ↓
Yes → try smaller X
No  → try larger X
```

This gives:

```text
              Feasible?
                 ↓
       ┌─────────┴─────────┐
      YES                  NO
       ↓                    ↓
 search LEFT            search RIGHT
```

---

# Related FAANG Interview Problems

Koko is an important representative of a much larger family.

## 1. Capacity to Ship Packages Within D Days

**LeetCode 1011**

Search for the minimum shipping capacity.

```text
candidate = capacity
check = can ship everything within D days?
```

Pattern:

$$  
\boxed{\text{Binary Search on Answer}}  
$$

---

## 2. Minimum Number of Days to Make M Bouquets

**LeetCode 1482**

Search for the minimum number of days.

```text
candidate = days
check = can make m bouquets?
```

Again:

$$  
\boxed{\text{Binary Search on Answer}}  
$$

---

## 3. Split Array Largest Sum

**LeetCode 410**

Search for the minimum possible maximum subarray sum.

```text
candidate = maximum allowed sum
check = can split array into <= k pieces?
```

---

## 4. Magnetic Force Between Two Balls

**LeetCode 1552**

Search for the maximum possible minimum distance.

This reverses the usual formulation:

```text
candidate = minimum distance
check = can we place all balls?
```

---

# Important Recognition Pattern

When the question asks for:

> **Minimum X such that condition is possible**

think:

```text
Binary Search on Answer
```

Examples:

```text
Minimum eating speed
Minimum shipping capacity
Minimum days
Minimum maximum workload
Minimum distance
```

Likewise:

> **Maximum X such that condition is possible**

can also use the same technique.

---

# Why This Is Different From Normal Binary Search

### Normal Binary Search

Search an actual sorted array:

```text
[1, 3, 5, 7, 9]
 ↑        ↑
search target
```

### Koko

There isn't an array of possible answers.

Instead:

```text
Possible speeds:

1, 2, 3, 4, 5, 6, 7, ...
```

We can **test** each candidate speed.

The only requirement is that the test is monotonic:

```text
too slow → too slow → works → works → works
```

Therefore we can binary-search the **answer space**.

---

# Common Interview Mistakes

### Mistake 1: Using `sum(piles) / h`

The average does not account for the individual pile boundaries.

---

### Mistake 2: Using floor division

Wrong:

```python
hours += pile // k
```

For:

```text
pile = 7
k = 3
```

we need:

$$  
\lceil7/3\rceil=3  
$$

but:

$$  
7//3=2  
$$

Use:

```python
(pile + k - 1) // k
```

---

### Mistake 3: Searching up to `sum(piles)`

Technically possible, but unnecessary.

The maximum useful speed is:

```python
max(piles)
```

because Koko never needs more than one hour to eat a pile.

---

### Mistake 4: Returning `mid` when feasible

The first feasible speed may not be the minimum.

When feasible:

```python
high = mid
```

not:

```python
return mid
```

---

# Pythonic Way

There isn't a useful built-in Python function for this problem.

The important Python idiom is the ceiling division:

```python
(pile + speed - 1) // speed
```

or, if you want the mathematical form explicitly:

```python
import math

math.ceil(pile / speed)
```

For DSA code, integer arithmetic is preferable:

```python
(pile + speed - 1) // speed
```

because it avoids floating-point calculations.

---

# Key Takeaways

The entire problem can be reduced to:

### Search Space

$$  
1\le k\le\max(piles)  
$$

### Feasibility

# $$  
hours(k)

\sum_i  
\left\lceil  
\frac{piles[i]}{k}  
\right\rceil  
$$

### Binary Search

```python
if hours <= h:
    high = mid
else:
    low = mid + 1
```

### Complexity

$$  
\boxed{  
O(n\log(\max(piles)))  
}  
$$

time and

$$  
\boxed{  
O(1)  
}  
$$

auxiliary space.

> **Interview Tip:** The important lesson from Koko is not the banana calculation. It's the recognition: **"I need the minimum value of X for which a feasibility condition becomes true."** Once you can write a monotonic `can(X)` function, Binary Search on Answer becomes the natural solution.