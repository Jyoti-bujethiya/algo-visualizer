import PointerLabel from './PointerLabel.jsx'
import styles from './CyclicListDisplay.module.css'

const TEXT_COLOR = {
  current: 'var(--color-current)',
  active:  'var(--color-current)',
  compare: 'var(--color-compare)',
  prev:    'var(--color-compare)',
  special: 'var(--color-special)',
  next:    'var(--color-special)',
  match:   'var(--color-match)',
  found:   'var(--color-match)',
  discard: 'var(--color-discard)',
  visited: 'var(--color-discard)',
  done:    'var(--color-discard)',
  error:   'var(--color-error)',
}

/**
 * CyclicListDisplay — renders a linked list with an optional back-edge cycle arrow.
 *
 * Props:
 *   nodes      {Array<{val, id?, state?}>}  — the list nodes in order
 *   cycleAt    {number}                     — index that the tail points back to (-1 = no cycle)
 *   highlights {Object}                     — index → state name
 *   pointers   {Object}                     — index → label string (e.g. { 0:'slow', 2:'fast' })
 */

const STATE_CLASS = {
  current:  styles.current,
  active:   styles.current,
  compare:  styles.compare,
  prev:     styles.compare,
  special:  styles.special,
  next:     styles.special,
  match:    styles.match,
  found:    styles.match,
  visited:  styles.discard,
  done:     styles.discard,
  error:    styles.error,
}

const NODE_W   = 48  // node box width
const NODE_H   = 48  // node box height
const H_GAP    = 28  // horizontal gap between boxes (arrow zone)
const PTR_H    = 22  // height above node reserved for pointer labels
const PAD_X    = 20  // left/right padding
const PAD_TOP  = PTR_H + 8
const CURVE_H  = 44  // how far below the nodes the cycle arc dips

export default function CyclicListDisplay({ nodes = [], cycleAt = -1, highlights = {}, pointers = {} }) {
  const n = nodes.length
  if (n === 0) return null

  const STEP   = NODE_W + H_GAP                         // distance between node centres
  const totalW = PAD_X * 2 + STEP * (n - 1) + NODE_W   // SVG width
  const hasCycle = cycleAt >= 0 && cycleAt < n

  // SVG height: base = PTR_H + nodeH + bottom padding; extra for cycle arc
  const svgH = PAD_TOP + NODE_H + (hasCycle ? CURVE_H + 18 : 18)

  // Centre-x of node i
  const cx = i => PAD_X + i * STEP + NODE_W / 2

  // y-coord of top of node box
  const nodeTop = PAD_TOP

  return (
    <div className={styles.wrap}>
      <svg
        width={totalW}
        height={svgH}
        viewBox={`0 0 ${totalW} ${svgH}`}
        className={styles.svg}
      >
        {/* ── Straight arrows between consecutive nodes ────────────────────── */}
        {nodes.map((_, i) => {
          if (i >= n - 1) return null  // last node handled separately
          const x1 = cx(i) + NODE_W / 2
          const x2 = cx(i + 1) - NODE_W / 2
          const y  = nodeTop + NODE_H / 2
          return (
            <g key={`arr-${i}`}>
              <line
                x1={x1} y1={y} x2={x2 - 6} y2={y}
                className={styles.edge}
              />
              <polygon
                points={`${x2},${y} ${x2 - 8},${y - 4} ${x2 - 8},${y + 4}`}
                className={styles.arrowHead}
              />
            </g>
          )
        })}

        {/* ── Tail → NULL  (only when no cycle) ──────────────────────────── */}
        {!hasCycle && (
          <text
            x={cx(n - 1) + NODE_W / 2 + 6}
            y={nodeTop + NODE_H / 2 + 5}
            className={styles.nullText}
          >
            → NULL
          </text>
        )}

        {/* ── Cycle back-edge (curved arc below) ──────────────────────────── */}
        {hasCycle && (() => {
          const tailCx = cx(n - 1) + NODE_W / 2   // right edge of tail node
          const tailCy = nodeTop + NODE_H          // bottom of tail node
          const entryCx = cx(cycleAt) + NODE_W / 2 // centre-x of entry node
          const entryCy = nodeTop + NODE_H          // bottom of entry node

          // Arc control point — dips below both nodes
          const arcY  = tailCy + CURVE_H
          const midX  = (tailCx + entryCx) / 2

          // Arrowhead at the entry node (pointing up)
          const arrTipX = entryCx
          const arrTipY = entryCy + 1  // just below the box border

          const d = [
            `M ${tailCx} ${tailCy}`,
            `C ${tailCx} ${arcY}, ${midX} ${arcY + 12}, ${midX} ${arcY}`,
            `C ${midX} ${arcY + 12}, ${entryCx} ${arcY}, ${entryCx} ${entryCy + 4}`,
          ].join(' ')

          return (
            <g key="cycle-arc">
              <path d={d} className={styles.cycleEdge} />
              {/* Arrowhead pointing upward into entry node */}
              <polygon
                points={`${arrTipX},${arrTipY} ${arrTipX - 5},${arrTipY + 10} ${arrTipX + 5},${arrTipY + 10}`}
                className={styles.cycleArrowHead}
              />
              {/* "cycle" label on the arc */}
              <text
                x={midX}
                y={arcY + 16}
                className={styles.cycleLabel}
                textAnchor="middle"
              >
                cycle back-edge
              </text>
            </g>
          )
        })()}

        {/* ── Node boxes ──────────────────────────────────────────────────── */}
        {nodes.map((node, i) => {
          const stateType  = highlights[i] ?? node.state
          const stateClass = STATE_CLASS[stateType] ?? ''
          const x          = PAD_X + i * STEP
          const y          = nodeTop
          const isCycleEntry = hasCycle && i === cycleAt
          const isTail       = hasCycle && i === n - 1

          return (
            <g key={`node-${i}`}>
              {/* Pointer label above node */}
              {pointers[i] && (
                <foreignObject
                  x={x + NODE_W / 2 - 28}
                  y={4}
                  width={56}
                  height={PTR_H}
                >
                  <div xmlns="http://www.w3.org/1999/xhtml" className={styles.ptrWrap}>
                    <PointerLabel label={pointers[i]} type={
                      stateType === 'current' ? 'current'
                      : stateType === 'compare' || stateType === 'prev' ? 'compare'
                      : stateType === 'special' ? 'special'
                      : stateType === 'match' || stateType === 'found' ? 'match'
                      : undefined
                    } />
                  </div>
                </foreignObject>
              )}

              {/* Node box */}
              <rect
                x={x} y={y}
                width={NODE_W} height={NODE_H}
                rx={6}
                className={`${styles.nodeBox} ${stateClass} ${isCycleEntry ? styles.cycleEntry : ''} ${isTail ? styles.cycleTail : ''}`}
              />

              {/* Node value */}
              <text
                x={x + NODE_W / 2}
                y={y + NODE_H / 2 + 5}
                className={styles.nodeText}
                textAnchor="middle"
                fill={TEXT_COLOR[stateType] ?? 'var(--text-primary)'}
              >
                {node.val === null || node.val === undefined ? '∅' : String(node.val)}
              </text>

              {/* Cycle-entry marker ring */}
              {isCycleEntry && (
                <rect
                  x={x - 3} y={y - 3}
                  width={NODE_W + 6} height={NODE_H + 6}
                  rx={9}
                  className={styles.cycleEntryRing}
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
