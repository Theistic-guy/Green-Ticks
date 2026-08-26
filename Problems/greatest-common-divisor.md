---
Title: Greatest Common Divisor
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# GCD

**Pattern:** Euclidean algorithm

 **Idea:** Common divisors of (a, b) = Common divisors of (b, r)

---

## 💻 Code

```Python
def gcd(a, b):
    if b == 0:
        return a

    return gcd(b, a % b)

```

**Time complexity** - O(log(min(a, b)). See [this](../Notes/Time%20complexity%20for%20GCD.md)
**Aux. Space complexity** -  O(1)

> [!NOTE] Note
> **No need to ensure** `a ≥ b`—if `a < b`, the first modulo operation (`a % b = a`) automatically swaps the numbers.


The **Greatest Common Divisor (GCD)** of two integers is the **largest positive integer that divides both numbers without leaving a remainder**.

Example:

```text
GCD(12, 18) = 6

Factors of 12: 1, 2, 3, 4, 6, 12
Factors of 18: 1, 2, 3, 6, 9, 18

Greatest common factor = 6
```

---

# Naive Approach

## Idea

Check every number from **1** to `min(a, b)` and keep updating the largest common divisor.

### Python

```python
def gcd(a, b):
    ans = 1

    for i in range(1, min(a, b) + 1):
        if a % i == 0 and b % i == 0:
            ans = i

    return ans
```

### Better Naive

Start from `min(a, b)` and return the first divisor found.

```python
def gcd(a, b):
    for i in range(min(a, b), 0, -1):
        if a % i == 0 and b % i == 0:
            return i
```

### Complexity

- **Time:** `O(min(a, b))`
    
- **Space:** `O(1)`
    

Too slow for large numbers.

---

# Euclidean Algorithm (Optimal)

## Key Observation

The GCD **does not change** if the larger number is replaced by its remainder when divided by the smaller number.

```text
GCD(a, b) = GCD(b, a % b)
```

This works because any number that divides both `a` and `b` also divides `a % b`, and vice versa.

---

## Algorithm

Repeat until the remainder becomes `0`.

```text
while b != 0

    remainder = a % b

    a = b

    b = remainder

Answer = a
```

---

## Dry Run

Find `GCD(48, 18)`

```text
48 % 18 = 12

GCD(48,18)
↓

GCD(18,12)
```

```text
18 % 12 = 6

GCD(18,12)
↓

GCD(12,6)
```

```text
12 % 6 = 0

GCD(12,6)
↓

GCD(6,0)
```

Stop because `b = 0`.

```text
Answer = 6
```

---

## Python

```python
def gcd(a, b):
    while b != 0:
        a, b = b, a % b

    return a
```

Recursive version:

```python
def gcd(a, b):
    if b == 0:
        return a

    return gcd(b, a % b)
```

---

# Why does it work?

Suppose

```text
a = b × q + r
```

where

```text
r = a % b
```

Any divisor of both `a` and `b` must also divide

```text
a - (b × q) = r
```

So,

```text
Common divisors of (a, b)
=
Common divisors of (b, r)
```

Hence,

```text
GCD(a,b) = GCD(b,a%b)
```

---

# Complexity

Each iteration significantly reduces the size of the numbers.

- **Time:** `O(log(min(a, b)))`
    
- **Space:** `O(1)` (iterative)
    
- **Space:** `O(log(min(a, b)))` (recursive call stack)
    

---

# Interview Takeaways

- **Naive:** Check all divisors → `O(min(a, b))`.
    
- **Optimal:** Euclidean Algorithm → repeatedly replace `(a, b)` with `(b, a % b)`.
    
- Stop when the second number becomes `0`.
    
- The first number at that point is the GCD.
    
- Python's built-in implementation is:
    
    ```python
    import math
    math.gcd(a, b)
    ```