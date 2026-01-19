const Match = require("../models/Match");
const User = require("../models/User");

const {
  generateRapidDuel,
  generateBugHunter,
  generateAlgorithmAnalysis,
} = require("../utils/game.controller");

const queues = {
  rapidDuel: [],
  bughunter: [],
  algorithmAnalysis: [],
  complexityDuel: [],
};

const activeMatches = new Map();

function getUserId(socket) {
  return (
    socket.request.user?._id?.toString() ||
    socket.request.session?.passport?.user?.toString() ||
    null
  );
}

function createRoomId(mode) {
  return `${mode}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function difficultyRating(r1 = 1200, r2 = 1200) {
  return Math.round((Number(r1) + Number(r2)) / 2);
}

async function getQuestions(mode, avgRating) {
  if (mode === "rapidDuel") return await generateRapidDuel(5, avgRating);
  if (mode === "bughunter") return await generateBugHunter(5, avgRating);
  if (mode === "complexityDuel") return await generateAlgorithmAnalysis(5, avgRating);
  if (mode === "algorithmAnalysis") return await generateAlgorithmAnalysis(5, avgRating);
  return [];
}

function computeWinner(state) {
  const [p1, p2] = state.players;
  const s1 = state.score[p1];
  const s2 = state.score[p2];

  if (state.abandoned?.leftUserId) {
    const left = state.abandoned.leftUserId;
    const remaining = state.players.find((p) => p !== left) || null;
    return remaining;
  }

  if (s1.correct > s2.correct) return p1;
  if (s2.correct > s1.correct) return p2;

  if (s1.finishedAt && s2.finishedAt) {
    if (s1.finishedAt < s2.finishedAt) return p1;
    if (s2.finishedAt < s1.finishedAt) return p2;
  }

  return null;
}

function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

function eloDelta(ra, rb, resultA, K = 32) {
  const ea = expectedScore(ra, rb);
  return Math.round(K * (resultA - ea));
}

function pickOpponentFromQueue(queue, myRating) {
  const now = Date.now();
  const base = 100;
  const cap = 400;

  let bestIdx = -1;
  let bestDiff = Infinity;

  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    if (!p?.socket || p.socket.disconnected) continue;

    const waitedMs = now - p.joinedAt;
    const expand = Math.min(cap, base + Math.floor(waitedMs / 10000) * 50);

    const diff = Math.abs((p.rating ?? 1200) - (myRating ?? 1200));
    if (diff <= expand && diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  if (bestIdx === -1) return null;
  return queue.splice(bestIdx, 1)[0];
}

async function finalizeMatch(io, roomId, reason = "completed") {
  const state = activeMatches.get(roomId);
  if (!state) return;
  if (state.finalizing) return;
  state.finalizing = true;

  const [p1, p2] = state.players;
  const winnerId = computeWinner(state);

  // Emit result
  io.to(roomId).emit("match:result", {
    winnerId,
    scores: {
      [p1]: state.score[p1],
      [p2]: state.score[p2],
    },
    reason,
  });

  
  try {
    const match = await Match.findById(state.matchId);
    if (match) {
      match.endTime = new Date();
      match.duration = Math.floor((Date.now() - state.startedAt) / 1000);

      if (reason === "abandoned") {
        match.status = "abandoned";
        match.resultType = "disconnect";
        match.winner = winnerId || undefined;
      } else {
        if (winnerId) {
          match.status = "completed";
          match.resultType = "firstCorrect";
          match.winner = winnerId;
        } else {
          match.status = "draw";
          match.resultType = "timeout";
          match.winner = undefined;
        }
      }

      await match.save();
    }
  } catch (e) {
    console.log(" match save error:", e.message);
  }

  
  try {
    const users = await User.find({ _id: { $in: [p1, p2] } }).select("rating");
    const uMap = new Map(users.map((u) => [u._id.toString(), u]));

    const r1 = uMap.get(p1)?.rating ?? 1200;
    const r2 = uMap.get(p2)?.rating ?? 1200;

    let result1 = 0.5, result2 = 0.5;
    if (winnerId === p1) { result1 = 1; result2 = 0; }
    else if (winnerId === p2) { result1 = 0; result2 = 1; }

    const d1 = eloDelta(r1, r2, result1, 32);
    const d2 = eloDelta(r2, r1, result2, 32);

    const updates = [];

    updates.push(
      User.updateOne(
        { _id: p1 },
        {
          $inc: { matchesPlayed: 1 },
          $push: { matchHistory: state.matchId },
          $set: { rating: Math.max(0, r1 + d1) },
        }
      )
    );

    updates.push(
      User.updateOne(
        { _id: p2 },
        {
          $inc: { matchesPlayed: 1 },
          $push: { matchHistory: state.matchId },
          $set: { rating: Math.max(0, r2 + d2) },
        }
      )
    );

    if (winnerId === p1) {
      updates.push(User.updateOne({ _id: p1 }, { $inc: { matchesWon: 1 } }));
      updates.push(User.updateOne({ _id: p2 }, { $inc: { matchesLost: 1 } }));
    } else if (winnerId === p2) {
      updates.push(User.updateOne({ _id: p2 }, { $inc: { matchesWon: 1 } }));
      updates.push(User.updateOne({ _id: p1 }, { $inc: { matchesLost: 1 } }));
    } else {
      updates.push(User.updateOne({ _id: p1 }, { $inc: { matchesDrawn: 1 } }));
      updates.push(User.updateOne({ _id: p2 }, { $inc: { matchesDrawn: 1 } }));
    }

    await Promise.all(updates);

    io.to(roomId).emit("match:ratingUpdate", {
      [p1]: r1 + d1,
      [p2]: r2 + d2,
      delta: { [p1]: d1, [p2]: d2 },
    });
  } catch (e) {
    console.log("rating update error:", e.message);
  }

  activeMatches.delete(roomId);
}

module.exports = function setUpMatchMaking(io) {
  io.on("connection", (socket) => {
    const userId = getUserId(socket);
    console.log("User connected", socket.id, "user:", userId);

    if (!userId) {
      socket.emit("match:error", { message: "Login Required" });
      socket.disconnect();
      return;
    }

    socket.on("match:find", async ({ mode }) => {
      try {
        if (!queues[mode]) {
          socket.emit("match:error", { message: "Invalid Mode" });
          return;
        }

        const me = await User.findById(userId).select("rating");
        if (!me) {
          socket.emit("match:error", { message: "User not found" });
          return;
        }
        const myRating = me.rating ?? 1200;

        queues[mode] = queues[mode].filter(
          (p) => p && p.userId !== userId && p.socket && !p.socket.disconnected
        );

        const opponent = pickOpponentFromQueue(queues[mode], myRating);

        if (opponent && opponent.userId === userId) {
          queues[mode].push({ userId, socket, rating: myRating, joinedAt: Date.now() });
          socket.emit("match:queued", { mode, myRating });
          return;
        }

        if (opponent) {
          const roomId = createRoomId(mode);
          socket.join(roomId);
          opponent.socket.join(roomId);

          const oppDoc = await User.findById(opponent.userId).select("rating");
          const oppRating = oppDoc?.rating ?? opponent.rating ?? 1200;

          const avgRating = difficultyRating(myRating, oppRating);
          const questions = await getQuestions(mode, avgRating);

          if (!Array.isArray(questions) || questions.length === 0) {
            socket.leave(roomId);
            opponent.socket.leave(roomId);
            socket.emit("match:error", { message: "Question generation failed" });
            opponent.socket.emit("match:error", { message: "Question generation failed" });
            return;
          }

          const matchDoc = await Match.create({
            mode,
            players: [opponent.userId, userId],
            startTime: new Date(),
            status: "ongoing",
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
            startedAt: Date.now(),
            score: {
              [p1]: { correct: 0, answered: 0, finishedAt: null },
              [p2]: { correct: 0, answered: 0, finishedAt: null },
            },
            answeredMap: {
              [p1]: new Set(),
              [p2]: new Set(),
            },
            abandoned: null,
            finalizing: false,
          });

          io.to(roomId).emit("match:found", {
            roomId,
            matchId: matchDoc._id.toString(),
            mode,
            questions,
            players: [p1, p2],
            avgRating,
          });
        } else {
          queues[mode].push({
            userId,
            socket,
            rating: myRating,
            joinedAt: Date.now(),
          });

          socket.emit("match:queued", { mode, myRating });
        }
      } catch (e) {
        console.log("match:find error:", e.message);
        socket.emit("match:error", { message: e.message });
      }
    });

    socket.on("match:cancel", ({ mode }) => {
      if (!queues[mode]) return;
      queues[mode] = queues[mode].filter((p) => p.userId !== userId);
      socket.emit("match:cancelled", { mode });
    });

    socket.on("match:answer", async ({ roomId, questionIndex, selectedIndex }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      const uid = userId.toString();
      if (!state.score[uid]) return;

      const q = state.questions[questionIndex];
      if (!q) return;

      if (state.answeredMap[uid].has(questionIndex)) return;
      state.answeredMap[uid].add(questionIndex);

    
      let isCorrect = false;

      if (state.mode === "bughunter") {
        
        const correctBugCount = typeof q.bugCount === "number" ? q.bugCount : q.correctOptionIndex;
        isCorrect = Number(selectedIndex) === Number(correctBugCount);
      } else {
        isCorrect = Number(selectedIndex) === Number(q.correctOptionIndex);
      }

      state.score[uid].answered += 1;
      if (isCorrect) state.score[uid].correct += 1;

      socket.emit("match:answerResult", {
        questionIndex,
        isCorrect,
        correctAnswer:
          state.mode === "bughunter"
            ? (typeof q.bugCount === "number" ? q.bugCount : q.correctOptionIndex)
            : q.correctOptionIndex,
      });

  
      if (state.score[uid].answered === state.questions.length && !state.score[uid].finishedAt) {
        state.score[uid].finishedAt = Date.now();

        io.to(roomId).emit("match:progress", {
          userId: uid,
          correct: state.score[uid].correct,
          answered: state.score[uid].answered,
        });
      }

      const [p1, p2] = state.players;

      if (state.abandoned?.leftUserId) {
        const remaining = state.players.find((p) => p !== state.abandoned.leftUserId);
        if (remaining && state.score[remaining].finishedAt) {
          await finalizeMatch(io, roomId, "abandoned");
        }
        return;
      }

      const done1 = state.score[p1].finishedAt;
      const done2 = state.score[p2].finishedAt;

      if (done1 && done2) {
        await finalizeMatch(io, roomId, "completed");
      }
    });

    socket.on("match:leave", async ({ roomId }) => {
      const state = activeMatches.get(roomId);
      if (!state) return;

      const uid = userId.toString();
      if (!state.players.includes(uid)) return;

      state.abandoned = { leftUserId: uid };

      socket.to(roomId).emit("match:opponentLeft", {
        message: "Opponent left the match. Finish remaining questions to win.",
        leftUserId: uid,
      });

      socket.leave(roomId);

      try {
        await Match.findByIdAndUpdate(state.matchId, {
          status: "abandoned",
          endTime: new Date(),
          resultType: "disconnect",
        });
      } catch (e) {
        console.log("leave update error:", e.message);
      }
    });

    socket.on("disconnect", async () => {
      Object.keys(queues).forEach((mode) => {
        queues[mode] = queues[mode].filter((p) => p.userId !== userId);
      });

      for (const [roomId, state] of activeMatches.entries()) {
        if (state.sockets.includes(socket.id)) {
          const uid = userId.toString();
          state.abandoned = { leftUserId: uid };

          socket.to(roomId).emit("match:opponentLeft", {
            message: "Opponent disconnected. Finish remaining questions to win.",
            leftUserId: uid,
          });

          try {
            await Match.findByIdAndUpdate(state.matchId, {
              status: "abandoned",
              endTime: new Date(),
              resultType: "disconnect",
            });
          } catch (e) {
            console.log("Disconnect update error:", e.message);
          }
          break;
        }
      }
    });
  });
};
