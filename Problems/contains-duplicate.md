---
Title: Contains Duplicate
Companies: [Not Specified]
Topics:
  - Arrays
  - Hashing
Platform:
  - Leetcode
Difficulty: Not Specified
Other Tags:
Link: "[Leetcode](https://leetcode.com/problems/contains-duplicate/)"
---

# 1️⃣1️⃣Contains  Duplicate

**Idea:** Use hashing

---

## 💻 Code

```Python

def hasDuplicate(nums: List[int]) -> bool:
	set1 = set()
	for i in nums:
		if i not in set1:
			set1.add(i)
		else:
			return True
	return False
```
