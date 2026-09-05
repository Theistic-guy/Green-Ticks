
## 🧠 The Complete Guide to Dynamic Programming (DP)

## 1. The True Definition of DP

Dynamic Programming is an algorithmic paradigm that solves a complex problem by breaking it down into a collection of simpler subproblems, solving each of those subproblems just once, and storing their solutions to avoid redundant work.

For a problem to be theoretically classified as DP, it must exhibit two mathematical properties:

1. Optimal Substructure: The optimal solution to a large problem contains within it the optimal solutions to its smaller subproblems.
2. Overlapping Subproblems: A naive recursive breakdown of the problem visits the exact same subproblems repeatedly.

---

## 2. The Great Misconception: Why 1D DP and Kadane's Don't "Feel" Like DP

When learning DP, textbooks usually show a massive, branching recursion tree (like the Fibonacci sequence or the 0/1 Knapsack problem) to explain "overlapping subproblems."

However, when you look at Kadane's Algorithm (Maximum Subarray Sum) or a 1D array transition, the code is just a simple `for` loop updating one or two variables. It feels like simple iteration, not DP. Here is why they are fundamentally DP:

## A. The "Overlap" is Hidden by Iteration (Bottom-Up)

Overlapping subproblems are a characteristic of the problem structure, not your final code.

- If you tried to find the maximum subarray ending at index $i$ by naively recalculating all previous sub-segments from scratch, you would recompute the same sums infinitely.
- Because you choose to solve it bottom-up (iteratively), you resolve the overlap before it even has a chance to branch out.

## B. Space Optimization Doesn't Change the Theory

Kadane's algorithm is actually a 1D DP table that has been compressed to $O(1)$ space.

```text
Standard 1D DP Table:
[ dp[0], dp[1], dp[2], ..., dp[i-1], dp[i] ]

                               |       |
                               --------| (Relies strictly on the immediate past)

Space-Optimized (Kadane's):
[ single_variable_past ] -> [ single_variable_current ]
```

The underlying math relies on a DP state transition equation:  
$$\text{dp}[i] = \max(\text{arr}[i], \text{arr}[i] + \text{dp}[i-1])$$

Because $\text{dp}[i]$ only cares about $\text{dp}[i-1]$, we throw away everything before it. Memory compression does not change the core identity of the algorithm. It is still DP because it relies entirely on optimal substructure.

---

## 3. The Spectrum of DP Architectures

DP is not one-size-fits-all. It spans a spectrum based on how state dependencies flow:

|DP Category|State Dependency Flow|Visual Concept|Classic Examples|
|---|---|---|---|
|Linear / 1D DP|$\text{dp}[i]$ depends strictly on a fixed, immediate window of past states (e.g., $i-1$ or $i-2$). Memory can usually be optimized to $O(1)$.|Linear Chain  <br>$\rightarrow \bullet \rightarrow \bullet \rightarrow \bullet$|Kadane’s Algorithm, Climbing Stairs, House Robber|
|Bounded / Resource DP|$\text{dp}[i][j]$ depends on an index and a strict, hard constraint (like weight, capacity, or count).|Grid / Matrix  <br>$\begin{matrix} \bullet & \bullet \\ \bullet & \bullet \end{matrix}$|0/1 Knapsack, Coin Change, Bounded DP|
|String / Interval DP|$\text{dp}[i][j]$ relies on prefixes, suffixes, or sub-ranges of a string or array.|Shrinking Windows  <br>$[i \rightarrow \dots \leftarrow j]$|Longest Common Subsequence (LCS), Edit Distance, Matrix Chain Multiplication|
|Tree / Graph DP|$\text{dp}[\text{node}]$ relies on the DP states of its children or neighboring vertices.|Hierarchical / Network|Longest Path in a DAG, Maximum Independent Set on Trees|

---

## 4. The Practical DP Cheat Sheet (How to Spot It)

When reading a problem statement in an interview or competitive programming setting, look for these three categories of green flags:

## 🚩 Flag 1: The Objective (What is it asking for?)

- Optimization: "Find the minimum cost...", "Find the maximum profit...", "What is the longest/shortest..."
- Combinatorics/Counting: "How many distinct ways are there to...", "Count the total paths..."

## 🚩 Flag 2: The Decision Point

- At every step, you are forced to make a choice, and the choice you make alters your future options. (e.g., _"Do I include this item or skip it?", "Do I take 1 step or 2 steps?"_).

## 🚩 Flag 3: The "Future Doesn't Care About the Past" Rule (Crucial)

- Formally known as No-Aftereffect / Markov Property. Once you have reached a certain state (e.g., you are at index `i` with `j` capacity left), how you got there does not matter. The optimal choices remaining from this point forward are always identical.

---

## 5. Summary Framework: The 3 Steps to Solve Any DP

If you suspect a problem is DP (even a simple 1D or bounded one), always build it in this order:

1. Define the State: What does $\text{dp}[i]$ or $\text{dp}[i][j]$ actually represent in plain words? (e.g., _"The max profit using items up to index $i$ with exactly $j$ weight remaining"_).
2. Find the Base Cases: What are the smallest possible subproblems where the answer is trivial? (e.g., $\text{dp}[0] = 0$).
3. Formulate the Transition Relation: Write out the mathematical formula that connects your current state to past states.

---
Links:
+ [maximum-subarray-sum](../Problems/maximum-subarray-sum.md)