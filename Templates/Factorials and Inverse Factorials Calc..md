

## 📑 Math: Modular Inverse & Factorial Precomputation

- Topic: Combinatorics / Modular Arithmetic
- Tags: #algorithm #math #competitive-programming #template
- Complexity: $O(N)$ precomputation, $O(1)$ lookup

---

## 💡 The Core Problem

When counting unique permutations (like $\frac{N!}{f_1! \times f_2! \dots}$), we must perform division under a modulo ($10^9 + 7$).

1. Direct division is not allowed in modular arithmetic.
2. We must multiply by the Modular Multiplicative Inverse instead ($A / B \pmod M \equiv A \times B^{-1} \pmod M$).
3. Computing this inverse from scratch using Fermat's Little Theorem ($B^{M-2} \pmod M$) takes $O(\log M)$ time, which becomes a bottleneck inside loops.

---

## ⚡ The Optimized Recipe (Python)

This template precomputes both factorials and their inverse factorials in linear time ($O(N)$ total).

```python
MOD = 10**9 + 7
MAX_N = 100000  # Adjust based on constraints

fact = [1] * (MAX_N + 1)
invFact = [1] * (MAX_N + 1)

# 1. Forward pass: Compute standard factorials
for i in range(1, MAX_N + 1):
    fact[i] = (fact[i - 1] * i) % MOD

# 2. Heavy Lift: Compute the absolute last inverse factorial using Fermat's Little Theorem
invFact[MAX_N] = pow(fact[MAX_N], MOD - 2, MOD)

# 3. Backward pass: Cascade down to fill the rest of the inverses
for i in range(MAX_N, 0, -1):
    invFact[i - 1] = (invFact[i] * i) % MOD
```

---

## 🔍 How the Backward Pass Magic Works

> [!NOTE] Mathematical Intuition  
> Instead of calling `pow()` $N$ times, we exploit the factorial relationship backwards:  
> $$\frac{1}{(i-1)!} = \frac{1}{i!} \times i$$  
> Because $\frac{i}{i!} = \frac{\cancel{i}}{\cancel{i} \times (i-1)!} = \frac{1}{(i-1)!}$
> 
> By multiplying our current inverse by $i$ as we count down, we get the previous inverse instantly using simple multiplication.

---

## 🚀 Cheat Sheet: $O(1)$ Code Snippets

Use these exact expressions in your combinatorial loops after running the precomputation:

- To get $n! \pmod M$:
    
    ```python
    fact[n]
    ```
    
- To get $\frac{1}{n!} \pmod M$:
    
    ```python
    invFact[n]
    ```
    
- To calculate combinations ($^nC_r$):
    
    ```python
    nCr = fact[n] * invFact[r] % MOD * invFact[n - r] % MOD
    ```
    
