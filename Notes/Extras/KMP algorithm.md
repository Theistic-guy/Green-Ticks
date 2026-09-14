
🔗 Template Code - [KMP-string-matching](../../Templates/KMP-string-matching.md)

### Neetcode's code

LPS array construction. Here, `prevLPS` is the index pointer not the value.
https://www.youtube.com/watch?v=JoF0Z7nVSrA
```Python

lps = [0] * len(patt)

prevLPS, i = 0, 1
while i < len(patt):
	if patt[i] == patt[prevLPS]:
		lps[i] = prevLPS + 1
		prevLPS += 1
		i += 1
	elif prevLPS == 0:
		lps[i] = 0
		i += 1
	else:
		prevLPS = lps[prevLPS - 1]

        
```

### My search logic
a is pointer to text

b is pointer to pattern

```Python

a = b = 0

while a < len(text) and b < len(patt):
    if text[a] == patt[b]:
        a += 1
        b += 1
    else:
        if b == 0:
            a += 1
        else:
            b = lps[b - 1]

if b == len(patt):
    print(a - len(patt))
else:
    print(-1)

```

### Why complexity is O(n+m)?

#### Why KMP Matching is Linear: $O(n + m)$

The Knuth-Morris-Pratt (KMP) algorithm consists of two distinct, inseparable phases, resulting in a total time complexity of $O(n + m)$:

1. LPS Preprocessing Phase: Takes $O(m)$ time to build the lookup table.
2. Text Matching Phase: Takes $O(n)$ time to search the text.

#### The Paradox: Why $j$ Shifting Backward is Still $O(n)$

During text matching, the text pointer $i$ moves strictly forward, but the pattern pointer $j$ frequently drops back via `j = lps[j-1]`. Despite this "back-and-forth" movement, the phase remains strictly bounded by $O(n)$ due to amortized analysis:

- Bounded Increases: The pointer $j$ can only increase (`j++`) when characters match. Because a match immediately advances the text pointer $i$, $j$ can increment at most $n$ times total.
- Bounded Decreases: The pointer $j$ can never drop below `0`. Therefore, it can only decrease as many times as it has previously increased. $j$ can shift backward at most $n$ times total across the entire program execution.

#### Conclusion

Because the total number of backward shifts is capped by the forward steps, the matching loop performs at most $2n$ total operations. This simplifies to $O(n)$, making the complete algorithm $O(n + m)$.



# Knuth–Morris–Pratt (KMP) Algorithm

**Tags:** #Strings #PatternMatching #KMP #LPS #PrefixFunction #TwoPointers #DynamicProgramming #Interview-Pattern #FAANG #LeetCode 28

## Problem Statement

Given a **text** `txt` and a **pattern** `pat`, find all starting indices where the pattern occurs in the text.

Unlike Naive Search, KMP guarantees **O(n + m)** worst-case time by avoiding redundant character comparisons.

---

## Why KMP Exists

Consider:

```text
Text    = AAAAABAAABA
Pattern = AAAAB
```

Naive matching repeatedly compares the same `'A'` characters after every mismatch.

KMP asks:

> **"How much of what we've already matched can still be useful?"**

Instead of restarting from the beginning, it reuses the matched prefix information stored in the **LPS array**.

---

# The Core Idea — LPS Array

## What is LPS?

**LPS = Longest Proper Prefix which is also a Suffix**

For every prefix of the pattern, LPS stores the length of the longest prefix that is also its suffix.

- **Proper prefix** → Prefix excluding the whole string
    
- **Suffix** → Ending part of the string
    

### Example

Pattern:

```text
A B A B A C
```

Compute LPS for every position.

|Prefix|LPS|Why|
|---|--:|---|
|A|0|No proper prefix|
|AB|0|None|
|ABA|1|A|
|ABAB|2|AB|
|ABABA|3|ABA|
|ABABAC|0|None|

Final LPS:

```text
[0, 0, 1, 2, 3, 0]
```

---

## Intuition (The WHY)

Suppose we've matched:

```text
Pattern

A B A B A
```

and then a mismatch occurs.

We already know:

- Prefix `"ABA"` equals suffix `"ABA"`.
    

So restarting from zero wastes work.

Instead of:

```text
ABABA
↑ restart
```

jump directly to:

```text
ABA
↑ continue here
```

The LPS tells us **exactly where to resume**.

This is the entire magic of KMP.

---

# Building the LPS Array

## Algorithm

Maintain two pointers:

- `i` → current character being computed
    
- `length` → current longest prefix-suffix length
    

### Rules

- Characters match → extend prefix
    
- Mismatch & `length > 0` → fall back using previous LPS
    
- Mismatch & `length = 0` → LPS becomes 0
    

### Python

```python
def buildLPS(pat):
    m = len(pat)
    lps = [0] * m

    length = 0
    i = 1

    while i < m:

        if pat[i] == pat[length]:
            length += 1
            lps[i] = length
            i += 1

        elif length != 0:
            length = lps[length - 1]

        else:
            lps[i] = 0
            i += 1

    return lps
```

---

## Dry Run — Building LPS

Pattern:

```text
A B A B A C
```

|i|Char|length|LPS|
|--:|---|--:|---|
|1|B|0|0|
|2|A|1|1|
|3|B|2|2|
|4|A|3|3|
|5|C|fallback→0|0|

Result:

```text
[0,0,1,2,3,0]
```

Notice position `5` falls back multiple times without moving `i`.

---

# KMP Pattern Searching

## Algorithm

Maintain:

- `i` → text pointer
    
- `j` → pattern pointer
    

### Cases

1. Match → move both
    
2. Entire pattern matched → report index, jump using LPS
    
3. Mismatch with `j > 0` → jump using LPS
    
4. Mismatch with `j = 0` → move text only
    

### Python

```python
def buildLPS(pat):
    lps = [0] * len(pat)

    length = 0
    i = 1

    while i < len(pat):
        if pat[i] == pat[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            i += 1

    return lps


def KMP(txt, pat):
    n, m = len(txt), len(pat)
    lps = buildLPS(pat)

    ans = []
    i = j = 0

    while i < n:

        if txt[i] == pat[j]:
            i += 1
            j += 1

        if j == m:
            ans.append(i - j)
            j = lps[j - 1]

        elif i < n and txt[i] != pat[j]:

            if j != 0:
                j = lps[j - 1]
            else:
                i += 1

    return ans
```

---

## Dry Run

Text:

```text
A B A B A B A C A
```

Pattern:

```text
A B A B A C
```

LPS:

```text
0 0 1 2 3 0
```

Matching:

|Text Index|Pattern Index|Action|
|--:|--:|---|
|0–4|0–4|Match|
|5|5|Mismatch|
|5|3|Jump using LPS|
|5–7|3–5|Match|
|8|6|Found|

Output:

```text
[2]
```

The text pointer **never moves backward**.

---

## Why We Don't Increment `i` After Fallback

This is the most important KMP interview question.

Suppose:

```text
Text    = ABABABAC

Pattern = ABABAC
```

After matching:

```text
ABABA
```

Mismatch occurs.

Naive:

```text
Restart from next position
```

KMP:

```text
Use LPS = 3

Resume matching "ABA"
```

Notice:

- `i` stays fixed
    
- Only `j` changes
    

Because the current text character hasn't been compared against the new pattern position yet.

---

## Complexity

|Operation|Time|Auxiliary Space|
|---|--:|--:|
|Build LPS|**O(m)**|**O(m)**|
|Pattern Search|**O(n)**|**O(1)**|
|Total|**O(n + m)**|**O(m)**|

Every character of the text is processed at most once.

---

# LPS vs Rabin–Karp vs Naive

|Algorithm|Worst Time|Extra Structure|
|---|--:|---|
|Naive|O(nm)|None|
|Rabin–Karp|O(nm)|Rolling Hash|
|KMP|**O(n+m)**|LPS Array|

- **Naive** compares repeatedly.
    
- **Rabin–Karp** skips using hashes.
    
- **KMP** skips using prefix information.
    

---

## Common Mistakes

### 1. Confusing Prefix with Proper Prefix

For:

```text
AAAA
```

Proper prefixes:

```text
"", A, AA, AAA
```

The whole string is **not** allowed.

### 2. Incrementing `i` After Fallback

Wrong:

```python
j = lps[j-1]
i += 1
```

Correct:

```python
j = lps[j-1]
```

The text pointer stays where it is.

### 3. Restarting `j = 0` After a Match

After finding one occurrence:

```python
j = lps[j-1]
```

This allows overlapping matches.

Example:

```text
Text    = AAAAA
Pattern = AAA

Answer = [0,1,2]
```

---

## Key Takeaways / Pattern Recognition

- **LPS** stores reusable prefix information—not matched positions.
    
- KMP never backtracks the **text pointer**, only the pattern pointer.
    
- The reusable workflow is:
    
    **Build LPS → Scan Text → Fallback using LPS**
    
- A useful interview insight:
    
    - **Naive** asks _"Start over?"_
        
    - **Rabin–Karp** asks _"Do hashes match?"_
        
    - **KMP** asks _"How much of the previous match can I reuse?"_
        

KMP is fundamentally a **prefix reuse algorithm**, making it the canonical worst-case linear-time string matching technique.