---
Title: Largest Rectangle in Histogram
Companies:
  - Not Specified
Topics:
  - Arrays
  - Monotonic Stack
  - Stack
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Monotonic Stack
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
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

## 🚀 Next Steps & Extensions

If you are ready to expand on this pattern, I can help you extend this exact 1D histogram solution to solve [LeetCode 85: Maximal Rectangle in a 2D Binary Matrix](https://leetcode.com/problems/maximal-rectangle/) or look into the Divide & Conquer approach using Segment Trees. Which direction would you like to explore next?