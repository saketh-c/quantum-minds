import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const GRID_SIZE = 3; // 3x3 grid
const DISPLAY_TIME = 1000;

export default function MemoryGame({ onComplete }) {
    const [gameState, setGameState] = useState('intro'); // intro, showing, input, done
    const [level, setLevel] = useState(1);
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [maxRecalled, setMaxRecalled] = useState(0);

    useEffect(() => {
        if (gameState === 'showing') {
            runSequence();
        }
    }, [gameState, level]);

    const runSequence = async () => {
        // Generate sequence
        const newStep = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
        setSequence(prev => [...prev, newStep]);
        setUserSequence([]);

        // Show sequence
        // Visual handled by rendering state? No, need delay.
        // Actually standard Simon: Show entire sequence each time? 
        // Or N-Back? 
        // Spec said: "Patterns Recalled / Total Patterns". 
        // Let's do a simple Pattern Recall: Show N tiles lit up at once, then hide. User Recreates.
        // Level 1: 3 tiles. Level 2: 4 tiles. etc.

        // REVISED LOGIC: Spatial Pattern
        // Generate pattern of 'level + 2' items
        const count = level + 2;
        const newPattern = [];
        while (newPattern.length < count) {
            const idx = Math.floor(Math.random() * 9);
            if (!newPattern.includes(idx)) newPattern.push(idx);
        }
        setSequence(newPattern); // It's a set, not order.

        // Wait for display time
        setTimeout(() => {
            setGameState('input');
        }, DISPLAY_TIME + (level * 200));
    };

    const handleTileClick = (idx) => {
        if (gameState !== 'input') return;

        // Toggle selection
        if (userSequence.includes(idx)) {
            setUserSequence(prev => prev.filter(i => i !== idx));
        } else {
            // Limit selection count to target count
            if (userSequence.length < sequence.length) {
                setUserSequence(prev => [...prev, idx]);
            }
        }
    };

    const submitPattern = () => {
        // Check match
        const isCorrect = sequence.every(i => userSequence.includes(i)) && userSequence.length === sequence.length;

        if (isCorrect) {
            setMaxRecalled(level); // Proxy for score
            if (level < 5) {
                setLevel(prev => prev + 1);
                setGameState('showing');
            } else {
                finishGame(level + 1); // Bonus
            }
        } else {
            finishGame(maxRecalled);
        }
    };

    const finishGame = (finalLevel) => {
        setGameState('done');
        // Normalize: Max 9 is genius. 5 is very good.
        const score = Math.min(1.0, finalLevel / 6.0);
        if (onComplete) onComplete(score);
    };

    if (gameState === 'intro') {
        return (
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">Hippocampal Calibration</h2>
                <p className="mb-6 text-slate-300">
                    Memorize the pattern of highlighted tiles.
                    <br />Recreate it after they disappear.
                </p>
                <button
                    onClick={() => setGameState('showing')}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto"
                >
                    <Play className="w-5 h-5" /> Start
                </button>
            </div>
        );
    }

    if (gameState === 'done') {
        return <div className="text-2xl font-bold text-center">Memory Calibration Complete</div>;
    }

    return (
        <div className="flex flex-col items-center">
            <div className="text-slate-400 mb-8">Level {level}</div>

            <div className="grid grid-cols-3 gap-2 p-4 bg-slate-900 rounded-xl mb-8">
                {[...Array(9)].map((_, i) => {
                    const isHighlit = gameState === 'showing' && sequence.includes(i);
                    const isSelected = gameState === 'input' && userSequence.includes(i);

                    return (
                        <button
                            key={i}
                            onClick={() => handleTileClick(i)}
                            disabled={gameState !== 'input'}
                            className={`w-20 h-20 rounded-lg transition-all duration-300 ${isHighlit ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' :
                                    isSelected ? 'bg-purple-600 border-2 border-white' :
                                        'bg-slate-800 hover:bg-slate-700'
                                }`}
                        />
                    );
                })}
            </div>

            {gameState === 'input' && (
                <button
                    onClick={submitPattern}
                    disabled={userSequence.length !== sequence.length}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-full font-bold"
                >
                    SUBMIT
                </button>
            )}
        </div>
    );
}
