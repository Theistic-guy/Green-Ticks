---
Title: Stack using Queue (LeetCode 225)
Companies:
  - Nagarro
  - Qualcomm
  - Bloomberg
  - Google
  - Microsoft
  - Amazon
  - Meta
  - Goldman Sachs
  - Apple
Topics:
  - Stack
  - Queue
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
Rating:
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Stack using Queue (LeetCode 225)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

It has two main variations. See below

---


# Stack using Queue (LeetCode 225)

**Tags:** #dsa #stack #queue #fifo #lifo #design #leetcode

## Core Idea

A **Stack** follows **LIFO**, whereas a **Queue** follows **FIFO**.

The trick is to rearrange queue elements so that queue operations emulate stack behavior.

---

# Variation 1: Single Queue (Expensive Push)

> **Best / Most Expected Interview Solution**

### Idea

After inserting the new element, **rotate** the previous elements behind it so the newest element always stays at the front.

### Algorithm

1. Enqueue `x`
    
2. Rotate `size − 1` elements
    

### Dry Run

```text
push(1)

Queue: [1]


push(2)

Append → [1,2]
Rotate → [2,1]


push(3)

Append → [2,1,3]
Rotate → [3,2,1]
```

The **front of the queue becomes the top of the stack**.

### Python

```python
from collections import deque

class MyStack:

    def __init__(self):
        self.q = deque()

    def push(self, x):
        self.q.append(x)

        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self):
        return self.q.popleft()

    def top(self):
        return self.q[0]

    def empty(self):
        return len(self.q) == 0
```

### Complexity

|Operation|Time|
|---|--:|
|Push|**O(n)**|
|Pop|**O(1)**|
|Top|**O(1)**|
|Empty|**O(1)**|

### Why Rotation Works?

```text
Before push : [2,1]

Append 3    : [2,1,3]

Rotate      : [1,3,2]
Rotate      : [3,2,1]
```

Newest element reaches the **front**, making `popleft()` behave like stack pop.

---

# Variation 2: Two Queues (Expensive Pop)

> Cheap insertion, expensive removal

### Idea

Push directly into the main queue. During pop, move the first `n−1` elements into a temporary queue, leaving only the stack top.

### Algorithm

**Push**

- Enqueue into `q1`
    

**Pop**

1. Move `n−1` elements from `q1` → `q2`
    
2. Remove the last remaining element
    
3. Swap `q1` and `q2`
    

### Dry Run

```text
push(1)
push(2)
push(3)

q1 = [1,2,3]


Pop

Move → q2 = [1,2]
q1 = [3]

Remove 3

Swap

q1 = [1,2]
```

### Python

```python
from collections import deque

class MyStack:

    def __init__(self):
        self.q1 = deque()
        self.q2 = deque()

    def push(self, x):
        self.q1.append(x)

    def pop(self):
        while len(self.q1) > 1:
            self.q2.append(self.q1.popleft())

        ans = self.q1.popleft()
        self.q1, self.q2 = self.q2, self.q1
        return ans

    def top(self):
        while len(self.q1) > 1:
            self.q2.append(self.q1.popleft())

        ans = self.q1[0]
        self.q2.append(self.q1.popleft())
        self.q1, self.q2 = self.q2, self.q1
        return ans

    def empty(self):
        return len(self.q1) == 0
```

### Complexity

|Operation|Time|
|---|--:|
|Push|**O(1)**|
|Pop|**O(n)**|
|Top|**O(n)**|
|Empty|**O(1)**|

---

# Comparison

|Feature|Single Queue|Two Queues|
|---|--:|--:|
|Queues Used|1|2|
|Push|**O(n)**|**O(1)**|
|Pop|**O(1)**|**O(n)**|
|Top|O(1)|O(n)|
|Preferred in Interviews|✅ Yes|Follow-up|

---

## Interview Takeaways

- **Single Queue + Rotation** is the canonical LeetCode 225 solution.
    
- **Two Queues** demonstrates the opposite trade-off: fast push, slow pop.
    
- It is **impossible** to achieve both `push()` and `pop()` in **O(1)** using only FIFO queue operations; one operation must pay the rearrangement cost.