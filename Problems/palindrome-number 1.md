---
Title: Palindrome number
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Rotate Matrix by 90° Anti-Clockwise

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def rotate_anticlockwise(matrix):
    n = len(matrix)

    # Step 1: Transpose in-place
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = (
                matrix[j][i],
                matrix[i][j]
            )

    # Step 2: Reverse every column
    for col in range(n):
        top = 0
        bottom = n - 1

        while top < bottom:
            matrix[top][col], matrix[bottom][col] = (
                matrix[bottom][col],
                matrix[top][col]
            )
            top += 1
            bottom -= 1

    return matrix

```
**Time complexity** - O($n^2$) 

**Aux. Space complexity** -  O(1)

---

# Rotate Matrix by 90° Anti-Clockwise

**Tags:** #Matrix #Array #2D-Array #InPlace #Transpose #Reverse #Matrix-Manipulation #LC48 #FAANG

## Problem Statement

Given an **`n × n` square matrix**, rotate it **90° anti-clockwise (counter-clockwise)** **in-place**.

**Example**

Input:

```text
1 2 3
4 5 6
7 8 9
```

Output:

```text
3 6 9
2 5 8
1 4 7
```

> **Constraint:** The matrix must be modified in-place using **`O(1)` auxiliary space**.

---

## Key Idea

A 90° anti-clockwise rotation can be decomposed into **two simple matrix operations**:

Rotate 90° Anti-Clockwise=Transpose+Reverse Every Column\text{Rotate 90° Anti-Clockwise} = \text{Transpose} + \text{Reverse Every Column}

This is the exact counterpart of clockwise rotation:

|Rotation|Operations|
|---|---|
|90° Clockwise|Transpose → Reverse each **row**|
|90° Anti-clockwise|Transpose → Reverse each **column**|

This relationship is one of the most important matrix interview patterns.

---

## Why Does This Work?

Consider the original matrix:

```text
1 2 3
4 5 6
7 8 9
```

### Step 1 — Transpose

Swap across the main diagonal:

```text
1 4 7
2 5 8
3 6 9
```

Rows became columns.

### Step 2 — Reverse Every Column

Reverse each vertical column:

```text
3 6 9
2 5 8
1 4 7
```

Exactly the required anti-clockwise rotation.

### Visual intuition

```text
Original
1 2 3
4 5 6
7 8 9

      │
      ▼  Transpose

1 4 7
2 5 8
3 6 9

      │
      ▼  Reverse Columns

3 6 9
2 5 8
1 4 7
```

The transpose changes the orientation, and reversing columns completes the rotation.

---

## Approach 1 — In-Place (Transpose + Reverse Columns)

### Algorithm

1. Transpose the square matrix.
    
2. Reverse every column.
    
3. Return the modified matrix.
    

### Python Solution

```python
def rotate_anticlockwise(matrix):
    n = len(matrix)

    # Step 1: Transpose in-place
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = (
                matrix[j][i],
                matrix[i][j]
            )

    # Step 2: Reverse every column
    for col in range(n):
        top = 0
        bottom = n - 1

        while top < bottom:
            matrix[top][col], matrix[bottom][col] = (
                matrix[bottom][col],
                matrix[top][col]
            )
            top += 1
            bottom -= 1

    return matrix
```

### Dry Run

Initial matrix:

```text
1 2 3
4 5 6
7 8 9
```

After transpose:

```text
1 4 7
2 5 8
3 6 9
```

Reverse **Column 0**

```text
1
2
3
```

↓

```text
3
2
1
```

Matrix becomes:

```text
3 4 7
2 5 8
1 6 9
```

Reverse **Column 1**

```text
4
5
6
```

↓

```text
6
5
4
```

Matrix:

```text
3 6 7
2 5 8
1 4 9
```

Reverse **Column 2**

```text
7
8
9
```

↓

```text
9
8
7
```

Final:

```text
3 6 9
2 5 8
1 4 7
```

### Complexity

**Time Complexity**

- Transpose: $O(n^2)$
    
- Reverse columns: $O(n^2)$
    

Overall:

O(n2)O(n^2)

**Auxiliary Space**

O(1)O(1)

**Output Space**

None — the input matrix is modified in-place.

---

## Approach 2 — Create a New Matrix

If in-place modification is **not required**, directly place every element into its rotated position.

### Position Mapping

For anti-clockwise rotation:

(i,j)→(n−1−j, i)(i, j) \rightarrow (n-1-j,\ i)

Example:

```text
matrix[0][2] = 3
```

goes to

```text
result[0][0] = 3
```

### Python Solution

```python
def rotate_anticlockwise(matrix):
    n = len(matrix)

    result = [[0] * n for _ in range(n)]

    for i in range(n):
        for j in range(n):
            result[n - 1 - j][i] = matrix[i][j]

    return result
```

### Why the Formula Works

Take the element `9`:

```text
Position = (2,2)
```

Using:

(n−1−j, i)(n-1-j,\ i)

we get:

```text
(3-1-2, 2)
= (0,2)
```

which is exactly where `9` appears after anti-clockwise rotation.

### Complexity

**Time Complexity**

O(n2)O(n^2)

**Auxiliary Space**

The new matrix stores every element:

O(n2)O(n^2)

**Output Space**

O(n2)O(n^2)

---

## Important Formulae

### Clockwise Rotation

(i,j)→(j,n−1−i)(i,j)\rightarrow(j,n-1-i)

Equivalent operations:

Transpose+Reverse Rows\text{Transpose} + \text{Reverse Rows}

### Anti-Clockwise Rotation

(i,j)→(n−1−j,i)(i,j)\rightarrow(n-1-j,i)

Equivalent operations:

Transpose+Reverse Columns\text{Transpose} + \text{Reverse Columns}

### Memory Shortcut

```text
Clockwise
Transpose
↓
Reverse Rows

Anti-clockwise
Transpose
↓
Reverse Columns
```

---

## Common Mistakes

### Mistake 1 — Reversing rows instead of columns

After transpose:

```text
1 4 7
2 5 8
3 6 9
```

If you reverse rows:

```text
7 4 1
8 5 2
9 6 3
```

This is **clockwise**, not anti-clockwise.

---

### Mistake 2 — Transposing the entire matrix twice

Incorrect:

```python
for i in range(n):
    for j in range(n):
        swap(...)
```

This swaps every pair twice.

Correct:

```python
for i in range(n):
    for j in range(i + 1, n):
```

Only traverse the upper triangle.

---

### Mistake 3 — Applying to a rectangular matrix

The in-place algorithm only works for **square matrices**.

A `2 × 3` matrix becomes `3 × 2`, so dimensions change and a new matrix is required.

---

## Pattern Recognition

### The Matrix Transformation Family

|Problem|Formula|Operations|
|---|---|---|
|Transpose|$(i,j)\rightarrow(j,i)$|Swap across diagonal|
|Rotate 90° CW|$(i,j)\rightarrow(j,n-1-i)$|Transpose + Reverse Rows|
|Rotate 90° CCW|$(i,j)\rightarrow(n-1-j,i)$|Transpose + Reverse Columns|

Instead of memorizing all three independently, remember **transpose** as the foundational operation.

### Interview Takeaway

Whenever you hear:

> **Rotate a square matrix by 90°**

Immediately think:

1. Is it **clockwise** or **anti-clockwise**?
    
2. Perform an **in-place transpose**.
    
3. Reverse **rows** (CW) or **columns** (CCW).
    

> **One-line memory hook:** Anti-clockwise = **Transpose → Reverse Columns**.