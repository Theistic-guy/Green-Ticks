---
Title: If number is power of 2
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - Brian Kernighan
  - GFG
Link: ""
---

# # Check if a Number is a Power of Two

**Pattern:**  Brian Kernighan
**Idea:**  n & (n-1)

---

## 💻 Code

```Python
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

```
**Time complexity** - O(1) 
**Aux. Space complexity** -  O(1)

---
## Problem Statement

Given an integer `n`, determine whether it is a **power of two**.

A power of two is any number of the form

$$  
2^k,\quad k \ge 0  
$$

Examples:

```text
1  = 2^0
2  = 2^1
4  = 2^2
8  = 2^3
16 = 2^4
32 = 2^5
```

Non-examples:

```text
3
5
6
10
12
18
```

---

# Binary Pattern of Powers of Two

Let's write a few powers of two in binary.

|Decimal|Binary|
|--:|---|
|1|0001|
|2|0010|
|4|0100|
|8|1000|
|16|10000|
|32|100000|

Notice the pattern:

> **Every power of two has exactly one set bit.**

This observation leads to an elegant bit manipulation solution.

---

# Naive Approach

## Idea

Repeatedly divide the number by 2.

If it eventually becomes 1, then it is a power of two.

Otherwise, it is not.

---

## Python Code

```python
def is_power_of_two(n):
    if n <= 0:
        return False

    while n > 1:
        if n % 2 != 0:
            return False
        n //= 2

    return True
```

---

## Complexity

If there are `b` bits,

each division roughly halves the number.

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Efficient Bit Manipulation Approach

## Key Observation

From the previous topic, we know that

```text
n & (n - 1)
```

**removes the rightmost set bit.**

Now consider a power of two.

Example:

```text
8

1000
```

Subtract 1

```text
7

0111
```

Now perform AND.

```text
1000
0111
----
0000
```

The result is **zero**.

---

## Another Example

```text
16

10000
```

```text
15

01111
```

```text
10000
01111
-----
00000
```

Again,

```text
n & (n - 1) = 0
```

---

# Why Does This Work?

A power of two contains **exactly one set bit**.

Applying

```text
n & (n - 1)
```

removes that only set bit.

Nothing remains.

Hence,

$$  
n \, \& \, (n-1)=0  
$$

---

# What About Non-Powers of Two?

Example

```text
12

1100
```

Subtract 1

```text
11

1011
```

AND

```text
1100
1011
----
1000
```

The result is **not zero**.

This tells us that more than one set bit existed.

---

Another example

```text
10

1010
```

```text
9

1001
```

```text
1010
1001
----
1000
```

Again,

the result is not zero.

---

# The Complete Condition

There is one important edge case.

Consider

```text
n = 0
```

```text
0 & (-1)

=

0
```

This incorrectly satisfies the condition.

Similarly,

negative numbers are **not** powers of two.

Therefore, we must first check that

```text
n > 0
```

The complete condition becomes

$$  
\boxed{n > 0 \text{ and } (n \,\&\, (n-1)) = 0}  
$$

---

# Python Code

```python
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
```

---

# Dry Run

## Example 1

```text
n = 32

Binary

100000
```

```text
31

011111
```

```text
100000
011111
------
000000
```

Answer

```text
True
```

---

## Example 2

```text
n = 18

10010
```

```text
17

10001
```

```text
10010
10001
-----
10000
```

Answer

```text
False
```

---

## Example 3

```text
n = 1
```

```text
1

0001
```

```text
0

0000
```

```text
0001
0000
----
0000
```

Answer

```text
True
```

Remember,

$$  
1 = 2^0  
$$

so 1 **is** a power of two.

---

# Why Does `n - 1` Flip the Bits Like This?

Suppose

```text
10000
```

Subtracting 1 gives

```text
01111
```

The leftmost set bit becomes **0**, and all bits to its right become **1**.

Therefore,

```text
10000

AND

01111

=

00000
```

This is exactly why the trick works.

---

# Complexity Analysis

The algorithm performs only a few bit operations.

- **Time Complexity:** **$O(1)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Mistakes

## Mistake 1: Forgetting the Positive Check

Incorrect

```python
return (n & (n - 1)) == 0
```

This returns `True` for

```text
n = 0
```

Always write

```python
return n > 0 and (n & (n - 1)) == 0
```

---

## Mistake 2: Thinking 1 is Not a Power of Two

Remember

$$  
1 = 2^0  
$$

Therefore,

```text
1
```

**is** a power of two.

---

## Mistake 3: Memorizing the Trick Without Understanding It

Don't just memorize

```text
n & (n - 1)
```

Understand that it **removes the rightmost set bit**.

Since a power of two has exactly **one** set bit, removing it leaves zero.

---

# Related Interview Problems

The identity

```text
n & (n - 1)
```

appears in many interview questions:

- Count Set Bits (Brian Kernighan's Algorithm)
    
- Check if a Number is a Power of Two
    
- Check if a Number has Exactly One Set Bit
    
- Find the Rightmost Set Bit
    
- Bitmask Dynamic Programming
    
- Lookup Table Construction for Set Bits
    

Learning this identity thoroughly will help solve many bit manipulation problems.

---

# Key Takeaways

- Every power of two has **exactly one set bit**.
    
- The identity
    

```text
n & (n - 1)
```

removes the rightmost set bit.

- If the result becomes zero, there was only one set bit.
    
- Always check that the number is positive.
    

Final solution:

```python
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
```

- **Time Complexity:** **$O(1)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> **Interview Tip:** Whenever you see the expression `n & (n - 1)`, immediately think **"remove the rightmost set bit."** Many seemingly different bit manipulation problems reduce to this single identity.