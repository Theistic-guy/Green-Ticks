---
Title: Magnetic Force Between Two Balls / Aggressive Cows
Companies:
  - Amazon
  - Meta
  - Google
Topics:
  - Searching
  - Greedy
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Binary Search
  - Predicate Search - Maximize Minimum
Link: ""
---

# Magnetic Force Between Two Balls / Aggressive Cows

**Pattern:** Binary Search on answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code
[Explicit answer style Binary Search](../Notes/Extras/Boundary%20style%20vs%20%20Explicit%20answer%20style%20Binary%20Search.md)
```Python
def maxDistance(position, m):
    position.sort()

    low = 1
    high = position[-1] - position[0]
    ans = low

    def feasible(distance):
        balls = 1
        last = position[0]

        for pos in position[1:]:
            if pos - last >= distance:
                balls += 1
                last = pos

                if balls == m:
                    return True

        return False

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            low = mid + 1       # Try a larger distance.
        else:
            high = mid - 1

    return ans

```
**Time complexity** - O(nlogn + nlogD)
**Aux. Space complexity** -  O(1)

---


> **LeetCode 1552 — Binary Search on Answer + Greedy Placement**
> 
> Core pattern: **Maximize the Minimum**

Given positions of `m` balls/stalls, place `m` balls such that the **minimum distance between any two placed balls is as large as possible**.

The classic **Aggressive Cows** problem is essentially the same pattern.

---

## Key Idea

We are maximizing the **minimum distance**.

Instead of directly finding the optimal placement, guess:

```text
X = required minimum distance between consecutive balls
```

Then ask:

> **Can I place all `m` balls such that every two consecutive placed balls are at least `X` apart?**

This produces:

```text
distance X:
small -------------------- large

feasible:
T T T T T F F F
          ↑
    maximum feasible
```

So this is a **last-True** binary search.

---

## Why Greedy Placement Works

For a fixed distance `X`:

> Always place the next ball at the **earliest possible position**.

Why?

Placing a ball earlier leaves **more space for all future balls**.

Example:

```text
positions = [1, 2, 4, 8, 9]
X = 3
```

Place first ball:

```text
1
```

Next ball must be at least:

```text
1 + 3 = 4
```

So choose:

```text
4
```

Next must be at least:

```text
4 + 3 = 7
```

Choose:

```text
8
```

We successfully placed 3 balls.

The greedy strategy therefore answers:

> **Can this minimum distance X be achieved?**

It doesn't need to find the globally optimal placement.

---

## Why Binary Search Works

If a distance `X` is feasible, then **every smaller distance** is also feasible.

For example:

```text
distance:   1  2  3  4  5  6  7
feasible:   T  T  T  T  F  F  F
                        ↑
                 maximum feasible
```

Therefore:

$$  
X_1 \le X_2 \land feasible(X_2)  
\Rightarrow feasible(X_1)  
$$

The predicate is:

```text
TTTTFFFF
```

→ find the **last `True`**.

---

## Search Space

Sort the positions first:

```python
positions.sort()
```

Then:

### Minimum distance

```python
low = 1
```

(or `0` depending on the problem's exact constraints).

### Maximum distance

The largest possible separation is between the two extreme positions:

```python
high = positions[-1] - positions[0]
```

So:

```text
[1, max_position - min_position]
```

---

# Approach

### Feasibility check

For candidate distance `d`:

1. Place the first ball at the first position.
    
2. Scan left to right.
    
3. Place another ball whenever:
    
    ```python
    position - last_position >= d
    ```
    
4. If we place at least `m` balls → feasible.
    

---

## Python Solution — Implicit Answer Style

```python
def maxDistance(position, m):
    position.sort()

    low = 1
    high = position[-1] - position[0]

    def feasible(distance):
        balls = 1
        last = position[0]

        for pos in position[1:]:
            if pos - last >= distance:
                balls += 1
                last = pos

                if balls == m:
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

### Why the `+1`?

For a **last-True** search:

```python
mid = low + (high - low + 1) // 2
```

is important.

Without the `+1`, when:

```text
low = 4
high = 5
```

we get:

```text
mid = 4
```

If `4` is feasible and we do:

```python
low = mid
```

nothing changes → infinite loop.

The upper midpoint guarantees progress.

---

## Explicit Answer Style

The same problem can be written with a separate `ans`:

```python
def maxDistance(position, m):
    position.sort()

    low = 1
    high = position[-1] - position[0]
    ans = low

    def feasible(distance):
        balls = 1
        last = position[0]

        for pos in position[1:]:
            if pos - last >= distance:
                balls += 1
                last = pos

                if balls == m:
                    return True

        return False

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            low = mid + 1       # Try a larger distance.
        else:
            high = mid - 1

    return ans
```

Here:

```text
ans = largest feasible distance found so far
```

For this problem, I prefer the **implicit last-True version**, because the boundary directly represents the answer.

---

## Dry Run

```text
positions = [1, 2, 4, 8, 9]
m = 3
```

Try:

```text
distance = 3
```

Greedy placement:

```text
1 → 4 → 8
```

3 balls → feasible.

Try:

```text
distance = 4
```

```text
1 → 8
```

Only 2 balls → not feasible.

Therefore:

```text
3 → True
4 → False
```

Answer:

```text
3
```

---

## Complexity

Let:

- $n$ = number of positions
    
- $D$ = `max(position) - min(position)`
    

Sorting:

$$  
O(n\log n)  
$$

Each feasibility check:

$$  
O(n)  
$$

Binary search:

$$  
O(\log D)  
$$

Total:

$$  
\boxed{O(n\log n + n\log D)}  
$$

### Auxiliary Space

In Python, `position.sort()` sorts **in-place**, so:

$$  
\boxed{O(1)}  
$$

auxiliary space for the algorithm itself, ignoring Python's internal sorting implementation details.

---

## Important Quirks

### 1. Sort first

The greedy placement relies on positions being ordered.

```python
position.sort()
```

---

### 2. Check consecutive placed balls

You only need to ensure:

```python
pos - last >= distance
```

for consecutive placed balls.

If consecutive placements satisfy the distance, all farther-apart pairs automatically do too.

---

### 3. Don't greedily choose the farthest position

The correct greedy strategy is:

> **Choose the earliest valid position.**

Not:

> Choose the position that looks farthest away.

Choosing early preserves maximum remaining space.

---

### 4. We are maximizing a minimum

This is the key conceptual inversion:

```text
"minimum distance should be as large as possible"
```

becomes:

```text
Guess minimum distance X
        ↓
Can X be achieved?
        ↓
last feasible X
```

---

# Connection to Previous Problems

Compare this with **Split Array Largest Sum**:

### Split Array

```text
MINIMIZE maximum
        ↓
candidate maximum load
        ↓
greedy partition
        ↓
FIRST TRUE
```

### Magnetic Force

```text
MAXIMIZE minimum
        ↓
candidate minimum distance
        ↓
greedy placement
        ↓
LAST TRUE
```

This gives you the two most important Binary Search on Answer patterns:

|Optimization|Predicate|Boundary|
|---|---|---|
|**Minimize maximum**|Can maximum ≤ `X`?|First True|
|**Maximize minimum**|Can minimum ≥ `X`?|Last True|

---

## Aggressive Cows

The classic problem is essentially the same:

> Given stall positions, place `k` cows such that the **minimum distance between any two cows is maximized**.

The solution is identical:

```text
sort stalls
    ↓
binary search minimum distance
    ↓
greedy placement validator
    ↓
last feasible distance
```

Only the story changes:

```text
Magnetic Force:
    balls → baskets/positions

Aggressive Cows:
    cows → stalls
```

This is a **single pattern**, not two separate algorithms.

---

## Important Variations

### ⭐ Must Know

**Aggressive Cows**

Classic interview/DSA version of exactly the same pattern.

### ⭐ Useful

Problems involving:

- maximizing minimum distance
    
- maximizing minimum value
    
- placing objects with separation constraints
    
- selecting locations while maintaining a minimum gap
    

### Advanced

Some problems combine the same binary-search boundary idea with a more complicated validator rather than simple greedy placement.

Those are worth learning later; the key pattern here is the **greedy feasibility check**.

---

## Common Mistakes

- ❌ Forgetting to sort.
    
- ❌ Searching for the actual optimal arrangement instead of checking feasibility.
    
- ❌ Finding the **first** feasible distance instead of the **last**.
    
- ❌ Using the normal midpoint and getting stuck with `low = mid`.
    
- ❌ Placing objects as far right/far apart as possible instead of choosing the **earliest valid position**.
    
- ❌ Checking every pair of placed balls unnecessarily.
    

---

## Pattern Recognition

When you see:

> **"Place/select `K` objects so that the minimum distance/separation/value is as large as possible."**

Think immediately:

```text
MAXIMIZE THE MINIMUM
        ↓
Guess minimum allowed distance X
        ↓
Greedily place objects
        ↓
Can I place >= K?
        ↓
TTTTFFFF
        ↓
Binary Search → LAST TRUE
```

### Mental hook

> **"For a guessed minimum distance, place each object as early as possible. If I can still place K objects, the distance works; try a larger one."**