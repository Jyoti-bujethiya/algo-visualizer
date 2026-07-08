import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProblemsByCategory, categories } from '../data/problems.js'
import ProblemCard from '../components/ProblemCard.jsx'
import styles from './CategoryPage.module.css'

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

export default function CategoryPage() {
  const { categorySlug } = useParams()
  const cat = categories.find(c => c.slug === categorySlug)
  const probs = getProblemsByCategory(categorySlug)

  // Collect all unique tags present in this category, sorted alphabetically
  const allTags = useMemo(() => {
    const set = new Set()
    probs.forEach(p => p.tags.forEach(t => set.add(t)))
    return [...set].sort()
  }, [probs])

  const [activeTags, setActiveTags] = useState(new Set())
  const [difficulty, setDifficulty] = useState('All')

  function toggleTag(tag) {
    setActiveTags(prev => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  function clearAll() {
    setActiveTags(new Set())
    setDifficulty('All')
  }

  const hasFilters = activeTags.size > 0 || difficulty !== 'All'

  // Difficulty filter + all active tags must match (AND logic)
  const filtered = probs.filter(p => {
    const diffMatch = difficulty === 'All' || p.difficulty === difficulty
    const tagMatch = activeTags.size === 0 || [...activeTags].every(t => p.tags.includes(t))
    return diffMatch && tagMatch
  })

  if (!cat) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>Category not found.</p>
        <Link to="/" className={styles.back}>← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/" className={styles.crumb}>Home</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.crumbCurrent}>{cat.label}</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{cat.label}</h1>
          <span className={styles.count}>
            {filtered.length}{hasFilters ? ` / ${probs.length}` : ''} problem{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filter bar — difficulty dropdown + tag chips */}
        <div className={styles.filterBar}>
          {/* Difficulty dropdown */}
          <div className={styles.filterGroup}>
            <label htmlFor="diff-select" className={styles.filterLabel}>Difficulty:</label>
            <select
              id="diff-select"
              className={styles.diffSelect}
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className={styles.filterDivider} />

          {/* Tag chips */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Tags:</span>
            <div className={styles.tagList}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagChip} ${activeTags.has(tag) ? styles.tagChipActive : ''}`}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={activeTags.has(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all */}
          {hasFilters && (
            <button className={styles.clearBtn} onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>

        {/* Problem grid */}
        {filtered.length === 0 ? (
          <p className={styles.empty}>No problems match the selected filters.</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => (
              <ProblemCard key={p.slug} problem={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
