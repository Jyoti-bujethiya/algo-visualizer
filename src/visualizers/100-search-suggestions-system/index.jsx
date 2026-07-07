import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './SearchSuggestions.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — "mobile"',
    detail: 'LeetCode example 1',
    products: ['mobile','moneypot','monitor','mousepad','mouse'],
    searchWord: 'mouse',
  },
  {
    label: 'Test 2 — "bags"',
    detail: 'LeetCode example 2',
    products: ['bags','baggage','banner','box','cloths'],
    searchWord: 'bags',
  },
  {
    label: 'Test 3 — "leetcode"',
    detail: 'All suggestions found',
    products: ['leetcode','leeway','legend','lemon','lens'],
    searchWord: 'leet',
  },
  {
    label: 'Test 4 — no match after prefix',
    detail: 'Trie runs dry',
    products: ['apple','app','apply','apt'],
    searchWord: 'appt',
  },
]

const ALGORITHMS = [
  { id: 'binary', name: 'Binary Search',  complexity: 'O(n log n + |S|·log n) time' },
  { id: 'trie',   name: 'Trie + DFS',     complexity: 'O(n·L + |S|·L) time' },
]

const CODE = {
  binary: [
    'function suggestedProducts(products, searchWord):',
    '  products.sort()',
    '  result = []',
    '  prefix = ""',
    '  for each char c in searchWord:',
    '    prefix += c',
    '    lo = lowerBound(products, prefix)',
    '    collect up to 3 from lo that start with prefix',
    '  return result',
  ],
  trie: [
    'function suggestedProducts(products, searchWord):',
    '  build Trie from sorted products',
    '  traverse trie char by char',
    '  at each prefix node, collect ≤3 words via DFS',
    '  if prefix missing in trie: []',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Current prefix being processed' },
  { token: 'match',   label: 'Matching suggestion (top 3)' },
  { token: 'compare', label: 'Matches prefix (not in top 3)' },
  { token: 'done',    label: "Doesn't match prefix" },
]

function getChipClass(i, highlights, styles) {
  const hl = highlights[i]
  if (hl === 'match')   return styles.chipMatch
  if (hl === 'compare') return styles.chipCompare
  if (hl === 'done')    return styles.chipDone
  return ''
}

export default function SearchSuggestionsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('binary')
  const [customCase,   setCustomCase]   = useState(null)

  const { products, searchWord } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, products, searchWord), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const sorted     = step?.sorted ?? [...products].sort()
  const highlights = step?.highlights ?? {}
  const prefix     = step?.prefix
  const suggestions = step?.suggestions ?? []
  const result     = step?.result


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "products",
                "label": "Products (comma)",
                "type": "text",
                "placeholder": "mobile,mouse,moneypot,monitor,mousepad"
            },
            {
                "key": "searchWord",
                "label": "Search word",
                "type": "text",
                "placeholder": "mouse"
            }
        ]}
      onApply={parsed => {
        const products = parsed.products.split(',').map(s => s.trim())
        setCustomCase({ products, searchWord }); hook.reset()
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
        'Search word': searchWord,
        ...(prefix !== undefined ? { 'Current prefix': `"${prefix}"` } : {}),
        ...(suggestions.length > 0 ? { 'Suggestions': suggestions.join(', ') } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {prefix !== undefined && (
          <div className={styles.prefixBadge}>prefix: "{prefix}"</div>
        )}
        <div className={styles.label}>Products (sorted)</div>
        <div className={styles.productsRow}>
          {sorted.map((w, i) => (
            <span key={i} className={`${styles.chip} ${getChipClass(i, highlights, styles)}`}>
              {w}
            </span>
          ))}
        </div>
        {suggestions.length > 0 && (
          <>
            <div className={styles.label}>Suggestions for "{prefix}"</div>
            <div className={styles.productsRow}>
              {suggestions.map((s, i) => (
                <span key={i} className={`${styles.chip} ${styles.chipMatch}`}>{s}</span>
              ))}
            </div>
          </>
        )}
        {result && result.length > 0 && (
          <>
            <div className={styles.label}>All results</div>
            <div className={styles.suggestionsWrap}>
              {searchWord.split('').map((_, ci) => {
                const pfx = searchWord.slice(0, ci + 1)
                const sugg = result[ci] ?? []
                return (
                  <div key={ci} className={styles.suggestRow}>
                    <span className={styles.prefixKey}>"{pfx}"</span>
                    <div className={styles.suggList}>
                      {sugg.length > 0
                        ? sugg.map((s, si) => <span key={si} className={styles.suggChip}>{s}</span>)
                        : <span className={styles.noSugg}>[]</span>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </VisualizerShell>
  )
}
