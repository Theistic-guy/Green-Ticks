---
Title: Leftmost Repeating Character
Companies:
  - Not Specified
Topics:
  - Strings
  - Hashing
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Leftmost Repeating Character

**Pattern:** 

**Idea:** 

**Variations** : 
+ [leftmost-non-repeating-character](leftmost-non-repeating-character.md)


---

## 💻 Code

Single Pass
```Python
def leftmostRepeating(s):
    visited = [False] * 256
    ans = -1

    for i in range(len(s) - 1, -1, -1):
        idx = ord(s[i])

        if visited[idx]:
            ans = i
        else:
            visited[idx] = True

    return ans
```

**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---

# Leftmost Repeating Character

**Tags:** #Strings #Hashing #FrequencyArray #Arrays #Interview-Pattern #FAANG

## Problem Statement

Given a string `s`, return the **index of the leftmost character that repeats**. If no character repeats, return `-1`.

A repeating character is one whose frequency is **greater than 1**.

**Example**

|Input|Output|Character|
|---|--:|---|
|`"geeksforgeeks"`|0|`'g'`|
|`"abccbd"`|1|`'b'`|
|`"abcd"`|-1|—|

---

## Key Idea

There are two standard interview approaches:

1. **Double Pass** — Count frequencies, then find the first repeated character.
    
2. **Single Pass** — Traverse from right to left while remembering visited characters.
    

The single-pass approach is more elegant and uses the observation that the **last time we encounter a repeating character while moving backwards is its leftmost occurrence**.

---

# Approach 1 — Double Pass (Frequency Counting)

## Intuition

First determine **which characters repeat**, then locate the first one.

### Algorithm

1. Count frequency of every character.
    
2. Scan the string from left to right.
    
3. Return the first index whose frequency is greater than `1`.
    

### Python Solution

```python
def leftmostRepeating(s):
    freq = [0] * 256

    for ch in s:
        freq[ord(ch)] += 1

    for i, ch in enumerate(s):
        if freq[ord(ch)] > 1:
            return i

    return -1
```

### Dry Run

```text
s = "abccbd"
```

Frequency:

|Char|Count|
|---|--:|
|a|1|
|b|2|
|c|2|
|d|1|

Second pass:

|Index|Char|Repeating?|
|---|---|---|
|0|a|❌|
|1|b|✅|

Answer = **1**

---

# Approach 2 — Single Pass (Right to Left)

## Intuition (The WHY)

Traverse the string **backwards**.

Maintain a `visited` array.

- First time seeing a character → mark visited.
    
- If already visited → update the answer to the current index.
    

The **last update** becomes the leftmost repeating character.

### Visual Example

```text
s = "abccbd"

Right → Left
```

|Index|Char|Visited?|Answer|
|--:|---|---|--:|
|5|d|No|-1|
|4|b|No|-1|
|3|c|No|-1|
|2|c|Yes|2|
|1|b|Yes|1|
|0|a|No|1|

Final answer = **1**

Notice how the answer keeps moving left.

---

## Python Solution

```python
def leftmostRepeating(s):
    visited = [False] * 256
    ans = -1

    for i in range(len(s) - 1, -1, -1):
        idx = ord(s[i])

        if visited[idx]:
            ans = i
        else:
            visited[idx] = True

    return ans
```

---

## Why Right-to-Left Works

Suppose:

```text
s = "abccbd"
```

The second `'b'` is encountered first:

```text
a b c c b d
        ↑
```

Later, moving left:

```text
a b c c b d
  ↑
```

We now discover the **leftmost occurrence**.

Every repeated character updates the answer exactly once, and the smallest index survives.

---

## Complexity

|Approach|Time|Auxiliary Space|
|---|--:|--:|
|Double Pass|**O(n)**|**O(1)**|
|Single Pass|**O(n)**|**O(1)**|

`256` is constant for ASCII, so the auxiliary space is considered **O(1)**.

---

## Comparison

|Feature|Double Pass|Single Pass|
|---|---|---|
|Traversals|2|1|
|Data Stored|Frequency|Visited|
|Easier to understand|✅|—|
|More elegant|—|✅|

In interviews, mention both; the single-pass version is often considered the optimal implementation.

---

## Common Mistakes

### 1. Returning the First Duplicate Encountered

For:

```text
"abccbd"
```

The first duplicate encountered while scanning left-to-right is `'c'`, but the correct answer is `'b'`.

The problem asks for the **leftmost repeating**, not the earliest repeated event.

### 2. Using a Set Left-to-Right

This incorrectly returns the second occurrence instead of the leftmost occurrence.

### 3. Forgetting Character Encoding

For lowercase-only problems, use size `26`; for general ASCII strings, use `256`.

---

## Pythonic Way

Using `Counter`:

```python
from collections import Counter

def leftmostRepeating(s):
    freq = Counter(s)

    for i, ch in enumerate(s):
        if freq[ch] > 1:
            return i

    return -1
```

Readable, but slightly less optimal than the fixed-size array due to hashing overhead.

---

## Key Takeaways / Pattern Recognition

- **Need the leftmost repeated element** → Frequency counting is the most intuitive.
    
- **Need it in one traversal** → Scan **right to left** with a visited array.
    
- This is a classic interview example showing how **changing traversal direction** can eliminate an entire pass.