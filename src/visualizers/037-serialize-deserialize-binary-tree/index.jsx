import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './Serialize.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,2,3,null,null,4,5]', detail: 'LeetCode example',
    treeArr: [1, 2, 3, null, null, 4, 5] },
  { label: 'Test 2 — BST [4,2,6,1,3,5,7]', detail: 'Full balanced BST',
    treeArr: [4, 2, 6, 1, 3, 5, 7] },
  { label: 'Test 3 — Single node [42]', detail: 'Just a root',
    treeArr: [42] },
  { label: 'Test 4 — Left chain [1,2,null,3]', detail: 'Left-leaning',
    treeArr: [1, 2, null, 3] },
]

const ALGORITHMS = [
  { id: 'bfs', name: 'BFS Level-Order', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  bfs: [
    'function serialize(root):',
    '  if root is null: return ""',
    '  queue = [root]; result = []',
    '  while queue not empty:',
    '    node = queue.dequeue()',
    '    if node is null: result.append("N"); continue',
    '    result.append(node.val)',
    '    queue.enqueue(node.left, node.right)',
    '  return result.join(",")',
    '',
    'function deserialize(data):',
    '  root = Node(data[0]); queue = [root]; i = 1',
    '  while queue not empty:',
    '    node = queue.dequeue()',
    '    if data[i] != "N": node.left = Node(data[i]); enqueue',
    '    if data[i+1] != "N": node.right = Node(data[i+1]); enqueue',
    '    i += 2',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Currently serializing' },
  { token: 'visited', label: 'Already serialized' },
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

export default function SerializeVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const root       = buildDisplayTree(treeArr)
  const highlights = step?.highlights  ?? {}
  const serialized = step?.serialized  ?? []


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "treeArr",
                "label": "Tree (BFS, null ok)",
                "type": "text",
                "placeholder": "1,2,3,4,5"
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
        'Phase':           step.phase ?? 'serialize',
        'Output tokens':   serialized.length,
        ...(step.nodeVal !== undefined ? { 'Processing': step.nodeVal } : {}),
        ...(step.done && step.serializedStr ? { 'Final string': step.serializedStr } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <TreeDisplay root={root} highlights={highlights} width={560} height={260} />

        {serialized.length > 0 && (
          <div className={styles.serialRow}>
            <span className={styles.serialLabel}>Serialized:</span>
            <div className={styles.serialTokens}>
              {serialized.map((t, i) => (
                <span key={i} className={`${styles.serialToken} ${t === 'N' ? styles.serialNull : ''}`}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
