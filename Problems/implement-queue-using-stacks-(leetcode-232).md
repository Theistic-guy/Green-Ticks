---
Title: Implement Queue using Stacks (LeetCode 232)
Companies: [Qualcomm, Arista Networks, SAP, Apple, Infosys, Microsoft, Bloomberg, Amazon, Google, Yandex, TikTok, Meta]
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

# Implement Queue using Stacks (LeetCode 232)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
class MyQueue:

    def __init__(self):
        self.inStack = []
        self.outStack = []

    def push(self, x):
        self.inStack.append(x)

    def _transfer(self):
        while self.inStack:
            self.outStack.append(self.inStack.pop())

    def pop(self):
        if not self.outStack:
            self._transfer()
        return self.outStack.pop()

    def peek(self):
        if not self.outStack:
            self._transfer()
        return self.outStack[-1]

    def empty(self):
        return not self.inStack and not self.outStack
```
O(1) amortized in all four operations. See more below.

---

# Implement Queue using Stacks (LeetCode 232)

**Tags:** #dsa #queue #stack #fifo #lifo #design #leetcode232 #amortized-analysis

## Core Idea

A **Queue** follows **FIFO**, while a **Stack** follows **LIFO**.

Using **two stacks**, we can reverse the order twice to simulate queue behavior.

- `inStack` → receives all new elements
    
- `outStack` → serves dequeue operations
    

---

# Variation 1: Two Stacks (Amortized O(1)) ⭐ Optimal

> **Most expected interview solution**

## Intuition

- **Enqueue:** Push into `inStack`
    
- **Dequeue:** If `outStack` is empty, transfer everything from `inStack` to `outStack`
    
- The transfer reverses the order, exposing the oldest element on top.
    

### Visualization

```text
Enqueue 1,2,3

inStack  : [1,2,3]
outStack : []

Transfer

Pop 3 → out
Pop 2 → out
Pop 1 → out

inStack  : []
outStack : [3,2,1]

Top of outStack = 1 (Queue Front)
```

### Python

```python
class MyQueue:

    def __init__(self):
        self.inStack = []
        self.outStack = []

    def push(self, x):
        self.inStack.append(x)

    def _transfer(self):
        while self.inStack:
            self.outStack.append(self.inStack.pop())

    def pop(self):
        if not self.outStack:
            self._transfer()
        return self.outStack.pop()

    def peek(self):
        if not self.outStack:
            self._transfer()
        return self.outStack[-1]

    def empty(self):
        return not self.inStack and not self.outStack
```

### Complexity

|Operation|Time|
|---|--:|
|Push|**O(1)**|
|Pop|**O(1)** amortized|
|Peek|**O(1)** amortized|
|Empty|**O(1)**|

### Why is Pop Amortized O(1)?

Each element is moved **at most once** from `inStack` to `outStack`.

For one element:

```text
Push → inStack
Transfer → outStack
Pop
```

Total work = **3 operations per element**, so over **n** operations the total is **O(n)**.

> **Amortized Cost = O(1)**

---

# Variation 2: Single Stack as Main + Temporary Stack (Expensive Push)

> Simpler concept, but inefficient

## Idea

To maintain queue order inside one stack:

1. Move all elements to a temporary stack.
    
2. Push the new element.
    
3. Move everything back.
    

### Dry Run

```text
Main Stack : [3,2,1]
             ↑ top

push(4)

Temp : [1,2,3]

Main : [4]

Move back

Main : [3,2,1,4]
```

Now the **top contains the oldest element**, so `pop()` behaves like dequeue.

### Python

```python
class MyQueue:

    def __init__(self):
        self.st = []

    def push(self, x):
        temp = []

        while self.st:
            temp.append(self.st.pop())

        self.st.append(x)

        while temp:
            self.st.append(temp.pop())

    def pop(self):
        return self.st.pop()

    def peek(self):
        return self.st[-1]

    def empty(self):
        return len(self.st) == 0
```

### Complexity

|Operation|Time|
|---|--:|
|Push|**O(n)**|
|Pop|**O(1)**|
|Peek|**O(1)**|
|Empty|**O(1)**|

---

# Comparison

|Feature|Optimal Two Stacks|Expensive Push|
|---|--:|--:|
|Stacks Used|2|2 (1 temporary)|
|Push|**O(1)**|**O(n)**|
|Pop|**O(1)** amortized|**O(1)**|
|Interview Preference|✅ Yes|Rare|

---

## Interview Takeaways

- Maintain **two stacks**: `inStack` for insertion and `outStack` for removal.
    
- **Transfer only when `outStack` is empty**—this is the key optimization.
    
- The phrase **"amortized O(1)"** is essential: although one pop may cost O(n), each element is transferred only once, making the average cost constant over a sequence of operations.