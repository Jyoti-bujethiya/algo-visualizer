import PointerLabel from './PointerLabel.jsx'
import styles from './LinkedListDisplay.module.css'

const STATE_CLASS = {
  current:  styles.current,
  active:   styles.current,
  prev:     styles.compare,
  compare:  styles.compare,
  next:     styles.special,
  special:  styles.special,
  found:    styles.match,
  match:    styles.match,
  visited:  styles.discard,
  done:     styles.discard,
  error:    styles.error,
}

/**
 * LinkedListDisplay — renders one or more linked list rows.
 *
 * Props:
 *   lists       {Array<{label?, nodes: Array<{val, state?}>}>}
 *               OR for simple use: just pass nodes directly as 'nodes'
 *   nodes       {Array<{val, state?}>}  — shorthand when showing one list
 *   highlights  {Object}               — nodeIndex → state name
 *   pointers    {Object}               — nodeIndex → label string, e.g. { 0:'prev', 2:'curr' }
 *   reversed    {boolean}              — draw arrows pointing left
 */
export default function LinkedListDisplay({ lists, nodes, highlights = {}, pointers = {}, reversed = false }) {
  // Normalise: accept either `lists` prop or shorthand `nodes`
  const rows = lists ?? [{ label: null, nodes: nodes ?? [] }]

  // Support array form for highlights (legacy: [{index, type}])
  const hlMap = Array.isArray(highlights)
    ? Object.fromEntries(highlights.map(h => [h.index, h.type]))
    : highlights

  return (
    <div className={styles.wrap}>
      {rows.map((row, ri) => {
        const rowNodes = row.nodes ?? []
        return (
          <div key={ri} className={styles.listRow}>
            {row.label && <span className={styles.rowLabel}>{row.label}</span>}

            {rowNodes.map((n, i) => {
              const stateType  = n.state ?? hlMap[i]
              const stateClass = STATE_CLASS[stateType] ?? ''
              const isReversed = reversed || n.reversed
              const ptrLabel   = pointers[i]
              // Pointer colour follows the cell's highlight type
              const ptrType    = stateType === 'current' || stateType === 'active'  ? 'current'
                               : stateType === 'compare' || stateType === 'prev'    ? 'compare'
                               : stateType === 'special' || stateType === 'next'    ? 'special'
                               : stateType === 'match'   || stateType === 'found'   ? 'match'
                               : undefined

              return (
                <div key={i} className={styles.nodeWrap}>
                  <div className={styles.node}>
                    {/* Pointer label above node */}
                    <div className={styles.ptrRow}>
                      {ptrLabel && <PointerLabel label={ptrLabel} type={ptrType} />}
                    </div>
                    {n.label && <span className={styles.nodeLabel}>{n.label}</span>}
                    <div className={`${styles.nodeBox} ${stateClass}`}>
                      {n.val === null || n.val === undefined ? '∅' : String(n.val)}
                    </div>
                  </div>

                  {/* Arrow to next node */}
                  {i < rowNodes.length - 1 && (
                    <span className={`${styles.arrow} ${isReversed ? styles.arrowReversed : ''}`}>
                      {isReversed ? '←' : '→'}
                    </span>
                  )}
                </div>
              )
            })}

            {/* NULL terminal */}
            {rowNodes.length > 0 && <span className={styles.null}>→ NULL</span>}
          </div>
        )
      })}
    </div>
  )
}
