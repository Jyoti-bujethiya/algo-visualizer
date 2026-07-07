// 013 – Group Anagrams — pure step generator

function sortKey(str)  { return str.split('').sort().join('') }
function countKey(str) {
  const cnt = new Array(26).fill(0)
  for (const c of str) cnt[c.charCodeAt(0) - 97]++
  return cnt.map((v, i) => v > 0 ? String.fromCharCode(97 + i) + v : '').join('')
}

// CODE = ['map = {}', 'for str in strs:', '  key = ...', '  map[key].append(str)', 'return map.values()']
const CODE_LINE = { init: 0, loop: 1, key: 2, count: 2, insert: 3, build: 4, ret: 4 }

function genAlgo(strs, keyFn, keyStep) {
  const steps = []
  const groups = new Map()
  let colorIdx = 0

  const snapshot = () => new Map([...groups].map(([k, v]) => [k, { words: [...v.words], colorIdx: v.colorIdx }]))

  steps.push({ description: 'Start with an empty map. Each unique anagram signature will become a key, grouping all its words together.', codeKey: 'init',
    groups: snapshot(), currentIdx: -1, currentKey: null, result: null, codeLineIndex: CODE_LINE['init'] })

  for (let i = 0; i < strs.length; i++) {
    const str = strs[i]
    steps.push({ description: `Looking at the word "${str}". Compute its anagram signature to find out which group it belongs to.`, codeKey: 'loop',
      groups: snapshot(), currentIdx: i, currentKey: null, result: null, codeLineIndex: CODE_LINE['loop'] })

    const key = keyFn(str)
    steps.push({ description: `Signature of "${str}" is "${key}". All words with this signature are anagrams of each other.`, codeKey: keyStep,
      groups: snapshot(), currentIdx: i, currentKey: key, result: null, codeLineIndex: CODE_LINE[keyStep] ?? 2 })

    if (!groups.has(key)) groups.set(key, { words: [], colorIdx: colorIdx++ })
    groups.get(key).words.push(str)

    steps.push({
      description: `"${str}" added to the group with signature "${key}". That group now contains: [${groups.get(key).words.join(', ')}].`,
      codeKey: 'insert', groups: snapshot(), currentIdx: i, currentKey: key, result: null, codeLineIndex: CODE_LINE['insert']
    })
  }

  const result = [...groups.values()].map(v => v.words)
  steps.push({ description: `All words grouped. Found ${groups.size} anagram group(s).`,
    codeKey: 'build', groups: snapshot(), currentIdx: -1, currentKey: null, result, codeLineIndex: CODE_LINE['build'] })

  return steps
}

export function generateSteps(algo, strs) {
  if (algo === 'count') return genAlgo(strs, countKey, 'count')
  return genAlgo(strs, sortKey, 'key')
}
