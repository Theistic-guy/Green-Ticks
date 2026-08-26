---
Title: Trailing zeroes in a factorial
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Trailing Zeroes in a decimal

**Pattern:** 

**Idea:** 

---

## 💻 Code

```Python
def trailingZeroes(n): 
count = 0 
while n > 0:
	 n //= 5 
	 count += n 
 return count

```

# 

## Key Insight

A trailing zero is formed by:

```text
10 = 2 × 5
```

Therefore,

```text
Trailing Zeros = Number of (2,5) pairs
               = min(total 2s, total 5s)
```

In a factorial (`n!`), **2s are always more abundant than 5s** because:

- Every **2nd** number contributes a factor of 2.
    
- Only every **5th** number contributes a factor of 5.
    
- Powers of 2 (4, 8, 16, ...) are more frequent than powers of 5 (25, 125, ...).
    

Hence, the **number of 5s is the limiting factor**, so we only count the factors of **5**.

---

## Why `n//5 + n//25 + n//125 + ...`?

- `n//5` → Counts all numbers contributing **at least one** factor of 5.
    
- `n//25` → Counts numbers contributing **one extra** factor of 5 (`25 = 5²`).
    
- `n//125` → Counts numbers contributing **another extra** factor of 5 (`125 = 5³`).
    
- Continue until the divisor exceeds `n`.
    

Formula:

```text
Trailing Zeros =
⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...
```

---

## Example (`n = 25`)

```text
25//5  = 5
25//25 = 1

Total = 5 + 1 = 6
```

So, **25! has 6 trailing zeros.**

---

## Complexity

- **Time:** `O(log₅ n)` (commonly written as `O(log n)`)
    
- **Space:** `O(1)`
    

---

## Interview Takeaways

- Don't compute the factorial.
    
- Count **factors of 5**, not trailing zeros directly.
    
- Extra factors from `25`, `125`, `625`, ... must also be counted.
    
- Although `Trailing Zeros = min(total 2s, total 5s)`, counting 2s is unnecessary because there are always more 2s than 5s in `n!`.




