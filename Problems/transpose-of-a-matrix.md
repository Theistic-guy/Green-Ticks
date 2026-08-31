---
Title: Transpose of a Matrix
Companies:
  - Not Specified
Topics:
  - Matrix
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Transpose of a Matrix

**Pattern:** 

**Idea:** 

**Variations** : 
+ part of [Matrices Everywhere !!!](../Notes/Matrices%20Everywhere%20!!!.md)

---

## 💻 Code

General case : matrix can be non-square
```Python
def transpose(matrix):
    if not matrix:
        return []

    rows = len(matrix)
    cols = len(matrix[0])

    # Transposed matrix has:
    # rows = original number of columns
    # cols = original number of rows
    result = [[0] * rows for _ in range(cols)]

    for i in range(rows):
        for j in range(cols):
            result[j][i] = matrix[i][j]

    return result
```
**Time complexity** - O(mn)

**Aux. Space complexity** -  O(mn)

When matrix is square we can traverse the triangular part

```Python
def transpose_square(matrix):
    n = len(matrix)
    # Loop through the upper triangular part only
    for i in range(n):
        for j in range(i + 1, n):
            # Swap elements across the diagonal
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    return matrix

# Example usage:
square_mat = [,
 ,
    [7, 8, 9]
]
print("Square Transpose:")
print(transpose_square(square_mat))
# Output: [[1, 4, 7], [2, 5, 8], [3, 6, 9]]

```

---

# Transpose of a Matrix

Tags: #Matrix #Array #2D-Array #Transpose #InPlace #Two-Pointers #Matrix-Manipulation #Linear-Time #Space-Optimization #LC867 #LC48 #FAANG

## Problem Statement

The **transpose** of a matrix is obtained by converting every row into a column and every column into a row.

For a matrix `A`:

AT[i][j]=A[j][i]A^T[i][j] = A[j][i]

### Example

```text
A =
[
    [1, 2, 3],
    [4, 5, 6]
]
```

Transpose:

```text
Aᵀ =
[
    [1, 4],
    [2, 5],
    [3, 6]
]
```

So an $m \times n$ matrix becomes an $n \times m$ matrix.

---

## Key Idea

The defining relationship is:

```text
row i, column j
        ↓
row j, column i
```

or mathematically:

AT[i][j]=A[j][i]A^T[i][j] = A[j][i]

For a **general rectangular matrix**, the transpose changes the dimensions, so we normally create a new matrix.

For a **square matrix**, the dimensions remain the same, which allows an important optimization:

> Transpose the matrix **in-place** by swapping elements across the main diagonal.

---

# Approach 1 — Create a New Transposed Matrix

This is the most straightforward approach and the easiest to understand.

For every position `(i, j)` in the original matrix:

```python
result[j][i] = matrix[i][j]
```

### Intuition

Suppose:

```text
matrix =
[
    [1, 2, 3],
    [4, 5, 6]
]
```

Think of each element as moving across the diagonal:

```text
matrix[0][1] = 2
```

becomes:

```text
result[1][0] = 2
```

Similarly:

```text
matrix[1][2] = 6
```

becomes:

```text
result[2][1] = 6
```

So the operation is simply:

$$
(i,j)→(j,i)(i,j) \rightarrow (j,i)
$$

---

## Python Solution

```python
def transpose(matrix):
    if not matrix:
        return []

    rows = len(matrix)
    cols = len(matrix[0])

    # Transposed matrix has:
    # rows = original number of columns
    # cols = original number of rows
    result = [[0] * rows for _ in range(cols)]

    for i in range(rows):
        for j in range(cols):
            result[j][i] = matrix[i][j]

    return result
```

### Complexity

For an $m \times n$ matrix:

**Time Complexity**

Every element is visited exactly once:

O(mn)

**Auxiliary Space**

The new matrix contains $mn$ elements:

O(mn)

This is also the output itself.

**Output Space**

O(mn)

---

# Approach 2 — Pythonic `zip(*matrix)`

Python provides a very elegant way to transpose a matrix:

```python
def transpose(matrix):
    return [list(row) for row in zip(*matrix)]
```

### How `zip(*matrix)` Works

Given:

```text
matrix =
[
    [1, 2, 3],
    [4, 5, 6]
]
```

`*matrix` unpacks the rows:

```text
[1, 2, 3]
[4, 5, 6]
```

Then `zip()` groups elements by position:

```text
(1, 4)
(2, 5)
(3, 6)
```

Converting those tuples to lists gives:

```text
[
    [1, 4],
    [2, 5],
    [3, 6]
]
```

### Important Interview Note

This is excellent Python, but it hides the underlying matrix transformation.

For DSA interviews, understand the explicit nested-loop implementation first.

---

## Complexity

For an $m \times n$ matrix:

**Time Complexity**

O(mn)O(mn)

**Auxiliary Space**

The transposed matrix requires:

O(mn)O(mn)

**Output Space**

O(mn)O(mn)

The asymptotic complexity is the same as the explicit solution.

---

# Approach 3 — In-Place Transpose for a Square Matrix

This is the important optimization.

For a square matrix:

```text
n × n
```

we can transpose **without creating another matrix**.

### Core Idea

Elements symmetric about the main diagonal are swapped:

```text
(i, j) ↔ (j, i)
```

Example:

```text
[
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
```

Positions:

```text
(0,1) ↔ (1,0)
(0,2) ↔ (2,0)
(1,2) ↔ (2,1)
```

Result:

```text
[
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9]
]
```

---

## Why We Only Traverse One Triangle

If we swapped **every** pair `(i, j)` with `(j, i)`, we would undo our own work.

For example:

```text
swap (0,1) and (1,0)
```

transposes those two elements.

But later:

```text
swap (1,0) and (0,1)
```

would simply swap them back.

Therefore, process only one side of the main diagonal.

Usually:

```text
j > i
```

which means the **upper triangular portion**.

---

## Python Solution

```python
def transpose_in_place(matrix):
    n = len(matrix)

    for i in range(n):
        # Only visit elements above the main diagonal.
        for j in range(i + 1, n):
            # Swap symmetric elements:
            # matrix[i][j] ↔ matrix[j][i]
            matrix[i][j], matrix[j][i] = (
                matrix[j][i],
                matrix[i][j]
            )

    return matrix
```

---

## Dry Run

Consider:

```text
[
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
```

### `i = 0`

`j` starts at `1`.

Swap:

```text
(0,1) ↔ (1,0)
```

Matrix becomes:

```text
[
    [1, 4, 3],
    [2, 5, 6],
    [7, 8, 9]
]
```

Next:

```text
(0,2) ↔ (2,0)
```

Matrix:

```text
[
    [1, 4, 7],
    [2, 5, 6],
    [3, 8, 9]
]
```

### `i = 1`

`j` starts at `2`.

Swap:

```text
(1,2) ↔ (2,1)
```

Final:

```text
[
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9]
]
```

The diagonal:

```text
1, 5, 9
```

does not need to be touched because:

i=ji = j

and swapping an element with itself changes nothing.

---

## Complexity

For an $n \times n$ matrix:

**Time Complexity**

Only one triangular half is visited.

The number of swaps is:

n(n−1)2\frac{n(n-1)}{2}

Therefore:

O(n2)O(n^2)

**Auxiliary Space**

Only temporary variables for the swaps are needed:

O(1)O(1)

**Output Space**

There is no separate output matrix.

The input matrix itself is modified in-place.

---

# Important Distinction — Rectangular vs Square Matrix

This is one of the most important things to remember.

### Rectangular Matrix

Example:

```text
2 × 3
```

After transpose:

```text
3 × 2
```

So you cannot simply swap:

```text
matrix[i][j] ↔ matrix[j][i]
```

because the matrix's shape changes.

Use a **new matrix**.

### Square Matrix

Example:

```text
3 × 3
```

After transpose:

```text
3 × 3
```

The dimensions are unchanged, so in-place swapping across the diagonal works.

---

# Important Variation — Rotate Matrix 90° Clockwise

Transpose is especially important because it is one half of a classic matrix-rotation technique.

To rotate a square matrix $90^\circ$ clockwise:

### Step 1 — Transpose

```text
A → Aᵀ
```

### Step 2 — Reverse every row

```text
[
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9]
]
```

Reverse each row:

```text
[
    [7, 4, 1],
    [8, 5, 2],
    [9, 6, 3]
]
```

This is the solution to **LeetCode 48 — Rotate Image**.

The important relationship is:

$$
Rotate 90° clockwise=Transpose+Reverse each row\boxed{\text{Rotate 90° clockwise} = \text{Transpose} + \text{Reverse each row}}
$$

This is a very important matrix interview pattern.

---

# Important Variation — Rotate 90° Counterclockwise

A useful counterpart is:

Rotate 90° counterclockwise=Transpose+Reverse each column\boxed{\text{Rotate 90° counterclockwise} = \text{Transpose} + \text{Reverse each column}}

Alternatively, depending on the implementation, you can reverse the matrix vertically first and then transpose.

---

# Common Mistakes / Quirks

## Mistake 1 — Trying in-place transpose on a rectangular matrix

This:

```python
matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
```

only works safely for a **square matrix**.

For rectangular matrices, the dimensions change.

---

## Mistake 2 — Swapping both sides of the diagonal

Incorrect:

```python
for i in range(n):
    for j in range(n):
        swap(matrix[i][j], matrix[j][i])
```

This swaps every pair twice.

Correct:

```python
for i in range(n):
    for j in range(i + 1, n):
        swap(...)
```

---

## Mistake 3 — Starting `j` from `0`

For in-place transpose:

```python
for j in range(i + 1, n):
```

not:

```python
for j in range(n):
```

because we only want one triangular half.

---

## Mistake 4 — Forgetting the empty matrix case

This is unsafe:

```python
cols = len(matrix[0])
```

if:

```python
matrix = []
```

So handle:

```python
if not matrix:
    return []
```

first.

---

## Mistake 5 — Confusing transpose with rotation

Transpose:

```text
[
    [1, 2],
    [3, 4]
]

↓

[
    [1, 3],
    [2, 4]
]
```

Rotation is different.

For example, $90^\circ$ clockwise:

```text
[
    [1, 2],
    [3, 4]
]

↓

[
    [3, 1],
    [4, 2]
]
```

A transpose alone does **not** rotate the matrix.

---

# Pythonic Way

For a normal Python program, the shortest clean solution is:

```python
def transpose(matrix):
    return [list(row) for row in zip(*matrix)]
```

For a square matrix where **in-place modification matters**, use the diagonal-swap solution instead.

The Pythonic shortcut is convenient, but it should not replace understanding:

AT[i][j]=A[j][i]A^T[i][j] = A[j][i]

---

# Complexity Comparison

|Approach|Time Complexity|Auxiliary Space|Output Space|Works for Rectangular?|
|---|--:|--:|--:|---|
|New matrix|$O(mn)$|$O(mn)$|$O(mn)$|✅|
|`zip(*matrix)`|$O(mn)$|$O(mn)$|$O(mn)$|✅|
|In-place diagonal swap|$O(n^2)$|$O(1)$|$O(1)$|❌|

For the new-matrix approaches, the $O(mn)$ space is essentially unavoidable when the caller expects a separate transposed matrix.

For the in-place square-matrix approach, the matrix itself is the output, so there is no separate output allocation.

---

# Key Takeaways / Pattern Recognition

## Core Formula

The entire operation is captured by:

AT[i][j]=A[j][i]\boxed{A^T[i][j] = A[j][i]}

### If the matrix is rectangular

Think:

```text
(m × n)
   ↓
(n × m)
```

Create a new matrix.

### If the matrix is square

Think:

```text
swap across main diagonal
```

and only process one triangular half:

```python
for i in range(n):
    for j in range(i + 1, n):
```

### Bigger interview connection

Transpose is not just an isolated matrix operation.

It is a building block for:

```text
Transpose
    ↓
Rotate Image
    ↓
90° clockwise = transpose + reverse rows
```

It also reinforces a useful matrix idea:

> **The main diagonal divides a square matrix into symmetric pairs `(i,j)` and `(j,i)`.**

Once you recognize that symmetry, the in-place algorithm becomes almost immediate.

> **Memory hook:**  
> **Transpose = swap `(i,j)` with `(j,i)` across the main diagonal.**  
> **Rectangular → new matrix. Square → in-place diagonal swaps.**