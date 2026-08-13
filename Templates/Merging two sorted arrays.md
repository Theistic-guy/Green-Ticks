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