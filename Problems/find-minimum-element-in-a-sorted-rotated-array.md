---
Title: Find Minimum Element in a Sorted Rotated Array
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Binary Search
Link: ""
---
# Find Minimum Element in a Sorted Rotated Array

**Pattern:** Binary Search
**Idea:** 

---

## 💻 Code

Distinct elements : -
```Python
def find_min(arr):

    low = 0
    high = len(arr) - 1

    while low < high:

        mid = (low + high) // 2

        if arr[mid] > arr[high]:
            low = mid + 1

        else:
            high = mid

    return arr[low]

```
**Time complexity** - O(log n) 
**Aux. Space complexity** -  O(1)
**Note** - for the Duplicates variation , worst case reaches O(n). Variations see below.
###### Code (+variations + comments)
Here's the core algorithm with comments that call out the tricky parts:

```python
def find_min(arr):
    """
    Find the minimum element in a sorted, rotated array (distinct elements).
    Time:  O(log n)  -- binary search
    Space: O(1)
    """
    low = 0
    high = len(arr) - 1

    while low < high:
        # NOTE: loop condition is `low < high`, NOT `low <= high`.
        # We're narrowing down to a single index (the minimum's position),
        # not searching for an exact match, so we stop as soon as low == high.

        mid = (low + high) // 2

        # KEY COMPARISON: compare arr[mid] with arr[high] (not arr[low] or arr[0]).
        # This gives the cleanest boundary condition.

        if arr[mid] > arr[high]:
            # Case 1: mid is still in the "large" left sorted portion.
            # That means the rotation point (and the minimum) hasn't
            # been reached yet -- it must be somewhere to the right of mid.
            # Since arr[mid] > arr[high], mid itself CANNOT be the minimum,
            # so it's safe to exclude it.
            low = mid + 1

        else:
            # Case 2: arr[mid] <= arr[high]
            # This means the portion from mid to high is already sorted,
            # so the minimum is either arr[mid] itself or something to its left.
            # IMPORTANT: use `high = mid`, NOT `high = mid - 1`.
            # mid could BE the answer -- discarding it with mid-1 would be a bug.
            high = mid

    # When low == high, we've narrowed down to exactly one index: the minimum.
    return arr[low]
```

Optimized version with the "already sorted" shortcut:

```python
def find_min(arr):
    low = 0
    high = len(arr) - 1

    while low < high:
        # OPTIMIZATION: if the current window is already sorted
        # (no rotation point inside it), the minimum is just arr[low].
        # Not required for correctness -- the plain binary search below
        # handles this case anyway -- but it short-circuits unnecessary work
        # and makes the "unrotated" case explicit.
        if arr[low] <= arr[high]:
            return arr[low]

        mid = (low + high) // 2

        if arr[mid] > arr[high]:
            low = mid + 1   # min is strictly to the right of mid
        else:
            high = mid       # min is at mid or to its left

    return arr[low]
```

Duplicate-tolerant version (Find Minimum in Rotated Sorted Array II):

```python
def find_min_with_duplicates(arr):
    """
    Handles arrays with duplicate elements.
    Worst-case Time: O(n) -- e.g. all elements equal, like [2,2,2,2,2]
    Space: O(1)
    """
    low = 0
    high = len(arr) - 1

    while low < high:
        mid = (low + high) // 2

        if arr[mid] > arr[high]:
            low = mid + 1        # same logic as before

        elif arr[mid] < arr[high]:
            high = mid            # same logic as before

        else:
            # arr[mid] == arr[high]: AMBIGUOUS CASE.
            # We can't tell which side the rotation point is on
            # (e.g. [3,1,3,3,3] vs [3,3,3,1,3] look identical at mid/high).
            # The only safe move is to shrink the search space by one
            # from the right -- this is what degrades the worst case to O(n).
            high -= 1

    return arr[low]
```

**Things worth remembering for interviews:**

- The rotation count = the _index_ of the minimum (same algorithm, just return `low` instead of `arr[low]`).
- This is a **boundary-finding** problem, not a "search for a value" problem — think of it as narrowing down to the single point where the sorted order "breaks."
- `high = mid` (not `mid - 1`) and `while low < high` (not `<=`) go hand-in-hand — together they guarantee the loop always converges on exactly the minimum's index without ever skipping past it.


---


A classic **Binary Search** problem and an important variation of searching in a sorted rotated array.

The key idea is to use the fact that the array consists of **two sorted portions**, and the minimum is exactly at the rotation point.

---

# Problem

Given a sorted array that has been rotated, find its minimum element.

Example:

```text
[4, 5, 6, 7, 0, 1, 2]
```

The original sorted array was:

```text
[0, 1, 2, 4, 5, 6, 7]
```

So the minimum is:

```text
0
```

---

# Key Observation

Consider:

```text
[4, 5, 6, 7, 0, 1, 2]
 L        M        R
```

The array is split into two sorted portions:

```text
[4, 5, 6, 7]    [0, 1, 2]
```

The minimum is at the point where this order is "broken":

```text
7 → 0
```

We can locate this point using Binary Search.

---

# The Most Useful Comparison

Compare:

```python
arr[mid]
```

with:

```python
arr[high]
```

### Case 1: `arr[mid] > arr[high]`

Example:

```text
[4, 5, 6, 7, 0, 1, 2]
       M           R

arr[mid] = 7
arr[high] = 2
```

Since:

```text
7 > 2
```

the minimum **must be to the right of `mid`**.

Why?

Because `mid` is in the left sorted portion, and the rotation point hasn't been crossed yet.

Therefore:

```python
low = mid + 1
```

---

### Case 2: `arr[mid] <= arr[high]`

Example:

```text
[4, 5, 6, 7, 0, 1, 2]
             M   R

arr[mid] = 0
arr[high] = 2
```

Since:

```text
0 <= 2
```

the portion from `mid` to `high` is sorted.

Therefore the minimum could be:

- `arr[mid]`, or
    
- somewhere to its left.
    

So:

```python
high = mid
```

**Notice:** we do **not** use `high = mid - 1`, because `mid` itself could be the minimum.

---

# Algorithm

```text
while low < high:

    mid = (low + high) // 2

    if arr[mid] > arr[high]:
        minimum is to the right
        low = mid + 1

    else:
        minimum is at mid or to the left
        high = mid
```

When:

```text
low == high
```

that index is the minimum.

---

# Python Code

```python
def find_min(arr):

    low = 0
    high = len(arr) - 1

    while low < high:

        mid = (low + high) // 2

        if arr[mid] > arr[high]:
            low = mid + 1

        else:
            high = mid

    return arr[low]
```

---

# Dry Run

Consider:

```text
arr = [4, 5, 6, 7, 0, 1, 2]
```

### Iteration 1

```text
low = 0
high = 6

mid = 3
```

```text
arr[mid] = 7
arr[high] = 2
```

Since:

```text
7 > 2
```

minimum is right of `mid`.

```text
low = 4
```

---

### Iteration 2

```text
low = 4
high = 6

mid = 5
```

```text
arr[mid] = 1
arr[high] = 2
```

Since:

```text
1 <= 2
```

minimum is at `mid` or to the left.

```text
high = 5
```

---

### Iteration 3

```text
low = 4
high = 5

mid = 4
```

```text
arr[mid] = 0
arr[high] = 1
```

Therefore:

```text
high = 4
```

Now:

```text
low == high == 4
```

Answer:

```text
arr[4] = 0
```

---

# Why `high = mid` Instead of `high = mid - 1`?

This is one of the most important details.

Suppose:

```text
[4, 5, 6, 0, 1, 2, 3]
```

and:

```text
mid = 3
```

Then:

```text
arr[mid] = 0
```

which is itself the minimum.

If we did:

```python
high = mid - 1
```

we would throw away the answer.

Therefore:

```python
high = mid
```

is essential.

This is also why the loop condition is:

```python
while low < high
```

rather than:

```python
while low <= high
```

---

# Unrotated Array

What if the array wasn't rotated?

Example:

```text
[1, 2, 3, 4, 5, 6]
```

Then:

```text
arr[low] <= arr[high]
```

This means the entire current range is already sorted.

Therefore, the minimum is simply:

```text
arr[low]
```

We can add this optimization:

```python
def find_min(arr):

    low = 0
    high = len(arr) - 1

    while low < high:

        if arr[low] <= arr[high]:
            return arr[low]

        mid = (low + high) // 2

        if arr[mid] > arr[high]:
            low = mid + 1
        else:
            high = mid

    return arr[low]
```

This isn't necessary for correctness—the basic version already handles an unrotated array—but it makes the reasoning explicit.

---

# Complexity

For a rotated sorted array with **distinct elements**:

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Variation: Duplicates

Consider:

```text
[2, 2, 2, 0, 1, 2]
```

The previous comparison still works in many cases, but duplicates can create ambiguity.

For example:

```text
[2, 2, 2, 2, 2]
```

Here:

```text
arr[mid] == arr[high]
```

tells us nothing about which side contains the minimum.

For the duplicate version, commonly known as **Find Minimum in Rotated Sorted Array II**, we use:

```python
if arr[mid] > arr[high]:
    low = mid + 1

elif arr[mid] < arr[high]:
    high = mid

else:
    high -= 1
```

The final case loses some information, so the worst-case complexity becomes:

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Find Rotation Count

The index of the minimum element is also the **number of right rotations** performed.

Example:

```text
Original:

[0, 1, 2, 4, 5, 6, 7]

Rotated:

[4, 5, 6, 7, 0, 1, 2]
```

Minimum:

```text
0
```

Minimum index:

```text
4
```

Therefore:

```text
Rotation count = 4
```

So the same Binary Search algorithm can be used to find both:

- minimum element
    
- rotation count
    

---

# Relation to Search in Rotated Sorted Array

These two problems use the **same structural observation**, but the decision is slightly different.

### Search for Target

Ask:

> Which half is sorted, and could the target be inside it?

### Find Minimum

Ask:

> Is the minimum forced to the right of `mid`, or could it be at `mid`/to its left?

For minimum:

```python
if arr[mid] > arr[high]:
    low = mid + 1
else:
    high = mid
```

This compact condition is worth remembering.

---

# Common Interview Mistakes

### 1. Using `high = mid - 1`

Wrong because `mid` may itself be the minimum.

Use:

```python
high = mid
```

---

### 2. Comparing `arr[mid]` with `arr[0]`

This can work with a different formulation, but comparing with `arr[high]` gives a particularly clean boundary-search solution.

---

### 3. Using `while low <= high`

The clean version is:

```python
while low < high:
```

because we are narrowing the range until only **one possible minimum position** remains.

---

### 4. Forgetting the duplicate variation

Distinct elements:

$$  
O(\log n)  
$$

Duplicates:

$$  
O(n)  
$$

in the worst case.

---

# Pythonic Way

There isn't a useful built-in Python equivalent for this specific problem.

For an ordinary sorted array, `min(arr)` would work, but that is:

$$  
O(n)  
$$

and completely ignores the sorted-rotated structure.

In an interview, implement the Binary Search solution.

---

# Key Takeaways

For a sorted rotated array with distinct elements:

```python
def find_min(arr):

    low = 0
    high = len(arr) - 1

    while low < high:

        mid = (low + high) // 2

        if arr[mid] > arr[high]:
            low = mid + 1
        else:
            high = mid

    return arr[low]
```

The key rule:

```text
arr[mid] > arr[high]
        ↓
minimum is RIGHT of mid

arr[mid] <= arr[high]
        ↓
minimum is at mid or LEFT of mid
```

### Complexity

- **Time:** **$O(\log n)$**
    
- **Auxiliary Space:** **$O(1)$**
    

### Important Variations

- Find rotation count → **index of minimum**
    
- Minimum with duplicates → worst-case **$O(n)$**
    
- Search target in rotated array → identify the **sorted half**
    

> **Interview Tip:** Think of this as a **boundary-finding problem**, not simply "find the minimum." The minimum is the point where the rotated array switches from the larger sorted portion back to the smaller sorted portion. The condition `arr[mid] > arr[high]` tells you which side of that boundary you're on.