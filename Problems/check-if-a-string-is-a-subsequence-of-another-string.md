---
Title: Check if a String is a Subsequence of Another String
Companies:
  - Not Specified
Topics:
  - Strings
  - Two Pointers
  - Greedy
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Check if a String is a Subsequence of Another String

**Pattern:**  use two pointers and increment them

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def isSubsequence(s: str, t: str) -> bool:
    i = j = 0

    while i < len(s) and j < len(t):
        if s[i] == t[j]:
            i += 1
        j += 1

    return i == len(s)

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---


# Check if a String is a Subsequence of Another String

**Tags:** #Strings #TwoPointers #Recursion #DynamicProgramming #Greedy #Interview-Pattern 

## Problem Statement

Given two strings:

- `s` → candidate subsequence
    
- `t` → original string
    

Return `True` if `s` is a **subsequence** of `t`; otherwise return `False`.

A subsequence preserves **relative order**, but characters do **not** need to be contiguous.

**Example**

|s|t|Answer|
|---|---|---|
|`"abc"`|`"ahbgdc"`|✅|
|`"axc"`|`"ahbgdc"`|❌|
|`""`|`"abc"`|✅|

---

## Key Idea

Use **two pointers**.

- Pointer `i` traverses `s`
    
- Pointer `j` traverses `t`
    

Whenever characters match, advance both pointers; otherwise advance only `j`.

If `i` reaches the end of `s`, every character has been matched in order.

> This is a greedy algorithm: matching the earliest possible occurrence never hurts future matches.

---

## Intuition (The WHY)

Example:

```text
s = "ace"
t = "abcde"
```

We simply scan `t` once:

|Step|`i`|`j`|Match?|
|---|--:|--:|---|
|a|0|0|✅|
|b|1|1|❌|
|c|1|2|✅|
|d|2|3|❌|
|e|2|4|✅|

All characters are found in order.

The greedy choice is optimal because choosing an earlier match leaves **more characters available** for the remaining subsequence.

---

## Approach 1 — Iterative (Two Pointers)

### Algorithm

1. Initialize `i = 0`, `j = 0`.
    
2. Traverse `t`.
    
3. If characters match, increment `i`.
    
4. Always increment `j`.
    
5. Return `i == len(s)`.
    

### Python Solution

```python
def isSubsequence(s: str, t: str) -> bool:
    i = j = 0

    while i < len(s) and j < len(t):
        if s[i] == t[j]:
            i += 1
        j += 1

    return i == len(s)
```

### Dry Run

```text
s = "abc"
t = "ahbgdc"
```

|`t[j]`|`s[i]`|Action|
|---|---|---|
|a|a|Match|
|h|b|Skip|
|b|b|Match|
|g|c|Skip|
|d|c|Skip|
|c|c|Match|

Result: **True**

---

## Approach 2 — Recursive

### Idea

At each step:

- If characters match → move both strings.
    
- Otherwise → skip one character in `t`.
    

### Recursive Relation

Let `f(i, j)` denote whether `s[i:]` is a subsequence of `t[j:]`.

### Python Solution

```python
def isSubsequence(s: str, t: str) -> bool:

    def dfs(i, j):
        if i == len(s):
            return True

        if j == len(t):
            return False

        if s[i] == t[j]:
            return dfs(i + 1, j + 1)

        return dfs(i, j + 1)

    return dfs(0, 0)
```

### Recursion Tree

For:

```text
s = "ab"
t = "acb"
```

Eventually `'b'` matches and the recursion returns `True`.

---

## Why Greedy Works

Suppose we have multiple occurrences:

```text
t = a x a b c
      ↑   ↑
```

Should we match the **first** or **second** `'a'`?

Always match the **first**.

Reason:

- It leaves a **larger suffix** of `t`.
    
- Every solution using the later `'a'` is also possible using the earlier one.
    

This is a classic greedy proof.

---

## Complexity

|Approach|Time|Auxiliary Space|
|---|--:|--:|
|Iterative|**O(n)**|**O(1)**|
|Recursive|**O(n)**|**O(n)**|

Where `n = len(t)`.

The recursive version uses stack space proportional to the recursion depth.

---

## Important Variations

1. **Number of Matching Subsequences (LC 792)** → Many `s` strings against one `t`; preprocess indices + binary search.
    
2. **Is Subsequence (LC 392)** → Two-pointer greedy.
    
3. **Distinct Subsequences (LC 115)** → Dynamic Programming counting problem (much harder).
    

---

## Common Mistakes

### 1. Incrementing both pointers on mismatch

Wrong:

```python
if s[i] != t[j]:
    i += 1
    j += 1
```

Only `t` should advance when characters differ.

### 2. Forgetting the Empty String

```python
s = ""
t = "abc"
```

An empty string is always a subsequence.

The iterative solution naturally returns `True`.

### 3. Confusing Subsequence with Substring

|Subsequence|Substring|
|---|---|
|Order matters|Order + contiguity|
|Characters may skip|No skipping|

Example:

- `"ace"` is a subsequence of `"abcde"`
    
- `"ace"` is **not** a substring.
    

---

## Pythonic Way

Python provides an elegant iterator trick:

```python
def isSubsequence(s, t):
    it = iter(t)
    return all(c in it for c in s)
```

### Why It Works

`iter(t)` remembers its position.

Each membership test:

```python
c in it
```

continues searching from the current iterator position rather than restarting.

> Great for interviews **after** explaining the two-pointer algorithm, not as the primary solution.

---

## Key Takeaways / Pattern Recognition

- **Order matters, contiguity doesn't** → Think **Two Pointers**.
    
- Greedily matching the earliest occurrence is optimal.
    
- Recursive and iterative solutions implement the **same state transition**.
    
- If the problem asks about **many subsequence queries**, preprocess the larger string instead of scanning it repeatedly.