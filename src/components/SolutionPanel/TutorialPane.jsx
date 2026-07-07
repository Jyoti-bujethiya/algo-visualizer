import styles from './SolutionPanel.module.css'
import { classifyComplexity, COMPLEXITY_COLORS } from '../VisualizerShell/complexityUtils.js'
import { CPP_NAME_MAP } from '../../data/cppNameMap.js'

/* ── Side-by-side complexity visual ─────────────────────────────────────── */
function ComplexityVisualCol({ label, raw, color }) {
  const tier = classifyComplexity(raw)
  return (
    <div className={styles.cxVisualCol} style={{ '--cx-col-color': color }}>
      <div className={styles.cxVisualColLabel}>{label}</div>
      {tier ? (
        <>
          <div className={styles.cxVisualNotation}>{tier.key}</div>
          <div className={styles.cxVisualTrack}>
            <div className={styles.cxVisualFill} style={{ width: `${tier.width}%` }} />
          </div>
          <div className={styles.cxVisualTier}>{tier.label}</div>
        </>
      ) : (
        <div className={styles.cxVisualNA}>—</div>
      )}
    </div>
  )
}

function ComplexityVisual({ time, space }) {
  if (!time && !space) return null
  return (
    <div className={styles.cxVisual}>
      <ComplexityVisualCol label="Time"  raw={time}  color={COMPLEXITY_COLORS.time}  />
      <ComplexityVisualCol label="Space" raw={space} color={COMPLEXITY_COLORS.space} />
    </div>
  )
}

/* ── Individual step item ────────────────────────────────────────────────── */
function Step({ index, text }) {
  return (
    <div className={styles.step}>
      <span className={styles.stepNum}>{index + 1}</span>
      <span className={styles.stepText}>{text}</span>
    </div>
  )
}

/* ── Code-style example block ────────────────────────────────────────────── */
function ExampleBlock({ text }) {
  return (
    <pre className={styles.exampleBlock}>
      <code>{text}</code>
    </pre>
  )
}

/* ── Problem statement banner (shown above all approaches) ───────────────── */
function ProblemBanner({ data }) {
  if (!data) return null
  return (
    <div className={styles.problemBanner}>
      <div className={styles.tutLabel}>
        <span className={styles.tutIcon}>📋</span> The Problem
      </div>
      <p className={styles.tutText}>{data.statement}</p>
      {data.example && (
        <>
          <div className={styles.tutLabel} style={{ marginTop: 10 }}>
            <span className={styles.tutIcon}>🔢</span> Example
          </div>
          <ExampleBlock text={data.example} />
        </>
      )}
      {data.keyInsight && (
        <div className={styles.insightBox}>
          <span className={styles.insightIcon}>⚡</span>
          <span>{data.keyInsight}</span>
        </div>
      )}
    </div>
  )
}

/* ── Main TutorialPane ───────────────────────────────────────────────────── */
export default function TutorialPane({ approach, tutorial, slug, language }) {
  // Resolve the canonical name: C++ names often differ from Java/tutorial keys
  const canonicalName = (language === 'cpp' && slug && approach?.name)
    ? (CPP_NAME_MAP[slug]?.[approach.name] ?? approach.name)
    : approach?.name
  const approachData = tutorial?.approaches?.[canonicalName]

  return (
    <div className={styles.tutPane}>
      <div className={styles.tutInner}>

        {/* Approach heading */}
        <div className={styles.tutHeading}>{approach?.name}</div>

        {/* Side-by-side Time / Space complexity visual */}
        <ComplexityVisual
          time={approach?.timeComplexity}
          space={approach?.spaceComplexity}
        />

        <div className={styles.tutDivider} />

        {/* Rich tutorial content if available */}
        {approachData ? (
          <>
            {/* Intuition */}
            <div className={styles.tutSection}>
              <div className={styles.tutLabel}>
                <span className={styles.tutIcon}>💡</span> The Idea
              </div>
              <p className={styles.tutText}>{approachData.intuition}</p>
            </div>

            {/* Step by step */}
            {approachData.steps?.length > 0 && (
              <div className={styles.tutSection}>
                <div className={styles.tutLabel}>
                  <span className={styles.tutIcon}>🪜</span> Step by Step
                </div>
                <div className={styles.stepList}>
                  {approachData.steps.map((s, i) => (
                    <Step key={i} index={i} text={s} />
                  ))}
                </div>
              </div>
            )}

            {/* Trace example */}
            {approachData.example && (
              <div className={styles.tutSection}>
                <div className={styles.tutLabel}>
                  <span className={styles.tutIcon}>🔢</span> Trace
                </div>
                <ExampleBlock text={approachData.example} />
              </div>
            )}

            {/* Key insight */}
            {approachData.keyInsight && (
              <div className={styles.insightBox}>
                <span className={styles.insightIcon}>⚡</span>
                <span>{approachData.keyInsight}</span>
              </div>
            )}
          </>
        ) : (
          /* Fallback: terse parsed EXPLAIN/WHEN */
          <>
            {approach?.explain && (
              <div className={styles.tutSection}>
                <div className={styles.tutLabel}>
                  <span className={styles.tutIcon}>💡</span> Approach
                </div>
                <p className={styles.tutText}>{approach.explain}</p>
              </div>
            )}
            {approach?.when && (
              <div className={styles.tutSection}>
                <div className={styles.tutLabel}>
                  <span className={styles.tutIcon}>🎯</span> When to use
                </div>
                <p className={styles.tutText}>{approach.when}</p>
              </div>
            )}
            {!approach?.explain && !approach?.when && (
              <p className={styles.tutMuted}>Tutorial coming soon for this approach.</p>
            )}
          </>
        )}

      </div>
    </div>
  )
}

/* Export the ProblemBanner too so SolutionPanel can use it */
export { ProblemBanner }
