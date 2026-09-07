---
Title: Maximize Points You Can Get from Cards (Leetcode 1423)
Companies:
  - Not Specified
Topics:
  - Arrays
  - Sliding Window
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Subarray
  - Maximum
Link: ""
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Maximize Points You Can Get from Cards (Leetcode 1423)

**Pattern:** 

**Idea:** 

**Variations** : 
+ part of [Complementary Counting](../Notes/Complementary%20Counting.md)
+ similar idea to [minimum-operations-to-reduce-x-to-zero](minimum-operations-to-reduce-x-to-zero.md)

---

## 💻 Code

```Python
def maxScore(cardPoints, k):
    n = len(cardPoints)

    if k == n:
        return sum(cardPoints)

    window = n - k
    total = sum(cardPoints)

    curr = sum(cardPoints[:window])
    min_sum = curr

    for i in range(window, n):
        curr += cardPoints[i]
        curr -= cardPoints[i - window]
        min_sum = min(min_sum, curr)

    return total - min_sum
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

---

# Maximize Points You Can Get from Cards (Leetcode 1423)

**Tags:** #SlidingWindow #TwoPointers #Arrays #Optimization #FixedWindow #Interview-Pattern #LeetCode #FAANG

## Problem Statement

You are given an integer array `cardPoints` and an integer `k`.

In one operation, you can pick **one card from either the beginning or the end** of the array. You must pick exactly `k` cards.

Return the **maximum score** obtainable.

**Example**

- `cardPoints = [1,2,3,4,5,6,1]`
    
- `k = 3`
    
- **Answer:** `12` (pick `6 + 5 + 1`)
    

---

## Key Idea

Instead of maximizing the picked cards, **minimize the cards left behind**.

If exactly `k` cards are picked, then the remaining cards form **one contiguous subarray** of length:

Therefore:

This converts an end-picking problem into a **fixed-size sliding window** problem.

---

## Intuition (The WHY)

Example:

```text
Cards: [1, 2, 3, 4, 5, 6, 1]
Pick 3 cards
```

Whatever you pick from the ends, the middle remains contiguous.

Example:

```text
Pick: [1,2]          [6]
Keep:      [3,4,5]
```

Instead of exploring every left/right combination:

- Find the **minimum sum** contiguous window of size `n-k`.
    
- Remove it from the total.
    

**Maximum picked = Total − Minimum kept**

---

## Optimal Approach — Fixed-Size Sliding Window

### Algorithm

1. Compute `window_size = n - k`.
    
2. Compute the total array sum.
    
3. Find the minimum window sum of size `window_size`.
    
4. Return `total - min_window`.
    

### Python Solution

```python
def maxScore(cardPoints, k):
    n = len(cardPoints)

    if k == n:
        return sum(cardPoints)

    window = n - k
    total = sum(cardPoints)

    curr = sum(cardPoints[:window])
    min_sum = curr

    for i in range(window, n):
        curr += cardPoints[i]
        curr -= cardPoints[i - window]
        min_sum = min(min_sum, curr)

    return total - min_sum
```

---

## Dry Run

**cardPoints = [1,2,3,4,5,6,1]**

**k = 3**

Total:

Window size:

Find the minimum window of length `4`.

|Window|Sum|
|---|--:|
|`[1,2,3,4]`|10|
|`[2,3,4,5]`|14|
|`[3,4,5,6]`|18|
|`[4,5,6,1]`|16|

Minimum = **10**

Answer:

---

## Alternative Sliding Window (Left ↔ Right Exchange)

Another interview-friendly approach starts with taking all `k` cards from the left, then gradually replaces one left card with one right card.

```python
def maxScore(cardPoints, k):
    n = len(cardPoints)

    curr = sum(cardPoints[:k])
    ans = curr

    for i in range(1, k + 1):
        curr -= cardPoints[k - i]
        curr += cardPoints[n - i]
        ans = max(ans, curr)

    return ans
```

### Why It Works

Initially:

```text
Take: [1,2,3]
```

Then exchange cards:

|Left Taken|Right Taken|Score|
|---|---|--:|
|3|0|6|
|2|1|4|
|1|2|8|
|0|3|12|

It explores all `k+1` possible left/right splits.

---

## Which Approach Is Better?

|Approach|Idea|Time|Space|
|---|---|--:|--:|
|Min Window|Keep smallest middle|O(n)|O(1)|
|Left-Right Exchange|Enumerate all splits|O(k)|O(1)|

- **Min Window** is more reusable and connects to many optimization problems.
    
- **Exchange** is elegant when the interviewer emphasizes end-picking.
    

---

## Complexity

### Minimum Window Approach

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(1)**|

### Left-Right Exchange

|Metric|Value|
|---|--:|
|Time|**O(k)**|
|Auxiliary Space|**O(1)**|

---

## Relationship to Previous Problems

|Problem|Transformation|
|---|---|
|Minimum Operations to Reduce X|Keep longest middle subarray|
|Max Points from Cards|Keep minimum middle window|
|Sliding Window Maximum|Fixed-size window optimization|

Both LC **1658** and LC **1423** use the same interview trick:

> **When operations happen only at the ends, think about the contiguous middle that remains.**

The only difference is what you optimize:

- **1658:** Maximize kept length
    
- **1423:** Minimize kept sum
    

---

## Common Mistakes

### 1. Brute Forcing Left/Right Choices

There are `2^k` possible pick sequences.

The insight is that only **`k+1` unique left/right splits** exist.

### 2. Forgetting `k == n`

If every card must be picked:

```python
return sum(cardPoints)
```

Otherwise the window size becomes zero.

### 3. Maximizing the Window Instead of Minimizing It

We are maximizing the **picked** score, so the remaining window must have the **minimum** possible sum.

---

## Key Takeaways / Pattern Recognition

- **Pick from ends** ⇒ The remaining elements are one contiguous subarray.
    
- Exactly `k` picks ⇒ Remaining window size is `n-k`.
    
- Convert:
    
    - **Max picked** → **Total − Min remaining**
        
- This is a classic optimization-by-complement pattern that pairs naturally with **Minimum Operations to Reduce X to Zero (LC 1658)**.