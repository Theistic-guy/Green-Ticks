---
Title: Reverse Words in a String (Leetcode 151)
Companies:
  - Not Specified
Topics:
  - Strings
  - Two Pointers
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
  - GFG
Link: ""
Rating:
  - ⭐⭐⭐⭐
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Reverse Words in a String (Leetcode 151)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python

def reverseWords(s: str) -> str:

    # Remove extra spaces
    words = []
    i = 0

    while i < len(s):
        while i < len(s) and s[i] == " ":
            i += 1

        if i == len(s):
            break

        j = i
        while j < len(s) and s[j] != " ":
            j += 1

        words.append(s[i:j])
        i = j

    chars = list(" ".join(words))

    # Reverse helper
    def reverse(arr, l, r):
        while l < r:
            arr[l], arr[r] = arr[r], arr[l]
            l += 1
            r -= 1

    reverse(chars, 0, len(chars) - 1)

    start = 0
    for end in range(len(chars) + 1):
        if end == len(chars) or chars[end] == " ":
            reverse(chars, start, end - 1)
            start = end + 1

    return "".join(chars)
```
**Time complexity** - O(n) 

**Aux. Space complexity** -  O(1*)

O(1) in C++/java (in-place mutable character arrays) , in Python converting to a list takes O(n) operation 

---


# Reverse Words in a String (Leetcode 151)

**Tags:** #Strings #TwoPointers #InPlace #Parsing #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a string `s`, reverse the **order of its words**.

Rules:

- Remove leading and trailing spaces.
    
- Reduce multiple spaces between words to a **single space**.
    
- Preserve the characters within each word.
    

**Example**

|Input|Output|
|---|---|
|`"the sky is blue"`|`"blue is sky the"`|
|`" hello world "`|`"world hello"`|
|`"a good example"`|`"example good a"`|

---

## Key Idea

There are **two important approaches**:

1. **Pythonic** — Split → Reverse → Join _(recommended in Python interviews)_
    
2. **In-place Two Pointers** — Reverse the entire string, then reverse each word _(classic DSA approach used in C++/Java)_
    

The second demonstrates the underlying algorithm and is language-independent.

---

## Approach 1 — Split + Reverse + Join (Pythonic)

### Intuition

Python's `split()` already:

- Removes leading/trailing spaces
    
- Collapses multiple spaces
    
- Returns only the words
    

So the problem reduces to reversing a list.

### Algorithm

1. Split into words.
    
2. Reverse the list.
    
3. Join using one space.
    

### Python Solution

```python
def reverseWords(s: str) -> str:
    return " ".join(s.split()[::-1])
```

### Why `split()` Works

```python
"  a   good  example ".split()
```

Output:

```text
["a", "good", "example"]
```

Notice that all extra spaces disappear automatically.

---

## Approach 2 — In-Place Two Pointers (DSA)

### Intuition (The WHY)

Instead of moving words individually:

1. Reverse the **entire string**
    
2. Reverse each word
    
3. Clean extra spaces
    

Example:

```text
Original:
the sky is blue

Step 1:
eulb si yks eht

Step 2:
blue is sky the
```

Two reversals preserve the internal order of every word.

---

## Algorithm

### Step 1 — Trim & Normalize Spaces

Convert the string into a character array while keeping only single spaces.

```
"  a   good  example  "

↓

"a good example"
```

### Step 2 — Reverse Entire Array

```text
a good example

↓

elpmaxe doog a
```

### Step 3 — Reverse Each Word

```text
elpmaxe doog a

↓

example good a
```

---

## Python Implementation (Educational)

```python
def reverseWords(s: str) -> str:

    # Remove extra spaces
    words = []
    i = 0

    while i < len(s):
        while i < len(s) and s[i] == " ":
            i += 1

        if i == len(s):
            break

        j = i
        while j < len(s) and s[j] != " ":
            j += 1

        words.append(s[i:j])
        i = j

    chars = list(" ".join(words))

    # Reverse helper
    def reverse(arr, l, r):
        while l < r:
            arr[l], arr[r] = arr[r], arr[l]
            l += 1
            r -= 1

    reverse(chars, 0, len(chars) - 1)

    start = 0
    for end in range(len(chars) + 1):
        if end == len(chars) or chars[end] == " ":
            reverse(chars, start, end - 1)
            start = end + 1

    return "".join(chars)
```

> In Python, this is mainly for understanding; the split-based solution is preferred.

---

## Dry Run

**Input**

```text
"the sky is blue"
```

### After Full Reverse

```text
eulb si yks eht
```

### Reverse Individual Words

|Before|After|
|---|---|
|eulb|blue|
|si|is|
|yks|sky|
|eht|the|

Final result:

```text
blue is sky the
```

---

## Why Two Reversals Work

Consider one word:

```text
hello
```

Reverse whole string:

```text
olleh
```

Reverse that segment again:

```text
hello
```

The word's letters return to their original order while its **position** remains reversed relative to the other words.

---

## Complexity

|Approach|Time|Auxiliary Space|
|---|--:|--:|
|Split + Join|**O(n)**|**O(n)**|
|In-Place Two Pointers|**O(n)**|**O(1)***|

> The in-place version is truly O(1) only in mutable character arrays (C++/Java). Python strings are immutable, so converting to a list uses O(n) space.

---

## Important Variations

- **LC 186 — Reverse Words in a String II** → In-place on a character array.
    
- **Reverse Words While Preserving Spaces** → Different parsing problem; spaces remain fixed.
    
- **Reverse Characters of Each Word (LC 557)** → Reverse letters, not word order.
    

---

## Common Mistakes

### 1. Using `split(" ")` Instead of `split()`

Wrong:

```python
"  a   b ".split(" ")
```

Output:

```text
['', '', 'a', '', '', 'b', '']
```

Correct:

```python
"  a   b ".split()
```

Output:

```text
['a', 'b']
```

### 2. Forgetting Multiple Spaces

The output must contain **exactly one space** between adjacent words.

### 3. Reversing Characters Instead of Words

Incorrect:

```text
blue si yks eht
```

Correct:

```text
blue is sky the
```

---

## Pythonic Way

```python
def reverseWords(s):
    return " ".join(reversed(s.split()))
```

Equivalent to slicing:

```python
" ".join(s.split()[::-1])
```

Both are **O(n)** and are the idiomatic Python solutions.

---

## Key Takeaways / Pattern Recognition

- **Reverse word order** → Think **Split → Reverse → Join** in Python.
    
- **In-place interview variant** → Reverse whole string, then reverse each word.
    
- Remember the distinction:
    
    - **Reverse words** → word positions change.
        
    - **Reverse each word** → characters change.
        
    - **Reverse preserving spaces** → entirely different problem.