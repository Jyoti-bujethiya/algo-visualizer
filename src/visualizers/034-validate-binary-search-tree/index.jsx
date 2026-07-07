import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './ValidateBST.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Valid BST [5,3,7,1,4,6,8]', detail: 'All constraints satisfied',
    treeArr: [5, 3, 7, 1, 4, 6, 8] },
  { label: 'Test 2 — Invalid [5,1,4,null,null,3,6]', detail: 'LeetCode example — 4 in right but 3 < 5',
    treeArr: [5, 1, 4, null, null, 3, 6] },
  { label: 'Test 3 — Single node [10]', detail: 'Valid BST',
    treeArr: [10] },
  { label: 'Test 4 — Right child too small [3,2,5,null,null,4,6]', detail: 'Valid BST',
    treeArr: [3, 2, 5, null, null, 4, 6] },
]

const ALGORITHMS = [
  { id: 'bounds', name: 'Bounds Propagation (DFS)', complexity: 'O(n) time · O(h) space' },
]

const CODE = {
  bounds: [
    'function isValidBST(root):',
    '  return validate(root, -∞, +∞)',
    'function validate(node, min, max):',
    '  if node is null: return true',
    '  if node.val <= min or node.val >= max: return false',
    '  leftOk  = validate(node.left, min, node.val)',
    '  rightOk = validate(node.right, node.val, max)',
    '  return leftOk and rightOk',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently checking' },
  { token: 'visiting', label: 'Passed — checking children' },
  { token: 'done',     label: 'Subtree valid' },
  { token: 'invalid',  label: 'Constraint violated' },
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

export default function ValidateBSTVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bounds')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const root       = buildDisplayTree(treeArr)
  const highlights = step?.highlights ?? {}
  const isValid    = step?.isValid    ?? true


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "treeArr",
                "label": "Tree (BFS, null ok)",
                "type": "text",
                "placeholder": "2,1,3"
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
        ...(step.nodeVal !== undefined ? { 'Node': step.nodeVal, 'Min bound': step.min ?? '—', 'Max bound': step.max ?? '—' } : {}),
        ...(step.done ? { 'Valid BST': step.answer ? 'Yes ✓' : 'No ✗' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <TreeDisplay root={root} highlights={highlights} width={560} height={280} />

        <div className={`${styles.verdict} ${step?.done ? (isValid ? styles.verdictValid : styles.verdictInvalid) : styles.verdictPending}`}>
          {step?.done
            ? (isValid ? '✓ Valid BST' : '✗ Not a valid BST')
            : 'Checking…'}
        </div>
      </div>
    </VisualizerShell>
  )
}
