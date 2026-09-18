
Here's a practical breakdown of Linked List patterns actually asked in FAANG interviews, grouped by technique:

## 1. Fast & Slow Pointers (Floyd's Cycle)

Core pattern — detecting cycles, finding midpoints.

- **141. Linked List Cycle** — basic detection
- **142. Linked List Cycle II** — find the start of the cycle
- **876. Middle of the Linked List** — classic warmup, often used as a subroutine
- **234. Palindrome Linked List** — find middle + reverse second half + compare

## 2. Reversal

Manipulating pointers in place — extremely common, tests pointer discipline.

- **206. Reverse Linked List** — the foundational one, know it cold (iterative + recursive)
- **92. Reverse Linked List II** — reverse a sub-range (m to n)
- **25. Reverse Nodes in k-Group** — hard, but asked a lot at Google/Meta — combines reversal + recursion/iteration in chunks
- **24. Swap Nodes in Pairs** — special case of k-group with k=2

## 3. Merge / Two-Pointer Traversal

- **21. Merge Two Sorted Lists** — extremely common, also a building block for merge sort on lists
- **23. Merge k Sorted Lists** — heap-based or divide & conquer, very frequently asked at Amazon/Google
- **148. Sort List** — merge sort on linked list, O(n log n) with O(1) space expected

## 4. Dummy Node / Removal Patterns

- **19. Remove Nth Node From End of List** — two-pointer with gap, classic
- **83. Remove Duplicates from Sorted List** — easy warmup
- **82. Remove Duplicates from Sorted List II** — remove _all_ nodes with duplicates, needs dummy node
- **203. Remove Linked List Elements** — basic dummy-node deletion

## 5. Intersection / Structural Comparison

- **160. Intersection of Two Linked Lists** — two-pointer switch-trick, very common, tests clean thinking over brute force
- **2130. Maximum Twin Sum of a Linked List** — combo of middle-finding + reversal, been showing up more recently (Meta/Amazon)

## 6. Arithmetic on Lists (simulate math with nodes)

- **2. Add Two Numbers** — digit-by-digit addition with carry, very frequently asked
- **445. Add Two Numbers II** — same but numbers are in forward order, forces you to use a stack or reverse first

## 7. Copy / Deep Clone with Extra Pointers

- **138. Copy List with Random Pointer** — hashmap or interweaving trick, asked a lot at Amazon/Meta, tests handling of non-trivial pointer structures

## 8. Design (Linked List as building block)

- **146. LRU Cache** — doubly linked list + hashmap, this is asked _constantly_ (probably top-3 most asked linked-list-adjacent question overall)
- **707. Design Linked List** — less common now, but occasionally used to check fundamentals

---

**If you only have time for a subset**, prioritize in this order: 206, 21, 141/142, 19, 2, 23, 138, 146, 25, 92. These cover every core pattern and show up across Google/Meta/Amazon rotations repeatedly, whereas things like 707 or niche variations rarely appear anymore.

Want me to pull a similar breakdown for another topic (Trees, Sliding Window, etc.) or turn this into a study tracker?