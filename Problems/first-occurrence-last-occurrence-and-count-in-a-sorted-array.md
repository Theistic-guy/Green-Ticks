---
Title: First Occurrence Last Occurrence & Count in a Sorted Array
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
  - Binary Search
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# First Occurrence, Last Occurrence & Count in a Sorted Array


**Pattern:** Binary Search

**Idea:** 

---

## 💻 Code

```Python
def first_occurrence(arr, x):

    low = 0
    high = len(arr) - 1
    ans = -1

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == x:
            ans = mid
            high = mid - 1

        elif arr[mid] < x:
            low = mid + 1

        else:
            high = mid - 1

    return ans

```
**Time complexity** - O(logn) 

**Aux. Space complexity** -  O(1)

---
These are classic **Binary Search variations**. The important idea is that we are not simply searching for `x` — we are searching for a **boundary**.

Given a sorted array:

```text
arr = [1, 2, 2, 2, 4, 5, 7]
```

For

```text
x = 2
```

- First occurrence → index `1`
    
- Last occurrence → index `3`
    
- Count → `3`
    

---

# 1. First Occurrence

## Approach 1 — Answer Variable + Shrink Search Space

When `arr[mid] == x`, we have found an occurrence, but there may be another occurrence to the **left**.

Therefore:

- Store `mid` as a possible answer.
    
- Continue searching the left half.
    

### Python Code

```python
def first_occurrence(arr, x):

    low = 0
    high = len(arr) - 1
    ans = -1

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == x:
            ans = mid
            high = mid - 1

        elif arr[mid] < x:
            low = mid + 1

        else:
            high = mid - 1

    return ans
```

### Complexity

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Approach 2 — Check Whether `mid` Is Actually the First

A matching `mid` is the first occurrence if:

```text
mid == 0
```

or

```text
arr[mid - 1] != x
```

So when `arr[mid] == x`:

```python
if mid == 0 or arr[mid - 1] != x:
    return mid
```

Otherwise, the first occurrence must be further left.

### Python Code

```python
def first_occurrence(arr, x):

    low = 0
    high = len(arr) - 1

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == x:

            if mid == 0 or arr[mid - 1] != x:
                return mid

            high = mid - 1

        elif arr[mid] < x:
            low = mid + 1

        else:
            high = mid - 1

    return -1
```

### Complexity

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# 2. Last Occurrence

The logic is exactly the mirror image.

When `arr[mid] == x`:

- Store `mid`.
    
- Search towards the **right**.
    

---

## Approach 1 — Answer Variable

```python
def last_occurrence(arr, x):

    low = 0
    high = len(arr) - 1
    ans = -1

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == x:
            ans = mid
            low = mid + 1

        elif arr[mid] < x:
            low = mid + 1

        else:
            high = mid - 1

    return ans
```

### Complexity

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

## Approach 2 — Check Whether `mid` Is Actually the Last

A matching `mid` is the last occurrence if:

```text
mid == n - 1
```

or

```text
arr[mid + 1] != x
```

Otherwise, continue searching right.

### Python Code

```python
def last_occurrence(arr, x):

    low = 0
    high = len(arr) - 1
    n = len(arr)

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == x:

            if mid == n - 1 or arr[mid + 1] != x:
                return mid

            low = mid + 1

        elif arr[mid] < x:
            low = mid + 1

        else:
            high = mid - 1

    return -1
```

### Complexity

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# 3. Count Occurrences

Once we know the first and last occurrence:

$$  
\boxed{  
\text{Count} = \text{Last Index} - \text{First Index} + 1  
}  
$$

### Python Code

```python
def count_occurrences(arr, x):

    first = first_occurrence(arr, x)

    if first == -1:
        return 0

    last = last_occurrence(arr, x)

    return last - first + 1
```

### Complexity

Two binary searches are performed:

$$  
O(\log n)+O(\log n)=O(\log n)  
$$

Therefore:

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Important Boundary Insight

The two approaches are really expressing the same idea differently.

For **first occurrence**:

```text
Found x
    ↓
Could there be another x on the left?
    ↓
Yes → continue left
No  → this is the answer
```

For **last occurrence**:

```text
Found x
    ↓
Could there be another x on the right?
    ↓
Yes → continue right
No  → this is the answer
```

The boundary conditions are:

### First Occurrence

$$  
arr[mid]=x  
$$

and

$$  
mid=0 \quad\text{or}\quad arr[mid-1]\ne x  
$$

### Last Occurrence

$$  
arr[mid]=x  
$$

and

$$  
mid=n-1 \quad\text{or}\quad arr[mid+1]\ne x  
$$

---

# Python's Built-in Binary Search

Python's `bisect` module already provides these operations.

```python
from bisect import bisect_left, bisect_right
```

For a sorted array:

### First Occurrence

```python
first = bisect_left(arr, x)
```

### Last Occurrence

```python
last = bisect_right(arr, x) - 1
```

### Count

```python
count = bisect_right(arr, x) - bisect_left(arr, x)
```

Example:

```python
arr = [1, 2, 2, 2, 4, 5, 7]
x = 2

first = bisect_left(arr, x)       # 1
last = bisect_right(arr, x) - 1  # 3
count = bisect_right(arr, x) - bisect_left(arr, x)  # 3
```

---

# `bisect_left` vs `bisect_right`

This is worth remembering for Python interviews.

For

```text
[1, 2, 2, 2, 4]
```

and

```text
x = 2
```

### `bisect_left`

Returns the position where `x` could be inserted **before existing `x`s**.

```text
1  [2 2 2]  4
   ↑
   1
```

So:

```python
bisect_left(arr, 2) == 1
```

This gives the **first occurrence** when `x` exists.

---

### `bisect_right`

Returns the position where `x` could be inserted **after existing `x`s**.

```text
1  [2 2 2]  4
          ↑
          4
```

So:

```python
bisect_right(arr, 2) == 4
```

Therefore:

```python
last = bisect_right(arr, x) - 1
```

---

# Common Interview Variations

These boundary-search ideas appear in many important problems:

- **Count occurrences in a sorted array**
    
- **Search Insert Position**
    
- **Lower Bound**
    
- **Upper Bound**
    
- **Find first element greater than or equal to `x`**
    
- **Find first element strictly greater than `x`**
    
- **Find floor / ceiling of a value**
    
- **Search in a sorted array with duplicates**
    
- **Find the range of a target (LeetCode 34)**
    
- **Find the insertion position of a target**
    
- **Binary search on the answer** — conceptually related because we search for a boundary rather than simply for an exact value
    

---

# Complexity Summary

|Operation|Time|Aux. Space|
|---|--:|--:|
|First Occurrence|**$O(\log n)$**|**$O(1)$**|
|Last Occurrence|**$O(\log n)$**|**$O(1)$**|
|Count Occurrences|**$O(\log n)$**|**$O(1)$**|
|`bisect_left`|**$O(\log n)$**|**$O(1)$**|
|`bisect_right`|**$O(\log n)$**|**$O(1)$**|

---

# Key Takeaways

### First Occurrence

When found:

```python
ans = mid
high = mid - 1
```

or check:

```python
mid == 0 or arr[mid - 1] != x
```

---

### Last Occurrence

When found:

```python
ans = mid
low = mid + 1
```

or check:

```python
mid == n - 1 or arr[mid + 1] != x
```

---

### Count

$$  
\boxed{  
last-first+1  
}  
$$

---

### Pythonic Shortcut

```python
from bisect import bisect_left, bisect_right

first = bisect_left(arr, x)
last = bisect_right(arr, x) - 1
count = bisect_right(arr, x) - bisect_left(arr, x)
```

> **Interview Tip:** Don't think of these as three separate binary-search problems. They are really one pattern: **find a boundary in a sorted array**. Once you find an occurrence of `x`, ask which direction the desired boundary lies — **left for first occurrence, right for last occurrence**. This same boundary-thinking is the foundation of `lower_bound` and `upper_bound`.