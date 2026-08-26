---
Title: Count set bits
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Brian Kernighan
  - GFG
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Count Set Bits (Population Count / Hamming Weight)

**Pattern:** Bit manipulation

**Idea:** Brian kernighan's algorithm

---

## 💻 Code

```Python
def count_set_bits(n):
    count = 0

    while n:
        n = n & (n - 1)
        count += 1

    return count

```
**Time complexity** - O($k$), k is no of set bits 
**Aux. Space complexity** -  O(1)
More optimized appr. : [Lookup Table Solution for counting set bits](../Notes/Lookup%20Table%20Solution%20for%20counting%20set%20bits.md)


---

## Problem Statement

Given an integer `n`, count the number of **set bits (1s)** in its binary representation.

A **set bit** is simply a bit whose value is **1**.

---

# Example

```text
n = 13

Binary

1101

Set bits = 3
```

```text
n = 8

Binary

1000

Set bits = 1
```

```text
n = 7

Binary

111

Set bits = 3
```

---

# Approach 1: Check Every Bit (Right Shift)

## Idea

Repeatedly check the **last bit**.

- If the last bit is `1`, increment the answer.
    
- Shift the number right by one position.
    
- Continue until the number becomes `0`.
    

---

## Why Does This Work?

The expression

```python
n & 1
```

checks the **Least Significant Bit (LSB)**.

- If the result is `1`, the last bit is set.
    
- If the result is `0`, the last bit is unset.
    

After checking the last bit, remove it using

```python
n >>= 1
```

and repeat.

---

## Dry Run

```text
n = 13

Binary

1101
```

|n|Binary|n & 1|Count|
|---|---|--:|--:|
|13|1101|1|1|
|6|0110|0|1|
|3|0011|1|2|
|1|0001|1|3|
|0|0000|Stop|3|

Answer = **3**

---

## Python Code

```python
def count_set_bits(n):
    count = 0

    while n:
        count += n & 1
        n >>= 1

    return count
```

---

## Complexity

Suppose `n` has `b` bits.

The loop runs once for every bit.

- **Time Complexity:** **$O(b)$**
    

For a 32-bit integer:

- Maximum iterations = 32
    

So people often write

- **$O(32)$ = $O(1)$**
    

For DSA and competitive programming, however, it is better to remember it as

- **$O(\text{Number of Bits})$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Approach 2: Brian Kernighan's Algorithm (Interview Favorite)

## Key Observation

Subtracting `1` from a number changes the bits in a special way.

Example:

```text
12 = 1100

12 - 1

11 = 1011
```

Notice:

- The **rightmost set bit becomes 0**.
    
- All bits to its right become 1.
    

Now perform AND.

```text
1100
1011
----
1000
```

The **rightmost set bit disappears!**

---

## Another Example

```text
10

1010

10 - 1

1001

1010
1001
----
1000
```

Again, only the lowest set bit is removed.

---

# The Important Identity

```text
n & (n - 1)
```

**removes the rightmost set bit**.

This is one of the most important identities in bit manipulation.

---

# Idea

Instead of checking every bit,

keep removing the rightmost set bit until the number becomes zero.

Each removal corresponds to **one set bit**.

So,

```text
count++

n = n & (n - 1)
```

Repeat until `n == 0`.

---

# Dry Run

```text
n = 13

1101
```

|n|Binary|After `n & (n-1)`|Count|
|---|---|---|--:|
|13|1101|1100|1|
|12|1100|1000|2|
|8|1000|0000|3|
|0|Stop|-|3|

Answer = **3**

---

## Python Code

```python
def count_set_bits(n):
    count = 0

    while n:
        n = n & (n - 1)
        count += 1

    return count
```

---

# Why Is This Faster?

The previous algorithm checks **every bit**.

Brian Kernighan's algorithm visits **only the set bits**.

Example:

```text
10000000000000000000000000000000
```

There is only **one** set bit.

Approach 1

- Checks all 32 bits.
    

Approach 2

- Runs only **once**.
    

Huge improvement!

---

# Complexity

Suppose there are `k` set bits.

The loop runs exactly `k` times.

Therefore,

- **Time Complexity:** **$O(k)$**
    

where `k` = number of set bits.

### Best Case

```text
100000000000
```

Only one set bit.

Time Complexity

**$O(1)$**

---

### Worst Case

```text
111111111111
```

Every bit is set.

If there are `b` bits,

Time Complexity

**$O(b)$**

---

### Auxiliary Space Complexity

**$O(1)$**

---

# Approach 3: Python Built-in (Python 3.10+)

Python integers provide a built-in method.

```python
count = n.bit_count()
```

Example

```python
n = 13

print(n.bit_count())

# Output

3
```

Internally, Python uses highly optimized implementations, making this the preferred choice in real-world Python code.

---

# Comparison

|Method|Time Complexity|Auxiliary Space|Notes|
|---|---|---|---|
|Check every bit|**$O(\text{Number of Bits})$**|**$O(1)$**|Easy to understand|
|Brian Kernighan|**$O(k)$**|**$O(1)$**|Best interview solution|
|`bit_count()`|Optimized|**$O(1)$**|Python-specific|

---

# Common Interview Questions

## Q1. Why is Brian Kernighan's algorithm faster?

Because it iterates only over **set bits**, not every bit.

---

## Q2. What does `n & (n - 1)` do?

It removes the **rightmost set bit**.

Example

```text
101100

↓

101000
```

---

## Q3. Which approach should I write in interviews?

Unless the interviewer allows built-in methods,

prefer **Brian Kernighan's Algorithm**.

It demonstrates your understanding of bit manipulation.

---

# Key Takeaways

- A **set bit** is a bit whose value is `1`.
    
- Checking every bit:
    

```python
while n:
    count += n & 1
    n >>= 1
```

- Brian Kernighan's Algorithm:
    

```python
while n:
    n = n & (n - 1)
    count += 1
```

- Built-in Python method:
    

```python
n.bit_count()
```

---

# Summary

|Approach|Time Complexity|Auxiliary Space Complexity|
|---|---|---|
|Check Every Bit|**$O(\text{Number of Bits})$**|**$O(1)$**|
|Brian Kernighan|**$O(k)$** (`k` = number of set bits)|**$O(1)$**|
|Python `bit_count()`|Optimized (implementation-dependent)|**$O(1)$**|

> **Interview Tip:** Remember the identity **`n & (n - 1)` removes the rightmost set bit**. It appears in many classic interview problems such as checking if a number is a power of two, counting set bits, finding odd-occurring elements, and generating subsets using bitmasks.