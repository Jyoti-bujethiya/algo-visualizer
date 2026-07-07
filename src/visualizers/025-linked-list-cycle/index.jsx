import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import CyclicListDisplay from '../../components/display/CyclicListDisplay.jsx'
import styles from './CycleDetect.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Has cycle',    detail: '[3,2,0,-4], tail→1', arr: [3,2,0,-4], cycleAt: 1 },
  { label: 'Test 2 — Head cycle',   detail: '[1,2], tail→0',       arr: [1,2],      cycleAt: 0 },
  { label: 'Test 3 — No cycle',     detail: '[1]',                  arr: [1],        cycleAt: -1 },
  { label: 'Test 4 — No cycle (5)', detail: '[1,2,3,4,5]',          arr: [1,2,3,4,5], cycleAt: -1 },
  { label: 'Test 5 — Cycle at 2',   detail: '[1,2,3,4,5], tail→2', arr: [1,2,3,4,5], cycleAt: 2 },
]

const ALGORITHMS = [
  { id: 'floyd', name: "Floyd's (Fast & Slow)", complexity: 'O(n) time · O(1) space' },
  { id: 'set',   name: 'Hash Set',              complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  floyd: [
    'slow = fast = head',
    'while fast and fast.next:',
    '  slow = slow.next',
    '  fast = fast.next.next',
    '  if slow == fast: return True',
    'return False',
  ],
  set: [
    'seen = set()',
    'while node:',
    '  if node in seen: return True',
    '  seen.add(node)',
    '  node = node.next',
    'return False',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'slow pointer' },
  { token: 'special',  label: 'fast pointer' },
  { token: 'compare',  label: 'Visited (hash set)' },
  { token: 'match',    label: 'Meeting point / cycle found' },
]

export default function LinkedListCycleVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('floyd')
  const [customCase,   setCustomCase]   = useState(null)

  const { arr, cycleAt } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, arr, cycleAt), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const nodes = step?.nodes ?? arr.map((val, i) => ({ val, id: i }))
  const ptrs  = step?.pointers ?? {}

  const hlMap = {}
  nodes.forEach((nd, i) => { if (nd.state) hlMap[i] = nd.state })


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "arr",
                "label": "List values",
                "type": "array",
                "placeholder": "3,2,0,-4"
            },
            {
                "key": "cycleAt",
                "label": "Cycle at index (-1=none)",
                "type": "number",
                "placeholder": "1"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ arr: parsed.arr, cycleAt: parsed.cycleAt }); hook.reset()
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
        'Phase': step.phase ?? '—',
        ...(step.slow !== undefined ? { 'slow': step.slow >= 0 ? `pos ${step.slow}` : 'null' } : {}),
        ...(step.fast !== undefined ? { 'fast': step.fast >= 0 ? `pos ${step.fast}` : 'null' } : {}),
        ...(step.hasCycle !== undefined ? { 'Has Cycle': step.hasCycle ? 'Yes ✓' : 'No ✗' } : {}),
        ...(step.seen ? { 'Seen': step.seen.length } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <CyclicListDisplay
          nodes={nodes.map((n, i) => ({ ...n, state: hlMap[i] ?? n.state }))}
          cycleAt={cycleAt}
          highlights={hlMap}
          pointers={ptrs}
        />

        {step?.phase === 'complete' && (
          <div className={step.hasCycle ? styles.cycleBadge : styles.noCycleBadge}>
            {step.hasCycle ? '⚠️ Cycle detected!' : '✅ No cycle — list terminates normally'}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
