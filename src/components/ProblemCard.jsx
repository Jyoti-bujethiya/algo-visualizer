import { Link } from 'react-router-dom'
import { useDoneProblems } from '../hooks/useDoneProblems.js'
import styles from './ProblemCard.module.css'

const DIFF_CLASS = {
  Easy:   styles.easy,
  Medium: styles.medium,
  Hard:   styles.hard,
}

export default function ProblemCard({ problem }) {
  const { id, slug, title, difficulty, tags } = problem
  const { isDone } = useDoneProblems()
  const done = isDone(slug)

  return (
    <Link to={`/problem/${slug}`} className={`${styles.card} ${done ? styles.cardDone : ''}`}>
      {done && <span className={styles.doneCheck} aria-label="Completed">✓</span>}

      <div className={styles.top}>
        <span className={styles.id}>#{id.toString().padStart(3, '0')}</span>
        {difficulty && (
          <span className={`${styles.diff} ${DIFF_CLASS[difficulty] ?? ''}`}>
            {difficulty}
          </span>
        )}
      </div>

      <h3 className={styles.title}>{title}</h3>

      <div className={styles.tags}>
        {tags.slice(0, 4).map(tag => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </Link>
  )
}
