---
Title: Best Time to Buy and Sell Stock
Companies:
  - Amazon
  - Google
  - Microsoft
  - Facebook
  - Apple
  - Adobe
  - Bloomberg
  - Uber
  - Oracle
  - Goldman Sachs
  - Salesforce
  - ByteDance
  - tiktok
  - Cisco
  - VMware
  - Expedia
  - Walmart Global Tech
  - Atlassian
  - Visa
  - eBay
  - JPMorgan
  - Paypal
  - Capital One
  - ServiceNow
  - Zoho
  - tcs
  - Docusign
  - Zoom
  - Netflix
  - Alation
Topics:
  - Arrays
  - DP
Platform:
  - Leetcode
Difficulty: Not Specified
Other Tags:
  - Kadane
  - 1D DP
Link: "[Leetcode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)"
---

# 📈Best Time to Buy and Sell Stock <a href="../README.md" style="float: right; text-decoration: none;">🏠</a>

**Pattern:** Siding Window

**Idea:** Keep track of best price so far and the maximum profit so far.

---

## 💻 Code

```Python

def maxProfit(prices: List[int]) -> int:

        ans = 0

        buy = 1e9

        for price in prices:

            if price>buy:

                ans = max(ans,price-buy)

            elif price<buy:

                buy = price

        return ans
```

Valley and Peak approach - [Valley Peak approach](../Notes/Extras/Valley%20Peak%20approach.md)



## 🔗References
[Leetcode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Bloomberg, Uber, Oracle, Goldman Sachs, Salesforce, ByteDance, tiktok, Cisco, VMware, Expedia, Walmart Global Tech, Atlassian, Visa, eBay, JPMorgan, Paypal, Capital One, ServiceNow, Zoho, tcs, Docusign, Zoom, Netflix, Alation

---
#### This problem is 1D DP 
Yes, it is both. Your code is a Dynamic Programming (DP) algorithm that adapts the exact core philosophy of Kadane's Algorithm. [1, 2, 3]

Kadane's algorithm itself is just a highly optimized, one-pass variation of Dynamic Programming. [4, 5]

Here is exactly how they connect to your code.

---

## 🗺️ The Hierarchy: How They Fit Together

```unset
   [ Dynamic Programming ]  <-- The broad problem-solving framework
              │
     [ Kadane's Algorithm ]  <-- A specific one-pass DP technique for optimization
              │
       [ Your Code ]        <-- Kadane's logic adapted for stock trading
```

---

## 🧠 How Kadane's Logic Translates to Your Code

Kadane’s original algorithm finds the Maximum Subarray Sum by tracking two states at every step. Look at how perfectly your stock code mirrors that exact math: [6, 7, 8]

|Feature|Standard Kadane's (Max Subarray)|Your Stock Code|
|---|---|---|
|Local State|`current_sum` (Best sum ending _here_)|`buy` (Best price seen _up to here_)|
|Global State|`max_sum` (Best sum found _anywhere_)|`ans` (Best profit found _anywhere_)|
|The Choice|Should I extend the existing subarray or start a new one?|Should I sell at today's price or use today's price as a new buying floor?|

---

## 🛠️ The Formal DP Proof (State Transitions)

To prove this is Dynamic Programming, we can express your code as formal DP State Transitions.

At any day $i$, the algorithm computes two historical states based purely on the previous day's states ($i-1$): [9, 10, 11]

1. Buying State:  
    $$\text{buy}[i] = \min(\text{buy}[i-1], \text{price}[i])$$  
    _(Memory of the lowest price up to day $i$)_
2. Profit State:  
    $$\text{ans}[i] = \max(\text{ans}[i-1], \text{price}[i] - \text{buy}[i])$$  
    _(Memory of the highest profit up to day $i$)_ [12]

Because you are using the optimal solutions of smaller subproblems (days $0$ to $i-1$) to solve the current subproblem (day $i$), it is a textbook Space-Optimized Bottom-Up Dynamic Programming solution. [13]

---
