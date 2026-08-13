---
Title: Maximum Appearing Element
Companies:
  - Not Specified
Topics:
  - Arrays
  - Difference Array
Platform:
  - Miscellaneous
Difficulty: Hard
Other Tags:
  - GFG
  - Maximum
Link: ""
---

# Maximum Appearing Element in Range Queries (Difference Array Technique) — DSA Interview Notes

**Pattern:** 

**Idea:** 

---

## 💻 Code

```Python
def maximum_appearing(L, R):

    MAX = max(R) + 2

    diff = [0] * MAX

    for i in range(len(L)):

        diff[L[i]] += 1

        diff[R[i] + 1] -= 1

    ans = 0

    maximum = diff[0]

    for i in range(1, MAX):

        diff[i] += diff[i-1]

        if diff[i] > maximum:

            maximum = diff[i]

            ans = i

    return ans
```

**Time complexity** - O(n+m) , n is not of ranges and m is maximum value
**Aux. Space complexity** -  O(m)
**Variations (with soln.)** - [Difference Array & Range Update Problems (FAANG Variations)](../Notes/Difference%20Array%20&%20Range%20Update%20Problems%20(FAANG%20Variations).md)
**More read on difference array and related techniques** - [Difference Array & Related Range-Update Techniques](../Notes/Extras/Difference%20Array%20&%20Related%20Range-Update%20Techniques.md)

---


This is a classic interview problem that introduces the **Difference Array (Prefix Difference)** technique.

The key idea is to efficiently process **multiple range updates** without updating every element individually.

---

# Problem Statement

Given two arrays

```text
L = [1, 2, 5, 15]

R = [5, 8, 7, 18]
```

Each pair

```text
(L[i], R[i])
```

represents a range.

Find the integer that appears in the **maximum number of ranges**.

---

# Example

Ranges

```text
[1,5]

[2,8]

[5,7]

[15,18]
```

Frequency Table

|Number|Frequency|
|--:|--:|
|1|1|
|2|2|
|3|2|
|4|2|
|5|3|
|6|2|
|7|2|
|8|1|
|15|1|
|16|1|
|17|1|
|18|1|

Answer

```text
5
```

because it belongs to **3 ranges**, which is the maximum.

---

# Approach 1: Brute Force

For every range,

increment the count of every number inside it.

---

## Python Code

```python
def maximum_appearing(L, R):

    MAX = max(R) + 1

    freq = [0] * (MAX + 1)

    for i in range(len(L)):

        for j in range(L[i], R[i] + 1):

            freq[j] += 1

    return freq.index(max(freq))
```

---

## Complexity

Let

- `n` = number of ranges
    
- `m` = maximum value
    
- **Time Complexity:** **$O(n \times m)$** (worst case)
    
- **Auxiliary Space Complexity:** **$O(m)$**
    

Too slow when ranges are large.

---

# Optimal Approach: Difference Array

## Key Observation

Instead of increasing **every element** inside a range,

record only where the range

- starts
    
- ends
    

Suppose the range is

```text
[2,5]
```

Instead of

```text
+1

+1

+1

+1
```

do only

```text
diff[2] += 1

diff[6] -= 1
```

Later,

a prefix sum automatically propagates the increment across the range.

---

# Why Does This Work?

Consider

```text
Range

[2,5]
```

Difference Array

|Index|Value|
|--:|--:|
|2|+1|
|6|-1|

Now compute the prefix sum.

|Index|Prefix|
|--:|--:|
|0|0|
|1|0|
|2|1|
|3|1|
|4|1|
|5|1|
|6|0|

Notice that

```text
2

↓

5
```

automatically receive the increment.

This is exactly the required range update.

---

# Algorithm

For every range

```text
[L,R]
```

perform

```python
diff[L] += 1

diff[R + 1] -= 1
```

After processing all ranges,

compute the prefix sum.

The index having the maximum prefix value is the answer.

---

# Python Code

```python
def maximum_appearing(L, R):

    MAX = max(R) + 2

    diff = [0] * MAX

    for i in range(len(L)):

        diff[L[i]] += 1

        diff[R[i] + 1] -= 1

    ans = 0

    maximum = diff[0]

    for i in range(1, MAX):

        diff[i] += diff[i-1]

        if diff[i] > maximum:

            maximum = diff[i]

            ans = i

    return ans
```

---

# Dry Run

```text
L

[1,2,5]

R

[3,5,7]
```

Difference Array Updates

```text
+1 at 1

-1 at 4

+1 at 2

-1 at 6

+1 at 5

-1 at 8
```

Difference Array

|Index|Value|
|--:|--:|
|1|1|
|2|1|
|4|-1|
|5|1|
|6|-1|
|8|-1|

After Prefix Sum

|Index|Frequency|
|--:|--:|
|1|1|
|2|2|
|3|2|
|4|1|
|5|2|
|6|1|
|7|1|

Maximum frequency

```text
2
```

First occurring at

```text
2
```

Answer

```text
2
```

---

# Why Is It Called a Difference Array?

Instead of storing the actual frequencies,

we store **how the frequency changes**.

Example

```text
Frequency

0

0

1

1

1

0
```

Difference

```text
0

0

+1

0

0

-1
```

Taking the prefix sum reconstructs the original frequencies.

---

# Complexity

Suppose

- `n` = number of ranges
    
- `m` = maximum value
    

Preprocessing

- **Time Complexity:** **$O(n)$**
    

Prefix Sum

- **Time Complexity:** **$O(m)$**
    

Overall

- **Time Complexity:** **$O(n+m)$**
    
- **Auxiliary Space Complexity:** **$O(m)$**
    

---

# Common Interview Mistakes

## Mistake 1

Writing

```python
diff[R] -= 1
```

instead of

```python
diff[R+1] -= 1
```

The decrement must happen **after** the range ends.

---

## Mistake 2

Forgetting to allocate one extra element.

Since we update

```text
R+1
```

the difference array should have size

```text
max(R)+2
```

---

## Mistake 3

Returning the maximum frequency instead of its index.

The question asks for the

```text
maximum appearing element
```

not the count.

---

# Important FAANG Variations

These are the most relevant follow-up problems based on the same idea.

### 1. Range Addition (LeetCode 370)

Perform multiple range increment operations on an array.

**Technique:** Difference Array + Prefix Sum.

---

### 2. Corporate Flight Bookings (LeetCode 1109)

Each booking adds passengers to a range of flights.

Find the final number of passengers for every flight.

**Technique:** Difference Array.

---

### 3. Car Pooling (LeetCode 1094)

Passengers board and leave over ranges of locations.

Determine whether the vehicle capacity is ever exceeded.

**Technique:** Difference Array + Prefix Sum.

---

### 4. Brightness / Coverage Problems

Given multiple intervals (street lights, Wi-Fi routers, sensors),

find

- the point with maximum coverage,
    
- or whether every point is covered.
    

**Technique:** Difference Array or Sweep Line.

---

### 5. Skyline / Sweep Line Problems

Intervals represent buildings or events.

Instead of simple counts,

track active intervals while sweeping across coordinates.

This is an advanced extension of the same idea.

---

# Difference Array vs Prefix Sum

|Prefix Sum|Difference Array|
|---|---|
|Fast Range Queries|Fast Range Updates|
|Query → **$O(1)$**|Update → **$O(1)$**|
|Build once|Prefix sum after all updates|

A good rule to remember:

- **Many range queries** → Prefix Sum.
    
- **Many range updates** → Difference Array.
    

---

# Key Takeaways

For every range

```text
[L,R]
```

perform

```python
diff[L] += 1

diff[R+1] -= 1
```

After processing all ranges,

compute the prefix sum.

The index having the largest prefix value is the answer.

|Approach|Time|Aux. Space|
|---|---|---|
|Brute Force|**$O(n \times m)$**|**$O(m)$**|
|Difference Array|**$O(n+m)$**|**$O(m)$**|

> **Interview Tip:** This problem is often the first introduction to the **Difference Array** technique. Whenever you see **many range updates followed by one final computation**, think **Difference Array** instead of updating every element individually. It's the natural counterpart of the Prefix Sum technique, which optimizes **many range queries** instead of updates.