import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import TreeDisplay from '../../components/display/TreeDisplay.jsx'
import styles from './LevelOrder.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Full tree [3,9,20,null,null,15,7]', detail: 'LeetCode example, 3 levels',
    treeArr: [3, 9, 20, null, null, 15, 7] },
  { label: 'Test 2 — Balanced BST [4,2,6,1,3,5,7]', detail: 'All levels full',
    treeArr: [4, 2, 6, 1, 3, 5, 7] },
  { label: 'Test 3 — Single node [1]', detail: 'One level',
    treeArr: [1] },
  { label: 'Test 4 — Linear chain [1,2,null,3]', detail: 'Left-leaning',
    treeArr: [1, 2, null, 3] },
]

const ALGORITHMS = [
  { id: 'bfs', name: 'BFS (Queue)', complexity: 'O(n) time · O(w) space where w = max width' },
]

const CODE = {
  bfs: [
    'function levelOrder(root):',
    '  if root is null: return []',
    '  queue = [root], result = []',
    '  while queue not empty:',
    '    levelSize = len(queue); level = []',
    '    for i in range(levelSize):',
    '      node = queue.dequeue()',
    '      level.append(node.val)',
    '      if node.left: queue.enqueue(node.left)',
    '      if node.right: queue.enqueue(node.right)',
    '    result.append(level)',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'In queue (next level)' },
  { token: 'visited',  label: 'Dequeued and recorded' },
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

export default function LevelOrderVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { treeArr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, treeArr), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const root       = buildDisplayTree(treeArr)
  const highlights = step?.highlights ?? {}
  const result     = step?.result     ?? []
  const queue      = step?.queue      ?? []


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
        'Levels found': result.length,
        'Queue size':   queue.length,
        ...(step.level  ? { 'Current level': step.level } : {}),
        ...(step.done   ? { 'Status': 'Complete ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <TreeDisplay root={root} highlights={highlights} width={560} height={240} />

        {queue.length > 0 && (
          <div className={styles.queueRow}>
            <span className={styles.queueLabel}>Queue (front →)</span>
            {queue.map((v, i) => (
              <span key={i} className={styles.queueCell}>{v}</span>
            ))}
          </div>
        )}

        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.resultLabel}>Result levels:</div>
            {result.map((level, li) => (
              <div key={li} className={styles.levelRow}>
                <span className={`${styles.levelBadge} ${li === result.length - 1 && !step?.done ? styles.levelBadgeNew : ''}`}>L{li + 1}</span>
                {level.map((v, i) => (
                  <span key={i} className={styles.levelCell}>{v}</span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
