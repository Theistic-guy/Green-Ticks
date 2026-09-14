---
Title: Minimum Number of Steps to Make Two Strings Anagram (LC 1347)
Companies:
  - Not Specified
Topics:
  - Strings
  - Hashing
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Minimum
  - Anagram
Link: ""
Rating:
  - ⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Minimum Number of Steps to Make Two Strings Anagram

**Pattern:** 

**Idea:** 

**Variations** : 
+ [minimum-number-of-steps-to-make-two-strings-anagram-ii-(lc-2186)](minimum-number-of-steps-to-make-two-strings-anagram-ii-(lc-2186).md)


---

## 💻 Code

```Python
from collections import Counter

class Solution:
    def minSteps(self, s: str, t: str) -> int:
        # Step 1: Count character frequencies for both strings
        count_s = Counter(s)
        count_t = Counter(t)
        
        steps = 0
        
        # Step 2: Sum up only the positive differences where s has more than t
        for char in count_s:
            if count_s[char] > count_t[char]:
                steps += count_s[char] - count_t[char]
                
        return steps
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---

## 📌 PKM Note: Minimum Number of Steps to Make Two Strings Anagram
#LeetCode 

- Topic: Hash Table / Counting / String
- LeetCode Link: [1347. Minimum Number of Steps to Make Two Strings Anagram](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/)
- Difficulty: 🟡 Medium
- Rating: ⭐⭐⭐ (Essential String Manipulation pattern)

---

## 📝 Problem Explanation

Given two equal-length strings `s` and `t`, you want to make `t` an anagram of `s` by replacing characters in `t`. An anagram means both strings have the exact same characters with the exact same frequencies.

Since the strings are already of equal length, every time you replace a wrong character in `t`, you change it into a correct character that `s` needs. Therefore, you only need to count how many characters are missing in `t` compared to `s`.

---

## 💡 Core Intuition

1. Count the frequency of each character in both strings.
2. If `s` has more occurrences of a character than `t` does, `t` is missing that many copies of that character.
3. Sum up all these positive differences. The total is the exact number of replacements needed.

---

## 💻 Code Solution (Python)

```python
from collections import Counter

class Solution:
    def minSteps(self, s: str, t: str) -> int:
        # Step 1: Count character frequencies for both strings
        count_s = Counter(s)
        count_t = Counter(t)
        
        steps = 0
        
        # Step 2: Sum up only the positive differences where s has more than t
        for char in count_s:
            if count_s[char] > count_t[char]:
                steps += count_s[char] - count_t[char]
                
        return steps
```

---

## ⚙️ Alternative Space-Optimized Approach (Fixed Array)

Since the input consists only of lowercase English letters, we can use a fixed-size array of size 26 instead of two hash maps.

```python
class Solution:
    def minSteps(self, s: str, t: str) -> int:
        # Single frequency array for 26 lowercase letters
        freq = [0] * 26
        
        # Increment for s, decrement for t
        for i in range(len(s)):
            freq[ord(s[i]) - ord('a')] += 1
            freq[ord(t[i]) - ord('a')] -= 1
            
        # Sum up only the positive counts (surplus characters in s)
        steps = sum(count for count in freq if count > 0)
        
        return steps
```

---

## 📊 Complexity Analysis

- Time Complexity: $\mathcal{O}(N)$
    
    - We iterate through the strings of length N exactly once to build the counts. The subsequent loop runs at most 26 times (fixed alphabet size).
    
- Space Complexity: $\mathcal{O}(1)$ auxiliary space
    
    - The hash map or frequency array size is bounded by the alphabet size (26 lowercase English characters), which stays constant regardless of how large N grows.
    
