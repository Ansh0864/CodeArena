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
