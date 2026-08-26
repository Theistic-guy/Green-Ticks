---
Title: Union of Two Sorted Arrays
Companies:
  - Not Specified
Topics:
  - Sorting
  - Arrays
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Sorted
  - Union
  - Merge
  - GFG
Link: ""
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Union of Two Sorted Arrays

**Pattern:**  Merge function of merge sort

**Idea:** 

**Variations** : 
+ [intersection-of-two-sorted-arrays](intersection-of-two-sorted-arrays.md)
+ [Merge Sort (Divide & Conquer) Strategies](../Notes/Merge%20Sort%20(Divide%20&%20Conquer)%20Strategies.md)

---

## 💻 Code

```Python
def union_of_sorted_arrays(arr1, arr2):
    union = []

    n1, n2 = len(arr1), len(arr2)
    i = j = 0

    def add_to_union(value):
        # Because values are processed in sorted order,
        # checking only the last element removes duplicates.
        if not union or union[-1] != value:
            union.append(value)

    while i < n1 and j < n2:

        if arr1[i] < arr2[j]:
            add_to_union(arr1[i])
            i += 1

        elif arr1[i] > arr2[j]:
            add_to_union(arr2[j])
            j += 1

        else:
            # Same value exists in both arrays.
            # Add it only once.
            add_to_union(arr1[i])
            i += 1
            j += 1

    # Process remaining elements of arr1.
    while i < n1:
        add_to_union(arr1[i])
        i += 1

    # Process remaining elements of arr2.
    while j < n2:
        add_to_union(arr2[j])
        j += 1

    return union
```
**Time complexity** - O(n1 + n2)

**Aux. Space complexity** -  O(1)

---
# Union of Two Sorted Arrays

Tags: #Array #Two-Pointers #Sorting #Merge #Union #Duplicates #Set #Space-Optimization #FAANG

## Problem Statement

Given two **sorted arrays**, find their **union**: all distinct elements that occur in either array.

Example:

```text
arr1 = [1, 2, 2, 3, 4]
arr2 = [2, 3, 5, 5, 6]

Union = [1, 2, 3, 4, 5, 6]
```

The result contains each value **exactly once**.

> The important distinction from the previous **Intersection of Two Sorted Arrays** problem:
> 
> - **Intersection** → values present in **both** arrays.
>     
> - **Union** → values present in **at least one** array.
>     

---

## Key Idea

Because both arrays are sorted, we can perform the equivalent of a **merge step** from Merge Sort using two pointers.

```text
i → arr1
j → arr2
```

At each step:

- `arr1[i] < arr2[j]` → take `arr1[i]`
    
- `arr1[i] > arr2[j]` → take `arr2[j]`
    
- equal → take the value **once** and advance both pointers
    

The only additional issue is **duplicates**.

Since the output itself is sorted, every newly selected element can be compared with the **last element already inserted**:

```python
if not union or union[-1] != val:
    union.append(val)
```

This lets us handle duplicates from **both arrays uniformly**.

---

## Intuition — The WHY

Consider:

```text
arr1 = [1, 2, 2, 5]
arr2 = [2, 3, 3, 6]
```

Initially:

```text
1 < 2
```

So `1` is definitely the next smallest element of the union.

Then:

```text
2 == 2
```

We add `2` **once** and advance both pointers.

Then:

```text
2 < 3
```

We encounter another `2`, but:

```python
union[-1] == 2
```

so we simply don't add it.

The crucial observation is:

> Because the input arrays are sorted, every duplicate of a value appears adjacent to that value, and the union is also processed in sorted order.

Therefore, we don't need separate duplicate-skipping logic for `arr1` and `arr2`.

---

## Approach

Maintain:

```python
i = 0
j = 0
```

### Case 1 — `arr1[i] < arr2[j]`

`arr1[i]` is the smallest available element.

Add it to the union and advance `i`.

### Case 2 — `arr1[i] > arr2[j]`

Symmetrically, add `arr2[j]` and advance `j`.

### Case 3 — Equal

The value occurs in both arrays.

Add it **once**, then advance both:

```python
i += 1
j += 1
```

### Remaining elements

Eventually one array is exhausted.

The remaining elements of the other array are already sorted, so append them while applying the same duplicate check.

---

## Python Solution

Your **second implementation is the cleaner approach**, and it is the one I would prefer in an interview.

```python
def union_of_sorted_arrays(arr1, arr2):
    union = []

    n1, n2 = len(arr1), len(arr2)
    i = j = 0

    def add_to_union(value):
        # Because values are processed in sorted order,
        # checking only the last element removes duplicates.
        if not union or union[-1] != value:
            union.append(value)

    while i < n1 and j < n2:

        if arr1[i] < arr2[j]:
            add_to_union(arr1[i])
            i += 1

        elif arr1[i] > arr2[j]:
            add_to_union(arr2[j])
            j += 1

        else:
            # Same value exists in both arrays.
            # Add it only once.
            add_to_union(arr1[i])
            i += 1
            j += 1

    # Process remaining elements of arr1.
    while i < n1:
        add_to_union(arr1[i])
        i += 1

    # Process remaining elements of arr2.
    while j < n2:
        add_to_union(arr2[j])
        j += 1

    return union
```

### Why this version is preferable

The textbook version explicitly checks:

```python
if i > 0 and arr1[i] == arr1[i - 1]:
```

and separately:

```python
if j > 0 and arr2[j] == arr2[j - 1]:
```

Your version instead maintains a simple invariant:

> **`union` always contains unique elements in sorted order.**

So every candidate only needs one check:

```python
union[-1] != value
```

This removes duplicate-handling logic from the pointer traversal itself.

---

## Dry Run

Consider:

```text
arr1 = [1, 2, 2, 4, 6]
arr2 = [2, 2, 3, 6]
```

### Step 1

```text
1 < 2
```

Add `1`.

```text
union = [1]
i = 1
j = 0
```

### Step 2

```text
2 == 2
```

Add `2` once.

```text
union = [1, 2]
i = 2
j = 1
```

### Step 3

```text
2 < 2
```

Actually both current values are `2`:

```text
arr1[2] = 2
arr2[1] = 2
```

So add attempt:

```python
add_to_union(2)
```

but:

```python
union[-1] == 2
```

Therefore nothing is added.

Advance both.

```text
i = 3
j = 2
```

### Step 4

```text
4 > 3
```

Add `3`.

```text
union = [1, 2, 3]
j = 3
```

### Step 5

```text
4 < 6
```

Add `4`.

```text
union = [1, 2, 3, 4]
i = 4
```

### Step 6

```text
6 == 6
```

Add `6` once.

Final result:

```text
[1, 2, 3, 4, 6]
```

---

## Complexity

Let:
$$
n1=∣arr1∣,n2=∣arr2∣
$$

### Time

O(n1+n2)O(n_1 + n_2)

Each pointer moves only forward, so each element is processed at most once.

### Auxiliary Space

O(1)O(1)

for the algorithm's working variables and pointers.

However, the returned union itself can contain up to:

O(n1+n2)O(n_1+n_2)

elements.

So:

- **Auxiliary space excluding output:** $O(1)$
    
- **Output space:** $O(n_1+n_2)$
    
- **Total space including output:** $O(n_1+n_2)$
    

---

## Important Variations

### 1. Union of Unsorted Arrays

If the arrays are not sorted, the two-pointer approach is unavailable.

A common solution for a unique union is:

```python
union = list(set(arr1) | set(arr2))
```

This is concise but:

- does not preserve sorted order
    
- requires hash-table space
    
- does not demonstrate exploitation of sorted input
    

If sorted output is required, the result can be sorted afterward, giving additional sorting cost.

---

### 2. Union of More Than Two Sorted Arrays

For multiple sorted arrays, the same idea generalizes to a **k-way merge**.

A min-heap is often useful:

```text
k sorted arrays
      ↓
  Min Heap
      ↓
smallest current element
```

This connects the problem to the broader **K-way Merge** pattern.

---

### 3. In-Place / Output Restrictions

If an interviewer asks you to modify one array or minimize additional storage, the problem changes significantly depending on whether:

- the arrays may be overwritten,
    
- the output must be stored somewhere,
    
- or the result can be streamed/processed without materializing it.
    

The ordinary union problem generally assumes returning the result.

---

## Common Mistakes / Quirks

### Mistake 1 — Forgetting duplicates

This:

```python
if arr1[i] < arr2[j]:
    union.append(arr1[i])
```

is not enough.

For:

```text
arr1 = [1, 2, 2]
arr2 = [2, 3]
```

you could incorrectly produce:

```text
[1, 2, 2, 3]
```

rather than:

```text
[1, 2, 3]
```

---

### Mistake 2 — Assuming equality means two insertions

When:

```python
arr1[i] == arr2[j]
```

the value should be added only once:

```python
union.append(arr1[i])
i += 1
j += 1
```

---

### Mistake 3 — Handling duplicates separately when you don't need to

Your textbook approach works, but this logic:

```python
if i > 0 and arr1[i] == arr1[i - 1]:
    i += 1
    continue
```

and its corresponding `arr2` logic make the main loop harder to reason about.

Your `add_to_union()` approach is cleaner because duplicate elimination becomes independent of **which array the value came from**.

---

### Mistake 4 — Forgetting the remainder

After:

```python
while i < n1 and j < n2:
```

one array may still contain elements.

These must still be processed.

---

## Comparing the Two Implementations

### Textbook Version

The textbook approach explicitly skips duplicates **before** comparison.

**Advantages:**

- Makes duplicate skipping explicit.
    
- Does not perform a duplicate check when adding a value.
    

**Disadvantages:**

- More branching.
    
- Duplicate logic is duplicated for both arrays.
    
- More difficult to read.
    
- `continue` makes the main control flow slightly less direct.
    

### Your Version

Your approach keeps the invariant:

> `union` is always sorted and contains no duplicates.

Then:

```python
if not union or union[-1] != value:
    union.append(value)
```

handles every duplicate case.

**I prefer your version for an interview** because the invariant is simpler and the implementation is easier to explain.

The helper itself is not algorithmically important; you could also inline the check. The key idea is the **"compare with the last output element"** technique.

---

## Pythonic Way

For arbitrary arrays, Python's set operators are the natural shortcut:

```python
union = list(set(arr1) | set(arr2))
```

For already-sorted arrays, however, this hides the most important property of the problem.

For interview preparation, prefer the **two-pointer merge solution**.

---

## Key Takeaways / Pattern Recognition

This problem and **Intersection of Two Sorted Arrays** are almost the same two-pointer skeleton.

### Intersection

Only process:

```text
a[i] == b[j]
```

### Union

Process the **smaller current element**, and process equality only once:

```text
a[i] < b[j]  → take a[i]
a[i] > b[j]  → take b[j]
a[i] == b[j] → take once, move both
```

The reusable pattern is:

> **Two sorted sequences → think Merge Sort's merge step.**

And for unique output:

> **When processing values in sorted order, comparing against the last output element is enough to remove duplicates.**

This is a useful general pattern beyond union: whenever an algorithm generates candidates in sorted order, ask whether **"compare with the last emitted value"** can simplify duplicate handling.