---
Title: Gas Station (Leetcode 134)
Companies:
  - CME Group
  - Scale AI
  - BitGo
  - Sprinklr
  - Dream11
  - Flipkart
  - Mastercard
  - Adobe
  - Infosys
  - TikTok
  - Accolite
  - Bloomberg
  - PhonePe
  - Visa
  - Zoho
  - ServiceNow
  - Amazon
  - Microsoft
  - Juspay
  - Oracle
  - Goldman Sachs
  - Salesforce
  - Apple
  - Google
  - Meta
  - IBM
  - tcs
Topics:
  - Arrays
  - Greedy
  - Prefix Sum
Platform:
  - Leetcode
Difficulty: Medium
Other Tags:
  - GFG
Link: https://leetcode.com/problems/gas-station/description/
Rating:
  - ⭐⭐⭐⭐
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Gas Station (Leetcode 134)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        # 1. Quick exit if a solution is mathematically impossible
        if sum(gas) < sum(cost):
            return -1
        
        start_index = 0
        current_tank = 0
        
        # 2. Single pass to find the tipping point
        for i in range(len(gas)):
            current_tank += gas[i] - cost[i]
            
            # If tank drops below zero, no station up to 'i' can be a valid start
            if current_tank < 0:
                current_tank = 0
                start_index = i + 1
                
        return start_index

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(1)

The naive approach simulates wrapping around the array (e.g., doubling the array size or using modulo operators). However, we can solve this in a single linear pass \(O(N)\) with \(O(1)\) space using two core mathematical truths:

### 1. Global Deficit Principle
If the **total gas** across the entire network is less than the **total cost**, it is physically impossible to complete the circuit, regardless of where you start. 
$\sum \text{gas} < \sum \text{cost} \implies \text{Return } -1$

### 2. The Surplus Leverage (Why Wrapping Isn't Needed)
If the global condition passes $(\sum \text{gas} \ge \sum \text{cost})$, and you find a starting index that successfully reaches the *very end* of the array without the tank dropping below zero, **it is mathematically guaranteed to wrap around and finish the circle successfully.**

```text
[   Part B (Deficit Section)   ] [   Part A (Surplus Section)   ]
0 ............................. start_index ................... end
  (Net negative gas balance)       (Accumulates a large surplus)
```

* **The Logic:** Because the system has a net positive balance overall, if Part B is a losing section (net negative), **Part A must hold a large enough positive surplus to completely cancel out the deficit of Part B.** 
* Therefore, the code never needs to simulate the circular wrap-around phase.


---

# Gas Station (Leetcode 134)

**Tags:** #Greedy #Arrays #PrefixSum #Kadane-Insight #CircularArray #Interview-Pattern #LeetCode #FAANG

## Problem Statement

There are `n` gas stations arranged in a **circle**.

- `gas[i]` = fuel available at station `i`
    
- `cost[i]` = fuel required to travel from station `i` to `(i+1)%n`
    

Return the **starting station index** from which you can complete the entire circuit. If impossible, return `-1`.

### Example

|Gas|Cost|
|---|---|
|`[1,2,3,4,5]`|`[3,4,5,1,2]`|

Output:

```text
3
```

Starting from station **3** completes the circuit.

---

## Core Insight

Define the net fuel gained at each station:

```text
diff[i] = gas[i] - cost[i]
```

The problem becomes:

> Find a starting index where the cumulative sum never becomes negative while traversing the circle.

This is a **Greedy + Prefix Sum** problem—not a simulation problem.

---

## Key Greedy Observation

Suppose we start at station `s` and fail at station `k`.

```text
s -------- k
```

The cumulative fuel becomes negative at `k`.

**Claim:** No station between `s` and `k` can be a valid starting point.

### Why?

If starting from `s` already leaves us with insufficient fuel at `k`, then starting later (with even less accumulated fuel) cannot do better.

This allows us to **skip all intermediate stations**.

> This is the greedy breakthrough that reduces `O(n²)` to `O(n)`.

---

## Intuition (The WHY)

Compute the net gain:

|Station|Gas|Cost|Diff|
|--:|--:|--:|--:|
|0|1|3|-2|
|1|2|4|-2|
|2|3|5|-2|
|3|4|1|+3|
|4|5|2|+3|

Diff array:

```text
[-2, -2, -2, +3, +3]
```

Starting from `0`:

```text
Fuel:
0 → -2 ❌
```

Impossible.

Try `1`:

```text
0 → -2 ❌
```

Impossible.

Only after reaching station `3` do we accumulate enough surplus to survive the negative sections.

---

## Greedy Algorithm

Maintain three variables:

- `total` → total net fuel across all stations
    
- `tank` → current fuel while testing a start
    
- `start` → candidate starting index
    

### Rule

For every station:

1. Add `diff` to both `total` and `tank`.
    
2. If `tank < 0`:
    
    - Current start is impossible.
        
    - Skip every station up to here.
        
    - Set `start = i + 1`.
        
    - Reset `tank = 0`.
        

After traversal:

- `total >= 0` → answer is `start`
    
- Otherwise → impossible (`-1`)
    

---

## Optimal Python Solution

```python
class Solution:
    def canCompleteCircuit(self, gas, cost):

        total = 0
        tank = 0
        start = 0

        for i in range(len(gas)):

            diff = gas[i] - cost[i]

            total += diff
            tank += diff

            if tank < 0:
                start = i + 1
                tank = 0

        return start if total >= 0 else -1
```

---

## Dry Run

### Input

```text
gas  = [1,2,3,4,5]
cost = [3,4,5,1,2]
```

### Iteration

|i|Diff|Tank|Start|
|--:|--:|--:|--:|
|0|-2|-2 → 0|1|
|1|-2|-2 → 0|2|
|2|-2|-2 → 0|3|
|3|+3|3|3|
|4|+3|6|3|

Total = `0`

Answer:

```text
3
```

Verify:

```text
3 → 4 → 0 → 1 → 2 ✓
```

Never runs out of fuel.

---

## Why Resetting Is Correct (Proof)

Suppose we begin at `s`.

At station `k`:

```text
Prefix sum becomes negative
```

So:

```text
Sum(s...k) < 0
```

Now consider any station `t` where:

```text
s < t ≤ k
```

The fuel collected from `t` to `k` is:

```text
Sum(t...k)
```

This cannot exceed the fuel from `s` to `k`, because we've skipped some non-negative accumulated prefix.

Therefore:

```text
Sum(t...k) < 0
```

So every station between `s` and `k` also fails.

Hence we safely jump directly to:

```text
k + 1
```

This is the greedy proof.

---

## Necessary Condition

Before any starting station can exist:

```text
Total Gas ≥ Total Cost
```

Equivalently:

```text
Σ(gas) ≥ Σ(cost)
```

If this fails, completing the circuit is mathematically impossible regardless of starting point.

The algorithm checks this using `total`.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(1)**|

Each station is visited exactly once.

---

## Common Mistakes

### 1. Simulating Every Starting Station

Trying all starts:

```text
O(n²)
```

Fails for large inputs.

The greedy skip is the key optimization.

### 2. Forgetting the Total Check

Example:

```text
Gas  = [2]
Cost = [3]
```

Greedy would return `1`, but the correct answer is `-1`.

Always verify:

```python
return start if total >= 0 else -1
```

### 3. Resetting Tank Incorrectly

Wrong:

```python
tank = diff
```

Correct:

```python
tank = 0
```

The next station starts with an empty tank, not the previous deficit.

---

## Relationship to Other Greedy Problems

|Problem|Greedy Insight|
|---|---|
|Gas Station|Skip impossible starting range|
|Jump Game|Furthest reachable position|
|Kadane's Algorithm|Reset negative running sum|
|Candy|Local constraints with global optimum|

Gas Station is closely related to **Kadane's Algorithm**: both reset a running accumulation when it becomes harmful, though the objective differs.

---

## Key Takeaways

- Convert the problem into a **net gain (`gas - cost`)** array.
    
- If the running tank becomes negative, **every station in that failed segment is eliminated**.
    
- The greedy reset works because intermediate stations inherit an even worse deficit.
    
- The solution is valid **only if the total gas is at least the total cost**.
    

> **Interview Heuristic:** Circular traversal + feasibility + skipping entire ranges is often a sign of a **Greedy Prefix Sum** solution.



---



