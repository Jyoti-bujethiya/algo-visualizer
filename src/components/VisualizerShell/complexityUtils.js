/**
 * complexityUtils — parse an algorithm's complexity string and classify Big-O.
 *
 * Input strings look like:
 *   "O(max(m,n)) time · O(max(m,n)) space"
 *   "O(n log n) time · O(n) space"
 *   "O(n²) time | O(1) space"
 *   "O(m·n) time · O(m·n) space"
 *   "O(V+E) time · O(V) space"
 */

/**
 * Ordered Big-O tiers (best → worst).
 * Each entry: { label, width (% of bar), color token }
 */
export const BIG_O_TIERS = [
  { key: 'O(1)',        label: 'Constant',     width:  8  },
  { key: 'O(log n)',    label: 'Logarithmic',  width: 18  },
  { key: 'O(n)',        label: 'Linear',       width: 34  },
  { key: 'O(n log n)',  label: 'Linearithmic', width: 50  },
  { key: 'O(n²)',       label: 'Quadratic',    width: 68  },
  { key: 'O(2ⁿ)',       label: 'Exponential',  width: 84  },
  { key: 'O(n!)',       label: 'Factorial',    width: 100 },
]

/** Fixed semantic colors: Time is always blue, Space is always green. */
export const COMPLEXITY_COLORS = {
  time:   '#58a6ff',   // blue  — matches screenshot TIME column
  space:  '#3fb950',   // green — matches screenshot SPACE column
  custom: '#8b949e',   // grey  — unknown/custom expressions
}

/**
 * Split a complexity string into its top-level "·" or "|" or "," separated
 * parts — but ONLY split on delimiters that are OUTSIDE parentheses.
 *
 * e.g. "O(m·n) time · O(m·n) space"
 *       ↑ this · is inside parens → keep it
 *                    ↑ this · is outside → split here
 */
function splitOutsideParens(str) {
  const parts = []
  let depth = 0
  let current = ''

  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (ch === '(') {
      depth++
      current += ch
    } else if (ch === ')') {
      depth--
      current += ch
    } else if (depth === 0 && (ch === '·' || ch === '|')) {
      parts.push(current.trim())
      current = ''
    } else if (depth === 0 && ch === ',' && !/O\([^)]*$/.test(current)) {
      // comma outside parens and not inside an O(...) expression
      parts.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) parts.push(current.trim())
  return parts
}

/** Normalise a raw complexity token to match a tier key. */
function normalise(raw) {
  if (!raw) return null
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\^2|²|\*\*2/g, '²')     // n^2 → n²
    .replace(/\^n|\*\*n/g, 'ⁿ')       // 2^n → 2ⁿ
    .replace(/nlogn|n\*logn/g, 'nlogn')

  if (s === 'o(1)')                              return 'O(1)'
  if (s === 'o(logn)' || s === 'o(log(n))')      return 'O(log n)'
  // n × log(anything) → linearithmic
  if (s.includes('logn') || /o\([a-z]log/.test(s)) return 'O(n log n)'
  if (s === 'o(n)')                              return 'O(n)'
  if (s.includes('n²') || s.includes('n^2'))    return 'O(n²)'
  if (s.includes('2ⁿ') || s.includes('2^n') || s.includes('4ⁿ') || s.includes('4^n')) return 'O(2ⁿ)'
  if (s.includes('n!'))                          return 'O(n!)'

  // ── Single-variable linear forms: O(h), O(w), O(k), O(V), O(E), O(C)...
  // Single lowercase/uppercase letter or a plain word like "capacity", "target"
  if (/^o\([a-z]\)$/i.test(s)) return 'O(n)'
  // Named-variable single terms: O(capacity), O(target), O(k)...
  if (/^o\([a-z][a-z0-9]*\)$/.test(s)) return 'O(n)'

  // ── Multi-variable products/sums: O(m·n), O(m+n), O(V+E), O(m·n·k)...
  // Also covers O(m·n·(m+n)) style — anything with · or + between terms
  if (/^o\([^)]+[·+][^)]*\)$/.test(s)) return 'O(n log n)'

  // ── O(max(m,n)), O(min(m,n)) → linear
  if (s.startsWith('o(max') || s.startsWith('o(min')) return 'O(n)'

  // ── O(log(m·n)) → logarithmic
  if (s.startsWith('o(log')) return 'O(log n)'

  return null
}

/** Return the tier object for a raw complexity string, or a generic fallback. */
export function classifyComplexity(raw) {
  if (!raw) return null
  const key = normalise(raw)
  const tier = BIG_O_TIERS.find(t => t.key === key)
  if (tier) return tier
  // Unknown shape — display as-is with a neutral mid-range bar
  return { key: raw, label: 'Custom', width: 42 }
}

/**
 * Parse "O(n) time · O(1) space" → { time: 'O(n)', space: 'O(1)' }
 * Correctly handles · inside O(...) expressions (e.g. O(m·n)).
 * Returns { time: string|null, space: string|null }
 */
export function parseComplexityString(str) {
  if (!str) return { time: null, space: null }

  const parts = splitOutsideParens(str)

  let time  = null
  let space = null

  for (const part of parts) {
    const lower = part.toLowerCase()
    // Extract the first O(...) token from this segment
    const bigO = extractFirstBigO(part)
    if (!bigO) continue
    if (lower.includes('space')) space = bigO
    else if (lower.includes('time')) time = bigO
    else if (!time) time = bigO   // first unlabelled = time
    else if (!space) space = bigO  // second unlabelled = space
  }

  return { time, space }
}

/**
 * Extract the first O(...) token from a string, respecting nested parens.
 * e.g. "O(max(m,n)) time" → "O(max(m,n))"
 *      "O(m·n) time"      → "O(m·n)"
 */
function extractFirstBigO(str) {
  const start = str.search(/O\(/i)
  if (start === -1) return null
  // start+1 is the '(' of O(  — begin scanning from start+2 with depth=0
  // meaning we are already inside that opening paren
  let depth = 0
  for (let i = start + 2; i < str.length; i++) {
    if (str[i] === '(') depth++
    else if (str[i] === ')') {
      if (depth === 0) return str.slice(start, i + 1)
      depth--
    }
  }
  return null
}
