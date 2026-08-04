# Python Memory Model for DSA & Interviews

## Process Memory, Stack, Heap, Function Frames, Variable Scope & Object References

> **Goal:** Understand how memory works from the Operating System's perspective **and** how Python uses that memory internally. This knowledge explains recursion, backtracking, mutability, copying, garbage collection, and many common interview questions.

---

# 1. Two Different Levels of Memory

When discussing memory, interviewers may refer to **two different models**:

### Level 1 — Operating System (Process Memory Layout)

Describes how an OS organizes the memory of a running process.

### Level 2 — Python Runtime

Describes how Python stores variables, objects, references, and executes functions **inside that process**.

Think of it as:

```text
Operating System
        │
        ▼
Creates a Python Process
        │
        ▼
Python Runtime manages objects inside that process
```

Both models are important, but they answer different questions.

---

# 2. OS Process Memory Layout

Whenever you run

```bash
python program.py
```

the operating system starts a new process (`python.exe` on Windows, `python` on Linux/macOS).

Every process has a virtual memory layout similar to:

```text
High Memory
+-------------------------+
| Command Line / Env Vars |
+-------------------------+
|         Stack           | ← Function call frames
|           ↓             |
|                         |
|                         |
|           ↑             |
|          Heap           | ← Dynamic memory allocation
+-------------------------+
| BSS Segment             | ← Uninitialized globals/statics
+-------------------------+
| Data Segment            | ← Initialized globals/statics
+-------------------------+
| Text / Code Segment     | ← Machine instructions
+-------------------------+
Low Memory
```

---

## Text (Code) Segment

Contains compiled machine instructions.

For C/C++:

```cpp
int add(int a, int b)
{
    return a + b;
}
```

The machine code for `add()` resides here.

Characteristics:

* Read-only
* Shared when possible
* Does not change while the program runs

For Python:

The **Python interpreter itself** (`python.exe`) lives here.

Your Python source code is **not** stored here directly.

---

## Data Segment

Stores initialized global and static variables.

Example (C++):

```cpp
int x = 10;
```

---

## BSS Segment

Stores uninitialized global/static variables.

Example:

```cpp
int x;
```

The OS initializes these to zero before execution.

---

## Heap

Stores dynamically allocated memory.

C++ example:

```cpp
Node* root = new Node();
```

Python example:

```python
lst = [1, 2, 3]
```

The list object is allocated on the heap.

---

## Stack

Stores function call frames.

Each function call pushes a new frame.

When the function returns, the frame is popped.

---

# 3. How Python Uses This Process

Python **does not replace** this process layout.

Instead, it runs **inside** it.

For example,

```python
x = [1,2,3]
```

looks like

```text
OS Process

STACK
------------------
Frame

x ------------+

HEAP
------------------
Python List Object
```

The stack stores the **reference**.

The heap stores the **actual object**.

---

# 4. Python Variables Store References

Unlike C/C++,

Python variables **do not store objects**.

They store references.

Example:

```python
a = 10
b = a
```

Memory:

```text
a --------\
           \
            ▼
          +----+
          | 10 |
          +----+
           ▲
          /
b --------/
```

Both names refer to the same object.

This single idea explains much of Python's behavior.

---

# 5. Everything is an Object

Almost everything in Python is an object:

* int
* float
* bool
* str
* list
* tuple
* dict
* set
* function
* class
* user-defined objects

Even

```python
x = 5
```

creates an integer object on the heap.

This is one reason Python is slower than C++.

---

# 6. Stack Frames (Function Frames)

Every function call creates a new stack frame.

Example:

```python
def square(x):
    y = x * x
    return y
```

Frame:

```text
STACK

square()

x --------> 5
y --------> 25
```

When the function returns,

the frame disappears.

---

# 7. Recursion

Every recursive call gets its own frame.

Example:

```python
def fact(n):

    if n == 1:
        return 1

    return n * fact(n-1)
```

Calling

```python
fact(4)
```

creates

```text
fact(4)
fact(3)
fact(2)
fact(1)
```

Each frame has its own local variables.

Therefore

* Time depends on the algorithm.
* Auxiliary space is **O(recursion depth)**.

---

# 8. LEGB Variable Scope

Python searches variables in this order:

```text
Local
↓

Enclosing
↓

Global
↓

Built-in
```

Example:

```python
x = 100

def outer():

    x = 20

    def inner():
        x = 5
        print(x)

    inner()

outer()
```

Output:

```text
5
```

Python stops at the first match.

---

# 9. Local vs Global

```python
x = 10

def f():
    x = 20

f()

print(x)
```

Output:

```text
10
```

The local variable shadows the global one.

To modify a global:

```python
count = 0

def inc():
    global count
    count += 1
```

---

# 10. Mutable vs Immutable Objects

## Immutable

Cannot be modified in-place.

Examples:

* int
* float
* bool
* str
* tuple

Example:

```python
x = 5
x += 1
```

Python creates a new object.

The old integer remains unchanged.

---

## Mutable

Can be modified in-place.

Examples:

* list
* dict
* set
* user-defined objects

Example:

```python
a = [1,2]
a.append(3)
```

The same list object is modified.

---

# 11. Assignment Does NOT Copy Objects

```python
a = [1,2]
b = a
```

Memory:

```text
a -------\
          \
           ▼
        [1,2]
           ▲
          /
b -------/
```

Only one list exists.

Changing one changes the other.

---

# 12. Shallow vs Deep Copy

## Shallow Copy

```python
b = a.copy()
```

or

```python
b = a[:]
```

Copies only the outer container.

Nested objects remain shared.

---

## Deep Copy

```python
import copy

b = copy.deepcopy(a)
```

Recursively copies every object.

---

# 13. Function Arguments

Python uses

> **Call by Object Sharing** (Call by Assignment)

Example:

```python
def add(lst):
    lst.append(10)

a = [1,2]
add(a)
```

Result:

```python
[1,2,10]
```

Both names reference the same list.

Now compare:

```python
def inc(x):
    x += 1

a = 5
inc(a)
```

Output:

```python
5
```

Integers are immutable.

A new object was created.

---

# 14. Why Backtracking Works

Example:

```python
subset = []

subset.append(5)
subset.pop()
```

The same list is reused.

We mutate it,

save a copy,

undo the mutation.

Correct:

```python
ans.append(subset[:])
```

Wrong:

```python
ans.append(subset)
```

Without copying, every answer refers to the same list.

---

# 15. Equality vs Identity

```python
a = [1,2]
b = [1,2]
```

```python
a == b
```

Checks values.

Returns

```text
True
```

```python
a is b
```

Checks object identity.

Returns

```text
False
```

Use `is` primarily for singleton objects such as:

```python
if x is None:
```

---

# 16. Garbage Collection

Python automatically manages memory.

Main mechanism:

* Reference Counting

Secondary mechanism:

* Cyclic Garbage Collector

Unlike C/C++,

there is no

```cpp
delete
```

or

```c
free()
```

for normal Python code.

---

# 17. Closures

Example:

```python
def outer():

    x = 10

    def inner():
        return x

    return inner
```

Even after `outer()` returns,

`x` stays alive because `inner` still references it.

This is called a **closure**.

---

# 18. Recursion Limit

Python limits recursion depth (approximately **1000** by default).

Deep recursion raises

```python
RecursionError
```

Python does **not** perform tail recursion optimization.

---

# 19. Common Interview Pitfalls

### Mutable Default Arguments ❌

Wrong:

```python
def f(arr=[]):
    arr.append(1)
    return arr
```

Correct:

```python
def f(arr=None):

    if arr is None:
        arr = []

    arr.append(1)
```

---

### Aliasing

```python
a = []
b = a
```

Not a copy.

Both variables refer to the same object.

---

### Forgetting to Copy in Backtracking

Wrong:

```python
ans.append(path)
```

Correct:

```python
ans.append(path[:])
```

---

### Using `is` Instead of `==`

Wrong:

```python
if a is 5:
```

Correct:

```python
if a == 5:
```

---

# 20. DSA Connections

Understanding Python's memory model explains:

* Why recursion uses **O(depth)** stack space.
* Why DFS and backtracking mutate and restore the same list.
* Why copying large lists affects time complexity.
* Why linked lists, trees, and graphs naturally store references to nodes.
* Why aliasing bugs occur with mutable objects.
* Why `path[:]` is necessary in almost every backtracking problem.

---

# Interview Cheat Sheet

| Concept                 | Key Takeaway                                   |
| ----------------------- | ---------------------------------------------- |
| Process Memory          | Text → Data → BSS → Heap → Stack               |
| Text Segment            | Machine code of the Python interpreter         |
| Heap                    | Stores Python objects                          |
| Stack                   | Stores function call frames                    |
| Variable                | Stores a reference, not the object             |
| Function Call           | Creates a new stack frame                      |
| Recursion Space         | `O(recursion depth)`                           |
| Mutable Objects         | Modified in-place                              |
| Immutable Objects       | Modification creates a new object              |
| Assignment              | Copies references, not objects                 |
| Shallow Copy            | Copies outer container only                    |
| Deep Copy               | Copies entire object graph                     |
| `==`                    | Value equality                                 |
| `is`                    | Object identity                                |
| Function Arguments      | Call by object sharing                         |
| Scope                   | LEGB (Local → Enclosing → Global → Built-in)   |
| Garbage Collection      | Automatic (Reference Counting + Cyclic GC)     |
| Common Backtracking Bug | Forgetting `path[:]` before storing the answer |
