/**
 * parseApproaches — splits a raw solution file into named approach sections.
 *
 * Handles four header styles found across the 100 problems:
 *   // ==================== APPROACH N: Name ====================   (C++ style A)
 *   * APPROACH N: Name  (inside block comments)                     (C++ style B)
 *   # APPROACH N: Name  (Python)                                    (Python)
 *   // APPROACH N: Name  (Java single-line comment)                 (Java)
 *
 * Complexity can appear in two ways:
 *   • Inline on the header line:  "// APPROACH 1: Name | O(n) time | O(n) space"
 *   • On subsequent lines:        "Time Complexity: O(n)"
 *
 * Returns an array of:
 *   { name, timeComplexity, spaceComplexity, code }
 *
 * If no APPROACH markers are found the whole file is returned as one item
 * with name "Solution".
 */
export function parseApproaches(rawText, language = 'cpp') {
  if (!rawText) return []

  const lines = rawText.split('\n')

  // ── Build the marker regex for each language ──────────────────────────────
  // Python:  # APPROACH N:
  // Java:    // APPROACH N:   (single-line comment, no ===)
  // C++:     // === APPROACH N: ===  OR  * APPROACH N:  (block comment)
  let markerRe
  if (language === 'python') {
    markerRe = /#\s*APPROACH\s+\d+\s*:/i
  } else if (language === 'java') {
    markerRe = /\/\/\s*APPROACH\s+\d+\s*:/i
  } else {
    // C++: either === style or block-comment * style
    markerRe = /(?:\/\/\s*={2,}\s*APPROACH\s+\d+\s*:|(?:^|\s)\*\s+APPROACH\s+\d+\s*:)/im
  }

  // Find all approach header line indices
  const headerIndices = []
  lines.forEach((line, idx) => {
    if (markerRe.test(line)) headerIndices.push(idx)
  })

  // No markers found — return whole file as one approach
  if (headerIndices.length === 0) {
    return [{
      name: 'Solution',
      timeComplexity: '',
      spaceComplexity: '',
      code: rawText.trim(),
    }]
  }

  // Split into sections at each header
  const sections = headerIndices.map((startLine, i) => {
    const endLine = i < headerIndices.length - 1 ? headerIndices[i + 1] : lines.length
    const headerLine = lines[startLine]
    const sectionLines = lines.slice(startLine, endLine)

    // ── Extract name from header line ────────────────────────────────────────
    // Strip complexity suffix first (everything after the first |)
    // Then strip trailing === markers
    let name = 'Approach ' + (i + 1)
    const nameMatch = headerLine.match(/APPROACH\s+\d+\s*:\s*([^=\n|]+?)(?:\s*={2,}|\s*\|.*|$)/i)
    if (nameMatch) name = nameMatch[1].trim()

    // ── Extract Time/Space complexity ────────────────────────────────────────
    // Strategy 1: inline on the header line  "| O(n) time | O(n) space"
    let timeComplexity = ''
    let spaceComplexity = ''

    const inlineTime  = headerLine.match(/\|\s*(O\([^|)]+\))\s*time/i)
    const inlineSpace = headerLine.match(/\|\s*(O\([^|)]+\))\s*space/i)
    if (inlineTime)  timeComplexity  = inlineTime[1].trim()
    if (inlineSpace) spaceComplexity = inlineSpace[1].trim()

    // Strategy 2: explicit "Time Complexity: ..." lines in the first 20 lines of the section
    let explain = ''
    let when    = ''

    if (!timeComplexity || !spaceComplexity || !explain || !when) {
      const searchLines = sectionLines.slice(0, 20)
      for (const l of searchLines) {
        if (!timeComplexity) {
          const m = l.match(/Time\s+Complexity\s*:\s*(.+)/i)
          if (m) timeComplexity = m[1].replace(/\s*-.*$/, '').trim()
        }
        if (!spaceComplexity) {
          const m = l.match(/Space\s+Complexity\s*:\s*(.+)/i)
          if (m) spaceComplexity = m[1].replace(/\s*-.*$/, '').trim()
        }
        if (!explain) {
          const m = l.match(/(?:\/\/|#|\*)\s*EXPLAIN\s*:\s*(.+)/i)
          if (m) explain = m[1].trim()
        }
        if (!when) {
          const m = l.match(/(?:\/\/|#|\*)\s*WHEN\s*:\s*(.+)/i)
          if (m) when = m[1].trim()
        }
      }
    }

    const code = sectionLines.join('\n').trim()
    return { name, timeComplexity, spaceComplexity, explain, when, code }
  })

  return sections
}
