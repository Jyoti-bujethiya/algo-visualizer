import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './DiameterTree.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — [1,2,3,4,5]', detail: 'LeetCode example — diameter 3',
    treeArr: [1, 2, 3, 4, 5],
  },
  {
    label: 'Test 2 — [1,2]', detail: 'Two-node tree — diameter 1',
    treeArr: [1, 2],
  },
  {
    label: 'Test 3 — [1,2,null,3,null,null,null,4]', detail: 'Left-skewed chain',
    treeArr: [1, 2, null, 3, null, null, null, 4],
  },
  {
    label: 'Test 4 — Balanced [1,2,3,4,5,6,7]', detail: 'Full tree — diameter 4',
    treeArr: [1, 2, 3, 4, 5, 6, 7],
  },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS (Post-order)', complexity: 'O(n) time · O(h) space' },
]

const CODE = {
  dfs: [
    'function diameterOfBinaryTree(root):',
    '  maxDiameter = 0',
    '  function dfs(node):',
    '    if node == null: return 0',
    '    left  = dfs(node.left)',
    '    right = dfs(node.right)',
    '    maxDiameter = max(maxDiameter, left + right)',
    '    return 1 + max(left, right)',
    '  dfs(root)',
    '  return maxDiameter',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently computing depth' },
  { token: 'special',  label: 'New max diameter node' },
  { token: 'done',     label: 'Depth computed' },
]

/* ── Ruler badge SVG ── */
function RulerSVG({ diameter }) {
  const w = 24 + diameter * 18


  return (
    <svg viewBox={`0 0 ${w} 28`} className={styles.rulerSvg} style={{ width: `${w}px` }}>
      {/* ruler body */}
      <rect x="2" y="10" width={w - 4} height="8" rx="2" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5"/>
      {/* tick marks */}
      {Array.from({ length: diameter + 1 }, (_, i) => {
        const x = 2 + (i * (w - 4)) / Math.max(diameter, 1)
        return <line key={i} x1={x} y1="10" x2={x} y2={i === 0 || i === diameter ? "6" : "12"} stroke="#ca8a04" strokeWidth="1.5"/>
      })}
      {/* measurement label */}
      <text x={w / 2} y="8" textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400e">{diameter}</text>
    </svg>
  )
}

/* ── Depth bubbles row ── */
function DepthBubbleSVG({ nodeId, depth, isMax }) {
  return (
    <svg viewBox="0 0 40 44" className={styles.depthBubble}>
      {/* ring */}
      <circle cx="20" cy="20" r="17"
        fill={isMax ? '#fef9c3' : '#f3f4f6'}
        stroke={isMax ? '#ca8a04' : '#d1d5db'}
        strokeWidth={isMax ? 2.5 : 1.5}
      />
      {/* node id */}
      <text x="20" y="17" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="monospace">n{nodeId}</text>
      {/* depth value */}
      <text x="20" y="27" textAnchor="middle" fontSize="13" fontWeight="800"
        fill={isMax ? '#92400e' : '#374151'} fontFamily="monospace">{depth}</text>
      {/* label */}
      {isMax && <text x="20" y="39" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="700">MAX</text>}
    </svg>
  )
}

function buildDisplayTree(arr) {
  if (!arr || arr.length === 0) return null
  const nodes = arr.map((v, i) => v !== null ? { val: v, id: i, left: null, right: null } : null)
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue
    if (2 * i + 1 < nodes.length) nodes[i].left  = nodes[2 * i + 1]
    if (2 * i + 2 < nodes.length) nodes[i].right = nodes[2 * i + 2]
  }
  return nodes[0]
}

export default function DiameterOfBinaryTreeVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(treeArr), [selectedAlgo, selectedTest, customCase]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'treeArr', label: 'Tree (BFS level, null ok)', type: 'text', placeholder: '1,2,3,4,5' }]}
      onApply={parsed => {
        const arr = parsed.treeArr.split(',').map(x => x.trim() === 'null' ? null : Number(x.trim()))
        setCustomCase({ treeArr: arr }); hook.reset()
      }}
    />
  )

  const root        = buildDisplayTree(treeArr)
  const highlights  = step?.highlights ?? {}
  const maxDiameter = step?.maxDiameter
  const depthMap    = step?.depthMap ?? {}  // optional: nodeId -> computed depth

  const depthEntries = Object.entries(depthMap)

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        ...(maxDiameter !== undefined ? { 'Max diameter so far': maxDiameter } : {}),
        ...(step.done ? { 'Final diameter': maxDiameter, 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Diameter ruler */}
        {maxDiameter !== undefined && (
          <div className={styles.diameterWrap}>
            <span className={styles.diameterLabel}>Diameter:</span>
            <div className={styles.diameterBadge}>{maxDiameter}</div>
            {maxDiameter > 0 && <RulerSVG diameter={maxDiameter} />}
          </div>
        )}

        {/* Depth bubbles for computed nodes */}
        {depthEntries.length > 0 && (
          <div className={styles.depthRow}>
            <span className={styles.depthLabel}>Computed depths:</span>
            <div className={styles.bubbles}>
              {depthEntries.map(([nodeId, depth]) => (
                <DepthBubbleSVG
                  key={nodeId}
                  nodeId={nodeId}
                  depth={depth}
                  isMax={depth === Math.max(...Object.values(depthMap))}
                />
              ))}
            </div>
          </div>
        )}

        <TreeDisplay root={root} highlights={highlights} width={560} height={280} />
      </div>
    </VisualizerShell>
  )
}
