/**
 * Tutorial content for #015 — String to Integer (atoi)
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Implement the atoi function that converts a string to a 32-bit signed integer. The rules are: ignore leading whitespace, read an optional '+' or '-' sign, read digits until the first non-digit, then clamp the result to the 32-bit integer range [-2^31, 2^31 - 1].`,
    example: `"   -42"   → ignore spaces, read '-', read 42 → -42\n"4193 with words" → read 4193, stop at space → 4193\n"words and 987" → first non-space is 'w' → 0\n✅ Answer: -42 for "   -42"`,
    keyInsight: `Process the string in four sequential steps: strip whitespace, read sign, read digits, clamp. Handle each step in order and stop reading as soon as you hit a non-digit character.`,
  },

  approaches: {
    'Simulation': {
      intuition: `Walk through the string one character at a time, following the rules in order: skip spaces, check for a sign character, then accumulate digits by multiplying by 10 and adding the next digit. Check for overflow at each step. Stop when you see a non-digit.`,
      steps: [
        `Initialize index i=0, sign=1, result=0.`,
        `Skip leading whitespace: while i < n AND s[i] == ' ', i++.`,
        `Read sign: if s[i] == '-', sign=-1, i++. Else if s[i] == '+', i++.`,
        `Read digits: while i < n AND s[i] is a digit:`,
        `  digit = s[i] - '0'.`,
        `  Before multiplying, check for overflow: if result > (INT_MAX - digit) / 10 → clamp and return.`,
        `  result = result * 10 + digit. i++.`,
        `Return sign * result.`,
      ],
      example: `s = "   -42"\n\nStep 1: skip spaces → i=3, s[3]='-'\nStep 2: sign=-1, i=4\nStep 3: s[4]='4' digit=4, result=0*10+4=4, i=5\n        s[5]='2' digit=2, result=4*10+2=42, i=6\n        i=6 end of string → stop\nResult = -1 * 42 = -42\n✅ Answer: -42`,
      keyInsight: `O(n) time, O(1) space. The overflow check (result > (INT_MAX - digit) / 10) must happen before the multiplication — if you multiply first you've already overflowed. This is the standard clean implementation.`,
    },

    'Overflow-Safe (no long)': {
      intuition: `Same simulation logic, but avoids using a 64-bit long variable to detect overflow. Instead, check for overflow purely using 32-bit integer arithmetic before each digit is appended. This is important in languages or contexts where long is not available or desired.`,
      steps: [
        `Initialize i=0, sign=1, result=0, limit=Integer.MAX_VALUE.`,
        `Skip whitespace, then read sign character.`,
        `For each digit character: compute digit = s[i] - '0'.`,
        `  Overflow check: if result > (limit / 10) OR (result == limit / 10 AND digit > limit % 10):`,
        `    Return INT_MAX if sign=1, INT_MIN if sign=-1.`,
        `  result = result * 10 + digit.`,
        `Return sign * result.`,
      ],
      example: `s = "2147483648" (INT_MAX + 1)\n\nINT_MAX = 2147483647\nReading: 2,1,4,7,4,8,3,6,4,8\nAfter reading 214748364, result=214748364\nNext digit=8:\n  result(214748364) == INT_MAX/10(214748364) AND digit(8) > INT_MAX%10(7)\n  → Overflow! sign=1 → return INT_MAX = 2147483647\n✅ Correctly clamped`,
      keyInsight: `O(n) time, O(1) space. The two-condition overflow check (greater than limit/10, OR equal to limit/10 with a digit exceeding limit%10) handles all edge cases without ever exceeding 32-bit range during computation.`,
    },

    'DFA / State Machine': {
      intuition: `Model the parsing rules as a finite automaton with explicit states: START, SIGN, NUMBER, and END. Each incoming character causes a state transition. Only the NUMBER state accumulates digits. Any unexpected character transitions to END and stops consumption. This approach makes the rules completely explicit and verifiable.`,
      steps: [
        `Define states: START, SIGN, NUMBER, END.`,
        `Begin in START. For each character in s, apply transition rules:`,
        `  START + space → START; START + '+'/'-' → SIGN (record sign); START + digit → NUMBER.`,
        `  SIGN + digit → NUMBER; NUMBER + digit → NUMBER (accumulate); anything else → END.`,
        `In NUMBER state: accumulate digit and check for overflow before multiplying.`,
        `When END is reached or input is exhausted: return sign * result, clamped to [INT_MIN, INT_MAX].`,
      ],
      example: `s = "  -42"\n\nState=START: ' '→START, ' '→START\nState=START: '-'→SIGN, sign=-1\nState=SIGN:  '4'→NUMBER, result=4\nState=NUMBER:'2'→NUMBER, result=42\nEnd of string → return -1*42 = -42\n✅ Answer: -42`,
      keyInsight: `O(n) time, O(1) space. DFA makes every transition rule explicit — impossible to miss a case. Slightly more code than Simulation but much easier to extend or audit for correctness.`,
    },

    'Manual Parse (trim then scan)': {
      intuition: `A clean three-phase approach: first trim all leading whitespace using a helper, then detect the sign, then accumulate digits using a long to avoid intermediate overflow before final clamping. Separating the three phases into distinct code sections makes each step easier to follow and test individually.`,
      steps: [
        `Phase 1 — Trim: advance index i past all leading space characters.`,
        `Phase 2 — Sign: if s[i] is '+' or '-', record sign and advance i.`,
        `Phase 3 — Digits: use a long result=0. While s[i] is a digit: result = result*10 + digit, i++.`,
        `  If result > INT_MAX: clamp immediately.`,
        `Return (int) Math.max(INT_MIN, Math.min(INT_MAX, sign * result)).`,
      ],
      example: `s = "   +3296"\n\nPhase 1: skip 3 spaces, i=3\nPhase 2: '+' → sign=+1, i=4\nPhase 3: '3'→result=3, '2'→result=32, '9'→result=329, '6'→result=3296\n  3296 <= INT_MAX → no clamp\nReturn +1 * 3296 = 3296\n✅ Answer: 3296`,
      keyInsight: `O(n) time, O(1) space. Using a long for intermediate accumulation is the simplest way to handle overflow — just clamp at the end. The three-phase separation makes the code self-documenting.`,
    },

    'Library Parse (Long.parseLong)': {
      intuition: `Leverage the standard library's Long.parseLong (or equivalent) to do the heavy lifting: trim whitespace, extract the numeric token from the string, parse it as a long, then clamp to the int range. This is the shortest implementation and mirrors what you'd do in production code — but interviewers usually want the manual approach.`,
      steps: [
        `Trim leading whitespace from the string.`,
        `Use a regex or manual scan to extract the optional sign followed by digits as a token.`,
        `Parse the token with Long.parseLong (catches NumberFormatException → return 0).`,
        `Clamp the result: return (int) Math.max(INT_MIN, Math.min(INT_MAX, parsedLong)).`,
      ],
      example: `s = "4193 with words"\n\nTrim → "4193 with words"\nExtract numeric prefix: "4193"\nLong.parseLong("4193") = 4193L\nClamp: 4193 is within [INT_MIN, INT_MAX]\nReturn 4193\n✅ Answer: 4193`,
      keyInsight: `O(n) time, O(n) space (substring). The shortest code path, but relies on library internals and doesn't demonstrate understanding of overflow handling — use for scripting/production, not for interviews.`,
    },
  },
}
