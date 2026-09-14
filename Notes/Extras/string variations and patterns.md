Here's the real breakdown, organized by actual interview yield — not textbook completeness.

## 1. Rolling Hash

**Interview relevance: Low-Medium (mostly as a technique, rarely the intended solution)**

- **1044. Longest Duplicate Substring** — Hard, the canonical rolling hash problem (binary search on length + Rabin-Karp check). Actually shows up at Google/senior rounds.
- **187. Repeated DNA Sequences** — Medium, good warm-up, hashing fixed-length windows.
- **28. Find the Index of the First Occurrence** — technically solvable with rolling hash, but nobody expects that solution; KMP or built-in is fine.
- **1392. Longest Happy Prefix** — same idea as LPS array (see below) but often solved with rolling hash comparison of prefix/suffix hashes.

Reality check: pure rolling-hash-as-the-answer questions are rare in FAANG loops. It's more often a _fallback tool_ you mention when the interviewer asks "can you do better than O(n²) string comparison." Know the double-hashing-to-avoid-collision trick if you bring it up.

## 2. 2D Rabin-Karp

**Interview relevance: Very Low**

- **30. Substring with Concatenation of All Words** is _not_ this; don't confuse them.
- 2D pattern matching (image/grid substring search) essentially never appears as a standalone FAANG question. It shows up in bioinformatics/graphics-adjacent take-homes, not whiteboard rounds.
- Skip unless you're interviewing somewhere with a computer vision/graphics focus. Don't burn prep time here.

## 3. LPS Array (KMP)

**Interview relevance: Medium — mostly as _concept recognition_, not implementation**

- **28. Find the Index of the First Occurrence in a String** — the direct KMP problem.
- **459. Repeated Substring Pattern** — LPS array gives an elegant O(n) solution (`n % (n - lps[n-1]) == 0`).
- **1392. Longest Happy Prefix** — LPS array _is_ the answer (lps[n-1] length prefix).
- **214. Shortest Palindrome** — KMP on `s + '#' + reverse(s)`, a genuine FAANG-asked hard.

Reality check: full from-scratch KMP implementation under interview pressure is a big ask and most interviewers know it. What's actually tested: do you _recognize_ when a prefix-function/LPS idea applies, and can you at least state the recurrence. Memorize the LPS-building loop cold (it's short) — don't wing it live.

## 4. Rotations

**Interview relevance: High (as a trick), Low (as a topic)**

- **796. Rotate String** — trivial, `s2 in s1+s1`. Very common as an "easy warm-up" or phone-screen filter question.
- **459. Repeated Substring Pattern** — same `s+s` trick.
- **154 / 33 / 81** (rotated sorted array) — these are _array_ rotation, not string rotation; different pattern (binary search), don't conflate.

Reality check: the entire "rotation" topic for strings collapses into one trick: **check `b in a+a`**. That's it. High ROI, low prep time.

## 5. Anagram

**Interview relevance: Very High — one of the most FAANG-tested string families**

- **242. Valid Anagram** — baseline, must be instant.
- **49. Group Anagrams** — extremely common (Amazon, Meta, Bloomberg), sort-key or count-key hashing.
- **438. Find All Anagrams in a String** — sliding window + frequency count, this exact pattern reappears constantly.
- **567. Permutation in String** — same sliding window skeleton as 438.
- **76. Minimum Window Substring** — harder variant of the same frequency-window idea, very frequently asked at senior levels.
- **1347. Minimum Number of Steps to Make Two Strings Anagram** — easy variant.

Reality check: this is a **must-master bucket**. The fixed/variable sliding window + 26-length frequency array pattern (438/567/76) is one of the highest-frequency FAANG patterns overall, not just within strings.

## 6. Substring (broad)

**Interview relevance: Very High — this is the real meta-topic**

Break it into the sub-patterns that actually get asked:

- **Sliding window (variable size)**: 3 (Longest Substring Without Repeating Characters — _extremely_ common), 76, 424, 340.
- **Sliding window (fixed size)**: 438, 567, 187.
- **Two-pointer + expand around center**: 5 (Longest Palindromic Substring — extremely common), 647 (Palindromic Substrings).
- **DP on substrings**: 5 (DP version), 132 (Palindrome Partitioning II), 115 (Distinct Subsequences).
- **Trie-based substring**: 208, and substring search variants in harder problems.
- **Suffix structures**: mostly out of scope for standard loops (suffix array/tree essentially never hand-coded live).


## 7. Lexicographic Variations

**Interview relevance: Medium-High — a recurring "small trick, big signal" bucket**

- **179. Largest Number** — custom comparator (`a+b > b+a`), the canonical lexicographic-ordering-for-a-non-lexicographic-goal problem. Frequently asked.
- **60. Permutation Sequence** — factorial number system + lexicographic ordering of permutations without generating all of them. Common at senior/Google-style rounds.
- **31. Next Permutation** — the core "next lexicographic arrangement" algorithm. Extremely high yield — shows up standalone and as a building block in other problems.
- **556. Next Greater Element III** — same next-permutation logic applied to digits of a number.
- **440. K-th Smallest in Lexicographic Order** — lexicographic tree/trie-traversal counting trick (not sorting!). Hard, but a known Google favorite — worth recognizing the pattern even if you can't derive it cold.
- **386. Lexicographical Numbers** — same DFS-over-implicit-10-ary-trie idea as 440, easier version.
- **1163. Last Substring in Lexicographic Order** — two-pointer comparison trick, tests whether you understand suffix comparison without building a suffix array.
- **12/13/17. Roman numeral / phone letter combos** — _not_ this topic, don't conflate greedy/backtracking problems with true lexicographic-ordering problems.

**Priority for cramming:**

1. **#31 Next Permutation** — master this cold, the algorithm (find pivot → find successor → reverse suffix) reappears constantly.
2. **#179 Largest Number** — the comparator trick is a 2-minute lightbulb that interviewers love testing.
3. **#440/#386** — know the "count how many numbers lie in each branch of the implicit trie" idea conceptually; don't expect to derive #440 live without having seen it.
4. Everything else — nice-to-have, low direct-ask frequency.

---

## The actual priority order for a quick FAANG comeback

If you're cramming with limited time, in order of expected value:

1. **Sliding window (variable + fixed) — #3, #76, #438, #567, #424** — this is the single highest-yield string pattern in FAANG interviews, full stop.
2. **Anagram/frequency-count family — #242, #49** — cheap to master, shows up everywhere.
3. **Palindrome family — #5, #647, #125, #131 (backtracking variant)** — expand-around-center is a 10-minute technique with huge coverage.
4. **String rotation trick (`s+s`) — #796, #459** — 5 minutes of prep, occasionally saves you.
5. **LPS/KMP — recognize it, know #1392, #459's O(n) trick, be able to state the LPS recurrence** — don't over-invest in flawless from-scratch KMP coding.
6. **Rolling hash — know it conceptually for #1044 and as a fallback answer to "can you beat brute force"** — low direct-ask frequency.
7. **2D Rabin-Karp — skip entirely** for standard FAANG loops.


---

Here is an expanded, comprehensive PKM note formatted for tools like Obsidian or Notion. It fully documents both the interviewer-preferred Expand Around Center approach and your custom Split-Sign Rolling Hash + Binary Search technique.

---

