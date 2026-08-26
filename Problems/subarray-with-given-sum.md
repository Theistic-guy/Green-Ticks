---
Title: Subarray with given sum
Companies:
  - Not Specified
Topics:
  - Arrays
  - Sliding Window
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
  - Subarray
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Subarray with given sum

**Pattern:**  sliding window

**Idea:** 

---

## 💻 Code

```Python
def subarray_sum(arr, target):

    curr = 0

    left = 0

    for right in range(len(arr)):

        curr += arr[right]

        while curr > target:

            curr -= arr[left]

            left += 1

        if curr == target:
            return True

    return False

```
**Time complexity** - O(n) 
**Aux. Space complexity** -  O(1)
Variations -  [Subarray with Given Sum — Important Interview Variations (Solutions)](../Notes/Subarray%20with%20Given%20Sum%20—%20Important%20Interview%20Variations%20(Solutions).md)

---
# Subarray with Given Sum — DSA Interview Notes

The **Subarray with Given Sum** problem is one of the most important array interview questions.

It introduces several key techniques including:

- Sliding Window
    
- Prefix Sum
    
- Hash Map
    
- Prefix Sum + Modulo
    

Which technique to use depends entirely on **whether negative numbers are allowed**.

---

# Problem Statement

Given an array and an integer `target`, determine whether there exists a **contiguous subarray** whose sum equals `target`.

Example

```text
Input

arr = [1, 4, 20, 3, 10, 5]

target = 33
```

Subarray

```text
20 + 3 + 10
```

Answer

```text
True
```

---

# Approach 1: Brute Force

Generate every possible subarray and compute its sum.

---

## Python Code

```python
def subarray_sum(arr, target):

    n = len(arr)

    for i in range(n):

        curr = 0

        for j in range(i, n):

            curr += arr[j]

            if curr == target:
                return True

    return False
```

---

## Complexity

- **Time Complexity:** **$O(n^2)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Approach 2: Sliding Window (Only for Non-Negative Numbers)

## Important Assumption

This approach works **only when every array element is non-negative**.

---

## Why?

Suppose

```text
Current Sum

< Target
```

Adding more positive numbers can only increase the sum.

Suppose

```text
Current Sum

> Target
```

Removing elements from the left can only decrease the sum.

This monotonic behavior makes the sliding window possible.

Negative numbers destroy this property.

---

# Algorithm

Maintain a window.

- Expand the window while the sum is less than the target.
    
- Shrink the window while the sum is greater than the target.
    
- If the sum equals the target, return `True`.
    

---

## Python Code

```python
def subarray_sum(arr, target):

    curr = 0

    left = 0

    for right in range(len(arr)):

        curr += arr[right]

        while curr > target:

            curr -= arr[left]

            left += 1

        if curr == target:
            return True

    return False
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Why Doesn't Sliding Window Work with Negative Numbers?

Example

```text
[5, -4, 2]

Target = 3
```

Suppose

```text
Current Sum = 5
```

Normally,

we would shrink the window because

```text
5 > 3
```

But removing `5` loses the correct answer because

```text
5 + (-4) + 2

=

3
```

Negative numbers can both increase and decrease the future sum,

so the sliding window strategy no longer works.

---

# Approach 3: Prefix Sum + Hash Map (Works with Negative Numbers)

## Key Observation

Suppose

```text
Prefix Sum

=

prefix
```

We need a previous prefix sum such that

$$  
prefix - previous = target  
$$

Rearranging,

$$  
previous = prefix - target  
$$

If we have already seen

```text
prefix-target
```

then a valid subarray exists.

---

## Algorithm

Maintain

- Running Prefix Sum
    
- Hash Set of previously seen prefix sums
    

At every step,

check whether

```python
prefix - target
```

already exists.

---

## Python Code

```python
def subarray_sum(arr, target):

    prefix = 0

    seen = set()

    for num in arr:

        prefix += num

        if prefix == target:
            return True

        if prefix - target in seen:
            return True

        seen.add(prefix)

    return False
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    
💡 The Core Math Secret (The "Why")Imagine you are walking along a path, counting your total steps from the start. This running total is your prefix sum.If you are at a total of 15 steps (prefix), and you know that earlier in your walk you were at a total of 5 steps (seen), what happened in between?You must have taken exactly 10 steps (target) during that middle stretch!Mathematically:

$$\text{Current Prefix} - \text{Previous Prefix} = \text{Subarray Sum}$$

$$\text{Current Prefix} - \text{Target} = \text{Previous Prefix}$$



---

# Which Approach Should I Use?

|Array Type|Best Technique|
|---|---|
|Non-negative numbers only|Sliding Window|
|Negative numbers allowed|Prefix Sum + Hash Map|

This distinction is one of the most common interview questions.

---

# Pythonic Way

There is **no built-in Python function** that solves this optimally.

The interview solutions above are also the preferred production solutions.

---

# Common Interview Mistakes

## Mistake 1

Using Sliding Window when negative numbers exist.

It is **incorrect**.

---

## Mistake 2

Forgetting to check

```python
prefix == target
```

before checking the hash set.

Otherwise,

subarrays starting at index `0` are missed.

---

## Mistake 3

Confusing **Subarray** with **Subset**.

Subarray

- Contiguous
    

Subset

- Not necessarily contiguous
    

---

# Related Interview Variations

These are some of the most common follow-up questions asked in FAANG and other product-based interviews.

### 1. Count Subarrays with Given Sum (LeetCode 560)

Instead of checking whether a subarray exists, count **how many** subarrays have a given sum.

**Technique:** Prefix Sum + Hash Map (store frequencies of prefix sums).

---

### 2. Longest Subarray with Given Sum

Find the **maximum length** of a subarray whose sum equals `k`.

**Technique:** Prefix Sum + Hash Map (store the first occurrence of each prefix sum).

---

### 3. Shortest Subarray with Given Sum

Find the **minimum length** subarray whose sum is at least or exactly a target value.

Often solved using:

- Sliding Window (positive numbers)
    
- Prefix Sum + Monotonic Deque (when negatives are allowed)
    

---

### 4. Binary Subarrays With Sum (LeetCode 930)

The array contains only `0`s and `1`s`.

Count the number of subarrays with a given sum.

---

### 5. Subarray Sum Divisible by K (LeetCode 974)

Instead of an exact sum,

find subarrays whose sum is divisible by `k`.

**Technique:** Prefix Sum + Modulo + Hash Map.

---

### 6. Continuous Subarray Sum (LeetCode 523)

Determine whether a subarray of length at least `2` has a sum divisible by `k`.

Uses the same prefix modulo idea.

---

### 7. Maximum Size Subarray Sum Equals K (LeetCode 325)

Find the **longest** subarray whose sum equals `k`.

Very common Google and Meta interview problem.

---

### 8. Count Nice Subarrays (LeetCode 1248)

Count subarrays containing exactly `k` odd numbers.

Usually solved by converting odd numbers into `1`s and then applying the prefix sum technique.

---

### 9. Minimum Operations to Reduce X to Zero (LeetCode 1658)

Convert the problem into finding the **longest subarray** with a given sum.

A classic interview trick.

---

### 10. Submatrix Sum Equals Target (LeetCode 1074)

The 2D extension of the subarray sum problem.

Uses:

- Prefix Sum
    
- Hash Map
    

---

# Complexity Summary

|Approach|Time|Aux. Space|
|---|---|---|
|Brute Force|**$O(n^2)$**|**$O(1)$**|
|Sliding Window (Positive Only)|**$O(n)$**|**$O(1)$**|
|Prefix Sum + Hash Map|**$O(n)$**|**$O(n)$**|

---

# Key Takeaways

- The first question to ask is:
    

> **"Are negative numbers allowed?"**

- **No negative numbers** → Sliding Window.
    
- **Negative numbers present** → Prefix Sum + Hash Map.
    

Core Sliding Window idea:

```python
Expand

↓

Shrink

↓

Repeat
```

Core Prefix Sum idea:

$$  
\boxed{  
\text{Need } (prefix-target)  
}  
$$

If a previous prefix sum equals `prefix - target`, then the elements between those two prefix sums form the required subarray.

> **Interview Tip:** This is one of the highest-yield interview patterns. The interviewer is often testing whether you recognize the constraint about **negative numbers**. If you immediately say _"Sliding Window works only for non-negative arrays; otherwise I'll use Prefix Sum + Hash Map"_, it demonstrates strong problem recognition skills.
