import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import GraphDisplay from '../../components/display/GraphDisplay.jsx'
import styles from './CourseSchedule.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — 2 courses, [[1,0]]', detail: 'Take 0 before 1 — no cycle',
    numCourses: 2, prereqs: [[1, 0]],
  },
  {
    label: 'Test 2 — 2 courses, [[1,0],[0,1]]', detail: 'Cycle: 0→1→0',
    numCourses: 2, prereqs: [[1, 0], [0, 1]],
  },
  {
    label: 'Test 3 — 4 courses, chain 0→1→2→3', detail: 'Linear dependency',
    numCourses: 4, prereqs: [[1,0],[2,1],[3,2]],
  },
  {
    label: 'Test 4 — 5 courses with cycle', detail: '3→4→2→3 cycle',
    numCourses: 5, prereqs: [[1,0],[2,1],[3,2],[4,3],[2,4]],
  },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS (Cycle Detection)',  complexity: 'O(V+E) time · O(V) space' },
  { id: 'bfs', name: "BFS (Kahn's Algorithm)",  complexity: 'O(V+E) time · O(V) space' },
]

const CODE = {
  dfs: [
    'function canFinish(numCourses, prerequisites):',
    '  build adjacency list',
    '  state[i] = 0 (unvisited), 1 (in-stack), 2 (done)',
    '  function dfs(node):',
    '    if state[node] == 1: return false  // cycle!',
    '    if state[node] == 2: return true   // done',
    '    state[node] = 1  // mark in-stack',
    '    for each neighbor: if !dfs(neighbor) return false',
    '    state[node] = 2  // mark done',
    '    return true',
  ],
  bfs: [
    'function canFinish(numCourses, prerequisites):',
    '  build adj list + in-degree array',
    '  queue = [all nodes with in-degree 0]',
    '  while queue not empty:',
    '    pop u; processed++',
    '    for each neighbor v: in-degree[v]--',
    '    if in-degree[v] == 0: queue.push(v)',
    '  return processed == numCourses',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently processing' },
  { token: 'visiting', label: 'In recursion stack (DFS)' },
  { token: 'compare',  label: 'In queue / examining' },
  { token: 'done',     label: 'Fully processed' },
  { token: 'error',    label: 'Cycle detected' },
]

/* ── Graduation Cap SVG ── */
function GradCapSVG({ color = '#3b82f6' }) {


  return (
    <svg viewBox="0 0 28 28" className={styles.capIcon}>
      {/* board (mortarboard flat) */}
      <polygon points="14,4 26,10 14,16 2,10" fill={color} opacity="0.9"/>
      {/* top square */}
      <rect x="11" y="2" width="6" height="4" rx="1" fill={color}/>
      {/* body/wrap part */}
      <path d="M7,12 L7,20 Q14,24 21,20 L21,12 L14,16 Z" fill={color} opacity="0.7"/>
      {/* tassel */}
      <line x1="24" y1="10" x2="24" y2="17" stroke={color} strokeWidth="1.8"/>
      <circle cx="24" cy="17.5" r="1.5" fill={color}/>
    </svg>
  )
}

/* ── Cycle Warning SVG ── */
function CycleWarnSVG() {
  return (
    <svg viewBox="0 0 24 24" className={styles.warnIcon}>
      <circle cx="12" cy="12" r="10" fill="#fef2f2" stroke="#dc2626" strokeWidth="2"/>
      <path d="M8,8 L16,16 M16,8 L8,16" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function getCapColor(hl) {
  if (hl === 'current')  return '#f59e0b'
  if (hl === 'visiting') return '#8b5cf6'
  if (hl === 'compare')  return '#f59e0b'
  if (hl === 'done')     return '#16a34a'
  if (hl === 'error')    return '#dc2626'
  return '#3b82f6'
}

export default function CourseScheduleVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { numCourses, prereqs } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, numCourses, prereqs), [selectedAlgo, selectedTest, customCase]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[
        { key: 'numCourses', label: 'Num courses', type: 'number', placeholder: '4' },
        { key: 'prereqs',    label: 'Prerequisites (JSON pairs)', type: 'text', placeholder: '[[1,0],[2,0],[3,1],[3,2]]' },
      ]}
      onApply={parsed => {
        const nc = parseInt(parsed.numCourses, 10)
        const pr = JSON.parse(parsed.prereqs)
        setCustomCase({ numCourses: nc, prereqs: pr }); hook.reset()
      }}
    />
  )

  const highlights = step?.highlights ?? {}
  const result     = step?.result

  // Build graph display
  const nodes = Array.from({ length: numCourses }, (_, i) => ({ id: i, label: String(i) }))
  const edges = prereqs.map(([a, b]) => ({ from: b, to: a, directed: true }))

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Courses': numCourses,
        'Prerequisites': prereqs.length,
        ...(result !== undefined ? { 'Can finish': result ? 'Yes ✓' : 'No ✗' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultTrue : styles.resultFalse}`}>
            {result ? '🎓 Can finish all courses ✓' : '🚫 Impossible — cycle detected ✗'}
          </div>
        )}

        {/* Course cap row */}
        <div className={styles.capRow}>
          {Array.from({ length: numCourses }, (_, i) => (
            <div
              key={i}
              className={`${styles.courseBox} ${highlights[i] === 'error' ? styles.courseError : highlights[i] === 'done' ? styles.courseDone : highlights[i] === 'current' ? styles.courseCurrent : ''}`}
            >
              <GradCapSVG color={getCapColor(highlights[i])} />
              <span className={styles.courseLabel}>{i}</span>
              {highlights[i] === 'error' && <div className={styles.cycleOverlay}><CycleWarnSVG /></div>}
            </div>
          ))}
        </div>

        <GraphDisplay nodes={nodes} edges={edges} highlights={highlights} directed width={500} height={240} />
      </div>
    </VisualizerShell>
  )
}
