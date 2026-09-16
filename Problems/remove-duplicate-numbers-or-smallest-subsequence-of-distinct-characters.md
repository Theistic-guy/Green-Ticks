---
Title: Remove Duplicate Letters / Smallest Subsequence of Distinct Characters (Leetcode 316 / 1081)
Companies:
  - Expedia
  - Factset
  - Increff
  - ByteDance
  - Paytm
  - tiktok
  - Zoho
  - Amazon
  - Bloomberg
  - DE Shaw
  - Google
  - Microsoft
  - Meta
Topics:
  - Strings
  - Greedy
  - Hashing
  - Stack
  - Monotonic Stack
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Duplicates
  - Smallest
  - Subsequence
  - Lexicographical
Link: https://leetcode.com/problems/remove-duplicate-letters/description/
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Remove Duplicate Letters / Smallest Subsequence of Distinct Characters (Leetcode 316 / 1081)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def removeDuplicateLetters(s: str) -> str:
    last = {ch: i for i, ch in enumerate(s)}

    stack = []
    visited = set()

    for i, ch in enumerate(s):

        if ch in visited:
            continue

        while (
            stack
            and stack[-1] > ch
            and last[stack[-1]] > i
        ):
            visited.remove(stack.pop())

        stack.append(ch)
        visited.add(ch)

    return "".join(stack)
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---

# Remove Duplicate Letters / Smallest Subsequence of Distinct Characters (Leetcode 316 / 1081)

**Tags:** #Stack #MonotonicStack #Greedy #Strings #Hashing #LexicographicalOrder #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a string `s`, remove duplicate letters so that:

1. Every distinct character appears **exactly once**.
    
2. The resulting string is the **smallest lexicographical subsequence** possible.
    

**Examples**

|Input|Output|
|---|---|
|`"bcabc"`|`"abc"`|
|`"cbacdcbc"`|`"acdb"`|
|`"abacb"`|`"abc"`|

> This is the same problem as **LC 1081 – Smallest Subsequence of Distinct Characters**.

---

## Core Insight

We must satisfy **two constraints simultaneously**:

- Keep **only one occurrence** of each character.
    
- Make the final subsequence **lexicographically smallest**.
    

This naturally leads to a **Greedy Monotonic Stack**.

---

## Key Idea

Maintain:

- **Stack** → current answer (monotonically increasing lexicographically)
    
- **lastOccurrence[c]** → last index where each character appears
    
- **visited[c]** → whether the character is already in the stack
    

For each character:

1. Skip it if already in the answer.
    
2. While the top is larger **and** appears again later, pop it.
    
3. Push the current character.
    

The crucial condition is:

> **Only remove a character if it can still be recovered later.**

---

## Intuition (The WHY)

Consider:

```text
cbacdcbc
```

Process left to right.

|Char|Stack|
|---|---|
|c|c|
|b|b|
|a|a|
|c|ac|
|d|acd|
|c|acd|
|b|acdb|

Final answer:

```text
acdb
```

Why was `c` removed when `b` arrived?

Because:

- `b < c`
    
- Another `c` exists later
    

So replacing the earlier `c` with `b` produces a smaller prefix without losing `c` permanently.

---

## The Three Conditions for Popping

Never memorize—understand them.

We pop while all three are true:

```python
while stack and stack[-1] > ch and last[top] > i:
```

### Condition 1 — Stack not empty

Need something to compare.

### Condition 2 — `stack[-1] > ch`

The current character is lexicographically smaller.

```text
Stack: c
Current: b
```

We prefer `b` before `c`.

### Condition 3 — Top appears again later

```text
cbacdcbc
 ^
```

If another `c` exists later, we can safely remove this one.

If not, popping would lose `c` forever.

This is the **entire greedy proof**.

---

## Optimal Greedy Algorithm

### Python Solution

```python
def removeDuplicateLetters(s: str) -> str:
    last = {ch: i for i, ch in enumerate(s)}

    stack = []
    visited = set()

    for i, ch in enumerate(s):

        if ch in visited:
            continue

        while (
            stack
            and stack[-1] > ch
            and last[stack[-1]] > i
        ):
            visited.remove(stack.pop())

        stack.append(ch)
        visited.add(ch)

    return "".join(stack)
```

---

## Dry Run

**Input**

```text
bcabc
```

Last occurrences:

|Char|Last Index|
|---|--:|
|a|2|
|b|3|
|c|4|

### Iteration

|Character|Action|Stack|
|---|---|---|
|b|Push|b|
|c|Push|bc|
|a|Pop c, Pop b, Push a|a|
|b|Push|ab|
|c|Push|abc|

Answer:

```text
abc
```

---

## Why the Greedy Choice Is Correct

Suppose the stack top is:

```text
d
```

Current character:

```text
b
```

If another `d` exists later:

```text
... d ... b ... d ...
```

Choosing the earlier `d` only makes the prefix larger.

Replacing it with `b` gives a strictly smaller lexicographical subsequence while still preserving all distinct characters.

Thus every pop is **always beneficial**.

This is a classic **exchange argument**.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(26)**|

Each character is pushed and popped at most once.

Since the alphabet is fixed (`26` lowercase letters), the auxiliary space is constant.

---

## Common Mistakes

### 1. Popping Without Checking Future Occurrence

Wrong:

```python
while stack[-1] > ch:
```

This may permanently delete a character.

Always check:

```python
last[stack[-1]] > i
```

### 2. Forgetting `visited`

Without it:

```text
bcabc
```

The stack becomes:

```text
abcbc
```

Duplicates remain.

### 3. Using Frequency Instead of Last Index

Many implementations decrement frequencies instead of storing last occurrence.

Equivalent condition:

```python
remaining[top] > 0
```

Both approaches are valid; `lastOccurrence` is usually easier to reason about.

---

## Relationship to Previous Problems

|Problem|Core Pattern|
|---|---|
|Next Permutation|Greedy lexicographic construction|
|Largest Number|Custom comparator for lexicographic optimum|
|Remove Duplicate Letters|Greedy + Monotonic Stack|
|Sliding Window Maximum|Monotonic structure|

The stack here is **monotonic lexicographically**, not numerically.

---

## Pattern Recognition

Use this pattern whenever the problem says:

- **Smallest lexicographical subsequence**
    
- **Remove duplicates while preserving order**
    
- **Keep one occurrence of each character**
    
- **Lexicographically minimal answer**
    

The reusable recipe is:

1. Track the **last occurrence**.
    
2. Maintain a **visited** set.
    
3. Use a **monotonic stack**.
    
4. Pop only if the character can be recovered later.
    

> **Greedy Rule:** Never keep a larger character before a smaller one if the larger character still appears later.