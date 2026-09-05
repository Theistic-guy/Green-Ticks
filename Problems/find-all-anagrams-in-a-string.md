---
Title: Find All Anagrams in a String (Leetcode 438)
Companies:
  - Not Specified
Topics:
  - Strings
  - Hashing
  - Sliding Window
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Find All Anagrams in a String (Leetcode 438)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def findAnagrams(s: str, p: str):
    if len(p) > len(s):
        return []

    target = [0] * 26
    window = [0] * 26

    for ch in p:
        target[ord(ch) - ord('a')] += 1

    k = len(p)
    ans = []

    for i in range(len(s)):
        window[ord(s[i]) - ord('a')] += 1

        if i >= k:
            window[ord(s[i - k]) - ord('a')] -= 1

        if window == target:
            ans.append(i - k + 1)

    return ans

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---

# Find All Anagrams in a String (Leetcode 438)

**Tags:** #SlidingWindow #Hashing #FrequencyArray #TwoPointers #Strings #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given two strings `s` and `p`, return **all starting indices** of `p`'s anagrams in `s`.

An anagram contains the **same characters with the same frequencies**, but in any order.

**Example**

- Input: `s = "cbaebabacd"`, `p = "abc"`
    
- Output: `[0, 6]`
    

---

## Key Idea

Use a **fixed-size sliding window** of length `len(p)` and compare the character frequencies of:

- the pattern `p`
    
- the current window in `s`
    

Since the alphabet is only lowercase English letters, a **26-length frequency array** is more efficient than a hashmap.

---

## Intuition (The WHY)

Instead of checking every substring by sorting (which costs `O(k log k)`), maintain the frequency of the current window.

As the window slides:

- One character **enters** → increment its frequency.
    
- One character **leaves** → decrement its frequency.
    

If the window frequency equals the pattern frequency, we've found an anagram.

The window size **never changes**, making this a classic **fixed-length sliding window** problem.

---

## Optimal Approach — Frequency Array + Sliding Window

### Algorithm

1. Build the frequency array for `p`.
    
2. Expand the window one character at a time.
    
3. Keep the window size exactly `len(p)`.
    
4. Compare both frequency arrays.
    
5. If equal, record the left index.
    

### Python Solution

```python
def findAnagrams(s: str, p: str):
    if len(p) > len(s):
        return []

    target = [0] * 26
    window = [0] * 26

    for ch in p:
        target[ord(ch) - ord('a')] += 1

    k = len(p)
    ans = []

    for i in range(len(s)):
        window[ord(s[i]) - ord('a')] += 1

        if i >= k:
            window[ord(s[i - k]) - ord('a')] -= 1

        if window == target:
            ans.append(i - k + 1)

    return ans
```

---

## Dry Run

**s = "cbaebabacd"**

**p = "abc"**

Window size = **3**

|Window|Frequency Match?|Output|
|---|---|---|
|`"cba"`|✅|0|
|`"bae"`|❌|—|
|`"aeb"`|❌|—|
|`"eba"`|❌|—|
|`"bab"`|❌|—|
|`"aba"`|❌|—|
|`"bac"`|✅|6|
|`"acd"`|❌|—|

Final answer:

```text
[0, 6]
```

---

## Why a 26-Element Array?

Instead of a dictionary:

```python
{'a': 1, 'b': 2}
```

Use direct indexing:

```text
Index: 0 1 2 ...
Char : a b c
```

Conversion:

```python
idx = ord(ch) - ord('a')
```

Benefits:

- Constant-size memory
    
- Faster comparisons
    
- No hashing overhead
    

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(1)**|

Why is comparing two arrays still **O(n)** overall?

- Each comparison checks **26** entries.
    
- `26` is a constant, so each window costs **O(1)**.
    

Overall:

**O(26 × n) = O(n)**

---

## Important Variations

- **Permutation in String (LC 567)** → Same algorithm, but return `True` upon the first match.
    
- **Minimum Window Substring (LC 76)** → Variable-size sliding window with frequency counting.
    
- **Longest Repeating Character Replacement (LC 424)** → Sliding window with character frequencies.
    

These form the core family of **frequency-based sliding window** problems.

---

## Common Mistakes / Quirks

### 1. Shrinking at the wrong time

Correct:

```python
if i >= k:
    window[ord(s[i-k]) - ord('a')] -= 1
```

The window becomes size `k+1` first, then we remove the oldest character.

### 2. Incorrect starting index

Current window ends at `i`.

Start is:

```python
i - k + 1
```

Not simply `i`.

### 3. Using sorting for every window

This becomes:

- Sorting each substring → **O(k log k)**
    
- Total → **O(nk log k)**
    

Too slow for interview constraints.

---

## Pythonic Way

A concise frequency update:

```python
window[ord(s[i]) - ord('a')] += 1

if i >= k:
    window[ord(s[i-k]) - ord('a')] -= 1
```

No explicit left pointer is needed because the window size is fixed.

---

## Key Takeaways / Pattern Recognition

- **Fixed window size + exact frequency match** → Sliding Window + Frequency Array.
    
- Lowercase English letters usually imply a **26-element array** instead of a hashmap.
    
- This is the canonical **fixed-length sliding window** pattern and directly extends to LC 567 (Permutation in String).
    
- Remember the distinction:
    
    - **Fixed window** → Compare frequencies after every shift.
        
    - **Variable window** → Expand/shrink until a condition is satisfied.