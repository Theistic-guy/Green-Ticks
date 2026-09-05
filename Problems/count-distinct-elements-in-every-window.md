---
Title: Count Distinct Elements in Every Window
Companies:
  - Not Specified
Topics:
  - Arrays
  - Hashing
  - Sliding Window
Platform:
  - GFG
Difficulty: Easy
Other Tags:
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Count Distinct Elements in Every Window

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
from collections import defaultdict

def countDistinct(arr, k):
    freq = defaultdict(int)
    ans = []

    # First window
    for i in range(k):
        freq[arr[i]] += 1

    ans.append(len(freq))

    # Remaining windows
    for i in range(k, len(arr)):
        left = arr[i - k]
        freq[left] -= 1

        if freq[left] == 0:
            del freq[left]

        freq[arr[i]] += 1
        ans.append(len(freq))

    return ans

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(k)

---


# Count Distinct Elements in Every Window

**Tags:** #SlidingWindow #HashMap #FrequencyMap #Arrays #TwoPointers #FixedWindow #Interview-Pattern #FAANG

## Problem Statement

Given an array `arr` and an integer `k`, return the **number of distinct elements in every contiguous window** of size `k`.

**Example**

- Input: `arr = [1,2,1,3,4,2,3]`, `k = 4`
    
- Output: `[3,4,4,3]`
    

Window-wise:

|Window|Distinct|
|---|--:|
|`[1,2,1,3]`|3|
|`[2,1,3,4]`|4|
|`[1,3,4,2]`|4|
|`[3,4,2,3]`|3|

---

## Key Idea

Use a **fixed-size sliding window** with a **frequency hashmap**.

The hashmap stores:

- **Key** → element
    
- **Value** → frequency inside the current window
    

The number of distinct elements is simply:

```text
len(freq)
```

As the window slides:

- Add the incoming element.
    
- Decrease the outgoing element.
    
- Remove it from the hashmap if its frequency becomes `0`.
    

---

## Intuition (The WHY)

Instead of recomputing distinct elements for every window (`O(k)`), we update only the **two elements that changed**.

```text
Previous Window: [1,2,1,3]

Slide →

Current Window : [2,1,3,4]
```

Only:

- `1` (leftmost) leaves
    
- `4` enters
    

Everything else remains unchanged, making each slide an **O(1)** update.

---

## Optimal Approach — Sliding Window + Frequency Map

### Algorithm

1. Build frequencies for the first window.
    
2. Store its distinct count.
    
3. For each slide:
    
    - Remove the left element.
        
    - Delete it if frequency becomes `0`.
        
    - Insert the new right element.
        
    - Append `len(freq)`.
        

### Python Solution

```python
from collections import defaultdict

def countDistinct(arr, k):
    freq = defaultdict(int)
    ans = []

    # First window
    for i in range(k):
        freq[arr[i]] += 1

    ans.append(len(freq))

    # Remaining windows
    for i in range(k, len(arr)):
        left = arr[i - k]
        freq[left] -= 1

        if freq[left] == 0:
            del freq[left]

        freq[arr[i]] += 1
        ans.append(len(freq))

    return ans
```

---

## Dry Run

**arr = [1,2,1,3,4,2,3]**, `k = 4`

### Initial Window

```text
[1,2,1,3]

Frequency:
1 → 2
2 → 1
3 → 1

Distinct = 3
```

### Slide 1

Remove `1`, add `4`

```text
[2,1,3,4]

Frequency:
1 → 1
2 → 1
3 → 1
4 → 1

Distinct = 4
```

### Slide 2

Remove `2`, add `2`

```text
[1,3,4,2]

Distinct = 4
```

### Slide 3

Remove `1`, add `3`

```text
[3,4,2,3]

Frequency:
3 → 2
4 → 1
2 → 1

Distinct = 3
```

Final answer:

```text
[3,4,4,3]
```

---

## Why Delete When Frequency Becomes Zero?

Suppose:

```text
Frequency:

2 → 1
3 → 2
```

If `2` leaves:

```python
freq[2] -= 1
```

Now:

```text
2 → 0
```

If we don't remove it:

```python
len(freq) == 2   ❌
```

But the window contains only one distinct value (`3`).

Correct:

```python
if freq[left] == 0:
    del freq[left]
```

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(k)**|

The hashmap contains at most `k` distinct elements.

---

## Important Variations

- **First Negative Integer in Every Window** → Queue + Sliding Window
    
- **Maximum of All Subarrays of Size K** → Monotonic Deque
    
- **Find All Anagrams in a String** → Frequency array with fixed-size window
    

All three share the same **fixed-size sliding window** pattern but use different supporting data structures.

---

## Common Mistakes

### 1. Forgetting to delete zero-frequency keys

```python
freq[left] -= 1

if freq[left] == 0:
    del freq[left]
```

Without deletion, `len(freq)` becomes incorrect.

### 2. Using a Set Instead of Frequencies

A set cannot distinguish:

```text
Window:

[1,1,2]
```

Removing one `1` should still leave another `1` in the window.

Frequencies solve this correctly.

### 3. Rebuilding the HashMap Every Window

This leads to:

- Time: **O(nk)**
    

Instead, update only the entering and leaving elements.

---

## Pythonic Way

The distinct count is always available as:

```python
len(freq)
```

No separate variable is needed because dictionary keys represent exactly the distinct elements currently inside the window.

---

## Key Takeaways / Pattern Recognition

- **Fixed window + counting unique items** → Sliding Window + Frequency HashMap.
    
- Store **frequencies**, not a set, because duplicates matter.
    
- The entering/leaving update pattern is the foundation for many window problems.
    
- A useful interview heuristic:
    
    - **Need counts?** → Frequency Map
        
    - **Need max/min?** → Monotonic Deque
        
    - **Need exact character match?** → Frequency Array