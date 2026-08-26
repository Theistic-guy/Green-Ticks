---
Title: Check For Prime
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
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# # Check if a Number is Prime

**Pattern:** Prime numbers

**Idea:** factors occur in pairs (x,y) -> x*y = n  where $x \leq y \to x*x=n \therefore x \leq \sqrt{n}$ 

---

## 💻 Code

```Python
def is_prime(n):
    if n <= 1:
        return False

    i = 2

    while i * i <= n:
        if n % i == 0:
            return False
        i += 1

    return True

```
**Time complexity** - $O(\sqrt{n})$
**Aux. Space complexity** -  O(1)
Note : Further optimized soln. below

---


A **prime number** is a positive integer **greater than 1** that has **exactly two positive divisors**:

- `1`
    
- Itself
    

Examples:

```text
2, 3, 5, 7, 11, 13...
```

Non-prime:

```text
1 (only one divisor)
4 (1, 2, 4)
12 (1, 2, 3, 4, 6, 12)
```

---

# Naive Approach

## Idea

Check if any number from `2` to `n-1` divides `n`.

If yes → Not Prime.

Otherwise → Prime.

### Python

```python
def is_prime(n):
    if n <= 1:
        return False

    for i in range(2, n):
        if n % i == 0:
            return False

    return True
```

### Complexity

- **Time:** $O(n)$
    
- **Space:** $O(1)$
    

---

# Optimized Approach (Square Root)

## Key Observation

Factors always occur in **pairs**.

Example:

```text
36

1 × 36
2 × 18
3 × 12
4 × 9
6 × 6
```

Notice:

- One factor is **less than or equal to** $\sqrt{36}=6$.
    
- The other is **greater than or equal to** $\sqrt{36}=6$.
    

If there were **no factor ≤ $\sqrt{n}$**, then there couldn't be a corresponding larger factor either.

Therefore, it is sufficient to check divisibility only up to $\sqrt{n}$.

---

## Why?

Assume `n` is composite.

Then

```text
n = a × b
```

Suppose both factors were greater than $\sqrt n$.

Then

$$  
a>\sqrt n,\qquad b>\sqrt n  
$$

Multiplying,

$$  
ab>n  
$$

which is impossible because

```text
ab = n
```

Hence **at least one factor must be ≤ $\sqrt n$**.

---

## Python

```python
def is_prime(n):
    if n <= 1:
        return False

    i = 2

    while i * i <= n:
        if n % i == 0:
            return False
        i += 1

    return True
```

> **Interview Tip:** ==Prefer `i * i <= n` over `i <= sqrt(n)` to avoid repeated square root calculations and floating-point arithmetic.==

---

## Dry Run

Check `n = 29`

```text
√29 ≈ 5.38
```

Check only

```text
2
3
4
5
```

None divide 29.

Therefore,

```text
29 is Prime
```

---

Check `n = 35`

```text
2 ❌
3 ❌
4 ❌
5 ✅
```

Stop immediately.

```text
35 is Not Prime
```

---

# Even Better Optimization (6k ± 1)

## Observation

Every integer can be written as one of:

```text
6k
6k + 1
6k + 2
6k + 3
6k + 4
6k + 5
```

Among these,

- `6k` → divisible by 6
    
- `6k + 2` → even
    
- `6k + 3` → divisible by 3
    
- `6k + 4` → even
    

So every prime greater than 3 **must** be of the form

```text
6k ± 1
```

> **Important:** This is a **necessary condition**, not a sufficient one.
> 
> Example:
> 
> ```text
> 25 = 6×4 + 1
> ```
> 
> but 25 is **not** prime.

So after checking `2` and `3`, we only test numbers:

```text
5, 7, 11, 13, 17, 19, ...
```

---

## Python

```python
def is_prime(n):
    if n <= 1:
        return False

    # Handle small primes separately
    if n == 2 or n == 3 or n == 5:
        return True

    # Eliminate obvious composites
    if n % 2 == 0 or n % 3 == 0 or n % 5 == 0:
        return False

    i = 7

    while i * i <= n:
        if n % i == 0:      # 6k + 1
            return False

        i += 4              # Move to 6k + 5

        if i * i <= n and n % i == 0:
            return False

        i += 2              # Move to next 6(k+1) + 1

    return True
```

---

## Complexity

| Approach              | Time         | Space                     |     |
| --------------------- | ------------ | ------------------------- | --- |
| Check `2...n-1`       | $O(n)$       | $O(1)$                    |     |
| Check up to $\sqrt n$ | $O(\sqrt n)$ | $O(1)$                    |     |
| 6k ± 1 Optimization   | $O(\sqrt n)$ | $O(1)$ (fewer iterations) |     |
### The improvement is only in the constant factor

Suppose you're checking up to $\sqrt{10000}=100$.

**Regular method**

Checks

```
2,3,4,5,6,7,...,100
```

≈ 99 numbers.

**6k ± 1**

Checks

```
5,7,11,13,17,19,...
```

Only numbers not divisible by 2 or 3.

About one-third of the candidates remain.

So instead of roughly

```
100 checks
```

you perform roughly

```
33 checks
```

That's about a **3× speedup**, but the algorithm is still proportional to $\sqrt n$.

---

# Interview Takeaways

- A prime number has exactly **two positive divisors**.
    
- `0` and `1` are **not** prime.
    
- Checking up to `n-1` is unnecessary.
    
- Factors always occur in **pairs**.
    
- It is enough to check divisors up to **$\sqrt n$**.
    
- Use `i * i <= n` instead of `sqrt(n)` in code.
    
- The **6k ± 1** optimization reduces constant factors but **does not change** the asymptotic complexity.
    
- For checking many numbers in a range, use the **Sieve of Eratosthenes** instead of checking each number individually.
