import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import GraphDisplay from '../../components/display/GraphDisplay.jsx'
import styles from './ConnectedComponents.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — 5 nodes, 2 components', detail: '[[0,1],[1,2],[3,4]]',
    n: 5, edges: [[0,1],[1,2],[3,4]],
  },
  {
    label: 'Test 2 — 5 nodes, 1 component', detail: '[[0,1],[1,2],[2,3],[3,4]]',
    n: 5, edges: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    label: 'Test 3 — 6 nodes, 3 components', detail: '[[0,1],[2,3],[4,5]]',
    n: 6, edges: [[0,1],[2,3],[4,5]],
  },
  {
    label: 'Test 4 — 4 isolated nodes', detail: 'No edges',
    n: 4, edges: [],
  },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS',          complexity: 'O(V+E) time · O(V) space' },
  { id: 'uf',  name: 'Union-Find',   complexity: 'O(E·α(V)) time · O(V) space' },
]

const CODE = {
  dfs: [
    'function countComponents(n, edges):',
    '  build adjacency list',
    '  visited = new Set()',
    '  count = 0',
    '  for each node i:',
    '    if i not in visited:',
    '      dfs(i); count++',
    '  return count',
  ],
  uf: [
    'function countComponents(n, edges):',
    '  parent = [0..n-1]; count = n',
    '  function find(x): ...',
    '  function union(x, y):',
    '    if find(x) != find(y): merge; count--',
    '  for each [u,v] in edges:',
    '    union(u, v)',
    '  return count',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently visiting' },
  { token: 'compare',  label: 'Neighbor / second endpoint' },
  { token: 'done',     label: 'Visited / processed' },
]

/* Colors for up to 6 components */
const COMPONENT_COLORS = [
  { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a5f' },
  { bg: '#d1fae5', border: '#16a34a', text: '#14532d' },
  { bg: '#fef9c3', border: '#ca8a04', text: '#713f12' },
  { bg: '#f3e8ff', border: '#9333ea', text: '#3b0764' },
  { bg: '#fce7f3', border: '#ec4899', text: '#831843' },
  { bg: '#cffafe', border: '#0891b2', text: '#164e63' },
]

/* ── Component node SVG ── */
function ComponentNodeSVG({ id, color }) {


  return (
    <svg viewBox="0 0 36 36" className={styles.componentNode}>
      {/* glow ring */}
      <circle cx="18" cy="18" r="16" fill={color.bg} stroke={color.border} strokeWidth="2.5"/>
      {/* inner bubble */}
      <circle cx="18" cy="18" r="9" fill={color.border} opacity="0.85"/>
      <text x="18" y="23" textAnchor="middle" fontSize="11" fontWeight="800" fill="white" fontFamily="monospace">{id}</text>
    </svg>
  )
}

export default function ConnectedComponentsVisualizer() {
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
        { key: 'edges', label: 'Edges (pairs)',  type: 'text',   placeholder: '[[0,1],[1,2],[3,4]]' },
      ]}
      onApply={parsed => {
        const nVal = parseInt(parsed.n, 10)
        const edgesParsed = JSON.parse(parsed.edges)
        setCustomCase({ n: nVal, edges: edgesParsed }); hook.reset()
      }}
    />
  )

  const highlights = step?.highlights ?? {}
  const count      = step?.count
  const compMap    = step?.compMap  // optional: node -> component id

  const nodes = Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) }))

  // Group nodes by component
  const groups = {}
  if (compMap) {
    Object.entries(compMap).forEach(([nodeId, compId]) => {
      if (!groups[compId]) groups[compId] = []
      groups[compId].push(Number(nodeId))
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
        ...(count !== undefined ? { 'Components': count } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Component group panels */}
        {Object.keys(groups).length > 0 ? (
          <div className={styles.groupsRow}>
            {Object.entries(groups).map(([compId, nodeIds], gi) => {
              const col = COMPONENT_COLORS[gi % COMPONENT_COLORS.length]
              return (
                <div
                  key={compId}
                  className={styles.groupPanel}
                  style={{ background: col.bg, borderColor: col.border }}
                >
                  <div className={styles.groupTitle} style={{ color: col.border }}>
                    Component {Number(gi) + 1}
                  </div>
                  <div className={styles.groupNodes}>
                    {nodeIds.map(nid => (
                      <ComponentNodeSVG key={nid} id={nid} color={col} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          count !== undefined && (
            <div className={styles.countBadge} style={{ borderColor: '#8b5cf6', background: '#f5f3ff', color: '#7c3aed' }}>
              Components: {count}
            </div>
          )
        )}

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
