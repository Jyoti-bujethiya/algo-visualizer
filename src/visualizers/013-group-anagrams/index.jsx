import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './GroupAnagrams.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Classic',       detail: '["eat","tea","tan","ate","nat","bat"]', strs: ['eat','tea','tan','ate','nat','bat'] },
  { label: 'Test 2 — All one group', detail: '["abc","bca","cab"]',                   strs: ['abc','bca','cab'] },
  { label: 'Test 3 — No anagrams',   detail: '["abc","def","ghi"]',                   strs: ['abc','def','ghi'] },
  { label: 'Test 4 — Empty string',  detail: '[""]',                                   strs: [''] },
  { label: 'Test 5 — Mixed lengths', detail: '["a","b","aa","ab","ba"]',              strs: ['a','b','aa','ab','ba'] },
]

const ALGORITHMS = [
  { id: 'sort',  name: 'Sort Each String', complexity: 'O(n·k log k) time · O(n·k) space' },
  { id: 'count', name: 'Character Count Key', complexity: 'O(n·k) time · O(n·k) space' },
]

const CODE = {
  sort:  ['map = {}', 'for str in strs:', '  key = sorted(str).join("")', '  map[key].append(str)', 'return map.values()'],
  count: ['map = {}', 'for str in strs:', '  key = count_chars(str)', '  map[key].append(str)', 'return map.values()'],
}

const LEGEND = [
  { token: 'current', label: 'Word being processed' },
  { token: 'match',   label: 'Matched to existing group' },
  { token: 'special', label: 'New group created' },
]

// 7 distinct palette colors cycling through token classes
const GROUP_COLORS = ['current', 'match', 'special', 'compare', 'discard', 'error', 'current']


export default function GroupAnagramsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('sort')
  const [customCase,   setCustomCase]   = useState(null)

  const { strs } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, strs), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const groups = step?.groups ?? new Map()
  const groupEntries = [...groups.entries()]


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "strs",
                "label": "Strings (comma)",
                "type": "text",
                "placeholder": "eat,tea,tan,ate,nat,bat"
            }
        ]}
      onApply={parsed => {
        const strs = parsed.strs.split(',').map(s => s.trim())
        setCustomCase({ strs }); hook.reset()
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
        'Groups':    groups.size,
        'Word':      step.currentIdx >= 0 ? `"${strs[step.currentIdx]}"` : '—',
        'Key':       step.currentKey ? `"${step.currentKey}"` : '—',
        'Processed': step.currentIdx >= 0 ? step.currentIdx + 1 : 0,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Input words row */}
        <div className={styles.inputRow}>
          {strs.map((word, i) => {
            const isActive = step?.currentIdx === i
            const isPast   = step?.currentIdx > i || (step?.currentIdx === -1 && step?.result)
            const grpEntry = step ? [...groups.entries()].find(([, v]) => v.words.includes(word)) : null
            const colorIdx = grpEntry ? grpEntry[1].colorIdx : -1
            const tokenClass = colorIdx >= 0 ? GROUP_COLORS[colorIdx % GROUP_COLORS.length] : ''
            return (
              <div key={i}
                className={`${styles.wordCell} ${isActive ? styles.active : ''} ${isPast && tokenClass ? styles[tokenClass] : ''}`}>
                <div className={styles.ptrRow}>
                  {isActive && <PointerLabel label="i" type="current" />}
                </div>
                {isActive && step?.currentKey && (
                  <div className={styles.keyBadge}>"{step.currentKey}"</div>
                )}
                <div className={styles.wordText}>{word}</div>
                <div className={styles.wordIdx}>{i}</div>
              </div>
            )
          })}
        </div>

        {/* Group boxes */}
        {groupEntries.length > 0 && (
          <div className={styles.groups}>
            {groupEntries.map(([key, grp], gi) => {
              const tokenClass = GROUP_COLORS[grp.colorIdx % GROUP_COLORS.length]
              const isActive = step?.currentKey === key
              return (
                <div key={key} className={`${styles.groupBox} ${styles[tokenClass]} ${isActive ? styles.groupActive : ''}`}>
                  <div className={styles.groupKey}>"{key.length > 10 ? key.slice(0,9)+'…' : key}"</div>
                  <div className={styles.groupWords}>
                    {grp.words.map((w, wi) => (
                      <span key={wi} className={styles.groupWord}>{w}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Final result */}
        {step?.result && (
          <div className={styles.resultBadge}>
            ✅ {step.result.map(g => `[${g.map(w => `"${w}"`).join(',')}]`).join(', ')}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
