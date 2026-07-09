import { useState, useEffect, useRef, useCallback } from 'react'
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import { parseApproaches } from './parseApproaches.js'
import TutorialPane, { ProblemBanner } from './TutorialPane.jsx'
import styles from './SolutionPanel.module.css'

/* ── Language registration ────────────────────────────────────────────────── */
hljs.registerLanguage('cpp', cpp)
const registered = new Set(['cpp'])

async function ensureLang(lang) {
  if (registered.has(lang)) return
  try {
    let mod
    if (lang === 'python') mod = await import('highlight.js/lib/languages/python')
    if (lang === 'java')   mod = await import('highlight.js/lib/languages/java')
    if (mod) {
      hljs.registerLanguage(lang, mod.default)
      registered.add(lang)
    }
  } catch { /* silently skip */ }
}

/* ── Language config ────────────────────────────────────────────────────── */
const LANGS = [
  { id: 'cpp',    label: 'C++',    badge: 'C+', color: '#6366f1', hlLang: 'cpp'    },
  { id: 'python', label: 'Python', badge: 'Py', color: '#f59e0b', hlLang: 'python' },
  { id: 'java',   label: 'Java',   badge: 'Ja', color: '#ef4444', hlLang: 'java'   },
]

/* ── Syntax-highlighted code block ──────────────────────────────────────── */
function HighlightedCode({ code, lang }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !code) return
    ensureLang(lang).then(() => {
      if (ref.current) {
        ref.current.removeAttribute('data-highlighted')
        ref.current.textContent = code
        hljs.highlightElement(ref.current)
      }
    })
  }, [code, lang])

  return (
    <pre className={styles.codePre}>
      <code ref={ref} className={`language-${lang} ${styles.codeEl}`}>
        {code}
      </code>
    </pre>
  )
}

/* ── Copy button ─────────────────────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <button className={styles.copyBtn} onClick={handleCopy}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

/* ── Resizable split body ───────────────────────────────────────────────── */
function ResizableBody({ loading, error, langLabel, approach, filePath, tutorial, slug, activeLang }) {
  const bodyRef    = useRef(null)
  const [codePct, setCodePct] = useState(60)   // % width of code pane
  const dragging   = useRef(false)
  const startX     = useRef(0)
  const startPct   = useRef(60)

  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    startX.current   = e.clientX
    startPct.current = codePct
    document.body.style.cursor    = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [codePct])

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragging.current || !bodyRef.current) return
      const totalW = bodyRef.current.getBoundingClientRect().width
      const delta  = e.clientX - startX.current
      const newPct = Math.min(60, Math.max(40, startPct.current + (delta / totalW) * 100))
      setCodePct(newPct)
    }
    function onMouseUp() {
      if (!dragging.current) return
      dragging.current = false
      document.body.style.cursor    = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [])

  const langConfig = LANGS.find(l => l.id === activeLang)

  return (
    <div ref={bodyRef} className={styles.body}>
      {loading && <div className={styles.state}>Loading {langLabel} solution…</div>}
      {error   && <div className={`${styles.state} ${styles.stateError}`}>Failed to load: {error}</div>}

      {!loading && !error && approach && (
        <>
          {/* LEFT — code pane */}
          <div className={styles.codePane} style={{ flex: `0 0 ${codePct}%` }}>
            <div className={styles.codeToolbar}>
              <span className={styles.codeFilename}>{filePath?.split('/').pop()}</span>
              <CopyButton text={approach.code} />
            </div>
            <div className={styles.codeScroll}>
              <HighlightedCode code={approach.code} lang={langConfig?.hlLang ?? 'cpp'} />
            </div>
          </div>

          {/* Drag handle */}
          <div
            className={styles.resizeHandle}
            onMouseDown={onMouseDown}
            title="Drag to resize"
          />

          {/* RIGHT — tutorial pane */}
          <TutorialPane
            approach={approach}
            tutorial={tutorial}
            slug={slug}
            language={activeLang}
          />
        </>
      )}
    </div>
  )
}

/* ── Main SolutionPanel ─────────────────────────────────────────────────── */
export default function SolutionPanel({ problem }) {
  const [activeLang,     setActiveLang]     = useState('cpp')
  const [activeApproach, setActiveApproach] = useState(0)
  const [approaches,     setApproaches]     = useState([])
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState(null)
  const [tutorial,       setTutorial]       = useState(null)

  const pathKey  = activeLang === 'cpp' ? 'cppPath' : activeLang === 'python' ? 'pythonPath' : 'javaPath'
  const filePath = problem?.[pathKey]

  // Lazy-load per-problem tutorial data if it exists
  useEffect(() => {
    if (!problem?.slug) return
    import(`../../data/tutorials/${problem.slug}.js`)
      .then(mod => setTutorial(mod.tutorial))
      .catch(() => setTutorial(null))
  }, [problem?.slug])

  useEffect(() => {
    if (!filePath) {
      setApproaches([{ name: 'Coming Soon', timeComplexity: '', spaceComplexity: '', explain: '', when: '', code: `// ${activeLang.toUpperCase()} solution coming soon` }])
      setActiveApproach(0)
      return
    }
    setLoading(true)
    setError(null)
    fetch(filePath)
      .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.text() })
      .then(text => {
        const parsed = parseApproaches(text, activeLang)
        setApproaches(parsed.length ? parsed : [{ name: 'Solution', timeComplexity: '', spaceComplexity: '', explain: '', when: '', code: text }])
        setActiveApproach(0)
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [filePath, activeLang])  // eslint-disable-line

  const langConfig = LANGS.find(l => l.id === activeLang)
  const approach   = approaches[activeApproach]

  return (
    <div className={styles.panel}>

      {/* ── Top bar: language dropdown ──────────────────────────────────── */}
      <div className={styles.topBar}>
        <div className={styles.langBar}>
          <label htmlFor="lang-select" className={styles.langLabel}>Language:</label>
          <select
            id="lang-select"
            className={styles.langSelect}
            value={activeLang}
            onChange={e => setActiveLang(e.target.value)}
          >
            {LANGS.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.label}</option>
            ))}
          </select>
        </div>

        {/* Approach pills */}
        {approaches.length > 1 && (
          <div className={styles.approachBar}>
            {approaches.map((ap, i) => (
              <button
                key={i}
                className={`${styles.approachPill} ${activeApproach === i ? styles.approachPillActive : ''}`}
                onClick={() => setActiveApproach(i)}
              >
                {ap.name}
                {ap.timeComplexity && (
                  <span className={styles.complexityBadge}>{ap.timeComplexity}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Body: code left + tutorial right ───────────────────────────── */}
      <ResizableBody
        loading={loading}
        error={error}
        langLabel={langConfig?.label}
        approach={approach}
        filePath={filePath}
        tutorial={tutorial}
        slug={problem?.slug}
        activeLang={activeLang}
      />
    </div>
  )
}
