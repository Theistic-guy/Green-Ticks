
# 🥇Top K Frequent Elements

**Pattern:** Arrays

**Idea:** use `Counter` dictionary implementation

---

## 💻 Code

```Python

from collections import Counter

def topKFrequent(nums: List[int], k: int) -> List[int]:
	cnt = Counter(nums)
	return [i[0] for i in cnt.most_common(k)]
        
```




## 🔗References
[Leetcode](https://leetcode.com/problems/top-k-frequent-elements/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Bloomberg, Uber, Oracle, Cisco
