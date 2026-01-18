exports.bugHunterPrompt = (count = 5) => `
Generate ${count} DIFFERENT Bug Hunter multiple-choice questions.

STRICT RULES:
- Use JavaScript-like or pseudo-code
- Each code snippet must contain EXACTLY ONE logical bug
- No syntax errors
- Under 15 lines
- EXACTLY 4 options per question
- EXACTLY ONE correct option
- Wrong options must be plausible
- No markdown
- No backticks
- No explanations
- All questions must be UNIQUE

Respond ONLY in VALID JSON as an ARRAY.
DO NOT include any extra text.

JSON FORMAT:
[
  {
    "id": "unique_bug_id",
    "title": "short title",
    "code": "line1\\nline2\\nline3",
    "question": "What is wrong with this code?",
    "options": [
      "option A",
      "option B",
      "option C",
      "option D"
    ],
    "correctOptionIndex": 0,
    "bugType": "loop | condition | variable | logic",
    "difficulty": "easy | medium"
  }
]
`;



exports.rapidDuelPrompt = (count = 5) => `
Generate ${count} DIFFERENT Rapid Duel multiple-choice programming questions.

STRICT RULES:
- Language independent
- Focus on logic, output prediction, or algorithm understanding
- No full coding
- Each question must be solvable in under 2 minutes
- EXACTLY 4 options per question
- EXACTLY ONE correct option
- Options must be clearly distinguishable
- No markdown
- No backticks
- No explanations
- No hints
- All questions must be UNIQUE

Respond ONLY in VALID JSON as an ARRAY.
DO NOT include any extra text.

JSON FORMAT:
[
  {
    "id": "unique_question_id",
    "question": "clear and concise question text",
    "options": ["option A", "option B", "option C", "option D"],
    "correctOptionIndex": 0,
    "difficulty": "easy | medium",
    "category": "arrays | strings | loops | math | logic | complexity"
  }
]
`;

exports.algorithmAnalysisPrompt = (count = 5) => `
Generate ${count} DIFFERENT Algorithm Analysis multiple-choice questions.

GAME CONTEXT:
- Player is given a coding problem statement
- A MIN and MAX allowed time complexity is provided
- Options describe DIFFERENT approaches (not raw code)
- Player must choose the MOST OPTIMAL approach
- Optimal means:
  1. Time complexity within allowed range
  2. Lowest possible time complexity
  3. Reasonable space complexity

STRICT RULES:
- Medium difficulty only
- Language independent
- No full code implementations
- Approaches must be clearly explained in plain text
- EXACTLY 4 options per question
- EXACTLY ONE correct option
- Wrong options must be realistic but suboptimal
- Each option must mention time AND space complexity
- No markdown
- No backticks
- No explanations outside options
- No hints
- All questions must be UNIQUE

Respond ONLY in VALID JSON as an ARRAY.
DO NOT include any extra text.

JSON FORMAT:
[
  {
    "id": "unique_algo_id",
    "title": "short problem title",
    "problemStatement": "clear problem description",
    "constraints": {
      "minTimeComplexity": "e.g. O(n)",
      "maxTimeComplexity": "e.g. O(n log n)"
    },
    "options": [
      {
        "approach": "brief explanation of approach",
        "timeComplexity": "O(...) ",
        "spaceComplexity": "O(...)"
      },
      {
        "approach": "brief explanation of approach",
        "timeComplexity": "O(...) ",
        "spaceComplexity": "O(...)"
      },
      {
        "approach": "brief explanation of approach",
        "timeComplexity": "O(...) ",
        "spaceComplexity": "O(...)"
      },
      {
        "approach": "brief explanation of approach",
        "timeComplexity": "O(...) ",
        "spaceComplexity": "O(...)"
      }
    ],
    "correctOptionIndex": 0,
    "difficulty": "medium",
    "category": "arrays | strings | graphs | recursion | searching | sorting | dp"
  }
]
`;
exports.codeDuelPrompt = (difficulty = "easy") => `
Generate ONE highly detailed competitive programming problem for a Live Coding Duel.

STRICT ACCURACY RULES:
1. TRIPLE-CHECK MATH: You must manually calculate the output for every Example and Test Case. Do not guess. If the problem is "Max Product", actually multiply the numbers to ensure the output is correct.
2. CONSISTENCY: The 'output' in your JSON must exactly match what a correct implementation of your problem would produce.
3. FUNCTION NAME: Every starter code MUST use the function name 'solve'. For C++/Java, use a class named 'Solution' with a method named 'solve'.
4. EDGE CASES: Ensure test cases include boundaries (min/max constraints).

CRITICAL LOGIC RULES:
1. ARGUMENT MATCHING: Every test case MUST provide all arguments defined in the function signature. If the signature is 'solve(nums, k)', every test case MUST have a 'nums' and a 'k'.
2. MATH VERIFICATION: You MUST execute a mental trace of the 'solve' function on every test case before writing the output. If the problem is "Sum of size at least k", ensure the output is not just the sum of the whole array unless that is truly the maximum.
3. CONSTRAINTS: Test cases must strictly follow the constraints. If constraints say k >= 1, do not provide an empty array.
4. STARTER CODE: Use 'solve' as the function name. For C++/Java, use a class 'Solution' with a method 'solve'.
5. The problems should not be only array related with k it is just an example cover a wide range of topics examples - array , backtracking , divide n conquer , stacks , queues , dynamic programming , heaps , hash maps , graphs . Dont pick complex problems like trees or binary trees And pick topics randomly dont repeat similar ones 
6. Problems should not only be related to number/integer returns but may return arrays , booleans , characters or strings anything . 
7. Ensure that each problem is solvable in the start code itself and doesnt require any explicit other class or function as a helper

STRICT RULES:
- The problem must be solvable in C++, Java, Python, and JavaScript.
- Provide constraints for the arguments/inputs.
- Provide a starter code function signature for all 4 languages.
- Provide EXACTLY 3 examples.
- Provide atmost 50 high-quality test cases .
- Respond ONLY in VALID JSON. No markdown, no backticks.

JSON FORMAT:
{
  "id": "unique_duel_id",
  "title": "Short Descriptive Title",
  "difficulty": "${difficulty}",
  "tags": ["tag1"],
  "problemStatement": "Clear description of the task",
  "constraints": ["1 <= nums.length <= 10^4"],
  "starterCode": {
    "javascript": "function solve(Arguments(array,variables)) {\\n  // code here\\n}",
    "python": "def solve(Arguments(array,variables)):\\n    pass",
    "cpp": "class Solution {\\npublic:\\n    int solve(Arguments(array,variables)) {\\n\\n    }\\n};",
    "java": "class Solution {\\n    public int solve(Arguments(array,variables)) {\\n\\n    }\\n}"
  },
  "examples": [
    { "input": "...", "output": "...", "explanation": "..." }
  ],
  "testCases": [
    { "input": "...", "output": "..." }
  ]
}
`;

exports.auditorPrompt = (problemStatement, examples, testCases) => `
ACT AS A DETERMINISTIC CODE EXECUTION ENGINE.
I will provide a problem statement and a set of inputs. You must calculate the EXACT mathematical outputs.

PROBLEM:
${problemStatement}

INPUTS TO PROCESS:
Examples: ${JSON.stringify(examples)}
Test Cases: ${JSON.stringify(testCases)}

STRICT RULES:
1. NO PROSE: Return ONLY a valid JSON object.
2. NO HALLUCINATION: Trace the logic step-by-step. If it's a "Max Sum", find the actual maximum.
3. FORMAT: Maintain the exact same number of test cases and examples provided in the input.
4. TYPE PERSISTENCE: If the output should be a number, return a number. If a string, return a string.

JSON OUTPUT FORMAT:
{
  "examples": [ { "input": "...", "output": "CORRECT_OUTPUT", "explanation": "..." } ],
  "testCases": [ { "input": "...", "output": "CORRECT_OUTPUT" } ]
}
`;