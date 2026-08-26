<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Maximum Subarray — Important Interview Variations

> **Prerequisite:** Kadane's Algorithm . [maximum-subarray-sum](../Problems/maximum-subarray-sum.md)
> 
> Core idea of Kadane:
> 
> ```text
> best subarray ending at i
>     =
> max(nums[i], previous_best + nums[i])
> ```
> 
> The variations below are useful because each changes **what state we need to remember** or **how we transform the problem**.

---

# 1. Maximum Circular Subarray ⭐⭐⭐⭐⭐

## Problem

The array is circular, meaning the last element is adjacent to the first.

Find the maximum-sum **non-empty** subarray.

Example:

```text
nums = [5, -3, 5]

Normal maximum:
[5, -3, 5] = 7

Circular maximum:
[5] + [5] = 10

Answer = 10
```

---

## Key Insight

A maximum circular subarray has only two possibilities:

### Case 1 — It does NOT wrap

Just use normal Kadane.

```text
[ ... maximum contiguous section ... ]
```

### Case 2 — It DOES wrap

A wrapping subarray looks like:

```text
[ suffix ][ prefix ]
```

Instead of finding that directly, find the **minimum subarray in the middle** and remove it.

```text
Total array
     │
     ├──── minimum subarray ────┤
     │                          │
     └── remaining elements ────┘
              ↑
       maximum wrapping sum
```

Therefore:

```text
circular_max = total_sum - minimum_subarray_sum
```

Final answer:

```text
max(normal_max, total_sum - min_subarray)
```

---

## Important Edge Case

If **all numbers are negative**, then:

```text
total_sum - min_subarray
```

would effectively select an empty subarray.

But the problem requires a **non-empty** subarray.

Example:

```text
[-3, -2, -5]
```

Normal maximum:

```text
-2
```

So if

```text
max_sum < 0
```

return `max_sum`.

---

## Complete Code

```python
def maxSubarraySumCircular(nums):
    total = sum(nums)

    # Normal Kadane
    max_sum = nums[0]
    current_max = nums[0]

    # Minimum Kadane
    min_sum = nums[0]
    current_min = nums[0]

    for x in nums[1:]:
        current_max = max(x, current_max + x)
        max_sum = max(max_sum, current_max)

        current_min = min(x, current_min + x)
        min_sum = min(min_sum, current_min)

    # All elements are negative
    if max_sum < 0:
        return max_sum

    return max(max_sum, total - min_sum)
```

### Complexity

- **Time:** `O(n)`
    
- **Auxiliary Space:** `O(1)`
    

---

## Interview Insight

The beautiful trick is:

> **Maximum circular subarray = total sum − minimum subarray**

But remember the **all-negative edge case**.

---

# 2. Maximum Product Subarray ⭐⭐⭐⭐⭐

## Problem

Find the contiguous subarray having the maximum product.

Example:

```text
nums = [2, 3, -2, 4]

Answer = 6

Subarray:
[2, 3]
```

---

## Why Can't We Simply Use Kadane?

For sums:

```text
negative + something
```

has predictable behavior.

For products, a negative number can completely change the situation.

Example:

```text
[-2, 3, -4]
```

The two negatives produce a positive product:

```text
(-2) × 3 × (-4) = 24
```

So a **very small negative product** may become the **largest positive product** after multiplying by another negative.

Therefore, at every position we need to remember:

```text
maximum product ending here
minimum product ending here
```

---

## Why Minimum?

Suppose:

```text
current_min = -10
current_max = 3
x = -5
```

Then:

```text
current_min * x = 50
current_max * x = -15
```

The previous minimum becomes the new maximum.

---

## State

Maintain:

```text
max_prod = maximum product ending at current position

min_prod = minimum product ending at current position
```

For each `x`:

```text
new_max = max(x,
              x * old_max,
              x * old_min)

new_min = min(x,
              x * old_max,
              x * old_min)
```

The answer is the maximum `max_prod` encountered.

---

## Complete Code

```python
def maxProduct(nums):
    current_max = nums[0]
    current_min = nums[0]
    answer = nums[0]

    for x in nums[1:]:

        old_max = current_max
        old_min = current_min

        current_max = max(
            x,
            x * old_max,
            x * old_min
        )

        current_min = min(
            x,
            x * old_max,
            x * old_min
        )

        answer = max(answer, current_max)

    return answer
```

### Complexity

- **Time:** `O(n)`
    
- **Auxiliary Space:** `O(1)`
    

---

## Interview Takeaway

For maximum product:

> **Track both maximum and minimum.**

Because:

```text
negative × negative = positive
```

This is one of the most important differences between **Kadane for sum** and **Kadane-like DP for product**.

---

# 3. Maximum Subarray Sum with One Deletion ⭐⭐⭐⭐

## Problem

You may delete **at most one element** from the array.

Find the maximum possible subarray sum.

Example:

```text
nums = [1, -2, 0, 3]

Without deletion:
1 + (-2) + 0 + 3 = 2

Delete -2:
1 + 0 + 3 = 4

Answer = 4
```

---

## Key Insight

At every position, maintain two states:

### `no_delete`

Maximum sum ending here with **no deletion used**.

### `one_delete`

Maximum sum ending here with **one deletion already used**.

For current value `x`:

```text
no_delete =
    max(x,
        no_delete + x)
```

For `one_delete`, we have two possibilities:

### Don't delete `x`

```text
one_delete + x
```

### Delete `x`

Then the previous subarray must have used **no deletion**:

```text
previous_no_delete
```

Therefore:

```text
one_delete =
    max(previous_one_delete + x,
        previous_no_delete)
```

---

## Complete Code

```python
def maximumSum(nums):
    no_delete = nums[0]
    one_delete = float("-inf")

    answer = nums[0]

    for x in nums[1:]:

        old_no_delete = no_delete
        old_one_delete = one_delete

        no_delete = max(
            x,
            old_no_delete + x
        )

        one_delete = max(
            old_one_delete + x,
            old_no_delete
        )

        answer = max(
            answer,
            no_delete,
            one_delete
        )

    return answer
```

### Complexity

- **Time:** `O(n)`
    
- **Auxiliary Space:** `O(1)`
    

---

## Why Does `one_delete = old_no_delete` Mean Delete `x`?

Suppose:

```text
nums = [1, -2, 3]
```

At `-2`:

```text
old_no_delete = 1
```

If we delete `-2`, the resulting subarray is simply:

```text
[1]
```

So the new `one_delete` state is:

```text
1
```

Then when `3` arrives:

```text
1 + 3 = 4
```

giving:

```text
[1, -2, 3]
      ↓
     delete
      ↓
[1, 3]
```

---

## Interview Takeaway

This is a classic example of:

> **Adding one extra state to Kadane to represent one special operation.**

This pattern generalizes to many DP problems.

---

# 4. Maximum Average Subarray ⭐⭐⭐⭐

## Standard Interview Version

Given an array and integer `k`, find the **maximum average of any contiguous subarray of exactly length `k`**.

Example:

```text
nums = [1,12,-5,-6,50,3]
k = 4
```

Best window:

```text
[12,-5,-6,50]

sum = 51

average = 51 / 4 = 12.75
```

---

## Important Observation

Because the length is fixed:

```text
maximum average
```

is equivalent to:

```text
maximum sum
```

You don't need Kadane.

You need a **sliding window**.

---

## Complete Code

```python
def findMaxAverage(nums, k):
    window_sum = sum(nums[:k])
    best_sum = window_sum

    for right in range(k, len(nums)):
        window_sum += nums[right]
        window_sum -= nums[right - k]

        best_sum = max(best_sum, window_sum)

    return best_sum / k
```

### Complexity

- **Time:** `O(n)`
    
- **Auxiliary Space:** `O(1)`
    

---

## Why Not Divide Every Window by `k`?

Because `k` is constant.

If:

```text
sum1 > sum2
```

then:

```text
sum1/k > sum2/k
```

So simply maximize the sum.

---

## Important Distinction

If the problem says:

> Maximum average subarray of **exactly `k` elements**

→ **Sliding Window**

If it says:

> Maximum average subarray with **arbitrary length**

that's a different and substantially harder problem; don't automatically apply this solution.

For standard interview preparation, the **fixed-length version (LeetCode 643)** is the important one.

---

# 5. Maximum Sum Rectangle in a 2D Matrix ⭐⭐⭐⭐⭐

## Problem

Given a 2D matrix, find the rectangular submatrix having the maximum sum.

Example:

```text
[
  [ 1,  2, -1],
  [-3,  4,  5],
  [ 2, -1,  3]
]
```

We want the rectangle with maximum sum.

---

# Key Insight

This is essentially:

> **Kadane's Algorithm + Row Compression**

Suppose we choose:

```text
top = row 1
bottom = row 2
```

Combine those rows column-by-column.

```text
Row 1:   1   2  -1
Row 2:  -3   4   5

Combined:
        -2   6   4
```

Now the 2D rectangle problem becomes a **1D maximum subarray problem**:

```text
[-2, 6, 4]
```

Kadane finds:

```text
6 + 4 = 10
```

which corresponds to a rectangle spanning those two rows.

---

# Algorithm

Fix the top row.

Then progressively move the bottom row downward.

For every new bottom row:

1. Add that row into a column-sum array.
    
2. Run Kadane on the column sums.
    
3. Keep the best result.
    

Conceptually:

```text
Choose top row
      ↓
Add next row
      ↓
Column sums
      ↓
Kadane
      ↓
Add next row
      ↓
Column sums
      ↓
Kadane
      ↓
...
```

---

# Complete Code

```python
def maxSumRectangle(matrix):

    rows = len(matrix)
    cols = len(matrix[0])

    answer = float("-inf")

    for top in range(rows):

        column_sum = [0] * cols

        for bottom in range(top, rows):

            # Compress rows top..bottom
            for col in range(cols):
                column_sum[col] += matrix[bottom][col]

            # Kadane on compressed array
            current = column_sum[0]
            best = column_sum[0]

            for col in range(1, cols):
                current = max(
                    column_sum[col],
                    current + column_sum[col]
                )

                best = max(best, current)

            answer = max(answer, best)

    return answer
```

### Complexity

For an `R × C` matrix:

- Choose top row: `O(R)`
    
- Choose bottom row: `O(R)`
    
- Update column sums: `O(C)`
    
- Kadane: `O(C)`
    

Therefore:

```text
Time = O(R² × C)
```

Auxiliary space:

```text
O(C)
```

assuming we compress along the columns.

---

# Why This Is Important

This is a very common example of a **2D problem being reduced to a known 1D problem**.

The important thought process is:

```text
2D rectangle
      ↓
Fix top and bottom boundaries
      ↓
Compress rows into 1D column sums
      ↓
Maximum subarray
      ↓
Kadane
```

You should recognize this pattern rather than memorize the implementation.

---

# Overall Comparison

|Problem|Main Technique|Time|Aux. Space|
|---|---|--:|--:|
|Maximum Subarray|Kadane|`O(n)`|`O(1)`|
|Maximum Circular Subarray|Kadane × 2|`O(n)`|`O(1)`|
|Maximum Product Subarray|Track min + max|`O(n)`|`O(1)`|
|Max Sum with One Deletion|2-state Kadane|`O(n)`|`O(1)`|
|Maximum Average, fixed `k`|Sliding Window|`O(n)`|`O(1)`|
|Maximum Sum Rectangle|Row compression + Kadane|`O(R²C)`|`O(C)`|

---

# How to Recognize the Variation

```text
Maximum SUM
    ↓
Kadane
```

```text
Circular array
    ↓
Normal Kadane
+
Minimum Kadane
```

```text
PRODUCT
    ↓
Track MAX + MIN
```

```text
One deletion allowed
    ↓
Kadane + extra state
```

```text
Average of exactly k elements
    ↓
Fixed-size Sliding Window
```

```text
2D maximum rectangle
    ↓
Compress rows
+
1D Kadane
```

---

# High-ROI Interview Takeaways

### ⭐ Maximum Circular Subarray

Know the transformation:

```text
max circular
=
max(normal max,
    total - minimum subarray)
```

**Edge case:** all elements negative.

---

### ⭐ Maximum Product Subarray

Remember:

```text
max + min
```

because a negative can turn the minimum into the maximum.

---

### ⭐ Maximum Sum with One Deletion

Remember the two states:

```text
no_delete
one_delete
```

This is a useful example of **state augmentation**.

---

### ⭐ Maximum Average Subarray

For **exactly `k` elements**:

```text
maximum average
        ↓
maximum sum
        ↓
sliding window
```

Don't unnecessarily use binary search or complicated DP.

---

### ⭐ Maximum Sum Rectangle

Remember:

```text
2D
 ↓
Fix two boundaries
 ↓
Compress
 ↓
1D
 ↓
Kadane
```

This is the most important conceptual follow-up among the five because it demonstrates how a familiar 1D algorithm can be lifted to 2D.

---

# What NOT to Over-study

For standard FAANG/product-company SWE preparation, I would **not** go down rabbit holes such as:

- exotic maximum-subarray variants
    
- divide-and-conquer implementations of Kadane
    
- advanced max-average binary-search formulations unless specifically asked
    
- higher-dimensional Kadane
    
- specialized matrix algorithms
    

The five variations above are enough to build the practical **"maximum subarray family"** you are likely to encounter in interviews.