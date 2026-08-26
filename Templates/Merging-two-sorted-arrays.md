<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Merging two sorted arrays
```Python
def merge(A, B):
    merged = []
    i = j = 0
    while i < len(A) and j < len(B):
        if A[i] <= B[j]:
            merged.append(A[i])
            i += 1
        else:
            merged.append(B[j])
            j += 1
    merged.extend(A[i:])
    merged.extend(B[j:])
    return merged

```

##### Problems like...
[intersection-of-two-sorted-arrays](../Problems/intersection-of-two-sorted-arrays.md)
[union-of-two-sorted-arrays](../Problems/union-of-two-sorted-arrays.md)
