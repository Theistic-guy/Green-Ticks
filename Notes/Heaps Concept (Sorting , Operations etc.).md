# Heaps

**See Also** :-
+ [Heap Lazy Deletion (Decrease Key)](../Templates/Heap%20Lazy%20Deletion%20(Decrease%20Key).md)


![Heap Mind map|700](../assets/Images/Heap%20Mind%20map.svg)



# Heaps — Complete PKM / DSA Note

**Tags:** `#DSA` `#Heaps` `#BinaryHeap` `#MinHeap` `#MaxHeap` `#PriorityQueue` `#CompleteBinaryTree` `#HeapProperty` `#Heapify` `#SiftUp` `#SiftDown` `#BuildHeap` `#HeapSort` `#Sorting` `#ArrayRepresentation` `#TreeDataStructure` `#Greedy` `#GraphAlgorithms` `#Dijkstra` `#Prim` `#KthElement` `#TopK` `#DataStructures` `#TimeComplexity`

> **Core idea:** A **binary heap** is a **complete binary tree** stored efficiently in an array, with an ordering constraint between every parent and its children.  
> A **max-heap** keeps the largest element at the root; a **min-heap** keeps the smallest element at the root.

---

## 1. What is a Heap?

A **heap** is a specialized tree-based data structure primarily used when we repeatedly need access to the **minimum or maximum element**.

A binary heap has two defining properties:

### 1. Structural property

The tree must be a **Complete Binary Tree (CBT)**.

A complete binary tree means:

- Every level is completely filled except possibly the last.
    
- The last level is filled **from left to right**.
    

Example:

```text
        10
       /  \
      7    8
     / \  /
    3  5 6
```

This is complete because the final level is filled from left to right.

But:

```text
        10
       /  \
      7    8
       \
        5
```

is **not** complete because there is a gap on the left before a node appears on the right.

---

### 2. Heap-order property

The relationship between a parent and its children must satisfy the heap condition.

For a **Max Heap**:

```text
parent >= children
```

For a **Min Heap**:

```text
parent <= children
```

Example of max-heap:

```text
          50
        /    \
      30      40
     /  \    /  \
   10   20  35   25
```

Every parent is greater than or equal to its children.

Example of min-heap:

```text
          5
        /   \
       10    8
      / \   / \
     20 15 12 30
```

Every parent is less than or equal to its children.

---

# 2. The Two Properties Must Be Kept Separate

This distinction is extremely important.

A heap is valid only when **both** conditions hold:

```text
                    HEAP
                     |
          +----------+----------+
          |                     |
   Complete Tree          Heap Ordering
   (shape property)       (value property)
```

For example:

```text
          10
        /    \
       20     30
```

The shape is complete.

But it is **not a min-heap**, because:

```text
10 <= 20 ✅
10 <= 30 ✅
```

Actually, it **is** a min-heap.

Now:

```text
          30
        /    \
       10     20
```

The shape is complete, but:

```text
30 >= 10 ❌ for min-heap
30 >= 20 ❌ for min-heap
```

It is, however, a valid **max-heap**.

So:

> **Complete binary tree determines where nodes are allowed to exist. Heap order determines which values are allowed where.**

---

# 3. Why Do We Use a Heap?

Suppose we want:

> "Give me the largest element repeatedly."

A normal unsorted array gives:

```text
[4, 1, 9, 2, 7, 5]
```

Finding the maximum requires:

```text
O(n)
```

A heap organizes the data so that the important element is always at the root:

```text
          9
        /   \
       7     5
      / \   /
     2   1 4
```

Therefore:

```text
maximum = root = O(1)
```

And when the maximum is removed, the heap can be restored in:

```text
O(log n)
```

This is why heaps are extremely useful for **priority queues**.

---

# 4. A Heap Is Usually Stored in an Array

Although we conceptually think of a heap as a tree, we usually **do not create tree nodes with pointers**.

Instead, we store it in an array.

Example:

```text
Tree:

          50
        /    \
      30      40
     /  \    /  \
   10   20  35   25


Array:

[50, 30, 40, 10, 20, 35, 25]
```

This works because the tree is **complete**.

There are no arbitrary gaps, so every node's position can be determined mathematically.

---

# 5. Array Index Relationships

This is one of the most important things to memorize.

For **0-based indexing**:

```text
           i
         /   \
      left   right

left  = 2*i + 1
right = 2*i + 2

parent = (i - 1) // 2
```

Example:

```text
Array:

index:  0   1   2   3   4   5   6
value: 50  30  40  10  20  35  25
```

For index `1`:

```text
value = 30

left  = 2(1)+1 = 3   -> 10
right = 2(1)+2 = 4   -> 20
```

For index `5`:

```text
value = 35

parent = (5-1)//2
       = 2

arr[2] = 40
```

So:

```text
             40
             |
            35
```

---

## 6. Why the Array Representation Is So Efficient

A general binary tree may require pointers:

```text
Node
 ├── left
 └── right
```

A heap does not need those pointers because the structure is guaranteed to be complete.

The tree structure is implicitly encoded in the indices.

This gives us:

- contiguous memory
    
- no explicit pointer overhead
    
- simple parent/child calculations
    
- excellent cache locality in practice
    
- easy implementation
    

This is one of the key reasons heaps are commonly implemented using arrays.

---

# 7. Min Heap vs Max Heap

## Max Heap

The greatest element is at the root.

```text
         MAX
        /   \
      ...   ...
```

Condition:

```text
parent >= child
```

Therefore:

```python
heap[0]
```

contains the maximum.

---

## Min Heap

The smallest element is at the root.

```text
         MIN
        /   \
      ...   ...
```

Condition:

```text
parent <= child
```

Therefore:

```python
heap[0]
```

contains the minimum.

---

### Important Observation

A heap does **not** mean:

```text
entire array is sorted
```

A max heap:

```text
[50, 30, 40, 10, 20, 35, 25]
```

is valid even though:

```text
30 > 40 ❌
```

as a left-to-right array ordering.

The only requirement is **parent-child ordering**.

This is one of the most common beginner misconceptions.

---

# 8. Heap ≠ Binary Search Tree

They are both binary trees, but their ordering rules are very different.

### Binary Search Tree

For every node:

```text
left subtree < node < right subtree
```

Example:

```text
       10
      /  \
     5   20
```

The left side and right side have global ordering implications.

### Heap

Only parent-child priority matters:

```text
       10
      /  \
     20  15
```

This can be a max/min heap depending on the values, but there is **no requirement** that the entire left subtree be less than the right subtree.

Therefore:

> **BST gives strong ordering across subtrees. Heap gives local parent-child ordering.**

---

# 9. Height of a Heap

A heap is a complete binary tree.

For `n` nodes:

```text
height = O(log n)
```

More precisely:

```text
height = floor(log₂ n)
```

approximately.

Why is this important?

Because the main heap operations move an element **up or down the tree**, and the maximum distance it can travel is the tree's height.

Therefore:

```text
sift up   -> O(log n)
sift down -> O(log n)
```

---

# 10. Core Heap Operations

The major operations shown in your mind map are:

```text
                 HEAP
                   |
              OPERATIONS
             /     |      \
         insert   delete   heapify
                     |
                decrease key
```

The most important operations are:

|Operation|Complexity|
|---|--:|
|Peek root|`O(1)`|
|Insert|`O(log n)`|
|Extract/Delete root|`O(log n)`|
|Heapify one node|`O(log n)`|
|Build heap|`O(n)`|
|Search arbitrary element|`O(n)`|
|Heap Sort|`O(n log n)`|

The reason the common operations are fast is that the heap only needs to maintain ordering along a **single root-to-leaf path**.

---

# 11. Insertion into a Heap

Suppose we have a max heap:

```text
          50
        /    \
      30      40
     /  \    /
    10  20  35
```

Array:

```text
[50, 30, 40, 10, 20, 35]
```

Now insert:

```text
45
```

## Step 1 — Put the new element at the end

Because the tree must remain complete:

```text
          50
        /    \
      30      40
     /  \    / \
    10  20  35 45
```

Array:

```text
[50, 30, 40, 10, 20, 35, 45]
```

The shape property is preserved.

But heap order is violated:

```text
40 < 45
```

---

# 12. Sift Up / Bubble Up

We compare the new node with its parent.

```text
45
|
parent = 40
```

Since:

```text
45 > 40
```

swap them.

```text
          50
        /    \
      30      45
     /  \    / \
    10  20  35 40
```

Now compare:

```text
45 with parent 50
```

Since:

```text
45 < 50
```

stop.

Final heap:

```text
          50
        /    \
      30      45
     /  \    / \
    10  20  35 40
```

---

## Insertion Algorithm

```python
def insert(heap, value):
    heap.append(value)

    i = len(heap) - 1

    while i > 0:
        parent = (i - 1) // 2

        if heap[parent] >= heap[i]:
            break

        heap[parent], heap[i] = heap[i], heap[parent]
        i = parent
```

This implementation is for a **max heap**.

For a min heap, reverse the comparison:

```python
if heap[parent] <= heap[i]:
    break
```

---

# 13. Why Insertion Is O(log n)

We initially insert at:

```text
leaf
```

Then the element can move:

```text
leaf
 ↓
parent
 ↓
grandparent
 ↓
...
 ↓
root
```

At most, it travels one tree height.

Since:

```text
height = O(log n)
```

we get:

```text
Insertion = O(log n)
```

---

# 14. Extract / Delete the Root

Suppose:

```text
          50
        /    \
      30      45
     /  \    / \
    10  20  35 40
```

We want to remove:

```text
50
```

We cannot simply remove the root because then the tree structure would become invalid.

Instead:

### Step 1

Replace the root with the last element:

```text
          40
        /    \
      30      45
     /  \    /
    10  20  35
```

Array:

```text
[40, 30, 45, 10, 20, 35]
```

The tree is still complete.

But heap order is broken:

```text
40 < 45
```

---

# 15. Sift Down / Heapify Down

Compare the root with its children.

```text
        40
       /  \
      30  45
```

For a max heap, choose the **larger child**.

```text
45 > 30
```

Swap:

```text
          45
        /    \
      30      40
     /  \    /
    10  20  35
```

Now `40` has child `35`:

```text
40 >= 35
```

So stop.

Final heap:

```text
          45
        /    \
      30      40
     /  \    /
    10  20  35
```

---

# 16. Why Do We Compare With the Larger Child?

This is a subtle but extremely important point.

For a **max heap**, suppose:

```text
        X
       / \
      40  50
```

If:

```text
X = 45
```

we cannot swap with `40`, because then:

```text
       40
      /  \
     45  50
```

and the parent `40` would still be smaller than `50`.

So we choose:

```text
larger child
```

because that child is the one that must become the parent.

Similarly:

### Max heap

```text
choose larger child
```

### Min heap

```text
choose smaller child
```

This is a very useful interview rule.

---

# 17. Extract-Max Algorithm

```python
def extract_max(heap):
    if not heap:
        raise IndexError("extract_max from empty heap")

    if len(heap) == 1:
        return heap.pop()

    maximum = heap[0]

    heap[0] = heap.pop()

    i = 0

    while True:
        left = 2 * i + 1
        right = 2 * i + 2
        largest = i

        if left < len(heap) and heap[left] > heap[largest]:
            largest = left

        if right < len(heap) and heap[right] > heap[largest]:
            largest = right

        if largest == i:
            break

        heap[i], heap[largest] = heap[largest], heap[i]
        i = largest

    return maximum
```

Complexity:

```text
O(log n)
```

---

# 18. The Two Fundamental Repair Operations

Most heap algorithms can be understood through just two ideas:

```text
                HEAP REPAIR
                /         \
           SIFT UP      SIFT DOWN
```

### Sift Up

Used when:

```text
new value enters at the bottom
```

Typical operation:

```text
insert
```

Movement:

```text
bottom → root
```

### Sift Down

Used when:

```text
root/internal node may be too large/small
```

Typical operations:

```text
extract root
heapify
build heap
heap sort
```

Movement:

```text
top → bottom
```

This mental model is more important than memorizing individual implementations.

---

# 19. Peek

The root always contains the highest-priority element.

Therefore:

### Max Heap

```python
heap[0]
```

gives maximum.

### Min Heap

```python
heap[0]
```

gives minimum.

Complexity:

```text
O(1)
```

No restructuring is necessary.

---

# 20. Delete an Arbitrary Element

Suppose:

```text
[50, 40, 45, 20, 30, 35, 10]
```

We want to delete:

```text
30
```

A common strategy is:

1. Find the element.
    
2. Replace it with the last element.
    
3. Remove the last element.
    
4. Restore heap order.
    

The repair direction depends on the replacement value.

For example:

```text
      40
     /  \
   30    45
```

Replace `30` with some value `X`.

We must ask:

```text
Does X violate the relationship with its parent?
```

If yes:

```text
sift up
```

Otherwise check:

```text
Does X violate the relationship with its children?
```

If yes:

```text
sift down
```

Therefore:

> After replacing an element, the replacement needs to move in the direction of the violation.

---

# 21. Decrease-Key / Increase-Key

These operations are important in many heap-based algorithms.

For a **min heap**:

```text
decrease-key
```

makes an element smaller.

Since smaller values have higher priority, it may need to move **up**.

```text
decrease key
     ↓
possibly violates parent relationship
     ↓
sift up
```

For a min heap:

```text
increase-key
```

may cause the element to move down.

Conversely, for a max heap:

```text
increase-key → sift up
decrease-key → sift down
```



---

# 22. Build Heap

One of the most important heap concepts is:

> How do we convert an arbitrary array into a heap?

Suppose:

```text
arr = [4, 10, 3, 5, 1]
```

We want a max heap.

The naive approach would be:

```text
insert elements one by one
```

This gives:

```text
O(n log n)
```

But there is a better method:

```text
BUILD HEAP = O(n)
```

---

# 23. Bottom-Up Build Heap

For an array:

```text
[4, 10, 3, 5, 1]
```

The tree is:

```text
          4
        /   \
      10     3
     /  \
    5    1
```

The leaves already satisfy heap order internally because they have no children.

Therefore, we start from the **last non-leaf node**.

For 0-based indexing:

```python
last_non_leaf = n // 2 - 1
```

Then:

```text
i = n//2 - 1
i -= 1
i -= 1
...
i = 0
```

At each index, perform:

```text
sift down
```

---

# 24. Why Do We Start at `n//2 - 1`?

For 0-based indexing:

```text
left = 2i + 1
```

A node is a leaf when:

```text
2i + 1 >= n
```

The last non-leaf therefore occurs at:

```text
floor(n/2) - 1
```

So:

```python
for i in range(n // 2 - 1, -1, -1):
    sift_down(i)
```

is the classic bottom-up heap construction.

---

# 25. Example of Build Heap

Take:

```text
[4, 10, 3, 5, 1]
```

Tree:

```text
          4
        /   \
      10     3
     /  \
    5    1
```

Start from:

```text
index = 1
```

Node:

```text
10
```

Children:

```text
5, 1
```

Already valid as max-heap subtree:

```text
10 >= 5
10 >= 1
```

Now:

```text
index = 0
```

Node:

```text
4
```

Children:

```text
10, 3
```

Largest child:

```text
10
```

Swap:

```text
          10
        /    \
       4      3
      / \
     5   1
```

Now `4` has child `5`.

Swap again:

```text
          10
        /    \
       5      3
      / \
     4   1
```

Final array:

```text
[10, 5, 3, 4, 1]
```

This is a valid max heap.

---

# 26. Why Is Build Heap O(n), Not O(n log n)?

This is a famous DSA interview question.

At first glance, we might think:

```text
n nodes × O(log n)
= O(n log n)
```

But this is an overestimate.

Most nodes are **near the bottom** of the tree, so they can only move a tiny distance.

Only a very small number of nodes are capable of moving close to the root.

Conceptually:

```text
         1 node        → height
       2 nodes         → height - 1
       4 nodes         → height - 2
       8 nodes         → height - 3
       ...
      many leaves      → height 0
```

The total work is:

```text
O(n)
```

This is a very important heap fact:

> **Bottom-up build heap runs in linear time: O(n).**

---

# 27. Build Heap vs Repeated Insertion

Two ways to construct a heap:

### Method 1 — Repeated insertion

```text
insert one element at a time
```

Complexity:

```text
O(n log n)
```

### Method 2 — Bottom-up heapify

```text
sift down from last non-leaf to root
```

Complexity:

```text
O(n)
```

Therefore:

> When you already have all elements in an array, bottom-up build heap is preferable.

---

# 28. Heapify

The word **heapify** can be confusing because different textbooks use it slightly differently.

Usually, heapify means:

> Restore the heap property for a node/subtree, assuming its child subtrees already satisfy the heap property.

For a max heap:

```python
def heapify(heap, n, i):
    largest = i

    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and heap[left] > heap[largest]:
        largest = left

    if right < n and heap[right] > heap[largest]:
        largest = right

    if largest != i:
        heap[i], heap[largest] = heap[largest], heap[i]
        heapify(heap, n, largest)
```

This is essentially **sift down**.

Complexity:

```text
O(log n)
```

for one node.

---

# 29. Priority Queue

One of the most important real-world uses of a heap is implementing a **priority queue**.

A normal queue:

```text
FIFO

A → B → C → D
```

The first inserted element is served first.

A priority queue instead says:

> The element with the highest priority gets served first.

Example:

```text
Patient A → priority 3
Patient B → priority 10
Patient C → priority 5
```

The service order may be:

```text
B
C
A
```

A heap is perfect for this.

### Max heap

Highest value = highest priority.

### Min heap

Lowest value = highest priority.

---

# 30. Python's `heapq`

Python's standard library provides:

```python
import heapq
```

It implements a **min heap**.

Example:

```python
import heapq

heap = []

heapq.heappush(heap, 5)
heapq.heappush(heap, 2)
heapq.heappush(heap, 8)
heapq.heappush(heap, 1)

print(heap)
```

The exact internal array is not a sorted array, but:

```python
heap[0]
```

is always the minimum.

```python
print(heap[0])
# 1
```

---

# 31. Removing From Python's Heap

```python
minimum = heapq.heappop(heap)

print(minimum)
```

This removes and returns the smallest element.

Complexity:

```text
heappop = O(log n)
```

Insertion:

```python
heapq.heappush(heap, x)
```

Complexity:

```text
O(log n)
```

Peek:

```python
heap[0]
```

Complexity:

```text
O(1)
```

---

# 32. Creating a Heap From an Existing Array

Python provides:

```python
heapq.heapify(arr)
```

Example:

```python
arr = [10, 4, 7, 1, 3, 8]

heapq.heapify(arr)
```

Now `arr` is arranged as a min heap.

Complexity:

```text
O(n)
```

This directly corresponds to the **bottom-up build heap** concept.

---

# 33. How to Implement a Max Heap Using `heapq`

Since `heapq` is a min heap, a common trick is to insert negative values:

```python
import heapq

heap = []

heapq.heappush(heap, -50)
heapq.heappush(heap, -20)
heapq.heappush(heap, -80)

maximum = -heapq.heappop(heap)

print(maximum)
# 80
```

Because:

```text
minimum(-value) = -maximum(value)
```

---

# 34. Heap Sort

A heap can also be used to sort an array.

This is the sorting concept represented in your mind map:

```text
                     HEAP
                       |
                    SORTING
                       |
                  HEAP SORT
                  /       \
            Build Heap    Repeatedly
                           remove root
```

Heap sort has two major phases:

```text
1. Build heap
2. Repeatedly extract root
```

---

# 35. Heap Sort With a Max Heap

Suppose:

```text
arr = [4, 10, 3, 5, 1]
```

### Step 1 — Build max heap

```text
[10, 5, 3, 4, 1]
```

### Step 2 — Put largest element into final position

Largest:

```text
10
```

Swap root with last element:

```text
[1, 5, 3, 4, 10]
```

Now the last position is finalized.

Heapify only the unsorted portion:

```text
[1, 5, 3, 4 | 10]
```

Heapify:

```text
[5, 4, 3, 1 | 10]
```

Repeat:

```text
[1, 4, 3, 5 | 10]
```

heapify:

```text
[4, 1, 3, 5 | 10]
```

Continue until:

```text
[1, 3, 4, 5, 10]
```

Therefore:

```text
Max heap + repeatedly place root at end
= ascending order
```

---

# 36. Why Does Max-Heap Heap Sort Produce Ascending Order?

A max heap always gives:

```text
largest remaining element
```

at the root.

So each extraction gives:

```text
largest
second largest
third largest
...
```

We place those at the **end**:

```text
            sorted
              ↓
[ ?, ?, ?, ?, 10]
```

then:

```text
[ ?, ?, ?, 5, 10]
```

then:

```text
[ ?, ?, 4, 5, 10]
```

Eventually:

```text
[1, 3, 4, 5, 10]
```

---

# 37. Heap Sort Complexity

Build heap:

```text
O(n)
```

Then `n-1` extractions:

```text
O(log n) each
```

Therefore:

```text
O(n log n)
```

Overall:

```text
Time = O(n log n)
```

Importantly:

```text
Worst case = O(n log n)
Average = O(n log n)
Best = O(n log n)
```

Heap sort has guaranteed `O(n log n)` time.

---

# 38. Is Heap Sort In-Place?

Yes.

A standard array-based heap sort can sort the array without requiring another array proportional to `n`.

Therefore:

```text
Auxiliary space = O(1)
```

apart from the implementation's recursion/stack details.

A common iterative heapify implementation therefore gives:

```text
Time  = O(n log n)
Space = O(1)
```

---

# 39. Is Heap Sort Stable?

No.

Heap sort is generally:

```text
NOT stable
```

That means two equal elements do not necessarily preserve their original relative order.

So the usual comparison is:

|Algorithm|Time|Extra Space|Stable?|
|---|--:|--:|---|
|Merge Sort|`O(n log n)`|`O(n)`|Yes|
|Quick Sort|average `O(n log n)`|usually `O(log n)`|No|
|Heap Sort|`O(n log n)`|`O(1)`|No|

Heap sort's major advantage is:

```text
guaranteed O(n log n) + O(1) auxiliary space
```

---

# 40. Full Heap Sort Implementation

```python
def heapify(arr, n, i):
    """Restore max-heap property for subtree rooted at i."""
    largest = i

    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)


def heap_sort(arr):
    n = len(arr)

    # 1. Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # 2. Repeatedly move maximum to the end
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]

        # Heap size becomes smaller
        heapify(arr, end, 0)

    return arr
```

Example:

```python
arr = [4, 10, 3, 5, 1]

heap_sort(arr)

print(arr)
# [1, 3, 4, 5, 10]
```

---

# 41. A Crucial Heap Sort Detail: Heap Size Shrinks

This is easy to overlook.

Suppose:

```text
[10, 7, 8, 3, 5 | 9, 11]
```

Once an element has been placed into the sorted region:

```text
                  heap       sorted
                   ↓            ↓
[10, 7, 8, 3, 5 | 9, 11]
```

The sorted elements are **no longer part of the heap**.

So heapify uses:

```python
heapify(arr, end, 0)
```

instead of:

```python
heapify(arr, len(arr), 0)
```

`end` represents the current heap size.

This is one of the central implementation details of heap sort.

---

# 42. Complete Binary Tree Level Order ↔ Array

Your mind map also emphasizes the relationship between the tree and array.

Consider:

```text
          10
        /    \
       7      8
      / \    / \
     3   5  6   4
```

Level-order traversal:

```text
10
7 8
3 5 6 4
```

Array representation:

```text
[10, 7, 8, 3, 5, 6, 4]
```

So the array corresponds directly to:

```text
level-order traversal
```

This is why parent and child indices have such simple formulas.

---

# 43. Why Can't We Use an Array for Any Arbitrary Binary Tree?

Because an arbitrary binary tree may contain gaps.

Example:

```text
        A
       /
      B
       \
        C
```

To represent this directly in an array using heap-style indexing:

```text
A -> 0
B -> 1
C -> 4
```

We already have wasted positions:

```text
[A, B, ?, ?, C]
```

For a highly sparse tree this becomes extremely wasteful.

A heap avoids this problem because its tree is always:

```text
complete
```

Therefore the array representation stays compact.

---

# 44. Height vs Number of Nodes

For a complete binary tree:

```text
height ≈ log₂(n)
```

This is the mathematical foundation of heap efficiency.

At each level the number of nodes approximately doubles:

```text
Level 0 → 1
Level 1 → 2
Level 2 → 4
Level 3 → 8
...
```

Total nodes through height `h`:

```text
1 + 2 + 4 + ... + 2^h
```

which gives:

```text
2^(h+1) - 1
```

So:

```text
n ≈ 2^h
```

and therefore:

```text
h ≈ log₂ n
```

---

# 45. Searching in a Heap

A common misconception is:

> "Since a heap is ordered, searching should be O(log n)."

Not necessarily.

A heap only guarantees:

```text
parent-child ordering
```

It does **not** provide enough global ordering to perform binary-search-style elimination.

Therefore searching for an arbitrary value can require:

```text
O(n)
```

in the worst case.

This is an important distinction:

```text
BST search → potentially O(log n)
Heap search → O(n)
```

assuming the usual balanced BST conditions for the former.

---

# 46. What a Heap Does NOT Give You

A heap is excellent at:

```text
minimum / maximum
```

But it is not designed to efficiently answer:

```text
"Where is value 73?"
```

nor:

```text
"Give me every element in sorted order immediately."
```

without performing additional work.

So choose a heap when the requirement is:

> **Repeated access to the highest-priority element.**

Not:

> **Maintain full sorted ordering.**

---

# 47. Heap as a Priority Structure

A useful abstraction is:

```text
              HEAP
                |
        "Who has highest priority?"
                |
                ↓
              ROOT
```

For max heap:

```text
priority = larger value
```

For min heap:

```text
priority = smaller value
```

But priority does not have to literally be the number itself.

For example:

```python
(priority, task)
```

can be stored in a min heap.

Example:

```python
(1, "Fix production bug")
(2, "Reply to email")
(5, "Watch tutorial")
```

The smallest priority number can represent the highest priority.

---

# 48. Heap Applications

Heaps appear everywhere in DSA because many algorithms repeatedly need the smallest/largest candidate.

### Priority Queues

The canonical application.

```text
Insert item
Extract highest priority
```

---

### Dijkstra's Algorithm

Repeatedly select the vertex with the smallest currently known distance.

```text
minimum distance
        ↓
   min heap / PQ
```

---

### Prim's Algorithm

Repeatedly select the minimum-weight edge/vertex candidate.

Again:

```text
minimum priority
        ↓
      heap
```

---

### Top-K Problems

Examples:

```text
Find K largest elements
Find K smallest elements
Top K frequent elements
K closest points
```

A heap lets us maintain only the candidates we care about.

---

### Kth Largest / Kth Smallest

A heap is often an intuitive solution.

For example, to find the `k` largest elements, maintain a min heap of size `k`.

When the heap grows beyond `k`:

```text
pop smallest
```

The root eventually represents:

```text
k-th largest
```

---

### Scheduling

Tasks can be selected according to:

```text
priority
deadline
cost
execution time
```

---

### Merge K Sorted Lists

A heap can keep the smallest current element from each list.

```text
list 1 → current element
list 2 → current element
list 3 → current element
...
            ↓
          min heap
            ↓
       smallest overall
```

This gives an efficient multiway merge.

---

# 49. The "K Largest" Heap Pattern

Suppose:

```text
arr = [7, 2, 9, 4, 1, 8, 5]
k = 3
```

We want:

```text
[9, 8, 7]
```

Use a **min heap of size k**.

Process:

```text
7 → [7]
2 → [2,7]
9 → [2,7,9]
```

Now process:

```text
4
```

Heap becomes four elements temporarily:

```text
[2,4,7,9]
```

Remove the smallest:

```text
[4,7,9]
```

Continue:

```text
1 → discard
8 → [7,8,9]
5 → discard
```

Final heap:

```text
[7, 8, 9]
```

The root:

```text
7
```

is the 3rd largest.

Complexity:

```text
O(n log k)
```

instead of necessarily sorting all elements:

```text
O(n log n)
```

This is a very important interview pattern.

---

# 50. A Useful Rule for Top-K Problems

Memorize the following intuition:

### Find K largest

Usually:

```text
min heap of size K
```

Why?

Because the root is the **smallest among the current K largest candidates**, so it is the first candidate we can throw away.

---

### Find K smallest

Usually:

```text
max heap of size K
```

Why?

Because the root is the **largest among the current K smallest candidates**, so it is the easiest one to discard.

This "opposite heap" pattern is extremely useful.

---

# 51. Heapify Direction — A Mental Framework

Instead of blindly memorizing:

```text
insert = sift up
delete = sift down
```

think about **where the violation exists**.

### If the value may be too powerful relative to its parent:

```text
move upward
```

### If the value may be too powerful relative to its children:

```text
move downward
```

So:

```text
             Violation
                 |
        +--------+--------+
        |                 |
    Parent issue      Child issue
        |                 |
    Sift Up          Sift Down
```

This is much easier to generalize.

---

# 52. Recursive vs Iterative Heapify

Heapify can be implemented recursively:

```python
def heapify(arr, n, i):
    largest = i

    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
```

Or iteratively:

```python
def heapify(arr, n, i):
    while True:
        largest = i

        left = 2 * i + 1
        right = 2 * i + 2

        if left < n and arr[left] > arr[largest]:
            largest = left

        if right < n and arr[right] > arr[largest]:
            largest = right

        if largest == i:
            break

        arr[i], arr[largest] = arr[largest], arr[i]
        i = largest
```

The iterative version avoids recursion overhead and can be preferable in production code.

---

# 53. Common Heap Mistakes

### Mistake 1 — Thinking a heap is sorted

Incorrect:

```text
[50, 40, 45, 10, 20, 30]
```

does not need to be:

```text
[50,45,40,30,20,10]
```

Only heap order is required.

---

### Mistake 2 — Forgetting completeness

Heap structure is not just:

```text
parent >= child
```

It must also be:

```text
complete binary tree
```

---

### Mistake 3 — Choosing the wrong child during sift down

For max heap:

```text
choose larger child
```

For min heap:

```text
choose smaller child
```

---

### Mistake 4 — Heapifying leaf nodes unnecessarily

Leaves cannot violate their children's relationship because:

```text
they have no children
```

So bottom-up build heap starts at:

```python
n // 2 - 1
```

---

### Mistake 5 — Thinking build heap is O(n log n)

Bottom-up build heap is:

```text
O(n)
```

This is a classic interview question.

---

### Mistake 6 — Searching like binary search

A heap is not globally sorted.

Arbitrary search:

```text
O(n)
```

---

### Mistake 7 — Forgetting the heap size in heap sort

After placing the root at the end:

```text
sorted portion grows
heap portion shrinks
```

Therefore heapify should operate only on the remaining heap.

---

# 54. Complexity Cheat Sheet

|Operation|Time|
|---|--:|
|Peek min/max|`O(1)`|
|Insert|`O(log n)`|
|Extract min/max|`O(log n)`|
|Sift up|`O(log n)`|
|Sift down|`O(log n)`|
|Delete root|`O(log n)`|
|Delete arbitrary value*|`O(n)` to find + `O(log n)` repair|
|Search arbitrary value|`O(n)`|
|Build heap|**`O(n)`**|
|Heap Sort|`O(n log n)`|

*If the element's index is already known, deletion can be `O(log n)`.

---

# 55. The Most Important Complexity Insight

There are three different questions:

### "Give me min/max."

```text
O(1)
```

Because it's always the root.

### "Add something."

```text
O(log n)
```

Because it may travel from leaf to root.

### "Remove min/max."

```text
O(log n)
```

Because the replacement may travel from root to leaf.

This single framework explains most heap complexity.

---

# 56. Heap vs Other Data Structures

|Requirement|Suitable Structure|
|---|---|
|Fast arbitrary lookup|Hash Table|
|Ordered search|BST / Balanced BST|
|Min/max repeatedly|Heap|
|FIFO|Queue|
|LIFO|Stack|
|Fast insertion/removal at ends|Deque|
|Full sorting|Sorting algorithm|

The heap occupies a very specific niche:

> **Maintain a dynamically changing collection while efficiently exposing the highest-priority element.**

---

# 57. A Heap Is Not Just "A Tree"

The deeper idea is that a heap provides a **partial ordering**.

Consider:

```text
          100
        /     \
       50      70
      / \     / \
    20  40   30 60
```

We know:

```text
100 > 50
100 > 70
50 > 20
50 > 40
70 > 30
70 > 60
```

But do we know:

```text
50 > 70
```

No.

And do we know:

```text
20 > 30
```

No.

So a heap is **partially ordered**, not fully sorted.

This is precisely why:

```text
peek max/min → very fast
```

while:

```text
arbitrary search → not especially fast
```

---

# 58. The Central Mental Model

Try to think about a heap as:

```text
                    HEAP
                      |
            "Keep the best item
               at the top"
                      |
             +--------+--------+
             |                 |
          Structure          Ordering
             |                 |
        Complete tree      Parent-child
             |                 |
          Array          Min / Max property
```

Then operations become natural:

```text
INSERT
   ↓
place at next available position
   ↓
sift up


EXTRACT ROOT
   ↓
move last element to root
   ↓
sift down


BUILD HEAP
   ↓
start from last non-leaf
   ↓
sift down toward root


HEAP SORT
   ↓
build heap
   ↓
move root to sorted region
   ↓
sift down
   ↓
repeat
```

---

# 59. Complete Binary Tree vs Full vs Perfect

These terms are often confused in interviews.

### Full Binary Tree

Every node has either:

```text
0 children
```

or:

```text
2 children
```

Never exactly one child.

---

### Complete Binary Tree

All levels are full except possibly the last, and the last is filled left-to-right.

This is the structural requirement of a binary heap.

---

### Perfect Binary Tree

Every internal node has exactly two children and all leaves are at the same level.

Example:

```text
          1
       /     \
      2       3
     / \     / \
    4   5   6   7
```

Every perfect binary tree is complete, but not every complete binary tree is perfect.

---

# 60. One Fully Worked Example

Let's construct a max heap by inserting:

```text
10, 4, 15, 20, 0, 8
```

### Insert 10

```text
[10]
```

### Insert 4

```text
[10, 4]
```

### Insert 15

Before repair:

```text
[10, 4, 15]
```

Since:

```text
15 > 10
```

swap:

```text
[15, 4, 10]
```

### Insert 20

Before:

```text
[15, 4, 10, 20]
```

Compare with parent:

```text
20 > 4
```

swap:

```text
[15, 20, 10, 4]
```

Now:

```text
20 > 15
```

swap:

```text
[20, 15, 10, 4]
```

### Insert 0

```text
[20, 15, 10, 4, 0]
```

Already valid.

### Insert 8

```text
[20, 15, 10, 4, 0, 8]
```

Parent:

```text
10
```

Since:

```text
10 > 8
```

stop.

Final:

```text
[20, 15, 10, 4, 0, 8]
```

Tree:

```text
             20
          /      \
        15        10
       /  \      /
      4    0    8
```

---

# 61. Extraction From That Heap

Starting:

```text
[20, 15, 10, 4, 0, 8]
```

Extract `20`.

Move last element:

```text
[8, 15, 10, 4, 0]
```

Compare:

```text
8 vs 15 vs 10
```

Largest child:

```text
15
```

Swap:

```text
[15, 8, 10, 4, 0]
```

Now `8` has children:

```text
4, 0
```

Since:

```text
8 >= 4
8 >= 0
```

stop.

Final:

```text
[15, 8, 10, 4, 0]
```

---

# 62. Interview-Level Questions You Should Be Able to Answer

### Q: What is a heap?

A complete binary tree satisfying the heap-order property.

### Q: Why can a heap be stored in an array?

Because the tree is complete, so parent-child relationships can be derived from indices without pointers.

### Q: What is the root of a max heap?

The maximum element.

### Q: What is the root of a min heap?

The minimum element.

### Q: Why is peek O(1)?

Because the target element is always at index `0`.

### Q: Why is insertion O(log n)?

The new element is placed at the end and may move up at most one tree height.

### Q: Why is extraction O(log n)?

The last element replaces the root and may move down at most one tree height.

### Q: Why is build heap O(n)?

Bottom-up heap construction does not perform `O(log n)` work for every node; most nodes are close to the leaves.

### Q: Is a heap sorted?

No. It is only partially ordered.

### Q: Can we binary-search a heap?

No, not in general.

### Q: Is heap sort stable?

No.

### Q: Is heap sort in-place?

Yes, standard array-based heap sort uses `O(1)` auxiliary space.

---

# 63. The Most Important Formulas

For **0-based indexing**:

```text
parent(i) = (i - 1) // 2

left(i)   = 2i + 1

right(i)  = 2i + 2
```

For build heap:

```text
last non-leaf = n // 2 - 1
```

Tree height:

```text
O(log n)
```

Heap operations:

```text
peek      O(1)
insert    O(log n)
extract   O(log n)
build     O(n)
sort      O(n log n)
```

---

# 64. Final Mental Map

```text
                              HEAPS
                                |
              +-----------------+------------------+
              |                                    |
          STRUCTURE                            ORDERING
              |                                    |
     Complete Binary Tree                   Parent-child relation
              |                                    |
      Array representation                 +-------+-------+
              |                            |               |
       index formulas                   MIN HEAP        MAX HEAP
              |                            |               |
     +--------+--------+               min at root     max at root
     |        |        |
   parent    left     right
     |        |        |
 (i-1)//2   2i+1     2i+2


                         OPERATIONS
                              |
          +-------------------+-------------------+
          |                   |                   |
        INSERT            EXTRACT             PEEK
          |                   |                   |
       append            last → root          root
          |                   |
       sift up            sift down
          |
       O(log n)


                       BUILD HEAP
                           |
                 bottom-up heapify
                           |
                     O(n)


                         SORTING
                           |
                       Heap Sort
                           |
               +-----------+-----------+
               |                       |
          Build Heap             Repeatedly
             O(n)               extract root
                                        |
                                    O(n log n)


                     APPLICATIONS
                           |
        +------------------+------------------+
        |                  |                  |
  Priority Queue       Top-K Problems      Graphs
                                         /         \
                                    Dijkstra       Prim
```

---

# 65. Long-Term Learning Takeaway

The most useful way to remember heaps is **not** as a collection of formulas.

Remember this chain:

```text
Complete tree
      ↓
Can be represented compactly as an array
      ↓
Root can represent the highest priority
      ↓
But modifications can break the heap property
      ↓
Repair locally using sift-up / sift-down
      ↓
Height is O(log n)
      ↓
Insert / Extract become O(log n)
      ↓
Repeated root extraction enables Heap Sort
      ↓
Efficient priority handling enables Priority Queues,
Top-K algorithms, Dijkstra, Prim, scheduling, etc.
```

The deepest idea is:

> **A heap sacrifices full ordering in exchange for extremely efficient access to one extreme element—the minimum or maximum.**

That trade-off is what makes heaps so useful.

---

## 🧠 One-Line Revision

> **Heap = Complete Binary Tree + Heap Order; array-backed, root gives min/max in O(1), insertion/extraction use sift-up/down in O(log n), bottom-up build is O(n), and repeated extraction gives Heap Sort in O(n log n).**