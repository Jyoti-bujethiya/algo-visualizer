import styles from './VisualizerShell.module.css'

const SPEED_OPTIONS = [
  { value: 1,  label: '0.5×' },
  { value: 3,  label: '1×'   },
  { value: 5,  label: '2×'   },
  { value: 7,  label: '3×'   },
  { value: 10, label: '5×'   },
]

/** Bottom controls — Prev · Play/Pause · Next · | · Reset · Speed · Counter */
export default function ControlsBar({ hook }) {
  if (!hook) return null
  const { isPlaying, currentStep, totalSteps, speed, setSpeed, prev, next, togglePlay, reset } = hook

  const atStart    = currentStep <= 0
  const atEnd      = currentStep >= totalSteps - 1
  const notStarted = currentStep === -1

  const playLabel = isPlaying
    ? '⏸ Pause'
    : atEnd && totalSteps > 0
      ? '↺ Restart'
      : notStarted
        ? '▶ Start'
        : '▶ Resume'

  return (
    <div className={styles.controls}>
      {/* Row 1: Playback + speed + counter */}
      <div className={styles.controlsRow}>
      {/* Playback buttons — all live inside one pill container */}
      <div className={styles.controlBtns}>
        <button
          className={styles.ctrlBtn}
          onClick={prev}
          disabled={atStart || notStarted}
          aria-label="Previous step"
        >
          ◀ Prev
        </button>

        <button
          className={`${styles.ctrlBtn} ${styles.ctrlBtnPrimary}`}
          onClick={togglePlay}
          disabled={totalSteps === 0}
          aria-label={playLabel}
        >
          {playLabel}
        </button>

        <button
          className={styles.ctrlBtn}
          onClick={next}
          disabled={atEnd}
          aria-label="Next step"
        >
          Next ▶
        </button>

        {/* Visual separator before Reset */}
        <span className={styles.ctrlDivider} aria-hidden="true" />

        <button
          className={styles.ctrlBtn}
          onClick={reset}
          aria-label="Reset"
        >
          ↺ Reset
        </button>
      </div>

      {/* Speed toggle */}
      <div className={styles.speedGroup} role="group" aria-label="Playback speed">
        <span className={styles.speedLabel}>Speed</span>
        {SPEED_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`${styles.speedBtn} ${speed === opt.value ? styles.speedBtnActive : ''}`}
            onClick={() => setSpeed(opt.value)}
            aria-pressed={speed === opt.value}
            aria-label={`Speed ${opt.label}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Step counter */}
      <div className={styles.stepCount}>
        {notStarted ? '—' : `${currentStep + 1} / ${totalSteps}`}
      </div>
      </div>{/* end controlsRow */}

      {/* Row 2: Keyboard hint */}
      <div className={styles.kbdHint} aria-hidden="true">
        <kbd>Space</kbd> play &nbsp;·&nbsp; <kbd>←</kbd><kbd>→</kbd> step &nbsp;·&nbsp; <kbd>R</kbd> reset
      </div>
    </div>
  )
}
