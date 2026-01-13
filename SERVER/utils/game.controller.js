const {generateFromGroq}= require('./gemini.services')

const {bugHunterPrompt, rapidDuelPrompt , algorithmAnalysisPrompt}= require('./promptTemplates')
function normalizeValue(value) {
  if (typeof value === "string") {
    return value
      .replace(/\\n/g, "\n")     // escaped newlines
      .replace(/\n+/g, "\n")     // multiple newlines
      .replace(/\s+/g, " ")      // extra spaces
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (typeof value === "object" && value !== null) {
    const cleanedObj = {};
    for (const key in value) {
      cleanedObj[key] = normalizeValue(value[key]);
    }
    return cleanedObj;
  }

  return value;
}
function extractJSON(text) {
  try {
    const cleaned = text
      .replace(/```json|```/gi, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON detected");
      parsed = JSON.parse(match[0]);
    }

    return normalizeValue(parsed);
  } catch (err) {
    console.error("❌ JSON PARSE FAILED");
    console.error(text);
    throw err;
  }
}



exports.bugHunterQuestions = async (req, res) => {
  try {
    const raw = await generateFromGroq(bugHunterPrompt());
    const questions = extractJSON(raw);

    res.json({
      success: true,
      mode: "Bug Hunter",
      count: questions.length,
      questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Bug Hunter generation failed" });
  }
};

exports.rapidDuelQuestions = async (req, res) => {
  try {
    const raw = await generateFromGroq(rapidDuelPrompt());
    const questions = extractJSON(raw);

    res.json({
      success: true,
      mode: "Rapid Duel",
      count: questions.length,
      questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Rapid Duel generation failed" });
  }
};

exports.algorithmAnalysisQuestions = async (req, res) => {
  try {
    const raw = await generateFromGroq(algorithmAnalysisPrompt());
    const questions = extractJSON(raw);

    res.json({
      success: true,
      mode: "Algorithm Analysis",
      count: questions.length,
      questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Algorithm Analysis generation failed"
    });
  }
};
