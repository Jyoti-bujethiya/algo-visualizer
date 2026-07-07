import { useState } from 'react'
import styles from './SolutionPanel.module.css'

/* ── Judge0 CE — public instance, no key required ───────────────────────── */
const JUDGE0 = 'https://judge0-ce.p.rapidapi.com'

/*
 * Judge0 language IDs
 * https://ce.judge0.com/languages/
 */
const LANG_ID = {
  cpp:    54,   // C++ (GCC 9.2.0)
  python: 71,   // Python (3.8.1)
  java:   62,   // Java (OpenJDK 13.0.1)
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

async function runCode(source, langId, stdin) {
  /* ── Submit ── */
  const submitRes = await fetch(`${JUDGE0}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY', // free tier available at rapidapi.com
    },
    body: JSON.stringify({ source_code: source, language_id: langId, stdin }),
  })

  if (!submitRes.ok) {
    /* ── Fallback: try the free no-auth CE instance directly ── */
    return runCodeCE(source, langId, stdin)
  }

  const { token } = await submitRes.json()

  /* ── Poll until done (max 10 s) ── */
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500))
    const res = await fetch(
      `${JUDGE0}/submissions/${token}?base64_encoded=false`,
      { headers: { 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com', 'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY' } }
    )
    const data = await res.json()
    if (data.status?.id >= 3) return data
  }
  throw new Error('Timed out waiting for result')
}

/* ── Free CE instance (ce.judge0.com) — no key, CORS-open ──────────────── */
async function runCodeCE(source, langId, stdin) {
  const submitRes = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=false', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_code: source, language_id: langId, stdin }),
  })
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

/* ── RunPanel component ──────────────────────────────────────────────────── */
export default function RunPanel({ code, lang }) {
  const [stdin,   setStdin]   = useState('')
  const [output,  setOutput]  = useState(null)   // { stdout, stderr, compile_output, status }
  const [running, setRunning] = useState(false)
  const [open,    setOpen]    = useState(false)

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

  const statusId  = output?.status?.id
  const isOk      = statusId === 3
  const isErr     = statusId >= 4
  const statusTxt = STATUS_LABEL[statusId] ?? output?.status?.description ?? ''

  const displayed =
    output?._error        ? `⚠ ${output._error}` :
    output?.compile_output ? output.compile_output :
    output?.stderr         ? output.stderr :
    output?.stdout         ? output.stdout :
    output               ? '(no output)' : ''

  return (
    <div className={styles.runPanel}>
      {/* ── Toggle strip ── */}
      <button className={styles.runToggle} onClick={() => setOpen(o => !o)}>
        <span className={styles.runToggleIcon}>
          {/* Play / chevron SVG */}
          {open
            ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L10.5 7L5 11V3Z" fill="currentColor"/></svg>
          }
        </span>
        <span className={styles.runToggleLabel}>Run Code</span>
        {output && !running && (
          <span className={`${styles.runBadge} ${isOk ? styles.runBadgeOk : isErr ? styles.runBadgeErr : ''}`}>
            {statusTxt}
          </span>
        )}
      </button>

      {open && (
        <div className={styles.runBody}>
          {/* stdin */}
          <div className={styles.runSection}>
            <label className={styles.runLabel}>stdin (optional)</label>
            <textarea
              className={styles.runTextarea}
              rows={3}
              placeholder="e.g.  5&#10;1 2 3 1"
              value={stdin}
              onChange={e => setStdin(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* run button */}
          <button
            className={`${styles.runBtn} ${running ? styles.runBtnLoading : ''}`}
            onClick={handleRun}
            disabled={running}
          >
            {running ? (
              <>
                <span className={styles.runSpinner} />
                Running…
              </>
            ) : (
              <>▶ Run</>
            )}
          </button>

          {/* output */}
          {output && (
            <div className={styles.runSection}>
              <label className={styles.runLabel}>
                Output
                {statusTxt && (
                  <span className={`${styles.runBadge} ${isOk ? styles.runBadgeOk : isErr ? styles.runBadgeErr : ''}`}>
                    {statusTxt}
                  </span>
                )}
              </label>
              <pre className={`${styles.runOutput} ${isErr || output?._error ? styles.runOutputErr : ''}`}>
                {displayed}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
