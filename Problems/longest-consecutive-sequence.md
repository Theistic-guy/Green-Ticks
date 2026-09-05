---
Title: Longest Consecutive Subsequence (Leetcode 128)
Companies:
  - Not Specified
Topics:
  - Arrays
  - Hashing
  - Greedy
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
  - GFG
  - Subsequence
  - Longest
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Longest Consecutive Subsequence (Leetcode 128)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def longestConsecutive(nums):
    seen = set(nums)
    longest = 0

    for num in seen:

        # Start only from the beginning
        if num - 1 not in seen:
            current = num
            length = 1

            while current + 1 in seen:
                current += 1
                length += 1

            longest = max(longest, length)

    return longest

```
**Time complexity** - O(n) 

**Aux. Space complexity** -  O(n)

---

# Longest Consecutive Subsequence (Leetcode 128)

**Tags:** #Arrays #HashSet #Greedy #Sequence #UnorderedSet #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given an unsorted integer array `nums`, return the **length of the longest consecutive sequence**.

A consecutive sequence consists of numbers that differ by exactly `1`, and the elements **do not need to be adjacent** in the original array.

**Example**

- Input: `[100,4,200,1,3,2]`
    
- Output: `4`
    
- Sequence: `[1,2,3,4]`
    

---

## Key Idea

Use a **HashSet** for O(1) lookup and only start counting from the **beginning of a sequence**.

A number `x` is the start of a sequence **only if `x - 1` does not exist**.

This prevents repeatedly traversing the same sequence.

---

## Intuition (The WHY)

Consider:

```text
100  4  200  1  3  2
```

HashSet:

```text
{1,2,3,4,100,200}
```

If we started expanding from every number:

- `1` → length 4
    
- `2` → length 3
    
- `3` → length 2
    
- `4` → length 1
    

The same sequence is explored multiple times.

Instead, only start when there is **no predecessor**:

```python
if num - 1 not in seen:
```

Only `1`, `100`, and `200` qualify.

This makes every element part of **exactly one traversal**.

---

## Optimal Approach — HashSet

### Algorithm

1. Insert all numbers into a HashSet.
    
2. For each number:
    
    - Skip it if `num - 1` exists.
        
    - Otherwise, extend the sequence while `current + 1` exists.
        
3. Track the maximum length.
    

### Python Solution

```python
def longestConsecutive(nums):
    seen = set(nums)
    longest = 0

    for num in seen:

        # Start only from the beginning
        if num - 1 not in seen:
            current = num
            length = 1

            while current + 1 in seen:
                current += 1
                length += 1

            longest = max(longest, length)

    return longest
```

---

## Dry Run

**nums = [100,4,200,1,3,2]**

HashSet:

```text
{1,2,3,4,100,200}
```

|Number|Start?|Sequence|Length|
|---|---|---|--:|
|1|Yes|1→2→3→4|4|
|2|No|—|—|
|3|No|—|—|
|4|No|—|—|
|100|Yes|100|1|
|200|Yes|200|1|

**Answer = 4**

---

## Why Is It O(n)?

At first glance, the nested `while` suggests O(n²).

The trick is that every element is visited **at most once** during sequence expansion.

Example:

```text
1 → 2 → 3 → 4 → 5
```

Only `1` starts the traversal.

`2`, `3`, `4`, and `5` are skipped by the outer loop because they have predecessors.

Total work:

- HashSet construction → `O(n)`
    
- Each element expanded once → `O(n)`
    

Overall:

**O(n)**

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

Space is due to the HashSet.

---

## Important Variations

- **LC 128** — Longest Consecutive Sequence _(this problem)_
    
- **Longest Consecutive Sequence in a Stream** → Union-Find / interval merging
    
- **Count Consecutive Groups** → Same "start of sequence" idea without tracking the maximum
    

---

## Common Mistakes

### 1. Starting from every element

Incorrect:

```python
for num in nums:
    while num + 1 in seen:
        ...
```

This revisits the same sequence repeatedly.

### 2. Forgetting duplicates

Using the original array may process duplicates multiple times.

Always build:

```python
seen = set(nums)
```

### 3. Sorting unnecessarily

Sorting works, but costs:

- Time: **O(n log n)**
    
- Space: depends on implementation
    

The interview-optimal solution is the HashSet approach.

---

## Pythonic Way

Iterate directly over the set:

```python
seen = set(nums)

for num in seen:
    ...
```

This automatically removes duplicates and avoids redundant work.

---

## Key Takeaways / Pattern Recognition

- **Unsorted + O(n) + membership lookup** → Think **HashSet**.
    
- The crucial optimization is identifying the **start of a sequence** using `num - 1`.
    
- This is a greedy expansion pattern: each sequence is explored exactly once.
    
- Whenever a problem asks for consecutive values **regardless of original order**, sorting is the obvious solution—but HashSet is usually the optimal interview solution.