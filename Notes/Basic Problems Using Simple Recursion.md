<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
This note covers some of the most common introductory recursion problems asked in coding interviews.

---

# 1. Sum of First N Natural Numbers

## Problem

Find

$$  
1+2+3+\cdots+n  
$$

using recursion.

### Recurrence Relation

$$  
S(n)=n+S(n-1)  
$$

Base case:

$$  
S(0)=0  
$$

### Python Code

```python
def natural_sum(n):
    if n == 0:
        return 0

    return n + natural_sum(n - 1)
```

### Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 2. Palindrome Check

## Problem

Determine whether a string is a palindrome.

### Recurrence Relation

- The code calls itself while incrementing the `left` index and decrementing the `right` index. This shrinks the processed string length by exactly 2 characters (1 from each end), represented as $T(n - 2)$.

Combining these operations gives the recurrence relation:  
$$T(n)=T(n-2)+\mathcal{O}(1)$$

### Python Code

```python
def is_palindrome(s, left, right):

    if left >= right:
        return True

    if s[left] != s[right]:
        return False

    return is_palindrome(s, left + 1, right - 1)
```

### Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 3. Sum of Digits

## Problem

Find the sum of all digits of a number.

Example

```text
1234

↓

1 + 2 + 3 + 4 = 10
```

### Recurrence Relation

gives the recurrence relation:  
$$T(n)=T\left(\left\lfloor \frac{n}{10}\right\rfloor \right)+\mathcal{O}(1)$$

### Python Code

```python
def sum_of_digits(n):

    if n == 0:
        return 0

    return n % 10 + sum_of_digits(n // 10)
```

### Complexity

- **Time Complexity:** **$O(d)$**
    
- **Auxiliary Space Complexity:** **$O(d)$**
    

where `d` is the number of digits.

---

# 4. Rope Cutting Problem

<i><u>check out DP solution</u></i> : [rope-cutting-with-dp](../Problems/rope-cutting-with-dp.md)
## Problem

Given a rope of length `n` and three possible cut lengths `a`, `b`, and `c`, find the **maximum number of pieces** obtainable.

If the rope cannot be cut exactly, return `-1`.

### Recurrence Relation


$$(T(n)=T(n-a)+T(n-b)+T(n-c)+\mathcal{O}(1))$$
In the absolute worst-case scenario (where \(a = b = c = 1\)), the problem size decreases by exactly 1 at each level, and the function splits into 3 branches every time:

$$(T(n) = 3T(n - 1) + \mathcal{O}(1))$$
- This generates a ternary recursion tree with a maximum height of \(n\).
- The total number of operations grows exponentially by a factor of 3 at each depth level.

$$(T(n)=\mathcal{O}(3^{n}))$$
### Python Code

```python
def max_cuts(n, a, b, c):

    if n == 0:
        return 0

    if n < 0:
        return -1

    res = max(
        max_cuts(n - a, a, b, c),
        max_cuts(n - b, a, b, c),
        max_cuts(n - c, a, b, c)
    )

    if res == -1:
        return -1

    return res + 1
```

### Complexity

- **Time Complexity:** **$O(3^n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 5. Generating All Subsets

**See Also**:-
+ [power-set-using-bitwise](../Problems/power-set-using-bitwise.md)
+ [power-set-with-duplicates](../Problems/power-set-with-duplicates.md)

## Problem

Print all subsets of a string or array.

### Idea

For every element,

- Include it
    
- Exclude it
    

### Recurrence Relation

Each recursive call generates **two** more recursive calls.

$$  
T(n)=2T(n-1)+O(1)  
$$

### Python Code

```python
def subsets(s, curr="", i=0):

    if i == len(s):
        print(curr)
        return

    subsets(s, curr, i + 1)

    subsets(s, curr + s[i], i + 1)
```

### Complexity

- **Time Complexity:** **$O(n \times 2^n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 6. Subset Sum Problem

**See Also :-**
+ [subset-sum-using-dp](../Problems/subset-sum-using-dp.md)
+ [count-subsets-with-given-sum](../Problems/count-subsets-with-given-sum.md)
+ [equal-partition](../Problems/equal-partition.md)

## Problem

Count the number of subsets whose sum equals a given target.

### Recurrence Relation

For every element,

- Include it
    
- Exclude it
    

$$T(n) = 2T(n - 1) + \mathcal{O}(1)$$


### Python Code

```python
def subset_sum(arr, n, target):

    if n == 0:
        return 1 if target == 0 else 0

    return (
        subset_sum(arr, n - 1, target)
        +
        subset_sum(arr, n - 1, target - arr[n - 1])
    )
```

### Complexity

- **Time Complexity:** **$O(2^n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 7. Printing All Permutations

**See Also :-**
+ [permutations-2-handling-duplicates](../Problems/permutations-2-handling-duplicates.md)

## Problem

Generate every permutation of a string.

### Idea

Fix one character at the current position and recursively permute the remaining characters.

### Recurrence Relation

$$  
T(n)=n\cdot T(n-1)  
$$

which expands to

$$  
O(n!)  
$$

### Python Code

```python
def permutations(s, l=0):

    if l == len(s):
        print("".join(s))
        return

    for i in range(l, len(s)):

        s[l], s[i] = s[i], s[l]

        permutations(s, l + 1)

        s[l], s[i] = s[i], s[l]
```

Usage

```python
permutations(list("ABC"))
```

### Complexity

- **Time Complexity:** **$O(n \times n!)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

(The extra factor of `n` comes from printing/copying each permutation.)

---

# Complexity Summary

|Problem|Time Complexity|Auxiliary Space|
|---|---|---|
|Natural Sum|**$O(n)$**|**$O(n)$**|
|Palindrome Check|**$O(n)$**|**$O(n)$**|
|Sum of Digits|**$O(d)$**|**$O(d)$**|
|Rope Cutting|**$O(3^n)$**|**$O(n)$**|
|Generate Subsets|**$O(n \times 2^n)$**|**$O(n)$**|
|Subset Sum|**$O(2^n)$**|**$O(n)$**|
|Print Permutations|**$O(n \times n!)$**|**$O(n)$**|

---

# Common Recursion Patterns

|Pattern|Example Problems|
|---|---|
|Single Recursive Call|Natural Sum, Sum of Digits, Palindrome|
|Multiple Recursive Calls|Rope Cutting|
|Include / Exclude|Generate Subsets, Subset Sum|
|Backtracking|Print Permutations|

---

# Interview Tips

- Always identify the **base case** before writing recursive code.
    
- Write the **recurrence relation** first—it often makes the recursive solution obvious.
    
- If each call makes **one recursive call**, the recursion depth is usually linear.
    
- If each call branches into **two or more recursive calls**, expect exponential time complexity unless Dynamic Programming is used.
    
- Problems like **Subset Sum**, **Generate Subsets**, and **Rope Cutting** are often optimized later using DP, so understanding their recursive formulation is the first step.
    

> **Quick Rule of Thumb:**
> 
> - **One recursive call →** Usually linear complexity.
>     
> - **Two recursive calls →** Often exponential (`$2^n$`).
>     
> - **Three recursive calls →** Often `$3^n$`.
>     
> - **Permutations →** Usually involve factorial (`$n!$`) complexity.


# See Also
[Fibonacci Numbers](Fibonacci%20Numbers.md)