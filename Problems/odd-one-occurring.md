---
Title: Odd one occurring
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
  - XOR
Link: ""
---

# Find the One Odd Occurring Number

**Pattern:** Bit manipulation
**Idea:**  XOR properties especially $x \wedge x = 0$ (even times) and $x \wedge x \wedge x = x$ (odd times)

---

## 💻 Code

```Python
def odd_occurring(arr):
    ans = 0

    for num in arr:
        ans ^= num

    return ans

```
**Time complexity** - O(n), n is the len of arr.
**Aux. Space complexity** -  O(1)
See : [XOR properties](../Notes/XOR%20properties.md) 

---

## Problem Statement

Given an array where **every element occurs an even number of times except one element**, find that odd occurring element.

### Examples

```text
Input:
[4, 3, 4, 4, 4, 5, 5]

Output:
3
```

```text
Input:
[7, 3, 5, 4, 5, 3, 4]

Output:
7
```

```text
Input:
[8, 8, 6, 6, 2]

Output:
2
```

---

# Approach 1: Count Frequencies (Hash Map)

## Idea

Count the frequency of every element.

The element with an odd frequency is the answer.

---

## Python Code

```python
from collections import Counter

def odd_occurring(arr):
    freq = Counter(arr)

    for num, count in freq.items():
        if count % 2 == 1:
            return num
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# Approach 2: XOR (Optimal)

This is one of the most famous applications of XOR.

---

# XOR Properties

Before understanding the solution, remember these properties.

## Property 1

$$  
x \oplus 0 = x  
$$

Example

```text
7 ^ 0 = 7
```

---

## Property 2

$$  
x \oplus x = 0  
$$

Example

```text
13 ^ 13 = 0
```

Any number XOR itself becomes zero.

---

## Property 3

XOR is **Commutative**

$$  
a \oplus b = b \oplus a  
$$

The order does not matter.

---

## Property 4

XOR is **Associative**

# $$  
(a \oplus b)\oplus c

a\oplus(b\oplus c)  
$$

We can group terms in any order.

---

# Main Idea

Since

$$  
x \oplus x = 0  
$$

every element appearing **twice** cancels itself.

Only the odd occurring element remains.

---

# Example

```text
Array

[4, 3, 4, 4, 4, 5, 5]
```

Take XOR of every element.

```text
4 ^ 3 ^ 4 ^ 4 ^ 4 ^ 5 ^ 5
```

Rearrange using commutative property.

```text
(4 ^ 4 ^ 4 ^ 4)
^
(5 ^ 5)
^
3
```

Now,

```text
4 ^ 4 = 0

4 ^ 4 = 0

5 ^ 5 = 0
```

Therefore,

```text
0 ^ 0 ^ 3

=

3
```

Answer = **3**

---

# Dry Run

```text
Array

[2, 3, 5, 4, 5, 3, 4]
```

|Current Number|Running XOR|
|--:|--:|
|2|2|
|3|1|
|5|4|
|4|0|
|5|5|
|3|6|
|4|2|

Final answer

```text
2
```

---

# Why Does It Work?

Suppose the array is

```text
[a, b, a, c, c, d, d]
```

Taking XOR of all elements,

```text
a ^ b ^ a ^ c ^ c ^ d ^ d
```

Rearrange,

```text
(a ^ a)
^
(c ^ c)
^
(d ^ d)
^
b
```

Each pair becomes zero.

```text
0 ^ 0 ^ 0 ^ b

=

b
```

Thus, the odd occurring element remains.

---

# Python Code

```python
def odd_occurring(arr):
    ans = 0

    for num in arr:
        ans ^= num

    return ans
```

---

# Dry Run (Step-by-Step)

Suppose

```text
arr = [10, 20, 20, 10, 30]
```

|Number|Running XOR|
|--:|--:|
|10|10|
|20|30|
|20|10|
|10|0|
|30|30|

Final Answer

```text
30
```

---

# Why Is XOR Better?

Instead of storing frequencies,

we simply keep one running XOR.

Memory usage remains constant.

---

# Complexity Analysis

The array is traversed once.

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Mistakes

## Mistake 1: Forgetting the Assumption

This algorithm works **only if exactly one element has an odd frequency**.

Example

```text
Correct

[1, 2, 2, 3, 3]
```

Only `1` occurs oddly.

---

Incorrect

```text
[1, 2, 2, 3]
```

Both `1` and `3` occur oddly.

The algorithm will return

```text
1 ^ 3
```

which is **not** the answer.

---

## Mistake 2: Using OR Instead of XOR

Incorrect

```python
ans |= num
```

Correct

```python
ans ^= num
```

Only XOR has the cancellation property.

---

## Mistake 3: Thinking It Works for Strings

The XOR trick requires integer values.

For strings or objects, use a frequency map instead.

---

# When Should You Use This Trick?

Use XOR whenever you see phrases like:

- "Every element appears twice except one."
    
- "Exactly one odd occurring element."
    
- "Pairs cancel out."
    
- "Find the unique element."
    

These are strong hints toward XOR.

---

# Related Interview Problems

The XOR concept is used in many classic interview questions:

- Find One Odd Occurring Number
    
- Find Missing Number
    
- Single Number (LeetCode 136)
    
- Swap Two Numbers Without Extra Space
    
- Find Two Odd Occurring Numbers
    
- Find XOR of All Numbers in a Range
    

---

# Key Takeaways

- XOR properties:
    
    - $x \oplus x = 0$
        
    - $x \oplus 0 = x$
        
    - XOR is **commutative**
        
    - XOR is **associative**
        
- Every even-occurring element cancels itself.
    
- Only the odd-occurring element remains.
    

Final solution:

```python
def odd_occurring(arr):
    ans = 0

    for num in arr:
        ans ^= num

    return ans
```

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> **Interview Tip:** Whenever the problem states **"every element appears exactly twice except one"** or **"every element has an even frequency except one"**, think of XOR immediately. It's one of the strongest interview patterns in bit manipulation.