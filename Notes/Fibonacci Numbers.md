---
tags:
  - math
  - fibonacci
---

<h1 align='right'><a href="../README.md">⇐🏠</a></h1>
# Fibonacci Numbers (DSA Interview Notes)

## Definition

The Fibonacci sequence is defined as

$$  
F(0)=0,\qquad F(1)=1  
$$

For every subsequent term,

$$  
F(n)=F(n-1)+F(n-2)  
$$

for

$$  
n\ge2  
$$

The sequence begins as

```text
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
```

> **Note:** Some books define the sequence as `1, 1, 2, 3, ...`. In DSA and programming, the convention `F(0)=0, F(1)=1` is used most commonly.

---

# Approach 1: Naive Recursion

## Idea

Directly implement the recursive definition.

$$  
F(n)=F(n-1)+F(n-2)  
$$

---

## Recursion Tree

For

```text
F(5)
```

```text
                 F(5)
              /        \
          F(4)         F(3)
         /   \        /    \
      F(3) F(2)    F(2)   F(1)
      ...
```

Notice that

```text
F(3)
```

and

```text
F(2)
```

are computed multiple times.

This repeated computation makes recursion inefficient.

---

## Python Code

```python
def fib(n):
    if n <= 1:
        return n

    return fib(n - 1) + fib(n - 2)
```

---

## Complexity

- **Time Complexity:** **$O(2^n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$** (recursion stack)
    

---

# Approach 2: Dynamic Programming (Memoization)

## Idea

Store answers that have already been computed.

Whenever a Fibonacci number is needed again,

reuse it instead of recomputing it.

---

## Python Code

```python
def fib(n, dp):

    if n <= 1:
        return n

    if dp[n] != -1:
        return dp[n]

    dp[n] = fib(n - 1, dp) + fib(n - 2, dp)

    return dp[n]
```

Usage

```python
n = 10

dp = [-1] * (n + 1)

print(fib(n, dp))
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# Approach 3: Dynamic Programming (Tabulation)

## Idea

Instead of solving recursively,

build the answers from the bottom.

---

## Python Code

```python
def fib(n):

    if n <= 1:
        return n

    dp = [0] * (n + 1)

    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# Approach 4: Space Optimized DP (Best for Interviews)

Notice that

$$  
F(n)  
$$

depends only on

- $F(n-1)$
    
- $F(n-2)$
    

Therefore, we don't need the entire DP array.

Only the previous two values are required.

---

## Python Code

```python
def fib(n):

    if n <= 1:
        return n

    prev2 = 0
    prev1 = 1

    for _ in range(2, n + 1):

        curr = prev1 + prev2

        prev2 = prev1
        prev1 = curr

    return prev1
```

---

## Dry Run

Suppose

```text
n = 6
```

|prev2|prev1|curr|
|--:|--:|--:|
|0|1|1|
|1|1|2|
|1|2|3|
|2|3|5|
|3|5|8|

Answer

```text
8
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

This is the preferred solution in most coding interviews.

---

# Approach 5: Matrix Exponentiation (Advanced)

Using matrix exponentiation, the nth Fibonacci number can be computed in

$$  
O(\log n)  
$$

time.

This works by raising the Fibonacci transformation matrix to the power

$$  
n-1  
$$

using fast exponentiation.

This approach is mainly useful for very large values of `n`.

---

## Complexity

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(\log n)$**
    

---

# Approach 6: Fast Doubling (Competitive Programming)

Fast Doubling uses mathematical identities such as

$$  
F(2k)=F(k)\times\left(2F(k+1)-F(k)\right)  
$$

and

$$  
F(2k+1)=F(k+1)^2+F(k)^2  
$$

to compute Fibonacci numbers recursively.

In practice, it is often faster than matrix exponentiation.

---

## Complexity

- **Time Complexity:** **$O(\log n)$**
    
- **Auxiliary Space Complexity:** **$O(\log n)$**
    

---

# Comparison

|Method|Time Complexity|Auxiliary Space|Recommended?|
|---|---|---|---|
|Naive Recursion|**$O(2^n)$**|**$O(n)$**|❌|
|Memoization|**$O(n)$**|**$O(n)$**|✅|
|Tabulation|**$O(n)$**|**$O(n)$**|✅|
|Space Optimized DP|**$O(n)$**|**$O(1)$**|⭐ Best Interview Solution|
|Matrix Exponentiation|**$O(\log n)$**|**$O(\log n)$**|Advanced|
|Fast Doubling|**$O(\log n)$**|**$O(\log n)$**|Advanced / CP|

---

# Common Interview Variations

## 1. Print First `n` Fibonacci Numbers

```text
Input

7

Output

0 1 1 2 3 5 8
```

---

## 2. Find the nth Fibonacci Number

The most common interview question.

Use the **Space Optimized DP** solution unless asked otherwise.

---

## 3. Fibonacci Modulo

Sometimes the answer becomes extremely large.

Instead of

```python
curr = prev1 + prev2
```

compute

```python
curr = (prev1 + prev2) % MOD
```

where

```text
MOD = 10^9 + 7
```

This prevents integer overflow (especially in C++ and Java).

---

## 4. Climbing Stairs

One of the most famous disguised Fibonacci problems.

Recurrence:

```text
ways(n)

=

ways(n-1)

+

ways(n-2)
```

---

## 5. Tiling Problem

Another classic DP problem that reduces to Fibonacci.

---

# Common Interview Mistakes

## Mistake 1: Forgetting the Base Cases

Always handle

```python
if n <= 1:
    return n
```

---

## Mistake 2: Using Plain Recursion

Naive recursion has exponential complexity.

It almost always causes a TLE (Time Limit Exceeded).

---

## Mistake 3: Forgetting Space Optimization

Many candidates use an entire DP array even though only the previous two values are needed.

---

## Mistake 4: Confusing Indexing

Remember the standard programming convention

```text
F(0) = 0

F(1) = 1
```

Some textbooks start from

```text
1, 1, 2, ...
```

Always verify the problem statement.

---

# Related Interview Problems

Many DP problems are based on the Fibonacci recurrence:

- Climbing Stairs
    
- Min Cost Climbing Stairs
    
- Tiling Problem
    
- Count Binary Strings
    
- Tribonacci Numbers
    
- House Robber (similar state transition)
    

Recognizing the recurrence

```text
Current Answer

=

Previous Answer

+

Second Previous Answer
```

is an important DP skill.

---

# Key Takeaways

- Fibonacci recurrence:
    

$$  
F(n)=F(n-1)+F(n-2)  
$$

- The recursive solution has overlapping subproblems.
    
- Dynamic Programming removes repeated computations.
    
- The best interview solution is usually the **Space Optimized DP** approach.
    
- For extremely large `n`, use **Matrix Exponentiation** or **Fast Doubling**.
    

|Method|Time|Aux. Space|
|---|---|---|
|Naive Recursion|**$O(2^n)$**|**$O(n)$**|
|Memoization|**$O(n)$**|**$O(n)$**|
|Tabulation|**$O(n)$**|**$O(n)$**|
|Space Optimized DP|**$O(n)$**|**$O(1)$**|
|Matrix Exponentiation|**$O(\log n)$**|**$O(\log n)$**|
|Fast Doubling|**$O(\log n)$**|**$O(\log n)$**|

> **Interview Tip:** Whenever you see a recurrence where the current state depends only on the previous two states, think **Fibonacci-style Dynamic Programming**. Also, unless the interviewer explicitly asks for an optimized logarithmic solution, the **Space Optimized DP** approach is usually the expected answer.

# See Also
[Basic Problems Using Simple Recursion](Basic%20Problems%20Using%20Simple%20Recursion.md)