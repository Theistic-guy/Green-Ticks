---
Title: Repeating Element (Cycle + Expected Sum appr.)
Companies:
  - Amazon
  - Microsoft
  - Google
  - Apple
  - Meta
  - LinkedIn
  - Adobe
  - Uber
  - Goldman Sachs
  - VMware
  - Walmart Labs
  - Bloomberg
Topics:
  - Arrays
  - Two Pointers
  - Linked Lists
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - GFG
  - Floyd's Cycle-Finding
  - Cycle
  - In-place Array Modification
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Repeating Element — Detection Techniques & Important Variations

**Pattern:**  floyd detection (best) + others

**Idea:** 

**Variations** : 
+ part of [Floyd's Cycle Detection & Duplicate Finding Algorithm (Tortoise and Hare)](../Notes/Floyd's%20Cycle%20Detection%20&%20Duplicate%20Finding%20Algorithm%20(Tortoise%20and%20Hare).md)
---

## 💻 Code

Floyd's cycle solution is the canonical solution to this problem.
```Python
def findDuplicate(nums):
    slow = fast = 0

    # Phase 1: Find meeting point inside cycle
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]

        if slow == fast:
            break

    # Phase 2: Find cycle entrance
    slow = 0

    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]

    return slow

```
**Time complexity** - O(n)
**Aux. Space complexity** -  O(1)
###### My custom expected sum solution -
[Expected Sum solution for Repeating Element (or Floyd cycle finding solution duplicates)](../Notes/Extras/Expected%20Sum%20solution%20for%20Repeating%20Element%20(or%20Floyd%20cycle%20finding%20solution%20duplicates).md)


---
# Repeating Element — Detection Techniques & Important Variations

**Tags:** #arrays #duplicates #repeating-element #cycle-detection #floyd-cycle-detection #fast-and-slow-pointers #two-pointers #linked-list-thinking #pigeonhole-principle #binary-search #binary-search-on-answer #counting #in-place #negative-marking #hashing #set #xor #bit-manipulation #index-mapping #constraints #space-optimization

> **Core lesson:** "Find a repeating element" is not one algorithm. The **constraints determine which technique is appropriate**.
>
> The most important interview skill is recognizing when an array can be treated as a **functional graph / linked list**, which leads to **Floyd's Cycle Detection**.

---

## 1. Classic Problem

Given an array containing `n` elements where values lie in a restricted range, find the repeating element.

A common formulation:

```text
nums has n + 1 elements
each value ∈ [1, n]
exactly one value is repeated
```

Example:

```text
[1, 3, 4, 2, 2]

answer = 2
```

The interesting part is usually that the problem imposes constraints such as:

* Don't modify the array.
* $O(1)$ auxiliary space.
* $O(n)$ time.

Those constraints determine the solution.

---

# 2. First Think: What Information Do I Have?

Before choosing an algorithm, ask:

```text
1. Can I use extra space?
2. Can I modify the array?
3. Is the value range restricted?
4. Is there exactly one duplicate?
5. Can an element occur more than twice?
6. Is there exactly one repeated value or multiple?
7. Is the array guaranteed to have n+1 elements with values 1..n?
```

This is extremely important.

The same-looking "find duplicate" problem can have completely different optimal solutions.

---

# 3. Approach 1 — Hash Set

The simplest solution:

```python
def find_duplicate(nums):
    seen = set()

    for x in nums:
        if x in seen:
            return x
        seen.add(x)
```

### Complexity

* Time: $O(n)$ average
* Auxiliary Space: $O(n)$

### When to use

Use this when:

* extra memory is allowed
* simplicity is more important than space optimization

### Interview point

Don't jump to Floyd's algorithm immediately.

If the interviewer hasn't imposed $O(1)$ space, a hash set may be the most straightforward solution.

---

# 4. Approach 2 — Sort

```python
def find_duplicate(nums):
    nums.sort()

    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            return nums[i]
```

### Complexity

* Time: $O(n\log n)$
* Auxiliary Space: depends on sorting implementation
* **Input is modified**

Not usually the preferred solution when the problem specifically asks for $O(n)$ time or prohibits modification.

---

# 5. Approach 3 — Frequency / Counting

If the value range is small and known:

```python
def find_duplicate(nums):
    freq = [0] * (len(nums) + 1)

    for x in nums:
        freq[x] += 1

        if freq[x] == 2:
            return x
```

* Time: $O(n)$
* Auxiliary Space: $O(n)$

This is conceptually useful because it highlights the underlying question:

> **How many times does each value occur?**

---

# 6. Approach 4 — In-Place Marking

If modification is allowed and values map naturally to indices:

```python
def find_duplicate(nums):
    for x in nums:
        idx = abs(x)

        if nums[idx] < 0:
            return idx

        nums[idx] = -nums[idx]
```

Example:

```text
[1, 3, 4, 2, 2]
```

Use the value as an index and mark that index as visited.

### Complexity

* Time: $O(n)$
* Auxiliary Space: $O(1)$
* **Modifies the input**

This technique is much more general than just duplicate detection.

It appears in problems involving:

* missing numbers
* duplicates
* elements appearing twice
* visited-state encoding

### Important limitation

This requires the values to fall within a suitable index range.

---

# 7. Approach 5 — Floyd's Cycle Detection ⭐

This is the **most important technique to learn from this problem**.

Classic problem:

> Find the duplicate in an array of `n + 1` integers where every value is in `[1, n]`, without modifying the array and using $O(1)$ space.

Example:

```text
[1, 3, 4, 2, 2]
```

The surprising trick is:

> **Treat the array as a linked list.**

---

## The Array Becomes a Functional Graph

Interpret:

```python
nums[i]
```

as:

```text
next node = nums[i]
```

For:

```text
nums = [1, 3, 4, 2, 2]
```

we get:

```text
0 → 1 → 3 → 2 → 4
        ↑       |
        └───────┘
```

There is a cycle.

And crucially:

> **The entrance to the cycle is the duplicate value.**

---

## Why Must There Be a Cycle?

There are:

```text
n + 1 indices
```

but only:

```text
n possible values
```

Each value points to another valid index.

By the **Pigeonhole Principle**, some value must be used more than once.

That repeated value creates the cycle structure.

This is the key conceptual transformation:

$$
\boxed{\text{Duplicate in array} \rightarrow \text{Cycle in functional graph}}
$$

---

# 8. Floyd's Two Phases

## Phase 1 — Find a Meeting Point

Use:

```python
slow = nums[slow]
fast = nums[nums[fast]]
```

```python
slow = fast = 0

while True:
    slow = nums[slow]
    fast = nums[nums[fast]]

    if slow == fast:
        break
```

Eventually they meet inside the cycle.

### Why?

Inside a cycle:

* `slow` moves 1 step
* `fast` moves 2 steps

The relative distance changes by 1 each iteration, so they must eventually meet.

---

## Phase 2 — Find Cycle Entrance

Reset one pointer:

```python
slow = 0
```

Then move both one step at a time:

```python
while slow != fast:
    slow = nums[slow]
    fast = nums[fast]

return slow
```

The meeting point is not necessarily the cycle entrance.

The second phase finds the **cycle entrance**, which is the duplicate.

---

# 9. Complete Floyd Solution

```python
def findDuplicate(nums):
    slow = fast = 0

    # Phase 1: Find meeting point inside cycle
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]

        if slow == fast:
            break

    # Phase 2: Find cycle entrance
    slow = 0

    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]

    return slow
```

### Complexity

* Time: $O(n)$
* Auxiliary Space: $O(1)$
* Input remains unchanged.

This is the **canonical optimal solution** for the classic constrained duplicate problem.

---

# 10. Why Does Phase 2 Work?

Let:

* $a$ = distance from starting point to cycle entrance
* $b$ = distance from entrance to meeting point
* $L$ = cycle length

At the meeting point:

$$
2(a+b)=a+b+kL
$$

Therefore:

$$
a+b=kL
$$

so:

$$
a=kL-b
$$

Meaning:

> The distance from the meeting point to the cycle entrance equals the distance from the starting point to the cycle entrance, modulo the cycle length.

Therefore, moving both pointers one step at a time makes them meet exactly at the cycle entrance.

You don't need to reproduce this derivation in every interview, but understanding it once is valuable.

---

# 11. The Bigger Lesson: Arrays Can Behave Like Linked Lists

This is one of the most reusable ideas here.

Whenever you see:

```python
next = nums[current]
```

you potentially have a **functional graph**:

```text
each node → exactly one next node
```

That immediately brings in:

* Floyd's Cycle Detection
* fast/slow pointers
* cycle entrance
* cycle length
* repeated state detection

This is why the technique appears in seemingly unrelated problems.

---

# 12. Another Major Variation — Binary Search on Value

There is another extremely important solution for the classic duplicate problem.

Instead of searching indices, binary-search the **value range**.

Suppose:

```text
nums has n+1 elements
values ∈ [1,n]
```

For candidate value `mid`, count:

> How many numbers are `<= mid`?

If:

$$
count > mid
$$

then by the pigeonhole principle, a duplicate must exist in:

```text
[1, mid]
```

Otherwise it must be in:

```text
[mid+1, n]
```

This is **Binary Search on Answer**, but with a **counting predicate**.

---

## Example

```text
nums = [1, 3, 4, 2, 2]
```

Suppose:

```text
mid = 2
```

Count values `<= 2`:

```text
1, 2, 2
```

Count = `3`.

But there are only `2` distinct possible values:

```text
1, 2
```

Since:

$$
3 > 2
$$

there must be a duplicate in `[1,2]`.

---

## Code

```python
def findDuplicate(nums):
    low = 1
    high = len(nums) - 1

    while low < high:
        mid = low + (high - low) // 2

        count = sum(x <= mid for x in nums)

        if count > mid:
            high = mid
        else:
            low = mid + 1

    return low
```

### Complexity

* Time: $O(n\log n)$
* Auxiliary Space: $O(1)$

This is slower than Floyd's $O(n)$ solution, but teaches an **extremely important pattern**:

```text
Binary Search on VALUE
        +
Counting
        +
Pigeonhole Principle
```

---

# 13. This Connects Directly to Your Binary Search Learning

You've now seen this pattern in:

### K-th Smallest Multiplication Table

```text
candidate X
    ↓
count(values <= X)
    ↓
count >= K?
    ↓
FIRST TRUE
```

### K-th Smallest Pair Distance

```text
candidate distance X
    ↓
count(pairs with distance <= X)
    ↓
count >= K?
    ↓
FIRST TRUE
```

### Repeating Element

```text
candidate value X
    ↓
count(values <= X)
    ↓
count > X?
    ↓
duplicate is in left half
```

So **duplicate detection is another place where binary search on the value domain appears**.

---

# 14. XOR — Useful, But Only Under Specific Constraints

Sometimes you can use XOR.

If every number appears exactly twice except one number appearing once:

```text
[4, 1, 2, 1, 2]
```

then:

```python
4 ^ 1 ^ 2 ^ 1 ^ 2
```

leaves:

```text
4
```

because:

$$
x\oplus x=0
$$

However, **this is NOT a general duplicate-finding technique**.

For:

```text
[1, 3, 4, 2, 2]
```

there isn't a corresponding cancellation structure that lets XOR reliably find `2`.

### Rule

> Use XOR when the occurrence pattern guarantees pairwise cancellation—not simply because the problem involves duplicates.

---

# 15. Important Variations to Recognize

| Situation                                               | Technique                                     |
| ------------------------------------------------------- | --------------------------------------------- |
| Extra space allowed                                     | Hash Set                                      |
| Need frequencies                                        | Hash Map / Frequency Array                    |
| Input can be modified                                   | In-place marking                              |
| Values are paired except one                            | XOR                                           |
| `n+1` values in `[1,n]`, one duplicate, no modification | **Floyd**                                     |
| Same constrained problem but want value-domain search   | **Binary Search + Counting**                  |
| Multiple duplicates / arbitrary values                  | Hashing / sorting / problem-specific approach |

---

# 16. A More General "Visited State" Pattern

The in-place marking solution and Floyd's solution reveal two different ways of detecting repetition.

### Explicitly remember visited states

```text
Hash Set
    ↓
Have I seen this before?
```

### Encode visited state in the structure

```text
Negative marking
    ↓
Have I visited this index?
```

### Detect repeated state without storing history

```text
Floyd
    ↓
Repeated state → cycle
```

This broader idea appears in:

* linked-list cycle detection
* repeated transformations
* random-state simulations
* functional graphs
* duplicate detection
* state-space problems

---

# Common Mistakes / Quirks

### 1. Don't blindly use Floyd

Floyd requires the special structure:

```text
n + 1 elements
values in [1, n]
```

and the mapping:

```text
i → nums[i]
```

must produce the required functional graph.

---

### 2. Cycle ≠ duplicate index

The duplicate is the **cycle entrance/value**, not necessarily the location where the duplicate occurs in the array.

---

### 3. Floyd's first meeting point is NOT the answer

You need the second phase.

```text
Phase 1 → find a point inside cycle
Phase 2 → find cycle entrance
```

---

### 4. Binary-search counting condition is different

For the duplicate problem:

```python
if count > mid:
```

not:

```python
if count >= mid:
```

Why?

There are exactly `mid` possible distinct values in `[1, mid]`.

If more than `mid` elements fall there, duplication is guaranteed.

---

### 5. XOR is constraint-dependent

Don't use XOR merely because you see repeated numbers.

---

# Practical Interview Decision Tree

When asked **"Find the duplicate"**, think:

```text
                 Duplicate?
                     │
          ┌──────────┴──────────┐
          │                     │
    Extra space OK?       O(1) space required?
          │                     │
       Hash Set          ┌──────┴──────┐
                         │             │
                  Special n+1/[1,n]   No special structure
                         │             │
                       Floyd       In-place / sorting /
                                   problem-specific
```

And if you notice:

```text
n+1 elements
values 1..n
one duplicate
O(1) space
```

your immediate thought should be:

> **Floyd's Cycle Detection.**

---

# Pattern Recognition

The most important takeaway isn't just **"use Floyd for duplicate."**

Learn to recognize these transformations:

### Pattern 1 — Duplicate → Cycle

```text
array
  ↓
nums[i] as next pointer
  ↓
functional graph
  ↓
cycle
  ↓
cycle entrance = duplicate
```

### Pattern 2 — Duplicate → Pigeonhole → Binary Search

```text
value range
    ↓
guess X
    ↓
count values <= X
    ↓
count > X?
    ↓
duplicate lies in left/right value range
```

### Pattern 3 — Repeated State

```text
state → next state
       ↓
eventually repeats
       ↓
cycle detection
```

> **Mental hook:**
> **When an array gives you a restricted value range and each value can act as a "next index", stop thinking of it purely as an array. Ask whether you've secretly been given a linked list / functional graph.**

---

## Key Takeaways

1. **Hash Set** is the simplest general duplicate detector.
2. **Floyd** is the key $O(n)$ time / $O(1)$ space technique for the classic `n+1` / `[1,n]` duplicate problem.
3. **Floyd Phase 1** finds a meeting point; **Phase 2** finds the cycle entrance.
4. **Binary Search + Counting** can also exploit the pigeonhole principle.
5. **In-place marking** is useful when modifying the array is allowed.
6. **XOR** only works when the occurrence pattern supports cancellation.
7. The deepest reusable idea is:

$$
\boxed{\text{Repeated state} \rightarrow \text{cycle detection}}
$$

and, in another direction:

$$
\boxed{\text{Restricted value range} + \text{counting} \rightarrow \text{possible value-domain binary search}}
$$
