import { useNavigate, Link } from 'react-router-dom'
import { problems } from '../data/problems.js'
import styles from './NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()

  function goRandom() {
    const slug = problems[Math.floor(Math.random() * problems.length)].slug
    navigate(`/problem/${slug}`)
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.msg}>Page not found</p>
      <Link to="/" className={styles.link}>← Back to Home</Link>
      <button className={styles.randomBtn} onClick={goRandom}>
        Try a random problem →
      </button>
    </div>
  )
}
