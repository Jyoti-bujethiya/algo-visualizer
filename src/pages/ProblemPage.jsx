import { Suspense, lazy } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProblemBySlug, getAdjacentProblems } from '../data/problems.js'
import SolutionPanel from '../components/SolutionPanel/SolutionPanel.jsx'
import ProblemTab from '../components/ProblemTab/ProblemTab.jsx'
import { useDoneProblems } from '../hooks/useDoneProblems.js'
import styles from './ProblemPage.module.css'

function loadVisualizer(slug) {
  return lazy(() =>
    import(`../visualizers/${slug}/index.jsx`).catch(() => ({
      default: () => (
        <div className={styles.notImpl}>
          Visualizer coming soon for <code>{slug}</code>
        </div>
      ),
    }))
  )
}

export default function ProblemPage() {
  const { slug } = useParams()
  const problem = getProblemBySlug(slug)
  const { prev, next } = getAdjacentProblems(slug)
  const { isDone, toggle } = useDoneProblems()
  const done = isDone(slug)

  if (!problem) {
    return (
      <div className={styles.notFound}>
        <p>Problem not found: <code>{slug}</code></p>
        <Link to="/" className={styles.back}>← Back to Home</Link>
      </div>
    )
  }

  const VisualizerComponent = loadVisualizer(slug)

  return (
    <div className={styles.page}>
      <div className={styles.header}>

        {/* Single row — breadcrumb + meta left, nav + done right */}
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <nav className={styles.breadcrumb} aria-label="breadcrumb">
              <Link to="/" className={styles.crumb}>Home</Link>
              <span className={styles.sep}>/</span>
              <Link to={`/category/${problem.categorySlug}`} className={styles.crumb}>
                {problem.category}
              </Link>
            </nav>
            <span className={styles.sep}>/</span>
            <span className={styles.id}>#{problem.id.toString().padStart(3, '0')}</span>
            <h1 className={styles.title}>{problem.title}</h1>
            {problem.difficulty && (
              <span className={`${styles.diff} ${styles[problem.difficulty?.toLowerCase()]}`}>
                {problem.difficulty}
              </span>
            )}
            <div className={styles.tags}>
              {problem.tags.slice(0, 4).map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
            <a
              href={problem.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.lcLink}
            >
              LeetCode ↗
            </a>
          </div>

          <div className={styles.nav}>
            {prev && (
              <Link to={`/problem/${prev.slug}`} className={styles.navBtn}>
                ◀ {prev.title}
              </Link>
            )}
            {next && (
              <Link to={`/problem/${next.slug}`} className={styles.navBtn}>
                {next.title} ▶
              </Link>
            )}
            <button
              className={`${styles.doneBtn} ${done ? styles.doneBtnDone : ''}`}
              onClick={() => toggle(slug)}
              aria-label={done ? 'Mark as not done' : 'Mark as done'}
            >
              <span className={styles.doneBtnIcon}>{done ? '✓' : '○'}</span>
              <span>{done ? 'Done' : 'Mark Done'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <Tabs>
        <Tab label="Problem">
          <ProblemTab problem={problem} />
        </Tab>
        <Tab label="Visualizer">
          <Suspense fallback={<div className={styles.loading}>Loading visualizer…</div>}>
            <VisualizerComponent />
          </Suspense>
        </Tab>
        <Tab label="Solution">
          <div className={styles.solutionPane}>
            <SolutionPanel problem={problem} />
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

/* ── Minimal inline tabs ────────────────────────────────────────────────── */
import { useState } from 'react'

function Tabs({ children }) {
  const tabs = Array.isArray(children) ? children : [children]
  const [active, setActive] = useState(0)

  return (
    <div className={styles.tabs}>
      <div className={styles.tabBar}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`${styles.tabBtn} ${active === i ? styles.tabBtnActive : ''}`}
            onClick={() => setActive(i)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tabs[active].props.children}
      </div>
    </div>
  )
}

function Tab({ children }) {
  return children
}
