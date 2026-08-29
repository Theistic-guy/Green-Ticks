<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

==👉 Find the 14 problems set below==
## Binary Search on Answer — Interview Study Order

### 🟢 Group 1 — Core / Must Master

These establish the basic **candidate → `feasible()` → first True** pattern.

| #   | Problem                                         |   LC | Pattern                            | Company tags*  | Links                                                                                                        |
| --- | ----------------------------------------------- | ---: | ---------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **Koko Eating Bananas**                         |  875 | Minimum rate → count time          | Amazon, Google | [koko-eating-bananas](../../Problems/koko-eating-bananas.md)                                                 |
| 2   | **Capacity to Ship Packages Within D Days**     | 1011 | Minimum capacity → greedy grouping | Amazon, Meta   | [capacity-to-ship-packages](../../Problems/capacity-to-ship-packages.md)                                     |
| 3   | **Find the Smallest Divisor Given a Threshold** | 1283 | Minimum divisor → counting         | Amazon, Apple  | [find-the-smallest-divisor-given-a-threshold](../../Problems/find-the-smallest-divisor-given-a-threshold.md) |
| 4   | **Minimum Speed to Arrive on Time**             | 1870 | Minimum speed → time calculation   | Google, Amazon | [koko-eating-bananas](../../Problems/koko-eating-bananas.md)                                                 |

**What you should learn from this group:**

```text
X = candidate answer
        ↓
Can X satisfy the constraint?
        ↓
FFFFTTTT
        ↓
find first True
```

After these, you should be able to write the basic template without thinking.

---

# 🟡 Group 2 — Minimize the Maximum

This is probably the **most important family** after Group 1.

The common transformation is:

> "Minimize the maximum ___"

becomes:

> **"Assume the maximum is X. Can I make the entire problem work?"**

| #   | Problem                                                    |   LC | Validator             | Company tags*        | Links                                                                                                                              |
| --- | ---------------------------------------------------------- | ---: | --------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 5   | **Split Array Largest Sum**                                |  410 | Greedy partition      | Google, Meta, Amazon | [split-array-largest-sum](../../Problems/split-array-largest-sum.md)                                                               |
| 6   | **Minimized Maximum of Products Distributed to Any Store** | 2064 | Greedy allocation     | Amazon, Microsoft    | [minimized-maximum-of-products-distributed-to-any-store](../../Problems/minimized-maximum-of-products-distributed-to-any-store.md) |
| 7   | **Minimum Limit of Balls in a Bag**                        | 1760 | Count required splits | Google, Amazon       | [minimum-limit-of-balls-in-a-bag](../../Problems/minimum-limit-of-balls-in-a-bag.md)                                               |
| 8   | **Book Allocation**                                        |    — | Greedy partition      | Amazon, Microsoft    | [split-array-largest-sum](../../Problems/split-array-largest-sum.md)                                                               |
| 9   | **Painter's Partition**                                    |    — | Greedy partition      | Amazon, Microsoft    | [split-array-largest-sum](../../Problems/split-array-largest-sum.md)                                                               |

### Important:

You don't need to separately "learn" Book Allocation and Painter's Partition after LC 410.

They are essentially **the same family**:

```text
candidate maximum load
        ↓
greedily create groups
        ↓
groups <= K ?
        ↓
first feasible
```

So I'd study **Split Array Largest Sum deeply**, then use the others as reinforcement.

---

# 🔵 Group 3 — Maximize the Minimum

This is the other major pattern you absolutely need.

The wording usually looks like:

> Maximize the minimum distance/value.

You instead ask:

> **Can I achieve a minimum of at least X?**

Now the predicate is:

```text
TTTTFFFF
```

and you find the **last True**.

| #   | Problem                              |   LC | Validator             | Company tags*        | Links                                                                                                                        |
| --- | ------------------------------------ | ---: | --------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 10  | **Magnetic Force Between Two Balls** | 1552 | Greedy placement      | Amazon, Meta, Google | [magnetic-force-between-two-balls-or-aggressive-cows](../../Problems/magnetic-force-between-two-balls-or-aggressive-cows.md) |
| 11  | **Aggressive Cows**                  |    — | Same greedy placement | Amazon, Google       | [magnetic-force-between-two-balls-or-aggressive-cows](../../Problems/magnetic-force-between-two-balls-or-aggressive-cows.md) |
| 12  | **Divide Chocolate**                 | 1231 | Greedy partition      | Google               | [divide-chocolate](../../Problems/divide-chocolate.md)                                                                       |

Again, **1552 is the one I'd learn properly**.

The reusable pattern:

```text
candidate minimum distance = X
             ↓
greedily place objects
             ↓
can place >= K?
             ↓
TTTTFFFF
             ↓
last True
```

---

# 🟣 Group 4 — Binary Search + Counting

This is where the pattern becomes more interesting.

Instead of a straightforward greedy validator, you **count how many things satisfy a property for candidate X**.

| #   | Problem                                          |   LC | Validator               | Company tags*  | Links                                                                                                        |
| --- | ------------------------------------------------ | ---: | ----------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| 13  | **K-th Smallest Pair Distance**                  |  719 | Two pointers + counting | Google, Amazon | [kth-smallest-pair-distance](../../Problems/kth-smallest-pair-distance.md)                                   |
| 14  | **K-th Smallest Element in a Sorted Matrix**     |  378 | Count `<= X`            | Amazon, Google | [kth-smallest-element-in-a-sorted-matrix](../../Problems/kth-smallest-element-in-a-sorted-matrix.md)         |
| 15  | **K-th Smallest Number in Multiplication Table** |  668 | Mathematical counting   | Google         | [kth-smallest-number-in-multiplication-table](../../Problems/kth-smallest-number-in-multiplication-table.md) |
| 16  | **Maximum Candies Allocated to K Children**      | 2226 | Count pieces            | Google, Amazon | [maximum-candies-allocated-to-k-children](../../Problems/maximum-candies-allocated-to-k-children.md)         |

This teaches a very useful abstraction:

```text
candidate X
    ↓
count(X)
    ↓
is count(X) >= K ?
    ↓
predicate
    ↓
binary search
```

### Priority

For your interview, I'd do:

**719 → 2226 → 378 → 668**

You don't necessarily need all four if time becomes tight.

---

# 🔴 Group 5 — Advanced / Different Validator

Do these only after the previous groups feel natural.

| Problem                                  |   LC | Why it's different                  | Company tags* | Links                                                                                          |
| ---------------------------------------- | ---: | ----------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| **Minimize Max Distance to Gas Station** |  774 | Continuous / floating-point BS      | Google        | [minimize-max-distance-to-gas-station](../../Problems/minimize-max-distance-to-gas-station.md) |
| **Swim in Rising Water**                 |  778 | Binary search + graph feasibility   | Google, Meta  |                                                                                                |
| **Ugly Number III**                      | 1201 | Binary search + inclusion-exclusion | Google        |                                                                                                |
| **K-th Smallest Prime Fraction**         |  786 | More specialized predicate          | Google        |                                                                                                |

### `Swim in Rising Water`

I would **not prioritize this as a Binary Search-on-Answer problem**.

It is valuable, but the important lesson is really:

```text
Binary Search
+
BFS/DFS feasibility
```

and the problem has other standard solutions, particularly Dijkstra.

So don't let it take time away from the core families.

---

# 🎯 Your Actual Study Roadmap

If your interview is **coming fast**, I'd reduce everything to this:

### Phase 1 — Basic predicate

```text
1. Koko Eating Bananas
2. Capacity to Ship Packages
3. Smallest Divisor Given Threshold
```

↓

### Phase 2 — Minimize Maximum

```text
4. Split Array Largest Sum / Book allocation/ painter's partition
5. Minimized Maximum of Products
6. Minimum Limit of Balls in a Bag
 
```

↓

### Phase 3 — Maximize Minimum

```text
7. Magnetic Force Between Two Balls / aggressive cows
8. Divide Chocolate
```

↓

### Phase 4 — Counting Predicate

```text
9. K-th Smallest Pair Distance
10. Maximum Candies Allocated to K Children
11. K-th Smallest in Sorted Matrix
```

↓

### Phase 5 — Advanced

```text
12. Minimize Max Distance to Gas Station
13. Ugly Number III
```

That's the **13-problem core set** I'd use.

---

## The patterns you should be able to recognize after these

|Pattern|Representative problem|
|---|---|
|**Minimum rate**|Koko|
|**Minimum capacity**|Ship Packages|
|**Minimum threshold/divisor**|Smallest Divisor|
|**Minimize maximum partition**|Split Array|
|**Minimize maximum allocation**|Minimized Maximum|
|**Minimize maximum after splitting**|Balls in a Bag|
|**Maximize minimum distance**|Magnetic Force|
|**Maximize minimum value**|Divide Chocolate|
|**Binary search + pair counting**|K-th Pair Distance|
|**Binary search + value counting**|K-th Smallest Matrix|
|**Binary search + mathematical counting**|Multiplication Table|
|**Binary search + graph feasibility**|Swim in Rising Water|
|**Continuous answer search**|Gas Station|

### One thing I'd change from the Gemini list



For your limited time, **learn the pattern, then solve 1–2 variations** rather than collecting dozens of nearly identical problems.

*Company tags are approximate historical interview/problem-bank tags, not guarantees of what a company will ask.