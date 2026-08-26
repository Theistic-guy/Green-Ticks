<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Merge Sort — Patterns, Variations & Problem-Breakdown Framework

## 1. Why Merge Sort Matters Beyond "Sorting"

Merge sort's real interview value isn't the sort itself — it's the **merge step as a cross-half comparator**. Every variation below reuses the same skeleton: split the array, recursively solve halves, then do _work_ while merging two sorted halves. The sort is a side effect; the augmented merge is the answer.

This is why merge sort shows up more in FAANG rounds than quicksort: quicksort's partition step doesn't give you a clean "two sorted sequences, compare across them" moment. Merge sort does — deterministically, every time, at every level of recursion.

**Core invariant to internalize:** at the point you're merging `left[]` and `right[]`, both are already sorted, and every element in `left` was _originally_ to the left of every element in `right`. That combination — sorted order + preserved original relative position — is what unlocks counting/comparison problems in O(n log n) instead of O(n²).

## 2. Identification Signals

Reach for merge-sort-augmentation when a problem has **this shape**:

- Asks to count or find **pairs (i, j) with i < j** satisfying some comparison condition on `nums[i]` and `nums[j]`.
- Brute force is an obvious O(n²) double loop comparing every pair.
- The condition is a **monotonic/orderable relation** (e.g., `nums[i] > nums[j]`, `nums[i] > 2*nums[j]`) — not an arbitrary predicate. If the condition doesn't respect ordering, sortedness won't help and you likely want a different structure (hashmap, BIT/Fenwick tree).
- You need to know, **for each element, how many elements after it** satisfy some relation — this is the "count smaller/larger to the right" family.
- You need range queries across a static array where **preprocessing all subarrays as sorted structures** helps (Merge Sort Tree).

If you catch yourself thinking "I need to compare every element to every other element after it, but I know sorting helps me skip redundant comparisons" — that's the tell.

Contrast: if the problem needs the _current_ index of the smallest/largest remaining unprocessed element with online updates (not static), that's a heap or BIT problem, not merge sort.

## 3. Pattern Catalog

### 3.1 Vanilla Sort (LC 912 — Sort an Array)

The baseline. Interviewers use this to check clean recursion + merge implementation from scratch (no library sort), including:

- Correct mid calculation (`lo + (hi - lo) / 2` to avoid overflow, though less critical in Python).
- Two-pointer merge with a **stable** tie-break (`left[i] <= right[j]` keeps left-side duplicates first — matters when merge sort is reused for index-sensitive variations below).
- Base case at `lo >= hi`, not `lo == hi`, if you ever call with malformed ranges.

### 3.2 Linked List Merge Sort (LC 148 — Sort List)

Same divide-and-conquer, different mechanics:

- No random access → finding the "mid" needs **slow/fast pointer** traversal, not arithmetic.
- Must explicitly **break the list into two halves** (cut the `next` pointer at slow), or you'll infinite-loop.
- Merge is the same two-pointer logic as array merge, but rebuilds `next` links instead of writing into an array — O(1) extra space for the merge itself (still O(log n) recursion stack).
- This is the pattern that tests whether you actually understand _why_ mid-finding works, since you can't just do `len(arr)//2`.

### 3.3 Counting Inversions (classic — GfG/InterviewBit staple)

👉 [count-inversions-in-array](../Problems/count-inversions-in-array.md)

Count pairs `(i, j)` with `i < j` and `nums[i] > nums[j]`.

- Augment the merge: whenever you take an element from `right[]` **before** exhausting `left[]`, every remaining element in `left[]` forms an inversion with it. Add `len(left) - i` to the count in that instant.
- This is the _template_ for the entire family below — get this one fully internalized (why the count is `len(left) - i`, not `j` or something else) before attempting variations.

### 3.4 Count of Smaller Numbers After Self (LC 315)

Per-index generalization of inversions: for each `nums[i]`, count how many later elements are smaller.

- Key twist: you must **carry original indices** through the recursion (sort `(value, original_index)` pairs), because the answer array is indexed by original position, not final sorted position.
- During merge, same "elements taken from right before left is exhausted" logic — but now you attribute the count to the _specific_ left-side index, not a global counter.

### 3.5 Reverse Pairs (LC 493)

Count pairs `i < j` with `nums[i] > 2 * nums[j]`.

- Looks like inversions but **isn't a drop-in reuse** — the condition `nums[i] > 2*nums[j]` isn't monotonically consistent with the plain merge comparison (`nums[i] > nums[j]`), so you can't count in the same pass you merge.
- Standard solution: **two separate pointer sweeps** in each merge call — one dedicated pass over `left`/`right` just to count using the `2*nums[j]` condition (with a non-resetting pointer, since both arrays are sorted, so the count-pointer only moves forward), _then_ the normal merge pass.
- Watch overflow: use wide integer types for `2 * nums[j]` in languages where it matters.
- This is the problem that separates people who memorized inversions from people who understand _why_ the merge step works — the condition must be re-derived, not pattern-matched.

### 3.6 Merge Sort Tree (competitive programming / less common in FAANG but appears in "range queries" style questions)

Build a segment tree where each node stores the **sorted merge** of its range (not just a sum/min). Enables offline queries like "how many elements ≤ X in range [l, r]" in O(log²n).

- Conceptually: every merge-sort merge step you'd normally discard, you instead **persist** at that tree node.
- Rare as a full expected solution in FAANG-style rounds, but worth recognizing if a problem wants **multiple range queries** over a static array with order-statistics questions.

### 3.7 Merge K Sorted Lists/Arrays (LC 23) — adjacent, not the same pattern

Uses the _merge_ primitive (pairwise or heap-based) but **not the divide-the-same-array-in-half augmentation** family above. Don't conflate: this is about merging `k` independently-sorted inputs, not splitting one array and counting cross-pairs. Good to distinguish in an interview when asked "which merge sort variant is this" — the honest answer is "it borrows the merge primitive, not the divide/count technique."

### 3.8 Standalone Merge Function — Set Operations on Two Sorted Arrays

[intersection-of-two-sorted-arrays](../Problems/intersection-of-two-sorted-arrays.md)
[union-of-two-sorted-arrays](../Problems/union-of-two-sorted-arrays.md)
[median-of-two-sorted-arrays](../Problems/median-of-two-sorted-arrays.md)
[count-inversions-in-array](../Problems/count-inversions-in-array.md)

This is a **second major branch**, distinct from everything in 3.1–3.6. Those all reuse the merge step _inside_ recursion on one array being split. This branch reuses the merge step _directly_, with **no recursion at all**, because the two inputs already arrive sorted. The "merge sort" framing is really "given the merge-step skill, apply it wherever two sorted sequences need to be combined/compared."

- **Union of two sorted arrays** — identical two-pointer merge as the vanilla merge step, except when `left[i] == right[j]` you take one copy and advance both pointers (dedup on the fly), instead of taking both.
- **Intersection of two sorted arrays** (LC 349/350) — inverted logic from merge: advance the pointer with the **smaller** value (discard it, it can't match), and only "output" when `left[i] == right[j]`, then advance both. This is the same two-pointer skeleton as merge, but you emit on _equality_ instead of emitting on _every_ comparison.
- **Merge Sorted Array in-place (LC 88)** — same merge logic, but merging **backwards from the end** of the longer array to avoid overwriting unprocessed elements — a common "gotcha" variant testing whether you understand _why_ forward merging would corrupt data when there's no auxiliary array.
- **Median of Two Sorted Arrays (LC 4)** — not literally the merge step, but conceptually the _hard mode_ of this branch: instead of materializing the full merge, you binary-search for the partition point that the merge _would_ produce, in O(log(min(m,n))). Worth linking here because interviewers sometimes ask "how would you find the median while merging" as a warm-up before pushing you to the log-time version.
- **Merging with a k-length window / "closest pair across two sorted arrays"** style problems also reduce to a two-pointer sweep with the same discipline: advance whichever pointer improves the objective, never both blindly.

**Why this branch is easy to under-recognize:** none of these problems say "merge sort" in the prompt, and there's no split/recursion step to trigger pattern recognition. The signal instead is: **"two arrays/lists, both already sorted, combine or compare them"** — at that point, whatever operation you need (union, intersection, k-th element, in-place merge) is very likely a single two-pointer pass borrowed directly from the merge step, dedicated to that operation's early-exit/dedup/dual-emit logic instead of the plain merge's dual-emit-everything logic.

## 4. Problem-Breakdown Framework

When you spot the signals in §2, walk this sequence:

1. **State the brute force explicitly** (O(n²) pair comparison) — this is also your correctness oracle for testing the augmented version.
2. **Identify exactly which merge-time event triggers the count/action.** In inversions it's "right-side element taken early." In Reverse Pairs it's a separate condition needing its own pointer pass. Naming this precisely _before_ coding prevents the most common bug class: counting at the wrong pointer position.
3. **Decide what needs to survive the recursion** — just a running count (inversions), or per-original-index results (LC 315, which needs value+index tuples carried through)?
4. **Write the merge first, in isolation, and test it against a hand-worked small example** (4–6 elements) before wiring up the recursion. Almost all bugs live in the merge, not the split.
5. **Check the condition's monotonicity** against the plain `<=` merge comparator — if they diverge (Reverse Pairs), you need an extra dedicated pass; if they align (inversions, LC 315), one pass suffices.
6. **Overflow / duplicate handling** — stable tie-breaking (`<=`) is usually required to keep counts correct when values repeat.

## 5. Common Pitfalls

- Off-by-one in `len(left) - i` when counting inversions — verify against a 3-element hand trace, not intuition.
- Forgetting to carry original indices (LC 315) and then trying to retrofit index tracking after the merge logic is already written — decide this in step 3, not after.
- Assuming Reverse Pairs reuses the inversion-counting pass directly — it doesn't; the comparison condition isn't the same as the merge's own ordering condition.
- Non-stable merges silently breaking duplicate-heavy test cases in index-sensitive variations.
- Overflow on `2 * nums[j]` or similar scaled conditions.

## 6. Related / Next

- [[cycle-sort]] — different family (index-placement based), useful contrast for when _not_ to reach for merge sort.
- [[dutch-national-flag]] — single-pass partitioning, contrast with merge sort's two-pass divide/merge.
- [[binary-search-on-answer]] — separate O(n log n) toolkit; occasionally combined with merge-sort-style counting when the "check" function itself needs an inversion-count-like subroutine.