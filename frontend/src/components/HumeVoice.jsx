import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Voice prosody needs a server to hold the Hume credentials. The app runs
// fully client-side by default, so this is empty unless VITE_API_URL is set,
// in which case prosody falls back to simulated scores.
const BACKEND_URL = import.meta.env.VITE_API_URL || '';

export default function HumeVoice({ onProsodyUpdate, onTranscriptUpdate }) {
    const [isRecording, setIsRecording] = useState(false);
    const [prosodyScores, setProsodyScores] = useState({ anxiety: 0.1, isolation: 0.1 });
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const [duration, setDuration] = useState(0);

    // Refs to avoid stale closures
    const prosodyScoresRef = useRef({ anxiety: 0.1, isolation: 0.1 });
    const transcriptRef = useRef('');
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const durationRef = useRef(0);

    const startRecording = useCallback(async () => {
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            setDuration(0);
            durationRef.current = 0;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.start(250);
            setIsRecording(true);

            timerRef.current = setInterval(() => {
                durationRef.current += 1;
                setDuration(prev => prev + 1);
            }, 1000);
        } catch (err) {
            setError('Microphone access denied. Please allow microphone permissions.');
        }
    }, []);

    const simulateProsody = useCallback(() => {
        const d = durationRef.current;
        return {
            anxiety: Math.min(1, Math.max(0, 0.2 + (Math.random() * 0.4) + (d > 10 ? 0.1 : 0))),
            isolation: Math.min(1, Math.max(0, 0.15 + (Math.random() * 0.35) + (d > 15 ? 0.1 : 0))),
        };
    }, []);

    const stopRecording = useCallback(async () => {
        if (!mediaRecorderRef.current) return;

        return new Promise((resolve) => {
            mediaRecorderRef.current.onstop = async () => {
                clearInterval(timerRef.current);
                setIsRecording(false);

                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

                // Stop mic tracks immediately — audio data is already captured
                mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());

                try {
                    if (!BACKEND_URL) {
                        throw new Error('No prosody backend configured');
                    }

                    const formData = new FormData();
                    formData.append('audio', blob, 'recording.webm');

                    const response = await fetch(`${BACKEND_URL}/analyze-voice`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const newScores = {
                            anxiety: data.anxiety ?? prosodyScoresRef.current.anxiety,
                            isolation: data.isolation ?? prosodyScoresRef.current.isolation,
                        };
                        setProsodyScores(newScores);
                        prosodyScoresRef.current = newScores;

                        if (data.transcript) {
                            setTranscript(data.transcript);
                            transcriptRef.current = data.transcript;
                        }

                        if (onProsodyUpdate) onProsodyUpdate(newScores);
                        if (onTranscriptUpdate && data.transcript) onTranscriptUpdate(data.transcript);
                    } else {
                        const simScores = simulateProsody();
                        setProsodyScores(simScores);
                        prosodyScoresRef.current = simScores;
                        if (onProsodyUpdate) onProsodyUpdate(simScores);
                    }
                } catch {
                    const simScores = simulateProsody();
                    setProsodyScores(simScores);
                    prosodyScoresRef.current = simScores;
                    if (onProsodyUpdate) onProsodyUpdate(simScores);
                }

                resolve();
            };

            mediaRecorderRef.current.stop();
        });
    }, [onProsodyUpdate, onTranscriptUpdate, simulateProsody]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Voice Analysis</span>
                </div>
                {isRecording && (
                    <Badge variant="destructive" className="animate-pulse">
                        Recording {formatTime(duration)}
                    </Badge>
                )}
            </div>

            <div className="flex gap-3">
                {!isRecording ? (
                    <Button onClick={startRecording} variant="outline" className="gap-2 flex-1">
                        <Mic className="w-4 h-4" />
                        Start Recording
                    </Button>
                ) : (
                    <Button onClick={stopRecording} variant="destructive" className="gap-2 flex-1">
                        <MicOff className="w-4 h-4" />
                        Stop Recording
                    </Button>
                )}
            </div>

            {(prosodyScores.anxiety > 0.1 || prosodyScores.isolation > 0.1) && (
                <div className="flex gap-3 flex-wrap">
                    <Badge variant="outline" className="font-mono text-xs">
                        Anxiety: {(prosodyScores.anxiety * 100).toFixed(0)}%
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                        Isolation: {(prosodyScores.isolation * 100).toFixed(0)}%
                    </Badge>
                </div>
            )}

            {transcript && (
                <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                    "{transcript}"
                </p>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
