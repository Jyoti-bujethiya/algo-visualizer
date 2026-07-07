// Spiral Matrix — LeetCode #54 — pure step generators (no DOM)
// CODE.boundary line→ init:0, right:2, down:3, left:4, up:5, while:1
// CODE.direction line→ init:0, loop:1, add:2, check:3, move:4
// CODE.recursive line→ check:0, right:1, down:2, left:3, up:4, recurse:5
const CK17 = { init:0, right:2, down:3, left:4, up:5, 'while':1, loop:1, add:2, check:3, move:4, recurse:5 }

function key(r, c) { return `${r},${c}` }

function genBoundary(matrix) {
  const steps = []
  const m = matrix, rows = m.length, cols = m[0].length
  let top = 0, bottom = rows - 1, left = 0, right = cols - 1
  const result = []
  const visited = new Set()
  const B = () => ({ top, bottom, left, right })

  steps.push({ desc: `Maintain four shrinking boundaries (top, bottom, left, right). Peel one layer at a time, collecting elements in spiral order.`, codeKey: 'init', codeLineIndex: (CK17['init'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'none', boundaries: B(), phase: '' })

  while (top <= bottom && left <= right) {
    steps.push({ desc: `Traversing the top row from left to right.`, codeKey: 'right', codeLineIndex: (CK17['right'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'right', boundaries: B(), phase: '' })
    for (let c = left; c <= right; c++) {
      result.push(m[top][c]); visited.add(key(top, c))
      steps.push({ desc: `Collected ${m[top][c]} from the top row. Moving right.`, codeKey: 'right', codeLineIndex: (CK17['right'] ?? -1), visited: new Set(visited), current: { r: top, c }, result: [...result], dir: 'right', boundaries: B(), phase: '' })
    }
    top++

    steps.push({ desc: `Top row done — shrink the top boundary. Now traversing the right column downward.`, codeKey: 'down', codeLineIndex: (CK17['down'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'down', boundaries: B(), phase: '' })
    for (let r = top; r <= bottom; r++) {
      result.push(m[r][right]); visited.add(key(r, right))
      steps.push({ desc: `Collected ${m[r][right]} from the right column. Moving down.`, codeKey: 'down', codeLineIndex: (CK17['down'] ?? -1), visited: new Set(visited), current: { r, c: right }, result: [...result], dir: 'down', boundaries: B(), phase: '' })
    }
    right--

    if (top <= bottom) {
      steps.push({ desc: `Right column done — shrink the right boundary. Now traversing the bottom row from right to left.`, codeKey: 'left', codeLineIndex: (CK17['left'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'left', boundaries: B(), phase: '' })
      for (let c = right; c >= left; c--) {
        result.push(m[bottom][c]); visited.add(key(bottom, c))
        steps.push({ desc: `Collected ${m[bottom][c]} from the bottom row. Moving left.`, codeKey: 'left', codeLineIndex: (CK17['left'] ?? -1), visited: new Set(visited), current: { r: bottom, c }, result: [...result], dir: 'left', boundaries: B(), phase: '' })
      }
      bottom--
    }

    if (left <= right) {
      steps.push({ desc: `Bottom row done — shrink the bottom boundary. Now traversing the left column upward.`, codeKey: 'up', codeLineIndex: (CK17['up'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'up', boundaries: B(), phase: '' })
      for (let r = bottom; r >= top; r--) {
        result.push(m[r][left]); visited.add(key(r, left))
        steps.push({ desc: `Collected ${m[r][left]} from the left column. Moving up.`, codeKey: 'up', codeLineIndex: (CK17['up'] ?? -1), visited: new Set(visited), current: { r, c: left }, result: [...result], dir: 'up', boundaries: B(), phase: '' })
      }
      left++
    }
  }
  steps.push({ desc: `All elements collected in spiral order. Result: [${result.join(', ')}].`, codeKey: 'while', codeLineIndex: (CK17['while'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'none', boundaries: B(), phase: 'complete' })
  return steps
}

function genDirection(matrix) {
  const steps = []
  const m = matrix, rows = m.length, cols = m[0].length
  const dr = [0, 1, 0, -1], dc = [1, 0, -1, 0]
  const dirName = ['right', 'down', 'left', 'up']
  let r = 0, c = 0, dir = 0
  const result = [], visited = new Set()
  const B = () => ({ top: 0, bottom: rows - 1, left: 0, right: cols - 1 })

  steps.push({ desc: `Use direction vectors to walk the spiral. Start moving right. When the next step would go out of bounds or revisit a cell, turn right.`, codeKey: 'init', codeLineIndex: (CK17['init'] ?? -1), visited: new Set(visited), current: { r, c }, result: [...result], dir: dirName[dir], boundaries: B(), phase: '' })

  for (let i = 0; i < rows * cols; i++) {
    result.push(m[r][c]); visited.add(key(r, c))
    steps.push({ desc: `Collected ${m[r][c]}. Currently moving ${dirName[dir]}.`, codeKey: 'add', codeLineIndex: (CK17['add'] ?? -1), visited: new Set(visited), current: { r, c }, result: [...result], dir: dirName[dir], boundaries: B(), phase: '' })
    const nr = r + dr[dir], nc = c + dc[dir]
    const blocked = nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited.has(key(nr, nc))
    if (blocked && i < rows * cols - 1) {
      dir = (dir + 1) % 4
      steps.push({ desc: `The next cell in this direction is a wall or already visited. Turning right to face ${dirName[dir]}.`, codeKey: 'check', codeLineIndex: (CK17['check'] ?? -1), visited: new Set(visited), current: { r, c }, result: [...result], dir: dirName[dir], boundaries: B(), phase: '' })
    }
    r += dr[dir]; c += dc[dir]
  }
  steps.push({ desc: `All ${rows * cols} elements collected. Result: [${result.join(', ')}].`, codeKey: 'loop', codeLineIndex: (CK17['loop'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'none', boundaries: B(), phase: 'complete' })
  return steps
}

function genRecursive(matrix) {
  const steps = []
  const m = matrix, rows = m.length, cols = m[0].length
  const result = [], visited = new Set()
  const B = () => ({ top: 0, bottom: rows - 1, left: 0, right: cols - 1 })

  steps.push({ desc: `Recursively peel the outermost ring of the matrix, then recurse into the inner matrix. Each call collects one full ring.`, codeKey: 'check', codeLineIndex: (CK17['check'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'none', boundaries: B(), phase: '' })

  function peel(top, bottom, left, right, depth) {
    if (top > bottom || left > right) return
    const bnd = { top, bottom, left, right }
    steps.push({ desc: `Peeling layer ${depth}: the ring defined by rows ${top}–${bottom} and columns ${left}–${right}.`, codeKey: 'check', codeLineIndex: (CK17['check'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'none', boundaries: bnd, phase: '' })
    for (let c = left; c <= right; c++) {
      result.push(m[top][c]); visited.add(key(top, c))
      steps.push({ desc: `Collected ${m[top][c]} from the top row of this layer.`, codeKey: 'right', codeLineIndex: (CK17['right'] ?? -1), visited: new Set(visited), current: { r: top, c }, result: [...result], dir: 'right', boundaries: bnd, phase: '' })
    }
    for (let r = top + 1; r <= bottom; r++) {
      result.push(m[r][right]); visited.add(key(r, right))
      steps.push({ desc: `Collected ${m[r][right]} from the right column of this layer.`, codeKey: 'down', codeLineIndex: (CK17['down'] ?? -1), visited: new Set(visited), current: { r, c: right }, result: [...result], dir: 'down', boundaries: bnd, phase: '' })
    }
    if (top < bottom) {
      for (let c = right - 1; c >= left; c--) {
        result.push(m[bottom][c]); visited.add(key(bottom, c))
        steps.push({ desc: `Collected ${m[bottom][c]} from the bottom row of this layer.`, codeKey: 'left', codeLineIndex: (CK17['left'] ?? -1), visited: new Set(visited), current: { r: bottom, c }, result: [...result], dir: 'left', boundaries: bnd, phase: '' })
      }
    }
    if (left < right) {
      for (let r = bottom - 1; r > top; r--) {
        result.push(m[r][left]); visited.add(key(r, left))
        steps.push({ desc: `Collected ${m[r][left]} from the left column of this layer.`, codeKey: 'up', codeLineIndex: (CK17['up'] ?? -1), visited: new Set(visited), current: { r, c: left }, result: [...result], dir: 'up', boundaries: bnd, phase: '' })
      }
    }
    steps.push({ desc: `Layer ${depth} complete. Recursing into the next inner layer.`, codeKey: 'recurse', codeLineIndex: (CK17['recurse'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'none', boundaries: bnd, phase: '' })
    peel(top + 1, bottom - 1, left + 1, right - 1, depth + 1)
  }

  peel(0, rows - 1, 0, cols - 1, 0)
  steps.push({ desc: `All layers peeled. Spiral result: [${result.join(', ')}].`, codeKey: 'check', codeLineIndex: (CK17['check'] ?? -1), visited: new Set(visited), current: null, result: [...result], dir: 'none', boundaries: B(), phase: 'complete' })
  return steps
}

export function generateSteps(algo, matrix) {
  if (algo === 'boundary') return genBoundary(matrix)
  if (algo === 'direction') return genDirection(matrix)
  return genRecursive(matrix)
}
