import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './CopyRandom.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Standard', detail: '[[7,null],[13,0],[11,4],[10,2],[1,0]]',
    nodes: [{val:7,random:-1},{val:13,random:0},{val:11,random:4},{val:10,random:2},{val:1,random:0}] },
  { label: 'Test 2 — Empty',    detail: '[]',   nodes: [] },
  { label: 'Test 3 — Single',   detail: '[[1,1]]', nodes: [{val:1,random:0}] },
  { label: 'Test 4 — All null', detail: '[[1,null],[2,null]]', nodes: [{val:1,random:-1},{val:2,random:-1}] },
  { label: 'Test 5 — Short',    detail: '[[3,null],[3,0],[3,null]]', nodes: [{val:3,random:-1},{val:3,random:0},{val:3,random:-1}] },
]

const ALGORITHMS = [
  { id: 'hashmap',    name: 'Hash Map (Two-Pass)',  complexity: 'O(n) time · O(n) space' },
  { id: 'interleave', name: 'Interleave (O(1) space)', complexity: 'O(n) time · O(1) space' },
]

const CODE = {
  hashmap: [
    '# Pass 1: create copies',
    'map = {node: Node(node.val) for node in list}',
    '# Pass 2: wire pointers',
    'for node in list:',
    '  map[node].next   = map.get(node.next)',
    '  map[node].random = map.get(node.random)',
    'return map[head]',
  ],
  interleave: [
    '# Step 1: interleave A→A\'→B→B\'→…',
    'cur = head',
    'while cur: cur.next = Node(cur.val, cur.next); cur = cur.next.next',
    '# Step 2: set random pointers',
    'cur = head',
    'while cur: cur.next.random = cur.random.next if cur.random else None; cur = cur.next.next',
    '# Step 3: separate lists',
    'cur = head; new_head = head.next',
    'while cur: cur.next = cur.next.next if cur.next else None; cur = cur.next',
    'return new_head',
  ],
}

const LEGEND = [
  { token: 'special',  label: 'Copy created' },
  { token: 'current',  label: 'Currently wiring' },
  { token: 'match',    label: 'Fully wired' },
]

export default function CopyListWithRandomPointerVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('hashmap')
  const [customCase,   setCustomCase]   = useState(null)

  const { nodes: inputNodes } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, inputNodes), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const original = step?.original ?? inputNodes.map((n, i) => ({ ...n, id: i }))
  const copy     = step?.copy     ?? []
  const ptrs     = step?.pointers ?? {}

  const renderNode = (node, i, isCopy = false) => {
    const stateClass = node.state === 'match' ? styles.nodeMatch
      : node.state === 'current' ? styles.nodeCurrent
      : node.state === 'special' ? styles.nodeSpecial
      : styles.node

    return (
      <div key={i} className={styles.nodeWrap}>
        {ptrs[i] && <div className={styles.ptr}>{ptrs[i]}</div>}
        <div className={stateClass}>
          <div className={styles.nodeVal}>{node.val}</div>
          <div className={styles.nodeMeta}>
            {!isCopy && node.random >= 0 ? `→r[${node.random}]` : node.random >= 0 ? `r→[${node.random}]` : 'r→∅'}
          </div>
        </div>
        {i < original.length - 1 && <div className={styles.arrow}>→</div>}
      </div>
    )
  }


  const customInputUI = (
    <CustomInput
      fields={[
          {
              "key": "nodes",
              "label": "Nodes (JSON [{val,random}])",
              "type": "text",
              "placeholder": "[{\"val\":7,\"random\":-1},{\"val\":13,\"random\":0}]"
          }
      ]}
      onApply={parsed => {
        const nodes = JSON.parse(parsed.nodes)
        setCustomCase({ nodes }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      legend={LEGEND}
      stats={step ? {
        'Phase': step.phase ?? '—',
        ...(step.currIdx !== undefined ? { 'Current node': step.currIdx } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.listSection}>
          <div className={styles.listLabel}>Original List</div>
          <div className={styles.listRow}>
            {original.map((n, i) => renderNode(n, i, false))}
            {original.length === 0 && <span className={styles.empty}>empty</span>}
          </div>
        </div>

        {copy.length > 0 && (
          <div className={styles.listSection}>
            <div className={styles.listLabel}>Copy List</div>
            <div className={styles.listRow}>
              {copy.map((n, i) => renderNode(n, i, true))}
            </div>
          </div>
        )}

        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>✅ Deep copy complete — {original.length} node(s) cloned</div>
        )}
      </div>
    </VisualizerShell>
  )
}
