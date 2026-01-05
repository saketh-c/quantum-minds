import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { fetchAccessToken } from 'hume'; // Theoretical helper or simple fetch

// WebSocket URL for Hume EVI
const HUME_EVI_WS_URL = 'wss://api.hume.ai/v0/evi/chat';
// Backend API URL - use Cloud Run URL for production, localhost for development
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://quantum-backend-738298079218.us-central1.run.app';

export default function HumeVoice({ onAnalysisComplete, onRecordingStateChange }) {
    const [isRecording, setIsRecording] = useState(false);
    const [socket, setSocket] = useState(null);
    const [prosodyScores, setProsodyScores] = useState({ anxiety: 0.1, isolation: 0.1 });
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [transcript, setTranscript] = useState('');
    const [transcriptRatings, setTranscriptRatings] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const recognitionRef = useRef(null);

    // ... refs remain same ...
    const audioContextRef = useRef(null);
    const processorRef = useRef(null);
    const sourceRef = useRef(null);

    useEffect(() => {
        if (onRecordingStateChange) onRecordingStateChange(isRecording);
    }, [isRecording]);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            console.log('[Hume Voice] Component unmounting, cleaning up...');
            if (processorRef.current) {
                try {
                    processorRef.current.disconnect();
                } catch (e) {
                    // Ignore errors during cleanup
                }
            }
            if (sourceRef.current) {
                try {
                    sourceRef.current.disconnect();
                } catch (e) {
                    // Ignore errors during cleanup
                }
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => {
                    // Ignore errors during cleanup
                });
            }
            if (socket) {
                socket.close();
            }
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // ... startRecording / initAudio logic remains essentially same ...
    // BUT we need to make sure we keep the exact logic or placeholders.
    // To save context space, I will focus on the UI changes and props.

    // RE-INJECTING LOGIC for safety:

    const startRecording = async () => {
        try {
            setStatus('connecting');
            setTranscript(''); // Reset transcript for new recording
            setTranscriptRatings(null);
            setErrorMessage('');
            console.log('[Hume Voice] Requesting token from backend:', `${BACKEND_URL}/hume/token`);
            
            const tokenResp = await fetch(`${BACKEND_URL}/hume/token`, { method: 'POST' });
            
            if (!tokenResp.ok) {
                const errorData = await tokenResp.json();
                console.error('[Hume Voice] Token request failed:', errorData);
                throw new Error(errorData.message || errorData.error || "Failed to get Hume token");
            }
            
            const tokenData = await tokenResp.json();
            console.log('[Hume Voice] Token received:', { 
                has_token: !!tokenData.access_token,
                expires_in: tokenData.expires_in,
                token_type: tokenData.token_type
            });
            
            if (!tokenData.access_token) {
                console.error('[Hume Voice] No access_token in response:', tokenData);
                throw new Error("No access_token in response. Check Hume credentials configuration.");
            }

            const wsUrl = `wss://api.hume.ai/v0/evi/chat?access_token=${tokenData.access_token}`;
            console.log('[Hume Voice] Connecting to WebSocket:', wsUrl.replace(/access_token=[^&]+/, 'access_token=***'));
            
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('[Hume Voice] WebSocket connected');
                setStatus('recording');
                setIsRecording(true);
                initAudio(ws);
                startSpeechRecognition();
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('[Hume Voice] WebSocket message received:', {
                        has_models: !!data.models,
                        has_prosody: !!(data.models && data.models.prosody),
                        has_scores: !!(data.models && data.models.prosody && data.models.prosody.scores),
                        has_message: !!data.message,
                        message_type: data.type
                    });
                    
                    // Capture transcript from Hume messages
                    if (data.message && data.message.content) {
                        const newTranscript = data.message.content;
                        console.log('[Hume Voice] Transcript received:', newTranscript);
                        setTranscript(prev => prev ? `${prev} ${newTranscript}` : newTranscript);
                    }
                    
                    if (data.models && data.models.prosody && data.models.prosody.scores) {
                        const scores = data.models.prosody.scores;
                        console.log('[Hume Voice] Prosody scores extracted:', {
                            Anxiety: scores.Anxiety,
                            Sadness: scores.Sadness,
                            all_scores: Object.keys(scores)
                        });
                        
                        setProsodyScores({
                            anxiety: scores.Anxiety || 0.1,
                            isolation: scores.Sadness || 0.1
                        });
                    } else {
                        console.log('[Hume Voice] Message data structure:', Object.keys(data));
                    }
                } catch (e) {
                    console.error('[Hume Voice] Error parsing WebSocket message:', e, event.data);
                }
            };
            
            ws.onerror = (error) => {
                console.error('[Hume Voice] WebSocket error:', error);
            };
            
            ws.onclose = (event) => {
                console.log('[Hume Voice] WebSocket closed:', { code: event.code, reason: event.reason, wasClean: event.wasClean });
            };
            setSocket(ws);
        } catch (e) {
            console.error(e);
            setStatus('error');
            setErrorMessage(e.message || "Connection error. Please check Hume AI credentials configuration.");
        }
    };

    const initAudio = async (ws) => {
        console.log('[Hume Voice] Initializing audio capture');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('[Hume Voice] Audio stream obtained:', {
                active: stream.active,
                id: stream.id,
                tracks: stream.getAudioTracks().length
            });
            
            // Create new AudioContext if one doesn't exist or is closed
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new AudioContext();
                console.log('[Hume Voice] AudioContext created:', {
                    state: audioContextRef.current.state,
                    sampleRate: audioContextRef.current.sampleRate
                });
            }
            
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            
            // Note: ScriptProcessorNode is deprecated but still functional
            // For production, consider migrating to AudioWorkletNode
            processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            console.log('[Hume Voice] ScriptProcessorNode created (deprecated but functional)');
            
            let audioChunkCount = 0;
            processorRef.current.onaudioprocess = (e) => {
                if (ws.readyState === WebSocket.OPEN) {
                    const inputData = e.inputBuffer.getChannelData(0);
                    
                    if (audioChunkCount % 50 === 0) { // Log every 50 chunks (~1 second)
                        console.log('[Hume Voice] Sending audio chunk:', {
                            chunk_number: audioChunkCount,
                            samples: inputData.length,
                            sample_rate: audioContextRef.current.sampleRate
                        });
                    }
                    audioChunkCount++;

                    // Convert Float32 to Int16 PCM
                    const buffer = new ArrayBuffer(inputData.length * 2);
                    const view = new DataView(buffer);
                    for (let i = 0; i < inputData.length; i++) {
                        // Clamp to [-1, 1]
                        let s = Math.max(-1, Math.min(1, inputData[i]));
                        // Scale to 16-bit integer range
                        s = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        view.setInt16(i * 2, s, true); // Little endian
                    }

                    // Convert to Base64
                    const base64Audio = btoa(
                        new Uint8Array(buffer)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );

                    // Send to Hume
                    ws.send(JSON.stringify({
                        type: "audio_input",
                        data: base64Audio
                    }));
                }
            };
        sourceRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);
        } catch (e) {
            console.error('[Hume Voice] Error initializing audio:', e);
            setStatus('error');
            setErrorMessage(`Audio initialization failed: ${e.message}`);
        }
    };

    const startSpeechRecognition = () => {
        // Use Web Speech API as fallback to capture transcript
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    console.log('[Hume Voice] Speech recognition final transcript:', finalTranscript);
                    setTranscript(prev => prev ? `${prev} ${finalTranscript.trim()}` : finalTranscript.trim());
                }
            };

            recognition.onerror = (event) => {
                console.warn('[Hume Voice] Speech recognition error:', event.error);
                // Don't fail the whole recording if speech recognition fails
            };

            recognition.onend = () => {
                // Restart if still recording
                if (isRecording && recognitionRef.current) {
                    try {
                        recognition.start();
                    } catch (e) {
                        console.warn('[Hume Voice] Speech recognition restart failed:', e);
                    }
                }
            };

            recognition.start();
            recognitionRef.current = recognition;
            console.log('[Hume Voice] Speech recognition started');
        } else {
            console.warn('[Hume Voice] Web Speech API not supported, transcript capture may be limited');
        }
    };

    const stopRecording = async () => {
        console.log('[Hume Voice] Stopping recording...');
        
        try {
            if (processorRef.current) {
                processorRef.current.disconnect();
                processorRef.current = null;
            }
        } catch (e) {
            console.warn('[Hume Voice] Error disconnecting processor:', e);
        }
        
        try {
            if (sourceRef.current) {
                sourceRef.current.disconnect();
                sourceRef.current = null;
            }
        } catch (e) {
            console.warn('[Hume Voice] Error disconnecting source:', e);
        }
        
        try {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().then(() => {
                    console.log('[Hume Voice] AudioContext closed successfully');
                }).catch((e) => {
                    console.warn('[Hume Voice] Error closing AudioContext:', e);
                });
            } else {
                console.log('[Hume Voice] AudioContext already closed or not initialized');
            }
        } catch (e) {
            console.warn('[Hume Voice] Error in AudioContext cleanup:', e);
        }
        
        if (socket) {
            console.log('[Hume Voice] Closing WebSocket');
            socket.close();
        }

        setIsRecording(false);
        setStatus('analyzing');
        setIsAnalyzing(true);

        // Stop speech recognition
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        // Analyze transcript with Together API
        if (transcript && transcript.trim().length > 0) {
            try {
                console.log('[Hume Voice] Sending transcript to Together API:', transcript.substring(0, 100));
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${BACKEND_URL}/analyze_transcript`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ transcript: transcript.trim() })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to analyze transcript');
                }

                const analysisData = await response.json();
                console.log('[Hume Voice] Transcript analysis received:', analysisData);
                
                const ratings = analysisData.analysis || {};
                setTranscriptRatings(ratings);

                // Combine prosody scores with transcript ratings
                const combinedData = {
                    prosody: prosodyScores,
                    transcript: transcript,
                    ratings: ratings
                };

                if (onAnalysisComplete) {
                    console.log('[Hume Voice] Final combined data:', combinedData);
                    onAnalysisComplete(combinedData);
                }
            } catch (e) {
                console.error('[Hume Voice] Error analyzing transcript:', e);
                setErrorMessage(`Transcript analysis failed: ${e.message}`);
                // Still pass prosody scores even if transcript analysis fails
                if (onAnalysisComplete) {
                    onAnalysisComplete({
                        prosody: prosodyScores,
                        transcript: transcript,
                        ratings: null,
                        error: e.message
                    });
                }
            }
        } else {
            console.warn('[Hume Voice] No transcript captured, only sending prosody scores');
            if (onAnalysisComplete) {
                onAnalysisComplete({
                    prosody: prosodyScores,
                    transcript: '',
                    ratings: null
                });
            }
        }

        setIsAnalyzing(false);
        setStatus('done');
    };

    return (
        <div className="flex flex-col items-center">
            {status === 'error' && (
                <div className="text-red-500 text-sm mb-2 text-center max-w-md">
                    <div className="font-semibold">Connection Error</div>
                    {errorMessage && <div className="text-xs mt-1 opacity-90">{errorMessage}</div>}
                </div>
            )}

            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all font-bold shadow-md ${isRecording
                    ? 'bg-red-500 animate-pulse text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
            >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-blue-600" />}
                {isRecording ? "Stop Recording (Finish Survey)" : "Start Microphone"}
            </button>

            {isRecording && (
                <div className="mt-4 flex gap-4 text-xs font-mono text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                    <div>Anxiety: {(prosodyScores.anxiety * 100).toFixed(0)}%</div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div>Isolation: {(prosodyScores.isolation * 100).toFixed(0)}%</div>
                </div>
            )}

            {isAnalyzing && (
                <div className="mt-4 text-sm text-blue-600 font-medium">
                    Analyzing transcript with AI...
                </div>
            )}

            {status === 'done' && transcriptRatings && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md">
                    <div className="text-sm font-semibold text-green-800 mb-2">Extracted Ratings:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {transcriptRatings.sleep && (
                            <div className="text-slate-700">
                                <span className="font-medium">Sleep:</span> {transcriptRatings.sleep}/10
                            </div>
                        )}
                        {transcriptRatings.anxiety && (
                            <div className="text-slate-700">
                                <span className="font-medium">Anxiety:</span> {transcriptRatings.anxiety}/10
                            </div>
                        )}
                        {transcriptRatings.academic && (
                            <div className="text-slate-700">
                                <span className="font-medium">Academic:</span> {transcriptRatings.academic}/10
                            </div>
                        )}
                        {transcriptRatings.diet && (
                            <div className="text-slate-700">
                                <span className="font-medium">Diet:</span> {transcriptRatings.diet}/10
                            </div>
                        )}
                        {transcriptRatings.social && (
                            <div className="text-slate-700">
                                <span className="font-medium">Social:</span> {transcriptRatings.social}/10
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
