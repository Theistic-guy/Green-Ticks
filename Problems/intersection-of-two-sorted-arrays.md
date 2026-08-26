---
Title: Intersection of Two Sorted Arrays
Companies:
  - Not Specified
Topics:
  - Arrays
  - Sorting
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Sorted
  - Merge
  - GFG
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Intersection of Two Sorted Arrays

**Pattern:**  Merge function

**Idea:** 

**Variations** : 
+ [union-of-two-sorted-arrays](union-of-two-sorted-arrays.md)
+ [Merge Sort (Divide & Conquer) Strategies](../Notes/Merge%20Sort%20(Divide%20&%20Conquer)%20Strategies.md)

---

## 💻 Code

```Python
n1 = len(arr1)
n2 = len(arr2)

i = j = 0

while i < n1 and j < n2:

    if arr1[i] < arr2[j]:
        # arr1[i] is smaller, so it can never match
        # arr2[j] or anything after it.
        i += 1

    elif arr1[i] > arr2[j]:
        # arr2[j] is smaller, so it can never match
        # arr1[i] or anything after it.
        j += 1

    else:
        # arr1[i] == arr2[j]
        # We found a common value.
        print(arr1[i])

        temp = arr1[i]

        # Skip all duplicate occurrences in arr1 so that
        # the same value is printed only once.
        while i < n1 and arr1[i] == temp:
            i += 1

        # We only need to move j once here. On the next
        # iteration, duplicates in arr2 are handled naturally.
        j += 1

```
**Time complexity** - O(n1 + n2)

**Aux. Space complexity** -  O(1)

---
# Intersection of Two Sorted Arrays

Tags: #Array #Two-Pointers #Sorting #Merge #Intersection #Duplicates #Multiple-Arrays #Space-Optimization #FAANG

## Problem Statement

Given two **sorted arrays**, find their intersection.

For example:

```text
arr1 = [1, 2, 2, 3, 4]
arr2 = [2, 2, 4, 6]

Intersection = [2, 4]
```

Here, the intersection contains each common value **only once**.

> **Important:** Clarify the definition of intersection in an interview.  
> There are two common interpretations:
> 
> - **Unique intersection:** each common value appears once.
>     
> - **Multiset intersection:** a value appears `min(freq1, freq2)` times.
>     

The solution below implements the **unique intersection**.

---

## Key Idea

Because both arrays are **sorted**, we can use two pointers:

```text
i → arr1
j → arr2
```

At every step:

- If `arr1[i] < arr2[j]`, `arr1[i]` cannot appear later in `arr2` before `arr2[j]`, so move `i`.
    
- If `arr1[i] > arr2[j]`, move `j`.
    
- If they are equal, we found a common value.
    

This gives a linear scan:

O(n1+n2)O(n_1 + n_2)

instead of comparing every pair.

---

## Intuition — Why Two Pointers Work

Suppose:

```text
arr1 = [1, 3, 5, 8]
arr2 = [2, 3, 6, 8]
```

Initially:

```text
1 < 2
```

There is no point moving `j`, because `2` is already greater than `1`, and the arrays are sorted.

So `1` can never match anything ahead of `2` in `arr2`.

Therefore:

```text
i++
```

Now:

```text
3 > 2
```

So `2` cannot match anything before `3` in `arr1`.

Therefore:

```text
j++
```

Eventually:

```text
3 == 3
```

We found an intersection element.

### The key invariant

At every step:

> If the current elements are unequal, the smaller element can safely be discarded because all future elements in the other array are at least as large.

That is the reason the algorithm never needs to move a pointer backward.

---

## Approach

Maintain:

```python
i = 0
j = 0
```

While both pointers are inside their arrays:

### Case 1 — `arr1[i] < arr2[j]`

```python
i += 1
```

`arr1[i]` is too small to match the current or any future element of `arr2`.

### Case 2 — `arr1[i] > arr2[j]`

```python
j += 1
```

Symmetric reasoning.

### Case 3 — Equal

```python
arr1[i] == arr2[j]
```

We found a common value.

Since we want a **unique intersection**, output it once and skip duplicates in `arr1`.

Then move `j` forward.

---

## Python Solution

```python
n1 = len(arr1)
n2 = len(arr2)

i = j = 0

while i < n1 and j < n2:

    if arr1[i] < arr2[j]:
        # arr1[i] is smaller, so it can never match
        # arr2[j] or anything after it.
        i += 1

    elif arr1[i] > arr2[j]:
        # arr2[j] is smaller, so it can never match
        # arr1[i] or anything after it.
        j += 1

    else:
        # arr1[i] == arr2[j]
        # We found a common value.
        print(arr1[i])

        temp = arr1[i]

        # Skip all duplicate occurrences in arr1 so that
        # the same value is printed only once.
        while i < n1 and arr1[i] == temp:
            i += 1

        # We only need to move j once here. On the next
        # iteration, duplicates in arr2 are handled naturally.
        j += 1
```

### Why skipping duplicates is necessary

Consider:

```text
arr1 = [1, 2, 2, 2, 5]
arr2 = [2, 2, 4]
```

Without skipping:

```text
2
2
2
```

would potentially be produced.

For a **unique intersection**, we want:

```text
2
```

The sorted property makes duplicate removal particularly easy because equal values occur consecutively.

---

## Dry Run

Consider:

```text
arr1 = [1, 2, 2, 4, 6]
arr2 = [2, 2, 3, 6]
```

### Initial

```text
i = 0 → 1
j = 0 → 2
```

Since:

```text
1 < 2
```

move `i`.

```text
i = 1 → 2
j = 0 → 2
```

Equal → output `2`.

Now skip all `2`s in `arr1`:

```text
i = 3 → 4
j = 1 → 2
```

Now:

```text
4 > 2
```

Move `j`.

```text
i = 3 → 4
j = 2 → 3
```

Now:

```text
4 > 3
```

Move `j`.

```text
i = 3 → 4
j = 3 → 6
```

Now:

```text
4 < 6
```

Move `i`.

```text
i = 4 → 6
j = 3 → 6
```

Equal → output `6`.

Final intersection:

```text
[2, 6]
```

---

## Complexity

Let:

- $n_1 = |arr1|$
    
- $n_2 = |arr2|$
    

### Time

O(n1+n2)

Each pointer only moves forward, and neither can move more than the length of its array.

### Auxiliary Space

O(1)

The algorithm uses only the two pointers and a temporary variable.

**Output space is excluded.**

If instead we store the intersection in a result array, that output storage requires up to:

O(min⁡(n1,n2))O(\min(n_1, n_2))

additional space.

---

## Important Variations

### 1. Multiset Intersection

If duplicates should be preserved according to frequency, the logic changes slightly.

Example:

```text
arr1 = [1, 2, 2, 2, 5]
arr2 = [2, 2, 4]

Result = [2, 2]
```

When values match:

```python
result.append(arr1[i])
i += 1
j += 1
```

There is **no duplicate-skipping**.

```python
def intersection_multiset(arr1, arr2):
    result = []

    i = j = 0

    while i < len(arr1) and j < len(arr2):
        if arr1[i] < arr2[j]:
            i += 1
        elif arr1[i] > arr2[j]:
            j += 1
        else:
            result.append(arr1[i])
            i += 1
            j += 1

    return result
```

This produces each value:

min⁡(frequency in arr1,frequency in arr2)\min(\text{frequency in arr1}, \text{frequency in arr2})

times.

---

### 2. Intersection of Unsorted Arrays

If the arrays are **not sorted**, the two-pointer technique cannot be directly applied.

Common choices:

- Hash set → typically $O(n_1+n_2)$ expected time.
    
- Sort both arrays first → $O(n_1\log n_1+n_2\log n_2)$, then use the same two-pointer technique.
    

For a unique intersection, a hash set is usually the most direct solution.

---

### 3. Intersection of More Than Two Sorted Arrays

For:

```text
A1, A2, A3, ..., Ak
```

a similar pointer-based idea can be generalized.

A common strategy is to keep one pointer per array and repeatedly compare their current values.

This becomes a useful **multi-way merge** pattern.

---

## Common Mistakes / Quirks

### Mistake 1 — Moving the wrong pointer

For:

```text
arr1[i] < arr2[j]
```

move `i`, not `j`.

The smaller element is the one that can be safely discarded.

---

### Mistake 2 — Forgetting the sorted-array assumption

The logic:

```python
if arr1[i] < arr2[j]:
    i += 1
```

is only valid because the arrays are sorted.

With unsorted arrays, this can skip valid matches.

---

### Mistake 3 — Confusing unique and multiset intersection

These are different problems:

```text
arr1 = [1, 2, 2, 2]
arr2 = [2, 2]
```

Unique:

```text
[2]
```

Multiset:

```text
[2, 2]
```

Always clarify this when the problem statement is ambiguous.

---

### Quirk in the Given Code

Your implementation skips duplicates only in `arr1`:

```python
temp = arr1[i]

while i < n1 and arr1[i] == temp:
    i += 1
```

and only advances `j` once.

That is sufficient for the **unique intersection** because after finding a value, the next iteration will keep advancing through duplicate values in `arr2` until it either finds a larger value or finds another match.

However, the intent is easier to understand if the code explicitly makes the **unique-output behavior** clear with a `result` array rather than printing directly.

A polished interview version could therefore be:

```python
def intersection_sorted(arr1, arr2):
    result = []

    i = j = 0

    while i < len(arr1) and j < len(arr2):

        if arr1[i] < arr2[j]:
            i += 1

        elif arr1[i] > arr2[j]:
            j += 1

        else:
            # Found a common value.
            result.append(arr1[i])

            # Skip every duplicate of this value in arr1.
            value = arr1[i]
            while i < len(arr1) and arr1[i] == value:
                i += 1

            # Move past the current occurrence in arr2.
            j += 1

    return result
```

---

## Pythonic Way

For **arbitrary/unsorted arrays**, Python provides a very concise set-based approach:

```python
intersection = set(arr1) & set(arr2)
```

But this changes the problem characteristics:

- It does not exploit sortedness.
    
- It uses $O(n_1+n_2)$ auxiliary space.
    
- It is therefore not the preferred interview solution when the question specifically gives **sorted arrays**.
    

For interviews, the two-pointer solution demonstrates that you recognize and exploit the sorted structure.

---

## Key Takeaways / Pattern Recognition

### The reusable pattern

Whenever you see:

> **Two sorted arrays + compare/merge/search relationship**

immediately consider:

```text
Two Pointers
i → array 1
j → array 2
```

The fundamental rule is:

a[i]<b[j]⇒i++a[i] < b[j] \Rightarrow i++ a[i]>b[j]⇒j++a[i] > b[j] \Rightarrow j++ a[i]=b[j]⇒process the matcha[i] = b[j] \Rightarrow \text{process the match}

This is essentially the same **merge-step reasoning used in Merge Sort**, except here we are using it to compare two already-sorted arrays directly.

### Interview mental checklist

1. Are both arrays sorted?
    
2. Do I need unique intersection or duplicate-preserving intersection?
    
3. Can I discard the smaller current element safely?
    
4. Can each pointer move only forward?
    
5. Does the algorithm require output storage, or can I process results on the fly?
    

> **Pattern:** Sorted input often turns an otherwise quadratic pair-comparison problem into a linear **two-pointer scan**.