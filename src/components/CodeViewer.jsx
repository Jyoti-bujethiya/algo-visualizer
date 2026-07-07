import { useEffect, useState, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import styles from './CodeViewer.module.css'

hljs.registerLanguage('cpp', cpp)

/**
 * CodeViewer — fetches a .cpp file from /public/cpp/ and renders it
 * with highlight.js syntax highlighting + a copy-to-clipboard button.
 */
export default function CodeViewer({ cppPath }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const preRef = useRef(null)

  useEffect(() => {
    if (!cppPath) return
    setLoading(true)
    setError(null)
    fetch(cppPath)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`)
        return r.text()
      })
      .then(text => {
        setCode(text)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [cppPath])

  // Re-highlight whenever code changes
  useEffect(() => {
    if (preRef.current && code) {
      preRef.current.querySelectorAll('code').forEach(el => hljs.highlightElement(el))
    }
  }, [code])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — ignore
    }
  }

  if (loading) return <div className={styles.state}>Loading…</div>
  if (error)   return <div className={`${styles.state} ${styles.stateError}`}>Failed to load: {error}</div>

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.filename}>{cppPath?.split('/').pop()}</span>
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className={styles.scroll} ref={preRef}>
        <pre className={styles.pre}>
          <code className="language-cpp">{code}</code>
        </pre>
      </div>
    </div>
  )
}
