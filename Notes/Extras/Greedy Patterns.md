
---
tags: [dsa, greedy, patterns, faang-prep]
status: reference
related: [intervals, priority-queue, monotonic-stack, dsu, binary-search-on-answer, dp]

---

# Greedy: Pattern Landscape

## Core idea
Make the locally best choice at each step and never revisit it. This is valid only when two properties hold:
- **Greedy-choice property**: a locally optimal pick can be extended to a globally optimal solution.
- **Optimal substructure**: what remains after the pick is the same kind of problem.

The skill is not coding greedy (usually short). It's **choosing what to sort or prioritize by, and justifying why that ordering is safe.** Most wrong greedy solutions fail on the criterion, not the loop.

**Exchange argument** (the standard justification): take any optimal solution that disagrees with your greedy pick, swap the greedy pick in, and show it's no worse. If you can't sketch this, be suspicious.

## Identification
- The problem asks for a min/max/feasibility, and a sorted order or a "best available now" choice looks natural.
- Constraints are large (n up to 10^5), which rules out exponential search and often signals O(n log n).
- Keywords: "minimum number of", "maximum number of", "can you reach", "earliest/latest".
- Stress test: try a tiny counterexample before committing. If greedy survives 3-4 hand-built cases, sketch the exchange argument.

## Greedy vs DP (the boundary)
| Signal | Likely |
|---|---|
| One choice per step is provably safe | Greedy |
| Choices interact, best local pick can hurt later | DP |
| Counterexample found on small input | Not greedy |

Canonical pairs: **Fractional Knapsack is greedy, 0/1 Knapsack needs DP.** **Coin Change (322)** works greedily for US denominations but fails for arbitrary ones. If greedy feels too easy for an optimization problem, look for a counterexample.

---

## 1. Interval Scheduling: sort by end time (highest ROI)
Take the earliest-finishing compatible interval; it leaves the most room for the rest. This is Activity Selection and the cleanest exchange-argument example.
- **Non-overlapping Intervals (435)**: min removals = n minus max compatible set
- **Minimum Number of Arrows to Burst Balloons (452)**
- Video Stitching (1024), Minimum Number of Taps to Open to Water a Garden (1326): interval-covering versions
- Adjacent, not pure greedy: Merge Intervals (56), Insert Interval (57), Meeting Rooms II (253, sweep or heap). Cross-link to your Intervals note.

## 2. Reachability / Farthest-Reach
Track the furthest reachable position; never look back.
- **Jump Game (55)**, **Jump Game II (45)** (BFS-in-disguise with a reach window)
- **Gas Station (134)**: if total gas ≥ total cost a solution exists; reset the start whenever the tank goes negative
- Car Pooling (1094): sweep of capacity changes

## 3. Sort + Match / Two-Pointer
Sort one or both sides, then pair greedily.
- **Assign Cookies (455)**
- **Boats to Save People (881)**: heaviest with lightest
- **Maximum Units on a Truck (1710)**: sort by value density (the Fractional Knapsack idea)
- **Bag of Tokens (948)**: spend low, gain with high
- Two City Scheduling (1029): sort by cost difference
- Queue Reconstruction by Height (406): sort by height desc, insert by k; a proof-heavy "why does this work" problem

## 4. Priority-Queue Greedy (very high ROI)
Always take the best currently available option; a heap maintains "available" as it changes. The heap lets you **defer** a decision and correct it later.
- **Task Scheduler (621)**: greedy on max frequency
- **Reorganize String (767)**, Rearrange String k Distance Apart (358)
- **IPO (502)**: repeatedly take the most profitable affordable project
- **Meeting Rooms II (253)**, Minimum Cost to Connect Sticks (1167)
- Furthest Building You Can Reach (1642): regret-style heap
- **Hand of Straights (846)**, Divide Array in Sets of K Consecutive Numbers (1296): start from the smallest remaining card via counter or heap

## 5. Monotonic-Stack Greedy
Build the best sequence by removing earlier elements when a better one arrives, under a budget. Overlaps your stack note.
- **Remove K Digits (402)**
- **Remove Duplicate Letters (316)**
- Create Maximum Number (321): hard composite

## 6. Partition / Counting / Scan Greedy
- **Partition Labels (763)**: extend the partition to the last occurrence of each seen character
- **Best Time to Buy and Sell Stock II (122)**: sum every positive difference
- **Candy (135)**: two passes (left-to-right, then right-to-left)
- **Valid Parenthesis String (678)**: track a range of possible open counts
- **Wiggle Subsequence (376)**: count direction changes; greedy beats DP here
- **Increasing Triplet Subsequence (334)**: track two smallest candidates, O(1) space
- Lemonade Change (860)
- Minimum Add to Make Parentheses Valid (921), Minimum Remove to Make Valid Parentheses (1249): counter-based
- Minimum Deletions to Make Character Frequencies Unique (1647): greedy decrement with a set
- Maximum Subarray (53): Kadane's, greedy or DP depending on framing

## 7. Merge-Cheapest-First (Huffman)
Repeatedly combine the two smallest items with a heap.
- Minimum Cost to Connect Sticks (1167): Huffman's structure
- Huffman coding: understand conceptually; full encoder rarely asked

## 8. Greedy as a Feasibility Check
Not pure greedy: **binary search on the answer**, where the check function is greedy. Links to your binary-search-on-answer notes.
- **Capacity to Ship Packages Within D Days (1011)**
- **Split Array Largest Sum (410)**
- Koko Eating Bananas (875)

## Graph algorithms that are greedy (from the course slide)
Belong in graph study; listed for completeness.
- **Dijkstra's**: Network Delay Time (743), Cheapest Flights Within K Stops (787). Heavily asked.
- **Kruskal's**: Min Cost to Connect All Points (1584), see your DSU note.
- **Prim's**: same problems as Kruskal's via a heap.

## Slide items by interview value
| Item | Value |
|---|---|
| Activity Selection | High (category 1) |
| Dijkstra's / Kruskal's / Prim's | High, but graph and DSU topics |
| Huffman Coding | Medium, via Connect Sticks |
| Fractional Knapsack | Low, but Maximum Units on a Truck is its LC form |
| Job Sequencing with Deadlines | Low as named; the idea lives in categories 1 and 4 |
| TSP approximation | ~Zero; only the standard example of "greedy gives close-to-optimal, not optimal" |

## Caveats
- **Wrong criterion**: sorting by start time or length instead of end time in interval problems.
- **No proof**: greedy that "looks right" but has a counterexample; always test small cases.
- **Ties**: tie-breaking rules matter (e.g. Queue Reconstruction sorts by height desc then k asc).
- **Greedy hiding DP**: Coin Change, 0/1 Knapsack, and Longest Increasing Subsequence look greedy but need DP.
- **Coverage limit**: greedy problems are defined by a proof idea, not a surface pattern, so any problem list is a sample. Company-tagged lists show real frequency.

## ROI verdict
Categories **1 to 4** carry most of the value: interval scheduling, reachability, sort-and-match, heap greedy. Category 8 is worth recognizing because it converts hard-looking problems into binary search plus a simple check.

## Suggested drill order
1. Non-overlapping Intervals (435) → Minimum Arrows (452)
2. Jump Game (55) → Jump Game II (45) → Gas Station (134)
3. Assign Cookies (455) → Boats (881) → Maximum Units on a Truck (1710)
4. Task Scheduler (621) → Reorganize String (767) → IPO (502)
5. Partition Labels (763), Candy (135), Hand of Straights (846)
6. Wiggle Subsequence (376), Increasing Triplet (334)
7. Capacity to Ship Packages (1011): greedy check inside binary search
8. Queue Reconstruction by Height (406): proof-heavy stretch
9. Coin Change (322): as a **counterexample exercise**; try greedy, find where it breaks

## One-line summary
Greedy is choosing the right thing to sort or prioritize by, then proving with an exchange argument (or a failed counterexample search) that the local pick is globally safe.