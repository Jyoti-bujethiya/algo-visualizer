import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import ArrayDisplay from '../../components/display/ArrayDisplay.jsx'
import styles from './ThreeSum.module.css'

const TEST_CASES = [
  { label: 'Test 1', detail: '[-1,0,1,2,-1,-4]', array: [-1, 0, 1, 2, -1, -4] },
  { label: 'Test 2', detail: '[0,1,1]',           array: [0, 1, 1] },
  { label: 'Test 3 — All zeros', detail: '[0,0,0]', array: [0, 0, 0] },
  { label: 'Test 4', detail: '[-2,0,0,2,2]',      array: [-2, 0, 0, 2, 2] },
]

const ALGORITHMS = [
  { id: 'twopointer', name: 'Two Pointer (Optimal)', complexity: 'O(n²) time · O(1) space' },
  { id: 'brute',      name: 'Brute Force',           complexity: 'O(n³) time · O(1) space' },
]

const CODE = {
  twopointer: ['sort(nums)', 'for i in 0..n-2:', '  if nums[i] > 0: break', '  L, R = i+1, n-1', '  while L < R:', '    sum = nums[i]+nums[L]+nums[R]', '    if sum == 0: add triplet, L++, R--', '    else if sum < 0: L++', '    else: R--'],
  brute:      ['for i,j,k (nested):', '  if nums[i]+nums[j]+nums[k]==0:', '    add to result set'],
}

const LEGEND = [
  { token: 'current', label: 'Fixed element (i)' },
  { token: 'compare', label: 'Left pointer (L)' },
  { token: 'special', label: 'Right pointer (R)' },
  { token: 'match',   label: 'Triplet found' },
  { token: 'discard', label: 'Skipped duplicate' },
]

export default function ThreeSumVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('twopointer')
  const [customCase,   setCustomCase]   = useState(null)

  const { array } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, array), [selectedAlgo, array]) // eslint-disable-line
  const hook = useVisualizer(steps)
  const step = hook.step

  const displayArray = step?.array ?? array
  const highlights   = step?.highlights ?? []
  const triplets     = step?.triplets ?? []

  // Derive pointer positions from highlights
  const pointers = highlights.flatMap(h => {
    if (h.type === 'current') return [{ index: h.index, label: 'i' }]
    if (h.type === 'compare') return [{ index: h.index, label: 'L' }]
    if (h.type === 'special') return [{ index: h.index, label: 'R' }]
    if (h.type === 'match')   return [{ index: h.index, label: '✓' }]
    return []
  })

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'array', label: 'Array', type: 'array', placeholder: '-1, 0, 1, 2' }]}
      onApply={({ array: arr }) => { setCustomCase({ array: arr }); hook.reset() }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo} onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step?.stats ? { Comparisons: step.stats.comparisons, 'Triplets Found': step.stats.tripletsFound } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <ArrayDisplay elements={displayArray} highlights={highlights} pointers={pointers} showIndex />
        {triplets.length > 0 && (
          <div className={styles.tripletsSection}>
            <div className={styles.tripletsLabel}>Found Triplets</div>
            <div className={styles.tripletsList}>
              {triplets.map((t, i) => (
                <span key={i} className={styles.triplet}>[{t.join(', ')}]</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
