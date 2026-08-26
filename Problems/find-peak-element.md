---
Title: Find Peak Element
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - GFG
  - Binary Search
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Finding a Peak Element — Binary Search

**Pattern:**  Binary Search

**Idea:** 

**Variations** : 
+ [find-peak-in-mountain-array](find-peak-in-mountain-array.md)
+ [find-a-peak-element-in-2d-matrix](find-a-peak-element-in-2d-matrix.md)

---

## 💻 Code

```Python
def find_peak(arr):

    low = 0
    high = len(arr) - 1

	# there would be atleast 2 elements
    while low < high:

        mid = (low + high) // 2
        
		# arr[mid+1] would never give out of bounds exception
        if arr[mid] < arr[mid + 1]: 
        
            low = mid + 1
        else:
            high = mid # search in the left 

    return low
```
**Time complexity** - O(log n) 
**Aux. Space complexity** -  O(1)
**Why it works** - [Why finding peak element using binary search works](../Notes/Extras/Why%20finding%20peak%20element%20using%20binary%20search%20works.md)

---


A classic **Binary Search on an Array** problem.

The important idea is that we don't need to inspect every element. We can use the **slope around `mid`** to determine which side must contain a peak.

---

# Problem Statement

A **peak element** is an element that is greater than its neighbors.

For an array:

```text
[1, 3, 20, 4, 1, 0]
```

`20` is a peak because:

```text
3 < 20 > 4
```

Return the index of **any** peak.

---

# Boundary Elements

For the purpose of this problem, imagine:

```text
arr[-1] = -∞
arr[n] = -∞
```

Therefore, a boundary element can also be a peak.

Example:

```text
[5, 2, 1]
```

`5` is a peak.

And:

```text
[1, 2, 5]
```

`5` is a peak.

---

# Key Observation

Look at `mid` and `mid + 1`.

### Case 1

```text
arr[mid] < arr[mid + 1]
```

We are on an **upward slope**:

```text
       /
      /
     /
----/
  mid  mid+1
```

There **must be a peak somewhere to the right**.

Why?

Because eventually either:

- the values stop increasing → peak found, or
    
- we reach the boundary → the boundary itself is a peak.
    

Therefore:

```python
low = mid + 1
```

---

### Case 2

```text
arr[mid] > arr[mid + 1]
```

We are on a **downward slope**:

```text
\
 \
  \
   \----
 mid mid+1
```

There must be a peak at `mid` or somewhere to the **left**.

Therefore:

```python
high = mid
```

Notice that we **do not** use:

```python
high = mid - 1
```

because `mid` itself may be the peak.

---

# Core Binary Search

```python
def find_peak(arr):

    low = 0
    high = len(arr) - 1

    while low < high:

        mid = (low + high) // 2

        if arr[mid] < arr[mid + 1]:
            low = mid + 1
        else:
            high = mid

    return low
```

The returned value is the **index** of a peak.

---

# Dry Run

```text
arr = [1, 3, 20, 4, 1, 0]
```

Initially:

```text
low = 0
high = 5
```

### Iteration 1

```text
mid = 2

arr[2] = 20
arr[3] = 4
```

Since:

```text
20 > 4
```

we are descending.

Therefore:

```text
high = 2
```

---

### Iteration 2

```text
low = 0
high = 2

mid = 1
```

```text
arr[1] = 3
arr[2] = 20
```

Since:

```text
3 < 20
```

we are ascending.

Therefore:

```text
low = 2
```

Now:

```text
low == high == 2
```

Answer:

```text
index = 2
value = 20
```

---

# Why Is Binary Search Possible?

This is the important interview reasoning.

We don't actually know where the peak is.

But we **do know that at least one side must contain a peak**.

If:

```text
arr[mid] < arr[mid + 1]
```

then the right side is guaranteed to contain a peak.

If:

```text
arr[mid] > arr[mid + 1]
```

then the left side including `mid` is guaranteed to contain a peak.

Therefore, every iteration allows us to discard roughly half of the search space.

---

# Complexity

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

This is much better than scanning the entire array:

$$  
O(n)  
$$

---

# Important Variation 1: Find a Peak in a Mountain Array

A **Mountain Array** looks like:

```text
[1, 3, 5, 7, 6, 4, 2]
```

There is exactly one peak.

The same Binary Search works:

```python
if arr[mid] < arr[mid + 1]:
    low = mid + 1
else:
    high = mid
```

This is essentially the same algorithm, but the problem guarantees a mountain structure.

### Complexity

- **Time:** **$O(\log n)$**
    
- **Auxiliary Space:** **$O(1)$**
    

---

# Important Variation 2: Find in Mountain Array

This is a more realistic interview follow-up.

Given:

```text
[1, 3, 5, 7, 6, 4, 2]
```

and target:

```text
6
```

find its index.

### Approach

First find the peak.

Then the array becomes two sorted arrays:

```text
Ascending:

[1, 3, 5, 7]

Descending:

[7, 6, 4, 2]
```

Perform Binary Search on both sides.

Overall:

$$  
O(\log n)  
$$

This is **LeetCode 1095 — Find in Mountain Array**.

---

# Important Variation 3: Find First/Any Peak Under Constraints

Sometimes the question asks for:

> Find the peak with the **smallest index**.

This changes the problem.

You cannot blindly return any peak; you need to continue searching appropriately after finding one.

This is less common than the standard "any peak" problem, so don't overgeneralize the standard solution.

---

# Important Variation 4: 2D Peak Element

This is a genuine advanced interview extension.

Given a matrix, find an element that is greater than its neighboring elements.

Example:

```text
[10, 8, 10]
[14,13,12]
[15, 9,11]
```

A 2D peak is an element that is greater than its valid neighbors.

The common approach is:

1. Choose a middle column.
    
2. Find the maximum element in that column.
    
3. Compare it with its left/right neighbors.
    
4. Move toward the larger neighbor if necessary.
    

This gives approximately:

$$  
O(m\log n)  
$$

for an `m × n` matrix when binary-searching columns.

This is the core idea behind **LeetCode 1901 — Find a Peak Element II**.

---

# Important Variation 5: Find the Maximum in a Bitonic Array

A **bitonic array** increases and then decreases:

```text
[2, 5, 8, 12, 9, 4, 1]
```

The maximum is the peak.

Therefore:

> **Find maximum in a bitonic array = Find peak element.**

Binary Search:

$$  
O(\log n)  
$$

---

# Practical FAANG Pattern Recognition

The important problems to actually know are:

|Problem|Core Technique|
|---|---|
|Find Peak Element — LC 162|Binary Search on slope|
|Peak Index in a Mountain Array — LC 852|Same peak search|
|Find in Mountain Array — LC 1095|Peak + 2 Binary Searches|
|Find Peak Element II — LC 1901|2D Binary Search|
|Bitonic Array Maximum|Peak Search|

These are meaningful variations because they reuse the same underlying idea rather than being artificial modifications.

---

# Common Mistakes

### Mistake 1: Checking both neighbors

You don't need to do:

```python
arr[mid - 1] < arr[mid] > arr[mid + 1]
```

The slope comparison with only:

```python
arr[mid] < arr[mid + 1]
```

is enough.

It also avoids boundary problems.

---

### Mistake 2: Using `high = mid - 1`

Wrong.

If:

```text
arr[mid] > arr[mid + 1]
```

`mid` itself could be the peak.

Therefore:

```python
high = mid
```

---

### Mistake 3: Using `low <= high`

The clean implementation uses:

```python
while low < high:
```

because we're narrowing the range until exactly one candidate remains.

---

### Mistake 4: Assuming there is only one peak

The standard problem may contain multiple peaks:

```text
[1, 5, 2, 4, 3]
```

Both `5` and `4` are peaks.

The problem only requires **any one** peak.

---

# Pythonic Way

There is no useful built-in function for this.

You could use:

```python
arr.index(max(arr))
```

but that finds the **global maximum**, which is unnecessary and costs:

$$  
O(n)  
$$

The Binary Search solution finds **any local peak in $O(\log n)$**.

---

# Key Takeaways

The core rule is extremely simple:

```python
if arr[mid] < arr[mid + 1]:
    low = mid + 1
else:
    high = mid
```

Think of it as following the **slope**:

```text
Increasing slope
      /
     /
    /       → Peak must be RIGHT
---/

Decreasing slope

\
 \
  \          → Peak is LEFT / MID
   \---
```

### Complexity

$$  
\boxed{  
O(\log n)\text{ time}  
}  
$$

$$  
\boxed{  
O(1)\text{ auxiliary space}  
}  
$$

> **Interview Tip:** The real insight is the **guarantee of a peak**. You don't need to know which peak you're going to find. If the array is currently going upward, a peak is guaranteed on the right; if it's going downward, a peak is guaranteed on the left (including `mid`). That's what makes this a valid Binary Search despite the array not being sorted.