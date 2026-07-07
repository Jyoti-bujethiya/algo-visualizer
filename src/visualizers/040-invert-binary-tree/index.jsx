import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './InvertTree.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [4,2,7,1,3,6,9]', detail: 'LeetCode example — mirror of BST',
    treeArr: [4, 2, 7, 1, 3, 6, 9] },
  { label: 'Test 2 — [2,1,3]', detail: 'Simple 3-node tree',
    treeArr: [2, 1, 3] },
  { label: 'Test 3 — Single node [1]', detail: 'No change',
    treeArr: [1] },
  { label: 'Test 4 — [1,2,null,3]', detail: 'Left-leaning chain',
    treeArr: [1, 2, null, 3] },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS (Recursive)', complexity: 'O(n) time · O(h) space' },
]

const CODE = {
  dfs: [
    'function invertTree(root):',
    '  if root is null: return null',
    '  root.left, root.right = root.right, root.left',
    '  invertTree(root.left)',
    '  invertTree(root.right)',
    '  return root',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'About to swap children' },
  { token: 'visiting', label: 'Swapped — recursing into children' },
  { token: 'done',     label: 'Fully inverted' },
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

export default function InvertTreeVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  // 040 uses step.tree for the live mutated tree snapshot
  const displayRoot = step?.tree ?? buildDisplayTree(treeArr)
  const highlights  = step?.highlights ?? {}


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "treeArr",
                "label": "Tree (BFS, null ok)",
                "type": "text",
                "placeholder": "4,2,7,1,3,6,9"
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
        ...(step.nodeVal !== undefined ? { 'Node': step.nodeVal, 'Old left': step.leftVal ?? 'null', 'Old right': step.rightVal ?? 'null' } : {}),
        ...(step.done ? { 'Status': 'Inverted ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.label}>{step?.done ? 'Inverted tree:' : 'Tree (being inverted):'}</div>
        <TreeDisplay root={displayRoot} highlights={highlights} width={560} height={280} />
      </div>
    </VisualizerShell>
  )
}
