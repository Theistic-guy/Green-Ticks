---
Title: Shortest Palindrome (Leetcode 214)
Companies: [Pocket Gems, Accenture, Bloomberg, Google, Meta, Uber, Microsoft, Amazon]
  
Topics:
  - Strings
  - Greedy
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - String Matching
  - Palindrome
  - Shortest
Link: https://leetcode.com/problems/shortest-palindrome/
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Shortest Palindrome (Leetcode 214)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def shortestPalindrome(s: str) -> str:
    if not s:
        return s

    rev = s[::-1]
    t = s + "#" + rev

    lps = [0] * len(t)

    length = 0
    i = 1

    while i < len(t):
        if t[i] == t[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            i += 1

    longest = lps[-1]

    return rev[:len(s) - longest] + s

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---


# Shortest Palindrome (Leetcode 214)

**Tags:** #Strings #KMP #LPS #PrefixFunction #Palindrome #PatternMatching #Greedy #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a string `s`, you may **add characters only in front** of the string. Return the **shortest palindrome** that can be formed.

**Examples**

|Input|Output|
|---|---|
|`"aacecaaa"`|`"aaacecaaa"`|
|`"abcd"`|`"dcbabcd"`|
|`"race"`|`"ecarace"`|

> Only **prefix insertion** is allowed. You cannot insert in the middle or at the end.

---

## Core Insight

We need the **longest palindromic prefix**.

Why?

Suppose:

```text
s = aacecaaa
```

The longest prefix that's already a palindrome is:

```text
aacecaa
```

Only the remaining suffix:

```text
a
```

needs to be mirrored to the front:

```text
a + aacecaaa = aaacecaaa
```

> **The more we preserve at the front, the fewer characters we need to add.**

---

## Reduction to an LPS Problem

The challenge is finding the **longest prefix of `s` that is also a palindrome** in **O(n)**.

Construct:

Example:

```text
s        = abcd
reverse  = dcba

T = abcd#dcba
```

Now compute the **LPS array** of `T`.

The final LPS value gives:

> **Length of the longest palindromic prefix of `s`.**

---

## Why Does This Work?

Take:

```text
s = aacecaaa
```

Construct:

```text
aacecaaa#aaacecaa
```

A prefix of `T` must come entirely from the original string, while a suffix comes entirely from the reversed string.

If they match, we're matching:

- Prefix of `s`
    
- Reverse of the same prefix
    

Which means that prefix is a **palindrome**.

The separator `#` prevents matches from crossing between the two halves.

---
## Why to add separator?

The special character `#` acts as a **sentinel or firewall**. Its main purpose is to prevent the KMP prefix matching logic from "bleeding" past the boundary of the original string into the reversed string.

Without it, the algorithm can mistakenly match a suffix that spans across _both_ strings, leading to an incorrect, inflated palindromic prefix length.

The Problematic Case: `s = "aaaaa"` (or any single-character repetition)

Let's look at what happens if we **do not** use the `#` separator for `s = "aaaaa"`.

- `s = "aaaaa"` (length = 5)
- `reverse(s) = "aaaaa"`

1. Without `#` (The Broken Way)

If we just concatenate them directly: `combined = s + reverse(s) = "aaaaaaaaaa"` (10 'a's).

When KMP computes the **LPS (Longest Prefix Suffix)** value for the last character of `combined`:

- It looks for the longest proper prefix that matches a proper suffix.
- For a string of 10 'a's, the longest proper prefix matching a suffix has a length of **9** (`"aaaaaaaaa"`).
- The algorithm concludes that the longest palindromic prefix has a length of 9.

However, the maximum possible length of a palindrome prefix for `s` is its own length, **5**. Because there was no boundary, the prefix match crossed over the center line and counted characters from the reversed side.

2. With `#` (The Correct Way)

If we add the separator: `combined = "aaaaa#aaaaa"`

When KMP computes the LPS value for the last character:

- The prefix _must_ match the suffix exactly.
- Because the prefix starts from index 0 (`"a..."`), it can never contain the `#` character (since `#` only appears once in the middle).
- Therefore, the matching suffix can also **never** include or cross over the `#` character.
- The matching process is safely forced to stop at the boundary, correctly yielding a maximum LPS length of **5**.

---

## Visual Example

For:

```text
abcd#dcba
```

```text
a b c d # d c b a
↑               ↑
```

Only `"a"` matches.

LPS ends with:

```text
1
```

Meaning the longest palindromic prefix has length **1**.

---

## Algorithm

1. Reverse the string.
    
2. Create `s + '#' + reversed`.
    
3. Build the LPS array.
    
4. Let `L = LPS[-1]`.
    
5. Characters after `L` form the non-palindromic suffix.
    
6. Reverse that suffix and prepend it.
    

---

## Optimal Python Solution

```python
def shortestPalindrome(s: str) -> str:
    if not s:
        return s

    rev = s[::-1]
    t = s + "#" + rev

    lps = [0] * len(t)

    length = 0
    i = 1

    while i < len(t):
        if t[i] == t[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            i += 1

    longest = lps[-1]

    return rev[:len(s) - longest] + s
```

---

## Dry Run

### Example 1

```text
s = abcd
```

Construct:

```text
abcd#dcba
```

LPS:

|Index|Char|LPS|
|--:|---|--:|
|0|a|0|
|1|b|0|
|2|c|0|
|3|d|0|
|4|#|0|
|5|d|0|
|6|c|0|
|7|b|0|
|8|a|1|

Longest palindromic prefix:

```text
a
```

Remaining suffix:

```text
bcd
```

Reverse it:

```text
dcb
```

Result:

```text
dcbabcd
```

---

### Example 2

```text
s = aacecaaa
```

Longest palindromic prefix:

```text
aacecaa
```

Remaining:

```text
a
```

Answer:

```text
aaacecaaa
```

---

## Why the Separator `#` Is Necessary

Without a separator:

```text
abcddcba
```

KMP could incorrectly match characters that span across the boundary.

Using:

```text
abcd#dcba
```

ensures every prefix comes only from `s` and every suffix comes only from `reverse(s)`.

This makes the LPS interpretation valid.

---

## Correctness Proof

Let:

- `L = LPS[-1]`
    

Then:

1. `L` is the longest prefix of `s` matching a suffix of `reverse(s)`.
    
2. That suffix is exactly the reverse of the prefix.
    
3. Therefore, the prefix of length `L` is a palindrome.
    
4. Any shorter prefix preserves fewer characters and requires adding more.
    
5. Hence prepending the reverse of the remaining suffix yields the **shortest** palindrome.
    

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

- Reverse: `O(n)`
    
- LPS construction: `O(n)`
    

---

## Common Mistakes

### 1. Searching for the Longest Palindromic Substring

Wrong objective.

We need the **longest palindromic prefix**, not the longest palindrome anywhere.

Example:

```text
abcdc
```

Longest substring = `"cdc"`

Longest prefix = `"a"`

### 2. Forgetting the Separator

Wrong:

```text
s + reverse(s)
```

Correct:

```text
s + "#" + reverse(s)
```

The separator prevents false matches.

### 3. Appending Instead of Prepending

The problem only allows insertion at the **front**.

Correct:

```python
reverse_suffix + s
```

---

## Relationship to Previous Problems

|Problem|Role of LPS|
|---|---|
|KMP Search|Pattern matching|
|Repeated Substring Pattern|Detect periodicity|
|Shortest Palindrome|Longest palindromic prefix|

Notice the common pattern:

> **Transform the string so that the desired property becomes a prefix-suffix match, then compute LPS once.**

This is one of the most elegant applications of the KMP prefix function.

---

## Key Takeaways / Pattern Recognition

- **Add characters only to the front** → Preserve the **longest palindromic prefix**.
    
- Transform using:
    

- The final LPS value directly gives the palindrome length.
    
- This is a classic example of using **KMP as a string analysis tool**, not for searching.


