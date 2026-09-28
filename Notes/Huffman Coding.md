
🔗 Links
+ [__lt__ dunder and cmp_to_key (tricks)](../Templates/__lt__%20dunder%20and%20cmp_to_key%20(tricks).md)

# Huffman Coding

**Tags:** #Greedy #Heap #PriorityQueue #BinaryTree #Encoding #Compression #PrefixCode #Interview-Pattern #FAANG

## Problem Statement

Given a set of characters and their frequencies, construct an **optimal binary prefix code** such that the **total encoded length is minimized**.

**Example**

| Character | Frequency |
| --------- | --------: |
| A         |         5 |
| B         |         9 |
| C         |        12 |
| D         |        13 |
| E         |        16 |
| F         |        45 |

One optimal Huffman encoding:

| Character | Code   |
| --------- | ------ |
| F         | `0`    |
| C         | `100`  |
| D         | `101`  |
| A         | `1100` |
| B         | `1101` |
| E         | `111`  |

> The exact bit patterns may differ, but the **total cost** is always minimal.

---

## Core Insight

Characters with **higher frequency should receive shorter codes**.

Huffman Coding is a classic **Greedy + Min Heap** problem:

1. Repeatedly take the **two least frequent** nodes.
2. Merge them into a new node.
3. Insert the merged node back.
4. Continue until only one node remains.

The final binary tree is the **Huffman Tree**.

---

## Prefix Code Property

A Huffman code is a **prefix code**:

* No code is the prefix of another.
* Decoding is therefore unambiguous.

Example:

| Character | Code  |
| --------- | ----- |
| A         | `0`   |
| B         | `10`  |
| C         | `110` |
| D         | `111` |

Valid:

* `0` is **not** the prefix of `10`.
* `10` is **not** the prefix of `110`.

This allows decoding by simply traversing the tree.

---

## Why Greedy Works

Suppose the two least frequent characters are `x` and `y`.

In every optimal prefix tree:

* They must appear at the **deepest level**.
* They must be **siblings**.

If they were not siblings, exchanging them with deeper nodes can only reduce the total weighted path length.

Therefore, merging the two smallest frequencies is always a safe greedy choice.

This is the **Greedy Choice Property**.

---

# Huffman Tree Construction

## Step 1 — Create Leaf Nodes

```
5(A)  9(B)  12(C)  13(D)  16(E)  45(F)
```

Store them in a **min heap**.

---

## Step 2 — Merge Two Smallest

Pop:

```
5(A), 9(B)
```

Merge:

```
     14
    /  \
   A    B
```

Push `14` back.

Heap becomes:

```
12 13 14 16 45
```

---

## Step 3 — Continue

Pop:

```
12(C), 13(D)
```

Merge:

```
      25
     /  \
    C    D
```

Heap:

```
14 16 25 45
```

Continue until one node remains.

Final tree:

```text
                (100)
               /     \
           F(45)     (55)
                    /     \
                 (25)     (30)
                /   \     /   \
             C12   D13  (14)  E16
                        /  \
                      A5    B9
```

---

## Code Generation

Assign:

* Left edge = `0`
* Right edge = `1`

Traverse from root.

| Character | Path                         | Code   |
| --------- | ---------------------------- | ------ |
| F         | Left                         | `0`    |
| C         | Right → Left → Left          | `100`  |
| D         | Right → Left → Right         | `101`  |
| E         | Right → Right → Right        | `111`  |
| A         | Right → Right → Left → Left  | `1100` |
| B         | Right → Right → Left → Right | `1101` |

Only the tree structure matters—not the exact left/right assignment.

---

# Algorithm

1. Insert all frequencies into a **min heap**.
2. While heap size > 1:

   * Extract two minimum nodes.
   * Create a parent with combined frequency.
   * Push parent back.
3. DFS from root to generate binary codes.

---

## Python Implementation

```python
import heapq

class Node:
    def __init__(self, freq, ch=None, left=None, right=None):
        self.freq = freq
        self.ch = ch
        self.left = left
        self.right = right

    def __lt__(self, other):
        return self.freq < other.freq


def huffmanCoding(chars, freq):

    heap = []

    for c, f in zip(chars, freq):
        heapq.heappush(heap, Node(f, c))

    while len(heap) > 1:

        left = heapq.heappop(heap)
        right = heapq.heappop(heap)

        parent = Node(
            left.freq + right.freq,
            left=left,
            right=right
        )

        heapq.heappush(heap, parent)

    root = heap[0] # only one element remains in the heap
    codes = {}

    def dfs(node, path):

        if node.ch is not None:
            codes[node.ch] = path
            return

        dfs(node.left, path + "0")
        dfs(node.right, path + "1")

    dfs(root, "")
    return codes
```

---

## Dry Run

### Input

| Char | Freq |
| ---- | ---: |
| A    |    5 |
| B    |    9 |
| C    |   12 |
| D    |   13 |

### Heap Evolution

```
5 9 12 13
```

Merge:

```
5 + 9 = 14

Heap:
12 13 14
```

Merge:

```
12 + 13 = 25

Heap:
14 25
```

Merge:

```
14 + 25 = 39
```

Root obtained.

Generated codes:

| Char | Code |
| ---- | ---- |
| A    | 00   |
| B    | 01   |
| C    | 10   |
| D    | 11   |

---

## Complexity

Let `n` be the number of distinct characters.

| Metric              |             Value |
| ------------------- | ----------------: |
| Building Heap       |            $O(n)$ |
| Heap Operations     |     $O(n \log n)$ |
| DFS Code Generation |            $O(n)$ |
| Total Time          | **$O(n \log n)$** |
| Auxiliary Space     |        **$O(n)$** |

---

## Why Is Huffman Optimal?

The total encoding cost is:

$$
\\sum (\\text{frequency} \\times \\text{code length})
$$

Every merge increases the depth of all leaves in that merged subtree by **1**.

By always merging the **smallest frequencies**, we ensure that the smallest frequencies receive the greatest depth, minimizing the weighted sum.

This is the greedy proof.

---

## Common Mistakes

### 1. Using a Max Heap

Huffman always requires the **two smallest** frequencies.

Use a **min heap**.

### 2. Forgetting the Prefix Property

The goal is **not** merely assigning short binary strings.

Codes must satisfy:

* Unique
* Prefix-free

The binary tree guarantees this automatically.

### 3. Assuming Codes Are Unique

Different merge orders (for equal frequencies) produce different codes.

Example:

```
A : 00
B : 01
```

or

```
A : 01
B : 00
```

Both are equally optimal.

---

## Relationship to Other Greedy Problems

| Problem             | Greedy Choice            |
| ------------------- | ------------------------ |
| Fractional Knapsack | Highest value/weight     |
| Huffman Coding      | Two minimum frequencies  |
| Job Sequencing      | Highest profit first     |
| Gas Station         | Skip impossible prefixes |

Unlike Fractional Knapsack (sorting once), Huffman repeatedly requires the **current minimum**, making a **priority queue** essential.

---

## Key Takeaways

* Huffman Coding constructs an **optimal prefix code** for lossless compression.
* The greedy strategy is: **merge the two least frequent nodes** repeatedly.
* A **min heap** provides efficient extraction of the two minimum frequencies.
* The final Huffman tree generates binary codes by assigning `0` to left edges and `1` to right edges.
* Time complexity is **$O(n \log n)$**, dominated by heap operations.
