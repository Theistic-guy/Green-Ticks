<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Find a Peak Element — Binary Search on an Unsorted Array

> **Core lesson:** Binary search does **not** require the array itself to be sorted. It requires a way to look at `mid` and **prove that one side must contain a valid answer**.
> 
> **Critical hidden assumption in the standard problem:** Boundary elements are allowed to be peaks. Equivalently, treat:
> 
> ```text
> nums[-1] = nums[n] = -∞
> ```
> 
> This assumption is what makes the `O(log n)` proof work.

---

# 1. Problem

Given an array, find **any peak element**.

A peak is an element greater than its adjacent elements.

Example:

```text
[1, 2, 3, 1]
       ↑
      peak
```

`3` is a peak because:

```text
2 < 3 > 1
```

For the standard problem, boundary elements are also allowed to be peaks.

Conceptually:

```text
nums[-1] = -∞
nums[n]  = -∞
```

Therefore:

```text
[5, 4, 3]

5 > -∞
↑
peak
```

and:

```text
[1, 2, 3]

3 > -∞
    ↑
   peak
```

---

# 2. The Surprising Part

The array does **not** need to be sorted.

Example:

```text
[1, 2, 1, 3, 5, 6, 4]
```

Yet we can solve the problem in:

```text
O(log n)
```

The reason is not sortedness.

Instead, we use the **local slope** around `mid`.

Ask:

```text
Is nums[mid] < nums[mid + 1]?
```

There are only two possibilities:

```text
        nums[mid] < nums[mid+1]
                    ↓
                 uphill
                    ↓
          peak must exist RIGHT
```

or:

```text
        nums[mid] > nums[mid+1]
                    ↓
                downhill
                    ↓
          peak must exist LEFT
```

This gives us a way to discard half the search space.

---

# 3. Why Does "Uphill → Peak on Right" Work?

Suppose:

```text
nums[mid] < nums[mid + 1]
```

We are going uphill:

```text
             /
            /
       mid /
          /
---------/---------
```

Starting from `mid`, there are only two possibilities.

### Case A — Eventually the sequence goes down

```text
             /\
            /  \
           /    \
```

The turning point is a peak.

### Case B — It never goes down

```text
              /
             /
            /
           /
          /
```

Eventually we reach the **right boundary**.

Because the boundary is allowed to be a peak:

```text
              /
             /
            /
           /
          /
         ↑
     boundary
```

that boundary is a valid peak.

Therefore:

> If `nums[mid] < nums[mid+1]`, **a peak is guaranteed somewhere to the right**.

So:

```python
low = mid + 1
```

is safe.

---

# 4. Why Does "Downhill → Peak on Left" Work?

Suppose:

```text
nums[mid] > nums[mid+1]
```

We are going downhill:

```text
       \
        \
         \
          \ mid
```

Again, there are two possibilities.

### Case A — Something higher exists on the left

Eventually we can have:

```text
        /\
       /  \
      /    \
           \
            \
```

A peak exists on the left.

### Case B — The sequence keeps decreasing toward the left

Eventually we reach the **left boundary**.

Because the boundary is allowed to be a peak, it is a valid answer.

Therefore:

> If `nums[mid] > nums[mid+1]`, **a peak is guaranteed on the left, including `mid`**.

So:

```python
high = mid
```

We keep `mid` because `mid` itself might already be the peak.

---

# 5. The Crucial Hidden Assumption

This is the part worth remembering long-term.

The statement:

```text
nums[mid] < nums[mid+1]
        ↓
peak must exist on the RIGHT
```

is **not universally true**.

It is true for the **standard problem because boundaries are valid peaks**.

Consider:

```text
[1, 2, 3, 4, 5]
```

If boundary peaks are allowed:

```text
1 < 2 < 3 < 4 < 5 > -∞
                    ↑
                   peak
```

So an increasing slope guarantees a peak.

But suppose the problem explicitly says:

> Only elements with **two actual neighbors** can be peaks.

Then:

```text
[1, 2, 3, 4, 5]
```

contains **no peak at all**.

The increasing slope reaches the boundary without ever turning downward.

Therefore:

```text
nums[mid] < nums[mid+1]
```

would **not** prove that a valid interior peak exists to the right.

---

# 6. Your Counterexample — Why It Matters

Consider an array like:

```text
[1,2,3,2,1,2,3,4,5,6,7,8,9,10,11,12,13,15,155,167,167890]
```

There is a valid interior peak very early:

```text
[1, 2, 3, 2, 1, ...]
       ↑
      peak
```

But then the array becomes one long increasing slope:

```text
1,2,3,2,1,2,3,4,5,6,7,8,...,167890
        └───────────────↑
                    increasing
```

Suppose `mid` lands somewhere in that increasing region.

We see:

```text
nums[mid] < nums[mid+1]
```

The standard algorithm would say:

```text
"Go right."
```

But if the right boundary is **not** a valid peak, that conclusion is unjustified.

The actual valid peak could be far to the **left**.

So the simple binary-search proof breaks.

---

# 7. Why the Standard Problem Gets Away With It

The standard problem effectively guarantees:

```text
nums[-1] = -∞
nums[n]  = -∞
```

Therefore every finite array has at least one peak.

Any increasing run must eventually either:

```text
uphill → downhill
```

or:

```text
uphill → boundary
```

Both produce a valid peak.

This gives the crucial invariant:

> **At every iteration, the current search interval is guaranteed to contain at least one valid peak.**

Then the slope tells us which half retains that guarantee.

---

# 8. Binary Search Without Sortedness

This problem teaches a much better definition of binary search.

### Common but incomplete definition

> Binary search works on sorted arrays.

### Better definition

> **Binary search works when some property lets us safely eliminate a large portion of the search space.**

For ordinary binary search:

```text
sorted values
      ↓
compare target with mid
      ↓
discard one half
```

For Peak Element:

```text
local slope
      ↓
prove a peak exists on one side
      ↓
discard the other half
```

The array itself does not need to be sorted.

---

# 9. Complete Code

```python
def findPeakElement(nums):

    low = 0
    high = len(nums) - 1

    while low < high:

        mid = (low + high) // 2

        if nums[mid] < nums[mid + 1]:
            # Uphill:
            # a peak must exist to the right
            low = mid + 1

        else:
            # Downhill:
            # a peak exists on the left,
            # including mid
            high = mid

    return low
```

At the end:

```text
low == high
```

so the remaining index is a peak.

---

# 10. Why `high = mid`, Not `mid - 1`?

When:

```python
nums[mid] > nums[mid + 1]
```

`mid` itself might be the peak.

Example:

```text
[1, 5, 4]
   ↑
  mid
```

We have:

```text
1 < 5 > 4
```

So we must retain `mid`:

```python
high = mid
```

---

# 11. Why `low = mid + 1`?

When:

```python
nums[mid] < nums[mid + 1]
```

`mid` cannot be a peak because its right neighbor is larger.

Therefore:

```python
low = mid + 1
```

is safe.

---

# 12. Complexity

Each iteration eliminates approximately half of the remaining search space.

Therefore:

```text
Time = O(log n)
Auxiliary Space = O(1)
```

---

# 13. The Long-Term Pattern to Remember

When you encounter an unfamiliar binary-search problem, don't immediately ask:

> "Is the array sorted?"

Instead ask:

### ① What information can I obtain from `mid`?

```text
value?
slope?
feasibility?
count?
boundary condition?
```

### ② Does it tell me something definite?

```text
If X is true,
an answer MUST exist on this side.
```

### ③ Can I safely discard the other side?

If yes:

```text
→ Binary search may be possible.
```

---

# 14. The Most Important Insight

The real magic of this problem is **not**:

```python
if nums[mid] < nums[mid+1]:
```

The real magic is the proof behind it:

```text
Boundary = -∞
       ↓
Every finite array has a peak
       ↓
An uphill slope cannot continue forever
without reaching a valid peak
       ↓
Therefore a peak is guaranteed on the right
```

Similarly:

```text
Downhill slope
       ↓
Either we eventually turn upward
       ↓
or reach the left boundary
       ↓
Therefore a peak is guaranteed on the left
```

That guarantee is what makes the binary search legitimate.

---

# 15. Interview Answer

If asked:

> **"How can binary search work when the array isn't sorted?"**

A strong answer:

> "The array doesn't need to be sorted here. What we need is a way to eliminate half the search space. At `mid`, if `nums[mid] < nums[mid+1]`, we're on an uphill slope, so a peak must exist to the right. If `nums[mid] > nums[mid+1]`, a peak must exist on the left, including `mid`. This relies on the standard problem allowing boundary elements to be peaks, effectively treating the outside values as negative infinity. That invariant lets us discard half the search space each iteration."

---

# Mental Model

```text
                 Peak Element
                      │
                      ↓
              Look at the slope
                 /          \
              UP              DOWN
               ↓                ↓
       peak guaranteed    peak guaranteed
          on RIGHT          on LEFT
               ↓                ↓
          discard LEFT     discard RIGHT
                 \          /
                      ↓
                O(log n)
```

> **Long-term takeaway:**  
> Don't memorize "Peak Element = binary search."  
> Remember **why the elimination is valid** and especially remember the hidden boundary assumption that makes the proof work.