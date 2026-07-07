import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './ConstructTree.module.css'

const TEST_CASES = [
  { label: 'Test 1 — preorder=[3,9,20,15,7] inorder=[9,3,15,20,7]', detail: 'LeetCode example',
    preorder: [3, 9, 20, 15, 7], inorder: [9, 3, 15, 20, 7] },
  { label: 'Test 2 — preorder=[1,2,3] inorder=[2,1,3]', detail: 'Simple 3-node tree',
    preorder: [1, 2, 3], inorder: [2, 1, 3] },
  { label: 'Test 3 — preorder=[1,2,4,5,3] inorder=[4,2,5,1,3]', detail: 'Balanced 5-node tree',
    preorder: [1, 2, 4, 5, 3], inorder: [4, 2, 5, 1, 3] },
  { label: 'Test 4 — Single node [42]', detail: 'Trivial case',
    preorder: [42], inorder: [42] },
]

const ALGORITHMS = [
  { id: 'divideconquer', name: 'Divide & Conquer', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  divideconquer: [
    'function buildTree(preorder, inorder):',
    '  if preorder is empty: return null',
    '  root = Node(preorder[0])',
    '  mid = inorder.indexOf(root.val)',
    '  root.left  = buildTree(preorder[1 : mid+1], inorder[0 : mid])',
    '  root.right = buildTree(preorder[mid+1 :],   inorder[mid+1 :])',
    '  return root',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Current root being placed' },
  { token: 'visiting', label: 'Left subtree built' },
  { token: 'done',     label: 'Node fully constructed' },
]

export default function ConstructTreeVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('divideconquer')
  const [customCase,   setCustomCase]   = useState(null)

  const { preorder, inorder } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, preorder, inorder), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const highlights = step?.highlights  ?? {}
  const builtRoot  = step?.builtRoot   ?? null
  const preSlice   = step?.preSlice    ?? preorder
  const inSlice    = step?.inSlice     ?? inorder


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "preorder",
                "label": "Preorder",
                "type": "array",
                "placeholder": "3,9,20,15,7"
            },
            {
                "key": "inorder",
                "label": "Inorder",
                "type": "array",
                "placeholder": "9,3,15,20,7"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ preorder: parsed.preorder, inorder: parsed.inorder }); hook.reset()
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
        'Preorder slice': preSlice.length > 0 ? `[${preSlice.slice(0,5).join(',')}${preSlice.length > 5 ? '…' : ''}]` : '[]',
        'Inorder slice':  inSlice.length  > 0 ? `[${inSlice.slice(0,5).join(',')}${inSlice.length  > 5 ? '…' : ''}]` : '[]',
        ...(step.rootVal !== undefined ? { 'Placing root': step.rootVal } : {}),
        ...(step.done ? { 'Status': 'Complete ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.inputRows}>
          <div className={styles.inputRow}>
            <span className={styles.inputLabel}>Preorder</span>
            {preorder.map((v, i) => (
              <span key={i} className={`${styles.inputCell} ${preSlice.length > 0 && preSlice[0] === v && i === preorder.indexOf(v) ? styles.inputActive : ''}`}>{v}</span>
            ))}
          </div>
          <div className={styles.inputRow}>
            <span className={styles.inputLabel}>Inorder</span>
            {inorder.map((v, i) => (
              <span key={i} className={styles.inputCell}>{v}</span>
            ))}
          </div>
        </div>

        {builtRoot && (
          <TreeDisplay root={builtRoot} highlights={highlights} width={520} height={260} />
        )}
        {!builtRoot && (
          <div className={styles.emptyTree}>Tree being constructed…</div>
        )}
      </div>
    </VisualizerShell>
  )
}
