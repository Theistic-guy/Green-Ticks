---
Title: Count Digits
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
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Count digits

**Pattern:** 

**Idea:** 

---

## 💻 Code

```Python

def count_digits(n):
    n = abs(n)

    if n == 0:
        return 1

    count = 0
    while n > 0:
        count += 1
        n //= 10

    return count


```
