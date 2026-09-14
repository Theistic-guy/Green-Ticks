---
Title: Palindrome number
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Palindrome Number

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def isPalindrome(x):
    if x < 0:
        return False

    original = x
    rev = 0

    while x > 0:
        digit = x % 10
        rev = rev * 10 + digit
        x //= 10

    return original == rev

```
**Time complexity** - O(D) , D is no of digits

**Aux. Space complexity** -  O(1)

---

# Lexicographic Rank of a String

**Tags:** #Strings #Mathematics #Combinatorics #Factorial #Counting #FrequencyArray #Interview-Pattern #FAANG

## Problem Statement

Given a string `s`, find its **1-based lexicographic rank** among all permutations of its characters.

Assume **all characters are distinct** unless stated otherwise.

**Example**

|String|Rank|
|---|--:|
|`"ABC"`|1|
|`"ACB"`|2|
|`"BAC"`|3|
|`"CBA"`|6|

> Lexicographic rank = the position of the string if all permutations are sorted alphabetically.

---

## Key Idea

At each position, count **how many smaller characters could have appeared here**.

For every smaller character, all remaining characters can be arranged in:

ways.

So the contribution of each position is:

Start with rank = **1** because the smallest permutation has rank 1.

---

## Intuition (The WHY)

Find the rank of:

```text
STRING = CAB
```

All permutations:

|Rank|Permutation|
|--:|---|
|1|ABC|
|2|ACB|
|3|BAC|
|4|BCA|
|5|CAB|
|6|CBA|

Before `"CAB"`:

- First letter could be `A` → 2 permutations
    
- First letter could be `B` → 2 permutations
    

Total before it = **4**

Rank = **5**

The algorithm computes exactly this without generating permutations.

---

## Mathematical Formula

For each index `i`:

The only challenge is efficiently finding the number of smaller unused characters.

---

## Approach — Frequency Array + Prefix Counts

Use an ASCII frequency array of size **256**.

### Algorithm

1. Compute factorial `n!`.
    
2. Store frequencies of characters.
    
3. Convert frequencies into **prefix counts**.
    
4. For each character:
    
    - Divide factorial by remaining length.
        
    - Count smaller unused characters.
        
    - Add contribution.
        
    - Remove the current character from future counts.
        

### Python Solution

```python
def lexicographicRank(s):
    n = len(s)
    CHAR = 256

    # factorial
    fact = 1
    for i in range(2, n + 1):
        fact *= i

    # frequency
    count = [0] * CHAR
    for ch in s:
        count[ord(ch)] += 1

    # prefix counts
    for i in range(1, CHAR):
        count[i] += count[i - 1]

    rank = 1

    for i in range(n):
        fact //= (n - i)

        smaller = count[ord(s[i]) - 1] if ord(s[i]) > 0 else 0
        rank += smaller * fact

        # remove current character
        for j in range(ord(s[i]), CHAR):
            count[j] -= 1

    return rank
```

---

## Dry Run

**String:** `"CAB"`

### Step 1

Characters smaller than `C`:

```text
A, B
```

Count = **2**

Remaining positions = 2

Rank = **5**

### Step 2

Current suffix:

```text
AB
```

Smaller than `A` = 0

Contribution = 0

### Step 3

Current suffix:

```text
B
```

Smaller than `B` = 0

Final Rank = **5**

---

## Another Example

**String:** `"BACD"`

|Position|Smaller|Remaining|Contribution|
|---|--:|--:|--:|
|B|1|3!|6|
|A|0|2!|0|
|C|0|1!|0|
|D|0|0!|0|

Rank:

---

## Why Prefix Counts?

Suppose remaining characters are:

```text
A C D F
```

Frequency array:

|Char|Count|
|---|--:|
|A|1|
|C|1|
|D|1|
|F|1|

Prefix counts become:

|Character|Smaller-or-equal Count|
|---|--:|
|B|1|
|C|2|
|D|3|
|E|3|
|F|4|

Now:

```python
smaller = count[ord(ch)-1]
```

gives the number of unused characters smaller than `ch` in **O(1)** time.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(256 × n)** ≈ **O(n)**|
|Auxiliary Space|**O(256)** ≈ **O(1)**|

The update loop runs over 256 ASCII characters, which is constant.

---

## Important Variation — Duplicate Characters

If characters repeat, the previous formula **overcounts**.

Example:

```text
AAB
```

Naively treating both `A`s as distinct gives:

```text
A₁A₂B
A₂A₁B
```

These are the **same string**.

The correction is:

where `fᵢ` are character frequencies.

This version is substantially more complex and is often asked as a follow-up.

---

## Common Mistakes

### 1. Forgetting Rank Starts at 1

Wrong:

```python
rank = 0
```

Correct:

```python
rank = 1
```

The lexicographically smallest permutation has rank **1**, not 0.

### 2. Not Removing Used Characters

After processing `'C'`, it must no longer contribute to future prefix counts.

### 3. Using This Algorithm with Duplicates

The distinct-character formula is **incorrect** for strings like `"AABC"` unless duplicate factorials are incorporated.

---

## Key Takeaways / Pattern Recognition

- Lexicographic rank is a **counting problem**, not a permutation-generation problem.
    
- At each position:
    
    1. Count smaller unused characters.
        
    2. Multiply by remaining factorial.
        
    3. Remove the current character.
        
- The reusable interview formula is:
    
- If duplicates appear, divide by the factorial of repeated character frequencies.