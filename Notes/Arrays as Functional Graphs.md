<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

#### Refs:-
[Floyd's Cycle Detection & Duplicate Finding Algorithm (Tortoise and Hare)](Floyd's%20Cycle%20Detection%20&%20Duplicate%20Finding%20Algorithm%20(Tortoise%20and%20Hare).md)

![Drawing 2026-08-16 20.41.48.excalidraw|700](../assets/Images/Arrays%20as%20functional%20graphs%20mind%20map.svg)

Sibling A problems:-
+ [find-all-duplicates-in-an-array](../Problems/find-all-duplicates-in-an-array.md)
+ [first-missing-positive](../Problems/first-missing-positive.md)
## PKM Note: Array-to-Graph Mappings (Elements as Indices)

## 📌 Core Concept: Arrays as Functional Graphs

- The Paradigm Shift: When an array of size $N$ contains integers strictly bounded within a fixed range (usually $[0, N]$ or $[1, N]$), the array can be modeled as a Directed Functional Graph.
- The Mapping Rule: Each index $i$ represents a graph node. The value sitting at that index, $nums[i]$, represents a directed edge pointing to the next node: $i \rightarrow nums[i]$.
- Why It Matters: This structural insight unlocks $O(N)$ time and $O(1)$ auxiliary space complexities. It bypasses the need for traditional `HashSets` or `HashMaps` by reusing the array’s own memory infrastructure.

```unset
                  ┌────────────────────────────────────────┐
                  │  Domain: Arrays as Functional Graphs   │
                  │       (Values Map to Indices)          │
                  └───────────────────┬────────────────────┘
                                      │
                  ┌───────────────────┴────────────────────┐
                  │                                        │
    ┌─────────────▼─────────────┐            ┌─────────────▼─────────────┐
    │ Sibling A: In-Place State │            │ Sibling B: Floyd's Cycle  │
    │ Mutation & Cyclic Sort    │            │         Detection         │
    └───────────────────────────┘            └───────────────────────────┘
```

---

## 🌿 Sibling A: In-Place State Mutation & Cyclic Sort

This branch treats the array as a mutable map where you aggressively mark states or physically swap elements into their mathematically correct addresses.

## Sub-Pattern 1: Sign Flipping (Implicit State Marking)

- Mechanism: Iterate through the array. For every value $X$, treat $\vert{}X\vert{} - 1$ as a target index. Flip the number residing at that target index to a negative sign (`nums[target] *= -1`).
- Significance: The sign acts as a 1-bit boolean flag ("Visited"). A positive value remaining at the end indicates that its corresponding index was never visited.
- Example: `nums = [2, 1, 1]` (Size 3)
    
    - $i = 0 \rightarrow$ value is `2`. Target index = $2 - 1 = 1$. Flip `nums[1]` $\rightarrow [2, -1, 1]$.
    - $i = 1 \rightarrow$ value is `|-1| = 1`. Target index = $1 - 1 = 0$. Flip `nums[0]` $\rightarrow [-2, -1, 1]$.
    - $i = 2 \rightarrow$ value is `1`. Target index = $1 - 1 = 0$. `nums[0]` is already negative! 💥 Duplicate found: 1.
    
- Target Problems:
    
    - _LeetCode 442: Find All Duplicates in an Array_ (Meta, Amazon)
    - _LeetCode 448: Find All Numbers Disappeared in an Array_ (Amazon, Google)
    

## Sub-Pattern 2: Cyclic Sort (In-Place Swapping)

- Mechanism: Actively swap elements until every valid positive number sits at its "home index" ($nums[i] == i + 1$ or $nums[i] == i$). Ignore elements out of the boundary range.
- Example: `nums = [3, 4, -1, 1]` (Size 4)
    
    - Index 0 holds `3`. It belongs at index `3-1 = 2`. Swap with `nums[2]`. Array: `[-1, 4, 3, 1]`.
    - Index 0 holds `-1`. Out of bounds, skip.
    - Index 1 holds `4`. Belongs at index `4-1 = 3`. Swap with `nums[3]`. Array: `[-1, 1, 3, 4]`.
    - Index 1 holds `1`. Belongs at index `1-1 = 0`. Swap with `nums[0]`. Array: `[1, -1, 3, 4]`.
    - Final check scan: Index 1 contains `-1` instead of `2`. 💥 First missing positive is 2.
    
- Target Problems:
    
    - _LeetCode 41: First Missing Positive_ (Meta, Google, Uber)
    - _LeetCode 268: Missing Number_ (Microsoft, Apple)
    - _LeetCode 645: Set Mismatch_ (TikTok)
    

---

## 🌿 Sibling B: Floyd's Cycle Detection (Tortoise & Hare)

This branch views the index-to-value relationship as an unmodifiable pointer trail. It uses two pointers tracking through the implicit graph nodes at different speeds to identify cycles and cycle entry points without altering any data.

- Mechanism:
    
    - Phase 1: Move `slow` by one step (`slow = nums[slow]`) and `fast` by two steps (`fast = nums[nums[fast]]`). If they collide, a cycle exists.
    - Phase 2: Reset `slow` to the graph origin. Move both `slow` and `fast` at a uniform speed of one step at a time. The precise node where they meet again is the mathematical entrance to the cycle.
    
- Example: `nums = [1, 3, 4, 2, 2]` (Indices: 0 to 4)
    
    - Graph edges: $0 \rightarrow 1 \rightarrow 3 \rightarrow 2 \rightarrow 4 \rightarrow 2$ (Note the cycle loop between indices 2, 4, and 3).
    - Phase 1: Pointers advance through indices. They collide at index 4.
    - Phase 2: Reset `slow` to 0. Move both 1 step at a time.
        
        - `slow` goes $0 \rightarrow 1 \rightarrow 2$
        - `fast` goes $4 \rightarrow 2$
        
    - Collision occurs at index `2`. 💥 Duplicate found: 2.
    
- Target Problems:
    
    - _LeetCode 287: Find the Duplicate Number_ (Netflix, Amazon, Google) — _The classic array-to-Floyd conversion._
    - _LeetCode 142: Linked List Cycle II_ (Microsoft, Uber)
    - _LeetCode 202: Happy Number_ (Netflix, Meta) — _Implicit function-driven state cycle._
    

---

## ⚔️ Summary Strategy: How to Choose?

|Scenario Requirement|Use Sibling A (Mutation/Cyclic Sort)|Use Sibling B (Floyd's Algorithm)|
|---|---|---|
|Array Mutability|Read-Write allowed (can flip signs or swap elements).|Strictly Read-Only array constraints.|
|Problem Type|Finding _multiple_ missing or _multiple_ duplicate items.|Finding exactly _one_ cycle entry point or duplicate.|
|Data Conditions|Elements can be outside the range $[1, N]$ (ignored).|All elements must form safe, valid index jumps.|

---


