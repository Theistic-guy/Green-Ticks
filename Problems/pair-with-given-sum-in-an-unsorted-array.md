---
Title: Pair With Given Sum in an Unsorted Array
Companies:
  - Not Specified
Topics:
  - Arrays
  - Hashing
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Pair With Given Sum in an Unsorted Array

**Pattern:**  hashing

**Idea:** 

**Variations** : 

---

## 💻 Code

+ Don't insert beforehand if there is a pair i, j then check at i would fail and i would get inserted but would be found at `j`
+ For returning, the position pair , use dictionary see approach 2

```Python
def has_pair_with_sum(arr, target):
    seen = set()

    for num in arr:
        complement = target - num

        # If the required complement was seen earlier,
        # we have found two distinct elements whose sum is target.
        if complement in seen:
            return True

        seen.add(num)

    return False
```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---

# Pair With Given Sum in an Unsorted Array

Tags: #Array #Hash-Map #Hashing #Two-Sum #Complement #Two-Pointers #Sorting #Brute-Force #LC1 #LeetCode #FAANG

## Problem Statement

Given an **unsorted array** `arr` and a target sum `target`, determine whether there exists a pair of elements whose sum equals `target`.

Formally, find indices $i$ and $j$ such that:

i≠j

and

arr[i]+arr[j]=targetarr[i] + arr[j] = target

### Example

```text
arr = [2, 7, 11, 15]
target = 9
```

The pair is:

```text
2 + 7 = 9
```

So the answer is `True`.

For **LeetCode 1 — Two Sum**, the usual requirement is to return the **indices**:

```text
[0, 1]
```

---

## Key Idea

For every element `x`, the value we need is its **complement**:

complement=target−xcomplement = target - x

So instead of asking:

> "Which other element should I try with `x`?"

ask:

> "Have I already seen `target - x`?"

For an unsorted array, a **hash set / hash map** lets us answer that question in expected $O(1)$ time.

This converts the pair-search problem from:

O(n2)O(n^2)

to:

O(n)O(n)

expected time.

---

# Approach 1 — Hash Set (Existence Only)

If the problem only asks:

> Does any pair sum to `target`?

we do not need indices or frequencies. A set is enough.

## Intuition

Suppose:

```text
arr = [2, 7, 11, 15]
target = 9
```

Process `2`:

9−2=79 - 2 = 7

`7` has not appeared yet.

Store `2`.

Now process `7`:

9−7=29 - 7 = 2

`2` is already in the set.

Therefore, a valid pair exists.

### Python Solution

```python
def has_pair_with_sum(arr, target):
    seen = set()

    for num in arr:
        complement = target - num

        # If the required complement was seen earlier,
        # we have found two distinct elements whose sum is target.
        if complement in seen:
            return True

        seen.add(num)

    return False
```

### Complexity

For an array of size $n$:

**Time Complexity**

Each element is processed once, with expected $O(1)$ hash lookup:

O(n)O(n)

**Auxiliary Space**

The set can contain up to $n$ distinct elements:

O(n)O(n)

**Output Space**

$O(1)$ because we return only a boolean.

---

# Approach 2 — Hash Map (Return the Pair Indices)

For **Two Sum / LC 1**, we usually need the indices, so store:

```text
value → index
```

## Key Idea

While scanning index `i`:

```python
complement = target - nums[i]
```

If the complement is already in the map, then:

```text
previous index + current index
```

is the answer.

---

## Python Solution

```python
def twoSum(nums, target):
    # Maps each previously seen value to its index.
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        # The complement appeared earlier, so we found
        # the required pair.
        if complement in seen:
            return [seen[complement], i]

        # Store the current value only after checking for
        # the complement. This prevents using the same
        # element twice.
        seen[num] = i

    return []
```

---

## Why Check Before Inserting?

This is an important detail.

Consider:

```text
nums = [3]
target = 6
```

The complement of `3` is also `3`.

If we inserted `3` before checking:

```python
seen[3] = 0
```

then we might incorrectly conclude that `3 + 3 = 6` using the **same element twice**.

Instead:

```python
if complement in seen:
    ...
seen[num] = i
```

ensures that the complement must come from an **earlier element**.

---

## Dry Run

```text
nums = [2, 7, 11, 15]
target = 9
```

### `i = 0`

```text
num = 2
complement = 9 - 2 = 7
```

`7` not in `seen`.

Store:

```text
seen = {2: 0}
```

### `i = 1`

```text
num = 7
complement = 9 - 7 = 2
```

`2` is in `seen`:

```text
seen[2] = 0
```

Return:

```text
[0, 1]
```

---

## Complexity

**Time Complexity**

Expected:

O(n)O(n)

because every element performs an expected $O(1)$ hash lookup and insertion.

**Auxiliary Space**

At most $n$ values are stored:

O(n)O(n)

**Output Space**

The returned pair contains two indices:

O(1)O(1)

---

# Approach 3 — Sort + Two Pointers

This is another important approach, especially when you want to demonstrate the connection between **unsorted-array pair sum** and the **two-pointer pattern**.

## Key Idea

Two pointers work naturally on a **sorted** array:

```text
left  → smallest
right → largest
```

At each step:

- If sum is too small → increase `left`
    
- If sum is too large → decrease `right`
    
- If sum equals target → pair found
    

For example:

```text
arr = [2, 7, 11, 15]
target = 9
```

```text
2 + 15 = 17 > 9
```

Move `right`.

```text
2 + 11 = 13 > 9
```

Move `right`.

```text
2 + 7 = 9
```

Found.

---

## Python Solution — Existence Only

```python
def has_pair_with_sum(arr, target):
    nums = sorted(arr)

    left = 0
    right = len(nums) - 1

    while left < right:
        total = nums[left] + nums[right]

        if total < target:
            left += 1

        elif total > target:
            right -= 1

        else:
            return True

    return False
```

### Complexity

**Time Complexity**

Sorting:

O(nlog⁡n)O(n \log n)

Two-pointer scan:

O(n)O(n)

Overall:

O(nlog⁡n)O(n \log n)

**Auxiliary Space**

Using `sorted(arr)` creates a new sorted list:

O(n)O(n)

**Output Space**

O(1)O(1)

---

## What if We Need Original Indices?

Sorting destroys the original index positions unless we keep them.

Store:

```python
(value, original_index)
```

and sort by value.

```python
def twoSum(nums, target):
    items = sorted((num, i) for i, num in enumerate(nums))

    left = 0
    right = len(items) - 1

    while left < right:
        total = items[left][0] + items[right][0]

        if total < target:
            left += 1

        elif total > target:
            right -= 1

        else:
            return [items[left][1], items[right][1]]

    return []
```

### Complexity

**Time Complexity**

O(nlog⁡n)O(n \log n)

**Auxiliary Space**

The list of `(value, index)` pairs requires:

O(n)O(n)

**Output Space**

O(1)O(1)

---

# Approach 4 — Brute Force

Try every pair:

```python
def has_pair_with_sum(arr, target):
    n = len(arr)

    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] + arr[j] == target:
                return True

    return False
```

This is useful mainly as the baseline.

### Complexity

**Time Complexity**

There are approximately:

n(n−1)2\frac{n(n-1)}{2}

pairs, so:

O(n2)O(n^2)

**Auxiliary Space**

O(1)O(1)

**Output Space**

O(1)O(1)

---

# Comparing the Approaches

|Approach|Time|Auxiliary Space|Best Use|
|---|--:|--:|---|
|Brute Force|$O(n^2)$|$O(1)$|Baseline|
|Hash Set|**$O(n)$ expected**|$O(n)$|Only need existence|
|Hash Map|**$O(n)$ expected**|$O(n)$|Need original indices|
|Sort + Two Pointers|$O(n\log n)$|$O(n)$ with `sorted()`|When sorting is acceptable / reusable|

---

# Important Variation — Count Pairs With Given Sum

If the problem asks:

> How many index pairs have sum equal to `target`?

we cannot simply use a set because duplicates matter.

Use a frequency map.

## Python Solution

```python
from collections import defaultdict


def count_pairs(arr, target):
    freq = defaultdict(int)
    count = 0

    for num in arr:
        complement = target - num

        # Every previously seen complement forms a valid pair
        # with the current element.
        count += freq[complement]

        # Add current value for future pairs.
        freq[num] += 1

    return count
```

### Example

```text
arr = [1, 5, 7, -1, 5]
target = 6
```

Valid index pairs are:

```text
1 + 5
1 + 5
7 + (-1)
```

So:

```text
count = 3
```

### Complexity

**Time Complexity**

O(n)O(n)

expected.

**Auxiliary Space**

O(n)O(n)

for the frequency map.

**Output Space**

O(1)O(1)

---

# Important Variation — Return All Unique Pairs

Suppose:

```text
arr = [1, 5, 7, -1, 5]
target = 6
```

and the required answer is:

```text
[(1, 5), (-1, 7)]
```

where duplicate value-pairs should appear only once.

There are multiple ways to solve this depending on whether the original indices matter.

A common solution is:

1. Sort the array.
    
2. Use two pointers.
    
3. Skip duplicates after finding a pair.
    

This combines the **two-pointer + duplicate-skipping** pattern you already used for sorted-array intersection/union.

---

# Important Variation — 3Sum

The same problem generalizes naturally.

### Two Sum

a+b=targeta+b=target

### 3Sum

a+b+c=targeta+b+c=target

A standard solution is:

1. Sort the array.
    
2. Fix one element.
    
3. Solve the remaining **Two Sum** problem with two pointers.
    

This produces the familiar:

O(n2)O(n^2)

3Sum approach.

So Two Sum is one of the foundational patterns behind a large family of k-sum problems.

---

# Common Mistakes / Quirks

## Mistake 1 — Using Two Pointers Directly on an Unsorted Array

This is invalid:

```python
left = 0
right = len(arr) - 1
```

followed by comparing the sum, unless the array is sorted.

The two-pointer proof depends on knowing that:

```text
left  → smaller values
right → larger values
```

---

## Mistake 2 — Using the Same Element Twice

For:

```text
arr = [3]
target = 6
```

there is **no valid pair**.

There must be two different indices.

The hash-map approach avoids this by checking the complement **before** inserting the current element.

---

## Mistake 3 — Using a Set When the Problem Asks for Indices

A set can tell you:

```text
"Does a complement exist?"
```

but not which index it came from.

Use:

```text
value → index
```

with a hash map when indices are required.

---

## Mistake 4 — Using a Set When Counting Pairs

For:

```text
arr = [5, 5]
target = 10
```

there is one valid **index pair**.

A set loses frequency information.

Use a frequency map when the problem asks for the number of pairs.

---

## Mistake 5 — Sorting and Losing Original Indices

For **Two Sum**, the expected output is usually original indices.

If sorting is used, store:

```python
(value, original_index)
```

before sorting.

---

# Pythonic Way

For pure existence checking:

```python
def has_pair_with_sum(arr, target):
    seen = set()

    for x in arr:
        if target - x in seen:
            return True
        seen.add(x)

    return False
```

For LeetCode 1:

```python
def twoSum(nums, target):
    seen = {}

    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i

    return []
```

`enumerate()` is preferable to manually managing the index.

---

# Key Takeaways / Pattern Recognition

## The Core Pattern

When you see:

> **Pair + target sum + unsorted array**

think:

```text
For every x:
    complement = target - x
```

Then ask:

```text
Can I store previously seen values?
```

For an unsorted array:

Hash Map / Hash Set\boxed{\text{Hash Map / Hash Set}}

is usually the first solution to consider.

---

## Pattern Mapping

|Problem Requirement|Preferred Pattern|
|---|---|
|Does a pair exist?|Hash Set|
|Return pair indices|Hash Map|
|Count all index pairs|Frequency Map|
|Array already sorted|Two Pointers|
|Unsorted but sorting is acceptable|Sort + Two Pointers|
|3Sum|Sort + Fix One + Two Pointers|

---

## The Deeper Insight

The hash-map solution is not really about "Two Sum" specifically.

It is an instance of a broader pattern:

> **Convert a pair-search problem into a one-pass lookup by storing information about the past.**

Instead of searching for:

x+y=targetx+y=target

rearrange it:

y=target−xy=target-x

and turn the second half of the pair into a hash lookup.

This **complement transformation** is a highly reusable interview technique.

> **Memory hook:**  
> **Unsorted Pair Sum → `complement = target - x` → lookup in Hash Map/Set.**  
> **Sorted Pair Sum → Two Pointers.**