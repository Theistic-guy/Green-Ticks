+ children is a hash map to store the alphabets which  leads to new nodes
+ endOfWord inndicates whether a word ends at the particular node


```Python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.endOfWord = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        cur = self.root
        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()  # Fixed: added () to instantiate
            cur = cur.children[c]
        cur.endOfWord = True

    def delete(self, word):
        def dfs(node, i):
            # Reached the node representing the complete word
            if i == len(word):
                if not node.endOfWord:
                    return False, False  # word doesn't exist
                node.endOfWord = False
                # Parent can delete this node if it has no children
                return True, len(node.children) == 0

            if word[i] not in node.children:
                return False, False

            child = node.children[word[i]]
            deleted, shouldDeleteChild = dfs(child, i + 1)

            if not deleted:
                return False, False

            # Child has become useless → remove it
            if shouldDeleteChild:
                node.children.pop(word[i])

            # Current node can now also be pruned
            return True, len(node.children) == 0 and not node.endOfWord

        dfs(self.root, 0)

    def search(self, word):
        cur = self.root
        for c in word:
            if c not in cur.children:
                return False
            cur = cur.children[c]
        return cur.endOfWord

    def startsWith(self, word):
        cur = self.root
        for c in word:
            if c not in cur.children:
                return False
            cur = cur.children[c]
        return True

```



---


# Trie — Implementation

Tags: #DSA #Trie #Tree #String #PrefixTree #DataStructures #Insert #Search #Delete #Recursion

---

## 1. What is a Trie?

A **Trie** (Prefix Tree) is a tree-like data structure used to store strings where:

- Each **edge represents a character**.
    
- A path from the root represents a string/prefix.
    
- `endOfWord = True` marks that a complete word ends at that node.
    
- `children` stores the next possible characters.
    

### Example

Insert:

```text
cat
car
cart
```

The Trie becomes conceptually:

```text
root
 └── c
      └── a
           ├── t [EOW]
           └── r [EOW]
                └── t [EOW]
```

`[EOW]` means `endOfWord = True`.

Notice that `car` and `cart` share the path:

```text
c → a → r
```

This is the main advantage of a Trie: **common prefixes are shared**.

---

# 2. Node Structure

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.endOfWord = False
```

Every Trie node contains two pieces of information.

### `children`

```python
self.children = {}
```

A dictionary mapping:

```text
character → TrieNode
```

For example:

```python
{
    'a': TrieNode,
    'b': TrieNode
}
```

means that from the current node we can move to either `a` or `b`.

Using a dictionary also means we can check whether a character exists in approximately $O(1)$ average time.

### `endOfWord`

```python
self.endOfWord = False
```

This tells us whether the current node represents the **end of a complete inserted word**.

This distinction is important.

Suppose we insert:

```text
car
cart
```

The node representing `r` has:

```python
endOfWord = True
```

because `"car"` is a complete word.

It also has a child:

```text
r → t
```

because `"cart"` exists.

Therefore, **a node can simultaneously be the end of one word and a prefix of another word.**

---

# 3. Trie Initialization

```python
class Trie:
    def __init__(self):
        self.root = TrieNode()
```

The Trie always starts with an empty root node.

```text
root
```

The root does **not** represent a character.

It simply acts as the starting point for every word.

---

# 4. Insert

```python
def insert(self, word):
    cur = self.root

    for c in word:
        if c not in cur.children:
            cur.children[c] = TrieNode()

        cur = cur.children[c]

    cur.endOfWord = True
```

## Idea

For every character:

1. Check whether the current node already has that character as a child.
    
2. If not, create a new node.
    
3. Move `cur` to that child.
    
4. After processing the entire word, mark the final node as `endOfWord`.
    

---

## Example: Insert `"cat"`

Initially:

```text
root
```

### Process `'c'`

`c` does not exist:

```python
if 'c' not in cur.children:
    cur.children['c'] = TrieNode()
```

Now:

```text
root
 └── c
```

Move:

```python
cur = cur.children['c']
```

---

### Process `'a'`

Create `a`:

```text
root
 └── c
      └── a
```

---

### Process `'t'`

Create `t`:

```text
root
 └── c
      └── a
           └── t
```

After the loop:

```python
cur.endOfWord = True
```

Therefore:

```text
root
 └── c
      └── a
           └── t [EOW]
```

Now `"cat"` exists in the Trie.

---

## Inserting a word with an existing prefix

Suppose `"cat"` already exists and we insert:

```text
car
```

We already have:

```text
c → a
```

so we reuse those nodes.

Only `r` needs to be created:

```text
root
 └── c
      └── a
           ├── t [EOW]
           └── r [EOW]
```

This is the **prefix sharing** property of a Trie.

---

# 5. Search

```python
def search(self, word):
    cur = self.root

    for c in word:
        if c not in cur.children:
            return False

        cur = cur.children[c]

    return cur.endOfWord
```

## Important idea

Searching has **two conditions**:

1. The entire character path must exist.
    
2. The final node must have `endOfWord = True`.
    

The second condition is essential.

---

## Example

Suppose the Trie contains:

```text
car
```

Then:

```text
root
 └── c
      └── a
           └── r [EOW]
```

### Search `"car"`

We successfully follow:

```text
c → a → r
```

At `r`:

```python
cur.endOfWord == True
```

Therefore:

```python
search("car") → True
```

---

### Search `"ca"`

We successfully follow:

```text
c → a
```

But:

```python
a.endOfWord == False
```

Therefore:

```python
search("ca") → False
```

Even though `"ca"` is a valid **prefix**, it was not inserted as a complete word.

### Key distinction

```text
Path exists ≠ Word exists
```

A path represents a prefix.

`endOfWord = True` tells us that the prefix is also a complete word.

---

# 6. Starts With / Prefix Search

```python
def startsWith(self, word):
    cur = self.root

    for c in word:
        if c not in cur.children:
            return False

        cur = cur.children[c]

    return True
```

Unlike `search()`, we **do not check `endOfWord`**.

We only care whether the entire prefix path exists.

---

## Example

Trie contains:

```text
car
cart
cat
```

Conceptually:

```text
root
 └── c
      └── a
           ├── r [EOW]
           │    └── t [EOW]
           │
           └── t [EOW]
```

### `startsWith("ca")`

Path exists:

```text
c → a
```

Therefore:

```python
True
```

even though `"ca"` itself isn't necessarily a word.

### `startsWith("car")`

Path exists:

```text
c → a → r
```

Therefore:

```python
True
```

### `startsWith("cab")`

There is no `b` after `ca`.

Therefore:

```python
False
```

---

# 7. Delete

Deletion is the most interesting operation because simply removing the characters can break other words that share the same prefix.

Our implementation uses **DFS + backtracking**.

```python
def delete(self, word):
    def dfs(node, i):
        if i == len(word):
            if not node.endOfWord:
                return False, False

            node.endOfWord = False

            return True, len(node.children) == 0

        if word[i] not in node.children:
            return False, False

        child = node.children[word[i]]

        deleted, shouldDeleteChild = dfs(child, i + 1)

        if not deleted:
            return False, False

        if shouldDeleteChild:
            node.children.pop(word[i])

        return True, len(node.children) == 0 and not node.endOfWord

    dfs(self.root, 0)
```

---

# 8. Why Can't We Simply Remove the Word?

Suppose the Trie contains:

```text
car
cart
```

```text
root
 └── c
      └── a
           └── r [EOW]
                └── t [EOW]
```

If we delete `"cart"`, we should get:

```text
root
 └── c
      └── a
           └── r [EOW]
```

We only remove `t`.

But if we delete `"car"`:

```text
root
 └── c
      └── a
           └── r [EOW]
                └── t [EOW]
```

we **must not remove `r`**, because `cart` still needs it.

Therefore deletion must determine:

> "After deleting this word, is this node still needed?"

---

# 9. The Two Return Values of DFS

Our DFS returns:

```python
(deleted, shouldDelete)
```

These mean two different things.

### `deleted`

```text
Was the requested word actually found and deleted?
```

### `shouldDelete`

```text
Can this node now be removed by its parent?
```

So:

```text
(deleted, shouldDelete)
```

is essentially:

```text
(word was deleted?, this node can be pruned?)
```

This allows information to propagate from the bottom of the Trie back toward the root.

---

# 10. Delete Example — `"cart"`

Consider:

```text
car
cart
```

Trie:

```text
root
 └── c
      └── a
           └── r [EOW]
                └── t [EOW]
```

We call:

```python
delete("cart")
```

DFS travels downward:

```text
root
  ↓
 c
  ↓
 a
  ↓
 r
  ↓
 t
```

At `t`:

```python
i == len(word)
```

We have reached the node representing `"cart"`.

Since:

```python
t.endOfWord == True
```

we execute:

```python
t.endOfWord = False
```

Now:

```text
t
endOfWord = False
children = {}
```

Therefore:

```python
return True, True
```

Meaning:

```text
True  → "cart" was deleted.
True  → t can be deleted.
```

---

# 11. Returning to the Parent

We return to `r`.

We received:

```python
deleted = True
shouldDeleteChild = True
```

Therefore:

```python
if shouldDeleteChild:
    node.children.pop('t')
```

So:

```text
r
```

no longer has a `t` child.

Now `r` looks like:

```text
r
├── endOfWord = True
└── children = {}
```

Can `r` be deleted?

No.

Because:

```python
not node.endOfWord
```

is `False`.

Therefore:

```python
return True, False
```

Meaning:

```text
"cart" was deleted,
but r must remain because "car" still exists.
```

The final Trie is:

```text
root
 └── c
      └── a
           └── r [EOW]
```

---

# 12. Delete Example — `"car"`

Now suppose the Trie contains:

```text
car
```

only:

```text
root
 └── c
      └── a
           └── r [EOW]
```

Call:

```python
delete("car")
```

DFS reaches `r`.

At the terminal node:

```python
r.endOfWord = False
```

Now:

```text
r
├── endOfWord = False
└── children = {}
```

Therefore:

```python
return True, True
```

`r` can be deleted.

---

## Backtracking

Parent `a` receives:

```python
(True, True)
```

so:

```python
a.children.pop('r')
```

Now `a` has no children and is not the end of a word.

Therefore:

```python
return True, True
```

The same thing happens for `c`.

Eventually:

```text
root
```

has no children.

The entire path has been pruned.

---

# 13. Why `not node.endOfWord` Matters

This condition:

```python
return True, len(node.children) == 0 and not node.endOfWord
```

is critical.

Consider:

```text
car
cart
```

After deleting `"cart"`:

```text
r
├── endOfWord = True
└── children = {}
```

Although:

```python
len(r.children) == 0
```

we cannot delete `r`.

Why?

Because `r` represents the word `"car"`.

Therefore:

```python
len(node.children) == 0
```

alone is insufficient.

We need:

```python
len(node.children) == 0 and not node.endOfWord
```

Meaning:

> "This node has no children AND does not represent the end of another word."

Only then is the node completely useless.

---

# 14. Delete a Non-existent Word

Suppose Trie contains:

```text
cat
```

and we call:

```python
delete("car")
```

DFS follows:

```text
c → a
```

At `a`, we look for:

```text
r
```

but only:

```text
t
```

exists.

Therefore:

```python
if word[i] not in node.children:
    return False, False
```

This propagates:

```text
False, False
```

all the way back to the root.

Nothing is modified.

---

# 15. Complete Implementation

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.endOfWord = False


class Trie:

    def __init__(self):
        self.root = TrieNode()


    def insert(self, word):
        cur = self.root

        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()

            cur = cur.children[c]

        cur.endOfWord = True


    def delete(self, word):

        def dfs(node, i):

            # Reached the node representing the complete word
            if i == len(word):

                if not node.endOfWord:
                    return False, False

                node.endOfWord = False

                # Parent can delete this node if it has no children
                return True, len(node.children) == 0


            if word[i] not in node.children:
                return False, False


            child = node.children[word[i]]

            deleted, shouldDeleteChild = dfs(child, i + 1)


            if not deleted:
                return False, False


            # Child became useless → remove it
            if shouldDeleteChild:
                node.children.pop(word[i])


            # Current node can now also be pruned
            return True, len(node.children) == 0 and not node.endOfWord


        dfs(self.root, 0)


    def search(self, word):

        cur = self.root

        for c in word:

            if c not in cur.children:
                return False

            cur = cur.children[c]

        return cur.endOfWord


    def startsWith(self, word):

        cur = self.root

        for c in word:

            if c not in cur.children:
                return False

            cur = cur.children[c]

        return True
```

---

# 16. Complexity

Let $L$ be the length of the word/prefix.

|Operation|Time|Auxiliary Space|
|---|--:|--:|
|`insert`|$O(L)$|$O(1)$|
|`search`|$O(L)$|$O(1)$|
|`startsWith`|$O(L)$|$O(1)$|
|`delete`|$O(L)$|$O(L)$|

### Why is deletion space $O(L)$?

Deletion uses recursive DFS:

```text
root
 ↓
 c
 ↓
 a
 ↓
 r
 ↓
 t
```

There can be at most $L$ recursive calls.

Therefore recursion stack:

O(L)O(L)

The Trie nodes themselves are **not counted as auxiliary space** because they are the existing data structure.

---

# 17. Core Invariants to Remember

### Insert

```text
Every character corresponds to a node along the path.
Final node → endOfWord = True
```

### Search

```text
Entire path must exist
AND
final node must have endOfWord = True
```

### StartsWith

```text
Entire prefix path must exist.
endOfWord does not matter.
```

### Delete

A node can be pruned only when:

```text
No children
AND
Not endOfWord
```

The recursive deletion communicates:

```text
(deleted, shouldDelete)
```

where:

```text
deleted
    ↓
Was the requested word successfully deleted?

shouldDelete
    ↓
Can the parent safely remove this node?
```

---

# 18. Mental Model for Trie Deletion

The easiest way to remember the deletion algorithm is:

> **Go down to the end of the word, unmark it, then walk back upward pruning nodes that have become useless.**

At every node during the return:

```text
Did deletion succeed?
        │
        ├── No → stop; nothing to modify
        │
        └── Yes
              │
              ├── Child useless? → remove child
              │
              └── Am I useless?
                    │
                    ├── no children
                    └── not endOfWord
```

This is essentially **post-order processing** of the word's Trie path:

```text
Go down:
root → c → a → r → t

Come back:
t → r → a → c → root
```

The downward phase **finds the word**.

The upward phase **performs pruning**.