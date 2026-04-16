
# 🔤Longest Substring Without Repeating Characters

**Pattern:** Sliding Window

**Idea:** Increase window if new char. not in `set()` else pop chars from the left of the window up to the duplicate occurrence of the new char. inside the window

---

## 💻 Code

```Python

def lengthOfLongestSubstring(s: str) -> int:

	if not s:
		return 0

	ans = 1
	cur_len = 1

	i = 0
	j = 1

	n = len(s)

	st = set()
	st.add(s[0])

	while(j<n):

		if s[j] not in st:

			st.add(s[j])

			cur_len += 1

		else:

			ans = max(ans,cur_len)

			while(s[i]!=s[j]):

				st.discard(s[i])

				i+=1

				cur_len -=1

			else:  # when s[i] == s[j] i.e the duplicate char.

				i+=1 # only shorten window from left since char already in set

		j+=1



	return max(ans,cur_len)
```


## ✏️ Note
+ Can be optimized further by storing chars and their indices in the window. We would then simply jump to the duplicate occurrence

## 🔗References
[Leetcode](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Bloomberg, Uber, Oracle,
Goldman Sachs, Yahoo, Salesforce, Samsung, VMware, Walmart Global Tech, Intuit
Yandex, JPMorgan, Paypal, Spotify, Zoho
