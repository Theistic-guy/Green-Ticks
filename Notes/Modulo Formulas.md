## Common formulas
$$
(A - B) \bmod n = \big((A \bmod n) - (B \bmod n) + n\big) \bmod n.
$$
Adding $n$ ensures the expression inside the parentheses is non-negative before taking the final modulo.
$$
(A + B) \bmod n = \big((A \bmod n) + (B \bmod n)) \bmod n.
$$
$$
(A \times B) \bmod n = \big((A \bmod n) \times (B \bmod n)) \bmod n.
$$
## 1. What is Modulo?

- **Definition:** Modulo (`A % n`) finds the **remainder** $R$ left over after dividing an integer $A$ by the modulus $n$.
- **The Rule:** The remainder $R$ must always satisfy

$$
0 \le R < n.
$$

- **Concept:** Think of modulo as a clock with $n$ positions. Numbers "wrap around" the circle. Adding or subtracting any multiple of $n$ brings you back to the same position.

---

## 2. Why Add $n$ to Negative Numbers?

When a number is negative (e.g., $-5 \pmod{3}$), ordinary division may produce a **negative remainder**, which is not the standard mathematical convention.

We instead use the **Division Algorithm**:

$$
A = qn + R,
$$

where

$$
0 \le R < n.
$$

### Example: $-5 \pmod{3}$

Find a multiple of $3$ that is less than or equal to $-5$:

$$
-6 = 3 \times (-2).
$$

Now write

$$
-5 = -6 + R.
$$

Therefore,

$$
R = 1,
$$

so

$$
-5 \equiv 1 \pmod{3}.
$$

### The Practical Shortcut

Since adding or subtracting $n$ does **not** change a number's residue modulo $n$, repeatedly add $n$ until the result lies in the valid range $[0, n-1]$.

Example:

$$
-5 + 3 = -2
$$

$$
-2 + 3 = 1
$$

Hence,

$$
-5 \equiv 1 \pmod{3}.
$$

---


## 3. Python Behavior

Python uses **floor division** for the modulo operator. As a result, when the divisor is positive, the remainder is always in the range

$$
0 \le R < n.
$$

```python
# Python automatically returns the canonical (non-negative) remainder
print(-5 % 3)    # 1
print(-12 % 7)   # 2
```

So,

$$
-5 \% 3 = 1
$$

and

$$
-12 \% 7 = 2.
$$