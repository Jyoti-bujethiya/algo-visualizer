import styles from './DPTableDisplay.module.css'

const STATE_CLASS = {
  current:  styles.current,
  active:   styles.current,
  computing:styles.current,
  compare:  styles.compare,
  match:    styles.match,
  filled:   styles.match,
  done:     styles.match,
  special:  styles.special,
  optimal:  styles.special,
  path:     styles.special,
  discard:  styles.discard,
  skip:     styles.discard,
  error:    styles.error,
}

/**
 * DPTableDisplay — renders a 1D or 2D DP table.
 *
 * For 1D:  pass `dp` as a flat array, `colHeaders` as labels
 * For 2D:  pass `dp` as array-of-arrays, `colHeaders` and `rowHeaders`
 *
 * Props:
 *   dp          {Array | Array[]}        — the table data
 *   highlights  {Object}                 — "row,col" → state  (or just "i" for 1D)
 *   colHeaders  {Array<string|number>}   — column headers
 *   rowHeaders  {Array<string|number>}   — row headers (2D only)
 *   result      {string}                 — optional result line shown below table
 *   infinity    {number|string}          — value to display as ∞ (e.g. Infinity or 1e9)
 */
export default function DPTableDisplay({
  dp = [],
  highlights = {},
  colHeaders = [],
  rowHeaders = [],
  result,
  infinity,
}) {
  const is2D = Array.isArray(dp[0])

  function cellClass(row, col) {
    const key = is2D ? `${row},${col}` : String(row)
    return STATE_CLASS[highlights[key]] ?? ''
  }

  function displayVal(v) {
    if (infinity !== undefined && v === infinity) return '∞'
    if (v === null || v === undefined) return '—'
    return String(v)
  }

  if (!is2D) {
    // ── 1D table ──────────────────────────────────────────────────────────
    return (
      <div className={styles.wrap}>
        <table className={styles.table}>
          {colHeaders.length > 0 && (
            <thead>
              <tr>
                {colHeaders.map((h, i) => (
                  <th key={i} className={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            <tr>
              {dp.map((v, i) => (
                <td key={i} className={`${styles.td} ${cellClass(i, 0)}`}>
                  {displayVal(v)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        {result && <div className={styles.result}>{result}</div>}
      </div>
    )
  }

  // ── 2D table ──────────────────────────────────────────────────────────────
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        {colHeaders.length > 0 && (
          <thead>
            <tr>
              {rowHeaders.length > 0 && <th className={styles.th} />}
              {colHeaders.map((h, i) => (
                <th key={i} className={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {dp.map((row, ri) => (
            <tr key={ri}>
              {rowHeaders[ri] !== undefined && (
                <td className={styles.tdRowHeader}>{rowHeaders[ri]}</td>
              )}
              {row.map((v, ci) => (
                <td key={ci} className={`${styles.td} ${cellClass(ri, ci)}`}>
                  {displayVal(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {result && <div className={styles.result}>{result}</div>}
    </div>
  )
}
