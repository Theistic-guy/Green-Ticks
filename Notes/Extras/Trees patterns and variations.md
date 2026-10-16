---
updated: 16-10-2026
---

---
tags: [dsa, trees, bst, tree-dp, faang-prep]
status: reference
related: [dfs, bfs, queue, monotonic-stack, backtracking, dp, greedy, trie, segment-tree, fenwick]

---

# Trees: Comprehensive Note

## The one mental model
Almost every tree problem is a recursion problem, and the real decision is **what flows down and what flows up**.

| Direction | Use when | Order | Example |
|---|---|---|---|
| **Down** (parameters) | Node needs context from ancestors: bounds, running sum, depth | Preorder | Validate BST, Path Sum |
| **Up** (return value) | Node needs answers from its subtrees: height, validity, best path | Postorder | Diameter, Balanced |
| **Level by level** | Answer depends on depth or same-depth neighbors | BFS | Right Side View |

Before coding, state the contract: *"my function returns X for the subtree rooted here."* If you can't say X, don't code yet. Most wrong tree solutions are a muddy contract.

Also decide the **null base case** first (height 0? validity True? max -inf?).

Complexity is almost always O(n) time and **O(h) space** (recursion stack; h = n for a skewed tree). Say this unprompted.

---

## Time-boxed plan (if time is short)
- **Tier A, must do (~25 problems):** 104, 226, 100, 101, 102, 199, 103, 543, 110, 98, 230, 235, 112, 113, 437, 236, 105, 297, 124, 337, 114, 173, 450, 863, 662
- **Tier B, strong:** 572, 297's BST variant 449, 987, 652, 333, 979, 1448, 538, 108, 653, 117, 1110, 2096
- **Tier C, know it exists:** Morris traversal, 968, 99, 834, 1569, 426, 428, binary lifting

If you do only Tier A with the contract habit, you've covered the large majority of tree questions at FAANG.

---

## 1. Foundations (do cold)
- Inorder/Preorder/Postorder (94, 144, 145): recursive, then **iterative with an explicit stack**. The iterative version is a real follow-up.
- **Level Order (102)**, Max Depth (104), Invert (226), Same Tree (100), Symmetric (101), Subtree of Another Tree (572)
- Merge Two Binary Trees (617), Flip Equivalent Trees (951), Find Bottom Left Value (513)
- Morris traversal (O(1) space): know it exists, skip drilling.

## 2. Bottom-up DFS: return one thing, record another (highest ROI)
The key trick: **the value returned to the parent differs from the answer you record.** Return height, record the diameter.
- **Diameter (543)**: the template
- **Balanced Binary Tree (110)**: return height, -1 as a failure sentinel
- **Binary Tree Maximum Path Sum (124)**: return the best *one-sided* gain, record the best *two-sided* path, clamp negatives to 0. The checkpoint problem for this section.
- Longest Univalue Path (687), Longest Path With Different Adjacent Characters (2246, same shape on a parent-array tree)
- **Lowest Common Ancestor (236)**: "found it on left/right" propagating up
- Smallest Subtree with all Deepest Nodes (865), Binary Tree Tilt (563), Count Nodes Equal to Average of Subtree (2265)

## 3. Top-down DFS: pass state down
- **Validate BST (98)**: pass `(low, high)` bounds. Comparing a node only to its children is the classic trap.
- Path Sum (112), **Path Sum II (113)** (append, recurse, pop: backtracking), Sum Root to Leaf Numbers (129), Binary Tree Paths (257)
- **Path Sum III (437)**: prefix sum plus a hashmap along the current root-to-node path, with an undo on exit. Same trick as the array prefix-sum pattern.
- Count Good Nodes (1448), Max Difference Between Node and Ancestor (1026), Longest ZigZag Path (1372)

## 4. BFS / level-based
Use the "snapshot `len(queue)` per level" loop.
- Right Side View (199), Zigzag (103), Average of Levels (637), Cousins (993), Max Level Sum (1161)
- Populating Next Right Pointers (116, 117): 117 in O(1) space is the stretch
- **Max Width (662)**: index nodes like a heap (2i, 2i+1)
- **Vertical Order (987)**: BFS carrying a column; careful tie-breaking
- Check Completeness (958), Count Complete Tree Nodes (222, use height to skip work: O(log² n))

## 5. BST-specific
One idea does most of the work: **inorder of a BST is sorted.**
- **Kth Smallest (230)**, **BST Iterator (173)** (iterative inorder, also a design question)
- Insert (701), **Delete (450)** (three cases), **LCA of BST (235)**, Trim BST (669)
- Convert Sorted Array to BST (108), Two Sum IV (653), Convert BST to Greater Tree (538)
- Recover BST (99): find the two out-of-order inorder nodes; stretch

## 6. Construction and serialization
- **Preorder + Inorder (105)**, Inorder + Postorder (106): preorder gives the root, inorder splits left from right; a hashmap of inorder indices makes it O(n)
- **Serialize/Deserialize (297)**, BST version (449): preorder with null markers. Be ready to explain why it reconstructs uniquely.
- Construct BST from Preorder (1008), Maximum Binary Tree (654, a monotonic stack problem)
- Find Duplicate Subtrees (652): serialize each subtree, hash it
- Verify Preorder Serialization (331)

## 7. Tree as graph: parent pointers + BFS
Trees only point down, so "walk up" needs a parent map.
- **All Nodes Distance K (863)**, Amount of Time to Infect (2385)
- Step-by-Step Directions Between Nodes (2096): LCA plus paths

Signal: "distance in all directions from a node."

## 8. Restructuring
- **Flatten to Linked List (114)**, Delete Nodes and Return Forest (1110), Convert BST to Doubly Linked List (426, premium), Boundary of Binary Tree (545, premium)

## 9. N-ary trees
- N-ary Level Order (429), Max Depth (559), Serialize N-ary (428, premium). Same patterns, `for child in children`.

---

## 10. Tree + DP (the dangerous area)

### Why it's dangerous
The contract stops being "return one number." Now each node returns **a tuple of states**, and the bugs are subtle:
1. **State definition**: what exactly does each tuple slot mean? Write it as a sentence before coding.
2. **Recompute blowup**: a "rob this node or not" recursion that calls grandchildren directly, without memo or tuple return, goes exponential.
3. **Record vs return** (section 2) now happens with several values at once.
4. **Greedy vs DP ambiguity** (Cameras 968): a greedy exists, the DP is safer to derive.
5. **Combine step errors**: the parent's transition from child states is where most wrong answers hide.

### Difficulty levels and ROI

| Level | Idea | Problems | Difficulty | FAANG ROI |
|---|---|---|---|---|
| **L1** | Return one aggregate (height, size, sum) | 104, 1120-style subtree sums, 508, 1339, 563 | Easy-Med | High, cheap |
| **L2** | Return a **pair** of states | **337 House Robber III**, 979 Distribute Coins | Medium | **Very high** |
| **L3** | Return a **small tuple** (validity + size + min/max) | **333 Largest BST Subtree**, 1373 Max Sum BST | Med-Hard | High |
| **L3** | Record vs return with clamping | **124**, 543, 687, 2246 | Med-Hard | **Very high** |
| **L4** | Multi-state coverage DP | 968 Cameras | Hard | Medium |
| **L4** | Counting over structure (Catalan) | 96 Unique BSTs, 95 (generate all) | Medium | Medium |
| **L5** | Rerooting (two passes) | 834 Sum of Distances in Tree, 310 MHT (peeling alternative) | Hard | Low-Med |
| **L6** | Knapsack on tree (merge child arrays by size) | 1530-style depth arrays, harder variants | Hard | Rare; skip |

### The contracts to memorize (the *why*, not the code)
- **337**: return `(best if I rob this node, best if I skip it)`. Rob = value + children's *skip* values. Skip = sum of each child's *better* option. The pair is what prevents recomputation.
- **333 / 1373**: return `(isBST, size or sum, min, max)`. A node is a BST iff both children are BSTs and `left.max < val < right.min`. Why a tuple: the parent needs facts about the subtree it can't recompute cheaply.
- **979**: return the **net excess** of coins (coins minus 1, plus children's excess). Every unit of excess crossing an edge costs one move, so the answer sums `|excess|` over children. The insight is that moves are edge-flow, so no simulation is needed.
- **124**: return the best one-sided gain (`max(0, ...)`), record `val + left + right`. Clamp because a negative branch is better skipped.
- **968**: three node states (uncovered, has camera, covered without camera). Greedy form: put cameras at the *parents of uncovered leaves*, bottom-up; the root may need one extra. Know the states, not necessarily both solutions.
- **834 rerooting**: first pass computes subtree sizes and the root's answer; second pass derives each child's answer from its parent's with `ans[child] = ans[parent] - size[child] + (n - size[child])`. The idea is "moving the root across one edge changes distances in a predictable way."
- **96 Catalan**: pick a root `i`; left subtree has `i-1` nodes, right has `n-i`; multiply counts and sum. It's a 1D DP over sizes, not really tree traversal.

### Recognition cues for tree DP
- "Choose a subset of nodes under an adjacency rule" (no two adjacent) → **L2 pair**.
- "Largest/best *valid* subtree" → **L3 tuple**.
- "Min/max over paths, answer may bend at a node" → **record vs return**.
- "For every node, answer relative to all other nodes" → **rerooting**.
- "Count distinct trees/shapes" → **Catalan-style**.

### Where to spend time
**337, 124, 333, 979 are enough for FAANG.** 968 once, if time allows. 834 only for harder-round prep. Skip L6.

---

## Specialized tree structures (separate from vanilla trees)

| Structure | Interview depth | Code it? |
|---|---|---|
| **Trie** | High | Yes (see Trie note) |
| **Segment tree** | Medium; harder rounds | Yes, point update + range query, then lazy only if time |
| **Fenwick / BIT** | Medium | Yes, learn first (about 10 lines) |
| **AVL** | Concept: invariant, 4 rotation cases, tradeoffs | Optionally insert once |
| **Red-Black** | Concept: properties, why libraries use it | No |
| **B-tree / B+ tree** | Why + shape + split/merge idea | No |

- **Fenwick/Segment problems:** Range Sum Query Mutable (307), Count of Smaller Numbers After Self (315), Reverse Pairs (493), The Skyline Problem (218), Range Sum Query 2D (308). Order: Fenwick (307) → segment tree (315) → lazy propagation only if needed.
- **B+ tree "why":** disk-page cost dominates, so high fanout keeps the tree shallow (3 to 4 reads for billions of keys), and linked leaves make range scans sequential. Hash tables can't do ordered scans; a disk BST is too deep.
- **AVL vs Red-Black:** AVL is stricter (faster lookups, more rotations on writes); Red-Black does fewer rotations, which is why `std::map` and `TreeMap` use it.
- **Practical use of balanced trees:** an ordered map with O(log n) floor/ceiling (My Calendar I/II/III, Sliding Window Median). You use it, you don't build it.
- Raise B-tree depth only for database/storage teams.

---

## Caveats and common bugs
- **Recording vs returning** is the most common conceptual bug.
- **Validate BST**: node-vs-children comparison passes simple tests and fails deeper ones.
- **"Root-to-leaf" vs "any path"** changes the whole solution (112 vs 437 vs 124). Re-read the wording.
- **Null base case**: decide what an empty subtree returns first.
- **Duplicates in a BST**: ask which side they go on.
- **Global state**: reset between calls (LeetCode reuses instances).
- **LCA**: confirm both nodes exist (the 236 vs 1644 distinction).
- **Skewed trees**: recursion depth can hit limits; mention the iterative version.
- **Backtracking paths**: copy the path when recording (`path[:]`), and pop on exit.
- **Tuple order mix-ups** in tree DP: name the fields, don't index by position.

## Connections to other notes
- **Backtracking:** path problems (113) are append/recurse/pop with the tree as the decision structure.
- **BFS/Queue:** level order is the same queue loop with the per-level snapshot.
- **Monotonic stack:** Maximum Binary Tree (654).
- **Prefix sums:** Path Sum III (437).
- **Greedy:** Cameras (968); the greedy alternative to its DP.
- **DP:** House Robber III is House Robber (array) lifted onto a tree.
- **Trie:** a tree with a different job.
- **Graph:** section 7 treats the tree as an undirected graph.

## Drill order
1. 104, 226, 100, 101: recursion contracts become automatic
2. 102 → 199 → 103: the BFS level loop
3. 543, 110: return vs record
4. 98, 230, 235: BST via inorder and bounds
5. 112, 113, 437: top-down, backtracking, prefix sum
6. 236: LCA
7. 105, 297: construction and serialization
8. 124: the checkpoint for section 2
9. 337, 333, 979: tree DP (L2, L3)
10. Second wave: 863, 662, 987, 114, 173, 450, 652, 1110
11. Stretch: 968, 99, 834
12. Then Fenwick (307) and segment tree (315)

## One-line summary
Decide what flows down and what flows up, write the contract before the code, and treat tree DP as the same recursion with a multi-valued return, where the quality of your state definition decides everything.