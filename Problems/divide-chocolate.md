---
Title: Divide Chocolate
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
  - Predicate Search - Maximize Minimum
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Divide Chocolate

**Pattern:**  Binary search on answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code
[Boundary style Binary Search](../Notes/Extras/Boundary%20style%20vs%20%20Explicit%20answer%20style%20Binary%20Search.md)

```Python
def maximizeSweetness(sweetness, k):
    pieces_needed = k + 1

    low = 1
    high = sum(sweetness) // pieces_needed

    def feasible(min_sweetness):
        pieces = 0
        current = 0

        for x in sweetness:
            current += x

            if current >= min_sweetness:
                pieces += 1
                current = 0

                if pieces == pieces_needed:
                    return True

        return False

    while low < high:
        # Upper midpoint for last-True search.
        mid = low + (high - low + 1) // 2

        if feasible(mid):
            low = mid
        else:
            high = mid - 1

    return low
```
**Time complexity** - O( n log S) , S = sum(sweetness)
**Aux. Space complexity** -  O(1)

---
# Divide Chocolate

> **LeetCode 1231 — Binary Search on Answer + Greedy Partition**
> 
> Core pattern: **Maximize the Minimum**

You have a chocolate bar represented by an array `sweetness`, where each value is the sweetness of a consecutive chunk.

You must divide it into **`k + 1` contiguous pieces** and give one piece to each person.

You want to maximize the **minimum sweetness** received by anyone.

---

## Key Idea

The problem asks:

> **What is the largest possible minimum piece sweetness?**

Guess a candidate minimum sweetness:

```text
X = minimum sweetness that every piece must have
```

Then ask:

> **Can I divide the chocolate into at least `k + 1` pieces, each having sweetness ≥ X?**

This produces:

```text
X:          small -------------------- large
feasible:   T T T T T F F F
                  ↑
           maximum feasible X
```

Therefore:

> **Maximize the minimum → Last True**

---

## Why the Greedy Validator Works

For a fixed `X`, scan from left to right and keep adding sweetness until:

```python
current_sum >= X
```

Then cut a piece and start the next one.

Why cut **as soon as possible**?

Because we only care whether we can create enough valid pieces. Taking extra sweetness into the current piece unnecessarily consumes sweetness that could help create future pieces.

So the greedy strategy maximizes the **number of pieces** satisfying the minimum `X`.

```python
pieces = 0
current = 0

for x in sweetness:
    current += x

    if current >= X:
        pieces += 1
        current = 0
```

If:

```text
pieces >= k + 1
```

then `X` is feasible.

---

## Why Binary Search Works

If a minimum sweetness of `X` is achievable, then any smaller minimum sweetness is also achievable.

Therefore:

```text
X:          1  2  3  4  5  6  7
feasible:   T  T  T  T  F  F  F
                     ↑
               maximum feasible
```

The predicate is monotonic:

$$  
feasible(X) \Rightarrow feasible(Y)  
\quad\text{for all }Y < X  
$$

So we search for the **last `True`**.

---

## Search Space

### Lower bound

```python
low = 1
```

Assuming sweetness values are positive.

### Upper bound

There are `k + 1` pieces, so their minimum cannot exceed the average:

$$  
\left\lfloor\frac{\sum sweetness}{k+1}\right\rfloor  
$$

A simple bound is:

```python
high = sum(sweetness) // (k + 1)
```

This is tighter than `sum(sweetness)`.

---

# Python Solution — Implicit Answer Style

```python
def maximizeSweetness(sweetness, k):
    pieces_needed = k + 1

    low = 1
    high = sum(sweetness) // pieces_needed

    def feasible(min_sweetness):
        pieces = 0
        current = 0

        for x in sweetness:
            current += x

            if current >= min_sweetness:
                pieces += 1
                current = 0

                if pieces == pieces_needed:
                    return True

        return False

    while low < high:
        # Upper midpoint for last-True search.
        mid = low + (high - low + 1) // 2

        if feasible(mid):
            low = mid
        else:
            high = mid - 1

    return low
```

### Why the upper midpoint?

We are searching for the **largest feasible value**.

If:

```text
low = 4
high = 5
```

then ordinary midpoint gives `4`.

If `4` is feasible and we do:

```python
low = mid
```

the range doesn't change.

Therefore:

```python
mid = low + (high - low + 1) // 2
```

guarantees progress.

---

# Explicit Answer Style

```python
def maximizeSweetness(sweetness, k):
    pieces_needed = k + 1

    low = 1
    high = sum(sweetness) // pieces_needed
    ans = low

    def feasible(min_sweetness):
        pieces = 0
        current = 0

        for x in sweetness:
            current += x

            if current >= min_sweetness:
                pieces += 1
                current = 0

                if pieces == pieces_needed:
                    return True

        return False

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            low = mid + 1       # Try a larger minimum.
        else:
            high = mid - 1

    return ans
```

Here:

```text
ans = largest feasible minimum sweetness found so far
```

For this problem, the **implicit last-True version** is particularly clean.

---

## Dry Run

```text
sweetness = [1, 2, 3, 4, 5, 6, 7, 8, 9]
k = 4
```

We need:

```text
k + 1 = 5 pieces
```

Total sweetness:

$$  
45  
$$

Upper bound:

$$  
45 / 5 = 9  
$$

Try:

```text
X = 7
```

Greedily:

```text
[1,2,3,4] = 10  → piece
[5,6]     = 11  → piece
[7]       = 7   → piece
[8]       = 8   → piece
[9]       = 9   → piece
```

5 pieces → feasible.

Try a larger value, say:

```text
X = 8
```

Greedy:

```text
[1,2,3,4] = 10
[5,6]     = 11
[7,8]     = 15
[9]       = 9
```

Only 4 pieces → not feasible.

Therefore the answer is:

```text
7
```

---

## Why "At Least `k + 1` Pieces" Is Correct

The problem asks for **exactly `k + 1` pieces**.

But our validator checks:

```python
pieces >= k + 1
```

Why is that okay?

If we can create more than `k + 1` pieces, we can **merge adjacent pieces** until exactly `k + 1` remain.

Merging only increases sweetness:

$$  
a+b \ge a,\quad a+b \ge b  
$$

So the minimum sweetness cannot decrease.

Therefore:

> If we can create **at least `k + 1` valid pieces**, an exactly `k + 1`-piece solution also exists.

This is an important reasoning point.

---

## Complexity

Let:

- $n$ = `len(sweetness)`
    
- $S$ = `sum(sweetness)`
    

Each feasibility check:

$$  
O(n)  
$$

Binary search range is at most $S$:

$$  
O(\log S)  
$$

Therefore:

$$  
\boxed{O(n\log S)}  
$$

### Auxiliary Space

$$  
\boxed{O(1)}  
$$

---

## Important Quirks

### 1. `k + 1`, not `k`

There are:

```text
k people receiving chocolate
+ 1 person keeping a piece
= k + 1 pieces
```

This is the most common problem-specific trap.

---

### 2. Greedy condition is `>= X`

We cut as soon as:

```python
current >= X
```

not when it equals `X`.

---

### 3. Don't try to maximize each individual piece

We only care about the **minimum** piece sweetness.

The greedy validator is trying to maximize the **number of pieces meeting X**, not maximize the sweetness of individual pieces.

---

## Connection to Magnetic Force / Aggressive Cows

These two problems look different but have the same Binary Search on Answer structure.

### Magnetic Force

```text
MAXIMIZE minimum distance
        ↓
Can I place m balls with distance >= X?
        ↓
Greedy placement
        ↓
LAST TRUE
```

### Divide Chocolate

```text
MAXIMIZE minimum sweetness
        ↓
Can I create k+1 pieces with sweetness >= X?
        ↓
Greedy partition
        ↓
LAST TRUE
```

So the broader pattern is:

$$  
\boxed{\text{Maximize Minimum} \rightarrow \text{Feasibility} \rightarrow \text{Last True}}  
$$

The validator is different:

- Magnetic Force → **greedy placement**
    
- Divide Chocolate → **greedy partition**
    

---

## Important Variations

### ⭐ Must Know

**Magnetic Force / Aggressive Cows**

Same `maximize minimum` boundary, but the validator places objects based on distance.

### ⭐ Related

**Split Array Largest Sum / Book Allocation / Painter's Partition**

These are the opposite optimization:

```text
Minimize Maximum
```

instead of:

```text
Maximize Minimum
```

---

## Common Mistakes

- ❌ Using `k` instead of `k + 1`.
    
- ❌ Searching for the **first** feasible value.
    
- ❌ Using lower midpoint with `low = mid` and causing an infinite loop.
    
- ❌ Requiring exactly `k + 1` pieces inside the validator.
    
- ❌ Cutting only when `current == X`.
    
- ❌ Trying to optimize the actual partition instead of checking feasibility.
    

---

## Pattern Recognition

When you see:

> **"Divide/split/select into K groups so that the minimum value/sum/quality is as large as possible."**

Think:

```text
MAXIMIZE THE MINIMUM
        ↓
Guess minimum allowed value X
        ↓
Can I create enough valid groups?
        ↓
Greedy validator
        ↓
TTTTFFFF
        ↓
Binary Search → LAST TRUE
```

### Mental hook

> **"Guess how good the worst piece can be. Greedily create as many pieces meeting that minimum as possible. If I can create enough, try demanding more."**