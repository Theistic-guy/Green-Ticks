---
Title: Maximum Sum Rectangle in a 2D Matrix (Kadane's 2D)
Companies:
  - Not Specified
Topics:
  - Arrays
  - Greedy
  - Matrix
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - Kadane
  - Maximum
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Maximum Sum Rectangle in a 2D Matrix (Kadane's 2D)

**Pattern:** 

**Idea:** 

**Variations** : 
+ original 1D kadane - [maximum-subarray-sum](maximum-subarray-sum.md)
+ part of [Row or Col compression in matrix](../Notes/Row%20or%20Col%20compression%20in%20matrix.md)

---

## 💻 Code

This is column compression below but i prefer row compression.
```Python
def kadane(arr):
    best = arr[0]
    curr = arr[0]

    for x in arr[1:]:
        curr = max(x, curr + x)
        best = max(best, curr)

    return best


def maximumSumRectangle(matrix):
    rows = len(matrix)
    cols = len(matrix[0])

    ans = float('-inf')

    for left in range(cols):
        temp = [0] * rows

        for right in range(left, cols):

            for r in range(rows):
                temp[r] += matrix[r][right]

            ans = max(ans, kadane(temp))

    return ans

```
**Time complexity** - O(C<sup>2</sup> * R) but if row compression then R<sup>2</sup> * C

**Aux. Space complexity** -  O(R) but if row compression $O(C)$

---

# Maximum Sum Rectangle in a 2D Matrix (Kadane's 2D)

**Tags:** #Arrays #Matrix #Kadane #DynamicProgramming #PrefixSum #Greedy #2D #Interview-Pattern #FAANG

## Problem Statement

Given an `R × C` integer matrix (containing positive and negative values), find the **maximum sum rectangular submatrix**.

> The rectangle must be contiguous in both rows and columns.

**Example**

Input:

|1|2|-1|-4|-20|
|---|---|---|---|---|
|-8|-3|4|2|1|
|3|8|10|1|3|
|-4|-1|1|7|-6|

**Output:** `29`

The maximum rectangle is:

|-3|4|2|
|---|---|---|
|8|10|1|
|-1|1|7|

Sum = **29**

---

## Key Idea

Reduce the **2D problem into multiple 1D Kadane problems**.

Instead of trying every rectangle directly, fix two column boundaries:

- `left`
    
- `right`
    

Compress everything between them into a 1D array containing **row sums**, then run **Kadane's Algorithm**.

This converts:

- **Columns → fixed**
    
- **Rows → maximum subarray**
    

---

## Brute Force → Optimal Progression

|Approach|Time|
|---|--:|
|Enumerate all rectangles|**O(R² × C² × RC)**|
|2D Prefix Sum|**O(R² × C²)**|
|Kadane + Column Compression|**O(C² × R)**|

The optimal interview solution is the third one.

---

## Intuition (The WHY)

Suppose we fix:

```text
Left  = 1
Right = 3
```

Matrix:

Compute row sums:

|Row|Sum|
|---|--:|
|0|-3|
|1|3|
|2|19|
|3|7|

Compressed array:

```text
[-3, 3, 19, 7]
```

Now the problem becomes:

> **Find the maximum sum subarray** → Kadane

Result:

```text
3 + 19 + 7 = 29
```

Every possible rectangle can be represented by some `(left, right)` pair.

---

## Optimal Approach — Column Compression + Kadane

### Algorithm

1. Iterate `left` from `0 → C-1`.
    
2. Create a temporary array of size `R` initialized to `0`.
    
3. Expand `right` from `left → C-1`.
    
4. Add the current column into the temporary array.
    
5. Run Kadane on the temporary array.
    
6. Update the global maximum.
    

### Python Solution

```python
def kadane(arr):
    best = arr[0]
    curr = arr[0]

    for x in arr[1:]:
        curr = max(x, curr + x)
        best = max(best, curr)

    return best


def maximumSumRectangle(matrix):
    rows = len(matrix)
    cols = len(matrix[0])

    ans = float('-inf')

    for left in range(cols):
        temp = [0] * rows

        for right in range(left, cols):

            for r in range(rows):
                temp[r] += matrix[r][right]

            ans = max(ans, kadane(temp))

    return ans
```

---

## Dry Run

Compressed arrays for different column pairs:

|Left|Right|Compressed Array|Kadane|
|---|---|---|--:|
|0|0|`[1,-8,3,-4]`|3|
|1|1|`[2,-3,8,-1]`|8|
|1|2|`[1,1,18,0]`|20|
|1|3|`[-3,3,19,7]`|**29**|
|2|3|`[-5,6,11,8]`|25|

Maximum = **29**

---

## Why Does Column Compression Work?

A rectangle is uniquely defined by:

- Left column
    
- Right column
    
- Top row
    
- Bottom row
    

After fixing the two columns, the remaining task is choosing the **best contiguous rows**.

The row sums become a 1D array, so Kadane finds the optimal top and bottom boundaries in linear time.

This reduces one dimension completely.

---

## Complexity

Let:

- `R` = rows
    
- `C` = columns
    

|Metric|Value|
|---|--:|
|Time|**O(C² × R)**|
|Auxiliary Space|**O(R)**|

If rows are much smaller than columns, transpose the matrix first and achieve:

**O(min(R,C)² × max(R,C))**

This is a common interview optimization.

---

## Important Variations

1. **Maximum Sum Subarray (Kadane)** → Core 1D building block.
    
2. **Maximum Sum Square Submatrix** → Different constraint; DP/prefix sums.
    
3. **Maximum Sum Rectangle with Coordinates** → Store Kadane's start/end rows and track `(left, right)`.
    

---

## Common Mistakes

### 1. Resetting `temp` inside the wrong loop

Correct:

```python
for left in range(cols):
    temp = [0] * rows

    for right in range(left, cols):
        ...
```

`temp` must persist while expanding the right boundary.

### 2. Using Kadane that returns `0`

Incorrect Kadane fails for all-negative matrices.

Correct initialization:

```python
best = arr[0]
curr = arr[0]
```

### 3. Forgetting to accumulate columns

Do **not** rebuild the compressed array every time.

Use:

```python
temp[row] += matrix[row][right]
```

This makes each expansion O(R).

---

## Pattern Recognition

|Dimension|Technique|
|---|---|
|1D Maximum Sum|Kadane|
|2D Maximum Rectangle|Column Compression + Kadane|
|3D Analogy|Fix two dimensions, solve lower dimension|

The reusable FAANG pattern is:

> **Fix boundaries in one dimension → Compress → Apply the optimal 1D algorithm.**

Whenever a 2D problem asks for an **optimal contiguous rectangle**, think about reducing it to a sequence of **1D subarray problems** rather than solving rectangles directly.