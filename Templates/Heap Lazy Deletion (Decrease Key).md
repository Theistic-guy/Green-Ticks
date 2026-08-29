<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

# Heap Lazy Deletion (Decrease Key)

Here is the simplest, most reproducible Decrease-Key workaround for a FAANG interview.

Instead of writing a custom heap or modifying keys in place, you use Lazy Deletion. When a shorter distance is found, you simply push a duplicate `(new_distance, node)` tuple into the min-heap. When you pop from the heap, you immediately check if you have already seen that node at a better distance. If you have, you discard it.

## The Code Template

```python
import heapq

def dijkstra_template(graph, start, num_nodes):
    # 1. Initialize track keeping structures
    distances = {node: float('inf') for node in range(num_nodes)}
    distances[start] = 0
    
    # Min-heap stores tuples of: (priority/distance, node_id)
    min_heap = [(0, start)]
    
    while min_heap:
        current_dist, u = heapq.heappop(min_heap)
        
        # --- THE WORKAROUND CHECK ---
        # If the popped distance is greater than the best recorded distance,
        # it means this is a stale/duplicate entry. Skip it completely.
        if current_dist > distances[u]:
            continue
            
    	# 2. Explore neighbors
        for neighbor, weight in graph[u]:
            new_dist = current_dist + weight
            
            # 3. Simulated Decrease-Key
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                # Just push the new pair; don't worry about removing the old one
                heapq.heappush(min_heap, (new_dist, neighbor))
                
    return distances
```

## Why Interviewers Accept This (And Expect It)

1. Identical Time Complexity: In a interview, you can confidently tell the interviewer that this runs in $O(E \log V)$ time. While the heap size can technically grow to $O(E)$ due to duplicates, $\log(E)$ is asymptotically equal to $\log(V)$ because $E \leq V^2$, and $\log(V^2) = 2\log(V)$.
2. Speed of Coding: Writing a true custom heap with a look-up dictionary takes 50+ lines of bug-prone code. Interviewers want to see you solve the actual problem within 45 minutes, not reinventing basic data structures.
3. Space Trade-off: The only trade-off is memory. The heap takes $O(E)$ space instead of $O(V)$ space. In almost all FAANG scenarios, this space trade-off is highly acceptable.

## Memorization Cheat Sheet

To implement this effortlessly on a whiteboard, remember these 3 rules:

- The Heap Element: Always put the key you want to sort by (e.g., distance, weight) as the first element of the tuple: `(weight, node)`. Python's `heapq` automatically sorts tuples by their first element.
- The Push: When updates happen, don't search. Just `heappush()` the new tuple.
- The Gatekeeper: <mark>Immediately after `heappop()`, write: `if pop_weight > best_known_weight: continue`. </mark>
