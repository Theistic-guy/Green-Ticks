---
Title: Find a peak element in 2D matrix
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
  - Matrix
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - Binary Search
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Find a Peak Element in a 2D Matrix

**Pattern:** Binary  Search

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def find_peak_grid(mat):

    rows = len(mat)
    cols = len(mat[0])

    left = 0
    right = cols - 1

    while left <= right:

        mid_col = (left + right) // 2

        # Find maximum element in this column
        max_row = 0

        for r in range(1, rows):
            if mat[r][mid_col] > mat[max_row][mid_col]:
                max_row = r

        current = mat[max_row][mid_col]

        left_val = mat[max_row][mid_col - 1] if mid_col > 0 else float("-inf")
        right_val = mat[max_row][mid_col + 1] if mid_col < cols - 1 else float("-inf")

        if current > left_val and current > right_val:
            return max_row, mid_col

        if left_val > current:
            right = mid_col - 1
        else:
            left = mid_col + 1

    return -1, -1

```
**Time complexity** - O(RlogC or ClogR)
**Aux. Space complexity** -  O(1)

---


A natural extension of the **1D Peak Element** problem.

Given a matrix, find an element that is greater than all of its valid neighboring elements.

For a cell `(i, j)`, its neighbors are typically:

- Left
    
- Right
    
- Up
    
- Down
    

Diagonal elements are not considered.

---

# Example

```text
10   8   10
14   13  12
15   9   11
```

`15` is a peak because:

```text
15 > 14
15 > 9
```

and it has no neighbor below it.

We only need to return **any** peak.

---

# Why Can't We Directly Apply the 1D Logic?

In 1D, we only need to compare:

```text
arr[mid]
arr[mid + 1]
```

because there are only two directions:

```text
←  mid  →
```

In 2D, a cell has **four directions**:

```text
       Up
        ↑
Left ← cell → Right
        ↓
      Down
```

So simply comparing one cell with one neighboring cell is not enough to determine which direction contains a peak.

This is where the important 2D trick comes in.

---

# Key Idea: Binary Search on Columns

Suppose the matrix has:

```text
R rows
C columns
```

Instead of choosing a single cell as `mid`, choose a **middle column**.

Then find the **maximum element in that entire column**.

For example:

```text
        middle column
              ↓

  10   8   10
  14  13   12
  15   9   11
```

The maximum of column `1` is:

```text
13
```

Now we only need to compare `13` with its **left and right neighbors**.

---

# The Crucial Question

You might ask:

> **Why are we finding the maximum in one dimension first?**

This is the most important part of the algorithm.

Suppose we choose column `j` and find its maximum element:

```text
        j
        ↓

  ...
  ...
  X
  ...
  ...
```

Because `X` is the **maximum of the entire column**:

$$  
X \ge \text{every element above/below it}  
$$

Therefore, `X` is **automatically greater than or equal to its vertical neighbors**.

So we don't need to worry about:

```text
Up
Down
```

anymore.

The only possible way for `X` to **not** be a peak is if one of its horizontal neighbors is larger:

```text
Left > X
```

or

```text
Right > X
```

This reduces the 2D problem to essentially the same slope logic we used in 1D.

---

# The Beautiful Reduction

### 1D

We look at:

```text
arr[mid] vs arr[mid + 1]
```

and decide:

```text
Peak must be left/right
```

### 2D

We first choose a column and find:

```text
maximum element in that column
```

This eliminates the **vertical dimension**.

Then we look at:

```text
left neighbor vs column maximum vs right neighbor
```

and decide:

```text
Peak must be left/right
```

So conceptually:

```text
2D problem

      ↓

Find maximum along one dimension

      ↓

Reduce problem to 1D direction

      ↓

Binary search along the other dimension
```

That is the core insight.

---

# Algorithm

Suppose we binary-search over columns.

### Step 1

Take the middle column:

```python
mid_col = (left + right) // 2
```

### Step 2

Find the row containing the maximum element in that column.

### Step 3

Let that element be `matrix[max_row][mid_col]`.

Compare it with its left and right neighbors.

### Step 4

If it is greater than both:

```text
Peak found.
```

### Step 5

If the left neighbor is larger:

```text
Search left columns.
```

### Step 6

If the right neighbor is larger:

```text
Search right columns.
```

---

# Why Can We Safely Discard Half?

Suppose:

```text
left neighbor > current
```

We know that the current cell is not a peak.

But more importantly, the left side **must contain a peak**.

Why?

Starting from the current cell, move toward the larger left neighbor.

If the values continue increasing, eventually we either:

1. Reach a cell that is greater than its neighbors → peak.
    
2. Reach the boundary → boundary cell can be a peak.
    

Therefore, there is guaranteed to be a peak somewhere on the left.

This is the exact same **slope argument** used in 1D.

---

# Python Code

```python
def find_peak_grid(mat):

    rows = len(mat)
    cols = len(mat[0])

    left = 0
    right = cols - 1

    while left <= right:

        mid_col = (left + right) // 2

        # Find maximum element in this column
        max_row = 0

        for r in range(1, rows):
            if mat[r][mid_col] > mat[max_row][mid_col]:
                max_row = r

        current = mat[max_row][mid_col]

        left_val = mat[max_row][mid_col - 1] if mid_col > 0 else float("-inf")
        right_val = mat[max_row][mid_col + 1] if mid_col < cols - 1 else float("-inf")

        if current > left_val and current > right_val:
            return max_row, mid_col

        if left_val > current:
            right = mid_col - 1
        else:
            left = mid_col + 1

    return -1, -1
```

---

# Dry Run

Consider:

```text
10   8   10
14   13  12
15   9   11
```

Initially:

```text
left = 0
right = 2
```

Middle column:

```text
mid_col = 1
```

Column:

```text
8
13
9
```

Maximum:

```text
13
```

So:

```text
max_row = 1
mid_col = 1
```

Compare horizontal neighbors:

```text
8 < 13 > 12
```

Therefore:

```text
13
```

is a peak.

Return:

```text
row = 1
column = 1
```

---

# Complexity

Suppose the matrix is:

```text
R × C
```

For every binary-search step, we scan one entire column:

$$  
O(R)  
$$

The number of column searches is:

$$  
O(\log C)  
$$

Therefore:

$$  
\boxed{  
O(R\log C)  
}  
$$

time.

Auxiliary space:

$$  
\boxed{  
O(1)  
}  
$$

---

# But Why Isn't It $O(\log R \log C)$?

This is an important distinction.

In 1D, checking the middle element costs:

$$  
O(1)  
$$

So:

# $$  
O(1)\times O(\log n)

O(\log n)  
$$

In 2D, when we choose a middle **column**, we cannot inspect just one element.

We need to know which element is the **maximum in that column**.

That requires scanning:

$$  
O(R)  
$$

elements.

Therefore:

# $$  
O(R)\times O(\log C)

O(R\log C)  
$$

The "extra" linear factor comes from finding the column maximum.

---

# Why Not Binary Search Within the Column Too?

This is the natural question.

We cannot simply binary-search vertically because the column is **not necessarily sorted**.

For example:

```text
10
50
20
80
30
```

There is no monotonic ordering that allows ordinary Binary Search.

Therefore, to guarantee that we find the largest element in the selected column, we must scan it:

$$  
O(R)  
$$

---

# Could We Search Rows Instead?

Absolutely.

Instead of:

```text
Binary Search → columns
Maximum       → rows
```

we can do:

```text
Binary Search → rows
Maximum       → columns
```

Then the complexity becomes:

$$  
\boxed{  
O(C\log R)  
}  
$$

So choose the smaller dimension for the **linear scan** when useful.

For example, if:

```text
R >> C
```

binary-searching rows gives:

$$  
O(C\log R)  
$$

which can be preferable to:

$$  
O(R\log C)  
$$

---

# Important Practical Interview Insight

For an `R × C` matrix:

### Binary Search Columns

```text
Find max in column → O(R)

Binary search columns → O(log C)

Total → O(R log C)
```

### Binary Search Rows

```text
Find max in row → O(C)

Binary search rows → O(log R)

Total → O(C log R)
```

So you can choose whichever orientation gives the better complexity.

---

# Comparison With 1D Peak

|1D|2D|
|---|---|---|
|Search space|Elements|Rows/columns|
|Middle choice|Middle element|Middle column/row|
|Extra work|None|Find maximum along chosen dimension|
|Decision|Compare neighbors|Compare horizontal/vertical neighbors|
|Complexity|**$O(\log N)$**|**$O(R\log C)$** or **$O(C\log R)$**|
|Aux. Space|**$O(1)$**|**$O(1)$**|

---

# Important FAANG Variation

### Find Peak Element II — LeetCode 1901

This is essentially this exact problem.

The important interview expectation is not memorizing the code.

You should be able to explain:

> "I'll binary-search over columns. For the middle column, I'll find its maximum element. Since it is the maximum of the column, it is already at least as large as its vertical neighbors. Therefore I only need to compare its left and right neighbors. If the left neighbor is larger, a peak must exist on the left; if the right neighbor is larger, a peak must exist on the right."

That explanation demonstrates the actual insight.

---

# Common Mistakes

### 1. Checking only the middle cell

Finding:

```text
matrix[mid_row][mid_col]
```

doesn't work because you haven't eliminated the vertical dimension.

You need the **maximum of the selected column**.

---

### 2. Finding the global maximum

You could scan the entire matrix and find the maximum, which is certainly a peak.

But that takes:

$$  
O(RC)  
$$

and completely defeats the purpose of the problem.

---

### 3. Trying Binary Search Vertically

The selected column isn't necessarily sorted.

So you cannot binary-search for its maximum.

You need the linear scan.

---

### 4. Forgetting Boundary Neighbors

A cell on the first/last column has only one horizontal neighbor.

Treat the missing neighbor as:

$$  
-\infty  
$$

The same boundary idea used in the 1D peak problem applies here.

---

# Key Takeaways

The central insight is:

> **Find the maximum in one dimension so that dimension becomes automatically safe. Then use Binary Search in the other dimension.**

For column-wise search:

```text
Choose middle column

        ↓

Find maximum element in that column

        ↓

Vertical neighbors are automatically handled

        ↓

Compare left/right neighbors

        ↓

Peak?
  ↙     ↘
Yes    Search the larger side
```

Complexity:

$$  
\boxed{  
O(R\log C)  
}  
$$

or, by searching rows:

$$  
\boxed{  
O(C\log R)  
}  
$$

Auxiliary space:

$$  
\boxed{  
O(1)  
}  
$$

> **Interview Tip:** The most important thing to understand is **why the column maximum is necessary**. In 1D, the single `mid` element already represents the entire search position. In 2D, choosing a column leaves an entire vertical dimension unresolved. Taking the maximum collapses that dimension: the chosen cell is guaranteed to beat its vertical neighbors, leaving only the horizontal direction for the Binary Search decision.