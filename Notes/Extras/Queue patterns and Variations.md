---
tags: [dsa, queue, patterns, faang-prep]
status: reference
related: [monotonic-stack, bfs, priority-queue]
---
Must See: [BFS-Backtracking based Queue but not queue patterns](BFS-Backtracking%20based%20Queue%20but%20not%20queue%20patterns.md)


# Queue — Pattern Landscape

## Core idea
A queue is the right tool whenever **order of arrival must be preserved** while processing, or when you need to explore a search space **level by level** (BFS). The unifying question: *"does the order elements were added determine the order they should be handled?"* — if yes, queue. If instead an earlier element's resolution depends on a *later* element, that's the stack signal, not queue.

---

## 1. Queue as BFS Engine (highest ROI)
The queue holds the current "frontier." Each pop processes one node/state and pushes its unvisited neighbors — this is what makes traversal *level-order*.

**Sub-variations:**
- **Multi-source BFS** — seed the queue with *all* starting points at once, not just one, so distances/spread are computed simultaneously.
  - Rotting Oranges (994), Walls and Gates (286), 01 Matrix (542)
- **Topological sort (Kahn's algorithm)** — queue holds all zero-indegree nodes; popping and decrementing neighbors' indegree is BFS in disguise.
  - Course Schedule (207), Course Schedule II (210)
- **BFS on implicit/state-space graphs** — nodes aren't given explicitly; you generate neighbors on the fly.
  - Open the Lock (752)
- **Canonical warm-up**
  - Binary Tree Level Order Traversal (102)

**Recognize this pattern when:** "shortest path," "minimum steps," "spread/infection," or "all nodes with no prerequisites" language appears in an unweighted graph or grid.

---

## 2. Monotonic Deque (very high ROI)
Same "resolve-on-pop" logic as a monotonic stack, but a deque evicts from **both ends**: front evicts on window expiry (index out of range), back evicts on value-dominance (a worse candidate is discarded).

- Sliding Window Maximum (239) — master this first, it's the template
- Shortest Subarray with Sum ≥ K (862)
- Jump Game VI (1696), Constrained Subsequence Sum (1425) — DP combined with monotonic deque, common in hards
- Longest Continuous Subarray with Abs Diff ≤ Limit (1438)

**Invariant to say out loud before coding:** *"I maintain a decreasing deque of indices; I pop from the back while the incoming value beats it, and I pop from the front when the front index falls outside the window."*

---

## 3. Streaming / Sliding-Window State (medium-high ROI)
Queue holds only the *currently active* elements; a rule evicts stale ones as new data streams in.

- Moving Average from Data Stream (346)
- Number of Recent Calls (933)
- First Unique Number (1429) — queue + hashmap combo

---

## 4. Queue-based Design / Simulation (medium ROI — common warm-up)
- Implement Queue using Stacks (232) — tests amortized-cost reasoning
- Design Circular Queue (622), Design Circular Deque (641)
- Dota2 Senate (649), Time Needed to Buy Tickets (2073) — round-robin/circular simulation

---

## 5. Priority Queue (major adjacent topic — high ROI, treat as its own deep-dive)
Not FIFO — pops the highest/lowest priority item regardless of arrival order. Distinct enough mental model to study separately, but frequently paired with queue-tagged problems.

- Kth Largest Element (215), Top K Frequent Elements (347), Merge K Sorted Lists (23)
- Find Median from Data Stream (295), IPO (502), Meeting Rooms III (2402)
- Sliding Window Median (480) — two-heap technique

*(Full deep-dive pending — flag for separate note if going deep on heaps.)*

---

## 6. Concurrency-flavored Queue Problems (niche, low default priority)
Tests synchronization, not core DSA pattern recognition. Only prioritize if targeting teams known to probe concurrency.
- Bounded Blocking Queue (1188), Print in Order (1114), FooBar Alternately (1115), Building H₂O (1117)

---

## Pattern Recognition Cheat Sheet
| Interview clue | Structure |
|---|---|
| First come, first served | Queue |
| Continuous incoming stream | Queue |
| Shortest path / min steps, unweighted graph | BFS + Queue |
| Spreading/infection from multiple sources | Multi-source BFS |
| No-prerequisite / dependency ordering | Topological sort (Kahn's) |
| Fixed-size buffer | Circular Queue |
| Sliding window max/min | Monotonic Deque |
| Need front AND back operations | Deque |
| Highest priority first | Priority Queue |
| Retrieve both min & max | Double-ended PQ (two heaps) |
| Round-robin scheduling | Circular Queue |

## Suggested drill order
1. Binary Tree Level Order Traversal (102) — confirm BFS/queue mechanics are solid
2. Rotting Oranges (994) → Course Schedule (207/210) — multi-source BFS, then topo sort
3. Sliding Window Maximum (239) — monotonic deque template
4. Constrained Subsequence Sum (1425) — DP + monotonic deque combo (checkpoint problem)
5. Design Circular Queue (622) — design/simulation warm-up
6. Priority Queue basics (215, 347) — bridge into next deep-dive

## Final note
Queue-tagged LeetCode problems undersell how often queues actually appear — most real usage is **hidden inside BFS**, not in explicit "queue" problems. The highest-leverage move is treating BFS-with-queue and monotonic-deque as the two pillars, since together they cover the majority of queue-flavored mediums/hards; circular-queue design and concurrency problems are comparatively low-frequency and safe to deprioritize under time pressure.