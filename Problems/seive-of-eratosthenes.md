---
Title: Sieve Of Eratosthenes
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
Link: ""
---

# Sieve of Eratosthenes

**Pattern:** prime numbers
**Idea:** sqrt (n) theorem use

---

## 💻 Code

```Python
def sieve(n):

    isPrime = [True] * (n + 1)

    isPrime[0] = False
    isPrime[1] = False

    p = 2

    while p * p <= n:

        if isPrime[p]:

            multiple = p * p

            while multiple <= n:
                isPrime[multiple] = False
                multiple += p

        p += 1

    return isPrime

```
**Time complexity** - O(n log log n). See [Explanation](../Notes/Time%20Complexity%20for%20Sieve%20of%20Eratosthenes.md)
**Aux. Space complexity** -  O(n) 
**Note** : Two optimizations are imp. to know

---

The **Sieve of Eratosthenes** is an algorithm used to find **all prime numbers up to a given number `N`** efficiently.

Unlike the Prime Checking algorithm, which determines whether **one number** is prime, the sieve computes the primality of **every number from 2 to N** in one pass.

---

# When Should You Use It?

|Problem|Best Approach|
|---|---|
|Is one number prime?|√N Prime Check|
|Prime factorization of one number|Trial Division|
|Find all primes up to N|Sieve of Eratosthenes|

---

# Naive Approach

To find every prime till `N`:

```text
For every number from 2 to N
        Check whether it is prime
```

### Code

```python
for i in range(2, n + 1):
    if isPrime(i):
        print(i)
```

where

```python
isPrime()
```

takes

```text
O(√N)
```

Therefore

```
N numbers

×

√N work

=

O(N√N)
```

---

# Key Mathematical Observation

Suppose

```text
N = 30
```

When checking

```text
2
```

every multiple of 2 is definitely composite.

```
2 4 6 8 10 12 14 ...
```

Similarly,

after processing

```text
3
```

```
3 6 9 12 15 18 21 ...
```

become composite.

Instead of checking every number individually,

> **Mark all multiples of every prime as composite.**

The numbers that are never marked are exactly the primes.

---

# The Main Idea

Initially assume

```text
Everyone is Prime
```

```
2 3 4 5 6 7 8 9 10 ...

T T T T T T T T T
```

Now process numbers one by one.

---

## Step 1

Current number

```text
2
```

Since it is still marked prime,

mark all of its multiples.

```
2 3 4 5 6 7 8 9 10

T T F T F T F T F
```

---

## Step 2

Current number

```text
3
```

Still prime.

Mark its multiples.

```
2 3 4 5 6 7 8 9 10

T T F T F T F F F
```

---

## Step 3

Current number

```text
4
```

Already marked composite.

Skip it.

---

## Step 4

Current number

```text
5
```

Prime.

Mark its multiples.

Continue similarly.

Finally,

```
2 3 5 7 11 13 17 19 23 29
```

remain unmarked.

These are exactly the primes.

---

# Basic Algorithm

```python
def sieve(n):

    isPrime = [True] * (n + 1)

    isPrime[0] = False
    isPrime[1] = False

    p = 2

    while p <= n:

        if isPrime[p]:

            multiple = 2 * p

            while multiple <= n:
                isPrime[multiple] = False
                multiple += p

        p += 1

    return isPrime
```

---

# First Optimization

Notice what happens when

```
p = 5
```

Multiples are

```
10
15
20
25
30
...
```

But

```
10
```

was already marked by

```
2
```

```
15
```

was already marked by

```
3
```

```
20
```

was already marked by

```
2
```

The first multiple that has **not necessarily** been marked is

```
25
```

which is

```
5²
```

---

## Why Start From p²?

Suppose

```
k × p
```

where

```
k < p
```

Then

```
k
```

has already been processed.

Therefore,

```
k × p
```

was already marked when processing

```
k
```

Hence,

there is no need to start from

```
2p
```

Instead,

start from

```
p²
```

---

# Second Optimization

Do we really need to process

```
p = 17
```

for

```
N = 100
```

No.

Because

```
17² = 289
```

already exceeds

```
100
```

If

```
p² > N
```

there are no multiples of

```
p
```

left to mark.

Therefore,

the outer loop only runs until

```
√N
```

Exactly the same square-root observation we've already seen in:

- Prime Checking
    
- Prime Factorization
    
- Divisors
    

---

# Final Optimized Algorithm

```python
def sieve(n):

    isPrime = [True] * (n + 1)

    isPrime[0] = False
    isPrime[1] = False

    p = 2

    while p * p <= n:

        if isPrime[p]:

            multiple = p * p

            while multiple <= n:
                isPrime[multiple] = False
                multiple += p

        p += 1

    return isPrime
```

---

# Why Don't We Need to Continue Beyond √N?

Suppose

```
p² > N
```

If any composite number still remained,

it must have a factor

```
≤ √N
```

But every such factor has already been processed.

Therefore,

no composite numbers can remain unmarked.

---

# Complexity

Many people incorrectly assume

```
Outer Loop

×

Inner Loop

=

√N × N
```

This is incorrect because the inner loop runs only for **prime numbers**, and each prime marks only its multiples.

The precise mathematical analysis gives

```
Time Complexity = O(N log log N)
```

which is one of the most famous complexities in algorithms.

The space complexity is

```
O(N)
```

for the boolean array.

---

# Common Misconceptions

### ❌ Why don't we start from `2p`?

Because every smaller multiple has already been marked by a smaller prime.

---

### ❌ Why stop at √N?

Because every composite number has a prime factor not exceeding √N.

---

### ❌ Do we process every number?

No.

Only numbers still marked as prime perform the marking step.

Composite numbers are skipped.

---

# Key Realizations 💡

- The sieve does **not** test primality individually.
    
- It eliminates composite numbers instead.
    
- Initially assume every number is prime.
    
- Each prime removes its multiples.
    
- Start marking from **p²**, not `2p`.
    
- Stop the outer loop at **√N**.
    
- Every number still marked at the end is prime.
    

---

# Interview Takeaways 🎯

- Use the Sieve when you need **all primes up to N**, not for testing a single number.
    
- Remember both optimizations:
    
    1. Start marking from `p²`.
        
    2. Stop the outer loop at `p² <= N`.
        
- The final complexity is:
    
    - **Time:** `O(N log log N)`
        
    - **Space:** `O(N)`
        

---
