---
Title: Print First N Numbers Formed Using a Given Digit Set
Companies:
  - Not Specified
Topics:
  - Queue
  - Maths
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - GFG
  - BFS
  - Digits
Link: ""
Rating:
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Print First N Numbers Formed Using a Given Digit Set

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
queue.push_all(sorted_digits)   // e.g. "5", "6"

for count in 0..N:
    curr = queue.pop_front()
    print(curr)
    for d in sorted_digits:
        queue.push(curr + d)
```


---

---



# Print First N Numbers Formed Using a Given Digit Set

## Problem

Given a set of digits (e.g. `{5, 6}`), print the first `N` numbers, in increasing order, whose digits are drawn only from that set.

Example with `{5, 6}`: `5, 6, 55, 56, 65, 66, 555, 556, 565, 566, 655, 656, 665, 666, ...`

Not the same as generating permutations of a fixed digit count — length grows unbounded, and shorter numbers always precede longer ones.

## Core idea

Model this as an **implicit tree**: the root has one child per digit, and every node `X` has children `X + d` for each digit `d` in the set. Printing the first `N` numbers in increasing order = **level-order (BFS) traversal** of this tree.

Why level-order = increasing order:

- A shorter number is always numerically smaller than a longer one → level 1 (1-digit) must fully print before level 2 (2-digit), etc. BFS/queue gives this for free, since a queue is FIFO.
- Within a level, siblings must come out in ascending order too. This is **not automatic** — see precondition below.

## Solution (queue-based BFS)

```
queue.push_all(sorted_digits)   // e.g. "5", "6"

for count in 0..N:
    curr = queue.pop_front()
    print(curr)
    for d in sorted_digits:
        queue.push(curr + d)
```

Trace with `{5, 6}`:

|step|queue before|printed|queue after|
|---|---|---|---|
|1|`[5, 6]`|5|`[6, 55, 56]`|
|2|`[6, 55, 56]`|6|`[55, 56, 65, 66]`|
|3|`[55, 56, 65, 66]`|55|`[56, 65, 66, 555, 556]`|

Each pop generates children that get appended to the _back_ of the queue — since children are always longer (→ larger) than anything currently waiting, they never jump the line. FIFO order **is** sorted order here, for free.

## ⚠️ Critical precondition — easy to miss

**The digit set must be pre-sorted before seeding the queue, and children must always be pushed in that same sorted order.** The queue does not sort anything — it only preserves push order. Two separate guarantees are needed:

1. _Shorter numbers before longer numbers_ — automatic, comes from BFS/queue structure (a parent is always popped before its children exist).
2. _Same-length numbers in ascending order_ — entirely on you; only holds if siblings are pushed low-to-high at every level.

If you push digits out of order (e.g. `6` before `5`), the output is not sorted — the algorithm still "works" mechanically, it just no longer answers the problem.

## Is this "queue" or "BFS"?

Both — different lenses on the same mechanism:

- **Mechanically**: a plain queue, used purely for its FIFO property.
- **Conceptually**: BFS / level-order traversal on an infinite implicit tree that is _generated on demand_ rather than pre-existing.

### Construction vs. traversal — the key distinction

This is **generation-style BFS**: the search space doesn't exist until you build it, and the queue's job is to guarantee output order.

Contrast with **traversal-style BFS** (Rotting Oranges, 01 Matrix, Walls and Gates): the structure (grid/graph) already exists, and the queue's job is to track the unvisited frontier.

Same data structure, opposite purpose — worth keeping distinct mentally until both are independently solid, so as not to blur "why queue" intuition.

## Variations / similar problems

**Same skeleton, closest LeetCode match:**

- **Generate Parentheses (LC 22)** — tree where each node's children are `node+"("` and `node+")"` (with a validity constraint pruning invalid branches). Usually taught/solved via backtracking, but the queue/BFS version works identically — good for seeing this pattern in interview-recognized form.
- **Binary Numbers 1 to N** (GfG) — literally this same problem with digit set `{0, 1}`. Redundant practice if you've already internalized the {5,6} version.
- **Letter Combinations of a Phone Number (LC 17)** — same generation skeleton but branching factor varies per position (3–4 letters per digit) and depth is fixed (= input length) rather than open-ended (first N results). Good next step to see the pattern generalize beyond a fixed 2-way branch.

**Related but requires a different tool (heap, not plain queue):**

- **Ugly Number II (LC 264)**, **Super Ugly Number (LC 313)** — surface resemblance ("generate numbers from a set"), but here you're _merging multiple independent sorted streams_ (×2, ×3, ×5, ...) rather than branching one tree with a fixed sort order. No single push-order guarantees global sorted output across independent streams, so a **min-heap** (re-sorts at every step) is required instead of a plain queue. This is the precise reason the {5,6}-digit problem can get away with a queue and Ugly Number II cannot.

## Defer until formal BFS pass

These train **traversal-style** BFS (discovering an existing structure) — intentionally different muscle from this problem's **generation-style** BFS. Do them once this problem's pattern is fully internalized, not before, to avoid blurring the two mental models together:

- Rotting Oranges (994), Walls and Gates (286), 01 Matrix (542) — multi-source grid BFS
- Course Schedule (207), Course Schedule II (210) — topological sort (Kahn's)
- Binary Tree Level Order Traversal (102) — canonical level-order traversal

## One-line summary

Level-order BFS over an on-demand-generated tree gives sorted output for free _only if_ the branching digits/elements are pushed in sorted order — the queue guarantees depth-ordering automatically, but sibling-ordering is the caller's responsibility.