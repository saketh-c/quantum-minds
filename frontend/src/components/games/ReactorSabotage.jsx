import { useState, useEffect, useRef } from 'react';
import { Play, AlertTriangle, Shield } from 'lucide-react';

const GRID_SIZE = 3; // 3x3 keypad
const MAX_LEVEL = 5;

export default function ReactorSabotage({ onComplete }) {
    const [gameState, setGameState] = useState('intro');
    const [level, setLevel] = useState(1);
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [maxRecalled, setMaxRecalled] = useState(0);
    const [distractors, setDistractors] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    
    const timerRef = useRef(null);
    const distractorIntervalRef = useRef(null);

    useEffect(() => {
        if (gameState === 'showing') {
            runSequence();
        }
    }, [gameState, level]);

    useEffect(() => {
        if (gameState === 'input' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [gameState, timeLeft]);

    useEffect(() => {
        if (gameState === 'input') {
            // Spawn distractors during input phase
            distractorIntervalRef.current = setInterval(() => {
                spawnDistractor();
            }, 2000);
            return () => clearInterval(distractorIntervalRef.current);
        } else {
            setDistractors([]);
        }
    }, [gameState]);

    const runSequence = () => {
        const count = level + 2; // Level 1 = 3 tiles, Level 2 = 4 tiles, etc.
        const newPattern = [];
        while (newPattern.length < count) {
            const idx = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            if (!newPattern.includes(idx)) newPattern.push(idx);
        }
        setSequence(newPattern);
        setUserSequence([]);
        setTimeLeft(5 + level); // More time for higher levels
        
        // Show pattern
        setTimeout(() => {
            setGameState('input');
        }, 1000 + (level * 200));
    };

    const spawnDistractor = () => {
        const positions = ['top', 'bottom', 'left', 'right'];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const type = Math.random() > 0.5 ? 'glitch' : 'impostor';
        
        const distractor = {
            id: Date.now(),
            position,
            type,
            created: Date.now()
        };
        
        setDistractors(prev => [...prev, distractor]);
        
        // Remove after animation
        setTimeout(() => {
            setDistractors(prev => prev.filter(d => d.id !== distractor.id));
        }, 1500);
    };

    const handleTileClick = (idx) => {
        if (gameState !== 'input') return;

        if (userSequence.includes(idx)) {
            setUserSequence(prev => prev.filter(i => i !== idx));
        } else {
            if (userSequence.length < sequence.length) {
                setUserSequence(prev => [...prev, idx]);
            }
        }
    };

    const handleTimeout = () => {
        finishGame(maxRecalled);
    };

    const submitPattern = () => {
        const isCorrect = sequence.every(i => userSequence.includes(i)) && 
                         userSequence.length === sequence.length;

        if (isCorrect) {
            setMaxRecalled(level);
            if (level < MAX_LEVEL) {
                setLevel(prev => prev + 1);
                setGameState('showing');
            } else {
                finishGame(level + 1);
            }
        } else {
            finishGame(maxRecalled);
        }
    };

    const finishGame = (finalLevel) => {
        setGameState('done');
        const score = Math.min(1.0, finalLevel / 6.0);
        if (onComplete) onComplete(score);
    };

    if (gameState === 'intro') {
        return (
            <div className="fixed inset-0 bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900/95 backdrop-blur-md p-8 rounded-2xl border border-red-500/30 max-w-md w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-red-500" size={32} />
                        <h2 className="text-3xl font-bold text-red-400">REACTOR SABOTAGE</h2>
                    </div>
                    <p className="text-lg text-slate-300 mb-6 font-mono">Hippocampal Calibration</p>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex gap-3 items-start">
                            <Shield className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                            <p className="text-slate-300 text-sm">A security keypad pattern will flash on screen.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Shield className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                            <p className="text-slate-300 text-sm">Memorize the pattern and recreate it exactly.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Shield className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                            <p className="text-slate-300 text-sm"><span className="text-red-400 font-bold">WARNING:</span> Ignore glitches and impostors!</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setGameState('showing')}
                        className="w-full px-8 py-4 bg-red-600 hover:bg-red-500 rounded-full font-bold text-lg shadow-[0_0_20px_#ef4444] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <Play size={20} /> INITIATE REPAIR
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'done') {
        return (
            <div className="fixed inset-0 bg-gradient-to-b from-green-950 via-slate-900 to-slate-950 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900/95 backdrop-blur-md p-8 rounded-2xl border border-green-500/30 max-w-md w-full text-center">
                    <h1 className="text-4xl font-bold text-green-400 mb-4">REACTOR STABILIZED</h1>
                    <p className="text-slate-300 mb-6">Memory Calibration Complete</p>
                    <div className="text-2xl font-mono text-cyan-400 mb-6">
                        Level Reached: {maxRecalled}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-white/20 hover:bg-white/10 rounded-lg"
                    >
                        RECALIBRATE
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 overflow-hidden">
            {/* Background Reactor Effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* HUD */}
            <div className="absolute top-6 left-6 z-20 text-white font-mono">
                <div className="text-xl font-bold text-red-400 mb-2">LEVEL {level}</div>
                {gameState === 'input' && (
                    <div className="text-sm text-yellow-400">TIME: {timeLeft}s</div>
                )}
            </div>

            {/* Distractors */}
            {distractors.map(distractor => (
                <div
                    key={distractor.id}
                    className={`absolute z-30 pointer-events-none ${
                        distractor.position === 'top' ? 'top-4 left-1/2 -translate-x-1/2' :
                        distractor.position === 'bottom' ? 'bottom-4 left-1/2 -translate-x-1/2' :
                        distractor.position === 'left' ? 'left-4 top-1/2 -translate-y-1/2' :
                        'right-4 top-1/2 -translate-y-1/2'
                    }`}
                >
                    {distractor.type === 'glitch' ? (
                        <div className="text-4xl animate-pulse text-red-500 font-mono">
                            ⚠ GLITCH
                        </div>
                    ) : (
                        <div className="text-4xl animate-bounce text-purple-500">
                            👤
                        </div>
                    )}
                </div>
            ))}

            {/* Main Game Area */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-700 shadow-2xl">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-mono text-slate-400 mb-2">
                            {gameState === 'showing' ? 'SECURITY KEYPAD' : 'ENTER CODE'}
                        </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-xl">
                        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
                            const isHighlighted = gameState === 'showing' && sequence.includes(i);
                            const isSelected = gameState === 'input' && userSequence.includes(i);

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleTileClick(i)}
                                    disabled={gameState !== 'input'}
                                    className={`
                                        w-20 h-20 rounded-lg transition-all duration-300 font-mono text-2xl font-bold
                                        ${isHighlighted 
                                            ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] scale-110 border-2 border-white' 
                                            : isSelected
                                            ? 'bg-green-600 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                                            : 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-600'
                                        }
                                        ${gameState === 'input' ? 'cursor-pointer' : 'cursor-default'}
                                    `}
                                >
                                    {isSelected && '✓'}
                                </button>
                            );
                        })}
                    </div>

                    {gameState === 'input' && (
                        <div className="mt-6 flex flex-col items-center gap-3">
                            <div className="text-sm text-slate-400 font-mono">
                                Selected: {userSequence.length} / {sequence.length}
                            </div>
                            <button
                                onClick={submitPattern}
                                disabled={userSequence.length !== sequence.length}
                                className="px-8 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-bold transition-all"
                            >
                                SUBMIT CODE
                            </button>
                        </div>
                    )}

                    {gameState === 'showing' && (
                        <div className="mt-6 text-center">
                            <div className="text-sm text-yellow-400 font-mono animate-pulse">
                                MEMORIZE THE PATTERN...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

