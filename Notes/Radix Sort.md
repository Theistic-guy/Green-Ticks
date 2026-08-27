<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

Direct solution of leetcode 164 #leetcode 
## Radix Sort — PKM Note

**Core idea:** Sort integers digit-by-digit, from least significant digit (LSD) to most significant (MSD), using a **stable** sub-sort (usually counting sort) at each digit position. Because each pass is stable, correctness accumulates: after sorting by digit `d`, elements with equal digit `d` retain their relative order from the previous pass — so by the time you've processed the most significant digit, the whole array is sorted.

```python
def radix_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for num in arr:
        count[(num // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]          # prefix sum → stable placement
    for i in range(n - 1, -1, -1):        # iterate backward to preserve stability
        digit = (arr[i] // exp) % 10
        count[digit] -= 1
        output[count[digit]] = arr[i]
    arr[:] = output
```

**Why LSD, not MSD:** LSD radix sort is the standard because it only needs one pass per digit with no recursion/bucketing overhead. MSD radix sort (sort by most significant digit first, then recurse into each bucket) is closer to quicksort's structure and is used for variable-length keys (like strings) but is more complex to implement correctly.

**Complexity:** O(d·(n+k)) where `d` = number of digits, `n` = array size, `k` = base (usually 10). For fixed-width integers (e.g., 32-bit), `d` is a constant, so this is effectively **O(n)** — this is _the_ selling point: it beats the O(n log n) comparison-sort lower bound because it's not a comparison sort at all.

---

### Why FAANG cares

- **"Sort an array in linear time" / "sort integers within a bounded range"** — radix sort is the answer whenever the interviewer hints at bounded key size (fixed-width integers, IPs, dates). If you jump straight to `sort()` or quicksort without naming radix/counting sort as the O(n) alternative when the domain is bounded, you're missing the signal they planted.
- **Maximum Gap (LeetCode 164)** — classic radix sort application; also solvable via bucket-sort pigeonhole argument, but radix sort is the direct O(n) approach.
- **Sort strings by common prefix / lexicographic radix sort** — MSD radix sort generalizes to strings, character-by-character, which connects to trie-based thinking.
- **The "why not just use a comparison sort" question** — knowing the Ω(n log n) lower bound for comparison sorts, and _why_ radix sort escapes it (it exploits structure in the keys — fixed digit count — that generic comparison doesn't assume), is the theory checkpoint interviewers use to separate memorized-algorithm candidates from ones who understand the model.

### Interview signal to state out loud

"This works in O(n) because the keys have bounded width — I'm trading the general comparison-sort lower bound for one that exploits digit structure. If the range of values isn't bounded relative to n, this degrades — that's the same u instinct as choosing counting sort vs. comparison sort."

### Edge cases

- **Negative numbers:** the algorithm above breaks — `//` and `%10` misbehave signed. Standard fix: split into negative/non-negative buckets, radix-sort magnitudes separately, then concatenate (reversed negatives + positives).
- **Stability is load-bearing, not incidental** — if you swap counting sort for an unstable sub-sort, radix sort produces wrong output, not just a slower correct one. This is worth stating explicitly since it trips people who think "stable" is a nice-to-have.
- **Base choice matters for constants** — base 10 is intuitive but base 256 (byte-wise) or higher is what's actually used in production radix sorts, trading more buckets per pass for fewer passes (`d` shrinks as base grows).

---

**Link back:** contrasts with `[[selection-sort]]`/comparison sorts (radix sort isn't comparison-based at all — it's the canonical example of beating the O(n log n) lower bound by exploiting key structure). Shares its stable counting-sort subroutine with the counting-sort-based partition ideas in `[[dutch-national-flag]]`.

## What is exp doing here?

`exp` is the digit-position selector — it isolates one digit at a time from the right.

`(num // exp) % 10` extracts a specific digit:

- `exp = 1` → `// 1` does nothing, `% 10` grabs the **ones** digit
- `exp = 10` → `// 10` shifts right by one decimal place, `% 10` grabs the **tens** digit
- `exp = 100` → grabs the **hundreds** digit

So each loop iteration, `exp` marks _which_ digit position you're currently sorting by. The `while max_val // exp > 0` loop keeps going until `exp` has shifted past the largest number's most significant digit (i.e., there's nothing left to extract), then stops. `exp *= 10` advances to the next digit position after each pass.

Example with `arr = [329, 457, 65]`, `max_val = 457`:

- `exp=1`: sort by ones digit (9, 7, 5)
- `exp=10`: sort by tens digit (2, 5, 6)
- `exp=100`: sort by hundreds digit (3, 4, 0) — loop stops after this since `457 // 1000 == 0`