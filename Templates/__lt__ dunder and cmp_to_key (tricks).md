---
tags:
  - tricks
  - python
---


## 🧠 PKM: Python Advanced Sorting Hacks (DSA)

## 1. The `__lt__` Dunder Method

## Concept

Defines custom less-than (`<`) logic for class instances. Crucial for overriding default behaviors in internal sorting engines.

## 🚀 High-ROI Interview Use Cases

1. `heapq` Custom Objects: Python’s `heapq` is strictly a min-heap. Custom classes _must_ implement `__lt__` to avoid `TypeError` edge cases when priorities tie.
2. Clean Max-Heap: Invert the comparison logic inside `__lt__` to force `heapq` to act as a Max-Heap without modifying or negating your data.
3. Multi-Level Tie Breaking: Handle secondary sorting conditions elegantly inside a single method.

```python
from functools import total_ordering

@total_ordering  # Automatically fills in <=, >, >= if __lt__ and __eq__ exist
class PriorityNode:
    def __init__(self, val, freq):
        self.val = val
        self.freq = freq

    def __lt__(self, other):
        if self.freq == other.freq:
            return self.val < other.val  # Tie-breaker: alphabetical/numerical
        return self.freq < other.freq     # Min-heap behavior by default

    def __eq__(self, other):
        return self.freq == other.freq and self.val == other.val
```

---

## 2. `functools.cmp_to_key`

## Concept

A utility that transforms a legacy comparator function (takes two arguments and returns negative, zero, or positive) into a modern key function acceptable by `list.sort()` or `sorted()`.

## 🚀 High-ROI Interview Use Case

- Context-Dependent Sorting: Used when an element's sorted position depends entirely on a mutual relationship with another element rather than an intrinsic absolute value (e.g., LeetCode _Largest Number_: sorting integers based on their concatenated string performance `xy` vs `yx`).

```python
from functools import cmp_to_key

def custom_comparator(x, y):
    """
    Returns:
      -1 if x should come BEFORE y
       1 if x should come AFTER y
       0 if they are equal
    """
    if str(x) + str(y) > str(y) + str(x):
        return -1  # x wins, place it first
    return 1

# Usage
nums = [3, 30, 34, 5, 9]
nums.sort(key=cmp_to_key(custom_comparator))
# Result: [9, 5, 34, 3, 30] -> Forms largest number: 9534330
```

---
