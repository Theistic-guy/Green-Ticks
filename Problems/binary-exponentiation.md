---
Title: Binary Exponentiation
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags: [GFG]
Link: ""
---

# Binary Exponentiation

**Pattern:** **Divide and Conquer** (specifically, **Decrease and Conquer**)

**Idea:** **Halve the exponent** at each step, square the result, and multiply by the base only if the exponent was odd.

---

## 💻 Code

Iterative (preferred) :-
```Python
def power(x, n):

    result = 1

    while n > 0:

        if n & 1:
            result *= x

        x *= x

        n //= 2

    return result
```
**Time complexity** - O(logn)
**Aux. Space complexity** -  O(1)

Recursive :-
```Python
def power(x, n):

    if n == 0:
        return 1

    temp = power(x, n // 2)

    if n % 2 == 0:
        return temp * temp

    return x * temp * temp
```
**Time complexity** - O(log n)
**Aux. Space complexity** -  O(log n) . Function call stack

**NOTE**: With [Modulo](../Notes/Binary%20Exponentiation%20with%20modulo.md)

---
# Computing Power (Binary Exponentiation / Exponentiation by Squaring)

The **Computing Power** problem asks us to compute

```text
xⁿ
```

efficiently.

It is one of the most fundamental algorithms in mathematics, competitive programming, and cryptography.

The naive solution requires `n` multiplications.

Using **Binary Exponentiation**, we can reduce this to only **O(log n)** multiplications.

---

# Problem Statement

Given two integers

```text
x
```

and

```text
n
```

compute

```text
xⁿ
```

Example

```text
2⁵ = 32

3⁴ = 81

5⁰ = 1
```

---

# Naive Approach

## Idea

Multiply the number by itself exactly `n` times.

Example

```text
2⁵

= 2 × 2 × 2 × 2 × 2
```

---

## Algorithm

```python
def power(x, n):
    result = 1

    for _ in range(n):
        result *= x

    return result
```

---

## Time Complexity

The loop executes exactly `n` times.

Therefore,

```text
Time Complexity = O(n)
```

---

## Auxiliary Space Complexity

Only one extra variable is used.

```text
Auxiliary Space Complexity = O(1)
```

---

# Key Mathematical Observation

Suppose we want

```text
x⁸
```

Instead of multiplying

```text
x × x × x × x × x × x × x × x
```

notice

```text
x⁸

= (x⁴)²

= ((x²)²)²
```

We repeatedly **square** the answer.

Now consider

```text
x⁹
```

```text
x⁹

= x × x⁸
```

Similarly,

```text
x¹³

= x × (x⁶)²

= x × (x³)²

= x × x × (x²)²
```

The exponent keeps getting divided by **2**.

This immediately suggests an algorithm whose work is proportional to

```text
log₂(n)
```

instead of

```text
n
```

---

# Even and Odd Exponents

Every exponent belongs to one of two cases.

## Case 1 — Even Exponent

Suppose

```text
n = 8
```

Then

```text
x⁸

= (x⁴)²
```

Generally,

```text
If n is even,

xⁿ = (xⁿ⁄²)²
```

---

## Case 2 — Odd Exponent

Suppose

```text
n = 9
```

Then

```text
x⁹

= x × x⁸

= x × (x⁴)²
```

Generally,

```text
If n is odd,

xⁿ = x × (x⁽ⁿ⁻¹⁾⁄²)²
```

These two identities are the entire foundation of Binary Exponentiation.

---

# Recursive Binary Exponentiation

## Algorithm

```python
def power(x, n):

    if n == 0:
        return 1

    temp = power(x, n // 2)

    if n % 2 == 0:
        return temp * temp

    return x * temp * temp
```

---

## Dry Run

Compute

```text
2¹³
```

Recursive calls

```text
power(2,13)

↓

power(2,6)

↓

power(2,3)

↓

power(2,1)

↓

power(2,0)
```

Now unwind

```text
2⁰ = 1

↓

2¹ = 2

↓

2³ = 8

↓

2⁶ = 64

↓

2¹³ = 8192
```

Notice that every recursive call halves the exponent.

---

## Time Complexity

At every recursive call,

the exponent becomes

```text
n

↓

n/2

↓

n/4

↓

n/8

...
```

How many times can we divide by 2?

Exactly

```text
log₂(n)
```

times.

Each recursive call performs only constant work.

Therefore,

```text
Time Complexity = O(log n)
```

---

## Auxiliary Space Complexity

The recursion depth is

```text
O(log n)
```

Hence,

```text
Auxiliary Space Complexity = O(log n)
```

---

# Iterative Binary Exponentiation

The recursive solution can be converted into an iterative one.

The trick is to look at the binary representation of the exponent.

Example

```text
13

= 1101₂
```

Observe

```text
13

= 8 + 4 + 1
```

Therefore,

```text
x¹³

= x⁸ × x⁴ × x¹
```

While traversing the bits,

we continuously square the base.

Whenever a bit is

```text
1
```

we include the current power in the answer.

---

# Algorithm

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

---

# Dry Run

Compute

```text
3¹³
```

Binary representation

```text
13

1101₂
```

|n|Binary|Current x|Result|
|---|---|---|---|
|13|1101|3|1|
|6|110|9|3|
|3|11|81|3|
|1|1|6561|243|
|0|0|43046721|1594323|

Final Answer

```text
1594323
```

which is

```text
3¹³
```

---

# Why Does This Work?

Every iteration

```python
n //= 2
```

removes the least significant binary digit.

Every iteration

```python
x *= x
```

moves to the next power of two.

Example

```text
3

↓

3²

↓

3⁴

↓

3⁸

↓

3¹⁶
```

Whenever the current binary digit is

```text
1
```

that power contributes to the final answer.

---

# Example

Compute

```text
2¹³
```

Binary

```text
1101₂
```

Selected powers

```text
2¹

2⁴

2⁸
```

Multiply them

```text
2 × 16 × 256

= 8192
```

Exactly

```text
2¹³
```

---

# Complexity Analysis

The exponent becomes

```text
n

↓

n/2

↓

n/4

↓

...
```

The loop executes

```text
O(log n)
```

times.

Each iteration performs constant work.

Therefore,

```text
Time Complexity = O(log n)
```

---

## Auxiliary Space Complexity

No recursion.

Only a few variables.

```text
Auxiliary Space Complexity = O(1)
```

---

# Common Misconceptions

### ❌ Why is it called Binary Exponentiation?

Because the exponent is processed according to its **binary representation**, not because the base is binary.

---

### ❌ Why do we square the base every iteration?

Each squaring generates the next power of two.

```text
x

↓

x²

↓

x⁴

↓

x⁸

↓

x¹⁶
```

---

### ❌ Why divide the exponent by 2?

Each division removes one binary digit.

The number of binary digits in `n` is

```text
⌊log₂(n)⌋ + 1
```

Hence only `O(log n)` iterations are needed.

---

# Key Realizations 💡

- Binary Exponentiation is based on repeatedly halving the exponent.
    
- Every exponent can be decomposed into powers of two using its binary representation.
    
- Even exponents are solved by squaring.
    
- Odd exponents require one extra multiplication by the base.
    
- The recursive and iterative algorithms have the same time complexity.
    
- The iterative version is usually preferred because it uses constant auxiliary space.
    

---

# Complexity Summary

|Approach|Time|Auxiliary Space|
|---|---|---|
|Naive Multiplication|`O(n)`|`O(1)`|
|Recursive Binary Exponentiation|`O(log n)`|`O(log n)`|
|Iterative Binary Exponentiation|`O(log n)`|`O(1)`|

---

# Interview Takeaways 🎯

- Always recognize exponentiation as a problem where the exponent can be **halved** repeatedly.
    
- Derive the recurrence from the two identities:
    
    - Even: `xⁿ = (xⁿ⁄²)²`
        
    - Odd: `xⁿ = x × (x⁽ⁿ⁻¹⁾⁄²)²`
        
- In interviews and competitive programming, the **iterative binary exponentiation** solution is generally preferred because it achieves **O(log n)** time with **O(1)** auxiliary space.
    
- Binary Exponentiation is also the foundation for **Modular Exponentiation**, one of the most frequently used algorithms in number theory and competitive programming.