import styles from './ArrayDisplay.module.css'

// State name → CSS token name mapping (standardized)
const STATE_CLASS = {
  current:   styles.current,
  active:    styles.current,
  pivot:     styles.current,
  checking:  styles.compare,
  compare:   styles.compare,
  inner:     styles.compare,
  found:     styles.match,
  match:     styles.match,
  solution:  styles.match,
  mid:       styles.special,
  special:   styles.special,
  highlight: styles.special,
  inMap:     styles.special,
  'in-map':  styles.special,
  visited:   styles.discard,
  done:      styles.discard,
  discarded: styles.discard,
  outRange:  styles.discard,
  conflict:  styles.error,
  error:     styles.error,
  attack:    styles.error,
}

/**
 * ArrayDisplay — renders a flat array of cells with highlight states and
 * optional pointer labels above/below each cell.
 *
 * Props:
 *   elements   {Array<number|string>}  — values to display
 *   highlights {Array<{index, type}>}  — index → state name
 *   pointers   {Array<{index, label, above?:boolean}>} — e.g. [{ index:0, label:'L' }]
 *   showIndex  {boolean} — show index numbers below (default true)
 */
export default function ArrayDisplay({
  elements = [],
  highlights = [],
  pointers = [],
  showIndex = true,
}) {
  if (!elements.length) {
    return <div className={styles.empty}>No elements to display</div>
  }

  const highlightMap = {}
  highlights.forEach(h => { highlightMap[h.index] = h.type ?? h.state })

  // Group pointers by position and direction
  const ptrAbove = {}
  const ptrBelow = {}
  pointers.forEach(p => {
    if (p.above === false) {
      if (!ptrBelow[p.index]) ptrBelow[p.index] = []
      ptrBelow[p.index].push(p.label)
    } else {
      if (!ptrAbove[p.index]) ptrAbove[p.index] = []
      ptrAbove[p.index].push(p.label)
    }
  })

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {elements.map((val, i) => {
          const stateType  = highlightMap[i]
          const stateClass = STATE_CLASS[stateType] ?? ''
          const aboveLabels = ptrAbove[i]
          const belowLabels = ptrBelow[i]

          return (
            <div key={i} className={styles.cell}>
              {/* Pointer label above */}
              <div className={styles.ptrAbove}>
                {aboveLabels?.map((l, li) => (
                  <span key={li} className={styles.ptr}>{l}</span>
                ))}
              </div>

              {/* Cell box */}
              <div className={`${styles.box} ${stateClass}`}>
                {val === null || val === undefined ? '∅' : String(val)}
              </div>

              {/* Index label */}
              {showIndex && <div className={styles.idx}>{i}</div>}

              {/* Pointer label below */}
              {belowLabels && (
                <div className={styles.ptrBelow}>
                  {belowLabels.map((l, li) => (
                    <span key={li} className={styles.ptr}>{l}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
