import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProblemsByCategory, categories } from '../data/problems.js'
import ProblemCard from '../components/ProblemCard.jsx'
import styles from './CategoryPage.module.css'

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

  function toggleTag(tag) {
    setActiveTags(prev => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  function clearTags() {
    setActiveTags(new Set())
  }

  // A problem must match ALL active tags (AND logic)
  const filtered = activeTags.size === 0
    ? probs
    : probs.filter(p => [...activeTags].every(t => p.tags.includes(t)))

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
            {filtered.length}{activeTags.size > 0 ? ` / ${probs.length}` : ''} problem{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tag filter bar */}
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>Filter by tag:</span>
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
          {activeTags.size > 0 && (
            <button className={styles.clearBtn} onClick={clearTags}>
              Clear
            </button>
          )}
        </div>

        {/* Problem grid */}
        {filtered.length === 0 ? (
          <p className={styles.empty}>No problems match the selected tags.</p>
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
