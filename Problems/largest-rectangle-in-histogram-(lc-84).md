---
Title: Largest Rectangle in Histogram (leetcode 84)
Companies:
  - Accenture
  - thoughtspot
  - Visa
  - Coupang
  - tcs
  - Myntra
  - Flipkart
  - BitGo
  - Capital One
  - Amazon
  - Google
  - Waymo
  - Bloomberg
  - Microsoft
  - Walmart Labs
  - Roblox
  - josh technology
  - DoorDash
  - Meta
  - Uber
  - TikTok
  - Adobe
  - Cisco
  - Infosys
  - Salesforce
  - Goldman Sachs
  - Oracle
  - Apple
  - LinkedIn
Topics:
  - Arrays
  - Stack
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Monotonic Stack
  - Largest
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
Groups:
  - Rectangles
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Largest Rectangle in Histogram (LC 84)

**Pattern:**  monotonic stack

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def largestRectangleArea(heights: list[int]) -> int:
    stack = []  # Stores indices
    max_area = 0
    
    # Sentinel element ensures all remaining elements are popped at the end
    extended_heights = heights + [0] 
    
    for i, h in enumerate(extended_heights):
        # Maintain strictly increasing order
        while stack and extended_heights[stack[-1]] > h:
            height = extended_heights[stack.pop()]
            
            # If stack is empty, it means this height could extend all the way to index 0
            left_boundary = stack[-1] if stack else -1
            width = i - left_boundary - 1
            
            max_area = max(max_area, height * width)
            
        stack.append(i)
        
    return max_area

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

Remember:-
+ how to handle equal values , we can just push them
+ adding a zero to the last value to flush properly without extra conditional checks or code.


---


## 📌 PKM Note: Largest Rectangle in Histogram

#LeetCode 
## 🔍 Problem Overview

- LeetCode Link: [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
- Core Goal: Find the largest contiguous rectangular area that can be formed within a given histogram.
- Syllabus Placement: Stacks & Queues chapter $\rightarrow$ _Advanced Applications_ / _Monotonic Stack_ sub-topic. Usually taught as a prerequisite to 2D matrix problems like _Maximal Rectangle_.
- Tags: `Array`, `Stack`, `Monotonic Stack`

---

## 💡 Key Insights & Conceptual Blueprint

## 1. The "Centerpiece" (Anchor Height) Philosophy

For every single bar $i$, we want to find the largest rectangle where this specific bar acts as the limiting height (the bottle-neck).

- To maximize the area for a given height, the rectangle must expand as far left and right as possible.
- It stops expanding when it encounters a bar that is strictly shorter than it on either side.

## 2. Monotonic Stack Mechanics

We maintain a strictly increasing stack of bar indices.

- The Right Boundary Trigger: We iterate through the array. The moment the current bar $i$ is _shorter_ than the bar at the top of the stack, the increasing order is broken. This means the top bar cannot expand right any further—current index $i$ is its Right Boundary.
- The Left Boundary Revelation: When we pop that top element to calculate its area, the element _directly underneath it_ in the stack is the first bar to its left that is shorter. This is its Left Boundary.

$$\text{Width} = \text{Right Boundary} - \text{Left Boundary} - 1$$

## 3. Handling Duplicate Heights

If consecutive bars have equal heights (e.g., `[5, 5, 5]`), we can simply push them onto the stack (using a strict `>` condition for popping).

- When popped, the initial duplicates will yield a width that is technically under-calculated.
- Insight: The _very last_ duplicate popped will always have the correct, absolute left boundary, cleanly updating `max_area` to the true maximum. No extra conditional logic is needed.

## 4. Comparison: vs. Trapping Rain Water

While both use a monotonic stack in $O(n)$ time, they track opposite properties:

- Histogram: Uses an _increasing_ stack. Processes when hitting a _shorter_ bar. Finds area _under_ the bars.
- Rain Water: Uses a _decreasing_ stack. Processes when hitting a _taller_ bar. Finds volume _between_ the bars.

---

## 🛠️ Optimal Implementation (Python)

Using the sentinel trick—appending a `0` to the end of the `heights` array—forces the stack to completely clear out and process remaining boundaries at the end of the iteration.

```python
def largestRectangleArea(heights: list[int]) -> int:
    stack = []  # Stores indices
    max_area = 0
    
    # Sentinel element ensures all remaining elements are popped at the end
    extended_heights = heights + [0] 
    
    for i, h in enumerate(extended_heights):
        # Maintain strictly increasing order
        while stack and extended_heights[stack[-1]] > h:
            height = extended_heights[stack.pop()]
            
            # If stack is empty, it means this height could extend all the way to index 0
            left_boundary = stack[-1] if stack else -1
            width = i - left_boundary - 1
            
            max_area = max(max_area, height * width)
            
        stack.append(i)
        
    return max_area
```

## Complexity

- Time Complexity: $\mathcal{O}(n)$ — Every bar is pushed onto and popped from the stack exactly once.
- Space Complexity: $\mathcal{O}(n)$ — To store indices in the stack in the worst-case scenario (sorted heights).

---

# Largest Rectangle in Histogram (Leetcode 84)

**Tags:** #Stack #MonotonicStack #Arrays #Histogram #Greedy #NearestSmaller #DivideAndConquer #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given an array `heights`, where each element represents the height of a histogram bar (width = 1), return the **area of the largest rectangle** that can be formed.

**Example**

**Input**

```text
[2,1,5,6,2,3]
```

**Output**

```text
10
```

The maximum rectangle uses heights **5 and 6**, giving:

---

## Core Insight

Every bar can act as the **minimum height** of some rectangle.

The real question becomes:

> **How far can this bar extend left and right before a smaller bar stops it?**

This naturally leads to **Nearest Smaller Elements**, making the monotonic stack the optimal solution.

---

# Approach 1 — Brute Force (O(n²))

## Idea

For every bar:

1. Expand left while bars ≥ current.
    
2. Expand right while bars ≥ current.
    
3. Compute width × height.
    

### Python

```python
def largestRectangleArea(heights):
    n = len(heights)
    ans = 0

    for i in range(n):
        left = i
        while left >= 0 and heights[left] >= heights[i]:
            left -= 1

        right = i
        while right < n and heights[right] >= heights[i]:
            right += 1

        width = right - left - 1
        ans = max(ans, width * heights[i])

    return ans
```

### Complexity

|Time|Auxiliary Space|
|--:|--:|
|**O(n²)**|O(1)|

Useful only for intuition.

---

# Approach 2 — Better (Precompute NSE & PSE)

## Key Idea

For every bar, compute:

- **PSE** = Previous Smaller Element index
    
- **NSE** = Next Smaller Element index
    

Then:

Area:

---

## Step 1 — Previous Smaller

For:

```text
2 1 5 6 2 3
```

PSE indices:

```text
-1 -1 1 2 1 4
```

### Python

```python
def previousSmaller(heights):
    stack = []
    pse = [-1] * len(heights)

    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] >= h:
            stack.pop()

        pse[i] = stack[-1] if stack else -1
        stack.append(i)

    return pse
```

---

## Step 2 — Next Smaller

NSE:

```text
1 6 4 4 6 6
```

### Python

```python
def nextSmaller(heights):
    n = len(heights)
    stack = []
    nse = [n] * n

    for i in range(n - 1, -1, -1):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()

        nse[i] = stack[-1] if stack else n
        stack.append(i)

    return nse
```

---

## Compute Area

```python
def largestRectangleArea(heights):
    pse = previousSmaller(heights)
    nse = nextSmaller(heights)

    ans = 0

    for i in range(len(heights)):
        width = nse[i] - pse[i] - 1
        ans = max(ans, width * heights[i])

    return ans
```

### Complexity

|Time|Auxiliary Space|
|--:|--:|
|**O(n)**|**O(n)**|

Excellent interview solution and very intuitive.

---

# Approach 3 — Optimal Single Stack (O(n))

## Core Insight

Instead of explicitly storing NSE and PSE, compute the area **the moment a bar loses its right boundary**.

When a shorter bar appears:

- Current index = Right boundary
    
- New stack top = Left boundary
    

Width is immediately known.

---

## Monotonic Increasing Stack

The stack stores **indices** whose heights are increasing.

Example stack:

```text
Index : 2 3
Height: 5 6
```

Current = `2`

Since `2 < 6`, pop `6`.

Now we know:

- Right boundary = current index
    
- Left boundary = new stack top
    

Compute the rectangle immediately.

---

## Why the Width Formula Works

Suppose we pop height `6`.

```text
Index : 0 1 2 3 4
Height: 2 1 5 6 2
              ↑ pop
```

After popping:

- Right = `4`
    
- Left = `2`
    

Rectangle spans only:

```text
5 6
```

Width:

General formula:

Where:

- **Right** = current index
    
- **Left** = new stack top after popping
    

---

## Sentinel Trick

Append one extra `0`.

```text
2 1 5 6 2 3 0
```

The sentinel forces every remaining bar to be popped, eliminating a separate cleanup loop.

---

## Optimal Python Solution

```python
def largestRectangleArea(heights):
    stack = []
    ans = 0

    heights.append(0)

    for i, h in enumerate(heights):

        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]

            left = stack[-1] if stack else -1
            width = i - left - 1

            ans = max(ans, height * width)

        stack.append(i)

    heights.pop()
    return ans
```

---

## Dry Run

**Input**

```text
2 1 5 6 2 3
```

### When Current = 2

Stack before:

```text
5 6
```

Pop `6`

Width:

Area:

Pop `5`

Width:

Area:

Maximum becomes **10**.

---

## Why Every Bar Is Popped Once

Each index undergoes:

- **One push**
    
- **One pop**
    

Therefore, despite the nested loop, the total work is linear.

This is the classic **amortized O(n)** argument.

---

# Divide & Conquer Approach

Choose the minimum bar as the rectangle height.

Solve recursively:

- Left half
    
- Right half
    
- Whole interval
    

```text
Area =
max(
    Left,
    Right,
    MinHeight × Width
)
```

### Complexity

|Case|Time|
|---|--:|
|Worst|O(n²)|
|With Segment Tree|O(n log n)|

Mostly of theoretical interest; monotonic stack is preferred in interviews.

---

# Comparison of All Approaches

|Approach|Time|Space|Interview Value|
|---|--:|--:|---|
|Brute Force|O(n²)|O(1)|⭐ Intuition|
|NSE + PSE|O(n)|O(n)|⭐⭐⭐ Very good|
|Single Stack|O(n)|O(n)|⭐⭐⭐⭐ Optimal|
|Divide & Conquer|O(n²)|O(log n)|Rare|

---

## Common Mistakes

### 1. Using `>` Instead of `>=` for NSE/PSE

For duplicate heights:

```text
2 2 2
```

Use:

```python
while heights[stack[-1]] >= h:
```

Otherwise widths become incorrect.

### 2. Forgetting the Sentinel

Without appending `0`, bars remaining in the stack never get processed.

### 3. Storing Heights Instead of Indices

Indices are essential because width depends on **positions**, not values.

Wrong:

```python
stack.append(height)
```

Correct:

```python
stack.append(index)
```

---

## Relationship to Other Monotonic Stack Problems

|Problem|Stack Type|Purpose|
|---|---|---|
|Previous Greater|Decreasing|Nearest Greater Left|
|Next Greater|Decreasing|Nearest Greater Right|
|Stock Span|Decreasing|Distance|
|Largest Rectangle|Increasing|Width Boundaries|
|Maximal Rectangle (LC 85)|Increasing|Histogram per Row|

The histogram problem is the **foundation** for LC 85.

---

## Pattern Recognition

Whenever the problem asks:

- Largest rectangle
    
- Maximum area with minimum height
    
- Nearest smaller boundaries
    
- Histogram optimization
    

Think:

1. **Each bar is the limiting height.**
    
2. Find its left and right smaller boundaries.
    
3. Width = `right − left − 1`.
    
4. A **Monotonic Increasing Stack** computes these boundaries in linear time.
    

> **Interview Heuristic:** “Rectangle + Histogram” almost always translates to **Nearest Smaller Elements + Monotonic Increasing Stack**.