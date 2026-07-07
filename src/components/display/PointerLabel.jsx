import styles from './PointerLabel.module.css'

/**
 * PointerLabel — a standardised pointer badge used on top of every cell/bar/char.
 *
 * Color follows the token system:
 *   type 'current'  → orange  (i, left, lo  …)
 *   type 'compare'  → purple  (j, L, hi      …)
 *   type 'special'  → amber   (mid, R, pivot …)
 *   type 'match'    → green   (✓, found      …)
 *   (default)       → accent blue
 *
 * Props:
 *   label  {string}  — text shown on the badge, e.g. "i", "L", "mid"
 *   type   {string}  — 'current' | 'compare' | 'special' | 'match'  (optional)
 */
export default function PointerLabel({ label, type }) {
  const cls = [styles.ptr, type && styles[type]].filter(Boolean).join(' ')
  return <span className={cls}>{label}</span>
}
