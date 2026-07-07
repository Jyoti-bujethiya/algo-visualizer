import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './WordLadder.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — hit → cog', detail: 'LeetCode Example 1 — length 5',
    beginWord: 'hit', endWord: 'cog',
    wordList: ['hot','dot','dog','lot','log','cog'],
  },
  {
    label: 'Test 2 — hit → cog (no cog)', detail: 'No path — return 0',
    beginWord: 'hit', endWord: 'cog',
    wordList: ['hot','dot','dog','lot','log'],
  },
  {
    label: 'Test 3 — a → c', detail: 'Single letter, length 2',
    beginWord: 'a', endWord: 'c',
    wordList: ['a','b','c'],
  },
  {
    label: 'Test 4 — hot → dog', detail: 'hot → dot → dog, length 3',
    beginWord: 'hot', endWord: 'dog',
    wordList: ['hot','dot','dog','lot','log'],
  },
]

const ALGORITHMS = [
  { id: 'bfs', name: 'BFS (Level-by-level)', complexity: 'O(M²·N) time · O(M²·N) space' },
]

const CODE = {
  bfs: [
    'function ladderLength(beginWord, endWord, wordList):',
    '  wordSet = new Set(wordList)',
    '  if endWord not in wordSet: return 0',
    '  queue = [(beginWord, 1)]',
    '  while queue not empty:',
    '    pop (word, level)',
    '    for each position i in word:',
    '      for each letter a-z:',
    '        newWord = word with pos i changed',
    '        if newWord == endWord: return level+1',
    '        if newWord in wordSet: enqueue; remove from set',
    '  return 0',
  ],
}

const LEGEND = [
  { token: 'special',  label: 'Begin word' },
  { token: 'current',  label: 'Currently exploring' },
  { token: 'compare',  label: 'Queued' },
  { token: 'done',     label: 'Visited' },
  { token: 'match',    label: 'End word / found' },
]

/* ── Ladder rung SVG ── */
function LadderRungSVG() {


  return (
    <svg viewBox="0 0 24 40" className={styles.ladderRung}>
      {/* left rail */}
      <line x1="5" y1="0" x2="5" y2="40" stroke="#92400e" strokeWidth="3" strokeLinecap="round"/>
      {/* right rail */}
      <line x1="19" y1="0" x2="19" y2="40" stroke="#92400e" strokeWidth="3" strokeLinecap="round"/>
      {/* rungs */}
      <line x1="5" y1="8"  x2="19" y2="8"  stroke="#b45309" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="5" y1="20" x2="19" y2="20" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="5" y1="32" x2="19" y2="32" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ── Highlight changed letter ── */
function HighlightedWord({ word, prevWord, className }) {
  if (!prevWord || word === prevWord) {
    return <span className={className}>{word}</span>
  }
  return (
    <span className={className}>
      {word.split('').map((ch, i) => (
        <span key={i} className={ch !== prevWord[i] ? styles.changedLetter : ''}>
          {ch}
        </span>
      ))}
    </span>
  )
}

function getWordState(word, idx, beginWord, endWord, highlights) {
  if (word === endWord)   return 'end'
  if (word === beginWord) return 'begin'
  const hl = highlights[idx]
  if (hl === 'current') return 'current'
  if (hl === 'queued')  return 'queued'
  if (hl === 'done')    return 'done'
  if (hl === 'found')   return 'found'
  return 'default'
}

function getChipClass(state, styles) {
  if (state === 'begin')   return `${styles.wordChip} ${styles.wordChipBegin}`
  if (state === 'end')     return `${styles.wordChip} ${styles.wordChipEnd}`
  if (state === 'current') return `${styles.wordChip} ${styles.wordChipCurrent}`
  if (state === 'queued')  return `${styles.wordChip} ${styles.wordChipQueued}`
  if (state === 'done')    return `${styles.wordChip} ${styles.wordChipDone}`
  if (state === 'found')   return `${styles.wordChip} ${styles.wordChipFound}`
  return styles.wordChip
}

export default function WordLadderVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { beginWord, endWord, wordList } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(beginWord, endWord, wordList), [selectedAlgo, selectedTest, customCase]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[
        { key: 'beginWord', label: 'Begin word', type: 'text', placeholder: 'hit' },
        { key: 'endWord',   label: 'End word',   type: 'text', placeholder: 'cog' },
        { key: 'wordList',  label: 'Word list (comma)', type: 'text', placeholder: 'hot,dot,dog,lot,log,cog' },
      ]}
      onApply={parsed => {
        const bw = parsed.beginWord.trim()
        const ew = parsed.endWord.trim()
        const wl = parsed.wordList.split(',').map(w => w.trim())
        setCustomCase({ beginWord: bw, endWord: ew, wordList: wl }); hook.reset()
      }}
    />
  )

  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const level      = step?.level
  const path       = step?.path ?? []

  const allWords = [beginWord, ...wordList]

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      legend={LEGEND}
      stats={step ? {
        'Begin': beginWord,
        'End': endWord,
        ...(level !== undefined ? { 'Level': level } : {}),
        ...(result !== undefined ? { 'Ladder length': result || 'No path' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultFound : styles.resultNone}`}>
            {result ? `Shortest ladder length: ${result}` : 'No transformation sequence found'}
          </div>
        )}

        {/* Ladder path visualizer */}
        {path.length > 1 && (
          <div className={styles.ladderPath}>
            {path.map((word, i) => (
              <div key={i} className={styles.ladderStep}>
                <span className={`${styles.wordChip} ${i === 0 ? styles.wordChipBegin : i === path.length - 1 ? styles.wordChipFound : styles.wordChipCurrent}`}>
                  <HighlightedWord word={word} prevWord={path[i - 1]} className={styles.wordInner} />
                </span>
                {i < path.length - 1 && (
                  <div className={styles.rungWrap}>
                    <LadderRungSVG />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Word grid */}
        <div className={styles.wordGrid}>
          {allWords.map((word, idx) => {
            const state = getWordState(word, idx, beginWord, endWord, highlights)
            return (
              <span
                key={idx}
                className={getChipClass(state, styles)}
              >
                <HighlightedWord
                  word={word}
                  prevWord={state === 'current' && path.length > 0 ? path[path.length - 1] : null}
                  className={styles.wordInner}
                />
              </span>
            )
          })}
        </div>
      </div>
    </VisualizerShell>
  )
}
