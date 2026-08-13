---
Title: Search in an Infinite Sorted Array
Companies:
  - Not Specified
Topics:
  - Searching
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
  - Binary Search
Link: ""
---

# Search in an Infinite Sorted Array

**Pattern:** Binary Search

**Idea:** 

---

## 💻 Code

```Python
def search_infinite(arr, x):

    low = 0
    high = 1

    while arr[high] < x:

        low = high
        high *= 2

    return binary_search(arr, low, high, x)

```
**Time complexity** - O(log p) , p is the position of the target
**Aux. Space complexity** -  O(1)

---


A classic Binary Search variation where the array is **sorted but its size is unknown**.

The key challenge is:

> **How do we find the search boundaries if we don't know `n`?**

---

# Problem

Given a sorted array of unknown/infinite size, find the index of `x`.

Example:

```text
arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, ...]
                         ↑
                         x = 23
```

We cannot simply do:

```python
high = len(arr) - 1
```

because the array is conceptually infinite / its length is unavailable.

---

# Key Idea: Exponential Expansion

Instead of immediately knowing the search range, **keep doubling the range** until `x` could lie inside it.

Start with:

```text
low  = 0
high = 1
```

Then:

```text
high *= 2
```

until

```text
arr[high] >= x
```

Now we know that `x`, if it exists, must lie somewhere between:

```text
low ... high
```

and we can perform ordinary Binary Search.

---

# Why Does Doubling Work?

Suppose:

```text
x = 72
```

We don't know where it is.

Our search ranges grow as:

```text
[0, 1]

[0, 2]

[0, 4]

[0, 8]
```

Once we reach an index whose value is at least `72`, we have guaranteed that the target cannot be beyond that point.

The number of expansions is logarithmic:

$$  
O(\log p)  
$$

where `p` is the position of the target.

---

# Important Interview Assumption

An "infinite array" is usually an **interview abstraction**.

You are typically given some array-like object where:

```python
arr[i]
```

can be accessed,

but you are **not allowed to use `len(arr)`**.

You should also assume that accessing a valid index is possible, while accessing beyond the available data is handled according to the problem's API/constraints.

---

# Step 1: Find the Search Range

```python
def find_range(arr, x):

    low = 0
    high = 1

    while arr[high] < x:

        low = high

        high *= 2

    return low, high
```

Notice that after each expansion:

```text
low = previous high
```

So we don't repeatedly search from index `0`.

---

# Step 2: Binary Search

Once we have the range:

```text
low ... high
```

perform normal binary search.

```python
def binary_search(arr, low, high, x):

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == x:
            return mid

        elif arr[mid] < x:
            low = mid + 1

        else:
            high = mid - 1

    return -1
```

---

# Complete Solution

```python
def search_infinite(arr, x):

    low = 0
    high = 1

    while arr[high] < x:

        low = high
        high *= 2

    return binary_search(arr, low, high, x)
```

---

# Dry Run

Consider:

```text
arr = [3, 5, 8, 12, 17, 23, 31, 42, 56, 70, ...]
x = 42
```

Initially:

```text
low = 0
high = 1
```

Check:

```text
arr[1] = 5 < 42
```

Expand:

```text
low = 1
high = 2
```

Again:

```text
arr[2] = 8 < 42
```

Expand:

```text
low = 2
high = 4
```

Then:

```text
arr[4] = 17 < 42
```

Expand:

```text
low = 4
high = 8
```

Now:

```text
arr[8] = 56 >= 42
```

Therefore:

```text
Search range = [4, 8]
```

Run Binary Search inside that range.

Answer:

```text
index = 7
```

---

# Complexity

Let `p` be the position of the target.

## Finding the Range

The boundary doubles:

```text
1 → 2 → 4 → 8 → ...
```

Therefore:

$$  
O(\log p)  
$$

## Binary Search

The final range has size proportional to `p`, so:

$$  
O(\log p)  
$$

Overall:

$$  
\boxed{O(\log p)}  
$$

### Auxiliary Space

$$  
\boxed{O(1)}  
$$

for the iterative implementation.

---

# Important Quirk: Target May Not Exist

Suppose:

```text
arr = [2, 5, 8, 12, 16, 23, ...]
x = 10
```

The expansion stops when:

```text
arr[high] >= x
```

Then Binary Search determines whether `x` actually exists.

So the algorithm naturally handles both:

```text
Target exists
```

and

```text
Target does not exist
```

---

# Important Quirk: What If `arr[1] >= x`?

For example:

```text
arr = [3, 7, 10, ...]
x = 3
```

Initially:

```text
low = 0
high = 1
```

Since:

```text
arr[1] >= x
```

we immediately binary-search `[0,1]`.

This correctly handles the first element.

---

# Why Not Just Double `high`?

You might write:

```python
high *= 2
```

but forget to update `low`.

That would cause Binary Search to repeatedly search a huge range starting from `0`.

Instead:

```python
low = high
high *= 2
```

This keeps the final search interval small.

---

# Alternative Range Expansion

A common implementation starts with:

```python
low = 0
high = 1
```

and repeatedly does:

```python
while arr[high] < x:
    low = high
    high *= 2
```

Another equivalent style is:

```python
high = 1

while arr[high] < x:
    high *= 2

low = high // 2
```

Both work.

The first version makes the meaning of `low` more explicit.

---

# Pythonic Way

There isn't really a useful Python shortcut here.

You **cannot use**:

```python
arr.index(x)
```

because the entire point of the problem is to exploit the **sorted structure** and avoid linear search.

For a real finite Python list, ordinary Binary Search or `bisect` would be more appropriate.

---

# Related Interview Variations

### 1. First Occurrence in an Infinite Sorted Array

If duplicates exist, modify Binary Search to find the **leftmost occurrence**.

This combines:

```text
Infinite Array Search
+
First Occurrence Binary Search
```

---

### 2. Last Occurrence

Similarly, find the **rightmost occurrence** after determining the search range.

---

### 3. Find Position Where a Condition Becomes True

Instead of searching for a specific `x`, the problem may ask for the first index satisfying some monotonic condition.

This becomes **exponential search + binary search**.

---

### 4. Search in an Unknown-Sized Sorted Structure

This is the more general interview version.

The structure might provide:

```python
get(i)
```

but no:

```python
len()
```

The same exponential-boundary idea applies.

---

# The Bigger Pattern: Exponential Search

This technique is also called **Exponential Search** or **Doubling Search**.

The general pattern is:

```text
Start with a small range

        ↓

Double the range

        ↓

Until target/condition is crossed

        ↓

Binary Search inside the range
```

So:

# $$  
\boxed{  
\text{Exponential Search}

\text{Range Expansion}  
+  
\text{Binary Search}  
}  
$$

---

# Key Takeaways

The important part isn't the Binary Search itself—you already know that.

The new problem is:

> **"I don't know where Binary Search should start and end."**

Solve that by exponentially expanding the boundary:

```python
low = 0
high = 1

while arr[high] < x:
    low = high
    high *= 2
```

Then:

```python
binary_search(arr, low, high, x)
```

### Complexity

- **Time Complexity:** **$O(\log p)$**, where `p` is the target position
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> **Interview Tip:** Whenever the array is **sorted but its size/boundary is unknown**, think **Exponential Search** first. The conceptual trick is: **find a range where the answer must lie, then use the Binary Search you already know.**