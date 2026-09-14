---
Title: Largest Number (Leetcode 179)
Companies:
  - Not Specified
Topics:
  - Strings
  - Greedy
  - Sorting
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Largest
  - Comparator
Link: https://leetcode.com/problems/largest-number/description/
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Largest Number (Leetcode 179)

**Pattern:**  custom comparator

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
from functools import cmp_to_key

def largestNumber(nums):
    arr = list(map(str, nums))

    def compare(a, b):
        if a + b > b + a:
            return -1
        elif a + b < b + a:
            return 1
        return 0

    arr.sort(key=cmp_to_key(compare))

    ans = "".join(arr)

    return "0" if ans[0] == "0" else ans

```
**Time complexity** - O(n log n × k)

**Aux. Space complexity** -  O(n)
see proof 'why should it work' below

---

# Largest Number (Leetcode 179)

Arrange the given non-negative integers such that they form the **largest possible number**. Return the result as a string, since it may exceed integer limits.

**Tags:** #Sorting #CustomComparator #Greedy #Strings #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given an array of non-negative integers `nums`, arrange them to form the largest possible integer.

**Examples**

|Input|Output|
|---|---|
|`[10,2]`|`"210"`|
|`[3,30,34,5,9]`|`"9534330"`|
|`[0,0]`|`"0"`|

---

## Key Idea

The entire problem is about **sorting with a custom comparator**.

For any two numbers `a` and `b`, we must decide which should come first.

Instead of comparing `a` and `b` numerically, compare the two possible concatenations:

- `ab`
    
- `ba`
    

If `ab > ba`, then `a` should come before `b`; otherwise `b` comes first.

> **Greedy Rule:** Sort numbers so that the larger concatenation always comes first.

---

## Intuition (The WHY)

Consider:

```text
a = "9"
b = "34"
```

Two possibilities:

|Order|Result|
|---|---|
|`934`|934|
|`349`|349|

Since `934 > 349`, `"9"` must come before `"34"`.

Another example:

```text
a = "30"
b = "3"
```

|Order|Result|
|---|---|
|`303`|303|
|`330`|330|

Although `30 > 3` numerically, `"3"` must come first because it produces the larger overall number.

This is why ordinary numeric sorting fails.

---

## Why This Comparator Is Correct

We want the final concatenated string to be globally maximum.

Suppose two adjacent elements are ordered incorrectly.

```text
... a b ...
```

If:

```text
ab < ba
```

then swapping them always increases the overall number.

Therefore, any optimal arrangement **must** satisfy:

```text
ab ≥ ba
```

for every adjacent pair.

Sorting using this comparator guarantees exactly that, making it the greedy optimum.

---

## Optimal Approach — Custom Comparator

### Algorithm

1. Convert every number to a string.
    
2. Sort using the comparator:
    
    - `a` before `b` if `a+b > b+a`
        
3. Join all strings.
    
4. Handle the all-zero case.
    

### Python Solution

```python
from functools import cmp_to_key

def largestNumber(nums):
    arr = list(map(str, nums))

    def compare(a, b):
        if a + b > b + a:
            return -1
        elif a + b < b + a:
            return 1
        return 0

    arr.sort(key=cmp_to_key(compare))

    ans = "".join(arr)

    return "0" if ans[0] == "0" else ans
```

---

## Dry Run

**Input**

```text
[3,30,34,5,9]
```

Convert to strings:

```text
["3","30","34","5","9"]
```

Important comparisons:

|Compare|Winner|
|---|---|
|`"9"` vs `"5"`|`"9"`|
|`"5"` vs `"34"`|`"5"`|
|`"34"` vs `"3"`|`"34"`|
|`"3"` vs `"30"`|`"3"`|

Sorted order:

```text
["9","5","34","3","30"]
```

Final answer:

```text
9534330
```

---

## The All-Zero Edge Case

Input:

```text
[0,0,0]
```

Sorted result:

```text
"000"
```

Expected output:

```text
"0"
```

Hence:

```python
return "0" if ans[0] == "0" else ans
```

Checking only the **first character** is sufficient because zeros will appear first only when every element is zero.

---

## Complexity

| Metric          |              Value |
| --------------- | -----------------: |
| Time            | **O(n log n × k)** |
| Auxiliary Space |           **O(n)** |

Where:

- `n` = number of elements
    
- `k` = maximum digits in a number
    

Each comparison concatenates strings of length at most `k`.

---

## Common Mistakes

### 1. Sorting Numerically

```python
nums.sort(reverse=True)
```

Fails for:

```text
[3,30]
```

Numeric sort:

```text
30,3 → 303
```

Correct:

```text
3,30 → 330
```

### 2. Lexicographical Sort

```text
"30" > "3"
```

Still incorrect because concatenation order matters.

### 3. Forgetting the Zero Case

Returning `"000"` instead of `"0"` is one of the most common interview mistakes.

---

## Python-Specific Note: `cmp_to_key`

Python's `sort()` accepts a **key**, not a comparator.

`cmp_to_key` converts our comparator into a sortable key object.

```python
from functools import cmp_to_key

arr.sort(key=cmp_to_key(compare))
```

Without it, Python cannot directly use a two-argument comparison function.

---

## Key Takeaways / Pattern Recognition

- **Arrange elements for maximum concatenation** → Think **Custom Comparator**, not greedy by value.
    
- The comparison rule is always:
    
    **`a` before `b` ⇔ `a+b > b+a`**
    
- This is one of the classic FAANG sorting problems where the comparator itself encodes the greedy proof.
    
- Whenever pairwise ordering depends on the **combined result** rather than the individual values, a custom comparator is usually the right tool.

---
---

## Why should it work?

## Comparator

For two numbers (as strings) `a` and `b`, place `a` before `b` iff:

ab≥ba

where `ab` means string concatenation.

The entire algorithm is simply sorting with this comparator.

## Why is this comparator transitive?

The only concern is whether sorting is valid. We need:

> If `a ≽ b` and `b ≽ c`, then `a ≽ c`.

### Key observation

Repeat every string infinitely:

- `a∞ = aaaaa...`
    
- `b∞ = bbbbb...`
    

Then the following equivalence holds:

ab≥ba  ⟺  a∞≥b∞ab \ge ba \iff a^{\infty} \ge b^{\infty}ab≥ba⟺a∞≥b∞

Why? The first position where the infinite strings differ must occur within the repeated comparison of `ab` vs `ba`, so both comparisons produce the same ordering.

Since lexicographical order on infinite strings is transitive, we immediately get:

$a^{\infty}\ge b^{\infty},\ b^{\infty}\ge c^{\infty}\Rightarrow a^{\infty}\ge c^{\infty}$

Hence,

$ac≥ca$

So the comparator is transitive, making sorting well-defined.

## Contradiction proof of optimality

Assume the sorted result is not the largest possible number.

Then there exists an optimal arrangement containing two adjacent elements:

…b a…\dots b\ a\dots…b a…

such that our comparator says:

ab>baab>baab>ba

Compare only the changed part:

- Current: `...ba...`
    
- Swapped: `...ab...`
    

Since `ab > ba`, swapping strictly increases the overall concatenated number while everything else remains identical.

This contradicts the assumption that the arrangement was already optimal.

Therefore, no adjacent inversion can exist, and the fully sorted order is the globally largest concatenation.

## Interview takeaway

The proof has two independent parts:

1. Transitivity: `ab ≥ ba` is equivalent to comparing infinite repeated strings, and lexicographic order is transitive.
    
2. Contradiction (Greedy): Any adjacent pair violating the comparator can be swapped to obtain a larger number, so an optimal solution must already satisfy the comparator everywhere.
    

That is exactly why sorting by `(a+b) > (b+a)` produces the globally maximum number.