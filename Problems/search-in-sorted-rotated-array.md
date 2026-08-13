---
Title: Search in Sorted Rotated Array (Distinct Elements)
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
  - GFG
Link: ""
---

# Search in a Sorted Rotated Array

**Pattern:**  Binary Search

**Idea:** 

---

## 💻 Code

```Python
def search(arr, target):

    low = 0
    high = len(arr) - 1

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == target:
            return mid

        # Left half is sorted
        if arr[low] <= arr[mid]:

            if arr[low] <= target < arr[mid]:
                high = mid - 1
            else:
                low = mid + 1

        # Right half is sorted
        else:

            if arr[mid] < target <= arr[high]:
                low = mid + 1
            else:
                high = mid - 1

    return -1
```
**Time complexity** - O(log n)
**Aux. Space complexity** -  O(1)
See decision tree below.
Important variation (With duplicates) - [search-in-rotated-sorted-array-ii](search-in-rotated-sorted-array-ii.md)

---


A very important **Binary Search variation**.

The key trick is recognizing that although the whole array is not sorted, **at least one half of the current search space is always sorted**.

---

# Problem

Given a sorted array that has been rotated, search for a target.

Example:

```text
Original:

[1, 2, 3, 4, 5, 6, 7]

Rotated:

[4, 5, 6, 7, 1, 2, 3]
```

Search for:

```text
target = 2
```

Answer:

```text
index = 5
```

---

# What Does "Rotated" Mean?

A sorted array can be split at some point and the two pieces swapped.

For example:

```text
[1, 2, 3, 4, 5, 6, 7]

        ↓ rotate

[4, 5, 6, 7] [1, 2, 3]
```

The important property is:

> **At least one half of any search space is sorted.**

This is what allows Binary Search to continue working.

---

# Core Idea

Suppose:

```text
[4, 5, 6, 7, 1, 2, 3]
       L     M     R
```

At every iteration, determine which half is sorted.

### If

$$  
arr[L] \le arr[M]  
$$

then the **left half is sorted**.

Otherwise,

the **right half is sorted**.

Once we know the sorted half, check whether the target lies inside that half.

If it does, search there.

Otherwise, search the other half.

---

# Why Does This Work?

Consider:

```text
[4, 5, 6, 7, 1, 2, 3]
```

Suppose:

```text
L = 0
M = 3
R = 6
```

We have:

```text
arr[L] = 4
arr[M] = 7
```

Since:

$$  
4 \le 7  
$$

the left half

```text
[4, 5, 6, 7]
```

is definitely sorted.

Now we can ask:

> Is the target between `4` and `7`?

If yes → search left.

If no → discard the entire left half.

---

# Python Solution

```python
def search(arr, target):

    low = 0
    high = len(arr) - 1

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == target:
            return mid

        # Left half is sorted
        if arr[low] <= arr[mid]:

            if arr[low] <= target < arr[mid]:
                high = mid - 1
            else:
                low = mid + 1

        # Right half is sorted
        else:

            if arr[mid] < target <= arr[high]:
                low = mid + 1
            else:
                high = mid - 1

    return -1
```

---

# The Decision Logic

This is the part worth memorizing conceptually.

```text
                 arr[mid] == target?
                         |
                    Yes → return
                         |
                         No
                         ↓
              Which half is sorted?
                 /              \
                /                \
       Left is sorted       Right is sorted
            |                     |
            ↓                     ↓
    Target inside left?   Target inside right?
        /       \             /       \
      Yes       No          Yes       No
       ↓         ↓           ↓         ↓
   Search      Search      Search     Search
    Left       Right       Right       Left
```

---

# Dry Run

Consider:

```text
arr = [4, 5, 6, 7, 0, 1, 2]

target = 0
```

### Iteration 1

```text
low = 0
mid = 3
high = 6
```

```text
arr[mid] = 7
```

Not the target.

Check sorted half:

```text
arr[low] <= arr[mid]

4 <= 7
```

Therefore:

```text
[4,5,6,7]
```

is sorted.

Is `0` inside this range?

```text
4 <= 0 < 7
```

No.

Therefore discard the left half.

```text
low = mid + 1
```

---

### Iteration 2

Search:

```text
[0,1,2]
```

Now:

```text
mid = 4
arr[mid] = 0
```

Found.

Answer:

```text
4
```

---

# Complexity

Each iteration eliminates approximately half of the search space.

Therefore:

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Important Variation: Duplicates . See More [here](search-in-rotated-sorted-array-ii.md)

This is an important follow-up.

Consider:

```text
[2, 5, 6, 0, 0, 1, 2]
```

or even:

```text
[1, 1, 1, 1, 2, 1, 1]
```

The previous logic can become ambiguous.

For example:

```text
arr[low] == arr[mid] == arr[high]
```

We cannot determine which half is definitely sorted from these values.

---

# Handling Duplicates

When:

```python
arr[low] == arr[mid] == arr[high]
```

we cannot gain useful information.

So safely shrink both boundaries:

```python
low += 1
high -= 1
```

This is the key modification.

---

# Python Code — With Duplicates

```python
def search(arr, target):

    low = 0
    high = len(arr) - 1

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == target:
            return True

        if arr[low] == arr[mid] == arr[high]:
            low += 1
            high -= 1

        elif arr[low] <= arr[mid]:

            if arr[low] <= target < arr[mid]:
                high = mid - 1
            else:
                low = mid + 1

        else:

            if arr[mid] < target <= arr[high]:
                low = mid + 1
            else:
                high = mid - 1

    return False
```

This corresponds to the common **Search in Rotated Sorted Array II** problem.

---

# Complexity With Duplicates

Without duplicates:

$$  
O(\log n)  
$$

With duplicates, the worst case can degrade to:

$$  
\boxed{O(n)}  
$$

because repeatedly doing

```python
low += 1
high -= 1
```

may remove only a constant amount of information per iteration.

Average/practical performance can still be much better.

---

# Important Variation: Find Minimum Element

Another very common question is:

> Find the minimum element in a sorted rotated array.

Example:

```text
[4,5,6,7,0,1,2]
```

Answer:

```text
0
```

This is another **Binary Search on a rotated sorted array** problem.

The key comparison is between:

```text
arr[mid]
```

and

```text
arr[high]
```

If:

```text
arr[mid] > arr[high]
```

the minimum lies to the **right**.

Otherwise, it lies at `mid` or to the **left**.

---

## Python Code

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

### Complexity

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Important Variation: Find Rotation Count

The number of rotations is the index of the minimum element.

For:

```text
[4,5,6,7,0,1,2]
```

minimum is at:

```text
index = 4
```

Therefore:

```text
rotation count = 4
```

So the previous problem can directly solve this one.

---

# Important Variation: Search in Rotated Array with Duplicates

This is the harder version.

Main difference:

```text
No duplicates:
    O(log n)

Duplicates:
    Worst-case O(n)
```

The reason is that duplicates can destroy our ability to determine which half is sorted.

---

# Common Interview Variations

|Problem|Main Idea|
|---|---|
|Search in Rotated Sorted Array|Find sorted half|
|Search in Rotated Sorted Array II|Same + handle duplicates|
|Find Minimum in Rotated Array|Binary search around rotation point|
|Find Minimum with Duplicates|Same, but duplicates may degrade to $O(n)$|
|Find Rotation Count|Index of minimum|
|Find Pivot / Rotation Point|Locate boundary between sorted portions|

These are the **practical variations worth knowing**. You don't need to memorize dozens of artificial variants.

---

# Common Mistakes

### Mistake 1: Applying normal Binary Search

This doesn't work because:

```text
[4,5,6,7,0,1,2]
```

is not globally sorted.

Instead, identify the **sorted half** first.

---

### Mistake 2: Using the wrong inequalities

For the left sorted half:

```python
arr[low] <= target < arr[mid]
```

For the right sorted half:

```python
arr[mid] < target <= arr[high]
```

Notice the asymmetric `<` and `<=`.

---

### Mistake 3: Forgetting duplicates

The condition:

```python
arr[low] <= arr[mid]
```

works cleanly when the array has distinct values.

With duplicates, you may encounter:

```text
arr[low] == arr[mid] == arr[high]
```

and cannot determine the sorted half.

---

# Pythonic Way

For a normal Python list, there isn't a useful built-in equivalent of this algorithm.

`bisect` assumes the sequence is already sorted and therefore **cannot directly solve** a rotated sorted array.

So in an interview, implement the Binary Search logic.

---

# Key Takeaways

The central observation is:

> **Even though the entire array is rotated, at least one half of the current search space is sorted.**

Algorithm:

```text
1. Find mid.

2. If arr[mid] == target → found.

3. Determine which half is sorted.

4. Check whether target lies inside that sorted half.

5. Search the appropriate half.
```

For distinct elements:

$$  
\boxed{O(\log n)\text{ time},\ O(1)\text{ space}}  
$$

For duplicates:

$$  
\boxed{O(n)\text{ worst-case time},\ O(1)\text{ space}}  
$$

> **Interview Tip:** Don't memorize the code as a special Binary Search template. The reasoning is more important: **"I can't tell whether the whole array is sorted, but I can always identify at least one sorted half. If the target belongs to that half, go there; otherwise discard it."** This reasoning is what makes the algorithm work.