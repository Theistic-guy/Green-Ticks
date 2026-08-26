<h1 align='right'><a href="../README.md">⇐🏠</a></h1>


---

# 1. Count Subarrays with Given Sum (LeetCode 560)

## Problem

Count the number of subarrays whose sum equals `k`.

---

## Key Idea

For every prefix sum,

we need a previous prefix sum equal to

$$  
prefix-k  
$$

Unlike the existence problem,

we need **how many times** that prefix sum has appeared.

Therefore, use a **Hash Map of frequencies**.

---

## Python Code

```python
from collections import defaultdict

def subarray_sum(nums, k):

    freq = defaultdict(int)

    freq[0] = 1

    prefix = 0
    ans = 0

    for num in nums:

        prefix += num

        ans += freq[prefix-k]

        freq[prefix] += 1

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 2. Longest Subarray with Given Sum

## Problem

Find the maximum length of a subarray whose sum equals `k`.

---

## Key Idea

Store the **first occurrence** of every prefix sum.

Why first?

Because the earliest occurrence produces the **longest distance**.

---

## Python Code

```python
def longest_subarray(arr, k):

    first = {}

    prefix = 0
    ans = 0

    for i, num in enumerate(arr):

        prefix += num

        if prefix == k:
            ans = i + 1

        if prefix-k in first:
            ans = max(ans, i-first[prefix-k])

        if prefix not in first:
            first[prefix] = i

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 3. Smallest Subarray with Sum ≥ K

## Problem

Find the minimum length subarray whose sum is at least `k`.

---

## Key Idea

For **positive numbers only**,

Sliding Window works because shrinking always decreases the sum.

---

## Python Code

```python
def min_subarray(arr, k):

    left = 0
    curr = 0

    ans = float("inf")

    for right in range(len(arr)):

        curr += arr[right]

        while curr >= k:

            ans = min(ans, right-left+1)

            curr -= arr[left]
            left += 1

    return ans if ans != float("inf") else 0
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

> If negative numbers are allowed, this becomes a much harder problem (LeetCode 862) and is solved using **Prefix Sum + Monotonic Deque**.

---

# 4. Binary Subarrays With Sum (LeetCode 930)

## Problem

The array contains only

```text
0 and 1
```

Count subarrays whose sum equals `goal`.

---

## Key Idea

This is identical to **Count Subarrays with Given Sum**.

Binary values do **not** change the algorithm.

Use

- Prefix Sum
    
- Frequency Hash Map
    

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 5. Subarray Sum Divisible by K (LeetCode 974)

## Problem

Count subarrays whose sum is divisible by `k`.

---

## Key Idea

Instead of storing

```text
Prefix Sum
```

store

```text
Prefix Sum % k
```

Suppose

```text
Prefix1 % k = Prefix2 % k
```

Then

```text
Prefix2-Prefix1
```

is divisible by `k`.

---

## Python Code

```python
from collections import defaultdict

def divisible(nums, k):

    freq = defaultdict(int)

    freq[0] = 1

    prefix = 0
    ans = 0

    for num in nums:

        prefix += num

        rem = prefix % k

        ans += freq[rem]

        freq[rem] += 1

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**


## Explanation

------------------------------
### ⚙️ How It Works (Step-by-Step)
The algorithm tracks the cumulative sum of the array and uses remainders to find matching subarrays.

 
* Prefix Sum: It keeps a running total (prefix) of the numbers visited so far.
* Modulo Math: It calculates the remainder (rem) when the running total is divided by $k$.
* The Core Logic: If the same remainder shows up multiple times, the numbers added in between those two points must sum up to a multiple of $k$.
* Frequency Tracking: The defaultdict(int) counts how many times each remainder has appeared.
* Base Case: freq[0] = 1 accounts for any prefix sum that is already perfectly divisible by $k$ without needing to subtract a previous subarray. [5, 6, 7, 8, 9] 



### 📊 Tracing an Example
Let's trace nums = [4, 5, 0, -2, -3, 1] with k = 5.

| Element (num) | Prefix Sum | Remainder (rem) | Matches Found (freq[rem]) | Total Answer (ans) | Updated Frequency |
|---|---|---|---|---|---|
| Start | 0 | - | - | 0 | {0: 1} |
| 4 | 4 | 4 | 0 | 0 | {0: 1, 4: 1} |
| 5 | 9 | 4 | 1 | 1 | {0: 1, 4: 2} |
| 0 | 9 | 4 | 2 | 3 | {0: 1, 4: 3} |
| -2 | 7 | 2 | 0 | 3 | {0: 1, 4: 3, 2: 1} |
| -3 | 4 | 4 | 3 | 6 | {0: 1, 4: 4, 2: 1} |
| 1 | 5 | 0 | 1 | 7 | {0: 2, 4: 4, 2: 1} |

Final Output: 7 matching subarrays.

⚠️ Potential Edge Case Note
In Python, this code works perfectly with negative numbers because Python's % operator always returns a result with the same sign as the divisor ($k$). In languages like Java or C++, you would need to adjust negative remainders manually using (rem + k) % k.

Let’s break it down without the heavy math.
The core issue is that Java/C++ and Python disagree on what a "remainder" is when numbers are negative. This disagreement breaks our code's ability to find matches.

### 🍕 The Intuition (The Clock Analogy)
Think of modulo 5 like a clock with only 5 numbers: 0, 1, 2, 3, 4.

* If you stand at 0 and move 3 steps forward, you land on 3.
* If you stand at 0 and move 2 steps backward (which is -2), you also land on 3.

In reality, -2 and 3 are the exact same spot on our clock.

#### 🚨 Why Java/C++ Breaks It
Our code relies on finding exact duplicates in our map (freq[rem]).
Imagine your array generates a prefix sum of 3 early on, and later generates a prefix sum of -2.

* Python says -2 % 5 is 3. Python looks at the map, sees a 3 from earlier, shouts "Match found!", and increments your answer.
* Java/C++ says -2 % 5 is -2. Java looks at the map for -2. It only sees a 3. It thinks they are different numbers, misses the match, and gives you the wrong answer.


#### 🛠️ The Fix Explained
Because Java/C++ leaves you at -2, we have to manually push it forward by one full circle (+ k) to get it to the positive equivalent. [1] 
If Java gives us rem = -2:

   1. We check if it's negative: rem < 0 (Yes, -2 is less than 0).
   2. We add k: -2 + 5 = 3.
   3. Now rem is 3.

Because we forced -2 to become 3, Java will now successfully match it with the 3 stored in the map earlier!

---

# 6. Continuous Subarray Sum (LeetCode 523)

## Problem

Determine whether there exists a subarray of length **at least 2** whose sum is divisible by `k`.

---

## Key Idea

Exactly the same prefix remainder idea as the previous problem.

Difference

- Store the **first index** where every remainder appears.
    
- Ensure the subarray length is at least two.
    

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 7. Maximum Size Subarray Sum Equals K (LeetCode 325)

## Problem

Find the longest subarray whose sum equals `k`.

---

## Key Idea

Exactly the same as

> Longest Subarray with Given Sum

Store only the **first occurrence** of every prefix sum.

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 8. Count Nice Subarrays (LeetCode 1248)

## Problem

Count subarrays containing exactly `k` odd numbers.

---

## Key Idea

Convert the array.

```text
Odd

↓

1

Even

↓

0
```

Example

```text
[2,1,3,4]

↓

[0,1,1,0]
```

Now the problem becomes

> Count Subarrays with Sum = `k`

Use the standard Prefix Sum + Frequency Hash Map solution.

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 9. Minimum Operations to Reduce X to Zero (LeetCode 1658)

## Problem

Remove elements from the left or right until their sum equals `x`.

Return the minimum number of operations.

---

## Key Insight

Instead of removing elements,

find the **longest subarray** whose sum equals

$$  
\boxed{  
TotalSum-x  
}  
$$

Then,

```text
Answer

=

Array Length

-

Longest Subarray Length
```

So this problem reduces directly to

> Longest Subarray with Given Sum

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 10. Submatrix Sum Equals Target (LeetCode 1074)

## Problem

Count submatrices whose sum equals `target`.

---

## Key Idea

Fix two rows.

Compress everything between them into a **1D array** by summing each column.

Now the problem becomes

> Count Subarrays with Given Sum

Repeat for every pair of rows.

---

## Complexity

If the matrix has

```text
R rows

C columns
```

- **Time Complexity:** **$O(R^2 \times C)$**
    
- **Auxiliary Space Complexity:** **$O(C)$**
    

---

# Pattern Recognition Table

|Variation|Main Idea|
|---|---|
|Count Subarrays|Prefix Sum + Frequency Map|
|Longest Subarray|Prefix Sum + First Occurrence|
|Smallest Subarray ≥ K|Sliding Window (positive numbers)|
|Binary Subarrays|Prefix Sum|
|Sum Divisible by K|Prefix Sum + Modulo|
|Continuous Subarray Sum|Prefix Sum + Modulo + First Index|
|Maximum Size Sum = K|Prefix Sum + First Occurrence|
|Count Nice Subarrays|Convert Odd→1, Even→0, then Prefix Sum|
|Reduce X to Zero|Longest Subarray = TotalSum − X|
|Submatrix Sum|Compress Rows → Count Subarrays|

---

# Master Interview Pattern

Most FAANG questions in this family reduce to one of just **four templates**.

|Pattern|Used In|
|---|---|
|Sliding Window|Positive numbers, fixed/variable windows|
|Prefix Sum + HashMap (Frequency)|Count problems|
|Prefix Sum + HashMap (First Index)|Longest/Maximum Length problems|
|Prefix Sum + Modulo|Divisibility problems|

> **Interview Tip:** Instead of memorizing 10 different solutions, identify **what the question is asking**:
> 
> - **"Does it exist?"** → Prefix Sum + Set/HashMap
>     
> - **"How many?"** → Prefix Sum + Frequency Map
>     
> - **"Longest?"** → Prefix Sum + First Occurrence
>     
> - **"Divisible?"** → Prefix Sum + Modulo
>     
> - **"Only positive numbers?"** → Sliding Window
>     
> 
> Once you recognize the pattern, the implementation is usually just a small variation of the same template.
