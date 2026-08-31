<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

+ next permutation (coming from [permutations-2-handling-duplicates](../Problems/permutations-2-handling-duplicates.md))
+ bisect and sortedcontainers
+ implementations of basic data structures
+ sliding window leetcode 239 note
+ find all anangrams is leetcode 438
+ n-k sliding window cards speatete note
+ prefix sum LC 862 (see that )
+ prefix sum (subarruy sum divisbly by k ) - sepatate note
+ tag every LC note with  #leetcode 
+ (../..Readme) path is diff for nested folders this needs to be fixed appropriately.
+ do problem notes on the intervals pattern [Intervals & Ranges Pattern (Sorting)](Intervals%20&%20Ranges%20Pattern%20(Sorting).md)
	+ Problems
	
		Here's the tight top-10, ordered by priority and picked for FAANG frequency + coverage breadth (not difficulty):
		
		1. **Merge Intervals (LC 56)** — the pattern itself. Asked everywhere (Google, Meta, Amazon). If you only do one, this is it.
		2. **Insert Interval (LC 57)** — Google favorite. Tests real understanding vs memorized loop.
		3. **Meeting Rooms II (LC 253)** — Amazon/Meta staple. First heap-based sweep, very common as a "design a scheduler" follow-up too.
		4. **Non-overlapping Intervals (LC 435)** — the greedy/sort-by-end fork. Amazon, Bloomberg regulars.
		5. **Minimum Arrows to Burst Balloons (LC 452)** — same idea as #4 restated, high frequency at Amazon/Google, good to confirm you generalize the pattern not memorize the problem.
		6. **Interval List Intersections (LC 986)** — two-pointer variant, Facebook/Meta favorite, cheap win once merge is solid.
		7. **Meeting Rooms (LC 252)** — quick, but shows up as a warm-up/phone-screen filter before II.
		8. **Car Pooling (LC 1094)** — diff array tool, Uber/Amazon-flavored, distinct technique from heap/merge so it rounds out coverage.
		9. **My Calendar I (LC 729)** — the online/incremental variant, tests if you can adapt without full upfront sort — shows up at Google/Meta.
		10. **Employee Free Time (LC 759)** — the "boss fight," Google/LinkedIn hard-tier, combines flatten + merge + gap-find. Do this last to confirm mastery.


		Grouped by underlying technique — this is the map to hold in your head walking into an interview:
		
		**1. Merge Sweep** _(sort by start → linear combine)_
		
		- Merge Intervals (56)
		- Insert Interval (57)
		
		**2. Two-Pointer Intersection** _(pre-sorted inputs, no merge needed)_
		
		- Interval List Intersections (986)
		
		**3. Greedy Selection** _(sort by end → keep smallest-end on conflict)_
		
		- Non-overlapping Intervals (435)
		- Minimum Arrows to Burst Balloons (452)
		
		**4. Sweep Line / Active-Count** _(sort by start → track concurrency via heap or two-pointer)_
		
		- Meeting Rooms (252) — boolean check, no heap needed
		- Meeting Rooms II (253) — heap-based count
		
		**5. Online/Incremental Sweep** _(no upfront sort possible — one insert at a time)_
		
		- My Calendar I (729)
		
		**6. Delta / Diff Array** _(range-add-then-query, distinct tool from heap)_
		
		- Car Pooling (1094)
		
		**7. Composite** _(chains multiple methods above in one problem)_
		
		- Employee Free Time (759) — flatten + merge sweep + gap-finding
		
		Category 1 and 4 both sort by start but diverge on what they track (merged range vs concurrent count) — that's the pair most people conflate. Category 3 is the one place the sort key flips to end, which is the fork worth drilling until it's automatic.

		
		