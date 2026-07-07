// 005 — Product of Array Except Self · steps.js
export function generateSteps(algo, nums) {
  return algo === 'prefixSuffix' ? generatePrefixSuffixSteps(nums) : generateOptimalSteps(nums)
}

function generatePrefixSuffixSteps(nums) {
  const steps = [], n = nums.length
  const prefix = new Array(n).fill(1), suffix = new Array(n).fill(1), result = new Array(n).fill(null)
  steps.push({ description: 'Build a prefix array (product of everything to the left) and a suffix array (product of everything to the right). Multiply them together for the answer.', nums, prefix: [...prefix], suffix: [...suffix], result: [...result], currentPos: -1, phase: 'Init', codeLineIndex: 0 })
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * nums[i - 1]
    steps.push({ description: `Prefix at position ${i}: everything to the left multiplied together = ${prefix[i]}.`, nums, prefix: [...prefix], suffix: [...suffix], result: [...result], currentPos: i, phase: 'Prefix', codeLineIndex: 1 })
  }
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i + 1]
    steps.push({ description: `Suffix at position ${i}: everything to the right multiplied together = ${suffix[i]}.`, nums, prefix: [...prefix], suffix: [...suffix], result: [...result], currentPos: i, phase: 'Suffix', codeLineIndex: 3 })
  }
  for (let i = 0; i < n; i++) {
    result[i] = prefix[i] * suffix[i]
    steps.push({ description: `Result at position ${i}: left product (${prefix[i]}) × right product (${suffix[i]}) = ${result[i]}.`, nums, prefix: [...prefix], suffix: [...suffix], result: [...result], currentPos: i, phase: 'Result', codeLineIndex: 4 })
  }
  steps.push({ description: `Done! Result array: [${result.join(', ')}]. Each value is the product of all other numbers.`, nums, prefix: [...prefix], suffix: [...suffix], result: [...result], currentPos: -1, phase: 'Complete', codeLineIndex: 4 })
  return steps
}

function generateOptimalSteps(nums) {
  const steps = [], n = nums.length
  const result = new Array(n).fill(1)
  steps.push({ description: 'Use a single result array and make two passes — no extra arrays needed. First pass fills in left products, second pass multiplies in right products.', nums, result: [...result], currentPos: -1, phase: 'Init', prefixVal: 1, suffixVal: 1, codeLineIndex: 0 })
  let prefix = 1
  for (let i = 0; i < n; i++) {
    result[i] = prefix
    steps.push({ description: `Pass 1 — position ${i}: store the running left product (${prefix}) into the result. Then multiply the running product by ${nums[i]}.`, nums, result: [...result], currentPos: i, phase: 'Prefix', prefixVal: prefix, suffixVal: 1, codeLineIndex: 1 })
    prefix *= nums[i]
  }
  let suffix = 1
  for (let i = n - 1; i >= 0; i--) {
    const old = result[i]
    result[i] *= suffix
    steps.push({ description: `Pass 2 — position ${i}: multiply the stored left product (${old}) by the running right product (${suffix}) to get ${result[i]}.`, nums, result: [...result], currentPos: i, phase: 'Suffix', prefixVal: prefix, suffixVal: suffix, codeLineIndex: 2 })
    suffix *= nums[i]
  }
  steps.push({ description: `Both passes complete. Result: [${result.join(', ')}].`, nums, result: [...result], currentPos: -1, phase: 'Complete', prefixVal: prefix, suffixVal: suffix, codeLineIndex: 2 })
  return steps
}
