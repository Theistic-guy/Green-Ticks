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

