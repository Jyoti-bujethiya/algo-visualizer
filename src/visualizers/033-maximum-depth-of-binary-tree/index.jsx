import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './MaxDepth.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [3,9,20,null,null,15,7]', detail: 'Depth = 3 (LeetCode example)',
    treeArr: [3, 9, 20, null, null, 15, 7] },
  { label: 'Test 2 — Balanced [4,2,6,1,3,5,7]', detail: 'Depth = 3',
    treeArr: [4, 2, 6, 1, 3, 5, 7] },
  { label: 'Test 3 — Single node [1]', detail: 'Depth = 1',
    treeArr: [1] },
  { label: 'Test 4 — Left-skewed [1,2,null,3,null]', detail: 'Depth = 3',
    treeArr: [1, 2, null, 3, null] },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS (Recursive)', complexity: 'O(n) time · O(h) space' },
  { id: 'bfs', name: 'BFS (Level Count)', complexity: 'O(n) time · O(w) space' },
]

const CODE = {
  dfs: [
    'function maxDepth(root):',
    '  if root is null: return 0',
    '  leftDepth = maxDepth(root.left)',
    '  rightDepth = maxDepth(root.right)',
    '  return 1 + max(leftDepth, rightDepth)',
  ],
  bfs: [
    'function maxDepth(root):',
    '  if root is null: return 0',
    '  queue = [root]; depth = 0',
    '  while queue not empty:',
    '    depth += 1',
    '    process all nodes in current level, enqueue children',
    '  return depth',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently processing' },
  { token: 'visited',  label: 'Level processed (BFS)' },
  { token: 'done',     label: 'Depth computed (DFS)' },
]

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

export default function MaxDepthVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const root       = buildDisplayTree(treeArr)
  const highlights = step?.highlights  ?? {}
  const maxSoFar   = step?.maxSoFar    ?? 0


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "treeArr",
                "label": "Tree (BFS, null ok)",
                "type": "text",
                "placeholder": "3,9,20,null,null,15,7"
            }
        ]}
      onApply={parsed => {
        const treeArr = parsed.treeArr.split(',').map(x => x.trim() === 'null' ? null : Number(x.trim()))
        setCustomCase({ treeArr }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Depth so far': maxSoFar,
        ...(step.nodeVal !== undefined ? { 'Node': step.nodeVal, 'Left depth': step.left ?? '—', 'Right depth': step.right ?? '—' } : {}),
        ...(step.done ? { 'Max depth': step.answer, 'Status': 'Complete ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <TreeDisplay root={root} highlights={highlights} width={560} height={280} />

        <div className={styles.depthBadge}>
          <span className={styles.depthLabel}>Max depth</span>
          <span className={`${styles.depthValue} ${step?.done ? styles.depthDone : ''}`}>{maxSoFar}</span>
        </div>
      </div>
    </VisualizerShell>
  )
}
