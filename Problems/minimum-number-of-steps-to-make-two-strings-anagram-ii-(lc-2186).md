---
Title: Minimum Number of Steps to Make Two Strings Anagram II (leetcode 2186)
Companies:
  - Not Specified
Topics:
  - Strings
  - Hashing
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Anagram
  - Minimum
Link: ""
Rating:
  - ⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Minimum Number of Steps to Make Two Strings Anagram II (LC 2186)

**Pattern:** 

**Idea:** 

**Variations** : 
+ [minimum-number-of-steps-to-make-two-strings-anagram-(lc-1347)](minimum-number-of-steps-to-make-two-strings-anagram-(lc-1347).md)

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
        # Combine unique characters from both strings
        all_chars = set(count_s.keys()).union(set(count_t.keys()))
        
        # Step 2: Sum the absolute differences for all characters
        for char in all_chars:
            steps += abs(count_s[char] - count_t[char])
            
        return steps

```
**Time complexity** - O( N + M ) 

**Aux. Space complexity** -  O(1) , if we use 26 alphabet array

---


## 📌 PKM Note: Minimum Number of Steps to Make Two Strings Anagram II
#LeetCode 

- Topic: Hash Table / Counting / String
- LeetCode Link: [2186. Minimum Number of Steps to Make Two Strings Anagram II](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram-ii/)
- Difficulty: 🟡 Medium
- Rating: ⭐⭐⭐ (Core frequency distribution alignment pattern)

---

## 📝 Problem Explanation

Given two strings `s` and `t` (which can be of different lengths), you want to make them anagrams of each other. In this variation, the only allowed operation is appending characters to either string.

Because you cannot change or delete existing characters, any discrepancy in character frequency must be balanced by appending the missing characters to the deficient string. An anagram requires _every_ unique character to have the exact same count in both strings.

---

## 💡 Core Intuition

1. Count the frequency of every character in both strings.
2. For any character, if `s` has 5 copies and `t` has 2 copies, you _must_ add 3 copies to `t`.
3. If `t` has 4 copies of a character and `s` has 0 copies, you _must_ add 4 copies to `s`.
4. Therefore, for every character present in either string, the number of operations needed is the absolute difference between its frequency in `s` and its frequency in `t`.
5. Summing these absolute differences across all unique characters gives the minimum total steps.

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
        # Combine unique characters from both strings
        all_chars = set(count_s.keys()).union(set(count_t.keys()))
        
        # Step 2: Sum the absolute differences for all characters
        for char in all_chars:
            steps += abs(count_s[char] - count_t[char])
            
        return steps
```

---

## ⚙️ Alternative Space-Optimized Approach (Fixed Array)

Using a single fixed-size array of size 26 avoids the overhead of hash maps and set unions.

```python
class Solution:
    def minSteps(self, s: str, t: str) -> int:
        # Single frequency array for 26 lowercase English letters
        freq = * 26
        
        # Increment counts for characters in s
        for char in s:
            freq[ord(char) - ord('a')] += 1
            
        # Decrement counts for characters in t
        for char in t:
            freq[ord(char) - ord('a')] -= 1
            
        # Sum the absolute values of all final frequencies
        return sum(abs(count) for count in freq)
```

---

## 📊 Complexity Analysis

- Time Complexity: $\mathcal{O}(N + M)$
    
    - We traverse string `s` of length $N$ and string `t` of length $M$ to build the frequency map. The subsequent loop runs at most 26 times (alphabet size), which takes $\mathcal{O}(1)$ time.
    
- Space Complexity: $\mathcal{O}(1)$ auxiliary space
    
    - The storage is strictly bounded by the 26 lowercase English characters, remaining constant regardless of the sizes of $N$ or $M$.
    

Would you like me to extract a direct comparison table highlighting the differences in logic between Part I and Part II, or should I generate Obsidian frontmatter tags (like `date`, `status`, `aliases`) to make these ready to paste into your digital garden?