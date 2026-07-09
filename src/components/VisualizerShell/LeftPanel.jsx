import styles from './VisualizerShell.module.css'

/** Left panel — test cases, algorithm selector, optional custom input */
export default function LeftPanel({
  testCases,
  selectedTest,
  onTestChange,
  algorithms,
  selectedAlgo,
  onAlgoChange,
  customInput,
}) {
  return (
    <aside className={styles.left}>
      {/* Test cases */}
      {testCases.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Test Cases</h3>
          <div className={styles.btnList}>
            {testCases.map((tc, i) => (
              <button
                key={i}
                className={`${styles.sideBtn} ${selectedTest === i ? styles.sideBtnActive : ''}`}
                onClick={() => onTestChange?.(i)}
              >
                <div className={styles.sideBtnRow}>
                  <span className={styles.sideBtnBadge}>{i + 1}</span>
                  <span className={styles.sideBtnLabel}>{tc.label ?? `Test ${i + 1}`}</span>
                </div>
                {tc.detail && <span className={styles.sideBtnDetail}>{tc.detail}</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Algorithm selector */}
      {algorithms.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Algorithm</h3>
          <div className={styles.btnList}>
            {algorithms.map(algo => (
              <button
                key={algo.id}
                className={`${styles.sideBtn} ${selectedAlgo === algo.id ? styles.sideBtnActive : ''}`}
                onClick={() => onAlgoChange?.(algo.id)}
              >
                <span className={styles.sideBtnLabel}>{algo.name}</span>
                {algo.complexity && (
                  <span className={styles.sideBtnDetail}>{algo.complexity}</span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Custom input (problem-specific) */}
      {customInput && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Custom Input</h3>
          {customInput}
        </section>
      )}
    </aside>
  )
}
