

# Naive Pattern Searching (General + Distinct Characters Optimization)

**Tags:** #Strings #PatternMatching #SlidingWindow #TwoPointers #BruteForce #Interview-Pattern #FAANG

## Problem Statement

Given a **text** `txt` of length `n` and a **pattern** `pat` of length `m`, find **all starting indices** where the pattern occurs in the text.

**Example**

- `txt = "AABAACAADAABAABA"`
    
- `pat = "AABA"`
    
- **Output:** `[0, 9, 12]`
    

> Naive Pattern Searching is the foundation for understanding **KMP**, **Rabin–Karp**, and **Z Algorithm**.

---

## Core Idea

Align the pattern with every possible starting position in the text.

For each alignment:

1. Compare characters from left to right.
    
2. If all `m` characters match → report the index.
    
3. Otherwise shift the pattern and repeat.
    

There are **two versions**:

1. **General Naive Algorithm** → shift by **1**
    
2. **Distinct Characters Optimization** → sometimes skip multiple positions
    

---

# Approach 1 — General Naive Pattern Searching

## Intuition

Slide the pattern one position at a time.

Every alignment is checked independently.

### Algorithm

For every index `i` from `0` to `n-m`:

- Compare `txt[i+j]` with `pat[j]`
    
- Stop immediately on mismatch
    
- If all characters match, record `i`
    

### Python Solution

```python
def naiveSearch(txt, pat):
    n = len(txt)
    m = len(pat)
    ans = []

    for i in range(n - m + 1):

        j = 0
        while j < m and txt[i + j] == pat[j]:
            j += 1

        if j == m:
            ans.append(i)

    return ans
```

---

## Dry Run

**Text**

```text
A A B A A C A A D
```

**Pattern**

```text
A A B A
```

|Start|Match Length|Result|
|--:|--:|---|
|0|4|✅|
|1|1|❌|
|2|0|❌|
|3|2|❌|
|4|1|❌|

Answer = `[0]`

---

## Complexity

|Case|Time|
|---|--:|
|Best|**O(n)**|
|Worst|**O((n-m+1) × m)** ≈ **O(nm)**|

Worst case example:

```text
Text    = AAAAAAAAAA
Pattern = AAAAB
```

Almost the entire pattern matches at every shift.

---

# Approach 2 — Naive Search (All Pattern Characters Distinct)

## When Can We Optimize?

This optimization is valid **only if every character in the pattern is unique**.

Example:

```text
Pattern = ABCD
```

Valid ✅

```text
Pattern = ABCA
```

Invalid ❌

---

## Key Observation

Suppose we matched the first `j` characters before failing.

```text
Text

A B C D E
      ↑ mismatch

Pattern

A B C X
```

Since the matched characters are **all distinct**, none of them can become the beginning of another valid match.

Therefore, we can safely skip `j` positions instead of shifting by one.

This is the optimization.

---

## Intuition (Why Skip `j`?)

Example:

```text
Text

A B C D A B C E

Pattern

A B C E
```

At index `0`:

```text
ABC ✔
D ✘
```

We matched **3** characters.

Can the next match begin at index `1`?

No.

Because that would require:

```text
Pattern starts with B
```

But the pattern starts with **A**, and all characters are distinct.

So indices `1` and `2` are impossible.

Jump directly by `3`.

---

## Optimized Algorithm

After mismatch:

- If `j == 0` → shift by `1`
    
- Otherwise → shift by `j`
    

### Python Solution

```python
def naiveDistinct(txt, pat):
    n = len(txt)
    m = len(pat)

    i = 0
    ans = []

    while i <= n - m:

        j = 0
        while j < m and txt[i + j] == pat[j]:
            j += 1

        if j == m:
            ans.append(i)

        if j == 0:
            i += 1
        else:
            i += j

    return ans
```

---

## Dry Run

**Text**

```text
ABCDABCE
```

**Pattern**

```text
ABCE
```

### Shift 0

```text
ABCD
ABCE
```

Matched = **3**

Instead of:

```text
Shift 1
Shift 2
Shift 3
```

Jump directly to:

```text
Shift 3
```

Only two alignments are checked instead of four.

---

## Why It Works (Proof)

Assume:

- First `j` characters matched.
    
- Pattern characters are all distinct.
    

The next possible alignment starts somewhere inside those matched characters.

Suppose it starts at offset `k` where `1 ≤ k < j`.

Then the first character of the pattern would have to equal `pat[k]`.

But:

- `pat[0] ≠ pat[k]`
    
- because every character is distinct.
    

Contradiction.

Hence every intermediate alignment is impossible, so skipping `j` is always safe.

---

## Comparison

|Feature|General Naive|Distinct Optimization|
|---|--:|--:|
|Shift after mismatch|1|`j`|
|Pattern may repeat chars|✅|❌|
|Worst-case|O(nm)|O(n)|
|Space|O(1)|O(1)|

---

## Common Mistakes

### 1. Using the Optimization on Repeated Patterns

Wrong example:

```text
Pattern = ABAB
```

After matching `"AB"`:

```text
ABAB
ABAC
```

Jumping by `2` skips a valid alignment.

The optimization becomes **incorrect**.

### 2. Forgetting `j == 0`

If the very first character mismatches:

```text
Text    = X...
Pattern = A...
```

You must shift by exactly one.

```python
if j == 0:
    i += 1
```

### 3. Claiming It Is KMP

This is **not** KMP.

The skipping comes purely from the **distinct-character assumption**, whereas KMP works for **any** pattern using the LPS array.

---

## Relationship with KMP

|Algorithm|Skipping Based On|
|---|---|
|General Naive|Always shift 1|
|Distinct Naive|Distinct pattern property|
|KMP|LPS (Longest Prefix Suffix)|

The distinct-character optimization is best viewed as a **special case of KMP** where the LPS values are all zero.

---

## Key Takeaways / Pattern Recognition

- **General Naive** is the baseline pattern matching algorithm: compare at every alignment.
    
- If **all pattern characters are distinct**, a mismatch after `j` matches allows a jump of `j` positions.
    
- The optimization reduces worst-case complexity from **O(nm)** to **O(n)** under the distinct-character assumption.
    
- This topic is the conceptual bridge to **KMP**, where the LPS array generalizes skipping for patterns with repeated characters.