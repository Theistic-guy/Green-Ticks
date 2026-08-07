---
tags:
  - recursion
  - josephus
---
See Also:
+ Why simply add 1 to the final answer in 1-based indexing Josephus. [1](#Josephus%20Problem%200-Indexed%20vs%201-Indexed%20Justification)
+ Why we add K to the new numbering to get back to original [2](#The%20Two%20Worlds)
+ (Extras) - [Variants of Josephus problem](Extras/Variants%20of%20Josephus%20problem.md)
# Josephus Problem

Suppose there are

```text
n people
```

standing in a circle.

Every

```text
k-th
```

person is eliminated.

Find the survivor.

The famous recurrence is

```text
J(1, k) = 0

J(n, k) = (J(n-1, k) + k) % n
```

Most books simply state it.

The real question is

> **Where does this formula come from?**

---

# Step 1 — Forget Recursion

Let's first simulate one example.

Suppose

```text
n = 5

k = 3
```

People are

```text
0   1   2   3   4
```

The first eliminated person is

```text
2
```

because

```text
1

2

3 ← remove
```

Now the circle becomes

```text
0   1   3   4
```

But here's the interesting part.

The game **doesn't restart from 0**.

It continues from

```text
3
```

---

# Step 2 — Pretend This Is a Brand New Problem

Instead of thinking

```text
0 1 3 4
```

think

> "This is just another Josephus problem with four people."

To do that,

renumber everyone.

Current circle

```text
3   4   0   1
```

becomes

```text
0   1   2   3
```

Notice the correspondence.

```text
Old Number

3 → New 0

4 → New 1

0 → New 2

1 → New 3
```

This is the whole trick.

---

# Visual

Original

```text
             0

      4             1


      3             2  ← removed
```

Game resumes here

↓

```text
3
```

Now imagine rotating the circle until

```text
3
```

comes first.

```text
3   4   0   1
```

Now simply rename

```text
3→0

4→1

0→2

1→3
```

You now have

```text
0 1 2 3
```

which is exactly the same problem,

just smaller.

---

# The Big Insight

After removing one person,

the remaining game is **identical** to

```text
Josephus(n−1,k)
```

except that

the numbering has shifted.

That's why recursion works.

---

# Step 3 — Suppose You Already Know the Winner

Imagine recursion tells us

```text
J(4,3)=0
```

Meaning

> In the renumbered world,

person

```text
0
```

survives.

Question:

Who is that in the original numbering?

---

Look at the mapping again.

```text
Renumbered

0

↓

Original

3
```

So

```text
J(5,3)=3
```

Done.

---

# Another Example

Suppose

```text
n=7

k=2
```

People

```text
0 1 2 3 4 5 6
```

First removed

```text
1
```

Remaining

```text
2 3 4 5 6 0
```

Renumber

```text
Old

2 3 4 5 6 0

↓

New

0 1 2 3 4 5
```

Suppose recursion says

```text
Winner = 4
```

in the new numbering.

Who is

```text
New 4 ?
```

Mapping

```text
New

0 1 2 3 4 5

↓

Old

2 3 4 5 6 0
```

Therefore

```text
Winner

=6
```

---

# So where does

```text
(J(n−1,k)+k)%n
```

come from?

Let's derive it.

After deleting

```text
k−1
```

steps,

the next person becomes

the new

```text
0
```

Exactly

```text
k
```

positions ahead of the old

```text
0
```

Therefore

```text
Old Number

=

New Number

+

k
```

Since the circle wraps,

```text
Old

=

(New+k)%n
```

Substitute

```text
New

=

J(n−1,k)
```

Hence

```text
J(n,k)

=

(J(n−1,k)+k)%n
```

That's the recurrence.

---

# Why exactly **+k**?

Many students think

> Shouldn't it be

```text
+k−1
```

No.

Remember,

the eliminated person disappears.

The **next** person starts counting again and becomes the new zero.

That person is exactly

```text
k
```

positions ahead of the previous zero.

So the shift is

```text
+k
```

not

```text
+k−1
```

---

# The Mental Model I Use

I never memorize the recurrence.

I imagine this every time:

```text
Remove one person

↓

Rotate the circle so that the next survivor candidate becomes the first person

↓

Rename everyone from 0

↓

Solve the smaller problem

↓

Rotate the answer back
```

The recurrence is simply the mathematical version of

> **Rotate → Solve → Rotate Back**

---
---

# Interview One-Liner

> After the first elimination, the remaining people still form the same Josephus problem with `n−1` people. The only difference is that the circle now starts from the person immediately after the eliminated one. We renumber that person as `0`, solve the smaller problem recursively, and then convert the winner back to the original numbering by undoing the rotation. Since the circle has effectively rotated by `k` positions, the original index is `(J(n−1, k) + k) % n`.

---

## Josephus Problem: 0-Indexed vs 1-Indexed Justification

## 📌 Core Principle

The Josephus recurrence relies on the modulo operator (`%`), which inherently maps numbers to a 0-bound range (0 to i-1). Computing the entire problem in a 0-indexed space keeps the math clean and optimal.

---

## 💡 Interview Justification Points

- Modulo Conflict: In a 1-indexed system, `(ans + k) % i` can return `0`. A result of `0` actually means the i-th person.
- Overhead of 1-Indexed Loops: To force a 1-indexed loop, you must constantly shift back and forth: `ans = ((ans - 1 + k) % i) + 1`. This adds unnecessary operations to every iteration.
- Isomorphic Mapping: The elimination order and relative spacing are identical in both systems. Person `0` in a 0-indexed array is strictly Person `1` in a 1-indexed array.
- Optimization: It is mathematically optimal to run the entire simulation in a clean 0-indexed space, and perform a single, final +1 translation at the very end to match 1-based constraints.

---

## 💻 Code Comparison

```python
# 0-Indexed Universe (Optimal)
def josephus_0_indexed(n, k):
    ans = 0
    for i in range(2, n + 1):
        ans = (ans + k) % i
    return ans  # Return ans + 1 for 1-indexed result

# Forced 1-Indexed Universe (Suboptimal)
def josephus_1_indexed(n, k):
    ans = 1  # 1-based base case
    for i in range(2, n + 1):
        ans = ((ans - 1 + k) % i) + 1  # Shift down, modulo, shift up
    return ans
```

---
---
# The Two Worlds

After the first elimination, there are **two numbering systems**.

## Original numbering

```text
0   1   2   3   4
```

Suppose

```text
2
```

is eliminated.

Remaining people are

```text
0   1   3   4
```

---

## Renumbered (smaller problem)

We rotate so that counting restarts from `3`.

```
3   4   0   1
```

Now rename them

```text
0   1   2   3
```

So the mapping is

|Original|New|
|---|---|
|3|0|
|4|1|
|0|2|
|1|3|

Notice something important:

This table converts

```text
Original → New
```

---

# Which answer does recursion give?

Recursion solves

```text
J(4,3)
```

It **does not know** about the original numbering.

Suppose it returns

```text
1
```

That means

```text
New numbering

Winner = 1
```

NOT

```text
Original numbering

Winner = 1
```

That's the crucial distinction.

---

# Now we must convert

We have

```text
New = 1
```

We want

```text
Original = ?
```

Look at the table.

```
Original   New

4    --->   1
```

Therefore

```
Original = 4
```

We are converting

```text
New → Original
```

---

# Where does +k come from?

Think of the renumbering as rotating the circle.

Original

```
0 1 3 4
```

Rotate

```
3 4 0 1
```

The new zero corresponds to

```text
Original k-th position
```

So

```
New 0

=

Original k
```

Likewise

```
New 1

=

Original k+1
```

Generalizing

```
Original

=

(New + k) mod n
```

We're **undoing the rotation**.

---

# Your doubt

You asked:

> Shouldn't adding `k` move us from the original numbering to the new numbering?

Actually, yes!

But notice that's the **opposite direction**.

Let's derive both mappings.

---

## Original → New

Suppose

```
Original = x
```

After rotating,

everything shifts **left** by `k`.

So

```
New

=

(x - k) mod n
```

---

## New → Original

To reverse that,

add the shift back.

```
Original

=

(New + k) mod n
```

Exactly like walking back after taking a step forward.

---

# A real-world analogy

Imagine a circular table with seat numbers.

Originally:

```
Seat

0 1 2 3 4
```

Now rotate the entire table three seats to the left.

A person who was at seat

```
3
```

is now sitting at

```
0
```

Question:

If someone says

> "I'm at new seat 0."

How do you find their original seat?

You **undo** the rotation.

```
0 + 3 = 3
```

Exactly what the recurrence does.

---

# The beautiful insight

The recursive call returns

> **"The winner in my renumbered world is person X."**

But the interviewer asks

> **"Who is that person in the original world?"**

So we must translate

```
Renumbered

↓

Original
```

Undoing the rotation requires

```
+k
```

---

## The key sentence to remember

> **The recursive answer is expressed in the renumbered (rotated) coordinate system. The recurrence adds `k` because it converts the winner back to the original coordinate system by undoing the rotation.**

This is exactly why the recurrence is:

```text
J(n,k) = (J(n−1,k) + k) % n
```

—not because we're moving **forward** in the game, but because we're **translating the answer back** from the smaller problem's numbering to the original numbering. That's the subtle but fundamental distinction.