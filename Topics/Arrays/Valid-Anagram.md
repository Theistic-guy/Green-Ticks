
# ✔️Valid Anagram

**Pattern:** Arrays

**Idea:** Individual count of each char and total length should match

---

## 💻 Code

```Python

from collections import defaultdict

def isAnagram( s: str, t: str) -> bool:
	total_cnt = 0
	chars = defaultdict(int)
	for c in s:
		chars[c] += 1
		total_cnt += 1
	
	for c in t:
		if chars[c] == 0:
			return False
		else:
			chars[c] -=1
			total_cnt -= 1
	
	if total_cnt == 0:
		return True
	else:
		return False

        
```




## 🔗References
[Leetcode](https://leetcode.com/problems/valid-anagram/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Bloomberg, Goldman Sachs, Spotify, Affirm
