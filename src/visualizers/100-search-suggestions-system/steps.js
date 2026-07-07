// 100 — Search Suggestions System · steps.js
// For each prefix of searchWord, return up to 3 products with that prefix (sorted)
// Approach 1 — Binary Search on sorted products
// Approach 2 — Trie + DFS

// Binary Search line indices:
// 0: function suggestedProducts(products, searchWord):
// 1:   products.sort()
// 2:   result = []
// 3:   prefix = ''
// 4:   for each char c in searchWord:
// 5:     prefix += c
// 6:     lo = lowerBound(products, prefix)
// 7:     collect up to 3 from lo that start with prefix
// 8:   return result

// Trie line indices:
// 0: function suggestedProducts(products, searchWord):
// 1:   build Trie from sorted products
// 2:   traverse trie char by char
// 3:   at each prefix node, collect ≤3 words via DFS
// 4:   if prefix missing in trie: []
// 5:   return result

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

function lowerBound(arr, prefix) {
  let lo = 0, hi = arr.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] < prefix) lo = mid + 1
    else hi = mid
  }
  return lo
}

export function generateSteps(algo, products, searchWord) {
  const steps = []

  push(steps,
    `Search Suggestions: for each prefix of "${searchWord}", find up to 3 products from [${products.join(', ')}] that match.`,
    {}, 0
  )

  if (algo === 'binary') {
    const sorted = [...products].sort()
    push(steps,
      `Sorted products: [${sorted.join(', ')}].`,
      {}, 1, { sorted }
    )

    const result = []
    let prefix = ''

    for (let ci = 0; ci < searchWord.length; ci++) {
      prefix += searchWord[ci]
      const lo = lowerBound(sorted, prefix)

      const suggestions = []
      for (let i = lo; i < sorted.length && suggestions.length < 3; i++) {
        if (sorted[i].startsWith(prefix)) suggestions.push(sorted[i])
        else break
      }
      result.push(suggestions)

      const hl = {}
      sorted.forEach((w, i) => {
        if (w.startsWith(prefix)) hl[i] = suggestions.includes(w) ? 'match' : 'compare'
        else hl[i] = 'done'
      })

      push(steps,
        `Prefix "${prefix}": lowerBound=${lo}. Suggestions: [${suggestions.join(', ')}].`,
        hl, 7, { prefix, suggestions: [...suggestions], result: result.map(s => [...s]) }
      )
    }

    push(steps,
      `Done. Results for all ${searchWord.length} prefixes of "${searchWord}".`,
      {}, 8, { result: result.map(s => [...s]), done: true }
    )

  } else {
    // Trie
    // Build trie
    const trie = {}
    const sorted = [...products].sort()
    for (const w of sorted) {
      let node = trie
      for (const c of w) {
        if (!node[c]) node[c] = {}
        node = node[c]
      }
      node['$'] = w
    }

    push(steps,
      `Built trie from sorted [${sorted.join(', ')}]. Now traverse char by char for "${searchWord}".`,
      {}, 1, { sorted }
    )

    const result = []
    let node = trie
    let dead = false
    let prefix = ''

    for (let ci = 0; ci < searchWord.length; ci++) {
      const c = searchWord[ci]
      prefix += c

      if (dead || !node[c]) {
        dead = true
        result.push([])
        push(steps,
          `Prefix "${prefix}": no trie node for '${c}'. No suggestions.`,
          {}, 4, { prefix, suggestions: [], result: result.map(s => [...s]) }
        )
        continue
      }

      node = node[c]

      // DFS collect ≤3 words
      const suggestions = []
      function dfs(n) {
        if (suggestions.length >= 3) return
        if (n['$']) suggestions.push(n['$'])
        for (const k of Object.keys(n).filter(k => k !== '$').sort()) {
          if (suggestions.length >= 3) return
          dfs(n[k])
        }
      }
      dfs(node)
      result.push(suggestions)

      const hl = {}
      sorted.forEach((w, i) => {
        if (suggestions.includes(w)) hl[i] = 'match'
        else if (w.startsWith(prefix)) hl[i] = 'compare'
      })

      push(steps,
        `Prefix "${prefix}": trie DFS found [${suggestions.join(', ')}].`,
        hl, 3, { prefix, suggestions: [...suggestions], result: result.map(s => [...s]) }
      )
    }

    push(steps,
      `Done. Results for all ${searchWord.length} prefixes of "${searchWord}".`,
      {}, 5, { result: result.map(s => [...s]), done: true }
    )
  }

  return steps
}
