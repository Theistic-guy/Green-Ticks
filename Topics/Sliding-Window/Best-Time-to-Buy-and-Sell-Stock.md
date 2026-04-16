
# 📈Best Time to Buy and Sell Stock

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




## 🔗References
[Leetcode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

## 🏢 Companies

Amazon, Google, Microsoft, Facebook, Apple, Adobe, Bloomberg, Uber, Oracle, Goldman Sachs, Salesforce, ByteDance, tiktok, Cisco, VMware, Expedia, Walmart Global Tech, Atlassian, Visa, eBay, JPMorgan, Paypal, Capital One, ServiceNow, Zoho, tcs, Docusign, Zoom, Netflix, Alation
