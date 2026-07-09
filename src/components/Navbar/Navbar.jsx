import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/react'
import { useTheme } from '../../contexts/ThemeContext.jsx'
import styles from './Navbar.module.css'

function SunSVG() {
  return (
    <svg viewBox="0 0 20 20" className={styles.themeIcon} aria-hidden="true">
      <circle cx="10" cy="10" r="4.2" fill="currentColor"/>
      {/* 8 rays */}
      {[0,45,90,135,180,225,270,315].map(deg => {
        const rad = (deg * Math.PI) / 180
        const x1 = 10 + 6.2 * Math.cos(rad)
        const y1 = 10 + 6.2 * Math.sin(rad)
        const x2 = 10 + 8.4 * Math.cos(rad)
        const y2 = 10 + 8.4 * Math.sin(rad)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      })}
    </svg>
  )
}

function MoonSVG() {
  return (
    <svg viewBox="0 0 20 20" className={styles.themeIcon} aria-hidden="true">
      <path
        d="M15.5 12.9A7 7 0 0 1 7.1 4.5 7 7 0 1 0 15.5 12.9z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIconWrap}>
            <span className={styles.logoIcon}>{'{ }'}</span>
          </div>
          <span className={styles.logoText}>AlgoViz</span>
        </Link>

        {/* Search */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search problems…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search problems"
          />
        </form>

        {/* Theme toggle */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <SunSVG /> : <MoonSVG />}
        </button>

        {/* Auth */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className={styles.signInBtn}>Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: styles.clerkAvatar,
              },
            }}
          />
        </SignedIn>

      </div>
    </nav>
  )
}
