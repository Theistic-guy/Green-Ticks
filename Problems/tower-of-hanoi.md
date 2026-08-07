---
Title: Tower Of Hanoi
Companies:
  - Not Specified
Topics:
  - Recursion
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
Link: ""
---
# Tower Of Hanoi

**Pattern:** Recursion till the base solves for the trivial case then as functions return it gives the complete picture.
**Idea:** for n disks, move n-1 to auxiliary, move nth disk to the target and move the n-1 from aux. to target.

---

## 💻 Code

```Python
def tower_of_hanoi(n, source, auxiliary, destination):

    if n == 1:
        print(f"Move Disk 1 from {source} to {destination}")
        return

    tower_of_hanoi(
        n - 1,
        source,
        destination,
        auxiliary
    )

    print(f"Move Disk {n} from {source} to {destination}")

    tower_of_hanoi(
        n - 1,
        auxiliary,
        source,
        destination
    )
```
**Time complexity** - O($2^n$) , see below.
**Aux. Space complexity** -  O(n)

---

## Problem Statement

The Tower of Hanoi consists of **three rods**:

- Source (A)
    
- Auxiliary (B)
    
- Destination (C)
    

and `n` disks of different sizes stacked on the source rod in decreasing order of size.

The objective is to move all the disks from the **Source** to the **Destination** while following these rules:

1. Only **one disk** can be moved at a time.
    
2. Only the **topmost disk** can be moved.
    
3. A **larger disk cannot be placed on top of a smaller disk**.
    

---

# Example

Suppose

```text
n = 3

Source (A)

3
2
1
```

Goal

```text
Move all disks

A

↓

C
```

---

# Main Idea

To move `n` disks,

we first move the top `n-1` disks to the auxiliary rod.

Then,

move the largest disk directly to the destination.

Finally,

move the `n-1` disks from the auxiliary rod to the destination.

---

# Recursive Strategy

To move `n` disks from

```text
Source

↓

Destination
```

1. Move `n-1` disks from **Source → Auxiliary**
    
2. Move the largest disk from **Source → Destination**
    
3. Move `n-1` disks from **Auxiliary → Destination**
    

Notice that the same problem appears again with a smaller value of `n`.

Hence, recursion is a natural solution.

---

# Recurrence Relation

The work consists of

- Solving the first subproblem
    
- One disk movement
    
- Solving the second subproblem
    

Therefore,

$$  
T(n)=2T(n-1)+1  
$$

Base case

$$  
T(1)=1  
$$

Solving the recurrence,

$$  
\boxed{T(n)=2^n-1}  
$$

Thus, the **minimum number of moves** required is

$$  
\boxed{2^n-1}  
$$

---

# Recursive Algorithm

```text
Move(n, Source, Auxiliary, Destination)

1. Move(n-1, Source, Destination, Auxiliary)

2. Move largest disk

3. Move(n-1, Auxiliary, Source, Destination)
```

---

# Python Code

```python
def tower_of_hanoi(n, source, auxiliary, destination):

    if n == 1:
        print(f"Move Disk 1 from {source} to {destination}")
        return

    tower_of_hanoi(
        n - 1,
        source,
        destination,
        auxiliary
    )

    print(f"Move Disk {n} from {source} to {destination}")

    tower_of_hanoi(
        n - 1,
        auxiliary,
        source,
        destination
    )
```

Usage

```python
tower_of_hanoi(3, "A", "B", "C")
```

---

# Dry Run

For

```text
n = 2
```

The moves are

```text
Move Disk 1 from A to B

Move Disk 2 from A to C

Move Disk 1 from B to C
```

Total Moves

```text
3
```

which equals

$$  
2^2-1=3  
$$

---

For

```text
n = 3
```

Output

```text
Move Disk 1 from A to C

Move Disk 2 from A to B

Move Disk 1 from C to B

Move Disk 3 from A to C

Move Disk 1 from B to A

Move Disk 2 from B to C

Move Disk 1 from A to C
```

Total Moves

```text
7
```

which equals

$$  
2^3-1=7  
$$

---

# Why Does the Formula Become $2^n - 1$?

Every time we add one more disk,

we must

- Move the previous `n-1` disks,
    
- Move the largest disk,
    
- Move the previous `n-1` disks again.
    

Thus,

$$  
T(n)=2T(n-1)+1  
$$

Expanding,

```text
T(n)

=

2(2T(n-2)+1)+1

=

4T(n-2)+3

=

8T(n-3)+7

...

=

2^n-1
```

Hence,

$$  
\boxed{\text{Minimum Moves}=2^n-1}  
$$

---

# Complexity Analysis

The number of moves itself is

$$  
2^n-1  
$$

and every move is printed exactly once.

Therefore,

- **Time Complexity:** **$O(2^n)$**
    

The maximum recursion depth is `n`.

Hence,

- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# Common Interview Questions

## Q1. Why can't Tower of Hanoi be solved faster?

Every disk must eventually be moved.

The recursive strategy achieves the **minimum possible number of moves**,

which is

$$  
2^n-1  
$$

No algorithm can use fewer moves while following the rules.

---

## Q2. What is the recurrence relation?

$$  
T(n)=2T(n-1)+1  
$$

---

## Q3. What is the minimum number of moves?

$$  
\boxed{2^n-1}  
$$

Examples

|Disks|Minimum Moves|
|--:|--:|
|1|1|
|2|3|
|3|7|
|4|15|
|5|31|

---

## Q4. Why is recursion preferred?

Because the problem naturally breaks into **two smaller Tower of Hanoi problems**, each involving `n-1` disks.

This makes it an ideal recursive problem.

---

# Key Takeaways

- Move `n-1` disks to the auxiliary rod.
    
- Move the largest disk to the destination.
    
- Move the `n-1` disks to the destination.
    

Recurrence:

$$  
T(n)=2T(n-1)+1  
$$

Minimum moves:

$$  
2^n-1  
$$

Python implementation:

```python
def tower_of_hanoi(n, source, auxiliary, destination):

    if n == 1:
        print(f"Move Disk 1 from {source} to {destination}")
        return

    tower_of_hanoi(n - 1, source, destination, auxiliary)

    print(f"Move Disk {n} from {source} to {destination}")

    tower_of_hanoi(n - 1, auxiliary, source, destination)
```

- **Time Complexity:** **$O(2^n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

> **Interview Tip:** Tower of Hanoi is one of the best examples of **divide-and-conquer through recursion**. The key is recognizing that solving the problem for `n` disks requires solving the **same problem twice for `n-1` disks**, leading directly to the recurrence `$T(n)=2T(n-1)+1$` and the minimum move formula `$2^n-1$`.