---
Title: Square root using binary search
Companies:
  - Not Specified
Topics:
  - Searching
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
  - Binary Search
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Square Root Using Binary Search

**Pattern:**  Binary search

**Idea:** 

---

## 💻 Code

```Python
def integer_sqrt(x):

    if x < 2:
        return x

    low = 1
    high = x
    ans = 1

    while low <= high:

        mid = (low + high) // 2

        if mid * mid <= x:
            ans = mid
            low = mid + 1

        else:
            high = mid - 1

    return ans

```
**Time complexity** - O(log x)
**Aux. Space complexity** -  O(1)

---


A classic application of **Binary Search on the Answer**.

The problem is usually asked as:

> Given a non-negative integer `x`, find its integer square root, i.e. the largest integer `r` such that $$r^2 \le x$$.

Example:

```text
x = 27

sqrt(27) ≈ 5.19

Integer square root = 5
```

---

# Key Observation

We don't need to calculate the square root directly.

We are looking for the **largest number whose square is ≤ `x`**.

For example, for `x = 27`:

```text
1² = 1   ✓
2² = 4   ✓
3² = 9   ✓
4² = 16  ✓
5² = 25  ✓
6² = 36  ✗
```

Therefore the answer is `5`.

The important property is:

```text
1², 2², 3², 4², 5², 6², ...
```

is sorted.

So we can binary search for the boundary where

```text
mid² <= x
```

changes to

```text
mid² > x
```

---

# Approach 1 — Answer Variable + Shrink Search Space

This is the approach you have been using for first/last occurrence.

Maintain `ans` as the best valid answer found so far.

### If

$$  
mid^2 \le x  
$$

then `mid` is a valid answer.

Store it and search **right**, because a larger valid value might exist.

### If

$$  
mid^2 > x  
$$

search **left**.

---

## Python Code

```python
def integer_sqrt(x):

    if x < 2:
        return x

    low = 1
    high = x
    ans = 1

    while low <= high:

        mid = (low + high) // 2

        if mid * mid <= x:
            ans = mid
            low = mid + 1

        else:
            high = mid - 1

    return ans
```

---

# Dry Run

For

```text
x = 27
```

Initially:

```text
low = 1
high = 27
```

Suppose we eventually reach:

```text
mid = 5

5² = 25 <= 27
```

So:

```text
ans = 5
```

and search to the right.

Then:

```text
mid = 6

6² = 36 > 27
```

So search left.

Eventually:

```text
low > high
```

and `ans = 5`.

---

# Complexity

The search space is approximately

$$  
1 \rightarrow x  
$$

so binary search takes:

- **Time Complexity:** **$O(\log x)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Approach 2 — Check Whether `mid` Is the Exact Boundary

Instead of maintaining an answer variable, we can directly check whether `mid` is the largest valid value.

We want:

$$  
mid^2 \le x  
$$

and

$$  
(mid+1)^2 > x  
$$

If both conditions hold, `mid` is the integer square root.

---

## Python Code

```python
def integer_sqrt(x):

    if x < 2:
        return x

    low = 1
    high = x

    while low <= high:

        mid = (low + high) // 2

        if mid * mid <= x:

            if (mid + 1) * (mid + 1) > x:
                return mid

            low = mid + 1

        else:
            high = mid - 1

    return -1
```

The `-1` is only a fallback; for valid non-negative input, the function will return inside the loop.

---

# Comparing the Two Approaches

## Answer Variable

```python
if mid * mid <= x:
    ans = mid
    low = mid + 1
```

Think:

> **"This is valid. Save it, but maybe I can find a better/larger answer."**

This is generally the cleaner and more robust pattern.

---

## Boundary Check

```python
if mid * mid <= x:

    if (mid + 1) * (mid + 1) > x:
        return mid
```

Think:

> **"Is this the exact boundary I'm looking for?"**

This is useful when the problem naturally asks you to identify the boundary itself.

---

# Important Quirk: Don't Use `mid * mid` Carelessly in C++

For very large values, `mid * mid` can overflow a fixed-width integer type.

A safer comparison is:

$$  
mid \le \frac{x}{mid}  
$$

instead of

$$  
mid^2 \le x  
$$

For Python, this is **not an issue** because integers have arbitrary precision.

For C++/Java-style fixed-width integer languages, overflow is an important interview consideration.

---

# Pythonic Way

If the problem simply asks for the square root in normal Python code:

```python
import math

math.isqrt(x)
```

gives the integer square root directly.

For example:

```python
math.isqrt(27)
```

returns:

```text
5
```

But in a DSA interview, if the interviewer explicitly asks you to **implement square root without using a library function**, use the binary-search solution.

---

# Important Variation: Exact Square Root

Sometimes the question is:

> Determine whether `x` is a perfect square.

The same binary search can be used.

We are looking for an integer `mid` such that

$$  
mid^2=x  
$$

```python
def is_perfect_square(x):

    if x < 0:
        return False

    low = 0
    high = x

    while low <= high:

        mid = (low + high) // 2

        if mid * mid == x:
            return True

        if mid * mid < x:
            low = mid + 1
        else:
            high = mid - 1

    return False
```

Complexity:

- **Time Complexity:** **$O(\log x)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# General Pattern: Binary Search on the Answer

Square root is important because it teaches a broader pattern.

We aren't searching an array.

Instead, we are searching a **numeric answer space**:

```text
1  2  3  4  5  6  7  ...
✓  ✓  ✓  ✓  ✓  ✗  ✗
```

The predicate

```text
mid² <= x
```

is:

```text
True True True True True False False ...
```

Whenever the answer space has this kind of **monotonic property**, binary search may be applicable.

---

# Related Interview Problems

This exact pattern appears in problems such as:

- **Valid Perfect Square** — LeetCode 367
    
- **Sqrt(x)** — LeetCode 69
    
- **Koko Eating Bananas** — binary search on eating speed
    
- **Capacity to Ship Packages Within D Days** — binary search on capacity
    
- **Minimum Days to Make M Bouquets** — binary search on days
    
- **Split Array Largest Sum** — binary search on the answer
    

The latter problems are more advanced, but the underlying idea is the same:

> **Guess an answer → check whether it is feasible → eliminate half of the answer space.**

---

# Key Takeaways

### Integer Square Root

Find the largest `mid` satisfying:

$$  
mid^2 \le x  
$$

### Answer-Variable Pattern

```python
ans = 0

while low <= high:

    mid = (low + high) // 2

    if mid * mid <= x:
        ans = mid
        low = mid + 1
    else:
        high = mid - 1
```

- **Time Complexity:** **$O(\log x)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

### Recognition Pattern

```text
Monotonically valid answers

✓ ✓ ✓ ✓ ✓ ✗ ✗ ✗
            ↑
          boundary
```

> **Interview Tip:** Square root is less important for the square-root calculation itself and more important because it teaches **Binary Search on the Answer**. Whenever you can define a yes/no condition that changes monotonically as the candidate answer increases, ask yourself: **"Can I binary-search the answer space?"**