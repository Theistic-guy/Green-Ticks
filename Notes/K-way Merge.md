<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

## 🧠 PKM: K-Way Merge Algorithm (Python)

## 📌 Context & Core Concept

A K-Way Merge optimizes the combination of K sorted streams (arrays, files, linked lists) into a single unified sorted output. Instead of repeatedly searching all K headers linearly, it utilizes a Min-Heap (Priority Queue) to find the minimum element across streams in $O(\log K)$ time.

## ⏱️ Complexity

- Time Complexity: $\mathcal{O}(N \log K)$ where N is the total number of elements across all lists and K is the number of lists.
- Space Complexity: $\mathcal{O}(K)$ auxiliary space to maintain the heap of size K.

---

## 🛠️ Python Blueprint (Optimized)

Using Python's built-in `heapq` module. To prevent comparison errors when items share the same value, always push a structural tuple containing `(value, list_index, element_index)` or leverage Python's `heapq.merge` generator directly under the hood.

```python
import heapq
from typing import List

def k_way_merge(lists: List[List[int]]) -> List[int]:
    """
    Merges K sorted arrays into one unified sorted array.
    Time: O(N log K) | Space: O(K) 
    """
    min_heap = []
    result = []
    
    # Step 1: Initialize the heap with the first element of each non-empty list
    for list_idx, current_list in enumerate(lists):
        if current_list: # Skip empty lists safely
            # Structure: (value, list_index, element_index)
            heapq.heappush(min_heap, (current_list[0], list_idx, 0))
            
    # Step 2: Extract minimum and replenish from the same list
    while min_heap:
        val, list_idx, elem_idx = heapq.heappop(min_heap)
        result.append(val)
        
        # If the extracted element has a successor in its native list, push it
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))
            
    return result

# --- Verification & Testing ---
if __name__ == "__main__":
    test_input = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
    output = k_way_merge(test_input)
    print(f"Merged Output: {output}")  # Expected: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## ⚡ Python Tip: Pro-Level Production Alternate

For pure system implementations where you don't need customized iteration logic, Python provides an optimized C-level implementation out of the box:

```python
import heapq

# This returns a lazy generator, optimal for external stream files
merged_generator = heapq.merge([1, 4, 7], [2, 5, 8], [3, 6, 9])
result = list(merged_generator)
```

---

## 🚀 High-Yield FAANG Interview Problems

The K-Way Merge is a classic LeetCode pattern. Spotting a collection of pre-sorted lists or a grid with sorted properties (rows/columns) is your primary indicator to use this strategy.

## 1. Merge k Sorted Lists ([LeetCode 23](https://leetcode.com/problems/merge-k-sorted-lists/) — Hard)

### ==Covered here== - [merge-k-sorted-lists](../Problems/merge-k-sorted-lists.md)

- The Pitch: You are given an array of K linked-lists, each sorted in ascending order. Merge them into one sorted linked list.
- Why K-Way Merge: This is the most literal application of the pattern. You track the head pointers of all K linked lists in your min-heap.

## 2. Kth Smallest Element in a Sorted Matrix ([LeetCode 378](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) — Medium)

### ==👉 covered here== - [kth-smallest-element-in-a-sorted-matrix](../Problems/kth-smallest-element-in-a-sorted-matrix.md)

- The Pitch: Given an n × n matrix where each of the rows and columns is sorted in ascending order, find the $k^{th}$ smallest element.
- Why K-Way Merge: Treat each row of the matrix as an independent sorted stream. You run the standard K-Way loop exactly k times; the $k^{th}$ item you `heappop` is your direct answer.

## 3. Find K Pairs with Smallest Sums ([LeetCode 373](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) — Medium)

### ==Covered here== - [find-k-pairs-with-smallest-sums](../Problems/find-k-pairs-with-smallest-sums.md)


- The Pitch: You are given two integer arrays sorted in ascending order, `nums1` and `nums2`. Define a pair (u, v) which consists of one element from the first array and one from the second. Return the K pairs with the smallest sums.
- Why K-Way Merge: Think of this visually as an implicit grid where row i represents pairing `nums1[i]` with all items in `nums2`. Each row is naturally sorted. You run a K-Way merge across these virtual lines.

## 4. Smallest Range Covering Elements from K Lists ([LeetCode 632](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) — Hard)
### ==Covered here== - [smallest-range-covering-elements-from-k-sorted-lists](../Problems/smallest-range-covering-elements-from-k-sorted-lists.md)
- The Pitch: You have K lists of sorted integers. Find the smallest continuous numerical range that includes at least one number from each of the K lists.
- Why K-Way Merge: Maintain a min-heap tracking one element from each list. Track the global maximum of the elements currently sitting inside your heap. The difference between your heap's `min` (top) and your tracked `max` forms a viable range. Advance using standard K-Way rules to find the smallest window.

---