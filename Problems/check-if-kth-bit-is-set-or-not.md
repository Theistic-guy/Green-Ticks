---
Title: Check if the K-th Bit is Set or Not
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
  - kth
  - Bits
  - Binary - 0 & 1
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Check if the K-th Bit is Set or Not

**Pattern:** bit manipulation

**Idea:** masking

---

## 💻 Code

```Python
def is_kth_bit_set(n, k):
    mask = 1 << (k - 1)

    if n & mask:
        return True
    return False

```
**Time complexity** - O(1)
**Aux. Space complexity** -  O(1)

---

## Problem Statement

Given an integer `n` and an integer `k`, determine whether the **k-th bit** (counting from the right) of `n` is **set (1)** or **unset (0)**.

> **Convention:** In DSA and most interview questions, the **Least Significant Bit (LSB)** is considered the **1st bit**.

### Example

```
n = 13

Binary Representation:

1101
^^^^
4321   ← Bit Positions (from the right)

Bit 1 = 1
Bit 2 = 0
Bit 3 = 1
Bit 4 = 1
```

So,

- 1st bit is **set**
    
- 2nd bit is **not set**
    
- 3rd bit is **set**
    
- 4th bit is **set**
    

---

# Approach 1: Left Shift (Masking)

## Idea

Create a number that has **only the k-th bit set**.

We can do this using

$$  
1 << (k-1)  
$$

This creates a **mask**.

For example,

```
k = 4

1        = 0001
1 << 3   = 1000
```

Now perform a bitwise AND.

```
1101
1000
----
1000
```

Since the result is non-zero, the 4th bit is set.

---

## Algorithm

1. Create a mask
    

```python
mask = 1 << (k - 1)
```

2. Perform
    

```python
n & mask
```

3. If the result is non-zero, the bit is set.
    

---

## Python Code

```python
def is_kth_bit_set(n, k):
    mask = 1 << (k - 1)

    if n & mask:
        return True
    return False
```

### Short Version

```python
def is_kth_bit_set(n, k):
    return (n & (1 << (k - 1))) != 0
```

---

## Example

```
n = 13
k = 3

13 = 1101

Mask

1 << 2

0100

1101
0100
----
0100

Non-zero

Answer = True
```

---

# Approach 2: Right Shift

## Idea

Instead of moving the mask to the bit,

move the bit to the **Least Significant Position**.

Shift right by

$$  
k-1  
$$

positions.

Then check the last bit.

---

## Example

```
n = 13

1101

Want to check 3rd bit.

Shift right by 2

1101 >> 2

0011
```

Now check the last bit.

```
0011

Last bit = 1
```

Hence, the 3rd bit is set.

---

## Algorithm

```python
(n >> (k - 1)) & 1
```

If the answer is 1, the bit is set.

Otherwise, it is unset.

---

## Python Code

```python
def is_kth_bit_set(n, k):
    return ((n >> (k - 1)) & 1) == 1
```

---

# Dry Run

```
n = 20

Binary

10100

Check k = 3
```

### Left Shift Method

```
Mask

00100

10100
00100
-----
00100

Answer = True
```

### Right Shift Method

```
10100 >> 2

00101

Last bit

00101 & 1

00001

Answer = True
```

Both methods give the same answer.

---

# Which Method is Better?

Both are equally efficient.

However, in interviews, the **Left Shift (Masking)** approach is generally preferred because it clearly demonstrates the concept of **bit masks**, which is widely used in bit manipulation problems.

The **Right Shift** method is also common and often feels more intuitive because it moves the target bit to the last position.

---

# Time Complexity

Both approaches perform a constant number of bit operations.

- **Time Complexity:** **$O(1)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Mistakes

### Mistake 1: Using `k` instead of `k - 1`

Incorrect

```python
1 << k
```

Correct

```python
1 << (k - 1)
```

This is because bit positions are usually **1-indexed**.

---

### Mistake 2: Forgetting Parentheses

Incorrect

```python
n & 1 << (k - 1)
```

Although this works in Python due to operator precedence, it is harder to read.

Prefer

```python
n & (1 << (k - 1))
```

---

### Mistake 3: Assuming Bit Positions Start from 0

Some programming libraries or hardware documentation use **0-based indexing**, while DSA problems almost always use **1-based indexing**.

Always read the question carefully.

---

# Key Takeaways

- To check the **k-th bit**, use a **bit mask** or **right shift**.
    
- Left Shift Method:
    

```python
(n & (1 << (k - 1))) != 0
```

- Right Shift Method:
    

```python
((n >> (k - 1)) & 1) == 1
```

- Both methods have:
    
    - **Time Complexity:** **$O(1)$**
        
    - **Auxiliary Space Complexity:** **$O(1)$**
        

> **Interview Tip:** The **masking approach** is the one most frequently expected in coding interviews because the same idea extends naturally to setting, clearing, toggling, and counting bits.