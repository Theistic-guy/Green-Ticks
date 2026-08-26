<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

## PKM Note: Binary Search Implementation Styles

## 1. Half-Open / Convergence Style (<mark>Boundary Style</mark>)

- Concept: The search space behaves like a half-open interval $[low, high)$ or $(low,high]$.
- Mechanism: Pointers converge to a single index (`low == high`) which represents the boundary or transition point of a condition. No extra variable tracks the answer.
- Loop Condition: `while (low < high)`
- Pointer Strategy: One pointer aggressively excludes `mid` (`+1` or `-1`), while the other keeps `mid` inside the valid pool (`high = mid` or `low = mid`).
- Infinite Loop Risk: Requires rounding adjustment if updating `low = mid`.

## Code Template (Finding Lower Bound / First True)

```cpp
// Target: Find the first index where check(index) is true
int low = 0, high = n; // 'high' can be n (outside array bounds)

while (low < high) {
    int mid = low + (high - low) / 2; // Rounds down
    if (check(mid)) {
        high = mid;    // mid could be the first true, keep it as upper bound
    } else {
        low = mid + 1; // mid is false, safely exclude it
    }
}
return low; // low == high, points exactly to the boundary
```

---

## 2. Closed / Inclusive Style (<mark>Explicit Answer Style</mark>)

- Concept: The search space behaves like a fully closed interval $[low, high]$.
- Mechanism: Every checked `mid` is immediately thrown away. A dedicated tracking variable (`ans`) caches the most recent valid candidate before discarding it.
- Loop Condition: `while (low <= high)`
- Pointer Strategy: Both pointers strictly move past `mid` using `low = mid + 1` and `high = mid - 1`.
- Infinite Loop Risk: None. Pointers always break the loop by crossing over (`low > high`).

## Code Template (Finding Lower Bound / First True)

```cpp
// Target: Find the first index where check(index) is true
int low = 0, high = n - 1;
int ans = -1; // Initialized to an out-of-bounds/unreachable value

while (low <= high) {
    int mid = low + (high - low) / 2;
    if (check(mid)) {
        ans = mid;      // Explicitly record the valid candidate
        high = mid - 1; // Discard mid to see if a smaller index works
    } else {
        low = mid + 1;  // Discard mid to look for a valid index
    }
}
return ans; // Contains the exact answer, or -1 if never found
```

---

## Comparative Cheat Sheet

|Feature|Boundary Style (`low < high`)|Explicit Answer Style (`low <= high`)|
|---|---|---|
|Termination State|`low == high`|`low > high`|
|Tracking Variable|None (Implicitly points to the answer)|Explicit `ans` variable required|
|Pointer Updates|`high = mid` OR `low = mid`|Always `high = mid - 1` AND `low = mid + 1`|
|Initial `high` Bound|Often set to `N` (Size of search space)|Often set to `N - 1` (Max valid index)|
|Error Proneness|High (Prone to infinite loops if `mid` rounding is wrong)|Low (Safe from infinite loops)|

Would you like me to generate a specific practical code example using both styles, such as solving the LeetCode "First Bad Version" problem?