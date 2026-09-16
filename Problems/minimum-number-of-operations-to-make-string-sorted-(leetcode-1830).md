---
Title: Minimum Number of Operations to Make String Sorted (Leetcode 1830)
Companies:
  - Not Specified
Topics:
  - Maths
  - Combinatorics
  - Strings
  - Greedy
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Factorial
  - Sorted
  - Minimum
  - Lexicographical
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Minimum Number of Operations to Make String Sorted (Leetcode 1830)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
MOD = 10**9 + 7

def makeStringSorted(s):
    n = len(s)

    fact = [1] * (n + 1)
    invFact = [1] * (n + 1)

    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    invFact[n] = pow(fact[n], MOD - 2, MOD)

    for i in range(n, 0, -1):
        invFact[i - 1] = invFact[i] * i % MOD

    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - 97] += 1

    ans = 0

    for i, ch in enumerate(s):
        cur = ord(ch) - 97

        for smaller in range(cur):
            if freq[smaller] == 0:
                continue

            freq[smaller] -= 1

            ways = fact[n - i - 1]
            for f in freq:
                ways = ways * invFact[f] % MOD

            ans = (ans + ways) % MOD

            freq[smaller] += 1

        freq[cur] -= 1

    return ans

```
**Time complexity** - O(n) 

**Aux. Space complexity** -  O(n)

---

# Minimum Number of Operations to Make String Sorted (Leetcode 1830)

**Tags:** #Combinatorics #LexicographicalOrder #Permutation #Factorials #ModularArithmetic #Counting #Greedy #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a string `s`, one operation consists of replacing the string with its **previous lexicographical permutation**. Return the **minimum number of operations** required to transform `s` into the lexicographically smallest permutation of its characters.

Return the answer modulo **10⁹ + 7**.

**Examples**

|Input|Output|
|---|--:|
|`"cba"`|5|
|`"aabaa"`|2|
|`"cdbea"`|63|

---

## Core Insight

We are **not simulating previous permutations**.

Instead, compute the **lexicographic rank** of `s` among **all distinct permutations**.

> **Answer = Number of distinct permutations lexicographically smaller than `s`.**

This is the same idea as asking:

> _"How many valid permutations come before this string in dictionary order?"_

---

## Intuition (The WHY)

Consider:

```text
s = "BAC"
```

How many permutations come before it?

```
ABC
ACB
BAC   ← current string
```

Rank (0-indexed) = **2**, so it takes **2 previous-permutation operations** to reach `"ABC"`.

With duplicate letters, ordinary factorial counting overcounts, so we divide by repeated frequencies.

---

## Counting Smaller Permutations

Process the string **left to right**.

At position `i`:

1. Try placing every character **smaller than `s[i]`** that is still available.
    
2. Count how many distinct permutations can be formed afterward.
    
3. Add them to the answer.
    
4. Consume `s[i]` and continue.
    

### Formula

If `rem` characters remain after fixing one character:

This is the number of **distinct permutations** of the remaining multiset.

---

## Example

**s = `"aabaa"`**

Available frequencies initially:

|Char|Count|
|---|--:|
|a|4|
|b|1|

### Position 0 (`a`)

No smaller character exists.

Contribution = **0**

### Position 1 (`a`)

Still no smaller character.

Contribution = **0**

### Position 2 (`b`)

Smaller available character: **`a`**

If we place `a`:

```
aaaba
```

Remaining multiset:

```
a a b
```

Permutations:

But one `a` has already been used for this position, so the remaining frequencies become `{a:1,b:1}`:

Those two permutations are:

```
aaaba
aaaab
```

Contribution = **2**

Final answer = **2**

---

## Greedy Structure

At every position:

```text
Current Prefix

a a b a a
    ↑
```

Try every smaller available character:

```text
a a a _ _
```

Count all completions, then continue with the original character.

This is analogous to **digit DP** and **lexicographic rank** problems.

---

## Optimal Approach

### Precompute

- Factorials
    
- Modular inverse factorials
    
- Character frequencies
    

### Python Solution

```python
MOD = 10**9 + 7

def makeStringSorted(s):
    n = len(s)

    fact = [1] * (n + 1)
    invFact = [1] * (n + 1)

    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    invFact[n] = pow(fact[n], MOD - 2, MOD)

    for i in range(n, 0, -1):
        invFact[i - 1] = invFact[i] * i % MOD

    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - 97] += 1

    ans = 0

    for i, ch in enumerate(s):
        cur = ord(ch) - 97

        for smaller in range(cur):
            if freq[smaller] == 0:
                continue

            freq[smaller] -= 1

            ways = fact[n - i - 1]
            for f in freq:
                ways = ways * invFact[f] % MOD

            ans = (ans + ways) % MOD

            freq[smaller] += 1

        freq[cur] -= 1

    return ans
```

---

## Why Modular Inverse?

We need to compute:

Division is not allowed modulo a prime.

Using Fermat's Little Theorem:

So:

This converts every division into multiplication.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(26 × n)**|
|Auxiliary Space|**O(n + 26)**|

Since the alphabet size is constant (`26`), this is effectively **O(n)**.

---

## Common Mistakes

### 1. Simulating Previous Permutations

Impossible for `n ≤ 3000`.

The number of permutations is astronomical.

### 2. Ignoring Duplicate Letters

Wrong:

Correct for `"AAB"`:

Always divide by repeated frequencies.

### 3. Performing Integer Division Under Modulo

Incorrect:

```python
ways = fact[n] // fact[f]
```

Correct:

```python
ways = fact[n] * invFact[f] % MOD
```

Use modular inverses.

---

## Relationship to Previous Problems

|Problem|Core Idea|
|---|---|
|Next Permutation (LC 31)|Construct immediate next permutation|
|Largest Number (LC 179)|Lexicographic ordering via comparator|
|**Make String Sorted (LC 1830)**|Count lexicographically smaller permutations|

The connection is that all three revolve around **lexicographical order**, but LC 1830 is fundamentally a **combinatorial ranking** problem rather than a permutation generation problem.

---

## Key Takeaways / Pattern Recognition

- **Minimum previous-permutation operations** = **lexicographic rank**.
    
- Process the string greedily from left to right.
    
- At each position, count all permutations formed by placing a smaller available character.
    
- Duplicate letters require the **multiset permutation formula**:
    

This is the canonical FAANG problem combining **greedy lexicographic ranking + combinatorics + modular arithmetic**.