---
Title: Prefix to Infix & Evaluation of Prefix
Companies:
  - Not Specified
Topics:
  - Stack
Platform:
  - GFG
Difficulty: Hard
Other Tags:
Link: ""
Rating:
Groups:
  - Operators Notation
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>


# Prefix to Infix & Evaluation of Prefix

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

It has two parts - See both below . Both are O(n) and O(n) in time and aux. space complexity

---

# Prefix to Infix & Evaluation of Prefix

**Tags:** #Stack #Expressions #Parsing #Prefix #PolishNotation #Strings #Interview-Pattern #FAANG

## Problem Statement

Prefix (Polish Notation) places the **operator before its operands**.

Two common interview problems are:

1. **Prefix → Infix**: Convert a prefix expression into infix.
    
2. **Evaluate Prefix**: Compute the numerical value of a prefix expression.
    

### Examples

|Prefix|Infix|Value|
|---|---|--:|
|`*+ABC`|`(A+B)*C`|—|
|`*+235`|`(2+3)*5`|25|
|`-+7*45+20`|`(7+(4×5))-(2+0)`|25|

---

# Prefix Refresher

Unlike postfix, prefix is processed **from right to left**.

Example:

```text
* + 2 3 5
```

Think recursively:

```text
      *
     / \
    +   5
   / \
  2   3
```

Result:

```text
(2+3)*5
```

This naturally leads to a stack processed **right → left**.

---

# Part 1 — Prefix to Infix

## Core Insight

Traverse from **right to left**.

Whenever an operator appears:

- Pop the **left operand**
    
- Pop the **right operand**
    
- Combine into `(left operator right)`
    
- Push back
    

Notice the operand order is opposite to postfix.

---

## Algorithm

For each symbol (right → left):

- Operand → Push
    
- Operator →
    
    - `left = pop()`
        
    - `right = pop()`
        
    - Push `("(" + left + op + right + ")")`
        

The final stack element is the complete infix expression.

---

## Python Implementation

```python
def prefixToInfix(exp):

    stack = []

    for ch in reversed(exp):

        if ch.isalnum():
            stack.append(ch)

        else:
            left = stack.pop()
            right = stack.pop()

            stack.append("(" + left + ch + right + ")")

    return stack[-1]
```

---

## Dry Run

**Input**

```text
*+ABC
```

Traverse from right:

```text
C B A + *
```

|Symbol|Stack|
|---|---|
|C|C|
|B|C B|
|A|C B A|
|+|C (A+B)|
|*|((A+B)*C)|

Answer:

```text
((A+B)*C)
```

---

## Why Left Is Popped First?

Consider:

```text
-AB
```

Desired infix:

```text
A-B
```

After scanning from right:

```text
Stack:

Top
A
B
```

Pop order:

```text
left  = A
right = B
```

Result:

```text
A-B
```

If reversed, we'd incorrectly obtain `B-A`.

> **Mnemonic:** Prefix scans right-to-left, so the **first pop is the left operand**.

---

# Part 2 — Evaluation of Prefix

## Core Insight

Exactly the same algorithm, but store **integers** instead of strings.

Traverse from **right to left**.

Whenever an operator appears:

1. Pop left operand
    
2. Pop right operand
    
3. Compute
    
4. Push result
    

---

## Python Implementation

```python
def evaluatePrefix(exp):

    stack = []

    for ch in reversed(exp):

        if ch.isdigit():
            stack.append(int(ch))

        else:
            left = stack.pop()
            right = stack.pop()

            if ch == '+':
                stack.append(left + right)

            elif ch == '-':
                stack.append(left - right)

            elif ch == '*':
                stack.append(left * right)

            else:
                stack.append(int(left / right))

    return stack[-1]
```

---

## Dry Run

**Expression**

```text
*+235
```

Reverse traversal:

```text
5 3 2 + *
```

|Symbol|Stack|
|---|---|
|5|5|
|3|5 3|
|2|5 3 2|
|+|5 5|
|*|25|

Answer:

```text
25
```

---

## Prefix vs Postfix

### Conversion

|Aspect|Prefix|Postfix|
|---|---|---|
|Traverse|Right → Left|Left → Right|
|First Pop|Left|Right|
|Second Pop|Right|Left|

### Evaluation

|Expression|Pop Order|
|---|---|
|Prefix|Left, Right|
|Postfix|Right, Left|

This is the only conceptual difference.

---

## Integer Division Caveat

Like LC 150, division truncates toward **zero**.

Correct:

```python
int(left / right)
```

Avoid:

```python
left // right
```

because floor division is incorrect for negative values.

---

## Correctness

### Invariant

After processing any suffix of the prefix expression, the stack contains fully constructed subexpressions (or their evaluated values).

Whenever an operator appears:

- The top two stack elements are exactly its **left** and **right** operands.
    
- Combining them reconstructs the expression correctly.
    

Thus the algorithm is correct by induction.

---

## Complexity

|Problem|Time|Auxiliary Space|
|---|--:|--:|
|Prefix → Infix|O(n)|O(n)|
|Evaluate Prefix|O(n)|O(n)|

Each symbol is pushed and popped exactly once.

---

## Common Mistakes

### 1. Traversing Left to Right

Prefix must be processed **right → left**.

Wrong:

```text
*+ABC
```

Correct traversal:

```text
C B A + *
```

### 2. Reversing Operand Order

Wrong:

```python
right = pop()
left = pop()
```

Correct:

```python
left = pop()
right = pop()
```

because the traversal is already reversed.

### 3. Using Floor Division

Use:

```python
int(left / right)
```

to match truncation toward zero.

---

## Relationship to Expression Problems

|Problem|Traverse|Stack Stores|
|---|---|---|
|Infix → Postfix|Left → Right|Operators|
|Infix → Prefix|Reverse + Postfix|Operators|
|Postfix → Infix|Left → Right|Strings|
|Prefix → Infix|Right → Left|Strings|
|Evaluate Postfix|Left → Right|Integers|
|Evaluate Prefix|Right → Left|Integers|

Together, these six problems form the complete stack-based expression toolkit.

---

## Pattern Recognition

### Prefix Conversion

- Traverse **right → left**
    
- Operand → Push
    
- Operator → Pop **left**, then **right**, combine
    

### Prefix Evaluation

- Traverse **right → left**
    
- Operand → Push value
    
- Operator → Pop **left**, **right**, evaluate
    

> **Interview Heuristic:** **Postfix looks forward, Prefix looks backward.** Simply reverse the traversal direction, and the operand pop order flips accordingly.