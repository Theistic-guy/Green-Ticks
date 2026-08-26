---
Title: All divisors of a number
Companies:
  - Not Specified
Topics:
  - Maths
Platform:
  - Miscellaneous
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# All Divisors of a Number

**Pattern:**  

**Idea:**  divisors occur in pairs (x, y) , x <= sqrt(n) 



---

## 💻 Code

```Python
i = 1

while i * i <= n:
    if n % i == 0:
        print(i)

        if i != n // i:
            print(n // i)

    i += 1

```
**Time complexity** - O($\sqrt{n}$) ,
**Aux. Space complexity** -  O(1)


The **divisors (or factors)** of a positive integer are all the numbers that divide it exactly (leave a remainder of 0).

Example:

```text
Divisors of 36

1, 2, 3, 4, 6, 9, 12, 18, 36
```

---

# Key Mathematical Observation

The entire optimized algorithm is based on one simple observation.

## Theorem

> **Divisors always occur in pairs.**

If

```text
a × b = N
```

then both `a` and `b` are divisors of `N`.

For example,

```text
36

1 × 36

2 × 18

3 × 12

4 × 9

6 × 6
```

Notice something interesting.

The first divisor in every pair is getting larger,

while the second divisor is getting smaller.

Eventually they meet at

```text
√36 = 6
```

---

## Why only check till √N?

Suppose there exists a divisor

```text
d > √N
```

Then its paired divisor is

```text
N / d
```

Since

```text
d > √N
```

we get

```text
N / d < √N
```

which means

> **Every divisor larger than √N already has a matching divisor smaller than √N.**

Therefore,

> **Checking beyond √N would only rediscover divisor pairs already found.**

This is the exact same mathematical idea used in Prime Factorization.

---

# Naive Approach

## Idea

Simply try every number from

```text
1 → N
```

If it divides `N`, print it.

### Python

```python
def divisors(n):
    for i in range(1, n + 1):
        if n % i == 0:
            print(i)
```

### Complexity

- **Time:** `O(N)`
    
- **Space:** `O(1)`
    

---

# Optimized Approach

Instead of checking all numbers,

check only until

```text
√N
```

Whenever a divisor is found,

its paired divisor is immediately known.

### Python

```python
i = 1

while i * i <= n:
    if n % i == 0:
        print(i)

        if i != n // i:
            print(n // i)

    i += 1
```

---

# Dry Run

Take

```text
N = 36
```

Loop

```text
i = 1

1 divides 36

Print

1
36
```

---

```text
i = 2

Print

2
18
```

---

```text
i = 3

Print

3
12
```

---

```text
i = 4

Print

4
9
```

---

```text
i = 5

Skip
```

---

```text
i = 6

Print

6
```

Notice

```text
36 / 6 = 6
```

There is no paired divisor.

Without the condition

```python
if i != n // i
```

we would print

```text
6
6
```

twice.

---

# Why check

```python
if i != n // i
```

?

Perfect squares have one divisor exactly at

```text
√N
```

Example

```text
49

1 × 49

7 × 7
```

The pair

```text
7 × 7
```

contains the same divisor twice.

Hence,

```python
if i != n // i
```

prevents duplicate output.

---

# Output Order

This algorithm prints

```text
36

1
36
2
18
3
12
4
9
6
```

Notice the order is **not sorted**.

---

# Printing in Sorted Order

One common interview trick.

Store the larger divisors first.

```python
import math

def divisors(n):
    larger = []

    for i in range(1, int(math.sqrt(n)) + 1):

        if n % i == 0:

            print(i)

            if i != n // i:
                larger.append(n // i)

    while larger:
        print(larger.pop())
```

Output

```text
1
2
3
4
6
9
12
18
36
```

---

# Key Realizations 💡

- Divisors always occur in pairs.
    
- Every divisor larger than √N has a corresponding divisor smaller than √N.
    
- Therefore, checking only up to √N is sufficient.
    
- Every successful division immediately discovers **two** divisors.
    
- Perfect squares require special handling to avoid printing √N twice.
    
- The basic optimized algorithm does **not** produce sorted output.
    
- A stack/list can be used to obtain sorted divisors in `O(√N)` time.
    

---

# Complexity

|Approach|Time|Space|
|---|---|---|
|Naive|`O(N)`|`O(1)`|
|Optimized|`O(√N)`|`O(1)` _(unsorted)_|
|Optimized (Sorted Output)|`O(√N)`|`O(√N)` _(stores larger divisors)_|

---

# Interview Takeaways 🎯

- The optimization comes from the **factor-pair theorem**, not from any property specific to prime numbers.
    
- Always explain **why checking only up to √N is sufficient**.
    
- Don't forget the special case for **perfect squares** (`i == n // i`).
    
- Mention that the straightforward optimized algorithm does **not** guarantee sorted order, and explain how to produce sorted output if required.