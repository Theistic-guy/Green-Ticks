<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# PKM Note: Array Duplicate Detection via Expected Arithmetic Sum

- **Topic:** Algorithms & Data Structures / Array Searching
    
      
    
- **Tags:** `#dsa` `#algorithms` `#arrays` `#math` `#problem-solving`
    
      
    
- **Related Notes:** `[[Floyd-Cycle-Detection]]`, `[[XOR-Duplicate-Detection]]`, `[[Prefix-Sums]]`
    
      
    

## 1. Problem Definition

Given an array $A$ of size $L$ containing:

  

1. Every integer in the continuous range $[0, M]$ **at least once** (where $M = \max(A)$).
    
      
    
2. Exactly **one** repeating integer $R$ that appears $k + 1$ times ($k \ge 1$ extra occurrences).
    
      
    

Find the value of the repeating element $R$ in $\mathcal{O}(N)$ time and $\mathcal{O}(1)$ auxiliary space.

  

## 2. Core Mathematical Intuition

The sum of an arithmetic series from $0$ to $M$ is deterministic:

  

$$S_{\text{expected}} = \sum_{i=0}^{M} i = \frac{M(M+1)}{2}$$

Because every integer from $0$ to $M$ is guaranteed to appear exactly once, plus $k$ surplus copies of $R$, the actual sum of array elements is:

  

$$S_{\text{actual}} = S_{\text{expected}} + (k \cdot R)$$

Isolating the repeating value $R$:

  

$$R = \frac{S_{\text{actual}} - S_{\text{expected}}}{k}$$

Where:

  

- $M = \max(A)$
    
      
    
- $k = L - (M + 1)$ (total elements minus unique element count)
    
      
    

## 3. Algorithm & Complexity

### Steps

1. Traverse array once to compute:
    
      
    - $S_{\text{actual}} = \sum A[i]$
        
          
        
    - $M = \max(A)$
        
          
        
2. Compute $S_{\text{expected}} = \frac{M(M+1)}{2}$.
    
      
    
3. Compute $k = \text{length}(A) - (M + 1)$.
    
      
    
4. Return $\frac{S_{\text{actual}} - S_{\text{expected}}}{k}$.
    
      
    

### Complexity

- **Time Complexity:** $\mathcal{O}(N)$ — single pass over the array.
    
      
    
- **Space Complexity:** $\mathcal{O}(1)$ — constant auxiliary memory.
    
      
    

## 4. Implementation

### Python

Python

```
def find_repeating_element(arr: list[int]) -> int:
    """Finds the single repeating element in an array containing [0..max(arr)].

    Constraints: All elements in [0..max(arr)] present, exactly one element
    repeats.
    """
    n = len(arr)
    max_val = 0
    actual_sum = 0

    for x in arr:
        actual_sum += x
        if x > max_val:
            max_val = x

    expected_sum = (max_val * (max_val + 1)) // 2
    extra_count = n - (max_val + 1)

    if extra_count <= 0:
        raise ValueError("No duplicate elements found in array.")

    return (actual_sum - expected_sum) // extra_count
```

### C++ (Overflow-Safe)

C++

```
#include <vector>
#include <numeric>
#include <algorithm>
#include <stdexcept>

long long findRepeatingElement(const std::vector<int>& arr) {
    long long actual_sum = 0;
    long long max_val = 0;

    for (int x : arr) {
        actual_sum += x;
        if (x > max_val) {
            max_val = x;
        }
    }

    long long expected_sum = (max_val * (max_val + 1)) / 2;
    long long extra_count = static_cast<long long>(arr.size()) - (max_val + 1);

    if (extra_count <= 0) {
        throw std::invalid_argument("No duplicate elements found.");
    }

    return (actual_sum - expected_sum) / extra_count;
}
```

## 5. Edge Cases & Boundary Conditions

|**Scenario**|**Input Example**|**Expected Behavior**|**Formula Handling**|
|---|---|---|---|
|**Repeating Zero**|`[0, 0, 1, 2]`|$R = 0$|$S_{\text{actual}} - S_{\text{expected}} = 0 \implies \frac{0}{1} = 0$ _(Correct)_|
|**Large Extra Count**|`[0, 1, 2, 2, 2, 2]`|$R = 2, k = 3$|$\frac{10 - 3}{3} = \frac{7}{3}$ (if $M=2$, $S_{\text{exp}}=3, S_{\text{act}}=9 \implies \frac{6}{3} = 2$) _(Correct)_|
|**Integer Overflow**|$N \ge 10^5$|Sum exceeds $2^{31}-1$|Mitigate using 64-bit integer types (`long long`, `int64_t`).|

## 6. Precondition Checklist & Failure Modes

This approach **only** holds when the strict invariant is respected:

  

```
[Is every integer in 0..max(arr) present?] ──No──> FAILS (Gaps invalidate S_expected)
                    │
                   Yes
                    ▼
[Is only ONE distinct value duplicated?]  ──No──> FAILS (Returns weighted average of duplicates)
                    │
                   Yes
                    ▼
          [Math Approach Valid]
```

### Alternative Techniques for Relaxed Constraints:

- **Missing numbers / Gaps present:** Use Hash Set ($\mathcal{O}(N)$ space) or Floyd’s Cycle Detection / Index Negation ($\mathcal{O}(1)$ space, if array can be mutated and range is $[1..N]$).
    
      
    
- **Multiple distinct duplicates:** Use Frequency Map / Hash Table or Boolean Bitset.