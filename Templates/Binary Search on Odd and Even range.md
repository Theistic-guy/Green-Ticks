
# Binary Search on Parity (Even/Odd Answers Only)

To binary search over only even or odd numbers cleanly, map sequential integer indices `[low, high]` to the desired parity inside a standard binary search loop. This eliminates off-by-one pointer bugs and preserves standard `mid + 1` / `mid - 1` adjustments.

## 1. Even Numbers Only
Maps indices to evens via `mid * 2`. Ensure input boundaries are even.

```python
low = low_even // 2
high = high_even // 2
ans = None

while low <= high:
    mid = low + (high - low) // 2
    even_mid = mid * 2

    if condition(even_mid):
        ans = even_mid
        high = mid - 1  # Minimize answer; flip to low = mid + 1 to maximize
    else:
        low = mid + 1
```

## 2. Odd Numbers Only
Maps indices to odds via `mid * 2 + 1`. Ensure input boundaries are odd.

```python
low = (low_odd - 1) // 2
high = (high_odd - 1) // 2
ans = None

while low <= high:
    mid = low + (high - low) // 2
    odd_mid = mid * 2 + 1

    if condition(odd_mid):
        ans = odd_mid
        high = mid - 1  # Minimize answer; flip to low = mid + 1 to maximize
    else:
        low = mid + 1
```

