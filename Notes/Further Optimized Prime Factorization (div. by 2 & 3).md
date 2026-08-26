<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

```Python
def prime_factors(n):
    # Remove all factors of 2
    while n % 2 == 0:
        print(2)
        n //= 2

    # Remove all factors of 3
    while n % 3 == 0:
        print(3)
        n //= 3

    # Check only numbers of the form 6k ± 1
    i = 5
    while i * i <= n:

        # Check 6k - 1
        while n % i == 0:
            print(i)
            n //= i

        # Check 6k + 1
        while n % (i + 2) == 0:
            print(i + 2)
            n //= (i + 2)

        i += 6

    # Remaining prime factor
    if n > 3:
        print(n)
```

3 times faster.
See also : [Time complexity for Prime Factorization](Time%20complexity%20for%20Prime%20Factorization.md)
