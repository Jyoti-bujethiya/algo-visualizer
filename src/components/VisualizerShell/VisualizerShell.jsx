import { useEffect } from 'react'
import styles from './VisualizerShell.module.css'
import LeftPanel from './LeftPanel.jsx'
import RightPanel from './RightPanel.jsx'
import ControlsBar from './ControlsBar.jsx'
import { parseComplexityString } from './complexityUtils.js'

/** Plain-English explanation banner shown at the top of every visualization canvas */
function StepComment({ hook }) {
  const step = hook?.step
  if (!step) return null
  const text = step.description ?? step.desc ?? ''
  if (!text) return null
  return (
    <div className={styles.stepComment}>
      {text}
    </div>
  )
}

/**
 * VisualizerShell — the standardized 3-column layout used by all 100 problems.
 *
 * Props:
 *   testCases    {Array}    — [{ label, detail, ... }]
 *   selectedTest {number}   — index of selected test case
 *   onTestChange {Function} — (index) => void
 *   algorithms   {Array}    — [{ id, name, complexity }]
 *   selectedAlgo {string}   — id of selected algorithm
 *   onAlgoChange {Function} — (id) => void
 *   customInput  {ReactNode} — optional custom input UI
 *   legend       {Array}    — [{ token, label }]  token = CSS var name, e.g. 'current'
 *   stats        {Object}   — { label: value, ... }
 *   code         {Array}    — lines of pseudocode (strings)
 *   hook         {Object}   — from useVisualizer()
 *   children     {ReactNode} — the problem-specific visualization canvas
 *
 * NOTE: activeCodeLine is derived automatically from hook.step.codeLineIndex.
 *       Steps.js files must emit { codeLineIndex: <number> } on every step.
 */
export default function VisualizerShell({
  testCases = [],
  selectedTest = 0,
  onTestChange,
  algorithms = [],
  selectedAlgo,
  onAlgoChange,
  customInput,
  legend = [],
  stats = {},
  code = [],
  hook,
  children,
}) {
  const activeCodeLine = hook?.step?.codeLineIndex ?? -1

  // Keyboard shortcuts: Space = play/pause, ← = prev, → = next, R = reset
  useEffect(() => {
    if (!hook) return
    function onKeyDown(e) {
      // Don't fire when user is typing in an input/textarea
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === ' ')           { e.preventDefault(); hook.togglePlay() }
      else if (e.key === 'ArrowLeft')  { e.preventDefault(); hook.prev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); hook.next() }
      else if (e.key === 'r' || e.key === 'R') { hook.reset() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [hook])

  // Derive time/space from the active algorithm's complexity string
  const activeAlgo = algorithms.find(a => a.id === selectedAlgo) ?? algorithms[0]
  const complexity = parseComplexityString(activeAlgo?.complexity ?? '')

  return (
    <div className={styles.shell}>
      {/* LEFT — test cases, algorithm selector, custom input */}
      <LeftPanel
        testCases={testCases}
        selectedTest={selectedTest}
        onTestChange={onTestChange}
        algorithms={algorithms}
        selectedAlgo={selectedAlgo}
        onAlgoChange={onAlgoChange}
        customInput={customInput}
      />

      {/* CENTER — visualization canvas + progress + controls */}
      <div className={styles.center}>
        <div className={styles.canvas}>
          <div className={styles.canvasInner}>
            <StepComment hook={hook} />
            {children}
          </div>
        </div>

        {/* 3px progress bar */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${hook?.progress ?? 0}%` }}
          />
        </div>

        <ControlsBar hook={hook} />
      </div>

      {/* RIGHT — step info, code, stats, legend */}
      <RightPanel
        hook={hook}
        code={code}
        activeCodeLine={activeCodeLine}
        stats={stats}
        legend={legend}
        complexity={complexity}
      />
    </div>
  )
}
