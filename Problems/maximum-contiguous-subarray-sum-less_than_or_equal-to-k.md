---
Title: Maximum Contiguous Subarray Sum ≤ K
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
  - Ordered Containers
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - Maximum
  - Subarray
  - kth
  - Ordered Set
Link: ""
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Maximum Contiguous Subarray Sum ≤ K

**Pattern:**  Ordered set

**Idea:** 

**Variations** : 
+ somewhat looks similar but isn't - [shortest-subarray-with-sum-at-least-k](shortest-subarray-with-sum-at-least-k.md) but no monotonic deque
+ 2D version - [maximum-sum-of-rectangle-no-larger-than-k](maximum-sum-of-rectangle-no-larger-than-k.md)


---

## 💻 Code

```Python
from sortedcontainers import SortedList

def maxSubarraySumNoLargerThanK(nums: list[int], k: int) -> int:
    # Initialize SortedList with 0 to handle valid subarrays starting from index 0
    prefix_sums = SortedList([0])
    
    current_sum = 0
    max_sum = float('-inf')
    
    for num in nums:
        current_sum += num
        
        # Goal: Find smallest S_i such that S_i >= current_sum - k
        target = current_sum - k
        
        # bisect_left uses binary search to find the index of the ceiling value
        idx = prefix_sums.bisect_left(target)
        
        # If a valid S_i exists in our history
        if idx < len(prefix_sums):
            historical_sum = prefix_sums[idx]
            subarray_sum = current_sum - historical_sum
            max_sum = max(max_sum, subarray_sum)
            
        # Insert the current prefix sum to make it available for future steps
        prefix_sums.add(current_sum)
        
    return max_sum

```
**Time complexity** - O(nlogn) 

**Aux. Space complexity** -  O(n)

---
## PKM Note: Maximum Contiguous Subarray Sum ≤ K

## 📌 Problem Overview

Given an array of integers `nums` (which can include both positive and negative numbers) and an integer `K`, find the maximum possible sum of a contiguous subarray such that the sum is less than or equal to K. If no such subarray exists, return -∞ or an appropriate sentinel value.

- Core Challenge: The presence of negative numbers invalidates standard sliding window techniques, and the exact value bound invalidates binary search on the answer space.

---

## 💡 Intuitive Explanation

Think of this problem as searching for the perfect subtraction.

Every contiguous subarray sum can be represented as the difference between two prefix sums:  
$$\text{Subarray Sum} = \text{Current Prefix Sum} (S_j) - \text{Past Prefix Sum} (S_i) \quad \text{where } i < j$$

We want to maximize this subarray sum while keeping it safely under the threshold K:  
$$S_j - S_i \le K$$

Rearranging the inequality to solve for what we need from our history ($S_i$):  
$$S_i \ge S_j - K$$

To make the resulting subarray sum as large as possible, we must subtract the smallest possible value. Therefore, at any index j, our goal is to search our history for the smallest historical prefix sum ($S_i$) that is greater than or equal to $S_j - K$ (mathematically known as the _ceiling_ value).

<mark>My note</mark> : from this equation $\boxed{S_j - S_i \le K}$ we learn that we need smaller and smaller Si and by rearranging we understood $$S_i \ge S_j - K$$
that it has to be greater than or equal to Sj-k

---

## 🛠️ Python Implementation

Because Python does not feature a built-in Balanced Binary Search Tree (like `std::set` in C++ or `TreeSet` in Java), we use the `sortedcontainers` library. This maintains an efficiently balanced structure to guarantee $O(\log N)$ insertions and lookups.

```python
from sortedcontainers import SortedList

def maxSubarraySumNoLargerThanK(nums: list[int], k: int) -> int:
    # Initialize SortedList with 0 to handle valid subarrays starting from index 0
    prefix_sums = SortedList([0])
    
    current_sum = 0
    max_sum = float('-inf')
    
    for num in nums:
        current_sum += num
        
        # Goal: Find smallest S_i such that S_i >= current_sum - k
        target = current_sum - k
        
        # bisect_left uses binary search to find the index of the ceiling value
        idx = prefix_sums.bisect_left(target)
        
        # If a valid S_i exists in our history
        if idx < len(prefix_sums):
            historical_sum = prefix_sums[idx]
            subarray_sum = current_sum - historical_sum
            max_sum = max(max_sum, subarray_sum)
            
        # Insert the current prefix sum to make it available for future steps
        prefix_sums.add(current_sum)
        
    return max_sum
```

---

## 📊 Complexity Analysis

## Time Complexity: $O(N \log N)$

- Iteration: We traverse the array of size N exactly once → O(N).
- Tree Lookup & Insertion: For each element, `bisect_left` (binary search) takes $O(\log N)$ time, and inserting into the balanced tree (`add`) takes $O(\log N)$ time.
- Total Time: $N \times (O(\log N) + O(\log N)) = O(N \log N)$.

## Space Complexity: O(N)

- We store up to N + 1 prefix sums inside our balanced tree structure to retain the historical data.

---

## ❓ Deep-Dive: Why Alternative Techniques Fail

## 1. Why can't we use a Monotonic Deque / Sliding Window?

A monotonic deque relies heavily on discarding options permanently once they fail a condition or are dominated by a better option.

- No Left Pops: In problems like _Shortest Subarray ≥ K_, once a historical prefix sum satisfies the window constraint, you pop it from the left because any future window using it will only get _longer_ (and we want the shortest). In _this_ problem, we want to maximize the _sum_. A historical index cannot be discarded because a massive future element could pair with it later to produce a much better sum.
- No Right Pops (No Monotonicity): Because the array contains negative numbers, prefix sums jump up and down randomly. A smaller prefix sum does not "dominate" a larger one. You might need a large historical sum to stay under K, or a small historical sum to maximize the total. Because everything remains potentially useful, you cannot keep the deque sorted chronologically while forcing a value-based ordering.

## 2. Why can't we Binary Search on the Answer Space?

Binary search on the answer space requires a monotonic relationship (e.g., "If a sum of X is possible, then a sum of X-1 must also be possible").

- Contiguous subarray choices are discrete, and adding numbers can decrease the sum due to negative values.
- If you guess a target sum of `15` and your checker returns `False`, it tells you absolutely nothing about whether `14` or `16` exists. The valid subarray sums skip around unpredictably, destroying the single continuous "Possible vs. Impossible" boundary required for binary search.

---

## 🗺️ Mental Map & Related Problems

- Maximum Subarray Sum (No Constraint): Use _Kadane's Algorithm_ → O(N) time, O(1) space.
- Shortest Subarray Sum ≥ K: Use _Monotonic Deque_ → O(N) time, O(N) space.
- Maximum Sum of Rectangle No Larger Than K (2D): Compress rows into a 1D array using a prefix matrix, then apply _this Balanced BST approach_ on the columns $\to O(R^2 \cdot C \log C)$ time.

Would you like to extend this note to include the 2D Matrix version (LeetCode 363), or should we map out the C++/Java equivalents for native tree implementations?