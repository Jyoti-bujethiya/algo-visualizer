import styles from './BacktrackingDisplay.module.css'

const STATE_CLASS = {
  queen:    styles.queen,
  placed:   styles.queen,
  trying:   styles.current,
  current:  styles.current,
  active:   styles.current,
  conflict: styles.error,
  attack:   styles.error,
  error:    styles.error,
  safe:     styles.match,
  match:    styles.match,
  found:    styles.match,
  visited:  styles.discard,
  land:     styles.special,
  water:    '',
}

/**
 * BacktrackingDisplay — renders a 2D grid board.
 * Used for N-Queens, Number of Islands, grids, etc.
 *
 * Props:
 *   grid        {Array<Array<{val, state?}|number|string>>} — 2D grid
 *   highlights  {Object} — "row,col" → state name
 *   n           {number} — board size (if square)
 *   info        {string} — status line below board
 *   solutions   {Array<Array<number>>} — found solutions to display
 *   chessBoard  {boolean} — apply chess-board light/dark coloring
 */
export default function BacktrackingDisplay({
  grid = [],
  highlights = {},
  info,
  solutions = [],
  chessBoard = false,
}) {
  if (!grid.length) return null

  const cols = grid[0].length

  return (
    <div className={styles.wrap}>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${cols}, 52px)` }}
      >
        {grid.map((row, ri) =>
          row.map((cell, ci) => {
            const cellObj  = typeof cell === 'object' && cell !== null ? cell : { val: cell }
            const stateKey = highlights[`${ri},${ci}`] ?? cellObj.state
            const stateClass = STATE_CLASS[stateKey] ?? ''
            const lightDark  = chessBoard
              ? (ri + ci) % 2 === 0 ? styles.cellLight : styles.cellDark
              : ''
            return (
              <div
                key={`${ri}-${ci}`}
                className={`${styles.cell} ${lightDark} ${stateClass}`}
              >
                {cellObj.val === '♛' || stateKey === 'queen' || stateKey === 'placed'
                  ? '♛'
                  : cellObj.val === 1 || cellObj.val === '1'
                    ? '■'
                    : cellObj.val === 0 || cellObj.val === '0' || cellObj.val === ''
                      ? ''
                      : cellObj.val ?? ''}
              </div>
            )
          })
        )}
      </div>

      {info && <div className={styles.info}>{info}</div>}

      {solutions.length > 0 && (
        <div className={styles.solutions}>
          {solutions.map((sol, i) => (
            <span key={i} className={styles.solutionChip}>
              [{sol.join(',')}]
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
