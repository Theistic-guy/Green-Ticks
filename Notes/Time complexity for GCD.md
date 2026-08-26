---
tags:
  - computer-science/algorithms
  - interview-prep/dsa
  - math/number-theory
aliases:
  - Euclidean Algorithm Complexity
  - GCD Time Complexity
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
---

# Time Complexity of Euclidean GCD Algorithm

## 📌 Core Result

The Euclidean GCD algorithm runs in:

$$
O(\log(\min(a,b)))
$$

The intuition is simple:

> **Every two iterations, the larger number becomes at least half of what it was before.**

Repeatedly halving a number leads to logarithmic time.

---

# 💡 Key Observation

The Euclidean Algorithm repeatedly transforms

$$
\gcd(a,b)
\rightarrow
\gcd(b,a\bmod b)
$$

where

$$
a>b
$$

Since

$$
a=bq+r
$$

the remainder satisfies

$$
0\le r<b.
$$

---

# Why does the size shrink?

There are two cases.

## Case 1

If

$$
b\le\frac a2
$$

then

$$
r<a/2
$$

because

$$
r<b.
$$

Example

```text
25 % 10 = 5
```

---

## Case 2

If

$$
b>\frac a2
$$

then

```text
a % b = a - b
```

because the quotient is exactly 1.

Since

$$
b>\frac a2
$$

we get

$$
a-b<\frac a2.
$$
- The divisor `b` is so big that it can only fit into `a` exactly **one time**.
- The remainder is just what is left over: `a - b`.
Example

```text
25 % 18 = 7
```

---

Therefore,

after **at most two iterations**, one of the numbers has been reduced to **less than half** of its previous size.

This halving repeats throughout the algorithm.

---

# Interview Explanation

### Step 1

At every iteration we replace

```text
gcd(a,b)
```

with

```text
gcd(b,a%b)
```

without changing the answer.

---

### Step 2

Within every **two iterations**, the larger value is reduced by at least half.

---

### Step 3

If a quantity keeps getting halved,

```text
n
↓

n/2
↓

n/4
↓

n/8
↓

...
↓

1
```

the number of halvings is

$$
\log_2 n.
$$

Hence,

$$
O(\log(\min(a,b))).
$$

---

# Dry Run

Example:

```text
gcd(48,18)

↓

gcd(18,12)

↓

gcd(12,6)

↓

gcd(6,0)
```

Notice how the numbers shrink very quickly.

---

# Worst Case

The Euclidean Algorithm is slowest when the inputs are **consecutive Fibonacci numbers**.

Example

```text
gcd(21,13)

↓

gcd(13,8)

↓

gcd(8,5)

↓

gcd(5,3)

↓

gcd(3,2)

↓

gcd(2,1)

↓

gcd(1,0)
```

This is known as **Lamé's Theorem**.

Even in this worst case,

$$
\text{Time} = O(\log b).
$$

---

# Code

```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
```

---

# Complexity

| Operation | Complexity |
|-----------|------------|
| Time | $O(\log(\min(a,b)))$ |
| Space (Iterative) | $O(1)$ |
| Space (Recursive) | $O(\log(\min(a,b)))$ (call stack) |

---

# Interview Takeaways

- Euclid replaces `(a,b)` with `(b,a%b)`.
- The GCD never changes during this replacement.
- The numbers shrink rapidly.
- Every **two iterations**, the larger number becomes at least half as large.
- Repeated halving gives logarithmic complexity.
- Worst case occurs for **consecutive Fibonacci numbers**, but complexity is still **$O(\log n)$**.