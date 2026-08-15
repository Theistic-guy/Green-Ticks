---
Title: K-th Smallest Number in Multiplication Table
Companies:
  - Google
Topics:
  - Searching
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Binary Search
  - Predicate Search - Counting
  - kth
Link: ""
---

# K-th Smallest Number in Multiplication Table

**Pattern:**  Binary Search on answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code

[Explicit answer style Binary Search](../Notes/Extras/Boundary%20style%20vs%20%20Explicit%20answer%20style%20Binary%20Search.md)

```Python
def findKthNumber(m, n, k):
    m, n = min(m, n), max(m, n)

    low = 1
    high = m * n
    ans = high

    def count_leq(x):
        count = 0

        for i in range(1, m + 1):
            count += min(n, x // i)

        return count

    while low <= high:
        mid = low + (high - low) // 2

        if count_leq(mid) >= k:
            ans = mid
            high = mid - 1
        else:
            low = mid + 1

    return ans
```
**Time complexity** - O( m log (mn)) , m = min(original,m,n)
**Aux. Space complexity** -  O(1)

---
# K-th Smallest Number in Multiplication Table



Given an $m \times n$ multiplication table:

$$  
table[i][j] = i \times j  
$$

find the **$k$-th smallest number** in the table.

Example for $3 \times 3$:

```text
1  2  3
2  4  6
3  6  9
```

The sorted values are:

```text
1, 2, 2, 3, 3, 4, 6, 6, 9
```

So the 5th smallest is `3`.

---

## Key Idea

We **do not construct the table**.

Instead, binary-search the possible answer:

```text
answer ∈ [1, m * n]
```

For a candidate value `x`, ask:

> **How many numbers in the multiplication table are ≤ x?**

If at least `k` numbers are `≤ x`, then the $k$-th smallest number is also `≤ x`.

So define:

```python
count(x) = number of table values <= x
```

and search for the **smallest `x` such that:**

$$  
count(x) \ge k  
$$

This is a **first-True** predicate.

---

## Counting Values ≤ `x`

Consider row `i`:

```text
i, 2i, 3i, 4i, ..., ni
```

We need:

$$  
i \times j \le x  
$$

Therefore:

$$  
j \le \frac{x}{i}  
$$

There are at most `n` columns, so:

$$  
count_i = \min\left(n,\left\lfloor\frac{x}{i}\right\rfloor\right)  
$$

Hence:

$$  
count(x)

\sum_{i=1}^{m}  
\min\left(n,\left\lfloor\frac{x}{i}\right\rfloor\right)  
$$

This lets us count in $O(m)$ without constructing the table.

---

## Why Binary Search Works

As `x` increases, the number of table elements `≤ x` can only increase.

Example:

```text
x:       1  2  3  4  5  6  7 ...
count:   1  3  5  6  6  8  8 ...
                     ...
count>=k:
         F  F  F  T  T  T  T
```

So:

```text
FFFFTTTT
    ↑
first True
```

The answer is the **smallest value whose count is at least `k`**.

---

# Approach

1. Search values from `1` to `m * n`.
    
2. For candidate `mid`, count how many table values are `≤ mid`.
    
3. If count `>= k`:
    
    - `mid` could contain the answer.
        
    - Search smaller.
        
4. Otherwise:
    
    - Too few values are `≤ mid`.
        
    - Search larger.
        

---

# Python Solution — Implicit Answer Style

```python
def findKthNumber(m, n, k):
    low = 1
    high = m * n

    # Iterate over the smaller dimension to reduce work.
    m, n = min(m, n), max(m, n)

    def count_leq(x):
        count = 0

        for i in range(1, m + 1):
            count += min(n, x // i)

        return count

    while low < high:
        mid = low + (high - low) // 2

        if count_leq(mid) >= k:
            high = mid
        else:
            low = mid + 1

    return low
```

### Why `high = mid`?

`count(mid) >= k` means `mid` is large enough to contain at least `k` elements.

So `mid` **could be the answer**.

We keep it:

```python
high = mid
```

and try to find a smaller valid value.

---

# Explicit Answer Style

The same first-True search can use a separate `ans`:

```python
def findKthNumber(m, n, k):
    m, n = min(m, n), max(m, n)

    low = 1
    high = m * n
    ans = high

    def count_leq(x):
        count = 0

        for i in range(1, m + 1):
            count += min(n, x // i)

        return count

    while low <= high:
        mid = low + (high - low) // 2

        if count_leq(mid) >= k:
            ans = mid
            high = mid - 1
        else:
            low = mid + 1

    return ans
```

Both approaches are equivalent.

For this problem, the **implicit boundary version** is especially natural because we're directly finding:

> **the first value for which `count(x) >= k`.**

---

## Dry Run

Consider:

```text
m = 3
n = 3
k = 5
```

Table:

```text
1  2  3
2  4  6
3  6  9
```

### Try `x = 4`

Row 1:

$$  
\min(3,4//1)=3  
$$

Values:

```text
1, 2, 3
```

Row 2:

$$  
\min(3,4//2)=2  
$$

Values:

```text
2, 4
```

Row 3:

$$  
\min(3,4//3)=1  
$$

Value:

```text
3
```

Total:

$$  
3+2+1=6  
$$

Since:

$$  
6 \ge 5  
$$

`4` is feasible → search smaller.

### Try `x = 3`

$$  
3//1 + 3//2 + 3//3  
$$

$$  
=3+1+1=5  
$$

Exactly 5 values are `≤ 3`.

Therefore:

```text
answer = 3
```

---

# Important Insight: We Don't Care About Duplicates

The multiplication table contains duplicates:

```text
2 appears multiple times
3 appears multiple times
6 appears multiple times
```

That's completely fine.

The question is about the **k-th element in the flattened table**, where every cell counts separately.

Our `count_leq(x)` naturally counts duplicates because every qualifying cell contributes to the count.

---

## Complexity

Let:

- $m$ = smaller table dimension after normalization
    
- $n$ = larger dimension
    
- $M = m \times n$
    

Each counting operation:

$$  
O(m)  
$$

Binary search over `[1, mn]`:

$$  
O(\log(mn))  
$$

Total:

$$  
\boxed{O(m\log(mn))}  
$$

where $m = \min(original\ m,n)$.

### Auxiliary Space

$$  
\boxed{O(1)}  
$$

We never construct the $m \times n$ table.

---

## Why `min(m, n)` Helps

The multiplication table is symmetric:

$$  
i\times j = j\times i  
$$

So:

```python
m, n = min(m, n), max(m, n)
```

lets us iterate over the smaller dimension.

For example:

```text
m = 100
n = 1,000,000
```

Counting over `100` rows is much better than iterating over one million rows.

This doesn't change the conceptual algorithm, but it is a useful optimization.

---

## Important Quirks

### 1. Don't construct the table

The table may contain up to:

$$  
mn  
$$

elements.

Constructing it wastes both time and memory.

The whole point is to **implicitly count values**.

---

### 2. The search space is values, not indices

This is different from ordinary binary search.

```text
Ordinary BS:
search → array indices

Here:
search → possible numerical answers
```

---

### 3. `count >= k`, not `count == k`

We need:

```python
count_leq(mid) >= k
```

because several table cells may contain the same value.

The first value where at least `k` elements are `≤ x` is precisely the $k$-th smallest value.

---

# Connection to Previous Problems

This is an important evolution of the Binary Search on Answer pattern.

### Earlier problems

**Koko:**

```text
candidate speed
    ↓
calculate hours
    ↓
hours <= H ?
    ↓
FIRST TRUE
```

**Smallest Divisor:**

```text
candidate divisor
    ↓
calculate quotient sum
    ↓
sum <= threshold ?
    ↓
FIRST TRUE
```

**Magnetic Force:**

```text
candidate minimum distance
    ↓
greedy placement
    ↓
balls >= K ?
    ↓
LAST TRUE
```

### Multiplication Table

```text
candidate value X
    ↓
COUNT values <= X
    ↓
count >= K ?
    ↓
FIRST TRUE
```

The important new idea is:

> **Binary Search on Answer + Counting Predicate**

---

# A Reusable K-th Smallest Pattern

Whenever a problem asks for:

> **K-th smallest value in an implicit/searchable structure**

consider:

```text
Guess value X
      ↓
Count how many elements <= X
      ↓
count >= K ?
      ↓
    YES → answer <= X
    NO  → answer > X
      ↓
Find FIRST TRUE
```

Mathematically:

$$  
\boxed{count(X)\ge k}  
$$

is the predicate.

---

## Common Mistakes

- ❌ Building the entire multiplication table.
    
- ❌ Forgetting `min(n, x // i)`.
    
- ❌ Using `count == k` instead of `count >= k`.
    
- ❌ Treating duplicates as one occurrence.
    
- ❌ Binary-searching table indices instead of values.
    
- ❌ Forgetting that the answer range is `[1, m \times n]`.
    
- ❌ Using the larger dimension for the counting loop unnecessarily.
    

---

## Pattern Recognition

When you encounter:

> **"Find the K-th smallest/largest value in an implicitly defined sorted-ish structure."**

ask:

```text
Can I binary-search the VALUE itself?
            ↓
Can I efficiently COUNT
how many elements are <= X?
            ↓
Is that count monotonic?
            ↓
YES → Binary Search on Answer
```

For a **k-th smallest** problem:

$$  
count(X)\ge K  
$$

means:

> "`X` is at or beyond the answer."

So search for the **first True**.

### Mental hook

> **"Don't find the k-th element directly. Guess a value X and ask: how many elements are ≤ X? The first X that covers K elements is the answer."**