---
Title: Longest Duplicate Substring (Leetcode 1044)
Companies:
  - Google
Topics:
  - Strings
  - Searching
  - Hashing
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Substring
  - Longest
  - Duplicates
  - Binary Search
  - Predicate Search - Basic
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Longest Duplicate Substring (Leetcode 1044)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

Note that in this solution we are not checking character by character after the hash collision which we usually do.

```Python
def longestDupSubstring(s: str) -> str:
    n = len(s)
    nums = [ord(c) - 97 for c in s]

    base = 26
    mod = (1 << 63) - 1

    def check(L):
        h = 0
        power = pow(base, L, mod)

        for i in range(L):
            h = (h * base + nums[i]) % mod

        seen = {h}

        for start in range(1, n - L + 1):
            h = (h * base - nums[start - 1] * power + nums[start + L - 1]) % mod
            h %= mod

            if h in seen:
                return start

            seen.add(h)

        return -1

    low, high = 1, n - 1
    ans_start = -1
    ans_len = 0

    while low <= high:
        mid = (low + high) // 2

        idx = check(mid)

        if idx != -1:
            ans_start = idx
            ans_len = mid
            low = mid + 1
        else:
            high = mid - 1

    return s[ans_start:ans_start + ans_len] if ans_start != -1 else ""
```
**Time complexity** - O(n log n)

**Aux. Space complexity** -  O(n)

---

# Longest Duplicate Substring (Leetcode 1044)

**Tags:** #Strings #BinarySearch #RollingHash #RabinKarp #Hashing #SuffixConcepts #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a string `s`, return **any longest duplicated substring**.

A duplicated substring is a substring that appears **at least twice** (overlap is allowed).

**Examples**

|Input|Output|
|---|---|
|`"banana"`|`"ana"`|
|`"abcd"`|`""`|
|`"aaaaa"`|`"aaaa"`|

> **Duplicate** means same characters in multiple positions; the occurrences need not be disjoint.

---

## Key Idea

A brute-force search over all substrings is impossible (`O(n²)` substrings).

Instead combine two powerful ideas:

1. **Binary Search** on the answer length.
    
2. **Rolling Hash (Rabin–Karp)** to check whether a duplicate substring of a fixed length exists.
    

This is a classic **Binary Search on Answer** pattern.

---

## Binary Search on Answer

We are **not** searching indices—we are searching the **substring length**.

### Answer Space

Where `L` is the candidate duplicate length.

### Monotonic Predicate

Define:

> **`P(L)` = “There exists a duplicate substring of length L.”**

If a duplicate of length `L` exists, then every shorter length also exists because taking prefixes preserves duplication.

This monotonicity makes binary search valid.

---

## Intuition (The WHY)

Take:

```text
banana
```

Length `3` substrings:

|Index|Substring|
|--:|---|
|0|ban|
|1|ana|
|2|nan|
|3|ana|

Duplicate exists → **True**

Length `4`:

|Substring|
|---|
|bana|
|anan|
|nana|

No duplicate → **False**

So the answer is exactly the **last True**.

---

## Rolling Hash (Rabin–Karp)

### Why Not Compare Strings Directly?

For a fixed length `L`, there are `n-L+1` substrings.

Comparing each substring directly costs `O(L)`:

Rolling hash reduces each substring comparison to **O(1)** average.

---

### Polynomial Hash

Treat characters as numbers.

Typical choices:

- `base = 26` or `31`
    
- Large modulus (or 64-bit integer hashing)
    

---

### Rolling Update

Instead of recomputing the next hash:

```text
banana
```

Move one character:

```text
ban → ana
```

Update using the previous hash in constant time.

This makes checking every window of length `L` linear.

---

## Predicate Function

`check(L)` returns the **starting index** of a duplicate substring of length `L`, or `-1` if none exists.

### Python

```python
def check(length):
    seen = set()

    # compute first rolling hash

    for each window:
        if hash in seen:
            return start_index

        seen.add(hash)

    return -1
```

The binary search only needs this predicate.

---

## Complete Python Solution

```python
def longestDupSubstring(s: str) -> str:
    n = len(s)
    nums = [ord(c) - 97 for c in s]

    base = 26
    mod = (1 << 63) - 1

    def check(L):
        h = 0
        power = pow(base, L, mod)

        for i in range(L):
            h = (h * base + nums[i]) % mod

        seen = {h}

        for start in range(1, n - L + 1):
            h = (h * base - nums[start - 1] * power + nums[start + L - 1]) % mod
            h %= mod

            if h in seen:
                return start

            seen.add(h)

        return -1

    low, high = 1, n - 1
    ans_start = -1
    ans_len = 0

    while low <= high:
        mid = (low + high) // 2

        idx = check(mid)

        if idx != -1:
            ans_start = idx
            ans_len = mid
            low = mid + 1
        else:
            high = mid - 1

    return s[ans_start:ans_start + ans_len] if ans_start != -1 else ""
```

> Interview note: Production solutions usually verify collisions by comparing substrings when hashes match, or use double hashing.

---

## Dry Run

**Input**

```text
banana
```

### Binary Search

|Length|Duplicate?|
|--:|---|
|2|✅|
|4|❌|
|3|✅|

Largest valid length = **3**

### Rolling Hash Windows (L = 3)

|Window|Hash|Seen?|
|---|---|---|
|ban|h₁|No|
|ana|h₂|No|
|nan|h₃|No|
|ana|h₂|Yes ✅|

Return `"ana"`.

---

## Why Binary Search Is Correct

We search for the **last True**.

If:

```text
Length 1 : True
Length 2 : True
Length 3 : True
Length 4 : False
Length 5 : False
```

Then:

- `mid` True → move right (try longer)
    
- `mid` False → move left
    

The invariant is:

- Left side contains feasible lengths.
    
- Right side contains impossible lengths.
    

Thus the final answer is the maximum feasible length.

---

## Complexity

Let `n` be the string length.

|Step|Complexity|
|---|--:|
|Binary Search|`O(log n)`|
|Rolling Hash Check|`O(n)`|
|Total|**O(n log n)**|
|Auxiliary Space|**O(n)**|

---

## Common Mistakes

### 1. Binary Searching the Index

Wrong:

- Search substring positions.
    

Correct:

- Search **substring length**.
    

### 2. Recomputing Hash Every Window

This becomes:

Rolling hash updates in constant time.

### 3. Ignoring Hash Collisions

A single hash is probabilistic.

Safer approaches:

- Double hashing
    
- Verify substring equality after a hash match
    

Interviewers usually accept either if acknowledged.

### 4. Using First-True Binary Search

This problem asks for the **maximum valid length**, so it's a **last True** search.

---

## Pattern Recognition

|Problem|Binary Search Answer|
|---|---|
|Koko Eating Bananas|Minimum feasible speed|
|Split Array Largest Sum|Minimum feasible maximum|
|Aggressive Cows|Maximum feasible distance|
|**Longest Duplicate Substring**|**Maximum feasible length**|

The reusable pattern is:

> **Search the answer length + design an efficient feasibility predicate.**

Here the predicate is implemented using **Rolling Hash**, making this one of the most important string applications of Binary Search on Answer.