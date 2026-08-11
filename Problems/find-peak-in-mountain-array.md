---
Title: Find peak in mountain array
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Binary Search
Link: ""
---

# Palindrome Number

**Pattern:** 
**Idea:** 
**Variations** : 

---

## 💻 Code

```Python
def isPalindrome(x):
    if x < 0:
        return False

    original = x
    rev = 0

    while x > 0:
        digit = x % 10
        rev = rev * 10 + digit
        x //= 10

    return original == rev

```
**Time complexity** - O(D) , D is no of digits
**Aux. Space complexity** -  O(1)

---
