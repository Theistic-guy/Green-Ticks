---
Title: Next Greater Element (NGE)
Companies:
  - Not Specified
Topics:
  - Stack
  - Arrays
  - Greedy
Platform:
  - GFG
Difficulty: Medium
Other Tags:
  - Monotonic Stack
Link: ""
Rating:
Groups:
  - Stack-Based Nearest Neighbor
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Next Greater Element (NGE)

**Pattern:** 

**Idea:** 

**Variations** : 
+ [previous-greater-element-(pge)](previous-greater-element-(pge).md)
+ [stock-span-problem-(lc-901)](stock-span-problem-(lc-901).md)


---

## 💻 Code

```Python
def nextGreater(arr):
    n = len(arr)
    ans = [-1] * n
    stack = []

    for i in range(n - 1, -1, -1):

        while stack and stack[-1] <= arr[i]:
            stack.pop()

        if stack:
            ans[i] = stack[-1]

        stack.append(arr[i])

    return ans
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---


# Next Greater Element (NGE)

**Tags:** #Stack #MonotonicStack #Arrays #NearestGreater #Greedy #Interview-Pattern #FAANG

## Problem Statement

Given an array `arr`, find the **Next Greater Element (NGE)** for every element.

The **Next Greater Element** of `arr[i]` is the nearest element to its **right** that is **strictly greater** than `arr[i]`. If no such element exists, return `-1`.

**Example**

|Input|Output|
|---|---|
|`[5, 15, 10, 8, 6, 12, 9, 18]`|`[15, 18, 12, 12, 12, 18, 18, -1]`|

---

## Core Insight

This is the mirror image of **Previous Greater Element**.

Instead of searching left, we search **right**, so we traverse the array **from right to left** while maintaining a **monotonic decreasing stack**.

> **Next Greater = Nearest Greater to the Right = Right-to-Left + Monotonic Decreasing Stack**

---

## Intuition (The WHY)

Consider:

```text
5 15 10 8 6 12 9 18
```

For `8`, the next greater element is `12`, not `18`, because we need the **nearest** greater element.

While traversing from the right, the stack contains exactly the useful candidates that lie to the right of the current element.

---

## Why Traverse Right to Left?

When processing index `i`, every element to its right has already been seen.

Example:

```text
Current = 8

Right side:
6 12 9 18
```

The stack stores these candidates in decreasing order.

After removing smaller elements:

```text
18
12
```

The top (`12`) is immediately the nearest greater element.

---

## Optimal Approach — Monotonic Decreasing Stack

### Algorithm

For each element (right → left):

1. Pop all elements ≤ current.
    
2. Stack top (if any) is the next greater element.
    
3. Push the current element.
    

### Python Solution

```python
def nextGreater(arr):
    n = len(arr)
    ans = [-1] * n
    stack = []

    for i in range(n - 1, -1, -1):

        while stack and stack[-1] <= arr[i]:
            stack.pop()

        if stack:
            ans[i] = stack[-1]

        stack.append(arr[i])

    return ans
```

---

## Dry Run

**Input**

```text
5 15 10 8 6 12 9 18
```

Process from **right to left**.

|Current|Stack Before|Answer|Stack After|
|--:|---|--:|---|
|18|—|-1|18|
|9|18|18|18,9|
|12|18,9|18|18,12|
|6|18,12|12|18,12,6|
|8|18,12,6|12|18,12,8|
|10|18,12,8|12|18,12,10|
|15|18,12,10|18|18,15|
|5|18,15|15|18,15,5|

Final answer:

```text
[15,18,12,12,12,18,18,-1]
```

---

## Why Popped Elements Are Useless

Suppose the stack is:

```text
18
12
8
```

Current = `10`

Since `8 ≤ 10`, pop it.

Can `8` ever become the next greater for any element further left?

No.

Any future element is to the **left** of `10`, and `10` is both:

- closer
    
- greater than `8`
    

So `8` is permanently dominated.

This is the greedy justification for popping.

---

## Correctness (Invariant)

**Invariant:** Before processing `arr[i]`, the stack contains elements to the right in **strictly decreasing order**.

Therefore:

- Smaller elements are removed because they're useless.
    
- The remaining top is the nearest greater element.
    
- Pushing the current element preserves the invariant.
    

Hence every answer is correct.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

Each element is pushed and popped at most once (amortized analysis).

---

## Previous Greater vs Next Greater

|Problem|Traverse|Stack Type|
|---|---|---|
|Previous Greater|Left → Right|Decreasing|
|Next Greater|Right → Left|Decreasing|
|Previous Smaller|Left → Right|Increasing|
|Next Smaller|Right → Left|Increasing|

The traversal direction changes because the query changes from **left** to **right**.

---

## Common Mistakes

### 1. Traversing Left to Right

Without additional bookkeeping, left-to-right traversal cannot answer queries about unseen future elements.

Always traverse **right to left**.

### 2. Using `<` Instead of `<=`

We need **strictly greater**.

Correct:

```python
while stack and stack[-1] <= arr[i]:
```

Equal values are not valid answers.

### 3. Pushing Before Computing Answer

The current element must **not** become its own next greater.

Compute the answer first, then push.

---

## Important Variations

### 1. Next Greater Element I (LC 496)

Two arrays are given.

- Compute NGE for `nums2` using a stack.
    
- Store results in a hash map.
    
- Answer queries for `nums1` in O(1).
    

### 2. Next Greater Element II (LC 503)

The array is **circular**.

Traverse **2n** elements from right to left using modulo indexing.

Note that : Next Greater Element 3 is not a monotonic stack pattern but [next-permutation-(leetcode-31)](next-permutation-(leetcode-31).md) variation

---

## Pattern Recognition

Use a **Monotonic Decreasing Stack** whenever the problem asks for:

- Next Greater Element
    
- Previous Greater Element
    
- Nearest Greater to Left/Right
    
- Circular Next Greater (with doubled traversal)
    

### Universal Template

1. Traverse toward the direction of the query.
    
2. Pop invalid candidates.
    
3. Stack top answers the query.
    
4. Push the current element.
    

> **Interview Heuristic:** **Next** queries traverse from the **opposite direction** (right → left), while **Previous** queries traverse naturally (left → right).