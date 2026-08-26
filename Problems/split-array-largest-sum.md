---
Title: Split Array Largest Sum
Companies:
  - Google
  - Meta
  - Amazon
Topics:
  - Searching
  - Greedy
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - Binary Search
  - Predicate Search - Minimize Maximum
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Split Array Largest Sum

**Pattern:**  Binary Search on answer

**Idea:** 

**Variations** : 
+ part of [Binary Search on Answer ( Predicate Search) - 5⭐](../Notes/Binary%20Search%20on%20Answer%20(%20Predicate%20Search)%20-%205⭐.md)
---

## 💻 Code

```Python
def splitArray(nums, k):
    low = max(nums)
    high = sum(nums)
    ans = high

    def feasible(limit):
        groups = 1
        current_sum = 0

        for x in nums:
            if current_sum + x > limit:
                groups += 1
                current_sum = 0

            current_sum += x

        return groups <= k

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1

    return ans

```
**Time complexity** - O(n log S) , S = sum(nums)
**Aux. Space complexity** -  O(1)

---



> **LeetCode 410 — Binary Search on Answer + Greedy Partition**
>
> Closely related classics: **Book Allocation** and **Painter's Partition**.

Given an array `nums` and an integer `k`, split the array into **`k` non-empty contiguous subarrays** such that the **largest subarray sum is minimized**.

---

## Key Idea

The problem asks us to **minimize the maximum subarray sum**.

Instead of directly finding the optimal partition, guess the answer:

```text
X = maximum sum allowed for any subarray
```

Then ask:

> **Can I split the array into at most `k` subarrays, each having sum ≤ X?**

This gives a monotonic predicate:

```text
X:          small -------------------- large
feasible:   F F F F F T T T T T T T
                         ↑
                  minimum feasible X
```

So this is:

> **Binary Search on Answer → Minimize the Maximum → First True**

---

## Why the Greedy Validator Works

For a fixed `X`, scan from left to right and keep adding elements until adding the next one would exceed `X`.

Then start a new subarray.

```text
nums = [7, 2, 5, 10, 8]
X = 18

[7, 2, 5] = 14
[10, 8]   = 18

→ 2 subarrays
```

Why is this optimal for the feasibility check?

Because for a fixed maximum allowed sum, **packing as many consecutive elements as possible into the current subarray leaves the remaining elements for as few subsequent groups as possible**.

We don't need the optimal partition itself—only whether *some* valid partition exists.

---

## Search Space

### Lower bound

```python
low = max(nums)
```

At least the largest element must belong to some subarray.

### Upper bound

```python
high = sum(nums)
```

We can always put everything into one subarray.

Therefore:

```text
[max(nums), sum(nums)]
```

contains the answer.

---

# Approach

### Feasibility Check

```python
def feasible(limit):
    groups = 1
    current_sum = 0

    for x in nums:
        if current_sum + x > limit:
            groups += 1
            current_sum = 0

        current_sum += x

    return groups <= k
```

Notice the important condition:

```python
groups <= k
```

not necessarily `groups == k`.

If a limit allows fewer than `k` groups, it is still feasible; the partition can often be split further because the problem asks for contiguous non-empty subarrays.

---

# Python Solution — Implicit Answer Style

```python
def splitArray(nums, k):
    low = max(nums)
    high = sum(nums)

    def feasible(limit):
        groups = 1
        current_sum = 0

        for x in nums:
            if current_sum + x > limit:
                groups += 1
                current_sum = 0

            current_sum += x

        return groups <= k

    while low < high:
        mid = low + (high - low) // 2

        if feasible(mid):
            high = mid
        else:
            low = mid + 1

    return low
```

### Why the updates?

If `mid` is feasible:

```python
high = mid
```

`mid` might itself be the minimum answer, so **keep it**.

If `mid` is not feasible:

```python
low = mid + 1
```

`mid` and everything smaller cannot work.

At termination:

```text
low == high
```

which is the **first feasible value**.

---

# Explicit Answer Style

The same problem can use the traditional `low <= high` formulation:

```python
def splitArray(nums, k):
    low = max(nums)
    high = sum(nums)
    ans = high

    def feasible(limit):
        groups = 1
        current_sum = 0

        for x in nums:
            if current_sum + x > limit:
                groups += 1
                current_sum = 0

            current_sum += x

        return groups <= k

    while low <= high:
        mid = low + (high - low) // 2

        if feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1

    return ans
```

Here `ans` explicitly stores the **best feasible value found so far**.

### Which style?

For this problem, I prefer the **implicit first-True version** because the problem naturally maps to:

```text
FFFFTTTT
    ↑
first feasible maximum sum
```

Both are equivalent; the important thing is understanding the invariant.

---

## Dry Run

```text
nums = [7, 2, 5, 10, 8]
k = 2
```

Search space:

```text
low  = 10
high = 32
```

Suppose:

```text
limit = 18
```

Greedy partition:

```text
[7, 2, 5] = 14
[10, 8]   = 18

groups = 2
```

Feasible → search for a smaller maximum.

Now:

```text
limit = 14
```

```text
[7, 2, 5] = 14
[10]      = 10
[8]       = 8
```

Requires 3 groups → not feasible.

Eventually:

```text
answer = 18
```

---

# Complexity

Let:

* $n$ = number of elements
* $S = \sum nums$
* $M = \max(nums)$

Each feasibility check:

$$
O(n)
$$

Number of binary-search iterations:

$$
O(\log(S-M+1))
$$

Therefore:

$$
\boxed{O(n\log(S-M+1))}
$$

Usually expressed as:

$$
\boxed{O(n\log S)}
$$

### Auxiliary Space

$$
\boxed{O(1)}
$$

No additional data structure is required.

---

# The General "Minimize the Maximum" Pattern

This problem is the canonical example.

```text
             Original optimization
                     ↓
          Minimize maximum load
                     ↓
           Guess maximum = X
                     ↓
       Can we finish using X?
                     ↓
              Greedy check
                     ↓
            groups <= K ?
                     ↓
               F F F T T T
                     ↓
              First True
```

Whenever you see:

* minimize maximum workload
* minimize maximum sum
* minimize capacity
* minimize maximum pages
* minimize completion time

consider this pattern.

---

# Book Allocation — Same Core Pattern

### Problem

Given books with page counts, allocate **contiguous books** to `k` students such that the **maximum pages assigned to any student is minimized**.

Example:

```text
books = [12, 34, 67, 90]
students = 2
```

Candidate:

```text
X = maximum pages a student may receive
```

Validator:

> How many students are required if no student can receive more than `X` pages?

Greedily allocate consecutive books:

```text
[12, 34] = 46
[67]     = 67
[90]     = 90
```

→ 3 students.

If `3 > k`, `X` is too small.

### Pattern

```text
X = maximum pages
        ↓
greedy contiguous allocation
        ↓
students required <= K?
        ↓
first feasible X
```

### Important quirks

* Books generally **cannot be reordered**.
* Allocation is **contiguous**.
* A student must generally receive at least one book.
* If `k > number_of_books`, allocation is impossible in the usual formulation.

---

# Painter's Partition — Same Core Pattern

### Problem

Given boards with lengths, assign contiguous boards to `k` painters so that the **maximum workload/time of any painter is minimized**.

Candidate:

```text
X = maximum work assigned to one painter
```

Validator:

> How many painters are required if no painter can handle more than `X` work?

Again:

```text
greedy contiguous partition
        ↓
painters required <= K?
        ↓
first feasible X
```

The algorithm is essentially identical to **Split Array Largest Sum**.

---

# Relationship Between the Three

| Problem                     | Candidate `X`            | What validator counts |
| --------------------------- | ------------------------ | --------------------- |
| **Split Array Largest Sum** | Maximum subarray sum     | Number of subarrays   |
| **Book Allocation**         | Maximum pages/student    | Number of students    |
| **Painter's Partition**     | Maximum workload/painter | Number of painters    |
| **Ship Packages**           | Maximum capacity/day     | Number of days        |

The underlying pattern is:

$$
\boxed{\text{Minimize Maximum} + \text{Greedy Partition} + \text{First True}}
$$

Once you understand **Split Array Largest Sum**, the others should largely feel like renamed versions of the same technique.

---

## Common Mistakes / Quirks

### 1. Forgetting contiguity

You cannot arbitrarily distribute elements:

```text
[1, 2, 3, 4]
```

cannot become:

```text
Group 1: [1, 4]
Group 2: [2, 3]
```

The groups must preserve order.

---

### 2. Using `sum(nums) // k` as the answer

That's only an intuitive lower bound and is **not sufficient**.

The largest element alone may force a much larger answer.

---

### 3. Using `groups == k`

For the feasibility test, prefer:

```python
groups <= k
```

when the problem's formulation permits further splitting.

---

### 4. Negative numbers

This standard greedy partition argument assumes **non-negative values**.

If negative numbers are allowed, the usual greedy validator may no longer behave correctly.

---

## Important Variations

### ⭐ Must Know

**Book Allocation** and **Painter's Partition**

These are classic interview/DSA variants and reinforce exactly the same pattern.

### ⭐ Another important variant

**Capacity to Ship Packages Within D Days**

Same greedy partition idea, but the units are "days" and package weights must remain in order.

### Advanced

Problems where the validator isn't simply a left-to-right greedy partition, e.g. binary search combined with:

* two pointers
* counting
* graph traversal
* DP

These are worth learning later, but don't confuse them with this core family.

---

# Pattern Recognition

When a problem says:

> **"Split/divide/allocate something into `K` contiguous groups while minimizing the maximum amount assigned to any group."**

Immediately think:

```text
MINIMIZE THE MAXIMUM
        ↓
Guess maximum allowed = X
        ↓
Greedily form contiguous groups
        ↓
How many groups are needed?
        ↓
groups <= K ?
        ↓
FFFFTTTT
        ↓
Binary Search → FIRST TRUE
```

### Mental hook

> **"Don't find the best partition directly. Guess the maximum allowed load, greedily see how many groups it requires, and binary-search the smallest load that needs at most K groups."**
