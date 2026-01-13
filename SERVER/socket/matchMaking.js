const Match = require("../models/Match");
const { generateRapidDuel, generateBugHunter } = require("../utils/game.controller");

const queues = {
  rapidDuel: [],
  bughunter: [],
};

const activeMatches = new Map();

function getUserId(socket) {
  return socket.request.user?._id?.toString() || socket.request.session?.passport?.user?.toString() || null;
}

function createRoomId(mode) {
  return `${mode}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function getQuestions(mode) {
  if (mode === "rapidDuel") return await generateRapidDuel();
  if (mode === "bughunter") return await generateBugHunter();
  return [];
}

function computeWinner(state) {
  const [p1, p2] = state.players;
  const s1 = state.score[p1];
  const s2 = state.score[p2];

  if (s1.correct > s2.correct) return p1;
  if (s2.correct > s1.correct) return p2;

  if (s1.finishedAt && s2.finishedAt) {
    if (s1.finishedAt < s2.finishedAt) return p1;
    if (s2.finishedAt < s1.finishedAt) return p2;
  }

  return null; //draw
}

module.exports = function setUpMatchMaking(io) {
  io.on("connection", (socket) => {
    const userId = getUserId(socket);

    console.log(" User connected", socket.id, "user:", userId);

    if (!userId) {
      socket.emit("match:error", { message: "Login Required" });
      socket.disconnect();
      return;
    }

    socket.on("match:find", async ({ mode }) => {
      try {
        console.log("match:find from", userId, "mode:", mode);

        if (!queues[mode]) {
          socket.emit("match:error", { message: "Invalid Mode" });
          return;
        }

        // remove duplicates
        queues[mode] = queues[mode].filter((p) => p.userId !== userId);

        if (queues[mode].length > 0) {
          const opponent = queues[mode].shift();
          const roomId = createRoomId(mode);

          socket.join(roomId);
          opponent.socket.join(roomId);

          const questions = await getQuestions(mode);

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
            startedAt: Date.now(),
            score: {
              [p1]: { correct: 0, answered: 0, finishedAt: null },
              [p2]: { correct: 0, answered: 0, finishedAt: null },
            },
            answeredMap: {
              [p1]: new Set(),
              [p2]: new Set(),
            },
          });

          console.log(" match created:", roomId, "players:", p1, p2);

          io.to(roomId).emit("match:found", {
            roomId,
            matchId: matchDoc._id.toString(),
            mode,
            questions,
            players: [p1, p2],
          });
        } else {
          queues[mode].push({ userId, socket });
          console.log("queued:", userId, "mode:", mode, "queueLen:", queues[mode].length);
          socket.emit("match:queued", { mode });
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

      const isCorrect = selectedIndex === q.correctOptionIndex;

      state.score[uid].answered += 1;
      if (isCorrect) state.score[uid].correct += 1;

      socket.emit("match:answerResult", {
        questionIndex,
        isCorrect,
        correctOptionIndex: q.correctOptionIndex,
      });

      if (
        state.score[uid].answered === state.questions.length &&
        !state.score[uid].finishedAt
      ) {
        state.score[uid].finishedAt = Date.now();
        console.log("🏁 finished:", uid, "correct:", state.score[uid].correct);

        io.to(roomId).emit("match:progress", {
          userId: uid,
          correct: state.score[uid].correct,
          answered: state.score[uid].answered,
        });
      }

      const [p1, p2] = state.players;
      const done1 = state.score[p1].finishedAt;
      const done2 = state.score[p2].finishedAt;

      if (done1 && done2) {
        const winnerId = computeWinner(state);

        io.to(roomId).emit("match:result", {
          winnerId,
          scores: {
            [p1]: state.score[p1],
            [p2]: state.score[p2],
          },
        });

        try {
          const match = await Match.findById(state.matchId);
          if (match) {
            match.endTime = new Date();
            match.duration = Math.floor((Date.now() - state.startedAt) / 1000);

            if (winnerId) {
              match.winner = winnerId;
              match.status = "completed";
              match.resultType = "firstCorrect";
            } else {
              match.status = "draw";
              match.resultType = "timeout";
            }
            await match.save();
          }
        } catch (e) {
          console.log(" save match error:", e.message);
        }

        activeMatches.delete(roomId);
      }
    });

    socket.on("disconnect", async () => {
      console.log("disconnected:", socket.id);

   
      Object.keys(queues).forEach((mode) => {
        queues[mode] = queues[mode].filter((p) => p.userId !== userId);
      });

      
      for (const [roomId, data] of activeMatches.entries()) {
        if (data.sockets.includes(socket.id)) {
          try {
            await Match.findByIdAndUpdate(data.matchId, {
              status: "abandoned",
              endTime: new Date(),
              resultType: "disconnect",
            });

            io.to(roomId).emit("match:abandoned", {
              message: "Opponent disconnected",
            });

            activeMatches.delete(roomId);
          } catch (e) {
            console.log("Disconnect update error:", e.message);
          }
          break;
        }
      }
    });
  });
};
