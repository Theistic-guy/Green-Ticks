https://www.youtube.com/watch?v=wjYnzkAhcNk

+ [repeating-element](../Problems/repeating-element.md)
+ [find-duplicate-number](../Problems/find-duplicate-number.md)
# Floyd's Duplicate Detection — Key Insights

**Tags:** #floyd-cycle-detection #fast-and-slow-pointers #two-pointers #arrays #duplicates #cycle-detection #functional-graph #pigeonhole-principle #index-mapping #in-place #constant-space #constraints #interview-pattern

> **Core problem:** `n + 1` elements, values in `[1, n]`, and exactly **one distinct value is duplicated**. Find that value in $O(n)$ time and $O(1)$ auxiliary space.

---

## The Key Transformation

Treat the array as a **functional graph**:

$$  
next(i)=nums[i]  
$$

Every index has exactly **one outgoing edge**.

Example:

```text
nums = [1, 3, 4, 2, 2]

0 → 1 → 3 → 2 → 4
            ↑     │
            └─────┘
```

The duplicate value `2` becomes the **cycle entrance**.

---

## Why Is a Cycle Guaranteed?

There are finitely many nodes, but following `next` indefinitely:

```text
0 → a → b → c → ... → something already visited
```

must eventually revisit a node.

Therefore:

$$  
\boxed{\text{finite nodes + one outgoing edge} \Rightarrow \text{eventual cycle}}  
$$

The `n+1` elements and values restricted to `[1,n]` guarantee the structure needed for the duplicate to correspond to this cycle.

---

## Why Does the Duplicate Become the Cycle Entrance?

Suppose `d` is the duplicated value:

```text
nums[i] = d
nums[j] = d
```

Then:

```text
i ──┐
    ├──→ d
j ──┘
```

Multiple indices point to the **same node `d`**.

Once paths merge, they cannot diverge because every node has only one outgoing edge.

Thus the traversal eventually enters a cycle through `d`.

$$  
\boxed{\text{duplicate value} = \text{cycle entrance}}  
$$

---

## Important Subtlety: Duplicate More Than Twice

The duplicated value **does not have to occur exactly twice**.

Example:

```text
[1, 3, 4, 2, 2, 2]
```

`2` occurs three times, but there is still only **one distinct duplicated value**.

The extra occurrences simply create additional incoming edges:

```text
3 ──┐
4 ──┼──→ 2 → ...
5 ──┘
```

They **do not become additional parts of the cycle**.

### Therefore

```text
Exactly one distinct duplicate
    ↓
May occur 2, 3, 4, ... times
    ↓
Floyd can still identify it
```

What breaks the unique-answer guarantee is **multiple distinct duplicated values**:

```text
[2, 1, 3, 2, 3]
         ↑     ↑
       duplicate values: 2 and 3
```

---

## Floyd's Two Phases

### Phase 1 — Detect a meeting point

```python
slow = fast = 0

while True:
    slow = nums[slow]
    fast = nums[nums[fast]]

    if slow == fast:
        break
```

This finds **some point inside the cycle**.

It is **not necessarily the duplicate**.

### Phase 2 — Find cycle entrance

```python
slow = 0

while slow != fast:
    slow = nums[slow]
    fast = nums[fast]

return slow
```

They meet at the **cycle entrance = duplicate value**.

---

## Why This Pattern Is Important

The real interview insight isn't:

> "Use Floyd whenever you see duplicates."

Instead:

```text
Array
  ↓
nums[i] can act as next pointer?
  ↓
Functional graph
  ↓
Repeated state
  ↓
Cycle detection
  ↓
Floyd
```

This same transformation can appear in problems that **don't initially look like linked-list problems**.

---

## Constraint Checklist

Think **Floyd** when you see:

- `n + 1` elements
    
- values in `[1, n]`
    
- exactly **one distinct duplicated value**
    
- array modification prohibited
    
- $O(1)$ auxiliary space required
    

### Don't blindly use Floyd

If there are multiple distinct duplicates or the value range doesn't support the index mapping, use another technique such as hashing, counting, sorting, or a problem-specific approach.

---

## Key Takeaways

1. **Array → functional graph** is the crucial transformation.
    
2. Finite nodes + one outgoing edge ⇒ eventual cycle.
    
3. The duplicated value is the **cycle entrance**.
    
4. The duplicate may occur **more than twice**; only one _distinct_ duplicated value is required.
    
5. Extra occurrences create additional **incoming edges**, not additional cycle nodes.
    
6. Multiple distinct duplicated values invalidate the unique cycle-entrance interpretation.
    
7. **Phase 1 finds the cycle; Phase 2 finds its entrance.**
    

> **Mental hook:**  
> **"Don't see an array of numbers—see nodes with `nums[i]` as their next pointer."**





---
# Important Footnotes

## 🧠 Floyd's Cycle Detection: The "Index 0" Insight (LC 287)

## 📌 The Core Question

In LeetCode 287 (Find the Duplicate Number), why are values strictly bounded between $[1, n]$ while indices span $[0, n]$? Why does no element ever point to `0`?

## 🔑 The Insight

Index `0` is intentionally engineered to be the external launchpad (the tail) of the graph.

Because `0` is a valid starting index but never appears as a value inside the array, no element can ever point back to index `0`.

## 🚀 Why This Matters (The Mechanics)

## 1. Guarantees a $\rho$-shaped (Rho) Graph

- With `0` excluded from values: The graph _must_ have a tail leading into a loop ($\rho$-shape).
- If `0` were included: The graph could form a perfect loop ($O$-shape) with no tail.

## 2. Enables Phase 2 (Finding the Duplicate)

Floyd's algorithm relies on a strict mathematical distance relationship to find the cycle entrance:  
$$\text{Distance from Start to Loop Entrance} = \text{Remaining Distance within Loop}$$

- Because `0` is guaranteed to be outside the loop, resetting a pointer to `0` in Phase 2 ensures the two pointers will meet exactly at the loop entrance (the duplicate value).
- Without a tail, Phase 2 fails because you cannot step _into_ an entrance from the outside. [6]

## 3. Proof of Duplicate Existence

If an array had no tail (a perfect circle), it would be a perfect permutation where every number appears exactly once. The exclusion of `0` from the values forces a bottleneck, mathematically guaranteeing that a duplicate _must_ exist to bridge the tail into a loop. [7]

---
