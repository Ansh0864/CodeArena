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

