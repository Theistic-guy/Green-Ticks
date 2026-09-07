---
Title: Elements Occurring More Than n/k Times
Companies:
  - Not Specified
Topics:
  - Arrays
  - Hashing
  - Sorting
  - Greedy
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Boyer-Moore Voting
Link: ""
Rating:
  - ⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Elements Occurring More Than n/k Times

**Pattern:** 

**Idea:** 

**Variations** : 
+ [majority-element](majority-element.md)

---

## 💻 Code

Generalized Boyer-moore below. Though, hashing based simpler solutions exist but they compromise on the space O(n).
```Python
from collections import defaultdict

def moreThanNbyK(arr, k):
    candidates = {}

    # Pass 1: Candidate Selection
    for num in arr:

        if num in candidates:
            candidates[num] += 1

        elif len(candidates) < k - 1:
            candidates[num] = 1

        else:
            remove = []

            for x in list(candidates):
                candidates[x] -= 1
                if candidates[x] == 0:
                    remove.append(x)

            for x in remove:
                del candidates[x]

    # Pass 2: Verification
    freq = defaultdict(int)

    for num in arr:
        if num in candidates:
            freq[num] += 1

    limit = len(arr) // k

    return [x for x in freq if freq[x] > limit]

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(k)

---

# Elements Occurring More Than n/k Times

**Tags:** #Arrays #HashMap #BoyerMoore #MisraGries #MajorityElement #Sorting #Greedy #Interview-Pattern 

## Problem Statement

Given an array of size `n` and an integer `k`, find **all elements** that occur **more than ⌊n/k⌋ times**.

> There can be **at most `k−1` such elements**.

**Example**

- `arr = [3,1,2,2,1,2,3,3]`
    
- `k = 4`
    
- Threshold = `⌊8/4⌋ = 2`
    
- **Answer:** `[2, 3]`
    

---

## Why At Most `k−1` Elements?

Assume there are `k` different elements occurring more than `n/k` times.

Then total frequency would be:

Since each occurs **more than** `n/k`, the total exceeds `n`, which is impossible.

**Therefore, maximum possible answers = `k−1`.**

This fact is the foundation of the optimal algorithm.

---

## Approach 1 — Brute Force

For every distinct element, count its frequency by scanning the entire array.

### Python

```python
def moreThanNbyK(arr, k):
    n = len(arr)
    ans = []

    for x in set(arr):
        if arr.count(x) > n // k:
            ans.append(x)

    return ans
```

### Complexity

|Time|Auxiliary Space|
|---|---|
|**O(n²)**|**O(1)** (excluding output)|

> Useful only for understanding; never an interview choice.

---

## Approach 2 — Sorting

After sorting, equal elements become consecutive.

### Idea

1. Sort the array.
    
2. Count consecutive duplicates.
    
3. Add elements whose count exceeds `n/k`.
    

### Python

```python
def moreThanNbyK(arr, k):
    arr.sort()
    n = len(arr)
    ans = []

    count = 1

    for i in range(1, n):
        if arr[i] == arr[i - 1]:
            count += 1
        else:
            if count > n // k:
                ans.append(arr[i - 1])
            count = 1

    if count > n // k:
        ans.append(arr[-1])

    return ans
```

### Complexity

|Time|Auxiliary Space|
|---|---|
|**O(n log n)**|**O(1)** (ignoring sort stack)|

A solid approach when linear time isn't required.

---

## Approach 3 — HashMap (Most Practical)

Store frequencies using a hashmap.

### Idea

- Count every element.
    
- Return keys whose frequency exceeds `n/k`.
    

### Python

```python
from collections import Counter

def moreThanNbyK(arr, k):
    freq = Counter(arr)
    limit = len(arr) // k

    return [x for x, c in freq.items() if c > limit]
```

### Complexity

|Time|Auxiliary Space|
|---|---|
|**O(n)**|**O(n)**|

This is usually the preferred solution unless the interviewer explicitly asks for constant extra space.

---

# Approach 4 — Boyer-Moore Generalization (Misra–Gries)

> **Optimal:** `O(n)` time and `O(k)` auxiliary space.

## Key Idea

For `n/2`, Boyer-Moore keeps **1 candidate**.

For `n/3`, it keeps **2 candidates**.

For general `n/k`, we keep **`k−1` candidates**.

The algorithm has **two passes**:

1. Candidate selection
    
2. Verification
    

---

## Intuition (Cancellation Principle)

Imagine repeatedly removing **`k` distinct elements** together.

Example (`k = 4`):

```text
1 2 3 4
↓ remove together

Remaining elements keep their relative frequencies.
```

An element occurring more than `n/k` times **cannot be completely eliminated** through these cancellations.

So after all cancellations, every valid answer must survive as one of the candidates.

The first pass **does not guarantee correctness**—it only guarantees that every true answer survives.

---

## Candidate Selection Algorithm

Maintain a hashmap of at most `k−1` candidates.

For each number:

- Already a candidate → increment count
    
- Empty slot available → insert with count 1
    
- Otherwise → decrement every candidate by 1
    
- Remove candidates whose count becomes 0
    

### First Pass

```python
def candidate_pass(arr, k):
    candidates = {}

    for num in arr:

        if num in candidates:
            candidates[num] += 1

        elif len(candidates) < k - 1:
            candidates[num] = 1

        else:
            remove = []

            for x in candidates:
                candidates[x] -= 1
                if candidates[x] == 0:
                    remove.append(x)

            for x in remove:
                del candidates[x]

    return candidates
```

---

## Why Verification Is Necessary

Example:

```text
arr = [1,2,3,4,5]
k = 3
```

First pass may leave:

```text
{5}
```

But frequency of `5` is only `1`.

Threshold:

Need **more than 1**, so answer is empty.

Hence a second pass is mandatory.

---

## Complete Python Solution

```python
from collections import defaultdict

def moreThanNbyK(arr, k):
    candidates = {}

    # Pass 1: Candidate Selection
    for num in arr:

        if num in candidates:
            candidates[num] += 1

        elif len(candidates) < k - 1:
            candidates[num] = 1

        else:
            remove = []

            for x in list(candidates):
                candidates[x] -= 1
                if candidates[x] == 0:
                    remove.append(x)

            for x in remove:
                del candidates[x]

    # Pass 2: Verification
    freq = defaultdict(int)

    for num in arr:
        if num in candidates:
            freq[num] += 1

    limit = len(arr) // k

    return [x for x in freq if freq[x] > limit]
```

---

## Dry Run (`k = 3`)

**Array**

```text
[1,2,3,1,2,1,1]
```

Maximum candidates = **2**

|Element|Candidates|
|---|---|
|1|{1:1}|
|2|{1:1,2:1}|
|3|decrement both → {}|
|1|{1:1}|
|2|{1:1,2:1}|
|1|{1:2,2:1}|
|1|{1:3,2:1}|

Verification:

|Element|Frequency|
|---|--:|
|1|4|
|2|2|

Threshold = `⌊7/3⌋ = 2`

Answer = `[1]`

---

## Complexity Comparison

|Approach|Time|Auxiliary Space|
|---|--:|--:|
|Brute Force|O(n²)|O(1)|
|Sorting|O(n log n)|O(1)|
|HashMap|**O(n)**|**O(n)**|
|Misra–Gries|**O(n)**|**O(k)**|

---

## When to Use Which?

|Constraint|Best Choice|
|---|---|
|General interview|HashMap|
|Need constant/small extra space|Misra–Gries|
|Array can be modified|Sorting|
|Teaching intuition|Brute Force|

---

## Relationship with Majority Element

|Problem|Candidates Kept|
|---|--:|
|More than `n/2`|1|
|More than `n/3`|2|
|More than `n/k`|`k−1`|

The famous **Boyer-Moore Majority Vote** is simply the special case where `k = 2`.

Misra–Gries is its generalized version.

---

## Common Mistakes

- Forgetting the **verification pass** after candidate selection.
    
- Using `>= n/k` instead of **`> n/k`**.
    
- Not deleting candidates whose count becomes zero.
    
- Assuming there can be `k` valid answers (maximum is `k−1`).
    

---

## Key Takeaways / Pattern Recognition

- The mathematical bound (**at most `k−1` answers**) is the key observation.
    
- **HashMap** is the simplest optimal-time solution.
    
- **Misra–Gries** achieves the same linear time using only **O(k)** extra space.
    
- Remember the progression:
    
    - `n/2` → Boyer-Moore (1 candidate)
        
    - `n/3` → 2 candidates
        
    - `n/k` → `k−1` candidates + verification