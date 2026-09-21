---
Title: Implement Two Stacks in One Array
Companies:
  - Not Specified
Topics:
  - Stack
  - Arrays
Platform:
  - GFG
Difficulty: Easy
Other Tags:
  - In-place
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Implement Two Stacks in One Array


**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
class TwoStacks:

    def __init__(self, n):
        self.arr = [0] * n
        self.size = n
        self.top1 = -1
        self.top2 = n

    def push1(self, x):
        if self.top1 + 1 == self.top2:
            raise OverflowError("Stack Overflow")

        self.top1 += 1
        self.arr[self.top1] = x

    def push2(self, x):
        if self.top1 + 1 == self.top2:
            raise OverflowError("Stack Overflow")

        self.top2 -= 1
        self.arr[self.top2] = x

    def pop1(self):
        if self.top1 == -1:
            return -1

        x = self.arr[self.top1]
        self.top1 -= 1
        return x

    def pop2(self):
        if self.top2 == self.size:
            return -1

        x = self.arr[self.top2]
        self.top2 += 1
        return x
```
**Time complexity** - O(1)

**Aux. Space complexity** -  O(1)

---

# Implement Two Stacks in One Array

**Tags:** #Stack #Arrays #InPlace #DataStructures #SpaceOptimization #Interview-Pattern #FAANG

## Problem Statement

Design a data structure that implements **two independent stacks** using a **single array** of size `n`.

Operations should support:

* `push1(x)`
* `push2(x)`
* `pop1()`
* `pop2()`

All operations must run in **O(1)** time.

---

## Core Insight

Instead of splitting the array into two fixed halves, let the two stacks **grow towards each other**.

<svg viewBox="0 0 320 120" width="100%" xmlns="http://www.w3.org/2000/svg">
  <rect x=10 y=40 width=300 height=40 rx=6 fill="#F8FAFC" stroke="#CBD5E1"/>
  {#each Array.from({length:10}) as _, i}
    <line x1={40+i*30} y1=40 x2={40+i*30} y2=80 stroke="#CBD5E1"/>
    <text x={25+i*30} y=92 fontSize=8 textAnchor="middle" fontFamily="Arial" fill="#64748B">{i}</text>
  {/each}
  <rect x=12 y=42 width=88 height=36 rx=4 fill="#BFDBFE"/>
  <rect x=220 y=42 width=88 height=36 rx=4 fill="#FBCFE8"/>
  <text x=56 y=62 fontSize=10 textAnchor="middle" fontFamily="Arial" fill="#1D4ED8">Stack 1</text>
  <text x=264 y=62 fontSize=10 textAnchor="middle" fontFamily="Arial" fill="#9D174D">Stack 2</text>
  <text x=105 y=18 fontSize=9 fontFamily="Arial" fill="#1D4ED8">top1 →</text>
  <text x=205 y=18 fontSize=9 fontFamily="Arial" fill="#9D174D">← top2</text>
</svg>

* **Stack 1** starts from index `0` and grows **right**.
* **Stack 2** starts from index `n−1` and grows **left**.

This dynamically shares unused space between both stacks.

> This is the optimal space-efficient implementation.

---

## Why Not Divide the Array into Two Halves?

Suppose `n = 10`.

### Fixed Partition

<svg viewBox="0 0 320 70" width="100%" xmlns="http://www.w3.org/2000/svg">
  <rect x=10 y=20 width=300 height=28 rx=4 fill="#F8FAFC" stroke="#CBD5E1"/>
  <rect x=10 y=20 width=150 height=28 rx=4 fill="#BFDBFE"/>
  <rect x=160 y=20 width=150 height=28 rx=4 fill="#FBCFE8"/>
  <line x1=160 y1=20 x2=160 y2=48 stroke="#64748B" strokeDasharray="3 3"/>
  <text x=85 y=38 fontSize=9 textAnchor="middle" fontFamily="Arial" fill="#1D4ED8">Stack 1</text>
  <text x=235 y=38 fontSize=9 textAnchor="middle" fontFamily="Arial" fill="#9D174D">Stack 2</text>
</svg>

If Stack 1 grows to 6 elements while Stack 2 has only 1, Stack 1 overflows despite free space existing.

### Dynamic Growth

<svg viewBox="0 0 320 70" width="100%" xmlns="http://www.w3.org/2000/svg">
  <rect x=10 y=20 width=300 height=28 rx=4 fill="#F8FAFC" stroke="#CBD5E1"/>
  <rect x=10 y=20 width=180 height=28 rx=4 fill="#BFDBFE"/>
  <rect x=250 y=20 width=60 height=28 rx=4 fill="#FBCFE8"/>
  <text x=100 y=38 fontSize=9 textAnchor="middle" fontFamily="Arial" fill="#1D4ED8">Stack 1</text>
  <text x=280 y=38 fontSize=9 textAnchor="middle" fontFamily="Arial" fill="#9D174D">Stack 2</text>
  <text x=220 y=16 fontSize=8 textAnchor="middle" fontFamily="Arial" fill="#64748B">Shared free space</text>
</svg>

Both stacks use the entire array efficiently.

---

## Data Structure

Maintain:

* `arr` → shared array
* `top1` → top of Stack 1
* `top2` → top of Stack 2

Initial state:

| Variable | Value |
| -------- | ----: |
| `top1`   |  `-1` |
| `top2`   |   `n` |

```text id="tlm4mv"
Index:

0 1 2 3 4 5 6 7 8 9
                  ↑
top2 = 10

top1 = -1
```

---

## Push Operations

### Push into Stack 1

Before inserting, ensure one free cell exists.

Condition:

<math block value="top1+1<top2"/>

```python id="n2s6eo"
def push1(self, x):
    if self.top1 + 1 == self.top2:
        raise OverflowError

    self.top1 += 1
    self.arr[self.top1] = x
```

### Push into Stack 2

```python id="5xzz8m"
def push2(self, x):
    if self.top1 + 1 == self.top2:
        raise OverflowError

    self.top2 -= 1
    self.arr[self.top2] = x
```

---

## Pop Operations

### Pop Stack 1

```python id="rrlyim"
def pop1(self):
    if self.top1 == -1:
        return -1

    x = self.arr[self.top1]
    self.top1 -= 1
    return x
```

### Pop Stack 2

```python id="wpynv7"
def pop2(self):
    if self.top2 == self.size:
        return -1

    x = self.arr[self.top2]
    self.top2 += 1
    return x
```

---

## Complete Python Implementation

```python id="lvs8fy"
class TwoStacks:

    def __init__(self, n):
        self.arr = [0] * n
        self.size = n
        self.top1 = -1
        self.top2 = n

    def push1(self, x):
        if self.top1 + 1 == self.top2:
            raise OverflowError("Stack Overflow")

        self.top1 += 1
        self.arr[self.top1] = x

    def push2(self, x):
        if self.top1 + 1 == self.top2:
            raise OverflowError("Stack Overflow")

        self.top2 -= 1
        self.arr[self.top2] = x

    def pop1(self):
        if self.top1 == -1:
            return -1

        x = self.arr[self.top1]
        self.top1 -= 1
        return x

    def pop2(self):
        if self.top2 == self.size:
            return -1

        x = self.arr[self.top2]
        self.top2 += 1
        return x
```

---

## Dry Run

### Initial

```text id="mrt9qd"
_ _ _ _ _ _ _ _

top1 = -1
top2 = 8
```

### `push1(10)`

```text id="zysja3"
10 _ _ _ _ _ _ _

top1 = 0
```

### `push1(20)`

```text id="pk2k1e"
10 20 _ _ _ _ _ _
```

### `push2(90)`

```text id="cvdwtn"
10 20 _ _ _ _ _ 90
```

### `push2(80)`

```text id="mn7kcg"
10 20 _ _ _ _ 80 90
```

The stacks grow toward each other.

---

## Overflow Condition

Overflow occurs **only when both tops meet**.

```text id="ylf9ud"
10 20 30 40 50 60
         ↑↑
```

Condition:

```python id="gxjr4t"
if top1 + 1 == top2:
```

There is no free space remaining.

This is superior to checking individual stack sizes.

---

## Correctness

### Invariant

At every moment:

<math block value="-1\\le top1<top2\\le n"/>

Therefore:

* Stack 1 occupies `[0 ... top1]`
* Stack 2 occupies `[top2 ... n−1]`
* Free space is exactly between them.

All push/pop operations preserve this invariant.

---

## Complexity

| Operation | Time | Auxiliary Space |
| --------- | ---: | --------------: |
| `push1`   | O(1) |            O(1) |
| `push2`   | O(1) |            O(1) |
| `pop1`    | O(1) |            O(1) |
| `pop2`    | O(1) |            O(1) |

---

## Common Mistakes

### 1. Splitting the Array into Two Halves

This wastes memory and causes premature overflow.

### 2. Incorrect Overflow Check

Wrong:

```python id="kto8qv"
if top1 == top2:
```

Correct:

```python id="tksysc"
if top1 + 1 == top2:
```

The two tops should never occupy the same cell.

### 3. Wrong Initial Value of `top2`

Correct initialization:

```python id="rseivd"
top1 = -1
top2 = n
```

Not `n−1`, because Stack 2 is initially empty.

---

## Pattern Recognition

This is a classic **space optimization** interview problem.

General principle:

* Two independent structures
* Shared contiguous storage
* Grow from opposite directions
* Detect collision as overflow

The reusable invariant is:

<math block value="top1<top2"/>

Maintaining this single condition guarantees both stacks operate correctly in constant time while utilizing the entire array.
