import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './LCA.module.css'

const TEST_CASES = [
  { label: 'Test 1 — LCA of 2 and 8 in BST', detail: 'BST [6,2,8,0,4,7,9], p=2, q=8',
    treeArr: [6, 2, 8, 0, 4, 7, 9], p: 2, q: 8 },
  { label: 'Test 2 — LCA of 2 and 4', detail: 'BST [6,2,8,0,4,7,9], p=2, q=4',
    treeArr: [6, 2, 8, 0, 4, 7, 9], p: 2, q: 4 },
  { label: 'Test 3 — LCA of 0 and 9', detail: 'BST [6,2,8,0,4,7,9], p=0, q=9',
    treeArr: [6, 2, 8, 0, 4, 7, 9], p: 0, q: 9 },
  { label: 'Test 4 — LCA in smaller BST', detail: 'BST [5,3,7], p=3, q=7',
    treeArr: [5, 3, 7], p: 3, q: 7 },
]

const ALGORITHMS = [
  { id: 'bst', name: 'BST Property (Iterative)', complexity: 'O(h) time · O(1) space' },
]

const CODE = {
  bst: [
    'function lca(root, p, q):',
    '  if root is null: return null',
    '  if p < root.val and q < root.val:',
    '    return lca(root.left, p, q)',
    '  if p > root.val and q > root.val:',
    '    return lca(root.right, p, q)',
    '  return root   // split point = LCA',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently examining' },
  { token: 'discard',  label: 'Eliminated (wrong direction)' },
  { token: 'found',    label: 'LCA found (split point)' },
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

export default function LCAVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bst')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr, p, q } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr, p, q), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const root       = buildDisplayTree(treeArr)
  const highlights = step?.highlights ?? {}


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "treeArr",
                "label": "BST (BFS, null ok)",
                "type": "text",
                "placeholder": "6,2,8,0,4,7,9"
            },
            {
                "key": "p",
                "label": "p val",
                "type": "number",
                "placeholder": "2"
            },
            {
                "key": "q",
                "label": "q val",
                "type": "number",
                "placeholder": "8"
            }
        ]}
      onApply={parsed => {
        const treeArr = parsed.treeArr.split(',').map(x => x.trim() === 'null' ? null : Number(x.trim()))
        setCustomCase({ treeArr, p, q }); hook.reset()
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
        'Target p': p,
        'Target q': q,
        ...(step.nodeVal !== undefined ? { 'Checking node': step.nodeVal } : {}),
        ...(step.direction ? { 'Direction': step.direction } : {}),
        ...(step.done && step.answer !== undefined ? { 'LCA': step.answer } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.targetRow}>
          <span className={styles.targetLabel}>Finding LCA of</span>
          <span className={styles.targetBadge}>{p}</span>
          <span className={styles.targetLabel}>and</span>
          <span className={styles.targetBadge}>{q}</span>
        </div>

        <TreeDisplay root={root} highlights={highlights} width={560} height={280} />

        {step?.done && step.answer !== undefined && (
          <div className={styles.resultBadge}>
            LCA = <strong>{step.answer}</strong>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
