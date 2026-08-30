---
Title: Spiral Traversal of a Matrix
Companies:
  - Not Specified
Topics:
  - Matrix
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Spiral Traversal of a Matrix

**Pattern:**  

**Idea:**  4 pointers top , bottom, left, right

**Variations** : 
+ part of [Matrices Everywhere !!!](../Notes/Matrices%20Everywhere%20!!!.md)

---

## 💻 Code

```Python
def spiralOrder(matrix):
    if not matrix:
        return []

    result = []

    top = 0
    bottom = len(matrix) - 1
    left = 0
    right = len(matrix[0]) - 1

    while top <= bottom and left <= right:

        # 1. Traverse the top row: left -> right
        for col in range(left, right + 1):
            result.append(matrix[top][col])

        # This row has now been completely processed.
        top += 1

        # 2. Traverse the right column: top -> bottom
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])

        # This column has now been completely processed.
        right -= 1

        # 3. Traverse the bottom row: right -> left
        #
        # The boundary checks are important because the matrix
        # may have only one remaining row.
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])

            bottom -= 1

        # 4. Traverse the left column: bottom -> top
        #
        # Again, check the remaining boundaries because the matrix
        # may have only one remaining column.
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])

            left += 1

    return result

```
**Time complexity** - O(rows * cols)

**Aux. Space complexity** -  O(1) , if we are printing , if output array then O(rows * cols)

---
# Spiral Traversal of a Matrix

Tags: #Matrix #Array #Two-Pointers #Simulation #Boundary-Traversal #Four-Pointers #Layered-Traversal #Traversal #In-place #LC54 #LeetCode #FAANG

## Problem Statement

Given an $m \times n$ matrix, return all of its elements in **spiral order**.

The traversal follows:

1. Left → Right across the top row
    
2. Top → Bottom down the right column
    
3. Right → Left across the bottom row
    
4. Bottom → Top up the left column
    

Then move inward and repeat.

### Example

```text
matrix =
[
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9, 10, 11, 12]
]
```

Spiral traversal:

```text
[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
```

This is **LeetCode 54 — Spiral Matrix**.

---

## Key Idea

The easiest way to think about spiral traversal is:

> **Repeatedly traverse the outermost layer, then move inward.**

For every layer, there are at most four boundaries:

```text
top
bottom
left
right
```

After traversing a boundary, move it inward.

```text
top    += 1
right  -= 1
bottom -= 1
left   += 1
```

This naturally leads to the **four-pointer boundary traversal** solution.

---

# Approach 1 — Boundary Traversal with Four Pointers

This is the cleanest and most important interview approach.

Maintain:

```text
top
bottom
left
right
```

representing the **remaining unvisited rectangle**.

Initially:

```text
top = 0
bottom = m - 1
left = 0
right = n - 1
```

For every layer:

```text
1. Traverse top row       → left → right
2. Traverse right column  → top → bottom
3. Traverse bottom row    → right → left
4. Traverse left column   → bottom → top
```

Then shrink the rectangle:

```text
top += 1
right -= 1
bottom -= 1
left += 1
```

---

## Intuition — The WHY

Consider:

```text
[
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9, 10, 11, 12],
    [13,14, 15,16]
]
```

Initially:

```text
top = 0
bottom = 3
left = 0
right = 3
```

### Traverse top

```text
1  2  3  4
→  →  →  →
```

Now the first row is finished:

```text
top += 1
```

### Traverse right

```text
4
8
12
16
↓
```

Now:

```text
right -= 1
```

### Traverse bottom

```text
16 ← 15 ← 14 ← 13
```

Now:

```text
bottom -= 1
```

### Traverse left

```text
13
9
5
↑
```

Now:

```text
left += 1
```

The remaining rectangle is:

```text
[
    [6,  7],
    [10, 11]
]
```

Repeat.

The key invariant is:

> At the start of every iteration, `top...bottom` and `left...right` represent exactly the unvisited portion of the matrix.

---

## Python Solution

```python
def spiralOrder(matrix):
    if not matrix:
        return []

    result = []

    top = 0
    bottom = len(matrix) - 1
    left = 0
    right = len(matrix[0]) - 1

    while top <= bottom and left <= right:

        # 1. Traverse the top row: left -> right
        for col in range(left, right + 1):
            result.append(matrix[top][col])

        # This row has now been completely processed.
        top += 1

        # 2. Traverse the right column: top -> bottom
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])

        # This column has now been completely processed.
        right -= 1

        # 3. Traverse the bottom row: right -> left
        #
        # The boundary checks are important because the matrix
        # may have only one remaining row.
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])

            bottom -= 1

        # 4. Traverse the left column: bottom -> top
        #
        # Again, check the remaining boundaries because the matrix
        # may have only one remaining column.
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])

            left += 1

    return result
```

---

## Why Are the Two `if` Checks Necessary?

This is one of the most common spiral traversal bugs.

Suppose:

```text
matrix =
[
    [1, 2, 3]
]
```

After traversing the top row:

```text
result = [1, 2, 3]
```

and:

```text
top = 1
bottom = 0
```

There is **no remaining bottom row**.

Without:

```python
if top <= bottom:
```

we might traverse an already-processed row again.

Similarly, for:

```text
[
    [1],
    [2],
    [3]
]
```

there is only one column. After traversing the right column, we must not traverse the left column again.

Hence:

```python
if left <= right:
```

---

## Dry Run

Consider:

```text
[
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9, 10, 11, 12]
]
```

Initial:

```text
top = 0
bottom = 2
left = 0
right = 3
```

### 1. Top row

```text
1 2 3 4
```

Result:

```text
[1, 2, 3, 4]
```

Update:

```text
top = 1
```

### 2. Right column

```text
8
12
```

Result:

```text
[1, 2, 3, 4, 8, 12]
```

Update:

```text
right = 2
```

### 3. Bottom row

```text
11 10 9
```

Result:

```text
[1, 2, 3, 4, 8, 12, 11, 10, 9]
```

Update:

```text
bottom = 1
```

### 4. Left column

```text
5
```

Result:

```text
[1, 2, 3, 4, 8, 12, 11, 10, 9, 5]
```

Update:

```text
left = 1
```

Remaining rectangle:

```text
[
    [6, 7],
    [10,11]
]
```

Repeat:

```text
6 7 11 10
```

Final:

```text
[1,2,3,4,8,12,11,10,9,5,6,7]
```

---

# Approach 2 — Direction Simulation

A more literal way to solve spiral traversal is to simulate movement.

Maintain:

```text
direction = right
```

and move:

```text
right → down → left → up → right → ...
```

When the next cell is:

- outside the matrix, or
    
- already visited,
    

turn clockwise.

---

## Python Solution

```python
def spiralOrder(matrix):
    if not matrix:
        return []

    m = len(matrix)
    n = len(matrix[0])

    visited = [[False] * n for _ in range(m)]

    # Directions:
    # right, down, left, up
    directions = [
        (0, 1),
        (1, 0),
        (0, -1),
        (-1, 0)
    ]

    result = []

    row = col = 0
    direction = 0

    for _ in range(m * n):
        result.append(matrix[row][col])
        visited[row][col] = True

        next_row = row + directions[direction][0]
        next_col = col + directions[direction][1]

        # If the next cell is outside the matrix or already visited,
        # rotate clockwise.
        if (
            next_row < 0 or next_row >= m or
            next_col < 0 or next_col >= n or
            visited[next_row][next_col]
        ):
            direction = (direction + 1) % 4

        row += directions[direction][0]
        col += directions[direction][1]

    return result
```

---

## Intuition

This approach directly models what you would do manually:

```text
→ → → ↓
        ↓
← ← ← ↑
↑
```

Once you hit a boundary or an already visited cell:

```text
turn clockwise
```

It is conceptually simple because it is pure **simulation**.

---

## Complexity

There are exactly:

m×nm \times n

cells.

Each cell is visited once.

Therefore:

O(mn)\boxed{O(mn)}

time.

The `visited` matrix requires:

O(mn)O(mn)

auxiliary space.

The output itself also contains:

O(mn)O(mn)

elements.

---

# Approach 3 — Layer-by-Layer Traversal

Another easy way to express the same idea is to explicitly iterate through layers.

For a matrix:

```text
m × n
```

the number of complete layers is approximately:

⌈min⁡(m,n)2⌉\left\lceil \frac{\min(m,n)}{2} \right\rceil

For every layer, calculate its:

```text
top
bottom
left
right
```

and traverse its four sides.

This is conceptually the same algorithm as the four-boundary solution; the difference is mostly in how the boundaries are represented.

The **four-pointer implementation is preferable** because the shrinking boundaries naturally control termination and avoid separate layer calculations.

---

# Comparing the Approaches

|Approach|Time|Auxiliary Space|Main Idea|
|---|--:|--:|---|
|Four-boundary pointers|**$O(mn)$**|**$O(1)$**|Shrink remaining rectangle|
|Direction simulation|$O(mn)$|$O(mn)$|Move + turn when blocked|
|Layer-by-layer|$O(mn)$|$O(1)$|Process each outer layer|

The **boundary traversal** is usually the best interview solution.

---

# Important Variations

## 1. Spiral Traversal Starting From Another Direction

The same boundary idea can be adapted.

For example, starting from bottom-left and moving:

```text
up → right → down → left
```

just changes the order in which boundaries are traversed and shrunk.

The underlying invariant remains:

> Maintain the boundaries of the unvisited rectangle.

---

## 2. Generate a Matrix in Spiral Order

The reverse problem is common:

> Given numbers from `1` to $m \times n$, fill an $m \times n$ matrix in spiral order.

The same four-boundary pattern is used, but instead of reading elements:

```python
result.append(matrix[top][col])
```

you write values:

```python
matrix[top][col] = value
```

This is a very direct transfer of the technique.

---

## 3. Spiral Matrix II — LC 59

**LeetCode 59 — Spiral Matrix II** asks you to create an $n \times n$ matrix filled with `1...n²` in spiral order.

It is essentially the same boundary-traversal algorithm in reverse:

```text
LC 54 → read matrix in spiral
LC 59 → write matrix in spiral
```

---

## Common Mistakes / Quirks

### Mistake 1 — Traversing an already-processed row or column

This is the biggest issue.

After:

```python
top += 1
right -= 1
bottom -= 1
left += 1
```

the remaining boundaries must still be valid.

That's why:

```python
if top <= bottom:
```

and:

```python
if left <= right:
```

are necessary.

---

### Mistake 2 — Using the wrong starting point for the bottom row

After traversing the right column:

```python
right -= 1
```

so the bottom row must traverse:

```python
range(right, left - 1, -1)
```

not from the old `right`.

Otherwise, the bottom-right element gets processed twice.

---

### Mistake 3 — Mixing boundary updates and traversal order

A useful mental model is:

```text
TOP    → traverse → shrink
RIGHT  → traverse → shrink
BOTTOM → traverse → shrink
LEFT   → traverse → shrink
```

Keeping that order consistent makes the implementation much easier to reason about.

---

### Mistake 4 — Assuming the matrix is square

A matrix can be:

```text
1 × n
m × 1
m × n
```

The algorithm must handle all three.

Do not write logic that assumes:

```python
len(matrix) == len(matrix[0])
```

---

## Pythonic Way

The direction-simulation solution can be made compact with `zip`, but that does not meaningfully improve the algorithm.

For interviews, the boundary version is both Pythonic enough and much clearer.

One useful Python detail is:

```python
if not matrix:
    return []
```

This handles an empty matrix before accessing:

```python
matrix[0]
```

---

# Complexity

For an $m \times n$ matrix:

### Time

Every element is processed exactly once:

O(mn)\boxed{O(mn)}

### Auxiliary Space — Boundary Approach

Only four pointers and a few variables are maintained:

O(1)\boxed{O(1)}

excluding the output.

The output contains all $mn$ elements:

O(mn)O(mn)

Therefore, including output:

O(mn)\boxed{O(mn)}

### Direction-Simulation Approach

The `visited` matrix requires:

O(mn)O(mn)

auxiliary space, in addition to the output.

---

# Key Takeaways / Pattern Recognition

## The Core Pattern

When traversing a matrix in a spiral:

```text
        top
   ┌─────────────┐
left│             │right
   │             │
   │             │
   └─────────────┘
       bottom
```

maintain four boundaries:

```python
top
bottom
left
right
```

and repeatedly:

```text
→ top row
↓ right column
← bottom row
↑ left column
```

then shrink:

```text
top    += 1
right  -= 1
bottom -= 1
left   += 1
```

## Most Important Invariant

> **`[top..bottom] × [left..right]` is the unvisited region of the matrix.**

This invariant is more important than memorizing the code.

If you can maintain that invariant, the implementation naturally follows.

## Interview Preference

For **spiral matrix problems**, think in this order:

```text
Need spiral traversal?
        ↓
Can I represent the unvisited region
with four boundaries?
        ↓
YES → top / bottom / left / right
        ↓
Traverse four sides
        ↓
Shrink boundaries
        ↓
Check degenerate row/column cases
```

The direction-simulation method is useful to know because it is a general **matrix simulation** technique, but the four-pointer boundary approach is usually the cleaner and more space-efficient solution.

> **Memory hook:**  
> **Spiral Matrix = shrink a rectangle from four sides.**