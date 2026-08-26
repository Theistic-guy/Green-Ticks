---
Title: Count Subsets with Given Sum
Companies:
  - Not Specified
Topics:
  - DP
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - Subset
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Count Subsets with Given Sum

**Pattern:** 2D matrix DP

**Idea:** 

---

## 💻 Code
This solution is optimized from 2D matrix to 1D dp array.
<details>
<summary>✅ (important) Why loop runs backward in 1D dp array</summary>

Let's zoom right into that backward loop, because it is the single trickiest part of turning a 2D DP problem into a 1D DP array.

### The Core Goal

When we are processing a number `x`, we want to treat it as a **single item** that we can either **use once or skip**.

To calculate the new ways to form a sum `s`, we look at `dp[s - x]`. For this logic to be correct, **`dp[s - x]` MUST contain the count from _before_ we started processing `x`**.

### What Happens If We Loop FORWARD (The Bug)

Suppose `nums = [2]` and `target = 6`. We start with `dp = [1, 0, 0, 0, 0, 0, 0]`.

If we iterate forward: `for s in range(x, target + 1)` with `x = 2`:

1. **`s = 2`**: `dp[2] += dp[2 - 2]` $\rightarrow$ `dp[2] += dp[0]` $\rightarrow$ **`dp[2] = 1`**
    
    _(Meaning: We can make sum 2 using `[2]`)_
    
2. **`s = 4`**: `dp[4] += dp[4 - 2]` $\rightarrow$ `dp[4] += dp[2]` $\rightarrow$ **`dp[4] = 1`**
    
    _(Wait! `dp[2]` was just updated in step 1! So `dp[4]` is counting `2 + 2`, using `2` **twice**!)_
    
3. **`s = 6`**: `dp[6] += dp[6 - 2]` $\rightarrow$ `dp[6] += dp[4]` $\rightarrow$ **`dp[6] = 1`**
    
    _(Now it used `2` **three times** to make 6!)_
    

**Result of Forward Loop:** You accidentally solved the **Unbounded Knapsack** problem (where you have infinite copies of each number, like coin change).

### What Happens When We Loop BACKWARD (The Fix)

Now let's do the exact same array `dp = [1, 0, 0, 0, 0, 0, 0]` with `x = 2`, but loop **backward**: `for s in range(6, 1, -1)`:

1. **`s = 6`**: `dp[6] += dp[4]` $\rightarrow$ `0 + 0` $\rightarrow$ **`dp[6] = 0`**
    
    _(Reads `dp[4]`, which hasn't been touched yet!)_
    
2. **`s = 4`**: `dp[4] += dp[2]` $\rightarrow$ `0 + 0` $\rightarrow$ **`dp[4] = 0`**
    
    _(Reads `dp[2]`, which hasn't been touched yet!)_
    
3. **`s = 2`**: `dp[2] += dp[0]` $\rightarrow$ `0 + 1` $\rightarrow$ **`dp[2] = 1`**
    

Notice how `dp[6]` looked at `dp[4]` **before** `dp[4]` had a chance to update. Running backward guarantees that `dp[s - x]` always comes from the **previous row / previous element iteration**.

### 2D Grid Equivalent

In the 2D matrix version, you write:

`dp[i][s] = dp[i-1][s] + dp[i-1][s - x]`

Notice how BOTH values on the right come from row `i - 1` (the past).

- **Backward 1D Loop:** Overwrites the right side of the array first, leaving the left side untouched so it still represents row `i - 1`.
    
- **Forward 1D Loop:** Overwrites the left side first, so when the right side looks left, it accidentally reads values from row `i` (the present).
</details>
### 2D matrix
```python
def countSubsets2D(nums, target):
    n = len(nums)
    # Rows: 0 to n items, Columns: 0 to target sum
    dp = [[0] * (target + 1) for _ in range(n + 1)]

    # Base case: There is 1 way to make sum 0 (empty subset)
    for i in range(n + 1):
        dp[i][0] = 1

    for i in range(1, n + 1):
        num = nums[i - 1]
        for s in range(target + 1):
            # Choice 1: Exclude the current number
            dp[i][s] = dp[i - 1][s]

            # Choice 2: Include the current number (if it fits)
            if s >= num:
                dp[i][s] += dp[i - 1][s - num]

    return dp[n][target]

```
To see how we collapse the 2D matrix into a 1D array, look closely at what row `i` actually needs from row `i - 1` during the calculation.

#### Step 1: Look at the 2D Formula

In the 2D version, the formula to calculate any cell in row `i` is:

$$\text{dp}[i][s] = \underbrace{\text{dp}[i - 1][s]}_{\text{Cell directly above}} + \underbrace{\text{dp}[i - 1][s - x]}_{\text{Cell above and to the left}}$$

Notice two crucial details:

1. **Row Independence:** To calculate row `i`, you **only need row `i - 1`**. You never look at row `i - 2`, `i - 3`, or anything older.
    
2. **Direction of Lookup:** You only ever look at cells directly **above** or to the **left** in the previous row. You _never_ look to the right.
    

#### Step 2: Superimposing Row `i` onto Row `i - 1`

Since we only need the immediately preceding row, we don't need to keep $N$ rows in memory. We can just keep **one row** in memory and overwrite it in place as we process each number.

Imagine updating a single 1D array in place for a number $x$:

Plaintext

```
[ Old Value for s=0 ] ... [ Old Value for s=s-x ] ... [ Old Value for s=s ]
                                  │                            │
                                  └─────────── Add ────────────┘
                                               │
                                               ▼
                                      [ New Value for s=s ]
```

#### Step 3: The Danger of In-Place Overwriting

Because we are reusing the same array, **the order in which we overwrite values matters**:

- If we update **Left to Right (Forward)**:
    
    We overwrite `dp[s - x]` with its **new** value _before_ we reach `dp[s]`. When we later compute `dp[s] += dp[s - x]`, we accidentally read the _new_ value (using element $x$ twice).
    
- If we update **Right to Left (Backward)**:
    
    When we compute `dp[s]`, we look to our left at `dp[s - x]`. Because we haven't reached `dp[s - x]` yet in our backward sweep, it still holds its **old** value from the previous element iteration!
    

#### Summary of the Transition

Plaintext

```
2D Matrix State:   dp[i][s] = dp[i-1][s] + dp[i-1][s-x]
                              └───────┬───────┘
                                      │  (Drop the 'i' index)
                                      ▼
1D Optimization:   dp[s]    = dp[s]      + dp[s-x]   (evaluated right-to-left)
```

By dropping the row index `i` and looping backward, the single 1D array automatically acts as row `i-1` for inputs to the right, while transforming into row `i` behind it as it moves left.

### 1-D dp
```python
def countSubsets(nums, target):

    dp = [0]*(target+1)

    dp[0] = 1

    for x in nums:

        for s in range(target,x-1,-1):
            dp[s] = dp[s] + dp[s-x]

    return dp[target]
```

Time : O (n * S)
Auxiliary Space : O(S)
Variation - [equal-partition](equal-partition.md)

---
## Problem

Instead of asking

> Does a subset exist?

Ask

> How many subsets exist?

Example

```text
nums = [1,2,3]

target = 3

Answer = 2

[3]

[1,2]
```

---

## Key Observation

Only the DP transition changes.

Decision Problem

```python
OR
```

↓

Count Problem

```python
+
```

---

## State

```text
dp[s]

Number of ways to obtain sum s
```

---
## Interview Insight

Replacing

```python
OR
```

with

```python
+
```

is one of the most common DP transformations.

This idea also appears in

- Perfect Sum
    
- Target Sum
    