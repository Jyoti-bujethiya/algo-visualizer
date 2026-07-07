/*
 * LeetCode Problem #8: String to Integer (atoi)
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/string-to-integer-atoi/
 *
 * Problem Statement:
 * Implement the myAtoi(string s) function, which converts a string to a
 * 32-bit signed integer (similar to C's atoi function).
 *
 * Algorithm:
 * 1. Ignore leading whitespace.
 * 2. Check for optional '+' or '-' sign.
 * 3. Read digits until a non-digit character or end of string.
 * 4. Clamp to [INT_MIN, INT_MAX] on overflow.
 *
 * Example 1: "42"       → 42
 * Example 2: "   -42"   → -42
 * Example 3: "4193abc"  → 4193
 * Example 4: "words 12" → 0
 * Example 5: "-91283472332" → -2147483648 (INT_MIN)
 */

#include <string>
#include <climits>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: STEP-BY-STEP SIMULATION (Optimal / Standard)
 * Time: O(n), Space: O(1)
 *
 * Directly follows the 4-step atoi spec.
 */
class Solution1 {
public:
    int myAtoi(string s) {
        int i = 0, n = s.size(), sign = 1;
        long long result = 0;

        // 1. Skip leading whitespace
        while (i < n && s[i] == ' ') i++;

        // 2. Read sign
        if (i < n && (s[i] == '+' || s[i] == '-'))
            sign = (s[i++] == '-') ? -1 : 1;

        // 3. Read digits
        while (i < n && isdigit(s[i])) {
            result = result * 10 + (s[i++] - '0');
            // 4. Clamp early
            if (result * sign > INT_MAX) return INT_MAX;
            if (result * sign < INT_MIN) return INT_MIN;
        }
        return (int)(result * sign);
    }
};

/*
 * APPROACH 2: OVERFLOW-SAFE WITHOUT long long
 * Time: O(n), Space: O(1)
 *
 * Detect overflow before multiplying by checking against INT_MAX/10
 * so we never need a 64-bit intermediate.
 */
class Solution2 {
public:
    int myAtoi(string s) {
        int i = 0, n = s.size(), sign = 1, result = 0;

        while (i < n && s[i] == ' ') i++;
        if (i < n && (s[i] == '+' || s[i] == '-'))
            sign = (s[i++] == '-') ? -1 : 1;

        while (i < n && isdigit(s[i])) {
            int d = s[i++] - '0';
            // Check overflow: result > INT_MAX/10, or result==INT_MAX/10 and d>7
            if (result > INT_MAX / 10 || (result == INT_MAX / 10 && d > 7))
                return sign == 1 ? INT_MAX : INT_MIN;
            result = result * 10 + d;
        }
        return sign * result;
    }
};

/*
 * APPROACH 3: DFA / STATE MACHINE
 * Time: O(n), Space: O(1)
 *
 * Models the problem as a finite automaton with states:
 * START → SIGN → NUMBER → END
 * Clean separation of concerns; avoids nested conditions.
 */
class Solution3 {
    enum State { START, SIGN, NUMBER, END };
public:
    int myAtoi(string s) {
        State state = START;
        long long result = 0;
        int sign = 1;

        for (char c : s) {
            switch (state) {
                case START:
                    if (c == ' ')                 break;
                    if (c == '+' || c == '-')     { sign = (c=='-')?-1:1; state=SIGN; break; }
                    if (isdigit(c))               { result = c-'0'; state=NUMBER; break; }
                    state = END; break;

                case SIGN:
                    if (isdigit(c)) { result = c-'0'; state=NUMBER; break; }
                    state = END; break;

                case NUMBER:
                    if (isdigit(c)) {
                        result = result*10 + (c-'0');
                        if (result*sign >  INT_MAX) return INT_MAX;
                        if (result*sign <  INT_MIN) return INT_MIN;
                        break;
                    }
                    state = END; break;

                case END: break;
            }
        }
        return (int)(result * sign);
    }
};

/*
 * APPROACH 4: REGEX-LIKE MANUAL PARSE (explicit trim + sign + digits)
 * Time: O(n), Space: O(1)
 *
 * Uses std::find_first_not_of for whitespace trimming,
 * then reads sign and digits manually.
 */
class Solution4 {
public:
    int myAtoi(string s) {
        // Trim leading spaces
        size_t start = s.find_first_not_of(' ');
        if (start == string::npos) return 0;
        s = s.substr(start);

        int sign = 1, i = 0;
        if (!s.empty() && (s[0]=='+' || s[0]=='-'))
            sign = (s[i++]=='-') ? -1 : 1;

        long long res = 0;
        while (i < (int)s.size() && isdigit(s[i])) {
            res = res * 10 + (s[i++] - '0');
            if (res * sign >  INT_MAX) return INT_MAX;
            if (res * sign <  INT_MIN) return INT_MIN;
        }
        return (int)(res * sign);
    }
};

/*
 * APPROACH 5: USING sscanf / strtol (library)
 * Time: O(n), Space: O(1)
 *
 * Delegates to the C standard library.
 * Not allowed in an interview, but shows awareness.
 */
class Solution5 {
public:
    int myAtoi(string s) {
        long long val = 0;
        // Skip whitespace, read optional sign + digits
        const char* p = s.c_str();
        while (*p == ' ') p++;
        char* end;
        val = strtoll(p, &end, 10);
        if (val >  INT_MAX) return INT_MAX;
        if (val <  INT_MIN) return INT_MIN;
        return (int)val;
    }
};

void runTests() {
    Solution2 sol;
    struct TC { string s; int expected; };
    vector<TC> tests = {
        {"42",              42},
        {"   -42",         -42},
        {"4193 with words", 4193},
        {"words and 987",   0},
        {"-91283472332",    INT_MIN},
        {"91283472332",     INT_MAX},
        {"+-12",            0},
        {"",                0},
        {"  +  413",        0},
    };
    for (auto& tc : tests) {
        int got = sol.myAtoi(tc.s);
        cout << "\"" << tc.s << "\" → " << got
             << (got==tc.expected?" ✓":" ✗ (expected "+to_string(tc.expected)+")") << "\n";
    }
}

int main() {
    runTests();
    return 0;
}

// Made with Bob
