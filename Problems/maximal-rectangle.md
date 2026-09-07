---
Title: Maximal Rectangle (Leetcode 85)
Companies:
  - Not Specified
Topics:
  - Matrix
  - Stack
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Monotonic Stack
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Maximal Rectangle (Leetcode 85)

**Pattern:** 

**Idea:** 

**Variations** : 
+ 1D version - [largest-rectangle-in-histogram](largest-rectangle-in-histogram.md)


---

## 💻 Code

```Python
def largestRectangleArea(heights):
    stack = []
    best = 0

    heights.append(0)

    for i, h in enumerate(heights):

        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            left = stack[-1] if stack else -1
            width = i - left - 1
            best = max(best, height * width)

        stack.append(i)

    heights.pop()
    return best


def maximalRectangle(matrix):
    if not matrix:
        return 0

    rows = len(matrix)
    cols = len(matrix[0])

    heights = [0] * cols
    ans = 0

    for r in range(rows):

        for c in range(cols):
            if matrix[r][c] == "1":
                heights[c] += 1
            else:
                heights[c] = 0

        ans = max(ans, largestRectangleArea(heights))

    return ans
```
**Time complexity** - O(R * C ) 

**Aux. Space complexity** -  O(C)

---

# Maximal Rectangle (Leetcode 85)

**Tags:** #Stack #MonotonicStack #Histogram #Matrix #DynamicProgramming #LargestRectangle #2D #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given an `m × n` binary matrix filled with `'0'` and `'1'`, return the **area of the largest rectangle containing only `1`s**.

**Example**

```text
1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0
```

**Output:** `6`

The largest rectangle has area **6** (2 rows × 3 columns).

---

## Key Idea

Treat **every row as the base of a histogram**.

For each row:

1. Build a histogram of consecutive `1`s vertically.
    
2. Solve **Largest Rectangle in Histogram (LC 84)**.
    
3. Keep the maximum area.
    

> **LC 85 is essentially LC 84 repeated for every row.**

---

## Intuition (The WHY)

Instead of searching rectangles directly, accumulate heights.

### Row 0

```text
Matrix row:
1 0 1 0 0

Histogram:
1 0 1 0 0
```

### Row 1

```text
Matrix row:
1 0 1 1 1

Histogram:
2 0 2 1 1
```

### Row 2

```text
Matrix row:
1 1 1 1 1

Histogram:
3 1 3 2 2
```

Now the problem becomes:

> Find the **largest rectangle in this histogram**.

The best rectangle appears in Row 2 with area **6**.

---

## Step 1 — Build Histogram Heights

Maintain an array `heights` of size `cols`.

For every cell:

- If value is `'1'` → increase height
    
- If value is `'0'` → reset to `0`
    

```python
if matrix[r][c] == "1":
    heights[c] += 1
else:
    heights[c] = 0
```

Example progression:

|Row|Heights|
|---|---|
|0|`[1,0,1,0,0]`|
|1|`[2,0,2,1,1]`|
|2|`[3,1,3,2,2]`|
|3|`[4,0,0,3,0]`|

---

## Step 2 — Largest Rectangle in Histogram

Use a **monotonic increasing stack**.

The stack stores **indices** whose heights are increasing.

When a shorter bar arrives:

- Pop taller bars
    
- Compute their maximum possible width
    
- Update the area
    

### Histogram Algorithm

```python
def largestRectangleArea(heights):
    stack = []
    ans = 0

    heights.append(0)

    for i, h in enumerate(heights):

        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]

            left = stack[-1] if stack else -1
            width = i - left - 1

            ans = max(ans, height * width)

        stack.append(i)

    heights.pop()
    return ans
```

---

## Complete Python Solution

```python
def largestRectangleArea(heights):
    stack = []
    best = 0

    heights.append(0)

    for i, h in enumerate(heights):

        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            left = stack[-1] if stack else -1
            width = i - left - 1
            best = max(best, height * width)

        stack.append(i)

    heights.pop()
    return best


def maximalRectangle(matrix):
    if not matrix:
        return 0

    rows = len(matrix)
    cols = len(matrix[0])

    heights = [0] * cols
    ans = 0

    for r in range(rows):

        for c in range(cols):
            if matrix[r][c] == "1":
                heights[c] += 1
            else:
                heights[c] = 0

        ans = max(ans, largestRectangleArea(heights))

    return ans
```

---

## Dry Run

Consider Row 2:

```text
Heights:
3 1 3 2 2
```

Largest histogram rectangle:

```text
3 1 3 2 2
      █ █ █
      █ █ █
```

Width = **3**

Height = **2**

Area:

This becomes the global answer.

---

## Why the Width Formula Works

Suppose we pop the highlighted bar:

```text
Index:   0 1 2 3 4
Height:  2 1 5 6 2
                ↑ pop 6
```

After popping:

- Current index = `4`
    
- New stack top = `2`
    

Rectangle spans:

```text
Left boundary  = 2
Right boundary = 4

Usable width = 4 - 2 - 1 = 1
```

General formula:

where:

- **right** = current index
    
- **left** = new stack top after popping
    

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(R × C)**|
|Auxiliary Space|**O(C)**|

Explanation:

- Every row runs one histogram algorithm.
    
- Each column index is pushed and popped **once**.
    

---

## Relationship to Previous Problems

|Problem|Core Idea|
|---|---|
|Largest Rectangle in Histogram (LC 84)|Monotonic Stack|
|Maximal Rectangle (LC 85)|Histogram per Row + LC 84|
|Maximum Sum Rectangle|Column Compression + Kadane|

Notice the reduction pattern:

- **Area problem** → Histogram
    
- **Sum problem** → Kadane
    

Both reduce a **2D matrix into repeated 1D problems**.

---

## Common Mistakes

### 1. Forgetting to Reset Heights

Wrong:

```python
heights[c] += 1
```

Correct:

```python
if matrix[r][c] == "1":
    heights[c] += 1
else:
    heights[c] = 0
```

A `0` breaks the vertical rectangle.

### 2. Not Adding the Sentinel `0`

```python
heights.append(0)
```

The sentinel forces every remaining bar to be popped, eliminating the need for a final cleanup loop.

### 3. Storing Heights Instead of Indices

The stack **must store indices** because width depends on positions, not values.

---

## Key Takeaways / Pattern Recognition

- **Binary matrix + largest rectangle** → Think **Histogram Transformation**.
    
- Each row becomes the base of a histogram of consecutive `1`s.
    
- The reusable interview pipeline is:
    
    **Matrix → Heights → Largest Rectangle in Histogram**
    
- LC **84** is the prerequisite for LC **85**; mastering the histogram stack makes this problem almost mechanical.