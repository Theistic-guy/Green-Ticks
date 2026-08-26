---
Title: Maximum Subarray Sum
Companies:
  - Not Specified
Topics:
  - Arrays
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Kadane
  - GFG
  - Subarray
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Maximum Subarray Sum (Kadane's Algorithm) — DSA Interview Notes

**Pattern:**  greedy

**Idea:** Kadane's algorithm

---

## 💻 Code

```Python
def max_subarray(arr):

    curr = ans = arr[0]

    for i in range(1, len(arr)):

        curr = max(arr[i], curr + arr[i])

        ans = max(ans, curr)

    return ans
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

**Variations** - [Maximum Subarray — Important Interview Variations](../Notes/Maximum%20Subarray%20—%20Important%20Interview%20Variations.md)


---

# Problem Statement

Given an integer array, find the **maximum possible sum of a contiguous subarray**.

Example

```text
Input

[-2, 1, -3, 4, -1, 2, 1, -5, 4]

Output

6
```

The maximum subarray is

```text
[4, -1, 2, 1]
```

whose sum is

```text
6
```

---

# Approach 1: Brute Force

Generate every possible subarray and compute its sum.

```python
def max_subarray(arr):

    ans = float("-inf")

    for i in range(len(arr)):

        curr = 0

        for j in range(i, len(arr)):
            curr += arr[j]
            ans = max(ans, curr)

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n^2)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Approach 2: Kadane's Algorithm (Optimal)

## Key Idea

At every index,

we have only **two choices**:

- Extend the previous subarray.
    
- Start a brand new subarray from the current element.
    

So,

the best subarray ending at index `i` is

$$  
\boxed{  
curr=\max(arr[i],;curr+arr[i])  
}  
$$

The global answer is simply

$$  
ans=\max(ans,curr)  
$$

---

# Intuition

Suppose

```text
Current Sum = -10

Current Element = 5
```

Should we continue?

```text
-10 + 5 = -5
```

or start fresh?

```text
5
```

Clearly,

starting fresh is better.

Hence,

```python
curr = max(arr[i], curr + arr[i])
```

---

# Python Code

```python
def max_subarray(arr):

    curr = ans = arr[0]

    for i in range(1, len(arr)):

        curr = max(arr[i], curr + arr[i])

        ans = max(ans, curr)

    return ans
```

---

# Dry Run

```text
arr

[-2,1,-3,4,-1,2,1,-5,4]
```

|Element|Current Sum|Best Sum|
|--:|--:|--:|
|-2|-2|-2|
|1|1|1|
|-3|-2|1|
|4|4|4|
|-1|3|4|
|2|5|5|
|1|6|6|
|-5|1|6|
|4|5|6|

Final Answer

```text
6
```

---

# Why Does Kadane Work?

Notice that if the running sum ever becomes negative,

it can only reduce the sum of any future subarray.

Therefore,

we simply discard it and start from the current element.

This greedy decision is always optimal.

---

# Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Pitfall

Many beginners write

```python
curr = max(0, curr + num)
```

This **fails** for arrays where every element is negative.

Example

```text
[-5,-2,-8]
```

Correct Answer

```text
-2
```

Incorrect implementation returns

```text
0
```

The proper initialization is

```python
curr = ans = arr[0]
```

---

# Variation 1: Print the Maximum Subarray

Instead of only returning the sum,

return the actual subarray.

Maintain

- current start index
    
- best start index
    
- best end index
    

---

## Python Code

```python
def max_subarray(arr):

    curr = ans = arr[0]

    start = end = temp = 0

    for i in range(1, len(arr)):

        if arr[i] > curr + arr[i]:
            curr = arr[i]
            temp = i
        else:
            curr += arr[i]

        if curr > ans:
            ans = curr
            start = temp
            end = i

    return ans, arr[start:end + 1]
```

This is a **very common** interview follow-up.

---

# Variation 2: Maximum Circular Subarray Sum (LeetCode 918)

This is one of the **most frequently asked Kadane follow-ups**.

Example

```text
[5,-3,5]
```

Normal Kadane

```text
7
```

Circular Answer

```text
10
```

because

```text
5 + 5
```

wraps around the array.

---

## Key Idea

Maximum Circular Sum

=

Total Sum

−

Minimum Subarray Sum

The minimum subarray can also be found using Kadane (by reversing the comparison).

Final Answer

```text
max(

Normal Kadane,

Total Sum - Minimum Subarray

)
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Variation 3: Maximum Product Subarray (LeetCode 152)

This is another classic FAANG problem.

Unlike sums,

multiplication changes sign.

Therefore,

we maintain

- Maximum product ending here
    
- Minimum product ending here
    

because

```text
Negative × Negative

=

Positive
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Variation 4: Maximum Sum with One Deletion (LeetCode 1186)

You are allowed to delete **at most one element**.

Example

```text
[1,-2,0,3]
```

Delete

```text
-2
```

Answer

```text
4
```

This problem combines

- Kadane
    
- Dynamic Programming
    

It is a popular Google and Meta interview question.

---

# Variation 5: Maximum Average Subarray

Instead of maximizing the **sum**,

maximize the **average**.

Common approaches:

- Prefix Sum
    
- Sliding Window
    
- Binary Search on Answer (advanced version)
    

---

# Related Interview Problems

Many array problems are slight modifications of Kadane.

|Problem|Main Technique|
|---|---|
|Maximum Subarray Sum|Kadane|
|Maximum Circular Subarray|Kadane + Minimum Subarray|
|Maximum Product Subarray|DP (Max & Min Products)|
|Maximum Sum with One Deletion|DP + Kadane|
|Maximum Average Subarray|Sliding Window / Prefix Sum|
|Maximum Sum Rectangle (2D)|Kadane + Prefix Sum|

---

# Pythonic Solution

Python doesn't have a built-in function equivalent to Kadane's algorithm.

The standard implementation **is already the Pythonic and optimal solution**.

---

# Complexity Summary

|Problem|Time|Aux. Space|
|---|---|---|
|Brute Force|**$O(n^2)$**|**$O(1)$**|
|Kadane|**$O(n)$**|**$O(1)$**|
|Maximum Circular|**$O(n)$**|**$O(1)$**|
|Maximum Product|**$O(n)$**|**$O(1)$**|
|One Deletion|**$O(n)$**|**$O(n)$** (or **$O(1)$** optimized)|

---

# Interview Tips

- Always initialize Kadane with the **first element**, not `0`.
    
- Be prepared for the follow-up: **"Can you also return the subarray?"**
    
- If the interviewer mentions **"circular array"**, immediately think:
    
    - **Kadane**
        
    - **Minimum Subarray**
        
- If the operation changes from **sum** to **product**, Kadane no longer works directly—you need to track both the maximum and minimum products.
    
- If you are allowed to **delete one element**, think of **Dynamic Programming**, not plain Kadane.
    

---

# Key Takeaways

- Kadane's Algorithm computes the maximum subarray sum in linear time.
    

Core transition:

```python
curr = max(arr[i], curr + arr[i])
ans = max(ans, curr)
```

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

### Most Important FAANG Variations

1. ✅ Return the maximum subarray itself.
    
2. ✅ Maximum Circular Subarray Sum (LeetCode 918).
    
3. ✅ Maximum Product Subarray (LeetCode 152).
    
4. ✅ Maximum Sum with One Deletion (LeetCode 1186).
    

> **Interview Tip:** Kadane's algorithm is essentially **Dynamic Programming disguised as a greedy algorithm**. At each index, it answers one question: **"Is it better to extend the previous subarray, or start a new one here?"** Once you recognize this state transition, many array DP problems become much easier to solve.