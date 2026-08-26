---
Title: Count Inversions in Array
Companies:
  - Not Specified
Topics:
  - Arrays
  - Sorting
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - Merge
  - GFG
Link: ""
Rating:
  - ⭐⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Count Inversions in Array

**Pattern:**  merge function of merge sort variation

**Idea:** 

**Variations** : 
+ [union-of-two-sorted-arrays](union-of-two-sorted-arrays.md)
+ [intersection-of-two-sorted-arrays](intersection-of-two-sorted-arrays.md)


---

## 💻 Code

```Python
def count_inversions(arr):
    """Main wrapper function"""
    def danq(arr, low, high):
        if low >= high:
            return 0
        
        mid = (low + high) // 2
        count = 0
        
        # Count inversions in left half
        count += danq(arr, low, mid)
        # Count inversions in right half
        count += danq(arr, mid + 1, high)
        # Count split inversions (merge step)
        count += merge_and_count(arr, low, mid, high)
        
        return count
    
    n = len(arr)
    if n == 0:
        return 0
    
    return danq(arr, 0, n - 1)


def merge_and_count(arr, low, mid, high):
    """
    Merge two sorted subarrays and count inversions.
    Key insight: When left[i] > right[j], all elements from i to mid 
    in left subarray are also > right[j].
    """
    left = arr[low:mid+1]
    right = arr[mid+1:high+1]
    
    i = j = 0
    k = low
    inversion_count = 0
    
    # Two-pointer merge
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            arr[k] = left[i]
            i += 1
        elif left[i] > right[j]:
            # ⭐ CRITICAL: All remaining elements in left (from i onwards) 
            # form inversions with right[j]
            arr[k] = right[j]
            j += 1
            inversion_count += len(left) - i  # NOT (mid - i + 1)
        else:  # left[i] == right[j]
            arr[k] = left[i]
            i += 1
            j += 1
        k += 1
    
    # Exhaust remaining elements
    while i < len(left):
        arr[k] = left[i]
        i += 1
        k += 1
    
    while j < len(right):
        arr[k] = right[j]
        j += 1
        k += 1
    
    return inversion_count


# Test
arr = [2, 4, 1, 12, 9, 3]
print(count_inversions(arr))  # Output: 6

```
**Time complexity** - O(n log n )

**Aux. Space complexity** -  O(n)

---
# Count Inversions in Array

#dsa #merge-sort #interview-patterns #arrays

---

## 📝 Problem Statement

Given an array of integers, count the number of **inversions**. An inversion is a pair of indices `(i, j)` where `i < j` but `arr[i] > arr[j]`.

**Example:**

```
arr = [2, 4, 1, 12, 9, 3]
Inversions: (2,1), (4,1), (4,3), (12,9), (12,3), (9,3) = 6 inversions
```

---

## 🎯 Core Insight

This is fundamentally a **modified merge sort** problem. The inversion count represents how "unsorted" an array is — a fully sorted array has 0 inversions, while a reverse-sorted array has the maximum: `n*(n-1)/2`.

**Key Realization:** When merging two sorted subarrays, if an element from the **right** subarray is smaller than an element from the **left** subarray, ALL remaining elements in the left subarray form inversions with this right element.

```
Left:  [2, 4, 1]
Right: [12, 9, 3]

When we pick 3 from right and see 1 > 3? No.
But 4 > 3? Yes → all elements from position of 4 onwards in left (which is [4, 1]) form inversions.
That's len(left) - i = 2 inversions.
```

---

## 💻 Solution: Merge Sort Approach

### Algorithm Overview

1. **Divide** the array into two halves
2. **Recursively** count inversions in left half
3. **Recursively** count inversions in right half
4. **Merge** while counting split inversions (elements from left half > elements from right half)

### Code

```python
def count_inversions(arr):
    """Main wrapper function"""
    def danq(arr, low, high):
        if low >= high:
            return 0
        
        mid = (low + high) // 2
        count = 0
        
        # Count inversions in left half
        count += danq(arr, low, mid)
        # Count inversions in right half
        count += danq(arr, mid + 1, high)
        # Count split inversions (merge step)
        count += merge_and_count(arr, low, mid, high)
        
        return count
    
    n = len(arr)
    if n == 0:
        return 0
    
    return danq(arr, 0, n - 1)


def merge_and_count(arr, low, mid, high):
    """
    Merge two sorted subarrays and count inversions.
    Key insight: When left[i] > right[j], all elements from i to mid 
    in left subarray are also > right[j].
    """
    left = arr[low:mid+1]
    right = arr[mid+1:high+1]
    
    i = j = 0
    k = low
    inversion_count = 0
    
    # Two-pointer merge
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            arr[k] = left[i]
            i += 1
        elif left[i] > right[j]:
            # ⭐ CRITICAL: All remaining elements in left (from i onwards) 
            # form inversions with right[j]
            arr[k] = right[j]
            j += 1
            inversion_count += len(left) - i  # NOT (mid - i + 1)
        else:  # left[i] == right[j]
            arr[k] = left[i]
            i += 1
            j += 1
        k += 1
    
    # Exhaust remaining elements
    while i < len(left):
        arr[k] = left[i]
        i += 1
        k += 1
    
    while j < len(right):
        arr[k] = right[j]
        j += 1
        k += 1
    
    return inversion_count


# Test
arr = [2, 4, 1, 12, 9, 3]
print(count_inversions(arr))  # Output: 6
```

---

## 🔍 Detailed Dry Run

**Array:** `[2, 4, 1, 12, 9, 3]`

```
                    [2, 4, 1, 12, 9, 3]
                   /                    \
              [2, 4, 1]              [12, 9, 3]
             /          \            /         \
         [2, 4]        [1]       [12, 9]      [3]
        /      \        |        /      \      |
      [2]    [4]      [1]    [12]    [9]    [3]
        \      /        |      \      /       |
         [2,4]         [1]     [9,12]        [3]
          |  0 inv      |        |  1 inv     |
          \            /         \           /
           [1, 2, 4]           [3, 9, 12]
           |  1 inv            |  0 inv
           \                   /
              [1, 2, 3, 4, 9, 12]
              |  4 inversions (split)
              
Total: 0 + 1 + 0 + 1 + 0 + 4 = 6 inversions
```

### Step-by-Step Merge Details

**Merging `[2, 4]` and `[1]`:**

```
left=[2,4], right=[1]
Compare 2 vs 1: 2 > 1 → [1] goes to result
  inversion_count += len(left) - 0 = 2
  (pairs: (2,1), (4,1))
Result: [1, 2, 4], inversions: 2
```

**Merging `[9, 12]` and `[3]`:**

```
left=[9,12], right=[3]
Compare 9 vs 3: 9 > 3 → [3] goes to result
  inversion_count += len(left) - 0 = 2
  (pairs: (9,3), (12,3))
Result: [3, 9, 12], inversions: 2
```

**Merging `[1, 2, 4]` and `[3, 9, 12]`:**

```
i=0,j=0: left[0]=1 < right[0]=3 → take 1, i=1
i=1,j=0: left[1]=2 < right[0]=3 → take 2, i=2
i=2,j=0: left[2]=4 > right[0]=3 → take 3, j=1
         inversion_count += len(left) - 2 = 1  (pair: (4,3))
i=2,j=1: left[2]=4 < right[1]=9 → take 4, i=3
Exhaust right: [9, 12]
Result: [1, 2, 3, 4, 9, 12], inversions: 1
```

**Total inversions:** 2 + 2 + 1 + ... (from recursive calls) = **6** ✓

---

## ⚠️ Common Bug: Index Confusion

**WRONG:**

```python
inversion_count += mid - i + 1  # ❌ Uses original array indices
```

**RIGHT:**

```python
inversion_count += len(left) - i  # ✅ Uses subarray size
```

**Why:** When you do `left = arr[low:mid+1]`, the indices in `left` start from 0, not from `low`. So use `len(left) - i` to count remaining elements.

---

## 📊 Complexity Analysis

|Aspect|Complexity|Notes|
|---|---|---|
|**Time**|O(n log n)|Same as merge sort: T(n) = 2T(n/2) + O(n)|
|**Space**|O(n)|Temporary arrays in merge step + recursion stack O(log n)|
|**Best Case**|O(n log n)|No optimization possible (not like quicksort)|
|**Worst Case**|O(n log n)|Reverse-sorted array: n(n-1)/2 inversions|

**Proof of Time Complexity:**

- Each element is compared once during merge: O(n) per level
- Tree has log(n) levels (divide-and-conquer)
- Total: O(n log n)

**Alternative (Brute Force):** O(n²) — compare every pair, but too slow for interviews.

---

## 🔄 Variation 1: Merge Sort Indices (Track Original Positions)

Sometimes interviewers ask: _"Return the actual inversion pairs, not just the count."_

```python
def get_inversion_pairs(arr):
    """Returns list of (index_i, index_j) pairs where i < j and arr[i] > arr[j]"""
    pairs = []
    indexed_arr = [(val, idx) for idx, val in enumerate(arr)]
    
    def merge_and_collect(arr, low, high):
        if low >= high:
            return
        
        mid = (low + high) // 2
        merge_and_collect(arr, low, mid)
        merge_and_collect(arr, mid + 1, high)
        
        left = arr[low:mid+1]
        right = arr[mid+1:high+1]
        i = j = 0
        k = low
        
        while i < len(left) and j < len(right):
            if left[i][0] <= right[j][0]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                # Collect all inversions
                for idx in range(i, len(left)):
                    pairs.append((left[idx][1], right[j][1]))
                j += 1
            k += 1
        
        # Exhaust remaining
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1
    
    merge_and_collect(indexed_arr, 0, len(indexed_arr) - 1)
    return pairs

# Test
arr = [2, 4, 1, 12, 9, 3]
pairs = get_inversion_pairs(arr)
print(pairs)  # [(0,2), (1,2), (1,5), (3,4), (3,5), (4,5)]
```

---

## 🔄 Variation 2: Count Inversions Modulo M

**Problem:** Count inversions mod 10^9+7 (common in competitive programming).

```python
MOD = 10**9 + 7

def count_inversions_mod(arr):
    def merge_and_count(arr, low, mid, high):
        left = arr[low:mid+1]
        right = arr[mid+1:high+1]
        i = j = 0
        k = low
        count = 0
        
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                arr[k] = left[i]
                i += 1
            elif left[i] > right[j]:
                arr[k] = right[j]
                j += 1
                count = (count + len(left) - i) % MOD
            else:
                arr[k] = left[i]
                i += 1
                j += 1
            k += 1
        
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1
        
        return count
    
    def danq(arr, low, high):
        if low >= high:
            return 0
        mid = (low + high) // 2
        count = danq(arr, low, mid)
        count = (count + danq(arr, mid + 1, high)) % MOD
        count = (count + merge_and_count(arr, low, mid, high)) % MOD
        return count
    
    n = len(arr)
    return danq(arr, 0, n - 1) if n > 0 else 0
```

---

## 🔄 Variation 3: Count Inversions in Sorted Order (Fenwick/BIT)

**Problem:** Count inversions using a **Balanced BST** or **Fenwick Tree** (more efficient for certain follow-ups).

This approach is useful when:

- Array has very large values (need coordinate compression)
- You need to handle updates (online inversion counting)

```python
class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)
    
    def update(self, i, delta=1):
        i += 1  # 1-indexed
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)
    
    def query(self, i):
        i += 1  # 1-indexed
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & (-i)
        return s
    
    def range_query(self, l, r):
        return self.query(r) - (self.query(l - 1) if l > 0 else 0)

def count_inversions_fenwick(arr):
    """
    Process array from right to left.
    For each element, query how many elements to the right are smaller.
    """
    sorted_arr = sorted(set(arr))
    compress = {v: i for i, v in enumerate(sorted_arr)}
    
    fenwick = FenwickTree(len(sorted_arr))
    inversions = 0
    
    for i in range(len(arr) - 1, -1, -1):
        compressed = compress[arr[i]]
        # Count elements smaller than arr[i] seen so far (to the right)
        if compressed > 0:
            inversions += fenwick.query(compressed - 1)
        fenwick.update(compressed)
    
    return inversions

# Test
arr = [2, 4, 1, 12, 9, 3]
print(count_inversions_fenwick(arr))  # Output: 6
```

**When to use:**

- Merge sort: Simple, O(n log n), preferred in interviews
- Fenwick/BIT: When coordinate compression or updates are needed

---

## 🎓 FAANG Interview Patterns

### **Pattern 1: Naive Follow-up**

> "Can you solve it without modifying the array?"

**Solution:** Use a separate result array during merge.

```python
def merge_and_count_no_modify(left, right):
    result = []
    i = j = 0
    count = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            count += len(left) - i
    
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result, count
```

### **Pattern 2: Modified Definition**

> "Now count 'near-inversions': pairs where i < j and arr[i] > arr[j] * 2."

**Insight:** Logic stays the same; only change the comparison:

```python
if left[i] > right[j] * 2:  # Modified condition
    inversion_count += len(left) - i
```

### **Pattern 3: Return Actual Pairs**

Already covered in **Variation 1** above.

### **Pattern 4: Constraints on Value Range**

> "Array has values up to 10^5. Can you optimize?"

**Answer:** Use Fenwick Tree (Variation 3) with coordinate compression. Merge sort is already optimal, but Fenwick can be faster in practice for certain distributions.

---

## 🛠️ Edge Cases & Tricky Inputs

|Case|Input|Expected|Notes|
|---|---|---|---|
|**Empty array**|`[]`|`0`|Handle in wrapper|
|**Single element**|`[1]`|`0`|Base case: low >= high|
|**Already sorted**|`[1,2,3,4]`|`0`|Best case|
|**Reverse sorted**|`[4,3,2,1]`|`6`|Max inversions: n(n-1)/2|
|**All equal**|`[5,5,5,5]`|`0`|Equality handling: don't count|
|**Duplicates**|`[3,1,3,1]`|`4`|Use `<=` comparison|

**Key:** Test with duplicates to ensure you handle the `==` case correctly.

---

## 🔑 Key Insights

1. **Inversion ≈ "Unsortedness"**: The more inversions, the further from sorted.
    
2. **Merge Sort is Natural**: Divide-and-conquer naturally separates local and split inversions.
    
3. **The Trick:** When `left[i] > right[j]`, ALL remaining elements in left also invert with `right[j]`. This is the O(n log n) magic.
    
4. **Index Confusion is Common**: Always use `len(subarray) - i`, not `original_index - i`.
    
5. **Space Tradeoff**: Merge sort uses O(n) space. If space is ultra-critical, Fenwick Tree uses O(n) as well but can handle updates.
    
6. **Interview Hierarchy**:
    
    - Explain: Start with O(n²) brute force
    - Optimize: Suggest merge sort approach
    - Code: Implement cleanly
    - Optimize: Discuss Fenwick Tree if asked about constraints

---

## 📚 Related Problems

- [[Merge Sort Notes|Merge Sort]] — Core algorithm
- [[Number of Smaller Elements to the Right|LeetCode 315]] — Count smaller elements; uses similar merge sort approach
- [[Reverse Pairs|LeetCode 493]] — Count pairs where arr[i] > 2*arr[j]
- [[Fenwick Tree Notes|Fenwick/BIT]] — Alternative approach for complex constraints
- [[Coordinate Compression|Technique]] — Handling large value ranges

---

## 💡 Interview Script

> **You:** "The brute force is O(n²) — check every pair. But we can optimize using merge sort."
> 
> **Explain:** "During merge, when an element from the right is smaller than an element from the left, all remaining left elements form inversions with it. We count these in O(n log n)."
> 
> **Code:** [Live code the solution]
> 
> **Optimize:** "If the array can't be modified, use a separate result array. If we need actual pairs, track indices. If values are huge, use coordinate compression with a Fenwick Tree."

---

## ✅ Checklist for Code Review

- [ ] Handle empty array
- [ ] Base case: `low >= high` returns 0
- [ ] Correctly split: `mid = (low + high) // 2`
- [ ] Three recursive calls: left, right, merge
- [ ] Use `len(left) - i`, NOT `mid - i + 1`
- [ ] Handle `==` case (don't double-count)
- [ ] Merge exhaustion loops are complete
- [ ] Test with duplicates and reverse-sorted arrays


---
