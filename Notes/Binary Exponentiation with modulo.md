<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Code

```Python
def power(x, n, mod):
    result = 1

    x %= mod

    while n > 0:

        if n & 1:
            result = (result * x) % mod

        x = (x * x) % mod

        n //= 2

    return result
```
Note : since x and result are continuously being modulo-ed , we don't have to explicitly write `x = (x % mod * x%mod) %mod` and same with `result = (result%mod * x%mod) % mod`

See Also  - [Modulo Formulas](Modulo%20Formulas.md)

---

Binary Exponentiation becomes even more important when the problem asks us to compute

```text
(xⁿ) mod M
```

where

- `x` can be as large as `10¹⁸`
    
- `n` can be as large as `10¹⁸`
    
- `M` is usually a prime like
    

```text
10⁹ + 7

or

998244353
```

This version of the algorithm is one of the **most frequently asked algorithms** in Coding Interviews, Competitive Programming and Online Assessments.

---

# Why Can't We Compute xⁿ Directly?

Suppose

```text
2¹⁰⁰⁰
```

Even though Python can handle arbitrarily large integers, most languages like C++ or Java cannot.

Even in Python,

```text
2¹⁰⁰⁰⁰⁰⁰
```

would be enormous and unnecessary.

Usually the problem only wants

```text
(2¹⁰⁰⁰⁰⁰⁰) mod (10⁹+7)
```

There is no need to compute the gigantic number itself.

---

# Key Mathematical Observation

Modulo has a beautiful property.

For multiplication,

```text
(a × b) mod M

=

((a mod M) × (b mod M)) mod M
```

This means

> **We can take modulo after every multiplication without changing the final answer.**

This is the entire foundation of Modular Exponentiation.

---

# Example

Instead of computing

```text
7¹⁰
```

and then taking modulo,

compute

```text
((((7 mod M)

×

7 mod M)

mod M)

...

)
```

Every intermediate value remains small.

---

# Combining Binary Exponentiation with Modulo

Recall the iterative Binary Exponentiation algorithm.

```python
def power(x, n):

    result = 1

    while n > 0:

        if n & 1:
            result *= x

        x *= x

        n //= 2

    return result
```

We simply apply modulo after every multiplication.

---

# Modular Binary Exponentiation

## Algorithm

```python
def power(x, n, mod):

    result = 1

    x %= mod

    while n > 0:

        if n & 1:
            result = (result * x) % mod

        x = (x * x) % mod

        n //= 2

    return result
```

---

# Why Do We Write

```python
x %= mod
```

Initially?

Suppose

```text
x = 10¹⁸
```

and

```text
mod = 10⁹+7
```

Since

```text
(a mod M)^n mod M

=

a^n mod M
```

we can safely reduce the base before beginning.

This keeps every multiplication within manageable limits.

---

# Dry Run

Compute

```text
3¹³ mod 17
```

Initially

```text
result = 1

x = 3

n = 13
```

Binary representation

```text
13

1101₂
```

|n|Odd?|result|x|
|---|---|---|---|
|13|Yes|3|9|
|6|No|3|13|
|3|Yes|5|16|
|1|Yes|12|1|
|0|-|12|-|

Final Answer

```text
12
```

Indeed,

```text
3¹³ mod 17

=

12
```

---

# Time Complexity

Every iteration divides the exponent by 2.

```text
n

↓

n/2

↓

n/4

↓

...
```

Hence,

```text
Time Complexity = O(log n)
```

---

# Auxiliary Space Complexity

Only a few variables are used.

```text
Auxiliary Space Complexity = O(1)
```

---

# Why Is Modulo Applied Twice?

Many beginners wonder about this line

```python
result = (result * x) % mod
```

instead of

```python
result = result * (x % mod)
```

The reason is

after multiplication,

```text
result × x
```

may itself become enormous.

Taking modulo **after every multiplication** keeps every intermediate value bounded.

---

# Common Interview Variations

## 1. Compute

```text
(xⁿ) mod M
```

Direct application of Binary Exponentiation.

---

## 2. Very Large Exponent

```text
x ≤ 10⁹

n ≤ 10¹⁸
```

Still

```text
O(log n)
```

because we only process the binary digits of the exponent.

---

## 3. Multiple Queries

Example

```text
Q = 100000

Each query asks

aᵇ mod M
```

Each query is answered independently in

```text
O(log b)
```

Total complexity

```text
O(Q log b)
```

---

## 4. Matrix Exponentiation

Instead of multiplying numbers,

multiply matrices.

The exact same Binary Exponentiation algorithm works.

Only multiplication changes.

---

## 5. Modular Inverse

One of the most common interview questions.

Compute

```text
1 / x mod M
```

Division does **not** exist directly in modular arithmetic.

Instead,

we compute

```text
x^(M-2) mod M
```

using Binary Exponentiation.

This works when

```text
M
```

is prime.

This is based on **Fermat's Little Theorem**.

---

## 6. Compute

```text
(aᵇ × cᵈ) mod M
```

Simply compute

```text
power(a, b, M)
```

and

```text
power(c, d, M)
```

then multiply them under modulo.

---

## 7. Last Digit Problems

Example

```text
Find the last digit of

7¹⁰⁰⁰⁰
```

Observe

```text
Last Digit

=

mod 10
```

Simply compute

```text
power(7, 10000, 10)
```

---

## 8. Large Power Tower

Example

```text
2^(3^100)
```

Usually combines

- Binary Exponentiation
    
- Fermat's Little Theorem
    
- Euler's Totient Theorem
    

These are considered advanced Number Theory problems.

---

# Common Mistakes

### ❌ Computing the power first

```python
pow = x ** n

return pow % mod
```

Impossible for huge exponents.

---

### ❌ Forgetting modulo after squaring

Wrong

```python
x *= x
```

Correct

```python
x = (x * x) % mod
```

---

### ❌ Forgetting modulo after multiplying the answer

Wrong

```python
result *= x
```

Correct

```python
result = (result * x) % mod
```

---

### ❌ Using Floating Point Power

Wrong

```python
math.pow(x, n)
```

`math.pow()` returns a floating-point number and loses precision for large integers.

Always use Binary Exponentiation for integer powers under modulo.

---

# Python Built-in Shortcut

Python provides a built-in optimized function.

```python
pow(x, n, mod)
```

Example

```python
pow(3, 13, 17)
```

Output

```text
12
```

Internally,

Python already uses an efficient modular exponentiation algorithm.

In interviews, however, you are generally expected to implement it yourself unless explicitly allowed to use built-ins.

---

# Key Realizations 💡

- Never compute the complete power if only the modulo is required.
    
- Use the property
    

```text
(a × b) mod M

=

((a mod M) × (b mod M)) mod M
```

to keep intermediate values small.

- Binary Exponentiation and Modulo combine naturally because both rely on repeated multiplication.
    
- Apply modulo after **every multiplication**, including squaring the base.
    
- The algorithm remains **O(log n)** even for extremely large exponents.
    

---

# Complexity Summary

|Algorithm|Time|Auxiliary Space|
|---|---|---|
|Naive Power then Mod|`O(n)`|`O(1)`|
|Recursive Modular Binary Exponentiation|`O(log n)`|`O(log n)`|
|Iterative Modular Binary Exponentiation|`O(log n)`|`O(1)`|
|Python `pow(x, n, mod)`|`O(log n)`|`O(1)`|

---

# Interview Takeaways 🎯

- Whenever you see **"find `aᵇ mod M`"**, think **Binary Exponentiation** immediately.
    
- If `M` is prime, Binary Exponentiation is also the building block for computing **modular inverses** using Fermat's Little Theorem.
    
- Remember the three critical lines:
    

```python
x %= mod

result = (result * x) % mod

x = (x * x) % mod
```

Forgetting any one of them is one of the most common causes of Wrong Answer (WA) in coding interviews and competitive programming.