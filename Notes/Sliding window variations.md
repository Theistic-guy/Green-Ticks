<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Sliding Window Variations

This note covers the solutions to the most common **fixed-size Sliding Window** interview problems that are direct extensions of the **Maximum Sum of K Consecutive Elements** problem.

---

# 1. First Negative Number in Every Window

## Problem

Given an array and a window size `k`, print the **first negative number** in every window.

Example

```text
Input

[-8, 2, 3, -6, 10]

k = 2

Output

[-8, 0, -6, -6]
```

(`0` means no negative number exists.)

---

## Interview Approach

Maintain a **queue** of indices of negative numbers inside the current window.

- Remove indices that leave the window.
    
- Add newly encountered negative numbers.
    
- The front of the queue is the first negative number.
    

---

## Python Code

```python
from collections import deque

def first_negative(arr, k):

    q = deque()
    ans = []

    for i in range(len(arr)):

        if arr[i] < 0:
            q.append(i)

        while q and q[0] <= i - k:
            q.popleft()

        if i >= k - 1:
            ans.append(arr[q[0]] if q else 0)

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(k)$**
    

---

# 2. Maximum Average Subarray I (LeetCode 643)

## Problem

Find the maximum average of any contiguous subarray of size `k`.

---

## Interview Approach

The denominator (`k`) is constant.

Therefore,

$$  
\text{Maximum Average}
\frac{\text{Maximum Sum}}{k}  
$$

Simply use the fixed-size sliding window.

---

## Python Code

```python
def find_max_average(arr, k):

    curr = sum(arr[:k])

    ans = curr

    for i in range(k, len(arr)):

        curr += arr[i] - arr[i-k]

        ans = max(ans, curr)

    return ans / k
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# 3. Contains Duplicate II (LeetCode 219)

## Problem

Return `True` if two equal elements occur within distance `k`.

---

## Interview Approach

Maintain a sliding window using a **Hash Set**.

- If the current element already exists in the set → duplicate found.
    
- Keep only the last `k` elements in the window.
    

---

## Python Code

```python
def contains_nearby_duplicate(nums, k):

    window = set()

    for i in range(len(nums)):

        if nums[i] in window:
            return True

        window.add(nums[i])

        if len(window) > k:
            window.remove(nums[i-k])

    return False
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(k)$**
    

---

# 4. Maximum Number of Vowels in a Substring (LeetCode 1456)

## Problem

Find the maximum number of vowels in any substring of length `k`.

---

## Interview Approach

Maintain the number of vowels in the current window.

- Add incoming character.
    
- Remove outgoing character.
    

---

## Python Code

```python
def max_vowels(s, k):

    vowels = set("aeiou")

    curr = sum(ch in vowels for ch in s[:k])

    ans = curr

    for i in range(k, len(s)):

        curr += s[i] in vowels
        curr -= s[i-k] in vowels

        ans = max(ans, curr)

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# 5. Maximum Points You Can Obtain from Cards (LeetCode 1423)

## Problem

Choose exactly `k` cards from either end of the array to maximize the score.

---

## Key Insight

Instead of choosing `k` cards,

leave behind exactly

```text
n-k
```

consecutive cards.

Therefore,

Answer

=

Total Sum

−

Minimum Window Sum of Size

```text
n-k
```

---

## Python Code

```python
def max_score(cards, k):

    n = len(cards)

    if k == n:
        return sum(cards)

    window = n - k

    curr = sum(cards[:window])

    minimum = curr

    for i in range(window, n):

        curr += cards[i] - cards[i-window]

        minimum = min(minimum, curr)

    return sum(cards) - minimum
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(1)$**
    

---

# 6. Find All Anagrams in a String (LeetCode 438)

## Problem

Return every starting index where an anagram of `p` appears in `s`.

---

## Interview Approach

Maintain frequency counts for

- Pattern
    
- Current window
    

Whenever both frequency arrays match,

an anagram exists.

---

## Python Code

```python
from collections import Counter

def find_anagrams(s, p):

    need = Counter(p)

    window = Counter(s[:len(p)])

    ans = []

    if window == need:
        ans.append(0)

    for i in range(len(p), len(s)):

        window[s[i]] += 1

        left = s[i-len(p)]

        window[left] -= 1

        if window[left] == 0:
            del window[left]

        if window == need:
            ans.append(i-len(p)+1)

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(26)$** (or **$O(m)$** for general alphabets)
    

---

# 7. Sliding Window Maximum (LeetCode 239)

## Problem

Find the maximum element in every window of size `k`.

---

## Interview Approach

Maintain a **Monotonic Deque**.

The deque stores **indices** in decreasing order of values.

The front of the deque is always the maximum element.

---

## Python Code

```python
from collections import deque

def max_sliding_window(nums, k):

    dq = deque()

    ans = []

    for i in range(len(nums)):

        while dq and dq[0] <= i-k:
            dq.popleft()

        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()

        dq.append(i)

        if i >= k-1:
            ans.append(nums[dq[0]])

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n)$**
    
- **Auxiliary Space Complexity:** **$O(k)$**
    

---

# Pattern Recognition

|Problem Statement|Technique|
|---|---|
|Fixed Window Sum|Sliding Window|
|First Negative|Sliding Window + Queue|
|Maximum Average|Sliding Window|
|Nearby Duplicate|Sliding Window + Hash Set|
|Maximum Vowels|Sliding Window + Counter|
|Card Points|Sliding Window + Complement Window|
|Find Anagrams|Sliding Window + Frequency Map|
|Window Maximum|Sliding Window + Monotonic Deque|

---

# FAANG Interview Importance

|Problem|Frequency|
|---|---|
|Sliding Window Maximum (239)|⭐⭐⭐⭐⭐|
|Find All Anagrams (438)|⭐⭐⭐⭐⭐|
|Maximum Points from Cards (1423)|⭐⭐⭐⭐☆|
|Maximum Vowels (1456)|⭐⭐⭐⭐☆|
|Contains Duplicate II (219)|⭐⭐⭐⭐☆|
|First Negative in Every Window|⭐⭐⭐☆☆|
|Maximum Average Subarray (643)|⭐⭐⭐☆☆|

---

# Key Takeaways

As soon as you read:

- "Window of size `k`"
    
- "Exactly `k` consecutive elements"
    
- "Substring of length `k`"
    

think **Fixed-Size Sliding Window**.

Then identify what additional data structure is needed:

- **Nothing** → Sum / Average
    
- **Queue** → First Negative
    
- **Hash Set** → Duplicate Detection
    
- **Frequency Map** → Anagrams / Character Counts
    
- **Monotonic Deque** → Maximum / Minimum in Window
    

> **Interview Tip:** About **80% of fixed-size sliding window interview questions** can be solved by starting with the template below and then adding one supporting data structure (queue, hash map, or deque) depending on what information the window needs to maintain.

```python
curr = ...

for i in range(k, len(arr)):

    # Remove outgoing element

    # Add incoming element

    # Update answer
```
