const { generateFromGroq } = require("./gemini.services");
const { bugHunterPrompt, rapidDuelPrompt ,algorithmAnalysisPrompt,codeDuelPrompt ,auditorPrompt} = require("./promptTemplates");

// Helper to extract a single Object (used for Code Duel)
function extractJSONObject(text) {
  const cleaned = (text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  if (start === -1) throw new Error("No JSON object start '{' found");

  let depth = 0;
  let end = -1;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) throw new Error("No complete JSON object found");
  const candidate = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(candidate);

  // Validation for Code Duel structure
  if (!parsed.problemStatement || !Array.isArray(parsed.testCases)) {
    throw new Error("Invalid Code Duel object structure");
  }

  return parsed;
}

// Generic extractor that doesn't enforce "Code Duel" fields
function extractRawJSON(text) {
  const cleaned = (text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  if (start === -1) throw new Error("No JSON object start '{' found");

  let depth = 0;
  let end = -1;
  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) throw new Error("No complete JSON object found");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function extractJSONArray(text) {
  const cleaned = (text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Find first JSON array by bracket counting
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

  // Minimal validation (helps catch garbage early)
  if (!Array.isArray(parsed)) throw new Error("Parsed JSON is not an array");

  for (const q of parsed) {
    if (!q || typeof q !== "object") throw new Error("Invalid question object");
    if (!Array.isArray(q.options)) throw new Error("Invalid 'options' - must be array");
    if (q.options.length !== 4) throw new Error("Each question must have exactly 4 options");
    if (typeof q.correctOptionIndex !== "number") throw new Error("Missing correctOptionIndex");
  }

  return parsed;
}


/* -----------------------
   ✅ Plain functions (for socket)
------------------------ */
async function generateRapidDuel(count = 5) {
  const raw = await generateFromGroq(rapidDuelPrompt(count));
  const parsed = extractJSONArray(raw);
  if (!Array.isArray(parsed)) throw new Error("RapidDuel: JSON is not an array");
  return parsed;
}

async function generateBugHunter(count = 5) {
  const raw = await generateFromGroq(bugHunterPrompt(count));
  const parsed = extractJSONArray(raw);
  if (!Array.isArray(parsed)) throw new Error("BugHunter: JSON is not an array");
  return parsed;
}

async function generateAlgorithmAnalysis(count = 5) {
  const raw = await generateFromGroq(algorithmAnalysisPrompt(count));
  const parsed = extractJSONArray(raw);

  if (!Array.isArray(parsed)) throw new Error("AlgorithmAnalysis: JSON is not an array");
  return parsed;
}
async function generateCodeDuel(difficulty = "easy") {
    try {
        // PASS 1: Generate the Problem Structure (The Creator)
        const creatorRaw = await generateFromGroq(codeDuelPrompt(difficulty));
        const problem = extractJSONObject(creatorRaw);

        if (!problem || !problem.testCases) {
            throw new Error("Creator failed to generate a valid structure.");
        }
        // PASS 2: Verify the Outputs (The Auditor)
        // We send the problem statement and the UNVERIFIED inputs to the auditor
        const auditorRaw = await generateFromGroq(
            auditorPrompt(
                problem.problemStatement, 
                problem.examples, 
                problem.testCases
            )
        );
        const verifiedData = extractRawJSON(auditorRaw);
        console.log(verifiedData)
        if (verifiedData && verifiedData.testCases) {
            // MERGE: Replace the hallucinated outputs with verified ones
            problem.examples = verifiedData.examples;
            problem.testCases = verifiedData.testCases;
            console.log("✅ Problem verified and outputs corrected.");
        } else {
            console.warn("⚠️ Auditor failed. Falling back to creator outputs (High risk of error).");
        }

        return problem;

    } catch (error) {
        console.error("Double-Pass Generation Error:", error);
        return null;
    }
}



/* -----------------------
   ✅ Express handlers (for routes)
------------------------ */
exports.bugHunterQuestions = async (req, res) => {
  try {
    const questions = await generateBugHunter(5);
    res.json({ mode: "Bug Hunter", question: questions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to generate Bug Hunter question" });
  }
};

exports.rapidDuelQuestions = async (req, res) => {
  try {
    const questions = await generateRapidDuel(5);
    res.json({ mode: "Rapid Duel", question: questions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to generate Rapid Duel question" });
  }
};

exports.algorithmAnalysisQuestions = async (req, res) => {
  try {
    const questions = await generateAlgorithmAnalysis(5);

    res.json({
      success: true,
      mode: "Algorithm Analysis",
      count: questions.length,
      questions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Algorithm Analysis generation failed",
    });
  }
};

exports.codeDuelQuestions = async (req, res) => {
  try {
    const { difficulty } = req.query; // Optional: allow passing ?difficulty=hard
    const problem = await generateCodeDuel(difficulty || "medium");
    
    res.json({ 
      success: true,
      mode: "Code Duel", 
      problem: problem 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate Code Duel problem" 
    });
  }
};

/* -----------------------
   ✅ Export plain functions for sockets
------------------------ */
exports.generateRapidDuel = generateRapidDuel;
exports.generateBugHunter = generateBugHunter;
exports.generateAlgorithmAnalysis = generateAlgorithmAnalysis;
exports.generateCodeDuel = generateCodeDuel;

