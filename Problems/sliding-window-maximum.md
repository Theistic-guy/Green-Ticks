---
Title: "# Sliding Window Maximum (Leetcode 239)"
Companies:
  - Not Specified
Topics:
  - Arrays
  - Sliding Window
  - Queue
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Maximum
  - Deque
  - Monotonic Queue
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Sliding Window Maximum (Leetcode 239)

**Pattern:**  sliding window with a monotonic deque

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()          # stores indices
    ans = []

    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] <= i - k:
            dq.popleft()

        # Maintain decreasing order
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()

        dq.append(i)

        # First valid window
        if i >= k - 1:
            ans.append(nums[dq[0]])

    return ans
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(k)

---


# Sliding Window Maximum (Leetcode 239)

**Tags:** #SlidingWindow #MonotonicQueue #Deque #Arrays #Queue #Optimal-Data-Structure #LeetCode #FAANG

## Problem Statement

Given an integer array `nums` and an integer `k`, return an array containing the **maximum element of every sliding window** of size `k`.

**Example**

- Input: `nums = [1,3,-1,-3,5,3,6,7]`, `k = 3`
    
- Output: `[3,3,5,5,6,7]`
    

---

## Key Idea

Maintain a **Monotonic Decreasing Deque** of **indices**, not values.

The deque always satisfies:

- Indices are within the current window.
    
- Values are in **decreasing order** from front to back.
    
- The **front always stores the maximum** of the current window.
    

This gives **O(n)** time because each element enters and leaves the deque at most once.

---

## Intuition (The WHY)

For every new element, two things can happen:

1. **Remove expired indices** → elements that are no longer inside the window.
    
2. **Remove smaller elements from the back** → they can never become the maximum while the new, larger element exists.
    

Example:

```text
Deque values: [9, 7, 5]
New value: 8

Remove 5
Remove 7
Keep 9

Result: [9, 8]
```

Why remove `7` and `5`?

Because `8` is newer and larger. Those elements will leave the window **before** `8`, so they will never be chosen as the maximum.

---

## Approach — Monotonic Deque

### Algorithm

For each index `i`:

1. Remove the front if it's outside the window.
    
2. Remove all smaller elements from the back.
    
3. Insert the current index.
    
4. Once the first full window is formed (`i >= k-1`), record `nums[dq[0]]`.
    

### Python Solution

```python
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()          # stores indices
    ans = []

    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] <= i - k:
            dq.popleft()

        # Maintain decreasing order
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()

        dq.append(i)

        # First valid window
        if i >= k - 1:
            ans.append(nums[dq[0]])

    return ans
```

---

## Dry Run

**nums = [1,3,-1,-3,5,3,6,7]**, `k = 3`

|i|Window|Deque (values)|Max|
|---|---|---|--:|
|0|[1]|[1]|—|
|1|[1,3]|[3]|—|
|2|[1,3,-1]|[3,-1]|3|
|3|[3,-1,-3]|[3,-1,-3]|3|
|4|[-1,-3,5]|[5]|5|
|5|[-3,5,3]|[5,3]|5|
|6|[5,3,6]|[6]|6|
|7|[3,6,7]|[7]|7|

Final answer:

```text
[3, 3, 5, 5, 6, 7]
```

---

## Why Store Indices Instead of Values?

Suppose:

```text
nums = [4, 2, 3]
k = 2
```

If the deque stored only values:

```text
Window becomes [2,3]
```

How do we know the `4` has expired?

We can't.

By storing indices:

|Index|Value|
|---|--:|
|0|4|
|1|2|
|2|3|

We simply remove indices satisfying:

```python
dq[0] <= i - k
```

Indices solve both expiration and duplicate-value problems.

---

## Why Is It O(n)?

Although there are nested `while` loops, each element is:

- **Inserted once**
    
- **Removed once**
    

So the total deque operations are bounded by:

- `n` pushes
    
- `n` pops
    

Total complexity:

**O(n)**

This is a classic **amortized analysis** interview question.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(k)**|

The deque never stores more than `k` indices.

---

## Important Variations

- **Leetcode 862** — Shortest Subarray with Sum at Least K _(Monotonic Queue + Prefix Sum)_
    
- **Sliding Window Minimum** — Reverse the comparison to maintain an increasing deque.
    
- **Online Stream Maximum** — Same deque idea works as elements arrive continuously.
    

---

## Common Mistakes / Quirks

### 1. Using values instead of indices

Incorrect:

```python
dq.append(nums[i])
```

Correct:

```python
dq.append(i)
```

### 2. Removing expired elements after pushing

Always remove expired indices **before** processing the current window.

### 3. Using `<` instead of `<=`

```python
while dq and nums[dq[-1]] <= nums[i]:
    dq.pop()
```

Using `<=` removes older duplicates and keeps the newer one, which survives longer in future windows.

---

## Pythonic Way

The entire solution relies on `collections.deque`, which provides:

- `append()`
    
- `pop()`
    
- `popleft()`
    

All in **O(1)** time.

Avoid using a list as a queue because `pop(0)` is **O(n)**.

---

## Key Takeaways / Pattern Recognition

- Sliding window + **max/min query** → Think **Monotonic Deque**.
    
- The deque stores **indices**, while values remain monotonically decreasing.
    
- The front is always the answer for the current window.
    
- Nested `while` loops do **not** imply O(n²); this is an **amortized O(n)** algorithm.
    
- This pattern generalizes to many interval optimization problems, making it one of the highest-value FAANG data structure techniques.