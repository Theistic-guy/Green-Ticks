<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

###### See Also:
+ Disjoint cycle theorem (Core principle) - [Disjoint Cycle Theorem](Extras/Disjoint%20Cycle%20Theorem.md)
+ cyclic placement - [Cyclic-sort-and-placement](../Templates/Cyclic-sort-and-placement.md) (when index = value - 1)
+ Functional graphs mutation - [Arrays as Functional Graphs](Arrays%20as%20Functional%20Graphs.md)


Time - O(n<sup>2</sup>)
Aux. Space - O(1)

**Absolute minimum writes**  - `n` in the worst case
For minimum swaps , use Selection Sort.

If current pos of start (cycle_start) is  `3` then indexes before it 0 ,1,2 are already sorted. Because they have started the cycles and cycles come back.
## Python Code

Without duplicates (distinct elements array):
```Python
# Cycle Sort for distinct elements
def cycleSort(arr):
    n = len(arr)

	# last element is already sorted if n-1
	# cycles have run
    for cycle_start in range(n - 1):
        item = arr[cycle_start]

        # Find the correct position of the item
        pos = cycle_start
        for i in range(cycle_start + 1, n):
            if arr[i] < item:
                pos += 1

        # Item is already in the correct position
        if pos == cycle_start:
            continue

        # Place the item
        arr[pos], item = item, arr[pos]

        # Rotate the rest of the cycle
        while pos != cycle_start:
            pos = cycle_start

            for i in range(cycle_start + 1, n):
                if arr[i] < item:
                    pos += 1

            arr[pos], item = item, arr[pos]


# Driver code
if __name__ == "__main__":
    arr = [3, 5, 2, 1, 4]

    cycleSort(arr)

    print(*arr)
```

For the duplicates we skip them thru this while loop, and the inner loop also has this skipping and it does not flow the logic of checking `while pos != cycle_start` .

```Python
# Function to sort the array using Cycle Sort
def cycleSort(arr):
    
    n = len(arr)
    
    # traverse array elements and put it to on the right place
    for cycle_start in range(0, n - 1):
        
        # initialize item as starting point
        item = arr[cycle_start]

        # Find position where we put the item. 
        # We basically count all smaller elements on right side of item.
        pos = cycle_start
        for i in range(cycle_start + 1, n):
            if arr[i] < item:
                pos += 1

        # If item is already in correct position
        if pos == cycle_start:
            continue

        # ignore all duplicate elements
        while item == arr[pos]:
            pos += 1

        # put the item to its right position
        if pos != cycle_start:
            arr[pos], item = item, arr[pos]

        # Rotate rest of the cycle
        while pos != cycle_start:
            pos = cycle_start

            # Find position where we put the element
            for i in range(cycle_start + 1, n):
                if arr[i] < item:
                    pos += 1

            # ignore duplicates
            while item == arr[pos]:
                pos += 1

            # put the item to its right position
            if item != arr[pos]:
                arr[pos], item = item, arr[pos]


if __name__ == "__main__":
    arr = [3,5,2,1,4]
    n = len(arr)

    cycleSort(arr)

    for x in arr:
        print(x, end=" ")
        
```




