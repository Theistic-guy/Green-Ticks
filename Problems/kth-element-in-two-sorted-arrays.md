---
Title: Kth element in two sorted arrays
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
  - Two Pointers
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - Binary Search
  - kth
  - Sorted
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Kth Element in Two Sorted Arrays

**Pattern:**  Binary Search

**Idea:** 

**Variations** :  Derived from [median-of-two-sorted-arrays](median-of-two-sorted-arrays.md)

---

## 💻 Code

```Python
def kth_element(A, B, k):
    # Binary-search the smaller array
    if len(A) > len(B):
        A, B = B, A

    m, n = len(A), len(B)

    # Number of elements taken from A. See Explanation below
    low = max(0, k - n)
    high = min(k, m)

    while low <= high:

        i = (low + high) // 2
        j = k - i

        A_left = A[i - 1] if i > 0 else float("-inf")
        A_right = A[i] if i < m else float("inf")

        B_left = B[j - 1] if j > 0 else float("-inf")
        B_right = B[j] if j < n else float("inf")

        # Correct partition
        if A_left <= B_right and B_left <= A_right:
            return max(A_left, B_left)

        # Too many elements taken from A
        elif A_left > B_right:
            high = i - 1

        # Too few elements taken from A
        else:
            low = i + 1

    raise ValueError("Invalid input")
```
**Time complexity** - O(log(min(m,n))) 
**Aux. Space complexity** -  O(1)
📝 [Explanation of low and high initialization in 'kth element in two sorted arrays'](../Notes/Extras/Explanation%20of%20low%20and%20high%20initialization%20in%20'kth%20element%20in%20two%20sorted%20arrays'.md)

---


> **Prerequisite:** Median of Two Sorted Arrays  
> This is essentially the **same partition technique**, generalized from "left half contains half the elements" to "left half contains exactly `k` elements."

---

## 1. Problem

Given two sorted arrays, find the **k-th smallest element** in their combined sorted order.

Example:

```text
A = [2, 3, 6, 7, 9]
B = [1, 4, 8, 10]

k = 5
```

If merged:

```text
[1, 2, 3, 4, 6, 7, 8, 9, 10]
             ↑
            5th
```

Answer:

```text
6
```

We want to find it **without actually merging** the arrays.

---

# 2. Connection to Median of Two Sorted Arrays

Since you already know the median problem, think of this as the same idea:

### Median

We partition such that:

```text
number of elements on left ≈ (m + n) / 2
```

### Kth Element

We partition such that:

```text
number of elements on left = k
```

That's the main conceptual change.

---

# 3. Partition Idea

Suppose we take:

```text
i elements from A
```

Then we must take:

```text
j = k - i
```

elements from `B`.

So:

```text
A: [ ... i elements ... | ... ]
B: [ ... j elements ... | ... ]
```

The left side contains:

```text
i + j = k
```

elements.

Therefore, if the partition is correct, the largest element on the left is the **k-th smallest element**.

---

# 4. What Makes a Partition Correct?

Because both arrays are individually sorted, we only need to check the elements immediately around the partition.

```text
A: [ A_left | A_right ]
B: [ B_left | B_right ]
```

A valid partition requires:

```text
A_left <= B_right
```

and

```text
B_left <= A_right
```

Why?

We already know:

```text
A-left elements <= A_left
B-left elements <= B_left
```

and similarly for the right sides.

Therefore these two cross-boundary comparisons guarantee that:

```text
EVERYTHING ON LEFT <= EVERYTHING ON RIGHT
```

---

# 5. Once the Partition Is Correct

The left side contains exactly `k` elements:

```text
        k elements
             ↓
A: [........ | ........]
B: [........ | ........]
```

Therefore the k-th smallest element is simply:

```python
max(A_left, B_left)
```

because it is the largest element among those first `k` elements.

---

# 6. Example

```text
A = [2, 3, 6, 7, 9]
B = [1, 4, 8, 10]

k = 5
```

Suppose we try:

```text
i = 3
```

Then:

```text
j = k - i
  = 5 - 3
  = 2
```

Partition:

```text
A: [2, 3, 6 | 7, 9]
B: [1, 4    | 8, 10]
```

Check the boundaries:

```text
A_left  = 6
A_right = 7

B_left  = 4
B_right = 8
```

Check:

```text
A_left <= B_right
6 <= 8 ✓

B_left <= A_right
4 <= 7 ✓
```

Therefore the partition is valid.

The left side contains:

```text
[2, 3, 6, 1, 4]
```

exactly 5 elements.

Largest element:

```text
max(6, 4) = 6
```

Therefore:

```text
5th smallest = 6
```

---

# 7. How Does Binary Search Find `i`?

We binary-search the number of elements taken from `A`.

There are only two ways our partition can be wrong.

### Case 1 — Took Too Many From A

If:

```text
A_left > B_right
```

then an element from `A` that is currently on the left should actually be on the right.

So we need:

```text
fewer elements from A
```

Move left:

```python
high = i - 1
```

---

### Case 2 — Took Too Few From A

If:

```text
B_left > A_right
```

then an element from `B` that is currently on the left should actually be on the right.

Therefore we need:

```text
more elements from A
```

Move right:

```python
low = i + 1
```

---

# 8. The Binary Search Logic

```text
A_left > B_right
        ↓
Too many from A
        ↓
Move i LEFT


B_left > A_right
        ↓
Too few from A
        ↓
Move i RIGHT


Both conditions satisfied
        ↓
Correct partition
        ↓
answer = max(A_left, B_left)
```

This is exactly the same reasoning as Median of Two Sorted Arrays.

---

# 9. Complete Python Code

```python
def kth_element(A, B, k):
    # Binary-search the smaller array
    if len(A) > len(B):
        A, B = B, A

    m, n = len(A), len(B)

    # Number of elements taken from A
    low = max(0, k - n)
    high = min(k, m)

    while low <= high:

        i = (low + high) // 2
        j = k - i

        A_left = A[i - 1] if i > 0 else float("-inf")
        A_right = A[i] if i < m else float("inf")

        B_left = B[j - 1] if j > 0 else float("-inf")
        B_right = B[j] if j < n else float("inf")

        # Correct partition
        if A_left <= B_right and B_left <= A_right:
            return max(A_left, B_left)

        # Too many elements taken from A
        elif A_left > B_right:
            high = i - 1

        # Too few elements taken from A
        else:
            low = i + 1

    raise ValueError("Invalid input")
```

---

# 10. Why Search the Smaller Array?

Suppose:

```text
m = len(A)
n = len(B)
```

We binary-search `A`.

To guarantee the smaller search space:

```python
if len(A) > len(B):
    A, B = B, A
```

Then:

```text
m <= n
```

Therefore:

```text
Time = O(log(min(m, n)))
```

and:

```text
Auxiliary Space = O(1)
```

---

# 11. Why Is the Search Range Not Simply `0 ... m`?

Because:

```text
i + j = k
```

and:

```text
j = k - i
```

We must have:

```text
0 <= i <= m
0 <= j <= n
```

From:

```text
0 <= k - i <= n
```

we get:

```text
k - n <= i <= k
```

Combining both constraints:

```python
low = max(0, k - n)
high = min(k, m)
```

This gives only **valid partitions**.

---

# 12. Boundary Cases

The partition can occur at either end of an array.

### `i == 0`

No elements from `A` are on the left:

```text
A: [ | 2 3 4 ]
```

So:

```python
A_left = -inf
```

### `i == m`

All elements from `A` are on the left:

```text
A: [ 2 3 4 | ]
```

So:

```python
A_right = inf
```

Same logic applies to `B`.

This allows the same partition conditions to work without special branching.

---

# 13. Complexity

Let:

```text
m = len(A)
n = len(B)
```

### Time

```text
O(log(min(m, n)))
```

### Auxiliary Space

```text
O(1)
```

We never construct the merged array.

---

# 14. Why Not Just Merge?

The straightforward solution is:

```python
merged = sorted(A + B)
return merged[k - 1]
```

or merge the two sorted arrays in linear time.

That gives:

```text
O(m + n)
```

The partition approach improves this to:

```text
O(log(min(m, n)))
```

The important interview point is:

> **The sorted structure of the input lets us locate the k-th element without examining every element.**

---

# 15. The Most Important Mental Model

Don't memorize four variables like:

```text
A_left
A_right
B_left
B_right
```

Instead visualize:

```text
A: [ LEFT | RIGHT ]
B: [ LEFT | RIGHT ]
          ↑
     exactly k elements
```

We are looking for a partition where:

```text
everything on LEFT <= everything on RIGHT
```

Since each array is already sorted, only the **four boundary values** need to be compared.

Once that partition is found:

```text
k-th element
    =
largest element on LEFT
```

---

# 16. Relationship to Median of Two Sorted Arrays

This is the most useful long-term connection:

```text
        Two Sorted Arrays
                │
                ↓
         Binary Partition
                │
       ┌────────┴────────┐
       ↓                 ↓
    Median            Kth Element
       │                 │
left has ~half       left has k
elements             elements
```

So don't learn this as another isolated binary-search trick.

Think:

> **Median of Two Sorted Arrays is essentially a special case of the general k-th-element partition problem.**

---

# Interview Takeaways

### Core invariant

```text
i + j = k
```

### Valid partition

```text
A_left <= B_right
B_left <= A_right
```

### Answer

```text
max(A_left, B_left)
```

### Direction

```text
A_left > B_right
→ move left

B_left > A_right
→ move right
```

### Complexity

```text
O(log(min(m, n))) time
O(1) auxiliary space
```

### Long-term insight

> **When two sorted sequences are involved, don't automatically merge them. Ask whether the desired answer can be characterized by a partition. If you can force exactly `k` elements to the left and validate the partition using boundary elements, binary search can reduce a linear merge to logarithmic time.**


[^1] sdf