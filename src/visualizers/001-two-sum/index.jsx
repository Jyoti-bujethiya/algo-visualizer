import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import ArrayDisplay from '../../components/display/ArrayDisplay.jsx'
import styles from './TwoSum.module.css'

// ── Static metadata ──────────────────────────────────────────────────────────

const TEST_CASES = [
  { label: 'Test 1 — Basic',       detail: '[2,7,11,15] target=9',  array: [2, 7, 11, 15], target: 9 },
  { label: 'Test 2 — End pair',    detail: '[3,2,4] target=6',      array: [3, 2, 4],       target: 6 },
  { label: 'Test 3 — Duplicates',  detail: '[3,3] target=6',        array: [3, 3],          target: 6 },
  { label: 'Test 4 — Negatives',   detail: '[-1,-2,-3,-4,-5] t=-8', array: [-1,-2,-3,-4,-5], target: -8 },
]

const ALGORITHMS = [
  { id: 'hashmap',    name: 'Hash Map (Optimal)',  complexity: 'Time O(n) · Space O(n)' },
  { id: 'brute',      name: 'Brute Force',         complexity: 'Time O(n²) · Space O(1)' },
  { id: 'twopointer', name: 'Two Pointer',         complexity: 'Time O(n log n) · Space O(n)' },
]

const CODE = {
  hashmap: [
    'for i in 0..n:',
    '  complement = target - nums[i]',
    '  if complement in map:',
    '    return [map[complement], i]',
    '  map[nums[i]] = i',
  ],
  brute: [
    'for i in 0..n-1:',
    '  for j in i+1..n:',
    '    if nums[i] + nums[j] == target:',
    '      return [i, j]',
  ],
  twopointer: [
    'pairs = sort(enumerate(nums))',
    'left, right = 0, n-1',
    'while left < right:',
    '  sum = pairs[left] + pairs[right]',
    '  if sum == target: return indices',
    '  else if sum < target: left++',
    '  else: right--',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Current element (i)' },
  { token: 'compare', label: 'Checking (j)' },
  { token: 'match',   label: 'Solution found' },
  { token: 'special', label: 'In hash map' },
]

// ── Component ────────────────────────────────────────────────────────────────

export default function TwoSumVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('hashmap')
  const [customCase, setCustomCase]     = useState(null)

  const base = TEST_CASES[selectedTest]
  const { array, target } = customCase ?? base
  const steps = useMemo(
    () => generateSteps(selectedAlgo, array, target),
    [selectedAlgo, array, target] // eslint-disable-line
  )
  const hook = useVisualizer(steps)
  const step = hook.step

  // Which array / highlights to show
  const displayArray = step?.sortedPairs
    ? step.sortedPairs.map(p => p.val)
    : array
  const highlights = step?.highlights ?? []

  // Pointer labels — always show active indices on the cell
  const pointers = step?.pointers
    ? [
        { index: step.pointers.left,  label: 'L' },
        { index: step.pointers.right, label: 'R' },
      ]
    : highlights.flatMap(h => {
        if (h.type === 'current')  return [{ index: h.index, label: 'i' }]
        if (h.type === 'checking') return [{ index: h.index, label: 'j' }]
        if (h.type === 'found')    return [{ index: h.index, label: '✓' }]
        return []
      })

  // Stats for right panel
  const stats = step?.stats
    ? { Comparisons: step.stats.comparisons, 'Array Access': step.stats.arrayAccess, 'Map Ops': step.stats.mapOps }
    : {}

  function handleTestChange(i) {
    setCustomCase(null)
    setSelectedTest(i)
    hook.reset()
  }

  function handleAlgoChange(id) {
    setSelectedAlgo(id)
    hook.reset()
  }

  const customInputUI = (
    <CustomInput
      fields={[
        { key: 'array',  label: 'Array',  type: 'array',  placeholder: '2, 7, 11, 15' },
        { key: 'target', label: 'Target', type: 'number', placeholder: '9' },
      ]}
      onApply={({ array: arr, target: tgt }) => {
        setCustomCase({ array: arr, target: tgt })
        hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES}
      selectedTest={selectedTest}
      onTestChange={handleTestChange}
      algorithms={ALGORITHMS}
      selectedAlgo={selectedAlgo}
      onAlgoChange={handleAlgoChange}
      customInput={customInputUI}
      legend={LEGEND}
      stats={stats}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      {/* ── Main visualization canvas ── */}
      <div className={styles.canvas}>
        {/* Target badge */}
        <div className={styles.targetRow}>
          <span className={styles.targetLabel}>Target:</span>
          <span className={styles.targetVal}>{target}</span>
        </div>

        {/* Array */}
        <ArrayDisplay
          elements={displayArray}
          highlights={highlights}
          pointers={pointers}
          showIndex
        />

        {/* Hash map (only visible in hashmap mode) */}
        {selectedAlgo === 'hashmap' && step?.hashmap && step.hashmap.size > 0 && (
          <div className={styles.mapSection}>
            <div className={styles.mapLabel}>Hash Map</div>
            <div className={styles.mapGrid}>
              {[...step.hashmap.entries()].map(([val, idx]) => (
                <div key={val} className={styles.mapEntry}>
                  <span className={styles.mapKey}>{val}</span>
                  <span className={styles.mapArrow}>→</span>
                  <span className={styles.mapVal}>idx {idx}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
