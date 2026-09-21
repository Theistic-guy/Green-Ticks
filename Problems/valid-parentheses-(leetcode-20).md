---
Title: Valid Parentheses (Leetcode 20)
Companies: [Accolite, Autodesk, Bank of America, BlackRock, Chewy, Criteo, FreshWorks, Intuit, Odoo, Tripadvisor, Virtu Financial, Zenefits, Walmart Labs, X, IBM, Ozon, Epic Systems, Intel, ZS Associates, Zoho, Splunk, Mastercard, Millennium, VK, LinkedIn, Turing, HP, SAP, Bloomberg, HCL, Siemens, Nokia, Sigmoid, Deloitte, EPAM Systems, USAA, GoDaddy, Lucid, Nvidia, UBS, persistent systems, Nike, Spotify, opentext, Grab, Huawei, Qualcomm, Amazon, Meta, Rokt, Comcast, Oracle, Expedia, ServiceNow, Wells Fargo, Apple, Microsoft, eBay, Adobe, Toast, Vimeo, Cognizant, Infosys, Paytm, Sony, Tesla, Visa, Altimetrik, Two Sigma, CrowdStrike, Google, TikTok, carwale, Airbnb, PhonePe, tcs, Roblox, Cisco, Jane Street, Wipro, Yahoo, Yandex, Dell, MathWorks, Barclays, DE Shaw, Wix, Palo Alto Networks, PayPal, Samsung, Agoda, Anduril, ByteDance, Flipkart, Goldman Sachs, Accenture, Capital One, Salesforce, Uber]
Topics:
  - Stack
  - Strings
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
  - LIFO
Link: ""
Rating:
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Valid Parentheses (Leetcode 20)

**Pattern:** 

**Idea:** 

**Variations** : 

---

## 💻 Code

```Python
def isValid(s: str) -> bool:
    stack = []

    pairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    }

    for ch in s:

        if ch in "([{":
            stack.append(ch)

        else:
            if not stack or stack.pop() != pairs[ch]:
                return False

    return not stack

```
**Time complexity** - O(n)

**Aux. Space complexity** -  O(n)

---

# Valid Parentheses (Leetcode 20)

**Tags:** #Stack #Strings #Parsing #BalancedParentheses #LIFO #Interview-Pattern #LeetCode #FAANG

## Problem Statement

Given a string `s` containing only the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`, determine whether the parentheses are **valid**.

A string is valid if:

1. Every opening bracket has a corresponding closing bracket.
    
2. Brackets close in the **correct order**.
    
3. Every closing bracket matches the **most recent unmatched opening bracket**.
    

**Examples**

|Input|Output|
|---|---|
|`"()"`|✅|
|`"()[]{}"`|✅|
|`"(]"`|❌|
|`"([)]"`|❌|
|`"{[]}"`|✅|

---

## Core Insight

This is the canonical **Stack (LIFO)** problem.

Why?

The **last opening bracket** encountered must be the **first one closed**.

```text
( [ { } ] )

Push: ( [ {
Pop : { ] (
```

This is exactly **Last-In, First-Out** behavior.

---

## Intuition (The WHY)

Consider:

```text
([{}])
```

Process left to right.

|Character|Stack|
|---|---|
|`(`|(|
|`[`|([|
|`{`|([{|
|`}`|([|
|`]`|(|
|`)`|Empty|

Every closing bracket removes the **nearest unmatched opening bracket**.

Now consider:

```text
([)]
```

|Character|Stack|
|---|---|
|`(`|(|
|`[`|([|
|`)`|❌ Top is `[`|

Even though counts match, the **order** is wrong.

---

## Greedy Stack Approach

### Algorithm

1. Create an empty stack.
    
2. Push every opening bracket.
    
3. On a closing bracket:
    
    - If the stack is empty → Invalid.
        
    - Pop the top.
        
    - Check whether it matches.
        
4. The stack must be empty at the end.
    

### Python Solution

```python
def isValid(s: str) -> bool:
    stack = []

    pairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    }

    for ch in s:

        if ch in "([{":
            stack.append(ch)

        else:
            if not stack or stack.pop() != pairs[ch]:
                return False

    return not stack
```

---

## Dry Run

**Input**

```text
{[]}
```

|Character|Action|Stack|
|---|---|---|
|`{`|Push|`{`|
|`[`|Push|`{[`|
|`]`|Pop `[`|`{`|
|`}`|Pop `{`|Empty|

Result: **True**

---

### Invalid Example

```text
([)]
```

|Character|Stack|Action|
|---|---|---|
|`(`|(|Push|
|`[`|([|Push|
|`)`|([|Top is `[` ❌|

Return **False** immediately.

---

## Why a Stack Is Necessary

Suppose we try using only counters.

```text
([)]
```

Counts:

- `(` = `)`
    
- `[` = `]`
    

Everything balances.

Yet the string is invalid because nesting matters.

A stack preserves **structure**, not just quantity.

---

## Correctness (Invariant)

**Invariant:** After processing any prefix of the string, the stack contains **exactly the unmatched opening brackets**, in the order they must be closed.

When a closing bracket appears:

- It must match the stack top.
    
- Otherwise, no future character can repair the mismatch.
    

Thus the greedy pop is always correct.

---

## Complexity

|Metric|Value|
|---|--:|
|Time|**O(n)**|
|Auxiliary Space|**O(n)**|

Worst case:

```text
((((((((
```

All opening brackets remain in the stack.

---

## Common Mistakes

### 1. Popping Before Checking Empty

Wrong:

```python
top = stack.pop()
```

This crashes on:

```text
")"
```

Always check:

```python
if not stack:
    return False
```

### 2. Matching Against the Wrong Bracket

Instead of multiple `if` statements:

```python
pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
}
```

This is cleaner and less error-prone.

### 3. Forgetting Remaining Open Brackets

```text
(((
```

The loop finishes, but the stack is non-empty.

Final check:

```python
return not stack
```

---

## Pythonic Way

Using a dictionary for direct matching:

```python
pairs = {')':'(', ']':'[', '}':'{'}
```

avoids nested conditionals and keeps the algorithm concise.

---

## Pattern Recognition

Use a **stack** whenever you see:

- Balanced parentheses
    
- Nested structures
    
- XML / HTML tag matching
    
- Arithmetic expression parsing
    
- Undo / backtracking (LIFO behavior)
    

The reusable template is:

1. **Push** opening symbols.
    
2. **Pop & verify** on closing symbols.
    
3. **Stack must be empty** at the end.
    

> **Interview Heuristic:** Whenever the problem involves **proper nesting**, think **Stack** before anything else.