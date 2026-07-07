import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './KthSmallest.module.css'

const TEST_CASES = [
  { label: 'Test 1 — BST [3,1,4,null,2], k=1', detail: 'Smallest = 1',
    treeArr: [3, 1, 4, null, 2], k: 1 },
  { label: 'Test 2 — BST [5,3,6,2,4,null,null,1], k=3', detail: '3rd smallest = 3',
    treeArr: [5, 3, 6, 2, 4], k: 3 },
  { label: 'Test 3 — BST [4,2,6,1,3,5,7], k=4', detail: '4th smallest = 4 (root)',
    treeArr: [4, 2, 6, 1, 3, 5, 7], k: 4 },
  { label: 'Test 4 — BST [4,2,6,1,3,5,7], k=6', detail: '6th smallest = 6',
    treeArr: [4, 2, 6, 1, 3, 5, 7], k: 6 },
]

const ALGORITHMS = [
  { id: 'inorder', name: 'Inorder DFS (early exit)', complexity: 'O(h + k) time · O(h) space' },
]

const CODE = {
  inorder: [
    'function kthSmallest(root, k):',
    '  count = 0; result = null',
    '  function inorder(node):',
    '    if node is null: return',
    '    inorder(node.left)',
    '    count += 1',
    '    if count == k: result = node.val; return',
    '    inorder(node.right)',
    '  inorder(root)',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Currently visiting' },
  { token: 'done',    label: 'Visited (count incremented)' },
  { token: 'found',   label: 'kth smallest — answer!' },
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

export default function KthSmallestVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('inorder')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr, k } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr, k), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const root       = buildDisplayTree(treeArr)
  const highlights = step?.highlights ?? {}
  const count      = step?.count      ?? 0
  const result     = step?.result     ?? null


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "treeArr",
                "label": "Tree (BFS array)",
                "type": "array",
                "placeholder": "3,1,4,null,2"
            },
            {
                "key": "k",
                "label": "k",
                "type": "number",
                "placeholder": "1"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ treeArr: parsed.treeArr, k: parsed.k }); hook.reset()
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
        'k':       k,
        'Count':   count,
        ...(step.isAnswer ? { 'Found!': step.nodeVal } : {}),
        ...(step.done     ? { 'Answer': result, 'Status': 'Complete ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.kRow}>
          <span className={styles.kLabel}>Finding the</span>
          <span className={styles.kBadge}>{k}{k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'}</span>
          <span className={styles.kLabel}>smallest</span>
          <span className={styles.countBadge}>count = {count}</span>
        </div>

        <TreeDisplay root={root} highlights={highlights} width={560} height={280} />

        {step?.done && result !== null && (
          <div className={styles.resultBadge}>
            {k}{k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} smallest = <strong>{result}</strong>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
