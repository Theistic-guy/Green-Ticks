---
Title: Josephus Problem
Companies:
  - Not Specified
Topics:
  - Recursion
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
Link: ""
---

# Josephus Problem

**Pattern:** 

**Idea:** 

**Intuition** : [Intuition behind Josephus Problem](../Notes/Intuition%20behind%20Josephus%20Problem.md)

---

## 💻 Code

#### Recursive
```Python
def josephus(n, k):

    if n == 1:
        return 0

    return (josephus(n - 1, k) + k) % n

```
**Time complexity** - O(n) 
**Aux. Space complexity** -  O(n) , recursion stack

#### Iterative
```python
def josephus(n, k):

    ans = 0

    for i in range(2, n + 1):
        ans = (ans + k) % i

    return ans
```
This is 0-index based, as i gives 0 to i-1 values, so for '1' ans is 0. For 1-based indexing, simply return the final ans + 1.

Time - O(n)
Aux space - O(1)

---

## Problem Statement

There are `n` people standing in a circle numbered from

```text id="m9t6v3"
0 to n-1
```

Starting from person `0`, every **k-th person** is eliminated.

The process continues until only **one person** remains.

Find the **safe position** (the position of the last surviving person).

> **Note:** This note uses **0-based indexing**, which is the convention followed in most DSA books and interviews. For 1-based indexing, simply add `1` to the final answer.

---

# Example

Suppose

```text id="9j1nqq"
n = 5

k = 2
```

People

```text id="dnl4je"
0 1 2 3 4
```

Elimination order

```text id="b7gg3g"
1

3

0

4
```

Remaining

```text id="cbgk95"
2
```

Answer

```text id="g37p07"
2
```

---

# Key Observation

Suppose we already know the answer for

```text id="yvz9hy"
n - 1
```

people.

Can we use it to find the answer for

```text id="78r8tn"
n
```

people?

Yes.

After the **first elimination**, the remaining people form the **same Josephus problem**, just with one fewer person.

The only difference is that their numbering has shifted.

This leads to a simple recurrence.

---

# Recurrence Relation

Let

$$
J(n,k)
$$

denote the safe position.

Base case

$$
J(1,k)=0
$$

Recursive relation

$$
\boxed{J(n,k)=\left(J(n-1,k)+k\right)\bmod n}
$$

This is the most important formula for the Josephus problem.

---

# Why Does This Formula Work?

Suppose

```text id="zjntw0"
n = 5

k = 2
```

The first eliminated person is

```text id="tif3nr"
(2-1) % 5 = 1
```

Remaining circle

```text id="rvmjlwm"
2 3 4 0
```

Notice that this is simply another Josephus problem with **4 people**.

If the safe position in this smaller problem is

```text id="a7tqq7"
x
```

we must convert it back to the original numbering.

That conversion is exactly

$$
(x+k)\bmod n
$$

which gives

$$
J(n,k)=\left(J(n-1,k)+k\right)\bmod n
$$

---

# Recursive Solution

## Python Code

```python id="t1yy0x"
def josephus(n, k):

    if n == 1:
        return 0

    return (josephus(n - 1, k) + k) % n
```

---

# Dry Run

Suppose

```text id="fjlwmw"
n = 5

k = 2
```

Start from the base case.

```text id="nbzotw"
J(1)

=

0
```

Now compute upwards.

```text id="1h6lqx"
J(2)

=

(0 + 2) % 2

=

0
```

```text id="9vhfln"
J(3)

=

(0 + 2) % 3

=

2
```

```text id="wzj2qt"
J(4)

=

(2 + 2) % 4

=

0
```

```text id="ybsqew"
J(5)

=

(0 + 2) % 5

=

2
```

Answer

```text id="1vhd7w"
2
```

---

# Iterative Solution (Preferred)

The recurrence depends only on the previous answer.

Therefore, recursion can easily be converted into iteration.

## Python Code

```python id="qoqtxi"
def josephus(n, k):

    ans = 0

    for i in range(2, n + 1):
        ans = (ans + k) % i

    return ans
```

This is generally preferred because it avoids recursion stack overhead.

---

# Complexity Analysis

## Recursive Solution

* **Time Complexity:** **$O(n)$**
* **Auxiliary Space Complexity:** **$O(n)$**

(recursion stack)

---

## Iterative Solution

* **Time Complexity:** **$O(n)$**
* **Auxiliary Space Complexity:** **$O(1)$**

---

# 1-Based Indexing

Some interview problems number people from

```text id="p2vhv7"
1 to n
```

instead of

```text id="ptjlwm"
0 to n-1
```

In that case,

simply return

```python id="z2ujmy"
josephus(n, k) + 1
```

Example

```text id="cvb0e7"
0-based answer

2
```

becomes

```text id="90z0jw"
1-based answer

3
```

---

# Common Interview Questions

## Q1. What is the recurrence relation?

$$
J(n,k)=\left(J(n-1,k)+k\right)\bmod n
$$

---

## Q2. Why is the answer shifted by `k`?

After the first elimination,

the remaining people form the same problem,

but the numbering starts from the next person.

The modulo operation maps the shifted numbering back to the original circle.

---

## Q3. Which solution should I write?

Unless recursion is specifically requested,

prefer the **iterative solution** because it uses constant extra space.

---

## Q4. Can it be solved faster than $O(n)$?

For a general value of `k`, the standard solution is **$O(n)$**.

There are specialized optimizations for certain values (especially `k = 2`), but they are usually beyond the scope of typical coding interviews.

---

# Special Case: k = 2

When every **second person** is eliminated,

there is a direct mathematical solution.

Let

$$
n = 2^m + l
$$

where

$$
0 \le l < 2^m
$$

Then,

$$
\boxed{J(n,2)=2l}
$$

for **0-based indexing**.

For **1-based indexing**,

$$
\boxed{J(n,2)=2l+1}
$$

This formula is occasionally asked in advanced interviews but is **not expected** unless the interviewer specifically hints at it.

---

# Key Takeaways

* The Josephus problem is a classic recursion problem based on reducing the circle size by one after each elimination.
* Recurrence relation:

$$
J(1,k)=0
$$

$$
J(n,k)=\left(J(n-1,k)+k\right)\bmod n
$$

* Recursive solution:

```python id="mfrjqs"
def josephus(n, k):

    if n == 1:
        return 0

    return (josephus(n - 1, k) + k) % n
```

* Iterative solution:

```python id="htn8cr"
def josephus(n, k):

    ans = 0

    for i in range(2, n + 1):
        ans = (ans + k) % i

    return ans
```

| Method    | Time Complexity | Auxiliary Space |
| --------- | --------------- | --------------- |
| Recursive | **$O(n)$**      | **$O(n)$**      |
| Iterative | **$O(n)$**      | **$O(1)$**      |

> **Interview Tip:** The hardest part of the Josephus problem is **deriving the recurrence**, not writing the code. Once you remember the relation $$J(n,k)=(J(n-1,k)+k)\bmod n$$, both the recursive and iterative implementations become straightforward.
