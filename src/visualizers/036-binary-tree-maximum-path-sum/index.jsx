import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './MaxPathSum.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,2,3]', detail: 'Max path = 6 (2→1→3)',
    treeArr: [1, 2, 3] },
  { label: 'Test 2 — [-10,9,20,null,null,15,7]', detail: 'Max path = 42 (15→20→7)',
    treeArr: [-10, 9, 20, null, null, 15, 7] },
  { label: 'Test 3 — All negatives [-3,-2,-1]', detail: 'Max path = -1 (single node)',
    treeArr: [-3, -2, -1] },
  { label: 'Test 4 — [2,-1]', detail: 'Max path = 2',
    treeArr: [2, -1] },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'Post-order DFS', complexity: 'O(n) time · O(h) space' },
]

const CODE = {
  dfs: [
    'function maxPathSum(root):',
    '  globalMax = -Infinity',
    '  function dfs(node):',
    '    if node is null: return 0',
    '    leftGain  = max(dfs(node.left), 0)',
    '    rightGain = max(dfs(node.right), 0)',
    '    pathThrough = node.val + leftGain + rightGain',
    '    globalMax = max(globalMax, pathThrough)',
    '    return node.val + max(leftGain, rightGain)',
    '  dfs(root)',
    '  return globalMax',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Currently computing' },
  { token: 'found',   label: 'Updated global max' },
  { token: 'done',    label: 'Subtree computed' },
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

export default function MaxPathSumVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const root       = buildDisplayTree(treeArr)
  const highlights = step?.highlights ?? {}
  const globalMax  = step?.globalMax  ?? -Infinity


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "treeArr",
                "label": "Tree (BFS, null ok)",
                "type": "text",
                "placeholder": "-10,9,20,null,null,15,7"
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
        'Global max': globalMax === -Infinity ? '—' : globalMax,
        ...(step.nodeVal !== undefined ? {
          'Node': step.nodeVal,
          'Left gain': step.leftGain ?? '—',
          'Right gain': step.rightGain ?? '—',
          'Path through': step.pathThrough ?? '—',
        } : {}),
        ...(step.done ? { 'Answer': step.answer, 'Status': 'Complete ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <TreeDisplay root={root} highlights={highlights} width={560} height={280} />

        <div className={styles.maxBadge}>
          <span className={styles.maxLabel}>Global Max</span>
          <span className={`${styles.maxValue} ${step?.done ? styles.maxDone : ''}`}>
            {globalMax === -Infinity ? '—' : globalMax}
          </span>
        </div>
      </div>
    </VisualizerShell>
  )
}
