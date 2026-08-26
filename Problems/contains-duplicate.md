---
Title: Contains Duplicate
Companies:
  - Not Specified
Topics:
  - Arrays
  - Hashing
Platform:
  - Leetcode
Difficulty: Not Specified
Other Tags:
  - Duplicates
Link: "[Leetcode](https://leetcode.com/problems/contains-duplicate/)"
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
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
