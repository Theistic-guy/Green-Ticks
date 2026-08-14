---
Title: Median of Two Sorted Arrays
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
  - Two Pointers
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - GFG
  - Binary Search
  - Median
  - Sorted
Link: ""
---
# Median of Two Sorted Arrays

**Pattern:** Binary Search

**Idea:** 

**Variations** : 
+ [kth-element-in-two-sorted-arrays](kth-element-in-two-sorted-arrays.md) ⭐⭐⭐⭐⭐

---

## 💻 Code

```Python
def find_median(A, B):

    if len(A) > len(B):
        A, B = B, A

    m = len(A)
    n = len(B)

    low = 0
    high = m

    left_size = (m + n + 1) // 2

    while low <= high:

        i = (low + high) // 2
        j = left_size - i

        Aleft = float("-inf") if i == 0 else A[i - 1]
        Aright = float("inf") if i == m else A[i]

        Bleft = float("-inf") if j == 0 else B[j - 1]
        Bright = float("inf") if j == n else B[j]

        # Correct partition
        if Aleft <= Bright and Bleft <= Aright:

            if (m + n) % 2:
                return max(Aleft, Bleft)

            return (
                max(Aleft, Bleft)
                +
                min(Aright, Bright)
            ) / 2

        # Too many elements taken from A
        elif Aleft > Bright:
            high = i - 1

        # Too few elements taken from A
        else:
            low = i + 1

```
**Time complexity** - O(log(min(m,n)))
**Aux. Space complexity** -  O(1)
**2 doubts** : Why `m+n+1 //2` and why search smaller array always? [here](../Notes/Extras/2%20doubts%20about%20'median%20of%20two%20sorted%20arrays'.md)

---

One of the most important **Binary Search** problems for FAANG interviews.

The challenge is to find the median of two sorted arrays **without actually merging them**.

---

# Problem Statement

Given two sorted arrays:

```text
A = [1, 3]
B = [2]
```

The combined sorted order would be:

```text
[1, 2, 3]
```

Median:

```text
2
```

The obvious solution is to merge them, but the important interview solution runs in:

$$  
O(\log(\min(m,n)))  
$$

---

# Approach 1: Merge

The simplest approach is to merge the two sorted arrays.

```python
def find_median(A, B):

    merged = []
    i = j = 0

    while i < len(A) and j < len(B):

        if A[i] <= B[j]:
            merged.append(A[i])
            i += 1
        else:
            merged.append(B[j])
            j += 1

    merged.extend(A[i:])
    merged.extend(B[j:])

    n = len(merged)

    if n % 2:
        return merged[n // 2]

    return (merged[n // 2 - 1] + merged[n // 2]) / 2
```

### Complexity

- **Time Complexity:** **$O(m+n)$**
    
- **Auxiliary Space Complexity:** **$O(m+n)$**
    

We can reduce the space to **$O(1)$** by merging only until we reach the median, but the time is still:

$$  
O(m+n)  
$$

This is usually **not the expected optimal solution**.

---

# Optimal Approach: Binary Search on the Partition

The key idea is:

> **Don't merge the arrays. Find where to split each array so that the left half contains exactly half of all elements.**

Suppose:

```text
A = [1, 3, 8]
B = [2, 7, 10, 12]
```

Total elements:

```text
7
```

We want:

```text
Left half = 4 elements
Right half = 3 elements
```

We choose a partition:

```text
A: [1, 3 | 8]
B: [2, 7 | 10, 12]
```

Left side contains:

```text
1, 3, 2, 7
```

Right side contains:

```text
8, 10, 12
```

If every element on the left is smaller than every element on the right, we have found the correct partition.

---

# What Makes a Partition Correct?

Let:

```text
A: ... | ...
B: ... | ...
```

Define:

```text
Aleft   = largest element on A's left
Aright  = smallest element on A's right

Bleft   = largest element on B's left
Bright  = smallest element on B's right
```

The partition is correct when:

$$  
Aleft \le Bright  
$$

and

$$  
Bleft \le Aright  
$$

In other words:

```text
largest(left side) <= smallest(right side)
```

Once this is true, the two sides are correctly separated.

---

# Why Do We Need Only One Binary Search?

We don't independently choose partitions in both arrays.

If the total number of elements that must be on the left is known, then:

# $$  
partition_B

leftSize-partition_A  
$$

So once we choose the partition in `A`, the partition in `B` is automatically determined.

Therefore we binary-search only one array.

---

# Why Binary Search the Smaller Array?

Always binary-search the smaller array.

Suppose:

```text
A has m elements
B has n elements

m <= n
```

Search `A`.

Why?

Because the partition must remain valid:

$$  
0 \le partition_A \le m  
$$

If we binary-search the smaller array, the search space is:

$$  
O(\log m)  
$$

which becomes:

$$  
\boxed{O(\log(\min(m,n)))}  
$$

It also makes the partition logic safer and easier to reason about.

---

# Partition Setup

Let:

```text
m = len(A)
n = len(B)
```

Ensure:

```python
if len(A) > len(B):
    A, B = B, A
```

Now `A` is guaranteed to be the smaller array.

The number of elements that should be on the left is:

$$  
\frac{m+n+1}{2}  
$$

using integer division.

So:

```python
left_size = (m + n + 1) // 2
```

If we choose:

```text
partition_A = i
```

then:

```text
partition_B = left_size - i
```

---

# Visualizing the Partition

Suppose:

```text
A = [1, 3, 8]
B = [2, 7, 10, 12]
```

One possible partition:

```text
A = [1, 3 | 8]

B = [2, 7 | 10, 12]
```

Define:

```text
Aleft  = 3
Aright = 8

Bleft  = 7
Bright = 10
```

Check:

$$  
3 \le 10  
$$

and

$$  
7 \le 8  
$$

Both are true.

Therefore this is the correct partition.

---

# Computing the Four Boundary Values

For a partition `i` in `A`:

```text
Aleft = A[i - 1]
Aright = A[i]
```

But what happens if the partition is at the beginning or end?

Use sentinels:

```python
Aleft = -inf   if i == 0
Aright = inf   if i == m
```

Similarly for `B`.

This eliminates special-case logic.

---

# Deciding Which Direction to Search

Now the most important part.

## Case 1: `Aleft > Bright`

```text
A: ... Aleft | Aright ...
B: ... Bleft | Bright ...
```

If:

$$  
Aleft > Bright  
$$

we have taken **too many elements from A** into the left half.

Therefore move the partition in `A` to the **left**:

```python
high = i - 1
```

---

## Case 2: `Bleft > Aright`

We have taken **too few elements from A** into the left half.

Therefore move the partition in `A` to the **right**:

```python
low = i + 1
```

---

## Case 3: Correct Partition

If:

$$  
Aleft \le Bright  
$$

and

$$  
Bleft \le Aright  
$$

we have found the correct partition.

---

# Finding the Median

Once the partition is correct, we know:

```text
Left side:

Aleft
Bleft
```

and

```text
Right side:

Aright
Bright
```

## Odd Number of Elements

The median is the largest element on the left:

$$  
\boxed{  
\max(Aleft,Bleft)  
}  
$$

---

## Even Number of Elements

The two middle elements are:

$$  
\max(Aleft,Bleft)  
$$

and

$$  
\min(Aright,Bright)  
$$

Therefore:

$$  
\boxed{  
\frac{  
\max(Aleft,Bleft)+\min(Aright,Bright)  
}{2}  
}  
$$

---

# Python Solution

```python
def find_median(A, B):

    if len(A) > len(B):
        A, B = B, A

    m = len(A)
    n = len(B)

    low = 0
    high = m

    left_size = (m + n + 1) // 2

    while low <= high:

        i = (low + high) // 2
        j = left_size - i

        Aleft = float("-inf") if i == 0 else A[i - 1]
        Aright = float("inf") if i == m else A[i]

        Bleft = float("-inf") if j == 0 else B[j - 1]
        Bright = float("inf") if j == n else B[j]

        # Correct partition
        if Aleft <= Bright and Bleft <= Aright:

            if (m + n) % 2:
                return max(Aleft, Bleft)

            return (
                max(Aleft, Bleft)
                +
                min(Aright, Bright)
            ) / 2

        # Too many elements taken from A
        elif Aleft > Bright:
            high = i - 1

        # Too few elements taken from A
        else:
            low = i + 1
```

---

# Dry Run

Consider:

```text
A = [1, 3]
B = [2, 4, 5, 6]
```

Total:

```text
6 elements
```

So:

```text
left_size = 3
```

Binary search `A`.

Suppose:

```text
i = 1
```

Then:

```text
j = 3 - 1 = 2
```

Partitions:

```text
A = [1 | 3]

B = [2, 4 | 5, 6]
```

Therefore:

```text
Aleft  = 1
Aright = 3

Bleft  = 4
Bright = 5
```

Check:

```text
Aleft <= Bright

1 <= 5       ✓
```

but:

```text
Bleft <= Aright

4 <= 3       ✗
```

So we took too few elements from `A`.

Move right:

```text
low = i + 1
```

Eventually:

```text
A = [1, 3 | ]

B = [2 | 4, 5, 6]
```

Now:

```text
Aleft  = 3
Aright = +∞

Bleft  = 2
Bright = 4
```

Both conditions hold.

Therefore:

```text
Left maximum = max(3,2) = 3
Right minimum = min(inf,4) = 4
```

Median:

$$  
\frac{3+4}{2}=3.5  
$$

---

# The Most Important Intuition

Think of the two arrays as two sorted streams:

```text
A: 1  3  8  9
B: 2  4  7  10  12
```

We don't care about merging them.

We only need to find the point where:

```text
Everything on the LEFT
        ↓
is smaller than
        ↓
Everything on the RIGHT
```

The partition is therefore the **boundary between the lower half and upper half** of the combined sorted order.

Binary Search simply moves this boundary until it becomes valid.

---

# Complexity

Let:

```text
m = length of smaller array
n = length of larger array
```

### Time

Binary search is performed only on the smaller array:

$$  
\boxed{  
O(\log(\min(m,n)))  
}  
$$

### Auxiliary Space

Only a few variables are used:

$$  
\boxed{  
O(1)  
}  
$$

---

# Common Interview Mistakes

### 1. Merging the arrays

Correct but not optimal.

```text
O(m+n)
```

The expected solution is:

```text
O(log(min(m,n)))
```

---

### 2. Binary-searching the larger array

It can work with careful implementation, but the standard solution deliberately searches the **smaller array**.

This guarantees the clean complexity:

$$  
O(\log(\min(m,n)))  
$$

---

### 3. Using `partition_B = (m+n)//2 - i` blindly

For an odd total number of elements, using:

```text
(m+n)//2
```

can create an awkward left/right size convention.

Using:

```python
left_size = (m + n + 1) // 2
```

makes the odd case particularly clean: the left side contains one extra element.

---

### 4. Forgetting empty partitions

The partition can be:

```text
A = [ | 1, 2, 3]
```

or:

```text
A = [1, 2, 3 | ]
```

Hence the use of:

```python
-inf
+inf
```

for boundary values.

---

### 5. Confusing the partition index with an array index

If:

```text
i = 2
```

then:

```text
Aleft = A[i-1]
Aright = A[i]
```

because `i` represents the **number of elements placed on the left**, not necessarily an element position.

---

# Important Variations

### 1. Median of Two Sorted Arrays

The classic problem.

Expected:

$$  
O(\log(\min(m,n)))  
$$

---

### 2. Kth Element of Two Sorted Arrays

Instead of finding the middle element, find the `k`th smallest element.

The same partition idea applies.

This is a very useful variation because it tests whether you actually understand the partition technique.

---

### 3. Median of Two Sorted Arrays of Different Sizes

Already handled naturally by the optimal solution.

The arrays do **not** need to have equal lengths.

---

### 4. Find the Kth Smallest Across Multiple Sorted Arrays

The two-array partition idea can be extended, but the implementation becomes more involved.

For interviews, the **two-array kth element** problem is the important one to master first.

---

# Pythonic Alternative

If the interviewer does **not** require the optimal algorithm, you can use:

```python
import statistics

statistics.median(sorted(A + B))
```

But this is:

$$  
O((m+n)\log(m+n))  
$$

because of sorting.

Even using a proper merge gives:

$$  
O(m+n)  
$$

So these are not acceptable when the interviewer explicitly asks for the optimal solution.

---

# Master Mental Model

Don't memorize the entire implementation.

Remember these four things:

### 1. Search the smaller array

```text
A = smaller array
```

### 2. Partition A

```text
i
```

### 3. Partition B automatically

```text
j = left_size - i
```

### 4. Check the cross-boundaries

```text
Aleft <= Bright
Bleft <= Aright
```

If:

```text
Aleft > Bright
```

move `i` left.

If:

```text
Bleft > Aright
```

move `i` right.

---

# Key Takeaways

The entire optimal solution boils down to finding the correct partition:

```text
A:  [ ... left ... | ... right ... ]

B:  [ ... left ... | ... right ... ]
```

such that:

$$  
\boxed{  
Aleft \le Bright  
}  
$$

and

$$  
\boxed{  
Bleft \le Aright  
}  
$$

Then:

### Odd total

$$  
\boxed{  
median=\max(Aleft,Bleft)  
}  
$$

### Even total

$$  
\boxed{  
median=  
\frac{  
\max(Aleft,Bleft)+\min(Aright,Bright)  
}{2}  
}  
$$

### Complexity

$$  
\boxed{  
O(\log(\min(m,n)))\text{ time}  
}  
$$

$$  
\boxed{  
O(1)\text{ auxiliary space}  
}  
$$

> **Interview Tip:** The hardest part is not the binary search—it is understanding the **partition**. You are effectively pretending that the two arrays were merged and then asking: **"Where would the middle cut fall?"** You don't actually merge them; you binary-search for that cut in the smaller array, while the corresponding cut in the other array is determined automatically.