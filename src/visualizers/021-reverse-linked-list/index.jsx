import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import LinkedListDisplay from '../../components/display/LinkedListDisplay.jsx'
import styles from './ReverseList.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Five nodes',  detail: '1→2→3→4→5',  arr: [1,2,3,4,5] },
  { label: 'Test 2 — Three nodes', detail: '1→2→3',       arr: [1,2,3] },
  { label: 'Test 3 — Two nodes',   detail: '1→2',         arr: [1,2] },
  { label: 'Test 4 — Single',      detail: '42',          arr: [42] },
  { label: 'Test 5 — Negatives',   detail: '-3→-1→0→2→4', arr: [-3,-1,0,2,4] },
]

const ALGORITHMS = [
  { id: 'iterative', name: 'Iterative (Optimal)', complexity: 'O(n) time · O(1) space' },
  { id: 'recursive', name: 'Recursive',           complexity: 'O(n) time · O(n) space' },
  { id: 'stack',     name: 'Stack',               complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  iterative: [
    'prev = null, curr = head',
    'while curr:',
    '  next = curr.next',
    '  curr.next = prev',
    '  prev = curr',
    '  curr = next',
    'return prev  // new head',
  ],
  recursive: [
    'reverse(node):',
    '  if !node.next: return node  // base',
    '  newHead = reverse(node.next)',
    '  node.next.next = node',
    '  node.next = null',
    '  return newHead',
  ],
  stack: [
    'stack = []',
    'while node: stack.push(node.val); node=node.next',
    'rebuild list from stack (pop order)',
  ],
}

const LEGEND = [
  { token: 'current', label: 'curr pointer' },
  { token: 'compare', label: 'prev pointer' },
  { token: 'special', label: 'next pointer (saved)' },
  { token: 'match',   label: 'Reversed / complete' },
]

export default function ReverseLinkedListVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('iterative')
  const [customCase,   setCustomCase]   = useState(null)

  const { arr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, arr), [selectedAlgo, arr]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const nodes    = step?.nodes ?? arr.map((val, i) => ({ val, id: i }))
  const hlMap    = step?.highlights ?? {}
  const pointers = {}
  if (step?.prev  >= 0) pointers[step.prev]  = 'prev'
  if (step?.curr  >= 0) pointers[step.curr]  = 'curr'
  if (step?.next  >= 0) pointers[step.next]  = 'next'

  const displayNodes = nodes.map((n, i) => ({ ...n, state: hlMap[i] }))
  const isComplete   = step?.phase === 'complete'
  const reversed     = step?.reversed ?? []
  const stack        = step?.stack    ?? []

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'arr', label: 'List values', type: 'array', placeholder: '1, 2, 3, 4, 5' }]}
      onApply={({ arr: a }) => { setCustomCase({ arr: a }); hook.reset() }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'prev':  step.prev >= 0 ? `node ${nodes[step.prev]?.val}` : 'null',
        'curr':  step.curr >= 0 ? `node ${nodes[step.curr]?.val}` : 'null',
        'Phase': step.phase ?? '—',
        ...(selectedAlgo === 'recursive' ? { 'Depth': step.callDepth ?? '—' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <LinkedListDisplay nodes={displayNodes} highlights={hlMap} pointers={pointers} />

        {selectedAlgo === 'stack' && stack.length > 0 && (
          <div className={styles.stackSection}>
            <div className={styles.label}>Stack (top →)</div>
            <div className={styles.stackRow}>
              {[...stack].reverse().map((v, i) => (
                <div key={i} className={`${styles.stackCell} ${i === 0 ? styles.stackTop : ''}`}>{v}</div>
              ))}
            </div>
          </div>
        )}

        {selectedAlgo === 'stack' && reversed.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.label}>Rebuilt List</div>
            <LinkedListDisplay nodes={reversed.map(v => ({ val: v }))} />
          </div>
        )}

        {isComplete && (
          <div className={styles.resultBadge}>
            ✅ Reversed: {[...arr].reverse().join(' → ')}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
