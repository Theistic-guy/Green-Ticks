<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Cyclic sort & Placement loop

The standard cyclic sort and placement algorithm in Python places numbers in the range 1 to n into their correct indices 0 to n-1 in O(n) time. 

## Cyclic Placement Template Code

```python
def cyclic_sort(nums):
    i = 0
    n = len(nums)
    
    while i < n:
        # Expected correct index for the current number (if values are 1 to n)
        correct_idx = nums[i] - 1
        
        # Check if the number is within range and not at its correct position
        if 1 <= nums[i] <= n and nums[i] != nums[correct_idx]:
            # Swap to place nums[i] at its correct index
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            # Move forward if already in place or out of expected bounds
            i += 1
            
    return nums

# Example usage:
print(cyclic_sort([3, 1, 5, 4, 2]))  # Output: [1, 2, 3, 4, 5]
```

## Key Considerations

- Range Validation: Ensure <mark>`1 <= nums[i] <= n`</mark> fits your problem description (adjust `correct_idx = nums[i]` if indices are zero-based).
- Time Complexity: O(n) because each number is swapped at most once into its correct position.
- Space Complexity: O(1) auxiliary space as sorting happens in place. [1, 3, 4, 5, 6]

---
If the problem strictly guarantees that the array only contains numbers from $1$ to $n$ (with no missing numbers, no zeroes, and no out-of-bounds values), then the check `1 <= nums[i] <= n` is 100% redundant for bounds checking.

In a perfect $1$ to $n$ array, `nums[i] - 1` will _always_ be a valid index.



## When you can DELETE the check

If your problem is a straightforward permutation of $1$ to $n$ (e.g., finding a duplicate in a fixed array size), you can strip the template down to this:

```python
while i < n:
    correct_idx = nums[i] - 1
    # Only need to check if the current element is already at its correct home
    if nums[i] != nums[correct_idx]:
        nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
    else:
        i += 1
```

## Why it is kept in the "Universal" template

Most LeetCode-style cyclic sort problems mess with the boundaries. The template keeps `1 <= nums[i] <= n` to handle those variations automatically:

- Missing Numbers (Array size is $n$, but values go up to $n+1$): If the array is `[3, 0, 1]`, $n=3$. The value `0` or a value like `4` will crash your index lookup without that range check.
- <mark>First Missing Positive</mark>: The array can contain negative numbers or massive numbers like `9999`. The `1 <=` part filters out negatives, and the `<= n` part filters out values larger than the array size.
	See here : [first-missing-positive](../Problems/first-missing-positive.md)

