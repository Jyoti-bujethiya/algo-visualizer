import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import GraphDisplay from '../../components/display/GraphDisplay.jsx'
import styles from './CloneGraph.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — [[2,4],[1,3],[2,4],[1,3]]', detail: 'LeetCode Example — 4-node cycle',
    adjList: [[1,3],[0,2],[1,3],[0,2]],
  },
  {
    label: 'Test 2 — [[2],[1]]', detail: 'Two-node edge',
    adjList: [[1],[0]],
  },
  {
    label: 'Test 3 — [[2,3],[1,3],[1,2]]', detail: 'Triangle (3 nodes)',
    adjList: [[1,2],[0,2],[0,1]],
  },
  {
    label: 'Test 4 — Star graph (5 nodes)', detail: 'Node 1 connected to all others',
    adjList: [[1,2,3,4],[0],[0],[0],[0]],
  },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS + Hash Map',  complexity: 'O(V+E) time · O(V) space' },
]

const CODE = {
  dfs: [
    'function cloneGraph(node):',
    '  if node == null: return null',
    '  visited = {}',
    '  function dfs(curr):',
    '    if curr in visited: return visited[curr]',
    '    clone = new Node(curr.val)',
    '    visited[curr] = clone',
    '    for each neighbor in curr.neighbors:',
    '      clone.neighbors.push(dfs(neighbor))',
    '    return clone',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently cloning' },
  { token: 'visiting', label: 'Cloned, processing neighbors' },
  { token: 'compare',  label: 'Neighbor being examined' },
  { token: 'done',     label: 'Fully cloned' },
]

/* ── Inline SVG icons ── */
function OriginalNodeSVG({ label }) {


  return (
    <svg viewBox="0 0 40 40" className={styles.nodeIcon}>
      {/* outer ring */}
      <circle cx="20" cy="20" r="17" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2.5"/>
      {/* inner fill */}
      <circle cx="20" cy="20" r="11" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5"/>
      <text x="20" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e3a5f" fontFamily="monospace">{label}</text>
    </svg>
  )
}

function CloneNodeSVG({ label }) {
  return (
    <svg viewBox="0 0 40 40" className={styles.nodeIcon}>
      {/* outer ring — dashed purple */}
      <circle cx="20" cy="20" r="17" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2.5" strokeDasharray="4 2"/>
      {/* inner fill */}
      <circle cx="20" cy="20" r="11" fill="#c084fc" stroke="#7c3aed" strokeWidth="1.5"/>
      {/* copy icon on top-right */}
      <rect x="26" y="6" width="8" height="10" rx="1.5" fill="#7c3aed" stroke="#f3e8ff" strokeWidth="1"/>
      <rect x="24" y="9" width="8" height="10" rx="1.5" fill="#a855f7" stroke="#f3e8ff" strokeWidth="1"/>
      <text x="20" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3b0764" fontFamily="monospace">{label}</text>
    </svg>
  )
}

function CopySVG() {
  return (
    <svg viewBox="0 0 24 24" className={styles.copyArrow}>
      <path d="M12 4 L20 12 L12 20" stroke="#9333ea" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="12" x2="20" y2="12" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function buildNodes(adjList) {
  return adjList.map((_, i) => ({ id: i, label: String(i + 1) }))
}

function buildEdges(adjList) {
  const edges = []
  for (let i = 0; i < adjList.length; i++) {
    for (const j of adjList[i]) {
      if (j > i) edges.push({ from: i, to: j })
    }
  }
  return edges
}

export default function CloneGraphVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { adjList } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, adjList), [selectedAlgo, selectedTest, customCase]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'adjList', label: 'Adj list (JSON)', type: 'text', placeholder: '[[1,3],[0,2],[1,3],[0,2]]' }]}
      onApply={parsed => {
        const adjList = JSON.parse(parsed.adjList)
        setCustomCase({ adjList }); hook.reset()
      }}
    />
  )

  const highlights  = step?.highlights ?? {}
  const nodes       = buildNodes(adjList)
  const edges       = buildEdges(adjList)
  const clonedNodes = nodes.filter(n => highlights[n.id] === 'done')
  const clonedCount = clonedNodes.length

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Nodes': adjList.length,
        'Cloned so far': clonedCount,
        ...(step.done ? { 'Status': 'Cloned ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Split layout: original | copy arrow | cloned panel */}
        <div className={styles.twinPanel}>
          {/* Original graph */}
          <div className={styles.graphPanel}>
            <div className={styles.panelTitle}>
              <svg viewBox="0 0 16 16" className={styles.panelIcon}><circle cx="8" cy="8" r="6" fill="#3b82f6" opacity="0.8"/><circle cx="8" cy="8" r="3" fill="white"/></svg>
              Original
            </div>
            <GraphDisplay nodes={nodes} edges={edges} highlights={highlights} width={220} height={200} />
          </div>

          {/* Arrow */}
          <div className={styles.arrowCol}>
            <CopySVG />
            <span className={styles.arrowLabel}>clone</span>
          </div>

          {/* Clone panel */}
          <div className={styles.graphPanel}>
            <div className={styles.panelTitle}>
              <svg viewBox="0 0 16 16" className={styles.panelIcon}><circle cx="8" cy="8" r="6" fill="#9333ea" opacity="0.8" strokeDasharray="3 1.5" stroke="#7c3aed" strokeWidth="1.5"/><circle cx="8" cy="8" r="3" fill="white"/></svg>
              Cloned copy
            </div>
            <div className={styles.cloneList}>
              {clonedNodes.length === 0 ? (
                <span className={styles.emptyClone}>…waiting for nodes…</span>
              ) : clonedNodes.map(n => (
                <CloneNodeSVG key={n.id} label={n.label} />
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${adjList.length ? (clonedCount / adjList.length) * 100 : 0}%` }}
            />
          </div>
          <span className={styles.progressLabel}>{clonedCount}/{adjList.length} nodes cloned</span>
        </div>
      </div>
    </VisualizerShell>
  )
}
