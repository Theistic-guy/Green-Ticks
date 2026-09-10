---
Title: Leftmost Non-Repeating Character (Leetcode 387)
Companies:
  - Not Specified
Topics:
  - Strings
  - Hashing
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Leftmost Non-Repeating Character (Leetcode 387)

**Pattern:** 

**Idea:** 

**Variations** : 
+ [leftmost-repeating-character](leftmost-repeating-character.md)

---

## 💻 Code

Double pass is required  , it can't be done in single pass.
```Python
def firstUniqChar(s: str) -> int:
    freq = [0] * 26

    for ch in s:
        freq[ord(ch) - ord('a')] += 1

    for i, ch in enumerate(s):
        if freq[ord(ch) - ord('a')] == 1:
            return i

    return -1

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---


# Leftmost Non-Repeating Character (Leetcode 387)

**Tags:** #Strings #Hashing #FrequencyArray #Arrays #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a string `s`, return the **index of the first non-repeating character**. If every character repeats, return `-1`.

**Example**

|Input|Output|
|---|--:|
|`"leetcode"`|0|
|`"loveleetcode"`|2|
|`"aabb"`|-1|

---

## Key Idea

Count the frequency of every character, then scan the string from left to right and return the first character whose frequency is exactly **1**.

Unlike the previous problem (**leftmost repeating**), there is **no elegant right-to-left single-pass solution** because we cannot know whether a character will repeat until we've seen the entire string.

---

## Intuition (The WHY)

Example:

```text
s = "loveleetcode"
```

Frequency table:

|Character|Count|
|---|--:|
|l|2|
|o|2|
|v|1|
|e|4|
|t|1|
|c|1|
|d|1|

Scanning from left:

|Index|Char|Frequency|Return?|
|--:|---|--:|---|
|0|l|2|❌|
|1|o|2|❌|
|2|v|1|✅|

Answer = **2**

The first scan determines **who is unique**, and the second determines **who is leftmost**.

---

## Optimal Approach — Double Pass Frequency Array

### Algorithm

1. Count frequencies of all characters.
    
2. Traverse the string from left to right.
    
3. Return the first index whose frequency is `1`.
    

### Python Solution

```python
def firstUniqChar(s: str) -> int:
    freq = [0] * 26

    for ch in s:
        freq[ord(ch) - ord('a')] += 1

    for i, ch in enumerate(s):
        if freq[ord(ch) - ord('a')] == 1:
            return i

    return -1
```

> Leetcode 387 guarantees lowercase English letters, so a **26-element array** is sufficient.

---

## Dry Run

**Input**

```text
s = "loveleetcode"
```

### Frequency Count

```text
l → 2
o → 2
v → 1
e → 4
t → 1
c → 1
d → 1
```

### Second Pass

|Index|Character|Unique?|
|--:|---|---|
|0|l|❌|
|1|o|❌|
|2|v|✅|

Return **2**.

---

## Why Can't We Do It in One Left-to-Right Pass?

Suppose:

```text
s = "abca"
```

At index `1`, `'b'` looks unique.

But later characters may change the answer:

```text
a b c a
```

Similarly:

```text
s = "abcad"
```

You cannot safely return `'b'` until the entire string has been processed.

A future occurrence can invalidate any earlier character.

Therefore, frequency information is required first.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(1)**|

The frequency array has fixed size `26`, so it is constant space.

---

## Leftmost Repeating vs Non-Repeating

|Problem|Technique|
|---|---|
|Leftmost Repeating|Frequency OR Right-to-Left Visited|
|Leftmost Non-Repeating|Frequency + Left-to-Right Scan|

The key difference is:

- **Repeating** can exploit reverse traversal.
    
- **Non-repeating** requires knowing the **final frequency** of every character.
    

---

## Common Mistakes

### 1. Returning the First Character Seen Once

Wrong logic:

```python
seen = set()
```

A character seen once may repeat later.

Example:

```text
"abca"
```

`'a'` initially appears unique but is not.

### 2. Using a 256-Size Array Unnecessarily

For Leetcode 387:

```python
freq = [0] * 26
```

is simpler and more memory-efficient.

### 3. Returning the Character Instead of the Index

The problem asks for the **index**, not the character.

---

## Pythonic Way

Using `Counter`:

```python
from collections import Counter

def firstUniqChar(s):
    freq = Counter(s)

    for i, ch in enumerate(s):
        if freq[ch] == 1:
            return i
    return -1
```

Readable, though the fixed-size array is slightly faster.

---

## Key Takeaways / Pattern Recognition

- **Need the first unique element** → Count frequencies first.
    
- The solution is a classic **double-pass hashing** pattern.
    
- A useful interview heuristic:
    
    - **Need frequencies?** → Count first.
        
    - **Need earliest occurrence?** → Scan in original order.
        
    - **Need leftmost repeating?** → Reverse traversal can sometimes eliminate the second pass.