

#intervals, #sorting, #greedy 

# Intervals / Ranges Pattern

## Why this is its own pattern

Every interval problem starts from the same fork in the road: you have a bunch of `[start, end]` pairs and unordered comparisons between all of them is O(n²). Sorting collapses that. Once sorted (by start, or sometimes by end — the choice _is_ the design decision), the problem becomes a linear sweep where you only ever compare the current interval against **one running value** (last merged end, heap top, count of active rooms). That's the entire trick space of this pattern: sort to impose an order that makes a greedy/linear pass valid, then define what invariant you track during the sweep.

This is why it falls out of a Sorting module rather than being taught as "just another array pattern" — the sort isn't preprocessing, it's the proof mechanism. Once you sort by start, you get a free guarantee: any interval that could overlap the current one must appear at or before it in iteration order. That guarantee is what license you to do a single pass instead of pairwise checks.

## The one invariant that generates ~80% of these problems

For two intervals `A = [a_start, a_end]` and `B = [b_start, b_end]` where `a_start ≤ b_start` (i.e. sorted by start):

> **A and B overlap iff `b_start ≤ a_end`.**

Everything downstream is a variation of: what do you _do_ when this is true vs false, and what do you sort by to make the check meaningful for your specific question.

## Why sort-by-start vs sort-by-end matters

This is the fork most people get wrong, and it maps directly to what you already know from 3-way partitioning — "what does this ordering guarantee me":

- **Sort by start** → answers questions about _merging/combining_ things that touch each other, or about _how many things are active at once_ (you're reconstructing timeline order).
- **Sort by end** → answers questions about _greedy selection_ — picking the max number of non-conflicting things, or removing the fewest to eliminate conflict. The classic exchange argument: the interval that finishes earliest leaves the most room for everything after it, so greedily keeping it is never worse than any other choice. This is the same family of reasoning as activity selection.

If you only remember one thing: **merging = sort by start, selecting/scheduling = sort by end.**

---

## Method 1 — Sort + Linear Merge Sweep

**Used for:** merging overlapping ranges into a minimal set, inserting into a sorted set.

```
sort by start
result = [intervals[0]]
for interval in intervals[1:]:
    last = result[-1]
    if interval.start <= last.end:      # overlap — extend
        last.end = max(last.end, interval.end)
    else:                               # gap — new group
        result.append(interval)
```

The `max(last.end, interval.end)` is the detail people drop — a fully-contained interval (`[1,10]` then `[2,3]`) must not shrink your merged end.

**Problems:**

- Merge Intervals (LC 56)
- Insert Interval (LC 57) — same sweep, but split into three phases: intervals fully before, intervals overlapping (merge them all into one), intervals fully after. Avoid re-sorting; the input is already sorted.
- Interval List Intersections (LC 986) — two-pointer over two _already sorted_ lists, intersection = `[max(starts), min(ends)]` when it's non-empty, advance whichever interval ends first.

## Method 2 — Sort by End + Greedy Selection

**Used for:** maximum non-overlapping subset / minimum removals to make non-overlapping.

```
sort by end
count = 1
last_end = intervals[0].end
for interval in intervals[1:]:
    if interval.start >= last_end:      # no conflict — keep it
        count += 1
        last_end = interval.end
    # else: conflict — always discard the current one (never the kept one),
    # because it ends later or equal by sort order
```

The exchange-argument proof: among all conflicting intervals, keeping the one with the smallest end can never do worse than keeping any other, because it leaves the most room for future picks. This is why you never need to "undo" a greedy choice here.

**Problems:**

- Non-overlapping Intervals (LC 435) — `answer = n - count_kept`
- Minimum Number of Arrows to Burst Balloons (LC 452) — identical structure, arrows = groups of mutually-overlapping intervals, `start >= last_end` becomes strict-vs-non-strict depending on whether touching endpoints count (read constraints carefully — this is a common off-by-one)
- Maximum number of non-overlapping intervals — same as 435 phrased positively

## Method 3 — Sweep Line / Active-Count Tracking

**Used for:** "how many things are happening at the same time" — the moment sorting-by-start alone doesn't give you a merge, but a _concurrent count_.

Two equivalent implementations:

**(a) Two sorted arrays + two pointers** (starts[], ends[], each sorted independently):

```
sort starts[], sort ends[]
i = j = rooms = max_rooms = 0
while i < n:
    if starts[i] < ends[j]:
        rooms += 1; i += 1
    else:
        rooms -= 1; j += 1
    max_rooms = max(max_rooms, rooms)
```

**(b) Min-heap of end times** (more general — use when you need to know _which_ room/resource, not just the count):

```
sort by start
heap = []  # end times of currently occupied rooms
for interval in intervals:
    if heap and heap[0] <= interval.start:
        heappop(heap)               # free up the earliest-ending room
    heappush(heap, interval.end)
return len(heap)
```

**Problems:**

- Meeting Rooms (LC 252) — boolean version, can you attend all? Just check for any overlap after sorting by start.
- Meeting Rooms II (LC 253) — min rooms needed → either method above.
- My Calendar I / II / III (LC 729/731/732) — same active-count idea but online (one insert at a time) rather than batch, so you can't fully sort upfront — often solved with a sorted structure (TreeMap-equivalent) or brute-force overlap check with tolerance for "double-booking allowed" in II.
- Car Pooling (LC 1094) — sweep line with a delta array / difference array instead of a heap: `+passengers` at start, `-passengers` at end, prefix-sum and check capacity.

## Method 4 — Difference Array / Delta Encoding

**Used for:** range-add-then-query type problems where events are `[start, end, value]` and you need the value at every point, without a heap.

```
diff = defaultdict(int)
for start, end, val in events:
    diff[start] += val
    diff[end]   -= val
# sort diff keys, prefix-sum sweep to reconstruct the timeline
```

This is worth knowing as a _separate tool from the heap_, not a variant of it — it trades "give me the count/value at every point" for O(n log n) instead of O(n log n) with heap overhead, and generalizes better when values aren't just +1/-1 (e.g. Car Pooling's passenger counts).

**Problems:**

- Car Pooling (LC 1094)
- Range Addition (LC 370)
- Corporate Flight Bookings (LC 1109)

---

## Full categorized problem set

|Category|Problem|Sort key|Core idea|
|---|---|---|---|
|Merge|Merge Intervals (56)|start|linear merge sweep|
|Merge|Insert Interval (57)|(pre-sorted)|3-phase split, no re-sort|
|Merge|Interval List Intersections (986)|(pre-sorted, both lists)|two-pointer intersection|
|Greedy select|Non-overlapping Intervals (435)|end|keep smallest-end on conflict|
|Greedy select|Min Arrows to Burst Balloons (452)|end|same as 435, watch strict `<` vs `<=`|
|Concurrency|Meeting Rooms (252)|start|any overlap check|
|Concurrency|Meeting Rooms II (253)|start|heap or two-pointer active count|
|Concurrency (online)|My Calendar I/II/III (729/731/732)|n/a — incremental|ordered structure or brute force|
|Delta/diff array|Car Pooling (1094)|event time|+/- delta, prefix sum vs capacity|
|Delta/diff array|Range Addition (370)|n/a|diff array construction|
|Delta/diff array|Corporate Flight Bookings (1109)|n/a|diff array, range update|
|Misc / harder|Employee Free Time (759)|start (flatten all first)|merge sweep, then find gaps between merged blocks|
|Misc / harder|Merge Intervals variant — Teemo Attacking (495)|(given order)|pairwise gap check, degenerate merge|

## Recommended study order (why this order)

1. **Merge Intervals (56)** — establishes the core sweep and the `max(last.end, interval.end)` gotcha.
2. **Insert Interval (57)** — forces you to reason about the sweep without a full re-sort, tests whether you actually understood _why_ sort-by-start works, not just memorized the loop.
3. **Meeting Rooms (252) → Meeting Rooms II (253)** — introduces the active-count idea; II is the first place you need a heap, natural bridge from your sorting/DNF work into heap-based sweep.
4. **Non-overlapping Intervals (435) → Min Arrows (452)** — the sort-by-end fork. Doing these back to back is the fastest way to internalize _why_ the sort key flips for greedy-selection problems vs merge problems.
5. **Interval List Intersections (986)** — cheap, fast pattern-recognition win once merge is solid.
6. **Car Pooling (1094) → Corporate Flight Bookings (1109)** — introduces diff arrays as a distinct tool.
7. **My Calendar I/II/III** — the online variant, good test of whether you can adapt the offline sweep idea when you don't get to sort everything upfront.
8. **Employee Free Time (759)** — combines flattening + merge + gap-finding, good "boss fight" to confirm you've actually internalized methods 1–3.

## Common bugs / edge cases to bake into your notes

- **Touching endpoints**: `[1,4]` and `[4,5]` — do they "overlap"? Depends on the problem's definition (real-valued time vs discrete meeting slots). Always check whether the comparison should be `<` or `<=`.
- **Empty input / single interval**: sweep loops that start at index 1 assuming `intervals[0]` exists will crash on `[]`.
- **Un-sorted output requirement**: some variants want output in original input order, not sorted order — don't discard the original index if so.
- **Overflow of the merge, not just comparison**: forgetting `max()` when merging ends (a nested interval shrinking the merged range) is the single most common Merge Intervals bug.