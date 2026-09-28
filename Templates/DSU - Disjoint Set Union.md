
# Disjoint Set Union (DSU / Union-Find)

Tags: #dsa #graph #unionfind #dsu #connected-components #kruskal #cycle-detection #path-compression #union-by-size

## Core Idea

DSU maintains a collection of disjoint (non-overlapping) sets and supports efficient merging and connectivity queries.

A DSU has only 2 operations:

|Operation|Purpose|
|---|---|
|`find(x)`|Return the representative (root) of the set containing `x`|
|`union(a, b)`|Merge the two sets containing `a` and `b`|

> Path Compression and Union by Size/Rank are optimizations, not separate operations.

## Data Structure

```
parent[i]   # parent of node i
size[i]     # size of the component (only valid at the root)
```

Initialization:

```
parent = list(range(n))
size = [1] * n
```

Each node initially forms its own singleton set.

## DSU Template (Interview Standard)

```Python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])   # Path Compression
        return self.parent[x]

    def union(self, a, b):
        pa, pb = self.find(a), self.find(b)

        if pa == pb:
            return False

        if self.size[pa] < self.size[pb]:
            pa, pb = pb, pa

        self.parent[pb] = pa
        self.size[pa] += self.size[pb]
        return True
```

### Why return `True/False`?

- `True` → Two different components were merged.
    
- `False` → Already belonged to the same component (useful for cycle detection).
    

## Path Compression

While finding the root, make every visited node point directly to the representative.

Before:

```
4 → 3 → 2 → 1 → 0
```

After `find(4)`:

```
4 ─┐
3 ─┤
2 ─┤
1 ─┘
    ↓
    0
```

This flattens future lookups.

## Union by Size

Always attach the smaller component under the larger component.

```
if size[pa] < size[pb]:
    pa, pb = pb, pa

parent[pb] = pa
size[pa] += size[pb]
```

### Why does it work?

A node's depth increases only when its component is attached to a larger one.

Its component size therefore at least doubles:

$$ 1 \rightarrow 2 \rightarrow 4 \rightarrow 8 \rightarrow \cdots $$

Maximum depth is therefore:

$$ O(\log n) $$

## Time Complexity

|Implementation|`find()`|`union()`|
|---|---|---|
|Naive|$O(n)$|$O(n)$|
|Union by Size only|$O(\log n)$|$O(\log n)$|
|Path Compression only|Amortized $O(\log n)$|Amortized $O(\log n)$|
|Both optimizations|Amortized $O(\alpha(n))$|Amortized $O(\alpha(n))$|

### Interview Explanation

- Without optimizations: Trees can become chains, so `find` is $O(n)$.
    
- Union by Size: Keeps tree height bounded to $O(\log n)$.
    
- Path Compression: Flattens trees over repeated operations, giving amortized improvement.
    
- Both together: Tarjan's optimal bound of $O(\alpha(n))$, effectively constant in practice.
    

> Amortized means the average cost over a sequence of operations, not necessarily a single call.

## Common Usage Patterns

### 1. Merge Components

```
dsu.union(u, v)
```

### 2. Check Connectivity

```
if dsu.find(u) == dsu.find(v):
    ...
```

### 3. Count Connected Components

```
components = len({dsu.find(i) for i in range(n)})
```

### 4. Detect Cycle

```
if not dsu.union(u, v):
    return [u, v]
```

## Important Caveat

`size[]` is meaningful only for the representative.

```
# Wrong
dsu.size[x]

# Correct
dsu.size[dsu.find(x)]
```

## Recognition Checklist

Use DSU when the problem involves:

- Merging groups dynamically
    
- Connected components
    
- Connectivity queries
    
- Cycle detection in an undirected graph
    
- Kruskal's Minimum Spanning Tree
    
- Grid connectivity (2D → 1D index mapping)