---
Title: Equilibrium Point
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Equilibrium Point (DSA Interview Notes)

**Pattern:**  Prefix sum

**Idea:** maintain left sum and total sum and subtract the self element

---

## 💻 Code

```Python
def equilibrium(arr):

    total = sum(arr)

    left_sum = 0

    for i in range(len(arr)):

        right_sum = total - left_sum - arr[i]

        if left_sum == right_sum:
            return i

        left_sum += arr[i]

    return -1

```
**Time complexity** - O(n)
**Aux. Space complexity** -  O(1)

---
## Problem Statement

Given an array, find an index such that

# $$  
\boxed{  
\text{Sum of elements on the left}

\text{Sum of elements on the right}  
}  
$$

Such an index is called the **Equilibrium Point** (or **Pivot Index**).

If no such index exists, return `-1`.

---

# Example 1

```text
Input

[3, 4, 8, -9, 20, 6]
```

At index

```text
4
```

Left Sum

```text
3 + 4 + 8 + (-9) = 6
```

Right Sum

```text
6
```

Answer

```text
4
```

---

# Example 2

```text
Input

[4, 2, -2]
```

Index

```text
0
```

Left Sum

```text
0
```

Right Sum

```text
2 + (-2) = 0
```

Answer

```text
0
```

---

# Approach 1: Brute Force

For every index,

compute

- Left Sum
    
- Right Sum
    

If both are equal,

return the index.

---

## Python Code

```python
def equilibrium(arr):

    n = len(arr)

    for i in range(n):

        left = sum(arr[:i])

        right = sum(arr[i+1:])

        if left == right:
            return i

    return -1
```

---

## Complexity

- **Time Complexity:** **$O(n^2)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Approach 2: Prefix Sum (Optimal)

## Key Observation

Suppose we already know

```text
Total Sum
```

As we traverse the array,

maintain

```text
Left Sum
```

Then,

```text
Right Sum

=

Total Sum

-

Left Sum

-

Current Element
```

Now simply compare

```text
Left Sum

==

Right Sum
```

---

# Algorithm

### Step 1

Compute the total array sum.

### Step 2

Initialize

```text
left_sum = 0
```

### Step 3

For every element,

compute

```python
right_sum = total - left_sum - arr[i]
```

If

```python
left_sum == right_sum
```

return the index.

Otherwise,

update

```python
left_sum += arr[i]
```

---

# Python Code

```python
def equilibrium(arr):

    total = sum(arr)

    left_sum = 0

    for i in range(len(arr)):

        right_sum = total - left_sum - arr[i]

        if left_sum == right_sum:
            return i

        left_sum += arr[i]

    return -1
```

---

# Dry Run

```text
Array

[3,4,8,-9,20,6]
```

Total Sum

```text
32
```

|Index|Left Sum|Right Sum|Equal?|
|--:|--:|--:|:-:|
|0|0|29|❌|
|1|3|25|❌|
|2|7|17|❌|
|3|15|26|❌|
|4|6|6|✅|

Answer

```text
4
```

---

# Why Does This Work?

Instead of recomputing left and right sums for every index,

we maintain

- Total Sum (constant)
    
- Left Sum (updated while traversing)
    

The right sum is obtained instantly as

$$  
\boxed{  
Right = Total - Left - Current  
}  
$$

This eliminates repeated work and reduces the complexity to linear time.

---

# Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Variations

### 1. Find All Equilibrium Indices

Instead of returning the first equilibrium point,

return every valid index.

Simply continue the traversal after finding one.

---

### 2. Pivot Index (LeetCode 724)

Exactly the same problem.

Only the terminology changes.

---

### 3. Equilibrium Point with Negative Numbers

Negative values do **not** affect the algorithm.

The prefix sum approach works without modification.

---

### 4. Dynamic Equilibrium Queries

If the array changes frequently,

use advanced data structures like

- Segment Tree
    
- Fenwick Tree (Binary Indexed Tree)
    

to support updates efficiently.

---

# Pythonic Way

There is no built-in Python function that improves on the optimal solution.

The interview approach is already the cleanest and most efficient.

---

# Common Interview Mistakes

## Mistake 1

Updating

```python
left_sum
```

before checking equality.

Always compute the right sum and compare **before** adding the current element to the left sum.

---

## Mistake 2

Including the current element in both sums.

Remember,

the current element belongs to **neither** side.

---

## Mistake 3

Using nested loops.

This results in

$$  
O(n^2)  
$$

instead of

$$  
O(n)  
$$

---

# Related Interview Problems

|Problem|Technique|
|---|---|
|Equilibrium Point|Prefix Sum|
|Pivot Index (724)|Prefix Sum|
|Product Except Self|Prefix / Suffix Products|
|Trapping Rain Water|Prefix & Suffix Arrays|
|Range Sum Query|Prefix Sum|

---

# Complexity Summary

|Approach|Time|Aux. Space|
|---|---|---|
|Brute Force|**$O(n^2)$**|**$O(1)$**|
|Prefix Sum|**$O(n)$**|**$O(1)$**|

---

# Key Takeaways

- An equilibrium point satisfies
    

# $$  
\boxed{  
\text{Left Sum}

\text{Right Sum}  
}  
$$

- Maintain only two values:
    

```text
Total Sum

Left Sum
```

- Compute the right sum in constant time using
    

$$  
\boxed{  
Right = Total - Left - Current  
}  
$$

Core algorithm

```python
total = sum(arr)

left = 0

for i in range(len(arr)):

    right = total - left - arr[i]

    if left == right:
        return i

    left += arr[i]
```

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> **Interview Tip:** The phrase **"left sum equals right sum"** should immediately make you think of **Prefix Sums**. The optimization comes from realizing that once you know the **total sum**, the right sum can always be computed in constant time as `total - left_sum - current_element`.