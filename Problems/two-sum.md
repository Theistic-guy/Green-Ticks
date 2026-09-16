---
Title: Two Sum (Leetcode 1)
Companies: [Accenture, Adobe, Altimetrik, Amazon, Barclays, Bloomberg, Capgemini, Cisco, Citigroup, Comcast, Delhivery, Deloitte, Devsinc, EPAM Systems, EY, Expedia, Garmin, Google, HCL, Infosys, Intel, Mastercard, Meta, Microsoft, Microstrategy, MongoDB, NetApp, Pwc, SAP, Samsung, Sony, Synopsys, Tech Mahindra, Tinkoff, Western Digital, Wipro, Yahoo, ciena, tcs, Visa, American Express, Walmart Labs, Yelp, AMD, Cognizant, Dropbox, Oracle, Qualcomm, Zoho, Airbus SE, Morgan Stanley, Splunk, Apple, IBM, eBay, Huawei, Ozon, VK, Spotify, Criteo, Nvidia, Tiger Analytics, UKG, Warnermedia, KLA, persistent systems, Flipkart, Ola Cabs, Virtusa, Grab, Hubspot, Accolite, Tekion, DevRev, MindTree, PayPal, Toast, Tesla, Honeywell, Optum, Publicis Sapient, Dell, ThoughtWorks, Airbnb, Lowe's, ServiceNow, Snowflake, TikTok, Yandex, Akamai, ByteDance, jio, Deutsche Bank, Jane Street, Turing, Autodesk, HashedIn, Epic Systems, Intuit, Uber, Goldman Sachs, PhonePe, Roblox, Wix, LinkedIn, Palo Alto Networks, DoorDash, Juspay, Citadel, BlackRock, Capital One, Anduril, Atlassian, DE Shaw, Databricks, Salesforce]
Topics:
  - Two Pointers
  - Arrays
Platform:
  - Leetcode
Difficulty: Easy
Other Tags:
  - GFG
Link: "[Leetcode](https://leetcode.com/problems/two-sum/)"
---
<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# 2️⃣Two Sum
#LeetCode 

**Pattern:** Two Pointers

**Idea:** Sort the array => Use two pointers (i = start, j = end) , move inwards..
**Follow-up**: [3sum](3sum.md)

---

## 💻 Code

```Python

def twoSum(nums: List[int], target: int) -> List[int]:

        lst = [(val,idx) for idx, val in enumerate(nums)]

        lst.sort(key=lambda x : x[0])



        i = 0

        j = len(nums)-1

  

        while(i<j):

            if lst[i][0] + lst[j][0] == target:

                return [min(lst[i][1],lst[j][1]),max(lst[i][1],lst[j][1])]

            if lst[i][0] + lst[j][0] > target:

                j -= 1

            if lst[i][0] + lst[j][0] < target:

                i += 1

        return []
```

<details>
<summary>Why move the pointers in one direction respectively?</summary>
Because of  "monotonicity" of the sum calculated thru the summation of <b>lst[i][0] + lst[j][0]</b>
in a sorted array. We either increase the sum or decrease it. If sum of two elements at indices i and j is less than target then it only makes sense to increase i. <b>Why not j? </b> Because j is already coming from the right-most direction, if it were to be the solution then we would have already found it as both i and j are moving inwards from the extreme ends
</details>
