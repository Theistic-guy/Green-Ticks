---
Title: Min Stack (Leetcode 155)
Companies:
  - Odoo
  - Paytm
  - UiPath
  - Zenefits
  - Tinkoff
  - Informatica
  - Sigmoid
  - Snap
  - Nike
  - IMC
  - Ozon
  - Vimeo
  - Bloomberg
  - Lucid
  - Infosys
  - Intel
  - Lyft
  - Tripadvisor
  - Oracle
  - Apple
  - Palo Alto Networks
  - Amazon
  - Yandex
  - Microsoft
  - Snowflake
  - Walmart Labs
  - Google
  - Salesforce
  - Uber
  - Citadel
  - Nvidia
  - Flipkart
  - Meta
  - Adobe
  - tcs
  - LinkedIn
  - IBM
Topics:
  - Stack
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - GFG
Link: https://leetcode.com/problems/min-stack/description/
Rating:
  - ⭐⭐⭐⭐
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Min Stack (Leetcode 155)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
class MinStack:

    def __init__(self):
        self.stack = []
        self.minVal = None

    def push(self, x):

        if not self.stack:
            self.stack.append(x)
            self.minVal = x

        elif x >= self.minVal:
            self.stack.append(x)

        else:
            encoded = 2 * x - self.minVal
            self.stack.append(encoded)
            self.minVal = x

    def pop(self):

        top = self.stack.pop()

        if top < self.minVal:
            self.minVal = 2 * self.minVal - top

    def top(self):

        if self.stack[-1] < self.minVal:
            return self.minVal

        return self.stack[-1]

    def getMin(self):
        return self.minVal

```
**Time complexity** - O(1)

**Aux. Space complexity** -  O(1)

📝NOTE
+ x - current_min works only if all positive values are there to be pushed see below.
+ to handle negative values as well use `2*x - current_min`


## PKM Note: Min Stack O(1) Space Encoding

A Min Stack can be implemented in O(1) auxiliary space by storing an encoded "flag" value directly in a single stack instead of using a secondary tracking structure. The system identifies a flag whenever the value at the top of the stack is strictly less than the global `current_min`.

---

## Method 1: The Standard Formula ($2x - \text{min}$)

This is the standard, production-ready solution that works across the entire number line (both positive and negative values).

- Encode (Push): `Flag = 2 * x - current_min`
- Decode (Pop): `previous_min = 2 * current_min - Flag`
- Flag Trigger: `Top < current_min`

## 🏃‍♂️ Numeric Example (Negative Values)

1. Initial State: `current_min = -5`, Stack = `[-5]`
2. Push New Minimum ($x = -10$):
    
    - $\text{Flag} = 2(-10) - (-5) = -15$
    - Stack becomes `[-5, -15]`, `current_min` updates to `-10`
    
3. Verification: Is $\text{Top} < \text{current\_min}$? Yes ($-15 < -10$). The flag is successfully recognized.
4. Decode on Pop: $\text{previous\_min} = 2(-10) - (-15) = -5$ (Restored perfectly).

## ⚠️ Limitation

- Integer Overflow: Because the formula doubles the value ($2x$), it can easily overflow fixed 32-bit integer limits (`INT_MAX` / `INT_MIN`) in languages like C++ or Java.
- Fix: Must cast stack elements and math operations to 64-bit data types (`long` or `long long`).

---

## Method 2: The Difference Formula ($x - \text{min}$)

An alternative approach that uses the raw difference between the values to trigger the flag state.

- Encode (Push): `Flag = x - current_min`
- Decode (Pop): `previous_min = current_min - Flag`
- Flag Trigger: `Top < 0` (or `Top < current_min` if restricted to positive spaces)

## 🏃‍♂️ Numeric Example (Strictly Positive Values)

1. Initial State: `current_min = 10`, Stack = `[10]`
2. Push New Minimum ($x = 4$):
    
    - $\text{Flag} = 4 - 10 = -6$
    - Stack becomes `[10, -6]`, `current_min` updates to `4`
    
3. Verification: Is $\text{Top} < \text{current\_min}$? Yes ($-6 < 4$). The flag is recognized because it dropped into negative territory.

## ⚠️ Limitation

- Breaks on Negative Inputs: If the stack permits negative numbers, subtracting a negative number mathematically adds value, pulling the flag _above_ the minimum instead of below it.
- Failure Example: If `current_min = -5` and new minimum $x = -10$:
    
    - $\text{Flag} = -10 - (-5) = -5$
    - Is $\text{Top} < \text{current\_min}$? Is $-5 < -10$? No. The flag is completely hidden, crashing the stack logic.
    

---

## Summary Cheat Sheet

|Metric|$2x - \text{min}$ Formula|$x - \text{min}$ Formula|
|---|---|---|
|Input Support|All real numbers (positive, negative, zero)|Strictly positive numbers only|
|Primary Risk|Fixed-width Integer Overflow|Structural Logic Failure with negative numbers|
|FAANG Verdict|Highly Recommended (Expect follow-up questions on casting)|Not Recommended unless input constraints are explicitly guaranteed|

---
---

# Min Stack (Leetcode 155)

**Tags:** #Stack #Design #DataStructures #SpaceOptimization #Encoding #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Design a stack that supports all operations in **O(1)** time:

- `push(x)`
    
- `pop()`
    
- `top()`
    
- `getMin()` → returns the minimum element currently in the stack
    

### Example

|Operation|Stack|Min|
|---|---|---|
|Push 5|`[5]`|5|
|Push 2|`[5,2]`|2|
|Push 8|`[5,2,8]`|2|
|Pop|`[5,2]`|2|
|getMin|—|**2**|

---

## Core Insight

The challenge is maintaining the minimum **without scanning the stack**.

There are three important approaches:

1. **Brute Force** — Scan every time _(O(n))_
    
2. **Two Stacks** — Store minimums separately _(standard interview solution)_
    
3. **Single Stack Encoding** — O(1) extra space using mathematical encoding _(advanced follow-up)_
    

---

# Approach 1 — Brute Force

## Idea

Store a normal stack.

Whenever `getMin()` is called, scan all elements.

### Python

```python
class MinStack:

    def __init__(self):
        self.stack = []

    def push(self, x):
        self.stack.append(x)

    def pop(self):
        return self.stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return min(self.stack)
```

### Complexity

|Operation|Time|
|---|--:|
|Push|O(1)|
|Pop|O(1)|
|Top|O(1)|
|getMin|O(n)|

Not acceptable for the interview.

---

# Approach 2 — Two Stack Method (Optimal)

## Key Idea

Maintain another stack storing the **minimum at every depth**.

### Structure

```text
Main Stack : 5 2 8 1
Min Stack  : 5 2 2 1
```

Each position in `minStack` stores the minimum of the main stack up to that depth.

### Push

If the new value is smaller, store it.

Otherwise, duplicate the previous minimum.

Example:

```text
Push 5

Main : 5
Min  : 5
```

```text
Push 2

Main : 5 2
Min  : 5 2
```

```text
Push 8

Main : 5 2 8
Min  : 5 2 2
```

Notice both stacks always have the same size.

### Pop

Pop from both stacks.

```text
Before

Main : 5 2 8
Min  : 5 2 2

After

Main : 5 2
Min  : 5 2
```

The minimum is restored automatically.

### Python

```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.minStack = []

    def push(self, val):
        self.stack.append(val)

        if not self.minStack:
            self.minStack.append(val)
        else:
            self.minStack.append(min(val, self.minStack[-1]))

    def pop(self):
        self.stack.pop()
        self.minStack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.minStack[-1]
```

### Dry Run

|Operation|Main Stack|Min Stack|
|---|---|---|
|Push 5|5|5|
|Push 2|5 2|5 2|
|Push 8|5 2 8|5 2 2|
|Push 1|5 2 8 1|5 2 2 1|
|Pop|5 2 8|5 2 2|

Current minimum = **2**

### Complexity

|Operation|Time|Space|
|---|--:|--:|
|Push|O(1)|O(1)|
|Pop|O(1)|O(1)|
|Top|O(1)|O(1)|
|getMin|O(1)|O(1)|

Overall auxiliary storage is **O(n)** because of the second stack.

---

# Approach 3 — Single Stack Encoding (Advanced)

## Motivation

Can we eliminate the second stack?

Yes. Maintain:

- One stack
    
- One variable: `minVal`
    

Whenever a **new minimum** arrives, store an **encoded value** instead of the real value.

---

## Encoding Formula

When:

```text
x < minVal
```

Store:

```text
encoded = 2*x - minVal
```

Then update:

```text
minVal = x
```

The encoded value is always **smaller than the new minimum**, making it recognizable later.

### Why is it Smaller?

If `x < minVal`, then:

```text
2*x - minVal < x
```

So every encoded value is guaranteed to be less than the current minimum.

---

## Push Example

### Push 5

```text
Stack : [5]
Min   : 5
```

### Push 2

Encode:

```text
2*2 - 5 = -1
```

Store:

```text
Stack : [5, -1]
Min   : 2
```

`-1` is **not** an actual stack value—it represents the previous minimum.

### Push 8

```text
Stack : [5, -1, 8]
Min   : 2
```

### Push 1

Encode:

```text
2*1 - 2 = 0
```

```text
Stack : [5, -1, 8, 0]
Min   : 1
```

---

## Pop Decoding

Current state:

```text
Stack : [5, -1]
Min   : 2
```

Pop `-1`.

Since:

```text
-1 < Min
```

it's an encoded value.

Recover the previous minimum:

```text
oldMin = 2*minVal - encoded
       = 2*2 - (-1)
       = 5
```

New state:

```text
Stack : [5]
Min   : 5
```

---

## Top Operation

If the stack top is encoded:

```text
top < minVal
```

then the **actual top value** is the current minimum.

```python
def top(self):
    if self.stack[-1] < self.minVal:
        return self.minVal
    return self.stack[-1]
```

---

## Python Implementation

```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.minVal = None

    def push(self, x):

        if not self.stack:
            self.stack.append(x)
            self.minVal = x

        elif x >= self.minVal:
            self.stack.append(x)

        else:
            encoded = 2 * x - self.minVal
            self.stack.append(encoded)
            self.minVal = x

    def pop(self):

        top = self.stack.pop()

        if top < self.minVal:
            self.minVal = 2 * self.minVal - top

    def top(self):

        if self.stack[-1] < self.minVal:
            return self.minVal

        return self.stack[-1]

    def getMin(self):
        return self.minVal
```

---

## Correctness of Encoding

Whenever a new minimum `x` is inserted:

- The stack stores `2*x - oldMin`
    
- `minVal` becomes `x`
    

Later, when this encoded value is popped:

```text
oldMin = 2*currentMin - encoded
```

This exactly reconstructs the previous minimum, making the encoding fully reversible.

---

# Comparison of All Approaches

|Approach|Push|Pop|getMin|Extra Space|
|---|--:|--:|--:|--:|
|Brute Force|O(1)|O(1)|O(n)|O(n)|
|Two Stacks|O(1)|O(1)|O(1)|O(n)|
|Encoding|O(1)|O(1)|O(1)|O(1)|

---

## Common Mistakes

### 1. Not Duplicating Equal Minimums

For input:

```text
2 2 2
```

`minStack` must be:

```text
2 2 2
```

Otherwise popping one `2` incorrectly changes the minimum.

### 2. Wrong Encoding Formula

Correct:

```text
encoded = 2*x - minVal
```

Not:

```text
x - minVal
```

The factor of **2** is essential for reversible decoding.

### 3. Returning the Encoded Value

If:

```text
stackTop < minVal
```

return `minVal`, **not** the encoded number.

---

## Interview Strategy

|Situation|Best Answer|
|---|---|
|Standard interview|Two Stack approach|
|Space optimization follow-up|Single Stack Encoding|
|Explain intuition|Brute → Two Stack → Encoding|

Always present the **Two Stack** solution first—it is the cleanest and most widely accepted. Mention the encoding method as an optimization only if asked.

---

## Key Takeaways

- The minimum must be updated **incrementally**, not recomputed.
    
- The **Two Stack** approach is the canonical solution: each depth stores its running minimum.
    
- The **Encoding** approach achieves O(1) extra space by storing transformed values and recovering previous minimums during `pop()`.
    
- Both optimal approaches provide **O(1)** time for all four operations.