<h1 align='right'><a href="../README.md">⇐🏠</a></h1>


> **Core idea:** When many operations modify an entire range, don't update every element immediately. Record the **boundary changes** and reconstruct the final array later.

---

# 1. The Problem Difference Arrays Solve

Suppose:

```python
nums = [0, 0, 0, 0, 0]
```

Operations:

```text
Add 5 to indices [1, 3]
Add 2 to indices [2, 4]
```

The naive approach modifies every affected element:

```text
Operation 1:
[0, 5, 5, 5, 0]

Operation 2:
[0, 5, 7, 7, 2]
```

If there are `Q` operations and each range can contain `N` elements, this can become:

```text
O(N × Q)
```

in the worst case.

---

# 2. The Difference Array Trick

Instead of storing the actual values, store the **change between consecutive positions**.

For:

```text
nums = [0, 0, 0, 0, 0]
```

its difference array is:

```text
diff = [0, 0, 0, 0, 0]
```

To add `x` to the range `[l, r]`:

```text
diff[l] += x
diff[r + 1] -= x
```

That's it.

---

# 3. Why Does This Work?

Suppose we want:

```text
Add 5 to [1, 3]
```

Instead of:

```text
index:  0  1  2  3  4

value:  0  5  5  5  0
```

record:

```text
diff:

index:  0   1   2   3   4
        0  +5   0   0  -5
```

Now take the prefix sum:

```text
0
0 + 5 = 5
5 + 0 = 5
5 + 0 = 5
5 - 5 = 0
```

Result:

```text
[0, 5, 5, 5, 0]
```

The `+5` **starts** the effect.

The `-5` **ends** the effect after index `3`.

---

# 4. The Intuition

Think of each range update as turning a switch on and then off.

For:

```text
Add 5 to [1, 3]
```

we say:

```text
index 1 → start adding 5

index 4 → stop adding 5
```

So:

```text
       +5
        ↓
0   1   2   3   4
    ┌─────────┐
    │ +5      │
    └─────────┘
                ↓
               -5
```

The prefix sum carries the currently active changes forward.

This is the entire technique.

---

# 5. Complete Example

Suppose:

```python
n = 5

updates = [
    (1, 3, 5),
    (2, 4, 2)
]
```

Meaning:

```text
Add 5 to [1,3]

Add 2 to [2,4]
```

Initialize:

```python
diff = [0] * (n + 1)
```

For `(1,3,5)`:

```text
diff[1] += 5
diff[4] -= 5
```

For `(2,4,2)`:

```text
diff[2] += 2
diff[5] -= 2
```

Therefore:

```text
diff = [0, 5, 2, 0, -5, -2]
```

Prefix sum:

```text
index     0   1   2   3   4

diff      0   5   2   0  -5

running   0   5   7   7   2
```

Final array:

```text
[0, 5, 7, 7, 2]
```

---

# 6. Complete Code

```python
def range_addition(n, updates):

    diff = [0] * (n + 1)

    for l, r, value in updates:
        diff[l] += value
        diff[r + 1] -= value

    result = [0] * n

    current = 0

    for i in range(n):
        current += diff[i]
        result[i] = current

    return result
```

Example:

```python
updates = [
    (1, 3, 5),
    (2, 4, 2)
]

print(range_addition(5, updates))
```

Output:

```text
[0, 5, 7, 7, 2]
```

---

# 7. Complexity

Naive approach:

```text
For every update:
    modify every element in [l,r]

Worst case:
O(NQ)
```

Difference array:

```text
Process Q updates: O(Q)

Reconstruct array: O(N)
```

Therefore:

```text
Time = O(N + Q)
Space = O(N)
```

This is the huge improvement.

---

# 8. Why Do We Usually Allocate n + 1?

Because of:

```python
diff[r + 1] -= value
```

If:

```text
r = n - 1
```

then:

```text
r + 1 = n
```

which is outside the original array.

So:

```python
diff = [0] * (n + 1)
```

makes the boundary operation safe.

You don't actually need to reconstruct index `n`.

---

# 9. Difference Array Is Basically "Prefix Sum in Reverse"

There is a beautiful relationship:

### Prefix Sum

Given:

```text
diff
```

you recover:

```text
array
```

by taking prefix sums.

### Difference Array

Given:

```text
array
```

you can construct:

```text
diff
```

by taking differences:

```text
diff[0] = arr[0]

diff[i] = arr[i] - arr[i-1]
```

So:

```text
Difference
    ↓
Prefix Sum
    ↓
Original Array
```

They are almost inverse operations.

---

# 10. When Should You Think of Difference Arrays?

Whenever you see:

> **"Perform many range additions/updates, then return the final array."**

Think:

```text
Range update
      ↓
Difference Array
      ↓
Prefix Sum
```

Typical wording:

- Add `x` to every element in `[l,r]`
    
- Increment all positions from `l` to `r`
    
- Apply `Q` range updates
    
- After all operations, find the final values
    

---

# 11. Difference Array vs Prefix Sum

These solve almost opposite problems.

## Prefix Sum

Useful when:

> The array is fixed, but I need many **range queries**.

Example:

```text
"Find sum of nums[l:r]"
```

Preprocess:

```text
array
 ↓
prefix sum
```

Then each range sum becomes:

```text
O(1)
```

---

## Difference Array

Useful when:

> I have many **range updates**, then need the final array.

```text
range updates
 ↓
difference array
 ↓
prefix sum
 ↓
final array
```

---

# 12. The Powerful Combination

Sometimes a problem has both:

```text
Range Updates
+
Range Queries
```

A basic difference array is no longer enough.

That's where more advanced structures enter:

```text
Prefix Sum
    ↓
Difference Array
    ↓
Fenwick Tree / BIT
    ↓
Segment Tree
```

For your current DSA preparation, the important thing is recognizing **when you have crossed the limit of the simple technique**.

---

# 13. 2D Difference Array ⭐⭐⭐⭐

The same idea extends to matrices.

Suppose we want to add `x` to every cell inside:

```text
(top, left)
        ↓
   ┌──────────┐
   │          │
   │ rectangle│
   │          │
   └──────────┘
             ↑
       (bottom, right)
```

Instead of updating every cell, modify only the four corners.

For rectangle:

```text
[r1, c1] → [r2, c2]
```

apply:

```python
diff[r1][c1] += x

diff[r1][c2 + 1] -= x

diff[r2 + 1][c1] -= x

diff[r2 + 1][c2 + 1] += x
```

Then perform 2D prefix sums.

---

# 14. Why Four Corners?

Think of the rectangle as creating four boundary events:

```text
       +x
        ↓
   ┌──────────────┐
   │              │
   │    +x area   │
   │              │
   └──────────────┘
        ↑
      -x boundaries
```

The fourth corner exists because the two negative boundaries overlap and would otherwise subtract the effect twice.

The signs are:

```text
+x   -x

-x   +x
```

This is the 2D equivalent of:

```text
+x at start
-x after end
```

---

# 15. 2D Example

Suppose:

```text
matrix = 4 × 5
```

and we want:

```text
Add 3 to:

rows    1..2
columns 2..4
```

Update:

```python
diff[1][2] += 3
diff[1][5] -= 3

diff[3][2] -= 3
diff[3][5] += 3
```

After applying 2D prefix sums, every cell in that rectangle receives `+3`.

---

# 16. A Closely Related Trick: Imos Method

You may encounter the name:

> **Imos method**

This is essentially the same fundamental idea as a difference array, especially in competitive programming.

The terminology differs, but the pattern is:

```text
Mark boundaries
      ↓
Accumulate with prefix sums
      ↓
Recover actual values
```

You don't need to learn a separate algorithm.

---

# 17. Another Related Technique: Sweep Line ⭐⭐⭐⭐

The same **boundary-event philosophy** appears in sweep-line algorithms.

Example:

```text
Intervals:

[1,4]
[2,6]
[5,7]
```

Instead of processing every point, record events:

```text
1 → +1
2 → +1
5 → -1
5 → +1
7 → -1
4 → -1
```

Then process events in order while maintaining the number of active intervals.

The connection is:

> **Don't repeatedly process an entire range; record what happens at its boundaries and let a running state carry the effect forward.**

This is conceptually very close to difference arrays.

---

# 18. Difference Array vs Sweep Line

They are related, but not identical.

### Difference Array

Usually works on a discrete indexed domain:

```text
0, 1, 2, ..., n-1
```

and reconstructs values with prefix sums.

### Sweep Line

Usually processes sorted **events/coordinates** and maintains an active state.

Common in:

- Interval overlap
    
- Meeting rooms
    
- Maximum simultaneous events
    
- Rectangle geometry
    

For standard DSA, knowing the conceptual connection is enough.

---

# 19. Another Important Related Technique: Coordinate Compression

Suppose intervals use huge coordinates:

```text
[1, 1_000_000_000]
```

A difference array of size `1_000_000_001` is obviously wasteful.

If only a small number of coordinates actually matter, we can:

```text
Collect important coordinates
        ↓
Sort them
        ↓
Map them to compressed indices
        ↓
Apply range/event techniques
```

This is called:

> **Coordinate Compression**

It's often paired with sweep-line or range-update techniques.

You don't need it for ordinary difference-array problems, but it's an important extension when the coordinate range is huge.

---

# 20. A Very Important Limitation

Difference arrays are excellent when the pattern is:

```text
Many updates
        ↓
One final reconstruction
```

They are **not** ideal when you need:

```text
Update
Query
Update
Query
Update
Query
...
```

interleaved.

Example:

```text
Add 5 to [2,10]

What's the sum of [4,8]?

Add 3 to [1,5]

What's the sum of [2,7]?
```

A simple difference array would have to reconstruct too much repeatedly.

That's when you should think about:

- Fenwick Tree
    
- Segment Tree
    

depending on the query/update requirements.

---

# 21. Practical Decision Tree

```text
Do I have range operations?
          │
          ↓
       YES
          │
          ├── Mostly range SUM QUERIES?
          │       ↓
          │   Prefix Sum
          │
          ├── Many range UPDATES,
          │   then final array?
          │       ↓
          │   Difference Array
          │
          ├── Updates + Queries interleaved?
          │       ↓
          │   Fenwick / Segment Tree
          │
          └── Huge/sparse coordinates?
                  ↓
          Coordinate Compression
          + appropriate technique
```

---

# 22. The Deeper Pattern

The reason this technique feels almost magical is that we're changing **where the work happens**.

### Naive

For every update:

```text
touch every affected element
```

```text
Update 1 → ███████
Update 2 →   █████
Update 3 →     ███████
...
```

Potentially:

```text
O(NQ)
```

### Difference Array

For every update:

```text
touch only two boundaries
```

```text
Update 1 → +x              -x
Update 2 →     +x              -x
Update 3 →         +x                -x
```

Then make **one global pass**.

```text
O(Q) + O(N)
```

This is the key DSA lesson:

> **When many operations have the same structure, look for a compact representation of their effect rather than performing each operation literally.**

---

# 23. Interview Cheat Sheet

|Problem Pattern|Technique|
|---|---|
|Many static range-sum queries|Prefix Sum|
|Many range additions, final result needed|Difference Array|
|2D range additions|2D Difference Array|
|Interval/event processing|Sweep Line|
|Huge sparse coordinates|Coordinate Compression|
|Range updates + queries interleaved|Fenwick Tree / Segment Tree|

### The three formulas worth memorizing

**1D range addition:**

```python
diff[l] += x
diff[r + 1] -= x
```

**1D reconstruction:**

```python
current += diff[i]
```

**2D rectangle addition:**

```python
diff[r1][c1] += x
diff[r1][c2 + 1] -= x
diff[r2 + 1][c1] -= x
diff[r2 + 1][c2 + 1] += x
```

---

# 24. Final Mental Model

Don't think:

> "Difference array is a special trick I have to memorize."

Think:

```text
Range operation
      ↓
What actually changes?
      ↓
Only the START and END boundaries
      ↓
Record those changes
      ↓
Prefix accumulation
      ↓
Effect propagates across the range
```

That's why such a tiny amount of bookkeeping can replace `O(length of range)` work with `O(1)` work per update.

And the same philosophy keeps reappearing in:

```text
Difference Array
       ↓
2D Difference Array
       ↓
Sweep Line
       ↓
Coordinate Compression
       ↓
Fenwick / Segment Tree
```

The later structures are more powerful, but the underlying interview skill is the same: **avoid repeatedly touching everything when you can represent the aggregate effect compactly.**