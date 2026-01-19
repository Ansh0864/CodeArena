function difficultyFromRating(rating = 1200) {
  if (rating >= 1 && rating <= 700) return "easy";
  if (rating >= 701 && rating <= 1500) return "medium";
  return "hard";
}

function normalizeDifficulty(d) {
  if (d === "easy" || d === "medium" || d === "hard") return d;
  return "medium";
}


exports.bugHunterPrompt = (count = 5, difficultyOrRating = 1200) => {
  const difficulty =
    typeof difficultyOrRating === "number"
      ? difficultyFromRating(difficultyOrRating)
      : normalizeDifficulty(difficultyOrRating);

  return `
Generate ${count} DIFFERENT Bug Hunt questions.

GAME MECHANIC:
- You will output a code snippet containing MULTIPLE LOGICAL BUGS.
- The player's answer is: "How many bugs are in this code?"
- The frontend will let player input a number (like 1..5).
- The answer is correct ONLY if the input number equals the true bug count.

DIFFICULTY: ${difficulty}

DIFFICULTY RULES:
- easy: 1 to 2 obvious logic bugs, simple code (6-10 lines)
- medium: 2 to 3 bugs, includes edge cases/off-by-one, moderate code (8-13 lines)
- hard: 3 to 5 subtle bugs, async misuse, mutation side effects, boundary issues (10-15 lines)

STRICT RULES:
- Use JavaScript-like or pseudo-code
- NO syntax errors
- Under 15 lines
- NO markdown
- NO backticks
- NO explanations outside JSON
- All questions must be UNIQUE
- Bugs MUST be LOGICAL (not missing semicolons, not invalid syntax)
- Bug count MUST be between 1 and 5 inclusive

Respond ONLY in VALID JSON as an ARRAY.
DO NOT include any extra text.

JSON FORMAT:
[
  {
    "id": "unique_bug_count_id",
    "title": "short title",
    "code": "line1\\nline2\\nline3",
    "question": "How many logical bugs are in this code?",
    "bugCount": 3,
    "difficulty": "${difficulty}",
    "category": "arrays | strings | loops | async | objects",
    "bugHints": [
      "short hint 1",
      "short hint 2",
      "short hint 3"
    ]
  }
]
`;
};

exports.rapidDuelPrompt = (count = 5, difficultyOrRating = 1200) => {
  const difficulty =
    typeof difficultyOrRating === "number"
      ? difficultyFromRating(difficultyOrRating)
      : normalizeDifficulty(difficultyOrRating);

  return `
Generate ${count} DIFFERENT Rapid Duel multiple-choice programming questions.

DIFFICULTY: ${difficulty}

DIFFICULTY RULES:
- easy: basic outputs, simple loops, basic arrays/strings, easy math
- medium: slightly tricky logic, complexity basics, edge cases, common pitfalls
- hard: tricky edge cases, nested logic, complexity tradeoffs, tricky outputs

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
    "options": ["option A","option B","option C","option D"],
    "correctOptionIndex": 0,
    "difficulty": "${difficulty}",
    "category": "arrays | strings | loops | math | logic | complexity"
  }
]
`;
};


exports.algorithmAnalysisPrompt = (count = 5, difficultyOrRating = 1200) => {
  const difficulty =
    typeof difficultyOrRating === "number"
      ? difficultyFromRating(difficultyOrRating)
      : normalizeDifficulty(difficultyOrRating);

  return `
Generate ${count} DIFFERENT Algorithm Analysis multiple-choice questions.

DIFFICULTY: ${difficulty}

GAME CONTEXT:
- Player is given a coding problem statement
- Options describe DIFFERENT solution ideas
- Player must choose the MOST OPTIMAL option

IMPORTANT:
- Each option must be SHORT (1–2 lines max)
- Do NOT include the word "approach" anywhere in the option text
- Options must be plain language, not code
- EXACTLY 4 options per question
- EXACTLY ONE correct option

STRICT RULES:
- Language independent
- No full code implementations
- No markdown
- No backticks
- No explanations outside JSON
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
  { "title": "Two pointers after sort", "description": "Sort + scan from both ends to find pairs quickly." },
  { "title": "Hash set lookup", "description": "Store seen values and check complements in O(1) average." },
  { "title": "Brute force", "description": "Try all pairs; simple but slow for large inputs." },
  { "title": "Divide & conquer", "description": "Split array and merge results; adds overhead here." }
]

    "correctOptionIndex": 0,
    "difficulty": "${difficulty}",
    "category": "arrays | strings | graphs | recursion | searching | sorting | dp"
  }
]
`;
};


exports.difficultyFromRating = difficultyFromRating;
