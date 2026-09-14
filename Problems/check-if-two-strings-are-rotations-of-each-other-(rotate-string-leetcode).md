---
Title: Check if Two Strings are Rotations of Each Other (Leetcode 796)
Companies:
  - Not Specified
Topics:
  - Strings
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Substring
  - GFG
Link: https://leetcode.com/problems/rotate-string/description/
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Check if Two Strings are Rotations of Each Other (LC 796)

**Pattern:**  `s + s` pattern in strings . Very handy

**Idea:** 

**Variations** : 

---

## 💻 Code
If disallowed built-in search , use KMP ([KMP-string-matching](../Templates/KMP-string-matching.md))
```Python
def isRotation(s1: str, s2: str) -> bool:
    if len(s1) != len(s2):
        return False

    return s2 in (s1 + s1)
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---

# Check if Two Strings are Rotations of Each Other

**Tags:** #Strings #Rotation #Substring #KMP #PatternMatching #Interview-Pattern #LeetCode 796 #FAANG

## Problem Statement

Given two strings `s1` and `s2`, determine whether `s2` is a **rotation** of `s1`.

A rotation is obtained by repeatedly moving characters from the front to the back.

**Examples**

|`s1`|`s2`|Answer|
|---|---|---|
|`"ABCD"`|`"CDAB"`|✅|
|`"waterbottle"`|`"erbottlewat"`|✅|
|`"ABCD"`|`"ACBD"`|❌|

---

## Key Idea

A rotation preserves the **relative circular order** of characters.

The fundamental property is:

> If `s2` is a rotation of `s1`, then `s2` must be a substring of `s1 + s1`.

Example:

```text
s1 = ABCD

s1 + s1 = ABCDABCD

Rotations present:
ABCD
BCDA
CDAB
DABC
```

Every possible rotation appears as a contiguous substring of the doubled string.

---

## Why Does `s + s` Work?

Consider cutting the string at any position.

```text
Original:

A B C D E F
      ↑ cut

Rotation:

D E F A B C
```

Now duplicate the original:

```text
A B C D E F A B C D E F
```

The rotated string already exists as one continuous segment.

This is true for **every** possible cut position.

---

## Optimal Approach

### Algorithm

1. If lengths differ → return `False`.
    
2. Concatenate `s1 + s1`.
    
3. Check whether `s2` is a substring.
    

### Python Solution

```python
def isRotation(s1: str, s2: str) -> bool:
    if len(s1) != len(s2):
        return False

    return s2 in (s1 + s1)
```

> Python's `in` performs efficient substring searching internally (typically near-linear time).

---

## Dry Run

**Input**

```text
s1 = ABCD
s2 = CDAB
```

Create doubled string:

```text
ABCDABCD
```

Search:

```text
ABCDABCD
  CDAB
```

Found → **True**

---

## Edge Cases

### Different Lengths

```text
s1 = ABCD
s2 = ABC
```

Impossible.

Return `False`.

### Same Strings

```text
s1 = ABCD
s2 = ABCD
```

A string is a rotation of itself.

Return `True`.

### Repeated Characters

```text
s1 = AAAA
s2 = AAAA
```

Still a valid rotation.

The substring property continues to hold.

---

## Complexity

|Approach|Time|Auxiliary Space|
|---|--:|--:|
|`s2 in (s1+s1)`|**O(n)** average|**O(n)**|
|KMP on doubled string|**O(n)**|**O(n)**|

`n` = length of the strings.

---

## Interview Follow-up: Without Built-in Substring Search

If the interviewer disallows `in`, use **KMP**.

```python
def isRotation(s1, s2):
    if len(s1) != len(s2):
        return False

    doubled = s1 + s1
    return KMP(doubled, s2) != []
```

The overall complexity remains **O(n)**.

---

## Common Mistakes

### 1. Forgetting Equal Length Check

Wrong:

```python
return s2 in (s1 + s1)
```

Example:

```text
s1 = ABCD
s2 = ABC
```

`"ABC"` is a substring, but **not** a rotation.

Always check lengths first.

### 2. Reversing Instead of Rotating

Rotation:

```text
ABCD → CDAB
```

Reversal:

```text
ABCD → DCBA
```

These are unrelated operations.

### 3. Trying All Rotations

Generating every rotation takes **O(n²)**.

The doubling trick reduces it to a single substring search.

---

## Key Takeaways / Pattern Recognition

- **Rotation** problems almost always reduce to **substring search**.
    
- The reusable identity is:
    
- This is a classic interview problem that connects directly to **KMP**: replace the built-in substring search with KMP when implementing from scratch.