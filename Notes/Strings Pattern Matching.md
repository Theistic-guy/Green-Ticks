
| Algorithm                                    | Best Case Time | Average Case Time | Worst Case Time                                | Space Complexity |
| -------------------------------------------- | -------------- | ----------------- | ---------------------------------------------- | ---------------- |
| **Naive Pattern Searching**                  | O(n)           | O(n)              | $(O(m \times (n - m + 1))$ or $(O(n \cdot m))$ | O(1)             |
| **Naive Searching (Distinct Pattern Chars)** | O(n)           | O(n)              | O(n)                                           | O(1)             |
| **Rabin-Karp**                               | O(n + m)       | O(n + m)          | (O(n * m))                                     | O(1)             |
| **Knuth-Morris-Pratt (KMP)**                 | O(n)           | O(n + m)          | O(n + m)                                       | O(m)             |

---


### 1. Naive pattern matching (general + distinct case)

🔗 [Naive Pattern Searching (General + Distinct Characters Optimization)](Extras/Naive%20Pattern%20Searching%20(General%20+%20Distinct%20Characters%20Optimization).md)


### 2. Rabin Karp algorithm

🔗 [Rabin Karp algo](Extras/Rabin%20Karp%20algo.md)


### 3. Knuth-Morris-Pratt (KMP) algorithm

🔗 [KMP algorithm](Extras/KMP%20algorithm.md)
