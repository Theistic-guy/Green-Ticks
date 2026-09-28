---
Title: Leetcode 1710 — Maximum Units on a Truck
Companies: [Infosys, IBM, Salesforce, Amazon, Microsoft, Google, Bloomberg, Meta]
Topics:
  - Greedy
  - Sorting
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
  - Knapsack
Link: ""
Rating:
Groups:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Leetcode 1710 — Maximum Units on a Truck

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
class Solution:
    def maximumUnits(self, boxTypes, truckSize):

        boxTypes.sort(
            key=lambda x: x[1],
            reverse=True
        )

        ans = 0

        for boxes, units in boxTypes:

            take = min(boxes, truckSize)

            ans += take * units
            truckSize -= take

            if truckSize == 0:
                break

        return ans
```
**Time complexity** - O(n log n)

---
# Leetcode 1710 — Maximum Units on a Truck

**Tags:** #Greedy #Sorting #Knapsack #RatioSorting #Optimization #LeetCode #FAANG

## Problem Statement

Each box type contains:

- `numberOfBoxes`
    
- `unitsPerBox`
    

A truck can carry at most `truckSize` boxes.

Return the **maximum total units**.

Example:

```text
boxTypes = [[1,3],[2,2],[3,1]]
truckSize = 4
```

Answer = **8**

---

## Why It's the Same Pattern

Think of each **box** as an item with:

- Weight = **1**
    
- Value = `unitsPerBox`
    

Since every box has identical weight, the ratio becomes simply:

```text
unitsPerBox
```

Therefore:

- Sort descending by units
    
- Take as many boxes as possible
    

This is exactly Fractional Knapsack, except every item has unit weight, so no actual fraction is needed.

---

## Python Solution

```python
class Solution:
    def maximumUnits(self, boxTypes, truckSize):

        boxTypes.sort(
            key=lambda x: x[1],
            reverse=True
        )

        ans = 0

        for boxes, units in boxTypes:

            take = min(boxes, truckSize)

            ans += take * units
            truckSize -= take

            if truckSize == 0:
                break

        return ans
```

---

## Dry Run

Input:

```text
[1,3]
[2,2]
[3,1]

Truck = 4
```

Sorted:

|Boxes|Units|
|--:|--:|
|1|3|
|2|2|
|3|1|

Selection:

|Take|Units|
|---|--:|
|1|3|
|2|4|
|1|1|

Total = **8**

---

## Fractional Knapsack vs LC 1710

|Feature|Fractional Knapsack|LC 1710|
|---|---|---|
|Weight|Arbitrary|Always 1|
|Fraction Allowed|Yes|No|
|Greedy Key|Value/Weight|Units|
|Sort By|Ratio|Units Descending|
|Complexity|O(n log n)|O(n log n)|

LC 1710 is essentially a **specialized fractional knapsack** where all weights are identical.

---

## Common Mistakes

### 1. Sorting by Value Instead of Ratio

Wrong:

```python
items.sort(key=lambda x: x[0], reverse=True)
```

Correct:

```python
items.sort(
    key=lambda x: x[0] / x[1],
    reverse=True
)
```

The ratio, not absolute value, determines optimality.

### 2. Forgetting to Break After Taking a Fraction

Once the remaining capacity is filled:

```python
ans += value * (W / weight)
break
```

No further items can contribute.

### 3. Confusing with 0/1 Knapsack

A quick interview heuristic:

|Question|Technique|
|---|---|
|Can take fractions?|Greedy|
|Must take whole items?|Dynamic Programming|

---

## Pattern Recognition

Use **Fractional Knapsack** whenever:

- Items are divisible
    
- Capacity is continuous
    
- Objective is maximizing value
    
- A meaningful **value density (ratio)** exists
    

### Greedy Recipe

1. Define value density.
    
2. Sort descending.
    
3. Take as much as possible.
    
4. Stop after the first partial item.
    

> **Interview Heuristic:** If the problem allows taking **part of an item**, think **Greedy by value density** before considering DP.