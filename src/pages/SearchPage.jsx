import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { searchProblems } from '../data/problems.js'
import ProblemCard from '../components/ProblemCard.jsx'
import styles from './SearchPage.module.css'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const results = searchProblems(query)

  // Keep URL in sync with input
  useEffect(() => {
    const q = query.trim()
    setSearchParams(q ? { q } : {}, { replace: true })
  }, [query, setSearchParams])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.crumb}>Home</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.crumbCurrent}>Search</span>
        </nav>

        {/* Search input */}
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.input}
            placeholder="Search by title, tag, or category…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            aria-label="Search problems"
          />
        </div>

        {/* Results */}
        {query.trim() === '' ? (
          <p className={styles.hint}>Start typing to search all 100 problems.</p>
        ) : results.length === 0 ? (
          <p className={styles.empty}>No results for <strong>"{query}"</strong></p>
        ) : (
          <>
            <p className={styles.count}>{results.length} result{results.length !== 1 ? 's' : ''}</p>
            <div className={styles.grid}>
              {results.map(p => (
                <ProblemCard key={p.slug} problem={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
