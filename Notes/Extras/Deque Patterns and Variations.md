Here's the Deque landscape, structured the same way as your Stack and Queue notes — patterns first, ROI-ranked.

## Core idea

A deque earns its place over a plain stack or queue exactly when you need **eviction or access from both ends simultaneously** — usually because "old enough to be irrelevant" (front) and "dominated by a better/worse candidate" (back) are two _independent_ reasons to discard something. If only one end is ever touched, you didn't need a deque — that's the tell for whether a problem is genuinely deque-shaped or just dressed up as one.

---

## 1. Monotonic Deque — the crown jewel (highest ROI, drill this first)

Same "resolve-on-pop" logic as monotonic stack, but two eviction rules run independently:

- **Back eviction (value-based):** pop while the new element dominates the back — that element can never be the answer for any future window.
- **Front eviction (index-based):** pop when the front index falls outside the current window.

The front is always the current answer once both evictions are applied.

- **Sliding Window Maximum (239)** — the template. Get this cold before anything else in this note.
	[sliding-window-maximum-(lc-239)](../../Problems/sliding-window-maximum-(lc-239).md)

- Shortest Subarray with Sum ≥ K (862) — prefix sums + monotonic deque, non-obvious combo
	[shortest-subarray-with-sum-at-least-k](../../Problems/shortest-subarray-with-sum-at-least-k.md)
	


- Jump Game VI (1696) — DP transition bounded by a sliding window, deque holds best-DP-value-so-far
- Constrained Subsequence Sum (1425) — same DP+deque combo, harder constraint; strong checkpoint problem
- Longest Continuous Subarray with Abs Diff ≤ Limit (1438) — **two monotonic deques simultaneously** (one for window max, one for window min) — good test of whether the pattern actually generalizes for you

**Why this dominates ROI:** it's the single deque pattern that shows up disguised as DP, sliding-window, or subarray problems — the "disguise factor" is what makes it interview-gold rather than a named-pattern-and-done deal.

---

## 2. Deque as Stack+Queue hybrid / Both-Ends Design (medium ROI — common warm-up)

Not a technique so much as the structural reason deque exists — but it does get tested directly as design questions.

- Design Circular Deque (641) [implementation-of-deque-using-array-(leetcode-641)](../../Problems/implementation-of-deque-using-array-(leetcode-641).md)

- Design Front Middle Back Queue (1670) — lower priority; implementation-heavy with little pattern transfer
- Moving Average from Data Stream (346) — technically works with plain queue too, but deque version is common when you also need front/back peeking

---

## 3. Palindrome / Two-Pointer-from-both-ends (medium ROI, appears more as "deque is one valid approach")

Deque used to check symmetric properties by comparing/popping from both ends simultaneously.

- Valid Palindrome (125) — usually two-pointer on the string directly, but deque is a legitimate teaching implementation

- Design a stack/queue that also supports palindrome checks — appears in some OA sets, not canonical LC

Lower priority — this is mostly "deque _can_ do this" rather than "deque is _the_ tool," since plain two-pointer on an array/string is strictly simpler and what's expected in an actual interview.

---

## 4. Double-Ended Priority Queue (medium-high ROI, but really a Priority-Queue topic wearing a deque label)

Retrieve both min and max efficiently. In practice almost never implemented as a literal deque — implemented as **two heaps with lazy deletion**, but conceptually it's "priority access from both ends," which is why it's grouped under deque applications.

- Sliding Window Median (480)
- Find Median from Data Stream (295)

**Note:** these are already in your Queue note's Priority Queue section — don't double-drill, just recognize the conceptual link when a problem is framed as "deque."

---

## 5. Work-stealing / scheduling (low ROI for interviews, high ROI for systems understanding)

Each worker owns a deque: local push/pop from one end (LIFO, cache-friendly), stealing from the other end (FIFO, low contention with the owner). Real-world relevance in schedulers (ForkJoinPool, Go runtime), but essentially never implemented as an LC problem — shows up only as a conceptual "why deque" systems-design question.

**Verdict:** understand the mechanism once, don't spend drilling time here.

---

## 6. Undo/Redo / Bounded History (low-medium ROI)

Two-stack pattern (undo-stack, redo-stack) that occasionally needs deque if history is capped at N actions (front-eviction of oldest action). Mostly a stack pattern with a deque cameo.

- Design Browser History (1472) — closest practical LC version

---

## ROI Verdict

If time-constrained, **monotonic deque is 80% of the value here** — same relationship monotonic stack has to plain stack problems. Everything else in this note (categories 2–6) is either a design warm-up or a conceptual "deque _can_ do this" footnote, not core interview material.

## Suggested drill order

1. Sliding Window Maximum (239) — nail the invariant, say it out loud: _"decreasing deque of indices; evict back on dominance, evict front on window expiry."_
2. Design Circular Deque (641) — confirm mechanics/edge cases of deque itself
3. Constrained Subsequence Sum (1425) — DP+deque checkpoint
4. Longest Continuous Subarray Abs Diff ≤ Limit (1438) — dual-deque checkpoint
5. Shortest Subarray Sum ≥ K (862) — prefix-sum+deque, trickier invariant

