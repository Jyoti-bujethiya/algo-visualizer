import { classifyComplexity, COMPLEXITY_COLORS } from '../VisualizerShell/complexityUtils.js'
import styles from './SolutionPanel.module.css'

/**
 * A compact inline pill: label + O(...) notation + tiny bar underneath.
 * Sized to sit naturally beside other badges in the explainRow.
 */
function ComplexityPill({ label, raw, color }) {
  const tier = classifyComplexity(raw)
  if (!tier) return null
  return (
    <div className={styles.cxPill} style={{ '--cx-color': color }}>
      <span className={styles.cxPillLabel}>{label}</span>
      <span className={styles.cxPillNotation}>{tier.key}</span>
      <div className={styles.cxPillTrack}>
        <div className={styles.cxPillFill} style={{ width: `${tier.width}%` }} />
      </div>
    </div>
  )
}

/**
 * ComplexityCard — compact inline Time / Space pills for the Solution tab.
 * Props: name (string), time (string|null), space (string|null)
 */
export default function ComplexityCard({ name, time, space }) {
  if (!time && !space) return null
  return (
    <div className={styles.cxPillRow}>
      {time  && <ComplexityPill label="Time"  raw={time}  color={COMPLEXITY_COLORS.time}  />}
      {space && <ComplexityPill label="Space" raw={space} color={COMPLEXITY_COLORS.space} />}
    </div>
  )
}
