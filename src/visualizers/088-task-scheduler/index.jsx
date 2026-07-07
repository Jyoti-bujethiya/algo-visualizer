import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './TaskScheduler.module.css'

const TEST_CASES = [
  { label: 'Test 1 — ["A","A","A","B","B","B"], n=2', detail: 'Answer: 8',  tasks:['A','A','A','B','B','B'], n:2 },
  { label: 'Test 2 — ["A","A","A","B","B","B"], n=0', detail: 'Answer: 6',  tasks:['A','A','A','B','B','B'], n:0 },
  { label: 'Test 3 — ["A","A","A","A","A","A","B","C","D","E","F","G"], n=2', detail: 'Answer: 16', tasks:['A','A','A','A','A','A','B','C','D','E','F','G'], n:2 },
  { label: 'Test 4 — ["A","C","A","B","D","B"], n=1', detail: 'Answer: 6',  tasks:['A','C','A','B','D','B'], n:1 },
]

const ALGORITHMS = [
  { id: 'greedy', name: 'Greedy (most-frequent first)', complexity: 'O(n·|tasks|) time' },
]

const CODE = {
  greedy: [
    'function leastInterval(tasks, n):',
    '  freq = count frequencies',
    '  sort desc by frequency',
    '  maxFreq = freq[0]; maxCount = # with maxFreq',
    '  slots = (maxFreq-1)*(n+1) + maxCount',
    '  return max(slots, tasks.length)',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Scheduled task' },
  { token: 'compare', label: 'Idle slot' },
  { token: 'match',   label: 'Completed' },
]

const TASK_COLORS = ['A','B','C','D','E','F','G','H']

export default function TaskSchedulerVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('greedy')
  const [customCase,   setCustomCase]   = useState(null)
  const { tasks, n } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(tasks, n), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const timeline = step?.timeline ?? []
  const freq     = step?.freq     ?? {}
  const result   = step?.result


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "tasks",
                "label": "Tasks (chars)",
                "type": "text",
                "placeholder": "AAABBB"
            },
            {
                "key": "n",
                "label": "Cooldown n",
                "type": "number",
                "placeholder": "2"
            }
        ]}
      onApply={parsed => {
        const tasks = parsed.tasks.trim().split('')
        setCustomCase({ tasks, n }); hook.reset()
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
        'Tasks': tasks.length,
        'n (cooldown)': n,
        'Time elapsed': timeline.length,
        ...(result !== undefined ? { 'Total intervals': result } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.freqRow}>
          {Object.entries(freq).sort((a,b)=>b[1]-a[1]).map(([task, count]) => (
            <span key={task} className={`${styles.freqChip} ${styles[`task${task}`] || ''}`}>
              {task}: {count}
            </span>
          ))}
        </div>
        {timeline.length > 0 && (
          <>
            <div className={styles.label}>Timeline (t=0 → t={timeline.length-1})</div>
            <div className={styles.timeline}>
              {timeline.map((t, i) => (
                <div key={i} className={`${styles.timeSlot} ${t === 'idle' ? styles.slotIdle : styles.slotTask}`}>
                  <span className={styles.slotTask}>{t}</span>
                  <span className={styles.slotTime}>{i}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {result !== undefined && (
          <div className={styles.resultBadge}>Total intervals: {result}</div>
        )}
      </div>
    </VisualizerShell>
  )
}
