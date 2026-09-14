<h1 align='right'><a href="../README.md">⇐🏠</a></h1>

Complete KMP note - [KMP algorithm](../Notes/Extras/KMP%20algorithm.md)

# KMP string matching

```Python

def kmp_search(text: str, pattern: str) -> int:
    if not pattern:
        return 0
        
    # 1. Build the LPS Array
    lps = [0] * len(pattern)
    prev_lps = 0  # Pointer for matching prefix
    i = 1         # Pointer for scanning the pattern
    
    while i < len(pattern):
        if pattern[i] == pattern[prev_lps]:
            lps[i] = prev_lps + 1
            prev_lps += 1
            i += 1
        elif prev_lps == 0:
            lps[i] = 0
            i += 1
        else:
            prev_lps = lps[prev_lps - 1] # Keep i still, slide prev_lps back

    # 2. Search the Pattern in Text
    a = 0  # Pointer for text
    b = 0  # Pointer for pattern
    
    while a < len(text):
        if text[a] == pattern[b]:
            a += 1
            b += 1
        else:
            if b == 0:
                a += 1
            else:
                b = lps[b - 1] # Keep a still, slide b back
                
        # Check if the whole pattern matched
        if b == len(pattern):
            return a - len(pattern) # Returns starting index of the match
            
    return -1


```