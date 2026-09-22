---
Title: Postfix to Infix & Evaluation of Postfix (Leetcode 150)
Companies: [Apollo.io, Canonical, Citigroup, Citadel, Grammarly, Yandex, Anduril, Tesla, LinkedIn, Amazon, Bloomberg, Microsoft, Meta, Google, Infosys, Apple, Oracle, Goldman Sachs]
Topics:
  - Stack
Platform:
  - Leetcode
Difficulty: Hard
Other Tags:
Link: ""
Rating:
  - ⭐⭐⭐
Groups:
  - Operators Notation
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Postfix to Infix & Evaluation of Postfix (Leetcode 150)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

It has two parts - converting to infix and evaluating the expression . See both below. Both are O(n) in time and aux. space complexity

---

# Postfix to Infix & Evaluation of Postfix (Leetcode 150)

**Tags:** #Stack #Expressions #Parsing #ReversePolishNotation #Postfix #Strings #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Postfix (Reverse Polish Notation) expressions place operators **after** their operands.

Two common interview problems are:

1. **Postfix → Infix**: Reconstruct the equivalent infix expression.
    
2. **Evaluate Postfix**: Compute the numerical value of the expression (LC 150).
    

**Examples**

|Postfix|Infix|Value|
|---|---|--:|
|`AB+C*`|`(A+B)*C`|—|
|`23+5*`|`(2+3)*5`|25|
|`2 1 + 3 *`|`(2+1)*3`|9|

---

# Postfix Refresher

In postfix, operators always operate on the **two most recent operands**.

Example:

```text
23+5*

Read left → right

2 3 +  → 5
5 5 *  → 25
```

This naturally suggests a **stack**.

---

# Part 1 — Postfix to Infix

## Core Insight

Whenever an operator appears:

- Pop the **right operand**
    
- Pop the **left operand**
    
- Form `(left operator right)`
    
- Push the resulting expression back
    

The order of popping is extremely important.

---

## Algorithm

For each character:

- Operand → Push onto stack
    
- Operator →
    
    - `right = pop()`
        
    - `left = pop()`
        
    - Push `("(" + left + op + right + ")")`
        

At the end, the stack contains one complete infix expression.

---

## Python Implementation

```python
def postfixToInfix(exp):

    stack = []

    for ch in exp:

        if ch.isalnum():
            stack.append(ch)

        else:
            right = stack.pop()
            left = stack.pop()

            stack.append("(" + left + ch + right + ")")

    return stack[-1]
```

---

## Dry Run

**Input**

```text
AB+C*
```

|Symbol|Stack|
|---|---|
|A|A|
|B|A B|
|+|(A+B)|
|C|(A+B) C|
|*|((A+B)*C)|

Answer:

```text
((A+B)*C)
```

Outer parentheses are harmless.

---

## Why Right Is Popped First

Consider:

```text
AB-
```

Correct infix:

```text
A-B
```

Stack before `-`:

```text
Top
B
A
```

Pop order:

```text
right = B
left  = A
```

Result:

```text
A-B
```

If reversed, we'd incorrectly obtain `B-A`.

> **Mnemonic:** First pop = Right operand, Second pop = Left operand.

---

# Part 2 — Evaluate Postfix (LC 150)

## Problem Statement

Given a list of tokens representing a postfix expression, evaluate its value.

Division truncates toward **zero**.

Example:

```text
["2","1","+","3","*"]
```

Output:

```text
9
```

---

## Core Insight

Exactly the same stack pattern, except we store **integers** instead of strings.

### Algorithm

For each token:

- Number → Push
    
- Operator →
    
    - Pop right
        
    - Pop left
        
    - Compute `left op right`
        
    - Push result
        

The final stack element is the answer.

---

## Python Implementation

```python
class Solution:
    def evalRPN(self, tokens):

        stack = []

        for token in tokens:

            if token not in "+-*/":
                stack.append(int(token))

            else:
                b = stack.pop()
                a = stack.pop()

                if token == "+":
                    stack.append(a + b)

                elif token == "-":
                    stack.append(a - b)

                elif token == "*":
                    stack.append(a * b)

                else:
                    stack.append(int(a / b))

        return stack[-1]
```

---

## Dry Run

**Tokens**

```text
["4","13","5","/","+"]
```

### Stack Evolution

|Token|Stack|
|---|---|
|4|4|
|13|4 13|
|5|4 13 5|
|/|4 2|
|+|6|

Answer = **6**

---

## Integer Division Caveat

Python's `//` performs **floor division**, not truncation toward zero.

Example:

|Expression|Required|`//`|
|---|--:|--:|
|`5/2`|2|2|
|`-5/2`|-2|-3|

Correct implementation:

```python
int(a / b)
```

This truncates toward zero exactly as Leetcode specifies.

---

## Correctness

### Invariant

After processing any prefix of the postfix expression, the stack contains the values (or subexpressions) of all completely evaluated operands.

Whenever an operator appears:

- The top two stack elements are exactly its operands.
    
- Their order is preserved by popping **right first**.
    

Thus every operation is evaluated correctly.

---

## Complexity

|Problem|Time|Auxiliary Space|
|---|--:|--:|
|Postfix → Infix|O(n)|O(n)|
|Evaluate Postfix|O(n)|O(n)|

Each token is pushed and popped exactly once.

---

## Common Mistakes

### 1. Reversing Operand Order

Wrong:

```python
a = stack.pop()
b = stack.pop()
stack.append(a - b)
```

Correct:

```python
right = stack.pop()
left = stack.pop()
stack.append(left - right)
```

This matters for `-` and `/`.

### 2. Using `//` for Division

Wrong:

```python
stack.append(a // b)
```

Fails for negative values.

Correct:

```python
stack.append(int(a / b))
```

### 3. Treating Digits as Characters

Leetcode provides **tokens**, not a continuous string.

Correct:

```python
int(token)
```

not

```python
ord(token)
```

---

## Relationship to Expression Problems

|Conversion / Evaluation|Stack Stores|
|---|---|
|Infix → Postfix|Operators|
|Infix → Prefix|Operators|
|Postfix → Infix|Strings|
|Prefix → Infix|Strings|
|Evaluate Postfix|Integers|
|Evaluate Prefix|Integers|

The underlying pattern is identical—the only thing changing is **what the stack represents**.

---

## Pattern Recognition

### Expression Conversion

- Stack stores **partial expressions**
    
- Pop right, pop left, combine, push
    

### Expression Evaluation

- Stack stores **computed values**
    
- Pop right, pop left, evaluate, push
    

> **Interview Heuristic:** In postfix, every operator immediately consumes the **two most recent operands**, making the stack the natural evaluation model.