import { useState } from 'react'
import styles from './VisualizerShell.module.css'

/**
 * Reusable custom-input form for the left panel.
 *
 * Fields is an array of field descriptors:
 *   { key, label, placeholder, type? }
 *   type: 'array' | 'number' | 'text'  (default 'text')
 *
 * onApply({ key: value, ... }) is called with parsed values when Apply is clicked.
 * Validation is handled here; individual fields parse based on type.
 */
export default function CustomInput({ fields, onApply }) {
  const initial = Object.fromEntries(fields.map(f => [f.key, '']))
  const [values, setValues]   = useState(initial)
  const [error,  setError]    = useState('')

  function handleChange(key, val) {
    setValues(prev => ({ ...prev, [key]: val }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    try {
      const parsed = {}
      for (const f of fields) {
        const raw = values[f.key].trim()
        if (!raw) {
          setError(`"${f.label}" is required.`)
          return
        }
        if (f.type === 'array') {
          const arr = raw.split(',').map(x => {
            const n = Number(x.trim())
            if (isNaN(n)) throw new Error(`"${x.trim()}" is not a number in ${f.label}.`)
            return n
          })
          if (arr.length === 0) throw new Error(`${f.label} must not be empty.`)
          parsed[f.key] = arr
        } else if (f.type === 'number') {
          const n = Number(raw)
          if (isNaN(n)) throw new Error(`${f.label} must be a number.`)
          parsed[f.key] = n
        } else {
          parsed[f.key] = raw
        }
      }
      onApply(parsed)
      setValues(initial)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className={styles.customInputForm} onSubmit={handleSubmit}>
      {fields.map(f => (
        <div key={f.key} className={styles.customInputField}>
          <label className={styles.customInputLabel}>{f.label}</label>
          <input
            className={styles.customInputEl}
            type="text"
            placeholder={f.placeholder ?? ''}
            value={values[f.key]}
            onChange={e => handleChange(f.key, e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      ))}
      {error && <div className={styles.customInputError}>{error}</div>}
      <button type="submit" className={styles.customInputApply}>Apply</button>
    </form>
  )
}
