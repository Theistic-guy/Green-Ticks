---
Title: Prime Factors
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

# Prime Factors

**Pattern:** prime factorization
**Idea:** 

---

## 💻 Code

```Python
def prime_factors(n):
	if n <= 1:
		return
		
    i = 2

    while i * i <= n:
        while n % i == 0:
            print(i)
            n //= i
        i += 1

    if n > 1:
        print(n)

```
**Time complexity** - O($\sqrt{n}$), See [Explanation](../Notes/Time%20complexity%20for%20Prime%20Factorization.md)
**Aux. Space complexity** -  O(1)
A further optimized soln. (explicit division by 2 and 3) - [Further Optimized Prime Factorization (div. by 2 & 3)](../Notes/Further%20Optimized%20Prime%20Factorization%20(div.%20by%202%20&%203).md)

---
# Prime Factorization

> **Prime factorization** is the process of expressing a positive integer as a product of prime numbers.
> 
> Example:

> $$
 84 = 2^2 \times 3 \times 7  
 $$

---

# Key Mathematical Observation

The entire algorithm is built on one fundamental theorem.

### Theorem

> **Every composite number has at least one prime factor less than or equal to its square root.**

This is often misunderstood.

### ❌ Common Misconception

> **"Every prime factor is ≤ √N."**

This is **false**.

Example:

```
26 = 2 × 13
```

```
√26 ≈ 5.09
```

Yet

```
13 > √26
```

So prime factors **can absolutely be larger than √N**.

---

### ✅ Correct Interpretation

Every **factor pair** looks like

```
a × b = N
```

If **both** were greater than √N,

```
a > √N
b > √N
```

then

```
a × b > √N × √N = N
```

which is impossible.

Therefore,

> ==**Every composite number has at least one factor (hence at least one prime factor) ≤ √N.**==

---

# Naive Approach

Try every integer from **2 to N**.

```python
def prime_factors(n):
    for i in range(2, n + 1):
        while n % i == 0:
            print(i)
            n //= i
```

### Complexity

- Time: **O(N)**
    
- Space: **O(1)**
    

---

# Optimized Approach

Since every composite number has a small factor, we only search until √N.

```python
def prime_factors(n):
    i = 2

    while i * i <= n:
        while n % i == 0:
            print(i)
            n //= i
        i += 1

    if n > 1:
        print(n)
```

### Complexity

- Time: **O(√N)**
    
- Space: **O(1)**
    

---

# Why the Inner `while`?

Suppose

```
N = 450
```

Prime factorization

```
450 = 2 × 3 × 3 × 5 × 5
```

Execution

```
450

↓

225   (remove 2)

↓

75    (remove first 3)

↓

25    (remove second 3)

↓

5     (remove first 5)

↓

1     (remove second 5)
```

Notice that every occurrence of a prime factor is removed immediately.

This guarantees that once we move past a divisor, **it can never appear again**.

---

# Loop Invariant

Before checking divisor `i`,

> **Every prime factor smaller than `i` has already been completely removed.**

Therefore,

- we never need to revisit smaller divisors,
    
- removing larger factors cannot create new smaller factors.
    

This invariant is what makes the one-pass algorithm correct.

---

# The Biggest Confusion

## "If I only check up to √N, how do I find prime factors larger than √N?"

Example

```
26 = 2 × 13
```

The loop checks only

```
2
3
4
5
```

It **never reaches 13**.

So where does 13 come from?

Execution

```
n = 26

↓

divide by 2

↓

n = 13
```

The loop ends.

Finally,

```python
if n > 1:
    print(n)
```

prints

```
13
```

### Key Realization

The algorithm **does not need to visit every prime factor.**

It only needs to find **one member of every factor pair**.

Finding the smaller factor automatically leaves the larger factor behind.

---

# Why is the Remaining Number Guaranteed to be Prime?

Suppose after processing every divisor up to √N,

```
remaining = R > 1
```

Assume `R` is composite.

Then by the theorem,

```
R
```

must have a prime factor

```
≤ √R
```

Since

```
√R ≤ √N
```

that factor would already have been checked and removed.

Contradiction.

Therefore,

> **If a number greater than 1 remains after the loop, it cannot be composite. It must itself be prime.**

This is why

```python
if n > 1:
    print(n)
```

is always correct.

---

# Static vs Dynamic Square Root

## Static Version

```python
limit = int(sqrt(original_n))

for i in range(2, limit + 1):
    while n % i == 0:
        print(i)
        n //= i

if n > 1:
    print(n)
```

✔ Correct.

The proof relies on the theorem applied to the **original number**.

---

## Dynamic Version (Preferred)

```python
i = 2

while i * i <= n:
    while n % i == 0:
        print(i)
        n //= i
    i += 1

if n > 1:
    print(n)
```

✔ Also correct.

Here, the theorem is repeatedly applied to the **current reduced number**.

Since `n` keeps shrinking, the upper bound also shrinks.

This avoids unnecessary iterations.

---

# Static vs Dynamic — The Important Insight

Initially it may seem that updating the loop condition

```python
i * i <= n
```

is required for correctness.

**It is not.**

The following version is also mathematically correct:

```python
limit = int(sqrt(original_n))
```

The only difference is efficiency.

The dynamic version terminates earlier because the remaining number becomes smaller after every successful division.

> **Updating √n is purely an optimization, not a correctness requirement.**

---

# Key Realizations 💡

- A prime factor **may be larger than √N**.
    
- The theorem is **not** "all prime factors are ≤ √N."
    
- The correct theorem is: **every composite number has at least one prime factor ≤ √N.**
    
- The algorithm only needs to discover **one factor from every factor pair**.
    
- Large prime factors are usually **never searched for directly**.
    
- After removing all small factors, a remaining number greater than 1 **must itself be prime**.
    
- The inner `while` removes every occurrence of a factor before moving on, establishing the loop invariant.
    
- Using `i * i <= current_n` instead of `i <= √original_n` is an optimization that reduces unnecessary iterations.
    

---

# Interview Takeaways 🎯

- Remember the theorem precisely; interviewers often ask it as a trick question.
    
- Explain the loop invariant if asked to prove correctness.
    
- Justify the final `if (n > 1)` mathematically—it is not a hack.
    
- Mention that the dynamic square-root bound is preferred because the search space shrinks as factors are removed.
    
- Time Complexity: **O(√N)**
    
- Space Complexity: **O(1)**