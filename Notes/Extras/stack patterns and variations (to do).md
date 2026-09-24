
## Implementation Based

- **Min Stack** → [LeetCode 155 - Min Stack](https://leetcode.com/problems/min-stack/) (Medium, but very frequently asked at FAANG — Amazon, Google, Bloomberg especially)
- **Implement Queue using Stacks** → [LeetCode 232 - Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) (Easy)
- **Implement Stack using Queues** → [LeetCode 225 - Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/) (Easy, the reverse version, also asked)
- **Insert Delete GetRandom O(1)** → [LeetCode 380](https://leetcode.com/problems/insert-delete-getrandom-o1/) (Medium — Amazon, Uber favorite)
- **LRU Cache** → [LeetCode 146 - LRU Cache](https://leetcode.com/problems/lru-cache/) (Medium, extremely common — Amazon, Meta, Microsoft)
- **LFU Cache** → [LeetCode 460 - LFU Cache](https://leetcode.com/problems/lfu-cache/) (Hard, less common but shows up at Amazon/Google for senior roles)
- **Max Stack** → [LeetCode 716 - Max Stack](https://leetcode.com/problems/max-stack/) (Hard, less common)
- ---

The reason you see this everywhere is because the Monotonic Stack is one of the most powerful patterns in algorithmic interviews. It is the ultimate tool whenever a problem asks you to find the "next greater element," "previous smaller element," or "nearest boundary" for every item in an array.

To master this pattern so you can recognize it instantly, follow this learning framework:

## 1. Memorize the "Trigger Words"

When reading a new problem, look for these specific clues. If you see them, a monotonic stack should immediately cross your mind:

- _"Find the closest element on the left/right that is larger/smaller..."_
- _"Find the first day in the future when the temperature rises..."_
- _"Find the largest rectangle/area trapped between bars..."_

---

## 2. Understand the Two Flavors

You only ever need to build two types of monotonic stacks. Once you know what they do, you just pick the right tool for the job:

|Stack Type|Rule for Pushing|What it Finds|Common Problems|
|---|---|---|---|
|Monotonic Decreasing  <br>_(Elements get smaller)_|Pop if incoming is larger.|Finds the Next Greater or Previous Greater element.|• Online Stock Span  <br>• Daily Temperatures  <br>• Next Greater Element|
|Monotonic Increasing  <br>_(Elements get bigger)_|Pop if incoming is smaller.|Finds the Next Smaller or Previous Smaller element.|• Largest Rectangle in Histogram  <br>• Sum of Subarray Minimums|

---

## 3. The 3-Step Code Template

Almost every monotonic stack problem uses the exact same `for` loop structure. Memorize this flow:

```python
stack = [] # Stores indices or (value, metadata) pairs

for i in range(len(arr)):
    # STEP 1: Pop smaller/larger elements that today's element "defeats"
    while stack and condition(arr[i], stack[-1]):
        popped_element = stack.pop()
        # (Optional: Do something with the popped element here)
        
    # STEP 2: Today's element now looks at its closest surviving neighbor
    if stack:
        # stack[-1] is your nearest greater/smaller boundary!
        pass 
        
    # STEP 3: Push current element onto the stack
    stack.append(i) 
```

---

## 4. Practice the "Ladder" of Difficulty

Do not jump straight into hard problems. Solve them in this exact order to see how the pattern builds on itself:

1. [LeetCode 496: Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) (Easy): The purest, most textbook version of the pattern.
2. [LeetCode 739: Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) (Medium): Exactly like the stock span problem, but looking _forward_ instead of backward.
3. [LeetCode 901: Online Stock Span](https://leetcode.com/problems/online-stock-span/) (Medium): The one you just learned, where you accumulate spans.
4. [LeetCode 84: Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) (Hard): The boss level. It uses an increasing stack to find boundaries on both the left _and_ right at the same time.

Would you like to step through LeetCode 739 (Daily Temperatures) next to see how the exact same template applies to a different problem?


---
---


Here's the Stack landscape, organized by pattern with ROI in mind — heaviest-hitting patterns first.

## Why Stack shows up

A stack is the right tool whenever you need to process elements but the _resolution_ of an earlier element depends on something that happens later (or you need to "undo" in LIFO order). That single idea explains ~90% of stack problems. The rest is knowing which of the 4-5 stack patterns applies.

## Pattern categorization

**1. Matching / Validity (bread and butter, very high ROI)**  
Push opening tokens, pop-and-check on closing tokens. Stack holds "unresolved openers."

- Valid Parentheses (20) — the canonical one, do this cold
- Remove Invalid Parentheses (301) — BFS/backtracking but conceptually related
- Longest Valid Parentheses (32) — stack stores _indices_, not chars — this trips people up, high ROI to internalize
- Score of Parentheses (856)
- Minimum Add to Make Parentheses Valid (921), Minimum Remove to Make Valid Parentheses (1249)

**2. Expression Evaluation (medium ROI, but a classic FAANG ask)**  
Stack simulates operator precedence / nesting.

- Basic Calculator (224), Basic Calculator II (227) — asked at Google/Facebook frequently
- Evaluate Reverse Polish Notation (150)
- Decode String (394) — stack of (count, string) pairs, great "aha" problem

**3. Simulation / Undo-able state (high ROI, shows real engineering intuition)**

- Min Stack (155) — auxiliary stack tracking running min; **the** template for "stack that also answers a query in O(1)"
- Backspace String Compare (844)
- Asteroid Collision (735) — stack simulates collisions, excellent pattern-recognition problem
- Simplify Path (71) — stack as a "current directory" model

**4. Monotonic Stack** — see below, this deserves its own section because it's the highest-ROI _subcategory_ by far for FAANG mediums/hards.

## ROI take

If you only have time for one subcategory: **monotonic stack**. It's a distinct mental model (not just "LIFO undo") and shows up disguised in array problems that don't look like stack problems at all — that disguise factor is exactly what makes it high-value interview material.

---

# Monotonic Stack — Deep Dive

## Core idea

Maintain a stack that is always increasing or always decreasing (in value) from bottom to top. When a new element violates that order, you **pop and resolve** — each pop is a final answer for the popped element ("this is the first element to my right that's bigger/smaller than me").

This is why it's O(n) total despite looking like nested loops: each element is pushed once and popped at most once.

## The decision framework (this is the actual skill)

Ask two questions:

1. **"Next greater" or "next smaller"?** → decides stack direction (decreasing stack finds next _greater_; increasing stack finds next _smaller_)
2. **Am I looking left-to-right (next X) or do I need previous X too?** → decides iteration direction, or whether you need two passes

Get comfortable stating the invariant out loud before coding: _"I maintain a decreasing stack of indices; when I see something bigger than the top, I pop and that popped index's answer is the current element."_

## Sub-patterns by increasing complexity

**A. Next/Previous Greater or Smaller Element (the template — master this first)**

- Next Greater Element I (496), II (503 — circular array, push twice)
- Daily Temperatures (739) — next greater, store _distance_ not value
- Next Greater Element III (556) — different flavor, not stack-based, skip if crunched

**B. Histogram / Area-under-constraint (natural extension of A)**

- Largest Rectangle in Histogram (84) — **the** hard version of the pattern; once you get this, everything below is easier
- Maximal Rectangle (85) — reduces to 84 row-by-row, high ROI since it also tests "reduction" thinking
- Trapping Rain Water (42) — solvable with monotonic stack (also DP/two-pointer — know the stack version for pattern completeness, but two-pointer is the O(1)-space answer they usually want)

**C. Remove-to-optimize (greedy + monotonic stack)**

- Remove Duplicate Letters (316) / Smallest Subsequence of Distinct Characters — same problem
- Remove K Digits (402) — very common, teaches "greedily pop while it helps and I have budget"
- Create Maximum Number (321) — harder composite of the above, lower priority unless targeting top-tier

**D. Stock/span-style (next greater, but framed as "span" or "profit")**

- Online Stock Span (901)
- Sum of Subarray Minimums (907) — this is A but summed cleverly with contribution technique; good "combine two ideas" problem

**E. 2D / grid-adjacent (rare, but appears in hards)**

- Sum of Subarray Ranges (2104) — sum of (max-min) ranges, combines B and D ideas
- Car Fleet (853) — arguably monotonic-stack-flavored, common in string/array mixed sets

## Suggested order to drill

1. Valid Parentheses → Min Stack (get comfortable with plain stacks)
2. Next Greater Element I → Daily Temperatures (nail the template)
3. Next Greater Element II (circular variant)
4. Largest Rectangle in Histogram (the hard checkpoint — if you can derive this from scratch, you've internalized the pattern)
5. Maximal Rectangle, Trapping Rain Water
6. Remove K Digits → Remove Duplicate Letters
7. Sum of Subarray Minimums / Ranges

If you get through 1-4 solidly, you can pattern-match a large fraction of stack-tagged mediums/hards on sight — that's where the ROI is, not in grinding every problem in the tag.