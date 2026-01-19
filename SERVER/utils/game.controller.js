const { generateFromGroq } = require("./gemini.services");
const {
  bugHunterPrompt,
  rapidDuelPrompt,
  algorithmAnalysisPrompt,
} = require("./promptTemplates");


function extractJSONArray(text) {
  const cleaned = (text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("[");
  if (start === -1) throw new Error("No JSON array start '[' found");

  let depth = 0;
  let end = -1;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) throw new Error("No complete JSON array found");

  const candidate = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(candidate);

  if (!Array.isArray(parsed)) throw new Error("Parsed JSON is not an array");
  return parsed;
}

function normalizeAndValidate(mode, arr) {
  if (!Array.isArray(arr)) throw new Error(`${mode}: JSON is not an array`);

  for (let i = 0; i < arr.length; i++) {
    const q = arr[i];
    if (!q || typeof q !== "object") {
      throw new Error(`${mode}: Invalid question object at index ${i}`);
    }

  
    if (mode === "bughunter") {
      if (typeof q.code !== "string" || !q.code.trim()) {
        throw new Error("BugHunter: missing 'code'");
      }

      
      const bc =
        typeof q.bugCount === "number"
          ? q.bugCount
          : typeof q.correctBugCount === "number"
          ? q.correctBugCount
          : typeof q.answer === "number"
          ? q.answer
          : null;

      if (typeof bc !== "number" || Number.isNaN(bc)) {
        throw new Error("BugHunter: missing numeric 'bugCount'");
      }

      q.bugCount = bc;

      
      if (typeof q.question !== "string" || !q.question.trim()) {
        q.question = "How many logical bugs are in this code?";
      }

      if (q.difficulty && typeof q.difficulty !== "string") delete q.difficulty;

  
      continue;
    }

   
    if (mode === "rapidDuel") {
      if (typeof q.question !== "string" || !q.question.trim()) {
        throw new Error("RapidDuel: missing 'question'");
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error("RapidDuel: 'options' must be array of 4");
      }
      if (typeof q.correctOptionIndex !== "number") {
        throw new Error("RapidDuel: missing correctOptionIndex");
      }
      continue;
    }

 
    if (mode === "algorithmAnalysis") {
      if (typeof q.problemStatement !== "string" || !q.problemStatement.trim()) {
        throw new Error("AlgorithmAnalysis: missing 'problemStatement'");
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error("AlgorithmAnalysis: 'options' must be array of 4");
      }

  
      q.options = q.options.map((opt, idx) => {
        if (typeof opt === "string") {
          return { description: opt };
        }
        if (!opt || typeof opt !== "object") {
          throw new Error(`AlgorithmAnalysis: invalid option at index ${idx}`);
        }

    
        const desc =
          opt.description ||
          opt.approach ||
          opt.summary ||
          opt.explanation ||
          opt.text;

        if (!desc || typeof desc !== "string") {
          throw new Error("AlgorithmAnalysis option missing 'approach/description'");
        }

        return { description: desc.trim() };
      });

      if (typeof q.correctOptionIndex !== "number") {
        throw new Error("AlgorithmAnalysis: missing correctOptionIndex");
      }
      continue;
    }

  
    if (!Array.isArray(q.options)) throw new Error("Invalid 'options' - must be array");
    if (q.options.length !== 4) throw new Error("Each question must have exactly 4 options");
    if (typeof q.correctOptionIndex !== "number") throw new Error("Missing correctOptionIndex");
  }

  return arr;
}

async function generateRapidDuel(count = 5, rating = 1200) {
  const raw = await generateFromGroq(rapidDuelPrompt(count, rating));
  const parsed = extractJSONArray(raw);
  return normalizeAndValidate("rapidDuel", parsed);
}

async function generateBugHunter(count = 5, rating = 1200) {
  const raw = await generateFromGroq(bugHunterPrompt(count, rating));
  const parsed = extractJSONArray(raw);
  return normalizeAndValidate("bughunter", parsed);
}

async function generateAlgorithmAnalysis(count = 5, rating = 1200) {
  const raw = await generateFromGroq(algorithmAnalysisPrompt(count, rating));
  const parsed = extractJSONArray(raw);
  return normalizeAndValidate("algorithmAnalysis", parsed);
}


exports.bugHunterQuestions = async (req, res) => {
  try {
    const rating = Number(req.query.rating || 1200);
    const questions = await generateBugHunter(5, rating);
    res.json({ mode: "Bug Hunter", question: questions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message || "Bug Hunter generation failed" });
  }
};

exports.rapidDuelQuestions = async (req, res) => {
  try {
    const rating = Number(req.query.rating || 1200);
    const questions = await generateRapidDuel(5, rating);
    res.json({ mode: "Rapid Duel", question: questions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message || "Rapid Duel generation failed" });
  }
};

exports.algorithmAnalysisQuestions = async (req, res) => {
  try {
    const rating = Number(req.query.rating || 1200);
    const questions = await generateAlgorithmAnalysis(5, rating);
    res.json({ mode: "Algorithm Analysis", question: questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message || "Algorithm Analysis generation failed",
    });
  }
};


exports.generateRapidDuel = generateRapidDuel;
exports.generateBugHunter = generateBugHunter;
exports.generateAlgorithmAnalysis = generateAlgorithmAnalysis;
