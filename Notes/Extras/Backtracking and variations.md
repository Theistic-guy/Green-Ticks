
Rat in a Maze, Sudoku, and N-Queens all belong to one narrow family (constraint placement on a board). Backtracking is much broader, and the FAANG-relevant surface is mostly elsewhere.

## Core idea

Backtracking is **DFS over a decision tree with pruning**: at each step you make a choice, recurse, then undo the choice (the "backtrack") and try the next one. Reach for it when the problem asks for **all** solutions, or **whether any** solution exists, over a space too large to enumerate blindly but where partial choices can be rejected early. If the problem asks for a count or an optimum and subproblems overlap, that's usually DP instead; the tell is whether you must _produce_ the configurations or just _measure_ them.

**The template every problem below reuses:**

```
def backtrack(state, choices):
    if is_complete(state): record(state); return
    for c in choices:
        if not valid(c): continue      # pruning
        apply(c)
        backtrack(state, next_choices)
        undo(c)                        # the actual "backtrack"
```

What differs between problems is only three things: **what a choice is, what "valid" means, and how you avoid duplicates.** That's the real skill.

---

## 1. Subsets / Combinations (foundation, do first)

Choices are "include or skip," or "pick the next element from index i onward." Tracking a start index prevents reordering duplicates.

- **Subsets (78)** — the template
- **Combinations (77)**, **Combination Sum (39)** (reuse allowed), **Combination Sum II (40)** (no reuse, duplicates in input), Combination Sum III (216)
- **Subsets II (90)** — the duplicate-handling variant: sort, then skip an element if it equals the previous one _at the same recursion level_

**Why first:** the duplicate-skipping rule from Subsets II and Combination Sum II is the single most reused trick in this whole topic. Get it exactly right once.

---

## 2. Permutations (high ROI)

Choices are "any unused element," so you track a `used` array (or swap in place) rather than a start index.

- **Permutations (46)**
- **Permutations II (47)** — duplicates; sort + skip rule combined with the `used` check
- Next Permutation (31) is _not_ backtracking despite the name; it's an in-place array algorithm. Worth knowing so you don't confuse the two.

**The contrast to internalize:** subsets/combinations use a **start index** (order doesn't matter), permutations use a **used set** (order matters). Mixing these up is the most common bug.

---

## 3. String Construction with Constraints (high ROI, very common)

Build a string character by character, pruning invalid prefixes early.

- **Generate Parentheses (22)** — prune when closes > opens or either exceeds n; you already met this as the BFS-generation cousin
- **Letter Combinations of a Phone Number (17)**
- **Palindrome Partitioning (131)** — choice is "where to cut next"; validity is "is this piece a palindrome"
- Restore IP Addresses (93) — cut-position choices with a strict validity rule per segment
- Word Break II (140) — backtracking with memoization; the point where backtracking and DP meet

---

## 4. Grid / Path Search (high ROI)

DFS on a grid with mark-visited, recurse, unmark. This is the family Rat in a Maze belongs to.

- **Word Search (79)** — the most important one in this group
- **Word Search II (212)** — backtracking + trie, which you already have in your trie note
- Unique Paths III (980) — visit every empty cell exactly once
- Path with Maximum Gold (1219)
- Rat in a Maze itself sits here: it's Word Search with a different goal.

**The key mechanic:** you must unmark the cell on the way out, or a path that fails poisons later paths. That unmark step is the "backtrack."

---

## 5. Constraint Placement (your module's three problems, plus the ones that matter)

Place items on a board so that no constraint is violated; prune the moment a placement conflicts.

- **N-Queens (51)**, N-Queens II (52) — the optimization here is O(1) conflict checking with three sets/arrays (columns, diagonal `r-c`, anti-diagonal `r+c`), instead of scanning the board
- **Sudoku Solver (37)** — same idea with row/column/box sets; heuristic of filling the most-constrained cell first is a known speedup
- Valid Sudoku (36) is _not_ backtracking (pure validation) but is the natural warm-up.

**Interview reality:** N-Queens is asked reasonably often; Sudoku Solver much less so, since it's long to write. Know the technique; don't over-drill the full implementation.

---

## 6. Partitioning / Assignment (medium ROI, harder tier)

Distribute items into buckets with a balance constraint. Hard to prune well, so these test whether you can find a good pruning.

- **Partition to K Equal Sum Subsets (698)** — the canonical one; sort descending and skip identical failed buckets to prune
- Matchsticks to Square (473) — same problem with k=4
- Fair Distribution of Cookies (2305)
- Split Array into Fibonacci Sequence (842)

---

## 7. Expression / Search-Space Enumeration (medium ROI)

- Expression Add Operators (282) — insert `+ - *` between digits; the tricky part is handling multiplication precedence by tracking the last operand
- Remove Invalid Parentheses (301) — BFS or backtracking with a computed minimum-removal count
- Beautiful Arrangement (526)

---

## What to de-prioritize

- **Rat in a Maze, as a named problem:** it's essentially Word Search / grid DFS. Do it once for the mechanics, and it needs no separate drilling.
- **Sudoku Solver:** worth one careful solve for the row/col/box-set technique; skip repeated practice.
- **Knight's Tour and Hamiltonian-path style problems:** classic in textbooks, rare in interviews because pruning is hard to make sufficient.

## ROI verdict

Categories **1, 2, 3 and 4 carry nearly all the interview value**: Subsets, Permutations, Combination Sum, Generate Parentheses, Palindrome Partitioning, Word Search. Your module's three problems live in categories 4 and 5, which are real but narrower. N-Queens is the only one of the three I'd call reliably interview-relevant.

## Suggested drill order

1. Subsets (78) → Subsets II (90) — template plus the duplicate-skip rule
2. Permutations (46) → Permutations II (47) — the `used` set, contrasted with start-index
3. Combination Sum (39) → Combination Sum II (40)
4. Generate Parentheses (22) → Palindrome Partitioning (131)
5. Word Search (79) — then Rat in a Maze becomes trivial
6. N-Queens (51) — the O(1) conflict-check optimization
7. Partition to K Equal Sum Subsets (698) — stretch, pruning-heavy
8. Word Search II (212) — after finishing your trie note

One overlap worth flagging: Word Break II (140) and Palindrome Partitioning (131) get much faster with memoization, which is where backtracking shades into DP. It's worth noticing when a backtracking solution recomputes the same subproblem, because that's the signal to add a cache.

