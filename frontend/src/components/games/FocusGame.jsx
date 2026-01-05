import { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, XCircle } from 'lucide-react';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const WORDS = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
const MAX_TRIALS = 10;
const TIMEOUT_MS = 2000;

export default function FocusGame({ onComplete }) {
    const [gameState, setGameState] = useState('intro'); // intro, playing, done
    const [currentTrial, setCurrentTrial] = useState(0);
    const [targetWord, setTargetWord] = useState('');
    const [targetColor, setTargetColor] = useState('');
    const [score, setScore] = useState({ correct: 0, totalRT: 0 });
    const [feedback, setFeedback] = useState(null);

    const trialStartTime = useRef(0);

    useEffect(() => {
        if (gameState === 'playing' && currentTrial < MAX_TRIALS) {
            startTrial();
        } else if (gameState === 'playing' && currentTrial >= MAX_TRIALS) {
            finishGame();
        }
    }, [gameState, currentTrial]);

    const startTrial = () => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        setTargetWord(word);
        setTargetColor(color);
        setFeedback(null);
        trialStartTime.current = performance.now();
    };

    const handleResponse = (isMatch) => {
        const rt = performance.now() - trialStartTime.current;

        // Logic: User must click "MATCH" if Word meaning == Ink Color (Stroop Match)
        // Actually standard Stroop: Name the ink color.
        // Simplified variant: "Does the word match the color?"
        const actualMatch = (WORDS.indexOf(targetWord) === COLORS.indexOf(targetColor));
        const isCorrect = (isMatch === actualMatch);

        setScore(prev => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            totalRT: prev.totalRT + (isCorrect ? rt : MAX_TRIALS * 1000) // Penalize wrong? Or just ignore RT.
            // Let's count RT only for correct
        }));

        setFeedback(isCorrect ? 'correct' : 'wrong');

        setTimeout(() => {
            setCurrentTrial(prev => prev + 1);
        }, 500);
    };

    const finishGame = () => {
        setGameState('done');
        // Normalize
        // Avg RT
        const avgRT = score.totalRT / (score.correct || 1);
        // Accuracy
        const accuracy = score.correct / MAX_TRIALS;

        // Formula: (2000 - avgRT)/2000 * accuracy
        // If avgRT > 2000, score is 0.
        const speedScore = Math.max(0, (2000 - avgRT) / 2000);
        const finalScore = speedScore * accuracy;

        if (onComplete) onComplete(finalScore);
    };

    if (gameState === 'intro') {
        return (
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Focus Calibration</h2>
                <p className="mb-6 text-slate-300">
                    Does the <strong>WORD meaning</strong> match the <strong>INK COLOR</strong>?
                    <br />Press MATCH or NO MATCH as fast as you can.
                </p>
                <button
                    onClick={() => setGameState('playing')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto"
                >
                    <Play className="w-5 h-5" /> Start
                </button>
            </div>
        );
    }

    if (gameState === 'done') {
        return (
            <div className="text-center p-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Calibration Complete</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-slate-400 mb-8">Trial {currentTrial + 1} / {MAX_TRIALS}</div>

            <div
                className="text-6xl font-black mb-12 transition-all p-8 rounded-xl bg-slate-900 w-full text-center"
                style={{ color: targetColor }}
            >
                {targetWord}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => handleResponse(true)}
                    className="bg-green-600 hover:bg-green-500 w-32 py-4 rounded-xl font-bold text-lg"
                >
                    MATCH
                </button>
                <button
                    onClick={() => handleResponse(false)}
                    className="bg-red-600 hover:bg-red-500 w-32 py-4 rounded-xl font-bold text-lg"
                >
                    NO MATCH
                </button>
            </div>

            {feedback === 'correct' && <CheckCircle className="absolute top-1/2 right-10 text-green-500 w-12 h-12" />}
            {feedback === 'wrong' && <XCircle className="absolute top-1/2 right-10 text-red-500 w-12 h-12" />}
        </div>
    );
}
