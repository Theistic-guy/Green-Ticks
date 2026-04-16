
# 🧊 Container With Most Water

**Pattern:** Two Pointers

**Idea:** Move the pointer at the smaller height, can move both inwards if height is same

---

## 💻 Code

```Python

def maxArea(self, heights: List[int]) -> int:
	ans = 0
	i = 0
	j = len(heights)-1
	while(i<j):

		ans = max(ans,(j-i)*min(heights[i],heights[j]))

		if heights[i]<heights[j]:
			i += 1
		elif heights[i]>heights[j]:
			j -= 1
		else:
			i +=1
			j -= 1
	
	return ans
```




## 🔗References
[Leetcode](https://leetcode.com/problems/container-with-most-water/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Bloomberg, Goldman Sachs, Swiggy
