/**
 * Tutorial content for #100 — Search Suggestions System
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a list of products and a search word, return a list of up to 3 suggested products after typing each character of the search word. Suggestions must start with the typed prefix and be in lexicographical (alphabetical) order.`,
    example: `products = ["mobile","mouse","moneypot","monitor","mousepad"]\nsearchWord = "mouse"\n\nAfter "m":     ["mobile","moneypot","monitor"]\nAfter "mo":    ["mobile","moneypot","monitor"]\nAfter "mou":   ["mouse","mousepad"]\nAfter "mous":  ["mouse","mousepad"]\nAfter "mouse": ["mouse","mousepad"]\n✅ Answer: [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]`,
    keyInsight: `Sort the products list once. Then for each prefix, use binary search to find the first product that starts with that prefix — all matching products appear consecutively in the sorted list, so just take the next 3.`,
  },

  approaches: {
    'Sort + Binary Search': {
      intuition: `Sort the products alphabetically. For each prefix (after each character typed), binary search for the insertion point of the prefix. All products that start with the prefix appear right at or after that insertion point (since they are alphabetically ≥ prefix). Check the next 3 products and keep only those that still start with the prefix.`,
      steps: [
        `Sort products lexicographically.`,
        `result = [].`,
        `For i from 1 to len(searchWord):`,
        `  prefix = searchWord[0..i].`,
        `  Use binary search (lower_bound/bisect_left) to find idx = first index where products[idx] >= prefix.`,
        `  Collect up to 3 products starting at idx that begin with prefix.`,
        `  result.add(collected list).`,
        `Return result.`,
      ],
      example: `products=["mobile","mouse","moneypot","monitor","mousepad"]\nSorted: ["mobile","moneypot","monitor","mouse","mousepad"]\n\nprefix="m": bisect_left → idx=0. Check [0,1,2]: "mobile","moneypot","monitor" — all start with "m" ✓\nprefix="mo": idx=0. Check [0,1,2]: "mobile","moneypot","monitor" — all start with "mo" ✓\nprefix="mou": bisect_left → idx=3. Check [3,4]: "mouse","mousepad" — both start with "mou" ✓\nprefix="mous": idx=3. Check [3,4]: "mouse","mousepad" ✓\nprefix="mouse": idx=3. Check [3,4]: "mouse" (starts with "mouse"), "mousepad" ✓\n✅ Result matches expected`,
      keyInsight: `O(n log n + L * (log n + L)) time where n = products count and L = searchWord length. O(n log n) for sort. Binary search per prefix is the key optimization over brute force.`,
    },

    'Trie': {
      intuition: `Build a Trie (prefix tree) from all products. Each node in the trie represents one character. At each node, also store the top 3 lexicographically smallest words that pass through it (precomputed during insertion). Then searching for suggestions is just traversing the trie character by character.`,
      steps: [
        `Sort products (so insertion order determines lexicographic preference).`,
        `Build a Trie: for each product, insert character by character; at each node, append the product to a list and keep only the first 3.`,
        `To answer queries: walk the trie along searchWord. At each step, append the current node's top-3 list. If no node for the next character, fill remaining results with empty lists.`,
      ],
      example: `products sorted: ["mobile","moneypot","monitor","mouse","mousepad"]\n\nTrie root → m → [mobile,moneypot,monitor]\n            mo→ [mobile,moneypot,monitor]\n            mob→[mobile]\n            mon→[moneypot,monitor]\n            mou→[mouse,mousepad]\n            ...\n\nsearchWord="mouse": walk m→mo→mou→mous→mouse\nAt each node return stored top-3 list ✅`,
      keyInsight: `O(sum of product lengths) to build, O(L) per query. Very fast queries but requires significant upfront memory and build time. Best when many queries will be made over the same product list.`,
    },

    'Sort + Linear Scan': {
      intuition: `Sort the products. For each prefix, scan ALL products from the beginning and collect those that start with the prefix, stopping once you have 3. Because the list is sorted, the first 3 matching products are the lexicographically smallest — no binary search needed.`,
      steps: [
        `Sort products.`,
        `For each prefix:`,
        `  Scan products from index 0.`,
        `  Collect products that start with prefix; stop at 3.`,
        `  Add collected list to result.`,
      ],
      example: `products sorted: ["mobile","moneypot","monitor","mouse","mousepad"]\n\nprefix="mou": scan → "mobile" starts with "mou"? No. "moneypot"? No. "monitor"? No. "mouse"? Yes. "mousepad"? Yes. 2 found.\nResult for "mou": ["mouse","mousepad"] ✅`,
      keyInsight: `O(n log n + L * n) time. The linear scan per prefix makes this O(n) per prefix — slower than binary search but simpler to implement. Fine for small product lists.`,
    },

    'Sort + Two Pointers': {
      intuition: `Sort the products. Maintain a window [lo, hi] into the sorted products array. As each character of searchWord is typed, narrow the window by moving lo forward past any product that no longer matches the current prefix, and hi backward past any product that no longer matches. The current window contains all matching products.`,
      steps: [
        `Sort products. lo = 0, hi = len(products) - 1.`,
        `For i from 0 to len(searchWord)-1:`,
        `  c = searchWord[i].`,
        `  While lo <= hi AND (len(products[lo]) <= i OR products[lo][i] != c): lo++.`,
        `  While lo <= hi AND (len(products[hi]) <= i OR products[hi][i] != c): hi--.`,
        `  Collect up to 3 products from products[lo..hi].`,
        `  result.add(collected).`,
      ],
      example: `products sorted: ["mobile","moneypot","monitor","mouse","mousepad"]\nlo=0, hi=4\n\ni=0, c='m': no changes needed (all start with 'm'). take [0..2] → ["mobile","moneypot","monitor"]\ni=1, c='o': no changes (all start with 'mo'). take [0..2] → ["mobile","moneypot","monitor"]\ni=2, c='u': "mobile"[2]='b'≠'u' → lo=1. "moneypot"[2]='n'≠'u' → lo=2. "monitor"[2]='n'≠'u' → lo=3. hi side: "mousepad"[2]='u'='u' ok. hi stays 4.\n  take [3..4] → ["mouse","mousepad"] ✅`,
      keyInsight: `O(n log n + L * n) worst case, but typically faster in practice since the window shrinks quickly. O(1) extra space after sorting. Elegant — the window naturally converges as the prefix grows.`,
    },

    'Brute Force with Filtering': {
      intuition: `For each prefix, filter the entire products list to find all products starting with that prefix, sort the filtered results, and return the first 3. No upfront sorting required — sort happens per query. Simplest possible implementation.`,
      steps: [
        `For i from 1 to len(searchWord):`,
        `  prefix = searchWord[0..i].`,
        `  filtered = [p for p in products if p starts with prefix].`,
        `  Sort filtered.`,
        `  result.add(first 3 of filtered).`,
        `Return result.`,
      ],
      example: `products=["mobile","mouse","moneypot","monitor","mousepad"]\nprefix="mou":\n  filtered=[p for p if p.startswith("mou")]→["mouse","moneypot"? no, "mousepad"]\n  Wait: "moneypot" starts with "mo" not "mou". filtered=["mouse","mousepad"]\n  sorted: ["mouse","mousepad"]\n  first 3: ["mouse","mousepad"] ✅`,
      keyInsight: `O(L * n log n) time — filter and sort for every prefix. Very slow for large inputs. Only useful as the simplest reference implementation to verify more efficient solutions.`,
    },
  },
}
