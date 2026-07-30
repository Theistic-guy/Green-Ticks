

## Final Complexity

- **Time Complexity:** **$O(n \log\log n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# Step 1: What does the algorithm do?

The Sieve of Eratosthenes finds all prime numbers up to `n` by repeatedly marking the multiples of every prime.

For example, if `n = 30`:

- Multiples of **2** → 4, 6, 8, 10, 12, ...
    
- Multiples of **3** → 6, 9, 12, 15, ...
    
- Multiples of **5** → 10, 15, 20, ...
    
- Skip 4 because it has already been marked as non-prime.
    

So, the work done by the algorithm is simply the work of **marking multiples**.

---

# Step 2: How much work does each prime do?

Suppose the current prime is `p`.

The algorithm starts marking from `p²` (because smaller multiples have already been handled by smaller primes), but asymptotically, the number of multiples marked is approximately

$$  
\frac{n}{p}  
$$

Examples:

|Prime|Approximate Multiples Marked|
|--:|--:|
|2|$n/2$|
|3|$n/3$|
|5|$n/5$|
|7|$n/7$|

---

# Step 3: Total Work Done

Adding the work done for every prime gives

$$  
n\left(\frac12+\frac13+\frac15+\frac17+\cdots\right)  
$$

Notice something very important:

We are **only summing over prime numbers**, not over every integer.

---

# Step 4: Why isn't it $O(n\log n)$?

If we summed over **every integer**, we'd get

$$  
1+\frac12+\frac13+\frac14+\cdots+\frac1n  
$$

This is called the **harmonic series**, whose value grows as

$$  
O(\log n)  
$$

Therefore,

# $$  
n \times O(\log n)

O(n\log n)  
$$

However, the sieve **doesn't process every integer**.

It only processes **prime numbers**, making the sum much smaller.

---

# Step 5: The Important Mathematical Result

A famous result from number theory states that the sum of the reciprocals of all prime numbers up to `n` is

# $$  
\frac12+\frac13+\frac15+\frac17+\cdots

O(\log\log n)  
$$

Therefore,

$$  
n\left(\frac12+\frac13+\frac15+\frac17+\cdots\right)

n \cdot O(\log\log n)=

O(n\log\log n)  
$$

Hence,

$$  
\boxed{\text{Time Complexity} = O(n\log\log n)}  
$$

---

# Intuition

Think about what happens as the primes become larger:

- Prime **2** marks about half of all numbers.
    
- Prime **3** marks about one-third.
    
- Prime **5** marks about one-fifth.
    
- Larger primes mark fewer and fewer numbers.
    

Moreover, **prime numbers themselves become less frequent** as numbers grow larger.

So, even though we're visiting many primes, each successive prime contributes less work, causing the total work to grow much slower than $n\log n$.

This is why the overall complexity becomes

$$  
O(n\log\log n)  
$$

---

# Interview Answer (30 Seconds)

> For every prime `p`, the sieve marks approximately $n/p$ multiples. Therefore, the total work is
> 
> $$  
> n\left(\frac12+\frac13+\frac15+\frac17+\cdots\right)  
> $$
> 
> A well-known mathematical result states that the sum of the reciprocals of all prime numbers up to `n` is $O(\log\log n)$. Therefore, the overall time complexity is
> 
> $$  
> O(n\log\log n)  
> $$
> 
> The auxiliary space complexity is **$O(n)$** because we maintain a boolean array of size `n + 1`.

---

# Key Takeaways

- Each prime `p` marks approximately **$n/p$** multiples.
    
- Total work is
    
    $$  
    n\left(\frac12+\frac13+\frac15+\frac17+\cdots\right)  
    $$
    
- The reciprocal-prime sum is **$O(\log\log n)$** (a standard mathematical result).
    
- Therefore,
    
    $$  
    \boxed{\text{Time Complexity} = O(n\log\log n)}  
    $$
    
- **Auxiliary Space Complexity:** **$O(n)$**
    