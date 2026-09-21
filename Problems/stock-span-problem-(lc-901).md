---
Title: Stock Span Problem (Leetcode 901)
Companies:
  - Bloomberg
  - Microsoft
  - Amazon
  - IBM
  - Adobe
  - Google
  - Meta
  - tcs
Topics:
  - Stack
  - Arrays
  - Greedy
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - GFG
  - Monotonic Stack
Link: ""
Rating:
  - ⭐⭐⭐⭐
Groups:
  - Stack-Based Nearest Neighbor
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Stock Span Problem (very close to LC 901)

**Pattern:** 

**Idea:** 

**Variations** : 
+ Stack based nearest neighbor

---

## 💻 Code

```Python
def calculateSpan(price):
    n = len(price)
    span = [0] * n
    stack = []

    for i in range(n):

        while stack and price[stack[-1]] <= price[i]:
            stack.pop()

        if not stack:
            span[i] = i + 1
        else:
            span[i] = i - stack[-1]

        stack.append(i)

    return span
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---

# Stock Span Problem

**Tags:** #Stack #MonotonicStack #Arrays #Greedy #SpanProblems #NearestGreater #Interview-Pattern #FAANG #LeetCode 

## Problem Statement

Given an array `price[]` where `price[i]` is the stock price on day `i`, find the **stock span** for every day.

The **span** of a stock's price today is the maximum number of consecutive days (including today) immediately before it for which the price was **less than or equal to** today's price.

**Example**

|Price|Span|
|--:|--:|
|100|1|
|80|1|
|60|1|
|70|2|
|60|1|
|75|4|
|85|6|

Output:

```text
[1,1,1,2,1,4,6]
```

---

## Core Insight

For each day, we need the **Nearest Previous Greater Element (NPGE)**.

If the nearest previous greater price is at index `j`, then:

If no greater element exists:

Thus, the Stock Span Problem is fundamentally a **Nearest Previous Greater** problem solved using a **monotonic decreasing stack**.

---

## Intuition (The WHY)

Consider:

```text
Prices:

100 80 60 70 60 75 85
```

For **75**:

The nearest previous greater price is **80**.

Span:

The consecutive valid days are:

```text
60 70 60 75
```

Exactly **4** days.

---

## Why a Monotonic Stack?

Maintain a stack of **indices** whose prices are in **strictly decreasing order**.

Example while processing:

```text
100 80 60
```

Stack:

```text
[100,80,60]
```

When **70** arrives:

- 60 is useless (≤ 70)
    
- Remove it
    
- 80 becomes the nearest previous greater
    

New stack:

```text
[100,80,70]
```

Every popped element can never be the nearest greater for future larger values.

---

## Optimal Approach — Monotonic Decreasing Stack

### Algorithm

For each index `i`:

1. Pop while stack price ≤ current price.
    
2. If stack is empty → span = `i + 1`
    
3. Otherwise → span = `i - stack.top`
    
4. Push current index.
    

### Python Solution

```python
def calculateSpan(price):
    n = len(price)
    span = [0] * n
    stack = []

    for i in range(n):

        while stack and price[stack[-1]] <= price[i]:
            stack.pop()

        if not stack:
            span[i] = i + 1
        else:
            span[i] = i - stack[-1]

        stack.append(i)

    return span
```

---

## Dry Run

**Prices**

```text
100 80 60 70 60 75 85
```

|Day|Price|Stack (Prices)|Span|
|--:|--:|---|--:|
|0|100|100|1|
|1|80|100,80|1|
|2|60|100,80,60|1|
|3|70|100,80,70|2|
|4|60|100,80,70,60|1|
|5|75|100,80,75|4|
|6|85|100,85|6|

Final answer:

```text
[1,1,1,2,1,4,6]
```

---

## Why the Span Formula Works

Suppose current index is `i`.

Nearest previous greater index:

```text
j
```

```text
... Greater ... Current
      j          i
```

Everything between `(j+1 ... i)` is **≤ current price**.

Therefore:

If no greater element exists:

```text
Current is the largest so far
```

Span includes every previous day:

---

## Correctness (Greedy Invariant)

**Invariant:** The stack always stores indices of prices in **strictly decreasing order**.

Why pop?

If:

```text
Top = 60
Current = 70
```

Then `60` can never become the nearest greater for any future day because:

- 70 is newer
    
- 70 is larger
    

So removing 60 never hurts the optimal answer.

Each index is pushed and popped at most once.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

Although there is a nested `while`, each element is removed only once (amortized analysis).

---

## Online Variant (Leetcode 901)

Instead of receiving the whole array, prices arrive one by one.

Store `(price, span)` pairs.

```python
class StockSpanner:

    def __init__(self):
        self.stack = []

    def next(self, price):
        span = 1

        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]

        self.stack.append((price, span))
        return span
```

This avoids storing all previous prices explicitly.

---

## Relationship to Previous Problems

|Problem|Monotonic Structure|
|---|---|
|Sliding Window Maximum|Monotonic Deque|
|Largest Rectangle Histogram|Increasing Stack|
|Stock Span|Decreasing Stack|
|Next Greater Element|Decreasing Stack|

The difference is **what the stack stores**:

- Histogram → indices for width
    
- Stock Span → indices for nearest previous greater
    
- LC 901 → `(price, accumulated span)` pairs
    

---

## Common Mistakes

### 1. Using `<` Instead of `<=`

The definition includes **less than or equal**.

Correct:

```python
while stack and price[stack[-1]] <= price[i]:
```

Otherwise equal prices incorrectly break the span.

### 2. Storing Prices Instead of Indices

Wrong:

```python
stack.append(price[i])
```

We need indices to compute:

### 3. Computing Span Before Popping

Always remove smaller elements **first**, then the top becomes the nearest previous greater.

---

## Pattern Recognition

Whenever the problem asks for:

- Consecutive previous elements satisfying a condition
    
- Nearest previous greater/smaller
    
- Span until obstruction
    

Think **Monotonic Stack**.

The reusable template is:

1. Pop invalid candidates.
    
2. Remaining top answers the query.
    
3. Push current element.
    

> **Interview Heuristic:** Stock Span = **Nearest Previous Greater Index**, and the span is simply the distance to it.