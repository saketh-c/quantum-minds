import { useState, useEffect, useRef } from 'react';
import { Play, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GRID_SIZE = 3;
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
        if (gameState === 'showing') runSequence();
    }, [gameState, level]);

    useEffect(() => {
        if (gameState === 'input' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) { handleTimeout(); return 0; }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [gameState, timeLeft]);

    useEffect(() => {
        if (gameState === 'input') {
            distractorIntervalRef.current = setInterval(() => spawnDistractor(), 2000);
            return () => clearInterval(distractorIntervalRef.current);
        } else {
            setDistractors([]);
        }
    }, [gameState]);

    const runSequence = () => {
        const count = level + 2;
        const newPattern = [];
        while (newPattern.length < count) {
            const idx = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            if (!newPattern.includes(idx)) newPattern.push(idx);
        }
        setSequence(newPattern);
        setUserSequence([]);
        setTimeLeft(5 + level);
        setTimeout(() => setGameState('input'), 1000 + (level * 200));
    };

    const spawnDistractor = () => {
        const positions = ['top', 'bottom', 'left', 'right'];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const type = Math.random() > 0.5 ? 'glitch' : 'impostor';
        const distractor = { id: Date.now(), position, type };
        setDistractors(prev => [...prev, distractor]);
        setTimeout(() => {
            setDistractors(prev => prev.filter(d => d.id !== distractor.id));
        }, 1500);
    };

    const handleTileClick = (idx) => {
        if (gameState !== 'input') return;
        if (userSequence.includes(idx)) {
            setUserSequence(prev => prev.filter(i => i !== idx));
        } else if (userSequence.length < sequence.length) {
            setUserSequence(prev => [...prev, idx]);
        }
    };

    const handleTimeout = () => finishGame(maxRecalled);

    const submitPattern = () => {
        const isCorrect = sequence.every(i => userSequence.includes(i)) && userSequence.length === sequence.length;
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
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">Memory Assessment</CardTitle>
                    <CardDescription>Spatial pattern recall calibration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li>A pattern will flash on a 3x3 grid</li>
                        <li>Memorize and recreate the pattern exactly</li>
                        <li>Difficulty increases with each level (up to 5)</li>
                        <li>Ignore distractors that appear during input</li>
                    </ul>

                    <Button onClick={() => setGameState('showing')} className="w-full" size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        Start Assessment
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (gameState === 'done') {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="font-display">Memory Assessment Complete</CardTitle>
                    <CardDescription>Your spatial recall results</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="p-6 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Highest Level Reached</p>
                        <p className="text-4xl font-bold text-primary">{maxRecalled}</p>
                        <p className="text-sm text-muted-foreground mt-1">out of {MAX_LEVEL}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Playing state — contained within page flow
    return (
        <div className="max-w-md mx-auto relative">
            {/* HUD */}
            <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-base font-semibold px-4 py-1">
                    Level {level}
                </Badge>
                {gameState === 'input' && (
                    <Badge variant={timeLeft <= 3 ? "destructive" : "outline"} className="text-base font-mono px-4 py-1">
                        {timeLeft}s
                    </Badge>
                )}
            </div>

            {/* Distractors */}
            {distractors.map(distractor => (
                <div
                    key={distractor.id}
                    className={`absolute z-30 pointer-events-none ${
                        distractor.position === 'top' ? '-top-8 left-1/2 -translate-x-1/2' :
                        distractor.position === 'bottom' ? '-bottom-8 left-1/2 -translate-x-1/2' :
                        distractor.position === 'left' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-full' :
                        'right-0 top-1/2 -translate-y-1/2 translate-x-full'
                    }`}
                >
                    {distractor.type === 'glitch' ? (
                        <span className="text-2xl animate-pulse text-destructive font-mono">GLITCH</span>
                    ) : (
                        <span className="text-2xl animate-bounce">👤</span>
                    )}
                </div>
            ))}

            {/* Game Grid */}
            <Card className="p-6 bg-slate-900 border-slate-700">
                <p className="text-center text-sm font-medium text-slate-400 mb-4">
                    {gameState === 'showing' ? 'Memorize the pattern...' : `Select ${sequence.length} tiles`}
                </p>

                <div className="grid grid-cols-3 gap-3">
                    {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
                        const isHighlighted = gameState === 'showing' && sequence.includes(i);
                        const isSelected = gameState === 'input' && userSequence.includes(i);

                        return (
                            <button
                                key={i}
                                onClick={() => handleTileClick(i)}
                                disabled={gameState !== 'input'}
                                className={`
                                    aspect-square min-h-[60px] rounded-lg transition-all duration-300 font-bold text-xl
                                    ${isHighlighted
                                        ? 'bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.6)] scale-105 border-2 border-white'
                                        : isSelected
                                        ? 'bg-green-600 border-2 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
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
                    <div className="mt-4 flex flex-col items-center gap-3">
                        <p className="text-sm text-slate-400">
                            Selected: {userSequence.length} / {sequence.length}
                        </p>
                        <Button
                            onClick={submitPattern}
                            disabled={userSequence.length !== sequence.length}
                            className="w-full"
                        >
                            Submit Pattern
                        </Button>
                    </div>
                )}

                {gameState === 'showing' && (
                    <p className="mt-4 text-center text-sm text-yellow-400 animate-pulse">
                        Watch carefully...
                    </p>
                )}
            </Card>
        </div>
    );
}
