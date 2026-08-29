<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Josephus Problem – Common Interview Variations

This note covers the most common variations of the classic Josephus problem that are relevant in coding interviews.

---

# Variation 1: 1-Based Indexing

The standard recurrence returns the answer using **0-based indexing**.

Many interview questions instead number people from

```text
1 to n
```

In that case,

simply add `1` to the answer.

### Formula

0-based

$$  
J(n,k)=\left(J(n-1,k)+k\right)\bmod n  
$$

1-based

$$  
\boxed{J(n,k)=\left(J(n-1,k)+k-1\right)\bmod n+1}  
$$

or more simply,

```python
answer = josephus(n, k) + 1
```

if your recursive function returns a 0-based answer.

---

# Variation 2: Special Case (k = 2)

When every **second person** is eliminated, there is a direct mathematical solution.

Suppose

$$  
n=2^m+l  
$$

where

$$  
0\le l<2^m  
$$

Then,

### 0-Based Index

$$  
\boxed{J(n,2)=2l}  
$$

### 1-Based Index

$$  
\boxed{J(n,2)=2l+1}  
$$

---

## Example

```text
n = 13
```

Largest power of two not exceeding 13

```text
8
```

Therefore

```text
l = 13 - 8 = 5
```

Answer

```text
0-based

2 × 5 = 10
```

```text
1-based

11
```

---

# Variation 3: Print the Elimination Order

Instead of returning only the survivor,

print every eliminated person.

## Idea

Maintain the people in a list.

Repeatedly remove

```python
(current + k - 1) % len(people)
```

---

## Python Code

```python
def josephus_order(n, k):

    people = list(range(n))

    idx = 0

    while people:

        idx = (idx + k - 1) % len(people)

        print(people.pop(idx))
```

Example

```text
n = 5

k = 2
```

Output

```text
1
3
0
4
2
```

(The last number printed is the survivor.)

---

## Complexity

- **Time Complexity:** **$O(n^2)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

> Removing an element from a Python list is **$O(n)$**, making the overall complexity quadratic.

---

# Variation 4: Return the Elimination Order

Instead of printing,

store the elimination sequence.

```python
def josephus_order(n, k):

    people = list(range(n))

    order = []

    idx = 0

    while people:

        idx = (idx + k - 1) % len(people)

        order.append(people.pop(idx))

    return order
```

Example

```text
Input

n = 7

k = 3
```

Output

```text
[2, 5, 1, 6, 4, 0, 3]
```

---

# Variation 5: Find the Last Remaining Person (Simulation)

Instead of using recursion,

simulate the process.

```python
def josephus_simulation(n, k):

    people = list(range(n))

    idx = 0

    while len(people) > 1:

        idx = (idx + k - 1) % len(people)

        people.pop(idx)

    return people[0]
```

---

## Complexity

- **Time Complexity:** **$O(n^2)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

Although slower than the recurrence, this approach is useful when the interviewer asks for the elimination sequence.

---

# Variation 6: Circular Linked List Solution

Sometimes interviewers ask,

> "Can you implement Josephus using a Circular Linked List?"

The idea is:

- Build a circular linked list.
    
- Move `k-1` nodes.
    
- Delete the current node.
    
- Continue until one node remains.
    

### Complexity

- **Time Complexity:** **$O(nk)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

This variation is more about data structures than optimization.

---

# Comparison

|Problem|Best Approach|Time|Aux. Space|
|---|---|---|---|
|Last Survivor|Recurrence / Iteration|**$O(n)$**|**$O(1)$** (iterative)|
|Print Elimination Order|List Simulation|**$O(n^2)$**|**$O(n)$**|
|Return Elimination Order|List Simulation|**$O(n^2)$**|**$O(n)$**|
|Special Case (`k=2`)|Mathematical Formula|**$O(1)$**|**$O(1)$**|

---

# Interview Tips

- If only the **last survivor** is required, use the recurrence or its iterative version.
    
- If the **entire elimination order** is required, simulation is usually the simplest approach.
    
- Remember the special mathematical shortcut only for **`k = 2`**.
    
- Don't use list simulation when only the survivor is needed—the iterative recurrence is both cleaner and more efficient.
    

> **Quick Recognition Pattern:**
> 
> - **Last remaining person** → Josephus recurrence.
>     
> - **Print elimination sequence** → Simulation with a list (or a more advanced data structure like a balanced tree/Fenwick tree for large constraints).
>