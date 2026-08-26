<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Partitioning (Lomuto)

$O(n)$

```Python
import random


def lomuto_partition(arr: list, low: int, high: int, pivot_idx: int = None) -> int:
    """Standard Lomuto Partitioning with customizable pivot selection.

    Swaps the chosen pivot to the end before partitioning.
    """
    # If no pivot index is specified, default to the last element
    if pivot_idx is None:
        pivot_idx = high

    # Move the chosen pivot out of the way to the last element position
    arr[pivot_idx], arr[high] = arr[high], arr[pivot_idx]

    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    # Place the pivot in its final correct sorted position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1


# --- Driver Code ---
if __name__ == "__main__":
    # Generate a random array
    example_arr = [random.randint(10, 99) for _ in range(8)]
    print(f"Original Array:          {example_arr}")

    # Explicitly pick a pivot index (e.g., the middle element at index 3)
    chosen_index = 3
    print(f"Chosen Pivot Element:    {example_arr[chosen_index]} (at index {chosen_index})")

    # Partition the entire array length
    final_pivot_position = lomuto_partition(
        example_arr, low=0, high=len(example_arr) - 1, pivot_idx=chosen_index
    )

    print(f"Partitioned Array:       {example_arr}")
    print(f"Final Pivot Position:    Index {final_pivot_position}")

```