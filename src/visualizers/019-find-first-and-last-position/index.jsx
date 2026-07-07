import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './FindFirstLast.module.css'

const TEST_CASES = [
  { label: 'Found Range',    detail: '[5,7,7,8,8,10] target=8 → [3,4]',  nums: [5,7,7,8,8,10], target: 8 },
  { label: 'Not Found',      detail: '[5,7,7,8,8,10] target=6 → [-1,-1]', nums: [5,7,7,8,8,10], target: 6 },
  { label: 'Single Element', detail: '[1] target=1 → [0,0]',              nums: [1], target: 1 },
  { label: 'All Same',       detail: '[2,2,2,2,2] target=2 → [0,4]',      nums: [2,2,2,2,2], target: 2 },
  { label: 'Empty Array',    detail: '[] target=0 → [-1,-1]',              nums: [], target: 0 },
]

const ALGORITHMS = [
  { id: 'twoBS',  name: 'Two Binary Searches (Optimal)', complexity: 'O(log n) time · O(1) space' },
  { id: 'flagBS', name: 'Single BS with Flag',           complexity: 'O(log n) time · O(1) space' },
  { id: 'linear', name: 'Linear Scan',                   complexity: 'O(n) time · O(1) space' },
  { id: 'stl',    name: 'lower/upper bound (STL)',        complexity: 'O(log n) time · O(1) space' },
]

const CODE = {
  twoBS:  ['function findLeft(nums, target):', '  lo=0, hi=n-1, res=-1', '  while lo<=hi:', '    mid = lo + (hi-lo)/2', '    if nums[mid]==target: res=mid; hi=mid-1', '    elif nums[mid]<target: lo=mid+1', '    else: hi=mid-1', '  return res', '', 'function findRight(nums, target):', '  lo=0, hi=n-1, res=-1', '  while lo<=hi:', '    mid = lo + (hi-lo)/2', '    if nums[mid]==target: res=mid; lo=mid+1', '    elif nums[mid]<target: lo=mid+1', '    else: hi=mid-1', '  return res'],
  flagBS: ['function bs(nums, target, findFirst):', '  lo=0, hi=n-1, res=-1', '  while lo<=hi:', '    mid = (lo+hi)/2', '    if nums[mid]==target:', '      res=mid', '      if findFirst: hi=mid-1', '      else:         lo=mid+1', '    elif nums[mid]<target: lo=mid+1', '    else: hi=mid-1', '  return res'],
  linear: ['first=-1, last=-1', 'for i=0 to n-1:', '  if nums[i]==target:', '    if first==-1: first=i', '    last=i', 'return [first, last]'],
  stl:    ['lo = lower_bound(nums, target)', 'if lo==end or *lo!=target: return [-1,-1]', 'hi = upper_bound(nums, target)', 'return [lo-begin, hi-begin-1]'],
}

const LEGEND = [
  { token: 'current', label: 'mid pointer' },
  { token: 'compare', label: 'Search range (lo..hi)' },
  { token: 'match',   label: 'Result range found' },
  { token: 'special', label: 'Target match at mid' },
]

export default function FindFirstLastVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('twoBS')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums, target } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums, target), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook = useVisualizer(steps)
  const step = hook.step

  const lo  = step?.lo  ?? -1
  const hi  = step?.hi  ?? -1
  const mid = step?.mid ?? -1
  const [resLo, resHi] = step?.result ?? [-1, -1]

  const getState = (i) => {
    if (resLo !== -1 && resHi !== -1 && i >= resLo && i <= resHi) return 'match'
    if (i === mid) return nums[i] === target ? 'special' : 'current'
    if (lo !== -1 && hi !== -1 && lo <= hi && i >= lo && i <= hi) return 'compare'
    return ''
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Sorted nums",
                "type": "array",
                "placeholder": "5,7,7,8,8,10"
            },
            {
                "key": "target",
                "label": "Target",
                "type": "number",
                "placeholder": "8"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums, target: parsed.target }); hook.reset()
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
        'Target': target,
        'Size':   nums.length,
        'First':  step.result?.[0] ?? '—',
        'Last':   step.result?.[1] ?? '—',
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {nums.length === 0 ? (
          <div className={styles.empty}>Empty array</div>
        ) : (
          <div className={styles.arrayRow}>
            {nums.map((v, i) => {
              const state = getState(i)
              const isLo  = i === lo
              const isHi  = i === hi && hi !== lo
              const isMid = i === mid
              return (
                <div key={i} className={styles.cellWrap}>
                  <div className={styles.ptrRow}>
                    {isLo  && <PointerLabel label="lo"  type="compare" />}
                    {isHi  && <PointerLabel label="hi"  type="current" />}
                    {isMid && <PointerLabel label="mid" type="special" />}
                  </div>
                  <div className={`${styles.cell} ${state ? styles[state] : ''}`}>{v}</div>
                  <div className={styles.idx}>{i}</div>
                </div>
              )
            })}
          </div>
        )}

        <div className={styles.resultRow}>
          Result: [{resLo}, {resHi}]
        </div>

        {step?.phase === 'complete' && (
          <div className={`${styles.resultBadge} ${resLo === -1 ? styles.notFound : styles.found}`}>
            {resLo === -1 ? '❌ Target not found → [-1,-1]' : `✅ Found at [${resLo}, ${resHi}]`}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
