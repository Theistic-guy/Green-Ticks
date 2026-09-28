---
Title: N-Queens (Leetcode 51 & 52)
Companies:
  - Mastercard
  - TikTok
  - Huawei
  - Amazon
  - Microsoft
  - Google
  - Meta
  - Zoho
  - Bloomberg
  - Adobe
  - Oracle
  - IBM
  - Goldman Sachs
  - Accenture
  - Infosys
  - tcs
  - Zenefits
  - Liftoff
  - Deutsche Bank
  - Walmart Labs
  - Snowflake
Topics:
  - Backtracking
  - Maths
  - Recursion
  - Matrix
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - DFS
Link: ""
Rating:
  - ⭐⭐⭐⭐
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# N-Queens (Leetcode 51 & 52)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

It has two parts . See below

---


# N-Queens (Leetcode 51 & 52)

**Tags:** #Backtracking #Recursion #DFS #Bitmask #Hashing #Matrix #ConstraintSatisfaction #LeetCode 

## Problem Statement

Place **N queens** on an `N × N` chessboard such that no two queens attack each other.

A queen attacks along:

- Same **row**
    
- Same **column**
    
- Same **main diagonal** (`↘`)
    
- Same **anti-diagonal** (`↙`)
    

**Leetcode 51:** Return **all valid board configurations**.

**Leetcode 52:** Return **only the number of valid configurations**.

---

## Core Insight

This is a classic **Backtracking + Constraint Satisfaction** problem.

Instead of trying every arrangement (`N^N`), place queens **row by row**.

At each row:

- Try every column.
    
- Skip unsafe positions.
    
- Recurse to the next row.
    
- Undo the placement (backtrack).
    

Since each row contains exactly one queen, we only need to track:

- Occupied columns
    
- Occupied main diagonals
    
- Occupied anti-diagonals
    

---

## Why Row-by-Row Backtracking?

A brute-force placement considers every cell independently.

For `N = 4`:

```text
16 cells
Choose any 4
```

This creates enormous redundancy.

Instead:

```text
Row 0 → choose one column
Row 1 → choose one column
Row 2 → ...
```

The recursion depth becomes exactly **N**.

This is the canonical search tree.

---

## The Three Constraints

### 1. Column

Two queens cannot share a column.

```text
Q
|
|
Q
```

Store occupied columns in a set.

### 2. Main Diagonal (`↘`)

All cells on the same diagonal have:

Example:

```text
(0,0)
(1,1)
(2,2)
```

All satisfy:

```text
row - col = 0
```

### 3. Anti-Diagonal (`↙`)

All cells satisfy:

Example:

```text
(0,3)
(1,2)
(2,1)
(3,0)
```

All satisfy:

```text
row + col = 3
```

These two formulas eliminate diagonal scanning entirely.

---

## Backtracking Algorithm

For each row:

1. Iterate over all columns.
    
2. Check whether:
    
    - column unused
        
    - `row-col` unused
        
    - `row+col` unused
        
3. Place queen.
    
4. Recurse.
    
5. Remove queen (backtrack).
    

---

## Leetcode 51 — Return All Boards

### Python Solution

```python
class Solution:
    def solveNQueens(self, n):

        board = [["."] * n for _ in range(n)]

        cols = set()
        diag1 = set()      # row - col
        diag2 = set()      # row + col

        ans = []

        def dfs(row):

            if row == n:
                ans.append(["".join(r) for r in board])
                return

            for col in range(n):

                if (
                    col in cols or
                    row - col in diag1 or
                    row + col in diag2
                ):
                    continue

                board[row][col] = "Q"
                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)

                dfs(row + 1)

                board[row][col] = "."
                cols.remove(col)
                diag1.remove(row - col)
                diag2.remove(row + col)

        dfs(0)
        return ans
```

---

## Dry Run (N = 4)

Place queens row by row.

### Row 0

```text
Q . . .
```

### Row 1

Column 0 → attacked

Column 1 → diagonal

Column 2 → valid

```text
Q . . .
. . Q .
```

Continue recursively.

Eventually one valid solution becomes:

```text
. Q . .
. . . Q
Q . . .
. . Q .
```

Backtracking explores every valid branch.

---

## Leetcode 52 — Count Solutions Only

The recursion is identical.

Instead of storing boards, increment a counter.

### Python

```python
class Solution:
    def totalNQueens(self, n):

        cols = set()
        diag1 = set()
        diag2 = set()

        count = 0

        def dfs(row):
            nonlocal count

            if row == n:
                count += 1
                return

            for col in range(n):

                if (
                    col in cols or
                    row - col in diag1 or
                    row + col in diag2
                ):
                    continue

                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)

                dfs(row + 1)

                cols.remove(col)
                diag1.remove(row - col)
                diag2.remove(row + col)

        dfs(0)
        return count
```

---

## Why Backtracking Works

At every recursive level:

- Earlier rows are already valid.
    
- We only place queens that preserve validity.
    
- If no column works, that branch is abandoned immediately.
    

This is the essence of **constraint pruning**.

Without pruning, we'd explore impossible boards.

---

## Complexity

### Time

Worst case:

```text
O(N!)
```

Reason:

- Row 0 → N choices
    
- Row 1 → at most N−1
    
- Row 2 → at most N−2
    

Actual runtime is much lower because diagonal pruning removes many branches.

### Space

|Metric|Value|
|---|--:|
|Recursion Depth|**O(N)**|
|Auxiliary Sets|**O(N)**|
|Board|**O(N²)**|

For LC 52, the board can even be omitted.

---

# Bitmask Optimization (Advanced)

Instead of sets, use integers.

Maintain three bitmasks:

```text
cols
diag1
diag2
```

Available positions:

Extract the rightmost valid position:

```text
bit = available & -available
```

This reduces constant factors significantly and is the preferred solution for large `N`.

Typical complexity remains exponential but is substantially faster.

---

## Common Mistakes

### 1. Checking Entire Board

Wrong:

```python
isSafe(row, col):
    scan all rows
    scan diagonals
```

This makes every placement **O(N)**.

Use hash sets for **O(1)** safety checks.

### 2. Forgetting to Backtrack

Always undo:

```python
board[row][col] = "."
cols.remove(col)
diag1.remove(...)
diag2.remove(...)
```

Otherwise later branches inherit stale state.

### 3. Confusing Diagonal Formulas

|Diagonal|Formula|
|---|---|
|Main (`↘`)|`row - col`|
|Anti (`↙`)|`row + col`|

This is the most frequently tested implementation detail.

---

## Relationship to Other Backtracking Problems

|Problem|State|
|---|---|
|Permutations|Used elements|
|Sudoku|Row/Col/Box constraints|
|N-Queens|Col + 2 diagonals|
|Rat in Maze|Visited cells|
|Word Search|Visited path|

The common pattern is:

1. Choose
    
2. Validate
    
3. Recurse
    
4. Undo
    

---

## Key Takeaways

- Place **one queen per row** to reduce the search space.
    
- Safety checking becomes **O(1)** using:
    
    - `cols`
        
    - `row - col`
        
    - `row + col`
        
- **LC 51** stores boards; **LC 52** only counts solutions.
    
- The bitmask version is an advanced optimization but follows the exact same backtracking logic.
    

> **Interview Heuristic:** Whenever a problem asks to generate **all valid arrangements under constraints**, think **Backtracking + O(1) constraint lookup** rather than brute force.