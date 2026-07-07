import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './MergeKLists.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [[1,4,5],[1,3,4],[2,6]]',  detail: '[1,1,2,3,4,4,5,6]', lists:[[1,4,5],[1,3,4],[2,6]] },
  { label: 'Test 2 — []',                        detail: '[]',                  lists:[] },
  { label: 'Test 3 — [[1,2,3],[4,5,6],[7,8,9]]', detail: '[1..9]',             lists:[[1,2,3],[4,5,6],[7,8,9]] },
  { label: 'Test 4 — [[1],[2],[3],[4]]',          detail: '[1,2,3,4]',          lists:[[1],[2],[3],[4]] },
]

const ALGORITHMS = [
  { id: 'heap', name: 'Min-Heap', complexity: 'O(N log k) time · O(k) space' },
]

const CODE = {
  heap: [
    'function mergeKLists(lists):',
    '  heap = min-heap',
    '  for each list: push (val, listIdx, nodeIdx)',
    '  result = []',
    '  while heap not empty:',
    '    (val, li, ni) = heap.pop()',
    '    result.append(val)',
    '    if list[li][ni+1] exists: heap.push(next)',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Popped from heap (min)' },
  { token: 'compare', label: 'In heap (candidates)' },
  { token: 'match',   label: 'Added to merged result' },
]

export default function MergeKListsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('heap')
  const [customCase,   setCustomCase]   = useState(null)
  const { lists } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(lists), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const heap       = step?.heap       ?? []
  const merged     = step?.merged     ?? []
  const highlights = step?.highlights ?? {}
  const result     = step?.result


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "lists",
                "label": "Lists (semicolons)",
                "type": "text",
                "placeholder": "1,4,5;1,3,4;2,6"
            }
        ]}
      onApply={parsed => {
        const lists = parsed.lists.split(';').map(seg => seg.split(',').map(Number))
        setCustomCase({ lists }); hook.reset()
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
        'k lists': lists.length,
        'Heap size': heap.length,
        'Merged': merged.length,
        ...(result ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.listsGrid}>
          {lists.map((list, li) => (
            <div key={li} className={styles.listRow}>
              <span className={styles.listLabel}>L{li}:</span>
              {list.map((v, ni) => {
                const hl = highlights[`${li},${ni}`]
                return (
                  <span key={ni} className={`${styles.listCell}
                    ${hl === 'match' ? styles.cellDone : ''}
                    ${hl === 'compare' ? styles.cellHeap : ''}
                    ${hl === 'current' ? styles.cellCurrent : ''}`}
                  >{v}</span>
                )
              })}
            </div>
          ))}
        </div>

        <div className={styles.label}>Min-Heap (values)</div>
        <div className={styles.heapRow}>
          {heap.length === 0
            ? <span className={styles.empty}>empty</span>
            : heap.map(([v, li], i) => (
              <span key={i} className={`${styles.heapCell} ${i === 0 ? styles.heapRoot : ''}`}>
                {v}<br /><span className={styles.listLbl}>L{li}</span>
              </span>
            ))
          }
        </div>

        {merged.length > 0 && (
          <>
            <div className={styles.label}>Merged result</div>
            <div className={styles.mergedRow}>
              {merged.map((v, i) => <span key={i} className={styles.mergedCell}>{v}</span>)}
            </div>
          </>
        )}
      </div>
    </VisualizerShell>
  )
}
