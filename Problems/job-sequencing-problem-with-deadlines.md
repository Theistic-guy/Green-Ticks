---
Title: Job Sequencing Problem with Deadlines
Companies:
  - Not Specified
Topics:
  - Arrays
  - Greedy
  - Sorting
  - Disjoint Set Union
Platform:
  - GFG
Difficulty: Medium
Other Tags:
Link: ""
Rating:
  - ⭐⭐⭐⭐
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Job Sequencing Problem with Deadlines

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
class Solution:
    def JobScheduling(self, jobs, n):

        jobs.sort(key=lambda x: x.profit, reverse=True)

        maxDeadline = max(job.deadline for job in jobs)

        slots = [-1] * (maxDeadline + 1)

        count = 0
        profit = 0

        for job in jobs:

            for t in range(job.deadline, 0, -1):

                if slots[t] == -1:
                    slots[t] = job.id
                    count += 1
                    profit += job.profit
                    break

        return [count, profit]

```

Let:

- `n` = number of jobs
    
- `D` = maximum deadline
    

|Metric|Value|
|---|--:|
|Sorting|$O(n \log n)$|
|Slot Search|$O(nD)$|
|Auxiliary Space|$O(D)$|

If deadlines are at most `n`, this becomes **$O(n^2)$**.

---


# Job Sequencing Problem with Deadlines

**Tags:** #Greedy #Sorting #Scheduling #Arrays #DisjointSet #Interview-Pattern #FAANG

## Problem Statement

You are given `n` jobs. Each job takes **exactly 1 unit of time** and has:

- **Deadline** → the latest time slot in which it can be completed.
    
- **Profit** → earned only if the job is completed by its deadline.
    

Return the **maximum profit** and the **maximum number of jobs** that can be scheduled.

### Example

|Job|Deadline|Profit|
|---|:-:|--:|
|A|2|100|
|B|1|19|
|C|2|27|
|D|1|25|
|E|3|15|

**Optimal schedule**

|Slot|Job|
|:-:|:-:|
|1|C|
|2|A|
|3|E|

**Jobs = 3, Profit = 142**

---

## Core Insight

Since every job takes **1 unit time**, the only decision is **which slot** to place it in.

### Greedy Rule

1. Sort jobs by **profit (descending)**.
    
2. For each job, place it in the **latest available slot ≤ deadline**.
    

The highest-profit jobs get priority, while placing them as late as possible preserves earlier slots for other jobs.

---

## Why the Latest Slot?

Suppose a job has deadline **3**.

Available slots:

```text
1 2 3
```

If we place it in slot **1**, we unnecessarily block two earlier positions.

Instead:

```text
_ _ X
```

Choosing the **latest feasible slot** leaves maximum flexibility for future jobs.

This is the key greedy insight.

---

## Greedy Algorithm

1. Sort by decreasing profit.
    
2. Find the maximum deadline.
    
3. Create `slots[1...maxDeadline]`.
    
4. For each job:
    
    - Search backward from its deadline.
        
    - Place it in the first free slot.
        
5. Sum the profit.
    

---

## Python Solution (Greedy)

```python
class Solution:
    def JobScheduling(self, jobs, n):

        jobs.sort(key=lambda x: x.profit, reverse=True)

        maxDeadline = max(job.deadline for job in jobs)

        slots = [-1] * (maxDeadline + 1)

        count = 0
        profit = 0

        for job in jobs:

            for t in range(job.deadline, 0, -1):

                if slots[t] == -1:
                    slots[t] = job.id
                    count += 1
                    profit += job.profit
                    break

        return [count, profit]
```

---

## Dry Run

Sorted by profit:

|Job|Deadline|Profit|
|---|:-:|--:|
|A|2|100|
|C|2|27|
|D|1|25|
|B|1|19|
|E|3|15|

Initial slots:

```text
1 2 3
_ _ _
```

### Place A

Latest ≤ 2:

```text
_ A _
```

### Place C

Slot 2 occupied → place at 1.

```text
C A _
```

### Place D

Slot 1 occupied → skip.

### Place B

Slot 1 occupied → skip.

### Place E

```text
C A E
```

Profit:

27+100+15=14227 + 100 + 15 = 142

---

## Correctness (Greedy Proof)

Assume the highest-profit job is not selected.

If a lower-profit job occupies one of its feasible slots, swapping them:

- Keeps the schedule valid.
    
- Increases the total profit.
    

Hence every optimal schedule can be transformed into one containing the highest-profit feasible job.

Placing it in the **latest** slot further preserves earlier slots, maximizing future scheduling opportunities.

This is the exchange argument.

---

## Complexity

Let:

- `n` = number of jobs
    
- `D` = maximum deadline
    

|Metric|Value|
|---|--:|
|Sorting|$O(n \log n)$|
|Slot Search|$O(nD)$|
|Auxiliary Space|$O(D)$|

If deadlines are at most `n`, this becomes **$O(n^2)$**.

---

# Optimized Approach — Disjoint Set Union (DSU)

## Motivation

The backward scan can be expensive.

Instead, maintain the **next available slot** using DSU.

### Parent Meaning

`parent[x]` = largest available slot ≤ `x`.

Initially:

```text
Slot :   0 1 2 3
Parent : 0 1 2 3
```

If slot 2 is occupied:

```text
parent[2] = 1
```

Now `find(2)` immediately returns slot 1.

---

## DSU Algorithm

1. Sort jobs by profit.
    
2. Initialize `parent[i] = i`.
    
3. For each job:
    
    - `slot = find(deadline)`
        
    - If `slot > 0`:
        
        - Schedule job.
            
        - Union `slot` with `slot-1`.
            

### Python

```python
class DSU:

    def __init__(self, n):
        self.parent = list(range(n + 1))

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def occupy(self, slot):
        self.parent[slot] = self.find(slot - 1)


def jobScheduling(jobs):

    jobs.sort(key=lambda j: j.profit, reverse=True)

    maxD = max(j.deadline for j in jobs)
    dsu = DSU(maxD)

    jobsDone = 0
    profit = 0

    for job in jobs:

        slot = dsu.find(job.deadline)

        if slot > 0:
            jobsDone += 1
            profit += job.profit
            dsu.occupy(slot)

    return jobsDone, profit
```

### Complexity

|Metric|Value|
|---|--:|
|Sorting|$O(n \log n)$|
|DSU Operations|$O(n\alpha(n))$|
|Total|**$O(n \log n)$**|

This is the optimal interview solution for large deadlines.

---

## Greedy vs DSU

|Feature|Greedy Scan|DSU|
|---|--:|--:|
|Sort by Profit|✓|✓|
|Latest Slot|✓|✓|
|Slot Search|$O(D)$|$O(\alpha(n))$|
|Total|$O(nD)$|**$O(n \log n)$**|

The scheduling logic is identical; DSU only optimizes slot lookup.

---

## Common Mistakes

### 1. Sorting by Deadline

Wrong:

```python
jobs.sort(key=lambda x: x.deadline)
```

The objective is **maximize profit**, so sort by **profit descending**.

### 2. Placing in Earliest Slot

Wrong:

```text
Job(deadline=3)

X _ _
```

Correct:

```text
_ _ X
```

Always occupy the **latest** feasible slot.

### 3. Forgetting Slot 0

Slots are **1-indexed**.

Slot `0` represents **no available slot** and acts as the DSU sentinel.

---

## Relationship to Other Greedy Problems

|Problem|Greedy Choice|
|---|---|
|Fractional Knapsack|Highest value density|
|Huffman Coding|Merge two minimum frequencies|
|Gas Station|Skip impossible prefix|
|Job Sequencing|Highest profit + latest slot|

Notice the common pattern:

1. Make the **locally optimal** choice.
    
2. Preserve as much flexibility as possible for future decisions.
    

---

## Key Takeaways

- Every job has **unit duration**, making slot assignment the only challenge.
    
- Sort by **profit descending**.
    
- Schedule each job in the **latest available slot** before its deadline.
    
- The naive implementation is **$O(nD)$**; replacing the slot search with **DSU** improves it to **$O(n \log n)$**.
    
- This is one of the canonical **Greedy Scheduling** interview problems.