---
Title: Longest Palindromic Substring (leetcode 5)
Companies:
  - Not Specified
Topics:
  - Strings
  - Two Pointers
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Substring
  - Longest
Link: ""
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Longest Palindromic Substring (LC 5)
**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python

class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s or len(s) < 1: return ""
        start, end = 0, 0
        
        def expand(left: int, right: int) -> int:
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return right - left - 1  # Length of the valid palindrome

        for i in range(len(s)):
            len1 = expand(i, i)      # Odd length parity ("aba")
            len2 = expand(i, i + 1)  # Even length parity ("abba")
            max_len = max(len1, len2)
            
            if max_len > (end - start):
                start = i - (max_len - 1) // 2
                end = i + max_len // 2
                
        return s[start:end + 1]
```
**Time complexity** - O(n<sup>2</sup> ) 

**Aux. Space complexity** -  O(1)

---

## 📝 LeetCode 5: Longest Palindromic Substring

#LeetCode 

## 📌 Core Insights & Symmetries

- Symmetry Check: Palindromes expand symmetrically from a central pivot point.
- The Parity Problem: Centers can be Odd (a single character: `a -> b -> a`) or Even (the blank space between characters: `a -> b | b -> a`). Every algorithm must check both parities independently to avoid missing solutions.

---

## 🛠️ The Spectrum of Solutions

|Approach|Time Complexity|Space Complexity|Best Used For...|
|---|---|---|---|
|Expand Around Center|O(N²)|O(1)|Standard Interviews. Low bug risk, memory-efficient.|
|Split-Sign Hash + BS|$O(N \log N)$|O(N)|Massive Inputs (N ≥ 10⁵). Conceptually brilliant.|
|Manacher's Algorithm|O(N)|O(N)|Hardcore competitive programming. Highly complex.|

---

## 🏎️ Approach 1: Expand Around Center (Interview Meta)

Instead of extracting every substring and verifying it, treat every single index (and the space between indices) as a center pivot. Move outward using pointers as long as characters match.

## Implementation (Python)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s or len(s) < 1: return ""
        start, end = 0, 0
        
        def expand(left: int, right: int) -> int:
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return right - left - 1  # Length of the valid palindrome

        for i in range(len(s)):
            len1 = expand(i, i)      # Odd length parity ("aba")
            len2 = expand(i, i + 1)  # Even length parity ("abba")
            max_len = max(len1, len2)
            
            if max_len > (end - start):
                start = i - (max_len - 1) // 2
                end = i + max_len // 2
                
        return s[start:end + 1]
```

---

## 🧠 Approach 2: Custom Split-Sign Hash + Binary Search on Answer

When constraints scale up to N = 10⁵, O(N²) time will trigger a Time Limit Exceeded (TLE) error. This custom approach optimizes runtime to $O(N \log N)$ by binary searching the max palindrome length and running a single-pass polynomial sliding window check.

## 1. The "Split-Sign" Polynomial Target

Instead of managing separate forward and backward hashes, use a single position-weighted polynomial hash anchored to global string indices via a prime base (B) and modulo (M).

- Even Window (Length 4):  
    $$H = -c_0 B^0 - c_1 B^1 + c_2 B^2 + c_3 B^3$$  
    If the substring is a palindrome, terms pair up with opposite signs and cancel out exactly to `0`.
- Odd Window (Length 3):  
    Skip calculating the absolute middle element. The outer terms cancel out cleanly, targeting `0`.

## 2. True O(1) Sliding Mechanics (Global Index Anchoring)

When shifting the window right, the geometric center moves. Instead of doing expensive modular divisions, compute the net sign updates against the global power array:

1. Drop Left element: Add back the negative term leaving the window.
2. Flip Midpoint element: A character transitions from the positive right-half to the negative left-half. Subtract its value twice (-2 × term).
3. Add Right element: Add the incoming character with a positive sign.

## Implementation (Python)

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s: return ""
        n, BASE, MOD = len(s), 31, 10**9 + 7
        
        # Precompute global polynomial powers
        power = [1] * (n + 1)
        for i in range(1, n + 1):
            power[i] = (power[i - 1] * BASE) % MOD

        def check_length(L: int) -> str:
            if L == 0: return ""
            mid_offset = L // 2
            curr_hash = 0
            
            # Initial window layout
            for i in range(L):
                term = (ord(s[i]) * power[i]) % MOD
                if i < mid_offset:
                    curr_hash = (curr_hash - term) % MOD
                else:
                    if L % 2 != 0 and i == mid_offset: continue
                    curr_hash = (curr_hash + term) % MOD
            
            if curr_hash % MOD == 0: return s[0:L]
            
            # True O(1) sliding execution
            for i in range(L, n):
                left_out, mid_flip, right_in = i - L, i - mid_offset, i
                
                # Step A: Drop old left item
                curr_hash = (curr_hash + ord(s[left_out]) * power[left_out]) % MOD
                
                # Step B: Manage center crossing mechanics
                if L % 2 == 0:
                    flip_term = (2 * ord(s[mid_flip]) * power[mid_flip]) % MOD
                    curr_hash = (curr_hash - flip_term) % MOD
                else:
                    curr_hash = (curr_hash - ord(s[mid_flip - 1]) * power[mid_flip - 1]) % MOD
                    curr_hash = (curr_hash - ord(s[mid_flip]) * power[mid_flip]) % MOD

                # Step C: Append new right item
                curr_hash = (curr_hash + ord(s[right_in]) * power[right_in]) % MOD
                
                if curr_hash % MOD == 0:
                    return s[left_out + 1 : right_in + 1]
            return ""

        # Binary Search Engine running separate Parity Ranges
        longest_str = ""
        for parity in: # Odd lengths first, then Even
            low, high = parity, n if n % 2 == parity else n - 1
            while low <= high:
                mid = low + (high - low) // 2
                if mid % 2 != parity: mid += 1
                if mid > high: break
                    
                res = check_length(mid)
                if res:
                    if len(res) > len(longest_str): longest_str = res
                    low = mid + 2
                else:
                    high = mid - 2
        return longest_str
```

---
