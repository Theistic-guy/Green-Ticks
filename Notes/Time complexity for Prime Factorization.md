<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Time Complexity of the Optimized Prime Factorization Algorithm

The optimized prime factorization algorithm is often written as:

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

A common interview question is:

> **"Since `n` keeps changing, what is the time complexity of this algorithm?"**

The answer is:

> **Time Complexity:** **O(√N)**, where **N is the original input number.**

---

## Understanding the Complexity

There are two loops:

1. The **outer loop** (`while i * i <= n`)
    
2. The **inner loop** (`while n % i == 0`)
    

Let's analyze them separately.

---

# Outer Loop Analysis

The outer loop increments `i` one by one.

```python
i = 2

while i * i <= n:
    ...
    i += 1
```

Notice an important observation:

- `i` **never decreases**.
    
- `n` **only decreases**.
    

Initially,

```
i ≤ √N
```

where `N` is the original number.

As factors are removed, `n` becomes smaller, causing the loop to terminate even earlier.

Therefore, in the worst case, `i` can increase only until

```
√N
```

Hence,

```
Outer Loop = O(√N)
```

---

# Inner Loop Analysis

Whenever the inner loop executes,

```python
while n % i == 0:
    n //= i
```

`n` is divided by at least **2**.

That means every iteration reduces the size of `n`.

Example:

```
64

↓

32

↓

16

↓

8

↓

4

↓

2

↓

1
```

Only **6 divisions** are performed.

---

## Maximum Number of Divisions

The maximum number of prime factors (counting multiplicity) occurs when the number is a power of two.

Example:

```
N = 2^k
```

Number of divisions:

```
k = log₂(N)
```

For example,

```
2³⁰ ≈ 10⁹
```

Even for one billion,

only **30 divisions** occur.

Therefore,

```
Total Inner Loop Work = O(log N)
```

Notice this is **not per iteration** of the outer loop.

It is the work done by **all** inner loops combined.

---

# Overall Complexity

Now combine both parts.

Outer Loop

```
O(√N)
```

Total Inner Loop Work

```
O(log N)
```

=

```
O(√N + log N)
```

Since

```
log N << √N
```

for large values of `N`,

the dominant term is

```
O(√N)
```

Hence,

> **Overall Time Complexity = O(√N)**

---

# Why Does the Dynamic Version Feel Faster?

Consider

```
126 = 2 × 3 × 3 × 7
```

### Static Version

```python
limit = int(sqrt(126))
```

The algorithm checks

```
2
3
4
5
6
7
8
9
10
11
```

---

### Dynamic Version

Execution:

```
126

↓

63      (remove 2)

↓

21      (remove first 3)

↓

7       (remove second 3)
```

Now

```
4² = 16 > 7
```

The loop terminates immediately.

Numbers

```
5
6
7
8
9
10
11
```

are never checked.

---

# Important Observation

The dynamic algorithm performs **fewer iterations** than the static version for many inputs.

However,

this only improves the **constant factor**.

It does **not** change the asymptotic complexity.

Both algorithms still have

```
Time Complexity = O(√N)
```

---

# Common Misconception

❌ **"Since `n` keeps shrinking, shouldn't the complexity become smaller than O(√N)?"**

No.

Big-O measures the **worst-case growth**.

Consider a prime number like

```
N = 999983
```

No divisions occur.

`n` never decreases.

The algorithm checks every integer up to

```
√999983 ≈ 1000
```

Therefore,

the worst-case complexity remains

```
O(√N)
```

---

# Interview Takeaways 🎯

- The optimized prime factorization algorithm runs in **O(√N)** time.
    
- The outer loop performs at most **√N** iterations.
    
- Across the entire algorithm, the inner loop executes at most **O(log N)** times because each iteration divides `n` by at least 2.
    
- Combining both gives **O(√N + log N)**, which simplifies to **O(√N)**.
    
- Using the dynamic condition `i * i <= n` improves practical performance by reducing unnecessary iterations, but **does not improve the worst-case Big-O complexity**.