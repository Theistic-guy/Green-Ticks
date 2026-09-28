---
Title: Implementation of Deque using Circular Array (Leetcode 641)
Companies:
  - Snowflake
  - Goldman Sachs
  - Google
  - Amazon
  - Meta
Topics:
  - Queue
  - Arrays
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - Deque
Link: https://leetcode.com/problems/design-circular-deque/description/
Rating:
Groups:
  - Implementation
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Implementation of Deque using Circular Array (Leetcode 641)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
class MyCircularDeque:

    def __init__(self, k):
        self.arr = [0] * k
        self.capacity = k
        self.front = 0
        self.rear = k - 1
        self.size = 0

    def isEmpty(self):
        return self.size == 0

    def isFull(self):
        return self.size == self.capacity

    def insertFront(self, value):
        if self.isFull():
            return False

        self.front = (self.front - 1 + self.capacity) % self.capacity
        self.arr[self.front] = value
        self.size += 1
        return True

    def insertLast(self, value):
        if self.isFull():
            return False

        self.rear = (self.rear + 1) % self.capacity
        self.arr[self.rear] = value
        self.size += 1
        return True

    def deleteFront(self):
        if self.isEmpty():
            return False

        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return True

    def deleteLast(self):
        if self.isEmpty():
            return False

        self.rear = (self.rear - 1 + self.capacity) % self.capacity
        self.size -= 1
        return True

    def getFront(self):
        if self.isEmpty():
            return -1
        return self.arr[self.front]

    def getRear(self):
        if self.isEmpty():
            return -1
        return self.arr[self.rear]
```

O(1) for all operations.


My Code :

```Python
size = 0

front = 0

capacity = 10

arr = [None] * capacity

  

def insert_front(item):

    global front, size

    if size == capacity:

        raise Exception("Size full")

    front = (front -1 + capacity) % capacity

    arr[front] = item

    size += 1

  
  

def insert_back(item):

    global size

    if size == capacity:

        raise Exception("Size full")

  

    rear = (front + size) % capacity

    arr[rear] = item

    size += 1

  
  

def delete_front():

    global front, size

    if size == 0:

        raise Exception("No elements")

    popped = arr[front]

    front = (front + 1)%capacity

    size -= 1

    return popped

  
  

def delete_back():

    global size

    if size == 0:

        raise Exception("No elements")

  

    popped = arr[(front+size-1)%capacity]

    size -= 1

    return popped

  
  

while True:

    try:

        action = input("operation ")

        opcode, *no = action.split()

  

        if opcode == "push_front":

            insert_front(no[0])

        if opcode == "pop_front":

            delete_front()

        if opcode == "pop_back":

            delete_back()

        if opcode == "push_back":

            insert_back(no[0])

        if opcode =="print":

            print("[ ",end=" ")

            for i in range(size):

                print(arr[(front+i)%capacity],end=" ")

            print(" ]")

    except Exception as e:

        print(e)
```

---
# Implementation of Deque using Circular Array (Leetcode 641)

**Tags:** #Deque #Queue #CircularArray #Arrays #Design #DataStructures #RingBuffer #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Design a **Deque (Double Ended Queue)** that supports insertion and deletion from **both the front and rear** in **O(1)** time.

Implement the following operations:

- `insertFront(x)`
    
- `insertLast(x)`
    
- `deleteFront()`
    
- `deleteLast()`
    
- `getFront()`
    
- `getRear()`
    
- `isEmpty()`
    
- `isFull()`
    

> **Leetcode 641** requires a fixed-capacity deque implemented using a circular array.

---

## What is a Deque?

A deque combines the capabilities of both a **stack** and a **queue**.

|Front|Rear|
|---|---|
|Insert|Insert|
|Delete|Delete|

Unlike a queue, both ends are fully accessible.

---

## Why a Circular Array?

Using a normal array causes shifting.

Example:

```text
Delete Front

Before:
10 20 30 40

After:
20 30 40 _
```

Every deletion requires **O(n)** shifting.

A circular array avoids this by wrapping indices.

---

## Data Structure

Maintain:

- `arr` → fixed-size array
    
- `front` → index of first element
    
- `rear` → index of last element
    
- `size` → current number of elements
    
- `capacity`
    

Initial state:

```text
arr = [_,_,_,_,_]

front = 0
rear  = 4
size  = 0
```

Why `rear = capacity - 1`?

So that the first rear insertion naturally lands at index `0`.

---

## Circular Index Formula

### Move Forward

```text
(i + 1) % capacity
```

Example:

```text
4 → 0
```

### Move Backward

```text
(i - 1 + capacity) % capacity
```

Example:

```text
0 → 4
```

Adding `capacity` prevents negative indices.

---

## Insertion at Rear

Advance `rear` first.

```python
rear = (rear + 1) % capacity
arr[rear] = x
size += 1
```

### Example

Capacity = 5

```text
rear = 4

Insert 10

rear = 0

10 _ _ _ _
```

---

## Insertion at Front

Move `front` backward.

```python
front = (front - 1 + capacity) % capacity
arr[front] = x
size += 1
```

Example:

```text
10 20 _ _ _

front = 0

Insert 5

5 10 20 _ _
```

If already at index `0`, it wraps to the last position.

---

## Deletion at Front

Simply advance `front`.

```python
front = (front + 1) % capacity
size -= 1
```

No shifting occurs.

---

## Deletion at Rear

Move `rear` backward.

```python
rear = (rear - 1 + capacity) % capacity
size -= 1
```

Again, constant time.

---

## Complete Python Implementation

```python
class MyCircularDeque:

    def __init__(self, k):
        self.arr = [0] * k
        self.capacity = k
        self.front = 0
        self.rear = k - 1
        self.size = 0

    def isEmpty(self):
        return self.size == 0

    def isFull(self):
        return self.size == self.capacity

    def insertFront(self, value):
        if self.isFull():
            return False

        self.front = (self.front - 1 + self.capacity) % self.capacity
        self.arr[self.front] = value
        self.size += 1
        return True

    def insertLast(self, value):
        if self.isFull():
            return False

        self.rear = (self.rear + 1) % self.capacity
        self.arr[self.rear] = value
        self.size += 1
        return True

    def deleteFront(self):
        if self.isEmpty():
            return False

        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return True

    def deleteLast(self):
        if self.isEmpty():
            return False

        self.rear = (self.rear - 1 + self.capacity) % self.capacity
        self.size -= 1
        return True

    def getFront(self):
        if self.isEmpty():
            return -1
        return self.arr[self.front]

    def getRear(self):
        if self.isEmpty():
            return -1
        return self.arr[self.rear]
```

---

## Dry Run

### Capacity = 5

Initial:

```text
_ _ _ _ _

F=0
R=4
```

### `insertLast(10)`

```text
10 _ _ _ _

F=0
R=0
```

### `insertLast(20)`

```text
10 20 _ _ _

F=0
R=1
```

### `insertFront(5)`

```text
10 20 _ _ 5

F=4
R=1
```

Logical deque:

```text
5 10 20
```

Even though elements wrap physically.

### `deleteRear()`

```text
10 _ _ _ 5

F=4
R=0
```

Logical deque:

```text
5 10
```

---

## Why Maintain `size`?

Without `size`, these states become identical.

### Empty

```text
front = 2
rear = 1
```

### Full

```text
front = 2
rear = 1
```

Both satisfy the same pointer relationship.

Maintaining `size` removes this ambiguity.

### Conditions

```python
isEmpty : size == 0
isFull  : size == capacity
```

This is cleaner than sacrificing one array slot.

---

## Correctness

### Invariant

At all times:

- `front` points to the first element.
    
- `rear` points to the last element.
    
- `size` equals the number of stored elements.
    

Every insertion/deletion updates exactly one pointer and preserves the circular ordering.

Thus all operations remain O(1).

---

## Complexity

|Operation|Time|Auxiliary Space|
|---|--:|--:|
|Insert Front|O(1)|O(1)|
|Insert Rear|O(1)|O(1)|
|Delete Front|O(1)|O(1)|
|Delete Rear|O(1)|O(1)|
|Get Front/Rear|O(1)|O(1)|

Overall storage = **O(k)**.

---

## Common Mistakes

### 1. Forgetting Modular Arithmetic

Wrong:

```python
rear += 1
```

Correct:

```python
rear = (rear + 1) % capacity
```

Otherwise indices exceed array bounds.

### 2. Negative Front Index

Wrong:

```python
front = front - 1
```

Correct:

```python
front = (front - 1 + capacity) % capacity
```

### 3. Detecting Full with Pointer Equality

Using only pointers makes **empty** and **full** indistinguishable.

Always maintain `size` (or intentionally waste one slot).

---

## Relationship to Other Queue Structures

|Structure|Insert|Delete|Notes|
|---|---|---|---|
|Queue|Rear|Front|FIFO|
|Circular Queue|Rear|Front|No shifting|
|Deque|Both Ends|Both Ends|Double-ended|
|Monotonic Deque|Both Ends|Both Ends|Maintains order|

Leetcode 641 implements the **general-purpose deque**, while Sliding Window Maximum uses a **monotonic deque** built on the same underlying structure.

---

## Key Takeaways

- A deque is a **double-ended queue** supporting O(1) operations at both ends.
    
- The circular array eliminates expensive shifting by wrapping indices.
    
- The two essential formulas are:
    

```text
Next Index : (i + 1) % capacity
Prev Index : (i - 1 + capacity) % capacity
```

- Maintaining an explicit `size` cleanly distinguishes **empty** from **full** and is the preferred interview implementation.