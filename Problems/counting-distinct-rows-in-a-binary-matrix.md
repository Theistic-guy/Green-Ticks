---
Title: Counting Distinct Rows in a Binary Matrix
Companies:
  - Not Specified
Topics:
  - Strings
  - Matrix
  - Hashing
  - Trie
Platform:
  - GFG
Difficulty: Medium
Other Tags:
Link: ""
Rating:
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Counting Distinct Rows in a Binary Matrix

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def count_distinct_rows_black_box(matrix, existing_trie):
    distinct_count = 0
    for row in matrix:
        row_key = "".join(map(str, row)) 
        if not existing_trie.search(row_key):
            distinct_count += 1
            existing_trie.insert(row_key)
    return distinct_count
```
**Time complexity** - O(M $\times$ N)

**Aux. Space complexity** -  O(1)

---


## 📝 PKM Note: Counting Distinct Rows in a Binary Matrix

## 📌 Overview

Given an M × N binary matrix, the objective is to count the number of unique/distinct rows efficiently. While trivial solutions involve brute-force comparisons, optimal solutions leverage hashing or prefix trees to achieve linear time complexity relative to the total number of elements.

---

## ⚡ Optimal Strategies

## 1. Hash Set Approach (Most Pythonic)

- Concept: Transform each row into an immutable, hashable structure (like a string or tuple) and add it to a Set. The final size of the set dictates the unique count.
- Complexity:
    
    - 🔴 Time: $\mathcal{O}(M \times N)$ — Linear scan of the entire matrix.
    - 🟡 Space: $\mathcal{O}(M \times N)$ — Storing strings or tuples of length N in memory.
    

## 2. Specialized Binary Trie Approach (Optimal Performance)

- Concept: Build a stripped-down Prefix Tree (Trie) where each node only has two child pointers: `0` and `1`.
- Complexity:
    
    - 🔴 Time: $\mathcal{O}(M \times N)$
    - 🟡 Space: $\mathcal{O}(M \times N)$
    

---

## 🧠 Core Architecture & Integration Insights

When building a system using Tries, the implementation approach depends on your architectural constraints:

## Scenario A: Using a Pre-Existing Generic Trie

If reusing an existing, standard Trie library (supporting `insert`, `search`, `startsWith`), treat it as a black box:

1. Stream through matrix rows.
2. Format the binary row into a string representation (e.g., `[1, 0, 1]` becomes `"101"`).
3. Query `trie.search(row_string)`.
4. If it returns `False`, increment the counter and run `trie.insert(row_string)`.

```python
def count_distinct_rows_black_box(matrix, existing_trie):
    distinct_count = 0
    for row in matrix:
        row_key = "".join(map(str, row)) 
        if not existing_trie.search(row_key):
            distinct_count += 1
            existing_trie.insert(row_key)
    return distinct_count
```

## Scenario B: Custom Specialized Trie vs. Generic Trie

Building a hyper-targeted custom Trie yields significant structural advantages over a generic text/string Trie:

- Memory Optimization: Generic Tries often allocate space for a standard alphabet (array size of 26) or dynamically spin up dictionaries `{}` at each node. A matrix-specific Trie requires an array of exactly two child pointers (`0` and `1`), eliminating memory overhead.
- One-Pass Execution: Instead of separately querying `search` and then executing `insert` (two passes down the tree), a specialized Trie inserts on-the-fly. If it encounters a brand-new node while inserting, it flags the entire row as distinct in a single pass.

---

## ⚠️ Architectural Pitfalls: Insert-All then DFS Count

An alternative approach is to insert all rows into the Trie blindly first, and then execute a Depth-First Search (DFS) to count the leaf nodes or terminal markers (`isEndOfWord == True`).

While logically correct, this approach creates two structural inefficiencies:

1. The Duplicate Waste Problem: When encountering a duplicate row, a standard `trie.insert()` still traces the path node-by-node down to the very end just to re-assert a boolean flag (`isEndOfWord = True`). It filters out duplicates at the tree level, but spends unnecessary CPU cycles re-traversing old paths.
2. Two-Pass Overhead:
    
    - One-Pass: Evaluates and tracks unique counts dynamically during structural creation. Total operations $\approx \mathcal{O}(M \times N)$.
    - Two-Pass (DFS): Requires writing all paths to memory ($\mathcal{O}(M \times N)$), followed by a mandatory top-to-bottom tree traversal ($\mathcal{O}(\text{Total Nodes})$) to count endpoints. It doubles execution operations.
    

---

## 📊 Quick Comparison Matrix

|Approach|Code Complexity|Performance / Operations|Best Used For|
|---|---|---|---|
|Hash Set|🟩 Minimal (Built-in)|Fast, optimized at C-level in Python|Rapid prototyping, standard inputs|
|Specialized Trie (One-Pass)|🟨 Medium (Custom code)|Optimal memory footprint, single-pass tracking|Streamed or highly dense binary matrix data|
|Generic Trie (Black-Box)|🟩 Minimal (Reused code)|Dual-pass lookups per row|When maintaining a single codebase asset is prioritized|
|Trie Insertion + DFS Count|🟥 High (Two functions)|Redundant traversal cycles|Avoid in performance-critical environments|

Would you like to add a Python implementation of the specialized two-pointer Trie node directly into this note, or should we explore how to export this note to a specific file format (like `.md` or `.pdf`)?