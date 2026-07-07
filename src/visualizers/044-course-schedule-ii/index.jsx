import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import GraphDisplay from '../../components/display/GraphDisplay.jsx'
import styles from './CourseScheduleII.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — 4 courses, [[1,0],[2,0],[3,1],[3,2]]', detail: 'Expected: [0,1,2,3] or [0,2,1,3]',
    numCourses: 4, prereqs: [[1,0],[2,0],[3,1],[3,2]],
  },
  {
    label: 'Test 2 — 2 courses, [[1,0]]', detail: 'Simple: [0,1]',
    numCourses: 2, prereqs: [[1, 0]],
  },
  {
    label: 'Test 3 — Cycle: [[1,0],[0,1]]', detail: 'Returns []',
    numCourses: 2, prereqs: [[1,0],[0,1]],
  },
  {
    label: 'Test 4 — 4 courses, chain', detail: '0→1→2→3',
    numCourses: 4, prereqs: [[1,0],[2,1],[3,2]],
  },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS (Post-order)',     complexity: 'O(V+E) time · O(V) space' },
  { id: 'bfs', name: "BFS (Kahn's)",         complexity: 'O(V+E) time · O(V) space' },
]

const CODE = {
  dfs: [
    'function findOrder(numCourses, prerequisites):',
    '  build adjacency list',
    '  state[i] = 0/1/2  (unvisited/in-stack/done)',
    '  result = []',
    '  function dfs(node):',
    '    if state[node] == 1: cycle! return false',
    '    if state[node] == 2: return true',
    '    state[node] = 1',
    '    for each neighbor: if !dfs(neighbor) return false',
    '    state[node] = 2; result.push(node)',
    '  for each node: dfs(node)',
    '  return hasCycle ? [] : result.reverse()',
  ],
  bfs: [
    'function findOrder(numCourses, prerequisites):',
    '  build adj list + in-degree',
    '  queue = [in-degree 0 nodes]',
    '  order = []',
    '  while queue not empty:',
    '    pop u; order.push(u)',
    '    for each neighbor v: in-degree[v]--',
    '    if in-degree[v] == 0: queue.push(v)',
    '  return order.length == numCourses ? order : []',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Currently processing' },
  { token: 'visiting', label: 'In-stack / reducing in-degree' },
  { token: 'compare',  label: 'In queue' },
  { token: 'done',     label: 'Added to order' },
  { token: 'error',    label: 'Cycle node' },
]

/* ── Cap + Badge ── */
function GradCapSVG({ color = '#3b82f6', small }) {
  const sz = small ? 20 : 28


  return (
    <svg viewBox="0 0 28 28" width={sz} height={sz}>
      <polygon points="14,4 26,10 14,16 2,10" fill={color} opacity="0.9"/>
      <rect x="11" y="2" width="6" height="4" rx="1" fill={color}/>
      <path d="M7,12 L7,20 Q14,24 21,20 L21,12 L14,16 Z" fill={color} opacity="0.7"/>
      <line x1="24" y1="10" x2="24" y2="17" stroke={color} strokeWidth="1.8"/>
      <circle cx="24" cy="17.5" r="1.5" fill={color}/>
    </svg>
  )
}

/* ── Diploma scroll ── */
function DiplomaScrollSVG({ rank }) {
  return (
    <svg viewBox="0 0 36 28" className={styles.diplomaIcon}>
      <rect x="4" y="4" width="28" height="20" rx="3" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5"/>
      <line x1="9" y1="10" x2="27" y2="10" stroke="#ca8a04" strokeWidth="1.5"/>
      <line x1="9" y1="14" x2="22" y2="14" stroke="#fde68a" strokeWidth="1"/>
      <line x1="9" y1="18" x2="24" y2="18" stroke="#fde68a" strokeWidth="1"/>
      {/* ribbon curl */}
      <ellipse cx="18" cy="24" rx="6" ry="3" fill="#ca8a04" opacity="0.7"/>
      <text x="18" y="9" textAnchor="middle" fontSize="6" fontWeight="800" fill="#92400e">{rank}</text>
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

export default function CourseScheduleIIVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { numCourses, prereqs } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, numCourses, prereqs), [selectedAlgo, selectedTest, customCase]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[
        { key: 'numCourses', label: 'Num courses', type: 'number', placeholder: '4' },
        { key: 'prereqs',    label: 'Prerequisites (JSON pairs)', type: 'text', placeholder: '[[1,0],[2,1],[3,1]]' },
      ]}
      onApply={parsed => {
        const nc = parseInt(parsed.numCourses, 10)
        const pr = JSON.parse(parsed.prereqs)
        setCustomCase({ numCourses: nc, prereqs: pr }); hook.reset()
      }}
    />
  )

  const highlights = step?.highlights ?? {}
  const order      = step?.order ?? []

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
        'In order': order.length,
        ...(step.done && order.length === 0 ? { 'Status': 'Cycle ✗' } : {}),
        ...(step.done && order.length > 0 ? { 'Status': 'Valid order ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Topo-sort rail: diploma scrolls in order */}
        {order.length > 0 ? (
          <div className={styles.orderRail}>
            {order.map((v, i) => (
              <div key={i} className={styles.orderStep}>
                <DiplomaScrollSVG rank={i + 1} />
                <div className={styles.orderNum}>
                  <GradCapSVG color={getCapColor(highlights[v])} small />
                  <span className={styles.orderLabel}>{v}</span>
                </div>
                {i < order.length - 1 && (
                  <svg viewBox="0 0 16 16" className={styles.railArrow}><path d="M4 8 L12 8 M9 5 L12 8 L9 11" stroke="#6b7280" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                )}
              </div>
            ))}
          </div>
        ) : step?.done ? (
          <div className={styles.emptyResult}>[] — No valid ordering (cycle)</div>
        ) : null}

        {/* Cap row */}
        <div className={styles.capRow}>
          {Array.from({ length: numCourses }, (_, i) => (
            <div
              key={i}
              className={`${styles.courseBox} ${highlights[i] === 'error' ? styles.courseError : highlights[i] === 'done' ? styles.courseDone : highlights[i] === 'current' ? styles.courseCurrent : ''}`}
            >
              <GradCapSVG color={getCapColor(highlights[i])} />
              <span className={styles.courseLabel}>{i}</span>
              {order.includes(i) && <div className={styles.orderBadge}>{order.indexOf(i) + 1}</div>}
            </div>
          ))}
        </div>

        <GraphDisplay nodes={nodes} edges={edges} highlights={highlights} directed width={500} height={220} />
      </div>
    </VisualizerShell>
  )
}
