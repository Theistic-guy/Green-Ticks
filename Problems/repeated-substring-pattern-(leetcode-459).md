---
Title: Repeated Substring Pattern (Leetcode 459)
Companies:
  - Grab
  - Myntra
  - eBay
  - Amazon
  - Google
  - tcs
  - Bloomberg
  - Meta
  - Microsoft
Topics:
  - Strings
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - String Matching
Link: https://leetcode.com/problems/repeated-substring-pattern/description/
Rating:
  - ⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Repeated Substring Pattern (Leetcode 459)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def repeatedSubstringPattern(s):
    return s in (s + s)[1:-1]

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

see proof at the very last

---
# Repeated Substring Pattern (Leetcode 459)

**Tags:** #Strings #KMP #LPS #PatternMatching #PrefixFunction #Modulo #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a non-empty string `s`, determine whether it can be constructed by repeating one of its substrings **two or more times**.

**Examples**

|Input|Output|Repeating Unit|
|---|---|---|
|`"abab"`|✅|`"ab"`|
|`"abcabcabc"`|✅|`"abc"`|
|`"aba"`|❌|—|
|`"aaaa"`|✅|`"a"`|

---

## Key Idea

There are **two important interview approaches**:

1. **String Doubling Trick** _(beautiful one-liner, easy to explain)_
    
2. **KMP / LPS** _(expected DSA solution and the reusable pattern)_
    

The KMP approach reveals the underlying mathematics of repeated patterns.

---

# Approach 1 — String Doubling Trick

## Intuition (The WHY)

Suppose the string is built by repetition:

```text
s = "abab"

s + s = "abababab"
```

Remove the first and last character:

```text
"bababa"
```

The original string still appears inside.

### Why?

A repeated string has **cyclic symmetry**. Shifting it by one position still preserves one complete occurrence.

If the string is **not** repetitive:

```text
"aba"

"abaaba"

↓

"baab"
```

`"aba"` no longer appears.

### Python

```python
def repeatedSubstringPattern(s):
    return s in (s + s)[1:-1]
```

### Complexity

- **Time:** `O(n)`
    
- **Auxiliary Space:** `O(n)`
    

> Elegant, but interviewers often ask for the KMP explanation afterward.

---

# Approach 2 — KMP (LPS Array)

## Core Insight

If a string is made by repeating a smaller pattern, then it has a **longest proper prefix which is also a suffix**.

Example:

```text
s = "abcabc"

Prefix = "abc"
Suffix = "abc"
```

The LPS array captures exactly this information.

---

## LPS Refresher

LPS[i] = length of the **Longest Proper Prefix** that is also a **Suffix** for `s[0...i]`.

Example:

```text
s = "abab"

Index : 0 1 2 3
Char  : a b a b
LPS   : 0 0 1 2
```

The final value:

```text
LPS[-1] = 2
```

means:

```text
ab | ab
↑    ↑
prefix suffix
```

---

## The Mathematical Condition

Let:

- `n = len(s)`
    
- `l = LPS[-1]`
    

Then the repeating unit has length:

The string is repetitive **iff**:

This is the entire decision rule.

---

## Why Does `p = n - LPS`?

Example:

```text
abcabcabc
```

Length:

Longest prefix-suffix:

```text
abcabc
```

Length:

Therefore:

Pattern:

```text
abc
```

repeated three times.

The unmatched portion after removing the common prefix/suffix is exactly one repetition.

---

## Optimal KMP Solution

### Step 1 — Build LPS

```python
def buildLPS(s):
    n = len(s)
    lps = [0] * n

    length = 0
    i = 1

    while i < n:

        if s[i] == s[length]:
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

### Step 2 — Check the Formula

```python
def repeatedSubstringPattern(s):
    lps = buildLPS(s)

    longest = lps[-1]
    n = len(s)

    return longest > 0 and n % (n - longest) == 0
```

---

## Dry Run

**Input**

```text
s = "ababab"
```

### LPS

|Index|Char|LPS|
|--:|---|--:|
|0|a|0|
|1|b|0|
|2|a|1|
|3|b|2|
|4|a|3|
|5|b|4|

Final values:

Pattern length:

Check:

Answer = **True**

Pattern = `"ab"`.

---

## Why `"aba"` Fails

```text
s = aba
```

LPS:

```text
0 0 1
```

So:

Candidate length:

Check:

Not divisible ⇒ cannot be formed by repeating one substring.

---

## Complexity

|Approach|Time|Auxiliary Space|
|---|--:|--:|
|String Doubling|**O(n)**|**O(n)**|
|KMP (LPS)|**O(n)**|**O(n)**|

---

## Common Mistakes

### 1. Checking Only `LPS > 0`

Wrong:

```python
return lps[-1] > 0
```

Counterexample:

```text
aba
```

LPS is `1`, but the answer is **False**.

The divisibility check is essential.

### 2. Using Prefix Length as Pattern Length

Wrong:

Correct:

The repeated unit is the **remaining unmatched length**, not the prefix itself.

### 3. Forgetting the Proper Prefix Rule

The prefix must be **proper**, meaning it cannot equal the whole string.

That's why LPS never equals `n`.

---

## Pattern Recognition

|Problem|Core Pattern|
|---|---|
|KMP Search|LPS construction|
|Longest Prefix-Suffix|LPS|
|Repeated Substring Pattern|`n - LPS`|
|Shortest Palindrome|Prefix-function / KMP variant|

The reusable interview insight is:

> **Whenever a string asks about repeated structure, borders, or periodicity, think of the LPS array.**

The key formula to remember is:

and the string is repetitive iff:


---

# Proof of two approaches


  

## 💡 Overview

The core challenge of this problem is identifying **structural periodicity** in a string. While intuitive to spot visually, proving it algorithmically requires leveraging symmetry. Below are the definitive logical explanations for the two optimal approaches (`O(N)`).

  

---

  

## 🚗 Approach 1: The String Concatenation Trick `(s in (s + s)[1:-1])`

  

### 🧠 The Core Intuition

If a string $s$ is built from a repeated substring pattern, it possesses **rotational symmetry**. Shifting the string by the length of its base repeating unit yields the exact same string.

  

### 🤝 The Interview Justification (Visual Shift Proof)

Instead of relying on advanced combinatorics (like the Lyndon-Schützenberger theorem), explain this using a **commuting block argument**:

  

1. **Define the Shift ($k$):** If $s$ exists inside $s + s$ *without* using the exact first or last characters, it must appear at some shifted index $k$ (where $0 < k < n$).

2. **The Split ($A + B$):** Let's split the original string $s$ into two parts based on that shift length $k$:

   * $A$ = Prefix of length $k$

   * $B$ = Suffix of length $n - k$

   * Therefore, $s = A + B$.

  

3. **The Concatenation Layout:** When we double the string and shave the outer boundaries, we look at the internal alignment:

   ```text

   Original s + s:   [  A  ][    B    ][  A  ][    B    ]

   Shaved [1:-1]:     _ A  ][    B    ][  A  ][ B _       <-- Search window

   ```

4. **The Alignment Match:** For $s$ to be found in the middle window, it must bridge the two copies, matching the suffix of the first copy ($B$) and the prefix of the second copy ($A$). This forms the internal string **$B + A$**.

5. **The Algebraic Deduction:** For the search to return `True`, the internal string must equal our original string $s$:

   $$B + A = A + B$$

6. **The Contradiction for Non-Periodic Strings:** The equation $BA = AB$ means these two blocks **commute**. Two strings can only commute if they are both formed by repeating the exact same, smaller base component $x$.

   * **Counter-example (`s = "aba"`):** If $A =    ext{"a"}$ and $B =   ext{"ba"}$, then $AB =  ext{"aba"}$ but $BA =   ext{"baa"}$. They do not commute ($BA

eq AB$), so `"aba"` can never be found in the middle.

  

---

  

## ⛓️ Approach 2: The KMP LPS Array Approach

  

### 🧠 The Core Intuition

The **LPS (Longest Proper Prefix which is also a Suffix)** array tracks structural symmetry. If a string is perfectly periodic, its maximum prefix-suffix overlap will leave behind an unmatched segment exactly equal to the fundamental repeating unit.

  

### 🧩 The Multi-Step Proof

  

#### Step 1: The Domino Effect (Why $k = n - L$ is the Pattern Length)

Let $n$ be the string length and $L =  ext{LPS}[n-1]$ be the maximum overlap.

```text

String s:   |-- k --|----------- L -----------|  (Total length = n)

Prefix:     [======= identical part ==========]

Suffix:             [======= identical part ==========]

```

* The suffix leaves an empty gap of size $k = n - L$ at the beginning of the string.

* Because the prefix and suffix match character-by-character, index $0$ of the prefix matches index $0$ of the suffix.

* However, index $0$ of the suffix is actually index $k$ of the overall string ($s[0] == s[k]$).

* This triggers a **domino effect** across the entire overlap: $s[i] == s[i + k]$ for all valid indices. This proves the string is strictly periodic with a cycle period of $k$.

  

#### Step 2: The Tail Validation (Why $n \% k == 0$ is Mandatory)

The domino effect only proves the string is periodic; it does not guarantee the pattern finishes cleanly.

* **Counter-example (`s = "abcabcab"`):** Here, $n = 8$, $L = 5$, so $k = 8 - 5 = 3$. The domino effect works perfectly ($s[i] == s[i+3]$), but the string cuts off mid-pattern at the end.

* **Justification:** Enforcing `n % k == 0` ensures the cycle completes a whole integer number of times, leaving no incomplete partial patterns at the tail.

  

#### Step 3: The Multiplicity Guard (Why $L > 0$ is Mandatory)

* **Counter-example (`s = "abcdef"`):** Here, $L = 0$, so $k = 6 - 0 = 6$. The math $6 \% 6 == 0$ passes.

* **Justification:** A period of $k = n$ means the repeating pattern is the entire string itself (repeated only once). The problem demands a *substring* pattern, meaning it must repeat **at least twice**. Requiring $L > 0$ ensures $k < n$, forcing at least two full iterations.

  

---

  

## 📊 Summary Comparison

  

| Metric | String Concatenation Trick | KMP LPS Array Approach |

| :--- | :--- | :--- |

| **Time Complexity** | $O(N)$ (Built-in string search optimization) | $O(N)$ (Single-pass array generation) |

| **Space Complexity** | $O(N)$ (Allocates memory for $2N$ string) | $O(N)$ (Allocates space for `lps` integer array) |

| **Conceptual Core** | Cyclic shift commutativity ($AB = BA$) | Internal boundary symmetry & index chaining |