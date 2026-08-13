---
Title: Search in Rotated Sorted Array II (With Duplicates)
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - Binary Search
Link: ""
---

# Search in Rotated Sorted Array II — Handling Duplicates

**Pattern:**  Binary Search
**Idea:** 

---

## 💻 Code

```Python
def search(nums, target):

    low = 0
    high = len(nums) - 1

    while low <= high:

        mid = (low + high) // 2

        if nums[mid] == target:
            return True

        # Ambiguous because duplicates hide
        # which half is sorted.
        if (
            nums[low] == nums[mid]
            and nums[mid] == nums[high]
        ):
            low += 1
            high -= 1
            continue

        # Left half is sorted.
        if nums[low] <= nums[mid]:

            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1

        # Right half is sorted.
        else:

            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1

    return False

```
**Time complexity** - O(n) , worst case when all duplicates
**Aux. Space complexity** -  O(1)
Original (Distinct Elements) - [search-in-sorted-rotated-array](search-in-sorted-rotated-array.md)

---


> **Variation:** Same as Search in Rotated Sorted Array, but **duplicate values are allowed**.
> 
> Main difficulty: duplicates can make it impossible to determine which half is sorted.

---

## 1. Normal Rotated Sorted Array

Example:

```text
nums = [4,5,6,7,0,1,2]
```

With distinct elements, one half is always clearly sorted.

```text
[4,5,6,7] | [0,1,2]
 ↑             ↑
sorted        sorted
```

We use:

```python
if nums[low] <= nums[mid]:
```

to identify the left half as sorted.

Because elements are distinct, `low == mid` is the only way they can be equal, so:

```text
nums[low] <= nums[mid]
```

gives useful ordering information.

---

# 2. What Changes with Duplicates?

Example:

```text
nums = [1,1,1,3,1]
```

Suppose:

```text
low = 0
mid = 2
high = 4
```

Then:

```text
nums[low] = 1
nums[mid] = 1
nums[high] = 1
```

So:

```text
nums[low] <= nums[mid]
```

is technically true:

```text
1 <= 1
```

But it tells us **nothing useful** about where the rotation occurs.

The same boundary information can occur in arrays such as:

```text
[1,1,1,3,1]
```

and

```text
[1,3,1,1,1]
```

At the relevant boundaries, we can see:

```text
low = 1
mid = 1
high = 1
```

Yet the position of `3` is different.

Therefore:

> When `nums[low] == nums[mid] == nums[high]`, the usual sorted-half reasoning becomes ambiguous.

---

# 3. Why Filter This Particular Case?

When:

```python
nums[low] == nums[mid] == nums[high]
```

we cannot determine which half contains the rotation.

So first check:

```python
if nums[mid] == target:
    return True
```

If it isn't the target, safely shrink:

```python
low += 1
high -= 1
```

### Why is this safe?

Both boundary elements have the **same value as `mid`**.

If that value were the target, we would already have returned `True`.

If it isn't the target, removing those duplicate copies cannot remove the target.

We're simply discarding redundant information.

---

# 4. Complete Code

```python
def search(nums, target):

    low = 0
    high = len(nums) - 1

    while low <= high:

        mid = (low + high) // 2

        if nums[mid] == target:
            return True

        # Ambiguous because duplicates hide
        # which half is sorted.
        if (
            nums[low] == nums[mid]
            and nums[mid] == nums[high]
        ):
            low += 1
            high -= 1
            continue

        # Left half is sorted.
        if nums[low] <= nums[mid]:

            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1

        # Right half is sorted.
        else:

            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1

    return False
```

---

# 5. Complexity

### Average / typical case

Still behaves like binary search:

```text
O(log n)
```

### Worst case

If the array contains many duplicates:

```text
[2,2,2,2,2,2,2, ...]
```

we may only be able to do:

```text
low += 1
high -= 1
```

instead of discarding half the search space.

Therefore:

```text
Worst-case Time = O(n)
Auxiliary Space = O(1)
```

---

# 6. The Key Interview Insight

Don't say:

> "We can't use `nums[low] <= nums[mid]` when duplicates exist."

That's incorrect.

Instead say:

> **"We can still use the same sorted-half logic, but when `nums[low] == nums[mid] == nums[high]`, the comparison gives insufficient information about which side is sorted. We therefore shrink both boundaries to remove redundant duplicates. This is what causes the worst-case complexity to degrade from O(log n) to O(n)."**

### Mental model

```text
Distinct values
      ↓
One half identifiable
      ↓
Discard half
      ↓
O(log n)

Duplicates at L = M = R
      ↓
Boundary information ambiguous
      ↓
Discard only redundant endpoints
      ↓
Worst case O(n)
```