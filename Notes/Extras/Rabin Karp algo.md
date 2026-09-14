####  📝 Note:

Abdul bari mentioned either keeping sum of the characters ascii or numerical ordering (1,2,3..) or multiplying by the base of 10 starting with MSB

-> "abcd" ➡️ 1 . 10 ^3  + 2 . 10^2 + 3 . 10 ^1 + 4 . 10^0

Rolling hash would be subtracting the left most (here a => 1 * 10^3) and multiplying by 10 and then adding the new value of the incoming char.


# Rabin–Karp Algorithm

**Tags:** #Strings #PatternMatching #RollingHash #SlidingWindow #Hashing #ModuloArithmetic #Interview-Pattern #FAANG

## Problem Statement

Given a **text** `txt` of length `n` and a **pattern** `pat` of length `m`, find all starting indices where the pattern occurs.

Unlike Naive Search, Rabin–Karp compares **hash values** instead of characters at every alignment, making it efficient for searching multiple patterns and large texts.

---

## Key Idea

Instead of comparing strings directly:

1. Compute the hash of the pattern.
    
2. Compute the hash of the first window of the text.
    
3. Slide the window using a **rolling hash** (O(1) update).
    
4. Only if the hashes match, perform a character-by-character verification.
    

> **Hash Match ≠ String Match.** Verification is necessary because of hash collisions.

---

## Intuition (The WHY)

Pattern:

```text
ABC
```

Text:

```text
ABCDABC
```

Instead of comparing:

```text
ABC
BCD
CDA
DAB
ABC
```

Compare hashes:

|Window|Hash|
|---|---|
|ABC|294|
|BCD|361|
|CDA|428|
|DAB|335|
|ABC|294 ✅|

Only the matching hash is verified.

The expensive character comparison happens **rarely**.

---

## Polynomial Rolling Hash

Treat characters as digits in a number.

For lowercase English:

- `a = 1`
    
- `b = 2`
    
- ...
    
- `z = 26`
    

Choose:

- Base = `d` (commonly 256 for ASCII)
    
- Prime = `q` (large prime)
    

Hash of length `m`:

Example:

The modulo keeps values bounded.

---

## Rolling Hash (Core Formula)

Suppose current window is:

```text
ABC
```

Next window:

```text
BCD
```

Instead of recomputing the hash:

1. Remove the left character.
    
2. Shift by multiplying with `d`.
    
3. Add the new character.
    

Formula:

Where:

This makes each window update **O(1)**.

---

## Deriving the Formula

Current hash:

Remove `A`:

Multiply by `d`:

Add new character `D`:

Exactly the hash of:

```text
BCD
```

This is why the rolling update works.

---

## Algorithm

1. Compute `h = d^(m−1) mod q`.
    
2. Compute pattern hash.
    
3. Compute first window hash.
    
4. For every window:
    
    - If hashes match, verify characters.
        
    - Update the rolling hash.
        

---

## Python Solution

```python
def rabinKarp(txt: str, pat: str):
    d = 256
    q = 101                 # prime modulus

    n = len(txt)
    m = len(pat)

    if m > n:
        return []

    h = pow(d, m - 1, q)

    p_hash = 0
    t_hash = 0

    # Initial hashes
    for i in range(m):
        p_hash = (d * p_hash + ord(pat[i])) % q
        t_hash = (d * t_hash + ord(txt[i])) % q

    ans = []

    for i in range(n - m + 1):

        # Hash match -> verify
        if p_hash == t_hash:
            if txt[i:i + m] == pat:
                ans.append(i)

        # Rolling hash
        if i < n - m:
            t_hash = (
                d * (t_hash - ord(txt[i]) * h)
                + ord(txt[i + m])
            ) % q

            if t_hash < 0:
                t_hash += q

    return ans
```

---

## Dry Run

**Text**

```text
ABCDABC
```

**Pattern**

```text
ABC
```

|Window|Hash|Verify?|
|---|---|---|
|ABC|88|✅ Match|
|BCD|12|❌|
|CDA|51|❌|
|DAB|67|❌|
|ABC|88|✅ Match|

Output:

```text
[0, 4]
```

---

## Why Do We Need Verification?

Different strings may produce the same hash.

Example (illustrative):

```text
ABX
YCD
```

Both could hash to the same value under a small modulus.

Therefore:

```python
if p_hash == t_hash:
    if txt[i:i+m] == pat:
        ...
```

Without verification, Rabin–Karp becomes incorrect.

---

## Choosing the Prime Modulus

A larger prime reduces collisions.

Typical values:

|Prime|Usage|
|---|---|
|101|Educational|
|1,000,000,007|Competitive Programming|
|1,000,000,009|Alternative large prime|

The base is commonly:

- `26` → lowercase only
    
- `256` → ASCII
    
- `911382323` → advanced polynomial hashing
    

---

## Complexity

|Case|Time|Auxiliary Space|
|---|---|---|
|Best / Average|**O(n + m)**|**O(1)**|
|Worst|**O(nm)**|**O(1)**|

Worst case occurs when **every hash collides**, forcing verification at every position.

---

## Rabin–Karp vs Naive vs KMP

|Algorithm|Average|Worst|Extra Idea|
|---|---|---|---|
|Naive|O(nm)|O(nm)|Direct comparison|
|Rabin–Karp|**O(n+m)**|O(nm)|Rolling Hash|
|KMP|**O(n+m)**|**O(n+m)**|LPS Array|

- **Naive** skips nothing.
    
- **Rabin–Karp** skips via hash comparisons.
    
- **KMP** skips using prefix information.
    

---

## Common Mistakes

### 1. Forgetting the Modulo

Wrong:

```python
hash = d * hash + ord(ch)
```

Correct:

```python
hash = (d * hash + ord(ch)) % q
```

Otherwise the hash grows exponentially.

### 2. Not Fixing Negative Hashes

During rolling update:

```python
t_hash = (...) % q
```

Some languages return negative remainders.

Always normalize:

```python
if t_hash < 0:
    t_hash += q
```

### 3. Trusting Hash Equality

Never return immediately on equal hashes.

Hash equality is only a **candidate match**.

---

## When Is Rabin–Karp Preferred?

|Scenario|Best Choice|
|---|---|
|Single pattern|KMP|
|Multiple patterns of same length|Rabin–Karp|
|Plagiarism / document similarity|Rolling Hash|
|DNA sequence matching|Rabin–Karp|

Its real strength is the **rolling hash**, not the pattern matching itself.

---

## Key Takeaways / Pattern Recognition

- Rabin–Karp replaces repeated string comparisons with **rolling hash comparisons**.
    
- The rolling hash updates each window in **O(1)** using the remove → shift → add formula.
    
- **Verification is mandatory** because hash collisions are possible.
    
- Think of the progression:
    
    - **Naive** → Compare characters
        
    - **Rabin–Karp** → Compare hashes
        
    - **KMP** → Reuse previously matched characters