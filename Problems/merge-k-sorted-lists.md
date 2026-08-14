---
Title: Merge K Sorted Lists — K-Way Merge
Companies:
  - Not Specified
Topics:
  - Linked Lists
  - Heap
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
  - kth
  - Sorted
  - Merge
Link: ""
---
# Merge K Sorted Lists — K-Way Merge

**Pattern:** Heap (K-way)

**Idea:** 

**Variations** : 
+ [K-way Merge](../Notes/K-way%20Merge.md)
---

## 💻 Code

```Python
import heapq


def mergeKLists(lists):
    heap = []

    # Put the head of every non-empty list into the heap.
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))

    dummy = ListNode(0)
    tail = dummy

    while heap:
        value, i, node = heapq.heappop(heap)

        # Add the smallest node to result.
        tail.next = node
        tail = node

        # Add the next node from the same list.
        if node.next:
            heapq.heappush(
                heap,
                (node.next.val, i, node.next)
            )

    return dummy.next

```
**Time complexity** - O(N log K) , n is total no of nodes, and k is no of lists
**Aux. Space complexity** -  O(k)

---


> **Pattern:** K-way merge using a **min heap**
> 
> **Core idea:** At any moment, we only need to know the **smallest currently available element from each sorted list**. A min heap lets us find that smallest element efficiently.

---

## 1. Problem

Given `k` sorted linked lists, merge them into **one sorted linked list**.

Example:

```text
L1: 1 → 4 → 5
L2: 1 → 3 → 4
L3: 2 → 6
```

Result:

```text
1 → 1 → 2 → 3 → 4 → 4 → 5 → 6
```

---

# 2. Why a Min Heap?

Think of every linked list as a **sorted stream**.

Initially, we only care about the head of each list:

```text
L1: 1 → 4 → 5
     ↑

L2: 1 → 3 → 4
     ↑

L3: 2 → 6
     ↑
```

The only candidates for the next smallest element are:

```text
1, 1, 2
```

Put them into a min heap:

```text
Heap = [1, 1, 2]
```

Take the smallest:

```text
1
```

After taking it from `L1`, the next candidate from that list is `4`:

```text
L1: 4 → 5
     ↑
```

So we push `4` into the heap.

Now the heap represents the **current smallest available element from every list**.

Repeat.

---

# 3. The Key Invariant

At any point:

> **The heap contains at most one node from each list — the next unprocessed node from that list.**

Therefore, if the heap's minimum is:

```text
x
```

then `x` is guaranteed to be the next smallest element in the final merged list.

Why?

Because every list is already sorted.

If the current head of a list is `5`, nothing later in that list can be smaller than `5`.

---

# 4. Example

```text
L1: 1 → 4 → 5
L2: 1 → 3 → 4
L3: 2 → 6
```

Initial heap:

```text
[1(L1), 1(L2), 2(L3)]
```

### Step 1

Pop:

```text
1(L1)
```

Result:

```text
1
```

Push next node from L1:

```text
4(L1)
```

Heap:

```text
[1(L2), 2(L3), 4(L1)]
```

### Step 2

Pop:

```text
1(L2)
```

Push:

```text
3(L2)
```

Heap:

```text
[2(L3), 3(L2), 4(L1)]
```

Continue:

```text
2 → 3 → 4 → 4 → 5 → 6
```

Final:

```text
1 → 1 → 2 → 3 → 4 → 4 → 5 → 6
```

---

# 5. Python Code

Python's `heapq` needs elements to be comparable.

For linked-list nodes, use a tuple:

```text
(value, unique_id, node)
```

==The `unique_id` prevents Python from trying to compare two `ListNode` objects when their values are equal.==

```python
import heapq


def mergeKLists(lists):
    heap = []

    # Put the head of every non-empty list into the heap.
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))

    dummy = ListNode(0)
    tail = dummy

    while heap:
        value, i, node = heapq.heappop(heap)

        # Add the smallest node to result.
        tail.next = node
        tail = node

        # Add the next node from the same list.
        if node.next:
            heapq.heappush(
                heap,
                (node.next.val, i, node.next)
            )

    return dummy.next
```

### Why is `i` needed?

Suppose the heap contains:

```python
(1, node_A)
(1, node_B)
```

Python compares tuples element-by-element.

After seeing equal values:

```text
1 == 1
```

it would try:

```python
node_A < node_B
```

which isn't defined for ordinary `ListNode` objects.

Using:

```python
(node.val, i, node)
```

gives every list a unique tie-breaker.

---

# 6. Complexity

Let:

- `K` = number of linked lists
    
- `N` = total number of nodes across all lists
    

Every node is:

- inserted into the heap once
    
- removed from the heap once
    

Heap size is at most `K`.

Therefore:

```text
Time = O(N log K)
```

Auxiliary space:

```text
O(K)
```

The output nodes themselves are reused, so we don't need `O(N)` extra space for the result.

---

# 7. Why Not Just Compare All K Heads?

A naive approach could do:

```text
Find minimum among K current heads
```

for every node.

Finding that minimum costs:

```text
O(K)
```

and there are `N` nodes.

Therefore:

```text
O(NK)
```

The heap reduces:

```text
find minimum among K
```

from:

```text
O(K)
```

to:

```text
O(log K)
```

giving:

```text
O(N log K)
```

---

# 8. Connection to Kth Smallest in a Sorted Matrix

This is the same **K-way merge pattern** you just saw.

For the sorted matrix:

```text
row 1 → sorted stream
row 2 → sorted stream
row 3 → sorted stream
...
```

For Merge K Sorted Lists:

```text
list 1 → sorted stream
list 2 → sorted stream
list 3 → sorted stream
...
```

The general pattern is:

```text
K sorted sequences
        ↓
Keep one current candidate
from each sequence
        ↓
Min Heap
        ↓
Repeatedly extract minimum
and advance that sequence
```

---

# 9. General K-Way Merge Pattern

You should recognize this whenever you see:

- Merge `K` sorted arrays/lists
    
- Merge `K` sorted streams
    
- Find the smallest/largest among `K` sorted sources
    
- Find the `k`-th smallest element across sorted collections
    
- External sorting / merging sorted files
    

The reusable mental model is:

> **One pointer per sorted source + a heap containing the current candidate from each source.**

---

# 10. Interview Takeaway

If the interviewer asks:

> **"Why a min heap?"**

Say:

> "Because each list is sorted, only its current head can be the next smallest element. So I keep the current head from every list in a min heap. After extracting the minimum, I advance only that list and insert its next node. This gives `O(N log K)` time because each of the `N` nodes enters and leaves a heap of size at most `K`."

### Pattern to remember

```text
K sorted sources
      ↓
one pointer per source
      ↓
min heap of K candidates
      ↓
pop minimum
      ↓
advance that source
      ↓
repeat
```

**This is the canonical K-way merge problem.** LeetCode 23 is probably the most important problem to associate with the pattern.