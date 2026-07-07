import { Link } from 'react-router-dom'
import { problems, categories } from '../data/problems.js'
import { useDoneProblems } from '../hooks/useDoneProblems.js'
import styles from './HomePage.module.css'

export default function HomePage() {
  const total = problems.length
  const { done } = useDoneProblems()
  const doneCount = done.size

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>100 Problems · 8 Categories</div>
          <h1 className={styles.headline}>
            Algorithm Visualizer
          </h1>
          <p className={styles.sub}>
            Step through every algorithm — see exactly what happens at each iteration.
            Standardized, interactive, and side-by-side with the C++ solution.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{total}</span>
              <span className={styles.heroStatLabel}>Problems</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{categories.length}</span>
              <span className={styles.heroStatLabel}>Categories</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>6</span>
              <span className={styles.heroStatLabel}>Visual Patterns</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={`${styles.heroStatNum} ${styles.heroStatDone}`}>
                {doneCount}/{total}
              </span>
              <span className={styles.heroStatLabel}>Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className={styles.grid}>
        <div className={styles.gridInner}>
          <h2 className={styles.gridTitle}>Browse by Category</h2>
          <div className={styles.cards}>
            {categories.map(cat => {
              const catProblems = problems.filter(p => p.categorySlug === cat.slug)
              return (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className={styles.catCard}
                >
                  <div className={styles.catLabel}>{cat.label}</div>
                  <div className={styles.catCount}>{cat.count} problems</div>
                  <div className={styles.catTags}>
                    {/* Show a few unique tags from the first 3 problems */}
                    {[...new Set(catProblems.slice(0, 3).flatMap(p => p.tags))].slice(0, 3).map(t => (
                      <span key={t} className={styles.catTag}>{t}</span>
                    ))}
                  </div>
                  <div className={styles.catArrow}>→</div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        Built by{' '}
        <a
          href="https://www.linkedin.com/in/jyoti-bujethiya/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          Jyoti Bujethiya
        </a>
        {' '}· Developer at SAP Labs
      </footer>
    </div>
  )
}
