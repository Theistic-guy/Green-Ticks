---
Title: Least Common Multiple
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
Link: ""
---

# LCM - Least Common Multiple

**Pattern:** 
**Idea:** a × b = GCD(a, b) × LCM(a, b)

---

## 💻 Code

```Python
def gcd(a, b):
    if b == 0:
        return a
    return gcd(b,a%b)


def lcm(a, b):
    return (a * b) // gcd(a, b)

```

**Time complexity** - O(D) , D is no of digits
**Aux. Space complexity** -  O(1)

---

The **Least Common Multiple (LCM)** of two integers is the **smallest positive integer that is divisible by both numbers**.

Example:

```text
LCM(12, 18) = 36

36 % 12 = 0
36 % 18 = 0
```

---

# Naive Approach

## Idea

The LCM must be **at least** `max(a, b)`.

Start from `max(a, b)` and keep checking each number until one is divisible by both.

### Python

```python
def lcm(a, b):
    ans = max(a, b)

    while True:
        if ans % a == 0 and ans % b == 0:
            return ans
        ans += 1
```

### Complexity

- **Time:** `O(a × b)` in the worst case (more precisely, proportional to `LCM(a,b) - max(a,b)`).
    
- **Space:** `O(1)`
    

Very inefficient for large numbers.

---

# Optimal Approach (Using GCD)

## Key Relation

The product of two numbers equals the product of their GCD and LCM.

```text
a × b = GCD(a, b) × LCM(a, b)
```

Therefore,

```text
LCM(a, b) = (a × b) / GCD(a, b)
```

To avoid overflow in languages like C++/Java, compute:

```text
LCM(a, b) = (a / GCD(a, b)) × b
```

---

## Why does this work?

Suppose

```text
a = G × x
b = G × y
```

where

- `G = GCD(a, b)`
    
- `x` and `y` are coprime (they share no common factors).
    

Then

```text
LCM = G × x × y
```

Also,

```text
a × b

= (Gx)(Gy)

= G²xy
```

Dividing by `G` gives

```text
(a × b) / G

= Gxy

= LCM
```

Hence,

```text
LCM = (a × b) / GCD
```

---

## Python

```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a


def lcm(a, b):
    return (a * b) // gcd(a, b)
```

Or using Python's built-in:

```python
import math

def lcm(a, b):
    return (a * b) // math.gcd(a, b)
```

Python 3.9+ also provides:

```python
import math

math.lcm(a, b)
```

---

## Dry Run

Find `LCM(12, 18)`.

First,

```text
GCD(12,18) = 6
```

Then,

```text
LCM = (12 × 18) / 6

= 216 / 6

= 36
```

---

## Complexity

Using Euclid's GCD:

- **Time:** `O(log(min(a, b)))`
    
- **Space:** `O(1)` (iterative)
    

---

# Interview Takeaways

- **Naive:** Start from `max(a, b)` and search upward until a common multiple is found.
    
- **Optimal:** Use the identity:
    
    ```text
    LCM(a, b) = (a × b) / GCD(a, b)
    ```
    
- Since Euclid's GCD runs in `O(log n)`, LCM can also be computed in **`O(log n)`**.
    
- In C++/Java, prefer `(a / gcd) * b` to reduce the risk of integer overflow.
    
- Python provides `math.lcm()` (Python 3.9+) and `math.gcd()`.