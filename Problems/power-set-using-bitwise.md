---
Title: Power Set using Bitwise
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
  - Subset
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Generate the Power Set Using Bit Manipulation

**Pattern:** Bit manipulation

**Idea:** using bits as "include" or "not include"

---

## 💻 Code

```Python
def power_set(arr):
    n = len(arr)

    for mask in range(1 << n):

        subset = []

        for j in range(n):

            if mask & (1 << j):
                subset.append(arr[j])

        print(subset)

```
**Time complexity** - **$O(n \times 2^n)$** 
**Aux. Space complexity** -  O(n) (for the temporary <i>subset</i> array ) or **$O(n \times 2^n)$** (if all subsets are stored)
📌It can't be asymptotically made faster as we need to print/inspect/return $2^n$ subsets and for each we inspect at most n bits. It is indices-based and can result in duplicate subsets. One workaround is using `set` in python for distinct subsets stored as `tuple` . Sorting + backtracking method to handle duplicates (interview-friendly) [here](power-set-with-duplicates.md).

Extra: [Gray Code (1-bit difference)](../Notes/Gray%20Code%20(1-bit%20difference).md)

---
## Problem Statement

Given a set (or array) containing `n` distinct elements, generate **all possible subsets** of the set.

The collection of all subsets is called the **Power Set**.

---

# What is a Power Set?

A **power set** is the set of **all possible subsets**, including:

- The empty subset
    
- The subset containing every element
    

For example,

```text
Set

{A, B}
```

Power Set

```text
{}
{A}
{B}
{A, B}
```

There are **4 subsets**.

---

Another example,

```text
Set

{A, B, C}
```

Power Set

```text
{}
{A}
{B}
{C}
{A, B}
{A, C}
{B, C}
{A, B, C}
```

There are **8 subsets**.

---

# How Many Subsets Exist?

Suppose there are `n` elements.

Each element has exactly **two choices**.

- Include it
    
- Exclude it
    

Therefore,

$$  
2 \times 2 \times 2 \times \cdots \times 2  
$$

(`n` times)

Hence,

$$  
\boxed{\text{Number of Subsets} = 2^n}  
$$

---

# Why Does Bit Manipulation Work?

Suppose

```text
arr = [A, B, C]
```

There are

$$  
2^3 = 8  
$$

possible subsets.

Notice something interesting.

The numbers

```text
0

to

7
```

already have exactly **8 binary representations**.

|Decimal|Binary|
|--:|:-:|
|0|000|
|1|001|
|2|010|
|3|011|
|4|100|
|5|101|
|6|110|
|7|111|

Each binary number can describe one subset.

---

# The Main Idea

Each **bit position** corresponds to one array element.

For

```text
[A, B, C]
```

we map

|Bit Position|Element|
|---|---|
|Bit 0|A|
|Bit 1|B|
|Bit 2|C|

Rule:

- **1** → Include the element
    
- **0** → Exclude the element
    

---

# Example

Binary

```text
101
```

Interpretation

|Bit|Element|Include?|
|--:|---|---|
|1|C|Yes|
|0|B|No|
|1|A|Yes|

Subset

```text
{A, C}
```

---

Another example

Binary

```text
011
```

|Bit|Element|Include?|
|--:|---|---|
|0|C|No|
|1|B|Yes|
|1|A|Yes|

Subset

```text
{A, B}
```

---

# Complete Mapping

For

```text
[A, B, C]
```

|Decimal|Binary|Subset|
|--:|:-:|---|
|0|000|{}|
|1|001|{A}|
|2|010|{B}|
|3|011|{A, B}|
|4|100|{C}|
|5|101|{A, C}|
|6|110|{B, C}|
|7|111|{A, B, C}|

Notice that every subset appears **exactly once**.

---

# Algorithm

For every integer from

```text
0

to

2^n - 1
```

1. Look at its binary representation.
    
2. For every bit position:
    
    - If the bit is **1**, include that element.
        
    - Otherwise, skip it.
        

---

# Checking Whether a Bit is Set

To check the `j`-th bit, use

```python
mask & (1 << j)
```

If the result is non-zero,

the `j`-th element belongs to the current subset.

---

## Example

Suppose

```text
mask = 5

Binary

101
```

Check Bit 0

```text
101
001
---
001
```

Present

---

Check Bit 1

```text
101
010
---
000
```

Absent

---

Check Bit 2

```text
101
100
---
100
```

Present

Subset

```text
{A, C}
```

---

# Dry Run

Suppose

```text
arr = [10, 20, 30]
```

### mask = 0

Binary

```text
000
```

Subset

```text
{}
```

---

### mask = 3

Binary

```text
011
```

Bit 0 → Include 10

Bit 1 → Include 20

Bit 2 → Skip 30

Subset

```text
{10, 20}
```

---

### mask = 5

Binary

```text
101
```

Bit 0 → Include 10

Bit 1 → Skip 20

Bit 2 → Include 30

Subset

```text
{10, 30}
```

---

### mask = 7

Binary

```text
111
```

Include everything.

Subset

```text
{10, 20, 30}
```

---

# Python Code

```python
def power_set(arr):
    n = len(arr)

    for mask in range(1 << n):

        subset = []

        for j in range(n):

            if mask & (1 << j):
                subset.append(arr[j])

        print(subset)
```

---

# Why Does `(1 << n)` Give the Number of Subsets?

Shifting

```text
1 << n
```

means

$$  
2^n  
$$

Example

```text
n = 4

1 << 4

=

10000₂

=

16
```

Therefore,

```python
range(1 << n)
```

iterates over every possible subset.

---

# Complexity Analysis

There are

$$  
2^n  
$$

possible subsets.

For each subset,

we inspect all `n` bits.

Therefore,

- **Time Complexity:** **$O(n \times 2^n)$**
    

The algorithm stores one subset at a time.

Ignoring the output itself,

- **Auxiliary Space Complexity:** **$O(n)$**
    

(The temporary `subset` list can contain at most `n` elements.)

> **Note:** If all subsets are stored in a list instead of being printed, the space required becomes **$O(n \times 2^n)$**, since there are $2^n$ subsets, each of size up to `n`.

---

# Why Is This an Interview Favorite?

This technique appears in many important problems:

- Generate Power Set
    
- Subset Sum
    
- Partition Problems
    
- Meet-in-the-Middle Algorithms
    
- Traveling Salesman DP
    
- Bitmask Dynamic Programming
    

Understanding this pattern is essential before learning **Bitmask DP**.

---

# Common Interview Mistakes

## Mistake 1: Iterating Only to `n`

Incorrect

```python
for mask in range(n):
```

Correct

```python
for mask in range(1 << n):
```

because there are **$2^n$** subsets, not `n`.

---

## Mistake 2: Confusing Elements with Bit Positions

Remember,

```text
Bit 0 → arr[0]

Bit 1 → arr[1]

Bit 2 → arr[2]
```

The bit index corresponds directly to the array index.

---

## Mistake 3: Thinking This Works Only for Characters

The algorithm works for

- Integers
    
- Strings
    
- Objects
    

Anything that can be stored in an array.

The bits only determine **whether to include an element**, not what the element is.

---

# Interview Insight

This is one of the first problems where **an integer is treated as a set**.

Instead of thinking

```text
5
```

think

```text
101
```

which means

```text
Take element 0

Skip element 1

Take element 2
```

This idea forms the foundation of **Bitmask Dynamic Programming**.

---

# Key Takeaways

- A set with `n` elements has
    

$$  
2^n  
$$

subsets.

- Every integer from
    

```text
0

to

2^n - 1
```

represents exactly one subset.

- Bit `j` determines whether `arr[j]` belongs to the subset.
    

```python
if mask & (1 << j):
    subset.append(arr[j])
```

- Iterate through every mask.
    

```python
for mask in range(1 << n):
```

- **Time Complexity:** **$O(n \times 2^n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$** (or **$O(n \times 2^n)$** if all subsets are stored)
    

> **Interview Tip:** The most important realization is **"A bitmask is just a subset encoded as bits."** Once you understand this, many advanced algorithms involving subsets and dynamic programming become much easier to grasp.