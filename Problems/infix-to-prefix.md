---
Title: Infix to Prefix (Shunting Yard Variant)
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
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Infix to Prefix (Shunting Yard Variant)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def infixToPrefix(exp):

    prec = {
        '+':1,
        '-':1,
        '*':2,
        '/':2,
        '^':3
    }

    # Step 1: Reverse
    exp = exp[::-1]

    # Step 2: Swap parentheses
    temp = []
    for ch in exp:
        if ch == '(':
            temp.append(')')
        elif ch == ')':
            temp.append('(')
        else:
            temp.append(ch)

    exp = "".join(temp)

    # Step 3: Modified Infix -> Postfix
    stack = []
    postfix = []

    for ch in exp:

        if ch.isalnum():
            postfix.append(ch)

        elif ch == '(':
            stack.append(ch)

        elif ch == ')':
            while stack and stack[-1] != '(':
                postfix.append(stack.pop())
            stack.pop()

        else:
            while (
                stack and stack[-1] != '(' and
                (
                    prec[stack[-1]] > prec[ch] or
                    (prec[stack[-1]] == prec[ch] and ch == '^')
                )
            ):
                postfix.append(stack.pop())

            stack.append(ch)

    while stack:
        postfix.append(stack.pop())

    # Step 4: Reverse postfix
    return "".join(postfix[::-1])

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---


# Infix to Prefix (Shunting Yard Variant)

**Tags:** #Stack #Expressions #Parsing #OperatorPrecedence #Associativity #Strings #Interview-Pattern #FAANG

## Problem Statement

Convert an **infix expression** into its equivalent **prefix (Polish Notation)** expression.

The expression may contain:

* Operands: `A-Z`, `a-z`, `0-9`
* Operators: `+ - * / ^`
* Parentheses: `(` `)`

### Examples

| Infix     | Prefix  |
| --------- | ------- |
| `A+B`     | `+AB`   |
| `A+B*C`   | `+A*BC` |
| `(A+B)*C` | `*+ABC` |
| `A^B^C`   | `^A^BC` |

---

## Core Insight

The cleanest approach is **not** to write a new algorithm.

Instead, transform the problem into **Infix → Postfix**.

### The 3-Step Trick

1. **Reverse** the infix string.
2. **Swap** `(` and `)`.
3. Convert the modified expression to **postfix**.
4. Reverse the postfix result.

```text
Infix
   ↓ Reverse
Reverse String
   ↓ Swap Parentheses
Modified Infix
   ↓ Infix → Postfix
Postfix
   ↓ Reverse
Prefix
```

This is the standard interview solution.

---

## Why Does This Work?

Consider:

```text
(A+B)*C
```

### Step 1 — Reverse

```text
C*)B+A(
```

### Step 2 — Swap Parentheses

```text
C*(B+A)
```

This is now a valid infix expression (of the reversed problem).

### Step 3 — Postfix

```text
CAB+*
```

### Step 4 — Reverse

```text
*+ABC
```

Correct prefix obtained.

---

## Why Associativity Changes

This is the subtle interview point.

In the original postfix algorithm:

* Left-associative operators pop on `>=`
* Right-associative `^` pops on `>`

After reversing the expression, **associativity effectively flips**.

### Original

```text
A ^ B ^ C

A ^ (B ^ C)
```

### Reversed

```text
C ^ B ^ A
```

Now, while generating postfix, `^` behaves like a **left-associative** operator.

Therefore, in the modified postfix conversion:

* `^` uses `>=`
* `+ - * /` use `>`

This is the most commonly asked follow-up.

---

## Operator Rules (After Reversal)

| Operator  | Pop Condition                |
| --------- | ---------------------------- |
| `+ - * /` | Higher precedence only (`>`) |
| `^`       | Higher or equal (`>=`)       |

Notice this is exactly the opposite of infix → postfix.

---

## Algorithm

1. Reverse the string.
2. Swap every `(` with `)` and vice versa.
3. Run the modified postfix algorithm.
4. Reverse the output.

---

## Python Implementation

```python
def infixToPrefix(exp):

    prec = {
        '+':1,
        '-':1,
        '*':2,
        '/':2,
        '^':3
    }

    # Step 1: Reverse
    exp = exp[::-1]

    # Step 2: Swap parentheses
    temp = []
    for ch in exp:
        if ch == '(':
            temp.append(')')
        elif ch == ')':
            temp.append('(')
        else:
            temp.append(ch)

    exp = "".join(temp)

    # Step 3: Modified Infix -> Postfix
    stack = []
    postfix = []

    for ch in exp:

        if ch.isalnum():
            postfix.append(ch)

        elif ch == '(':
            stack.append(ch)

        elif ch == ')':
            while stack and stack[-1] != '(':
                postfix.append(stack.pop())
            stack.pop()

        else:
            while (
                stack and stack[-1] != '(' and
                (
                    prec[stack[-1]] > prec[ch] or
                    (prec[stack[-1]] == prec[ch] and ch == '^')
                )
            ):
                postfix.append(stack.pop())

            stack.append(ch)

    while stack:
        postfix.append(stack.pop())

    # Step 4: Reverse postfix
    return "".join(postfix[::-1])
```

---

## Dry Run

### Example 1

**Infix**

```text
A+B*C
```

| Step    | Result  |
| ------- | ------- |
| Reverse | `C*B+A` |
| Postfix | `CB*A+` |
| Reverse | `+A*BC` |

Answer:

```text
+A*BC
```

---

### Example 2

**Infix**

```text
(A+B)*C
```

| Step    | Result    |
| ------- | --------- |
| Reverse | `C*)B+A(` |
| Swap    | `C*(B+A)` |
| Postfix | `CAB+*`   |
| Reverse | `*+ABC`   |

Answer:

```text
*+ABC
```

---

### Example 3 (Exponentiation)

**Infix**

```text
A^B^C
```

| Step             | Result  |
| ---------------- | ------- |
| Reverse          | `C^B^A` |
| Modified Postfix | `CB^A^` |
| Reverse          | `^A^BC` |

Correct prefix:

```text
^A^BC
```

which represents:

```text
A^(B^C)
```

---

## Complexity

| Metric          |    Value |
| --------------- | -------: |
| Time            | **O(n)** |
| Auxiliary Space | **O(n)** |

Every character is processed a constant number of times.

---

## Infix → Postfix vs Infix → Prefix

| Aspect             | Postfix      | Prefix         |
| ------------------ | ------------ | -------------- |
| Traverse           | Left → Right | Reverse first  |
| Parentheses        | Original     | Swapped        |
| Final Step         | None         | Reverse output |
| `^` Pop Rule       | `>`          | `>=`           |
| `+,-,*,/` Pop Rule | `>=`         | `>`            |

The associativity rule is the only algorithmic difference.

---

## Common Mistakes

### 1. Forgetting to Swap Parentheses

Wrong:

```text
Reverse only:
C*)B+A(
```

Correct:

```text
C*(B+A)
```

Without swapping, the expression becomes invalid.

### 2. Using the Same Pop Condition as Postfix

The associativity flips after reversal.

* **Postfix:** `^` uses `>`
* **Prefix:** `^` uses `>=`

### 3. Forgetting the Final Reverse

The postfix obtained after processing the reversed expression is **not** the answer.

Always reverse it once more.

---

## Relationship to Other Expression Problems

| Problem            | Technique                          |
| ------------------ | ---------------------------------- |
| Infix → Postfix    | Shunting Yard                      |
| **Infix → Prefix** | Reverse + Swap + Postfix + Reverse |
| Prefix Evaluation  | Stack (Right → Left)               |
| Postfix Evaluation | Stack (Left → Right)               |

Rather than memorizing two separate conversion algorithms, remember that **prefix conversion is just postfix conversion on a reversed expression**.

---

## Key Takeaways

* Prefix conversion is built directly on the **Infix → Postfix** algorithm.
* The four-step trick is the standard interview approach:

  1. Reverse
  2. Swap parentheses
  3. Convert to postfix
  4. Reverse result
* The only subtle implementation detail is the **associativity flip**:

  * `^` pops on `>=`
  * `+ - * /` pop on `>`
