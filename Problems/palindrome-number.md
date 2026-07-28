---
Title: Palindrome Number
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
Link: ""
---

# Palindrome Number

**Pattern:** 
**Idea:** 

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
[prefix-and-suffix-arrays](Green-Ticks/Topics/prefix-and-suffix-arrays.md)
