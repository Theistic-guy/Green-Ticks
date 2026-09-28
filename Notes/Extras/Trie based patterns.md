
Trie is a good one to be precise about, because it has fewer "disguised" appearances than stack/queue — it's usually obvious when it's needed, but there are 3-4 genuinely distinct usage shapes worth separating.

## Core idea

A trie earns its place over a hashset/hashmap specifically when you need **prefix-based operations** — search-as-you-type, "does anything start with X," or "shortest/longest prefix match." If you only ever check full-string membership, a hashset is simpler and you don't need a trie at all — that's the tell.

---

## 1. Basic Trie Construction & Search (mandatory foundation — do first)

Standard insert/search/startsWith on a tree of characters, each node holding children + end-of-word flag.

- **Implement Trie (Prefix Tree) (208)** — the template, must be automatic before anything else
- Design Add and Search Words Data Structure (211) — adds wildcard `.` matching → requires DFS over children when a wildcard is hit, first real variation on the base structure

**Why this matters beyond itself:** almost every harder trie problem is "vanilla trie insert/search + one extra thing bolted on." If insert/search isn't automatic, everything downstream is slower to reason about.

---

## 2. Word Search / Board + Trie (high ROI — very common FAANG combo)

Combines trie with backtracking/DFS on a grid. The trie's job: prune the DFS early by checking "is this prefix even possible" before exploring further, instead of checking each word independently against the whole board.

- **Word Search II (212)** — the canonical version; build a trie of all target words, DFS the board, only recurse where the trie confirms a valid prefix exists
- Word Search (79) — simpler, single-word version (no trie strictly needed, but conceptually the DFS half of the pattern)

**Why this is high ROI:** it's a "combine two known techniques" problem, which is exactly the shape of many FAANG mediums/hards — trie alone or DFS alone is too easy to be interview-worthy; the combination is the actual test.

---

## 3. Prefix Matching / Autocomplete-style (high ROI, very "practical" flavor — matches real product features)

Trie used to answer "what strings share this prefix" efficiently.

- **Longest Word in Dictionary (720)** — insert all words, then walk down validating that every prefix along the way is itself a complete word
- **Search Suggestions System (1268)** — literally autocomplete; trie or sorted-array + binary search both work, but trie is the "expected" mental model
- Replace Words (648) — given a dictionary of roots, replace every word in a sentence with its shortest matching root — trie makes "shortest prefix match" O(word length) instead of checking every root

**Why this is high ROI:** feels the most like an actual product feature (search-as-you-type, stemming) — interviewers like framing trie questions this way because it tests "do you reach for the right structure for a real scenario," not just memorized template execution.

---

## 4. Bitwise Trie (XOR Trie) — niche but a known "hard" pattern (medium ROI, high-value if you hit it)

Different flavor entirely: instead of characters, each node has exactly 2 children (`0` or `1` bit), built from the binary representation of numbers. Used to maximize/query XOR pairs efficiently.

- **Maximum XOR of Two Numbers in an Array (421)** — insert all numbers bit-by-bit (MSB to LSB), then for each number greedily walk the opposite bit at each level to maximize XOR
- Maximum XOR With an Element From Array (1707) — same trie, but offline queries with a value-limit constraint (sort + two-pointer + trie)

**Why to know this exists even if lower-frequency:** it's a distinct enough "aha" that if it does show up, not recognizing it costs you the whole problem — no partial credit via brute force at reasonable constraints. Worth one clean pass, not deep drilling.

---

## 5. Trie for Counting / Frequency (medium ROI — often a "trie disguised as something else")

Nodes store counts (e.g., how many words pass through this node) instead of just boolean end-flags — used to answer aggregate prefix queries.

- Map Sum Pairs (677) — trie node stores cumulative sum of values for all words sharing that prefix
- Design File System suggestions-style problems (less commonly LC-numbered, more common as OA-style variants)

---

## ROI Verdict

**Word Search II (212)** and **Implement Trie (208)** are the two non-negotiables — together they cover "can you build one" and "can you combine it with DFS," which is the most commonly tested shape. **Search Suggestions System (1268)** and **Replace Words (648)** round out the "practical prefix matching" flavor that interviewers like for its real-world framing. The **XOR trie (421)** is worth one clean solve so the pattern isn't a total surprise, but isn't worth grinding multiple variants of.

## Suggested drill order

1. Implement Trie (208) — until insert/search/startsWith is automatic
2. Design Add and Search Words (211) — wildcard variation, forces DFS-over-children thinking
3. Word Search II (212) — the big one; trie + backtracking combo
4. Replace Words (648) → Search Suggestions System (1268) — prefix-matching flavor
5. Longest Word in Dictionary (720) — validates prefix-chain reasoning
6. Maximum XOR of Two Numbers (421) — one pass at the bitwise variant, don't over-invest

