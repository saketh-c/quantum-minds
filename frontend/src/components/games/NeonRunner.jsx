import { useState, useEffect, useRef } from 'react';
import { Play, Zap } from 'lucide-react';

const LANES = [20, 50, 80]; // Left, Center, Right % positions
const WORDS = ["LEFT", "CENTER", "RIGHT"];
const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"]; // Red, Blue, Green, Yellow
const MAX_TRIALS = 10;

export default function NeonRunner({ onComplete }) {
    const [gameState, setGameState] = useState('intro');
    const [lane, setLane] = useState(1); // 0=Left, 1=Center, 2=Right
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [gates, setGates] = useState([]);
    const [stats, setStats] = useState({ total: 0, correct: 0, rtSum: 0 });
    
    const sceneRef = useRef(null);
    const playerRef = useRef(null);
    const feedbackRef = useRef(null);
    const animationFrameRef = useRef(null);
    const lastSpawnRef = useRef(0);
    const speedRef = useRef(1500); // ms to reach player
    const touchStartXRef = useRef(0);
    const playingRef = useRef(false);

    useEffect(() => {
        playingRef.current = gameState === 'playing';
        if (gameState === 'playing') {
            startGameLoop();
            return () => {
                playingRef.current = false;
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };
        }
    }, [gameState]);

    const startGameLoop = () => {
        const gameLoop = (time) => {
            if (!playingRef.current) {
                return;
            }

            // Spawn gates
            if (time - lastSpawnRef.current > 1500) {
                spawnGate();
                lastSpawnRef.current = time;
            }

            // Update gates
            setGates(prev => {
                return prev.map(gate => {
                    const age = time - gate.created;
                    const progress = age / speedRef.current;
                    
                    if (progress >= 1) {
                        checkCollision(gate);
                        setTimeout(() => {
                            setGates(g => g.filter(g => g.id !== gate.id));
                        }, 0);
                        return null;
                    }
                    
                    return { ...gate, progress };
                }).filter(Boolean);
            });

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };
        animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    const spawnGate = () => {
        const targetLaneIndex = Math.floor(Math.random() * 3);
        const word = WORDS[targetLaneIndex];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        
        const newGate = {
            id: Date.now(),
            targetLane: targetLaneIndex,
            word,
            color,
            created: performance.now(),
            progress: 0
        };
        
        setGates(prev => [...prev, newGate]);
    };

    const movePlayer = (laneIdx) => {
        setLane(laneIdx);
        if (playerRef.current) {
            playerRef.current.style.left = `${LANES[laneIdx]}%`;
            playerRef.current.style.transform = `translateX(-50%) rotate(${laneIdx === 0 ? -20 : laneIdx === 2 ? 20 : 0}deg)`;
        }
    };

    const checkCollision = (gate) => {
        const reactionTime = performance.now() - gate.created;
        
        setStats(prev => {
            const newStats = { ...prev, total: prev.total + 1 };
            
            if (lane === gate.targetLane) {
                // Correct
                setScore(s => s + 100 + (streak * 10));
                setStreak(s => s + 1);
                newStats.correct++;
                newStats.rtSum += reactionTime;
                flashFeedback('correct');
                playSound(440, 'sine');
            } else {
                // Wrong
                setStreak(0);
                flashFeedback('wrong');
                playSound(150, 'sawtooth');
            }
            
            if (newStats.total >= MAX_TRIALS) {
                setTimeout(() => finishGame(newStats), 500);
            }
            
            return newStats;
        });
    };

    const flashFeedback = (type) => {
        if (feedbackRef.current) {
            feedbackRef.current.className = `absolute inset-0 pointer-events-none ${type}-flash`;
            setTimeout(() => {
                if (feedbackRef.current) {
                    feedbackRef.current.className = 'absolute inset-0 pointer-events-none';
                }
            }, 300);
        }
    };

    const playSound = (freq, type) => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
        } catch (e) {
            // Audio context may not be available
        }
    };

    const finishGame = (finalStats) => {
        setGameState('done');
        
        const accuracy = finalStats.correct / finalStats.total;
        const avgRT = finalStats.rtSum / (finalStats.correct || 1);
        
        // Formula: (2000 - avgRT)/2000 * accuracy
        const speedScore = Math.max(0, (2000 - avgRT) / 2000);
        const finalScore = speedScore * accuracy;
        
        if (onComplete) onComplete(finalScore);
    };

    const handleKeyDown = (e) => {
        if (gameState !== 'playing') return;
        if (e.key === 'ArrowLeft' && lane > 0) movePlayer(lane - 1);
        if (e.key === 'ArrowRight' && lane < 2) movePlayer(lane + 1);
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') movePlayer(1);
    };

    const handleTouchStart = (e) => {
        touchStartXRef.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        if (gameState !== 'playing') return;
        const diff = e.changedTouches[0].screenX - touchStartXRef.current;
        if (Math.abs(diff) > 30) {
            if (diff > 0 && lane < 2) movePlayer(lane + 1);
            else if (diff < 0 && lane > 0) movePlayer(lane - 1);
        }
    };

    useEffect(() => {
        if (gameState === 'playing') {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('touchstart', handleTouchStart);
            window.addEventListener('touchend', handleTouchEnd);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('touchstart', handleTouchStart);
                window.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [gameState, lane]);

    if (gameState === 'intro') {
        return (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900/95 backdrop-blur-md p-8 rounded-2xl border border-blue-500/30 max-w-md w-full">
                    <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center" style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,255,0.5))' }}>
                        NEON RUNNER
                    </h1>
                    <p className="text-xl text-blue-200 mb-8 font-mono text-center">QUANTUM CONNECTIVITY CALIBRATION</p>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex gap-3 items-start">
                            <Zap className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                            <p className="text-slate-300 text-sm">Read the <span className="font-bold text-white">WORD</span> on the Gate.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Zap className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                            <p className="text-slate-300 text-sm">Ignore the <span className="font-bold text-red-400">COLOR</span>.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Zap className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                            <p className="text-slate-300 text-sm">Move to the lane the WORD describes.</p>
                        </div>
                    </div>
                    
                    <div className="text-xs text-slate-400 mb-6 p-3 bg-slate-800/50 rounded-lg">
                        Example: If it says "LEFT" but is colored Red, go LEFT.
                    </div>
                    
                    <button
                        onClick={() => setGameState('playing')}
                        className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg shadow-[0_0_20px_#3b82f6] transition-all transform hover:scale-105"
                    >
                        INITIATE LINK
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'done') {
        const accuracy = Math.round((stats.correct / stats.total) * 100);
        const avgRT = Math.floor(stats.rtSum / (stats.correct || 1));
        
        return (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900/95 backdrop-blur-md p-8 rounded-2xl border border-green-500/30 max-w-md w-full text-center">
                    <h1 className="text-4xl font-bold text-white mb-6">SYNC COMPLETE</h1>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <div className="text-sm text-slate-400 mb-2">Reaction Speed</div>
                            <div className="text-3xl font-mono text-cyan-400">{avgRT}ms</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-400 mb-2">Accuracy</div>
                            <div className="text-3xl font-mono text-purple-400">{accuracy}%</div>
                        </div>
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
        <div className="fixed inset-0 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden" style={{ perspective: '800px' }}>
            {/* Animated Grid Floor */}
            <div 
                className="absolute bottom-0 left-[-50%] w-[200%] h-full"
                style={{
                    background: `
                        linear-gradient(rgba(18, 16, 16, 0) 0%, rgba(88, 28, 135, 0.4) 40%, rgba(236, 72, 153, 0.8) 100%),
                        repeating-linear-gradient(transparent 0, transparent 40px, rgba(56, 189, 248, 0.3) 40px, rgba(56, 189, 248, 0.3) 42px),
                        repeating-linear-gradient(90deg, transparent 0, transparent 40px, rgba(56, 189, 248, 0.3) 40px, rgba(56, 189, 248, 0.3) 42px)
                    `,
                    transform: 'rotateX(60deg)',
                    transformOrigin: 'bottom center',
                    animation: 'moveGrid 1s linear infinite'
                }}
            />
            
            {/* Lane Markers */}
            <div className="absolute bottom-0 left-0 w-full h-full flex justify-center" style={{ transform: 'rotateX(60deg)', transformOrigin: 'bottom center' }}>
                <div className="w-[2px] h-[200%] bg-white/10 mx-[15%]" />
                <div className="w-[2px] h-[200%] bg-white/10 mx-[15%]" />
            </div>

            {/* HUD */}
            <div className="absolute top-6 left-6 z-20 text-white font-mono" style={{ textShadow: '0 0 5px #3b82f6' }}>
                <div className="text-2xl font-bold">SCORE: {String(score).padStart(3, '0')}</div>
                <div className="text-xs text-slate-400">STREAK: {streak}</div>
            </div>

            {/* Player Ship */}
            <div 
                ref={playerRef}
                className="absolute bottom-[10%] z-10 transition-all duration-100"
                style={{ 
                    left: `${LANES[lane]}%`,
                    transform: `translateX(-50%) rotate(${lane === 0 ? -20 : lane === 2 ? 20 : 0}deg)`
                }}
            >
                <div className="relative">
                    <div 
                        className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-white"
                        style={{ filter: 'drop-shadow(0 0 10px #3b82f6)' }}
                    />
                    <div 
                        className="absolute bottom-[-10px] left-[-10px] w-20 h-5 bg-blue-500 rounded-full opacity-80 blur-sm"
                        style={{ animation: 'pulseEngine 0.1s infinite alternate' }}
                    />
                </div>
            </div>

            {/* Gates */}
            {gates.map(gate => {
                const scale = 0.1 + (gate.progress * 0.9);
                const y = gate.progress * 90;
                const opacity = gate.progress > 0.8 ? 1 : 0.5 + (gate.progress / 2);
                
                return (
                    <div
                        key={gate.id}
                        className="absolute top-0 left-1/2 flex items-center justify-center text-2xl font-black text-white rounded-xl border-4 bg-black/80 pointer-events-none z-5"
                        style={{
                            width: '120px',
                            height: '80px',
                            transform: `translateX(-50%) scale(${scale})`,
                            top: `${y}%`,
                            opacity,
                            color: gate.color,
                            borderColor: gate.color,
                            boxShadow: `0 0 20px ${gate.color}`,
                            textShadow: `0 0 10px ${gate.color}`
                        }}
                    >
                        {gate.word}
                    </div>
                );
            })}

            {/* Feedback Flash */}
            <div ref={feedbackRef} className="absolute inset-0 pointer-events-none" />

            <style>{`
                @keyframes moveGrid {
                    from { background-position: 0 0; }
                    to { background-position: 0 42px; }
                }
                @keyframes pulseEngine {
                    from { opacity: 0.6; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1.1); }
                }
                .correct-flash {
                    animation: flashGreen 0.3s;
                }
                .wrong-flash {
                    animation: flashRed 0.3s;
                }
                @keyframes flashGreen {
                    0% { background: rgba(0, 255, 0, 0.3); }
                    100% { background: transparent; }
                }
                @keyframes flashRed {
                    0% { background: rgba(255, 0, 0, 0.3); }
                    100% { background: transparent; }
                }
            `}</style>
        </div>
    );
}

