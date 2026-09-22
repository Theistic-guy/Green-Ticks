---
Title: Infix to Postfix (Shunting Yard Algorithm)
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

# Infix to Postfix (Shunting Yard Algorithm)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def infixToPostfix(exp):

    prec = {
        '+':1,
        '-':1,
        '*':2,
        '/':2,
        '^':3
    }

    stack = []
    ans = []

    for ch in exp:

        if ch.isalnum():
            ans.append(ch)

        elif ch == '(':
            stack.append(ch)

        elif ch == ')':

            while stack and stack[-1] != '(':
                ans.append(stack.pop())

            stack.pop()

        else:

            while (
                stack
                and stack[-1] != '('
                and (
                    prec[stack[-1]] > prec[ch]
                    or (
                        prec[stack[-1]] == prec[ch]
                        and ch != '^'
                    )
                )
            ):
                ans.append(stack.pop())

            stack.append(ch)

    while stack:
        ans.append(stack.pop())

    return "".join(ans)

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---


# Infix to Postfix (Shunting Yard Algorithm)

**Tags:** #Stack #Expressions #Parsing #OperatorPrecedence #Associativity #Strings #Interview-Pattern #FAANG

## Problem Statement

Convert an **infix expression** into its equivalent **postfix (Reverse Polish Notation)** expression.

The expression may contain:

- Operands: `A-Z`, `a-z`, `0-9`
    
- Operators: `+ - * / ^`
    
- Parentheses: `(` `)`
    

**Examples**

|Infix|Postfix|
|---|---|
|`A+B`|`AB+`|
|`A+B*C`|`ABC*+`|
|`(A+B)*C`|`AB+C*`|
|`A^B^C`|`ABC^^`|

---

## Prefix, Infix & Postfix

|Notation|Example|
|---|---|
|Infix|`A + B`|
|Prefix|`+AB`|
|Postfix|`AB+`|

The advantage of postfix is that **no parentheses are required** because operator order is unambiguous.

Example:

```text
A + B * C

Infix   : A + (B*C)
Postfix : ABC*+
```

---

## Core Insight

Operands are output immediately.

**Operators wait** until we're sure they should be evaluated.

A **stack** stores operators according to:

1. Parentheses
    
2. Precedence
    
3. Associativity
    

This is Dijkstra's **Shunting Yard Algorithm**.

---

## Operator Precedence

|Operator|Precedence|Associativity|
|---|--:|---|
|`^`|3|Right|
|`* /`|2|Left|
|`+ -`|1|Left|

Higher precedence operators are evaluated first.

---

## Associativity (Very Important)

### Left Associative

Operators of equal precedence evaluate **left → right**.

```text
A - B - C

(A-B)-C
```

While processing `-`, we **pop equal precedence** operators.

### Right Associative

Exponentiation is different.

```text
A ^ B ^ C

A^(B^C)
```

We **do not pop equal precedence** `^`.

This is the most common interview mistake.

---

## Algorithm

Scan the expression from left to right.

### Rule 1 — Operand

Append directly to the answer.

```text
A+B

Output: A
```

### Rule 2 — Opening Parenthesis

Push onto the stack.

```text
(A+B

Stack:
(
```

### Rule 3 — Closing Parenthesis

Pop until `(`.

```text
(A+B)

Output:
AB+

Stack:
empty
```

Discard the parentheses.

### Rule 4 — Operator

Pop while:

- stack top has higher precedence, or
    
- same precedence **and** current operator is left-associative.
    

Then push the current operator.

---

## Pop Condition

### Left Associative

For `+ - * /`

```python
while precedence(top) >= precedence(curr):
```

### Right Associative (`^`)

```python
while precedence(top) > precedence(curr):
```

Notice the strict `>`.

This single difference preserves right associativity.

---

## Python Implementation

```python
def infixToPostfix(exp):

    prec = {
        '+':1,
        '-':1,
        '*':2,
        '/':2,
        '^':3
    }

    stack = []
    ans = []

    for ch in exp:

        if ch.isalnum():
            ans.append(ch)

        elif ch == '(':
            stack.append(ch)

        elif ch == ')':

            while stack and stack[-1] != '(':
                ans.append(stack.pop())

            stack.pop()

        else:

            while (
                stack
                and stack[-1] != '('
                and (
                    prec[stack[-1]] > prec[ch]
                    or (
                        prec[stack[-1]] == prec[ch]
                        and ch != '^'
                    )
                )
            ):
                ans.append(stack.pop())

            stack.append(ch)

    while stack:
        ans.append(stack.pop())

    return "".join(ans)
```

---

## Dry Run

### Example 1

```text
A+B*C
```

|Symbol|Stack|Output|
|---|---|---|
|A|—|A|
|+|+|A|
|B|+|AB|
|*|+ *|AB|
|C|+ *|ABC|
|End|—|ABC*+|

Answer:

```text
ABC*+
```

---

### Example 2

```text
(A+B)*C
```

|Symbol|Stack|Output|
|---|---|---|
|(|(|—|
|A|(|A|
|+|( +|A|
|B|( +|AB|
|)|—|AB+|
|*|*|AB+|
|C|*|AB+C|
|End|—|AB+C*|

Answer:

```text
AB+C*
```

---

### Example 3 (Right Associativity)

```text
A^B^C
```

Process:

|Symbol|Stack|Output|
|---|---|---|
|A|—|A|
|^|^|A|
|B|^|AB|
|^|^ ^|AB|
|C|^ ^|ABC|
|End|—|ABC^^|

Correct postfix:

```text
ABC^^
```

This represents:

```text
A^(B^C)
```

---

## Why the Pop Condition Works

Suppose current operator is `+`.

```text
Stack:
*

Current:
+
```

`*` has higher precedence, so it must be evaluated first.

Pop it.

Now suppose:

```text
Stack:
-

Current:
-
```

Subtraction is left-associative.

Earlier `-` must execute first.

Hence we also pop equal precedence.

For `^`, we **don't** pop equal precedence because exponentiation associates to the right.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

Each character is pushed and popped at most once.

---

## Common Mistakes

### 1. Treating `^` as Left Associative

Wrong output:

```text
AB^C^
```

Correct:

```text
ABC^^
```

Use `>` instead of `>=` for `^`.

### 2. Forgetting to Pop Remaining Operators

After scanning finishes:

```python
while stack:
    ans.append(stack.pop())
```

Otherwise trailing operators are lost.

### 3. Outputting Parentheses

Parentheses are **never** part of postfix.

They only control stack behavior.

---

## Relationship to Other Expression Problems

|Problem|Direction|
|---|---|
|Infix → Postfix|Parsing with stack|
|Infix → Prefix|Reverse + Postfix trick|
|Postfix Evaluation|Operand stack|
|Prefix Evaluation|Right-to-left stack|

These four problems form the core stack-based expression family.

---

## Pattern Recognition

Whenever an expression involves:

- Operator precedence
    
- Parentheses
    
- Associativity
    
- Expression conversion
    

Think **Operator Stack**.

### Universal Rules

1. Operand → Output
    
2. `(` → Push
    
3. `)` → Pop until `(`
    
4. Operator → Pop higher (and equal if left-associative)
    
5. Pop remaining stack at the end
    

> **Interview Heuristic:** The only subtle part is the pop condition—`>=` for left-associative operators, but `>` for right-associative `^`.