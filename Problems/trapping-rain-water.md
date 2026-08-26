---
Title: Trapping Rain Water
Companies:
  - Amazon
  - Google
  - Microsoft
  - Facebook
  - Apple
  - Adobe
  - Bloomberg
  - Uber
  - Oracle
  - Goldman Sachs
  - Snapchat
  - Intuit
  - Visa
  - Paypal
  - Citadel
  - Qualtrics
  - ServiceNow
  - Rubrik
  - Tesla
  - Intel
  - National Instruments
  - Sapient
Topics:
  - Two Pointers
  - Monotonic Stack
  - Prefix and Suffix Arrays
Platform:
  - Leetcode
Difficulty: Not Specified
Other Tags:
  - GFG
Link: "[Leetcode](https://leetcode.com/problems/trapping-rain-water/)"
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# 🌧️Trapping Rain Water

**Pattern:** Two Pointers, Monotonic Stack, Prefix & Suffix arrays

**Idea:** For each height, store left-side & right-side max, water is `min(left,right)-height`

---

## 💻 Code

```Python


def trap(heights: List[int]) -> int:
	n = len(heights)
	left_max = [0] * n
	right_max = [0] * n
	left_max[0] = heights[0]
	right_max[n-1] = heights[n-1]

	for i in range(1,n):
		left_max[i] = max(left_max[i-1],heights[i-1])

	for i in range(n-2,-1,-1):
		right_max[i] = max(right_max[i+1],heights[i+1])


	water = 0
	for i in range(n):
		possible_height = min(left_max[i],right_max[i])
		if possible_height > heights[i]:
			water += possible_height-heights[i]
	
	return water

```



## ✏️ Note
<details>
<summary> Two pointers soln.  </summary>
Left, Right ptrs => if left ls. than Right move left else vice-versa
left_max, right_max => keep them calculating as we move then calculate water for each height as<br> <b> min(left_max,right_max) - height </b>
	
```Python
def trap(height):
	if not height:
		return 0
		
	left, right = 0, len(height) - 1
	left_max, right_max = height[left], height[right]
	water = 0
	
	while left < right:
		if height[left] < height[right]:
			left += 1
			left_max = max(left_max, height[left])
			water += left_max - height[left]
		else:
			right -= 1
			right_max = max(right_max, height[right])
			water += right_max - height[right]
			
	return water
```
</details>
#### Stack based
The stack-based solution for Trapping Rain Water uses a monotonic decreasing stack to find bounded "valleys". [1]

To answer your direct question first: Yes, you can pop equal height elements, or you can choose to skip them. Both ways work perfectly, but popping them is cleaner because it handles duplicate calculations naturally without adding complex `if/else` checks to your code. [2]

---

##### Python Implementation

Here is the cleanest way to implement the stack solution in Python. We pop elements when the current height is greater than _or equal to_ the stack top. [3]

```python
def trap(height: list[int]) -> int:
    stack = []  # Stores indices of the bars
    water_trapped = 0
    
    for current_idx, current_h in enumerate(height):
        # We found a right wall that is taller than (or equal to) the valley
        while stack and current_h >= height[stack[-1]]:
            valley_idx = stack.pop()  # This is the bottom of our pool
            
            # If there is no left wall left in the stack, water spills out
            if not stack:
                break
                
            left_idx = stack[-1]  # The new top of the stack is our left wall
            
            # Calculate bounded container dimensions
            distance = current_idx - left_idx - 1
            bounded_height = min(current_h, height[left_idx]) - height[valley_idx]
            
            water_trapped += distance * bounded_height
            
        stack.append(current_idx)
        
    return water_trapped
```

---

##### Why Popping Equal Heights is Safe (Visual Trace)

Imagine a flat valley floor: `height = [4, 2, 2, 5]`.

1. Stack gets indices: `[0, 1, 2]` (Heights: `4, 2, 2`).
2. We hit index 3 (Height `5`).
3. First Loop Pass: `current_h (5) >= height[2] (2)`. We pop index 2 (valley = 2).
    
    - `left_idx` becomes index 1 (height 2).
    - `bounded_height = min(5, 2) - 2 = 0`.
    - Water added = $0$. (This safely handles the flat floor).
    
4. Second Loop Pass: The loop runs again immediately because `current_h (5) >= height[1] (2)`. We pop index 1 (valley = 2).
    
    - `left_idx` becomes index 0 (height 4).
    - `bounded_height = min(5, 4) - 2 = 2`.
    - `distance = 3 - 0 - 1 = 2`.
    - Water added = $2 \times 2 = 4$. [4]
    
5. The entire pool is calculated perfectly in horizontal slices.

If you do not pop equal elements (i.e., using strictly `current_h > height[stack[-1]]`), index 1 and index 2 would stay stuck together. You would have to write extra code to manually skip or override them to prevent calculating the exact same area twice. Popping them makes the math resolve to zero water for that specific slice, which is clean and bug-free.

---

##### How to Explain the Stack Approach in an Interview

If an interviewer asks you about this solution, you can explain the core intuition using these three structured points:

- Horizontal Slices instead of Vertical Columns: "Unlike the two-pointer approach which calculates water column-by-column, the stack approach calculates water horizontally, layer-by-layer." [1] [5]
- Monotonic Decreasing Property: "We keep indices in a stack in strictly decreasing order of height. A decreasing stack means we are going down into a valley [2]." [6, 7]
- The Trigger Condition: "The moment we see a bar taller than the stack's top, it means we found a right wall. We pop the valley bottom, look at the next item in the stack as our left wall, and calculate the water trapped in that specific horizontal ditch [1]." [8]

Would you like to analyze the Time and Space Complexity of this stack method compared to the two-pointer solution, or dry-run another array?

  

[1] [https://medium.com](https://medium.com/deluxify/leetcode-42-trapping-rain-water-111061a97241)

[2] [https://algo.monster](https://algo.monster/liteproblems/2282)

[3] [https://www.linkedin.com](https://www.linkedin.com/pulse/guide-solving-problem-based-monotonic-stack-leetcode-ujjwal-kumar)

[4] [https://www.reddit.com](https://www.reddit.com/r/leetcode/comments/1d0brjl/struggling_to_understand_two_pointer_solution_to/)

[5] [https://medium.com](https://medium.com/@yejj177/please-the-last-time-trapping-rain-water-c1c6a1039096)

[6] [https://unwiredlearning.com](https://unwiredlearning.com/blog/monotonic-stack-guide)

[7] [https://medium.com](https://medium.com/@kishanbabariya101/advanced-stack-applicationsdata-structures-and-algorithms-deep-dive-advanced-stack-applications-b78bfa21dd86)

[8] [https://medium.com](https://medium.com/deluxify/leetcode-42-trapping-rain-water-111061a97241)


## 🔗References
[Leetcode](https://leetcode.com/problems/trapping-rain-water/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Bloomberg, Uber, Oracle, Goldman Sachs, Snapchat, Intuit, Visa, Paypal, Citadel, Qualtrics, ServiceNow, Rubrik, Tesla, Intel, National Instruments, Sapient
