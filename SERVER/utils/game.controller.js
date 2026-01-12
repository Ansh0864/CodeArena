const {generateFromGroq}= require('./gemini.services')

const {bugHunterPrompt, rapidDuelPrompt}= require('./promptTemplates')

function extractJSON(text) {
  try {
    const cleaned = text
      .replace(/```json|```/g, "")
      .trim();


    try {
      return JSON.parse(cleaned);
    } catch {}


    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }

    
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }

    throw new Error("No valid JSON found");
  } catch (err) {
    console.error(" JSON PARSE FAILED");
    console.error(text);
    throw err;
  }
}



exports.bugHunterQuestions= async(req,res)=>{
    try{
        const raw= await generateFromGroq(bugHunterPrompt())
        const question= extractJSON(raw);
        res.json({
            mode: "Bug Hunter",
            question
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ error: "Failed to generate Bug Hunter question" });
    }
}

exports.rapidDuelQuestions= async(req,res)=>{
    try{
        const raw= await generateFromGroq(rapidDuelPrompt())
        const question= extractJSON(raw);
        res.json({
            mode: "Rapid Duel",
            question
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ error: "Failed to generate Rapid Duel question" });
    }
}