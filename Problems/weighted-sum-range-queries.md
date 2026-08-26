---
Title: Weighted Sum range queries
Companies:
  - Not Specified
Topics:
  - Arrays
  - Prefix Sum
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Weighted Sum Range Queries Using Prefix Sum (DSA Interview Notes)

**Pattern:** Prefix sum

**Idea:** 

---

## 💻 Code

```Python
def build_prefix(arr):

    n = len(arr)

    prefix = [0] * n
    weighted = [0] * n

    prefix[0] = arr[0]
    weighted[0] = arr[0]

    for i in range(1, n):

        prefix[i] = prefix[i-1] + arr[i]

        weighted[i] = weighted[i-1] + arr[i] * (i + 1)

    return prefix, weighted

def range_weighted_sum(prefix, weighted, L, R):

    if L == 0:

        total = prefix[R]

        weight = weighted[R]

    else:

        total = prefix[R] - prefix[L-1]

        weight = weighted[R] - weighted[L-1]

    return weight - L * total


```
**Time complexity** - O(n) 
**Aux. Space complexity** -  O(n)


---

# Problem Statement

Given an array, answer queries of the form

$$  
L,;R  
$$

such that you compute

$$  
\boxed{  
arr[L]\times1  
+  
arr[L+1]\times2  
+  
arr[L+2]\times3  
+\cdots+  
arr[R]\times(R-L+1)  
}  
$$

---

# Example

```text
Array

[3, 2, 5, 1, 4]
```

Query

```text
L = 1

R = 3
```

Required Answer

```text
2×1

+

5×2

+

1×3

=

15
```

Notice that the weights start from **1**, not from the actual array indices.

---

# Brute Force

For every query,

iterate through the range.

```python
def weighted_sum(arr, L, R):

    ans = 0

    weight = 1

    for i in range(L, R + 1):

        ans += arr[i] * weight

        weight += 1

    return ans
```

---

## Complexity

For each query,

- **Time Complexity:** **$O(R-L+1)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

This becomes slow when many queries are asked.

---

# Key Observation

Expand the required expression.

$$  
arr[L]\times1  
+  
arr[L+1]\times2  
+\cdots  
$$

Now rewrite each weight.

For index `i`,

Weight

$$  
(i-L+1)  
$$

Therefore,

$$  
\boxed{  
\sum arr[i](https://chatgpt.com/c/i-L+1)  
}  
$$

Expanding,

 $$
 \sum arr[i](https://chatgpt.com/c/i+1)

L\sum arr[i]  
$$

This is the key transformation.

Now the weighted sum can be answered using **two prefix arrays**.

---

# Prefix Arrays Needed

## Prefix Sum

# $$  
P[i]

\sum_{0}^{i}arr[i]  
$$

---

## Weighted Prefix Sum

Store

# $$  
\boxed{  
WP[i]

\sum_{0}^{i}arr[i]\times(i+1)  
}  
$$

Notice the use of

```text
(i+1)
```

because the array uses 0-based indexing while the weights are 1-based.

---

# Preprocessing

```python
def build_prefix(arr):

    n = len(arr)

    prefix = [0] * n
    weighted = [0] * n

    prefix[0] = arr[0]
    weighted[0] = arr[0]

    for i in range(1, n):

        prefix[i] = prefix[i-1] + arr[i]

        weighted[i] = weighted[i-1] + arr[i] * (i + 1)

    return prefix, weighted
```

---

# Answering a Query

First compute

Normal Sum

# $$  
S

\sum arr[i]  
$$

Then compute

Weighted Prefix Sum

# $$  
W

\sum arr[i](https://chatgpt.com/c/i+1)  
$$

Finally,

$$  
\boxed{  
Answer=W-L\times S  
}  
$$

---

# Python Code

```python
def range_weighted_sum(prefix, weighted, L, R):

    if L == 0:

        total = prefix[R]

        weight = weighted[R]

    else:

        total = prefix[R] - prefix[L-1]

        weight = weighted[R] - weighted[L-1]

    return weight - L * total
```

---

# Dry Run

```text
Array

[3,2,5,1,4]
```

Prefix Sum

|Index|Prefix|
|--:|--:|
|0|3|
|1|5|
|2|10|
|3|11|
|4|15|

Weighted Prefix

|Index|Value|
|--:|--:|
|0|3|
|1|7|
|2|22|
|3|26|
|4|46|

---

Query

```text
L = 1

R = 3
```

Normal Sum

```text
11-3

=

8
```

Weighted Sum Prefix

```text
26-3

=

23
```

Answer

```text
23

-

1×8

=

15
```

Correct.

---

# Why Does This Formula Work?

The original weights are

```text
1

2

3

...
```

Instead,

the weighted prefix stores

```text
(i+1)
```

as the multiplier.

Every element in the range is therefore multiplied **L extra times**.

Subtracting

$$  
L\times(\text{Normal Range Sum})  
$$

removes those extra weights, leaving

```text
1

2

3

...
```

exactly as required.

---

# Complexity

### Preprocessing

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

### Per Query

- **Time Complexity:** **$O(1)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# Common Interview Variations

### Variation 1

Weights start from

```text
0
```

instead of

```text
1
```

Simply use

$$  
arr[i]\times(i-L)  
$$

The derivation is almost identical.

---

### Variation 2

Many weighted range queries.

The goal is always to preprocess once and answer each query in **$O(1)$**.

---

### Variation 3

2D Weighted Prefix Sums

The same idea extends to matrices, where rows and columns have different weights.

This is more common in competitive programming than interviews.

---

# Pattern Recognition

Whenever a query contains

```text
1×

2×

3×

4×
```

or

```text
position × value
```

think

> **Weighted Prefix Sum**

instead of a normal prefix sum.

---

# Key Takeaways

Build two prefix arrays:

```text
1. Prefix Sum

2. Weighted Prefix Sum
```

where

# $$  
WP[i]

\sum arr[i]\times(i+1)  
$$

For every query,

```text
Normal Range Sum

↓

Weighted Range Sum

↓

Subtract L × Normal Sum
```

Formula

# $$  
\boxed{  
Answer

## WeightedRange

L\times NormalRange  
}  
$$

|Step|Complexity|
|---|---|
|Preprocessing|**$O(n)$**|
|Each Query|**$O(1)$**|

> **Interview Tip:** The trick is to rewrite the weight `(i - L + 1)` as `(i + 1) - L`. Once you separate the variable part from the constant `L`, the problem becomes a simple combination of **two prefix sums**, allowing every query to be answered in constant time.