import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import GraphDisplay from '../../components/display/GraphDisplay.jsx'
import styles from './GraphValidTree.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — 5 nodes, valid tree', detail: 'edges=[[0,1],[0,2],[0,3],[1,4]]',
    n: 5, edges: [[0,1],[0,2],[0,3],[1,4]],
  },
  {
    label: 'Test 2 — 5 nodes, cycle', detail: 'edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]',
    n: 5, edges: [[0,1],[1,2],[2,3],[1,3],[1,4]],
  },
  {
    label: 'Test 3 — 3 nodes, disconnected', detail: 'Only 1 edge (need 2)',
    n: 3, edges: [[0,1]],
  },
  {
    label: 'Test 4 — 4 nodes, linear tree', detail: '0-1-2-3',
    n: 4, edges: [[0,1],[1,2],[2,3]],
  },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS (Cycle + Connectivity)', complexity: 'O(V+E) time · O(V) space' },
  { id: 'uf',  name: 'Union-Find',                 complexity: 'O(E·α(V)) time · O(V) space' },
]

const CODE = {
  dfs: [
    'function validTree(n, edges):',
    '  if edges.length != n-1: return false',
    '  build adjacency list',
    '  visited = new Set()',
    '  function dfs(node, parent):',
    '    visited.add(node)',
    '    for each neighbor:',
    '      if neighbor == parent: skip',
    '      if neighbor in visited: return false  // cycle',
    '      if !dfs(neighbor, node): return false',
    '  dfs(0, -1)',
    '  return visited.size == n',
  ],
  uf: [
    'function validTree(n, edges):',
    '  if edges.length != n-1: return false',
    '  parent = [0..n-1]; rank = [0..n-1]',
    '  function find(x): ...',
    '  function union(x, y): ...',
    '  for each [u,v] in edges:',
    '    ru = find(u); rv = find(v)',
    '    if ru == rv: return false  // cycle',
    '    union(ru, rv)',
    '  return true',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently visiting' },
  { token: 'compare',  label: 'Neighbor / second node' },
  { token: 'done',     label: 'Visited / unioned' },
  { token: 'error',    label: 'Cycle detected' },
]

/* ── Tree crown SVG ── */
function TreeCrownSVG() {


  return (
    <svg viewBox="0 0 32 32" className={styles.crownIcon}>
      {/* trunk */}
      <rect x="14" y="22" width="4" height="8" rx="1" fill="#92400e"/>
      {/* triple-layered canopy — classic tree crown */}
      <polygon points="16,2 28,14 4,14"  fill="#16a34a"/>
      <polygon points="16,7 27,18 5,18"  fill="#15803d"/>
      <polygon points="16,12 26,22 6,22" fill="#14532d"/>
    </svg>
  )
}

/* ── Check / X badge ── */
function CheckBadgeSVG() {
  return (
    <svg viewBox="0 0 24 24" className={styles.statusIcon}>
      <circle cx="12" cy="12" r="10" fill="#d1fae5" stroke="#16a34a" strokeWidth="2"/>
      <path d="M7 12 L10.5 15.5 L17 9" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function XBadgeSVG() {
  return (
    <svg viewBox="0 0 24 24" className={styles.statusIcon}>
      <circle cx="12" cy="12" r="10" fill="#fef2f2" stroke="#dc2626" strokeWidth="2"/>
      <path d="M8 8 L16 16 M16 8 L8 16" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

/* Component group colors */
const GROUP_COLORS = ['#3b82f6','#16a34a','#d97706','#8b5cf6','#dc2626','#0891b2']

export default function GraphValidTreeVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { n, edges } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, n, edges), [selectedAlgo, selectedTest, customCase]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[
        { key: 'n',     label: 'Nodes',         type: 'number', placeholder: '5' },
        { key: 'edges', label: 'Edges (pairs)',  type: 'text',   placeholder: '[[0,1],[0,2],[0,3],[1,4]]' },
      ]}
      onApply={parsed => {
        const nVal  = parseInt(parsed.n, 10)
        const edgesParsed = JSON.parse(parsed.edges)
        setCustomCase({ n: nVal, edges: edgesParsed }); hook.reset()
      }}
    />
  )

  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const groups     = step?.groups   // optional: array of group IDs per node

  const nodes = Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) }))

  // Color nodes by their union-find group (if groups available)
  const nodeColors = {}
  if (groups && selectedAlgo === 'uf') {
    const groupIds = [...new Set(groups)]
    groups.forEach((g, i) => {
      nodeColors[i] = GROUP_COLORS[groupIds.indexOf(g) % GROUP_COLORS.length]
    })
  }

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Nodes': n,
        'Edges': edges.length,
        ...(result !== undefined ? { 'Valid Tree': result ? 'Yes ✓' : 'No ✗' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultTrue : styles.resultFalse}`}>
            <div className={styles.resultInner}>
              {result ? <CheckBadgeSVG /> : <XBadgeSVG />}
              <span>{result ? 'Valid Tree ✓' : 'Not a Valid Tree ✗'}</span>
            </div>
          </div>
        )}

        {/* Node icon row showing tree crowns */}
        <div className={styles.nodeRow}>
          {nodes.map(nd => (
            <div
              key={nd.id}
              className={`${styles.nodeBox} ${highlights[nd.id] === 'current' ? styles.nodeCurrent : highlights[nd.id] === 'done' ? styles.nodeDone : highlights[nd.id] === 'error' ? styles.nodeError : ''}`}
              style={nodeColors[nd.id] ? { borderColor: nodeColors[nd.id], background: nodeColors[nd.id] + '18' } : {}}
            >
              <TreeCrownSVG />
              <span className={styles.nodeLabel}>{nd.id}</span>
            </div>
          ))}
        </div>

        <GraphDisplay
          nodes={nodes}
          edges={edges.map(([u,v]) => ({ from: u, to: v }))}
          highlights={highlights}
          width={500} height={260}
        />
      </div>
    </VisualizerShell>
  )
}
