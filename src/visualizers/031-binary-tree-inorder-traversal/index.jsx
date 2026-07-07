import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './InorderTraversal.module.css'

const TEST_CASES = [
  { label: 'Test 1 — BST [4,2,6,1,3,5,7]', detail: 'Full BST, result = [1,2,3,4,5,6,7]',
    treeArr: [4, 2, 6, 1, 3, 5, 7] },
  { label: 'Test 2 — Skewed right [1,null,2,null,null,null,3]', detail: 'Right-leaning tree',
    treeArr: [1, null, 2, null, null, null, 3] },
  { label: 'Test 3 — Single node [5]', detail: 'Just a root',
    treeArr: [5] },
  { label: 'Test 4 — [3,1,4,null,2]', detail: 'LeetCode example',
    treeArr: [3, 1, 4, null, 2] },
]

const ALGORITHMS = [
  { id: 'iterative', name: 'Iterative (Stack)',    complexity: 'O(n) time · O(h) space' },
  { id: 'recursive', name: 'Recursive (DFS)',       complexity: 'O(n) time · O(h) space' },
]

const CODE = {
  iterative: [
    'function inorder(root):',
    '  stack = [], curr = root',
    '  while curr != null or stack not empty:',
    '    while curr != null:',
    '      stack.push(curr); curr = curr.left',
    '    curr = stack.pop()',
    '    result.append(curr.val)',
    '    curr = curr.right',
    '  return result',
  ],
  recursive: [
    'function inorder(node):',
    '  if node is null: return',
    '  inorder(node.left)',
    '  result.append(node.val)',
    '  inorder(node.right)',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently visiting' },
  { token: 'visiting', label: 'On the stack' },
  { token: 'done',     label: 'Recorded in result' },
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

export default function InorderTraversalVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('iterative')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const root       = buildDisplayTree(treeArr)
  const highlights = step?.highlights ?? {}
  const result     = step?.result     ?? []
  const stack      = step?.stack      ?? []


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "treeArr",
                "label": "Tree (BFS, null ok)",
                "type": "text",
                "placeholder": "1,null,2,3"
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
        'Result length': result.length,
        'Stack depth':   stack.length,
        ...(step.done ? { 'Status': 'Complete ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <TreeDisplay root={root} highlights={highlights} width={560} height={260} />

        {stack.length > 0 && (
          <div className={styles.stackRow}>
            <span className={styles.stackLabel}>Stack (top →)</span>
            {[...stack].reverse().map((v, i) => (
              <span key={i} className={styles.stackCell}>{v}</span>
            ))}
          </div>
        )}

        {result.length > 0 && (
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Result so far:</span>
            {result.map((v, i) => (
              <span key={i} className={`${styles.resultCell} ${i === result.length - 1 && step?.justAdded !== undefined ? styles.resultNew : ''}`}>{v}</span>
            ))}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
