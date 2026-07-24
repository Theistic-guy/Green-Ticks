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
Link: "[Leetcode](https://leetcode.com/problems/trapping-rain-water/)"
---

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



## 🔗References
[Leetcode](https://leetcode.com/problems/trapping-rain-water/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Bloomberg, Uber, Oracle, Goldman Sachs, Snapchat, Intuit, Visa, Paypal, Citadel, Qualtrics, ServiceNow, Rubrik, Tesla, Intel, National Instruments, Sapient
