---
Title: Smallest Range Covering Elements from K Sorted Lists
Companies:
  - Not Specified
Topics:
  - Heap
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - kth
  - Smallest
  - Sorted
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Smallest Range Covering Elements from K Sorted Lists

**Pattern:**  Heap (k-way)

**Idea:** 

**Variations** : 
+ [K-way Merge](../Notes/K-way%20Merge.md)
---

## 💻 Code

```Python
import heapq


def smallest_range(nums):

    heap = []
    current_max = float("-inf")

    # Put the first element from every list
    # into the heap.
    for i, arr in enumerate(nums):

        if not arr:
            return []

        heapq.heappush(heap, (arr[0], i, 0))

        current_max = max(current_max, arr[0])

    best_left = heap[0][0]
    best_right = current_max

    while True:

        current_min, list_idx, element_idx = heapq.heappop(heap)

        # Update the best range
        if current_max - current_min < best_right - best_left:

            best_left = current_min
            best_right = current_max

        # Move forward in the list
        next_idx = element_idx + 1

        if next_idx == len(nums[list_idx]):
            break

        next_value = nums[list_idx][next_idx]

        heapq.heappush(
            heap,
            (next_value, list_idx, next_idx)
        )

        current_max = max(current_max, next_value)

    return [best_left, best_right]
```
**Time complexity** - O(n log k)
**Aux. Space complexity** -  O( k)

---


A classic **Heap + K-way merge** problem.

This is an important extension of the previous **K Pairs with Smallest Sums** pattern.

The standard problem is commonly known as **Smallest Range Covering Elements from K Lists**.

---

# Problem Statement

Given `k` sorted lists, find the **smallest range `[L, R]`** such that the range contains **at least one element from every list**.

Example:

```text
lists = [
    [4, 10, 15, 24, 26],
    [0, 9, 12, 20],
    [5, 18, 22, 30]
]
```

One valid range is:

```text
[20, 24]
```

because:

```text
List 1 → 24
List 2 → 20
List 3 → 22
```

And its width is:

$$  
24-20=4  
$$

---

# Key Observation

At any point, suppose we have selected one element from every list:

```text
List 1 → 10
List 2 → 9
List 3 → 5
```

These elements define a range:

```text
min = 5
max = 10
```

So:

$$  
Range = [min,max]  
$$

The question becomes:

> **How can we make this range smaller while still having one element from every list?**

The crucial observation is:

> We should advance the list that currently contains the **minimum element**.

Why?

Suppose:

```text
5  ← minimum
7
10
```

If we move `7` or `10`, the minimum `5` remains, so the range cannot become smaller.

But if we move the element `5` to the next element in its list, the minimum may increase.

Therefore:

$$  
\boxed{\text{Always advance the current minimum}}  
$$

---

# Min-Heap Approach

Maintain exactly **one element from each list** in a min-heap.

Each heap entry contains:

```text
(value, list_index, element_index)
```

For example:

```text
(5, 2, 0)
```

means:

```text
value = 5
list  = 2
index = 0
```

The heap lets us quickly find the current minimum.

We also maintain:

```text
current_max
```

which is the largest selected element among all lists.

Then:

```text
current_min = heap[0][0]

current_range = current_max - current_min
```

---

# Why Do We Need `current_max`?

The heap gives us the minimum efficiently.

But the range requires:

$$  
max-min  
$$

We don't want to scan all `k` lists every time to find the maximum.

Therefore, whenever we insert a new element:

```python
current_max = max(current_max, new_value)
```

Now both values are available in:

$$  
O(1)  
$$

apart from heap operations.

---

# Algorithm

### Step 1

Put the **first element of every list** into the min-heap.

### Step 2

Find the maximum among these initial elements.

### Step 3

The current range is:

```text
[min_heap_value, current_max]
```

Update the best answer if this range is smaller.

### Step 4

Remove the current minimum from the heap.

### Step 5

Move to the **next element in the same list**.

### Step 6

Push that element into the heap and update `current_max`.

### Step 7

Repeat until one of the lists is exhausted.

Why stop?

Because once a list has no more elements, we can no longer maintain:

```text
at least one element from every list
```

---

# Python Code

```python
import heapq


def smallest_range(nums):

    heap = []
    current_max = float("-inf")

    # Put the first element from every list
    # into the heap.
    for i, arr in enumerate(nums):

        if not arr:
            return []

        heapq.heappush(heap, (arr[0], i, 0))

        current_max = max(current_max, arr[0])

    best_left = heap[0][0]
    best_right = current_max

    while True:

        current_min, list_idx, element_idx = heapq.heappop(heap)

        # Update the best range
        if current_max - current_min < best_right - best_left:

            best_left = current_min
            best_right = current_max

        # Move forward in the list
        next_idx = element_idx + 1

        if next_idx == len(nums[list_idx]):
            break

        next_value = nums[list_idx][next_idx]

        heapq.heappush(
            heap,
            (next_value, list_idx, next_idx)
        )

        current_max = max(current_max, next_value)

    return [best_left, best_right]
```

---

# Dry Run

Consider:

```text
A = [4, 10, 15, 24, 26]
B = [0, 9, 12, 20]
C = [5, 18, 22, 30]
```

Initially:

```text
A → 4
B → 0
C → 5
```

So:

```text
min = 0
max = 5

range = [0,5]
width = 5
```

The minimum is `0`, belonging to `B`.

Move forward in `B`:

```text
B → 9
```

Now:

```text
4, 9, 5
```

Range:

```text
[4,9]
```

width:

$$  
9-4=5  
$$

Again minimum is `4`.

Move forward in `A`:

```text
A → 10
```

Now:

```text
10, 9, 5
```

Range:

```text
[5,10]
```

width:

$$  
5  
$$

Continue this process.

Eventually we reach:

```text
A → 24
B → 20
C → 22
```

Therefore:

```text
min = 20
max = 24
```

Range:

```text
[20,24]
```

width:

$$  
4  
$$

This becomes our best answer.

---

# Why Advancing the Minimum Is Correct

This is the most important interview intuition.

Suppose the current selected elements are:

```text
3   8   12   15
↑
minimum
```

Current range:

```text
[3,15]
```

Suppose we advance `12` to `20`:

```text
3   8   15   20
↑
minimum still 3
```

Range becomes:

```text
[3,20]
```

It got worse.

Suppose we advance `3`:

```text
7   8   12   15
↑
new minimum
```

Now the range becomes:

```text
[7,15]
```

which can be smaller.

Therefore, the only meaningful move is:

$$  
\boxed{\text{Advance the list containing the minimum}}  
$$

This is the central greedy insight.

---

# Why Do We Stop When a List Is Exhausted?

Suppose one list has reached its final element:

```text
List A → no next element
```

We cannot advance it anymore.

Any future candidate would require another element from that list, but none exists.

Therefore no future range can be generated while maintaining:

```text
one element from every list
```

So we safely terminate.

---

# Complexity

Let:

$$  
N = \text{total number of elements across all lists}  
$$

and:

$$  
K = \text{number of lists}  
$$

We initially insert `K` elements.

Every element can enter the heap at most once.

Therefore there are at most:

$$  
N  
$$

heap operations.

Each heap operation costs:

$$  
O(\log K)  
$$

Therefore:

$$  
\boxed{  
O(N\log K)  
}  
$$

### Auxiliary Space

The heap contains at most one element from each list:

$$  
\boxed{  
O(K)  
}  
$$

excluding the input and output.

---

# Connection to K-Way Merge

This problem is closely related to:

> **Merge K Sorted Lists**

Both use:

```text
One candidate from each sorted list
        ↓
Min Heap
        ↓
Process smallest
        ↓
Advance that list
```

The difference is what we do with the candidates.

### K-Way Merge

We want:

```text
global sorted order
```

### Smallest Range

We want:

```text
minimum(max - min)
```

This connection is extremely useful for recognizing the pattern in interviews.

---

# Important Quirk: Tie Between Ranges

Suppose two ranges have the same width.

For example:

```text
[4, 8] → width 4

[5, 9] → width 4
```

The standard problem usually accepts either unless a tie-breaking rule is explicitly specified.

If the problem says:

> Return the range with the smallest left endpoint when widths are equal

then update using:

```python
if (
    current_max - current_min < best_right - best_left
    or
    (
        current_max - current_min == best_right - best_left
        and current_min < best_left
    )
):
```

Always check whether the problem specifies a tie-breaker.

---

# Important Practical Variations

## 1. Smallest Range Covering At Least One Element From Each List

This is the standard problem.

**Technique:**

$$  
\boxed{\text{Min Heap + Greedy}}  
$$

---

## 2. Smallest Range Covering At Least K Lists

Instead of requiring coverage of **every** list, only `K` lists need to be represented.

This becomes more involved because the heap alone is no longer sufficient.

A **sweep-line / two-pointer / frequency-count** style approach may be more appropriate depending on the exact constraints.

---

## 3. Smallest Range Covering Multiple Sorted Streams

This is essentially the same problem under different wording.

Examples include:

- timestamps from multiple services,
    
- events from multiple machines,
    
- values from multiple sorted data sources.
    

The underlying requirement is:

> Find the smallest interval containing at least one value from every source.

The same heap technique applies.

---

# Common Interview Mistakes

### Mistake 1: Using a max-heap

We need to efficiently find the **minimum**, so use a min-heap.

The maximum is maintained separately.

---

### Mistake 2: Recomputing the maximum every iteration

You could scan all `K` elements to find the maximum.

That would add:

$$  
O(K)  
$$

per iteration.

Instead maintain:

```python
current_max
```

incrementally.

---

### Mistake 3: Advancing an arbitrary list

Only advancing the minimum can potentially reduce:

$$  
max-min  
$$

---

### Mistake 4: Generating every possible combination

There can be:

$$  
n_1n_2\cdots n_k  
$$

combinations.

The heap avoids generating them.

---

# Pattern Recognition

When you see:

```text
K sorted lists

+

Need one element from every list

+

Minimize max - min
```

think:

$$  
\boxed{\text{Min Heap + Current Maximum}}  
$$

The mental template is:

```text
Put first element from every list
            ↓
      Track maximum
            ↓
       Pop minimum
            ↓
      Evaluate range
            ↓
 Advance the same list
            ↓
       Push next
            ↓
          Repeat
```

---

# Comparison With Previous Topic

You just saw **K Pairs with Smallest Sums**.

The two problems share the same underlying pattern:

|K Smallest Pairs|Smallest Range|
|---|---|
|Multiple sorted rows|Multiple sorted lists|
|Min-heap|Min-heap|
|Pop smallest candidate|Pop smallest candidate|
|Advance that row|Advance that list|
|Find smallest `k` sums|Minimize `max - min`|

The important difference is that here we need to maintain **both minimum and maximum**.

---

# Key Takeaways

The entire solution can be remembered as:

```text
1. Put the first element of every list in a min-heap.

2. Track the largest selected element.

3. Current range = [heap minimum, current maximum].

4. Update the best range.

5. Pop the minimum.

6. Advance only the list that produced that minimum.

7. Push its next element.

8. Stop when any list is exhausted.
```

### Complexity

$$  
\boxed{  
O(N\log K)  
}  
$$

time, where `N` is the total number of elements.

$$  
\boxed{  
O(K)  
}  
$$

auxiliary space.

> **Interview Tip:** The key insight is **"to make `max - min` smaller, I must move the current minimum upward."** Since every list is sorted, moving forward in the list containing the minimum is the only move that can potentially improve the range. The min-heap simply makes finding that minimum efficient.