// 045 — Word Ladder · steps.js
// BFS shortest transformation sequence

// BFS line indices:
// 0: function ladderLength(beginWord, endWord, wordList):
// 1:   wordSet = new Set(wordList)
// 2:   if endWord not in wordSet: return 0
// 3:   queue = [(beginWord, 1)]
// 4:   while queue not empty:
// 5:     pop (word, level)
// 6:     for each position i in word:
// 7:       for each letter a-z:
// 8:         newWord = word with position i changed
// 9:         if newWord == endWord: return level+1
//10:         if newWord in wordSet: queue.push((newWord, level+1)); wordSet.delete(newWord)
//11:   return 0

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(beginWord, endWord, wordList) {
  const steps = []
  const highlights = {}

  // Build index for graph display: all words
  const allWords = [beginWord, ...wordList]
  const wordSet = new Set(wordList)

  push(steps,
    `Word Ladder BFS: find shortest path from "${beginWord}" to "${endWord}". We explore each word's neighbors (differ by 1 letter) level by level.`,
    {}, 0
  )

  if (!wordSet.has(endWord)) {
    push(steps, `"${endWord}" not in word list — return 0. No transformation sequence possible.`, {}, 2, { result: 0, done: true })
    return steps
  }

  const wordIndex = {}
  allWords.forEach((w, i) => { wordIndex[w] = i })

  // BFS
  const visited = new Set([beginWord])
  const queue = [[beginWord, 1]]
  highlights[wordIndex[beginWord]] = 'current'
  push(steps,
    `Initialize queue with ["${beginWord}", level=1]. Mark as visited.`,
    { ...highlights }, 3
  )

  while (queue.length > 0) {
    const [word, level] = queue.shift()
    highlights[wordIndex[word]] = 'current'
    push(steps,
      `Processing "${word}" at level ${level}. Try changing each character (a–z).`,
      { ...highlights }, 5, { level }
    )

    let found = false
    for (let i = 0; i < word.length; i++) {
      for (let c = 0; c < 26; c++) {
        const ch = String.fromCharCode(97 + c)
        if (ch === word[i]) continue
        const newWord = word.slice(0, i) + ch + word.slice(i + 1)
        if (newWord === endWord) {
          if (wordIndex[newWord] !== undefined) highlights[wordIndex[newWord]] = 'found'
          push(steps,
            `Changed pos ${i} of "${word}" → "${newWord}" = endWord! Transformation sequence length = ${level + 1}.`,
            { ...highlights }, 9, { result: level + 1 }
          )
          found = true
          break
        }
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord)
          wordSet.delete(newWord)
          queue.push([newWord, level + 1])
          if (wordIndex[newWord] !== undefined) highlights[wordIndex[newWord]] = 'queued'
          push(steps,
            `"${word}" → "${newWord}" (changed pos ${i}). Added to queue at level ${level + 1}.`,
            { ...highlights }, 10
          )
        }
      }
      if (found) break
    }
    if (found) {
      push(steps, `Found shortest path! Length = ${level + 1}.`, { ...highlights }, 9, { result: level + 1, done: true })
      return steps
    }

    highlights[wordIndex[word]] = 'done'
  }

  push(steps,
    `Queue exhausted — no path from "${beginWord}" to "${endWord}". Return 0.`,
    { ...highlights }, 11, { result: 0, done: true }
  )
  return steps
}
