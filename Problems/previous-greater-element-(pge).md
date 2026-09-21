---
Title: Previous Greater Element (PGE)
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

# Previous Greater Element (PGE)

**Pattern:** 

**Idea:** 

**Variations** : 
+ [next-greater-element-(nge)](next-greater-element-(nge).md)

---

## 💻 Code

```Python
]def previousGreater(arr):
    stack = []
    ans = []

    for x in arr:

        while stack and stack[-1] <= x:
            stack.pop()

        if not stack:
            ans.append(-1)
        else:
            ans.append(stack[-1])

        stack.append(x)

    return ans

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---

# Previous Greater Element (PGE)

**Tags:** #Stack #MonotonicStack #Arrays #NearestGreater #Greedy #Interview-Pattern #FAANG

## Problem Statement

Given an array `arr`, find the **Previous Greater Element (PGE)** for every element.

The **Previous Greater Element** of `arr[i]` is the nearest element to its left that is **strictly greater** than `arr[i]`. If none exists, return `-1`.

**Example**

|Input|Output|
|---|---|
|`[15,10,18,12,4,6,2,8]`|`[-1,15,-1,18,12,12,6,12]`|

---

## Core Insight

For every element, we need the **nearest greater element on its left**.

A **Monotonic Decreasing Stack** naturally maintains exactly the candidates that can become previous greater elements.

> **Previous Greater = Nearest Greater to the Left = Monotonic Decreasing Stack**

---

## Intuition (The WHY)

Consider:

```text
15 10 18 12 4 6 2 8
```

Process left to right.

When we reach `6`:

```text
15 10 18 12 4 6
             ↑
```

The previous greater is clearly `12`, not `18`, because we want the **nearest** greater element.

The stack automatically removes useless smaller values, leaving the nearest valid candidate on top.

---

## Why a Monotonic Decreasing Stack?

Maintain the stack in **strictly decreasing order**.

Example:

```text
Stack:

18
12
4
```

Current = `6`

`4` is smaller, so it can never serve as the previous greater for `6` or any future larger value.

Pop it.

Remaining:

```text
18
12
```

Top = `12` → Answer.

Push `6`:

```text
18
12
6
```

The decreasing property is preserved.

---

## Optimal Approach

### Algorithm

For each element:

1. Pop all elements ≤ current.
    
2. Stack top (if any) is the previous greater.
    
3. Push the current element.
    

### Python Solution

```python
def previousGreater(arr):
    stack = []
    ans = []

    for x in arr:

        while stack and stack[-1] <= x:
            stack.pop()

        if not stack:
            ans.append(-1)
        else:
            ans.append(stack[-1])

        stack.append(x)

    return ans
```

---

## Dry Run

**Input**

```text
15 10 18 12 4 6 2 8
```

|Current|Stack Before|Answer|Stack After|
|--:|---|--:|---|
|15|—|-1|15|
|10|15|15|15,10|
|18|15,10|-1|18|
|12|18|18|18,12|
|4|18,12|12|18,12,4|
|6|18,12,4|12|18,12,6|
|2|18,12,6|6|18,12,6,2|
|8|18,12,6,2|12|18,12,8|

Final answer:

```text
[-1,15,-1,18,12,12,6,12]
```

---

## Why Popped Elements Are Useless

Suppose:

```text
Stack Top = 4
Current   = 6
```

Can `4` ever become the previous greater of any future element?

No.

Any future element lies to the **right** of `6`, and `6` is both:

- newer
    
- greater than `4`
    

So `4` is permanently dominated.

This is the greedy argument behind the monotonic stack.

---

## Correctness (Invariant)

**Invariant:** The stack contains elements in **strictly decreasing order**.

Therefore:

- Every popped element is permanently useless.
    
- The remaining top is the nearest greater element.
    
- After pushing the current element, the invariant still holds.
    

Hence every answer is correct.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

Each element is pushed and popped at most once (amortized O(n)).

---

## Previous Greater vs Previous Smaller

|Problem|Stack Type|Pop Condition|
|---|---|---|
|Previous Greater|Decreasing|`<= current`|
|Previous Smaller|Increasing|`>= current`|

Only the comparison changes.

---

## Common Mistakes

### 1. Using `<` Instead of `<=`

The problem asks for **strictly greater**.

Correct:

```python
while stack and stack[-1] <= x:
```

Equal elements are **not** greater and must be removed.

### 2. Answer After Push

Wrong order:

```python
stack.append(x)
answer = stack[-1]
```

The current element would become its own previous greater.

Always compute the answer **before** pushing.

### 3. Storing Indices Unnecessarily

For this problem, we only return values.

Store indices only if distances or positions are required.

---

## Relationship to Stock Span

Stock Span is built directly on Previous Greater.

For Stock Span:

- Find the **previous greater index**
    
- Compute:
    

|Problem|Output|
|---|---|
|Previous Greater|Value / Index|
|Stock Span|Distance to Previous Greater|

Thus, Stock Span is simply a derived application of the Previous Greater pattern.

---

## Pattern Recognition

Use a **Monotonic Decreasing Stack** whenever you encounter:

- Previous Greater Element
    
- Next Greater Element
    
- Stock Span
    
- Nearest Greater to Left/Right
    

The reusable template is:

1. Pop invalid candidates.
    
2. Top answers the query.
    
3. Push current element.
    

> **Interview Heuristic:** “Nearest Greater” almost always translates to a **Monotonic Decreasing Stack**; only the traversal direction determines previous vs next.