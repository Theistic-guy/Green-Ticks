---
Title: Two odd occurring
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - GFG
  - XOR
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Find the Two Odd Occurring Numbers

**Pattern:** Bit manipulation

**Idea:**  XOR properties especially $x \wedge x = 0$ (even times) and $x \wedge x \wedge x = x$ (odd times)

---

## 💻 Code

```Python
def two_odd_occurring(arr):
    xor = 0

    for num in arr:
        xor ^= num

    rightmost = xor & -xor

    first = 0
    second = 0

    for num in arr:
        if num & rightmost:
            first ^= num
        else:
            second ^= num

    return first, second

```
**Time complexity** - O(n), n is array length
**Aux. Space complexity** -  O(1)
**Important Follow-Up questions**  -  [Follow-Up questions on Two Odd Occurring XOR pattern](../Notes/Follow-Up%20questions%20on%20Two%20Odd%20Occurring%20XOR%20pattern.md)
See : [XOR properties](../Notes/XOR%20properties.md)

📌**Note:** The assumption that there are exactly two distinct odd-occurring numbers in the array, while all other numbers occur an even number of times, is a mandatory constraint of the problem.

---

## Problem Statement

Given an array where **exactly two elements occur an odd number of times** and every other element occurs an even number of times, find those two odd occurring elements.

> The order of the answer does not matter.

### Examples

```text
Input:
[3, 4, 3, 4, 5, 4, 4, 6, 7, 7]

Output:
5, 6
```

```text
Input:
[1, 2, 3, 2, 3, 1, 4, 5]

Output:
4, 5
```

---

# Naive Approach (Hash Map)

Count the frequency of every element using a hash map and return the two elements whose frequencies are odd.

## Python Code

```python
from collections import Counter

def two_odd_occurring(arr):
    freq = Counter(arr)

    ans = []

    for num, cnt in freq.items():
        if cnt % 2 == 1:
            ans.append(num)

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# Optimal XOR Approach

At first glance, it looks like we can simply XOR every element like we did in the previous problem.

Let's see what happens.

---

# Step 1: XOR All Elements

Suppose the array is

```text
[2, 3, 5, 4, 5, 3, 4, 6]
```

The odd occurring numbers are

```text
2 and 6
```

Taking XOR of every element,

```text
2 ^ 3 ^ 5 ^ 4 ^ 5 ^ 3 ^ 4 ^ 6
```

Every even occurring element cancels.

```text
(3 ^ 3)
^
(4 ^ 4)
^
(5 ^ 5)
^
2
^
6
```

Result

```text
2 ^ 6
```

Unlike the previous problem, we do **not** get one answer.

Instead, we get

```text
xor = first ^ second
```

---

# Step 2: Why Can't We Stop Here?

Suppose

```text
xor = 2 ^ 6
```

Binary

```text
2

0010

6

0110
```

XOR

```text
0100
```

From

```text
0100
```

can you uniquely determine the two original numbers?

No.

Many pairs produce the same XOR.

Example

```text
2 ^ 6 = 4

5 ^ 1 = 4

12 ^ 8 = 4
```

Knowing only the XOR value is **not enough**.

We need one extra piece of information.

---

# Step 3: Find a Differing Bit

Since

```text
xor = first ^ second
```

every set bit in `xor` tells us:

> **The two odd occurring numbers differ at this bit position.**

For example,

```text
2

0010

6

0110
```

XOR

```text
0100
```

The third bit is set.

This means

- One number has this bit = 1
    
- The other has this bit = 0
    

This bit will allow us to separate them.

---

# How Do We Find Such a Bit?

The easiest method is to isolate the **rightmost set bit**.

There are two common ways.

### Method 1 (Most Common)

```python
rightmost = xor & -xor
```

### Method 2

```python
rightmost = xor & ~(xor - 1)
```

Both isolate the lowest set bit.

---

## Example

```text
xor

01010000
```

Rightmost set bit

```text
00010000
```

Only this bit is retained.

---

# Why Choose the Rightmost Set Bit?

Actually,

**any set bit of `xor` would work.**

We choose the rightmost one because it is easy to isolate using bit operations.

The only requirement is that the chosen bit is **set in `xor`**.

---

# Step 4: Divide the Array into Two Groups

Now partition every element based on whether this bit is set.

Example

```text
Rightmost Set Bit

0100
```

Group 1

```text
Bit is set
```

Group 2

```text
Bit is not set
```

---

## Example

```text
Array

2 3 5 4 5 3 4 6
```

Rightmost set bit

```text
0100
```

### Group 1

```text
4
5
5
4
6
```

### Group 2

```text
2
3
3
```

Notice something important.

Every duplicated number always falls into the **same group**, because identical numbers have identical bits.

Therefore,

- all even occurring elements still cancel,
    
- but the two odd occurring numbers are now in **different groups**.
    

---

# Step 5: XOR Each Group

Group 1

```text
4 ^ 5 ^ 5 ^ 4 ^ 6

=

6
```

Group 2

```text
2 ^ 3 ^ 3

=

2
```

We recover both answers.

---

# Why Does This Always Work?

Suppose the odd occurring numbers are

```text
x

and

y
```

Since

```text
xor = x ^ y
```

there is at least one set bit.

That bit exists **only because x and y differ there**.

Therefore,

- x goes into one group,
    
- y goes into the other.
    

Every duplicated element has identical bits,

so both copies always enter the same group and cancel using XOR.

Thus,

each group contains exactly one odd occurring number.

---

# Python Code

```python
def two_odd_occurring(arr):
    xor = 0

    for num in arr:
        xor ^= num

    rightmost = xor & -xor

    first = 0
    second = 0

    for num in arr:
        if num & rightmost:
            first ^= num
        else:
            second ^= num

    return first, second
```

---

# Dry Run

```text
Array

[2, 3, 5, 4, 5, 3, 4, 6]
```

### Step 1

```text
xor

2 ^ 6

=

4
```

Binary

```text
0100
```

---

### Step 2

```text
rightmost

0100
```

---

### Step 3

Group 1

```text
4
5
5
4
6
```

XOR

```text
6
```

---

Group 2

```text
2
3
3
```

XOR

```text
2
```

Final Answer

```text
2, 6
```

---

# Complexity Analysis

The array is traversed twice.

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Questions

## Why can't we simply XOR the entire array?

Because XOR of the entire array gives

```text
first ^ second
```

not the individual numbers.

---

## Why do we isolate the rightmost set bit?

It identifies a bit where the two odd occurring numbers differ.

This allows us to separate them into different groups.

---

## Why do duplicate numbers always stay together?

Because identical numbers have identical binary representations.

Therefore, they always satisfy the same grouping condition and cancel within their own group.

---

## Can we use any set bit instead of the rightmost one?

Yes.

Any set bit in

```text
xor = first ^ second
```

guarantees that the two odd occurring numbers differ at that position.

The rightmost set bit is simply the easiest one to isolate.

---

# Interview Insight: Why Can't This Trick Be Extended to Three Odd Occurring Numbers?

This is a very common follow-up interview question.

Suppose the odd occurring numbers are

```text
a

b

c
```

XORing the entire array gives

```text
a ^ b ^ c
```

Unlike the two-number case, there is **no single differing bit** that guarantees one number goes into one group while the other two go into another.

Example

```text
3 = 011

5 = 101

6 = 110
```

XOR

```text
011
101
110
---
000
```

The total XOR is zero, even though three odd occurring numbers exist.

Now there is **no set bit to partition the array**, so the algorithm completely fails.

This is why the XOR partitioning technique works **only for exactly two odd occurring numbers**.

---

# Key Takeaways

- XOR the entire array to obtain
    

```text
first ^ second
```

- Find any set bit (typically the rightmost one).
    

```python
rightmost = xor & -xor
```

- Partition the array using this bit.
    
- XOR each partition independently.
    
- Duplicates cancel within each group.
    
- Each group reveals one odd occurring number.
    

Final solution:

```python
def two_odd_occurring(arr):
    xor = 0

    for num in arr:
        xor ^= num

    rightmost = xor & -xor

    first = 0
    second = 0

    for num in arr:
        if num & rightmost:
            first ^= num
        else:
            second ^= num

    return first, second
```

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> **Interview Tip:** This problem combines **two classic XOR identities**:
> 
> - `x ^ x = 0` (duplicates cancel)
>     
> - `xor & -xor` (isolates the rightmost set bit)
>     
> 
> Understanding _why_ the partitioning works is far more important than memorizing the code.