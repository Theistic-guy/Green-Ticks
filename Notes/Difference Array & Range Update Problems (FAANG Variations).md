<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

This note covers the most common interview problems based on the **Difference Array** technique. Nearly all of them follow the same pattern:

1. Apply all range updates in **$O(1)$** each using a Difference Array.
    
2. Take a **Prefix Sum** once at the end to obtain the final array.
    

---

# Difference Array Template

```python
diff = [0] * (n + 1)

for each update (L, R, val):

    diff[L] += val

    if R + 1 < len(diff):
        diff[R + 1] -= val

arr[0] = diff[0]

for i in range(1, n):
    arr[i] = arr[i-1] + diff[i]
```

This template solves most Difference Array problems.

---

# 1. Range Addition (LeetCode 370)

## Problem

Initially,

```text
[0,0,0,0,0]
```

Each update is

```text
[L,R,val]
```

meaning

```text
Add val

to every element

from L to R
```

---

## Example

```text
length = 5

updates

[1,3,2]

[2,4,3]

[0,2,-2]
```

Output

```text
[-2,0,3,5,3]
```

---

## Solution

```python
def range_addition(length, updates):

    diff = [0] * (length + 1)

    for L, R, val in updates:

        diff[L] += val

        if R + 1 < len(diff):
            diff[R+1] -= val

    ans = [0] * length

    ans[0] = diff[0]

    for i in range(1, length):
        ans[i] = ans[i-1] + diff[i]

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n+q)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

where `q` is the number of updates.

---

# 2. Corporate Flight Bookings (LeetCode 1109)

## Problem

Each booking

```text
[first,last,seats]
```

adds passengers to every flight between

```text
first

↓

last
```

Return the final passengers on each flight.

---

## Key Observation

Every booking is simply

```text
Range Addition
```

---

## Solution

```python
def corp_flight_bookings(bookings, n):

    diff = [0] * (n + 1)

    for first, last, seats in bookings:

        diff[first-1] += seats

        if last < n:
            diff[last] -= seats

    ans = [0] * n

    ans[0] = diff[0]

    for i in range(1, n):
        ans[i] = ans[i-1] + diff[i]

    return ans
```

---

## Complexity

- **Time Complexity:** **$O(n+q)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

---

# 3. Car Pooling (LeetCode 1094)

## Problem

Each trip is

```text
Passengers

Start

End
```

Determine whether the car capacity is exceeded.

---

## Key Observation

At

```text
Start
```

Passengers enter.

At

```text
End
```

Passengers leave.

Exactly a Difference Array problem.

---

## Solution

```python
def car_pooling(trips, capacity):

    MAX = max(end for _, _, end in trips)

    diff = [0] * (MAX + 1)

    for passengers, start, end in trips:

        diff[start] += passengers

        diff[end] -= passengers

    curr = 0

    for x in diff:

        curr += x

        if curr > capacity:
            return False

    return True
```

---

## Complexity

- **Time Complexity:** **$O(n+m)$**
    
- **Auxiliary Space Complexity:** **$O(m)$**
    

where `m` is the maximum location.

---

# 4. Maximum Coverage Point

## Problem

Given many intervals,

find the point covered by the maximum number of intervals.

Example

```text
[1,5]

[2,7]

[4,8]
```

Output

```text
4
```

---

## Key Observation

This is exactly

> Maximum Appearing Element in Range Queries

---

## Solution

```python
diff[L] += 1

diff[R+1] -= 1

↓

Prefix Sum

↓

Maximum Prefix Value
```

---

## Complexity

- **Time Complexity:** **$O(n+m)$**
    
- **Auxiliary Space Complexity:** **$O(m)$**
    

---

# 5. Street Lights / Wi-Fi Coverage

## Problem

Each light covers

```text
[position-radius,

position+radius]
```

Determine

- whether every position is covered,
    
- or the number of lights covering each position.
    

---

## Key Observation

Every light contributes to a range.

Again,

Difference Array.

---

## Solution

```python
diff[left] += 1

diff[right+1] -= 1

↓

Prefix Sum

↓

Coverage Count
```

Then,

```python
coverage[i] == 0
```

means position `i` is uncovered.

---

## Complexity

- **Time Complexity:** **$O(n+m)$**
    
- **Auxiliary Space Complexity:** **$O(m)$**
    

---

# 6. Skyline / Sweep Line Problems

## Problem

Buildings overlap.

Determine

- visible skyline,
    
- maximum active buildings,
    
- event overlaps.
    

---

## Key Idea

Instead of incrementing every point,

convert every interval into

```text
Start Event

+

End Event
```

Sort the events,

then sweep from left to right.

---

## Difference from Difference Array

Difference Array

```text
Discrete integer coordinates
```

Sweep Line

```text
General coordinates

Large values

Floating-point values
```

The underlying intuition is the same:

Track where intervals **begin** and **end**.

---

## Complexity

Usually

- **Time Complexity:** **$O(n\log n)$**
    
- **Auxiliary Space Complexity:** **$O(n)$**
    

because events must be sorted.

---

# Pattern Recognition

|If the Question Says...|Think...|
|---|---|
|Add to every element in a range|Difference Array|
|Many range updates|Difference Array|
|Final array after updates|Difference Array|
|Passenger bookings|Difference Array|
|Coverage of intervals|Difference Array|
|Maximum overlap|Difference Array / Sweep Line|
|Large coordinates|Sweep Line|

---

# Difference Array vs Sweep Line

|Difference Array|Sweep Line|
|---|---|
|Integer indices|Any coordinates|
|Prefix Sum|Sorted Events|
|**$O(n+m)$**|**$O(n\log n)$**|
|Small coordinate range|Huge coordinate range|

---

# Master Interview Template

Almost every Difference Array problem can be solved by following these four steps:

### Step 1

Create a Difference Array.

### Step 2

For every interval

```python
diff[L] += value

diff[R+1] -= value
```

### Step 3

Compute the Prefix Sum.

### Step 4

Answer the question using the reconstructed array.

---

# Key Takeaways

The majority of FAANG questions based on range updates reduce to one of these two templates:

### Difference Array

```python
diff[L] += val

diff[R+1] -= val

↓

Prefix Sum
```

### Sweep Line

```python
Start Event

End Event

↓

Sort Events

↓

Sweep
```

|Problem|Technique|
|---|---|
|Range Addition|Difference Array|
|Corporate Flight Bookings|Difference Array|
|Car Pooling|Difference Array|
|Maximum Appearing Element|Difference Array|
|Street Light Coverage|Difference Array|
|Skyline Problem|Sweep Line|

> **Interview Tip:** Don't memorize six separate algorithms. Recognize the underlying pattern:
> 
> - **Range updates on a bounded integer array** → **Difference Array**.
>     
> - **Intervals on large or arbitrary coordinates** → **Sweep Line**.
>     
> 
> These two techniques solve a surprisingly large class of interval and range-update problems.