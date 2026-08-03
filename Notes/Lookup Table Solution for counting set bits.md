The **Lookup Table** approach is an optimization over Brian Kernighan's algorithm when you need to count set bits **repeatedly for many numbers**.

Instead of counting bits every time, we **precompute** the answer for all possible **8-bit numbers (0–255)** and store them in a table.

Then, for larger integers, we divide the number into bytes and simply look up the answer.

---
<u>More intuitive</u> : [Alternative Way to Build the Lookup Table (Using Brian Kernighan's Identity)](#Alternative%20Way%20to%20Build%20the%20Lookup%20Table%20(Using%20Brian%20Kernighan's%20Identity))
# Why Does This Work?

A byte contains **8 bits**.

There are only

$$  
2^8 = 256  
$$

possible byte values.

Therefore, we can precompute the number of set bits for every value from **0 to 255**.

Example:

|Decimal|Binary|Set Bits|
|--:|---|--:|
|0|00000000|0|
|1|00000001|1|
|2|00000010|1|
|3|00000011|2|
|4|00000100|1|
|...|...|...|
|255|11111111|8|

Once computed, every lookup takes **constant time**.

---

# Step 1: Build the Lookup Table

<u>More intuitive</u> : [Alternative Way to Build the Lookup Table (Using Brian Kernighan's Identity)](#Alternative%20Way%20to%20Build%20the%20Lookup%20Table%20(Using%20Brian%20Kernighan's%20Identity))


The clever recurrence is

$$  
\text{table}[i] = (i \bmod 2) + \text{table}[i // 2]  
$$

### Why?

Suppose

```text
13 = 1101
```

Removing the last bit is equivalent to

```text
13 // 2 = 6

1101

↓

110
```

The last bit contributes either:

- **0** (if even)
    
- **1** (if odd)
    

Therefore,

```text
Number of set bits

=

Set bits in (i // 2)

+

Last bit
```

which gives

$$  
\boxed{\text{table}[i]=\text{table}[i//2]+(i\% 2)}  
$$

---

## Python Code

```python
table = [0] * 256

for i in range(1, 256):
    table[i] = table[i >> 1] + (i & 1)
```

Notice that

```python
i >> 1
```

is equivalent to

```python
i // 2
```

and

```python
i & 1
```

is equivalent to

```python
i % 2
```

Bit operations are simply a little faster.

---

# Step 2: Split the Integer into Bytes

Suppose we have a 32-bit integer.

```text
11001010 11110000 01010101 10001111

Byte 4    Byte 3    Byte 2    Byte 1
```

The total number of set bits is simply

```text
Set bits(Byte1)
+
Set bits(Byte2)
+
Set bits(Byte3)
+
Set bits(Byte4)
```

Each value is obtained from the lookup table.

---

# Extracting Individual Bytes

We use masking and shifting.

## Lowest Byte

```python
n & 255
```

Why 255?

```text
255

11111111
```

Masking keeps only the last 8 bits.

Example

```text
1010110010101111

AND

0000000011111111

=

0000000010101111
```

---

## Second Byte

Shift first.

```python
(n >> 8) & 255
```

---

## Third Byte

```python
(n >> 16) & 255
```

---

## Fourth Byte

```python
(n >> 24) & 255
```

---

# Complete Python Code (32-bit Integer)

```python
table = [0] * 256

for i in range(1, 256):
    table[i] = table[i >> 1] + (i & 1)


def count_set_bits(n):
    return (
        table[n & 255] +
        table[(n >> 8) & 255] +
        table[(n >> 16) & 255] +
        table[(n >> 24) & 255]
    )
```

---

# Dry Run

Suppose

```text
n = 13

Binary

00000000 00000000 00000000 00001101
```

### Byte 1

```text
00001101

Decimal = 13

table[13] = 3
```

### Remaining Bytes

```text
00000000

table[0] = 0
```

Therefore,

```text
3 + 0 + 0 + 0 = 3
```

Answer = **3**

---

# Can This Work for 64-bit Integers?

Yes.

Simply process **8 bytes** instead of **4 bytes**.

Example

```python
count = 0

for _ in range(8):
    count += table[n & 255]
    n >>= 8
```

This works for any fixed-size integer.

---

# Complexity Analysis

## Preprocessing

Building the table requires computing values for all 256 possible bytes.

- **Time Complexity:** **$O(256)$**
    
- **Auxiliary Space Complexity:** **$O(256)$**
    

Since 256 is a constant,

this is effectively

- **Time:** **$O(1)$**
    
- **Space:** **$O(1)$**
    

---

## Counting Set Bits

For a 32-bit integer, we perform exactly **4 lookups**.

- **Time Complexity:** **$O(4)$ = $O(1)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

For a 64-bit integer,

- **Time Complexity:** **$O(8)$ = $O(1)$**
    

---

# Why Is This Useful?

The preprocessing is done **once**.

After that,

every query requires only a few table lookups.

This is extremely useful when you need to count set bits for **millions of numbers**.

Examples include:

- Competitive Programming
    
- Bitmask Dynamic Programming
    
- Graphics Programming
    
- Cryptography
    
- Compression Algorithms
    

---

# Comparison with Other Methods

|Method|Time Complexity|Auxiliary Space|Best Use Case|
|---|---|---|---|
|Check Every Bit|**$O(\text{Number of Bits})$**|**$O(1)$**|Simple implementation|
|Brian Kernighan|**$O(k)$** (`k` = set bits)|**$O(1)$**|Best interview approach|
|Lookup Table|**$O(1)$** (fixed-size integers)|**$O(256)$**|Repeated queries on many numbers|
|Python `bit_count()`|Optimized|**$O(1)$**|Production Python code|

---

# Common Interview Questions

## Why do we use 255?

Because

$$  
255 = 2^8 - 1  
$$

whose binary representation is

```text
11111111
```

Masking with 255 extracts exactly one byte.

---

## Why only 256 entries?

A byte has 8 bits.

Therefore,

$$  
2^8 = 256  
$$

possible values.

---

## Is the lookup table always faster?

Not necessarily.

- For **one or two numbers**, Brian Kernighan's algorithm is usually simpler and may even be faster because it avoids preprocessing.
    
- For **thousands or millions of queries**, the lookup table becomes more efficient since the preprocessing cost is paid only once.
    

---

# Key Takeaways

- Precompute the number of set bits for all **256 possible byte values**.
    
- Store them in a lookup table.
    
- Break the integer into bytes using masking and shifting.
    
- Sum the lookup values.
    

For a 32-bit integer:

```python
table[n & 255]
+ table[(n >> 8) & 255]
+ table[(n >> 16) & 255]
+ table[(n >> 24) & 255]
```

- Preprocessing:
    
    - **Time Complexity:** **$O(256)$ ≈ $O(1)$**
        
    - **Auxiliary Space Complexity:** **$O(256)$ ≈ $O(1)$**
        
- Each query:
    
    - **Time Complexity:** **$O(1)$**
        
    - **Auxiliary Space Complexity:** **$O(1)$**
        

> **Interview Tip:** The lookup table method is a classic example of the **time-space tradeoff**. You spend a small, constant amount of memory to significantly speed up repeated computations.

# Alternative Way to Build the Lookup Table (Using Brian Kernighan's Identity)

Another elegant way to construct the lookup table uses the identity

```text
i & (i - 1)
```

which **removes the rightmost set bit** of `i`.

Therefore, if we already know the number of set bits in

```text
i & (i - 1)
```

then `i` simply has **one additional set bit**.

This gives the recurrence

$$  
\boxed{\text{table}[i] = \text{table}[ \,\,i \& (i-1)\,] + 1}  
$$

---

## Why Does This Work?

Consider

```text
i = 13

Binary

1101
```

Applying Brian Kernighan's trick:

```text
1101

1100

AND

1100
```

Result

```text
1100
```

The rightmost set bit has been removed.

If

```text
table[12] = 2
```

then

```text
table[13] = table[12] + 1 = 3
```

Exactly correct.

---

## Another Example

```text
i = 10

1010
```

```text
10 & 9

1010
1001
----
1000
```

If

```text
table[8] = 1
```

then

```text
table[10] = 2
```

---

## Python Code

```python
table = [0] * 256

for i in range(1, 256):
    table[i] = table[i & (i - 1)] + 1
```

---

# Which Construction Should You Remember?

Both generate exactly the same lookup table.

### Method 1 (DP)

```python
table[i] = table[i >> 1] + (i & 1)
```

- Easier to understand.
    
- Based on removing the least significant bit.
    

### Method 2 (Brian Kernighan)

```python
table[i] = table[i & (i - 1)] + 1
```

- Uses the famous identity `i & (i - 1)`.
    
- Very common in interview discussions because it reinforces one of the most important bit manipulation tricks.
    

Both have:

- **Time Complexity:** **$O(256)$ ≈ $O(1)$**
    
- **Auxiliary Space Complexity:** **$O(256)$ ≈ $O(1)$**
    

> **Interview Tip:** If you've already explained Brian Kernighan's algorithm earlier, using `table[i] = table[i & (i - 1)] + 1` naturally connects the two topics and often leaves a stronger impression than the DP recurrence alone.