---
Title: Maximum sum of K consecutive elements
Companies:
  - Not Specified
Topics:
  - Arrays
  - Sliding Window
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
  - Subarray
  - kth
  - Maximum
Link: ""
---

# Maximum Sum of K Consecutive Elements (Sliding Window) — DSA Interview Notes

**Pattern:** sliding window

**Idea:** 

---

## 💻 Code

```Python

def max_sum(arr, k):

    n = len(arr)

    curr = sum(arr[:k])

    ans = curr

    for i in range(k, n):

        curr += arr[i] - arr[i - k]

        ans = max(ans, curr)

    return ans
```
**Time complexity** - O(n) 
**Aux. Space complexity** -  O(1)
**Variations** are briefly mentioned below, with complete solutions find them [Sliding window variations.](../Notes/Sliding%20window%20variations.md)

---


The **Maximum Sum of K Consecutive Elements** is one of the classic applications of the **Sliding Window** technique.

It is a very common interview problem and forms the basis for many advanced sliding window questions.

---

# Problem Statement

Given an array and an integer `k`, find the **maximum sum of any contiguous subarray of size exactly `k`**.

Example

```text
Input

arr = [1, 8, 30, -5, 20, 7]

k = 3
```

Possible windows

```text
1 + 8 + 30 = 39

8 + 30 + (-5) = 33

30 + (-5) + 20 = 45

(-5) + 20 + 7 = 22
```

Answer

```text
45
```

---

# Approach 1: Brute Force

Compute the sum of every window independently.

---

## Python Code

```python
def max_sum(arr, k):

    ans = float("-inf")

    n = len(arr)

    for i in range(n - k + 1):

        curr = 0

        for j in range(k):
            curr += arr[i + j]

        ans = max(ans, curr)

    return ans
```

---

## Complexity

- **Time Complexity:** **$O((n-k+1)\times k)$ ≈ $O(nk)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Approach 2: Sliding Window (Optimal)

## Key Observation

Notice two consecutive windows.

```text
Window 1

1 8 30

↓

Window 2

8 30 -5
```

Most elements are the same.

Instead of computing the second window from scratch,

simply

- remove the outgoing element,
    
- add the incoming element.
    

---

# Sliding Window Formula

If

```text
Current Window Sum

=

curr
```

then the next window sum is

$$  
\boxed{  
curr = curr - arr[i-k] + arr[i]  
}  
$$

This updates the sum in **constant time**.

---

# Intuition

Suppose

```text
Window

8 30 -5

Sum = 33
```

Move the window one step.

Outgoing element

```text
8
```

Incoming element

```text
20
```

New sum

```text
33 - 8 + 20 = 45
```

No need to recompute all three elements.

---

# Algorithm

### Step 1

Compute the sum of the first `k` elements.

### Step 2

Slide the window one element at a time.

For every new position,

```python
curr += arr[i]

curr -= arr[i-k]
```

Update the maximum.

---

# Python Code

```python
def max_sum(arr, k):

    n = len(arr)

    curr = sum(arr[:k])

    ans = curr

    for i in range(k, n):

        curr += arr[i] - arr[i - k]

        ans = max(ans, curr)

    return ans
```

---

# Dry Run

```text
arr

[1,8,30,-5,20,7]

k = 3
```

First window

```text
1+8+30 = 39
```

Slide

```text
39

-

1

+

(-5)

=

33
```

Slide

```text
33

-

8

+

20

=

45
```

Slide

```text
45

-

30

+

7

=

22
```

Maximum

```text
45
```

---

# Complexity

Only one traversal is required.

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Why Is This Called a Sliding Window?

Imagine a window of fixed size moving across the array.

```text
1 8 30 -5 20 7

---------
```

↓

```text
1 8 30 -5 20 7

   ---------
```

↓

```text
1 8 30 -5 20 7

      ---------
```

Instead of rebuilding the window,

we simply update it.

---

# Common Interview Variations

These are genuine interview questions that build directly on this pattern.

---

# Variation 1: First Negative Number in Every Window

Given a window of size `k`,

print the first negative number in every window.

Example

```text
[-8,2,3,-6,10]

k = 2

Output

-8

0

-6

-6
```

### Technique

- Sliding Window
    
- Queue (to track negative numbers)
    

**LeetCode / GFG Classic**

---

# Variation 2: Maximum Average Subarray I (LeetCode 643)

Instead of the maximum sum,

find the maximum **average** of a window of size `k`.

Observation

Maximum Average

=

Maximum Sum

÷

`k`

Same sliding window solution.

---

# Variation 3: Contains Duplicate II (LeetCode 219)

Determine whether duplicate elements occur within a distance of `k`.

Technique

- Sliding Window
    
- Hash Set
    

---

# Variation 4: Maximum Number of Vowels in a Substring (LeetCode 1456)

Given a string,

find the maximum number of vowels in any substring of length `k`.

Technique

- Sliding Window
    
- Character counting
    

---

# Variation 5: Maximum Points You Can Obtain from Cards (LeetCode 1423)

Pick exactly `k` cards from either end.

Key insight

Instead of selecting cards,

find the **minimum sum window** of size

```text
n-k
```

This problem is frequently asked at Meta and Amazon.

---

# Variation 6: Find All Anagrams in a String (LeetCode 438)

Find every starting position of an anagram.

Technique

- Sliding Window
    
- Frequency arrays / hash maps
    

One of the most common sliding window interview questions.

---

# Variation 7: Sliding Window Maximum (LeetCode 239)

Find the maximum element in every window of size `k`.

Naive sliding window is **not enough**.

Technique

- Monotonic Deque
    

Time

$$  
O(n)  
$$

This is considered one of the most important advanced sliding window problems.

---

# Pythonic Ways

## First Window

```python
curr = sum(arr[:k])
```

---

## Iterate Over Windows

There is no built-in Python function better than the standard sliding window.

Avoid writing

```python
max(sum(arr[i:i+k]) for i in range(n-k+1))
```

because slicing creates a new list every time.

Complexity becomes

$$  
O(nk)  
$$

---

# Common Interview Mistakes

## Mistake 1

Recomputing every window independently.

This leads to

$$  
O(nk)  
$$

instead of

$$  
O(n)  
$$

---

## Mistake 2

Forgetting to initialize the first window.

Always compute

```python
curr = sum(arr[:k])
```

before sliding.

---

## Mistake 3

Confusing this with Kadane's Algorithm.

Kadane solves

> Maximum sum of **any size** subarray.

Sliding Window solves

> Maximum sum of a subarray of **exactly size `k`**.

---

# Sliding Window vs Kadane

|Problem|Technique|
|---|---|
|Maximum Subarray Sum|Kadane|
|Maximum Sum of Exactly K Elements|Sliding Window|
|Maximum Average of Size K|Sliding Window|
|Variable Size Subarray|Sliding Window + Two Pointers|

---

# Complexity Summary

|Approach|Time|Aux. Space|
|---|---|---|
|Brute Force|**$O(nk)$**|**$O(1)$**|
|Sliding Window|**$O(n)$**|**$O(1)$**|

---

# Key Takeaways

- Fixed-size window problems almost always suggest the **Sliding Window** technique.
    
- Instead of recomputing every window,
    

update it using

$$  
\boxed{  
curr = curr + arr[i] - arr[i-k]  
}  
$$

- The first window is computed normally,
    

all remaining windows are updated in constant time.

### Core Algorithm

```python
curr = sum(arr[:k])

ans = curr

for i in range(k, len(arr)):

    curr += arr[i] - arr[i-k]

    ans = max(ans, curr)
```

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> **Interview Tip:** The biggest clue is the phrase **"exactly `k` consecutive elements"** or **"window of size `k`"**. Whenever you see a **fixed-size contiguous window**, think **Sliding Window**, not Kadane or Prefix Sum.