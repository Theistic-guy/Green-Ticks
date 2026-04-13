# 2️⃣Two Sum

**Pattern:** Two Pointers
**Idea:** Sort the array => Use two pointers (i = start, j = end) , move inwards..

---

## 💻 Code

```Python

def twoSum(self, nums: List[int], target: int) -> List[int]:

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


