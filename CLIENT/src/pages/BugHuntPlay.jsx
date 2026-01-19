import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../App";
import { toast } from "react-toastify";

const PER_Q_TIME = 30;

export default function BugHuntPlay({ user }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const roomId = state?.roomId;
  const questions = state?.questions || [];
  const players = state?.players || [];
  const matchId = state?.matchId;

  const total = questions.length;
  const myId = user?._id?.toString();

  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PER_Q_TIME);

  // ✅ number of bugs guess
  const [bugGuess, setBugGuess] = useState(1);

  const [locked, setLocked] = useState(false);
  const [myCorrect, setMyCorrect] = useState(0);
  const [opCorrect, setOpCorrect] = useState(0);

  const [waiting, setWaiting] = useState(false);
  const [result, setResult] = useState(null);

  const [opponentLeft, setOpponentLeft] = useState(false);

  const timerRef = useRef(null);
  const current = questions[idx];

  const opponentId = useMemo(() => {
    if (!players?.length || !myId) return null;
    return players.find((p) => p !== myId) || null;
  }, [players, myId]);

  // Guard
  useEffect(() => {
    if (!roomId || !matchId || !total) {
      toast.error("Invalid match state. Returning...");
      navigate("/bug-hunt");
    }
  }, [roomId, matchId, total, navigate]);

  // Reset per question + timer
  useEffect(() => {
    setLocked(false);
    setTimeLeft(PER_Q_TIME);
    setWaiting(false);
    setBugGuess(1);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx]);

  // Timeout auto-submit
  useEffect(() => {
    if (locked || result) return;
    if (timeLeft > 0) return;

    setLocked(true);

    socket.emit("match:answer", {
      roomId,
      questionIndex: idx,
      selectedIndex: -1, // time out
    });

    toast.error("Time up!");
    goNextAfterDelay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, locked, result]);

  // Socket listeners
  useEffect(() => {
    const onAnswerResult = (payload) => {
      if (payload.questionIndex !== idx) return;

      if (payload.isCorrect) {
        setMyCorrect((c) => c + 1);
      }
    };

    const onProgress = ({ userId, correct }) => {
      if (!opponentId) return;
      if (userId === opponentId) setOpCorrect(correct);
    };

    const onOpponentLeft = (data) => {
      setOpponentLeft(true);
      toast.warn(data?.message || "Opponent left. Finish to win.");
      setWaiting(false);
    };

    const onResult = (data) => {
      setResult(data);
      setWaiting(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    socket.on("match:answerResult", onAnswerResult);
    socket.on("match:progress", onProgress);
    socket.on("match:opponentLeft", onOpponentLeft);
    socket.on("match:result", onResult);

    return () => {
      socket.off("match:answerResult", onAnswerResult);
      socket.off("match:progress", onProgress);
      socket.off("match:opponentLeft", onOpponentLeft);
      socket.off("match:result", onResult);
    };
  }, [idx, opponentId]);

  const goNextAfterDelay = () => {
    setTimeout(() => {
      if (idx >= total - 1) {
        if (!result) setWaiting(true);
        return;
      }
      setIdx((i) => i + 1);
    }, 800);
  };

  const submitBugCount = () => {
    if (locked || result) return;

    const val = Number(bugGuess);
    if (!Number.isFinite(val) || val < 0) {
      toast.error("Enter a valid number");
      return;
    }

    setLocked(true);

    socket.emit("match:answer", {
      roomId,
      questionIndex: idx,
      selectedIndex: val, // ✅ send the number user entered
    });

    goNextAfterDelay();
  };

  const myResultText = useMemo(() => {
    if (!result || !myId) return null;
    if (!result.winnerId) return "DRAW 🤝";
    if (result.winnerId === myId) return "YOU WON 🏆";
    return "YOU LOST 💀";
  }, [result, myId]);

  const leaveMatch = () => {
    socket.emit("match:leave", { roomId });
    navigate("/bug-hunt");
  };

  if (!current && !result) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#020617] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="font-black text-xl">
            Bug Hunt <span className="text-pink-400">Arena</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              Q {Math.min(idx + 1, total)}/{total}
            </div>
            {!result && (
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                ⏳ {timeLeft}s
              </div>
            )}
          </div>
        </div>

        {/* Opponent left banner */}
        {opponentLeft && !result && (
          <div className="mb-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-black">
            Opponent left/disconnected — finish remaining questions to win.
          </div>
        )}

        {/* Score */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-gray-400 text-xs font-bold">YOU</div>
            <div className="text-2xl font-black">{myCorrect}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-gray-400 text-xs font-bold">OPPONENT</div>
            <div className="text-2xl font-black">
              {opponentLeft ? "—" : opCorrect}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
            <div className="text-3xl font-black mb-3">{myResultText}</div>

            <div className="text-gray-300 font-bold">
              Your score: {result.scores?.[myId]?.correct ?? myCorrect} / {total}
            </div>

            <div className="text-gray-400 font-bold mt-2">
              Opponent score:{" "}
              {opponentId
                ? result.scores?.[opponentId]?.correct ?? opCorrect
                : opCorrect}{" "}
              / {total}
            </div>

            <button
              onClick={() => navigate("/")}
              className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-[#020617] font-black hover:opacity-90 transition"
            >
              Back Home
            </button>
          </div>
        )}

        {/* Main 2-column Layout */}
        {!result && current && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Code */}
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10 shadow-xl">
              <div className="text-gray-400 text-xs font-bold mb-2">
                MODE: BUG COUNT • {current.difficulty?.toUpperCase?.() || "EASY"}
              </div>

              <h2 className="text-xl md:text-2xl font-black mb-4">
                {current.title || "Count the bugs"}
              </h2>

              <div className="text-gray-200 font-bold mb-4">
                {current.question || "How many logical bugs are in this code?"}
              </div>

              <pre className="bg-black/40 border border-white/10 rounded-2xl p-4 overflow-auto text-sm text-pink-200">
{current.code}
              </pre>

              {/* optional hints (you can remove this block if you don't want hints) */}
              {Array.isArray(current.bugHints) && current.bugHints.length > 0 && (
                <div className="mt-4 text-xs text-gray-400 font-bold">
                  Hints:{" "}
                  <span className="text-gray-500 font-medium">
                    {current.bugHints.slice(0, 2).join(" • ")}
                  </span>
                </div>
              )}
            </div>

            {/* RIGHT: Input + Counter */}
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10 shadow-xl">
              <div className="text-gray-400 text-xs font-bold mb-2">
                YOUR ANSWER
              </div>

              <div className="text-2xl font-black mb-4">
                Total Bugs Found:{" "}
                <span className="text-pink-400">{bugGuess}</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <button
                  disabled={locked}
                  onClick={() => setBugGuess((v) => Math.max(0, Number(v) - 1))}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 font-black text-2xl hover:bg-white/10 transition disabled:opacity-50"
                >
                  –
                </button>

                <input
                  value={bugGuess}
                  disabled={locked}
                  onChange={(e) => setBugGuess(e.target.value)}
                  className="flex-1 h-14 rounded-2xl bg-black/30 border border-white/10 px-4 text-xl font-black text-white outline-none"
                  type="number"
                  min={0}
                />

                <button
                  disabled={locked}
                  onClick={() => setBugGuess((v) => Number(v) + 1)}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 font-black text-2xl hover:bg-white/10 transition disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <button
                disabled={locked || result}
                onClick={submitBugCount}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-[#020617] font-black hover:opacity-90 transition disabled:opacity-60"
              >
                Submit Bug Count
              </button>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={leaveMatch}
                  className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-black hover:bg-red-500 hover:text-white transition"
                >
                  Leave Match
                </button>

                <div className="text-gray-400 text-sm font-bold">
                  Timer auto-submits.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Waiting */}
        {waiting && !result && (
          <div className="mt-6 text-center text-gray-300 font-black">
            {opponentLeft
              ? "Finishing & finalizing match..."
              : "Waiting for opponent to finish..."}
          </div>
        )}
      </div>
    </div>
  );
}
