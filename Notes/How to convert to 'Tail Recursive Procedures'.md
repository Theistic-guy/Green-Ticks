Though **Python does not optimize tail recursion** but knowing this helps if tail recursion (optimized by C/C++ compilers) is brought up in Interviews

---

# Step 1: What's the difference?

### Non-tail recursion

A recursive call is **not the last operation**.

Something still has to happen after the recursive call returns.

Example:

```python
def fact(n):
    if n == 0:
        return 1

    return n * fact(n - 1)
```

The multiplication happens **after** `fact(n-1)` returns.

```text
fact(4)

4 * fact(3)
      |
      returns 6
      |
4 * 6
```

The caller must remain on the stack waiting for the answer.

---

### Tail recursion

The recursive call is the **very last thing**.

Nothing remains to do afterwards.

```python
def fact(n, acc):
    if n == 0:
        return acc

    return fact(n - 1, acc * n)
```

Here,

```text
return fact(...)
```

is literally the final operation.

---

# The general recipe

Whenever you see

```python
return f(recursion_result)
```

or

```python
return recursion(...) + something
```

or

```python
return recursion(...) * something
```

ask yourself:

> **Can I carry this "something" as an extra parameter?**

That extra parameter is usually called an **accumulator**.

---

# Example 1 — Factorial

### Original

```python
def fact(n):
    if n == 0:
        return 1

    return n * fact(n - 1)
```

Notice

```text
recursive call
↓

fact(n-1)

↓

multiply afterwards
```

---

### Convert

Carry the multiplication beforehand.

```python
def fact(n, acc=1):
    if n == 0:
        return acc

    return fact(n - 1, acc * n)
```

Execution

```text
fact(4,1)

↓

fact(3,4)

↓

fact(2,12)

↓

fact(1,24)

↓

fact(0,24)
```

No work remains after the recursive call.

---

# Example 2 — Sum of Array

Original

```python
def total(arr, i):

    if i == len(arr):
        return 0

    return arr[i] + total(arr, i + 1)
```

Addition happens afterwards.

---

Tail recursive

```python
def total(arr, i=0, acc=0):

    if i == len(arr):
        return acc

    return total(arr, i + 1, acc + arr[i])
```

Again,

all work is done before recursion.

---

# Example 3 — String Reverse

Original

```python
def reverse(s):

    if len(s) <= 1:
        return s

    return reverse(s[1:]) + s[0]
```

Concatenation happens afterwards.

---

Tail recursive

```python
def reverse(s, acc=""):

    if not s:
        return acc

    return reverse(s[1:], s[0] + acc)
```

The accumulator gradually builds the answer.

---

# Example 4 — Power

Original

```python
def power(x, n):

    if n == 0:
        return 1

    return x * power(x, n - 1)
```

Tail recursive

```python
def power(x, n, acc=1):

    if n == 0:
        return acc

    return power(x, n - 1, acc * x)
```

---

# Example 5 — Counting Nodes

Original

```python
def count(node):

    if node is None:
        return 0

    return 1 + count(node.next)
```

Tail recursive

```python
def count(node, acc=0):

    if node is None:
        return acc

    return count(node.next, acc + 1)
```

---

# A case that cannot be converted easily

Consider Fibonacci.

```python
def fib(n):

    if n <= 1:
        return n

    return fib(n-1) + fib(n-2)
```

There are **two recursive calls**.

This isn't just "do something after recursion."

It's

```text
fib(n-1)

AND

fib(n-2)

then add them.
```

An accumulator alone cannot fix this.

Instead, change the state.

Tail-recursive version:

```python
def fib(n, a=0, b=1):

    if n == 0:
        return a

    return fib(n - 1, b, a + b)
```

Notice we're no longer computing from returned values—we're carrying forward the information needed for the next step.

---

# When is conversion straightforward?

Usually when there's **one recursive call** and **one pending operation** afterward.

Pattern:

```python
return recursion(...) + x
```

↓

```python
return recursion(..., acc + x)
```

or

```python
return recursion(...) * x
```

↓

```python
return recursion(..., acc * x)
```

---

# When is it difficult or impossible?

These usually don't have a simple tail-recursive transformation:

- Tree traversals
    
- Fibonacci (naive version)
    
- Merge Sort
    
- Quick Sort
    
- DFS on graphs with branching
    
- Any algorithm with **multiple recursive calls whose results must later be combined**
    

---

# Interview Cheat Sheet

|Original Pattern|Tail Recursive Idea|
|---|---|
|`return x + f(...)`|Carry `x` in an accumulator|
|`return x * f(...)`|Carry the product in an accumulator|
|`return f(...) + g(...)`|Usually **not directly convertible**|
|One recursive call|Often convertible|
|Multiple recursive calls|Usually requires redesign, not just an accumulator|

## The mental trick

Whenever you see a recursive function, ask yourself:

> **"What work is waiting after the recursive call returns?"**

- If the answer is **multiply, add, concatenate, count, accumulate**, introduce an accumulator parameter and perform that work **before** the recursive call.
    
- If the answer is **combine results from multiple recursive calls**, a simple tail-recursive conversion is usually not possible.