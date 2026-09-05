---
Title: Majority Element
Companies:
  - Not Specified
Topics:
  - Arrays
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - Boyer-Moore Voting
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Majority Element (Moore's Voting Algorithm) — DSA Interview Notes

**Pattern:** 

**Idea:** 

**Variations**:
+ generalized Boyer-Moore  - [elements-occurring-more-than-(n÷k)-times](elements-occurring-more-than-(n÷k)-times.md)


---

## 💻 Code

```Python
candidate = None
count = 0

for num in arr:

    if count == 0:
        candidate = num
        count = 1

    elif num == candidate:
        count += 1

    else:
        count -= 1
```

Verification
```Python
if arr.count(candidate) > len(arr) // 2:
    return candidate
return -1
```

**Time complexity** - O(n)
**Aux. Space complexity** -  O(1)

---

## Problem Statement

Given an array of size `n`, find the **majority element**, i.e., the element that appears **more than**

$$  
\left\lfloor \frac{n}{2} \right\rfloor  
$$

times.

If no such element exists, return `-1` (or `None`, depending on the language/problem).

---

# Examples

```text
Input

[8, 8, 6, 6, 6, 4, 6]

Output

6
```

---

```text
Input

[3, 3, 4, 2, 4, 4, 2, 4, 4]

Output

4
```

---

```text
Input

[1, 2, 3, 4]

Output

No Majority Element
```

---

# Approach 1: Brute Force

For every element,

count its frequency.

If any frequency exceeds

$$  
\frac{n}{2}  
$$

return it.

---

## Python Code

```python
def majority_element(arr):

    n = len(arr)

    for i in range(n):

        count = 0

        for j in range(n):

            if arr[i] == arr[j]:
                count += 1

        if count > n // 2:
            return arr[i]

    return -1
```

---

## Complexity

- **Time Complexity:** **$O(n^2)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Approach 2: Hash Map

Count the frequency of every element.

Return the one whose frequency exceeds

$$  
\frac{n}{2}  
$$

---

## Python Code

```python
from collections import Counter

def majority_element(arr):

    freq = Counter(arr)

    n = len(arr)

    for num, count in freq.items():

        if count > n // 2:
            return num

    return -1
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# Approach 3: Moore's Voting Algorithm (Optimal)

This is one of the most famous greedy algorithms in DSA.

It finds a **candidate** for the majority element in one traversal using constant space.

---

# The Main Intuition

Imagine every occurrence of the majority element **cancels** one occurrence of a different element.

Since the majority element appears **more than half** the time,

it can never be completely canceled.

Eventually,

it is the **only possible survivor**.

This idea is called **pairwise cancellation**.

---

## Example

```text
Array

[A, B, A, C, A, D, A]
```

Cancel different pairs.

```text
A B

↓

Cancel
```

Remaining

```text
A C A D A
```

Again,

```text
A C

↓

Cancel
```

Remaining

```text
A D A
```

Again,

```text
A D

↓

Cancel
```

Remaining

```text
A
```

Only the majority element survives.

---

# Why Does This Work?

Suppose

```text
Majority

=

M
```

Let

```text
Frequency(M)

=

8
```

All other elements together appear

```text
5
```

times.

Even if every one of those five elements cancels one occurrence of `M`,

we still have

```text
8 - 5 = 3
```

occurrences of `M` remaining.

Therefore,

the majority element **must survive all cancellations**.

---

# The Voting Process

Maintain two variables:

- Candidate
    
- Count
    

Rules

### Case 1

If

```text
count == 0
```

Choose the current element as the new candidate.

---

### Case 2

If the current element equals the candidate,

increase the count.

---

### Case 3

Otherwise,

decrease the count.

The different element "votes against" the current candidate.

---

# Dry Run

```text
Array

[2,2,1,1,1,2,2]
```

|Element|Candidate|Count|
|--:|--:|--:|
|2|2|1|
|2|2|2|
|1|2|1|
|1|2|0|
|1|1|1|
|2|1|0|
|2|2|1|

Final Candidate

```text
2
```

Notice that the candidate changes whenever the count becomes zero.

---

# Phase 1: Find the Candidate

## Python Code

```python
def find_candidate(arr):

    candidate = None
    count = 0

    for num in arr:

        if count == 0:
            candidate = num
            count = 1

        elif num == candidate:
            count += 1

        else:
            count -= 1

    return candidate
```

---

# Important Observation

The first phase **does not guarantee** that the candidate is actually the majority element.

It only guarantees that

> **If a majority element exists, this candidate must be it.**

Therefore,

a second pass is required.

---

# Phase 2: Verify the Candidate

```python
def majority_element(arr):

    candidate = find_candidate(arr)

    count = 0

    for num in arr:

        if num == candidate:
            count += 1

    if count > len(arr) // 2:
        return candidate

    return -1
```

---

# Why Is Verification Necessary?

Example

```text
[1,2,3,4]
```

The algorithm ends with

```text
Candidate = 4
```

But

is **not** the majority.

Hence,

verification is mandatory unless the problem explicitly states

> **"A majority element always exists."**

---

# Complexity

The algorithm performs two traversals.

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Questions

## Q1. Why is it called "Voting"?

Every different element casts one vote **against** the current candidate.

If enough votes accumulate,

the candidate loses,

and a new candidate is elected.

---

## Q2. Why do we reset the candidate when the count becomes zero?

Because the previous candidate has been completely canceled.

It has no advantage over any future element.

Therefore,

we can safely choose the next element as the new candidate.

---

## Q3. Why are two passes required?

The first pass only finds the surviving candidate.

The second pass confirms whether it truly appears more than

$$  
\frac{n}{2}  
$$

times.

---

## Q4. When can we skip the second pass?

If the problem explicitly states

> **"A majority element is guaranteed to exist."**

For example,

LeetCode **169. Majority Element**

Then,

the first pass alone is sufficient.

---

# Comparison

|Method|Time|Aux. Space|
|---|---|---|
|Brute Force|**$O(n^2)$**|**$O(1)$**|
|Hash Map|**$O(n)$**|**$O(n)$**|
|Moore's Voting|**$O(n)$**|**$O(1)$**|

---

# Related Interview Problems

The Moore Voting idea appears in several interview questions:

- Majority Element (LeetCode 169)
    
- Majority Element II (LeetCode 229)
    
- Find all elements occurring more than **$n/3$** times
    
- Generalized Majority Voting (**$n/k$** frequency)
    

The **Majority Element II** problem is a common follow-up in Google and Meta interviews.

---

# Key Takeaways

- Majority Element means frequency
    

$$

\frac{n}{2}  
$$

- Moore's Voting uses **pairwise cancellation**.
    
- Every different element cancels one occurrence of the candidate.
    
- A true majority element can never be completely canceled.
    
- The first pass finds a **candidate**.
    
- The second pass verifies whether it is actually the majority.
    

### Moore's Voting Algorithm

```python
candidate = None
count = 0

for num in arr:

    if count == 0:
        candidate = num
        count = 1

    elif num == candidate:
        count += 1

    else:
        count -= 1
```

Verification

```python
if arr.count(candidate) > len(arr) // 2:
    return candidate
return -1
```

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> **Interview Tip:** Don't memorize Moore's Voting as a trick. Remember its intuition: **every occurrence of a non-majority element can cancel at most one occurrence of the majority element. Since the majority element appears more than all the others combined, it is guaranteed to survive the cancellation process.** This reasoning is exactly what interviewers often ask after you write the algorithm.