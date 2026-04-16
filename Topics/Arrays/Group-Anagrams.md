
# 🔠Group Anagrams

**Pattern:** Arrays, Strings, Sorting

**Idea:** Sort each string, create their array then sort it as well. 

---

## 💻 Code

```Python

from collections import Counter

def groupAnagrams(self, strs: List[str]) -> List[List[str]]:

	lst = [("".join(sorted(val)),idx) for idx,val in enumerate(strs)]
	lst.sort(key=lambda x:x[0])

	ans = [[strs[lst[0][1]]]]
	for i in range(1,len(strs)):
		if lst[i][0] == lst[i-1][0]:
			ans[-1].append(strs[lst[i][1]])
		else:
			ans.append([strs[lst[i][1]]])

	return ans             

```




## 🔗References
[Leetcode](https://leetcode.com/problems/group-anagrams/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Uber, Oracle, Goldman Sachs, Yahoo, Salesforce, tiktok, Cisco, VMware, Walmart Global Tech, IBM, Visa, eBay, JPMorgan, ServiceNow, Twilio, Affirm, BlackRock, Alation
