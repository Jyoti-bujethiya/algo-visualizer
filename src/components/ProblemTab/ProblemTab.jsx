import { useState, useEffect, useRef, useMemo } from 'react'
import styles from './ProblemTab.module.css'
import { starterCode } from '../../data/starterCode.js'
import hljs from 'highlight.js/lib/core'
import hljsCpp    from 'highlight.js/lib/languages/cpp'
import hljsPython from 'highlight.js/lib/languages/python'
import hljsJava   from 'highlight.js/lib/languages/java'

hljs.registerLanguage('cpp',    hljsCpp)
hljs.registerLanguage('python', hljsPython)
hljs.registerLanguage('java',   hljsJava)

const HLJS_LANG = { cpp: 'cpp', python: 'python', java: 'java' }

/* ── Judge0 CE — free no-auth instance ──────────────────────────────────── */
const LANG_ID = {
  cpp:    54,
  python: 71,
  java:   62,
}

const STATUS_LABEL = {
  1: 'In Queue',
  2: 'Processing',
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Compilation Error',
  7: 'Runtime Error (SIGSEGV)',
  8: 'Runtime Error (SIGXFSZ)',
  9: 'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
}

async function runCodeCE(source, langId, stdin) {
  const submitRes = await fetch(
    'https://ce.judge0.com/submissions?base64_encoded=false&wait=false',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: source, language_id: langId, stdin }),
    }
  )
  if (!submitRes.ok) throw new Error(`Submit failed: ${submitRes.status}`)
  const { token } = await submitRes.json()

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500))
    const res  = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=false`)
    const data = await res.json()
    if (data.status?.id >= 3) return data
  }
  throw new Error('Timed out waiting for result')
}

/* ── Language config ─────────────────────────────────────────────────────── */
const LANGS = [
  { id: 'cpp',    label: 'C++',    dot: '#6366f1' },
  { id: 'python', label: 'Python', dot: '#f59e0b' },
  { id: 'java',   label: 'Java',   dot: '#ef4444' },
]

const FALLBACK_CODE = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // Write your solution here
    
};`,
  python: `class Solution:
    # Write your solution here
    pass`,
  java: `class Solution {
    // Write your solution here
}`,
}

/* ── Difficulty badge colors ─────────────────────────────────────────────── */
const DIFF_CLASS = {
  Easy:   styles.diffEasy,
  Medium: styles.diffMedium,
  Hard:   styles.diffHard,
}

/* ── Problem description panel (left side) ───────────────────────────────── */
function ProblemDescription({ problem, tutorial }) {
  const prob = tutorial?.problem

  return (
    <div className={styles.descPane}>
      <div className={styles.descInner}>

        {/* Title + meta */}
        <div className={styles.descHeader}>
          <div className={styles.descTitleRow}>
            <span className={styles.descId}>#{problem.id.toString().padStart(3, '0')}</span>
            <h2 className={styles.descTitle}>{problem.title}</h2>
          </div>
          <div className={styles.descMeta}>
            {problem.difficulty && (
              <span className={`${styles.diffBadge} ${DIFF_CLASS[problem.difficulty] ?? ''}`}>
                {problem.difficulty}
              </span>
            )}
            {problem.tags?.slice(0, 4).map(t => (
              <span key={t} className={styles.descTag}>{t}</span>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Problem statement */}
        {prob?.statement ? (
          <div className={styles.descSection}>
            <p className={styles.descText}>{prob.statement}</p>
          </div>
        ) : (
          <div className={styles.descSection}>
            <p className={styles.descText}>
              See the full problem description on{' '}
              <a
                href={problem.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.lcInlineLink}
              >
                LeetCode ↗
              </a>
            </p>
          </div>
        )}

        {/* Example */}
        {prob?.example && (
          <div className={styles.descSection}>
            <div className={styles.descLabel}>
              <span className={styles.descLabelIcon}>📌</span> Example
            </div>
            <pre className={styles.exBlock}><code>{prob.example}</code></pre>
          </div>
        )}

        {/* Constraints / key insight */}
        {prob?.keyInsight && (
          <div className={styles.insightBox}>
            <span className={styles.insightIcon}>⚡</span>
            <span>{prob.keyInsight}</span>
          </div>
        )}

        {/* Hints — derived from first approach's steps if available */}
        {tutorial?.approaches && (() => {
          const firstApproach = Object.values(tutorial.approaches)[0]
          if (!firstApproach?.steps?.length) return null
          return (
            <details className={styles.hintsDetails}>
              <summary className={styles.hintsSummary}>Hints</summary>
              <ol className={styles.hintsList}>
                {firstApproach.steps.slice(0, 3).map((s, i) => (
                  <li key={i} className={styles.hintItem}>{s}</li>
                ))}
              </ol>
            </details>
          )
        })()}

        {/* LeetCode link footer */}
        <a
          href={problem.leetcode}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.lcLink}
        >
          View on LeetCode ↗
        </a>

      </div>
    </div>
  )
}

/* ── Colorized output renderer ───────────────────────────────────────────── */
function classifyLine(line) {
  const l = line.toLowerCase()
  // Compiler / runtime errors
  if (/\berror\b/.test(l))   return 'err'
  // Warnings
  if (/\bwarning\b/.test(l)) return 'warn'
  // Source location pointers  (e.g.  "  ^~~"  or  "   ^")
  if (/^\s*\^[~^]*\s*$/.test(line)) return 'ptr'
  // Line/column references  (file.cpp:12:3  or  filename.java:5)
  if (/\.(cpp|py|java|c|h):\d+/.test(line)) return 'loc'
  // Note / info lines
  if (/\bnote\b/.test(l))    return 'note'
  return 'plain'
}

function ColorizedOutput({ text, isOk }) {
  if (isOk) {
    // Accepted — entire stdout rendered in success green
    return (
      <>
        {text.split('\n').map((line, i) => (
          <span key={i} className={styles.outOk}>{line}{'\n'}</span>
        ))}
      </>
    )
  }

  return (
    <>
      {text.split('\n').map((line, i) => {
        const kind = classifyLine(line)
        const cls =
          kind === 'err'   ? styles.outErr   :
          kind === 'warn'  ? styles.outWarn  :
          kind === 'ptr'   ? styles.outPtr   :
          kind === 'loc'   ? styles.outLoc   :
          kind === 'note'  ? styles.outNote  :
          styles.outPlain
        return <span key={i} className={cls}>{line}{'\n'}</span>
      })}
    </>
  )
}

/* ── Syntax-highlighted editor overlay ──────────────────────────────────── */
function HighlightEditor({ code, lang, textareaRef, onChange, onKeyDown }) {
  const preRef    = useRef(null)
  const hljsLang  = HLJS_LANG[lang] ?? 'plaintext'

  // Re-highlight whenever code or language changes
  const highlighted = useMemo(
    () => hljs.highlight(code, { language: hljsLang }).value,
    [code, hljsLang]
  )

  // Keep pre scroll in sync with textarea scroll
  function syncScroll() {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop  = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  return (
    <div className={styles.hlEditorRoot}>
      {/* Highlighted layer (read-only, aria-hidden) */}
      <pre
        ref={preRef}
        aria-hidden="true"
        className={styles.hlPre}
        dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
      />
      {/* Editable transparent layer */}
      <textarea
        ref={textareaRef}
        className={styles.hlTextarea}
        value={code}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onScroll={syncScroll}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  )
}

/* ── Embedded code editor + compiler (right side) ────────────────────────── */
function CodeCompiler({ problem }) {
  const [lang,    setLang]    = useState('cpp')
  const [stdin,   setStdin]   = useState('')
  const [output,  setOutput]  = useState(null)
  const [running, setRunning] = useState(false)
  const textareaRef           = useRef(null)

  // Resolve starter for current lang/problem (no fetch needed)
  function getStarter(l) {
    return starterCode[problem?.slug]?.[l] ?? FALLBACK_CODE[l]
  }

  const [code, setCode] = useState(() => getStarter('cpp'))

  // When language changes, reset to starter stub
  function handleLangChange(newLang) {
    setLang(newLang)
    setCode(getStarter(newLang))
    setOutput(null)
  }

  // Reset when problem changes
  useEffect(() => {
    setCode(getStarter(lang))
    setOutput(null)
  }, [problem?.slug]) // eslint-disable-line

  async function handleRun() {
    setRunning(true)
    setOutput(null)
    try {
      const result = await runCodeCE(code, LANG_ID[lang] ?? LANG_ID.cpp, stdin)
      setOutput(result)
    } catch (err) {
      setOutput({ _error: err.message })
    } finally {
      setRunning(false)
    }
  }

  // Tab-key support in the textarea
  function handleKeyDown(e) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const el    = textareaRef.current
    const start = el.selectionStart
    const end   = el.selectionEnd
    const spaces = '    '
    const next  = code.substring(0, start) + spaces + code.substring(end)
    setCode(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + spaces.length
    })
  }

  const statusId  = output?.status?.id
  const isOk      = statusId === 3
  const isErr     = statusId >= 4
  const statusTxt = STATUS_LABEL[statusId] ?? output?.status?.description ?? ''

  const rawText =
    output?._error         ? `⚠ ${output._error}` :
    output?.compile_output ? output.compile_output :
    output?.stderr         ? output.stderr :
    output?.stdout         ? output.stdout :
    output               ? '(no output)' : ''

  return (
    <div className={styles.compilerPane}>

      {/* Language selector */}
      <div className={styles.compilerTopBar}>
        <div className={styles.langBar}>
          <label htmlFor="compiler-lang-select" className={styles.langLabel}>Language:</label>
          <select
            id="compiler-lang-select"
            className={styles.langSelect}
            value={lang}
            onChange={e => handleLangChange(e.target.value)}
          >
            {LANGS.map(l => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>
        <button
          className={`${styles.runBtn} ${running ? styles.runBtnLoading : ''}`}
          onClick={handleRun}
          disabled={running}
        >
          {running ? (
            <><span className={styles.runSpinner} /> Running…</>
          ) : (
            <>▶ Run Code</>
          )}
        </button>
      </div>

      {/* Code editor — transparent textarea over highlighted pre */}
      <div className={styles.editorWrap}>
        <HighlightEditor
          code={code}
          lang={lang}
          textareaRef={textareaRef}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Bottom: stdin + output */}
      <div className={styles.ioSection}>
        <div className={styles.ioRow}>
          <div className={styles.ioCol}>
            <label className={styles.ioLabel}>stdin (optional)</label>
            <textarea
              className={styles.ioTextarea}
              rows={3}
              placeholder="e.g.  4&#10;2 7 11 15&#10;9"
              value={stdin}
              onChange={e => setStdin(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className={styles.ioCol}>
            <label className={styles.ioLabel}>
              Output
              {output && !running && statusTxt && (
                <span className={`${styles.runBadge} ${isOk ? styles.runBadgeOk : isErr ? styles.runBadgeErr : ''}`}>
                  {statusTxt}
                </span>
              )}
            </label>
            <pre className={styles.outputPre}>
              {running
                ? <span className={styles.outRunning}>● Running…</span>
                : rawText
                  ? <ColorizedOutput text={rawText} isOk={isOk} />
                  : <span className={styles.outputPlaceholder}>Output will appear here</span>
              }
            </pre>
          </div>
        </div>
      </div>

    </div>
  )
}

/* ── ProblemTab — full LeetCode-style split layout ───────────────────────── */
export default function ProblemTab({ problem }) {
  const [tutorial, setTutorial] = useState(null)

  useEffect(() => {
    if (!problem?.slug) return
    import(`../../data/tutorials/${problem.slug}.js`)
      .then(mod => setTutorial(mod.tutorial))
      .catch(() => setTutorial(null))
  }, [problem?.slug])

  return (
    <div className={styles.root}>
      <ProblemDescription problem={problem} tutorial={tutorial} />
      <div className={styles.splitter} />
      <CodeCompiler problem={problem} />
    </div>
  )
}
