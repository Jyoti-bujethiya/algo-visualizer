import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './LRUCache.module.css'

const TEST_CASES = [
  { label: 'Test 1 — LeetCode example', detail: 'cap=2, get/put sequence',
    capacity: 2, operations: [
      { type: 'put', key: 1, val: 1 },
      { type: 'put', key: 2, val: 2 },
      { type: 'get', key: 1 },
      { type: 'put', key: 3, val: 3 },
      { type: 'get', key: 2 },
      { type: 'put', key: 4, val: 4 },
      { type: 'get', key: 1 },
      { type: 'get', key: 3 },
      { type: 'get', key: 4 },
    ]},
  { label: 'Test 2 — Eviction', detail: 'cap=1, put 1, put 2, get 1',
    capacity: 1, operations: [
      { type: 'put', key: 1, val: 10 },
      { type: 'put', key: 2, val: 20 },
      { type: 'get', key: 1 },
    ]},
  { label: 'Test 3 — Update key', detail: 'cap=2, update existing',
    capacity: 2, operations: [
      { type: 'put', key: 1, val: 100 },
      { type: 'put', key: 2, val: 200 },
      { type: 'put', key: 1, val: 999 },
      { type: 'get', key: 1 },
      { type: 'get', key: 2 },
    ]},
]

const ALGORITHMS = [
  { id: 'lru', name: 'DLL + Hash Map', complexity: 'O(1) get & put · O(capacity) space' },
]

const CODE = {
  lru: [
    'class LRUCache:',
    '  def __init__(self, cap): self.cap=cap; self.map={}; self.dll=DLL()',
    '  def get(self, key):',
    '    if key not in self.map: return -1',
    '    self.dll.move_to_front(self.map[key])',
    '    return self.map[key].val',
    '  def put(self, key, val):',
    '    if key in self.map: self.dll.move_to_front(self.map[key])',
    '    else:',
    '      if len(self.map)==self.cap: del self.map[self.dll.pop_back().key]',
    '      self.dll.push_front(Node(key,val))',
    '    self.map[key].val = val',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Most recently used' },
  { token: 'match',    label: 'Just inserted / updated' },
  { token: 'special',  label: 'In cache' },
  { token: 'compare',  label: 'Evicted (LRU)' },
]

export default function LRUCacheVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('lru')
  const [customCase,   setCustomCase]   = useState(null)

  const { capacity, operations } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, capacity, operations), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const cache = step?.cache ?? []
  const op    = step?.op    ?? {}

  const nodeStateClass = (state) => {
    if (state === 'current') return styles.nodeCurrent
    if (state === 'match')   return styles.nodeMatch
    if (state === 'error')   return styles.nodeEvict
    return styles.node
  }


  const customInputUI = (
    <CustomInput
      fields={[
          {
              "key": "capacity",
              "label": "Capacity",
              "type": "number",
              "placeholder": "2"
          },
          {
              "key": "operations",
              "label": "Ops (JSON array)",
              "type": "text",
              "placeholder": "[{\"type\":\"put\",\"key\":1,\"val\":1},{\"type\":\"get\",\"key\":1}]"
          }
      ]}
      onApply={parsed => {
        const capacity = Number(parsed.capacity)
        const operations = JSON.parse(parsed.operations)
        setCustomCase({ capacity, operations }); hook.reset()
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
        'Capacity': capacity,
        'Cache size': cache.length,
        ...(op.type === 'get' && step.result !== undefined ? { 'GET result': step.result } : {}),
        ...(step.evictedKey !== undefined ? { 'Evicted key': step.evictedKey } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.opBanner}>
          {op.type === 'get' && <span className={styles.opGet}>GET {op.key}</span>}
          {op.type === 'put' && <span className={styles.opPut}>PUT ({op.key}, {op.val})</span>}
          {op.type === 'init' && <span className={styles.opInit}>Initialise — capacity {capacity}</span>}
          {op.type === 'done' && <span className={styles.opInit}>All operations complete</span>}
        </div>

        <div className={styles.cacheSection}>
          <div className={styles.cacheLabel}>Cache (front = most recent · back = LRU)</div>
          <div className={styles.cacheRow}>
            {cache.length === 0 && <span className={styles.empty}>empty</span>}
            {cache.map((n, i) => (
              <div key={i} className={styles.cacheNodeWrap}>
                {i === 0 && <div className={styles.mruLabel}>MRU</div>}
                {i === cache.length - 1 && cache.length > 1 && <div className={styles.lruLabel}>LRU</div>}
                <div className={nodeStateClass(n.state)}>
                  <div className={styles.nodeKey}>{n.key}</div>
                  <div className={styles.nodeVal}>{n.val}</div>
                </div>
                {i < cache.length - 1 && <div className={styles.arrow}>⇄</div>}
              </div>
            ))}
          </div>
        </div>

        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>
            ✅ Final cache: [{cache.map(n => `${n.key}:${n.val}`).join(' → ')}]
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
