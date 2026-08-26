---
Title: Find peak in mountain array
Companies:
  - Not Specified
Topics:
  - Arrays
  - Searching
Platform:
  - Miscellaneous
Difficulty: Medium
Other Tags:
  - Binary Search
Link:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Find a Peak in a Mountain Array

**Pattern:** Binary Search

**Idea:** 

**Variations** : Derived from [find-peak-element](find-peak-element.md)

[Important Variation : Find in Mountain Array](#Important%20Variation%20Find%20in%20Mountain%20Array)


---

## 💻 Code

```Python
def find_peak(arr):

    low = 0
    high = len(arr) - 1

	# there would be atleast 2 elements
    while low < high:

        mid = (low + high) // 2
        
		# arr[mid+1] would never give out of bounds exception
        if arr[mid] < arr[mid + 1]: 
        
            low = mid + 1
        else:
            high = mid # search in the left 

    return low

```
**Time complexity** - O(log n) 
**Aux. Space complexity** -  O(1)

---


A **Mountain Array** looks like:

```text
[1, 3, 5, 7, 6, 4, 2]
```

There is exactly one peak.

The same Binary Search works:

```python
if arr[mid] < arr[mid + 1]:
    low = mid + 1
else:
    high = mid
```

This is essentially the same algorithm, but the problem guarantees a mountain structure.

### Complexity

- **Time:** **$O(\log n)$**
    
- **Auxiliary Space:** **$O(1)$**
    

---

# Important Variation : Find in Mountain Array

This is a more realistic interview follow-up.

Given:

```text
[1, 3, 5, 7, 6, 4, 2]
```

and target:

```text
6
```

find its index.

### Approach

First find the peak.

Then the array becomes two sorted arrays:

```text
Ascending:

[1, 3, 5, 7]

Descending:

[7, 6, 4, 2]
```

Perform Binary Search on both sides.

Overall:

$$  
O(\log n)  
$$

This is **LeetCode 1095 — Find in Mountain Array**.

---