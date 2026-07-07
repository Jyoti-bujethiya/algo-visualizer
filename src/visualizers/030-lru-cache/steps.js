// 030 — LRU Cache · steps.js

const _PL030 = {'init': 0, 'get': 2, 'put-update': 7, 'evict': 9, 'put-new': 6, 'complete': -1}
// Simulate get/put operations and show the doubly-linked list + hash map state

function push(steps, desc, cache, op, extra = {}) {
  steps.push({ description: desc, cache: cache.map(n => ({ ...n })), op: { ...op }, codeLineIndex: extra.codeLineIndex ?? (_PL030[extra.phase] ?? -1), ...extra })
}

function genLRU(capacity, operations) {
  const steps = []
  // Doubly linked list: most-recent at front, least-recent at back
  const dll = []    // ordered array: [0] = most recent
  const map = {}    // key → value

  push(steps,
    `LRU Cache with capacity ${capacity}: uses a hash map for O(1) lookup and a doubly-linked list to track access order. The least-recently used item is always at the back.`,
    [], { type: 'init', capacity }, { phase: 'init' })

  for (const op of operations) {
    if (op.type === 'get') {
      const idx = dll.findIndex(n => n.key === op.key)
      if (idx === -1) {
        push(steps,
          `GET ${op.key} → key not in cache, return -1.`,
          dll.map(n => ({ ...n })), op, { phase: 'get', result: -1 })
      } else {
        const node = dll.splice(idx, 1)[0]
        node.state = 'current'
        dll.unshift(node)
        setTimeout(() => { node.state = '' }, 0)
        push(steps,
          `GET ${op.key} → found value ${node.val}. Move key ${op.key} to the front (most recently used).`,
          dll.map((n, i) => ({ ...n, state: i === 0 ? 'current' : '' })),
          op, { phase: 'get', result: node.val })
      }
    } else {
      // PUT
      const existing = dll.findIndex(n => n.key === op.key)
      if (existing !== -1) {
        dll.splice(existing, 1)
        dll.unshift({ key: op.key, val: op.val, state: 'match' })
        push(steps,
          `PUT (${op.key}, ${op.val}) → key already exists, update value and move to front.`,
          dll.map((n, i) => ({ ...n, state: i === 0 ? 'match' : '' })),
          op, { phase: 'put-update' })
      } else if (dll.length >= capacity) {
        const evicted = dll.pop()
        push(steps,
          `PUT (${op.key}, ${op.val}) → cache is full (${capacity} items). Evict LRU key "${evicted.key}" from the back.`,
          [...dll.map(n => ({ ...n, state: '' })), { ...evicted, state: 'error' }],
          op, { phase: 'evict', evictedKey: evicted.key })
        dll.unshift({ key: op.key, val: op.val, state: 'match' })
        push(steps,
          `Inserted (${op.key}, ${op.val}) at the front as the most-recently used item.`,
          dll.map((n, i) => ({ ...n, state: i === 0 ? 'match' : '' })),
          op, { phase: 'put-new' })
      } else {
        dll.unshift({ key: op.key, val: op.val, state: 'match' })
        push(steps,
          `PUT (${op.key}, ${op.val}) → inserted at the front. Cache now has ${dll.length} / ${capacity} items.`,
          dll.map((n, i) => ({ ...n, state: i === 0 ? 'match' : '' })),
          op, { phase: 'put-new' })
      }
    }
  }

  push(steps,
    `All operations complete. Final cache state (front = most recent, back = LRU): [${dll.map(n => `${n.key}:${n.val}`).join(' → ')}].`,
    dll.map(n => ({ ...n, state: 'match' })),
    { type: 'done' }, { phase: 'complete' })
  return steps
}

export function generateSteps(_algo, capacity, operations) {
  return genLRU(capacity, operations)
}
