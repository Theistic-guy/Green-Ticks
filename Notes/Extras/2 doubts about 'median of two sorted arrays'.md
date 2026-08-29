<h1 align='right'><a href="../README.md">⇐🏠</a></h1>


Tags: #leetcode #algorithms #binary-search #array #interview-prep  
Complexity: Time: $O(\log(\min(m, n)))$ | Space: $O(1)$  
References: LeetCode 4 — Median of Two Sorted Arrays

---

## 📌 Executive Summary

The problem requires finding the median of two sorted arrays of sizes $m$ and $n$. The naive approach of merging takes $O(m+n)$ time. The optimal solution uses Binary Search to find the correct partition point simultaneously across both arrays, achieving a runtime of $O(\log(\min(m, n)))$.

To do this flawlessly, we must partition the arrays such that:

1. The Left Half and Right Half contain an equal number of elements (or the left half has exactly one more element).
2. Every element in the Left Half is less than or equal to every element in the Right Half.

---

## 🧠 Core Algorithmic Mechanics

## 1. Why We Enforce Binary Search on the Smaller Array

At the entry point of the algorithm, we check if $m > n$. If it is, we swap the arrays so that Array $A$ is always the smaller array ($m \le n$).

```python
if len(nums1) > len(nums2):
    return findMedianSortedArrays(nums2, nums1)
```

## Reason A: Eliminating Index Out-of-Bounds Errors

The algorithm picks a partition index $i$ in Array $A$. The partition index $j$ in Array $B$ is derived using the total target elements for the left side (`half_len`):  
$$j = \text{half\_len} - i$$

- If we searched the LARGER array ($B$): $j$ could be chosen near $0$. This would force $i = \text{half\_len} - 0$, which can easily exceed the size of the smaller array $A$, causing a crash.
- By searching the SMALLER array ($A$): $i$ is bound safely within $[0, m]$. This mathematically guarantees that $j$ will always fall between $[0, n]$ without any extra manual guard conditions.

## Reason B: Strict Time Complexity Optimization

Binary search divides the search space in half each time. By forcing the search on the array of size $\min(m, n)$, we guarantee a runtime capped at $O(\log(\min(m, n)))$.

---

## 2. The `half_len` Formula Design Choice

To determine how many elements belong in the combined left partition, we use an index partition formula. You can build the algorithm using two distinct style choices:

## Approach 1: The Left-Heavy Formula `(m + n + 1) // 2` (Standard)

- Odd Totals: The extra element is forced into the Left Partition.
- Median Rule for Odds: `median = max(Left_A, Left_B)`

## Approach 2: The Balanced/Right-Heavy Formula `(m + n) // 2` (Alternative)

- Odd Totals: The extra element is forced into the Right Partition.
- Median Rule for Odds: `median = min(Right_A, Right_B)`

> 💡 Insight: Neither formula is strictly necessary over the other. They are mathematically symmetric. Most tutorials default to Approach 1 simply due to a coding preference for looking at the left-side maximums.

---

## 🔍 Concrete Visual Example

Let's trace Approach 1 (Left-Heavy) using a concrete example.

- Array A: `[1, 3]` ($m = 2$)
- Array B: `[2]` ($n = 1$)
- Total elements = $3$ (Odd).
- Target elements on left (`half_len`) = $(2 + 1 + 1) // 2 = 2$.

## Binary Search Steps:

1. We search Array $A$. Range: `low = 0`, `high = 2`.
2. Iteration 1:
    
    - $i = (0 + 2) // 2 = 1$ (Partition after `1` in Array $A$).
    - $j = 2 - 1 = 1$ (Partition after `2` in Array $B$).
    
3. Check Boundaries:
    
    - Left side elements: $A[\text{left}] = 1$, $B[\text{left}] = 2$
    - Right side elements: $A[\text{right}] = 3$, $B[\text{right}] = \text{None (out of bounds)}$
    - Condition Check: Is $A[\text{left}] \le B[\text{right}]$ and $B[\text{left}] \le A[\text{right}]$?
    - $1 \le \infty$ (True) and $2 \le 3$ (True).
    
4. Partition Found!
    
    - Left Half: `[1, 2]`
    - Right Half: `[3]`
    - Total length is odd, so Median = $\max(1, 2) = \mathbf{2}$.
    

---

## 💻 Full Code Implementations

## Implementation A: Standard Approach (Left-Heavy Half)

```python
def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    # 1. Enforce that nums1 is the smaller array
    if len(nums1) > len(nums2):
        return findMedianSortedArrays(nums2, nums1)
        
    m, n = len(nums1), len(nums2)
    low, high = 0, m
    half_len = (m + n + 1) // 2  # Left-heavy formula
    
    while low <= high:
        i = (low + high) // 2
        j = half_len - i
        
        # Determine edge values using infinity guards
        maxLeftA = nums1[i - 1] if i > 0 else float('-inf')
        minRightA = nums1[i] if i < m else float('inf')
        
        maxLeftB = nums2[j - 1] if j > 0 else float('-inf')
        minRightB = nums2[j] if j < n else float('inf')
        
        # Valid partition found
        if maxLeftA <= minRightB and maxLeftB <= minRightA:
            if (m + n) % 2 != 0:
                return float(max(maxLeftA, maxLeftB))
            return (max(maxLeftA, maxLeftB) + min(minRightA, minRightB)) / 2.0
            
        elif maxLeftA > minRightB:
            high = i - 1  # Move left in nums1
        else:
            low = i + 1   # Move right in nums1
```

## Implementation B: Alternative Approach (Right-Heavy Half)

```python
def findMedianSortedArraysAlternative(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2):
        return findMedianSortedArraysAlternative(nums2, nums1)
        
    m, n = len(nums1), len(nums2)
    low, high = 0, m
    half_len = (m + n) // 2  # Balanced/Right-heavy formula
    
    while low <= high:
        i = (low + high) // 2
        j = half_len - i
        
        maxLeftA = nums1[i - 1] if i > 0 else float('-inf')
        minRightA = nums1[i] if i < m else float('inf')
        
        maxLeftB = nums2[j - 1] if j > 0 else float('-inf')
        minRightB = nums2[j] if j < n else float('inf')
        
        if maxLeftA <= minRightB and maxLeftB <= minRightA:
            if (m + n) % 2 != 0:
                return float(min(minRightA, minRightB)) # Extra element is on the right
            return (max(maxLeftA, maxLeftB) + min(minRightA, minRightB)) / 2.0
            
        elif maxLeftA > minRightB:
            high = i - 1
        else:
            low = i + 1
```

---

## 💡 Top Interview Cheat-Sheet Tips

- Infinity Guards: Always use `float('-inf')` for left-side variables when an index drops to `0`, and `float('inf')` for right-side variables when an index hits the max array size. This prevents messy, multi-line nested conditional checks.
- The "Why Swap" question: If an interviewer asks why you check `len(nums1) > len(nums2)`, answer explicitly: _"It standardizes our derived index computations and structurally protects against Index Out Of Bounds errors on the larger array without adding explicit boundary wrappers inside the loop."_

---

If you plan to integrate this into an Obsidian or Notion vault, would you like me to show you how to set up Dataview properties for tracking your LeetCode progress, or would you like to review another classic array binary search question next?