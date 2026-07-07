import styles from './GraphDisplay.module.css'

const STATE_CLASS = {
  current:  styles.current,
  active:   styles.current,
  visiting: styles.current,
  queued:   styles.compare,
  compare:  styles.compare,
  visited:  styles.match,
  done:     styles.match,
  found:    styles.match,
  match:    styles.match,
  special:  styles.special,
  path:     styles.special,
  discard:  styles.discard,
  error:    styles.error,
}

const NODE_R = 22

/**
 * GraphDisplay — renders a directed/undirected graph as SVG.
 * Uses a simple circular layout for node positioning by default,
 * or accepts explicit positions.
 *
 * Props:
 *   nodes       {Array<{id, label?, x?, y?, state?}>}
 *   edges       {Array<{from, to, directed?}>}
 *   highlights  {Object} — nodeId → state name
 *   directed    {boolean} — draw arrowheads (default false)
 *   width       {number}
 *   height      {number}
 */
export default function GraphDisplay({
  nodes = [],
  edges = [],
  highlights = {},
  directed = false,
  width = 560,
  height = 300,
}) {
  if (!nodes.length) {
    return <div className={styles.empty}>No graph to display</div>
  }

  // Assign circular positions to nodes that don't have explicit x/y
  const cx = width / 2
  const cy = height / 2
  const r  = Math.min(cx, cy) - NODE_R - 20

  const posMap = {}
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2
    posMap[n.id] = {
      x: n.x !== undefined ? n.x : cx + r * Math.cos(angle),
      y: n.y !== undefined ? n.y : cy + r * Math.sin(angle),
    }
  })

  const markerId     = `arrow-${Math.random().toString(36).slice(2, 6)}`
  const markerDirId  = `arrowDirect-${Math.random().toString(36).slice(2, 6)}`

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className={styles.arrowHead} />
          </marker>
          <marker
            id={markerDirId}
            viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className={styles.arrowHeadDirect} />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((e, i) => {
          const from = posMap[e.from]
          const to   = posMap[e.to]
          if (!from || !to) return null
          const isDir = directed || e.directed
          const isSpec = e.special

          // Shorten line so arrow ends at circle edge
          const dx  = to.x - from.x
          const dy  = to.y - from.y
          const len = Math.sqrt(dx * dx + dy * dy) || 1
          const x2  = to.x - (dx / len) * NODE_R
          const y2  = to.y - (dy / len) * NODE_R

          return (
            <line
              key={i}
              className={isSpec ? styles.edgeDirect : styles.edge}
              x1={from.x} y1={from.y}
              x2={x2}     y2={y2}
              markerEnd={isDir ? `url(#${isSpec ? markerDirId : markerId})` : undefined}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map(n => {
          const p = posMap[n.id]
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
                {n.label ?? n.id}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
