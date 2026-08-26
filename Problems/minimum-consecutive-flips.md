---
Title: Minimum Consecutive Flips
Companies:
  - Not Specified
Topics:
  - Arrays
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
  - Flips
  - Minimum
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Minimum Consecutive Flips (DSA Interview Notes)

**Pattern:** 

**Idea:** 

---

## 💻 Code

```Python
def minimum_flips(arr):

    n = len(arr)

    for i in range(1, n):

        if arr[i] != arr[i - 1]:

            if arr[i] != arr[0]:
                print(f"From {i} to ", end="")
            else:
                print(i - 1)

    if arr[-1] != arr[0]:
        print(n - 1)

```
**Time complexity** - O(n)
**Aux. Space complexity** -  O(1)

---


## Problem Statement

Given a binary array consisting of only **0s** and **1s**, determine the **minimum number of consecutive group flips** required to make all elements the same.

In one operation, you can flip an **entire consecutive group** of either `0`s or `1`s.

---

# Example 1

```text
Input

[1, 1, 0, 0, 0, 1]
```

Flip

```text
0 0 0
```

Result

```text
[1, 1, 1, 1, 1, 1]
```

Only **one flip** is required.

---

# Example 2

```text
Input

[1, 0, 0, 1, 1, 0, 0, 1]
```

Groups

```text
11

00

11

00

1
```

We can either

- Flip both groups of `0`s
    
- Flip all three groups of `1`s
    

Minimum flips

```text
2
```

---

# Naive Approach

Count

- Number of groups of `0`s
    
- Number of groups of `1`s
    

Flip whichever has fewer groups.

Although correct, it requires two passes (or extra counting logic).

---

# Key Observation

Notice that consecutive equal values form **groups**.

Example

```text
1 1 0 0 0 1 1 0
```

Groups

```text
11

000

11

0
```

The minimum number of flips is simply

> **Flip the groups that occur fewer times.**

The challenge is identifying those groups efficiently.

---

# The Clever Observation

Suppose the first element is

```text
1
```

Every time we encounter

a **new group** has started.

Now ask:

Did the new group start with

- the same value as the first element?
    
- or the opposite value?
    

If it is the **opposite value**, that group is a candidate to flip.

---

# Why Does This Work?

Suppose

```text
1 1 0 0 1 1 0
```

The first element is

```text
1
```

Whenever a new group begins,

```text
Index 2

0 starts
```

This group differs from the first group.

Print

```text
Start at 2
```

Later,

```text
Index 4

1 starts
```

This is the original value again.

The previous group ends.

Print

```text
End at 3
```

Continue similarly.

---

# Interview Trick

Instead of explicitly counting groups,

we simply print the start and end indices of groups whose value differs from the first element.

This automatically produces the minimum set of flips.

---

# Algorithm

Traverse the array.

Whenever

```python
arr[i] != arr[i - 1]
```

a new group begins.

### Case 1

If

```python
arr[i] != arr[0]
```

Print

```text
Start from i
```

---

### Case 2

Otherwise,

print

```text
End at i - 1
```

Finally,

if the last group is different from the first,

print its ending index.

---

# Python Code

```python
def minimum_flips(arr):

    n = len(arr)

    for i in range(1, n):

        if arr[i] != arr[i - 1]:

            if arr[i] != arr[0]:
                print(f"From {i} to ", end="")
            else:
                print(i - 1)

    if arr[-1] != arr[0]:
        print(n - 1)
```

---

# Dry Run

```text
Array

[1,1,0,0,0,1,1,0,0,1]
```

The first element is

```text
1
```

Traverse the array.

|Index|Value|Action|
|--:|--:|---|
|2|0|Start flip|
|5|1|End flip|
|7|0|Start flip|
|9|1|End flip|

Output

```text
From 2 to 4

From 7 to 8
```

Exactly two flips.

---

# Why Don't We Count Groups Explicitly?

Suppose

```text
1 1 0 0 1 1 0
```

Groups

```text
11

00

11

0
```

The groups that differ from the first element are exactly

```text
00

0
```

Printing only these groups automatically gives the minimum solution.

No explicit counting is required.

---

# Complexity Analysis

The array is traversed only once.

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Questions

## Q1. Why do we compare with the first element?

Because all groups having the first element's value are left unchanged.

Every other group becomes a flip candidate.

This guarantees the minimum number of flips.

---

## Q2. Why does the algorithm print ranges instead of flipping?

Actually performing the flips is unnecessary.

The interviewer usually wants the **minimum operations**.

Printing the ranges completely specifies those operations.

---

## Q3. What if we wanted to flip the other value instead?

That also works.

You would simply print the groups equal to the first element instead.

Both approaches are valid; this one is just simpler.

---

# Pythonic Way

If the interviewer only asks for the **ranges** and not the in-place flips, there isn't a significantly shorter built-in approach.

The standard one-pass solution is already the most Pythonic and optimal.

If you really wanted to identify group boundaries, you could use `itertools.groupby`, but it is longer and less interview-friendly.

---

# Related Interview Problems

This problem teaches an important interview pattern:

- Detecting **group boundaries**
    
- Processing **runs of consecutive equal elements**
    

The same idea appears in:

- Run Length Encoding (RLE)
    
- Count Binary Substrings (LeetCode 696)
    
- String Compression
    
- Grouping Consecutive Characters
    
- Interval Merging (conceptually)
    

---

# Key Takeaways

- Consecutive equal values form **groups**.
    
- The minimum solution is to flip the groups that differ from the **first group's value**.
    
- Every time
    

```python
arr[i] != arr[i - 1]
```

a new group begins.

- If the new group's value differs from the first element, print the **starting index**.
    
- When the original value returns, print the **ending index**.
    

Final algorithm:

```python
for i in range(1, len(arr)):

    if arr[i] != arr[i - 1]:

        if arr[i] != arr[0]:
            print(f"From {i} to ", end="")
        else:
            print(i - 1)

if arr[-1] != arr[0]:
    print(len(arr) - 1)
```

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> **Interview Tip:** The insight isn't about flipping bits—it's about **detecting group boundaries**. Once you realize that every transition (`0→1` or `1→0`) marks a new group, the problem reduces to printing the groups that differ from the first one, yielding the minimum number of flips in a single traversal.