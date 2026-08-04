# Gray Code (Bit Manipulation)

## What is Gray Code?

A **Gray Code** is an ordering of binary numbers such that **adjacent numbers differ by exactly one bit**.

Example (3 bits):

```text
Binary      Gray Code

000   ->    000
001   ->    001
010   ->    011
011   ->    010
100   ->    110
101   ->    111
110   ->    101
111   ->    100
```

Observe that every consecutive Gray code differs by only **one bit**.

---

## Why is it useful?

Changing only one bit at a time helps avoid transition errors.

Typical applications:

- Digital electronics / rotary encoders
    
- Karnaugh Maps
    
- Some bitmask DP / state transition problems
    
- LeetCode 89 - Gray Code
    

For most software interviews, simply knowing what it is and how to generate it is sufficient.

---

## Interview Trick

The **i-th Gray Code** can be generated in **O(1)** time using:

```text
gray = i ^ (i >> 1)
```

This is the only formula you really need to remember.

---

## Example

For

```text
i = 5

Binary:
101
```

```text
i >> 1

010
```

Now

```text
101
010
---
111
```

So

```text
Gray Code = 111 (7)
```

---

## Python Code

```python
def grayCode(n):
    ans = []

    for i in range(1 << n):
        ans.append(i ^ (i >> 1))

    return ans
```

Example:

```python
grayCode(3)

Output:
[0, 1, 3, 2, 6, 7, 5, 4]
```

---

## Complexity

- **Time:** `O(2^n)`
    
- **Auxiliary Space:** `O(1)` (excluding output)
    
- **Output Space:** `O(2^n)`
    

---

## Follow-up: Why does `i ^ (i >> 1)` work?

Intuition:

- The **MSB** remains the same.
    
- Every subsequent Gray bit is obtained by XOR-ing two adjacent binary bits.
    
- This transformation guarantees that consecutive integers produce Gray codes differing in exactly one bit.
    

You are **not expected** to derive this formula in a typical software engineering interview—remembering it and recognizing the property is usually enough.

---

## Interview Takeaways

- Gray Code is a binary numbering system where **adjacent values differ by exactly one bit**.
    
- Generation formula:
    

```text
gray = i ^ (i >> 1)
```

- Common use cases:
    
    - Hardware/encoders
        
    - Karnaugh maps
        
    - Occasionally in bitmask/state-transition problems
        
- Rarely asked directly, but good bonus knowledge for bit manipulation.