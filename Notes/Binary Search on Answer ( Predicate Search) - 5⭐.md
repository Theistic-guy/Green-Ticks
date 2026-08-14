# Binary Search on Answer / Predicate Search

> **Core idea:** Instead of binary-searching an array, binary-search the **range of possible answers**.  
> For each candidate `x`, define `feasible(x)` → _Can the problem be solved if the answer is `x`?_  
> If feasibility is **monotonic**, binary search finds the optimal boundary.

---
==Curated Problem set on this topic==  - [Predicate Search Problem Set](Extras/Predicate%20Search%20Problem%20Set.md)

<details>
<summary>What is Candidate, Feasibility and Predicate?</summary>

------------------------------
## 1. Candidate (The "Mid" Value)
A Candidate is a single, specific value chosen from your search space that you test to see if it could be the correct answer. [2, 5] 

* 
* Role in Binary Search: During each iteration of the loop, you calculate mid = low + (high - low) / 2. This mid value is your current candidate.
* The Search Space: The range between low and high contains all possible candidates. For example, if you are looking for the minimum shipping truck capacity, your lowest candidate might be the weight of the heaviest single package, and your highest candidate might be the sum of all package weights. [1, 2, 4, 5, 6] 
* 

## 2. Predicate (The Condition Function)
A Predicate is a boolean function—traditionally named check(), isValid(), or feasible()—that takes a candidate value as its input and returns either true or false. [5, 7, 8] 

* 
* Role in Binary Search: It acts as the decision-maker. Instead of checking if array[mid] == target, you evaluate predicate(mid).
* Monotonicity Requirement: For binary search to work, the predicate must be monotonic. This means if you test all possible candidates in order, the results must transition cleanly from false to true (e.g., [F, F, F, T, T, T]) or from true to false (e.g., [T, T, T, F, F, F]). This strict transition lets you safely discard half of the remaining candidates every time you run the check. [2, 4, 7, 8, 9, 10, 11, 12] 
* 

## 3. Feasibility (The Validation Check)
Feasibility refers to the actual real-world logic inside your predicate function that determines whether a candidate value satisfies the rules and constraints of the problem. [2, 3, 4] 

* 
* Role in Binary Search: The predicate executes a "feasibility check". It asks: "Is this candidate value sufficient to get the job done?"
* How it simplifies problems: It is often incredibly complex to calculate the absolute optimal answer directly. However, it is usually much simpler to write a greedy or simulation-style helper function that answers a yes/no question about a fixed value. [2, 3, 4, 13, 14] 
* 

------------------------------
## Concrete Example: "Koko Eating Bananas" (LeetCode 875)
To see how these three components fit together, consider a classic problem: Koko wants to eat all piles of bananas within H hours. Find the minimum integer eating speed k (bananas per hour) she needs. [11, 15] 

| Component | How it applies to this problem |
|---|---|
| Candidate | A specific eating speed k (e.g., testing if 4 bananas per hour works). |
| Feasibility | A helper loop that counts how many total hours it takes to eat all piles if Koko eats at a fixed speed of k. If the total hours ≤ H, it is feasible. |
| Predicate | canFinish(k) → Returns true if k is feasible; returns false if k is too slow. |

The Monotonic Behavior:

* 
* If an eating speed of 4 bananas/hour is too slow (false), then 1, 2, and 3 are also definitely too slow. We discard the left half (low = mid + 1).
* If an eating speed of 10 bananas/hour works (true), then 11, 12, and 13 will also work. We record 10 as a potential answer and discard the right half to see if a smaller, more optimal speed exists (high = mid - 1). [1, 2, 11, 16, 17] 
* 

------------------------------
If you are working on a specific problem right now, let me know:

* 
* What is the goal of the problem? (e.g., minimizing a maximum value, splitting an array)
* What constraints are given?
* 

I can help you define the exact search space range and write out the feasibility check logic for it!


</details>
## 1. Recognition

Look for:

- **Minimum / maximum** numeric answer
    
- `"minimum X such that..."`
    
- `"maximum X such that..."`
    
- `"can we do it with X?"`
    
- **Minimize the maximum**
    
- **Maximize the minimum**
    

Ask:

```text
1. What numeric quantity am I optimizing?
2. Can I guess a candidate X?
3. Can I efficiently check if X is feasible?
4. Is feasibility monotonic?
```

If yes → **Binary Search on Answer**.

---

# 2. The Two Fundamental Patterns

### Minimum feasible → First `True`

```text
X:          1  2  3  4  5  6  7
feasible:   F  F  F  T  T  T  T
                     ↑
                  answer
```

```python
lo, hi = lower_bound, upper_bound

while lo < hi:
    mid = lo + (hi - lo) // 2

    if feasible(mid):
        hi = mid
    else:
        lo = mid + 1

return lo
```

---

### Maximum feasible → Last `True`

```text
X:          1  2  3  4  5  6  7
feasible:   T  T  T  T  F  F  F
               ↑
            answer
```

```python
lo, hi = lower_bound, upper_bound

while lo < hi:
    mid = lo + (hi - lo + 1) // 2

    if feasible(mid):
        lo = mid
    else:
        hi = mid - 1

return lo
```

**Memory hook:**

> Minimum → **first True**  
> Maximum → **last True**

---

# 3. The Most Important Part: `feasible(x)`

Binary search is easy. **Designing the validator is usually the real problem.**

Example:

> Split an array into `k` parts while minimizing the maximum part sum.

Don't directly find the optimal partition.

Instead:

```text
Candidate X = maximum allowed part sum

Can I split the array into ≤ k parts,
where every part has sum ≤ X?
```

Then greedily check:

```python
def feasible(X):
    groups = 1
    current = 0

    for x in arr:
        if current + x > X:
            groups += 1
            current = 0
        current += x

    return groups <= k
```

As `X` increases, the constraint becomes easier:

```text
FFFFTTTT
```

So find the **first feasible X**.

---

# 4. The Two Mega-Patterns

## A. Minimize the Maximum

Typical wording:

> "Minimize the maximum load/sum/capacity/time."

Candidate:

```text
X = allowed maximum
```

Validator:

```text
Can the entire problem be completed with maximum X?
```

Usually:

```text
small X → impossible
large X → possible
```

→ **First True**

### Problems

|Problem|Pattern|
|---|---|
|**Koko Eating Bananas**|Minimum speed|
|**Capacity to Ship Packages Within D Days**|Minimum capacity|
|**Split Array Largest Sum**|Minimum maximum sum|
|**Allocate Books**|Minimum maximum pages|
|**Painter's Partition**|Minimum maximum workload|
|**Minimum Limit of Balls in a Bag**|Minimum maximum bag size|
|**Minimized Maximum of Products Distributed to Any Store**|Minimum maximum load|

---

## B. Maximize the Minimum

Typical wording:

> "Maximize the minimum distance/value/separation."

Candidate:

```text
X = required minimum
```

Validator:

```text
Can I construct a valid solution
where every relevant value >= X?
```

Usually:

```text
small X → possible
large X → impossible
```

→ **Last True**

### Problems

|Problem|Pattern|
|---|---|
|**Aggressive Cows**|Maximum minimum distance|
|**Magnetic Force Between Two Balls**|Maximum minimum distance|
|**Divide Chocolate**|Maximum minimum sweetness|

Typical greedy validator:

```python
def feasible(distance):
    count = 1
    last = positions[0]

    for p in positions[1:]:
        if p - last >= distance:
            count += 1
            last = p

    return count >= k
```

---

# 5. Common Validator Types

### ① Rate / Time

```python
work_done = ...
return work_done >= target
```

Examples:

- Koko
    
- Minimum Time to Complete Trips
    
- production/machine problems
    

---

### ② Greedy Partition

```python
groups = ...
return groups <= k
```

Examples:

- Shipping
    
- Split Array
    
- Book Allocation
    

---

### ③ Greedy Placement

```python
placed = ...
return placed >= k
```

Examples:

- Aggressive Cows
    
- Magnetic Force
    

---

### ④ Counting

```python
count = number_of_values_<=_X
return count >= k
```

Examples:

- K-th Smallest Pair Distance
    
- K-th Smallest in Sorted Matrix
    
- K-th Smallest Number in Multiplication Table
    

This is an important advanced variation:

```text
Binary Search on value
        +
Counting predicate
```

---

# 6. Choosing Bounds

Derive them from the problem.

|Problem|Typical bounds|
|---|---|
|Speed|`1 ... max(piles)`|
|Capacity|`max(arr) ... sum(arr)`|
|Maximum distance|`0 ... max(pos)-min(pos)`|
|Partition maximum|`max(arr) ... sum(arr)`|
|Time|`0 ... guaranteed-sufficient time`|

**Rule:**

> `lo` and `hi` must contain the answer.

---

# 7. The Interview Workflow

Before coding, write:

```text
Candidate X = __________________

feasible(X):
    ____________________________

Monotonicity:
    ____________________________

Search range:
    [______, ______]

Boundary:
    first True / last True
```

Then code.

### Interview explanation

> "I'll binary-search the answer. For a candidate `X`, I can check feasibility in `O(C)` using ____. The predicate is monotonic because ____. Therefore I can binary-search the first/last feasible value."

---

# 8. Complexity

If:

```text
feasible(X) = O(C)
answer range = R
```

then:

$$
\boxed{O(C\log R)}  
$$

Usually:

```text
O(n log R)
```

If sorting is required:

```text
O(n log n + n log R)
```

Space is usually:

```text
O(1)
```

excluding input/output and any validator-specific structures.

---

# 9. Common Bugs

### First True

```python
if feasible(mid):
    hi = mid       # NOT mid - 1
else:
    lo = mid + 1
```

### Last True

```python
mid = lo + (hi - lo + 1) // 2
```

The `+1` prevents infinite loops.

### Don't forget

- Prove monotonicity.
    
- Don't binary-search the input unless the input itself is the search space.
    
- Make sure bounds contain the answer.
    
- `feasible()` must answer the **actual** feasibility question.
    
- Don't confuse `<= k` with `== k` without proving they're equivalent.
    

---

# 10. FAANG Practice Set

See curated set - [Predicate Search Problem Set](Extras/Predicate%20Search%20Problem%20Set.md)
### Essential

|Problem|Main pattern|Common tags*|
|---|---|---|
|**875. Koko Eating Bananas**|Minimum rate|Amazon, Google|
|**1011. Capacity to Ship Packages Within D Days**|Min maximum capacity|Amazon, Google|
|**1283. Smallest Divisor Given a Threshold**|Minimum divisor|Amazon|
|**1482. Minimum Days to Make Bouquets**|Minimum time|Amazon, Google|
|**2187. Minimum Time to Complete Trips**|Minimum time|Amazon, Google|
|**410. Split Array Largest Sum**|Min maximum|Amazon, Google, Microsoft|
|**1552. Magnetic Force Between Two Balls**|Max minimum distance|Amazon, Google|
|**1760. Minimum Limit of Balls in a Bag**|Min maximum|Amazon|
|**2064. Minimized Maximum Products**|Min maximum|Amazon|

### Advanced

|Problem|Variation|
|---|---|
|**719. K-th Smallest Pair Distance**|Binary search + two pointers/counting|
|**378. K-th Smallest in Sorted Matrix**|Binary search + counting|
|**668. K-th Smallest in Multiplication Table**|Binary search + mathematical counting|
|**1231. Divide Chocolate**|Maximize minimum|
|**774. Minimize Max Distance to Gas Station**|Continuous binary search|

*Company tags are interview-history signals, not guarantees.


---

# 11. Final Mental Model

```text
Optimization problem
        ↓
Choose candidate answer X
        ↓
Can X work?
        ↓
   feasible(X)
        ↓
Is it monotonic?
        ↓
   YES → Binary Search
        ↓
Find boundary
```

### The one-line rule

> **Guess the answer → validate the guess → exploit monotonicity → binary-search the boundary.**

### The two patterns to memorize

```text
Minimize  → F F F T T T → FIRST TRUE

Maximize  → T T T F F F → LAST TRUE
```

### The two mega-patterns

```text
Minimize maximum
    → candidate maximum
    → greedy partition/capacity check
    → FIRST TRUE

Maximize minimum
    → candidate minimum
    → greedy placement check
    → LAST TRUE
```
---
