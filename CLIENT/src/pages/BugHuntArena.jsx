import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Bug, 
  Code2, 
  Timer, 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search,
  Network,
  User,
  Cpu,
  Minus,
  Plus,
  LogOut
} from 'lucide-react';

axios.defaults.withCredentials = true;

const BugHuntArena = ({ user }) => {
  const navigate = useNavigate();
  
  // States: SEARCHING -> FOUND -> PLAYING -> RESULTS
  const [gameState, setGameState] = useState('SEARCHING');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  
  // New Mechanic: User Bug Count
  const [userBugCount, setUserBugCount] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [logs, setLogs] = useState([]);

  // Leave Modal State
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Mock Opponent
  const [opponent, setOpponent] = useState({ name: "Searching...", rating: 0 });
  const OPPONENTS = [
    { name: "SyntaxSlayer", rating: 1450 },
    { name: "DebuggerPro", rating: 1620 },
    { name: "GlitchHunter", rating: 1380 }
  ];

  // --- PHASE 1: FETCH DATA & MATCHMAKING ---
  useEffect(() => {
    // 1. Start fetching questions immediately
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bug-hunter`);
        if (res.data.question && res.data.question.length > 0) {
          setQuestions(res.data.question);
        } else {
          toast.error("No bugs found!");
          navigate('/');
        }
      } catch (err) {
        console.error(err); 
        toast.error("Failed to fetch challenges");
        navigate('/');
      }
    };
    fetchQuestions();

    // 2. Run Matchmaking Simulation
    const messages = [
        "Scanning Codebase...",
        "Looking for rivals...",
        "Compiling bugs...",
        "Opponent Found!",
    ];
    let delay = 0;
    messages.forEach((msg) => {
        delay += 1000;
        setTimeout(() => setLogs(p => [...p.slice(-4), `> ${msg}`]), delay);
    });

    const foundTimer = setTimeout(() => {
        setOpponent(OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)]);
        setGameState('FOUND');
    }, 4500);

    return () => clearTimeout(foundTimer);
  }, [navigate]);

  // --- PHASE 2: TRANSITION TO PLAY ---
  useEffect(() => {
    if (gameState === 'FOUND') {
        const t = setTimeout(() => setGameState('PLAYING'), 3000);
        return () => clearTimeout(t);
    }
  }, [gameState]);

  // --- PHASE 3: GAME TIMER ---
  useEffect(() => {
    if (gameState === 'PLAYING' && !isRoundOver && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'PLAYING' && !isRoundOver) {
      handleSubmit(); // Auto-submit on timeout
    }
  }, [timeLeft, gameState, isRoundOver]);

  // --- HANDLERS ---
  const handleAdjustCount = (delta) => {
    if (isRoundOver) return;
    setUserBugCount(prev => Math.max(0, prev + delta));
  };

  const handleSubmit = () => {
    setIsRoundOver(true);
    const currentQ = questions[currentIdx];
    
    // Default to 1 if bugCount isn't provided by backend yet (backward compatibility)
    const actualBugCount = currentQ.bugCount !== undefined ? currentQ.bugCount : 1; 

    if (userBugCount === actualBugCount) {
      const timeBonus = Math.floor(timeLeft * 2);
      setScore(s => s + 100 + timeBonus);
      toast.success("Correct Bug Count!");
    } else {
      toast.error(`Wrong! There were ${actualBugCount} bugs.`);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(p => p + 1);
      setTimeLeft(45);
      setUserBugCount(0);
      setIsRoundOver(false);
    } else {
      setGameState('RESULTS');
    }
  };

  // Trigger Modal
  const leaveMatch = () => {
    setShowLeaveModal(true);
  };

  // Actual Navigation
  const confirmLeave = () => {
    setShowLeaveModal(false);
    navigate('/');
  };

  // --- RENDER: SEARCHING ---
  if (gameState === 'SEARCHING') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(236,72,153,0.1),transparent_50%)]"></div>
        <div className="z-10 text-center max-w-2xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-900/30 border border-pink-500/30 rounded-full text-pink-400 font-bold mb-8 animate-pulse text-xs md:text-sm">
                <Search size={16} /> MATCHMAKING
            </div>
            <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-12">
                 <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                 <div className="absolute inset-4 border-4 border-t-pink-500 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Bug size={48} className="text-pink-500 md:w-16 md:h-16" />
                 </div>
            </div>
            <div className="bg-black/60 border border-pink-500/20 rounded-xl p-6 font-mono text-left h-48 flex flex-col justify-end shadow-2xl w-full">
                 {logs.map((log, i) => (
                    <p key={i} className="text-pink-400/80 text-xs md:text-sm animate-fade-in">{log}</p>
                 ))}
            </div>
            <button onClick={() => navigate('/')} className="mt-8 text-gray-500 hover:text-white font-bold uppercase tracking-widest text-xs">Cancel</button>
        </div>
      </div>
    );
  }

  // --- RENDER: FOUND ---
  if (gameState === 'FOUND') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
         <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20 animate-scale-in">
             <div className="text-center order-2 md:order-1">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-cyan-500/20 border-4 border-cyan-500 flex items-center justify-center mb-4 mx-auto">
                    <User size={48} className="text-cyan-400 md:w-16 md:h-16" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-black text-white">{user?.username || "You"}</h2>
             </div>
             <div className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-500 animate-bounce order-1 md:order-2 my-4 md:my-0">VS</div>
             <div className="text-center order-3">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-pink-500/20 border-4 border-pink-500 flex items-center justify-center mb-4 mx-auto">
                    <Cpu size={48} className="text-pink-400 md:w-16 md:h-16" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-black text-white">{opponent.name}</h2>
                 <p className="text-pink-400 font-mono text-sm md:text-base">{opponent.rating} ELO</p>
             </div>
         </div>
      </div>
    );
  }

  // --- RENDER: RESULTS ---
  if (gameState === 'RESULTS') {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center pt-24 px-4">
         <div className="p-6 md:p-10 rounded-3xl bg-[#0f172a] border border-pink-500/30 text-center max-w-xl w-full shadow-2xl animate-scale-in">
            <Trophy size={60} className="text-yellow-400 mx-auto mb-6 md:w-20 md:h-20" />
            <h2 className="text-2xl md:text-4xl font-black text-white mb-2">HUNT COMPLETE</h2>
            <div className="text-5xl md:text-7xl font-black text-white mb-2">{score}</div>
            <div className="text-xs md:text-sm text-pink-400 font-bold uppercase tracking-widest mb-8">Final Score</div>
            <button onClick={() => navigate('/')} className="w-full md:w-auto px-8 py-3 rounded-lg font-bold bg-pink-600 hover:bg-pink-500 text-white transition-all">
                Back to Menu
            </button>
         </div>
      </div>
    );
  }

  // --- RENDER: PLAYING ---
  const currentQ = questions[currentIdx];
  const actualBugCount = currentQ?.bugCount !== undefined ? currentQ.bugCount : 1; 

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#020617] flex flex-col items-center relative">
      
      {/* --- LEAVE MODAL --- */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e293b] border border-red-500/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-100">
             <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400 border border-red-500/20">
                <AlertTriangle size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Abandon Hunt?</h3>
             <p className="text-gray-400 mb-8 text-sm">Are you sure you want to leave? You will lose progress for this round.</p>
             
             <div className="flex gap-4 justify-center">
               <button 
                 onClick={() => setShowLeaveModal(false)}
                 className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmLeave}
                 className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all"
               >
                 Yes, Leave
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Header - Responsive */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 mb-6 md:mb-8 bg-[#0f172a] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
           <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
             <Code2 className="text-pink-400" />
           </div>
           <div className="text-right md:text-left">
             <h3 className="text-white font-bold text-sm">Bug Hunt Arena</h3>
             <p className="text-xs text-gray-500">Round {currentIdx + 1}/{questions.length}</p>
           </div>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
           <div className="text-left md:text-right">
              <div className="text-xs text-gray-500 font-bold uppercase">Score</div>
              <div className="text-xl font-black text-white leading-none">{score}</div>
           </div>
           <div className="flex items-center gap-2">
               <div className={`px-4 py-2 rounded-lg border font-mono font-bold text-lg md:text-xl ${timeLeft < 10 ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-pink-900/20 border-pink-500/30 text-pink-400'}`}>
                  <Timer className="inline mr-2 w-4 h-4 md:w-5 md:h-5" />{timeLeft}s
               </div>
               
               {/* LEAVE MATCH BUTTON */}
               <button 
                 onClick={leaveMatch}
                 className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
                 title="Leave Match"
               >
                 <LogOut size={20} />
               </button>
           </div>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Code Snippet */}
        <div className="bg-[#0d1117] rounded-2xl overflow-hidden border border-white/10 shadow-xl relative order-2 lg:order-1">
          <div className="absolute top-0 left-0 w-full h-8 bg-[#161b22] flex items-center px-4 gap-2 border-b border-white/5">
             <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
             <div className="ml-auto text-xs text-gray-500 font-mono">bug_snippet.js</div>
          </div>
          <pre className="p-4 md:p-6 pt-12 font-mono text-xs md:text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px] lg:max-h-none overflow-y-auto">
            {currentQ?.code}
          </pre>
        </div>

        {/* Interaction Panel */}
        <div className="flex flex-col justify-center bg-[#0f172a] p-5 md:p-8 rounded-2xl border border-white/10 order-1 lg:order-2 h-fit">
           <div className="mb-6 md:mb-8 text-center">
             <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-400 animate-pulse">
                <AlertTriangle size={24} className="md:w-8 md:h-8" />
             </div>
             <h2 className="text-xl md:text-2xl font-black text-white mb-2">How many bugs?</h2>
             <p className="text-gray-400 text-xs md:text-sm">Review the code and count the errors.</p>
           </div>

           {/* Counter Input */}
           <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
              <button 
                onClick={() => handleAdjustCount(-1)}
                disabled={isRoundOver}
                className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#1e293b] hover:bg-pink-500 hover:text-white text-gray-400 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={24} className="md:w-8 md:h-8" />
              </button>
              
              <div className="text-4xl md:text-6xl font-black text-white w-20 md:w-24 text-center">
                {userBugCount}
              </div>

              <button 
                onClick={() => handleAdjustCount(1)}
                disabled={isRoundOver}
                className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#1e293b] hover:bg-pink-500 hover:text-white text-gray-400 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={24} className="md:w-8 md:h-8" />
              </button>
           </div>

           {!isRoundOver ? (
             <button 
               onClick={handleSubmit}
               className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black uppercase tracking-widest shadow-lg hover:shadow-pink-500/20 transition-all hover:-translate-y-1 text-sm md:text-base"
             >
               Submit Count
             </button>
           ) : (
             <div className="animate-fade-in text-center">
               <div className={`text-lg md:text-xl font-black mb-4 ${userBugCount === actualBugCount ? "text-emerald-400" : "text-red-400"}`}>
                 {userBugCount === actualBugCount ? (
                   <span className="flex items-center justify-center gap-2"><CheckCircle2 /> Correct!</span>
                 ) : (
                   <span className="flex items-center justify-center gap-2"><XCircle /> Wrong! Answer: {actualBugCount}</span>
                 )}
               </div>
               {currentQ?.explanation && (
                 <p className="text-xs md:text-sm text-gray-400 mb-6 bg-black/20 p-4 rounded-lg text-left md:text-center">{currentQ.explanation}</p>
               )}
               <button 
                 onClick={nextQuestion}
                 className="w-full py-3 md:py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
               >
                 Next Challenge
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BugHuntArena;