import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './NextPermutation.module.css'

const TEST_CASES = [
  { label: 'Ascending',     detail: '[1,2,3] → [1,3,2]',     nums: [1,2,3] },
  { label: 'Descending',    detail: '[3,2,1] → [1,2,3] wrap', nums: [3,2,1] },
  { label: 'Mixed',         detail: '[1,1,5] → [1,5,1]',      nums: [1,1,5] },
  { label: 'Partial',       detail: '[1,3,2] → [2,1,3]',      nums: [1,3,2] },
  { label: 'Four Elements', detail: '[2,3,1,4] → [2,3,4,1]',  nums: [2,3,1,4] },
]

const ALGORITHMS = [
  { id: 'classic',   name: 'Classic In-Place (Optimal)',    complexity: 'O(n) time · O(1) space' },
  { id: 'verbose',   name: '4-Step Verbose (Educational)',  complexity: 'O(n) time · O(1) space' },
  { id: 'manualRev', name: 'Manual Reverse (No STL)',       complexity: 'O(n) time · O(1) space' },
]

const CODE = {
  classic:   ['// Step 1: find pivot (rightmost nums[i] < nums[i+1])', 'i = n-2', 'while i>=0 and nums[i]>=nums[i+1]: i--', '', '// Step 2+3: swap with next greater from right', 'if i >= 0:', '  j = n-1', '  while nums[j] <= nums[i]: j--', '  swap(nums[i], nums[j])', '', '// Step 4: reverse suffix i+1..end', 'reverse(nums, i+1, n-1)'],
  verbose:   ["// Pass 1: find the \"dip\"", 'pivot = -1', 'for i = n-2 downto 0:', '  if nums[i] < nums[i+1]: pivot=i; break', '', '// All descending? → just reverse', 'if pivot == -1: reverse all; return', '', '// Pass 2: find smallest in suffix > pivot', 'for j = n-1 downto pivot+1:', '  if nums[j] > nums[pivot]: swapIdx=j; break', '', 'swap(nums[pivot], nums[swapIdx])', 'reverse suffix after pivot'],
  manualRev: ['// Find pivot', 'i = n-2', 'while i>=0 && nums[i]>=nums[i+1]: i--', '// Swap', 'if i>=0:', '  j=n-1; while nums[j]<=nums[i]: j--', '  swap(nums[i], nums[j])', '// Manual reverse suffix', 'lo=i+1, hi=n-1', 'while lo<hi: swap(nums[lo++], nums[hi--])'],
}

const LEGEND = [
  { token: 'special', label: 'Pivot (dip point)' },
  { token: 'current', label: 'j (swap candidate)' },
  { token: 'compare', label: 'Suffix to reverse' },
  { token: 'match',   label: 'Final (complete)' },
]

export default function NextPermutationVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('classic')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook = useVisualizer(steps)
  const step = hook.step

  const arr = step?.arr ?? nums
  const pivot = step?.pivot ?? -1
  const swapJ = step?.swapJ ?? -1
  const suffixSet = new Set(step?.suffix ?? [])
  const isComplete = step?.phase === 'complete'

  const getState = (i) => {
    if (isComplete) return 'match'
    if (i === pivot) return 'special'
    if (i === swapJ) return 'current'
    if (suffixSet.has(i)) return 'compare'
    return ''
  }

  const getLabel = (i) => {
    if (i === pivot) return 'pivot'
    if (i === swapJ && swapJ !== pivot) return 'j'
    if (suffixSet.has(i)) return 'sfx'
    return ''
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "1,2,3"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums }); hook.reset()
      }}
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
        'Input':  `[${nums.join(',')}]`,
        'Pivot':  pivot >= 0 ? pivot : '—',
        'Phase':  step.phase || '—',
        'Result': isComplete ? `[${arr.join(',')}]` : '—',
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.arrayRow}>
          {arr.map((v, i) => {
            const state = getState(i)
            const label = getLabel(i)
            const ptrType = label === 'pivot' ? 'special'
                          : label === 'j'     ? 'current'
                          : label === 'sfx'   ? 'compare'
                          : undefined
            return (
              <div key={i} className={styles.cellWrap}>
                <div className={styles.ptrRow}>
                  {label && <PointerLabel label={label} type={ptrType} />}
                </div>
                <div className={`${styles.cell} ${state ? styles[state] : ''}`}>{v}</div>
                <div className={styles.idx}>{i}</div>
              </div>
            )
          })}
        </div>

        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>
            ✅ Next permutation: [{arr.join(', ')}]
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
