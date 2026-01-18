const Match = require("../models/Match");
const User = require("../models/User");
const {
  generateRapidDuel,
  generateBugHunter,
  generateAlgorithmAnalysis,
  generateCodeDuel
} = require("../utils/game.controller");
const { executeCode } = require('../utils/piston');

const queues = {
  rapidDuel: [],
  bughunter: [],
  codeDuel: [],
  algorithmAnalysis: []
};

const activeMatches = new Map();
const processingUsers = new Set();

/* ================== HELPER UTILITIES ================== */

function getUserId(socket) {
  return socket.request.user?._id?.toString() || socket.request.session?.passport?.user?.toString() || null;
}

function createRoomId(mode) {
  return `${mode}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function getQuestions(mode) {
  if (mode === "rapidDuel") return await generateRapidDuel();
  if (mode === "bughunter") return await generateBugHunter();
  if (mode === "algorithmAnalysis") return await generateAlgorithmAnalysis(5);
  if (mode === "codeDuel") {
    const problem = await generateCodeDuel("medium");
    return [problem];
  }
  return [];
}

/**
 * 🏆 COMPUTE WINNER LOGIC
 * Determines winner based on Game Mode.
 * Code Duel: 1. Most Test Cases Passed, 2. Fastest Time.
 */
function computeWinner(state) {
  const [p1, p2] = state.players;
  const s1 = state.score[p1];
  const s2 = state.score[p2];

  // --- MCQ MODES ---
  if (state.mode !== "codeDuel") {
    if (s1.correct > s2.correct) return p1;
    if (s2.correct > s1.correct) return p2;
    if (s1.finishedAt && s2.finishedAt) {
      return s1.finishedAt < s2.finishedAt ? p1 : p2;
    }
    return null;
  }

  // --- CODE DUEL MODE ---
  const p1Passed = s1.passedCases || 0;
  const p2Passed = s2.passedCases || 0;

  // 1. Accuracy First
  if (p1Passed > p2Passed) return p1;
  if (p2Passed > p1Passed) return p2;

  // 2. If Accuracy is tied (even if both 0), check who submitted first
  // Only compare if both actually submitted
  if (s1.submitted && s2.submitted) {
    if (s1.finishedAt < s2.finishedAt) return p1;
    if (s2.finishedAt < s1.finishedAt) return p2;
  }

  return null; // Absolute draw
}

/**
 * 🏁 FINALIZE MATCH
 * Updates DB, Rankings, and sends Scorecard to Frontend.
 */
async function finalizeMatch(io, roomId, state, winnerId, resultType) {
  if (!state) return;

  const endTime = new Date();
  const duration = Math.floor((endTime - state.startedAt) / 1000);
  const [p1, p2] = state.players;

  // Prepare scorecard for Frontend
  const matchResultData = {
    winnerId, // Frontend uses this to show "Victory" or "Defeat"
    resultType,
    scores: {
      [p1]: {
        passed: state.score[p1].passedCases || 0,
        total: state.totalTestCases || 0,
        // Calculate relative time from start
        timeTaken: state.score[p1].finishedAt ? Math.floor((state.score[p1].finishedAt - state.startedAt) / 1000) : "N/A"
      },
      [p2]: {
        passed: state.score[p2].passedCases || 0,
        total: state.totalTestCases || 0,
        timeTaken: state.score[p2].finishedAt ? Math.floor((state.score[p2].finishedAt - state.startedAt) / 1000) : "N/A"
      }
    }
  };

  try {
    // 1. Update Match Document
    await Match.findByIdAndUpdate(state.matchId, {
      status: 'completed',
      winner: winnerId || null,
      endTime,
      duration,
      resultType,
      metaData: matchResultData.scores
    });

    // 2. Update User Stats
    for (const pId of state.players) {
      const isWinner = winnerId && pId === winnerId;
      const isDraw = !winnerId; // No winner means it's a draw/timeout

      const update = {
        $inc: { matchesPlayed: 1 },
        $push: { matchHistory: state.matchId }
      };

      if (isWinner) {
        update.$inc.matchesWon = 1;
        update.$inc.rating = 25;
      } else if (isDraw) {
        // No rating change or small +5 for a draw to prevent "Defeat" feel
        update.$inc.matchesDrawn = 1;
        update.$inc.rating = 5;
      } else {
        // This is the actual loser
        update.$inc.matchesLost = 1;
        update.$inc.rating = -15;
      }
      await User.findByIdAndUpdate(pId, update);
    }

    // 3. Broadcast Final Scorecard
    io.to(roomId).emit("match:result", matchResultData);

    // Cleanup
    activeMatches.delete(roomId);
  } catch (err) {
    console.error("CRITICAL: Error finalizing match:", err);
  }
}

/* ================== MAIN SOCKET SETUP ================== */

module.exports = function setUpMatchMaking(io) {
  io.on("connection", (socket) => {
    const userId = getUserId(socket);
    console.log("New connection attempt. UserID found:", userId);
    if (!userId) {
      socket.emit("match:error", { message: "Login Required" });
      socket.disconnect();
      return;
    }

    // --- MATCH FINDING ---
    // --- MATCH FINDING (PRO-LOGGING VERSION) ---
    socket.on("match:find", async ({ mode }) => {
      console.log(`📡 [EVENT] match:find received for mode: ${mode} from User: ${userId}`);

      try {
        if (!queues[mode]) {
          console.error(`❌ Invalid mode requested: ${mode}`);
          return socket.emit("match:error", { message: "Invalid Mode" });
        }

        // Remove old entries of this SPECIFIC socket to avoid ghosting
        queues[mode] = queues[mode].filter((p) => p.socket.id !== socket.id);

        // Find an opponent (For testing: allow same userId if socket.id is different)
        // In production, change to: p.userId !== userId
        const opponentIndex = queues[mode].findIndex(p => p.socket.id !== socket.id);

        if (opponentIndex > -1) {
          console.log(`🔥 Match found! Pairing ${userId} with opponent.`);
          const opponent = queues[mode].splice(opponentIndex, 1)[0];
          const roomId = createRoomId(mode);

          socket.join(roomId);
          opponent.socket.join(roomId);

          const questions = await getQuestions(mode);

          // Sanitize
          const sanitizedQuestions = questions.map(q => {
            if (mode === 'codeDuel') {
              const { testCases, ...publicData } = q;
              return publicData;
            }
            return q;
          });

          const matchDoc = await Match.create({
            mode,
            players: [opponent.userId, userId],
            startTime: new Date(),
          });

          const p1 = opponent.userId.toString();
          const p2 = userId.toString();

          activeMatches.set(roomId, {
            roomId,
            mode,
            matchId: matchDoc._id.toString(),
            players: [p1, p2],
            sockets: [opponent.socket.id, socket.id],
            questions,
            totalTestCases: (mode === 'codeDuel' && questions[0].testCases) ? questions[0].testCases.length : 0,
            startedAt: Date.now(),
            score: {
              [p1]: { correct: 0, answered: 0, passedCases: 0, finishedAt: null, submitted: false },
              [p2]: { correct: 0, answered: 0, passedCases: 0, finishedAt: null, submitted: false },
            },
            answeredMap: { [p1]: new Set(), [p2]: new Set() },
          });

          io.to(roomId).emit("match:found", {
            roomId,
            matchId: matchDoc._id.toString(),
            mode,
            questions: sanitizedQuestions,
            players: [p1, p2],
          });

          console.log(`✅ Match started in room: ${roomId}`);
        } else {
          console.log(`⏳ No opponent found. User ${userId} added to ${mode} queue.`);
          queues[mode].push({ userId, socket });
          socket.emit("match:queued", { mode });
        }
      } catch (e) {
        console.error("🚨 Matchmaking Error:", e);
        socket.emit("match:error", { message: e.message });
      }
    });

    // --- MCQ MODE: ANSWERING ---
    socket.on("match:answer", async ({ roomId, questionIndex, selectedIndex }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      const uid = userId.toString();
      const q = state.questions[questionIndex];

      if (!q || state.answeredMap[uid].has(questionIndex)) return;
      state.answeredMap[uid].add(questionIndex);

      const isCorrect = selectedIndex === q.correctOptionIndex;
      state.score[uid].answered += 1;
      if (isCorrect) state.score[uid].correct += 1;

      socket.emit("match:answerResult", { questionIndex, isCorrect, correctOptionIndex: q.correctOptionIndex });

      if (state.score[uid].answered === state.questions.length && !state.score[uid].finishedAt) {
        state.score[uid].finishedAt = Date.now();
        io.to(roomId).emit("match:progress", { userId: uid, correct: state.score[uid].correct, answered: state.score[uid].answered });
      }

      const [p1, p2] = state.players;
      if (state.score[p1].finishedAt && state.score[p2].finishedAt) {
        const winnerId = computeWinner(state);
        await finalizeMatch(io, roomId, state, winnerId, "firstCorrect");
      }
    });

    // --- CODE DUEL: REAL-TIME SYNC ---
    socket.on("code:sync", ({ roomId, code, language }) => {
      socket.to(roomId).emit("code:opponentUpdate", { code, language });
    });

   function wrapUserCode(language, code, input) {
  /**
   * Cleans the input to extract only the values, 
   * handling both JSON objects and "label = value" strings.
   */
  const getCleanedParams = (rawInput) => {
    let params = [];

    try {
      // 1. If input is a JSON string like '{"text1": "abc", "text2": "def"}'
      if (typeof rawInput === 'string' && rawInput.trim().startsWith('{')) {
        // Replace single quotes with double quotes for valid JSON parsing if necessary
        const validJson = rawInput.replace(/'/g, '"').replace(/,\s*}/, '}');
        const obj = JSON.parse(validJson);
        params = Object.values(obj);
      } 
      // 2. If input is a string like 'text1 = "abc", text2 = "def"'
      else if (typeof rawInput === 'string' && rawInput.includes('=')) {
        params = rawInput.split(',').map(part => {
          const val = part.split('=')[1] ? part.split('=')[1].trim() : part.trim();
          return val;
        });
      }
      // 3. If it's already an array or a single value
      else {
        params = Array.isArray(rawInput) ? rawInput : [rawInput];
      }
    } catch (e) {
      // Fallback: If parsing fails, just use the raw input
      params = [rawInput];
    }
    return params;
  };

  const formatValue = (val, lang) => {
    if (typeof val === 'string') {
      // Don't double-quote if it's already a quoted string from the cleaning step
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        return val;
      }
      return `"${val}"`;
    }
    if (typeof val === 'boolean') {
      if (lang === 'python') return val ? "True" : "False";
      return val.toString();
    }
    if (Array.isArray(val)) {
      const elements = val.map(v => formatValue(v, lang)).join(', ');
      return (lang === 'cpp' || lang === 'java') ? `{${elements}}` : `[${elements}]`;
    }
    return val;
  };

  const lang = language.toLowerCase();
  const cleanedParams = getCleanedParams(input);
  const formattedArgs = cleanedParams.map(p => formatValue(p, lang)).join(', ');

  switch (lang) {
    case 'javascript':
    case 'nodejs':
      // Results in: solve("abcde", "ace")
      return `${code}\nconsole.log(solve(${formattedArgs}));`;

    case 'python':
      return `${code}\nprint(solve(${formattedArgs}))`;

    case 'cpp':
      return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;
${code}
int main() {
    auto result = solve(${formattedArgs.replace(/\[/g, '{').replace(/\]/g, '}')});
    cout << result << endl;
    return 0;
}`;

    case 'java':
      return `
import java.util.*;
public class Main {
    ${code}
    public static void main(String[] args) {
        Main instance = new Main();
        System.out.println(instance.solve(${formattedArgs.replace(/\[/g, '{').replace(/\]/g, '}')}));
    }
}
`;
    default:
      return code;
  }
}

    // --- CODE DUEL: RUN (EXAMPLES ONLY) ---
    // User debugging their code. No changes needed here.
    socket.on("code:run", async ({ roomId, code, language }) => {
      if (processingUsers.has(userId)) return;

      const state = activeMatches.get(roomId);
      if (!state || state.mode !== "codeDuel") return;

      processingUsers.add(userId);
      const examples = state.questions[0].examples;
      const results = [];

      for (const ex of examples) {
        try {
          const wrappedCode = wrapUserCode(language, code, ex.input);
          const result = await executeCode(language, wrappedCode);

          const stdout = result.run.stdout.trim();
          const stderr = result.run.stderr.trim();

          if (stderr) {
            results.push({
              input: ex.input,
              expected: ex.output.toString().trim(),
              actual: "",
              error: stderr,
              status: "error"
            });
          } else {
            results.push({
              input: ex.input,
              expected: ex.output.toString().trim(),
              actual: stdout,
              error: "",
              status: (stdout === ex.output.toString().trim()) ? "passed" : "failed"
            });
          }
        } catch (err) {
          results.push({ status: "error", error: "Piston API Error" });
        }
      }

      processingUsers.delete(userId);
      socket.emit("code:runResult", { results });
    });

    // --- CODE DUEL: SUBMIT (RANKING SYSTEM) ---
    // 🔴 CRITICAL UPDATE: Fuzzy Logic & Leaderboard System
    socket.on("code:submit", async ({ roomId, code, language }) => {
      const uid = userId.toString();

      // Prevent double submission
      const state = activeMatches.get(roomId);
      if (!state || state.mode !== "codeDuel") return;
      if (state.score[uid].submitted) return; // Ignore clicks if already submitted

      if (processingUsers.has(userId)) return;
      processingUsers.add(userId);

      socket.emit("code:judging", { message: "Judging solution against all test cases..." });

      const testCases = state.questions[0].testCases;
      let passedCount = 0;
      let isCompilationError = false;

      // 1. ITERATE ALL TEST CASES
      for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];

        try {
          const wrappedCode = wrapUserCode(language, code, test.input);
          const result = await executeCode(language, wrappedCode);

          const userOutput = result.run.stdout.trim();
          const stderr = result.run.stderr.trim();

          // Optimization: If the FIRST case has a Syntax Error, it's a 0 score.
          if (i === 0 && stderr) {
            isCompilationError = true;
            break; // Stop running other cases
          }

          // Logic Check (Exact String Match)
          if (!stderr && userOutput === test.output.toString().trim()) {
            passedCount++;
          }
          // We do NOT break on failure. We continue to count passes.

        } catch (err) {
          console.error("Executor Error:", err);
          // If API fails, we just don't count this pass.
        }
      }

      // 2. UPDATE STATE
      state.score[uid].submitted = true;
      state.score[uid].passedCases = isCompilationError ? 0 : passedCount;
      state.score[uid].finishedAt = Date.now();

      processingUsers.delete(userId);

      // 3. NOTIFY USER OF THEIR OWN RESULT
      socket.emit("code:submissionResult", {
        success: true,
        passed: passedCount,
        total: testCases.length,
        message: isCompilationError ? "Compilation Error (0 Passed)" : `Passed ${passedCount}/${testCases.length} cases`
      });

      // 4. NOTIFY OPPONENT (Add Pressure!)
      socket.to(roomId).emit("code:opponentSubmitted", {
        message: "Opponent has submitted their code!"
      });

      // 5. CHECK GAME OVER CONDITION
      const [p1, p2] = state.players;
      if (state.score[p1].submitted && state.score[p2].submitted) {
        // Both done? Calculate Winner.
        const winnerId = computeWinner(state);
        await finalizeMatch(io, roomId, state, winnerId, "ranking");
      }
    });

    // --- TIMEOUT HANDLER ---
    socket.on("match:timeout", async ({ roomId }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      // If timeout happens, we treat current 'passedCases' as final. 
      // If a user hasn't submitted yet, their passedCases is 0.
      const winnerId = computeWinner(state);
      await finalizeMatch(io, roomId, state, winnerId, "timeout");
    });

    // --- DISCONNECT / CANCEL ---
    socket.on("match:cancel", ({ mode }) => {
      queues[mode] = queues[mode].filter((p) => p.userId !== userId);
      socket.emit("match:cancelled", { mode });
    });
    // --- BACKEND ADDITION (matchMaking.js) ---

    // --- BACKEND: PERFECTED ABANDON LOGIC ---
    socket.on("match:abandon", async ({ roomId }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      const abandonerId = userId.toString();
      const winnerId = state.players.find(id => id !== abandonerId);

      // We pass 'abandon' as resultType
      await finalizeMatch(io, roomId, state, winnerId, "abandon");
    });

    socket.on("disconnect", async () => {
      // Clear from queues
      Object.keys(queues).forEach(m => queues[m] = queues[m].filter(p => p.userId !== userId));

      // Clear from active matches
      for (const [roomId, state] of activeMatches.entries()) {
        if (state.sockets.includes(socket.id)) {
          const opponentId = state.players.find(p => p !== userId.toString());
          await finalizeMatch(io, roomId, state, opponentId, "disconnect");
          break;
        }
      }
    });

    // --- DEBUGGING UTILS ---
    socket.on("debug:getProblem", async ({ difficulty }) => {
      try {
        console.log(`DEBUG: Generating ${difficulty} problem...`);
        const problem = await generateCodeDuel(difficulty || "medium");
        const debugRoom = "DEBUG_ROOM";
        socket.join(debugRoom);

        activeMatches.set(debugRoom, {
          roomId: debugRoom,
          mode: "codeDuel",
          players: [userId.toString()],
          questions: [problem],
          totalTestCases: problem.testCases ? problem.testCases.length : 0,
          score: { [userId.toString()]: { correct: 0, answered: 0, passedCases: 0, submitted: false } },
          sockets: [socket.id]
        });

        socket.emit("debug:problemLoaded", { roomId: debugRoom, problem: problem });
      } catch (err) {
        socket.emit("match:error", { message: "Groq Error: " + err.message });
      }
    });
  });
};