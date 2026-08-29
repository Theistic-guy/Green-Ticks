<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

The boundary initialization—`low = max(0, k - n)` and `high = min(k, m)`—is usually the trickiest part of this algorithm!

  

It feels counterintuitive because normally binary search starts at `0` and `len(array)`. But here, `i` isn't just an index into $A$; **`i` represents the exact count of elements we pick from $A$ to form the left half.**

  

Here is the straightforward mathematical reason why this range is strictly necessary.

  

## 1. The Core Equation

To form the left half, we must pick $i$ elements from array $A$ and $j$ elements from array $B$ such that:

  

$$i + j = k \implies j = k - i$$

Now, we have physical limits on how many elements we can take from each array:

  

1. **Limits on $i$ (Array $A$):** You can't take negative elements, and you can't take more elements than $A$ actually has ($m$).
    
      
    
    $$0 \le i \le m$$
    
2. **Limits on $j$ (Array $B$):** Similarly, you can't take negative elements from $B$, and you can't take more than $B$ actually has ($n$).
    
      
    
    $$0 \le j \le n$$
    

## 2. Deriving `low` and `high`

Since $j = k - i$, we plug that into the second inequality ($0 \le j \le n$):

  

$$0 \le k - i \le n$$

Let's break this double inequality down into two separate parts to isolate $i$:

  

### Part A: Solving for the upper bound (`high`)

- From $0 \le k - i$, adding $i$ to both sides gives:
    
      
    
    $$i \le k$$
    
- Combined with our physical array bound ($i \le m$), $i$ cannot exceed either limit:
    
      
    
    $$\text{high} = \min(k, m)$$
    

> **Intuition:** If $k = 3$, but array $A$ has $10$ elements ($m = 10$), you would **never** take 4 or 5 elements from $A$ because you only need $k = 3$ elements in total! So $i$ can never exceed $k$.
> 
>   

### Part B: Solving for the lower bound (`low`)

- From $k - i \le n$, subtracting $k$ and flipping signs gives:
    
      
    
    $$i \ge k - n$$
    
- Combined with our physical array bound ($i \ge 0$), $i$ cannot drop below either limit:
    
      
    
    $$\text{low} = \max(0, k - n)$$
    

> **Intuition:** Suppose $k = 8$, but array $B$ only has $3$ elements ($n = 3$). Even if you took **all** $3$ elements from $B$, you are still short by $5$ elements ($8 - 3 = 5$). Therefore, you **MUST** take at least $5$ elements from $A$. Taking $i = 0$ or $i = 2$ from $A$ would make it physically impossible to reach $k = 8$.
> 
>   

## 3. Concrete Visual Examples

### Example 1: Why `low` needs `k - n`

- **Array A ($m = 5$):** `[10, 20, 30, 40, 50]`
    
      
    
- **Array B ($n = 2$):** `[1, 2]`
    
      
    
- **$k = 6$** (We want the 6th element overall)
    
      
    

If we naively set `low = 0` and binary search tries $i = 1$ (1 element from $A$):

  

- $j = k - i = 6 - 1 = 5$.
    
      
    
- But Array $B$ only has $n = 2$ elements! Trying to access $B[4]$ will cause an **Index Out of Bounds** crash or force negative elements.
    
      
    

**Using the formula:**

  

$$\text{low} = \max(0, 6 - 2) = 4$$

$$\text{high} = \min(6, 5) = 5$$

The search bounds for $i$ are restricted to `[4, 5]`. This guarantees we take at least 4 elements from $A$, because $B$ can contribute at most 2 elements!

  

### Example 2: Why `high` needs `min(k, m)`

- **Array A ($m = 10$):** `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`
    
      
    
- **Array B ($n = 10$):** `[11, 12, 13, 14, 15, 16, 17, 18, 19, 20]`
    
      
    
- **$k = 2$** (We want the 2nd element overall)
    
      
    

If we naively set `high = m = 10` and binary search tries $i = 5$ (5 elements from $A$):

  

- $j = k - i = 2 - 5 = -3$.
    
      
    
- Taking $-3$ elements from Array $B$ makes no sense!
    
      
    

**Using the formula:**

  

$$\text{low} = \max(0, 2 - 10) = 0$$

$$\text{high} = \min(2, 10) = 2$$

The search bounds for $i$ are restricted to `[0, 2]`. We never try to take more than 2 elements from $A$.

  

## Quick Mental Model to Remember

Think of $i$ as a **slider control** for how many items you take from Array $A$:

  

- **`high = min(k, m)`**: You can't slide above $m$ (run out of elements in $A$) and you shouldn't slide above $k$ (you don't need more than $k$ elements total).
    
      
    
- **`low = max(0, k - n)`**: You can't slide below $0$ (can't take negative items) and you can't slide below $k - n$ (otherwise $B$ wouldn't have enough items to fill the rest of $k$).