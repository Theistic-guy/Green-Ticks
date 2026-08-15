---
Title: Kth smallest pair distance
Companies:
  - Amazon
  - Google
Topics:
  - Searching
  - Two Pointers
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - kth
  - Smallest
  - Pairs
  - Binary Search
  - Predicate Search - Counting
Link: ""
---

# Kth Smallest Pair Distance

**Pattern:**  Binary Search on Answer + two pointers as validator function

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code

```Python
def smallest_distance_pair(nums, k):

    nums.sort()

    low = 0
    high = nums[-1] - nums[0]

    while low < high:

        mid = (low + high) // 2

        left = 0
        count = 0

        for right in range(len(nums)):

            while nums[right] - nums[left] > mid:
                left += 1

            count += right - left

        if count >= k:
            high = mid
        else:
            low = mid + 1

    return low

```
**Time complexity** - O(nlogn + nlogW) , W is max (nums) - min(nums)
**Aux. Space complexity** -  O(1)

---


A very important **Binary Search on Answer** problem.

The problem looks like a pair-generation problem, but the practical optimal solution is:

$$  
\boxed{\text{Binary Search on Distance} + \text{Two Pointers}}  
$$

This is **LeetCode 719 — Find K-th Smallest Pair Distance** and is a good example of recognizing when **not** to generate all pairs.

---

# Problem Statement

Given an array, consider the distance between every pair:

$$  
|nums[i]-nums[j]|  
$$

Find the **kth smallest** distance.

Example:

```text
nums = [1, 3, 1]
k = 1
```

All pair distances:

```text
|1 - 3| = 2
|1 - 1| = 0
|3 - 1| = 2
```

Sorted:

```text
[0, 2, 2]
```

Therefore:

```text
answer = 0
```

---

# Why Brute Force Doesn't Work

There are:

$$  
\frac{n(n-1)}{2}  
$$

pairs.

A straightforward solution would be:

```python
distances = []

for i in range(n):
    for j in range(i + 1, n):
        distances.append(abs(nums[i] - nums[j]))

distances.sort()
return distances[k - 1]
```

Complexity:

- Generating pairs: **$O(n^2)$**
    
- Sorting: **$O(n^2\log n)$**
    
- Auxiliary Space: **$O(n^2)$**
    

This becomes infeasible for large `n`.

---

# The Key Insight

We don't actually need to know the individual pair distances.

Instead, ask:

> **How many pairs have distance $\le D$?**

For example:

```text
D = 3
```

Ask:

$$  
\boxed{  
\text{How many pairs have distance } \le 3?  
}  
$$

Suppose there are:

```text
17 pairs
```

Then:

- If `17 >= k`, the kth smallest distance is **at most 3**.
    
- If `17 < k`, the kth smallest distance is **greater than 3**.
    

This gives us a **monotonic predicate**.

---

# Binary Search on the Answer

The possible distance lies between:

$$  
0  
$$

and

$$  
\max(nums)-\min(nums)  
$$

So our answer space looks like:

```text
distance:

0  1  2  3  4  5  6  7 ...
        ✓  ✓  ✓  ✗  ✗  ✗
```

More precisely, if `D` is large enough that there are at least `k` pairs with distance `<= D`:

```text
True
```

Then every larger distance will also be `True`.

Therefore:

$$  
\boxed{\text{Binary Search}}  
$$

is applicable.

---

# The Predicate

Define:

```text
count(D)
```

as:

> Number of pairs whose distance is at most `D`.

Then:

```text
count(D) >= k
```

means:

```text
D is large enough
```

and

```text
count(D) < k
```

means:

```text
D is too small
```

So the binary search becomes:

```text
if count(mid) >= k:
    answer may be mid
    search left
else:
    search right
```

---

# But How Do We Count Pairs Efficiently?

This is the second half of the problem.

First sort the array.

```text
nums = [1, 1, 3, 6, 9]
```

For a fixed distance `D`, we want:

$$  
nums[j]-nums[i]\le D  
$$

Since the array is sorted, for every `right`, we can find the smallest valid `left`.

This can be done with **two pointers**.

---

# Two-Pointer Counting

Suppose:

```text
nums = [1, 3, 4, 7]
D = 3
```

For each `right`, maintain the smallest `left` satisfying:

$$  
nums[right]-nums[left]\le D  
$$

Then every index between `left` and `right` forms a valid pair with `right`.

Therefore the number of new pairs is:

$$  
right-left  
$$

---

# Why `right - left`?

Suppose:

```text
left = 1
right = 4
```

The valid indices are:

```text
1, 2, 3
```

for pairs with `right = 4`.

So there are:

$$  
4-1=3  
$$

valid pairs.

This counts:

```text
(left, right)
(left+1, right)
...
(right-1, right)
```

---

# Counting Function

```python
def count_pairs(nums, distance):

    left = 0
    count = 0

    for right in range(len(nums)):

        while nums[right] - nums[left] > distance:
            left += 1

        count += right - left

    return count
```

Because the array is sorted, `left` only moves forward.

Therefore:

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Complete Solution

```python
def smallest_distance_pair(nums, k):

    nums.sort()

    low = 0
    high = nums[-1] - nums[0]

    while low < high:

        mid = (low + high) // 2

        left = 0
        count = 0

        for right in range(len(nums)):

            while nums[right] - nums[left] > mid:
                left += 1

            count += right - left

        if count >= k:
            high = mid
        else:
            low = mid + 1

    return low
```

---

# Dry Run

Consider:

```text
nums = [1, 3, 1]
k = 1
```

Sort:

```text
[1, 1, 3]
```

Possible distances:

```text
0, 2, 2
```

Answer should be:

```text
0
```

### Binary Search

Distance range:

```text
0 ... 2
```

Try:

```text
mid = 1
```

Count pairs with distance `<= 1`:

```text
(1,1) → 0
```

Count:

```text
1
```

Since:

$$  
1\ge k  
$$

distance `1` is large enough.

Search left:

```text
high = 1
```

Now:

```text
mid = 0
```

Count pairs with distance `<= 0`:

```text
(1,1) → 0
```

Count:

```text
1
```

Again:

$$  
1\ge k  
$$

Therefore:

```text
answer = 0
```

---

# Why Sorting Is Essential

The counting technique relies on:

$$  
nums[left]\le nums[left+1]\le\cdots\le nums[right]  
$$

After sorting, if:

$$  
nums[right]-nums[left]>D  
$$

then `left` is invalid.

Moving `right` further right can never make that pair valid, because the values only become larger.

This monotonicity allows the two-pointer technique.

---

# Why We Don't Count Every Pair

Suppose:

```text
nums = [1, 2, 3, 4, 5]
D = 2
```

For `right = 4`:

```text
5 - 1 = 4  ✗
5 - 2 = 3  ✗
5 - 3 = 2  ✓
5 - 4 = 1  ✓
```

Once `left` reaches `2`, we know that:

```text
indices 2, 3
```

form valid pairs with index `4`.

So we immediately add:

$$  
4-2=2  
$$

instead of checking the pairs individually.

---

# Complexity

Let `n` be the number of elements.

### Sorting

$$  
O(n\log n)  
$$

### Each Binary Search Check

Two pointers scan the array once:

$$  
O(n)  
$$

### Number of Binary Search Iterations

The distance ranges from:

$$  
0  
$$

to:

$$  
\max(nums)-\min(nums)  
$$

Therefore:

$$  
O(\log(\max(nums)-\min(nums)))  
$$

### Overall

$$  
\boxed{  
O(n\log n+n\log W)  
}  
$$

where

$$  
W=\max(nums)-\min(nums)  
$$

Usually written as:

$$  
\boxed{  
O(n\log n+n\log W)  
}  
$$

with:

$$  
\boxed{  
O(1)  
}  
$$

auxiliary space apart from the sorting implementation.

---

# A Very Important Interview Distinction

This problem is related to **K Pairs with Smallest Sums**, but the optimal techniques are different.

### K Pairs With Smallest Sums

```text
Two sorted arrays
        ↓
Need actual k pairs
        ↓
Min Heap
```

### Kth Smallest Pair Distance

```text
Need only kth distance
        ↓
Can count pairs <= D
        ↓
Binary Search on D
        ↓
Two-pointer counting
```

This distinction is important.

Don't automatically think:

> "K smallest → Heap."

Instead ask:

> **"Can I efficiently count how many candidates are ≤ a guessed answer?"**

If yes, **Binary Search on Answer** is often a stronger approach.

---

# Alternative Counting Approach: Binary Search Per Element

Instead of two pointers, for each `right` we can binary-search for the first valid `left`.

For each `nums[right]`, find the first index satisfying:

$$  
nums[right]-nums[left]\le D  
$$

This gives:

$$  
O(n\log n)  
$$

per predicate check.

That leads to approximately:

$$  
O(n\log n\log W)  
$$

which is slower than the two-pointer approach.

Therefore:

$$  
\boxed{\text{Two pointers are preferred}}  
$$

because the `left` boundary only moves forward.

---

# Important Variations

## 1. Kth Smallest Pair Distance

The standard problem.

```text
Sort
→ Binary Search Distance
→ Count pairs ≤ distance
```

---

## 2. Count Pairs With Distance ≤ D

This is essentially the **predicate function** used by the main problem.

It is useful independently in interview problems involving:

```text
number of pairs
+
difference/distance threshold
```

---

## 3. Kth Smallest Absolute Difference

Same idea:

$$  
|a-b|  
$$

After sorting, for `i < j`:

$$  
|a_i-a_j|=a_j-a_i  
$$

So the same two-pointer counting technique applies.

---

## 4. Kth Smallest Pair Sum

This looks similar but is a different problem.

For pair sums:

$$  
a_i+b_j  
$$

you may use:

- Min Heap
    
- Binary Search on answer + counting
    

depending on the constraints and whether the arrays are sorted.

---

# Common Mistakes

### Mistake 1: Forgetting to sort

The two-pointer counting logic requires a sorted array.

---

### Mistake 2: Counting `right - left + 1`

Wrong.

The current element cannot pair with itself.

The number of valid pairs ending at `right` is:

$$  
\boxed{right-left}  
$$

---

### Mistake 3: Using `abs`

After sorting and ensuring:

```text
left <= right
```

we know:

$$  
nums[right]-nums[left]\ge0  
$$

Therefore:

```python
nums[right] - nums[left]
```

is sufficient.

---

### Mistake 4: Binary-searching the indices

We aren't searching for an index.

We are searching over the **possible distance values**:

```text
0 ... max(nums)-min(nums)
```

This is a textbook **Binary Search on Answer** problem.

---

### Mistake 5: Using a heap without considering `k`

You could enumerate pairs using a heap, but there are potentially:

$$  
O(n^2)  
$$

pairs.

The Binary Search + counting solution is substantially better for the constraints of the standard problem.

---

# Pattern Recognition

When you see:

```text
Find kth smallest/largest value
+
The candidate answer has a numeric range
+
Can count/check how many candidates satisfy ≤ X
```

ask:

$$  
\boxed{\text{Can I Binary Search the Answer?}}  
$$

For this problem:

```text
Candidate answer
        ↓
distance D

Predicate
        ↓
How many pairs have distance ≤ D?

Decision
        ↓
count >= k ?
```

That is the complete conceptual transformation.

---

# Key Takeaways

The solution has **two separate ideas**:

### 1. Binary Search on Distance

```text
low = 0
high = max(nums) - min(nums)
```

Find the smallest `D` such that:

$$  
count(D)\ge k  
$$

### 2. Count Pairs Efficiently

After sorting:

```python
left = 0

for right in range(n):

    while nums[right] - nums[left] > D:
        left += 1

    count += right - left
```

The complete pattern is:

```text
Sort array
    ↓
Guess distance D
    ↓
Count pairs with distance ≤ D
    ↓
count >= k ?
   ↙       ↘
 Yes       No
  ↓         ↓
go left   go right
```

### Complexity

$$  
\boxed{  
O(n\log n+n\log W)  
}  
$$

where:

$$  
W=\max(nums)-\min(nums)  
$$

and auxiliary space is:

$$  
\boxed{O(1)}  
$$

apart from sorting.

> **Interview Tip:** This is one of the best examples of **Binary Search on Answer**. The trick is to stop thinking about the actual kth pair. Instead, ask a much easier yes/no question: **"If I allow a distance of $D$, are there at least $k$ pairs available?"** Once you can answer that in $O(n)$ using two pointers, binary search finds the smallest feasible distance.