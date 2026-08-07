
These are some of the most frequently asked array manipulation problems in coding interviews. For each problem, we'll cover:

- Interview approach (optimal solution)
    
- Python implementation
    
- Complexity
    
- Pythonic shortcut (when applicable)
    

---

# 1. Second Largest Element in an Array

## Problem

Find the second largest **distinct** element in the array.

Example

```text
Input

[10, 20, 5, 8, 20]

Output

10
```

---

## Interview Approach (Single Traversal)

Maintain two variables:

- `largest`
    
- `second_largest`
    

Update them while traversing the array once.

---

## Python Code

```python
def second_largest(arr):

    largest = second = float("-inf")

    for num in arr:

        if num > largest:
            second = largest
            largest = num

        elif largest > num > second:
            second = num

    return second if second != float("-inf") else None
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

## Pythonic Way

```python
sorted(set(arr))[-2]
```

or

```python
import heapq

heapq.nlargest(2, set(arr))[1]
```

> **Note:** These are concise but require extra space and/or sorting, so they are **not** the optimal interview solution.

---

# 2. Reverse an Array

## Problem

Reverse the array.

---

## Interview Approach (Two Pointers)

Swap the first and last elements,

then move inward.

---

## Python Code

```python
def reverse(arr):

    left = 0
    right = len(arr) - 1

    while left < right:

        arr[left], arr[right] = arr[right], arr[left]

        left += 1
        right -= 1
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

## Pythonic Ways

### New reversed array

```python
arr[::-1]
```

### Reverse in-place

```python
arr.reverse()
```

### Iterator

```python
list(reversed(arr))
```

---

# 3. Remove Duplicates from a Sorted Array

## Problem

Given a **sorted** array,

remove duplicates in-place and return the new length.

Example

```text
Input

[10, 20, 20, 30, 30, 30]

Output

[10, 20, 30]
```

---

## Interview Approach (Two Pointers)

Maintain

- one pointer for the last unique element,
    
- another for scanning the array.
    

---

## Python Code

```python
def remove_duplicates(arr):

    if not arr:
        return 0

    res = 1

    for i in range(1, len(arr)):

        if arr[i] != arr[res - 1]:
            arr[res] = arr[i]
            res += 1

    return res
```

The first `res` elements contain the unique values.

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

## Pythonic Ways

### If in-place is **not** required

```python
list(dict.fromkeys(arr))
```

or (works because array is sorted)

```python
list(set(arr))
```

> `set()` does **not preserve order** for general arrays. Since the input is already sorted, the output remains sorted, but `dict.fromkeys()` is the safer general-purpose choice.

---

# 4. Move Zeroes to the End

## Problem

Move all zeroes to the end while maintaining the relative order of non-zero elements.

Example

```text
Input

[8, 5, 0, 10, 0, 20]

Output

[8, 5, 10, 20, 0, 0]
```

---

## Interview Approach (Two Pointers)

Maintain an index where the next non-zero element should be placed.

---

## Python Code

```python
def move_zeroes(arr):

    count = 0

    for i in range(len(arr)):

        if arr[i] != 0:

            arr[count], arr[i] = arr[i], arr[count]

            count += 1
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

## Pythonic Way

```python
[x for x in arr if x != 0] + [0] * arr.count(0)
```

Creates a new array.

---

# 5. Left Rotate by D Places

## Problem

Rotate the array left by `d` positions.

Example

```text
Input

arr = [1,2,3,4,5]

d = 2

Output

[3,4,5,1,2]
```

---

## Interview Approach (Reversal Algorithm)

### Step 1

Reverse first `d` elements.

### Step 2

Reverse remaining elements.

### Step 3

Reverse the entire array.

---

## Python Code

```python
def reverse(arr, low, high):

    while low < high:

        arr[low], arr[high] = arr[high], arr[low]

        low += 1
        high -= 1


def left_rotate(arr, d):

    n = len(arr)

    d %= n

    reverse(arr, 0, d - 1)

    reverse(arr, d, n - 1)

    reverse(arr, 0, n - 1)
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

## Pythonic Ways

### Using Slicing (Creates New Array)

```python
arr[d:] + arr[:d]
```

### In-place Assignment

```python
arr[:] = arr[d:] + arr[:d]
```

### Using `deque` (Good for Multiple Rotations)

```python
from collections import deque

dq = deque(arr)

dq.rotate(-d)

arr = list(dq)
```

---

# Summary Table

|Problem|Interview Approach|Time|Aux. Space|Pythonic Shortcut|
|---|---|---|---|---|
|Second Largest|Single Traversal|**$O(n)$**|**$O(1)$**|`sorted(set(arr))[-2]`|
|Reverse Array|Two Pointers|**$O(n)$**|**$O(1)$**|`arr[::-1]`, `arr.reverse()`|
|Remove Duplicates|Two Pointers|**$O(n)$**|**$O(1)$**|`list(dict.fromkeys(arr))`|
|Move Zeroes|Two Pointers|**$O(n)$**|**$O(1)$**|`[x for x in arr if x] + [0] * arr.count(0)`*|
|Left Rotate by D|Reversal Algorithm|**$O(n)$**|**$O(1)$**|`arr[d:] + arr[:d]`|

* **Safer version:**

```python
[x for x in arr if x != 0] + [0] * arr.count(0)
```

This avoids treating other falsy values (like `False` or `None`) as zero.

---

# Interview Tips

- If the interviewer asks for **in-place modification**, avoid slicing and extra lists.
    
- Most optimal array solutions rely on the **Two Pointer** technique.
    
- Slicing (`arr[::-1]`, `arr[d:] + arr[:d]`) is perfectly acceptable in Python for production code but usually **not** what interviewers expect when testing algorithmic understanding.
    
- Mention the Pythonic shortcut **after** presenting the optimal algorithm—it shows both algorithmic knowledge and Python proficiency.