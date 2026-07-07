import styles from './TreeDisplay.module.css'

const STATE_CLASS = {
  current:  styles.current,
  active:   styles.current,
  visiting: styles.current,
  compare:  styles.compare,
  visited:  styles.match,
  done:     styles.match,
  found:    styles.match,
  match:    styles.match,
  root:     styles.special,
  special:  styles.special,
  path:     styles.special,
  invalid:  styles.error,
  error:    styles.error,
  gray:     styles.discard,
  discard:  styles.discard,
}

const NODE_R = 22

/**
 * Recursively assign (x, y) positions using a divide-and-conquer approach.
 * Returns a map of nodeId → { x, y }
 */
function layoutTree(root, width = 600, height = 320) {
  const pos = {}
  if (!root) return pos

  const levels = []
  function collectLevels(node, depth) {
    if (!node) return
    if (!levels[depth]) levels[depth] = []
    levels[depth].push(node)
    collectLevels(node.left, depth + 1)
    collectLevels(node.right, depth + 1)
  }
  collectLevels(root, 0)

  const totalLevels = levels.length
  const levelH = Math.min((height - 40) / totalLevels, 72)

  function assignX(node, lo, hi, depth) {
    if (!node) return
    const mid = (lo + hi) / 2
    pos[node.id ?? node.val] = { x: mid, y: 30 + depth * levelH }
    assignX(node.left,  lo,  mid, depth + 1)
    assignX(node.right, mid, hi,  depth + 1)
  }
  assignX(root, NODE_R + 4, width - NODE_R - 4, 0)
  return pos
}

/**
 * TreeDisplay — renders a binary tree as SVG.
 *
 * Props:
 *   root        {Object}  — tree root: { val, id?, left, right, state? }
 *   highlights  {Object}  — nodeId → state name  (e.g. { 0: 'current', 2: 'visited' })
 *   result      {Array}   — traversal result array to show below the tree
 *   width       {number}
 *   height      {number}
 */
export default function TreeDisplay({
  root = null,
  highlights = {},
  result = [],
  width = 600,
  height = 300,
}) {
  if (!root) {
    return (
      <div className={styles.wrap}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Empty tree</span>
      </div>
    )
  }

  const pos = layoutTree(root, width, height)

  // Collect all nodes and edges with DFS
  const nodes = []
  const edges = []
  function traverse(node, parentId = null) {
    if (!node) return
    const id = node.id ?? node.val
    nodes.push({ id, val: node.val, state: node.state })
    if (parentId !== null && pos[parentId] && pos[id]) {
      edges.push({ from: parentId, to: id, thread: node.thread })
    }
    traverse(node.left,  id)
    traverse(node.right, id)
  }
  traverse(root)

  return (
    <div>
      <div className={styles.wrap}>
        <svg
          className={styles.svg}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          {/* Edges first (under nodes) */}
          {edges.map((e, i) => {
            const from = pos[e.from]
            const to   = pos[e.to]
            if (!from || !to) return null
            return (
              <line
                key={i}
                className={e.thread ? styles.edgeThread : styles.edge}
                x1={from.x} y1={from.y}
                x2={to.x}   y2={to.y}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const p = pos[n.id]
            if (!p) return null
            const stateType  = highlights[n.id] ?? n.state
            const stateClass = STATE_CLASS[stateType] ?? ''
            return (
              <g key={n.id}>
                <circle
                  className={`${styles.nodeCircle} ${stateClass}`}
                  cx={p.x} cy={p.y} r={NODE_R}
                />
                <text className={styles.nodeText} x={p.x} y={p.y}>
                  {n.val}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Traversal result row */}
      {result.length > 0 && (
        <div className={styles.resultRow}>
          <span className={styles.resultLabel}>Result:</span>
          {result.map((v, i) => (
            <span key={i} className={styles.resultNode}>{v}</span>
          ))}
        </div>
      )}
    </div>
  )
}
