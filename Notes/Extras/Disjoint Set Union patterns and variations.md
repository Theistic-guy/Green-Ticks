
Union-Find is one of the highest-leverage topics to get precise on, because the _implementation_ barely changes across problems — what changes is **what you're unioning and why**. That's the actual skill being tested, not the template.

## Core idea

Reach for DSU when a problem is fundamentally about **grouping elements into connected components and answering "are these two in the same group" or "how many groups exist," especially when the grouping changes over time (unions happen incrementally)**. If the graph is static and you only need one traversal, plain BFS/DFS is often simpler — DSU's edge is when you need **repeated, incremental** connectivity queries, or when you're processing edges/unions in a specific order (sorted, streamed, etc.) and want near-O(1) amortized merge/find.

**Mandatory baseline before any pattern below:** Union by Rank/Size + Path Compression. Without both, DSU degrades to O(n) per operation and defeats the purpose. This isn't a "variation" — it's table stakes; internalize it once and stop thinking about it.

---

## 1. Basic Connectivity / Component Counting (foundation — do first)

Straightforward: union given pairs, then answer "how many components" or "are X and Y connected."

- **Number of Provinces (547)** — the template; unions come from an adjacency matrix
- Number of Connected Components in an Undirected Graph (323)
- Graph Valid Tree (261) — connectivity + edge-count check (n-1 edges, no cycle)
- Redundant Connection (684) — **first real "aha"**: the redundant edge is exactly the one that tries to union two nodes already in the same set (cycle detection via DSU instead of DFS)

**Why this matters beyond itself:** Redundant Connection is the cleanest illustration of DSU's core superpower — detecting a cycle in O(1) amortized per edge, without building/traversing a graph at all.

---

## 2. Grid/2D Connectivity (high ROI — DSU as grid-traversal alternative)

Same connectivity idea, but cells are nodes, indexed via `row * cols + col`. Interviewers use this to test whether you can _see_ DSU as an option when the problem doesn't look like a graph at all.

- **Number of Islands II (305)** — online/incremental version of Number of Islands; each land-addition is a union with neighboring land, and you need running component count — this is where DSU actually beats BFS/DFS, since re-running BFS after every addition would be far more expensive
- Surrounded Regions (130) — solvable with DSU (union all border-connected cells to a virtual "safe" node) as an alternative to the standard DFS approach
- Making A Large Island (827) — union existing land, then for each water cell, check which distinct components it would bridge if flipped

**Why high ROI:** grid problems are extremely common, and recognizing "this is secretly a DSU problem, not just a BFS problem" is a real differentiator — especially for **Number of Islands II**, where DSU isn't just an alternative, it's the _right_ tool because of the incremental/online nature.

---

## 3. Kruskal's MST / Edge-Sorting + Union (high ROI — DSU's other headline use)

Sort edges by weight, greedily union endpoints, skip if already connected (would form a cycle). This is literally Kruskal's algorithm — DSU is the mechanism that makes greedy edge selection O(E log E) instead of needing full cycle-detection traversals.

- **Min Cost to Connect All Points (1584)** — build all pairwise edges (Manhattan distance), Kruskal's with DSU
- Connecting Cities With Minimum Cost (1135)
- Number of Operations to Make Network Connected (1319) — count redundant edges (extra unions where both nodes already connected) vs. isolated components; redundant-edge count must be ≥ remaining components to succeed

**Why high ROI:** MST-via-Kruskal is a named algorithm interviewers expect you to _recognize_, not derive from scratch — and DSU is inseparable from it. If "minimum cost to connect everything" appears, this pattern should fire immediately.

---

## 4. Union by Condition / Constraint Satisfaction (medium-high ROI — DSU as a validity-checker)

Instead of pure connectivity, you union under a **domain-specific equivalence rule**, then check for contradictions.

- **Accounts Merge (721)** — union accounts sharing any email; classic "group by shared attribute" DSU use
- Satisfiability of Equality Equations (990) — union all `==` pairs first, then verify no `!=` pair ended up in the same component (contradiction check)
- Evaluate Division (399) — technically weighted-union-find (each edge carries a ratio) — a genuine step up in difficulty; also solvable via BFS/DFS, but weighted DSU is the "elegant" solution

**Why worth knowing separately:** this category trains you to see DSU where the problem is phrased as "these things are equivalent/related," not literally "these are graph nodes." That reframing is often the whole difficulty of the problem.

---

## 5. Smallest/Largest Element Tracking per Component (medium ROI — augmented DSU)

Store extra metadata at each root (min, max, size, sum) and update it during union — DSU nodes aren't just "who's my parent," they carry payload.

- Smallest String With Swaps (1258) — union indices connected by allowed swaps, then sort characters within each component
- **Most Stones Removed with Same Row or Column (947)** — components collapse to (component_size - 1) removable stones; union stones sharing a row or column
- Similar String Groups (839) — union-find where "edge" = "strings differ by ≤ 2 swaps"

**Why medium ROI:** less about a new mechanic, more about realizing DSU can carry arbitrary state per component — this unlocks a wider problem surface once you see it.

---

## 6. Offline Queries Processed via Union-Find (medium ROI, "clever" category — appears in harder sets)

Queries are answered by **reordering** them (often by sorting) and processing unions incrementally as you go — the "offline" trick.

- Number of Islands II is a mild version of this (already listed above)
- Longest Consecutive Sequence (128) — solvable with DSU (union adjacent numbers) though the hash-set approach is simpler/expected; worth knowing DSU works here for pattern-recognition completeness, not as the primary solution
- **Accounts Merge**-style "merge-then-answer" problems generalize into this bucket

**Verdict:** don't over-invest here — mostly a "recognize it's possible" category rather than a primary technique to drill.

---

## ROI Verdict

**Number of Provinces (547) → Redundant Connection (684) → Number of Islands II (305)** covers the foundational "aha" moments (basic connectivity, cycle detection, online/incremental superiority) that every other pattern builds on. **Min Cost to Connect All Points (1584)** is non-negotiable for Kruskal's recognition. **Accounts Merge (721)** and **Satisfiability of Equality Equations (990)** are the most commonly cited "DSU disguised as something else" interview questions — high value for pattern-recognition training specifically.

## Suggested drill order

1. Number of Provinces (547) — confirm template (union by rank + path compression) is automatic
2. Redundant Connection (684) — cycle detection via DSU
3. Number of Islands II (305) — the _incremental_ superpower, this is the "why DSU and not BFS" checkpoint
4. Accounts Merge (721) — grouping-by-attribute reframing
5. Min Cost to Connect All Points (1584) — Kruskal's + DSU combo
6. Satisfiability of Equality Equations (990) — constraint-contradiction checkpoint
7. Evaluate Division (399) — weighted DSU, optional stretch if time allows

