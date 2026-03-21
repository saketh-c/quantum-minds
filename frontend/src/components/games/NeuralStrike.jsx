import { useState, useEffect, useRef } from 'react';
import { Zap, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const GRID_SIZE = 3;
const GAME_DURATION = 30000;
const MIN_SPAWN_INTERVAL = 500;
const MAX_SPAWN_INTERVAL = 1500;
const TARGET_LIFETIME = 2000;

const VALID_TARGETS = [
    { word: 'HIT', color: '#22c55e' },
    { word: 'STRIKE', color: '#3b82f6' }
];

const INVALID_TARGETS = [
    { word: 'HIT', color: '#ef4444' },
    { word: 'STRIKE', color: '#eab308' },
    { word: 'MISS', color: '#22c55e' }
];

export default function NeuralStrike({ onComplete }) {
    const [gameState, setGameState] = useState('intro');
    const [targets, setTargets] = useState([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
    const [stats, setStats] = useState({
        totalValid: 0, hits: 0, misses: 0, falsePositives: 0, reactionTimes: []
    });

    const gameStartTimeRef = useRef(0);
    const spawnTimerRef = useRef(null);
    const gameTimerRef = useRef(null);
    const targetIdCounterRef = useRef(0);
    const feedbackRef = useRef(null);
    const statsRef = useRef(stats);

    useEffect(() => { statsRef.current = stats; }, [stats]);

    useEffect(() => {
        if (gameState === 'playing') {
            startGame();
            return () => cleanup();
        }
    }, [gameState]);

    const startGame = () => {
        gameStartTimeRef.current = performance.now();
        setStats({ totalValid: 0, hits: 0, misses: 0, falsePositives: 0, reactionTimes: [] });
        setScore(0);
        setStreak(0);
        setTimeLeft(GAME_DURATION / 1000);

        gameTimerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { endGame(); return 0; }
                return prev - 1;
            });
        }, 1000);

        spawnTarget();
    };

    const spawnTarget = () => {
        if (gameState !== 'playing') return;

        const isInvalid = Math.random() < 0.4;
        const targetPool = isInvalid ? INVALID_TARGETS : VALID_TARGETS;
        const target = targetPool[Math.floor(Math.random() * targetPool.length)];
        const gridPosition = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));

        const newTarget = {
            id: targetIdCounterRef.current++,
            word: target.word,
            color: target.color,
            isValid: !isInvalid,
            gridPosition,
            spawnTime: performance.now(),
            lifetime: TARGET_LIFETIME
        };

        setTargets(prev => [...prev, newTarget]);
        if (!isInvalid) setStats(prev => ({ ...prev, totalValid: prev.totalValid + 1 }));

        setTimeout(() => {
            setTargets(prev => {
                const targetExists = prev.some(t => t.id === newTarget.id);
                if (targetExists && newTarget.isValid) {
                    setStreak(0);
                    setStats(s => ({ ...s, misses: s.misses + 1 }));
                }
                return prev.filter(t => t.id !== newTarget.id);
            });
        }, TARGET_LIFETIME);

        const nextSpawnDelay = MIN_SPAWN_INTERVAL + Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL);
        spawnTimerRef.current = setTimeout(() => {
            if (gameState === 'playing') spawnTarget();
        }, nextSpawnDelay);
    };

    const handleTargetClick = (target) => {
        const reactionTime = performance.now() - target.spawnTime;

        if (target.isValid) {
            setStats(prev => ({ ...prev, hits: prev.hits + 1, reactionTimes: [...prev.reactionTimes, reactionTime] }));
            setScore(prev => prev + 10 + (streak * 2));
            setStreak(prev => prev + 1);
            showFeedback('correct');
        } else {
            setStats(prev => ({ ...prev, falsePositives: prev.falsePositives + 1 }));
            setStreak(0);
            showFeedback('wrong');
        }
        setTargets(prev => prev.filter(t => t.id !== target.id));
    };

    const showFeedback = (type) => {
        if (feedbackRef.current) {
            feedbackRef.current.className = `absolute inset-0 pointer-events-none rounded-xl ${type}-flash`;
            setTimeout(() => {
                if (feedbackRef.current) feedbackRef.current.className = 'absolute inset-0 pointer-events-none';
            }, 300);
        }
    };

    const endGame = () => {
        cleanup();
        setGameState('done');
        const { hits, misses, falsePositives, reactionTimes } = statsRef.current;
        const totalAttempts = hits + misses + falsePositives;
        const accuracy = totalAttempts > 0 ? hits / totalAttempts : 0;
        const avgRT = reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 1000;
        const rtScore = Math.max(0, Math.min(1, (1000 - Math.min(avgRT, 1000)) / 1000));
        const normalizedScore = Math.min(1.0, Math.max(0, (accuracy * 0.7) + (rtScore * 0.3)));
        if (onComplete) onComplete(normalizedScore);
    };

    const cleanup = () => {
        if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        setTargets([]);
    };

    if (gameState === 'intro') {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <Target className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">Focus Assessment</CardTitle>
                    <CardDescription>Cognitive attention and reaction time calibration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                            <p className="text-sm font-semibold text-green-800 mb-2">Click These (Valid)</p>
                            <p className="text-xs text-green-700">"HIT" in <span className="font-bold text-green-600">green</span></p>
                            <p className="text-xs text-green-700">"STRIKE" in <span className="font-bold text-blue-600">blue</span></p>
                        </div>
                        <div className="p-4 rounded-lg border bg-red-50 border-red-200">
                            <p className="text-sm font-semibold text-red-800 mb-2">Ignore These (Invalid)</p>
                            <p className="text-xs text-red-700">"HIT" in <span className="font-bold text-red-600">red</span></p>
                            <p className="text-xs text-red-700">"STRIKE" in <span className="font-bold text-yellow-600">yellow</span></p>
                            <p className="text-xs text-red-700">"MISS" in <span className="font-bold text-green-600">green</span></p>
                        </div>
                    </div>

                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li>Targets appear for 2 seconds — react quickly and accurately</li>
                        <li>Build streaks for bonus points</li>
                        <li>Duration: 30 seconds</li>
                    </ul>

                    <Button onClick={() => setGameState('playing')} className="w-full" size="lg">
                        <Zap className="w-5 h-5 mr-2" />
                        Start Assessment
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (gameState === 'done') {
        const { hits, misses, falsePositives, reactionTimes } = stats;
        const accuracy = (hits + misses + falsePositives) > 0
            ? (hits / (hits + misses + falsePositives) * 100).toFixed(0) : 0;
        const avgRT = reactionTimes.length > 0
            ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;

        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="font-display">Focus Assessment Complete</CardTitle>
                    <CardDescription>Your cognitive attention results</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                            <p className="text-3xl font-bold text-primary">{accuracy}%</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Avg Reaction</p>
                            <p className="text-3xl font-bold text-primary">{avgRT}ms</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Correct Hits</p>
                            <p className="text-2xl font-bold">{hits}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Score</p>
                            <p className="text-2xl font-bold">{score}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Playing state — keep dark grid for readability
    const gridPositions = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* HUD */}
            <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold">{score}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Streak</p>
                        <p className="text-2xl font-bold text-primary">{streak}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-destructive animate-pulse' : ''}`}>
                        {timeLeft}s
                    </p>
                </div>
            </div>

            <Progress value={(timeLeft / (GAME_DURATION / 1000)) * 100} className="mb-4" />

            {/* Game Grid */}
            <div className="relative bg-slate-900 rounded-xl border p-6">
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                    {gridPositions.map((pos) => {
                        const target = targets.find(t => t.gridPosition === pos);
                        return (
                            <div key={pos} className="aspect-square relative bg-slate-800 rounded-lg border-2 border-slate-700 overflow-hidden min-h-[60px]">
                                {target && (
                                    <button
                                        onClick={() => handleTargetClick(target)}
                                        className="absolute inset-0 w-full h-full flex items-center justify-center font-black text-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                                        style={{
                                            color: target.color,
                                            textShadow: `0 0 20px ${target.color}, 0 0 40px ${target.color}`,
                                            animation: 'popIn 0.2s ease-out'
                                        }}
                                    >
                                        {target.word}
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: target.color }} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div ref={feedbackRef} className="absolute inset-0 pointer-events-none" />
            </div>

            <style>{`
                @keyframes popIn {
                    from { transform: scale(0) rotate(180deg); opacity: 0; }
                    to { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .correct-flash { animation: flashGreen 0.3s; }
                .wrong-flash { animation: flashRed 0.3s; }
                @keyframes flashGreen { 0%, 100% { background: transparent; } 50% { background: rgba(34, 197, 94, 0.3); } }
                @keyframes flashRed { 0%, 100% { background: transparent; } 50% { background: rgba(239, 68, 68, 0.3); } }
            `}</style>
        </div>
    );
}
