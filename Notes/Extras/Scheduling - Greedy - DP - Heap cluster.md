---
tags:
  - Greedy
  - Heap
  - DP
  - Scheduling
  - Sorting
---

🔗 Links :-
+ [Intervals & Ranges Pattern (Sorting)](../Intervals%20&%20Ranges%20Pattern%20(Sorting).md)


Decision map

| What you have                            | Technique                                           |
| ---------------------------------------- | --------------------------------------------------- |
| Unweighted, maximize count of jobs       | Greedy, sort by **end time**                        |
| Weighted (profit), no overlap allowed    | **DP** + binary search (1235)                       |
| Deadlines, unit time, maximize profit    | Greedy by profit + slot assignment (DSU or heap)    |
| Deadlines with durations, maximize count | Greedy with **max-heap**, drop the longest (630)    |
| Limited workers/rooms, jobs overlap      | **Heap of end times** or sweep line                 |
| Cooldowns / idle time between same tasks | Greedy on frequency (621)                           |
| Ordering to minimize total cost          | **Exchange-argument sort** with a custom comparator |

---
You're right that it's a large area, but one correction to the mental model first: "job sequencing" isn't one problem with variations. It's a **cluster of scheduling problems that use different techniques**, and the two you recalled are actually in _different_ families. Sorting them out is the useful part.

## The two you recalled

- **1235 Maximum Profit in Job Scheduling:** this is **DP** (sort by end time, then for each job binary search the last compatible job, `dp[i] = max(skip, profit + dp[prev])`). It's **weighted interval scheduling**, and greedy fails here because profit breaks the "earliest end time is always safe" argument.
- **871 Minimum Number of Refueling Stops:** this is **greedy with a max-heap** (drive as far as you can, and only when stuck, retroactively "take" the biggest fuel station you passed). There's a DP solution too. It's an interesting one but isn't really job sequencing; it shares the "defer a decision, fix it with a heap" mechanic.

So neither is the textbook Job Sequencing with Deadlines (below). The area is wide precisely because different constraints flip the technique.

## The decision map: what the problem gives you decides the tool

| What you have                            | Technique                                           |
| ---------------------------------------- | --------------------------------------------------- |
| Unweighted, maximize count of jobs       | Greedy, sort by **end time**                        |
| Weighted (profit), no overlap allowed    | **DP** + binary search (1235)                       |
| Deadlines, unit time, maximize profit    | Greedy by profit + slot assignment (DSU or heap)    |
| Deadlines with durations, maximize count | Greedy with **max-heap**, drop the longest (630)    |
| Limited workers/rooms, jobs overlap      | **Heap of end times** or sweep line                 |
| Cooldowns / idle time between same tasks | Greedy on frequency (621)                           |
| Ordering to minimize total cost          | **Exchange-argument sort** with a custom comparator |

## Families, ranked by interview value

**1. Deadline scheduling with a heap (highest value, the real "job sequencing")**

- **Course Schedule III (630):** sort by deadline, take each course, and if total time exceeds the deadline, **drop the longest one taken so far** via max-heap. This is the textbook deadline-scheduling problem and it's a favorite hard-ish greedy.
- **Job Sequencing with Deadlines (GfG, your course version):** unit-time jobs with profits; sort by profit descending, place each in the latest free slot at or before its deadline. The "find latest free slot" step can be a linear scan, or a **DSU** (union a used slot with the one before it) for near-O(1). That DSU trick links directly to your DSU note.
- Maximum Number of Events That Can Be Attended (1353): sort by start, heap of end times, always attend the event ending soonest.
- IPO (502): same "heap of currently available options" shape.

**2. Weighted interval scheduling: DP (high value)**

- **Maximum Profit in Job Scheduling (1235):** the template.
- Maximum Earnings From Taxi (2008), Maximum Number of Events That Can Be Attended II (1751, at most k events) are the same DP with a variation.
- Two Best Non-Overlapping Events (2054): sort plus a running max, a light version.

**3. Resource allocation: heap or sweep line (high value)**

- **Meeting Rooms II (253)**, **Meeting Rooms III (2402)**
- Car Pooling (1094), My Calendar I/II/III (729, 731, 732)
- Minimum Number of Refueling Stops (871)
- The shared idea: overlapping intervals compete for limited resources, and a min-heap of end times (or a difference array) tracks who's free.

**4. Cooldown / frequency scheduling (medium-high value)**

- **Task Scheduler (621)**, Reorganize String (767), Rearrange String k Distance Apart (358)
- Greedy on the most frequent task; the formula-vs-heap solutions are both worth knowing.

**5. Ordering for minimum cost: exchange-argument sorts (medium value, high learning value)**

- Sort by a comparator that you derive by swapping two adjacent items and asking which order is cheaper.
- **Largest Number (179)**, **Minimum Number of Refueling Stops (871)** conceptually, Minimum Time to Finish All Jobs (1723, backtracking, a contrast case)
- Classic textbook cousins: minimize total weighted completion time (sort by weight/duration ratio), minimize maximum lateness (sort by deadline, "Earliest Deadline First"). These rarely appear as named LC problems but teach the exchange-argument skill directly.

**6. Multi-worker assignment (medium value, harder)**

- Minimum Number of Work Sessions to Finish the Tasks (1986, bitmask DP), Find Minimum Time to Finish All Jobs (1723), Parallel Courses III (2050, topological sort with longest path).
- These are typically **DP or graph**, not greedy, and worth knowing exist rather than drilling.

## The transferable mental steps

Most of this area reduces to a short checklist:

1. **Is there a profit or weight?** If yes and jobs can't overlap, greedy by end time fails, so think DP.
2. **Is there a deadline?** If yes, sort by deadline and use a heap to _undo_ the worst choice made so far (630).
3. **Are there limited resources?** Sweep line or heap of end times.
4. **Do only the order and cost matter?** Derive a comparator via an exchange argument.

The recurring greedy upgrade is the **heap as an undo button**: take everything tentatively, and when a constraint breaks, remove the worst item taken. You've seen it in Furthest Building (1642), 871, and 630.

## Where to spend time

If you have limited time: **630, 1235, 253, 1353, 621**, plus the textbook deadline version from your course. That covers deadline greedy, weighted DP, resource allocation, and event attendance. Category 6 can wait.

## Suggested drill order

1. Job Sequencing with Deadlines (your course version): understand the slot-assignment idea, then try the DSU speedup
2. Non-overlapping Intervals (435): confirm the unweighted end-time greedy
3. Maximum Profit in Job Scheduling (1235): see exactly why greedy breaks with profits
4. Course Schedule III (630): the heap-as-undo pattern
5. Maximum Number of Events That Can Be Attended (1353)
6. Meeting Rooms II (253) → Meeting Rooms III (2402)
7. Minimum Number of Refueling Stops (871), as the second heap-as-undo example
8. Largest Number (179) for the comparator/exchange-argument skill

One caveat: I'm confident about the technique assignments above, but verify the exact constraints on 1751 and 2054 when you reach them, since I'm summarizing from memory.

