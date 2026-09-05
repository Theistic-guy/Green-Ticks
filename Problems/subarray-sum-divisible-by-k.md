---
Title: Subarray Sum Divisible by K
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
  - Hashing
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Subarray
  - kth
Link: ""
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Subarray Sum divisible by K

**Pattern:**  Prefix sum + hashing

**Idea:** 

**Variations** : 
+ part of [Subarray with Given Sum — Important Interview Variations (Solutions)](../Notes/Subarray%20with%20Given%20Sum%20—%20Important%20Interview%20Variations%20(Solutions).md)

#LeetCode 974

---

## 💻 Code

```Python
from collections import defaultdict

def divisible(nums, k):

    freq = defaultdict(int)

    freq[0] = 1

    prefix = 0
    ans = 0

    for num in nums:

        prefix += num

        rem = prefix % k

        ans += freq[rem]

        freq[rem] += 1

    return ans

```
**Time complexity** - O($n$)

**Aux. Space complexity** -  O($n$)

---

## Problem

Count subarrays whose sum is divisible by `k`.

---

## Key Idea

Instead of storing

```text
Prefix Sum
```

store

```text
Prefix Sum % k
```

Suppose

```text
Prefix1 % k = Prefix2 % k
```

Then

```text
Prefix2-Prefix1
```

is divisible by `k`.

---

## Python Code

```python
from collections import defaultdict

def divisible(nums, k):

    freq = defaultdict(int)

    freq[0] = 1

    prefix = 0
    ans = 0

    for num in nums:

        prefix += num

        rem = prefix % k

        ans += freq[rem]

        freq[rem] += 1

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**


## Explanation

------------------------------
### ⚙️ How It Works (Step-by-Step)
The algorithm tracks the cumulative sum of the array and uses remainders to find matching subarrays.

 
* Prefix Sum: It keeps a running total (prefix) of the numbers visited so far.
* Modulo Math: It calculates the remainder (rem) when the running total is divided by $k$.
* The Core Logic: If the same remainder shows up multiple times, the numbers added in between those two points must sum up to a multiple of $k$.
* Frequency Tracking: The defaultdict(int) counts how many times each remainder has appeared.
* Base Case: freq[0] = 1 accounts for any prefix sum that is already perfectly divisible by $k$ without needing to subtract a previous subarray. [5, 6, 7, 8, 9] 



### 📊 Tracing an Example
Let's trace nums = [4, 5, 0, -2, -3, 1] with k = 5.

| Element (num) | Prefix Sum | Remainder (rem) | Matches Found (freq[rem]) | Total Answer (ans) | Updated Frequency |
|---|---|---|---|---|---|
| Start | 0 | - | - | 0 | {0: 1} |
| 4 | 4 | 4 | 0 | 0 | {0: 1, 4: 1} |
| 5 | 9 | 4 | 1 | 1 | {0: 1, 4: 2} |
| 0 | 9 | 4 | 2 | 3 | {0: 1, 4: 3} |
| -2 | 7 | 2 | 0 | 3 | {0: 1, 4: 3, 2: 1} |
| -3 | 4 | 4 | 3 | 6 | {0: 1, 4: 4, 2: 1} |
| 1 | 5 | 0 | 1 | 7 | {0: 2, 4: 4, 2: 1} |

Final Output: 7 matching subarrays.

⚠️ Potential Edge Case Note
In Python, this code works perfectly with negative numbers because Python's % operator always returns a result with the same sign as the divisor ($k$). In languages like Java or C++, you would need to adjust negative remainders manually using (rem + k) % k.

Let’s break it down without the heavy math.
The core issue is that Java/C++ and Python disagree on what a "remainder" is when numbers are negative. This disagreement breaks our code's ability to find matches.

### 🍕 The Intuition (The Clock Analogy)
Think of modulo 5 like a clock with only 5 numbers: 0, 1, 2, 3, 4.

* If you stand at 0 and move 3 steps forward, you land on 3.
* If you stand at 0 and move 2 steps backward (which is -2), you also land on 3.

In reality, -2 and 3 are the exact same spot on our clock.

#### 🚨 Why Java/C++ Breaks It
Our code relies on finding exact duplicates in our map (freq[rem]).
Imagine your array generates a prefix sum of 3 early on, and later generates a prefix sum of -2.

* Python says -2 % 5 is 3. Python looks at the map, sees a 3 from earlier, shouts "Match found!", and increments your answer.
* Java/C++ says -2 % 5 is -2. Java looks at the map for -2. It only sees a 3. It thinks they are different numbers, misses the match, and gives you the wrong answer.


#### 🛠️ The Fix Explained
Because Java/C++ leaves you at -2, we have to manually push it forward by one full circle (+ k) to get it to the positive equivalent. [1] 
If Java gives us rem = -2:

   1. We check if it's negative: rem < 0 (Yes, -2 is less than 0).
   2. We add k: -2 + 5 = 3.
   3. Now rem is 3.

Because we forced -2 to become 3, Java will now successfully match it with the 3 stored in the map earlier!