<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

The Valley-Peak approach is <mark>a popular algorithmic strategy in Data Structures and Algorithms (DSA) used to calculate cumulative gains or track structural patterns in data sequences</mark>. It is most famous for solving LeetCode #122: Stock Buy and Sell II and similar greedy/sliding window optimization problems. [1, 2, 3]

The core concept is to visualize a 1D sequence or array as a series of geographical mountains. A Valley represents a local minimum (a drop in data, or the best price to "buy"), while a Peak represents a local maximum (a surge in data, or the best price to "sell"). [2, 4, 5, 6, 7]

---

## 1. How the Core Logic Works

Instead of trying to look at the entire array all at once, you process the sequence linearly from left to right using a Greedy Approach. [1, 2]

1. Find the Valley: Traverse the sequence as long as the values are decreasing ($arr[i] \ge arr[i+1]$). Stop when they start going up. This lowest point is your valley. [1, 8, 9]
2. Find the Peak: From that valley, continue traversing as long as the values are increasing ($arr[i] \le arr[i+1]$). Stop when they start dropping. This highest point is your peak. [1, 10]
3. Capture the Profit/Difference: Compute Peak - Valley and add it to your total score. [1]
4. Repeat: Move your pointer forward and look for the next valley-peak pair until you reach the end of the array. [1, 11]

---

## 2. Code Example (Stock Buy and Sell II)

Here is how the Valley-Peak approach is implemented in Python to capture every profitable climb in an array of prices: [1]

```python
def max_profit(prices):
    i = 0
    total_profit = 0
    n = len(prices)
    
    while i < n - 1:
        # 1. Downward trend: keep moving until we hit a local minimum (Valley)
        while i < n - 1 and prices[i] >= prices[i+1]:
            i += 1
        valley = prices[i]
        
        # 2. Upward trend: keep moving until we hit a local maximum (Peak)
        while i < n - 1 and prices[i] <= prices[i+1]:
            i += 1
        peak = prices[i]
        
        # 3. Add the difference of this specific sub-climb
        total_profit += peak - valley
        
    return total_profit
```

---

## 3. Alternative "Simplified" Valley-Peak Approach

In many interview settings, you do not even need to write the nested `while` loops to explicitly locate the peaks and valleys. Because a long climb from a deep valley to a high peak is mathematically equal to the sum of all its consecutive daily rises, you can simplify the logic: [1]

$$\text{If } arr = [1, 3, 6], \text{ then } (6 - 1) = (3 - 1) + (6 - 3)$$

This means you can just look at every consecutive pair of elements. If the second element is larger than the first, you grab that tiny profit instantly. [1, 12]

```python
def max_profit_simplified(prices):
    total_profit = 0
    for i in range(1, len(prices)):
        # If the price goes up from yesterday, take the profit!
        if prices[i] > prices[i-1]:
            total_profit += prices[i] - prices[i-1]
    return total_profit
```

---

## 4. Complexity and Other Applications

- Time Complexity: $\mathcal{O}(N)$ because you pass through the array exactly once, making it highly efficient.
- Space Complexity: $\mathcal{O}(1)$ auxiliary space since you only track a few pointer variables. [1, 3]

Aside from maximizing trading profits, variants of this pattern show up when you need to Count Hills and Valleys in terrain data, solve greedy tracking puzzles like LeetCode #135: Candy, or sort an unsorted array into an alternating wave pattern known as a Peaks and Valleys Array. [12, 13, 14]


