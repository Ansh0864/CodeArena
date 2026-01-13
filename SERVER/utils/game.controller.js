const { generateFromGroq } = require("./gemini.services");
const { bugHunterPrompt, rapidDuelPrompt } = require("./promptTemplates");

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

/* -----------------------
   ✅ Export plain functions for sockets
------------------------ */
exports.generateRapidDuel = generateRapidDuel;
exports.generateBugHunter = generateBugHunter;
