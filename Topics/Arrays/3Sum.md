# 🧩 3Sum

**Pattern:** Two Pointers  
**Idea:** Fix one element → reduce to 2Sum (sorted array)

---

## 💻 Code

```py
def threeSum( nums: List[int]) -> List[List[int]]:
    nums.sort()  # sorting enables two-pointer strategy
    n = len(nums)
    ans = []
    idx = 0
    ans_set = set()  # used to avoid duplicates

    while(idx < n - 2):
        i = idx + 1
        j = n - 1

        while(i < j):
            t_sum = nums[idx] + nums[i] + nums[j]

            if t_sum == 0:
                # store as tuple (set requires hashable)
                ans_set.add(tuple(sorted((nums[idx], nums[i], nums[j]))))
                i += 1
                j -= 1

            elif t_sum < 0:
                i += 1  # need bigger sum

            else:
                j -= 1  # need smaller sum

        idx += 1

    return [list(val) for val in ans_set]
```

<details>
<summary>Why we shrinked both i and j when a match was found?</summary>
Because keeping either of the two fixed would lead to a duplicate. Let's say we keep 'i' fixed, then nums[i]+nums[idx] is same as before => nums[j] has to be now same as before
</details>
