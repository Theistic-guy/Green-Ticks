See :
+ [shortest-subarray-with-sum-at-least-k](../Problems/shortest-subarray-with-sum-at-least-k.md)
+ [sliding-window-maximum](../Problems/sliding-window-maximum.md)


---

## 🧠 The Core Philosophy: "The Smarter Candidate"

Whenever you need to look back at past choices to find an optimal partner for your current element, ask yourself:

1. _Does a new element make an older element completely obsolete?_ (i.e., Is the new element both better in value and better/fresher in position?)
2. _Once an old element satisfies a condition, is it useless for any future elements?_

If the answer to either is yes, you are dealing with a Monotonic Deque problem.

---

## 🛠️ The 3-Step Generalized Monotonic Deque Template

Every single monotonic deque problem follows this exact looping structure as you iterate from left to right through an array:

```text
For each element (current_index, current_value):

    1. RETAIN VALIDITY (Pop Left / Front):
       Remove elements from the front of the deque if they are out of bounds 
       (e.g., slipped out of a fixed window size) OR if they have already achieved 
       their best possible outcome and are now "retired."

    2. RECORD ANSWER:
       The element at the front of the deque is now your OPTIMAL candidate. 
       Use it to calculate your current answer (min length, max value, etc.).

    3. MAINTAIN MONOTONICITY (Pop Right / Back):
       Before pushing the current_value, look at the back of the deque. 
       While the back element is "worse" than (or equal to) your new element, 
       pop it from the back. It is obsolete.
       
    4. PUSH: 
       Push the current_index onto the back of the deque.
```

---

## 🎯 The Monotonic Queue Family Tree (Problems to Practice)

To truly generalize this pattern, you must see how it morphs across different problem types. Here are the iconic problems that use this exact same infrastructure, categorized by _why_ they use it:

## 1. Range Extremum (Sliding Window Maximum/Minimum)

- The Problem: [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
- The Twist: You have a fixed window of size $K$. You need to find the max element in it at every step.
- Why it fits the pattern: If a new element enters the window and is _larger_ than an older element, that older element can never be the maximum again. The older element is completely obsolete.
- Deque Order: Strictly decreasing values.

## 2. Optimization over Constraints (Bounded DP)

- The Problem: [LeetCode 1425 - Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/)
- The Twist: You want to find a maximum subsequence sum, but you can't pick elements that are more than $K$ indices apart.
- Why it fits the pattern: This is Dynamic Programming where your next state $DP[i]$ depends on the maximum value in the range $[i-K, i-1]$. Instead of scanning back $K$ steps every time (which takes $O(N \times K)$), a monotonic deque keeps the maximum DP value at the front, dropping it down to $O(N)$.

## 3. Game Theory / Jump Problems

- The Problem: [LeetCode 1696 - Jump Game VI](https://leetcode.com/problems/jump-game-vi/)
- The Twist: You start at index 0 and want to reach the end with the maximum score. You can jump a maximum of $K$ steps forward.
- Why it fits the pattern: To maximize your score at index $i$, you want to land on the index within the last $K$ steps that has the _highest score_. The deque keeps those past step options perfectly sorted by score.

---

## 📊 Direct Comparison: How the Deque Adapts

|Problem|Front Pop Condition (Left)|Back Pop Condition (Right)|What the Front Represents|
|---|---|---|---|
|Shortest Subarray $\ge K$|`Current_Prefix - Front_Prefix >= K` (Retirement)|`Back_Prefix >= Current_Prefix` (Obsolescence)|Best starting index for a short subarray|
|Sliding Window Max|`Front_Index < Current_Index - K` (Out of window)|`Back_Value <= Current_Value` (Obsolescence)|The absolute maximum in the current window|
|Jump Game VI|`Front_Index < Current_Index - K` (Out of jump range)|`Back_Score <= Current_Score` (Obsolescence)|The best past step to jump from|

---

