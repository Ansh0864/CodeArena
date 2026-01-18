import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Search, 
  XCircle, 
  Trophy, 
  Timer, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  Cpu, 
  User, 
  Sword 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 1. HARDCODED GAME DATA ---
const MOCK_QUESTIONS = [
  {
    id: 1,
    title: "Merge Sort Complexity",
    description: "What is the worst-case time complexity of the Merge Sort algorithm?",
    options: [
      { id: 'A', text: "O(n)", correct: false },
      { id: 'B', text: "O(n log n)", correct: true },
      { id: 'C', text: "O(n²)", correct: false },
      { id: 'D', text: "O(log n)", correct: false },
    ]
  },
  {
    id: 2,
    title: "Hash Map Access",
    description: "In the average case, what is the time complexity to search for a key in a Hash Table?",
    options: [
      { id: 'A', text: "O(1)", correct: true },
      { id: 'B', text: "O(n)", correct: false },
      { id: 'C', text: "O(log n)", correct: false },
      { id: 'D', text: "O(n log n)", correct: false },
    ]
  },
  {
    id: 3,
    title: "BST Worst Case",
    description: "What is the worst-case search time in an unbalanced Binary Search Tree?",
    options: [
      { id: 'A', text: "O(log n)", correct: false },
      { id: 'B', text: "O(1)", correct: false },
      { id: 'C', text: "O(n)", correct: true },
      { id: 'D', text: "O(n²)", correct: false },
    ]
  },
  {
    id: 4,
    title: "Quick Sort Space",
    description: "What is the space complexity of Quick Sort (considering recursion stack)?",
    options: [
      { id: 'A', text: "O(1)", correct: false },
      { id: 'B', text: "O(log n)", correct: true },
      { id: 'C', text: "O(n)", correct: false },
      { id: 'D', text: "O(n²)", correct: false },
    ]
  },
  {
    id: 5,
    title: "Array Insertion",
    description: "What is the time complexity to insert an element at the BEGINNING of a dynamic array (vector/ArrayList)?",
    options: [
      { id: 'A', text: "O(1)", correct: false },
      { id: 'B', text: "O(log n)", correct: false },
      { id: 'C', text: "O(n)", correct: true },
      { id: 'D', text: "O(n log n)", correct: false },
    ]
  }
];

const MOCK_OPPONENTS = [
  { name: "BigO_Master", rating: 1650, color: "text-red-400" },
  { name: "CodeNinja99", rating: 1520, color: "text-blue-400" },
  { name: "AlgoWhiz", rating: 1780, color: "text-purple-400" },
  { name: "LogRhythm", rating: 1490, color: "text-orange-400" }
];

export default function ComplexityDuel({ user }) {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  // View States: 'MENU' | 'SEARCHING' | 'FOUND' | 'PLAYING' | 'RESULTS'
  const [view, setView] = useState('MENU');
  
  // Game Logic
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [myScore, setMyScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRoundLocked, setIsRoundLocked] = useState(false); // After answering or timeout
  
  // Matchmaking
  const [opponent, setOpponent] = useState(null);
  const [searchLogs, setSearchLogs] = useState([]);

  // Modals
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Refs for timers
  const gameTimerRef = useRef(null);
  const opponentSimRef = useRef(null);

  // --- 1. START MATCHMAKING ---
  const startMatchmaking = () => {
    setView('SEARCHING');
    setSearchLogs([]);
    
    // Simulate connection logs
    const logs = [
      "Connecting to algorithm server...",
      "Verifying latency...",
      "Searching for opponents (Rating ±100)...",
      "Handshake successful...",
    ];
    let delay = 0;
    logs.forEach(log => {
      delay += 800;
      setTimeout(() => setSearchLogs(prev => [...prev.slice(-3), `> ${log}`]), delay);
    });

    // Found match
    setTimeout(() => {
      const randomOpponent = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
      setOpponent(randomOpponent);
      setView('FOUND');
    }, 4500);
  };

  // --- 2. TRANSITION TO GAME ---
  useEffect(() => {
    if (view === 'FOUND') {
      const t = setTimeout(() => {
        setView('PLAYING');
        startGameLoop();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [view]);

  // --- 3. GAME LOOP ---
  const startGameLoop = () => {
    // Reset State
    setCurrentQIdx(0);
    setMyScore(0);
    setOpScore(0);
    resetRound();
  };

  const resetRound = () => {
    setTimeLeft(15);
    setSelectedOption(null);
    setIsRoundLocked(false);
    
    // Clear old timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (opponentSimRef.current) clearTimeout(opponentSimRef.current);

    // Start Game Timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate Opponent Answering (Random time between 5s and 12s)
    const opDelay = Math.random() * 7000 + 5000; 
    opponentSimRef.current = setTimeout(() => {
      // 70% chance opponent gets it right
      if (Math.random() > 0.3) {
        setOpScore(prev => prev + 100 + Math.floor(Math.random() * 50));
      }
    }, opDelay);
  };

  const handleTimeout = () => {
    setIsRoundLocked(true);
    clearInterval(gameTimerRef.current);
  };

  const handleAnswer = (option, idx) => {
    if (isRoundLocked) return;
    
    setSelectedOption(idx);
    setIsRoundLocked(true);
    clearInterval(gameTimerRef.current);

    if (option.correct) {
      // Score calculation: Base 100 + (TimeLeft * 5)
      const points = 100 + (timeLeft * 5);
      setMyScore(prev => prev + points);
    }
  };

  const nextQuestion = () => {
    if (currentQIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentQIdx(prev => prev + 1);
      resetRound();
    } else {
      endGame();
    }
  };

  const endGame = () => {
    clearInterval(gameTimerRef.current);
    clearTimeout(opponentSimRef.current);
    setView('RESULTS');
  };

  // --- 4. LEAVE LOGIC ---
  const handleLeaveRequest = () => {
    setShowLeaveModal(true);
  };

  const confirmLeave = () => {
    clearInterval(gameTimerRef.current);
    clearTimeout(opponentSimRef.current);
    setShowLeaveModal(false);
    setView('MENU');
  };

  // --- RENDER HELPERS ---
  const currentQ = MOCK_QUESTIONS[currentQIdx];

  // --- VIEW: MENU ---
  if (view === 'MENU') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="z-10 text-center max-w-3xl w-full animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-500/30 rounded-full text-emerald-400 font-bold mb-6 md:mb-8 text-xs md:text-sm">
              <BarChart3 size={16} /> Big O Battle
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 uppercase tracking-tighter text-white">
            Complexity <span className="text-emerald-500">Duel</span>
          </h1>
          
          <p className="text-gray-400 text-sm md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto px-4">
             Analyze algorithms. Determine time complexity. 
             <br className="hidden md:block"/>
             <span className="text-emerald-400 font-bold">15 seconds</span> per question. Fastest answer wins.
          </p>
  
          {/* Mock Lobby Card */}
          <div className="w-full bg-[#0f172a] border border-emerald-500/20 rounded-3xl p-2 flex flex-col md:flex-row gap-2 mb-8 md:mb-10 shadow-2xl">
              <div className="flex-1 bg-emerald-500/5 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center border border-dashed border-emerald-500/30 min-h-[180px] md:min-h-[250px]">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/50">
                      <User size={32} className="md:w-10 md:h-10" />
                   </div>
                   <h3 className="font-bold text-lg md:text-xl text-white">{user?.username || "Player"}</h3>
                   <p className="text-emerald-400 font-mono text-xs md:text-sm">Ready</p>
              </div>
  
              <div className="flex items-center justify-center p-2 md:p-4">
                  <span className="font-black text-xl md:text-2xl text-gray-600 italic">VS</span>
              </div>
  
              <div className="flex-1 bg-black/20 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center border border-dashed border-gray-700 min-h-[180px] md:min-h-[250px]">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                      <Search size={24} className="md:w-8 md:h-8" />
                   </div>
                   <h3 className="font-bold text-lg md:text-xl text-gray-500">Searching...</h3>
              </div>
          </div>
  
          <button 
            onClick={startMatchmaking}
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-[#020617] font-black py-4 px-12 rounded-xl text-sm md:text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105 uppercase tracking-widest"
          >
              Start Matchmaking
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: SEARCHING ---
  if (view === 'SEARCHING') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center">
        <div className="z-10 text-center max-w-2xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-emerald-400 font-bold mb-8 animate-pulse text-xs md:text-sm">
                <Search size={16} /> MATCHMAKING
            </div>
            
            <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-12">
                 <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                 <div className="absolute inset-4 border-4 border-t-emerald-500 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart3 size={48} className="text-emerald-500 md:w-16 md:h-16" />
                 </div>
            </div>

            <div className="bg-black/60 border border-emerald-500/20 rounded-xl p-6 font-mono text-left h-48 flex flex-col justify-end shadow-2xl w-full">
                 {searchLogs.map((log, i) => (
                    <p key={i} className="text-emerald-400/80 text-xs md:text-sm animate-fade-in">{log}</p>
                 ))}
            </div>
            <button 
                onClick={() => setView('MENU')} 
                className="mt-8 text-red-500 hover:text-red-400 font-bold uppercase tracking-widest text-xs"
            >
                Cancel Search
            </button>
        </div>
      </div>
    );
  }

  // --- VIEW: FOUND ---
  if (view === 'FOUND') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
         <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20 animate-scale-in">
             {/* You */}
             <div className="text-center order-2 md:order-1">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(16,185,129,0.5)] mx-auto">
                    <User size={48} className="text-emerald-400 md:w-16 md:h-16" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-black text-white">{user?.username || "Player"}</h2>
                 <p className="text-emerald-400 font-mono text-sm md:text-base">1500 ELO</p>
             </div>

             <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-red-500 animate-bounce order-1 md:order-2 my-4 md:my-0">VS</div>

             {/* Opponent */}
             <div className="text-center order-3">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(239,68,68,0.5)] mx-auto">
                    <Cpu size={48} className="text-red-400 md:w-16 md:h-16" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-black text-white">{opponent?.name || "Opponent"}</h2>
                 <p className="text-red-400 font-mono text-sm md:text-base">{opponent?.rating || 1500} ELO</p>
             </div>
         </div>
         <p className="mt-12 text-gray-400 animate-pulse text-sm md:text-base">Duel starting in 3...</p>
      </div>
    );
  }

  // --- VIEW: RESULTS ---
  if (view === 'RESULTS') {
    const isWin = myScore > opScore;
    const isDraw = myScore === opScore;
    
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center">
            <div className={`p-8 md:p-12 rounded-3xl border-2 ${isWin ? 'border-emerald-500 bg-emerald-950/30' : 'border-red-500 bg-red-950/30'} text-center max-w-2xl w-full animate-fade-in`}>
                <Trophy size={60} className={`${isWin ? 'text-yellow-400' : 'text-gray-500'} mx-auto mb-6 md:w-20 md:h-20`} />
                
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{isWin ? "VICTORY!" : isDraw ? "DRAW" : "DEFEAT"}</h1>
                <p className="text-gray-400 mb-8 text-sm md:text-base">{isWin ? "Your algorithmic knowledge is superior." : "Better luck next time."}</p>

                <div className="flex justify-center gap-8 md:gap-12 mb-8 md:mb-12">
                    <div className="text-center">
                        <p className="text-xs md:text-sm text-gray-500 uppercase font-bold">Your Score</p>
                        <p className="text-3xl md:text-4xl font-black text-white">{myScore}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs md:text-sm text-gray-500 uppercase font-bold">{opponent?.name}</p>
                        <p className="text-3xl md:text-4xl font-black text-white opacity-70">{opScore}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => setView('MENU')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold transition-all w-full sm:w-auto">
                        Back to Menu
                    </button>
                    <button onClick={startMatchmaking} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg w-full sm:w-auto">
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // --- VIEW: PLAYING (Main Game) ---
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#020617] text-white flex flex-col items-center relative">
      
      {/* --- LEAVE MODAL --- */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e293b] border border-red-500/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
             <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400 border border-red-500/20">
                <AlertTriangle size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Surrender Match?</h3>
             <p className="text-gray-400 mb-8 text-sm">You will lose 50 ELO points if you leave the duel now.</p>
             
             <div className="flex gap-3">
               <button 
                 onClick={() => setShowLeaveModal(false)}
                 className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmLeave}
                 className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all"
               >
                 Yes, Leave
               </button>
             </div>
          </div>
        </div>
      )}

      {/* --- HEADER BAR --- */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mb-8 bg-[#0f172a] p-4 rounded-2xl border border-white/5 shadow-lg gap-4 md:gap-0">
         
         {/* Row Wrapper for Mobile: Player & Opponent */}
         <div className="flex w-full md:w-auto justify-between items-center md:gap-8 order-2 md:order-1">
             {/* Player Score */}
             <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <User size={16} className="md:w-5 md:h-5" />
                </div>
                <div>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase">YOU</p>
                    <p className="text-lg md:text-xl font-black text-white leading-none">{myScore}</p>
                </div>
             </div>

             {/* Opponent Score (Mobile only) */}
             <div className="flex items-center gap-3 md:gap-4 text-right md:hidden">
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{opponent?.name || "Opp"}</p>
                    <p className="text-lg font-black text-white leading-none">{opScore}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
                    <Cpu size={16} />
                </div>
             </div>
         </div>

         {/* Timer */}
         <div className={`flex items-center gap-2 text-xl md:text-2xl font-black font-mono order-1 md:order-2 w-full md:w-auto justify-center border-b md:border-b-0 border-white/5 pb-2 md:pb-0 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            <Timer className="w-5 h-5 md:w-6 md:h-6" /> {timeLeft}s
         </div>

         {/* Opponent (Desktop) */}
         <div className="hidden md:flex items-center gap-4 text-right order-3">
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase">{opponent?.name || "Opponent"}</p>
                <p className="text-xl font-black text-white">{opScore}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
                <Cpu size={20} />
            </div>
         </div>
      </div>

      {/* --- MAIN GAME CARD --- */}
      <div className="w-full max-w-4xl bg-[#0f172a] border border-white/10 p-5 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
         {/* Question Header */}
         <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl md:text-2xl font-black text-white">Question {currentQIdx + 1}/{MOCK_QUESTIONS.length}</h2>
            <button 
                onClick={handleLeaveRequest}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" 
                title="Leave Match"
            >
                <LogOut size={20} />
            </button>
         </div>

         {/* Question Title & Desc */}
         <div className="mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl text-emerald-400 font-bold mb-2 md:mb-3">{currentQ.title}</h3>
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed">{currentQ.description}</p>
         </div>

         {/* Options Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {currentQ.options.map((opt, idx) => {
                let statusClass = "bg-[#1e293b] border-white/10 hover:border-emerald-500/50 hover:bg-white/5";
                
                // If round locked, show colors
                if (isRoundLocked) {
                    if (opt.correct) {
                        statusClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                    } else if (selectedOption === idx && !opt.correct) {
                        statusClass = "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                        statusClass = "opacity-40 border-transparent";
                    }
                }

                return (
                    <button
                        key={idx}
                        disabled={isRoundLocked}
                        onClick={() => handleAnswer(opt, idx)}
                        className={`p-4 md:p-6 rounded-xl border-2 text-left font-bold transition-all relative ${statusClass}`}
                    >
                        <span className="text-xs md:text-sm text-gray-500 block mb-1">Option {opt.id}</span>
                        <span className="text-sm md:text-base">{opt.text}</span>
                        
                        {isRoundLocked && opt.correct && (
                            <CheckCircle2 className="absolute top-4 right-4 text-emerald-500" size={20} />
                        )}
                        {isRoundLocked && selectedOption === idx && !opt.correct && (
                            <XCircle className="absolute top-4 right-4 text-red-500" size={20} />
                        )}
                    </button>
                )
            })}
         </div>

         {/* --- FOOTER / NEXT BUTTON --- */}
         <div className="mt-8 h-12 flex items-center justify-end">
             {isRoundLocked && (
                 <button 
                    onClick={nextQuestion}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 md:px-8 py-3 rounded-xl font-bold animate-fade-in flex items-center gap-2 shadow-lg w-full md:w-auto justify-center"
                 >
                    {currentQIdx < MOCK_QUESTIONS.length - 1 ? "Next Question" : "Finish Duel"} <Sword size={18} />
                 </button>
             )}
             {!isRoundLocked && (
                 <p className="text-xs md:text-sm text-gray-500 animate-pulse w-full text-center md:text-right">Select the correct complexity...</p>
             )}
         </div>
         
         {/* Progress Bar */}
         <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20">
             <div 
               className="h-full bg-emerald-500 transition-all duration-300"
               style={{ width: `${((currentQIdx + 1) / MOCK_QUESTIONS.length) * 100}%` }}
             ></div>
         </div>
      </div>
    </div>
  );
}